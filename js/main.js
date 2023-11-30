const popupBudget = document.querySelector('.budget')
const popupCheck = document.querySelector('.checklist')
const popupTimer = document.querySelector('.timer')
const popupGame1 = document.querySelector('.game1')
const popupGame2 = document.querySelector('.game2')
const popupQuiz = document.querySelector('.quiz')
const popuplotto = document.querySelector('.lotto')
const logoutBtn = document.querySelector('.logoutBtn')

// 이벤트 핸들러 함수
function openPopup(e){
    e.preventDefault() // 기본 링크 동작 막기
    // 팝업 창 크기 계산
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let popupWidth, popupHeight
    if(screenWidth >= 1000){
        popupWidth = 700
        popupHeight = 800
    }else if(screenWidth >= 800){
        popupWidth = 600
        popupHeight = 700
    }else if(screenWidth >= 600){
        popupWidth = 400
        popupHeight = 500
    }else{
        popupWidth = 300
        popupHeight = 400
    }
    
     // 팝업 창 열기
    window.open(this.href, '_blank', `width=${popupWidth}, height=${popupHeight}, left=100, top=100`)
}
// 링크 요소를 가져와서 클릭 이벤트에 핸들러 추가
popupBudget.addEventListener('click', openPopup)
popupTimer.addEventListener('click', openPopup)
popupCheck.addEventListener('click', openPopup)
popupGame1.addEventListener('click', openPopup)
popupGame2.addEventListener('click', openPopup)
popupQuiz.addEventListener('click', openPopup)
popuplotto.addEventListener('click', openPopup)

//로그아웃 클릭시 페이지 이동
logoutBtn.addEventListener('click', function(e){
    e.preventDefault()

    // 페이지 이동 후 방문 기록이 남지 않도록 처리
    window.location.replace('../index.html')
})

