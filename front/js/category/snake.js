const canvas = document.getElementById("game-board")
const ctx = canvas.getContext("2d")
const scale = 20
const rows = canvas.height / scale
const columns = canvas.width / scale
let score = 0

let snake
let fruit
let gameInterval

(function setup(){
  snake = new Snake()
  fruit = new Fruit()

  fruit.pickLocation()
}())

// 방향 상수 정의
const DIRECTIONS = {
  Up: { x: 0, y: -scale },
  Down: { x: 0, y: scale },
  Left: { x: -scale, y: 0 },
  Right: { x: scale, y: 0 },
}

//게임 시작
function startGame(){
  if(!gameInterval){
    gameInterval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      fruit.draw()
      snake.update()
      snake.draw()

      if(snake.eat(fruit)){
        score++
        document.getElementById("score").textContent = score
        fruit.pickLocation()
      }

      snake.checkCollision()
    }, 250)
  }
}

//게임 정지
function stopGame(){
  clearInterval(gameInterval)
  gameInterval = null
}

//게임 끝났을때
function gameOver(){
  swal(`게임 오버! 점수: ${score}`, '', 'info')
  snake.reset()
  stopGame()
}

//snake 생성
function Snake(){
  this.x = 0
  this.y = 0
  this.xSpeed = scale
  this.ySpeed = 0
  this.tail = []

  //snake 스타일
  this.draw = function(){
    ctx.fillStyle = "#4CAF50"

    for(let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale)
    }

    ctx.fillRect(this.x, this.y, scale, scale)
  }

  //움직일때마다 업데이트
  this.update = function(){
    for(let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1]
    }

    this.tail[this.tail.length - 1] = { x: this.x, y: this.y }

    this.x += this.xSpeed
    this.y += this.ySpeed

    if(this.x < 0 || this.y < 0 || this.x >= canvas.width || this.y >= canvas.height){
      gameOver()
    }
  }

  //위치 변화
  this.changeDirection = function(direction){
    switch(direction){
      case "Up":
        this.xSpeed = 0
        this.ySpeed = -scale
        break
      case "Down":
        this.xSpeed = 0
        this.ySpeed = scale
        break
      case "Left":
        this.xSpeed = -scale
        this.ySpeed = 0
        break
      case "Right":
        this.xSpeed = scale
        this.ySpeed = 0
        break
    }
  }

  //snake 가 fruit 에 닿았을때
  this.eat = function(fruit){
    if(this.x === fruit.x && this.y === fruit.y){
      this.tail.push({ x: this.x - this.xSpeed, y: this.y - this.ySpeed })
      return true
    }
    return false
  }

  //머리가 몸통이나 꼬리에 닿았을때
  this.checkCollision = function(){
    for (let i = 0; i < this.tail.length; i++){
      if (this.x === this.tail[i].x && this.y === this.tail[i].y){
        gameOver()
      }
    }
  }

  //초기화
  this.reset = function(){
    this.x = 0
    this.y = 0
    this.tail = []
    this.xSpeed = scale
    this.ySpeed = 0
    score = 0
    document.getElementById("score").textContent = score
  }
}

//fruit 생성
function Fruit(){
  this.x = 0
  this.y = 0

  this.pickLocation = function(){
    this.x = Math.floor(Math.random() * columns) * scale
    this.y = Math.floor(Math.random() * rows) * scale
  }

  //fruit 스타일
  this.draw = function(){
    ctx.fillStyle = "#FF4136"
    ctx.fillRect(this.x, this.y, scale, scale)
  }
}

//키보드 위치에 따라서
window.addEventListener("keydown", (event) => {
  const direction = event.key.replace("Arrow", "")
  snake.changeDirection(direction)
})

// 모바일 터치 관련 변수
let touchStartX = 0
let touchStartY = 0

// 모바일 터치 시작 위치 저장
canvas.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX
  touchStartY = event.touches[0].clientY
})

// 모바일 터치 이동 방향에 따라 방향 변경
canvas.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].clientX
  const touchEndY = event.changedTouches[0].clientY

  const deltaX = touchEndX - touchStartX
  const deltaY = touchEndY - touchStartY

  let direction

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    direction = deltaX > 0 ? "Right" : "Left"
  } else {
    direction = deltaY > 0 ? "Down" : "Up"
  }

  snake.changeDirection(direction)
})

document.getElementById("start-btn").addEventListener("click", startGame)
document.getElementById("stop-btn").addEventListener("click", stopGame)