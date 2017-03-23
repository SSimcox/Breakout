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