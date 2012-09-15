$ = jQuery

########################
#### Util Functions ####
########################

class Util
  @getCurrentColor: ->
    $('.colorpicker_current_color')[0].style.backgroundColor

  @pathStr: (start, end) ->
    "M #{start.x},#{start.y} L #{end.x},#{end.y}"

#################
#### Toolbox ####
#################
class Toolbox
  constructor: (@wrap) ->
    @current
    @current_btn = $ []
    @all_btns    = $ '#toolbox *'
    @btn_line    = $ '#btn_line'

    # set click events for each button
    @all_btns.click (event) =>
      @setCurrent $(event.target)

  setCurrent: (tool) =>
    @current_btn.removeClass 'active'
    @current_btn = tool
    tool.addClass 'active'
    switch tool[0].id
      when 'btn_line'   then @current = new LineTool(@wrap)

###################
#### Line Tool ####
###################
class MouseListener
  pressed: false
  start:   null
  end:     null
  tool:    null

  constructor: (@wrap) ->
    @tool = @wrap.toolbox.current
    @wrap.container.mousedown @mousedown
    @wrap.container.mousemove @mousemove
    @wrap.container.mouseup   @mouseup


  #### Mouse events ####

  mousedown: (event) =>
    event.preventDefault()
    @start = @getMouseCoords event
    @pressed = true
    @tool.mousedown(@start)

  mousemove: (event) =>
    event.preventDefault()
    return unless @pressed
    @end = @getMouseCoords event
    @tool.mousemove(@end)

  mouseup: (event) =>
    event.preventDefault()
    @tool.mouseup()
    @pressed = false


  #### private methods ####

  getMouseCoords: (event) ->
    $.event.fix event
    {
      x: event.pageX - @wrap.offset.left
      y: event.pageY - @wrap.offset.top
    }

  tool: =>
    @wrap.toolbox.current



class LineTool
  start:   null
  end:     null
  current: null

  constructor: (@wrap) ->

  mousedown: (coords) =>
    @start = coords

  mouseup: () =>
    @wrap.objs.push @current
    @current = null

  mousemove: (coords) =>
    @current.remove() unless @current == null
    
    @end = coords
    @current = @wrap.paper.path(Util.pathStr(@start, @end))
    @current.attr { stroke: Util.getCurrentColor() }

#############################
#### Wrapper for Raphael ####
#############################

class RaphaelWrapper
  objs:         []
  container:    null
  paper:        null
  canvas:       null
  toolbox:      null
  mouse_handle: null
  offset:       null

  constructor: ->
    @initCanvas()
    @initToolbox()
    @mouse_handle = new MouseListener(this)

  initCanvas: =>
    @container = $('#chalkboard-container')
    @offset    = @container.offset()
    @paper     = new Raphael @container[0], 800, 600
    @canvas    = @paper.image 'assets/images/back.jpg', 0, 0, 800, 600

  initToolbox: =>
    @toolbox = new Toolbox(this)
    @toolbox.setCurrent @toolbox.btn_line


#### Init stuff ####
$(document).ready =>
  $('#colorpicker-container').ColorPicker {flat: true}
  @raphael = new RaphaelWrapper()

