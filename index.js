document.cookie = 'cookie1=value1; SameSite=Lax';

var 
studyTimer, 
breakTimer, 
studyMode, 
checkListData, 
breakTimeData, 
totalStudyTime, 
timeStudiedEachDay, 
studyMinutes, 
countDownDate, 
startCountDown, 
distance, 
progress, 
breakPaused,
studyData,
client,
checkList,
timeChart

//HTML Elements
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
const selectBreakTime = document.getElementById("select-break-time");
const breakIndicator = document.getElementById("breakIndicator");

const musicButton = document.getElementById("toggleMusic");
const musicMenu = document.getElementById("musicPlayer");

const form = document.getElementById('task-form');
const taskList = document.getElementById('tasks');

const popupContainer = document.getElementById('popupBox');
const popupTitle = document.getElementById('popupTitle');
const popupDescription = document.getElementById('popupDescription');
const closePopupBtn = document.getElementById('closePopup');

const windSound = document.getElementById("wind-yt");
const fireSound = document.getElementById("fire-yt");
const brownSound = document.getElementById("brown-yt");

function init(){
  //Initializes Data
  studyMode = true;

  studyTimer = new StudyTimer();
  breakTimer = new BreakTimer();

  checkListData = new CheckListData("checkList");
  studyData = new StudyData("studyData");
  breakTimeData = new Data("breakTimeData");

  checkListData.fetchData();
  breakTimeData.fetchData();
  studyData.fetchData();

  updateBreakIndicator();
  checkListData.deleteAllData();
  studyData.deleteAllData();
  breakTimeData.deleteAllData();

  checkList = new CheckList();

  checkList.loadCheckList();
  
  //Award first time login
  let lastTimeLogged = new Date().toJSON().slice(0, 10);
  //lastTimeLogged = null;
  if (lastTimeLogged != localStorage.lastTimeLogged){
    showPopup("Award", "5 minutes of break time")
    if(breakTimeData.getData().get("0")!=null){
      breakTimeData.updateItem("0", breakTimeData.getData().get("0") + 5);
    }
    else{
      breakTimeData.updateItem("0", 0 + 5);
    }
  }
  localStorage.lastTimeLogged = lastTimeLogged;

  initStats();
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
    if(bar != null){
      bar.value = parent.progress;
    }

    parent.timeLeft = parent.countDownDate - parent.now;
  
    var studyMinutes = Math.floor((parent.distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((parent.distance % (1000 * 60)) / 1000);

    if(seconds<10){
      html.innerHTML = studyMinutes + ":0" + seconds + " ";
    }
    else{
      html.innerHTML = studyMinutes + ":" + seconds + " ";
    }
    if (parent.timeLeft <= 0) {
      html.innerHTML = "0" + ":" + "00" + " ";
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
    var alarm = new Audio('alarm.mp3');
    alarm.play(); 
    var timeComplete = this.countDownDate-this.startCountDown;
    var studyMinutes = Math.floor((timeComplete % (1000 * 60 * 60)) / (1000 * 60));

    var break_Time = 0;
    if(studyMinutes <= 8){
      break_Time += 0.5;
    }
    else if (studyMinutes <= 12){
      break_Time  += 1;
    }
    else if (studyMinutes <= 16){
      break_Time += 1.5;
    }
    else if (studyMinutes <= 20){
      break_Time += 2;
    }
    else if (studyMinutes <= 24){
      break_Time  += 3;
    }

    //Update break components
    showPopup("Award", break_Time+ " minutes of break time")
    if(breakTimeData.getData().get("0")!=null){
      breakTimeData.updateItem("0", breakTimeData.getData().get("0") + break_Time);
    }
    else{
      breakTimeData.updateItem("0", 0 + break_Time);
    }
    updateBreakIndicator();

    //Update GUI
    console.log("timer finished");
    timer.style.display="none";
    timerBar.style.display = "none";
    selectTime.style.display="block";
    document.getElementById("timer-buttons").style.display="none";
    
    studyData.updateStudyTime((new Date().toJSON().slice(0, 10)), studyMinutes);
    //Update time spent on current task if there is one
    for(const [key, value] of checkListData.getData().entries()){
      if(value[2]==true){
        checkListData.updateTaskStatus(key, true, studyMinutes);
      }
    }
    checkList.reloadCheckList();

    //Update chart
    updateChart();
  }
}
class BreakTimer extends Timer{
  timerFinished(){
    var alarm = new Audio('alarm.mp3');
    alarm.play(); 

    selectBreakTime.style.display = "block";
    breakTimerDisplay.style.display = "none";
    breakIndicator.style.display = "block"

    var timeComplete = this.countDownDate-this.startCountDown;
    var breakMinutes = (timeComplete/1000)/60;

    //Convert to seconds and then percent
    breakTimeData.updateItem("0", breakTimeData.getData().get("0")-breakMinutes);
    
    updateBreakIndicator();
  }
}

class Data{
  constructor(id, data){
    this.id = id;
    this.data = new Map();
  }
  storeData(){
    localStorage.setItem(this.id, JSON.stringify(Array.from(this.data.entries())));
  }
  updateData(data){
    this.data = data;
    this.storeData();
  }
  updateItem(key, value){
    this.data.set(key, value);
    this.storeData();
  }
  deleteItem(key){
    this.data.delete(key);
    this.storeData();
  }
  deleteAllData(){
    localStorage.setItem(this.id, null);
  }
  fetchData(){
    this.data = new Map(JSON.parse(localStorage.getItem(this.id)));
  }
  getData(){
    return this.data;
  }
}
class StudyData extends Data{
  constructor(id, data){
    super(id, data);
  }
  updateStudyTime(date, minutes){
    if(this.data.get(date)!=null){
      this.updateItem(date, this.getData().get(date)+minutes);
    }
    else{
      this.updateItem(date, 0+minutes);
    }
  }
}
class CheckListData extends Data{
  constructor(id, data){
    super(id, data);
  }
  addNewTask(name, complete, time_allotted, due_date, current=false){
    this.updateItem(name+"_"+due_date, [complete, time_allotted, current, 0]);
  }
  removeTask(id){
    this.deleteItem(id);
  }
  updateTaskStatus(id, current, timeSpent = 0){
    //Remove current task
    for(const [key, value] of this.getData().entries()){
      if(value[2]==true){
        value[2] = false
      }
    }
    //Set as new current task;
    let values = this.getData().get(id);
    values[2] = current;
    values[3] += timeSpent;
    this.updateItem(id, values);
  }
  sortTasks(){
    //Sort checklist items by due date
    let sorted = new Map([...this.getData()].sort(function(a,b){
      let date1 = (a[0].split("_"))[1];
      let date2 = (b[0].split("_"))[1];
      return new Date(date2) - new Date(date1);
    }));
    this.updateData(sorted);
    checkList.reloadCheckList();
  }
}

class CheckList{
  constructor(){

  }
  addTask(description, date, current, timeAllo, addToStorage, timeSpent = 0) {
    const taskContainer = document.createElement('div');
    const newTask = document.createElement('input');
    const taskLabel = document.createElement('div');
    const taskTimeLabel = document.createElement('div');
    const taskDescriptionNode = document.createTextNode(description);
  
    newTask.setAttribute('type', 'checkbox');
    newTask.setAttribute('name', description +"_"+date);
    newTask.setAttribute('id', description);
    newTask.addEventListener('click', this.updateCompletion);

    let trimDate = date.substring(5,date.length);
    taskTimeLabel.style.marginRight = "0px";
    taskTimeLabel.style.marginLeft = "auto";
    taskTimeLabel.innerHTML =  timeSpent + "/" + timeAllo + " | due: " + trimDate;
    
    taskLabel.setAttribute('for', description);
    taskLabel.appendChild(taskDescriptionNode);
    taskLabel.className = 'taskLabel';
    taskLabel.setAttribute('name', description +"_"+date);
    taskLabel.addEventListener('click', this.updateCurrentTask);
  
    taskContainer.classList.add('task-item');
    taskContainer.appendChild(newTask);
    taskContainer.appendChild(taskLabel);
    taskContainer.appendChild(taskTimeLabel);
    if(current){
      taskContainer.style.backgroundColor = "cornflowerblue";
    }
    else{
      taskContainer.style.backgroundColor = "White";
    }
    taskList.appendChild(taskContainer);
    console.log("add task");
    if(addToStorage){
      console.log(timeAllo);
      checkListData.addNewTask(description, false, timeAllo, date);
      checkListData.sortTasks();
    }
  }
  updateCompletion(event){
    if(event.currentTarget.checked){
      checkListData.removeTask(event.currentTarget.name);
    }
  }
  updateCurrentTask(event){
    //Reset colors
    let children = taskList.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].style.backgroundColor != "White"){
        children[i].style.backgroundColor = "White";
      }
    }
    if(checkListData.getData().get(event.currentTarget.parentElement.children[0].name)[2]==true){
      checkListData.updateTaskStatus(String(event.currentTarget.parentElement.children[0].name), false);
    }
    else{
      event.currentTarget.parentElement.style.backgroundColor = "cornflowerblue";
      checkListData.updateTaskStatus(String(event.currentTarget.parentElement.children[0].name), true);
    }
  }
  loadCheckList(){
    for (const [key, value] of checkListData.getData().entries()) {
      //console.log(key, value);
      var keys = key.split("_");
      this.addTask(keys[0], keys[1], value[2], value[1], false, value[3]);
    }
  }
  reloadCheckList(){
    taskList.innerHTML = '';
    this.loadCheckList();
  }
}

