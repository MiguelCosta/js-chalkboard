$ = jQuery

########################
#### Util Functions ####
########################

class Util
  @init: (wrap) =>
    @wrap = wrap

  @getCurrentColor: ->
    $('.colorpicker_current_color')[0].style.backgroundColor

  @pathStr: (start, end) ->
    "M #{start.x},#{start.y} L #{end.x},#{end.y}"

  @getMouseCoords: (event) ->
    $.event.fix event
    {
      x: event.pageX - @wrap.offset.left
      y: event.pageY - @wrap.offset.top
    }

#################
#### Toolbox ####
#################
class Toolbox
  constructor: (@wrap) ->
    @current
    @current_btn = $ []
    @all_btns    = $ '#toolbox *'
    @btn_line    = $ '#btn_line'
    @btn_player  = $ '#btn_player'

    # set click events for each button
    @all_btns.click (event) =>
      @setCurrent $(event.target)

  setCurrent: (tool) =>
    @current_btn.removeClass 'active'
    @current_btn = tool
    tool.addClass 'active'
    switch tool[0].id
      when 'btn_line'   then @current = new LineTool(@wrap)
      when 'btn_player' then @current = new PlayerTool(@wrap)

###############
#### Tools ####
###############
class BackgroundListener
  pressed: false
  start:   null
  end:     null

  constructor: (@wrap) ->
    @wrap.container.mousedown @mousedown
    @wrap.container.mousemove @mousemove
    @wrap.container.mouseup   @mouseup


  #### Mouse events ####

  mousedown: (event) =>
    if @checkEvent event
      @pressed = true
      @start = Util.getMouseCoords event
      @tool().mousedown(@start)

  mousemove: (event) =>
  #  if @pressed or @checkEvent event
      @end = Util.getMouseCoords event
      @tool().mousemove(@end)

  mouseup: (event) =>
    #if @pressed or @checkEvent event
      @tool().mouseup(Util.getMouseCoords event)
      @pressed = false

  checkEvent: (event) =>
    event.preventDefault()
    return event.target.id == 'canvas'


  #### private methods ####

  tool: =>
    @wrap.toolbox.current



#####################
#### Player Tool ####
#####################
class PlayerTool
  current: null

  constructor: (@wrap) ->

  mousedown: (coords) =>
    @current = new Player(@wrap, coords)

  mouseup: (coords) =>
    @current = null

  mousemove: (coords) =>
    if @current == null
      return
    @current.move(coords)


################
#### Object ####
################
class Object
  obj:      null # encapsulated Raphael obj
  selected: false
  pressed:  false
  coords:
    x: -1000
    y: -1000

  constructor: (@wrap) ->

  select: =>
    @wrap.setSelected this

  press: =>
    @pressed = true
    @wrap.setPressed this
    @obj.attr
      'stroke-width': 5

  unpress: =>
    @pressed = false
    @wrap.pressed = null
    @obj.attr
      'stroke-width': 3


#### Player ####
class Player extends Object
  constructor: (@wrap, @coords) ->
    super @wrap
    @obj = @wrap.paper.circle @coords.x, @coords.y, 10
    @obj.attr
      fill: Util.getCurrentColor()
    @select()

    @obj.mousedown (event) =>
      event.preventDefault()
      @select()
      @press()

    @obj.mousemove (event) =>
      event.preventDefault()
      if @pressed
        @move Util.getMouseCoords(event)

    @obj.mouseup (event) =>
      event.preventDefault()
      if @pressed
        @unpress()

  move: (coords) =>
    @obj.attr
      cx: coords.x
      cy: coords.y

  focus: =>
    @obj.attr
      'stroke': '#fff'
      'stroke-width': 3

  unfocus: =>
    @obj.attr
      'stroke': '#000'
      'stroke-width': 1

#### Line ####
class Line extends Object
  start:
    x: -1000
    y: -1000
  end:
    x: -1000
    y: -1000

  constructor: (@wrap, @start, @end) ->
    super @wrap
    @update @path()

  # this assumes the start point is fixed. only end point moves
  move: (coords) =>
    @end = coords
    @update @path()

  update: (pathStr) =>
    @obj.remove() unless @obj == null
    @obj.paper.path Util.pathStr(@start, @end)
    @obj.attr { stroke: Util.getCurrentColor() }


###################
#### Line Tool ####
###################
class LineTool
  current: null

  constructor: (@wrap) ->

  mousedown: (coords) =>
    @current = new Line(@wrap, coords, coords)

  mouseup: (coords) =>
    @wrap.objs.push @current
    @current = null

  mousemove: (coords) =>
    return if @current == null
    @current.move(coords)

#############################
#### Wrapper for Raphael ####
#############################

class RaphaelWrapper
  objs:         []   # list of objects currently drawn
  container:    null # div containing the canvas
  paper:        null # Raphael object
  canvas:       null # background with events attatched
  toolbox:      null # toolbox
  offset:       null # offset to compute event coordinates
  selected:     null # currently selected object
  pressed:      null # currently pressed object

  # tools
  back_handle:  null # handles actions on empty chalkboard
  tools:        null

  constructor: ->
    Util.init this
    # init canvas
    @container = $('#chalkboard-container')
    @offset    = @container.offset()
    @paper     = new Raphael @container[0], 800, 600
    @canvas    = @paper.image 'assets/images/back.jpg', 0, 0, 800, 600
    @canvas.node.id = 'canvas'

    # init toolbox
    @toolbox = new Toolbox(this)
    @toolbox.setCurrent @toolbox.btn_player

    # init background handle
    @back_handle = new BackgroundListener(this)
    @tools =
      player: new PlayerTool(this)
      line:   new LineTool(this)

  # sets the currently selected object
  setSelected: (obj) =>
    if @selected != null
      @selected.unfocus()
    @selected = obj
    @selected.focus()

  # sets the currently pressed object
  setPressed: (obj) =>
    if @pressed != null
      @pressed.unpress()
    @pressed = true


#### Init stuff ####
$(document).ready =>
  $('#colorpicker-container').ColorPicker {flat: true}
  @raphael = new RaphaelWrapper()

