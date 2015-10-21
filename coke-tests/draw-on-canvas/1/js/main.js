window.onload = function()
{
    init() ;
}

var canvas;
var canvasContext;
var video;
var iter = 0 ;
var iterVideo = 0;
var meter;
function init()
{
    meter = new FPSMeter();

    canvas = document.getElementById('display'),
    canvasContext = canvas.getContext('2d');

    video = document.createElement('video');
	video.setAttribute('src', 'assets/f.mp4');

    function videoCanPlay(e) {
        video.removeEventListener('canplay', videoCanPlay, true);
        run();
    }

    video.addEventListener('canplay', videoCanPlay, true);
    video.load();
    //video.play();
    //document.body.appendChild( video );
}

//**run
function run()
{
    iter ++;
    iterVideo ++;
    if( iter > 0 )
    {
        iter = 0;
        draw();
        // if( iterVideo > 4 )
        // {
            video.currentTime = video.currentTime + .03;
            iterVideo = 0 ;
        // }
    }

    meter.tick();
    requestAnimationFrame(run);
}
function draw() {
    iterVideo++;
    canvasContext.drawImage(video, 0, 0, 960, 390);
}
