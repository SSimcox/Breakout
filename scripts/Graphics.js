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