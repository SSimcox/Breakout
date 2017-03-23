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
