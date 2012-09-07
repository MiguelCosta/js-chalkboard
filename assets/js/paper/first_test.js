// Create a new path once, when the script is executed:
var myPath = new Path();
myPath.strokeColor = 'black';

// This function is called whenever the user
// clicks the mouse in the view:
function onMouseDown(event) {
    // If the path is empty, we need to add two segments
    // to the path. The first one will stay put,
    // and the second one will be moved while dragging.
    if (myPath.segments.length == 0) {
        myPath.add(event.point);
    }

    // Add a segment to the path at the position of the mouse:
    myPath.add(event.point);
}

function onMouseDrag(event) {
    // Move the last segment point of the path to the
    // current position of the mouse:
    myPath.lastSegment.point = event.point;
}