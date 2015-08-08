if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.Canvas.rendered = function(){
    canvas = new fabric.Canvas('c');
    canvas.setHeight($(window).height());
    canvas.setWidth($(window).width());
    canvas.selection = false;
    canvas.defaultCursor = 'move';
    canvas.hoverCursor = 'pointer';
    // canvas.setBackgroundColor({
    //   source: 'http://su0.ru/TyrS',
    //   repeat: 'repeat'
    //   }, function() {
    //   canvas.renderAll();
    //  });
    $(window).on('resize', function() {
      canvas.setHeight($(window).height());
      canvas.setWidth($(window).width());
    });
  // create a rectangle object
  var offsetX = 0; //-canvas.getWidth()/2;
  var offsetY = 0; //-canvas.getHeight()/2;
  //canvas.absolutePan(new fabric.Point(offsetX, offsetY));

  var PRX, PRY;
  var CAN = false;
  canvas.on({
    'mouse:down': function(options) {
      if (options.target) {
        options.target.opacity = 0.5;
        canvas.renderAll();
      };
      if (canvas.getActiveObject() == null) {
        PRX = options.e.clientX;
        PRY = options.e.clientY;
        CAN = true;
      }
    },
    'mouse:up': function(options) {
      if (options.target) {
        options.target.opacity = 1;
        canvas.renderAll();
      };
      if (canvas.getActiveObject() == null) {
        offsetX -= options.e.clientX - PRX;
        offsetY -= options.e.clientY - PRY;
        canvas.absolutePan(new fabric.Point(offsetX, offsetY));
        CAN = false;
      }
    },
    'mouse:move': function(options) {
      if (canvas.getActiveObject() == null && CAN) {
        canvas.absolutePan(new fabric.Point(offsetX - options.e.clientX + PRX, offsetY - options.e.clientY + PRY));
      }
    },
    'object:moved': function(e) {
      e.target.opacity = 0.5;
    },
    'object:modified': function(e) {
      e.target.opacity = 1;
      //e.target.foobar = 'hello';
      //alert(e.target.foobar);
    },
    'mouse:over': function(e){
      e.target.setFill('red');
      canvas.renderAll();
    },
    'mouse:out':function(e){
      e.target.setFill('green');
      canvas.renderAll();
    }
  });
  // "add" rectangle onto canvas
  fabric.Object.prototype.transparentCorners = false;
  // add random objects
  for (var i = 15; i--;) {
    var dim = fabric.util.getRandomInt(30, 60);
    var klass = ['Rect', 'Triangle', 'Circle'][fabric.util.getRandomInt(0, 2)];
    var options = {
      top: fabric.util.getRandomInt(0, 600),
      left: fabric.util.getRandomInt(0, 600),
      fill: 'green'
    };
    if (klass === 'Circle') {
      options.radius = dim;
    } else {
      options.width = dim;
      options.height = dim;
    }
    canvas.add(new fabric[klass](options));
  }

  //canvas.item(0).lockRotation = true;
  //canvas.item(0).lockScalingX = canvas.item(0).lockScalingY = true;
  for(var n=0;n<canvas.getObjects().length;n++){
  canvas.item(n).hasControls = canvas.item(n).hasBorders = false;
  }

   canvas.renderAll();
  };
  Template.Canvas.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });



}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
