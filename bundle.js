(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Steven on 3/9/2017.
 */

var Graphics = require('./Graphics')
var Random = require('./Random')
var InputMap = require('./Input')

module.exports = function (spec) {

  /***************************************************
   * Generator Functions for the Objects in the game
   ***************************************************/
  function Background() {
    return Graphics.Rectangle({
      color: "rgb(60,94,94)",
      pos: {x: 0, y: 0},
      width: spec.width,
      height: spec.height,
      lineWidth: 5
    })
  }

  function Ball() {
    var direction = genNormalVector()
    var that = {
      center: {x: spec.width / 2, y: spec.height - 50},
      radius: 8,
      speed: spec.width / 2,
      direction: direction,
      view: Graphics.Circle({
        center: {x: spec.width / 2, y: spec.height - 50},
        radius: 8,
        color: "rgb(60,60,60)",
        speed: spec.width / 2,
        direction: direction
      }),
      draw: function () {
        this.view.draw()
      },
      setPosition: function (x, y, dx, dy) {
        this.center.x = x
        this.center.y = y
        this.direction.x = dx
        this.direction.y = dy
        this.view.setPosition(x, y, dx, dy)
      },
      setSpeed: function (speed) {
        this.speed = speed
        this.view.setSpeed(speed)
      },
      update: function (elapsedTime) {
        this.center.x += this.direction.x * this.speed * elapsedTime / 1000
        this.center.y += this.direction.y * this.speed * elapsedTime / 1000
        this.view.setPosition(this.center.x, this.center.y, this.direction.x, this.direction.y)
      }
    }
    return that;
  }

  function Banner() {
    return {
      banner: Graphics.Rectangle({
        color: "rgba(60,60,60,.9)",
        pos: {x: 0, y: spec.height / 2 - 50},
        width: spec.width,
        height: 100,
        lineWidth: 2
      }),
      text: Graphics.Text({
        font: "80px myFont",
        color: "rgb(200,200,30)",
        stroke: "rgb(200,200,30)",
        rotation: 0,
        pos: {x: spec.width / 2 + 8, y: spec.height / 2 - 50 + 25},
        // pos:{x: 0, y: 0},
        text: "1"
      }),
      draw: function () {
        this.banner.draw()
        this.text.draw()
      }
    }
  }

  function Paddle() {
    return {
      view: Graphics.Rectangle({
        color: "rgba(255,120,120,1)",
        pos: {x: spec.width / 2 - spec.paddleWidth / 2, y: spec.height - 42},
        width: spec.paddleWidth,
        height: 10,
        lineWidth: 2,
        speed: spec.width
      }),
        pos: {x: spec.width / 2 - spec.paddleWidth / 2, y: spec.height - 42},
        width: spec.paddleWidth,
        height: 10,
        speed: spec.width
      ,
      draw: function(){
        this.view.draw()
      },
      toggleSize: function(fullSize){
        if(!fullSize){
          this.width = spec.paddleWidth / 2
        }
        else{
          this.width = spec.paddleWidth
        }
        this.view.setWidth(this.width)
      },
      update: function(elapsedTime){
        if(InputMap.isDown(InputMap.LEFT)){
          this.pos.x -= this.speed * elapsedTime / 1000
          if(this.pos.x < 0){
            this.pos.x = 0
          }
          this.view.update(elapsedTime)
        }
        if(InputMap.isDown(InputMap.RIGHT)){
          this.pos.x += this.speed * elapsedTime / 1000
          if(this.pos.x + this.width > spec.width){
            this.pos.x = spec.width - this.width
          }
          this.view.update(elapsedTime,false)
        }
      }
    }
  }

  function PlayingBoard() {
    return {
      rows: generateRows(),
      draw: function () {
        for (let i = 0; i < this.rows.length; i++) {
          this.rows[i].draw()
        }
      }
    }
  }

  function Scoreboard() {
    return {
      board: Graphics.Rectangle({
        color: "rgb(120,188,188)",
        pos: {x: 0, y: 0},
        width: spec.width,
        height: 100,
        lineWidth: 5
      }),
      score: Graphics.Text({
        font: "54px myFont",
        color: "rgb(200,200,30)",
        stroke: "rgb(200,200,30)",
        rotation: 0,
        pos: {x: 45 + 8, y: 15 + 25},
        text: "000"
      }),
      time: Graphics.Text({
        font: "54px myFont",
        color: "rgb(200,200,30)",
        stroke: "rgb(200,200,30)",
        rotation: 0,
        pos: {x: spec.width / 2, y: 15 + 25},
        text: "0:00"
      }),
      lives: generateLives(),
      draw: function () {
        this.board.draw()
        this.score.draw()
        this.time.draw()
        this.lives.draw()
      }
    }
  }

  /*****************************************************
   * Helper Functions to assist the generator functions
   *****************************************************/
  function generateRows() {
    var colors = ["green", "blue", "orange", "yellow"]
    var rows = []
    for (let i = 0; i < 8; ++i) {
      rows.push(generateRow(colors[Math.floor(i / 2)], i))
    }
    return rows
  }

  function generateRow(color, rowPos) {
    var row = {}
    row.bricks = []
    for (let i = 0; i < 14; ++i) {
      let x = i * (spec.width / 14) + 2
      row.bricks.push({
        view: Graphics.Rectangle({
          color: color,
          pos: {x: x, y: 200 + rowPos * spec.brickHeight + 2},
          width: spec.width / 14 - 4,
          height: spec.brickHeight,
          lineWidth: 2
        }),
        model: {
          pos: {x: x, y: 200 + rowPos * spec.brickHeight + 2},
          width: spec.width / 14 - 4,
          height: spec.brickHeight,
          row: rowPos
        }
      })
    }
    row.draw = function () {
      for (let i = 0; i < row.bricks.length; i++) {
        row.bricks[i].view.draw()
      }
    }
    return row
  }

  function generateLives() {
    var that = {}
    that.lives = []
    for (let i = 0; i < 3; i++) {
      that.lives.push(Graphics.Rectangle({
        color: "rgba(255,120,120,1)",
        pos: {x: spec.width - spec.paddleWidth - 15, y: i * 20 + 30},
        width: spec.paddleWidth,
        height: 10,
        lineWidth: 2
      }))
    }
    that.draw = function () {
      for (let i = 0; i < that.lives.length; i++) {
        that.lives[i].draw()
      }
    }
    return that
  }

  function genNormalVector() {
    var vector = {x: Random.nextDouble() - .5, y: Random.nextDouble() * -1}
    normalize(vector)
    return vector
  }

  function normalize(vector) {
    var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    vector.x /= length
    vector.y /= length
  }


  return {
    Background: Background,
    Ball: Ball,
    Banner: Banner,
    normalize: normalize,
    Paddle: Paddle,
    PlayingBoard: PlayingBoard,
    Scoreboard: Scoreboard
  }
}
},{"./Graphics":2,"./Input":3,"./Random":4}],2:[function(require,module,exports){
/**
 * Created by Steven on 3/9/2017.
 */

var Graphics = (function () {
  var context

  function initialize(width,height) {
    var canvas = document.getElementById("game-canvas")
    canvas.width = width
    canvas.height = height
    context = canvas.getContext('2d')


    CanvasRenderingContext2D.prototype.clear = function () {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
      this.clearRect(0, 0, canvas.width, canvas.height);
      this.restore();
    };
  }

  function clear(){
    context.clear()
  }

  function Circle(spec){
    var that = {}

    that.setPosition = function(x,y,dx,dy){
      spec.center.x = x
      spec.center.y = y
      spec.direction.x = dx
      spec.direction.y = dy
    }

    that.setSpeed = function(speed){
      spec.speed = speed
    }

    that.update = function(elapsedTime){
      spec.center.x += spec.direction.x * spec.speed * elapsedTime / 1000
      spec.center.y += spec.direction.y * spec.speed * elapsedTime / 1000
    }

    that.draw = function(){
      context.save()
      context.fillStyle = spec.color
      context.beginPath()
      context.arc(spec.center.x, spec.center.y, spec.radius, 0, 2*Math.PI)
      context.fill()
      context.stroke()
      context.restore()
    }

    return that
  }

  function Rectangle(spec) {
    var that = {}

    exists = true

    that.update = function(elapsedTime,move = true){
      if(!move) {
        spec.pos.x += spec.speed * elapsedTime / 1000
        if(spec.pos.x + spec.width > context.canvas.width){
          spec.pos.x = context.canvas.width - spec.width
        }
      }
      if(move){
        spec.pos.x -= spec.speed * elapsedTime / 1000
        if(spec.pos.x < 0){
          spec.pos.x = 0
        }
      }
    }

    that.setWidth = function(width){
      spec.width = width
    }

    that.draw = function () {
      if (exists) {
        context.save()
        context.fillStyle = spec.color
        context.lineWidth = spec.lineWidth
        context.fillRect(spec.pos.x, spec.pos.y, spec.width, spec.height)
        context.strokeRect(spec.pos.x, spec.pos.y, spec.width, spec.height)
        context.restore()
      }
    }

    return that
  }

  function Text(spec) {
    var that = {};

    that.updateRotation = function(angle) {
      spec.rotation += angle;
    };

    //------------------------------------------------------------------
    //
    // This returns the height of the specified font, in pixels.
    //
    //------------------------------------------------------------------
    function measureTextHeight(spec) {
      context.save();

      context.font = spec.font;
      context.fillStyle = spec.fill;
      context.strokeStyle = spec.stroke;

      var height = context.measureText('m').width;

      context.restore();

      return height;
    }

    //------------------------------------------------------------------
    //
    // This returns the width of the specified font, in pixels.
    //
    //------------------------------------------------------------------
    function measureTextWidth(spec) {
      context.save();

      context.font = spec.font;
      context.fillStyle = spec.fill;
      context.strokeStyle = spec.stroke;

      var width = context.measureText(spec.text).width;

      context.restore();

      return width;
    }

    that.draw = function() {
      context.save();

      context.font = spec.font;
      context.fillStyle = spec.fill;
      context.strokeStyle = spec.stroke;
      context.textBaseline = 'top';

      context.translate(spec.pos.x + that.width / 2, spec.pos.y + that.height / 2);
      context.rotate(spec.rotation);
      context.translate(-(spec.pos.x + that.width / 2), -(spec.pos.y + that.height / 2));

      context.fillText(spec.text, spec.pos.x - (that.width / 2), spec.pos.y - (that.height / 2));
      context.strokeText(spec.text, spec.pos.x - (that.width / 2), spec.pos.y - (that.height / 2));

      context.restore();
    };

    that.setText= function(text){
      spec.text = text
    }
    //
    // Compute and expose some public properties for this text.
    that.height = measureTextHeight(spec);
    that.width = measureTextWidth(spec);
    that.pos = spec.pos;

    return that;
  }

  return {
    Circle: Circle,
    clear: clear,
    initialize: initialize,
    Rectangle: Rectangle,
    Text: Text
  }
}())

module.exports = Graphics
},{}],3:[function(require,module,exports){
/**
 * Created by Steven on 3/9/2017.
 */
/*****************************************
 *                                       *
 Input Handler
 *                                       *
 *****************************************/


let InputMap = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  W: 87,
  A: 65,
  S: 83,
  D: 68,

  I: 73,
  J: 74,
  K: 75,
  L: 76,

  P: 80,
  H: 72,
  Y: 89,
  B: 66,

  isDown: function (keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function (event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function (event) {
    if (event.keyCode in this._pressed) {
      delete this._pressed[event.keyCode];
    }
  }
};

module.exports = InputMap
},{}],4:[function(require,module,exports){
/**
 * Created by Steven on 3/9/2017.
 */

var Random = (function() {
  'use strict';

  function nextDouble() {
    return Math.random();
  }

  function nextRange(min, max) {
    var range = max - min + 1;
    return Math.floor((Math.random() * range) + min);
  }

  function nextCircleVector() {
    var angle = Math.random() * 2 * Math.PI;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
  }

  //
  // This is used to give a small performance optimization in generating gaussian random numbers.
  var usePrevious = false,
    y2;

  //
  // Generate a normally distributed random number.
  //
  // NOTE: This code is adapted from a wiki reference I found a long time ago.  I originally
  // wrote the code in C# and am now converting it over to JavaScript.
  //
  function nextGaussian(mean, stdDev) {
    if (usePrevious) {
      usePrevious = false;
      return mean + y2 * stdDev;
    }

    usePrevious = true;

    var x1 = 0,
      x2 = 0,
      y1 = 0,
      z = 0;

    do {
      x1 = 2 * Math.random() - 1;
      x2 = 2 * Math.random() - 1;
      z = (x1 * x1) + (x2 * x2);
    } while (z >= 1);

    z = Math.sqrt((-2 * Math.log(z)) / z);
    y1 = x1 * z;
    y2 = x2 * z;

    return mean + y1 * stdDev;
  }

  return {
    nextDouble : nextDouble,
    nextRange : nextRange,
    nextCircleVector : nextCircleVector,
    nextGaussian : nextGaussian
  };

}());
module.exports = Random
},{}],5:[function(require,module,exports){
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
},{"./GenerateObjects":1,"./Graphics":2,"./Input":3,"./Random":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL0dlbmVyYXRlT2JqZWN0cy5qcyIsInNjcmlwdHMvR3JhcGhpY3MuanMiLCJzY3JpcHRzL0lucHV0LmpzIiwic2NyaXB0cy9SYW5kb20uanMiLCJzY3JpcHRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFN0ZXZlbiBvbiAzLzkvMjAxNy5cclxuICovXHJcblxyXG52YXIgR3JhcGhpY3MgPSByZXF1aXJlKCcuL0dyYXBoaWNzJylcclxudmFyIFJhbmRvbSA9IHJlcXVpcmUoJy4vUmFuZG9tJylcclxudmFyIElucHV0TWFwID0gcmVxdWlyZSgnLi9JbnB1dCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzcGVjKSB7XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKiBHZW5lcmF0b3IgRnVuY3Rpb25zIGZvciB0aGUgT2JqZWN0cyBpbiB0aGUgZ2FtZVxyXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgZnVuY3Rpb24gQmFja2dyb3VuZCgpIHtcclxuICAgIHJldHVybiBHcmFwaGljcy5SZWN0YW5nbGUoe1xyXG4gICAgICBjb2xvcjogXCJyZ2IoNjAsOTQsOTQpXCIsXHJcbiAgICAgIHBvczoge3g6IDAsIHk6IDB9LFxyXG4gICAgICB3aWR0aDogc3BlYy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiBzcGVjLmhlaWdodCxcclxuICAgICAgbGluZVdpZHRoOiA1XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gQmFsbCgpIHtcclxuICAgIHZhciBkaXJlY3Rpb24gPSBnZW5Ob3JtYWxWZWN0b3IoKVxyXG4gICAgdmFyIHRoYXQgPSB7XHJcbiAgICAgIGNlbnRlcjoge3g6IHNwZWMud2lkdGggLyAyLCB5OiBzcGVjLmhlaWdodCAtIDUwfSxcclxuICAgICAgcmFkaXVzOiA4LFxyXG4gICAgICBzcGVlZDogc3BlYy53aWR0aCAvIDIsXHJcbiAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxyXG4gICAgICB2aWV3OiBHcmFwaGljcy5DaXJjbGUoe1xyXG4gICAgICAgIGNlbnRlcjoge3g6IHNwZWMud2lkdGggLyAyLCB5OiBzcGVjLmhlaWdodCAtIDUwfSxcclxuICAgICAgICByYWRpdXM6IDgsXHJcbiAgICAgICAgY29sb3I6IFwicmdiKDYwLDYwLDYwKVwiLFxyXG4gICAgICAgIHNwZWVkOiBzcGVjLndpZHRoIC8gMixcclxuICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvblxyXG4gICAgICB9KSxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudmlldy5kcmF3KClcclxuICAgICAgfSxcclxuICAgICAgc2V0UG9zaXRpb246IGZ1bmN0aW9uICh4LCB5LCBkeCwgZHkpIHtcclxuICAgICAgICB0aGlzLmNlbnRlci54ID0geFxyXG4gICAgICAgIHRoaXMuY2VudGVyLnkgPSB5XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24ueCA9IGR4XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24ueSA9IGR5XHJcbiAgICAgICAgdGhpcy52aWV3LnNldFBvc2l0aW9uKHgsIHksIGR4LCBkeSlcclxuICAgICAgfSxcclxuICAgICAgc2V0U3BlZWQ6IGZ1bmN0aW9uIChzcGVlZCkge1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZFxyXG4gICAgICAgIHRoaXMudmlldy5zZXRTcGVlZChzcGVlZClcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZWxhcHNlZFRpbWUpIHtcclxuICAgICAgICB0aGlzLmNlbnRlci54ICs9IHRoaXMuZGlyZWN0aW9uLnggKiB0aGlzLnNwZWVkICogZWxhcHNlZFRpbWUgLyAxMDAwXHJcbiAgICAgICAgdGhpcy5jZW50ZXIueSArPSB0aGlzLmRpcmVjdGlvbi55ICogdGhpcy5zcGVlZCAqIGVsYXBzZWRUaW1lIC8gMTAwMFxyXG4gICAgICAgIHRoaXMudmlldy5zZXRQb3NpdGlvbih0aGlzLmNlbnRlci54LCB0aGlzLmNlbnRlci55LCB0aGlzLmRpcmVjdGlvbi54LCB0aGlzLmRpcmVjdGlvbi55KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhhdDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEJhbm5lcigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJhbm5lcjogR3JhcGhpY3MuUmVjdGFuZ2xlKHtcclxuICAgICAgICBjb2xvcjogXCJyZ2JhKDYwLDYwLDYwLC45KVwiLFxyXG4gICAgICAgIHBvczoge3g6IDAsIHk6IHNwZWMuaGVpZ2h0IC8gMiAtIDUwfSxcclxuICAgICAgICB3aWR0aDogc3BlYy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IDEwMCxcclxuICAgICAgICBsaW5lV2lkdGg6IDJcclxuICAgICAgfSksXHJcbiAgICAgIHRleHQ6IEdyYXBoaWNzLlRleHQoe1xyXG4gICAgICAgIGZvbnQ6IFwiODBweCBteUZvbnRcIixcclxuICAgICAgICBjb2xvcjogXCJyZ2IoMjAwLDIwMCwzMClcIixcclxuICAgICAgICBzdHJva2U6IFwicmdiKDIwMCwyMDAsMzApXCIsXHJcbiAgICAgICAgcm90YXRpb246IDAsXHJcbiAgICAgICAgcG9zOiB7eDogc3BlYy53aWR0aCAvIDIgKyA4LCB5OiBzcGVjLmhlaWdodCAvIDIgLSA1MCArIDI1fSxcclxuICAgICAgICAvLyBwb3M6e3g6IDAsIHk6IDB9LFxyXG4gICAgICAgIHRleHQ6IFwiMVwiXHJcbiAgICAgIH0pLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5iYW5uZXIuZHJhdygpXHJcbiAgICAgICAgdGhpcy50ZXh0LmRyYXcoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBQYWRkbGUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2aWV3OiBHcmFwaGljcy5SZWN0YW5nbGUoe1xyXG4gICAgICAgIGNvbG9yOiBcInJnYmEoMjU1LDEyMCwxMjAsMSlcIixcclxuICAgICAgICBwb3M6IHt4OiBzcGVjLndpZHRoIC8gMiAtIHNwZWMucGFkZGxlV2lkdGggLyAyLCB5OiBzcGVjLmhlaWdodCAtIDQyfSxcclxuICAgICAgICB3aWR0aDogc3BlYy5wYWRkbGVXaWR0aCxcclxuICAgICAgICBoZWlnaHQ6IDEwLFxyXG4gICAgICAgIGxpbmVXaWR0aDogMixcclxuICAgICAgICBzcGVlZDogc3BlYy53aWR0aFxyXG4gICAgICB9KSxcclxuICAgICAgICBwb3M6IHt4OiBzcGVjLndpZHRoIC8gMiAtIHNwZWMucGFkZGxlV2lkdGggLyAyLCB5OiBzcGVjLmhlaWdodCAtIDQyfSxcclxuICAgICAgICB3aWR0aDogc3BlYy5wYWRkbGVXaWR0aCxcclxuICAgICAgICBoZWlnaHQ6IDEwLFxyXG4gICAgICAgIHNwZWVkOiBzcGVjLndpZHRoXHJcbiAgICAgICxcclxuICAgICAgZHJhdzogZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLnZpZXcuZHJhdygpXHJcbiAgICAgIH0sXHJcbiAgICAgIHRvZ2dsZVNpemU6IGZ1bmN0aW9uKGZ1bGxTaXplKXtcclxuICAgICAgICBpZighZnVsbFNpemUpe1xyXG4gICAgICAgICAgdGhpcy53aWR0aCA9IHNwZWMucGFkZGxlV2lkdGggLyAyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICB0aGlzLndpZHRoID0gc3BlYy5wYWRkbGVXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZpZXcuc2V0V2lkdGgodGhpcy53aWR0aClcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlOiBmdW5jdGlvbihlbGFwc2VkVGltZSl7XHJcbiAgICAgICAgaWYoSW5wdXRNYXAuaXNEb3duKElucHV0TWFwLkxFRlQpKXtcclxuICAgICAgICAgIHRoaXMucG9zLnggLT0gdGhpcy5zcGVlZCAqIGVsYXBzZWRUaW1lIC8gMTAwMFxyXG4gICAgICAgICAgaWYodGhpcy5wb3MueCA8IDApe1xyXG4gICAgICAgICAgICB0aGlzLnBvcy54ID0gMFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZShlbGFwc2VkVGltZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoSW5wdXRNYXAuaXNEb3duKElucHV0TWFwLlJJR0hUKSl7XHJcbiAgICAgICAgICB0aGlzLnBvcy54ICs9IHRoaXMuc3BlZWQgKiBlbGFwc2VkVGltZSAvIDEwMDBcclxuICAgICAgICAgIGlmKHRoaXMucG9zLnggKyB0aGlzLndpZHRoID4gc3BlYy53aWR0aCl7XHJcbiAgICAgICAgICAgIHRoaXMucG9zLnggPSBzcGVjLndpZHRoIC0gdGhpcy53aWR0aFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZShlbGFwc2VkVGltZSxmYWxzZSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFBsYXlpbmdCb2FyZCgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJvd3M6IGdlbmVyYXRlUm93cygpLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHRoaXMucm93c1tpXS5kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFNjb3JlYm9hcmQoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib2FyZDogR3JhcGhpY3MuUmVjdGFuZ2xlKHtcclxuICAgICAgICBjb2xvcjogXCJyZ2IoMTIwLDE4OCwxODgpXCIsXHJcbiAgICAgICAgcG9zOiB7eDogMCwgeTogMH0sXHJcbiAgICAgICAgd2lkdGg6IHNwZWMud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiAxMDAsXHJcbiAgICAgICAgbGluZVdpZHRoOiA1XHJcbiAgICAgIH0pLFxyXG4gICAgICBzY29yZTogR3JhcGhpY3MuVGV4dCh7XHJcbiAgICAgICAgZm9udDogXCI1NHB4IG15Rm9udFwiLFxyXG4gICAgICAgIGNvbG9yOiBcInJnYigyMDAsMjAwLDMwKVwiLFxyXG4gICAgICAgIHN0cm9rZTogXCJyZ2IoMjAwLDIwMCwzMClcIixcclxuICAgICAgICByb3RhdGlvbjogMCxcclxuICAgICAgICBwb3M6IHt4OiA0NSArIDgsIHk6IDE1ICsgMjV9LFxyXG4gICAgICAgIHRleHQ6IFwiMDAwXCJcclxuICAgICAgfSksXHJcbiAgICAgIHRpbWU6IEdyYXBoaWNzLlRleHQoe1xyXG4gICAgICAgIGZvbnQ6IFwiNTRweCBteUZvbnRcIixcclxuICAgICAgICBjb2xvcjogXCJyZ2IoMjAwLDIwMCwzMClcIixcclxuICAgICAgICBzdHJva2U6IFwicmdiKDIwMCwyMDAsMzApXCIsXHJcbiAgICAgICAgcm90YXRpb246IDAsXHJcbiAgICAgICAgcG9zOiB7eDogc3BlYy53aWR0aCAvIDIsIHk6IDE1ICsgMjV9LFxyXG4gICAgICAgIHRleHQ6IFwiMDowMFwiXHJcbiAgICAgIH0pLFxyXG4gICAgICBsaXZlczogZ2VuZXJhdGVMaXZlcygpLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5kcmF3KClcclxuICAgICAgICB0aGlzLnNjb3JlLmRyYXcoKVxyXG4gICAgICAgIHRoaXMudGltZS5kcmF3KClcclxuICAgICAgICB0aGlzLmxpdmVzLmRyYXcoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKiBIZWxwZXIgRnVuY3Rpb25zIHRvIGFzc2lzdCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uc1xyXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICBmdW5jdGlvbiBnZW5lcmF0ZVJvd3MoKSB7XHJcbiAgICB2YXIgY29sb3JzID0gW1wiZ3JlZW5cIiwgXCJibHVlXCIsIFwib3JhbmdlXCIsIFwieWVsbG93XCJdXHJcbiAgICB2YXIgcm93cyA9IFtdXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7ICsraSkge1xyXG4gICAgICByb3dzLnB1c2goZ2VuZXJhdGVSb3coY29sb3JzW01hdGguZmxvb3IoaSAvIDIpXSwgaSkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcm93c1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuZXJhdGVSb3coY29sb3IsIHJvd1Bvcykge1xyXG4gICAgdmFyIHJvdyA9IHt9XHJcbiAgICByb3cuYnJpY2tzID0gW11cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTQ7ICsraSkge1xyXG4gICAgICBsZXQgeCA9IGkgKiAoc3BlYy53aWR0aCAvIDE0KSArIDJcclxuICAgICAgcm93LmJyaWNrcy5wdXNoKHtcclxuICAgICAgICB2aWV3OiBHcmFwaGljcy5SZWN0YW5nbGUoe1xyXG4gICAgICAgICAgY29sb3I6IGNvbG9yLFxyXG4gICAgICAgICAgcG9zOiB7eDogeCwgeTogMjAwICsgcm93UG9zICogc3BlYy5icmlja0hlaWdodCArIDJ9LFxyXG4gICAgICAgICAgd2lkdGg6IHNwZWMud2lkdGggLyAxNCAtIDQsXHJcbiAgICAgICAgICBoZWlnaHQ6IHNwZWMuYnJpY2tIZWlnaHQsXHJcbiAgICAgICAgICBsaW5lV2lkdGg6IDJcclxuICAgICAgICB9KSxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgcG9zOiB7eDogeCwgeTogMjAwICsgcm93UG9zICogc3BlYy5icmlja0hlaWdodCArIDJ9LFxyXG4gICAgICAgICAgd2lkdGg6IHNwZWMud2lkdGggLyAxNCAtIDQsXHJcbiAgICAgICAgICBoZWlnaHQ6IHNwZWMuYnJpY2tIZWlnaHQsXHJcbiAgICAgICAgICByb3c6IHJvd1Bvc1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIHJvdy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdy5icmlja3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICByb3cuYnJpY2tzW2ldLnZpZXcuZHJhdygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByb3dcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdlbmVyYXRlTGl2ZXMoKSB7XHJcbiAgICB2YXIgdGhhdCA9IHt9XHJcbiAgICB0aGF0LmxpdmVzID0gW11cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgIHRoYXQubGl2ZXMucHVzaChHcmFwaGljcy5SZWN0YW5nbGUoe1xyXG4gICAgICAgIGNvbG9yOiBcInJnYmEoMjU1LDEyMCwxMjAsMSlcIixcclxuICAgICAgICBwb3M6IHt4OiBzcGVjLndpZHRoIC0gc3BlYy5wYWRkbGVXaWR0aCAtIDE1LCB5OiBpICogMjAgKyAzMH0sXHJcbiAgICAgICAgd2lkdGg6IHNwZWMucGFkZGxlV2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiAxMCxcclxuICAgICAgICBsaW5lV2lkdGg6IDJcclxuICAgICAgfSkpXHJcbiAgICB9XHJcbiAgICB0aGF0LmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhhdC5saXZlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoYXQubGl2ZXNbaV0uZHJhdygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGF0XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5Ob3JtYWxWZWN0b3IoKSB7XHJcbiAgICB2YXIgdmVjdG9yID0ge3g6IFJhbmRvbS5uZXh0RG91YmxlKCkgLSAuNSwgeTogUmFuZG9tLm5leHREb3VibGUoKSAqIC0xfVxyXG4gICAgbm9ybWFsaXplKHZlY3RvcilcclxuICAgIHJldHVybiB2ZWN0b3JcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZSh2ZWN0b3IpIHtcclxuICAgIHZhciBsZW5ndGggPSBNYXRoLnNxcnQodmVjdG9yLnggKiB2ZWN0b3IueCArIHZlY3Rvci55ICogdmVjdG9yLnkpXHJcbiAgICB2ZWN0b3IueCAvPSBsZW5ndGhcclxuICAgIHZlY3Rvci55IC89IGxlbmd0aFxyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBCYWNrZ3JvdW5kOiBCYWNrZ3JvdW5kLFxyXG4gICAgQmFsbDogQmFsbCxcclxuICAgIEJhbm5lcjogQmFubmVyLFxyXG4gICAgbm9ybWFsaXplOiBub3JtYWxpemUsXHJcbiAgICBQYWRkbGU6IFBhZGRsZSxcclxuICAgIFBsYXlpbmdCb2FyZDogUGxheWluZ0JvYXJkLFxyXG4gICAgU2NvcmVib2FyZDogU2NvcmVib2FyZFxyXG4gIH1cclxufSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFN0ZXZlbiBvbiAzLzkvMjAxNy5cclxuICovXHJcblxyXG52YXIgR3JhcGhpY3MgPSAoZnVuY3Rpb24gKCkge1xyXG4gIHZhciBjb250ZXh0XHJcblxyXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUod2lkdGgsaGVpZ2h0KSB7XHJcbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNhbnZhc1wiKVxyXG4gICAgY2FudmFzLndpZHRoID0gd2lkdGhcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHRcclxuICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cclxuXHJcbiAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnNhdmUoKTtcclxuICAgICAgdGhpcy5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcbiAgICAgIHRoaXMuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAgIHRoaXMucmVzdG9yZSgpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsZWFyKCl7XHJcbiAgICBjb250ZXh0LmNsZWFyKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIENpcmNsZShzcGVjKXtcclxuICAgIHZhciB0aGF0ID0ge31cclxuXHJcbiAgICB0aGF0LnNldFBvc2l0aW9uID0gZnVuY3Rpb24oeCx5LGR4LGR5KXtcclxuICAgICAgc3BlYy5jZW50ZXIueCA9IHhcclxuICAgICAgc3BlYy5jZW50ZXIueSA9IHlcclxuICAgICAgc3BlYy5kaXJlY3Rpb24ueCA9IGR4XHJcbiAgICAgIHNwZWMuZGlyZWN0aW9uLnkgPSBkeVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQuc2V0U3BlZWQgPSBmdW5jdGlvbihzcGVlZCl7XHJcbiAgICAgIHNwZWMuc3BlZWQgPSBzcGVlZFxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQudXBkYXRlID0gZnVuY3Rpb24oZWxhcHNlZFRpbWUpe1xyXG4gICAgICBzcGVjLmNlbnRlci54ICs9IHNwZWMuZGlyZWN0aW9uLnggKiBzcGVjLnNwZWVkICogZWxhcHNlZFRpbWUgLyAxMDAwXHJcbiAgICAgIHNwZWMuY2VudGVyLnkgKz0gc3BlYy5kaXJlY3Rpb24ueSAqIHNwZWMuc3BlZWQgKiBlbGFwc2VkVGltZSAvIDEwMDBcclxuICAgIH1cclxuXHJcbiAgICB0aGF0LmRyYXcgPSBmdW5jdGlvbigpe1xyXG4gICAgICBjb250ZXh0LnNhdmUoKVxyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHNwZWMuY29sb3JcclxuICAgICAgY29udGV4dC5iZWdpblBhdGgoKVxyXG4gICAgICBjb250ZXh0LmFyYyhzcGVjLmNlbnRlci54LCBzcGVjLmNlbnRlci55LCBzcGVjLnJhZGl1cywgMCwgMipNYXRoLlBJKVxyXG4gICAgICBjb250ZXh0LmZpbGwoKVxyXG4gICAgICBjb250ZXh0LnN0cm9rZSgpXHJcbiAgICAgIGNvbnRleHQucmVzdG9yZSgpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoYXRcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFJlY3RhbmdsZShzcGVjKSB7XHJcbiAgICB2YXIgdGhhdCA9IHt9XHJcblxyXG4gICAgZXhpc3RzID0gdHJ1ZVxyXG5cclxuICAgIHRoYXQudXBkYXRlID0gZnVuY3Rpb24oZWxhcHNlZFRpbWUsbW92ZSA9IHRydWUpe1xyXG4gICAgICBpZighbW92ZSkge1xyXG4gICAgICAgIHNwZWMucG9zLnggKz0gc3BlYy5zcGVlZCAqIGVsYXBzZWRUaW1lIC8gMTAwMFxyXG4gICAgICAgIGlmKHNwZWMucG9zLnggKyBzcGVjLndpZHRoID4gY29udGV4dC5jYW52YXMud2lkdGgpe1xyXG4gICAgICAgICAgc3BlYy5wb3MueCA9IGNvbnRleHQuY2FudmFzLndpZHRoIC0gc3BlYy53aWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZihtb3ZlKXtcclxuICAgICAgICBzcGVjLnBvcy54IC09IHNwZWMuc3BlZWQgKiBlbGFwc2VkVGltZSAvIDEwMDBcclxuICAgICAgICBpZihzcGVjLnBvcy54IDwgMCl7XHJcbiAgICAgICAgICBzcGVjLnBvcy54ID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQuc2V0V2lkdGggPSBmdW5jdGlvbih3aWR0aCl7XHJcbiAgICAgIHNwZWMud2lkdGggPSB3aWR0aFxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGV4aXN0cykge1xyXG4gICAgICAgIGNvbnRleHQuc2F2ZSgpXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBzcGVjLmNvbG9yXHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBzcGVjLmxpbmVXaWR0aFxyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3Qoc3BlYy5wb3MueCwgc3BlYy5wb3MueSwgc3BlYy53aWR0aCwgc3BlYy5oZWlnaHQpXHJcbiAgICAgICAgY29udGV4dC5zdHJva2VSZWN0KHNwZWMucG9zLngsIHNwZWMucG9zLnksIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0KVxyXG4gICAgICAgIGNvbnRleHQucmVzdG9yZSgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhhdFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVGV4dChzcGVjKSB7XHJcbiAgICB2YXIgdGhhdCA9IHt9O1xyXG5cclxuICAgIHRoYXQudXBkYXRlUm90YXRpb24gPSBmdW5jdGlvbihhbmdsZSkge1xyXG4gICAgICBzcGVjLnJvdGF0aW9uICs9IGFuZ2xlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy9cclxuICAgIC8vIFRoaXMgcmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSBzcGVjaWZpZWQgZm9udCwgaW4gcGl4ZWxzLlxyXG4gICAgLy9cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBmdW5jdGlvbiBtZWFzdXJlVGV4dEhlaWdodChzcGVjKSB7XHJcbiAgICAgIGNvbnRleHQuc2F2ZSgpO1xyXG5cclxuICAgICAgY29udGV4dC5mb250ID0gc3BlYy5mb250O1xyXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHNwZWMuZmlsbDtcclxuICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IHNwZWMuc3Ryb2tlO1xyXG5cclxuICAgICAgdmFyIGhlaWdodCA9IGNvbnRleHQubWVhc3VyZVRleHQoJ20nKS53aWR0aDtcclxuXHJcbiAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgICAgcmV0dXJuIGhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy9cclxuICAgIC8vIFRoaXMgcmV0dXJucyB0aGUgd2lkdGggb2YgdGhlIHNwZWNpZmllZCBmb250LCBpbiBwaXhlbHMuXHJcbiAgICAvL1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGZ1bmN0aW9uIG1lYXN1cmVUZXh0V2lkdGgoc3BlYykge1xyXG4gICAgICBjb250ZXh0LnNhdmUoKTtcclxuXHJcbiAgICAgIGNvbnRleHQuZm9udCA9IHNwZWMuZm9udDtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBzcGVjLmZpbGw7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzcGVjLnN0cm9rZTtcclxuXHJcbiAgICAgIHZhciB3aWR0aCA9IGNvbnRleHQubWVhc3VyZVRleHQoc3BlYy50ZXh0KS53aWR0aDtcclxuXHJcbiAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgICAgcmV0dXJuIHdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIHRoYXQuZHJhdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjb250ZXh0LnNhdmUoKTtcclxuXHJcbiAgICAgIGNvbnRleHQuZm9udCA9IHNwZWMuZm9udDtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBzcGVjLmZpbGw7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzcGVjLnN0cm9rZTtcclxuICAgICAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSAndG9wJztcclxuXHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKHNwZWMucG9zLnggKyB0aGF0LndpZHRoIC8gMiwgc3BlYy5wb3MueSArIHRoYXQuaGVpZ2h0IC8gMik7XHJcbiAgICAgIGNvbnRleHQucm90YXRlKHNwZWMucm90YXRpb24pO1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtKHNwZWMucG9zLnggKyB0aGF0LndpZHRoIC8gMiksIC0oc3BlYy5wb3MueSArIHRoYXQuaGVpZ2h0IC8gMikpO1xyXG5cclxuICAgICAgY29udGV4dC5maWxsVGV4dChzcGVjLnRleHQsIHNwZWMucG9zLnggLSAodGhhdC53aWR0aCAvIDIpLCBzcGVjLnBvcy55IC0gKHRoYXQuaGVpZ2h0IC8gMikpO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoc3BlYy50ZXh0LCBzcGVjLnBvcy54IC0gKHRoYXQud2lkdGggLyAyKSwgc3BlYy5wb3MueSAtICh0aGF0LmhlaWdodCAvIDIpKTtcclxuXHJcbiAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGF0LnNldFRleHQ9IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICBzcGVjLnRleHQgPSB0ZXh0XHJcbiAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gQ29tcHV0ZSBhbmQgZXhwb3NlIHNvbWUgcHVibGljIHByb3BlcnRpZXMgZm9yIHRoaXMgdGV4dC5cclxuICAgIHRoYXQuaGVpZ2h0ID0gbWVhc3VyZVRleHRIZWlnaHQoc3BlYyk7XHJcbiAgICB0aGF0LndpZHRoID0gbWVhc3VyZVRleHRXaWR0aChzcGVjKTtcclxuICAgIHRoYXQucG9zID0gc3BlYy5wb3M7XHJcblxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgQ2lyY2xlOiBDaXJjbGUsXHJcbiAgICBjbGVhcjogY2xlYXIsXHJcbiAgICBpbml0aWFsaXplOiBpbml0aWFsaXplLFxyXG4gICAgUmVjdGFuZ2xlOiBSZWN0YW5nbGUsXHJcbiAgICBUZXh0OiBUZXh0XHJcbiAgfVxyXG59KCkpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXBoaWNzIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgU3RldmVuIG9uIDMvOS8yMDE3LlxyXG4gKi9cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxyXG4gSW5wdXQgSGFuZGxlclxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHJcbmxldCBJbnB1dE1hcCA9IHtcclxuICBfcHJlc3NlZDoge30sXHJcblxyXG4gIExFRlQ6IDM3LFxyXG4gIFVQOiAzOCxcclxuICBSSUdIVDogMzksXHJcbiAgRE9XTjogNDAsXHJcblxyXG4gIFc6IDg3LFxyXG4gIEE6IDY1LFxyXG4gIFM6IDgzLFxyXG4gIEQ6IDY4LFxyXG5cclxuICBJOiA3MyxcclxuICBKOiA3NCxcclxuICBLOiA3NSxcclxuICBMOiA3NixcclxuXHJcbiAgUDogODAsXHJcbiAgSDogNzIsXHJcbiAgWTogODksXHJcbiAgQjogNjYsXHJcblxyXG4gIGlzRG93bjogZnVuY3Rpb24gKGtleUNvZGUpIHtcclxuICAgIHJldHVybiB0aGlzLl9wcmVzc2VkW2tleUNvZGVdO1xyXG4gIH0sXHJcblxyXG4gIG9uS2V5ZG93bjogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB0aGlzLl9wcmVzc2VkW2V2ZW50LmtleUNvZGVdID0gdHJ1ZTtcclxuICB9LFxyXG5cclxuICBvbktleXVwOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC5rZXlDb2RlIGluIHRoaXMuX3ByZXNzZWQpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuX3ByZXNzZWRbZXZlbnQua2V5Q29kZV07XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dE1hcCIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFN0ZXZlbiBvbiAzLzkvMjAxNy5cclxuICovXHJcblxyXG52YXIgUmFuZG9tID0gKGZ1bmN0aW9uKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZnVuY3Rpb24gbmV4dERvdWJsZSgpIHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbmV4dFJhbmdlKG1pbiwgbWF4KSB7XHJcbiAgICB2YXIgcmFuZ2UgPSBtYXggLSBtaW4gKyAxO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiByYW5nZSkgKyBtaW4pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbmV4dENpcmNsZVZlY3RvcigpIHtcclxuICAgIHZhciBhbmdsZSA9IE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IE1hdGguY29zKGFuZ2xlKSxcclxuICAgICAgeTogTWF0aC5zaW4oYW5nbGUpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy9cclxuICAvLyBUaGlzIGlzIHVzZWQgdG8gZ2l2ZSBhIHNtYWxsIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbiBpbiBnZW5lcmF0aW5nIGdhdXNzaWFuIHJhbmRvbSBudW1iZXJzLlxyXG4gIHZhciB1c2VQcmV2aW91cyA9IGZhbHNlLFxyXG4gICAgeTI7XHJcblxyXG4gIC8vXHJcbiAgLy8gR2VuZXJhdGUgYSBub3JtYWxseSBkaXN0cmlidXRlZCByYW5kb20gbnVtYmVyLlxyXG4gIC8vXHJcbiAgLy8gTk9URTogVGhpcyBjb2RlIGlzIGFkYXB0ZWQgZnJvbSBhIHdpa2kgcmVmZXJlbmNlIEkgZm91bmQgYSBsb25nIHRpbWUgYWdvLiAgSSBvcmlnaW5hbGx5XHJcbiAgLy8gd3JvdGUgdGhlIGNvZGUgaW4gQyMgYW5kIGFtIG5vdyBjb252ZXJ0aW5nIGl0IG92ZXIgdG8gSmF2YVNjcmlwdC5cclxuICAvL1xyXG4gIGZ1bmN0aW9uIG5leHRHYXVzc2lhbihtZWFuLCBzdGREZXYpIHtcclxuICAgIGlmICh1c2VQcmV2aW91cykge1xyXG4gICAgICB1c2VQcmV2aW91cyA9IGZhbHNlO1xyXG4gICAgICByZXR1cm4gbWVhbiArIHkyICogc3RkRGV2O1xyXG4gICAgfVxyXG5cclxuICAgIHVzZVByZXZpb3VzID0gdHJ1ZTtcclxuXHJcbiAgICB2YXIgeDEgPSAwLFxyXG4gICAgICB4MiA9IDAsXHJcbiAgICAgIHkxID0gMCxcclxuICAgICAgeiA9IDA7XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICB4MSA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcclxuICAgICAgeDIgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgIHogPSAoeDEgKiB4MSkgKyAoeDIgKiB4Mik7XHJcbiAgICB9IHdoaWxlICh6ID49IDEpO1xyXG5cclxuICAgIHogPSBNYXRoLnNxcnQoKC0yICogTWF0aC5sb2coeikpIC8geik7XHJcbiAgICB5MSA9IHgxICogejtcclxuICAgIHkyID0geDIgKiB6O1xyXG5cclxuICAgIHJldHVybiBtZWFuICsgeTEgKiBzdGREZXY7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmV4dERvdWJsZSA6IG5leHREb3VibGUsXHJcbiAgICBuZXh0UmFuZ2UgOiBuZXh0UmFuZ2UsXHJcbiAgICBuZXh0Q2lyY2xlVmVjdG9yIDogbmV4dENpcmNsZVZlY3RvcixcclxuICAgIG5leHRHYXVzc2lhbiA6IG5leHRHYXVzc2lhblxyXG4gIH07XHJcblxyXG59KCkpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmRvbSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFN0ZXZlbiBvbiAzLzcvMjAxNy5cclxuICovXHJcblxyXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogRW52aXJvbm1lbnQgVmFyaWFibGVzXHJcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgdmFyIHdpZHRoID0gNjAwXHJcbiAgdmFyIGhlaWdodCA9IDcwMFxyXG4gIHZhciBicmlja0hlaWdodCA9IDIwXHJcbiAgdmFyIHBhZGRsZVdpZHRoID0gd2lkdGggLyA1XHJcbiAgdmFyIEdyYXBoaWNzID0gcmVxdWlyZSgnLi9HcmFwaGljcycpXHJcbiAgdmFyIElucHV0TWFwID0gcmVxdWlyZSgnLi9JbnB1dCcpXHJcbiAgdmFyIFJhbmRvbSA9IHJlcXVpcmUoJy4vUmFuZG9tJylcclxuICB2YXIgTW9kZWwgPSByZXF1aXJlKCcuL0dlbmVyYXRlT2JqZWN0cycpKHtcclxuICAgIHdpZHRoOiB3aWR0aCxcclxuICAgIGhlaWdodDogaGVpZ2h0LFxyXG4gICAgYnJpY2tIZWlnaHQ6IGJyaWNrSGVpZ2h0LFxyXG4gICAgcGFkZGxlV2lkdGg6IHBhZGRsZVdpZHRoXHJcbiAgfSlcclxuXHJcblxyXG4gIHZhciBCcmVha291dCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgdGhhdCA9IHt9XHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICpHYW1lIE9iamVjdHMgYW5kIFZhcmlhYmxlc1xyXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICB2YXIgcHJldmlvdXNUaW1lXHJcbiAgICB2YXIgdG90YWxHYW1lVGltZVxyXG4gICAgdmFyIHRpbWVCZWZvcmVTdGFydFxyXG4gICAgdmFyIGdhbWVSdW5uaW5nID0gZmFsc2VcclxuICAgIHZhciBnYW1lT3ZlciA9IGZhbHNlXHJcbiAgICB2YXIgZ2FtZU9iamVjdHMgPSB7fVxyXG4gICAgdmFyIHNjb3JlID0gMDtcclxuICAgIHZhciBjdXJyZW50Um91bmRTY29yZSA9IDBcclxuICAgIHZhciBzY29yZUFycmF5ID0gWzUsIDUsIDMsIDMsIDIsIDIsIDEsIDFdXHJcbiAgICB2YXIgY3VycmVudFJvdW5kSGl0cyA9IDBcclxuICAgIHZhciBmdWxsU2l6ZSA9IHRydWVcclxuXHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICogR2FtZSBGdW5jdGlvbnNcclxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgdGhhdC5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBJbnB1dE1hcC5vbktleXVwKGV2ZW50KTtcclxuICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIElucHV0TWFwLm9uS2V5ZG93bihldmVudCk7XHJcbiAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgR3JhcGhpY3MuaW5pdGlhbGl6ZSh3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICBpbml0aWFsaXplT2JqZWN0cygpXHJcbiAgICAgIHByZXZpb3VzVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0aWFsaXplT2JqZWN0cygpIHtcclxuICAgICAgdG90YWxHYW1lVGltZSA9IDBcclxuICAgICAgdGltZUJlZm9yZVN0YXJ0ID0gMzAwMFxyXG4gICAgICBnYW1lUnVubmluZyA9IGZhbHNlXHJcbiAgICAgIGdhbWVPYmplY3RzID0ge31cclxuICAgICAgZ2FtZU9iamVjdHMuQmFja2dyb3VuZCA9IE1vZGVsLkJhY2tncm91bmQoKVxyXG4gICAgICBnYW1lT2JqZWN0cy5TY29yZWJvYXJkID0gTW9kZWwuU2NvcmVib2FyZCgpXHJcbiAgICAgIGdhbWVPYmplY3RzLlBsYXlpbmdCb2FyZCA9IE1vZGVsLlBsYXlpbmdCb2FyZCgpXHJcbiAgICAgIGdhbWVPYmplY3RzLlBhZGRsZSA9IE1vZGVsLlBhZGRsZSgpXHJcbiAgICAgIGdhbWVPYmplY3RzLkJhbGxzID0ge1xyXG4gICAgICAgIGJhbGxzOiBbTW9kZWwuQmFsbCgpXSxcclxuICAgICAgICBkcmF3OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzW2ldLmRyYXcoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBnYW1lT2JqZWN0cy5CYW5uZXIgPSBNb2RlbC5CYW5uZXIoKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5ld0xpZmUoKSB7XHJcbiAgICAgIGdhbWVPYmplY3RzLlBhZGRsZSA9IE1vZGVsLlBhZGRsZSgpXHJcbiAgICAgIGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzID0gW01vZGVsLkJhbGwoKV1cclxuICAgICAgZ2FtZU9iamVjdHMuQmFubmVyID0gTW9kZWwuQmFubmVyKClcclxuICAgICAgdGltZUJlZm9yZVN0YXJ0ID0gMzAwMFxyXG4gICAgICBjdXJyZW50Um91bmRIaXRzID0gMFxyXG4gICAgICBjdXJyZW50Um91bmRTY29yZSA9IDBcclxuICAgICAgZnVsbFNpemUgPSB0cnVlXHJcbiAgICAgIGdhbWVPYmplY3RzLlBhZGRsZS50b2dnbGVTaXplKHRydWUpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2FtZUxvb3AoY3VycmVudFRpbWUpIHtcclxuICAgICAgdXBkYXRlKGN1cnJlbnRUaW1lKVxyXG4gICAgICByZW5kZXIoKVxyXG4gICAgICBwcmV2aW91c1RpbWUgPSBjdXJyZW50VGltZVxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGN1cnJlbnRUaW1lKSB7XHJcbiAgICAgIHZhciBlbGFwc2VkVGltZSA9IGN1cnJlbnRUaW1lIC0gcHJldmlvdXNUaW1lXHJcbiAgICAgIGlmIChnYW1lUnVubmluZykge1xyXG4gICAgICAgIGdhbWVPYmplY3RzLlBhZGRsZS51cGRhdGUoZWxhcHNlZFRpbWUpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYW1lT2JqZWN0cy5CYWxscy5iYWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgZ2FtZU9iamVjdHMuQmFsbHMuYmFsbHNbaV0udXBkYXRlKGVsYXBzZWRUaW1lKVxyXG4gICAgICAgICAgaWYgKCFkZXRlY3RBbGxDb2xsaXNpb25zKGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzW2ldKSkge1xyXG4gICAgICAgICAgICBpZiAoZ2FtZU9iamVjdHMuQmFsbHMuYmFsbHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICBnYW1lUnVubmluZyA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgZ2FtZU9iamVjdHMuU2NvcmVib2FyZC5saXZlcy5saXZlcy5wb3AoKVxyXG4gICAgICAgICAgICAgIGlmKGdhbWVPYmplY3RzLlNjb3JlYm9hcmQubGl2ZXMubGl2ZXMubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZ2FtZU92ZXIgPSB0cnVlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgIGktLVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGdhbWVPYmplY3RzLlBsYXlpbmdCb2FyZC5yb3dzLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgIGdhbWVPdmVyID0gdHJ1ZVxyXG4gICAgICAgICAgZ2FtZVJ1bm5pbmcgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG90YWxHYW1lVGltZSArPSBlbGFwc2VkVGltZVxyXG4gICAgICAgIHZhciB0aW1lU3RyaW5nID0gTWF0aC5mbG9vcih0b3RhbEdhbWVUaW1lIC8gMTAwMCAvIDYwKSArIFwiOlwiXHJcbiAgICAgICAgaWYgKE1hdGguZmxvb3IodG90YWxHYW1lVGltZSAvIDEwMDApICUgNjAgPCAxMCkge1xyXG4gICAgICAgICAgdGltZVN0cmluZyArPSBcIjBcIlxyXG4gICAgICAgIH1cclxuICAgICAgICB0aW1lU3RyaW5nICs9IE1hdGguZmxvb3IodG90YWxHYW1lVGltZSAvIDEwMDApICUgNjBcclxuICAgICAgICBnYW1lT2JqZWN0cy5TY29yZWJvYXJkLnRpbWUuc2V0VGV4dCh0aW1lU3RyaW5nKVxyXG4gICAgICAgIHZhciBzY29yZVN0cmluZyA9IFwiXCJcclxuICAgICAgICBpZihzY29yZSA8IDEwMCkgc2NvcmVTdHJpbmcgKz0gXCIwXCJcclxuICAgICAgICBpZihzY29yZSA8IDEwKSBzY29yZVN0cmluZyArPSBcIjBcIlxyXG4gICAgICAgIHNjb3JlU3RyaW5nICs9IHNjb3JlXHJcbiAgICAgICAgZ2FtZU9iamVjdHMuU2NvcmVib2FyZC5zY29yZS5zZXRUZXh0KHNjb3JlU3RyaW5nKVxyXG4gICAgICAgIGlmKCFnYW1lUnVubmluZyB8fCBnYW1lT3Zlcil7XHJcbiAgICAgICAgICBpZighZ2FtZU92ZXIgJiYgZ2FtZU9iamVjdHMuU2NvcmVib2FyZC5saXZlcy5saXZlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIG5ld0xpZmUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgZ2FtZURvbmUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKCFnYW1lT3Zlcil7XHJcbiAgICAgICAgdGltZUJlZm9yZVN0YXJ0IC09IGVsYXBzZWRUaW1lXHJcbiAgICAgICAgZ2FtZU9iamVjdHMuQmFubmVyLnRleHQuc2V0VGV4dChNYXRoLmNlaWwodGltZUJlZm9yZVN0YXJ0IC8gMTAwMCkpXHJcbiAgICAgICAgaWYgKHRpbWVCZWZvcmVTdGFydCA8IDApIHtcclxuICAgICAgICAgIGRlbGV0ZSBnYW1lT2JqZWN0cy5CYW5uZXJcclxuICAgICAgICAgIGdhbWVSdW5uaW5nID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgICAgR3JhcGhpY3MuY2xlYXIoKVxyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gZ2FtZU9iamVjdHMpIHtcclxuICAgICAgICBnYW1lT2JqZWN0c1trZXldLmRyYXcoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGV0ZWN0QWxsQ29sbGlzaW9ucyhiYWxsKSB7XHJcbiAgICAgIHZhciBjb250ID0gdHJ1ZVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdhbWVPYmplY3RzLlBsYXlpbmdCb2FyZC5yb3dzLmxlbmd0aCAmJiBjb250OyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdhbWVPYmplY3RzLlBsYXlpbmdCb2FyZC5yb3dzW2ldLmJyaWNrcy5sZW5ndGggJiYgY29udDsgaisrKSB7XHJcbiAgICAgICAgICBpZiAoZGV0ZWN0Q29sbGlzaW9uKGJhbGwsIGdhbWVPYmplY3RzLlBsYXlpbmdCb2FyZC5yb3dzW2ldLmJyaWNrc1tqXSkpIHtcclxuICAgICAgICAgICAgc2NvcmUgKz0gc2NvcmVBcnJheVtnYW1lT2JqZWN0cy5QbGF5aW5nQm9hcmQucm93c1tpXS5icmlja3Nbal0ubW9kZWwucm93XVxyXG4gICAgICAgICAgICBjdXJyZW50Um91bmRTY29yZSArPSBzY29yZUFycmF5W2dhbWVPYmplY3RzLlBsYXlpbmdCb2FyZC5yb3dzW2ldLmJyaWNrc1tqXS5tb2RlbC5yb3ddXHJcbiAgICAgICAgICAgIGN1cnJlbnRSb3VuZEhpdHMrK1xyXG4gICAgICAgICAgICBpZihmdWxsU2l6ZSAmJiAoZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3NbaV0uYnJpY2tzW2pdLm1vZGVsLnJvdyA9PSAwIHx8IGdhbWVPYmplY3RzLlBsYXlpbmdCb2FyZC5yb3dzW2ldLmJyaWNrc1tqXS5tb2RlbC5yb3cgPT0gMSkpe1xyXG4gICAgICAgICAgICAgIGZ1bGxzaXplID0gIWZ1bGxTaXplXHJcbiAgICAgICAgICAgICAgZ2FtZU9iamVjdHMuUGFkZGxlLnRvZ2dsZVNpemUoZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3NbaV0uYnJpY2tzLnNwbGljZShqLCAxKVxyXG4gICAgICAgICAgICBqLS1cclxuICAgICAgICAgICAgY29udCA9IGZhbHNlXHJcbiAgICAgICAgICAgIHN3aXRjaCAoY3VycmVudFJvdW5kSGl0cykge1xyXG4gICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIGJhbGwuc2V0U3BlZWQoNSAqIHdpZHRoIC8gOCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDEyOlxyXG4gICAgICAgICAgICAgICAgYmFsbC5zZXRTcGVlZCg3ICogd2lkdGggLyA4KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgMzY6XHJcbiAgICAgICAgICAgICAgICBiYWxsLnNldFNwZWVkKDEwICogd2lkdGggLyA4KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgNjI6XHJcbiAgICAgICAgICAgICAgICBiYWxsLnNldFNwZWVkKDEyICogd2lkdGggLyA4KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3NbaV0uYnJpY2tzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICBzY29yZSArPSAyNVxyXG4gICAgICAgICAgZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3Muc3BsaWNlKGksIDEpXHJcbiAgICAgICAgICBpLS1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRldGVjdFBhZGRsZUNvbGxpc2lvbihiYWxsLCBnYW1lT2JqZWN0cy5QYWRkbGUpXHJcbiAgICAgIHJldHVybiBkZXRlY3RXYWxsQ29sbGlzaW9uKGJhbGwpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGV0ZWN0V2FsbENvbGxpc2lvbihiYWxsKSB7XHJcbiAgICAgIC8vIENlaWxpbmdcclxuICAgICAgaWYgKGJhbGwuY2VudGVyLnkgLSBiYWxsLnJhZGl1cyA8IDEwMCkge1xyXG4gICAgICAgIGJhbGwuc2V0UG9zaXRpb24oYmFsbC5jZW50ZXIueCwgMTAwICsgYmFsbC5yYWRpdXMsIGJhbGwuZGlyZWN0aW9uLngsIC0xICogYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgfVxyXG4gICAgICAvLyBMZWZ0IFdhbGxcclxuICAgICAgaWYgKGJhbGwuY2VudGVyLnggLSBiYWxsLnJhZGl1cyA8IDApIHtcclxuICAgICAgICBiYWxsLnNldFBvc2l0aW9uKGJhbGwucmFkaXVzLCBiYWxsLmNlbnRlci55LCAtMSAqIGJhbGwuZGlyZWN0aW9uLngsIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgIH1cclxuICAgICAgLy8gUmlnaHQgV2FsbFxyXG4gICAgICBpZiAoYmFsbC5jZW50ZXIueCArIGJhbGwucmFkaXVzID4gd2lkdGgpIHtcclxuICAgICAgICBiYWxsLnNldFBvc2l0aW9uKHdpZHRoIC0gYmFsbC5yYWRpdXMsIGJhbGwuY2VudGVyLnksIC0xICogYmFsbC5kaXJlY3Rpb24ueCwgYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgfVxyXG4gICAgICBpZiAoYmFsbC5jZW50ZXIueSArIGJhbGwucmFkaXVzID4gaGVpZ2h0KSB7XHJcbiAgICAgICAgLy9SZWFsIENvZGVcclxuICAgICAgICBiYWxsLnNldFBvc2l0aW9uKGJhbGwuY2VudGVyLngsIGhlaWdodCAtIGJhbGwuY2VudGVyLnksIDAsIDApXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgICAgIC8vIEZvciBEZWJ1Z2dpbmdcclxuICAgICAgICAvLyBiYWxsLnNldFBvc2l0aW9uKGJhbGwuY2VudGVyLngsIGhlaWdodCAtIGJhbGwucmFkaXVzLCBiYWxsLmRpcmVjdGlvbi54LCAtMSAqIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZXRlY3RDb2xsaXNpb24oYmFsbCwgcmVjKSB7XHJcbiAgICAgIGlmIChiYWxsLmNlbnRlci55IC0gYmFsbC5yYWRpdXMgPiByZWMubW9kZWwucG9zLnkgKyByZWMubW9kZWwuaGVpZ2h0KSByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKGJhbGwuY2VudGVyLnkgKyBiYWxsLnJhZGl1cyA8IHJlYy5tb2RlbC5wb3MueSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmIChiYWxsLmNlbnRlci54IC0gYmFsbC5yYWRpdXMgPiByZWMubW9kZWwucG9zLnggKyByZWMubW9kZWwud2lkdGgpIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoYmFsbC5jZW50ZXIueCArIGJhbGwucmFkaXVzIDwgcmVjLm1vZGVsLnBvcy54KSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgIHZhciB0b3BEaXN0YW5jZSA9IE1hdGguYWJzKGJhbGwuY2VudGVyLnkgLSByZWMubW9kZWwucG9zLnkpXHJcbiAgICAgIHZhciBib3R0b21EaXN0YW5jZSA9IE1hdGguYWJzKGJhbGwuY2VudGVyLnkgLSAocmVjLm1vZGVsLnBvcy55ICsgcmVjLm1vZGVsLmhlaWdodCkpXHJcbiAgICAgIHZhciBsZWZ0RGlzdGFuY2UgPSBNYXRoLmFicyhiYWxsLmNlbnRlci54IC0gcmVjLm1vZGVsLnBvcy54KVxyXG4gICAgICB2YXIgcmlnaHREaXN0YW5jZSA9IE1hdGguYWJzKGJhbGwuY2VudGVyLnggLSAocmVjLm1vZGVsLnBvcy54ICsgcmVjLm1vZGVsLndpZHRoKSlcclxuXHJcbiAgICAgIC8vIENvbWluZyBpbnRvIGxlZnQgd2FsbFxyXG4gICAgICBpZiAoYmFsbC5kaXJlY3Rpb24ueCA+IDApIHtcclxuICAgICAgICAvLyBDb21pbmcgaW50byB0b3Agd2FsbFxyXG4gICAgICAgIGlmIChiYWxsLmRpcmVjdGlvbi55ID4gMCkge1xyXG4gICAgICAgICAgaWYgKHRvcERpc3RhbmNlIDwgbGVmdERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGJhbGwuc2V0UG9zaXRpb24oYmFsbC5jZW50ZXIueCwgcmVjLm1vZGVsLnBvcy55IC0gYmFsbC5yYWRpdXMsIGJhbGwuZGlyZWN0aW9uLngsIC0xICogYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKGxlZnREaXN0YW5jZSA8IHRvcERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGJhbGwuc2V0UG9zaXRpb24ocmVjLm1vZGVsLnBvcy54IC0gYmFsbC5yYWRpdXMsIGJhbGwuY2VudGVyLnksIC0xICogYmFsbC5kaXJlY3Rpb24ueCwgYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKHJlYy5tb2RlbC5wb3MueCAtIChiYWxsLnJhZGl1cyAqIDQgKiBNYXRoLlNRUlQyKSwgcmVjLm1vZGVsLnBvcy55IC0gKGJhbGwucmFkaXVzICogNCAqIE1hdGguU1FSVDIpLCAtMSAqIGJhbGwuZGlyZWN0aW9uLngsIC0xICogYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ29taW5nIGludG8gYm90dG9tIHdhbGxcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGlmIChib3R0b21EaXN0YW5jZSA8IGxlZnREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKGJhbGwuY2VudGVyLngsIHJlYy5tb2RlbC5wb3MueSArIHJlYy5tb2RlbC5oZWlnaHQgKyBiYWxsLnJhZGl1cywgYmFsbC5kaXJlY3Rpb24ueCwgLTEgKiBiYWxsLmRpcmVjdGlvbi55KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAobGVmdERpc3RhbmNlIDwgYm90dG9tRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgYmFsbC5zZXRQb3NpdGlvbihyZWMubW9kZWwucG9zLnggLSBiYWxsLnJhZGl1cywgYmFsbC5jZW50ZXIueSwgLTEgKiBiYWxsLmRpcmVjdGlvbi54LCBiYWxsLmRpcmVjdGlvbi55KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGJhbGwuc2V0UG9zaXRpb24ocmVjLm1vZGVsLnBvcy54IC0gKGJhbGwucmFkaXVzICogNCAqIE1hdGguU1FSVDIpLCByZWMubW9kZWwucG9zLnkgKyByZWMubW9kZWwuaGVpZ2h0ICsgKGJhbGwucmFkaXVzICogNCAqIE1hdGguU1FSVDIpLCAtMSAqIGJhbGwuZGlyZWN0aW9uLngsIC0xICogYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy8gQ29taW5nIGludG8gcmlnaHQgd2FsbFxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAvLyBDb21pbmcgaW50byB0b3Agd2FsbFxyXG4gICAgICAgIGlmIChiYWxsLmRpcmVjdGlvbi55ID4gMCkge1xyXG4gICAgICAgICAgaWYgKHRvcERpc3RhbmNlIDwgcmlnaHREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKGJhbGwuY2VudGVyLngsIHJlYy5tb2RlbC5wb3MueSAtIGJhbGwucmFkaXVzLCBiYWxsLmRpcmVjdGlvbi54LCAtMSAqIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChyaWdodERpc3RhbmNlIDwgdG9wRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgYmFsbC5zZXRQb3NpdGlvbihyZWMubW9kZWwucG9zLnggKyByZWMubW9kZWwud2lkdGggKyBiYWxsLnJhZGl1cywgYmFsbC5jZW50ZXIueSwgLTEgKiBiYWxsLmRpcmVjdGlvbi54LCBiYWxsLmRpcmVjdGlvbi55KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGJhbGwuc2V0UG9zaXRpb24ocmVjLm1vZGVsLnBvcy54ICsgcmVjLm1vZGVsLndpZHRoICsgKGJhbGwucmFkaXVzICogNCAqIE1hdGguU1FSVDIpLCByZWMubW9kZWwucG9zLnkgLSAoYmFsbC5yYWRpdXMgKiA0ICogTWF0aC5TUVJUMiksIC0xICogYmFsbC5kaXJlY3Rpb24ueCwgLTEgKiBiYWxsLmRpcmVjdGlvbi55KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBDb21pbmcgaW50byBib3R0b20gd2FsbFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGJvdHRvbURpc3RhbmNlIDwgcmlnaHREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKGJhbGwuY2VudGVyLngsIHJlYy5tb2RlbC5wb3MueSArIHJlYy5tb2RlbC5oZWlnaHQgKyBiYWxsLnJhZGl1cywgYmFsbC5kaXJlY3Rpb24ueCwgLTEgKiBiYWxsLmRpcmVjdGlvbi55KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAocmlnaHREaXN0YW5jZSA8IGJvdHRvbURpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGJhbGwuc2V0UG9zaXRpb24ocmVjLm1vZGVsLnBvcy54ICsgcmVjLm1vZGVsLndpZHRoICsgYmFsbC5yYWRpdXMsIGJhbGwuY2VudGVyLnksIC0xICogYmFsbC5kaXJlY3Rpb24ueCwgYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKHJlYy5tb2RlbC5wb3MueCArIHJlYy5tb2RlbC53aWR0aCArIChiYWxsLnJhZGl1cyAqIDQgKiBNYXRoLlNRUlQyKSwgcmVjLm1vZGVsLnBvcy55ICsgcmVjLm1vZGVsLmhlaWdodCArIChiYWxsLnJhZGl1cyAqIDQgKiBNYXRoLlNRUlQyKSwgLTEgKiBiYWxsLmRpcmVjdGlvbi54LCAtMSAqIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGV0ZWN0UGFkZGxlQ29sbGlzaW9uKGJhbGwsIHBhZGRsZSl7XHJcbiAgICAgIGlmIChiYWxsLmNlbnRlci55IC0gYmFsbC5yYWRpdXMgPiBwYWRkbGUucG9zLnkgKyBwYWRkbGUuaGVpZ2h0KSByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKGJhbGwuY2VudGVyLnkgKyBiYWxsLnJhZGl1cyA8IHBhZGRsZS5wb3MueSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmIChiYWxsLmNlbnRlci54IC0gYmFsbC5yYWRpdXMgPiBwYWRkbGUucG9zLnggKyBwYWRkbGUud2lkdGgpIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoYmFsbC5jZW50ZXIueCArIGJhbGwucmFkaXVzIDwgcGFkZGxlLnBvcy54KSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgIHZhciBkaXN0YW5jZSA9IChwYWRkbGUud2lkdGggLyAyKSAtIE1hdGguYWJzKGJhbGwuY2VudGVyLnggLSAocGFkZGxlLnBvcy54ICsgcGFkZGxlLndpZHRoIC8gMikpXHJcbiAgICAgIHZhciByYWRpYW5zID0gKE1hdGguUEkgLyAzKSAqIGRpc3RhbmNlIC8gKHBhZGRsZS53aWR0aCAvIDIpICsgKE1hdGguUEkgLyA2KVxyXG4gICAgICB2YXIgZGlyZWN0aW9uID0ge3g6IE1hdGguY29zKHJhZGlhbnMpLCB5OiAtMSAqIE1hdGguc2luKHJhZGlhbnMpfVxyXG4gICAgICBNb2RlbC5ub3JtYWxpemUoZGlyZWN0aW9uKVxyXG4gICAgICBpZihiYWxsLmNlbnRlci54IDwgKHBhZGRsZS5wb3MueCArIHBhZGRsZS53aWR0aC8yKSl7XHJcbiAgICAgICAgZGlyZWN0aW9uLnggKj0gLTFcclxuICAgICAgfVxyXG4gICAgICBiYWxsLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdhbWVEb25lKCl7XHJcbiAgICAgIGRlbGV0ZSBnYW1lT2JqZWN0cy5CYWxsc1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIG5hbWUgPSBwcm9tcHQoXCJZb3Ugc2NvcmVkIFwiICsgc2NvcmUgKyBcIiBpbiBcIiArIE1hdGguZmxvb3IodG90YWxHYW1lVGltZS8xMDAwKSArIFwiIHNlY29uZHNcXG5FbnRlciB5b3VyIG5hbWUhXCIpXHJcbiAgICAgICAgY29uc29sZS5sb2cobmFtZSlcclxuICAgICAgfSwyMDAwKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGF0XHJcbiAgfSgpKVxyXG5cclxuICBCcmVha291dC5pbml0aWFsaXplKClcclxufSJdfQ==
