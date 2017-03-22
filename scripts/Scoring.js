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