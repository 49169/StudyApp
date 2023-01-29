document.cookie = 'cookie1=value1; SameSite=Lax';

// Set the date we're counting down to
var minutes = 8;
var countDownDate = new Date().getTime() + ((minutes * 60 ) * 1000);
var startCountDown = 0;

var checkList = [];
var breakTime = 0;
//localStorage.clear();
if(localStorage.getItem('checkList')){
  checkList = JSON.parse(localStorage.getItem('checkList'));
}
if(localStorage.getItem('breakTime')){
  breakTime = Number(localStorage.breakTime);
}


var distance = 0;

// Update the count down every 1 second
var x = null;

var paused = false;

function timerRunner(){
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var progress = 100 - ((distance)/(countDownDate-startCountDown) *100);
  
  timerBar.value = progress;

  distance = countDownDate - now;

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
    timerFinished();
    //document.getElementById("timer-display").innerHTML = "EXPIRED";
  }
}

function timerFinished(){
  var timeComplete = countDownDate-startCountDown;
  var minutes = Math.floor((timeComplete % (1000 * 60 * 60)) / (1000 * 60));
  if(minutes <= 8){
    breakTime+= 0.5;
  }
  else if (minutes <= 12){
    breakTime += 1;
  }
  else if (minutes <= 16){
    breakTime+= 1.5;
  }
  else if (minutes <= 20){
    breakTime+= 2;
  }
  else if (minutes <= 24){
    breakTime += 3;
  }
  localStorage.breakTime = breakTime;

  timer.style.display="none";
  timerBar.style.display = "none";
  selectTime.style.display="block";
  document.getElementById("timer-buttons").style.display="none";
}

function updateTimer(event){
  timer.innerHTML = "";
  timer.style.display="block";
  timerBar.style.display = "block";
  selectTime.style.display="none";
  document.getElementById("timer-buttons").style.display="block";
  //resetButton.style.display="block"
  
  minutes = event.currentTarget.time;
  countDownDate = new Date().getTime() + ((minutes * 60 ) * 1000);
  startCountDown = new Date().getTime();

  clearInterval(x);
  x = setInterval(timerRunner);
}

function pauseTimer(){
  paused = true;
  clearInterval(x);
}

function resumeTimer(){
  paused = false;
  countDownDate = new Date().getTime() + (distance);
  //startCountDown = new Date().getTime();
  x = setInterval(timerRunner)
}
const audio = document.getElementById("youtube");
const playButton = document.querySelector('.play-button');
const player = document.getElementById("player");

const timer = document.getElementById("timer-display");
const resetButton = document.getElementById("reset");
const stopButton = document.getElementById("stop");
const selectTime = document.getElementById("select-time");
const timerBar = document.getElementById("timer-bar");
let isPlaying = false;

var buttonList = ["8min", "12min", "16min", "20min", "24min"];

for(let i = 0; i <5; i++){
  var button = document.getElementById(buttonList[i]);
  button.addEventListener("click", updateTimer);
  button.time = (8+i*4) + (1/60);
  //button.time = 0.1;
}

var ambientList = ["wind", "brown", "fire"];
var ambientIds = ["jX6kn9_U8qk&t", "GhgL3y-oDAs", "6VB4bgiB0yA"];

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
    //console.log(value);
    document.getElementById(e.currentTarget.audio).volume = value / 40;
  });
}

resetButton.onclick = function(){
  timer.style.display="none";
  timerBar.style.display = "none";
  selectTime.style.display="block";
  document.getElementById("timer-buttons").style.display="none";
  //resetButton.style.display="none"
}
stopButton.onclick = function(){
  if(paused == false){
    pauseTimer();
    stopButton.innerHTML = 'start';
  }
  else{
    resumeTimer();
    stopButton.innerHTML = 'stop';
  } 
}

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

const form = document.getElementById('task-form');
const taskList = document.getElementById('tasks');

form.onsubmit = function (e) {
	e.preventDefault();
	const inputField = document.getElementById('task-input');
  if(inputField.value != ''){
    addTask(inputField.value, true);
  }
	form.reset();
};

function addTask(description, addToStorage) {
	const taskContainer = document.createElement('div');
	const newTask = document.createElement('input');
	const taskLabel = document.createElement('label');
	const taskDescriptionNode = document.createTextNode(description);

	newTask.setAttribute('type', 'checkbox');
	newTask.setAttribute('name', description);
	newTask.setAttribute('id', description);

  newTask.addEventListener('click', updateTask);

	taskLabel.setAttribute('for', description);
	taskLabel.appendChild(taskDescriptionNode);
  taskLabel.className = 'taskLabel';

	taskContainer.classList.add('task-item');
	taskContainer.appendChild(newTask);
	taskContainer.appendChild(taskLabel);

	taskList.appendChild(taskContainer);

  if(addToStorage){
    checkList.push(description);
    localStorage.setItem('checkList', JSON.stringify(checkList));
  }
}

function updateTask(event){
  //console.log(event.currentTarget.children[0].id);
  if(event.currentTarget.checked){
    const index = checkList.indexOf(event.currentTarget.id);
    console.log(index);
    if(index > -1){
      checkList.splice(index, 1);
    }
    localStorage.setItem('checkList', JSON.stringify(checkList));
  }
  else{
    console.log("not checked");
  }
}

for(let i = 0; i<checkList.length; i++){
  addTask(checkList[i]);
}
//Pie Chart
Chart.defaults.plugins.legend.display = false;
var timeChart = new Chart("timeChart", {
  type: 'doughnut',
  data: {
    labels: [
      'Study',
      'Break',
    ],
    datasets: [{
      label:' Minutes',
      data: [100,200],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  },
  options:{
    responsive:false,
    plugins: {
      legend: {
         
          labels: {
              color: 'rgb(255, 99, 132)'
          }
      }
  }
  },
});

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



