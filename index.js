document.cookie = 'cookie1=value1; SameSite=Lax';

var studyTimer, checkList, breakTime, totalStudyTime, timeStudiedEachDay, studyMinutes, countDownDate, startCountDown, distance, progress;


function init(){
  //Study timer
  var studyMinutes = 8;
  var countDownDate = new Date().getTime() + ((studyMinutes * 60 ) * 1000);
  var startCountDown = 0;

  distance = 0;
  var studyTimerObject = null;
  var paused = false;
  var studyMode = true;

  studyTimer = new Timer();

  //Total minutes studied per day
  totalStudyTime = 0;

  let currentDate = new Date();
  let day = currentDate.getDay();
  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();

  let lastTimeLogged = day + ',' + month +','+year;

  localStorage.lastTimeLogged = lastTimeLogged;
  timeStudiedEachDay = new Map(JSON.parse(localStorage.timeStudiedEachDay));

  let key = day+6 + ',' + month +','+year;
  timeStudiedEachDay.set(key, 50);

  localStorage.timeStudiedEachDay = JSON.stringify(Array.from(timeStudiedEachDay.entries()));

  //Checklist of tasks 
  checkList = [];

  //Amount of break time
  breakTime = 0;
  var breakTimeCountDownDate = new Date().getTime();
  var breakTimeStartCountDown = 0;
  var breakTimeDistance = 0;
  var breakTimerObject = null;
  var breakPaused = true;
}


//Fetch stored data
//localStorage.clear();


