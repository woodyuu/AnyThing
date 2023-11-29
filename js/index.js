const createBtn = document.querySelector('.createBtn')
const registerBtn = document.querySelector('.registerBtn')
const register = document.querySelector('.register')
const backBg = document.querySelector('.back')
const closeBtn = document.querySelector('.closebtn')
const loginBtn = document.querySelector('.login-btn')
const idCheck = document.querySelector('.idcheck')
const inputs = document.querySelectorAll('.info input, .date-box input')
const searchID = document.querySelector('.searchID')
const resetPWBtn = document.querySelector('.searchPW')    

// 계정 생성하기
registerBtn.addEventListener('click', function(){
    register.classList.remove('close') 
    backBg.classList.remove('close')        
})

// 계정 생성창 닫기
closeBtn.addEventListener('click', function(){
    register.classList.add('close') 
    backBg.classList.add('close')   
})

// 계정 생성-서버연결
createBtn.addEventListener('click', function(e){
    e.preventDefault()
    if(validateDateInputs()){
        userInfo()
    }    
})

// 사용자 정보 검사 - 회원가입
function userInfo(){
    const name = document.querySelector('.username')
    const id = document.querySelector('.userid')
    const email = document.querySelector('.useremail')    
    const pw = document.querySelector('.userpw')
    const pw2 = document.querySelector('.userpw2')
    const year = document.querySelector('.year')
    const month = document.querySelector('.month')
    const date = document.querySelector('.date')
    const gender = document.querySelectorAll('.genderCoise label input')
    
    checking(name, '닉네임을 입력하세요.')
    checking(id, '아이디를 입력하세요.')    
    checking(pw, '비밀번호를 입력해주세요.')
    checking(pw2, '다시 비밀번호를 입력하세요.')
    checking(email, '이메일를 입력하세요.')       
    
    const selectedYear = year.value
    const selectedMonth = month.value
    const selectedDate = date.value 
    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

    if(pw.value !== pw2.value){
        swal('비밀번호가 일치하지 않습니다.', '', 'error')
    }else if(!selectedYear || !selectedMonth || !selectedDate){
        swal('생년월일을 입력해주세요.', '', 'error')
    }else if(!emailPattern.test(email.value)){
        swal('올바른 이메일 형식이 아닙니다.', '', 'error')
    }else{
        fetch('http://127.0.0.1:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userID: id.value,
                name: name.value,
                email: email.value,
                PW: pw.value,
                birth: `${selectedYear}년 ${selectedMonth}월 ${selectedDate}일`,
                gender: gender.value,                
            })
        })
            .then(response => response.json())
            .then(data => {
                if(data.code === 401){
                    swal(`code:${data.code}, ${data.message}`, '', 'error')
                }else if(data.code === 200){
                    // alert(`code:${data.code}, ${data.message}`)
                    // 성공시 초기화                    
                    for(let input of inputs){
                        input.value = null
                    }
                    for(const genderInput of gender){ //성별 초기화
                        genderInput.checked = false
                    }
                    register.classList.add('close')
                }
            })
            .catch(e => console.log(e))
    }   

    let selectedGender = ''
    for(const genderInput of gender){
        if(genderInput.checked){
            selectedGender = genderInput.value
            break  // 첫 번째 선택된 값을 사용하고 루프 종료
        }
    }

    if(!selectedGender){
        swal('성별을 선택해주세요.', '', 'error')
        return
    }  
}

// 아이디 중복 체크
idCheck.addEventListener('click', function(e){
    e.preventDefault()
    const id = document.querySelector('.userid')
    if(id.value === ''){
        swal('아이디를 입력하세요.', '', 'error')
        return
    }else if(!/^[a-zA-Z0-9]+$/.test(id.value)){
        swal('아이디에는 영문자와 숫자만 입력 가능합니다.', '', 'error')
        return
    }

    fetch('http://127.0.0.1:5000/api/users/check-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userID: id.value,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if(data.code === 200) {
                swal('사용 가능한 아이디입니다.', '', 'success')
            }else{
                swal('이미 사용 중인 아이디입니다.', '', 'error')
            }
        })
        .catch(e => console.error(e))
})

