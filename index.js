//Variables
const startBtn = document.querySelector('.stopwatch__start');
const stopBtn = document.querySelector('.stopwatch__stop');
const resetBtn = document.querySelector('.stopwatch__reset');
const hourContent = document.getElementById("hour");
const minuteContent = document.getElementById("minute");
const secondeContent = document.getElementById("seconde");
let watchInterval;

//Events
eventListners();
function eventListners() {
    if (resetBtn) {
        resetBtn.addEventListener('click', resetWatch);
    }
    if (startBtn) {
        startBtn.addEventListener('click', startWatch);
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', stopWatch);
    }
}

//Functions
function resetWatch() {
    hourContent.innerHTML = '00';
    minuteContent.innerHTML = '00';
    secondeContent.innerHTML = '00';
    stopWatch();
}

function startWatch() {
    var seconde = parseInt(secondeContent.textContent.trim());
    watchInterval = setInterval(() => {
        seconde += 1;
        if(seconde == 60){
            seconde = 0;
            var minute = parseInt(minuteContent.textContent.trim());
            minute++;
            if(minute == 60){
                minute = 0;
                var hour = parseInt(hourContent.textContent.trim());
                hour++;
                if(hour == 24){
                    hour = 0;
                }
                if (hour < 10) {
                    hourContent.innerHTML = "0" + hour;
                }
                else {
                    hourContent.innerHTML = hour;
                }    
            }
            if (minute < 10) {
                minuteContent.innerHTML = "0" + minute;
            }
            else {
                minuteContent.innerHTML = minute;
            }    
        }
        if (seconde < 10) {
            secondeContent.innerHTML = "0" + seconde;
        }
        else {
            secondeContent.innerHTML = seconde;
        }

    }, 1000);
}

function stopWatch() {
    if (watchInterval) {
        clearInterval(watchInterval);
    }
}