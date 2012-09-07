// initialize stuff
var canvas = $('#chalkboard')[0].getContext('2d')

// Create a new path once, when the script is executed:
var myPath = new Path();
myPath.strokeColor = 'black';

function onMouseDown(event) {
    if (myPath.segments.length == 0) {
        myPath.add(event.point);
    }
    myPath.add(event.point);
}

function onMouseDrag(event) {
    myPath.lastSegment.point = event.point;
}