// 생년월일 작성 제한
function validateDateInputs(){
    const year = document.querySelector('.year').value
    const month = document.querySelector('.month').value
    const date = document.querySelector('.date').value

    const currentYear = new Date().getFullYear()
    const minYear = 1940
    const maxYear = currentYear

    const minMonth = 1
    const maxMonth = 12

    const minDate = 1
    const maxDate = 31

    if(year < minYear || year > maxYear){
        swal('올바른 연도를 입력하세요.', '', 'error')
        return false
    }

    if (month < minMonth || month > maxMonth){
        swal('올바른 월을 입력하세요.' , '', 'error')
        return false
    }

    if(date < minDate || date > maxDate){
        swal('올바른 일을 입력하세요.', '', 'error')
        return false
    }

    return true
}

// 로그인
loginBtn.addEventListener('click', function(e){
    e.preventDefault()
    loginInfo()
})

//엔터키 눌렀을때 로그인 되기
document.addEventListener('DOMContentLoaded', function(){
    const userId = document.querySelector('.userID')
    const userPw = document.querySelector('.userPW')

    userId.addEventListener('keypress', function(event){
        if (event.key === 'Enter'){
            event.preventDefault()
            loginInfo()
        }
    })

    userPw.addEventListener('keypress', function(event){
        if (event.key === 'Enter'){
            event.preventDefault()
            loginInfo()
        }
    })
})

//로그인 할때
function loginInfo(){
    const userId = document.querySelector('.userID')
    const userPw = document.querySelector('.userPW') 
    
    if(userId.value.trim() === '' || userPw.value.trim() === ''){
        swal('아이디나 비밀번호가 입력되지 않았습니다.', '', 'error')
        return
    }    
    
    if(userId.value !== '' && userPw.value !== ''){
        fetch('http://127.0.0.1:5000/api/users/login', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userID: userId.value,
                PW: userPw.value
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.code === 401){
                swal(`code:${data.code}, ${data.message}`, '', 'error')
            }else if(data.code === 200){
                // alert(`code:${data.code}, ${data.message}`)                
                window.location.href = '/front/html/main.html'
            }else if(data.code === 400){
                swal('아이디나 비밀번호 중 다시 확인하세요.', '', 'error')
            }
        })
        .catch(e => console.error(e))
    }
}

//빈칸 체크
function checking(name, content){
    console.log(name.value)
    if(name.value.trim() === ''){
        swal(`${content}`, '', 'error')
    }
}

//아이디 찾기
searchID.addEventListener('click', function(e){
    e.preventDefault()
    swal({
        text: '이메일을 입력하세요.',
        content: 'input',
        button: {
            text: 'Search',
            closeModal: false,
        }
    })    
    .then((inputValue) => { 
        if(inputValue === '' || inputValue === null || inputValue.trim() === ''){
            swal('이메일을 입력해주세요.', '', 'warning')
            return
        } 
        
        const email = inputValue.trim()
        if(email !== ''){       
            fetch('http://127.0.0.1:5000/api/users/find-id', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200 && data.id) {
                    swal(`회원님의 아이디는 ${data.id} 입니다.`, '', 'success')
                } else {
                    swal('해당 이메일로 등록된 아이디가 없습니다.', '', 'error')
                }
            })
            .catch((e) => {
                console.error(e)
                swal('오류가 발생했습니다.', '', 'error')
            })        
        }
    })
})

//비밀번호찾기
resetPWBtn.addEventListener('click', function (e) {
    e.preventDefault()    
    swal({
        text: '아이디를 입력하세요.',
        content: 'input',
        button: {
            text: 'search',
            closeModal : false
        }
    })
    .then((inputValue) =>{
        if(inputValue === '' || inputValue === null || inputValue.trim() === ''){
            swal('아이디를 입력하세요.', '', 'warning')
            return
        }

        const id = inputValue.trim()
        if(id !== ''){
            fetch('http://127.0.0.1:5000/api/users/find-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userID: id })
            })
            .then(response => response.json())
            .then(data => {
                if(data.code === 200 && data.pw){
                    swal(`회원님의 비밀번호는${data.pw} 입니다.`, '', 'success')
                }else{
                    swal('아이디에 해당하는 비밀번호가 없습니다.', '', 'error')
                }
            })
            .catch(e => console.error(e))
        }
    })    
})