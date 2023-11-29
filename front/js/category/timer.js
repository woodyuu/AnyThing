let timer
let minutes = 25
let seconds = 0
let isRunning = false
let mode = 'pomodoro' 

const timerDisplay = document.querySelector(".timer-display")
const startButton = document.querySelector(".start")
const pauseButton = document.querySelector(".pause")
const resetButton = document.querySelector(".reset")
const timerModes = document.querySelectorAll(".timer-modes button")

function updateTimerDisplay(){
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

//타이머 시작
function startTimer() {
  if(!isRunning){
    timer = setInterval(() => {
      if(seconds === 0){
        if(minutes > 0){
          minutes--
          seconds = 59
        }else{
          clearInterval(timer)
          isRunning = false
          updateControlsState()
          swal('타이머가 종료되었습니다!', '', 'info')
          .then(() => {
            if(mode === 'pomodoro'){
              minutes = 25
            }else if(mode === 'short-break'){
              minutes = 5
            }else if(mode === 'long-break'){
              minutes = 15
            }

            seconds = 0
            updateTimerDisplay()
            updateControlsState()
          })
          return
        }
      }else{
        seconds--
      }
      updateTimerDisplay()
    }, 1000)
    isRunning = true
    updateControlsState()
  }
}

// 타이머 정지
function pauseTimer(){
  clearInterval(timer)
  isRunning = false
  startButton.disabled = isRunning    
  pauseButton.disabled = !isRunning
  resetButton.disabled = isRunning
}

//타이머 리셋
function resetTimer(){
  clearInterval(timer)
  isRunning = false

  if(mode === "pomodoro"){
    minutes = 25
  }else if(mode === "short-break"){
    minutes = 5
  }else if(mode === "long-break"){
    minutes = 15
  }
  
  seconds = 0
  updateTimerDisplay()
  updateControlsState()
}

//타이머 컨트롤 버튼 설정
function updateControlsState(){
  startButton.disabled = isRunning
  pauseButton.disabled = !isRunning
  resetButton.disabled = !isRunning
}

startButton.addEventListener("click", startTimer)
pauseButton.addEventListener("click", pauseTimer)
resetButton.addEventListener("click", resetTimer)

//타이머 모드 버튼 설정
timerModes.forEach((modeButton) => {
  modeButton.addEventListener("click", () => {
    clearInterval(timer)
    isRunning = false
    updateControlsState()

    if(modeButton.classList.contains("pomodoro")){
      mode = "pomodoro"
      minutes = 25
    }else if(modeButton.classList.contains("short-break")){
      mode = "short-break"
      minutes = 5
    }else if(modeButton.classList.contains("long-break")){
      mode = "long-break"
      minutes = 15
    }    
    seconds = 0 // 초를 초기화합니다.
    updateTimerDisplay()
  })
})

updateTimerDisplay()