document.cookie = 'cross-site-cookie=bar; SameSite=Lax';

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
  if(seconds<10){
    timer.innerHTML = minutes + ":0" + seconds + " ";
  }
  else{
    timer.innerHTML = minutes + ":" + seconds + " ";
  }
  

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer-display").innerHTML = "EXPIRED";
  }
}

function updateTimer(event){
  timer.innerHTML = "";
  timer.style.display="block";
  selectTime.style.display="none";
  document.getElementById("timer-buttons").style.display="block";
  //resetButton.style.display="block"
  
  minutes = event.currentTarget.time;
  countDownDate = new Date().getTime() + ((minutes * 60 ) * 1000);

  clearInterval(x);
  x = setInterval(timerRunner);
  
}
const audio = document.getElementById("youtube");
const playButton = document.querySelector('.play-button');
const player = document.getElementById("player");

const timer = document.getElementById("timer-display");
const resetButton = document.getElementById("reset");
const stopButton = document.getElementById("stop");
const selectTime = document.getElementById("select-time");
let isPlaying = false;

var buttonList = ["8min", "12min", "16min", "20min", "24min"];

for(let i = 0; i <5; i++){
  var button = document.getElementById(buttonList[i]);
  button.addEventListener("click", updateTimer);
  button.time = (8+i*4) + (1/60);
}

var ambientList = ["wind", "brown", "fire"];
var ambientIds = ["jX6kn9_U8qk&t", "RqzGzwTY-6w&t", "6VB4bgiB0yA"];

for(let i = 0; i<ambientList.length; i++){
  var button = document.getElementById(ambientList[i]+"-audio");
  button.addEventListener("click", toggleAudio);
  button.audio = ambientIds[i];
  button.element = ambientList[i]+"-yt";
  button.isPlaying = false;
  audioSetup(button.audio, ambientList[i]+"-yt");
  

  var volumeSlider = document.getElementById(ambientList[i]+"-slider");
  volumeSlider.audio = button.element;
  volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    console.log(value);
    document.getElementById(e.currentTarget.audio).volume = value / 40;
  });

}


resetButton.onclick = function(){
  timer.style.display="none";
  selectTime.style.display="block";
  document.getElementById("timer-buttons").style.display="none";
  //resetButton.style.display="none"
}
stopButton.onclick = function(){
  
}

player.onclick = function(){
	toggleAudio();
};



function toggleAudio(event){
  console.log("toggle audio");
  var audio = document.getElementById(event.currentTarget.element);
  if (event.currentTarget.isPlaying) {
		audio.pause()
		event.currentTarget.isPlaying = false
    event.currentTarget.style.backgroundColor = "#f3f3f3";
	} 
  else {
		audio.play()
		event.currentTarget.isPlaying = true
    event.currentTarget.style.backgroundColor = "#4CAF50";
	}
}
//video

function audioSetup(id, element){
  var vid = id,
audio_streams = {},
audio_tag = document.getElementById(element);

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

      //console.log(data);

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

      //console.log(audio_streams);

      audio_tag.src = audio_streams['256kbps'] || audio_streams['128kbps'] || audio_streams['48kbps'];
      audio_tag.volume = 0.25;
      //audio_tag.play();
    })
  }
});
}



