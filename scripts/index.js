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
