(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/otlabs/Dropbox/working-on/mobile-carousel/4/src/javascript/app.js":[function(require,module,exports){

//var Backbone = require('backbone');
// var AppView = Backbone.View.extend({
//
//     initialize: function(){
//         this.createDatGUI();
//     },
//
//     createDatGUI: function(){
//         var dat = require('dat-gui');
//
//         guiOptions = {
//             temp: 'temp',
//         };
//         gui = new dat.GUI();
//         gui.add(guiOptions, 'temp');
//     }
//
// });
//
// var appview = new AppView();

//var _r = 250 - 20//500 - 25;
var _rQuad = 450;//700;
var _r = _rQuad - 40;
var _meter;
var _ball1;

var _iter = 0 ;

var _duration = 60;
var _nrCircles = _duration / 3; //50;
var _arrCircles;

var _drag ;
var _videoBackground = null;

var Utils = require('./utils');
var VideoBackground = require('./components/video-background')
function AppView() {
    _initTest() ;
    //_readValues() ;
}

//**define window size and other funny things
function _readValues() {
    console.log('W W :' , window.innerWidth);
    console.log('W H :' , window.innerHeight);

    viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
    viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
    console.log('viewPortWidth :' , viewPortWidth);
    console.log('viewPortHeight :' , viewPortHeight);

   console.log('window.screen.width :' , window.screen.width);
   console.log('window.screen.availWidth :' , window.screen.availWidth);


   console.log('document.body.offsetWidth :' , document.body.offsetWidth);
   console.log('document.body.offsetHeight :' , document.body.offsetHeight);

   console.log('document.body.clientWidth :' , document.body.clientWidth);
   console.log('document.body.clientHeight :' , document.body.clientHeight);

   console.log('document.documentElement.clientWidth :' , document.documentElement.clientWidth);
   console.log('document.documentElement.clientHeight :' , document.documentElement.clientHeight);




   console.log('document.documentElement.offsetWidth :' , document.documentElement.offsetWidth);
   console.log('document.documentElement.offsetHeight :' , document.documentElement.offsetHeight);

   console.log('document.documentElement.scrollWidth :' , document.documentElement.scrollWidth);
   console.log('document.documentElement.scrollHeight :' , document.documentElement.scrollHeight);

   console.log('window.orientation :' , window.orientation);

   console.log('window.devicePixelRatio : ', window.devicePixelRatio);

   var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
   console.log('width : ', width);

   var size;

   size = { w : 100 , h : 100 , color : '#ff0099' , l : 0 , t : 0 };
   var topLeft = Utils.getDivBox( size );
   document.body.appendChild( topLeft );

   size = { w : 100 , h : 100 , color : '#ffFF99' , l : window.innerWidth - 100 , t : 0 };
   var topRight = Utils.getDivBox( size );
   document.body.appendChild( topRight );

   size = { w : 100 , h : 100 , color : '#ff0000' , l : window.innerWidth - 100 , t : window.innerHeight - 100 };
   var bottomRight = Utils.getDivBox( size );
   document.body.appendChild( bottomRight );

   size = { w : 100 , h : 100 , color : '#00FF99' , l : 0 , t : window.innerHeight - 100 };
   var bottomLeft = Utils.getDivBox( size );
   document.body.appendChild( bottomLeft );

}

function _initTest() {



    _meter = new FPSMeter();

    _createBackground();

    _container = document.getElementById('container');
    _container.style.left = (-_rQuad + window.innerWidth/2 ) + 'px';
    _container.style.top = ( window.innerHeight - _rQuad/2.2) + 'px';
    _arrBalls =[];
    var i = 0 ;
    for( i = 0; i < _nrCircles; i++ ) {
        var ball = document.createElement('div');
        _container.appendChild( ball );
        //ball.innerHTML = i;
        ball.classList.add("circle");

        //if( i == 0) {
            ball.classList.add( "white" );
        //TweenMax.set( ball ,  { alpha : .3 } );
        //}

        _arrBalls.push( ball );

        var iter = (i * 3.14*2 ) /_nrCircles //3.14;//(i*10) / 10 ;
        //console.log('iter ' , iter)
        var iterDegrees = iter * (180/Math.PI);
        //console.log('::=> iterDegrees <=::' , iterDegrees)
        var newX = _rQuad + Math.sin( iter) * _r - 10;  //+ 150 ;
        var newY = -_rQuad + Math.cos( iter) * _r - 10; //-12 //+ 400;
        ball.initPosX = newX ;
        ball.initPosY = newY ;
        ball.iter = iter;
        ball.myscale = 1;
        ball.iterDegrees = iterDegrees;

        TweenMax.set( ball ,  { x : newX , y : newY } );
    }


    //**start Draggable
    Draggable.create( "#container" , {
            type:"rotation",
     edgeResistance:0.15,

     dragResistance : .7,

     throwProps : true,
     onThrowUpdate : _onThrowUpdate,
     throwResistance : 1000 , //default is 1000
     maxDuration : 2 ,
     overshootTolerance : 1,
     onDragStart : _onDragStart,
     onDragEnd : _onDragEnd,
     onThrowComplete : _onThrowComplete
     //true
     /* ,
            onDragEnd:function() {
                ThrowPropsPlugin.to(this.target, {
                    throwProps:{
                        rotation:{
                            resistance:1000,
                            velocity:"auto",
                            end: function(n) { return Math.round(n / rotationSnap) * rotationSnap; }
                        }
                    }, ease:Power3.easeOut}, 2, 0.3);
            }*/
        });

    _drag = Draggable.get(_container);
    _drag.update();
    run2();
}

function _createBackground() {
    _videoBackground = new VideoBackground();
    _videoBackground.init();
}

function testFunc( e ) {
    //console.log('ciao' , _drag.rotation)
}

function _onThrowUpdate() {
    //console.log(' _drag.rotation : ' , _drag.rotation);
    var rotMod = _drag.rotation;
    if( rotMod < 0 ) {
        rotMod = rotMod + 360 ;
    }
    var futureSeekTime = ( (rotMod % 360) * _duration ) / 360;
    //( _videoBackground.video.currentTime * 360 ) / _duration;
    _videoBackground.video.currentTime = futureSeekTime;
}

function _onDragStart() {
    //_videoBackground.video.pause();
    _dragging = true;
}
function _onDragEnd() {
    //_videoBackground.video.resume();
    //_dragging = false;
}
function _onThrowComplete() {
    _dragging = false;
}

var _speed = .1;
var _dragging = false;

function run2() {

    if( _videoBackground ) {
        _videoBackground.run();
    }
    if( !_dragging ) {
        //console.log(  );

        var futureRot = ( _videoBackground.video.currentTime * 360 ) / _duration;
        //console.log('_drag.rotation :' , _drag.rotation)
        _drag.rotation = futureRot ;//_drag.rotation + _speed;
        TweenLite.set("#container",{rotation: _drag.rotation});
    }

    //var rotMod = ( Math.abs(_drag.rotation) ) % 360;
    var rotMod = ( _drag.rotation + 180) % 360;
    if( rotMod < 0 ) {
        rotMod = rotMod + 360 ;
    }
    rotMod = rotMod ;
    // } else {
    //
    // }

    // var rotMod
    // if( _drag.rotation < 0 ) {
    //     rotMod = ( _drag.rotation  + 180 ) % 360;
    // } else {
    //     rotMod = ( _drag.rotation  + 180 ) % 360;
    // }

    for( i = 0 ;i < _nrCircles; i ++) {
        var ball = _arrBalls[ i ];
        if( ball.iterDegrees > rotMod - 8 && ball.iterDegrees < rotMod + 8) {
            //ball.classList.add( "yellow" );
            //ball.classList.remove( "white" );
            TweenMax.to( ball , 1 , { scaleX : 4 , scaleY : 4 , ease : Back.easeOut.config(2.7)} ) ;
            ball.scaled = true;
            //console.log("?????", ball.iter)
        } else {
            //console.log("+++++", ball.iter)
            //ball.classList.add( "white" );
            //ball.classList.remove( "yellow" );
            if( ball.scaled ) {
                TweenMax.to( ball , .3 , { scaleX : 1 , scaleY : 1 , ease : Back.easeOut.config(2.7)} ) ;
                ball.scaled = false ;
            }

        }
    }


   if( _meter)
       _meter.tick();

    requestAnimationFrame(run2);
}

//**run
function run()
{
    _iter = _iter + 0.005;
    var i = 0 ;
    for( i = 0 ;i < _nrCircles; i ++) {
        var ball = _arrBalls[ i ];
        var adderIter = ( _iter + ball.iter )  ;
        var m = ( adderIter + Math.PI + 0.4)  % ( Math.PI * 2 )

        var newX = Math.sin( adderIter ) * _r //+ 150  ;
        var newY = Math.cos( _iter + ball.iter) * _r //+ 400//-200;
        TweenMax.set( ball ,  { x : newX , y : newY } );
        if( m > 0.2 && m < 0.6) {
            if( ball.myscale < 3.2)
                ball.myscale = ball.myscale + m/4;



        } else {
            if( ball.myscale > 1)
                ball.myscale = ball.myscale - 0.1;
        }
        TweenMax.set( ball ,  { scaleX : ball.myscale, scaleY : ball.myscale } );
    }


    if( _meter)
        _meter.tick();

    requestAnimationFrame(run);
}
var appview = new AppView();




//****************
/*
Draggable.create( "#container" , {
         type:"rotation", //instead of "x,y" or "top,left", we can simply do "rotation" to make the object spinnable!
         onDragEnd:function() { //since we want to apply conditional snapping, we use an onDragEnd callback to do our ThrowPropsPlugin tween, but if you don't need that custom functionality, you can simply set throwProps:true and as long as ThrowPropsPlugin is loaded, it'll auto-apply kinetic-based spinning!
             ThrowPropsPlugin.to(this.target, {
                 throwProps:{
                     rotation:{
                         resistance:1000,
                         velocity:"auto", //since Draggable automatically tracks "rotation", its velocity will be calculated for us.
                         //end: function(n) { return Math.round(n / rotationSnap) * rotationSnap; }
                     }
                 }, ease:Power3.easeOut}, 2, 0.3); //allow a maximum duration of 2, and a minimum of 0.3.
         }
     });
*/

},{"./components/video-background":"/Users/otlabs/Dropbox/working-on/mobile-carousel/4/src/javascript/components/video-background.js","./utils":"/Users/otlabs/Dropbox/working-on/mobile-carousel/4/src/javascript/utils.js"}],"/Users/otlabs/Dropbox/working-on/mobile-carousel/4/src/javascript/components/video-background.js":[function(require,module,exports){
"use strict";
var Utils = require('./../utils');
var VideoBackground = ( function()
{
    //**public vars
    VideoBackground.prototype.publicTest = '222';

    //**constructor
    function VideoBackground()
    {

        var _frameRate = 25;
        var _frame = 0;

        //**public vars
        this.publicVar = 'ciao' ;
        this.fps = 30;
        this.now;
        this.then = Date.now();
        this.interval = 1000 / this.fps
        this.delta;

        //**save scope
        var _scope = this;

        //**privileged methods
        this.init = function() {
            this.isIOS = false;
            if( /iPhone|Opera Mini/i.test(navigator.userAgent) ) {
                console.log('EE ')
                this.isIOS = true;
            }
            this.i = 0;
            this.iv = 0 ;

            //video
            this.video = document.createElement('video');
	        this.video.setAttribute('src', 'video/cc360.mp4');
            //this.video.loop = true;
            this.video.addEventListener('ended', _onVideoComplete , false);

            // this.video.addEventListener('loadedmetadata', function() {
            //     console.log( _scope.video.duration);
            //
            //
            // });
            //
            //**canvas
            this.canvas = document.createElement('canvas');
            this.canvas.width  = 960//window.innerWidth //+ "px";
            this.canvas.height = 390//window.innerHeight //+ "px";
            //this.canvas.style.zIndex   = 8;
            this.canvas.style.position = "absolute";
            this.canvas.style.left = 0 ;
            this.canvas.style.top = 0 ;
            this.canvas.style.border   = "0px";
            this.canvas.id='';

            var backgroundDiv = document.getElementById('background');
            backgroundDiv.appendChild( this.canvas );

            if( !this.isIOS ) {
                backgroundDiv.appendChild( this.video );
            }

            this.ctx = this.canvas.getContext('2d');

            this.canvas.style.width = window.innerWidth + "px";
            this.canvas.style.height = window.innerHeight + "px";


            this.video.addEventListener('canplay', _onCanPlay, true);
            this.video.load();
            if( !this.isIOS) {
                this.video.play();
            }

            this.video.onclick = function() {
                console.log('video click');
                if( !this.isIOS) {
                    _scope.video.play();
                }
                //setTimeout( run , 1 );
            }
            this.canvas.onclick = function() {
                console.log('canvas click');
                if( !this.isIOS) {
                    _scope.video.play();

                }

                //setTimeout( run , 1 );
            }
        }

        function _onCanPlay(e) {

            _scope.video.removeEventListener('canplay', _onCanPlay, true);
            //run();
        }

        function _onVideoComplete() {
            _scope.video.play();
        }

    }

    //** PUBLIC METHODS
    VideoBackground.prototype.run = function() {
        this.i ++;
        this.iv ++;
        if( this.i > 1 )
        {
            this.i = 0;
            this.draw();
            //console.log(this.isiOS);
            if( this.isIOS ) {
                //console.log(this.iv);


                this.now = Date.now();
                this.delta = this.now - this.then;
                if (this.delta > this.interval) {
                    this.then = this.now - (this.delta % this.interval);
                    this.video.currentTime = this.video.currentTime + 1 / this.fps;
                }
                if( this.iv > 0 )
                {

                    ///**speed control. need to be replaced with
                    //this.video.currentTime = this.video.currentTime + .05;


                    if( this.video.currentTime > 60 ) {
                        this.video.currentTime = 0;
                    }
                    this.iv = 0 ;
                }
            }

        }
    }
    VideoBackground.prototype.draw = function() {
        this.ctx.drawImage( this.video, 0, 0, 960, 390);
    }




    return VideoBackground ;
} )() ;
module.exports = VideoBackground

},{"./../utils":"/Users/otlabs/Dropbox/working-on/mobile-carousel/4/src/javascript/utils.js"}],"/Users/otlabs/Dropbox/working-on/mobile-carousel/4/src/javascript/utils.js":[function(require,module,exports){
"use strict";
var Utils = {};
//**here any require
//**

( function() {
    Utils.getDivBox = function( size ) {
        var div = document.createElement('div') ;
        div.style.position = 'absolute';
        div.style.width = size.w + 'px';
        div.style.height = size.h + 'px';
        console.log9
        div.style.backgroundColor = size.color;
        div.style.top = size.t + 'px';
        div.style.left = size.l + 'px';
        return div;
    }
    Utils.isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };


    //**private
    function _privateMethod() {
        console.log('hey i am a private method')
    }
})();
module.exports = Utils ;

},{}]},{},["/Users/otlabs/Dropbox/working-on/mobile-carousel/4/src/javascript/app.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdC9hcHAuanMiLCJzcmMvamF2YXNjcmlwdC9jb21wb25lbnRzL3ZpZGVvLWJhY2tncm91bmQuanMiLCJzcmMvamF2YXNjcmlwdC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vL3ZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG4vLyB2YXIgQXBwVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbi8vXG4vLyAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbi8vICAgICAgICAgdGhpcy5jcmVhdGVEYXRHVUkoKTtcbi8vICAgICB9LFxuLy9cbi8vICAgICBjcmVhdGVEYXRHVUk6IGZ1bmN0aW9uKCl7XG4vLyAgICAgICAgIHZhciBkYXQgPSByZXF1aXJlKCdkYXQtZ3VpJyk7XG4vL1xuLy8gICAgICAgICBndWlPcHRpb25zID0ge1xuLy8gICAgICAgICAgICAgdGVtcDogJ3RlbXAnLFxuLy8gICAgICAgICB9O1xuLy8gICAgICAgICBndWkgPSBuZXcgZGF0LkdVSSgpO1xuLy8gICAgICAgICBndWkuYWRkKGd1aU9wdGlvbnMsICd0ZW1wJyk7XG4vLyAgICAgfVxuLy9cbi8vIH0pO1xuLy9cbi8vIHZhciBhcHB2aWV3ID0gbmV3IEFwcFZpZXcoKTtcblxuLy92YXIgX3IgPSAyNTAgLSAyMC8vNTAwIC0gMjU7XG52YXIgX3JRdWFkID0gNDUwOy8vNzAwO1xudmFyIF9yID0gX3JRdWFkIC0gNDA7XG52YXIgX21ldGVyO1xudmFyIF9iYWxsMTtcblxudmFyIF9pdGVyID0gMCA7XG5cbnZhciBfZHVyYXRpb24gPSA2MDtcbnZhciBfbnJDaXJjbGVzID0gX2R1cmF0aW9uIC8gMzsgLy81MDtcbnZhciBfYXJyQ2lyY2xlcztcblxudmFyIF9kcmFnIDtcbnZhciBfdmlkZW9CYWNrZ3JvdW5kID0gbnVsbDtcblxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIFZpZGVvQmFja2dyb3VuZCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy92aWRlby1iYWNrZ3JvdW5kJylcbmZ1bmN0aW9uIEFwcFZpZXcoKSB7XG4gICAgX2luaXRUZXN0KCkgO1xuICAgIC8vX3JlYWRWYWx1ZXMoKSA7XG59XG5cbi8vKipkZWZpbmUgd2luZG93IHNpemUgYW5kIG90aGVyIGZ1bm55IHRoaW5nc1xuZnVuY3Rpb24gX3JlYWRWYWx1ZXMoKSB7XG4gICAgY29uc29sZS5sb2coJ1cgVyA6JyAsIHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICBjb25zb2xlLmxvZygnVyBIIDonICwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgIHZpZXdQb3J0V2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsaWVudFdpZHRoO1xuICAgIHZpZXdQb3J0SGVpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGllbnRIZWlnaHQ7XG4gICAgY29uc29sZS5sb2coJ3ZpZXdQb3J0V2lkdGggOicgLCB2aWV3UG9ydFdpZHRoKTtcbiAgICBjb25zb2xlLmxvZygndmlld1BvcnRIZWlnaHQgOicgLCB2aWV3UG9ydEhlaWdodCk7XG5cbiAgIGNvbnNvbGUubG9nKCd3aW5kb3cuc2NyZWVuLndpZHRoIDonICwgd2luZG93LnNjcmVlbi53aWR0aCk7XG4gICBjb25zb2xlLmxvZygnd2luZG93LnNjcmVlbi5hdmFpbFdpZHRoIDonICwgd2luZG93LnNjcmVlbi5hdmFpbFdpZHRoKTtcblxuXG4gICBjb25zb2xlLmxvZygnZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aCA6JyAsIGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGgpO1xuICAgY29uc29sZS5sb2coJ2RvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0IDonICwgZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQpO1xuXG4gICBjb25zb2xlLmxvZygnZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCA6JyAsIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgpO1xuICAgY29uc29sZS5sb2coJ2RvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IDonICwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQpO1xuXG4gICBjb25zb2xlLmxvZygnZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIDonICwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKTtcbiAgIGNvbnNvbGUubG9nKCdkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IDonICwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCk7XG5cblxuXG5cbiAgIGNvbnNvbGUubG9nKCdkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0V2lkdGggOicgLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0V2lkdGgpO1xuICAgY29uc29sZS5sb2coJ2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgOicgLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KTtcblxuICAgY29uc29sZS5sb2coJ2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA6JyAsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCk7XG4gICBjb25zb2xlLmxvZygnZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCA6JyAsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpO1xuXG4gICBjb25zb2xlLmxvZygnd2luZG93Lm9yaWVudGF0aW9uIDonICwgd2luZG93Lm9yaWVudGF0aW9uKTtcblxuICAgY29uc29sZS5sb2coJ3dpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIDogJywgd2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuXG4gICB2YXIgd2lkdGggPSAod2luZG93LmlubmVyV2lkdGggPiAwKSA/IHdpbmRvdy5pbm5lcldpZHRoIDogc2NyZWVuLndpZHRoO1xuICAgY29uc29sZS5sb2coJ3dpZHRoIDogJywgd2lkdGgpO1xuXG4gICB2YXIgc2l6ZTtcblxuICAgc2l6ZSA9IHsgdyA6IDEwMCAsIGggOiAxMDAgLCBjb2xvciA6ICcjZmYwMDk5JyAsIGwgOiAwICwgdCA6IDAgfTtcbiAgIHZhciB0b3BMZWZ0ID0gVXRpbHMuZ2V0RGl2Qm94KCBzaXplICk7XG4gICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCB0b3BMZWZ0ICk7XG5cbiAgIHNpemUgPSB7IHcgOiAxMDAgLCBoIDogMTAwICwgY29sb3IgOiAnI2ZmRkY5OScgLCBsIDogd2luZG93LmlubmVyV2lkdGggLSAxMDAgLCB0IDogMCB9O1xuICAgdmFyIHRvcFJpZ2h0ID0gVXRpbHMuZ2V0RGl2Qm94KCBzaXplICk7XG4gICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCB0b3BSaWdodCApO1xuXG4gICBzaXplID0geyB3IDogMTAwICwgaCA6IDEwMCAsIGNvbG9yIDogJyNmZjAwMDAnICwgbCA6IHdpbmRvdy5pbm5lcldpZHRoIC0gMTAwICwgdCA6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEwMCB9O1xuICAgdmFyIGJvdHRvbVJpZ2h0ID0gVXRpbHMuZ2V0RGl2Qm94KCBzaXplICk7XG4gICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBib3R0b21SaWdodCApO1xuXG4gICBzaXplID0geyB3IDogMTAwICwgaCA6IDEwMCAsIGNvbG9yIDogJyMwMEZGOTknICwgbCA6IDAgLCB0IDogd2luZG93LmlubmVySGVpZ2h0IC0gMTAwIH07XG4gICB2YXIgYm90dG9tTGVmdCA9IFV0aWxzLmdldERpdkJveCggc2l6ZSApO1xuICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggYm90dG9tTGVmdCApO1xuXG59XG5cbmZ1bmN0aW9uIF9pbml0VGVzdCgpIHtcblxuXG5cbiAgICBfbWV0ZXIgPSBuZXcgRlBTTWV0ZXIoKTtcblxuICAgIF9jcmVhdGVCYWNrZ3JvdW5kKCk7XG5cbiAgICBfY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuICAgIF9jb250YWluZXIuc3R5bGUubGVmdCA9ICgtX3JRdWFkICsgd2luZG93LmlubmVyV2lkdGgvMiApICsgJ3B4JztcbiAgICBfY29udGFpbmVyLnN0eWxlLnRvcCA9ICggd2luZG93LmlubmVySGVpZ2h0IC0gX3JRdWFkLzIuMikgKyAncHgnO1xuICAgIF9hcnJCYWxscyA9W107XG4gICAgdmFyIGkgPSAwIDtcbiAgICBmb3IoIGkgPSAwOyBpIDwgX25yQ2lyY2xlczsgaSsrICkge1xuICAgICAgICB2YXIgYmFsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBfY29udGFpbmVyLmFwcGVuZENoaWxkKCBiYWxsICk7XG4gICAgICAgIC8vYmFsbC5pbm5lckhUTUwgPSBpO1xuICAgICAgICBiYWxsLmNsYXNzTGlzdC5hZGQoXCJjaXJjbGVcIik7XG5cbiAgICAgICAgLy9pZiggaSA9PSAwKSB7XG4gICAgICAgICAgICBiYWxsLmNsYXNzTGlzdC5hZGQoIFwid2hpdGVcIiApO1xuICAgICAgICAvL1R3ZWVuTWF4LnNldCggYmFsbCAsICB7IGFscGhhIDogLjMgfSApO1xuICAgICAgICAvL31cblxuICAgICAgICBfYXJyQmFsbHMucHVzaCggYmFsbCApO1xuXG4gICAgICAgIHZhciBpdGVyID0gKGkgKiAzLjE0KjIgKSAvX25yQ2lyY2xlcyAvLzMuMTQ7Ly8oaSoxMCkgLyAxMCA7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2l0ZXIgJyAsIGl0ZXIpXG4gICAgICAgIHZhciBpdGVyRGVncmVlcyA9IGl0ZXIgKiAoMTgwL01hdGguUEkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCc6Oj0+IGl0ZXJEZWdyZWVzIDw9OjonICwgaXRlckRlZ3JlZXMpXG4gICAgICAgIHZhciBuZXdYID0gX3JRdWFkICsgTWF0aC5zaW4oIGl0ZXIpICogX3IgLSAxMDsgIC8vKyAxNTAgO1xuICAgICAgICB2YXIgbmV3WSA9IC1fclF1YWQgKyBNYXRoLmNvcyggaXRlcikgKiBfciAtIDEwOyAvLy0xMiAvLysgNDAwO1xuICAgICAgICBiYWxsLmluaXRQb3NYID0gbmV3WCA7XG4gICAgICAgIGJhbGwuaW5pdFBvc1kgPSBuZXdZIDtcbiAgICAgICAgYmFsbC5pdGVyID0gaXRlcjtcbiAgICAgICAgYmFsbC5teXNjYWxlID0gMTtcbiAgICAgICAgYmFsbC5pdGVyRGVncmVlcyA9IGl0ZXJEZWdyZWVzO1xuXG4gICAgICAgIFR3ZWVuTWF4LnNldCggYmFsbCAsICB7IHggOiBuZXdYICwgeSA6IG5ld1kgfSApO1xuICAgIH1cblxuXG4gICAgLy8qKnN0YXJ0IERyYWdnYWJsZVxuICAgIERyYWdnYWJsZS5jcmVhdGUoIFwiI2NvbnRhaW5lclwiICwge1xuICAgICAgICAgICAgdHlwZTpcInJvdGF0aW9uXCIsXG4gICAgIGVkZ2VSZXNpc3RhbmNlOjAuMTUsXG5cbiAgICAgZHJhZ1Jlc2lzdGFuY2UgOiAuNyxcblxuICAgICB0aHJvd1Byb3BzIDogdHJ1ZSxcbiAgICAgb25UaHJvd1VwZGF0ZSA6IF9vblRocm93VXBkYXRlLFxuICAgICB0aHJvd1Jlc2lzdGFuY2UgOiAxMDAwICwgLy9kZWZhdWx0IGlzIDEwMDBcbiAgICAgbWF4RHVyYXRpb24gOiAyICxcbiAgICAgb3ZlcnNob290VG9sZXJhbmNlIDogMSxcbiAgICAgb25EcmFnU3RhcnQgOiBfb25EcmFnU3RhcnQsXG4gICAgIG9uRHJhZ0VuZCA6IF9vbkRyYWdFbmQsXG4gICAgIG9uVGhyb3dDb21wbGV0ZSA6IF9vblRocm93Q29tcGxldGVcbiAgICAgLy90cnVlXG4gICAgIC8qICxcbiAgICAgICAgICAgIG9uRHJhZ0VuZDpmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBUaHJvd1Byb3BzUGx1Z2luLnRvKHRoaXMudGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93UHJvcHM6e1xuICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb246e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc2lzdGFuY2U6MTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eTpcImF1dG9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIE1hdGgucm91bmQobiAvIHJvdGF0aW9uU25hcCkgKiByb3RhdGlvblNuYXA7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgZWFzZTpQb3dlcjMuZWFzZU91dH0sIDIsIDAuMyk7XG4gICAgICAgICAgICB9Ki9cbiAgICAgICAgfSk7XG5cbiAgICBfZHJhZyA9IERyYWdnYWJsZS5nZXQoX2NvbnRhaW5lcik7XG4gICAgX2RyYWcudXBkYXRlKCk7XG4gICAgcnVuMigpO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlQmFja2dyb3VuZCgpIHtcbiAgICBfdmlkZW9CYWNrZ3JvdW5kID0gbmV3IFZpZGVvQmFja2dyb3VuZCgpO1xuICAgIF92aWRlb0JhY2tncm91bmQuaW5pdCgpO1xufVxuXG5mdW5jdGlvbiB0ZXN0RnVuYyggZSApIHtcbiAgICAvL2NvbnNvbGUubG9nKCdjaWFvJyAsIF9kcmFnLnJvdGF0aW9uKVxufVxuXG5mdW5jdGlvbiBfb25UaHJvd1VwZGF0ZSgpIHtcbiAgICAvL2NvbnNvbGUubG9nKCcgX2RyYWcucm90YXRpb24gOiAnICwgX2RyYWcucm90YXRpb24pO1xuICAgIHZhciByb3RNb2QgPSBfZHJhZy5yb3RhdGlvbjtcbiAgICBpZiggcm90TW9kIDwgMCApIHtcbiAgICAgICAgcm90TW9kID0gcm90TW9kICsgMzYwIDtcbiAgICB9XG4gICAgdmFyIGZ1dHVyZVNlZWtUaW1lID0gKCAocm90TW9kICUgMzYwKSAqIF9kdXJhdGlvbiApIC8gMzYwO1xuICAgIC8vKCBfdmlkZW9CYWNrZ3JvdW5kLnZpZGVvLmN1cnJlbnRUaW1lICogMzYwICkgLyBfZHVyYXRpb247XG4gICAgX3ZpZGVvQmFja2dyb3VuZC52aWRlby5jdXJyZW50VGltZSA9IGZ1dHVyZVNlZWtUaW1lO1xufVxuXG5mdW5jdGlvbiBfb25EcmFnU3RhcnQoKSB7XG4gICAgLy9fdmlkZW9CYWNrZ3JvdW5kLnZpZGVvLnBhdXNlKCk7XG4gICAgX2RyYWdnaW5nID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIF9vbkRyYWdFbmQoKSB7XG4gICAgLy9fdmlkZW9CYWNrZ3JvdW5kLnZpZGVvLnJlc3VtZSgpO1xuICAgIC8vX2RyYWdnaW5nID0gZmFsc2U7XG59XG5mdW5jdGlvbiBfb25UaHJvd0NvbXBsZXRlKCkge1xuICAgIF9kcmFnZ2luZyA9IGZhbHNlO1xufVxuXG52YXIgX3NwZWVkID0gLjE7XG52YXIgX2RyYWdnaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHJ1bjIoKSB7XG5cbiAgICBpZiggX3ZpZGVvQmFja2dyb3VuZCApIHtcbiAgICAgICAgX3ZpZGVvQmFja2dyb3VuZC5ydW4oKTtcbiAgICB9XG4gICAgaWYoICFfZHJhZ2dpbmcgKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coICApO1xuXG4gICAgICAgIHZhciBmdXR1cmVSb3QgPSAoIF92aWRlb0JhY2tncm91bmQudmlkZW8uY3VycmVudFRpbWUgKiAzNjAgKSAvIF9kdXJhdGlvbjtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnX2RyYWcucm90YXRpb24gOicgLCBfZHJhZy5yb3RhdGlvbilcbiAgICAgICAgX2RyYWcucm90YXRpb24gPSBmdXR1cmVSb3QgOy8vX2RyYWcucm90YXRpb24gKyBfc3BlZWQ7XG4gICAgICAgIFR3ZWVuTGl0ZS5zZXQoXCIjY29udGFpbmVyXCIse3JvdGF0aW9uOiBfZHJhZy5yb3RhdGlvbn0pO1xuICAgIH1cblxuICAgIC8vdmFyIHJvdE1vZCA9ICggTWF0aC5hYnMoX2RyYWcucm90YXRpb24pICkgJSAzNjA7XG4gICAgdmFyIHJvdE1vZCA9ICggX2RyYWcucm90YXRpb24gKyAxODApICUgMzYwO1xuICAgIGlmKCByb3RNb2QgPCAwICkge1xuICAgICAgICByb3RNb2QgPSByb3RNb2QgKyAzNjAgO1xuICAgIH1cbiAgICByb3RNb2QgPSByb3RNb2QgO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy9cbiAgICAvLyB9XG5cbiAgICAvLyB2YXIgcm90TW9kXG4gICAgLy8gaWYoIF9kcmFnLnJvdGF0aW9uIDwgMCApIHtcbiAgICAvLyAgICAgcm90TW9kID0gKCBfZHJhZy5yb3RhdGlvbiAgKyAxODAgKSAlIDM2MDtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgICByb3RNb2QgPSAoIF9kcmFnLnJvdGF0aW9uICArIDE4MCApICUgMzYwO1xuICAgIC8vIH1cblxuICAgIGZvciggaSA9IDAgO2kgPCBfbnJDaXJjbGVzOyBpICsrKSB7XG4gICAgICAgIHZhciBiYWxsID0gX2FyckJhbGxzWyBpIF07XG4gICAgICAgIGlmKCBiYWxsLml0ZXJEZWdyZWVzID4gcm90TW9kIC0gOCAmJiBiYWxsLml0ZXJEZWdyZWVzIDwgcm90TW9kICsgOCkge1xuICAgICAgICAgICAgLy9iYWxsLmNsYXNzTGlzdC5hZGQoIFwieWVsbG93XCIgKTtcbiAgICAgICAgICAgIC8vYmFsbC5jbGFzc0xpc3QucmVtb3ZlKCBcIndoaXRlXCIgKTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKCBiYWxsICwgMSAsIHsgc2NhbGVYIDogNCAsIHNjYWxlWSA6IDQgLCBlYXNlIDogQmFjay5lYXNlT3V0LmNvbmZpZygyLjcpfSApIDtcbiAgICAgICAgICAgIGJhbGwuc2NhbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCI/Pz8/P1wiLCBiYWxsLml0ZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiKysrKytcIiwgYmFsbC5pdGVyKVxuICAgICAgICAgICAgLy9iYWxsLmNsYXNzTGlzdC5hZGQoIFwid2hpdGVcIiApO1xuICAgICAgICAgICAgLy9iYWxsLmNsYXNzTGlzdC5yZW1vdmUoIFwieWVsbG93XCIgKTtcbiAgICAgICAgICAgIGlmKCBiYWxsLnNjYWxlZCApIHtcbiAgICAgICAgICAgICAgICBUd2Vlbk1heC50byggYmFsbCAsIC4zICwgeyBzY2FsZVggOiAxICwgc2NhbGVZIDogMSAsIGVhc2UgOiBCYWNrLmVhc2VPdXQuY29uZmlnKDIuNyl9ICkgO1xuICAgICAgICAgICAgICAgIGJhbGwuc2NhbGVkID0gZmFsc2UgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgaWYoIF9tZXRlcilcbiAgICAgICBfbWV0ZXIudGljaygpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJ1bjIpO1xufVxuXG4vLyoqcnVuXG5mdW5jdGlvbiBydW4oKVxue1xuICAgIF9pdGVyID0gX2l0ZXIgKyAwLjAwNTtcbiAgICB2YXIgaSA9IDAgO1xuICAgIGZvciggaSA9IDAgO2kgPCBfbnJDaXJjbGVzOyBpICsrKSB7XG4gICAgICAgIHZhciBiYWxsID0gX2FyckJhbGxzWyBpIF07XG4gICAgICAgIHZhciBhZGRlckl0ZXIgPSAoIF9pdGVyICsgYmFsbC5pdGVyICkgIDtcbiAgICAgICAgdmFyIG0gPSAoIGFkZGVySXRlciArIE1hdGguUEkgKyAwLjQpICAlICggTWF0aC5QSSAqIDIgKVxuXG4gICAgICAgIHZhciBuZXdYID0gTWF0aC5zaW4oIGFkZGVySXRlciApICogX3IgLy8rIDE1MCAgO1xuICAgICAgICB2YXIgbmV3WSA9IE1hdGguY29zKCBfaXRlciArIGJhbGwuaXRlcikgKiBfciAvLysgNDAwLy8tMjAwO1xuICAgICAgICBUd2Vlbk1heC5zZXQoIGJhbGwgLCAgeyB4IDogbmV3WCAsIHkgOiBuZXdZIH0gKTtcbiAgICAgICAgaWYoIG0gPiAwLjIgJiYgbSA8IDAuNikge1xuICAgICAgICAgICAgaWYoIGJhbGwubXlzY2FsZSA8IDMuMilcbiAgICAgICAgICAgICAgICBiYWxsLm15c2NhbGUgPSBiYWxsLm15c2NhbGUgKyBtLzQ7XG5cblxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiggYmFsbC5teXNjYWxlID4gMSlcbiAgICAgICAgICAgICAgICBiYWxsLm15c2NhbGUgPSBiYWxsLm15c2NhbGUgLSAwLjE7XG4gICAgICAgIH1cbiAgICAgICAgVHdlZW5NYXguc2V0KCBiYWxsICwgIHsgc2NhbGVYIDogYmFsbC5teXNjYWxlLCBzY2FsZVkgOiBiYWxsLm15c2NhbGUgfSApO1xuICAgIH1cblxuXG4gICAgaWYoIF9tZXRlcilcbiAgICAgICAgX21ldGVyLnRpY2soKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShydW4pO1xufVxudmFyIGFwcHZpZXcgPSBuZXcgQXBwVmlldygpO1xuXG5cblxuXG4vLyoqKioqKioqKioqKioqKipcbi8qXG5EcmFnZ2FibGUuY3JlYXRlKCBcIiNjb250YWluZXJcIiAsIHtcbiAgICAgICAgIHR5cGU6XCJyb3RhdGlvblwiLCAvL2luc3RlYWQgb2YgXCJ4LHlcIiBvciBcInRvcCxsZWZ0XCIsIHdlIGNhbiBzaW1wbHkgZG8gXCJyb3RhdGlvblwiIHRvIG1ha2UgdGhlIG9iamVjdCBzcGlubmFibGUhXG4gICAgICAgICBvbkRyYWdFbmQ6ZnVuY3Rpb24oKSB7IC8vc2luY2Ugd2Ugd2FudCB0byBhcHBseSBjb25kaXRpb25hbCBzbmFwcGluZywgd2UgdXNlIGFuIG9uRHJhZ0VuZCBjYWxsYmFjayB0byBkbyBvdXIgVGhyb3dQcm9wc1BsdWdpbiB0d2VlbiwgYnV0IGlmIHlvdSBkb24ndCBuZWVkIHRoYXQgY3VzdG9tIGZ1bmN0aW9uYWxpdHksIHlvdSBjYW4gc2ltcGx5IHNldCB0aHJvd1Byb3BzOnRydWUgYW5kIGFzIGxvbmcgYXMgVGhyb3dQcm9wc1BsdWdpbiBpcyBsb2FkZWQsIGl0J2xsIGF1dG8tYXBwbHkga2luZXRpYy1iYXNlZCBzcGlubmluZyFcbiAgICAgICAgICAgICBUaHJvd1Byb3BzUGx1Z2luLnRvKHRoaXMudGFyZ2V0LCB7XG4gICAgICAgICAgICAgICAgIHRocm93UHJvcHM6e1xuICAgICAgICAgICAgICAgICAgICAgcm90YXRpb246e1xuICAgICAgICAgICAgICAgICAgICAgICAgIHJlc2lzdGFuY2U6MTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eTpcImF1dG9cIiwgLy9zaW5jZSBEcmFnZ2FibGUgYXV0b21hdGljYWxseSB0cmFja3MgXCJyb3RhdGlvblwiLCBpdHMgdmVsb2NpdHkgd2lsbCBiZSBjYWxjdWxhdGVkIGZvciB1cy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAvL2VuZDogZnVuY3Rpb24obikgeyByZXR1cm4gTWF0aC5yb3VuZChuIC8gcm90YXRpb25TbmFwKSAqIHJvdGF0aW9uU25hcDsgfVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9LCBlYXNlOlBvd2VyMy5lYXNlT3V0fSwgMiwgMC4zKTsgLy9hbGxvdyBhIG1heGltdW0gZHVyYXRpb24gb2YgMiwgYW5kIGEgbWluaW11bSBvZiAwLjMuXG4gICAgICAgICB9XG4gICAgIH0pO1xuKi9cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIFZpZGVvQmFja2dyb3VuZCA9ICggZnVuY3Rpb24oKVxue1xuICAgIC8vKipwdWJsaWMgdmFyc1xuICAgIFZpZGVvQmFja2dyb3VuZC5wcm90b3R5cGUucHVibGljVGVzdCA9ICcyMjInO1xuXG4gICAgLy8qKmNvbnN0cnVjdG9yXG4gICAgZnVuY3Rpb24gVmlkZW9CYWNrZ3JvdW5kKClcbiAgICB7XG5cbiAgICAgICAgdmFyIF9mcmFtZVJhdGUgPSAyNTtcbiAgICAgICAgdmFyIF9mcmFtZSA9IDA7XG5cbiAgICAgICAgLy8qKnB1YmxpYyB2YXJzXG4gICAgICAgIHRoaXMucHVibGljVmFyID0gJ2NpYW8nIDtcbiAgICAgICAgdGhpcy5mcHMgPSAzMDtcbiAgICAgICAgdGhpcy5ub3c7XG4gICAgICAgIHRoaXMudGhlbiA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSAxMDAwIC8gdGhpcy5mcHNcbiAgICAgICAgdGhpcy5kZWx0YTtcblxuICAgICAgICAvLyoqc2F2ZSBzY29wZVxuICAgICAgICB2YXIgX3Njb3BlID0gdGhpcztcblxuICAgICAgICAvLyoqcHJpdmlsZWdlZCBtZXRob2RzXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5pc0lPUyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYoIC9pUGhvbmV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VFICcpXG4gICAgICAgICAgICAgICAgdGhpcy5pc0lPUyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmkgPSAwO1xuICAgICAgICAgICAgdGhpcy5pdiA9IDAgO1xuXG4gICAgICAgICAgICAvL3ZpZGVvXG4gICAgICAgICAgICB0aGlzLnZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblx0ICAgICAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZSgnc3JjJywgJ3ZpZGVvL2NjMzYwLm1wNCcpO1xuICAgICAgICAgICAgLy90aGlzLnZpZGVvLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIF9vblZpZGVvQ29tcGxldGUgLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyggX3Njb3BlLnZpZGVvLmR1cmF0aW9uKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8qKmNhbnZhc1xuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoICA9IDk2MC8vd2luZG93LmlubmVyV2lkdGggLy8rIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IDM5MC8vd2luZG93LmlubmVySGVpZ2h0IC8vKyBcInB4XCI7XG4gICAgICAgICAgICAvL3RoaXMuY2FudmFzLnN0eWxlLnpJbmRleCAgID0gODtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUubGVmdCA9IDAgO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUudG9wID0gMCA7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5ib3JkZXIgICA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5pZD0nJztcblxuICAgICAgICAgICAgdmFyIGJhY2tncm91bmREaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2dyb3VuZCcpO1xuICAgICAgICAgICAgYmFja2dyb3VuZERpdi5hcHBlbmRDaGlsZCggdGhpcy5jYW52YXMgKTtcblxuICAgICAgICAgICAgaWYoICF0aGlzLmlzSU9TICkge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmREaXYuYXBwZW5kQ2hpbGQoIHRoaXMudmlkZW8gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICsgXCJweFwiO1xuXG5cbiAgICAgICAgICAgIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsIF9vbkNhblBsYXksIHRydWUpO1xuICAgICAgICAgICAgdGhpcy52aWRlby5sb2FkKCk7XG4gICAgICAgICAgICBpZiggIXRoaXMuaXNJT1MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy52aWRlby5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3ZpZGVvIGNsaWNrJyk7XG4gICAgICAgICAgICAgICAgaWYoICF0aGlzLmlzSU9TKSB7XG4gICAgICAgICAgICAgICAgICAgIF9zY29wZS52aWRlby5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vc2V0VGltZW91dCggcnVuICwgMSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYW52YXMub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW52YXMgY2xpY2snKTtcbiAgICAgICAgICAgICAgICBpZiggIXRoaXMuaXNJT1MpIHtcbiAgICAgICAgICAgICAgICAgICAgX3Njb3BlLnZpZGVvLnBsYXkoKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vc2V0VGltZW91dCggcnVuICwgMSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX29uQ2FuUGxheShlKSB7XG5cbiAgICAgICAgICAgIF9zY29wZS52aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgX29uQ2FuUGxheSwgdHJ1ZSk7XG4gICAgICAgICAgICAvL3J1bigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX29uVmlkZW9Db21wbGV0ZSgpIHtcbiAgICAgICAgICAgIF9zY29wZS52aWRlby5wbGF5KCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vKiogUFVCTElDIE1FVEhPRFNcbiAgICBWaWRlb0JhY2tncm91bmQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmkgKys7XG4gICAgICAgIHRoaXMuaXYgKys7XG4gICAgICAgIGlmKCB0aGlzLmkgPiAxIClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5pID0gMDtcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmlzaU9TKTtcbiAgICAgICAgICAgIGlmKCB0aGlzLmlzSU9TICkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy5pdik7XG5cblxuICAgICAgICAgICAgICAgIHRoaXMubm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy5ub3cgLSB0aGlzLnRoZW47XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVsdGEgPiB0aGlzLmludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGhlbiA9IHRoaXMubm93IC0gKHRoaXMuZGVsdGEgJSB0aGlzLmludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52aWRlby5jdXJyZW50VGltZSA9IHRoaXMudmlkZW8uY3VycmVudFRpbWUgKyAxIC8gdGhpcy5mcHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCB0aGlzLml2ID4gMCApXG4gICAgICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vLyoqc3BlZWQgY29udHJvbC4gbmVlZCB0byBiZSByZXBsYWNlZCB3aXRoXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy52aWRlby5jdXJyZW50VGltZSA9IHRoaXMudmlkZW8uY3VycmVudFRpbWUgKyAuMDU7XG5cblxuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy52aWRlby5jdXJyZW50VGltZSA+IDYwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWRlby5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdiA9IDAgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuICAgIFZpZGVvQmFja2dyb3VuZC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoIHRoaXMudmlkZW8sIDAsIDAsIDk2MCwgMzkwKTtcbiAgICB9XG5cblxuXG5cbiAgICByZXR1cm4gVmlkZW9CYWNrZ3JvdW5kIDtcbn0gKSgpIDtcbm1vZHVsZS5leHBvcnRzID0gVmlkZW9CYWNrZ3JvdW5kXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHt9O1xuLy8qKmhlcmUgYW55IHJlcXVpcmVcbi8vKipcblxuKCBmdW5jdGlvbigpIHtcbiAgICBVdGlscy5nZXREaXZCb3ggPSBmdW5jdGlvbiggc2l6ZSApIHtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpIDtcbiAgICAgICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZGl2LnN0eWxlLndpZHRoID0gc2l6ZS53ICsgJ3B4JztcbiAgICAgICAgZGl2LnN0eWxlLmhlaWdodCA9IHNpemUuaCArICdweCc7XG4gICAgICAgIGNvbnNvbGUubG9nOVxuICAgICAgICBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gc2l6ZS5jb2xvcjtcbiAgICAgICAgZGl2LnN0eWxlLnRvcCA9IHNpemUudCArICdweCc7XG4gICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gc2l6ZS5sICsgJ3B4JztcbiAgICAgICAgcmV0dXJuIGRpdjtcbiAgICB9XG4gICAgVXRpbHMuaXNNb2JpbGUgPSB7XG4gICAgICAgIEFuZHJvaWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSk7XG4gICAgICAgIH0sXG4gICAgICAgIEJsYWNrQmVycnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0JsYWNrQmVycnkvaSk7XG4gICAgICAgIH0sXG4gICAgICAgIGlPUzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQYWR8aVBvZC9pKTtcbiAgICAgICAgfSxcbiAgICAgICAgT3BlcmE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL09wZXJhIE1pbmkvaSk7XG4gICAgICAgIH0sXG4gICAgICAgIFdpbmRvd3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1dQRGVza3RvcC9pKTtcbiAgICAgICAgfSxcbiAgICAgICAgYW55OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAoaXNNb2JpbGUuQW5kcm9pZCgpIHx8IGlzTW9iaWxlLkJsYWNrQmVycnkoKSB8fCBpc01vYmlsZS5pT1MoKSB8fCBpc01vYmlsZS5PcGVyYSgpIHx8IGlzTW9iaWxlLldpbmRvd3MoKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvLyoqcHJpdmF0ZVxuICAgIGZ1bmN0aW9uIF9wcml2YXRlTWV0aG9kKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnaGV5IGkgYW0gYSBwcml2YXRlIG1ldGhvZCcpXG4gICAgfVxufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gVXRpbHMgO1xuIl19
