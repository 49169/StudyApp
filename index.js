// Set the date we're counting down to
var minutes = 8;
var countDownDate = new Date().getTime() + ((minutes * 60 ) * 1000);

// Update the count down every 1 second
var x = null;

function timerRunner(){
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
 
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  timer.innerHTML = minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer-display").innerHTML = "EXPIRED";
  }
}

function updateTimer(time){
  console.log("here");
  timer.style.display="block";
  selectTime.style.display="none";
  minutes = time;
  countDownDate = new Date().getTime() + ((minutes * 60 ) * 1000);

  clearInterval(x);
  x = setInterval(timerRunner, 1000);
  
}
const audio = document.getElementById("youtube");
const playButton = document.querySelector('.play-button');
const player = document.getElementById("player");
const volumeSlider = document.getElementById("volumeSlider");
const timer = document.getElementById("timer-display");
const resetButton = document.getElementById("reset");
const selectTime = document.getElementById("select-time");
let isPlaying = false;

var buttonList = ["8min", "12min", "16min", "20min", "24min"];

for(let i = 0; i <5; i++){
  document.getElementById(buttonList[i]).addEventListener("click", updateTimer, 8+i*4);
}

resetButton.onclick = function(){
  timer.style.display="none";
  selectTime.style.display="block";
}

player.onclick = function(){
	toggleAudio();
};

volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  //showRangeProgress(e.target);
  //outputContainer.textContent = value;
  audio.volume = value / 100;
});

function toggleAudio(){
  console.log("toggle audio");
  if (isPlaying) {
		audio.pause()
		isPlaying = false
		//playButton.classList.remove('playing')
	} else {
		audio.play()
		isPlaying = true
		//playButton.classList.add('playing')
	}
}

var vid = "Mi12nUC2QKo&t",
  audio_streams = {},
  audio_tag = document.getElementById("youtube");

fetch("https://images" + ~~(Math.random() * 33) + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=" + encodeURIComponent("https://www.youtube.com/watch?hl=en&v=" + vid)).then(response => {
  if (response.ok) {
    response.text().then(data => {

      var regex = /(?:ytplayer\.config\s*=\s*|ytInitialPlayerResponse\s?=\s?)(.+?)(?:;var|;\(function|\)?;\s*if|;\s*if|;\s*ytplayer\.|;\s*<\/script)/gmsu;

      data = data.split('window.getPageData')[0];
      data = data.replace('ytInitialPlayerResponse = null', '');
      data = data.replace('ytInitialPlayerResponse=window.ytInitialPlayerResponse', '');
      data = data.replace('ytplayer.config={args:{raw_player_response:ytInitialPlayerResponse}};', '');


      var matches = regex.exec(data);
      var data = matches && matches.length > 1 ? JSON.parse(matches[1]) : false;

      console.log(data);

      var streams = [],
        result = {};

      if (data.streamingData) {

        if (data.streamingData.adaptiveFormats) {
          streams = streams.concat(data.streamingData.adaptiveFormats);
        }

        if (data.streamingData.formats) {
          streams = streams.concat(data.streamingData.formats);
        }

      } else {
        return false;
      }

      streams.forEach(function(stream, n) {
        var itag = stream.itag * 1,
          quality = false;
        //console.log(stream);
        switch (itag) {
          case 139:
            quality = "48kbps";
            break;
          case 140:
            quality = "128kbps";
            break;
          case 141:
            quality = "256kbps";
            break;
          case 249:
            quality = "webm_l";
            break;
          case 250:
            quality = "webm_m";
            break;
          case 251:
            quality = "webm_h";
            break;
        }
        if (quality) audio_streams[quality] = stream.url;
      });

      console.log(audio_streams);

      audio_tag.src = audio_streams['256kbps'] || audio_streams['128kbps'] || audio_streams['48kbps'];
      //audio_tag.play();
    })
  }
});


