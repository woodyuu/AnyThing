const rockBtn = document.getElementById('rock')
const scissorsBtn = document.getElementById('scissors')
const paperBtn = document.getElementById('paper')
const message = document.getElementById('message')

const choices = ['바위', '가위', '보']

rockBtn.addEventListener('click', () => playGame('바위'))
scissorsBtn.addEventListener('click', () => playGame('가위'))
paperBtn.addEventListener('click', () => playGame('보'))

//게임 경우의 수 생성
function playGame(playerChoice){
  const computerChoice = choices[Math.floor(Math.random() * choices.length)]
  
  if(playerChoice === computerChoice){
    message.textContent = `비겼습니다! 플레이어: ${playerChoice}, 상대방: ${computerChoice}`;
  }else if(
    (playerChoice === '바위' && computerChoice === '가위') ||
    (playerChoice === '가위' && computerChoice === '보') ||
    (playerChoice === '보' && computerChoice === '바위')
  ){
    message.textContent = `축하합니다! 플레이어가 이겼습니다! 플레이어: ${playerChoice}, 상대방: ${computerChoice}`
  }else{
    message.textContent = `아쉽네요! 플레이어가 졌습니다. 플레이어: ${playerChoice}, 상대방: ${computerChoice}`
  }
}