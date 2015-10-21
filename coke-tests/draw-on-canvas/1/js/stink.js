<html>
	<head>
		<title>Honda Type R - iPhone</title>
		<meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui" />
		<style type="text/css">
		body { margin: 0; padding: 0; background-color: #000; }
		#video-container {
			position: relative;
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
		#display { position: absolute; left: 0; pointer-events: none; }
		#intro {
			background: url('assets/intro.jpg') center center no-repeat;
			background-size: contain;
			height: 100%;
			left: 0;
			position: absolute;
			top: 0;
			width: 100%;
		}
		#switch { display: none; }
		#switch.loaded {
			display: block;
			height: 25%;
			position: absolute;
			right: 0;
			bottom: 0;
			color: #fff;
			border: 1px solid #fff;
			font-family: arial,sans-serif;
			font-size: 25vh;
			line-height: 25vh;
			font-weight: bold;
			text-align: center;
			margin: 5px 5%;
			padding: 1%;
			-webkit-transform: skew(8deg, 0);
			transform: skew(8deg, 0);
			-webkit-user-select: none;
			user-select: none;
			-webkit-touch-callout: none;
			touch-callout: none;
		}
		#switch:active { color: #f00; border-color: #f00; }
		#loader { width: 100%; height: 100%; position: absolute; top: 0; left: 0; background: rgba(0, 0, 0, 0.8); z-index: 2; }
		#loader > div {
			position: absolute;
			top: 50%;
			left: 50%;
			font-family: sans-serif;
			font-weight: bold;
			color: #fff;
			text-align: center;
			line-height: 3em;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
		}
		</style>
	</head>
	<body>
		<div id="loader">
			<div>
				Loading...
			</div>
		</div>
		<div id="video-container">
			<canvas id="display" width="960" height="390"></canvas>
			<!-- <img id="intro" src="assets/intro.jpg" /> -->
			<!-- <div class="intro"></div> -->
			<div id="intro"></div>
			<span id="switch">R</span>
		</div>
		<script type="text/javascript">
		var model = {
			started: false,
			playing: false,
			activeIndex: 0,
			audioLoaded: false,
			videoCanPlay: false,
			videoFrame: 0,
			videoFrameRate: 25,
			videoAspectRatio: 390 / 960,
			videoOffsetX: 1,
			startedAt: 0,
			pausedAt: 0,
			canvasWidth: 0,
			canvasHeight: 0
		};

		var intro = document.getElementById('intro'),
			linkSwitch = document.getElementById('switch'),
			canvas = document.getElementById('display'),
			canvasContext = canvas.getContext('2d');

		// load video

		var video = document.createElement('video');
		video.setAttribute('src', 'assets/honda-en-gb.mov');

		function videoCanPlay(e) {
			video.removeEventListener('canplay', videoCanPlay, true);
			model.videoCanPlay = true;
			checkLoaded();
		}

		video.addEventListener('canplay', videoCanPlay, true);
		video.load();

		// load audio

		var context = new (window.AudioContext || window.webkitAudioContext)();

		var	sourceBuffer = null,
			audio = null,
			splitter = context.createChannelSplitter(2),
			merger = context.createChannelMerger(2),
			gainL = context.createGain(),
			gainR = context.createGain();

		function initAudio() {
			audio = context.createBufferSource();
			audio.buffer = sourceBuffer;
			audio.connect(splitter);
			splitter.connect(gainL, 0);
			splitter.connect(gainR, 1);
			gainL.connect(merger, 0, 0);
			gainR.connect(merger, 0, 1);
			merger.connect(context.destination);
			gainL.gain.value = 1;
			gainR.gain.value = 0;
		}

		function offsetCanvas() {
			canvas.style.left = '-' + (model.videoOffsetX * window.innerWidth) + 'px';
		}

		function initLayout() {
			canvas.width = model.canvasWidth = window.innerWidth * 2;
			canvas.height = model.canvasHeight = window.innerWidth * model.videoAspectRatio;
			canvas.style.top = window.innerHeight / 2 - canvas.height / 2;

			offsetCanvas();
		}

		function doPlay(e) {
			e.preventDefault();
			e.stopPropagation();

			if (model.playing) {
				model.pausedAt = context.currentTime - model.startedAt;
				audio.stop(context.currentTime);
				model.playing = false;
			} else {
				initAudio();
				audio.start(0, model.pausedAt);
				model.startedAt = context.currentTime - model.pausedAt;
				model.playing = true;

				if (!model.started) {
					model.started = true;
					intro.parentNode.removeChild(intro);
					linkSwitch.classList.add('loaded');
				}
			}
		}

		function doSwitch(e) {
			e.preventDefault();
			e.stopPropagation();

			model.activeIndex = 1 - model.activeIndex;
			model.videoOffsetX = (1 - model.activeIndex);
			gainL.gain.value = 1 - model.activeIndex;
			gainR.gain.value = model.activeIndex;

			offsetCanvas();
		}

		function draw() {
			video.currentTime = model.videoFrame / model.videoFrameRate;

			// drawImage(v, sx, sy, sw, sh ...) performs terribly so draw the whole frame and use css offset
			canvasContext.drawImage(video, 0, 0, model.canvasWidth, model.canvasHeight);
		}

		function animate() {
			if (model.playing) {
				var frame = 0 | model.videoFrameRate * (context.currentTime - model.startedAt);
				if (frame !== model.videoFrame) {
					model.videoFrame = frame;
					draw();
				}
			}
			requestAnimationFrame(animate);
		}

		function checkLoaded() {
			if (!model.audioLoaded || !model.videoCanPlay) {
				return false;
			}

			var loader = document.getElementById('loader');
			loader.parentNode.removeChild(loader);

			// Need to recall initLayout here for iPhone6
			initLayout();
			requestAnimationFrame(animate);
		}

		// window.addEventListener('touchstart', doPlay, false);
		// Listen to 'touchend' to start the audio. Doesn't work
		// with 'touchstart' on iPhone6
		// http://www.holovaty.com/writing/ios9-web-audio/
		window.addEventListener('touchend', doPlay, false);
		window.addEventListener('orientationchange', initLayout, true);
		window.addEventListener('resize', initLayout, true);
		linkSwitch.addEventListener('touchstart', doSwitch, false);
		linkSwitch.addEventListener('touchend', doSwitch, false);

		initLayout();

		var request = new XMLHttpRequest();
		request.open('GET', 'assets/day_night.mp3', true);
		request.responseType = 'arraybuffer';
		request.onload = function(e) {
			context.decodeAudioData(this.response, function(buffer) {
				sourceBuffer = buffer;
				initAudio();

				model.audioLoaded = true;
				checkLoaded();
			});
		};

		request.send();
		</script>
	</body>
</html>
