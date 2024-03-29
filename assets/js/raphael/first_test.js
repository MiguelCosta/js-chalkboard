// Generated by CoffeeScript 1.3.3
(function() {
  var $, BackgroundListener, Line, LineTool, Object, Player, PlayerTool, RaphaelWrapper, Toolbox, Util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    _this = this;

  $ = jQuery;

  Util = (function() {

    function Util() {}

    Util.init = function(wrap) {
      return Util.wrap = wrap;
    };

    Util.getCurrentColor = function() {
      return $('.colorpicker_current_color')[0].style.backgroundColor;
    };

    Util.pathStr = function(start, end) {
      return "M " + start.x + "," + start.y + " L " + end.x + "," + end.y;
    };

    Util.getMouseCoords = function(event) {
      $.event.fix(event);
      return {
        x: event.pageX - this.wrap.offset.left,
        y: event.pageY - this.wrap.offset.top
      };
    };

    return Util;

  }).call(this);

  Toolbox = (function() {

    function Toolbox(wrap) {
      var _this = this;
      this.wrap = wrap;
      this.setCurrent = __bind(this.setCurrent, this);

      this.current;
      this.current_btn = $([]);
      this.all_btns = $('#toolbox *');
      this.btn_line = $('#btn_line');
      this.btn_player = $('#btn_player');
      this.all_btns.click(function(event) {
        return _this.setCurrent($(event.target));
      });
    }

    Toolbox.prototype.setCurrent = function(tool) {
      this.current_btn.removeClass('active');
      this.current_btn = tool;
      tool.addClass('active');
      switch (tool[0].id) {
        case 'btn_line':
          return this.current = new LineTool(this.wrap);
        case 'btn_player':
          return this.current = new PlayerTool(this.wrap);
      }
    };

    return Toolbox;

  })();

  BackgroundListener = (function() {

    BackgroundListener.prototype.pressed = false;

    BackgroundListener.prototype.start = null;

    BackgroundListener.prototype.end = null;

    function BackgroundListener(wrap) {
      this.wrap = wrap;
      this.tool = __bind(this.tool, this);

      this.checkEvent = __bind(this.checkEvent, this);

      this.mouseup = __bind(this.mouseup, this);

      this.mousemove = __bind(this.mousemove, this);

      this.mousedown = __bind(this.mousedown, this);

      this.wrap.container.mousedown(this.mousedown);
      this.wrap.container.mousemove(this.mousemove);
      this.wrap.container.mouseup(this.mouseup);
    }

    BackgroundListener.prototype.mousedown = function(event) {
      if (this.checkEvent(event)) {
        this.pressed = true;
        this.start = Util.getMouseCoords(event);
        return this.tool().mousedown(this.start);
      }
    };

    BackgroundListener.prototype.mousemove = function(event) {
      this.end = Util.getMouseCoords(event);
      return this.tool().mousemove(this.end);
    };

    BackgroundListener.prototype.mouseup = function(event) {
      this.tool().mouseup(Util.getMouseCoords(event));
      return this.pressed = false;
    };

    BackgroundListener.prototype.checkEvent = function(event) {
      event.preventDefault();
      return event.target.id === 'canvas';
    };

    BackgroundListener.prototype.tool = function() {
      return this.wrap.toolbox.current;
    };

    return BackgroundListener;

  })();

  PlayerTool = (function() {

    PlayerTool.prototype.current = null;

    function PlayerTool(wrap) {
      this.wrap = wrap;
      this.mousemove = __bind(this.mousemove, this);

      this.mouseup = __bind(this.mouseup, this);

      this.mousedown = __bind(this.mousedown, this);

    }

    PlayerTool.prototype.mousedown = function(coords) {
      return this.current = new Player(this.wrap, coords);
    };

    PlayerTool.prototype.mouseup = function(coords) {
      return this.current = null;
    };

    PlayerTool.prototype.mousemove = function(coords) {
      if (this.current === null) {
        return;
      }
      return this.current.move(coords);
    };

    return PlayerTool;

  })();

  Object = (function() {

    Object.prototype.obj = null;

    Object.prototype.selected = false;

    Object.prototype.pressed = false;

    Object.prototype.coords = {
      x: -1000,
      y: -1000
    };

    function Object(wrap) {
      this.wrap = wrap;
      this.unpress = __bind(this.unpress, this);

      this.press = __bind(this.press, this);

      this.select = __bind(this.select, this);

    }

    Object.prototype.select = function() {
      return this.wrap.setSelected(this);
    };

    Object.prototype.press = function() {
      this.pressed = true;
      this.wrap.setPressed(this);
      return this.obj.attr({
        'stroke-width': 5
      });
    };

    Object.prototype.unpress = function() {
      this.pressed = false;
      this.wrap.pressed = null;
      return this.obj.attr({
        'stroke-width': 3
      });
    };

    return Object;

  })();

  Player = (function(_super) {

    __extends(Player, _super);

    function Player(wrap, coords) {
      var _this = this;
      this.wrap = wrap;
      this.coords = coords;
      this.unfocus = __bind(this.unfocus, this);

      this.focus = __bind(this.focus, this);

      this.move = __bind(this.move, this);

      Player.__super__.constructor.call(this, this.wrap);
      this.obj = this.wrap.paper.circle(this.coords.x, this.coords.y, 10);
      this.obj.attr({
        fill: Util.getCurrentColor()
      });
      this.select();
      this.obj.mousedown(function(event) {
        event.preventDefault();
        _this.select();
        return _this.press();
      });
      this.obj.mousemove(function(event) {
        event.preventDefault();
        if (_this.pressed) {
          return _this.move(Util.getMouseCoords(event));
        }
      });
      this.obj.mouseup(function(event) {
        event.preventDefault();
        if (_this.pressed) {
          return _this.unpress();
        }
      });
    }

    Player.prototype.move = function(coords) {
      return this.obj.attr({
        cx: coords.x,
        cy: coords.y
      });
    };

    Player.prototype.focus = function() {
      return this.obj.attr({
        'stroke': '#fff',
        'stroke-width': 3
      });
    };

    Player.prototype.unfocus = function() {
      return this.obj.attr({
        'stroke': '#000',
        'stroke-width': 1
      });
    };

    return Player;

  })(Object);

  Line = (function(_super) {

    __extends(Line, _super);

    Line.prototype.start = {
      x: -1000,
      y: -1000
    };

    Line.prototype.end = {
      x: -1000,
      y: -1000
    };

    function Line(wrap, start, end) {
      this.wrap = wrap;
      this.start = start;
      this.end = end;
      this.update = __bind(this.update, this);

      this.move = __bind(this.move, this);

      Line.__super__.constructor.call(this, this.wrap);
      this.update(this.path());
    }

    Line.prototype.move = function(coords) {
      this.end = coords;
      return this.update(this.path());
    };

    Line.prototype.update = function(pathStr) {
      if (this.obj !== null) {
        this.obj.remove();
      }
      this.obj.paper.path(Util.pathStr(this.start, this.end));
      return this.obj.attr({
        stroke: Util.getCurrentColor()
      });
    };

    return Line;

  })(Object);

  LineTool = (function() {

    LineTool.prototype.current = null;

    function LineTool(wrap) {
      this.wrap = wrap;
      this.mousemove = __bind(this.mousemove, this);

      this.mouseup = __bind(this.mouseup, this);

      this.mousedown = __bind(this.mousedown, this);

    }

    LineTool.prototype.mousedown = function(coords) {
      return this.current = new Line(this.wrap, coords, coords);
    };

    LineTool.prototype.mouseup = function(coords) {
      this.wrap.objs.push(this.current);
      return this.current = null;
    };

    LineTool.prototype.mousemove = function(coords) {
      if (this.current === null) {
        return;
      }
      return this.current.move(coords);
    };

    return LineTool;

  })();

  RaphaelWrapper = (function() {

    RaphaelWrapper.prototype.objs = [];

    RaphaelWrapper.prototype.container = null;

    RaphaelWrapper.prototype.paper = null;

    RaphaelWrapper.prototype.canvas = null;

    RaphaelWrapper.prototype.toolbox = null;

    RaphaelWrapper.prototype.offset = null;

    RaphaelWrapper.prototype.selected = null;

    RaphaelWrapper.prototype.pressed = null;

    RaphaelWrapper.prototype.back_handle = null;

    RaphaelWrapper.prototype.tools = null;

    function RaphaelWrapper() {
      this.setPressed = __bind(this.setPressed, this);

      this.setSelected = __bind(this.setSelected, this);
      Util.init(this);
      this.container = $('#chalkboard-container');
      this.offset = this.container.offset();
      this.paper = new Raphael(this.container[0], 800, 600);
      this.canvas = this.paper.image('assets/images/back.jpg', 0, 0, 800, 600);
      this.canvas.node.id = 'canvas';
      this.toolbox = new Toolbox(this);
      this.toolbox.setCurrent(this.toolbox.btn_player);
      this.back_handle = new BackgroundListener(this);
      this.tools = {
        player: new PlayerTool(this),
        line: new LineTool(this)
      };
    }

    RaphaelWrapper.prototype.setSelected = function(obj) {
      if (this.selected !== null) {
        this.selected.unfocus();
      }
      this.selected = obj;
      return this.selected.focus();
    };

    RaphaelWrapper.prototype.setPressed = function(obj) {
      if (this.pressed !== null) {
        this.pressed.unpress();
      }
      return this.pressed = true;
    };

    return RaphaelWrapper;

  })();

  $(document).ready(function() {
    $('#colorpicker-container').ColorPicker({
      flat: true
    });
    return _this.raphael = new RaphaelWrapper();
  });

}).call(this);