function updateTimer(event){
  timer.innerHTML = "";
  timer.style.display="block";
  timerBar.style.display = "block";
  selectTime.style.display="none";
  document.getElementById("timer-buttons").style.display="block";
  
  studyMinutes = event.currentTarget.time;

  studyTimer.startTimer(studyMinutes, timer, timerBar);
}
function updateBreakTimer(event){
  if(event.currentTarget.time<= breakTimeData.getData().get("0")){
    breakTimer.startTimer(event.currentTarget.time, breakTimerDisplay, breakBar);
    selectBreakTime.style.display = "none";
    breakTimerDisplay.style.display = "block";
    breakIndicator.style.display = "none";
  }
}
function updateBreakIndicator(){
  breakIndicator.innerHTML = "You have: " + breakTimeData.getData().get("0")*60 + " seconds of break time"
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
// Default data type: Map()
/* Storage:
  Converting to JSON: JSON.stringify(Array.from(DATA)));
  Converting to Map(): new Map(JSON.parse(DATA));
*/

let isPlaying = false;

musicButton.addEventListener('click', toggleMusicMenu);
function toggleMusicMenu(){
  musicPlayer.classList.toggle("closed");
}

//Time selection
var buttonList = ["8min", "12min", "16min", "20min", "24min"];
for(let i = 0; i <5; i++){
  var button = document.getElementById(buttonList[i]);
  button.addEventListener("click", updateTimer);
  button.time = (8+i*4) + (1/60);
}

var breakButtonList = ["1min", "3min", "5min", "10min", "15min"];
var breakTimeList = [1,3,5,10,15];
for(let i = 0; i <5; i++){
  var button = document.getElementById(breakButtonList[i]);
  button.addEventListener("click", updateBreakTimer);
  
  button.time = breakTimeList[i];
}

//Ambient sounds
var ambientList = ["rain", "brown", "fire"];

for(let i = 0; i<ambientList.length; i++){
  var button = document.getElementById(ambientList[i]+"-audio");
  button.addEventListener("click", toggleAudio);
  button.element = ambientList[i]+"-yt";
  button.isPlaying = false;
  
  var volumeSlider = document.getElementById(ambientList[i]+"-slider");
  volumeSlider.audio = button.element;
  volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById(e.currentTarget.audio).volume = value / 40;
  });
}

