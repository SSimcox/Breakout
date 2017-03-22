(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Steven on 3/9/2017.
 */

var Graphics = require('./Graphics')
var Random = require('./Random')
var InputMap = require('./Input')

// let Graphics, Random, InputMap

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
      draw: function () {
        this.view.draw()
      },
      toggleSize: function (fullSize) {
        if (!fullSize) {
          this.width = spec.paddleWidth / 2
        }
        else {
          this.width = spec.paddleWidth
        }
        this.view.setWidth(this.width)
      },
      update: function (elapsedTime) {
        if (InputMap.isDown(InputMap.LEFT)) {
          this.pos.x -= this.speed * elapsedTime / 1000
          if (this.pos.x < 0) {
            this.pos.x = 0
          }
          this.view.update(elapsedTime)
        }
        if (InputMap.isDown(InputMap.RIGHT)) {
          this.pos.x += this.speed * elapsedTime / 1000
          if (this.pos.x + this.width > spec.width) {
            this.pos.x = spec.width - this.width
          }
          this.view.update(elapsedTime, false)
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

  function Scoreboard(numLives, score, time) {
    return {
      board: Graphics.Rectangle({
        color: "rgb(120,188,188)",
        pos: {x: 0, y: 0},
        width: spec.width,
        height: 100,
        lineWidth: 5
      }),
      score: score || Graphics.Text({
        font: "54px myFont",
        color: "rgb(200,200,30)",
        stroke: "rgb(200,200,30)",
        rotation: 0,
        pos: {x: 45 + 8, y: 15 + 25},
        text: "000"
      }),
      time: time || Graphics.Text({
        font: "54px myFont",
        color: "rgb(200,200,30)",
        stroke: "rgb(200,200,30)",
        rotation: 0,
        pos: {x: spec.width / 2, y: 15 + 25},
        text: "0:00"
      }),
      lives: generateLives(numLives),
      draw: function () {
        this.board.draw()
        this.score.draw()
        this.time.draw()
        if (this.lives.lives.length > 0) {
          this.lives.draw()
        }
      }
    }
  }

  function ParticleSystem(){
    var that = {}
    that.particles = []
    that.ParticleEmitter = function(spec){

      for(let i = 0; i < 20; i++){
        that.particles.push(Graphics.Circle({
          center: {x: Random.nextGaussian(spec.pos.x + spec.height / 2, spec.height / 10), y: Random.nextGaussian(spec.pos.y + spec.width/2, spec.width/10)},
          radius: Random.nextGaussian(5,1),
          color: "rgb(60,60,60)",
          speed: spec.width / 2,
          direction: direction
        }))
      }


    }


    return that;
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

  function generateLives(num) {
    var that = {}
    that.lives = []
    for (let i = 0; i < num; i++) {
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
    do {
      var vector = {x: Random.nextDouble() - .5, y: Random.nextDouble() * -1}
      normalize(vector)
    } while (Math.abs(vector.x) < .2 || Math.abs(vector.x) > .8)
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
 * Created by Steven on 3/13/2017.
 */

var HighScores = (function(){
  'use strict';
  var highScores = {highScore:[]},
    previousScores = localStorage.getItem('Breakout.highScores');
  if (previousScores !== null) {
    highScores = JSON.parse(previousScores);
  }

  function add(value) {
    if(highScores.highScore.length == 0){
      highScores.highScore[0] = value
    }
    else{
      var inserted = false
      for(let i = 0; i < highScores.highScore.length && !inserted; i++){
        if(value.score > highScores.highScore[i].score || (value.score == highScores.highScore[i].score && value.time < highScores.highScore[i].time)){
          highScores.highScore.splice(i,0,value)
          inserted = true
        }
      }
      if(!inserted){
        highScores.highScore[highScores.highScore.length] = value;
      }
    }
    localStorage['Breakout.highScores'] = JSON.stringify(highScores);
  }

  function remove(key) {
    delete highScores.highScore[key];
    localStorage['Breakout.highScores'] = JSON.stringify(highScores);
  }

  function report() {
    var htmlNode = document.getElementById('score-table'),
      key;
    var scoreString = '<tr><th>Name</th><th>Score</th><th>Time</th></tr><tbody>';
    for (let i = 0; i < highScores.highScore.length; i++) {
      scoreString += ('<tr><td>'+ highScores.highScore[i].name + '</td><td>' + highScores.highScore[i].score + '</td><td>' + highScores.highScore[i].time + '</td></tr>');
    }
    scoreString +='</tbody>'
    htmlNode.innerHTML = scoreString
    htmlNode.scrollTop = htmlNode.scrollHeight;
  }

  return {
    add : add,
    remove : remove,
    report : report
  };
}())

module.exports = HighScores
},{}],6:[function(require,module,exports){
/**
 * Created by Steven on 3/7/2017.
 */

//window.onload = function () {
  /*************************************************
   * Environment Variables
   *************************************************/
  var height = document.documentElement.clientHeight * .95
  var width = height - 100
  var brickHeight = 20
  var paddleWidth = width / 5
  var Graphics = require('./Graphics')
  var InputMap = require('./Input')
  var HighScores = require('./Scoring')
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
    var retFunc
    /*************************************************
     * FPS Variables and functions
     *************************************************/
    var tickindex = 0;
    var ticksum = 0;
    var ticklist = [];
    const MAXSAMPLES = 70;
    function CalcAverageTick(newtick) {
      ticksum-=ticklist[tickindex];  /* subtract value falling off */
      ticksum+=newtick;              /* add new value */
      ticklist[tickindex]=newtick;   /* save new value so it can be subtracted later */
      if(++tickindex==MAXSAMPLES)    /* inc buffer index */
        tickindex=0;

      /* return average */
      return(Math.round(ticksum/MAXSAMPLES * 100) / 100);
    }
    /*************************************************
     * Game Functions
     *************************************************/
    that.initialize = function (retFunction) {
      // Provided for menuing
      retFunc = retFunction

      // Setup Keyboard Input
      window.addEventListener('keyup', function (event) {
        InputMap.onKeyup(event);
      }, false);
      window.addEventListener('keydown', function (event) {
        InputMap.onKeydown(event);
      }, false);

      // Initilaize graphics and game stuff
      Graphics.initialize(width, height)
      initializeObjects()
      gameRunning = false
      gameOver = false
      previousTime = performance.now()

      // Setup FPS Data
      tickindex = 0
      ticksum = 0
      for(let i = 0; i < MAXSAMPLES; ++i){
        ticklist[i] = 0;
      }

      //Start Game Loop
      requestAnimationFrame(gameLoop)
    }

    function initializeObjects() {
      totalGameTime = 0
      timeBeforeStart = 3000
      gameRunning = false
      gameObjects = {}
      gameObjects.Background = Model.Background()
      gameObjects.Scoreboard = Model.Scoreboard(3)
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

    function newRound(){
      gameObjects.Paddle = Model.Paddle()
      gameObjects.Balls.balls = [Model.Ball()]
      gameObjects.Banner = Model.Banner()
      gameObjects.PlayingBoard = Model.PlayingBoard()
      gameObjects.Scoreboard = Model.Scoreboard(gameObjects.Scoreboard.lives.lives.length + 1, gameObjects.Scoreboard.score, gameObjects.Scoreboard.time)
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
        // Update Paddle
        gameObjects.Paddle.update(elapsedTime)

        // Update Balls
        for (let i = 0; i < gameObjects.Balls.balls.length; i++) {
          gameObjects.Balls.balls[i].update(elapsedTime)

          // Detect Collisions: False means Ball exited game area
          if (!detectAllCollisions(gameObjects.Balls.balls[i])) {

            // Only one ball left
            if (gameObjects.Balls.balls.length == 1) {
              gameRunning = false
              if(gameObjects.Scoreboard.lives.lives.length == 0)
              {
                gameOver = true
              }
              else {
                gameObjects.Scoreboard.lives.lives.pop()

              }

            }
            else {
              gameObjects.Balls.balls.splice(i, 1)
              i--
            }
          }
        }

        // Check if all bricks have been cleared
        if(gameObjects.PlayingBoard.rows.length == 0){
          newRound()
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
          if(!gameOver) {
            newLife()
          }
          else{
            gameDone()
          }
        }
        let fps = Math.floor(1000 / elapsedTime * 10) / 10
        if (isNaN(fps)) fps = 0
        document.getElementById("fps").innerHTML = ` FPS: ${CalcAverageTick(fps)}`
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
            if(currentRoundScore >= 100){
              currentRoundScore-=100
              gameObjects.Balls.balls.push(Model.Ball())
              var newBall = gameObjects.Balls.balls[gameObjects.Balls.balls.length - 1]
              newBall.setPosition(gameObjects.Paddle.pos.x + gameObjects.Paddle.width / 2, gameObjects.Paddle.pos.y, newBall.direction.x,newBall.direction.y)
            }
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
      document.getElementById("fps").innerHTML = ""
      setTimeout(function(){
        var name = prompt("You scored " + score + " in " + Math.floor(totalGameTime/1000) + " seconds\nEnter your name!")
        console.log(name)
        HighScores.add({name:name,score:score,time:Math.floor(totalGameTime/1000)})
        document.getElementById("fps").innerHTML = ""
        retFunc()
      },2000)
    }

    return that
  }())

  //Breakout.initialize()
//}

module.exports = Breakout
},{"./GenerateObjects":1,"./Graphics":2,"./Input":3,"./Scoring":5}],7:[function(require,module,exports){
/**
 * Created by Steven on 3/13/2017.
 */

var Game
var root

window.onload = function(){
  Game = require('./game')
  root = document.getElementById("target")
  showMenu()
}

function playGame(){
  m.mount(root, Canvas)
  Game.initialize(showMenu)
}

function showScores(){
  var HighScores = require('./Scoring')
  m.mount(root, ScoreBoard)
  HighScores.report()
}

function showCredits(){
  m.mount(root, Credits)
}

function showMenu(){
  m.mount(root, Menu)
}

var Canvas = {
  view: function(){
    return m("canvas[id='game-canvas']")
  }
}

var Menu = {
  view: function(){
    return m("div[id='menu']",[
      m("h1[id='title']","BREAKOUT!"),
      m("button",{onclick:playGame},"Play Game"),
      m("button",{onclick:showScores},"High Scores"),
      m("button",{onclick:showCredits},"Credits")])
  }
}

var ScoreBoard = {
  view: function(){
    return m("div[id='menu']",[
      m("table[id='score-table']"),
      m("button",{onclick: showMenu},"Main Menu")])
  }
}

var Credits = {
  view: function(){
    return m("div[id='menu']",[
      m("p","Written by Steven Simcox"),
      m("p","Font By Jakob Fischer: www.pizzadude.dk"),
      m("button",{onclick: showMenu},"Main Menu")
    ])
  }
}

},{"./Scoring":5,"./game":6}]},{},[7]);
