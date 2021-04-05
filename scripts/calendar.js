import * as taskFunctions from './task-functions.js'
let calendarSection = document.querySelector(".calendar-section");
let init = function(e){
  let section = document.querySelector("section");

  let obj, text;
  text = localStorage.getItem("testJSON");
  obj = JSON.parse(text);
  console.log(obj);
  let taskList = obj['tasks'];
  constructMonthHeading();
  constructCalendar();
  populateCalendar(taskList);
};
document.addEventListener('DOMContentLoaded',function(){
  init();
});

function constructMonthHeading(){
  let months =["January","Febuary","March","April",
               "May","June","July","August",
               "September","October","November","December"];
  let currentDate = new Date();
  let monthHeading = document.querySelector('.monthHeading');
  monthHeading.innerHTML=months[currentDate.getMonth()];
  //calendarSection.append(monthHeading);
}
function constructCalendar(){
  let calendar = document.createElement('div');
  calendar.classList.add("calendar");
  calendarSection.append(calendar);
  constructDayOfWeekHeader();
  let currentDate= new Date();
  let weekStart = new Date();
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());
  let calTraverse = new Date(weekStart);
  for(let i = 0; i<21;i++){
    let calCell= document.createElement('div');
    calCell.classList.add("cal-cell");
    calendar.append(calCell);
    //console.log(currentDate,calTraverse);
    if(taskFunctions.zeroTime(currentDate).valueOf() === taskFunctions.zeroTime(calTraverse).valueOf()){
      //console.log("today's date");
      calCell.classList.add("today");
    }
    let dayOfMonth = document.createElement('p');
    dayOfMonth.innerHTML = calTraverse.getDate();
    calCell.dataset.date = calTraverse;
    calTraverse.setDate(calTraverse.getDate()+1);
    calCell.append(dayOfMonth);
    calCell.addEventListener('drop',drop);
    calCell.addEventListener('dragover',allowDrop);
  }
}

function constructDayOfWeekHeader(){
  let calendar = document.querySelector(".calendar");
  let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  for (let i = 0; i<days.length; i++){
    let calCellHeader= document.createElement('div');
    let dayLabel = document.createElement('p');
    calCellHeader.classList.add("cal-cell-header");
    dayLabel.textContent=days[i];
    calCellHeader.append(dayLabel);
    calendar.append(calCellHeader);
  }
}
function populateCalendar(taskList){
  let calendar = document.querySelector(".calendar");
  let calCellList = document.querySelectorAll(".cal-cell");
  for(let calCell of calCellList){
    for(let task of taskList){
      if(task.status != "deleted"){
        let date = new Date(task.date+' 00:00:00');
        date = taskFunctions.zeroTime(date);
        let cellDate = new Date(calCell.dataset.date);
        cellDate=taskFunctions.zeroTime(cellDate);
        //console.log(date,cellDate);
        if(date.valueOf() == cellDate.valueOf()){
          console.log("adding task",task);
          let card = document.createElement('div');
          card.innerHTML=task.desc;
          if(task.status == "completed"){
            card.style.textDecoration="line-through";
            card.style.color="darkgrey";
          }
          calCell.append(card);
          card.id = task.id;
          card.draggable = true;
          card.addEventListener('dragstart', drag);
        }
      }
    }
  }
}
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  console.log(ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}
