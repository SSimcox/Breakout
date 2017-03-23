(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Steven on 3/9/2017.
 */

var Graphics = require('./Graphics')
var Random = require('./Random')
var InputMap = require('./Input')



module.exports = function (spec) {
  var colors = ["green", "blue", "orange", "yellow"]
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
      currentRoundHits: 0,
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
        pos: {x: 45 + 20, y: 15 + 25},
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
    that.ParticleEmitter = function(spec,ball){

      for(let i = 0; i < 25; i++){
        let dir = genNormalVector()
        dir = {x: ball.direction.x + dir.x, y: ball.direction.y - dir.y}
        normalize(dir)
        let r = Random.nextGaussian(5,1)
        that.particles.push(Graphics.Circle({
          center: {x: Random.nextRange(spec.model.pos.x, spec.model.pos.x + spec.model.height), y: Random.nextRange(spec.model.pos.y, spec.model.pos.y + spec.model.width)},
          radius: r,
          color: colors[Math.floor(spec.model.row/2)],
          speed: ball.speed / r * 2,
          direction: dir
        }))
        that.particles[that.particles.length - 1].timeLeft = Random.nextRange(500, 1000)
      }
    }

    that.update = function(elapsedTime){
      if(that.particles.length > 30){
        console.log(that.particles.length)
      }
      for(let i = 0; i < that.particles.length; i++){
        that.particles[i].timeLeft -= elapsedTime
        if(that.particles[i].timeLeft > 1000){
          console.log(i,":", that.particles[i].timeLeft)
        }
        that.particles[i].update(elapsedTime)
        if(that.particles[i].timeLeft <= 0){
          that.particles.splice(i,1)
          i--
        }
      }
    }

    that.draw = function(){
      for(let i = 0; i < that.particles.length; i++){
        that.particles[i].draw()
      }
    }

    return that;
  }

  /*****************************************************
   * Helper Functions to assist the generator functions
   *****************************************************/
  function generateRows() {
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
    ParticleSystem: ParticleSystem,
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

  ESC: 27,

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
    return Math.round((Math.random() * range) + min);
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
    var pauseFunc
    var paused = false

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
    that.initialize = function (retFunction, pauseFunction) {
      // Provided for menuing
      retFunc = retFunction
      pauseFunc = pauseFunction
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
      paused = false
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
      gameObjects.ParticleSystem = Model.ParticleSystem()
    }

    function newLife() {
      gameObjects.Paddle = Model.Paddle()
      gameObjects.Balls.balls = [Model.Ball()]
      gameObjects.Banner = Model.Banner()
      gameObjects.ParticleSystem = Model.ParticleSystem()
      timeBeforeStart = 3000
      currentRoundHits = 0
      currentRoundScore = 0
      fullSize = true
      gameObjects.Paddle.toggleSize(true)
      for(let i = 0; i < gameObjects.Balls.balls.length; i++){
        gameObjects.Balls.balls[i].currentRoundHits = 0
      }
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
      if(!paused) {
        update(currentTime)
        render()
        previousTime = currentTime
        if(InputMap.isDown(InputMap.ESC)){
          paused = true
          pauseFunc()
        }
        requestAnimationFrame(gameLoop)
      }
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
        gameObjects.ParticleSystem.update(elapsedTime)
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
            ball.currentRoundHits++

            if(fullSize && (gameObjects.PlayingBoard.rows[i].bricks[j].model.row == 0 /*|| gameObjects.PlayingBoard.rows[i].bricks[j].model.row == 1*/)){
              fullsize = !fullSize
              gameObjects.Paddle.toggleSize(false)
            }
            gameObjects.ParticleSystem.ParticleEmitter(gameObjects.PlayingBoard.rows[i].bricks[j], ball)
            gameObjects.PlayingBoard.rows[i].bricks.splice(j, 1)
            j--
            cont = false
            switch (ball.currentRoundHits) {
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
          currentRoundScore += 25
          gameObjects.PlayingBoard.rows.splice(i, 1)
          i--
        }
        if(currentRoundScore >= 100){
          currentRoundScore-=100
          gameObjects.Balls.balls.push(Model.Ball())
          var newBall = gameObjects.Balls.balls[gameObjects.Balls.balls.length - 1]
          newBall.setPosition(gameObjects.Paddle.pos.x + gameObjects.Paddle.width / 2, gameObjects.Paddle.pos.y, newBall.direction.x,newBall.direction.y)
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

    that.unpause = function(){
      paused = false
      gameObjects.Banner = Model.Banner()
      timeBeforeStart = 3000
      gameRunning = false
      previousTime = performance.now()
      requestAnimationFrame(gameLoop)
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

var Game, InputMap
var root

window.onload = function(){
  Game = require('./game')
  root = document.getElementById("target")
  showMenu()
}

function playGame(){
  m.mount(root, Canvas)
  Game.initialize(showMenu, showPauseMenu)
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

function resumeGame(){
  document.getElementById("game-canvas").setAttribute("class","")
  m.mount(document.getElementById("pause-div"),null)
  Game.unpause()
}

function showPauseMenu(){
  m.mount(document.getElementById("pause-div"), PauseMenu)
  document.getElementById("game-canvas").setAttribute("class","hidden")
}

var Canvas = {
  view: function(){
    return m("div",[
      m("canvas[id='game-canvas']"),
      m("div[id=pause-div]")
      ])
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

var PauseMenu = {
  view: function(){
    return m("div[id='menu']",[
      m("h1[id='title']","BREAKOUT!"),
      m("button",{onclick:resumeGame},"Resume Game"),
      m("button",{onclick:showMenu},"Quit Game"),])
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

},{"./Scoring":5,"./game":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL0dlbmVyYXRlT2JqZWN0cy5qcyIsInNjcmlwdHMvR3JhcGhpY3MuanMiLCJzY3JpcHRzL0lucHV0LmpzIiwic2NyaXB0cy9SYW5kb20uanMiLCJzY3JpcHRzL1Njb3JpbmcuanMiLCJzY3JpcHRzL2dhbWUuanMiLCJzY3JpcHRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgU3RldmVuIG9uIDMvOS8yMDE3LlxyXG4gKi9cclxuXHJcbnZhciBHcmFwaGljcyA9IHJlcXVpcmUoJy4vR3JhcGhpY3MnKVxyXG52YXIgUmFuZG9tID0gcmVxdWlyZSgnLi9SYW5kb20nKVxyXG52YXIgSW5wdXRNYXAgPSByZXF1aXJlKCcuL0lucHV0JylcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3BlYykge1xyXG4gIHZhciBjb2xvcnMgPSBbXCJncmVlblwiLCBcImJsdWVcIiwgXCJvcmFuZ2VcIiwgXCJ5ZWxsb3dcIl1cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogR2VuZXJhdG9yIEZ1bmN0aW9ucyBmb3IgdGhlIE9iamVjdHMgaW4gdGhlIGdhbWVcclxuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gIGZ1bmN0aW9uIEJhY2tncm91bmQoKSB7XHJcbiAgICByZXR1cm4gR3JhcGhpY3MuUmVjdGFuZ2xlKHtcclxuICAgICAgY29sb3I6IFwicmdiKDYwLDk0LDk0KVwiLFxyXG4gICAgICBwb3M6IHt4OiAwLCB5OiAwfSxcclxuICAgICAgd2lkdGg6IHNwZWMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogc3BlYy5oZWlnaHQsXHJcbiAgICAgIGxpbmVXaWR0aDogNVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEJhbGwoKSB7XHJcbiAgICB2YXIgZGlyZWN0aW9uID0gZ2VuTm9ybWFsVmVjdG9yKClcclxuICAgIHZhciB0aGF0ID0ge1xyXG4gICAgICBjZW50ZXI6IHt4OiBzcGVjLndpZHRoIC8gMiwgeTogc3BlYy5oZWlnaHQgLSA1MH0sXHJcbiAgICAgIHJhZGl1czogOCxcclxuICAgICAgc3BlZWQ6IHNwZWMud2lkdGggLyAyLFxyXG4gICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgICAgY3VycmVudFJvdW5kSGl0czogMCxcclxuICAgICAgdmlldzogR3JhcGhpY3MuQ2lyY2xlKHtcclxuICAgICAgICBjZW50ZXI6IHt4OiBzcGVjLndpZHRoIC8gMiwgeTogc3BlYy5oZWlnaHQgLSA1MH0sXHJcbiAgICAgICAgcmFkaXVzOiA4LFxyXG4gICAgICAgIGNvbG9yOiBcInJnYig2MCw2MCw2MClcIixcclxuICAgICAgICBzcGVlZDogc3BlYy53aWR0aCAvIDIsXHJcbiAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb25cclxuICAgICAgfSksXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnZpZXcuZHJhdygpXHJcbiAgICAgIH0sXHJcbiAgICAgIHNldFBvc2l0aW9uOiBmdW5jdGlvbiAoeCwgeSwgZHgsIGR5KSB7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIueCA9IHhcclxuICAgICAgICB0aGlzLmNlbnRlci55ID0geVxyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uLnggPSBkeFxyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uLnkgPSBkeVxyXG4gICAgICAgIHRoaXMudmlldy5zZXRQb3NpdGlvbih4LCB5LCBkeCwgZHkpXHJcbiAgICAgIH0sXHJcbiAgICAgIHNldFNwZWVkOiBmdW5jdGlvbiAoc3BlZWQpIHtcclxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWRcclxuICAgICAgICB0aGlzLnZpZXcuc2V0U3BlZWQoc3BlZWQpXHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGVsYXBzZWRUaW1lKSB7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIueCArPSB0aGlzLmRpcmVjdGlvbi54ICogdGhpcy5zcGVlZCAqIGVsYXBzZWRUaW1lIC8gMTAwMFxyXG4gICAgICAgIHRoaXMuY2VudGVyLnkgKz0gdGhpcy5kaXJlY3Rpb24ueSAqIHRoaXMuc3BlZWQgKiBlbGFwc2VkVGltZSAvIDEwMDBcclxuICAgICAgICB0aGlzLnZpZXcuc2V0UG9zaXRpb24odGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSwgdGhpcy5kaXJlY3Rpb24ueCwgdGhpcy5kaXJlY3Rpb24ueSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBCYW5uZXIoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiYW5uZXI6IEdyYXBoaWNzLlJlY3RhbmdsZSh7XHJcbiAgICAgICAgY29sb3I6IFwicmdiYSg2MCw2MCw2MCwuOSlcIixcclxuICAgICAgICBwb3M6IHt4OiAwLCB5OiBzcGVjLmhlaWdodCAvIDIgLSA1MH0sXHJcbiAgICAgICAgd2lkdGg6IHNwZWMud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiAxMDAsXHJcbiAgICAgICAgbGluZVdpZHRoOiAyXHJcbiAgICAgIH0pLFxyXG4gICAgICB0ZXh0OiBHcmFwaGljcy5UZXh0KHtcclxuICAgICAgICBmb250OiBcIjgwcHggbXlGb250XCIsXHJcbiAgICAgICAgY29sb3I6IFwicmdiKDIwMCwyMDAsMzApXCIsXHJcbiAgICAgICAgc3Ryb2tlOiBcInJnYigyMDAsMjAwLDMwKVwiLFxyXG4gICAgICAgIHJvdGF0aW9uOiAwLFxyXG4gICAgICAgIHBvczoge3g6IHNwZWMud2lkdGggLyAyICsgOCwgeTogc3BlYy5oZWlnaHQgLyAyIC0gNTAgKyAyNX0sXHJcbiAgICAgICAgLy8gcG9zOnt4OiAwLCB5OiAwfSxcclxuICAgICAgICB0ZXh0OiBcIjFcIlxyXG4gICAgICB9KSxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYmFubmVyLmRyYXcoKVxyXG4gICAgICAgIHRoaXMudGV4dC5kcmF3KClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gUGFkZGxlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmlldzogR3JhcGhpY3MuUmVjdGFuZ2xlKHtcclxuICAgICAgICBjb2xvcjogXCJyZ2JhKDI1NSwxMjAsMTIwLDEpXCIsXHJcbiAgICAgICAgcG9zOiB7eDogc3BlYy53aWR0aCAvIDIgLSBzcGVjLnBhZGRsZVdpZHRoIC8gMiwgeTogc3BlYy5oZWlnaHQgLSA0Mn0sXHJcbiAgICAgICAgd2lkdGg6IHNwZWMucGFkZGxlV2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiAxMCxcclxuICAgICAgICBsaW5lV2lkdGg6IDIsXHJcbiAgICAgICAgc3BlZWQ6IHNwZWMud2lkdGhcclxuICAgICAgfSksXHJcbiAgICAgIHBvczoge3g6IHNwZWMud2lkdGggLyAyIC0gc3BlYy5wYWRkbGVXaWR0aCAvIDIsIHk6IHNwZWMuaGVpZ2h0IC0gNDJ9LFxyXG4gICAgICB3aWR0aDogc3BlYy5wYWRkbGVXaWR0aCxcclxuICAgICAgaGVpZ2h0OiAxMCxcclxuICAgICAgc3BlZWQ6IHNwZWMud2lkdGhcclxuICAgICAgLFxyXG4gICAgICBkcmF3OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy52aWV3LmRyYXcoKVxyXG4gICAgICB9LFxyXG4gICAgICB0b2dnbGVTaXplOiBmdW5jdGlvbiAoZnVsbFNpemUpIHtcclxuICAgICAgICBpZiAoIWZ1bGxTaXplKSB7XHJcbiAgICAgICAgICB0aGlzLndpZHRoID0gc3BlYy5wYWRkbGVXaWR0aCAvIDJcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLndpZHRoID0gc3BlYy5wYWRkbGVXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZpZXcuc2V0V2lkdGgodGhpcy53aWR0aClcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZWxhcHNlZFRpbWUpIHtcclxuICAgICAgICBpZiAoSW5wdXRNYXAuaXNEb3duKElucHV0TWFwLkxFRlQpKSB7XHJcbiAgICAgICAgICB0aGlzLnBvcy54IC09IHRoaXMuc3BlZWQgKiBlbGFwc2VkVGltZSAvIDEwMDBcclxuICAgICAgICAgIGlmICh0aGlzLnBvcy54IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvcy54ID0gMFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZShlbGFwc2VkVGltZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKElucHV0TWFwLmlzRG93bihJbnB1dE1hcC5SSUdIVCkpIHtcclxuICAgICAgICAgIHRoaXMucG9zLnggKz0gdGhpcy5zcGVlZCAqIGVsYXBzZWRUaW1lIC8gMTAwMFxyXG4gICAgICAgICAgaWYgKHRoaXMucG9zLnggKyB0aGlzLndpZHRoID4gc3BlYy53aWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvcy54ID0gc3BlYy53aWR0aCAtIHRoaXMud2lkdGhcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudmlldy51cGRhdGUoZWxhcHNlZFRpbWUsIGZhbHNlKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gUGxheWluZ0JvYXJkKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcm93czogZ2VuZXJhdGVSb3dzKCksXHJcbiAgICAgIGRyYXc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdGhpcy5yb3dzW2ldLmRyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gU2NvcmVib2FyZChudW1MaXZlcywgc2NvcmUsIHRpbWUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJvYXJkOiBHcmFwaGljcy5SZWN0YW5nbGUoe1xyXG4gICAgICAgIGNvbG9yOiBcInJnYigxMjAsMTg4LDE4OClcIixcclxuICAgICAgICBwb3M6IHt4OiAwLCB5OiAwfSxcclxuICAgICAgICB3aWR0aDogc3BlYy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IDEwMCxcclxuICAgICAgICBsaW5lV2lkdGg6IDVcclxuICAgICAgfSksXHJcbiAgICAgIHNjb3JlOiBzY29yZSB8fCBHcmFwaGljcy5UZXh0KHtcclxuICAgICAgICBmb250OiBcIjU0cHggbXlGb250XCIsXHJcbiAgICAgICAgY29sb3I6IFwicmdiKDIwMCwyMDAsMzApXCIsXHJcbiAgICAgICAgc3Ryb2tlOiBcInJnYigyMDAsMjAwLDMwKVwiLFxyXG4gICAgICAgIHJvdGF0aW9uOiAwLFxyXG4gICAgICAgIHBvczoge3g6IDQ1ICsgMjAsIHk6IDE1ICsgMjV9LFxyXG4gICAgICAgIHRleHQ6IFwiMDAwXCJcclxuICAgICAgfSksXHJcbiAgICAgIHRpbWU6IHRpbWUgfHwgR3JhcGhpY3MuVGV4dCh7XHJcbiAgICAgICAgZm9udDogXCI1NHB4IG15Rm9udFwiLFxyXG4gICAgICAgIGNvbG9yOiBcInJnYigyMDAsMjAwLDMwKVwiLFxyXG4gICAgICAgIHN0cm9rZTogXCJyZ2IoMjAwLDIwMCwzMClcIixcclxuICAgICAgICByb3RhdGlvbjogMCxcclxuICAgICAgICBwb3M6IHt4OiBzcGVjLndpZHRoIC8gMiwgeTogMTUgKyAyNX0sXHJcbiAgICAgICAgdGV4dDogXCIwOjAwXCJcclxuICAgICAgfSksXHJcbiAgICAgIGxpdmVzOiBnZW5lcmF0ZUxpdmVzKG51bUxpdmVzKSxcclxuICAgICAgZHJhdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYm9hcmQuZHJhdygpXHJcbiAgICAgICAgdGhpcy5zY29yZS5kcmF3KClcclxuICAgICAgICB0aGlzLnRpbWUuZHJhdygpXHJcbiAgICAgICAgaWYgKHRoaXMubGl2ZXMubGl2ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5saXZlcy5kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFBhcnRpY2xlU3lzdGVtKCl7XHJcbiAgICB2YXIgdGhhdCA9IHt9XHJcbiAgICB0aGF0LnBhcnRpY2xlcyA9IFtdXHJcbiAgICB0aGF0LlBhcnRpY2xlRW1pdHRlciA9IGZ1bmN0aW9uKHNwZWMsYmFsbCl7XHJcblxyXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgMjU7IGkrKyl7XHJcbiAgICAgICAgbGV0IGRpciA9IGdlbk5vcm1hbFZlY3RvcigpXHJcbiAgICAgICAgZGlyID0ge3g6IGJhbGwuZGlyZWN0aW9uLnggKyBkaXIueCwgeTogYmFsbC5kaXJlY3Rpb24ueSAtIGRpci55fVxyXG4gICAgICAgIG5vcm1hbGl6ZShkaXIpXHJcbiAgICAgICAgbGV0IHIgPSBSYW5kb20ubmV4dEdhdXNzaWFuKDUsMSlcclxuICAgICAgICB0aGF0LnBhcnRpY2xlcy5wdXNoKEdyYXBoaWNzLkNpcmNsZSh7XHJcbiAgICAgICAgICBjZW50ZXI6IHt4OiBSYW5kb20ubmV4dFJhbmdlKHNwZWMubW9kZWwucG9zLngsIHNwZWMubW9kZWwucG9zLnggKyBzcGVjLm1vZGVsLmhlaWdodCksIHk6IFJhbmRvbS5uZXh0UmFuZ2Uoc3BlYy5tb2RlbC5wb3MueSwgc3BlYy5tb2RlbC5wb3MueSArIHNwZWMubW9kZWwud2lkdGgpfSxcclxuICAgICAgICAgIHJhZGl1czogcixcclxuICAgICAgICAgIGNvbG9yOiBjb2xvcnNbTWF0aC5mbG9vcihzcGVjLm1vZGVsLnJvdy8yKV0sXHJcbiAgICAgICAgICBzcGVlZDogYmFsbC5zcGVlZCAvIHIgKiAyLFxyXG4gICAgICAgICAgZGlyZWN0aW9uOiBkaXJcclxuICAgICAgICB9KSlcclxuICAgICAgICB0aGF0LnBhcnRpY2xlc1t0aGF0LnBhcnRpY2xlcy5sZW5ndGggLSAxXS50aW1lTGVmdCA9IFJhbmRvbS5uZXh0UmFuZ2UoNTAwLCAxMDAwKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhhdC51cGRhdGUgPSBmdW5jdGlvbihlbGFwc2VkVGltZSl7XHJcbiAgICAgIGlmKHRoYXQucGFydGljbGVzLmxlbmd0aCA+IDMwKXtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGF0LnBhcnRpY2xlcy5sZW5ndGgpXHJcbiAgICAgIH1cclxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoYXQucGFydGljbGVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB0aGF0LnBhcnRpY2xlc1tpXS50aW1lTGVmdCAtPSBlbGFwc2VkVGltZVxyXG4gICAgICAgIGlmKHRoYXQucGFydGljbGVzW2ldLnRpbWVMZWZ0ID4gMTAwMCl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhpLFwiOlwiLCB0aGF0LnBhcnRpY2xlc1tpXS50aW1lTGVmdClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhhdC5wYXJ0aWNsZXNbaV0udXBkYXRlKGVsYXBzZWRUaW1lKVxyXG4gICAgICAgIGlmKHRoYXQucGFydGljbGVzW2ldLnRpbWVMZWZ0IDw9IDApe1xyXG4gICAgICAgICAgdGhhdC5wYXJ0aWNsZXMuc3BsaWNlKGksMSlcclxuICAgICAgICAgIGktLVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQuZHJhdyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGF0LnBhcnRpY2xlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdGhhdC5wYXJ0aWNsZXNbaV0uZHJhdygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhhdDtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAqIEhlbHBlciBGdW5jdGlvbnMgdG8gYXNzaXN0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb25zXHJcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gIGZ1bmN0aW9uIGdlbmVyYXRlUm93cygpIHtcclxuICAgIHZhciByb3dzID0gW11cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgKytpKSB7XHJcbiAgICAgIHJvd3MucHVzaChnZW5lcmF0ZVJvdyhjb2xvcnNbTWF0aC5mbG9vcihpIC8gMildLCBpKSlcclxuICAgIH1cclxuICAgIHJldHVybiByb3dzXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZW5lcmF0ZVJvdyhjb2xvciwgcm93UG9zKSB7XHJcbiAgICB2YXIgcm93ID0ge31cclxuICAgIHJvdy5icmlja3MgPSBbXVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNDsgKytpKSB7XHJcbiAgICAgIGxldCB4ID0gaSAqIChzcGVjLndpZHRoIC8gMTQpICsgMlxyXG4gICAgICByb3cuYnJpY2tzLnB1c2goe1xyXG4gICAgICAgIHZpZXc6IEdyYXBoaWNzLlJlY3RhbmdsZSh7XHJcbiAgICAgICAgICBjb2xvcjogY29sb3IsXHJcbiAgICAgICAgICBwb3M6IHt4OiB4LCB5OiAyMDAgKyByb3dQb3MgKiBzcGVjLmJyaWNrSGVpZ2h0ICsgMn0sXHJcbiAgICAgICAgICB3aWR0aDogc3BlYy53aWR0aCAvIDE0IC0gNCxcclxuICAgICAgICAgIGhlaWdodDogc3BlYy5icmlja0hlaWdodCxcclxuICAgICAgICAgIGxpbmVXaWR0aDogMlxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICBwb3M6IHt4OiB4LCB5OiAyMDAgKyByb3dQb3MgKiBzcGVjLmJyaWNrSGVpZ2h0ICsgMn0sXHJcbiAgICAgICAgICB3aWR0aDogc3BlYy53aWR0aCAvIDE0IC0gNCxcclxuICAgICAgICAgIGhlaWdodDogc3BlYy5icmlja0hlaWdodCxcclxuICAgICAgICAgIHJvdzogcm93UG9zXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgcm93LmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93LmJyaWNrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHJvdy5icmlja3NbaV0udmlldy5kcmF3KClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJvd1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuZXJhdGVMaXZlcyhudW0pIHtcclxuICAgIHZhciB0aGF0ID0ge31cclxuICAgIHRoYXQubGl2ZXMgPSBbXVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW07IGkrKykge1xyXG4gICAgICB0aGF0LmxpdmVzLnB1c2goR3JhcGhpY3MuUmVjdGFuZ2xlKHtcclxuICAgICAgICBjb2xvcjogXCJyZ2JhKDI1NSwxMjAsMTIwLDEpXCIsXHJcbiAgICAgICAgcG9zOiB7eDogc3BlYy53aWR0aCAtIHNwZWMucGFkZGxlV2lkdGggLSAxNSwgeTogaSAqIDIwICsgMzB9LFxyXG4gICAgICAgIHdpZHRoOiBzcGVjLnBhZGRsZVdpZHRoLFxyXG4gICAgICAgIGhlaWdodDogMTAsXHJcbiAgICAgICAgbGluZVdpZHRoOiAyXHJcbiAgICAgIH0pKVxyXG4gICAgfVxyXG4gICAgdGhhdC5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoYXQubGl2ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGF0LmxpdmVzW2ldLmRyYXcoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhhdFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuTm9ybWFsVmVjdG9yKCkge1xyXG4gICAgZG8ge1xyXG4gICAgICB2YXIgdmVjdG9yID0ge3g6IFJhbmRvbS5uZXh0RG91YmxlKCkgLSAuNSwgeTogUmFuZG9tLm5leHREb3VibGUoKSAqIC0xfVxyXG4gICAgICBub3JtYWxpemUodmVjdG9yKVxyXG4gICAgfSB3aGlsZSAoTWF0aC5hYnModmVjdG9yLngpIDwgLjIgfHwgTWF0aC5hYnModmVjdG9yLngpID4gLjgpXHJcbiAgICByZXR1cm4gdmVjdG9yXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBub3JtYWxpemUodmVjdG9yKSB7XHJcbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHZlY3Rvci54ICogdmVjdG9yLnggKyB2ZWN0b3IueSAqIHZlY3Rvci55KVxyXG4gICAgdmVjdG9yLnggLz0gbGVuZ3RoXHJcbiAgICB2ZWN0b3IueSAvPSBsZW5ndGhcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgQmFja2dyb3VuZDogQmFja2dyb3VuZCxcclxuICAgIEJhbGw6IEJhbGwsXHJcbiAgICBCYW5uZXI6IEJhbm5lcixcclxuICAgIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxyXG4gICAgUGFkZGxlOiBQYWRkbGUsXHJcbiAgICBQYXJ0aWNsZVN5c3RlbTogUGFydGljbGVTeXN0ZW0sXHJcbiAgICBQbGF5aW5nQm9hcmQ6IFBsYXlpbmdCb2FyZCxcclxuICAgIFNjb3JlYm9hcmQ6IFNjb3JlYm9hcmRcclxuICB9XHJcbn0iLCIvKipcclxuICogQ3JlYXRlZCBieSBTdGV2ZW4gb24gMy85LzIwMTcuXHJcbiAqL1xyXG5cclxudmFyIEdyYXBoaWNzID0gKGZ1bmN0aW9uICgpIHtcclxuICB2YXIgY29udGV4dFxyXG5cclxuICBmdW5jdGlvbiBpbml0aWFsaXplKHdpZHRoLGhlaWdodCkge1xyXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jYW52YXNcIilcclxuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoXHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0XHJcbiAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHJcblxyXG4gICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5zYXZlKCk7XHJcbiAgICAgIHRoaXMuc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xyXG4gICAgICB0aGlzLmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICB0aGlzLnJlc3RvcmUoKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGVhcigpe1xyXG4gICAgY29udGV4dC5jbGVhcigpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBDaXJjbGUoc3BlYyl7XHJcbiAgICB2YXIgdGhhdCA9IHt9XHJcblxyXG4gICAgdGhhdC5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKHgseSxkeCxkeSl7XHJcbiAgICAgIHNwZWMuY2VudGVyLnggPSB4XHJcbiAgICAgIHNwZWMuY2VudGVyLnkgPSB5XHJcbiAgICAgIHNwZWMuZGlyZWN0aW9uLnggPSBkeFxyXG4gICAgICBzcGVjLmRpcmVjdGlvbi55ID0gZHlcclxuICAgIH1cclxuXHJcbiAgICB0aGF0LnNldFNwZWVkID0gZnVuY3Rpb24oc3BlZWQpe1xyXG4gICAgICBzcGVjLnNwZWVkID0gc3BlZWRcclxuICAgIH1cclxuXHJcbiAgICB0aGF0LnVwZGF0ZSA9IGZ1bmN0aW9uKGVsYXBzZWRUaW1lKXtcclxuICAgICAgc3BlYy5jZW50ZXIueCArPSBzcGVjLmRpcmVjdGlvbi54ICogc3BlYy5zcGVlZCAqIGVsYXBzZWRUaW1lIC8gMTAwMFxyXG4gICAgICBzcGVjLmNlbnRlci55ICs9IHNwZWMuZGlyZWN0aW9uLnkgKiBzcGVjLnNwZWVkICogZWxhcHNlZFRpbWUgLyAxMDAwXHJcbiAgICB9XHJcblxyXG4gICAgdGhhdC5kcmF3ID0gZnVuY3Rpb24oKXtcclxuICAgICAgY29udGV4dC5zYXZlKClcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBzcGVjLmNvbG9yXHJcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKClcclxuICAgICAgY29udGV4dC5hcmMoc3BlYy5jZW50ZXIueCwgc3BlYy5jZW50ZXIueSwgc3BlYy5yYWRpdXMsIDAsIDIqTWF0aC5QSSlcclxuICAgICAgY29udGV4dC5maWxsKClcclxuICAgICAgY29udGV4dC5zdHJva2UoKVxyXG4gICAgICBjb250ZXh0LnJlc3RvcmUoKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGF0XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBSZWN0YW5nbGUoc3BlYykge1xyXG4gICAgdmFyIHRoYXQgPSB7fVxyXG5cclxuICAgIGV4aXN0cyA9IHRydWVcclxuXHJcbiAgICB0aGF0LnVwZGF0ZSA9IGZ1bmN0aW9uKGVsYXBzZWRUaW1lLG1vdmUgPSB0cnVlKXtcclxuICAgICAgaWYoIW1vdmUpIHtcclxuICAgICAgICBzcGVjLnBvcy54ICs9IHNwZWMuc3BlZWQgKiBlbGFwc2VkVGltZSAvIDEwMDBcclxuICAgICAgICBpZihzcGVjLnBvcy54ICsgc3BlYy53aWR0aCA+IGNvbnRleHQuY2FudmFzLndpZHRoKXtcclxuICAgICAgICAgIHNwZWMucG9zLnggPSBjb250ZXh0LmNhbnZhcy53aWR0aCAtIHNwZWMud2lkdGhcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYobW92ZSl7XHJcbiAgICAgICAgc3BlYy5wb3MueCAtPSBzcGVjLnNwZWVkICogZWxhcHNlZFRpbWUgLyAxMDAwXHJcbiAgICAgICAgaWYoc3BlYy5wb3MueCA8IDApe1xyXG4gICAgICAgICAgc3BlYy5wb3MueCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGF0LnNldFdpZHRoID0gZnVuY3Rpb24od2lkdGgpe1xyXG4gICAgICBzcGVjLndpZHRoID0gd2lkdGhcclxuICAgIH1cclxuXHJcbiAgICB0aGF0LmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChleGlzdHMpIHtcclxuICAgICAgICBjb250ZXh0LnNhdmUoKVxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gc3BlYy5jb2xvclxyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gc3BlYy5saW5lV2lkdGhcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KHNwZWMucG9zLngsIHNwZWMucG9zLnksIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0KVxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlUmVjdChzcGVjLnBvcy54LCBzcGVjLnBvcy55LCBzcGVjLndpZHRoLCBzcGVjLmhlaWdodClcclxuICAgICAgICBjb250ZXh0LnJlc3RvcmUoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoYXRcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFRleHQoc3BlYykge1xyXG4gICAgdmFyIHRoYXQgPSB7fTtcclxuXHJcbiAgICB0aGF0LnVwZGF0ZVJvdGF0aW9uID0gZnVuY3Rpb24oYW5nbGUpIHtcclxuICAgICAgc3BlYy5yb3RhdGlvbiArPSBhbmdsZTtcclxuICAgIH07XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vXHJcbiAgICAvLyBUaGlzIHJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgc3BlY2lmaWVkIGZvbnQsIGluIHBpeGVscy5cclxuICAgIC8vXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgZnVuY3Rpb24gbWVhc3VyZVRleHRIZWlnaHQoc3BlYykge1xyXG4gICAgICBjb250ZXh0LnNhdmUoKTtcclxuXHJcbiAgICAgIGNvbnRleHQuZm9udCA9IHNwZWMuZm9udDtcclxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBzcGVjLmZpbGw7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzcGVjLnN0cm9rZTtcclxuXHJcbiAgICAgIHZhciBoZWlnaHQgPSBjb250ZXh0Lm1lYXN1cmVUZXh0KCdtJykud2lkdGg7XHJcblxyXG4gICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgIHJldHVybiBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vXHJcbiAgICAvLyBUaGlzIHJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSBzcGVjaWZpZWQgZm9udCwgaW4gcGl4ZWxzLlxyXG4gICAgLy9cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBmdW5jdGlvbiBtZWFzdXJlVGV4dFdpZHRoKHNwZWMpIHtcclxuICAgICAgY29udGV4dC5zYXZlKCk7XHJcblxyXG4gICAgICBjb250ZXh0LmZvbnQgPSBzcGVjLmZvbnQ7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gc3BlYy5maWxsO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gc3BlYy5zdHJva2U7XHJcblxyXG4gICAgICB2YXIgd2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHNwZWMudGV4dCkud2lkdGg7XHJcblxyXG4gICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgIHJldHVybiB3aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICB0aGF0LmRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgY29udGV4dC5zYXZlKCk7XHJcblxyXG4gICAgICBjb250ZXh0LmZvbnQgPSBzcGVjLmZvbnQ7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gc3BlYy5maWxsO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gc3BlYy5zdHJva2U7XHJcbiAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ3RvcCc7XHJcblxyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShzcGVjLnBvcy54ICsgdGhhdC53aWR0aCAvIDIsIHNwZWMucG9zLnkgKyB0aGF0LmhlaWdodCAvIDIpO1xyXG4gICAgICBjb250ZXh0LnJvdGF0ZShzcGVjLnJvdGF0aW9uKTtcclxuICAgICAgY29udGV4dC50cmFuc2xhdGUoLShzcGVjLnBvcy54ICsgdGhhdC53aWR0aCAvIDIpLCAtKHNwZWMucG9zLnkgKyB0aGF0LmhlaWdodCAvIDIpKTtcclxuXHJcbiAgICAgIGNvbnRleHQuZmlsbFRleHQoc3BlYy50ZXh0LCBzcGVjLnBvcy54IC0gKHRoYXQud2lkdGggLyAyKSwgc3BlYy5wb3MueSAtICh0aGF0LmhlaWdodCAvIDIpKTtcclxuICAgICAgY29udGV4dC5zdHJva2VUZXh0KHNwZWMudGV4dCwgc3BlYy5wb3MueCAtICh0aGF0LndpZHRoIC8gMiksIHNwZWMucG9zLnkgLSAodGhhdC5oZWlnaHQgLyAyKSk7XHJcblxyXG4gICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhhdC5zZXRUZXh0PSBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgc3BlYy50ZXh0ID0gdGV4dFxyXG4gICAgfVxyXG4gICAgLy9cclxuICAgIC8vIENvbXB1dGUgYW5kIGV4cG9zZSBzb21lIHB1YmxpYyBwcm9wZXJ0aWVzIGZvciB0aGlzIHRleHQuXHJcbiAgICB0aGF0LmhlaWdodCA9IG1lYXN1cmVUZXh0SGVpZ2h0KHNwZWMpO1xyXG4gICAgdGhhdC53aWR0aCA9IG1lYXN1cmVUZXh0V2lkdGgoc3BlYyk7XHJcbiAgICB0aGF0LnBvcyA9IHNwZWMucG9zO1xyXG5cclxuICAgIHJldHVybiB0aGF0O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIENpcmNsZTogQ2lyY2xlLFxyXG4gICAgY2xlYXI6IGNsZWFyLFxyXG4gICAgaW5pdGlhbGl6ZTogaW5pdGlhbGl6ZSxcclxuICAgIFJlY3RhbmdsZTogUmVjdGFuZ2xlLFxyXG4gICAgVGV4dDogVGV4dFxyXG4gIH1cclxufSgpKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHcmFwaGljcyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFN0ZXZlbiBvbiAzLzkvMjAxNy5cclxuICovXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcclxuIElucHV0IEhhbmRsZXJcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcblxyXG5sZXQgSW5wdXRNYXAgPSB7XHJcbiAgX3ByZXNzZWQ6IHt9LFxyXG5cclxuICBMRUZUOiAzNyxcclxuICBVUDogMzgsXHJcbiAgUklHSFQ6IDM5LFxyXG4gIERPV046IDQwLFxyXG5cclxuICBXOiA4NyxcclxuICBBOiA2NSxcclxuICBTOiA4MyxcclxuICBEOiA2OCxcclxuXHJcbiAgSTogNzMsXHJcbiAgSjogNzQsXHJcbiAgSzogNzUsXHJcbiAgTDogNzYsXHJcblxyXG4gIFA6IDgwLFxyXG4gIEg6IDcyLFxyXG4gIFk6IDg5LFxyXG4gIEI6IDY2LFxyXG5cclxuICBFU0M6IDI3LFxyXG5cclxuICBpc0Rvd246IGZ1bmN0aW9uIChrZXlDb2RlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcHJlc3NlZFtrZXlDb2RlXTtcclxuICB9LFxyXG5cclxuICBvbktleWRvd246IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdGhpcy5fcHJlc3NlZFtldmVudC5rZXlDb2RlXSA9IHRydWU7XHJcbiAgfSxcclxuXHJcbiAgb25LZXl1cDogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQua2V5Q29kZSBpbiB0aGlzLl9wcmVzc2VkKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9wcmVzc2VkW2V2ZW50LmtleUNvZGVdO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXRNYXAiLCIvKipcclxuICogQ3JlYXRlZCBieSBTdGV2ZW4gb24gMy85LzIwMTcuXHJcbiAqL1xyXG5cclxudmFyIFJhbmRvbSA9IChmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGZ1bmN0aW9uIG5leHREb3VibGUoKSB7XHJcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG5leHRSYW5nZShtaW4sIG1heCkge1xyXG4gICAgdmFyIHJhbmdlID0gbWF4IC0gbWluICsgMTtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKChNYXRoLnJhbmRvbSgpICogcmFuZ2UpICsgbWluKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG5leHRDaXJjbGVWZWN0b3IoKSB7XHJcbiAgICB2YXIgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiBNYXRoLmNvcyhhbmdsZSksXHJcbiAgICAgIHk6IE1hdGguc2luKGFuZ2xlKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vXHJcbiAgLy8gVGhpcyBpcyB1c2VkIHRvIGdpdmUgYSBzbWFsbCBwZXJmb3JtYW5jZSBvcHRpbWl6YXRpb24gaW4gZ2VuZXJhdGluZyBnYXVzc2lhbiByYW5kb20gbnVtYmVycy5cclxuICB2YXIgdXNlUHJldmlvdXMgPSBmYWxzZSxcclxuICAgIHkyO1xyXG5cclxuICAvL1xyXG4gIC8vIEdlbmVyYXRlIGEgbm9ybWFsbHkgZGlzdHJpYnV0ZWQgcmFuZG9tIG51bWJlci5cclxuICAvL1xyXG4gIC8vIE5PVEU6IFRoaXMgY29kZSBpcyBhZGFwdGVkIGZyb20gYSB3aWtpIHJlZmVyZW5jZSBJIGZvdW5kIGEgbG9uZyB0aW1lIGFnby4gIEkgb3JpZ2luYWxseVxyXG4gIC8vIHdyb3RlIHRoZSBjb2RlIGluIEMjIGFuZCBhbSBub3cgY29udmVydGluZyBpdCBvdmVyIHRvIEphdmFTY3JpcHQuXHJcbiAgLy9cclxuICBmdW5jdGlvbiBuZXh0R2F1c3NpYW4obWVhbiwgc3RkRGV2KSB7XHJcbiAgICBpZiAodXNlUHJldmlvdXMpIHtcclxuICAgICAgdXNlUHJldmlvdXMgPSBmYWxzZTtcclxuICAgICAgcmV0dXJuIG1lYW4gKyB5MiAqIHN0ZERldjtcclxuICAgIH1cclxuXHJcbiAgICB1c2VQcmV2aW91cyA9IHRydWU7XHJcblxyXG4gICAgdmFyIHgxID0gMCxcclxuICAgICAgeDIgPSAwLFxyXG4gICAgICB5MSA9IDAsXHJcbiAgICAgIHogPSAwO1xyXG5cclxuICAgIGRvIHtcclxuICAgICAgeDEgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgIHgyID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xyXG4gICAgICB6ID0gKHgxICogeDEpICsgKHgyICogeDIpO1xyXG4gICAgfSB3aGlsZSAoeiA+PSAxKTtcclxuXHJcbiAgICB6ID0gTWF0aC5zcXJ0KCgtMiAqIE1hdGgubG9nKHopKSAvIHopO1xyXG4gICAgeTEgPSB4MSAqIHo7XHJcbiAgICB5MiA9IHgyICogejtcclxuXHJcbiAgICByZXR1cm4gbWVhbiArIHkxICogc3RkRGV2O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG5leHREb3VibGUgOiBuZXh0RG91YmxlLFxyXG4gICAgbmV4dFJhbmdlIDogbmV4dFJhbmdlLFxyXG4gICAgbmV4dENpcmNsZVZlY3RvciA6IG5leHRDaXJjbGVWZWN0b3IsXHJcbiAgICBuZXh0R2F1c3NpYW4gOiBuZXh0R2F1c3NpYW5cclxuICB9O1xyXG5cclxufSgpKTtcclxubW9kdWxlLmV4cG9ydHMgPSBSYW5kb20iLCIvKipcclxuICogQ3JlYXRlZCBieSBTdGV2ZW4gb24gMy8xMy8yMDE3LlxyXG4gKi9cclxuXHJcbnZhciBIaWdoU2NvcmVzID0gKGZ1bmN0aW9uKCl7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIHZhciBoaWdoU2NvcmVzID0ge2hpZ2hTY29yZTpbXX0sXHJcbiAgICBwcmV2aW91c1Njb3JlcyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdCcmVha291dC5oaWdoU2NvcmVzJyk7XHJcbiAgaWYgKHByZXZpb3VzU2NvcmVzICE9PSBudWxsKSB7XHJcbiAgICBoaWdoU2NvcmVzID0gSlNPTi5wYXJzZShwcmV2aW91c1Njb3Jlcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGQodmFsdWUpIHtcclxuICAgIGlmKGhpZ2hTY29yZXMuaGlnaFNjb3JlLmxlbmd0aCA9PSAwKXtcclxuICAgICAgaGlnaFNjb3Jlcy5oaWdoU2NvcmVbMF0gPSB2YWx1ZVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgdmFyIGluc2VydGVkID0gZmFsc2VcclxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGhpZ2hTY29yZXMuaGlnaFNjb3JlLmxlbmd0aCAmJiAhaW5zZXJ0ZWQ7IGkrKyl7XHJcbiAgICAgICAgaWYodmFsdWUuc2NvcmUgPiBoaWdoU2NvcmVzLmhpZ2hTY29yZVtpXS5zY29yZSB8fCAodmFsdWUuc2NvcmUgPT0gaGlnaFNjb3Jlcy5oaWdoU2NvcmVbaV0uc2NvcmUgJiYgdmFsdWUudGltZSA8IGhpZ2hTY29yZXMuaGlnaFNjb3JlW2ldLnRpbWUpKXtcclxuICAgICAgICAgIGhpZ2hTY29yZXMuaGlnaFNjb3JlLnNwbGljZShpLDAsdmFsdWUpXHJcbiAgICAgICAgICBpbnNlcnRlZCA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYoIWluc2VydGVkKXtcclxuICAgICAgICBoaWdoU2NvcmVzLmhpZ2hTY29yZVtoaWdoU2NvcmVzLmhpZ2hTY29yZS5sZW5ndGhdID0gdmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxvY2FsU3RvcmFnZVsnQnJlYWtvdXQuaGlnaFNjb3JlcyddID0gSlNPTi5zdHJpbmdpZnkoaGlnaFNjb3Jlcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW1vdmUoa2V5KSB7XHJcbiAgICBkZWxldGUgaGlnaFNjb3Jlcy5oaWdoU2NvcmVba2V5XTtcclxuICAgIGxvY2FsU3RvcmFnZVsnQnJlYWtvdXQuaGlnaFNjb3JlcyddID0gSlNPTi5zdHJpbmdpZnkoaGlnaFNjb3Jlcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXBvcnQoKSB7XHJcbiAgICB2YXIgaHRtbE5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmUtdGFibGUnKSxcclxuICAgICAga2V5O1xyXG4gICAgdmFyIHNjb3JlU3RyaW5nID0gJzx0cj48dGg+TmFtZTwvdGg+PHRoPlNjb3JlPC90aD48dGg+VGltZTwvdGg+PC90cj48dGJvZHk+JztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGlnaFNjb3Jlcy5oaWdoU2NvcmUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgc2NvcmVTdHJpbmcgKz0gKCc8dHI+PHRkPicrIGhpZ2hTY29yZXMuaGlnaFNjb3JlW2ldLm5hbWUgKyAnPC90ZD48dGQ+JyArIGhpZ2hTY29yZXMuaGlnaFNjb3JlW2ldLnNjb3JlICsgJzwvdGQ+PHRkPicgKyBoaWdoU2NvcmVzLmhpZ2hTY29yZVtpXS50aW1lICsgJzwvdGQ+PC90cj4nKTtcclxuICAgIH1cclxuICAgIHNjb3JlU3RyaW5nICs9JzwvdGJvZHk+J1xyXG4gICAgaHRtbE5vZGUuaW5uZXJIVE1MID0gc2NvcmVTdHJpbmdcclxuICAgIGh0bWxOb2RlLnNjcm9sbFRvcCA9IGh0bWxOb2RlLnNjcm9sbEhlaWdodDtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBhZGQgOiBhZGQsXHJcbiAgICByZW1vdmUgOiByZW1vdmUsXHJcbiAgICByZXBvcnQgOiByZXBvcnRcclxuICB9O1xyXG59KCkpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhpZ2hTY29yZXMiLCIvKipcclxuICogQ3JlYXRlZCBieSBTdGV2ZW4gb24gMy83LzIwMTcuXHJcbiAqL1xyXG5cclxuLy93aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogRW52aXJvbm1lbnQgVmFyaWFibGVzXHJcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgdmFyIGhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgKiAuOTVcclxuICB2YXIgd2lkdGggPSBoZWlnaHQgLSAxMDBcclxuICB2YXIgYnJpY2tIZWlnaHQgPSAyMFxyXG4gIHZhciBwYWRkbGVXaWR0aCA9IHdpZHRoIC8gNVxyXG4gIHZhciBHcmFwaGljcyA9IHJlcXVpcmUoJy4vR3JhcGhpY3MnKVxyXG4gIHZhciBJbnB1dE1hcCA9IHJlcXVpcmUoJy4vSW5wdXQnKVxyXG4gIHZhciBIaWdoU2NvcmVzID0gcmVxdWlyZSgnLi9TY29yaW5nJylcclxuICB2YXIgTW9kZWwgPSByZXF1aXJlKCcuL0dlbmVyYXRlT2JqZWN0cycpKHtcclxuICAgIHdpZHRoOiB3aWR0aCxcclxuICAgIGhlaWdodDogaGVpZ2h0LFxyXG4gICAgYnJpY2tIZWlnaHQ6IGJyaWNrSGVpZ2h0LFxyXG4gICAgcGFkZGxlV2lkdGg6IHBhZGRsZVdpZHRoXHJcbiAgfSlcclxuXHJcblxyXG4gIHZhciBCcmVha291dCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgdGhhdCA9IHt9XHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICpHYW1lIE9iamVjdHMgYW5kIFZhcmlhYmxlc1xyXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICB2YXIgcHJldmlvdXNUaW1lXHJcbiAgICB2YXIgdG90YWxHYW1lVGltZVxyXG4gICAgdmFyIHRpbWVCZWZvcmVTdGFydFxyXG4gICAgdmFyIGdhbWVSdW5uaW5nID0gZmFsc2VcclxuICAgIHZhciBnYW1lT3ZlciA9IGZhbHNlXHJcbiAgICB2YXIgZ2FtZU9iamVjdHMgPSB7fVxyXG4gICAgdmFyIHNjb3JlID0gMDtcclxuICAgIHZhciBjdXJyZW50Um91bmRTY29yZSA9IDBcclxuICAgIHZhciBzY29yZUFycmF5ID0gWzUsIDUsIDMsIDMsIDIsIDIsIDEsIDFdXHJcbiAgICB2YXIgY3VycmVudFJvdW5kSGl0cyA9IDBcclxuICAgIHZhciBmdWxsU2l6ZSA9IHRydWVcclxuICAgIHZhciByZXRGdW5jXHJcbiAgICB2YXIgcGF1c2VGdW5jXHJcbiAgICB2YXIgcGF1c2VkID0gZmFsc2VcclxuXHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICogRlBTIFZhcmlhYmxlcyBhbmQgZnVuY3Rpb25zXHJcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIHZhciB0aWNraW5kZXggPSAwO1xyXG4gICAgdmFyIHRpY2tzdW0gPSAwO1xyXG4gICAgdmFyIHRpY2tsaXN0ID0gW107XHJcbiAgICBjb25zdCBNQVhTQU1QTEVTID0gNzA7XHJcbiAgICBmdW5jdGlvbiBDYWxjQXZlcmFnZVRpY2sobmV3dGljaykge1xyXG4gICAgICB0aWNrc3VtLT10aWNrbGlzdFt0aWNraW5kZXhdOyAgLyogc3VidHJhY3QgdmFsdWUgZmFsbGluZyBvZmYgKi9cclxuICAgICAgdGlja3N1bSs9bmV3dGljazsgICAgICAgICAgICAgIC8qIGFkZCBuZXcgdmFsdWUgKi9cclxuICAgICAgdGlja2xpc3RbdGlja2luZGV4XT1uZXd0aWNrOyAgIC8qIHNhdmUgbmV3IHZhbHVlIHNvIGl0IGNhbiBiZSBzdWJ0cmFjdGVkIGxhdGVyICovXHJcbiAgICAgIGlmKCsrdGlja2luZGV4PT1NQVhTQU1QTEVTKSAgICAvKiBpbmMgYnVmZmVyIGluZGV4ICovXHJcbiAgICAgICAgdGlja2luZGV4PTA7XHJcblxyXG4gICAgICAvKiByZXR1cm4gYXZlcmFnZSAqL1xyXG4gICAgICByZXR1cm4oTWF0aC5yb3VuZCh0aWNrc3VtL01BWFNBTVBMRVMgKiAxMDApIC8gMTAwKTtcclxuICAgIH1cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgKiBHYW1lIEZ1bmN0aW9uc1xyXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICB0aGF0LmluaXRpYWxpemUgPSBmdW5jdGlvbiAocmV0RnVuY3Rpb24sIHBhdXNlRnVuY3Rpb24pIHtcclxuICAgICAgLy8gUHJvdmlkZWQgZm9yIG1lbnVpbmdcclxuICAgICAgcmV0RnVuYyA9IHJldEZ1bmN0aW9uXHJcbiAgICAgIHBhdXNlRnVuYyA9IHBhdXNlRnVuY3Rpb25cclxuICAgICAgLy8gU2V0dXAgS2V5Ym9hcmQgSW5wdXRcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgSW5wdXRNYXAub25LZXl1cChldmVudCk7XHJcbiAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBJbnB1dE1hcC5vbktleWRvd24oZXZlbnQpO1xyXG4gICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAvLyBJbml0aWxhaXplIGdyYXBoaWNzIGFuZCBnYW1lIHN0dWZmXHJcbiAgICAgIEdyYXBoaWNzLmluaXRpYWxpemUod2lkdGgsIGhlaWdodClcclxuICAgICAgaW5pdGlhbGl6ZU9iamVjdHMoKVxyXG4gICAgICBnYW1lUnVubmluZyA9IGZhbHNlXHJcbiAgICAgIGdhbWVPdmVyID0gZmFsc2VcclxuICAgICAgcGF1c2VkID0gZmFsc2VcclxuICAgICAgcHJldmlvdXNUaW1lID0gcGVyZm9ybWFuY2Uubm93KClcclxuXHJcbiAgICAgIC8vIFNldHVwIEZQUyBEYXRhXHJcbiAgICAgIHRpY2tpbmRleCA9IDBcclxuICAgICAgdGlja3N1bSA9IDBcclxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IE1BWFNBTVBMRVM7ICsraSl7XHJcbiAgICAgICAgdGlja2xpc3RbaV0gPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvL1N0YXJ0IEdhbWUgTG9vcFxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZU9iamVjdHMoKSB7XHJcbiAgICAgIHRvdGFsR2FtZVRpbWUgPSAwXHJcbiAgICAgIHRpbWVCZWZvcmVTdGFydCA9IDMwMDBcclxuICAgICAgZ2FtZVJ1bm5pbmcgPSBmYWxzZVxyXG4gICAgICBnYW1lT2JqZWN0cyA9IHt9XHJcbiAgICAgIGdhbWVPYmplY3RzLkJhY2tncm91bmQgPSBNb2RlbC5CYWNrZ3JvdW5kKClcclxuICAgICAgZ2FtZU9iamVjdHMuU2NvcmVib2FyZCA9IE1vZGVsLlNjb3JlYm9hcmQoMylcclxuICAgICAgZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkID0gTW9kZWwuUGxheWluZ0JvYXJkKClcclxuICAgICAgZ2FtZU9iamVjdHMuUGFkZGxlID0gTW9kZWwuUGFkZGxlKClcclxuICAgICAgZ2FtZU9iamVjdHMuQmFsbHMgPSB7XHJcbiAgICAgICAgYmFsbHM6IFtNb2RlbC5CYWxsKCldLFxyXG4gICAgICAgIGRyYXc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FtZU9iamVjdHMuQmFsbHMuYmFsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ2FtZU9iamVjdHMuQmFsbHMuYmFsbHNbaV0uZHJhdygpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGdhbWVPYmplY3RzLkJhbm5lciA9IE1vZGVsLkJhbm5lcigpXHJcbiAgICAgIGdhbWVPYmplY3RzLlBhcnRpY2xlU3lzdGVtID0gTW9kZWwuUGFydGljbGVTeXN0ZW0oKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5ld0xpZmUoKSB7XHJcbiAgICAgIGdhbWVPYmplY3RzLlBhZGRsZSA9IE1vZGVsLlBhZGRsZSgpXHJcbiAgICAgIGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzID0gW01vZGVsLkJhbGwoKV1cclxuICAgICAgZ2FtZU9iamVjdHMuQmFubmVyID0gTW9kZWwuQmFubmVyKClcclxuICAgICAgZ2FtZU9iamVjdHMuUGFydGljbGVTeXN0ZW0gPSBNb2RlbC5QYXJ0aWNsZVN5c3RlbSgpXHJcbiAgICAgIHRpbWVCZWZvcmVTdGFydCA9IDMwMDBcclxuICAgICAgY3VycmVudFJvdW5kSGl0cyA9IDBcclxuICAgICAgY3VycmVudFJvdW5kU2NvcmUgPSAwXHJcbiAgICAgIGZ1bGxTaXplID0gdHJ1ZVxyXG4gICAgICBnYW1lT2JqZWN0cy5QYWRkbGUudG9nZ2xlU2l6ZSh0cnVlKVxyXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZ2FtZU9iamVjdHMuQmFsbHMuYmFsbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzW2ldLmN1cnJlbnRSb3VuZEhpdHMgPSAwXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBuZXdSb3VuZCgpe1xyXG4gICAgICBnYW1lT2JqZWN0cy5QYWRkbGUgPSBNb2RlbC5QYWRkbGUoKVxyXG4gICAgICBnYW1lT2JqZWN0cy5CYWxscy5iYWxscyA9IFtNb2RlbC5CYWxsKCldXHJcbiAgICAgIGdhbWVPYmplY3RzLkJhbm5lciA9IE1vZGVsLkJhbm5lcigpXHJcbiAgICAgIGdhbWVPYmplY3RzLlBsYXlpbmdCb2FyZCA9IE1vZGVsLlBsYXlpbmdCb2FyZCgpXHJcbiAgICAgIGdhbWVPYmplY3RzLlNjb3JlYm9hcmQgPSBNb2RlbC5TY29yZWJvYXJkKGdhbWVPYmplY3RzLlNjb3JlYm9hcmQubGl2ZXMubGl2ZXMubGVuZ3RoICsgMSwgZ2FtZU9iamVjdHMuU2NvcmVib2FyZC5zY29yZSwgZ2FtZU9iamVjdHMuU2NvcmVib2FyZC50aW1lKVxyXG4gICAgICB0aW1lQmVmb3JlU3RhcnQgPSAzMDAwXHJcbiAgICAgIGN1cnJlbnRSb3VuZEhpdHMgPSAwXHJcbiAgICAgIGN1cnJlbnRSb3VuZFNjb3JlID0gMFxyXG4gICAgICBmdWxsU2l6ZSA9IHRydWVcclxuICAgICAgZ2FtZU9iamVjdHMuUGFkZGxlLnRvZ2dsZVNpemUodHJ1ZSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnYW1lTG9vcChjdXJyZW50VGltZSkge1xyXG4gICAgICBpZighcGF1c2VkKSB7XHJcbiAgICAgICAgdXBkYXRlKGN1cnJlbnRUaW1lKVxyXG4gICAgICAgIHJlbmRlcigpXHJcbiAgICAgICAgcHJldmlvdXNUaW1lID0gY3VycmVudFRpbWVcclxuICAgICAgICBpZihJbnB1dE1hcC5pc0Rvd24oSW5wdXRNYXAuRVNDKSl7XHJcbiAgICAgICAgICBwYXVzZWQgPSB0cnVlXHJcbiAgICAgICAgICBwYXVzZUZ1bmMoKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUoY3VycmVudFRpbWUpIHtcclxuICAgICAgdmFyIGVsYXBzZWRUaW1lID0gY3VycmVudFRpbWUgLSBwcmV2aW91c1RpbWVcclxuICAgICAgaWYgKGdhbWVSdW5uaW5nKSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIFBhZGRsZVxyXG4gICAgICAgIGdhbWVPYmplY3RzLlBhZGRsZS51cGRhdGUoZWxhcHNlZFRpbWUpXHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBCYWxsc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FtZU9iamVjdHMuQmFsbHMuYmFsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzW2ldLnVwZGF0ZShlbGFwc2VkVGltZSlcclxuXHJcbiAgICAgICAgICAvLyBEZXRlY3QgQ29sbGlzaW9uczogRmFsc2UgbWVhbnMgQmFsbCBleGl0ZWQgZ2FtZSBhcmVhXHJcbiAgICAgICAgICBpZiAoIWRldGVjdEFsbENvbGxpc2lvbnMoZ2FtZU9iamVjdHMuQmFsbHMuYmFsbHNbaV0pKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBPbmx5IG9uZSBiYWxsIGxlZnRcclxuICAgICAgICAgICAgaWYgKGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgZ2FtZVJ1bm5pbmcgPSBmYWxzZVxyXG4gICAgICAgICAgICAgIGlmKGdhbWVPYmplY3RzLlNjb3JlYm9hcmQubGl2ZXMubGl2ZXMubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZ2FtZU92ZXIgPSB0cnVlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ2FtZU9iamVjdHMuU2NvcmVib2FyZC5saXZlcy5saXZlcy5wb3AoKVxyXG5cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIGdhbWVPYmplY3RzLkJhbGxzLmJhbGxzLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgIGktLVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiBhbGwgYnJpY2tzIGhhdmUgYmVlbiBjbGVhcmVkXHJcbiAgICAgICAgaWYoZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3MubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgbmV3Um91bmQoKVxyXG4gICAgICAgICAgZ2FtZVJ1bm5pbmcgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG90YWxHYW1lVGltZSArPSBlbGFwc2VkVGltZVxyXG4gICAgICAgIHZhciB0aW1lU3RyaW5nID0gTWF0aC5mbG9vcih0b3RhbEdhbWVUaW1lIC8gMTAwMCAvIDYwKSArIFwiOlwiXHJcbiAgICAgICAgaWYgKE1hdGguZmxvb3IodG90YWxHYW1lVGltZSAvIDEwMDApICUgNjAgPCAxMCkge1xyXG4gICAgICAgICAgdGltZVN0cmluZyArPSBcIjBcIlxyXG4gICAgICAgIH1cclxuICAgICAgICB0aW1lU3RyaW5nICs9IE1hdGguZmxvb3IodG90YWxHYW1lVGltZSAvIDEwMDApICUgNjBcclxuICAgICAgICBnYW1lT2JqZWN0cy5TY29yZWJvYXJkLnRpbWUuc2V0VGV4dCh0aW1lU3RyaW5nKVxyXG4gICAgICAgIHZhciBzY29yZVN0cmluZyA9IFwiXCJcclxuICAgICAgICBpZihzY29yZSA8IDEwMCkgc2NvcmVTdHJpbmcgKz0gXCIwXCJcclxuICAgICAgICBpZihzY29yZSA8IDEwKSBzY29yZVN0cmluZyArPSBcIjBcIlxyXG4gICAgICAgIHNjb3JlU3RyaW5nICs9IHNjb3JlXHJcbiAgICAgICAgZ2FtZU9iamVjdHMuU2NvcmVib2FyZC5zY29yZS5zZXRUZXh0KHNjb3JlU3RyaW5nKVxyXG4gICAgICAgIGdhbWVPYmplY3RzLlBhcnRpY2xlU3lzdGVtLnVwZGF0ZShlbGFwc2VkVGltZSlcclxuICAgICAgICBpZighZ2FtZVJ1bm5pbmcgfHwgZ2FtZU92ZXIpe1xyXG4gICAgICAgICAgaWYoIWdhbWVPdmVyKSB7XHJcbiAgICAgICAgICAgIG5ld0xpZmUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgZ2FtZURvbmUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZnBzID0gTWF0aC5mbG9vcigxMDAwIC8gZWxhcHNlZFRpbWUgKiAxMCkgLyAxMFxyXG4gICAgICAgIGlmIChpc05hTihmcHMpKSBmcHMgPSAwXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcHNcIikuaW5uZXJIVE1MID0gYCBGUFM6ICR7Q2FsY0F2ZXJhZ2VUaWNrKGZwcyl9YFxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYoIWdhbWVPdmVyKXtcclxuICAgICAgICB0aW1lQmVmb3JlU3RhcnQgLT0gZWxhcHNlZFRpbWVcclxuICAgICAgICBnYW1lT2JqZWN0cy5CYW5uZXIudGV4dC5zZXRUZXh0KE1hdGguY2VpbCh0aW1lQmVmb3JlU3RhcnQgLyAxMDAwKSlcclxuICAgICAgICBpZiAodGltZUJlZm9yZVN0YXJ0IDwgMCkge1xyXG4gICAgICAgICAgZGVsZXRlIGdhbWVPYmplY3RzLkJhbm5lclxyXG4gICAgICAgICAgZ2FtZVJ1bm5pbmcgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgICBHcmFwaGljcy5jbGVhcigpXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBnYW1lT2JqZWN0cykge1xyXG4gICAgICAgIGdhbWVPYmplY3RzW2tleV0uZHJhdygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZXRlY3RBbGxDb2xsaXNpb25zKGJhbGwpIHtcclxuICAgICAgdmFyIGNvbnQgPSB0cnVlXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3MubGVuZ3RoICYmIGNvbnQ7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3NbaV0uYnJpY2tzLmxlbmd0aCAmJiBjb250OyBqKyspIHtcclxuICAgICAgICAgIGlmIChkZXRlY3RDb2xsaXNpb24oYmFsbCwgZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3NbaV0uYnJpY2tzW2pdKSkge1xyXG4gICAgICAgICAgICBzY29yZSArPSBzY29yZUFycmF5W2dhbWVPYmplY3RzLlBsYXlpbmdCb2FyZC5yb3dzW2ldLmJyaWNrc1tqXS5tb2RlbC5yb3ddXHJcbiAgICAgICAgICAgIGN1cnJlbnRSb3VuZFNjb3JlICs9IHNjb3JlQXJyYXlbZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3NbaV0uYnJpY2tzW2pdLm1vZGVsLnJvd11cclxuICAgICAgICAgICAgYmFsbC5jdXJyZW50Um91bmRIaXRzKytcclxuXHJcbiAgICAgICAgICAgIGlmKGZ1bGxTaXplICYmIChnYW1lT2JqZWN0cy5QbGF5aW5nQm9hcmQucm93c1tpXS5icmlja3Nbal0ubW9kZWwucm93ID09IDAgLyp8fCBnYW1lT2JqZWN0cy5QbGF5aW5nQm9hcmQucm93c1tpXS5icmlja3Nbal0ubW9kZWwucm93ID09IDEqLykpe1xyXG4gICAgICAgICAgICAgIGZ1bGxzaXplID0gIWZ1bGxTaXplXHJcbiAgICAgICAgICAgICAgZ2FtZU9iamVjdHMuUGFkZGxlLnRvZ2dsZVNpemUoZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2FtZU9iamVjdHMuUGFydGljbGVTeXN0ZW0uUGFydGljbGVFbWl0dGVyKGdhbWVPYmplY3RzLlBsYXlpbmdCb2FyZC5yb3dzW2ldLmJyaWNrc1tqXSwgYmFsbClcclxuICAgICAgICAgICAgZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3NbaV0uYnJpY2tzLnNwbGljZShqLCAxKVxyXG4gICAgICAgICAgICBqLS1cclxuICAgICAgICAgICAgY29udCA9IGZhbHNlXHJcbiAgICAgICAgICAgIHN3aXRjaCAoYmFsbC5jdXJyZW50Um91bmRIaXRzKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgYmFsbC5zZXRTcGVlZCg1ICogd2lkdGggLyA4KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgMTI6XHJcbiAgICAgICAgICAgICAgICBiYWxsLnNldFNwZWVkKDcgKiB3aWR0aCAvIDgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAzNjpcclxuICAgICAgICAgICAgICAgIGJhbGwuc2V0U3BlZWQoMTAgKiB3aWR0aCAvIDgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSA2MjpcclxuICAgICAgICAgICAgICAgIGJhbGwuc2V0U3BlZWQoMTIgKiB3aWR0aCAvIDgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ2FtZU9iamVjdHMuUGxheWluZ0JvYXJkLnJvd3NbaV0uYnJpY2tzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICBzY29yZSArPSAyNVxyXG4gICAgICAgICAgY3VycmVudFJvdW5kU2NvcmUgKz0gMjVcclxuICAgICAgICAgIGdhbWVPYmplY3RzLlBsYXlpbmdCb2FyZC5yb3dzLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgaS0tXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGN1cnJlbnRSb3VuZFNjb3JlID49IDEwMCl7XHJcbiAgICAgICAgICBjdXJyZW50Um91bmRTY29yZS09MTAwXHJcbiAgICAgICAgICBnYW1lT2JqZWN0cy5CYWxscy5iYWxscy5wdXNoKE1vZGVsLkJhbGwoKSlcclxuICAgICAgICAgIHZhciBuZXdCYWxsID0gZ2FtZU9iamVjdHMuQmFsbHMuYmFsbHNbZ2FtZU9iamVjdHMuQmFsbHMuYmFsbHMubGVuZ3RoIC0gMV1cclxuICAgICAgICAgIG5ld0JhbGwuc2V0UG9zaXRpb24oZ2FtZU9iamVjdHMuUGFkZGxlLnBvcy54ICsgZ2FtZU9iamVjdHMuUGFkZGxlLndpZHRoIC8gMiwgZ2FtZU9iamVjdHMuUGFkZGxlLnBvcy55LCBuZXdCYWxsLmRpcmVjdGlvbi54LG5ld0JhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBkZXRlY3RQYWRkbGVDb2xsaXNpb24oYmFsbCwgZ2FtZU9iamVjdHMuUGFkZGxlKVxyXG4gICAgICByZXR1cm4gZGV0ZWN0V2FsbENvbGxpc2lvbihiYWxsKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRldGVjdFdhbGxDb2xsaXNpb24oYmFsbCkge1xyXG4gICAgICAvLyBDZWlsaW5nXHJcbiAgICAgIGlmIChiYWxsLmNlbnRlci55IC0gYmFsbC5yYWRpdXMgPCAxMDApIHtcclxuICAgICAgICBiYWxsLnNldFBvc2l0aW9uKGJhbGwuY2VudGVyLngsIDEwMCArIGJhbGwucmFkaXVzLCBiYWxsLmRpcmVjdGlvbi54LCAtMSAqIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgIH1cclxuICAgICAgLy8gTGVmdCBXYWxsXHJcbiAgICAgIGlmIChiYWxsLmNlbnRlci54IC0gYmFsbC5yYWRpdXMgPCAwKSB7XHJcbiAgICAgICAgYmFsbC5zZXRQb3NpdGlvbihiYWxsLnJhZGl1cywgYmFsbC5jZW50ZXIueSwgLTEgKiBiYWxsLmRpcmVjdGlvbi54LCBiYWxsLmRpcmVjdGlvbi55KVxyXG4gICAgICB9XHJcbiAgICAgIC8vIFJpZ2h0IFdhbGxcclxuICAgICAgaWYgKGJhbGwuY2VudGVyLnggKyBiYWxsLnJhZGl1cyA+IHdpZHRoKSB7XHJcbiAgICAgICAgYmFsbC5zZXRQb3NpdGlvbih3aWR0aCAtIGJhbGwucmFkaXVzLCBiYWxsLmNlbnRlci55LCAtMSAqIGJhbGwuZGlyZWN0aW9uLngsIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGJhbGwuY2VudGVyLnkgKyBiYWxsLnJhZGl1cyA+IGhlaWdodCkge1xyXG4gICAgICAgIC8vUmVhbCBDb2RlXHJcbiAgICAgICAgYmFsbC5zZXRQb3NpdGlvbihiYWxsLmNlbnRlci54LCBoZWlnaHQgLSBiYWxsLmNlbnRlci55LCAwLCAwKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICAgICAvLyBGb3IgRGVidWdnaW5nXHJcbiAgICAgICAgLy8gYmFsbC5zZXRQb3NpdGlvbihiYWxsLmNlbnRlci54LCBoZWlnaHQgLSBiYWxsLnJhZGl1cywgYmFsbC5kaXJlY3Rpb24ueCwgLTEgKiBiYWxsLmRpcmVjdGlvbi55KVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGV0ZWN0Q29sbGlzaW9uKGJhbGwsIHJlYykge1xyXG4gICAgICBpZiAoYmFsbC5jZW50ZXIueSAtIGJhbGwucmFkaXVzID4gcmVjLm1vZGVsLnBvcy55ICsgcmVjLm1vZGVsLmhlaWdodCkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmIChiYWxsLmNlbnRlci55ICsgYmFsbC5yYWRpdXMgPCByZWMubW9kZWwucG9zLnkpIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoYmFsbC5jZW50ZXIueCAtIGJhbGwucmFkaXVzID4gcmVjLm1vZGVsLnBvcy54ICsgcmVjLm1vZGVsLndpZHRoKSByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKGJhbGwuY2VudGVyLnggKyBiYWxsLnJhZGl1cyA8IHJlYy5tb2RlbC5wb3MueCkgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgICB2YXIgdG9wRGlzdGFuY2UgPSBNYXRoLmFicyhiYWxsLmNlbnRlci55IC0gcmVjLm1vZGVsLnBvcy55KVxyXG4gICAgICB2YXIgYm90dG9tRGlzdGFuY2UgPSBNYXRoLmFicyhiYWxsLmNlbnRlci55IC0gKHJlYy5tb2RlbC5wb3MueSArIHJlYy5tb2RlbC5oZWlnaHQpKVxyXG4gICAgICB2YXIgbGVmdERpc3RhbmNlID0gTWF0aC5hYnMoYmFsbC5jZW50ZXIueCAtIHJlYy5tb2RlbC5wb3MueClcclxuICAgICAgdmFyIHJpZ2h0RGlzdGFuY2UgPSBNYXRoLmFicyhiYWxsLmNlbnRlci54IC0gKHJlYy5tb2RlbC5wb3MueCArIHJlYy5tb2RlbC53aWR0aCkpXHJcblxyXG4gICAgICAvLyBDb21pbmcgaW50byBsZWZ0IHdhbGxcclxuICAgICAgaWYgKGJhbGwuZGlyZWN0aW9uLnggPiAwKSB7XHJcbiAgICAgICAgLy8gQ29taW5nIGludG8gdG9wIHdhbGxcclxuICAgICAgICBpZiAoYmFsbC5kaXJlY3Rpb24ueSA+IDApIHtcclxuICAgICAgICAgIGlmICh0b3BEaXN0YW5jZSA8IGxlZnREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKGJhbGwuY2VudGVyLngsIHJlYy5tb2RlbC5wb3MueSAtIGJhbGwucmFkaXVzLCBiYWxsLmRpcmVjdGlvbi54LCAtMSAqIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChsZWZ0RGlzdGFuY2UgPCB0b3BEaXN0YW5jZSkge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKHJlYy5tb2RlbC5wb3MueCAtIGJhbGwucmFkaXVzLCBiYWxsLmNlbnRlci55LCAtMSAqIGJhbGwuZGlyZWN0aW9uLngsIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYmFsbC5zZXRQb3NpdGlvbihyZWMubW9kZWwucG9zLnggLSAoYmFsbC5yYWRpdXMgKiA0ICogTWF0aC5TUVJUMiksIHJlYy5tb2RlbC5wb3MueSAtIChiYWxsLnJhZGl1cyAqIDQgKiBNYXRoLlNRUlQyKSwgLTEgKiBiYWxsLmRpcmVjdGlvbi54LCAtMSAqIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENvbWluZyBpbnRvIGJvdHRvbSB3YWxsXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBpZiAoYm90dG9tRGlzdGFuY2UgPCBsZWZ0RGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgYmFsbC5zZXRQb3NpdGlvbihiYWxsLmNlbnRlci54LCByZWMubW9kZWwucG9zLnkgKyByZWMubW9kZWwuaGVpZ2h0ICsgYmFsbC5yYWRpdXMsIGJhbGwuZGlyZWN0aW9uLngsIC0xICogYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKGxlZnREaXN0YW5jZSA8IGJvdHRvbURpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGJhbGwuc2V0UG9zaXRpb24ocmVjLm1vZGVsLnBvcy54IC0gYmFsbC5yYWRpdXMsIGJhbGwuY2VudGVyLnksIC0xICogYmFsbC5kaXJlY3Rpb24ueCwgYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKHJlYy5tb2RlbC5wb3MueCAtIChiYWxsLnJhZGl1cyAqIDQgKiBNYXRoLlNRUlQyKSwgcmVjLm1vZGVsLnBvcy55ICsgcmVjLm1vZGVsLmhlaWdodCArIChiYWxsLnJhZGl1cyAqIDQgKiBNYXRoLlNRUlQyKSwgLTEgKiBiYWxsLmRpcmVjdGlvbi54LCAtMSAqIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIENvbWluZyBpbnRvIHJpZ2h0IHdhbGxcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgLy8gQ29taW5nIGludG8gdG9wIHdhbGxcclxuICAgICAgICBpZiAoYmFsbC5kaXJlY3Rpb24ueSA+IDApIHtcclxuICAgICAgICAgIGlmICh0b3BEaXN0YW5jZSA8IHJpZ2h0RGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgYmFsbC5zZXRQb3NpdGlvbihiYWxsLmNlbnRlci54LCByZWMubW9kZWwucG9zLnkgLSBiYWxsLnJhZGl1cywgYmFsbC5kaXJlY3Rpb24ueCwgLTEgKiBiYWxsLmRpcmVjdGlvbi55KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAocmlnaHREaXN0YW5jZSA8IHRvcERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGJhbGwuc2V0UG9zaXRpb24ocmVjLm1vZGVsLnBvcy54ICsgcmVjLm1vZGVsLndpZHRoICsgYmFsbC5yYWRpdXMsIGJhbGwuY2VudGVyLnksIC0xICogYmFsbC5kaXJlY3Rpb24ueCwgYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKHJlYy5tb2RlbC5wb3MueCArIHJlYy5tb2RlbC53aWR0aCArIChiYWxsLnJhZGl1cyAqIDQgKiBNYXRoLlNRUlQyKSwgcmVjLm1vZGVsLnBvcy55IC0gKGJhbGwucmFkaXVzICogNCAqIE1hdGguU1FSVDIpLCAtMSAqIGJhbGwuZGlyZWN0aW9uLngsIC0xICogYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ29taW5nIGludG8gYm90dG9tIHdhbGxcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGlmIChib3R0b21EaXN0YW5jZSA8IHJpZ2h0RGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgYmFsbC5zZXRQb3NpdGlvbihiYWxsLmNlbnRlci54LCByZWMubW9kZWwucG9zLnkgKyByZWMubW9kZWwuaGVpZ2h0ICsgYmFsbC5yYWRpdXMsIGJhbGwuZGlyZWN0aW9uLngsIC0xICogYmFsbC5kaXJlY3Rpb24ueSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKHJpZ2h0RGlzdGFuY2UgPCBib3R0b21EaXN0YW5jZSkge1xyXG4gICAgICAgICAgICBiYWxsLnNldFBvc2l0aW9uKHJlYy5tb2RlbC5wb3MueCArIHJlYy5tb2RlbC53aWR0aCArIGJhbGwucmFkaXVzLCBiYWxsLmNlbnRlci55LCAtMSAqIGJhbGwuZGlyZWN0aW9uLngsIGJhbGwuZGlyZWN0aW9uLnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYmFsbC5zZXRQb3NpdGlvbihyZWMubW9kZWwucG9zLnggKyByZWMubW9kZWwud2lkdGggKyAoYmFsbC5yYWRpdXMgKiA0ICogTWF0aC5TUVJUMiksIHJlYy5tb2RlbC5wb3MueSArIHJlYy5tb2RlbC5oZWlnaHQgKyAoYmFsbC5yYWRpdXMgKiA0ICogTWF0aC5TUVJUMiksIC0xICogYmFsbC5kaXJlY3Rpb24ueCwgLTEgKiBiYWxsLmRpcmVjdGlvbi55KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRldGVjdFBhZGRsZUNvbGxpc2lvbihiYWxsLCBwYWRkbGUpe1xyXG4gICAgICBpZiAoYmFsbC5jZW50ZXIueSAtIGJhbGwucmFkaXVzID4gcGFkZGxlLnBvcy55ICsgcGFkZGxlLmhlaWdodCkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmIChiYWxsLmNlbnRlci55ICsgYmFsbC5yYWRpdXMgPCBwYWRkbGUucG9zLnkpIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoYmFsbC5jZW50ZXIueCAtIGJhbGwucmFkaXVzID4gcGFkZGxlLnBvcy54ICsgcGFkZGxlLndpZHRoKSByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKGJhbGwuY2VudGVyLnggKyBiYWxsLnJhZGl1cyA8IHBhZGRsZS5wb3MueCkgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgICB2YXIgZGlzdGFuY2UgPSAocGFkZGxlLndpZHRoIC8gMikgLSBNYXRoLmFicyhiYWxsLmNlbnRlci54IC0gKHBhZGRsZS5wb3MueCArIHBhZGRsZS53aWR0aCAvIDIpKVxyXG4gICAgICB2YXIgcmFkaWFucyA9IChNYXRoLlBJIC8gMykgKiBkaXN0YW5jZSAvIChwYWRkbGUud2lkdGggLyAyKSArIChNYXRoLlBJIC8gNilcclxuICAgICAgdmFyIGRpcmVjdGlvbiA9IHt4OiBNYXRoLmNvcyhyYWRpYW5zKSwgeTogLTEgKiBNYXRoLnNpbihyYWRpYW5zKX1cclxuICAgICAgTW9kZWwubm9ybWFsaXplKGRpcmVjdGlvbilcclxuICAgICAgaWYoYmFsbC5jZW50ZXIueCA8IChwYWRkbGUucG9zLnggKyBwYWRkbGUud2lkdGgvMikpe1xyXG4gICAgICAgIGRpcmVjdGlvbi54ICo9IC0xXHJcbiAgICAgIH1cclxuICAgICAgYmFsbC5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnYW1lRG9uZSgpe1xyXG4gICAgICBkZWxldGUgZ2FtZU9iamVjdHMuQmFsbHNcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcHNcIikuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIG5hbWUgPSBwcm9tcHQoXCJZb3Ugc2NvcmVkIFwiICsgc2NvcmUgKyBcIiBpbiBcIiArIE1hdGguZmxvb3IodG90YWxHYW1lVGltZS8xMDAwKSArIFwiIHNlY29uZHNcXG5FbnRlciB5b3VyIG5hbWUhXCIpXHJcbiAgICAgICAgY29uc29sZS5sb2cobmFtZSlcclxuICAgICAgICBIaWdoU2NvcmVzLmFkZCh7bmFtZTpuYW1lLHNjb3JlOnNjb3JlLHRpbWU6TWF0aC5mbG9vcih0b3RhbEdhbWVUaW1lLzEwMDApfSlcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZwc1wiKS5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICAgICAgcmV0RnVuYygpXHJcbiAgICAgIH0sMjAwMClcclxuICAgIH1cclxuXHJcbiAgICB0aGF0LnVucGF1c2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICBwYXVzZWQgPSBmYWxzZVxyXG4gICAgICBnYW1lT2JqZWN0cy5CYW5uZXIgPSBNb2RlbC5CYW5uZXIoKVxyXG4gICAgICB0aW1lQmVmb3JlU3RhcnQgPSAzMDAwXHJcbiAgICAgIGdhbWVSdW5uaW5nID0gZmFsc2VcclxuICAgICAgcHJldmlvdXNUaW1lID0gcGVyZm9ybWFuY2Uubm93KClcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGF0XHJcbiAgfSgpKVxyXG5cclxuICAvL0JyZWFrb3V0LmluaXRpYWxpemUoKVxyXG4vL31cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQnJlYWtvdXQiLCIvKipcclxuICogQ3JlYXRlZCBieSBTdGV2ZW4gb24gMy8xMy8yMDE3LlxyXG4gKi9cclxuXHJcbnZhciBHYW1lLCBJbnB1dE1hcFxyXG52YXIgcm9vdFxyXG5cclxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpXHJcbiAgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFyZ2V0XCIpXHJcbiAgc2hvd01lbnUoKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwbGF5R2FtZSgpe1xyXG4gIG0ubW91bnQocm9vdCwgQ2FudmFzKVxyXG4gIEdhbWUuaW5pdGlhbGl6ZShzaG93TWVudSwgc2hvd1BhdXNlTWVudSlcclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd1Njb3Jlcygpe1xyXG4gIHZhciBIaWdoU2NvcmVzID0gcmVxdWlyZSgnLi9TY29yaW5nJylcclxuICBtLm1vdW50KHJvb3QsIFNjb3JlQm9hcmQpXHJcbiAgSGlnaFNjb3Jlcy5yZXBvcnQoKVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93Q3JlZGl0cygpe1xyXG4gIG0ubW91bnQocm9vdCwgQ3JlZGl0cylcclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd01lbnUoKXtcclxuICBtLm1vdW50KHJvb3QsIE1lbnUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc3VtZUdhbWUoKXtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY2FudmFzXCIpLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXCJcIilcclxuICBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF1c2UtZGl2XCIpLG51bGwpXHJcbiAgR2FtZS51bnBhdXNlKClcclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd1BhdXNlTWVudSgpe1xyXG4gIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZS1kaXZcIiksIFBhdXNlTWVudSlcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY2FudmFzXCIpLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXCJoaWRkZW5cIilcclxufVxyXG5cclxudmFyIENhbnZhcyA9IHtcclxuICB2aWV3OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIG0oXCJkaXZcIixbXHJcbiAgICAgIG0oXCJjYW52YXNbaWQ9J2dhbWUtY2FudmFzJ11cIiksXHJcbiAgICAgIG0oXCJkaXZbaWQ9cGF1c2UtZGl2XVwiKVxyXG4gICAgICBdKVxyXG4gIH1cclxufVxyXG5cclxudmFyIE1lbnUgPSB7XHJcbiAgdmlldzogZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBtKFwiZGl2W2lkPSdtZW51J11cIixbXHJcbiAgICAgIG0oXCJoMVtpZD0ndGl0bGUnXVwiLFwiQlJFQUtPVVQhXCIpLFxyXG4gICAgICBtKFwiYnV0dG9uXCIse29uY2xpY2s6cGxheUdhbWV9LFwiUGxheSBHYW1lXCIpLFxyXG4gICAgICBtKFwiYnV0dG9uXCIse29uY2xpY2s6c2hvd1Njb3Jlc30sXCJIaWdoIFNjb3Jlc1wiKSxcclxuICAgICAgbShcImJ1dHRvblwiLHtvbmNsaWNrOnNob3dDcmVkaXRzfSxcIkNyZWRpdHNcIildKVxyXG4gIH1cclxufVxyXG5cclxudmFyIFBhdXNlTWVudSA9IHtcclxuICB2aWV3OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIG0oXCJkaXZbaWQ9J21lbnUnXVwiLFtcclxuICAgICAgbShcImgxW2lkPSd0aXRsZSddXCIsXCJCUkVBS09VVCFcIiksXHJcbiAgICAgIG0oXCJidXR0b25cIix7b25jbGljazpyZXN1bWVHYW1lfSxcIlJlc3VtZSBHYW1lXCIpLFxyXG4gICAgICBtKFwiYnV0dG9uXCIse29uY2xpY2s6c2hvd01lbnV9LFwiUXVpdCBHYW1lXCIpLF0pXHJcbiAgfVxyXG59XHJcblxyXG52YXIgU2NvcmVCb2FyZCA9IHtcclxuICB2aWV3OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIG0oXCJkaXZbaWQ9J21lbnUnXVwiLFtcclxuICAgICAgbShcInRhYmxlW2lkPSdzY29yZS10YWJsZSddXCIpLFxyXG4gICAgICBtKFwiYnV0dG9uXCIse29uY2xpY2s6IHNob3dNZW51fSxcIk1haW4gTWVudVwiKV0pXHJcbiAgfVxyXG59XHJcblxyXG52YXIgQ3JlZGl0cyA9IHtcclxuICB2aWV3OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIG0oXCJkaXZbaWQ9J21lbnUnXVwiLFtcclxuICAgICAgbShcInBcIixcIldyaXR0ZW4gYnkgU3RldmVuIFNpbWNveFwiKSxcclxuICAgICAgbShcInBcIixcIkZvbnQgQnkgSmFrb2IgRmlzY2hlcjogd3d3LnBpenphZHVkZS5ka1wiKSxcclxuICAgICAgbShcImJ1dHRvblwiLHtvbmNsaWNrOiBzaG93TWVudX0sXCJNYWluIE1lbnVcIilcclxuICAgIF0pXHJcbiAgfVxyXG59XHJcbiJdfQ==
