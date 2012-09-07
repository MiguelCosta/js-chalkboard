// Generated by CoffeeScript 1.3.3
(function() {
  var $, LineTool, RaphaelWrapper, Toolbox,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  Toolbox = (function() {

    function Toolbox(screen) {
      this.setCurrent = __bind(this.setCurrent, this);

      var _this = this;
      this.screen = screen;
      this.current = $([]);
      this.all_btns = $('#toolbox *');
      this.btn_line = $('#btn_line');
      this.btn_circle = $('#btn_circle');
      this.all_btns.click(function(event) {
        return _this.setCurrent($(event.target));
      });
    }

    Toolbox.prototype.setCurrent = function(tool) {
      this.current.removeClass('active');
      this.current = tool;
      tool.addClass('active');
      switch (tool[0].id) {
        case 'btn_line':
          return LineTool(this.screen);
        case 'btn_circle':
          return CircleTool(this.screen);
      }
    };

    return Toolbox;

  })();

  LineTool = (function() {

    function LineTool(screen) {
      var _this = this;
      this.pressed = false;
      this.screen = screen;
      this.screen.mousedown(function(event) {
        return _this.draw = true;
      });
      this.screen.mouseup(function(event) {
        return _this.draw = false;
      });
    }

    return LineTool;

  })();

  RaphaelWrapper = (function() {

    function RaphaelWrapper() {
      this.initCanvas();
      this.initToolbox();
    }

    RaphaelWrapper.prototype.initCanvas = function() {
      this.container = $('#chalkboard-container')[0];
      this.paper = new Raphael(this.container, 800, 600);
      this.screen = this.paper.rect(0, 0, 800, 600);
      return this.screen.attr({
        fill: '#eee',
        border: 0
      });
    };

    RaphaelWrapper.prototype.initToolbox = function() {
      this.toolbox = new Toolbox(this.screen);
      return this.toolbox.setCurrent(this.toolbox.btn_line);
    };

    return RaphaelWrapper;

  })();

  $(document).ready(function() {
    return this.raphael = new RaphaelWrapper();
  });

}).call(this);