document.addEventListener('DOMContentLoaded', function(){
    const quizList = document.getElementById('quiz-list')
    const quizDetail = document.getElementById('quiz-detail')
    const backButton = document.querySelector('.back-to-list')
    const submitButton = document.querySelector('.submit-quiz')
    
    let currentQuizIndex = 0 // 현재 퀴즈 인덱스를 저장

    // 퀴즈 목록 데이터
    const quizzes = [
    {
        title: '역사 퀴즈',
        questions:[
            {
                question: '고려시대의 수도는 어디인가요?',
                options: ['서울', '경주', '강릉', '가야'],
                answer: 0
            },
            {
                question: '세종대왕이 창제한 한글의 원래 이름은 무엇인가요?',
                options: ['훈민정음', '훈민한글', '옛글', '고대한글'],
                answer: 0
            },
            {
                question: '우리나라의 최초 국가는?',
                options: ['조선', '발해', '고조선', '통일신라'],
                answer: 2
            },
            {
                question: '화랑도 정신인 세속 오계를 지은 사람은?',
                options: ['삼장법사', '주지법사', '원양법사', '원광법사'],
                answer: 3
            },
            {
                question: '이순신 장군이 적선을 한산도 앞 넓은 바다로 유인하여 학익진 전법으로 크게 무찔러 승리한 싸움은?',
                options: ['명량해전', '한산도대첩', '노량해전', '율포해전'],
                answer: 1
            }
        ]
    },
    {
        title: '과학 퀴즈',
        questions:[
            {
                question: '물이 끓는 온도는 몇 도인가요?',
                options: ['0도', '50도', '100도', '150도'],
                answer: 2
            },
            {
                question: '태양계에서 가장 큰 행성은 어느 행성인가요?',
                options: ['지구', '화성', '목성', '토성'],
                answer: 2
            },
            {
                question: '다음 중 배꼽이 없는 동물은?',
                options: ['사자', '원숭이', '곰', '개구리'],
                answer: 3
            },
            {
                question: '다음 중 대체 에너지로 쓸 수 있는 빛은 어느 것 일까요?',
                options: ['달빛', '햇빛', '별빛', '반딧불빛'],
                answer: 1
            },
            {
                question: '유리를 만드는 재료는 무엇일까요?',
                options: ['모래', '물', '돌멩이', '소금'],
                answer: 0
            }
        ]
    },
    {
        title: '기본 상식',
        questions:[
            {
                question: `다음 중 '동계올림픽'의 종목이 아닌것은?`,
                options: ['스키점프', '트라이애슬론', '스켈레톤', '노르딕 복합'],
                answer: 1
            },
            {
                question: '대한민국 최초의 우주비행사는?',
                options: ['지소연', '김소연', '이소연', '최소연'],
                answer: 2
            },
            {
                question: '5천원권 지폐에 있는 과일은?',
                options: ['복숭아', '배', '포도', '수박'],
                answer: 3
            },
            {
                question: `'물티슈'의 영어표기로 알맞는 것은?`,
                options: ['water tissue', 'hand tissue', 'wet tissue', 'wash tissue'],
                answer: 2
            },
            {
                question: '국가의 3요소가 아닌 것은?',
                options: ['영토', '군주', '주권', '국민'],
                answer: 1
            }
        ]
    },
    {
        title: '일반 상식',
        questions:[
            {
                question: `신조어 'TMI'에서 'I'가 의미하는 것은?`,
                options: ['정보', '인터넷', '호기심', '면접'],
                answer: 0
            },
            {
                question: '다음 중 외래어가 아닌 우리말은?',
                options: ['백신', '과자', '사이비', '개미'],
                answer: 3
            },
            {
                question: '다음 중 뿌리식물(채소)이 아닌것은?',
                options: ['감자', '땅콩', '우엉', '생강'],
                answer: 1
            },
            {
                question: '세계에서 가장 작은 나라는?',
                options: ['괌', '마셸제도', '바티칸', '몰디브'],
                answer: 2
            },
            {
                question: `'삼권분립'에 해당되지 않은 것은?`,
                options: ['입법부', '사법부', '행정부', '교육부'],
                answer: 3
            }
        ]
    }    
    ]

    //퀴즈 카드 생성
    function createQuizCard(quiz, index){
        const card = document.createElement('div')
        card.className ='quiz-card'
        card.innerHTML = `<h3>${quiz.title}</h3>`
        card.addEventListener('click', () => showQuizDetail(index))
        return card
    }

    //퀴즈 질문생성
    function createQuizQuestion(question, index){
        const questionElement = document.createElement('div')
        questionElement.className = 'quiz-question'
        questionElement.innerHTML = `<h4>Q${index + 1}: ${question.question}</h4>`

        const optionsElement = document.createElement('div')
        optionsElement.className = 'quiz-options'
    
        question.options.forEach((option, i) => {
        const optionElement = document.createElement('label')
        optionElement.innerHTML = `
            <input type="radio" name="question-${index}" value="${i}">
            <span>${option}</span>`
        optionsElement.appendChild(optionElement)
    })

        questionElement.appendChild(optionsElement)
        return questionElement
    }

    //퀴즈 문제 나올때
    function showQuizDetail(index) {
      currentQuizIndex = index // 현재 퀴즈 인덱스를 저장
        quizList.style.display = 'none'
        quizDetail.style.display = 'block'

        const quiz = quizzes[index]
        document.querySelector('.quiz-title').textContent = quiz.title
    
        const quizQuestions = document.querySelector('.quiz-questions')
        quizQuestions.innerHTML = ''
    
        quiz.questions.forEach((question, i) => {
        const questionElement = createQuizQuestion(question, i)
        quizQuestions.appendChild(questionElement)
        })
    }
    
    //퀴즈 문제 나올때 화면 전환
    function hideQuizDetail() {
        quizDetail.style.display = 'none'
        quizList.style.display = 'block'
    }

    //퀴즈 정답 계산
    function calculateQuizResult() {
      const quiz = quizzes[currentQuizIndex] // 현재 퀴즈에 대한 정보를 가져옴
        let correctAnswers = 0

        quiz.questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name = "question-${index}"]:checked`)
        if (selectedOption && parseInt(selectedOption.value) === question.answer){
            correctAnswers++
            console.log(selectedOption)
        }
    })

    return{
        totalQuestions: quiz.questions.length,
        correctAnswers: correctAnswers
        }
    }

    //퀴즈 정답 결과
    function showQuizResult(result){
        const resultMessage = `정답 수: ${result.correctAnswers} / ${result.totalQuestions}`
        swal(resultMessage, '', 'info')
    }

    // 퀴즈 목록을 생성하고 페이지에 삽입
    for(const [index, quiz] of quizzes.entries()){
        const card = createQuizCard(quiz, index)
        quizList.querySelector('.row').appendChild(card)
    }

    backButton.addEventListener('click', hideQuizDetail)
    submitButton.addEventListener('click', () => {
        const result = calculateQuizResult()
        showQuizResult(result)
    })
})