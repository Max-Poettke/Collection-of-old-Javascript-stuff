"use strict";

const canvas = document.createElement( "CANVAS" );
const context = canvas.getContext( "2d" );

const RESIZE = document.createEvent( "UIEvent" );

RESIZE.initUIEvent( "resize", false, false );

var frame;
var time = {
	difference: undefined,
	left: undefined,
	now: undefined,
	total: undefined
};

var level;
var text;

window.addEventListener( "DOMContentLoaded", function(){
	document.body.appendChild( canvas );
	window.dispatchEvent( RESIZE );
}, {capture: false, once: true} );

window.addEventListener( "resize", function(){
	time.left = 10000;
	level = 1;
	text = value;

	if( canvas.width !== window.innerWidth || canvas.height !== window.innerHeight ){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		context.imageSmoothingEnabled = false;
		context.lineWidth = 3;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = "6em sans-serif";
	}

	frame = requestAnimationFrame( render );
}, false );

window.addEventListener( "keydown", function( event ){
	switch( event.key ){
		case "Alt":
		case "Control":
		case "OS":
		case "Shift":
		case "Tab":
			break;
		case "F5":
			event.preventDefault();
		case " ":
		case "Escape":
			cancelAnimationFrame( frame );
			window.dispatchEvent( RESIZE );
			break;
		case text:
			level = ( ( 10 * level + 1 ) / 10 );
			text = value;

			time.left = time.left + 800;
			if( time.left > 10000 ){
				time.left = 10000;
			}
			break;
		default:
			time.left = time.left - 100;
			if( time.left <= 0 ){
				cancelAnimationFrame( frame );
				gameOver();
			}
	}
}, false );

function render(){
	time.now = new Date().getTime();
	if( time.total === undefined || time.now - time.total > 300 ){
		time.difference = 0;
	}
	else{
		time.difference = time.now - time.total;
		time.left = time.left - time.difference;
	}
	if( time.left <= 0 ){
		return gameOver();
	}
	time.total = time.now;

	context.clearRect( 0, 0, canvas.width, canvas.height );
	context.globalAlpha = 0;
	context.rect( 0, 0, canvas.width, canvas.height );
	context.clip();
	context.beginPath();
	context.globalAlpha = 1;
	context.save();
	{
		context.save();
		{
			// Draw the leftover time
			context.font = "1em sans-serif";

			context.strokeStyle = "#333333";
			context.arc( 50, 50, 40, 0, 2 * Math.PI );
			context.stroke();
			context.beginPath();

			context.strokeStyle = "#ff3333";
			context.arc( 50, 50, 40, -0.5 * Math.PI, ( time.left / 5000 - 0.5 ) * Math.PI );
			context.stroke();
			context.beginPath();

			context.fillStyle = "#ffffff";
			context.fillText( ( time.left ).toFixed( 0 ), 50, 50 );
		}
		context.restore();

		// Draw the current text
		context.translate( ( ( 3 / 2 ) * canvas.width ), ( canvas.height / 2 ) );
		context.shadowOffsetX = -canvas.width;

		context.shadowBlur = 20;
		context.shadowColor = "hsl( " + ( 120 * time.left / 10000 ).toFixed( 0 ) + ", 100%, 50% )";
		context.strokeText( text, 0, 0 );

		context.shadowBlur = 7;
		context.shadowColor = "#ffffff";
		context.strokeText( text, 0, 0 );

		context.shadowBlur = 2;
		context.shadowColor = "#ffffff";
		context.strokeText( text, 0, 0 );
	}
	context.restore();
	frame = requestAnimationFrame( render );
}

Object.defineProperty( window, "value", {
	get: function value(){
		return "abcdefghijklmnopqrstuvwxyz"[Math.floor( 26 * Math.random() )];
	}
} );

function gameOver(){
	console.log( "Geschaffte Eingaben: %c%s", "color: #4f9b4f", ( 10 * level - 10 ) );
	context.clearRect( 0, 0, canvas.width, canvas.height );
	context.save();
	context.translate( canvas.width / 2, canvas.height / 2 );
	context.fillStyle = "#ff0000";
	context.fillText( "Game Over!", 0, 0 );
	context.restore();
}