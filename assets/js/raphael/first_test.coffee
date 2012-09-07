$ = jQuery

class Toolbox
  constructor: (screen) ->
    @screen = screen
    # init
    @current    = $ []
    @all_btns   = $ '#toolbox *'
    @btn_line   = $ '#btn_line'
    @btn_circle = $ '#btn_circle'

    # set click events for each button
    @all_btns.click (event) =>
      @setCurrent $(event.target)

  setCurrent: (tool) =>
    @current.removeClass 'active'
    @current = tool
    tool.addClass 'active'
    switch tool[0].id
      when 'btn_line'   then LineTool   @screen
      when 'btn_circle' then CircleTool @screen

class LineTool
  constructor: (screen) ->
    @pressed = false
    @screen = screen
    @screen.mousedown (event) =>
      @draw   = true
      @coords =

    @screen.mouseup (event) =>
      @draw = false


#### Wrapper for Raphael ####
class RaphaelWrapper
  constructor: ->
    @initCanvas()
    @initToolbox()

  initCanvas: ->
    @container = $('#chalkboard-container')[0]
    @paper = new Raphael @container, 800, 600
    @screen = @paper.rect 0, 0, 800, 600
    @screen.attr
      fill: '#eee'
      border: 0


    #@circle = @paper.circle 100, 100, 80
    #@circle.attr
    #  fill: '#F00'
    #@circle.mousedown (event) ->
    #  alert 'asd'

  initToolbox: ->
    @toolbox = new Toolbox(@screen)
    @toolbox.setCurrent @toolbox.btn_line


#### Init stuff ####
$(document).ready ->
  @raphael = new RaphaelWrapper()