class Timer{
  constructor(time){
    this.time = time;
    
  }
  createTimer(parent){
    parent.now = new Date().getTime();
    console.log(parent.distance);
    parent.progress = 100 - ((parent.distance)/(parent.countDownDate-parent.startCountDown) *100);
    timerBar.value = parent.progress;

    parent.distance = parent.countDownDate - parent.now;

    parent.timeLeft = parent.countDownDate - parent.now;
  
    var studyMinutes = Math.floor((parent.distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((parent.distance % (1000 * 60)) / 1000);

    if(seconds<10){
      timer.innerHTML = studyMinutes + ":0" + seconds + " ";
    }
    else{
      timer.innerHTML = studyMinutes + ":" + seconds + " ";
    }
    if (timer.timeLeft < 0) {
      //clearInterval(parent);
      parent.timerFinished();
    }
  }
  startTimer(minutes){
    this.distance = 0;
    this.countDownDate = new Date().getTime() + ((minutes * 60 ) * 1000);
    this.startCountDown = new Date().getTime ();
    //console.log(100 - ((this.distance)/(this.countDownDate-this.startCountDown) *100));
    clearInterval(this.timer);
    this.timer = setInterval(this.createTimer(this));
  }
  pauseTimer(){
    this.paused = true;
    clearInterval(this.timer);
  }
  timerFinished(){
    console.log("finished");
  }
}

init();
fetchAllData();

function fetchAllData(){
  if(localStorage.getItem('checkList')){
    checkList = JSON.parse(localStorage.getItem('checkList'));
  }
  if(localStorage.getItem('breakTime')){
    breakTime = Number(localStorage.breakTime);
  }
  if(localStorage.getItem('totalStudyTime')){
    
    totalStudyTime = Number(localStorage.totalStudyTime);
  }
  else{
    localStorage.totalStudyTime = 0;
  }
}

function timerRunner(){
  var now = new Date().getTime();

  var progress = 100 - ((distance)/(countDownDate-startCountDown) *100);
  timerBar.value = progress;

  distance = countDownDate - now;
 
  var studyMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if(seconds<10){
    timer.innerHTML = studyMinutes + ":0" + seconds + " ";
  }
  else{
    timer.innerHTML = studyMinutes + ":" + seconds + " ";
  }
  if (distance < 0) {
    clearInterval(studyTimerObject);
    timerFinished();
  }
}

function breakTimerRunner(){
  var now = new Date().getTime();
  var progress = 100 - ((breakTimeDistance)/(breakTimeCountDownDate-breakTimeStartCountDown)*100);
  breakTimeDistance = breakTimeCountDownDate - now;

  var studyMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if(seconds<10){
    breakTimerDisplay.innerHTML = studyMinutes + ":0" + seconds + " ";
  }
  else{
    breakTimerDisplay.innerHTML = studyMinutes + ":" + seconds + " ";
  }
}

function timerFinished(){
  var alarm = new Audio('alarm.mp3');
  alarm.play(); 
  var timeComplete = countDownDate-startCountDown;
  var studyMinutes = Math.floor((timeComplete % (1000 * 60 * 60)) / (1000 * 60));
  console.log(studyMinutes);
  totalStudyTime += studyMinutes;
  localStorage.totalStudyTime = totalStudyTime;

  if(studyMinutes <= 8){
    breakTime+= 0.5;
  }
  else if (studyMinutes <= 12){
    breakTime += 1;
  }
  else if (studyMinutes <= 16){
    breakTime+= 1.5;
  }
  else if (studyMinutes <= 20){
    breakTime+= 2;
  }
  else if (studyMinutes <= 24){
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
  
  studyMinutes = event.currentTarget.time;
  countDownDate = new Date().getTime() + ((studyMinutes * 60 ) * 1000);
  startCountDown = new Date().getTime();

  //clearInterval(studyTimerObject);
  //studyTimerObject = setInterval(timerRunner);
  //studyTimer.createTimer();
  studyTimer.startTimer(studyMinutes);
}

function pauseTimer(){
  paused = true;
  clearInterval(studyTimerObject);
}

function resumeTimer(){
  paused = false;
  countDownDate = new Date().getTime() + (distance);
  //startCountDown = new Date().getTime();
  studyTimerObject = setInterval(timerRunner)
}

const audio = document.getElementById("youtube");
const playButton = document.querySelector('.play-button');
const player = document.getElementById("player");

const timer = document.getElementById("timer-display");
const resetButton = document.getElementById("reset");
const stopButton = document.getElementById("stop");
const selectTime = document.getElementById("select-time");
const timerBar = document.getElementById("timer-bar");
const breakBar = document.getElementById("break-bar");
const toggleStat = document.getElementById("toggleStatsDropdown");
const toggleList = document.getElementById("toggleCheckListDropdown");

const breakTimerDisplay = document.getElementById("breakTimer-display");
const breakToggle = document.getElementById("breakToggle");
const breakTimer = document.getElementById("breakTimer");
const breakTimerToggle = document.getElementById("toggleBreakTimer");

const musicButton = document.getElementById("toggleMusic");
const musicMenu = document.getElementById("musicPlayer");

let isPlaying = false;

musicButton.addEventListener('click', toggleMusicMenu);
function toggleMusicMenu(){
  musicPlayer.classList.toggle("closed");
}

breakTimerToggle.addEventListener('click', toggleBreakTimer);

function toggleBreakTimer(){
  if(breakPaused){
    breakTimeCountDownDate = new Date().getTime() + ((localStorage.breakTime * 60 ) * 1000);
    breakTimeStartCountDown = new Date().getTime();
    console.log(localStorage.breakTime);
    clearInterval(breakTimerObject);
    breakTimerObject = setInterval(breakTimerRunner);

    breakTimerToggle.innerHTML = 'Pause';
    breakPaused = false;
  }
  else{
    localStorage.breakTime = Math.floor((breakTimeDistance % (1000 * 60 * 60)) / (1000 * 60));
    clearInterval(breakTimerObject);
    breakTimerToggle.innerHTML = 'Start';
    breakPaused = true;
  }
}

breakToggle.addEventListener('click', toggleBreak);
function toggleBreak(event){
  if(studyMode){
    studyMode = false;
    breakTimer.classList.toggle("closed");
    document.getElementById("studyTimerContainer").classList.toggle("closed");
    breakBar.classList.toggle("closed");
    event.currentTarget.style.backgroundColor = "#6495ED";
    
  }
  else{
    studyMode = true;
    breakTimer.classList.toggle("closed");
    document.getElementById("studyTimerContainer").classList.toggle("closed");
    breakBar.classList.toggle("closed");
    event.currentTarget.style.backgroundColor = "#FFFFFF";
  }
}

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
    event.currentTarget.style.backgroundColor = "#FFFFFF";
	} 
  else {
		audio.play()
		event.currentTarget.isPlaying = true
    event.currentTarget.style.backgroundColor = "#6495ED";
	}
}

const form = document.getElementById('task-form');
const taskList = document.getElementById('tasks');

form.onsubmit = function (e) {
	e.preventDefault();
	const inputField = document.getElementById('task-input');
  const datefield = document.getElementById('date-input');
  console.log(datefield.value);
  if(inputField.value != '' && datefield.value != ''){
    addTask(inputField.value, datefield.value, true);
  }
	form.reset();
};

//Tasks
function addTask(description, date, addToStorage) {
	const taskContainer = document.createElement('div');
	const newTask = document.createElement('input');
	const taskLabel = document.createElement('label');
	const taskDescriptionNode = document.createTextNode(description + " -- due date: "+ date);

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
function closeTask(){
  document.getElementById("statsDropdown-content").classList.toggle("closed");
};
function closeList(){
  document.getElementById("checkListDropdown-content").classList.toggle("closed");
}

toggleStat.addEventListener('click', closeTask);
toggleList.addEventListener('click', closeList);

//Pie Chart

let values = Array.from(timeStudiedEachDay.values());
let labels = Array.from(timeStudiedEachDay.keys());
console.log(values);
Chart.defaults.plugins.legend.display = false;
var timeChart = new Chart("timeChart", {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label:' Minutes',
      data: values,
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



