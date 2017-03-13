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