function toggleAudio(event){
  var audio = document.getElementById(event.currentTarget.element);
  console.log(audio);
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

//Pause & Reset timer
function resetTimer(){
  timer.style.display="none";
  timerBar.style.display = "none";
  selectTime.style.display="block";
  document.getElementById("timer-buttons").style.display="none";
  studyTimer.resetTimer();
}
function pauseTimer(){
  if(studyTimer.paused == false){
    studyTimer.pauseTimer();
    stopButton.innerHTML = 'start';
  }
  else{
    studyTimer.resumeTimer(timer, timerBar);
    stopButton.innerHTML = 'stop';
  } 
}
resetButton.addEventListener('click', resetTimer);
stopButton.addEventListener('click',pauseTimer);

//Task checklist
function closeTask(){
  document.getElementById("statsDropdown-content").classList.toggle("closed");
};
function closeList(){
  document.getElementById("checkListDropdown-content").classList.toggle("closed");
}

const timeAllotInput = document.querySelector("#time-allotted-input");
const charAllowed = /[0-9\/]+/;
timeAllotInput.addEventListener("keypress", e => {
  console.log(e);
  if (!charAllowed.test(e.key)) {
    e.preventDefault();
  }
});

toggleStat.addEventListener('click', closeTask);
toggleList.addEventListener('click', closeList);

document.getElementById("submit-task-btn").onclick = (e) =>{
	e.preventDefault();
	const inputField = document.getElementById('task-input');
  const datefield = document.getElementById('date-input');
  const timeAlloField = document.getElementById('time-allotted-input');
  //console.log(datefield.value);
  if(inputField.value != '' && datefield.value != '' && timeAlloField.value !=''){
    //console.log(checkList);
    checkList.addTask(String(inputField.value), datefield.value, false, timeAlloField.value,true);
  }
	form.reset();
};

//Pie Chart
function updateChart(){
  let values = Array.from(studyData.getData().values());
  let labels = Array.from(studyData.getData().keys());
  console.log(values);
  timeChart.data.labels = labels;
  timeChart.data.datasets[0].data = values;

  timeChart.update()
}
function initStats(){
  let values = Array.from(studyData.getData().values());
  let labels = Array.from(studyData.getData().keys());
  console.log(values);
  Chart.defaults.plugins.legend.display = false;
  timeChart = new Chart("timeChart", {
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


//popup
function showPopup(title, message){
  popupContainer.style.display = "block";
  popupTitle.innerHTML = title;
  popupDescription.innerHTML = message;
}
function closePopup(){
  popupContainer.style.display = "none";
}

closePopupBtn.addEventListener('click', closePopup);

init();

