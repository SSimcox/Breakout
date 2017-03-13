/**
 * Created by Steven on 3/7/2017.
 */

window.onload = function () {
  /*************************************************
   * Environment Variables
   *************************************************/
  var width = 600
  var height = 700
  var brickHeight = 20
  var paddleWidth = width / 5
  var Graphics = require('./Graphics')
  var InputMap = require('./Input')
  var Random = require('./Random')
  var Model = require('./GenerateObjects')({
    width: width,
    height: height,
    brickHeight: brickHeight,
    paddleWidth: paddleWidth
  })


  var Breakout = (function () {
    var that = {}
    /*************************************************
     *Game Objects and Variables
     *************************************************/
    var previousTime
    var totalGameTime
    var timeBeforeStart
    var gameRunning = false
    var gameOver = false
    var gameObjects = {}
    var score = 0;
    var currentRoundScore = 0
    var scoreArray = [5, 5, 3, 3, 2, 2, 1, 1]
    var currentRoundHits = 0
    var fullSize = true

    /*************************************************
     * Game Functions
     *************************************************/
    that.initialize = function () {
      window.addEventListener('keyup', function (event) {
        InputMap.onKeyup(event);
      }, false);
      window.addEventListener('keydown', function (event) {
        InputMap.onKeydown(event);
      }, false);
      Graphics.initialize(width, height)
      initializeObjects()
      previousTime = performance.now()
      requestAnimationFrame(gameLoop)
    }

    function initializeObjects() {
      totalGameTime = 0
      timeBeforeStart = 3000
      gameRunning = false
      gameObjects = {}
      gameObjects.Background = Model.Background()
      gameObjects.Scoreboard = Model.Scoreboard()
      gameObjects.PlayingBoard = Model.PlayingBoard()
      gameObjects.Paddle = Model.Paddle()
      gameObjects.Balls = {
        balls: [Model.Ball()],
        draw: function () {
          for (let i = 0; i < gameObjects.Balls.balls.length; i++) {
            gameObjects.Balls.balls[i].draw()
          }
        }
      }
      gameObjects.Banner = Model.Banner()
    }

    function newLife() {
      gameObjects.Paddle = Model.Paddle()
      gameObjects.Balls.balls = [Model.Ball()]
      gameObjects.Banner = Model.Banner()
      timeBeforeStart = 3000
      currentRoundHits = 0
      currentRoundScore = 0
      fullSize = true
      gameObjects.Paddle.toggleSize(true)
    }

    function gameLoop(currentTime) {
      update(currentTime)
      render()
      previousTime = currentTime
      requestAnimationFrame(gameLoop)
    }

    function update(currentTime) {
      var elapsedTime = currentTime - previousTime
      if (gameRunning) {
        gameObjects.Paddle.update(elapsedTime)
        for (let i = 0; i < gameObjects.Balls.balls.length; i++) {
          gameObjects.Balls.balls[i].update(elapsedTime)
          if (!detectAllCollisions(gameObjects.Balls.balls[i])) {
            if (gameObjects.Balls.balls.length == 1) {
              gameRunning = false
              gameObjects.Scoreboard.lives.lives.pop()
              if(gameObjects.Scoreboard.lives.lives.length == 0)
              {
                gameOver = true
              }
            }
            else {
              gameObjects.Balls.balls.splice(i, 1)
              i--
            }
          }
        }
        if(gameObjects.PlayingBoard.rows.length == 0){
          gameOver = true
          gameRunning = false
        }

        totalGameTime += elapsedTime
        var timeString = Math.floor(totalGameTime / 1000 / 60) + ":"
        if (Math.floor(totalGameTime / 1000) % 60 < 10) {
          timeString += "0"
        }
        timeString += Math.floor(totalGameTime / 1000) % 60
        gameObjects.Scoreboard.time.setText(timeString)
        var scoreString = ""
        if(score < 100) scoreString += "0"
        if(score < 10) scoreString += "0"
        scoreString += score
        gameObjects.Scoreboard.score.setText(scoreString)
        if(!gameRunning || gameOver){
          if(!gameOver && gameObjects.Scoreboard.lives.lives.length > 0) {
            newLife()
          }
          else{
            gameDone()
          }
        }
      }
      else if(!gameOver){
        timeBeforeStart -= elapsedTime
        gameObjects.Banner.text.setText(Math.ceil(timeBeforeStart / 1000))
        if (timeBeforeStart < 0) {
          delete gameObjects.Banner
          gameRunning = true
        }
      }
    }

    function render() {
      Graphics.clear()
      for (let key in gameObjects) {
        gameObjects[key].draw()
      }
    }

    function detectAllCollisions(ball) {
      var cont = true
      for (let i = 0; i < gameObjects.PlayingBoard.rows.length && cont; i++) {
        for (let j = 0; j < gameObjects.PlayingBoard.rows[i].bricks.length && cont; j++) {
          if (detectCollision(ball, gameObjects.PlayingBoard.rows[i].bricks[j])) {
            score += scoreArray[gameObjects.PlayingBoard.rows[i].bricks[j].model.row]
            currentRoundScore += scoreArray[gameObjects.PlayingBoard.rows[i].bricks[j].model.row]
            currentRoundHits++
            if(fullSize && (gameObjects.PlayingBoard.rows[i].bricks[j].model.row == 0 || gameObjects.PlayingBoard.rows[i].bricks[j].model.row == 1)){
              fullsize = !fullSize
              gameObjects.Paddle.toggleSize(false)
            }
            gameObjects.PlayingBoard.rows[i].bricks.splice(j, 1)
            j--
            cont = false
            switch (currentRoundHits) {
              case 4:
                ball.setSpeed(5 * width / 8);
                break;
              case 12:
                ball.setSpeed(7 * width / 8);
                break;
              case 36:
                ball.setSpeed(10 * width / 8);
                break;
              case 62:
                ball.setSpeed(12 * width / 8);
                break;
              default:
                break;
            }
          }
        }
        if (gameObjects.PlayingBoard.rows[i].bricks.length == 0) {
          score += 25
          gameObjects.PlayingBoard.rows.splice(i, 1)
          i--
        }
      }

      detectPaddleCollision(ball, gameObjects.Paddle)
      return detectWallCollision(ball)
    }

    function detectWallCollision(ball) {
      // Ceiling
      if (ball.center.y - ball.radius < 100) {
        ball.setPosition(ball.center.x, 100 + ball.radius, ball.direction.x, -1 * ball.direction.y)
      }
      // Left Wall
      if (ball.center.x - ball.radius < 0) {
        ball.setPosition(ball.radius, ball.center.y, -1 * ball.direction.x, ball.direction.y)
      }
      // Right Wall
      if (ball.center.x + ball.radius > width) {
        ball.setPosition(width - ball.radius, ball.center.y, -1 * ball.direction.x, ball.direction.y)
      }
      if (ball.center.y + ball.radius > height) {
        //Real Code
        ball.setPosition(ball.center.x, height - ball.center.y, 0, 0)
        return false

        // For Debugging
        // ball.setPosition(ball.center.x, height - ball.radius, ball.direction.x, -1 * ball.direction.y)
      }
      return true
    }

    function detectCollision(ball, rec) {
      if (ball.center.y - ball.radius > rec.model.pos.y + rec.model.height) return false
      if (ball.center.y + ball.radius < rec.model.pos.y) return false
      if (ball.center.x - ball.radius > rec.model.pos.x + rec.model.width) return false
      if (ball.center.x + ball.radius < rec.model.pos.x) return false

      var topDistance = Math.abs(ball.center.y - rec.model.pos.y)
      var bottomDistance = Math.abs(ball.center.y - (rec.model.pos.y + rec.model.height))
      var leftDistance = Math.abs(ball.center.x - rec.model.pos.x)
      var rightDistance = Math.abs(ball.center.x - (rec.model.pos.x + rec.model.width))

      // Coming into left wall
      if (ball.direction.x > 0) {
        // Coming into top wall
        if (ball.direction.y > 0) {
          if (topDistance < leftDistance) {
            ball.setPosition(ball.center.x, rec.model.pos.y - ball.radius, ball.direction.x, -1 * ball.direction.y)
          }
          else if (leftDistance < topDistance) {
            ball.setPosition(rec.model.pos.x - ball.radius, ball.center.y, -1 * ball.direction.x, ball.direction.y)
          }
          else {
            ball.setPosition(rec.model.pos.x - (ball.radius * 4 * Math.SQRT2), rec.model.pos.y - (ball.radius * 4 * Math.SQRT2), -1 * ball.direction.x, -1 * ball.direction.y)
          }
        }
        // Coming into bottom wall
        else {
          if (bottomDistance < leftDistance) {
            ball.setPosition(ball.center.x, rec.model.pos.y + rec.model.height + ball.radius, ball.direction.x, -1 * ball.direction.y)
          }
          else if (leftDistance < bottomDistance) {
            ball.setPosition(rec.model.pos.x - ball.radius, ball.center.y, -1 * ball.direction.x, ball.direction.y)
          }
          else {
            ball.setPosition(rec.model.pos.x - (ball.radius * 4 * Math.SQRT2), rec.model.pos.y + rec.model.height + (ball.radius * 4 * Math.SQRT2), -1 * ball.direction.x, -1 * ball.direction.y)
          }
        }
      }
      // Coming into right wall
      else {
        // Coming into top wall
        if (ball.direction.y > 0) {
          if (topDistance < rightDistance) {
            ball.setPosition(ball.center.x, rec.model.pos.y - ball.radius, ball.direction.x, -1 * ball.direction.y)
          }
          else if (rightDistance < topDistance) {
            ball.setPosition(rec.model.pos.x + rec.model.width + ball.radius, ball.center.y, -1 * ball.direction.x, ball.direction.y)
          }
          else {
            ball.setPosition(rec.model.pos.x + rec.model.width + (ball.radius * 4 * Math.SQRT2), rec.model.pos.y - (ball.radius * 4 * Math.SQRT2), -1 * ball.direction.x, -1 * ball.direction.y)
          }
        }
        // Coming into bottom wall
        else {
          if (bottomDistance < rightDistance) {
            ball.setPosition(ball.center.x, rec.model.pos.y + rec.model.height + ball.radius, ball.direction.x, -1 * ball.direction.y)
          }
          else if (rightDistance < bottomDistance) {
            ball.setPosition(rec.model.pos.x + rec.model.width + ball.radius, ball.center.y, -1 * ball.direction.x, ball.direction.y)
          }
          else {
            ball.setPosition(rec.model.pos.x + rec.model.width + (ball.radius * 4 * Math.SQRT2), rec.model.pos.y + rec.model.height + (ball.radius * 4 * Math.SQRT2), -1 * ball.direction.x, -1 * ball.direction.y)
          }
        }
      }
      return true
    }

    function detectPaddleCollision(ball, paddle){
      if (ball.center.y - ball.radius > paddle.pos.y + paddle.height) return false
      if (ball.center.y + ball.radius < paddle.pos.y) return false
      if (ball.center.x - ball.radius > paddle.pos.x + paddle.width) return false
      if (ball.center.x + ball.radius < paddle.pos.x) return false

      var distance = (paddle.width / 2) - Math.abs(ball.center.x - (paddle.pos.x + paddle.width / 2))
      var radians = (Math.PI / 3) * distance / (paddle.width / 2) + (Math.PI / 6)
      var direction = {x: Math.cos(radians), y: -1 * Math.sin(radians)}
      Model.normalize(direction)
      if(ball.center.x < (paddle.pos.x + paddle.width/2)){
        direction.x *= -1
      }
      ball.direction = direction
    }

    function gameDone(){
      delete gameObjects.Balls
      setTimeout(function(){
        var name = prompt("You scored " + score + " in " + Math.floor(totalGameTime/1000) + " seconds\nEnter your name!")
        console.log(name)
      },2000)
    }

    return that
  }())

  Breakout.initialize()
}