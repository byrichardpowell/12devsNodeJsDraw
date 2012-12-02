
// The faster the user moves their mouse
// the larger the circle will be
// We dont want it to be larger than this
tool.maxDistance = 50;

// Returns a semi random color
// The color will always be semi transparent
// and have a red value of 0
function randomColor() {
	return new RgbColor(0, Math.random(), Math.random(), ( Math.random() * 0.25 ) + 0.05 );
}

// Paper.JS executes this function
// every time the user drags their mouse
function onMouseDrag(event) {
    var radius = event.delta.length / 2;
    var circle = new Path.Circle(event.middlePoint, radius);
    var color = randomColor();
    circle.fillColor = randomColor();
    
    // Pass the data for this point
    // to a specialised function
    // We will use this later
    emitCircle( radius, event.middlePoint, color );

}

// This function sends the data for each cirlce to the server
// so that it can send it on to every other user
function emitCircle( radius, location, color ) {

  // Each socket.io connection has a unique session id
  var sessionId = io.socket.sessionid;
  
  // An object for the cirlces draw data
  var data = {
    radius: radius,
    location: location,
    color: color
  }

  // send a 'drawCircle' event with data & sesionId to the server
  io.emit( 'drawCircle', data, sessionId )

  // Lets have a look what this data is
  console.log( data )

}

// Listen for 'drawCirlce' events
// created by other users
io.on( 'drawCircle', function( d ) {

  // Draw the cirlce using the data sent
  // from the other user
  circle = new Path.Circle( d.location, d.radius );
  circle.fillColor = new RgbColor( d.color._red, d.color._green, d.color._blue, d.color._alpha ) ;

})