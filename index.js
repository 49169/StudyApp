document.cookie = 'cookie1=value1; SameSite=Lax';

var 
studyTimer, 
breakTimer, 
studyMode, 
//checkList, 
breakTime, 
totalStudyTime, 
timeStudiedEachDay, 
studyMinutes, 
countDownDate, 
startCountDown, 
distance, 
progress, 
breakPaused;

const audio = document.getElementById("youtube");
const playButton = document.querySelector('.play-button');
const player = document.getElementById("player");

const timer = document.getElementById("timer-display");
const resetButton = document.getElementById("reset");
const stopButton = document.getElementById("stop");
const selectTime = document.getElementById("select-time");
const timerBar = document.getElementById("timer-bar");

const toggleStat = document.getElementById("toggleStatsDropdown");
const toggleList = document.getElementById("toggleCheckListDropdown");

const breakTimerDisplay = document.getElementById("breakTimer-display");
const breakToggle = document.getElementById("breakToggle");
const breakTimerContainer = document.getElementById("breakTimerContainer");
const breakTimerToggle = document.getElementById("toggleBreakTimer");
const breakBar = document.getElementById("break-bar");

const musicButton = document.getElementById("toggleMusic");
const musicMenu = document.getElementById("musicPlayer");

function init(){
  //Study timer
  var studyMinutes = 8;

  distance = 0;

  studyMode = true;

  studyTimer = new Timer();
  breakTimer = new Timer();

  //Total minutes studied per day
  totalStudyTime = 0;

  let currentDate = new Date();
  let day = currentDate.getDay();
  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();

  let lastTimeLogged = day + ',' + month +','+year;

  localStorage.lastTimeLogged = lastTimeLogged;
  //timeStudiedEachDay = new Map(JSON.parse(localStorage.timeStudiedEachDay));

  //Amount of break time
  var breakMinutes = Math.floor((localStorage.breakTime % (1000 * 60 * 60)) / (1000 * 60));
  var breakSeconds = Math.floor((localStorage.breakTime % (1000 * 60)) / 1000);
  if(breakSeconds<10){
    breakSeconds = "0"+breakSeconds;
  }
  document.getElementById("breakTimer-display").innerHTML = breakMinutes+": "+breakSeconds;
  breakTime = 0;
  
}
class Timer{
  constructor(){
    //this.time = time;
    this.paused = true;
  }
  runTimer(parent, html, bar){
    parent.now = new Date().getTime();
    parent.distance = parent.countDownDate - parent.now;

    console.log(parent.distance);
    
    parent.progress = 100 - ((parent.distance)/(parent.countDownDate-parent.startCountDown) *100);
    bar.value = parent.progress;

    parent.timeLeft = parent.countDownDate - parent.now;
  
    var studyMinutes = Math.floor((parent.distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((parent.distance % (1000 * 60)) / 1000);

    if(seconds<10){
      //html.innerHTML = studyMinutes + ":0" + seconds + " ";
    }
    else{
      //html.innerHTML = studyMinutes + ":" + seconds + " ";
    }
    if (parent.timeLeft <= 0) {
      clearInterval(parent.timer);
      parent.timerFinished();
    }
  }
  startTimer(minutes, html, bar, seconds = 0){
    console.log("start timer");
    this.paused = false;

    this.distance = 0;
    this.countDownDate = new Date().getTime() + (((minutes * 60 )-1) * 1000);
    this.countDownDate += (seconds*1000);
    this.startCountDown = new Date().getTime ();

    clearInterval(this.timer);

    this.runTimer(this, html, bar);
    this.countDownDate += (1) * 1000; //Have to do this because of delay
    this.timer = setInterval(()=> this.runTimer(this, html, bar),1000);
  }
  pauseTimer(){
    this.paused = true;
    clearInterval(this.timer);
  }
  resumeTimer(html, bar){
    this.paused = false;
    this.countDownDate = new Date().getTime() + (this.distance);
    console.log(this.countDownDate);
    this.timer = setInterval(()=> this.runTimer(this, html, bar),1000);
  }
  resetTimer(){
    this.paused = true;
    clearInterval(this.timer);
  }

  timerFinished(){
    
  }
};
class StudyTimer extends Timer{
  constructor(html, bar){
    super();
    this.html = html;
    this.bar = bar;
  }
  timerFinished(){
    console.log("finished");
    var alarm = new Audio('alarm.mp3');
    alarm.play(); 
    var timeComplete = countDownDate-startCountDown;
    var studyMinutes = Math.floor((timeComplete % (1000 * 60 * 60)) / (1000 * 60));

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
}
class BreakTimer extends Timer{
  timerFinished(){

  }
}
class Client{
  constructor(){
    this.checkList = [];
  }
  fetchDataFromCache(){
    if(localStorage.getItem('checkList')){
      this.checkList = JSON.parse(localStorage.getItem('checkList'));
      console.log(this.checkList);
    }
    else{
      this.checkList = [];
      console.log(this.checkList);
    }
    //if(localStorage.getItem('breakTime')){
      this.breakTime = Number(localStorage.breakTime);
      localStorage.breakTime = 10*60*1000;
    //}
   // else{
      localStorage.breakTime = 10*60*1000;
   // }
    //if(localStorage.getItem('totalStudyTime')){
      this.totalStudyTime = Number(localStorage.totalStudyTime);
    //}
    //else{
      //localStorage.totalStudyTime = 0;
    //}
    //if(!localStorage.getItem('timeStudiedEachDay')){
      let currentDate = new Date();
      let day = currentDate.getDay();
      let month = currentDate.getMonth();
      let year = currentDate.getFullYear();

      let lastTimeLogged = day + ',' + month +','+year;

      localStorage.lastTimeLogged = lastTimeLogged;

      this.timeStudiedEachDay = new Map();
      let key = day+6 + ',' + month +','+year;
      this.timeStudiedEachDay.set(key, 50);

      localStorage.timeStudiedEachDay = JSON.stringify(Array.from(this.timeStudiedEachDay.entries()));
      //localStorage.timeStudiedEachDay = "";
    //}
  }
  loadDataToCache(){

  }
  setCheckList(task){
    let data = this.checkList;
    data.push(task);
    this.checkList = data;
    localStorage.setItem('checkList', JSON.stringify(this.checkList));
  }
}
class CheckList{
  constructor(){

  }
  addTask(description, date, addToStorage) {
    const taskContainer = document.createElement('div');
    const newTask = document.createElement('input');
    const taskLabel = document.createElement('label');
    const taskDescriptionNode = document.createTextNode(description + " -- due date: "+ date);
  
    newTask.setAttribute('type', 'checkbox');
    newTask.setAttribute('name', description);
    newTask.setAttribute('id', description);
  
    newTask.addEventListener('click', this.updateTask);
  
    taskLabel.setAttribute('for', description);
    taskLabel.appendChild(taskDescriptionNode);
    taskLabel.className = 'taskLabel';
  
    taskContainer.classList.add('task-item');
    taskContainer.appendChild(newTask);
    taskContainer.appendChild(taskLabel);
  
    taskList.appendChild(taskContainer);
    console.log("add task");
    if(addToStorage){
      //client.checkList.push(description);
      client.setCheckList(description);
      //localStorage.setItem('checkList', JSON.stringify(checkList));
    }
  }
  updateTask(event){
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
  loadCheckList(){
    for(let i = 0; i<client.checkList.length; i++){
      this.addTask(client.checkList[i]);
    }
  }
}
function updateTimer(event){
  timer.innerHTML = "";
  timer.style.display="block";
  timerBar.style.display = "block";
  selectTime.style.display="none";
  document.getElementById("timer-buttons").style.display="block";
  
  studyMinutes = event.currentTarget.time;
  //countDownDate = new Date().getTime() + ((studyMinutes * 60 ) * 1000);
  //startCountDown = new Date().getTime();

  studyTimer.startTimer(studyMinutes, timer, timerBar);
}

class Data{
  constructor(id, data){
    this.id = id;
    this.data = data;
  }
  storeData(){
    localStorage.setItem(id, data);
  }
  updateData(data){
    this.data = data;
  }
  deleteAllData(){
    localStorage.setItem(this.id, null);
  }
  fetchData(){
    this.data = localStorage.getItem(id);
  }
  getData(){
    return this.data;
  }
}
class TimeData extends Data{
  constructor(id, data){
    super(id,data);
  }
  updateData(time, data){
    this.data[time] = data;
  }
  updateDataWithSpecificField(time, data, field){
    this.data[time][field] = data;
  }
  getSpecificTimeData(time){
    return this.data[time];
  }
}

class StudyData extends TimeData{
  constructor(id, data){
    super(id, data);
  }
  updateStudyTime(date, minutes){
    super.updateData(date, super.getSpecificTimeData(date)+=minutes);
  }
}

class BreakData extends TimeData{
  constructor(id, data){
    super(id, data);
  }
  addBreakTime(date, minutes){
    super.updateData(date, super.getSpecificTimeData(date)+=minutes);
  }
  substractBreakTime(date, minutes){
    super.updateData(date, super.getSpecificTimeData(date)-=minutes);
  }
}

class CheckListData extends TimeData{
  constructor(id, data){
    super(id, data);
  }
  addNewTask(date, name, complete, time_allotted, due_date){
    super.updateDataWithSpecificField(date, "name", name);
    super.updateDataWithSpecificField(date, "complete", complete);
    super.updateDataWithSpecificField(date, "time_allotted", time_allotted);
    super.updateDataWithSpecificField(date, "due_date", due_date);
  }
  removeTask(date, name){
    //super.updateDataWithSpecificField(date, "name")
  }
  
}

let isPlaying = false;

musicButton.addEventListener('click', toggleMusicMenu);
function toggleMusicMenu(){
  musicPlayer.classList.toggle("closed");
}

breakTimerToggle.addEventListener('click', toggleBreakTimer);

function toggleBreakTimer(){
  if(breakTimer.paused == true){
    console.log("here");
    //breakTimeCountDownDate = new Date().getTime() + ((localStorage.breakTime * 60 ) * 1000);
    //breakTimeStartCountDown = new Date().getTime();
    console.log(localStorage.breakTime);
    var breakMinutes = Math.floor((localStorage.breakTime % (1000 * 60 * 60)) / (1000 * 60));
    var breakSeconds = Math.floor((localStorage.breakTime % (1000 * 60)) / 1000);
    console.log(breakMinutes);
    breakTimer.startTimer(breakMinutes, breakTimerDisplay, breakBar, breakSeconds);

    breakTimerToggle.innerHTML = 'Pause';
  }
  else{
    console.log("pause break");
    breakTimer.pauseTimer();
    localStorage.breakTime = breakTimer.distance;
    //clearInterval(breakTimerObject);
    breakTimerToggle.innerHTML = 'Start';
    //breakPaused = true;
  }
}

breakToggle.addEventListener('click', toggleBreak);
function toggleBreak(event){
  if(studyMode){
    studyMode = false;
    breakTimerContainer.classList.toggle("closed");
    document.getElementById("studyTimerContainer").classList.toggle("closed");
    breakBar.classList.toggle("closed");
    event.currentTarget.style.backgroundColor = "#6495ED";
    
  }
  else{
    studyMode = true;
    breakTimerContainer.classList.toggle("closed");
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
  studyTimer.resetTimer();
  //resetButton.style.display="none"
}
stopButton.onclick = function(){
  if(studyTimer.paused == false){
    studyTimer.pauseTimer();
    stopButton.innerHTML = 'start';
  }
  else{
    studyTimer.resumeTimer(timer, timerBar);
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

function closeTask(){
  document.getElementById("statsDropdown-content").classList.toggle("closed");
};
function closeList(){
  document.getElementById("checkListDropdown-content").classList.toggle("closed");
}

toggleStat.addEventListener('click', closeTask);
toggleList.addEventListener('click', closeList);

//Pie Chart
function initStats(){
  let values = Array.from(client.timeStudiedEachDay.values());
  let labels = Array.from(client.timeStudiedEachDay.keys());
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

//fetchAllData();
var client = new Client();
var checkList = new CheckList();

client.fetchDataFromCache();
checkList.loadCheckList();
//checkList.addTask("hi","hi", true);
//checkList.deleteAllData();
//localStorage.setItem("checkList", "");

init();

initStats();

document.getElementById("submit-task-btn").onclick = (e) =>{
	e.preventDefault();
	const inputField = document.getElementById('task-input');
  const datefield = document.getElementById('date-input');
  //console.log(datefield.value);
  if(inputField.value != '' && datefield.value != ''){
    console.log(checkList);
    checkList.addTask(inputField.value, datefield.value, true);
  }
	form.reset();
};
