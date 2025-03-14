import * as taskFunctions from './task-functions.js'
const section = document.querySelector('section');
const tasklist = document.querySelector('.tasklist');
const postSubmit = document.querySelector('.postSubmit');
const nameField = document.querySelector('.nameField');
const dateField = document.querySelector('.dateField');
const filterCompleted = document.querySelector('.hideCompleted');
var myObj, myJSON, text, obj;
var taskID;


// Retrieving data:
if (localStorage.getItem("testJSON")){
  text = localStorage.getItem("testJSON");
  obj = JSON.parse(text);
}
else{
  obj = {tasks:[]};
}
if(localStorage.getItem("idCount")){
  taskID = parseInt(localStorage.getItem("idCount"));
}
else{
  taskID = 1;
}
localStorage.setItem('idCount',taskID);
populateSection(obj);
let miniCal = new miniCalendar();
miniCal.constructMiniCal(miniCal.monthDisplayed);
// miniCal.miniCalOpacity(obj);


function populateSection(obj){
  const tasks = obj['tasks'];
  console.log("Deleted Tasks:");
  for(let i = 0; i<tasks.length; i++){
    if(tasks[i].status=="deleted"){
      console.log(tasks[i]);
    }
  }
  for(let i = 0; i<tasks.length; i++){
    if(tasks[i].status!="deleted"){

      addtoDateSection(tasks[i]);

      if(tasks[i].status=="completed"){
        divFromTask(tasks[i]).classList.add("completed");
      }
      var todayDate = new Date();
      var dueDate = new Date(tasks[i].date+' 23:59:00');
      if(todayDate>dueDate && tasks[i].status=="active"){
        divFromTask(tasks[i]).classList.add("overdue");

        console.log(tasks[i].desc,todayDate,dueDate);
      }
    }
  }
  hideCompletedSections();
  postSubmit.addEventListener('click', addTask);
  filterCompleted.addEventListener('click', filterCompletedTasks);
}

function addTask(ev){
  ev.preventDefault();
  var pName = nameField.value;
  var pDate = dateField.value;

  var newTask ={desc: pName, date: pDate, status: 'active', id:taskID};
  const tasks = obj['tasks'];
  tasks.push(newTask);
  console.log(obj);
  storeObj(obj);
  obj = JSON.parse(text);
  addtoDateSection(newTask);
  updateTaskList();
  taskID++;
  localStorage.setItem('idCount',taskID);
  nameField.value = '';
}
function hideCompletedSections(){
  var dateSectionList = document.querySelectorAll('.dateSection');
  for(let dateSection of dateSectionList){
    let sectionChildren = dateSection.children;
    let tasksActive = false;
    for(let child of sectionChildren){
      if(child.classList.contains("task") && (child.classList.contains("completed")==false)){
        tasksActive = true;
      }
    }
    // console.log(sectionChildren);
    if(! tasksActive){
      dateSection.classList.add("hidden");
    }
  }
}

//------------------------------------------------------------------------------
function addtoDateSection(task){
  var date = task.date;
  var parent;
  if(findDateSection(date)){
    parent = findDateSection(date);
  }else{
    parent = constructDateSection(date);
  }
  var card = constructCard(task);
  parent.append(card);
  //console.log(card);
}
function findDateSection(date){
  var dateSectionList = document.querySelectorAll('.dateSection');
    for (let section of dateSectionList){
      if(section.dataset.date == date){
        return section;
      }
    }
}
function constructDateSection(taskDate){
  var div = createElement('div',"dateSection");
  var p = document.createElement('h3');
  var hr = document.createElement('hr');
  div.dataset.date = taskDate;
  if(taskDate===""){
    p.textContent="No Date";
  }else{
    taskDate= new Date(taskDate+' 23:59:00');
    p.textContent=taskDate.toDateString();
  }
  insertDatesInOrder(div);
  div.append(p);
  div.append(hr);
  return div;
}

function insertDatesInOrder(dateSection){
  if(document.querySelectorAll('.dateSection').length>0){
    var dateSectionList = document.querySelectorAll('.dateSection');
      let len = dateSectionList.length;
      if(dateSectionList[len-1].dataset.date<dateSection.dataset.date){
        tasklist.append(dateSection);
      }else if (dateSectionList[0].dataset.date>dateSection.dataset.date) {
        tasklist.prepend(dateSection);
      }else if(len == 2){
        tasklist.insertBefore(dateSection, dateSectionList[1]);
      }else{
        for(let i = len-1; i>0; i--){
          if(dateSectionList[i].dataset.date>dateSection.dataset.date
            && dateSection.dataset.date>dateSectionList[i-1].dataset.date){
            tasklist.insertBefore(dateSection, dateSectionList[i]);
          }
        }
      }
  }else{
    tasklist.append(dateSection);
    console.log("First item to be added");
  }
}
function datesIsSorted(lst){
  for(let i = 1;i<lst.length;i++){
    if(lst[i].dataset.date<lst[i-1].dataset.date)return false;
  }
  return true;
}

//------------------------------------------------------------------------------

function constructCard(task){
  const taskElement = createElement('div',"task");
  const taskContent = createElement('div',"task_content");
  const descWrapper = createElement('div','desc-wrapper');
  const p1 = createElement('span',"desc");
  const completeBtn = constructCompleteBtn(task);
  const actionBar = createElement('span',"action_bar");
  const deleteBtn = constructDltBtn();
  const editBtn = constructEditBtn();
  taskElement.id='task'+task.id;
  p1.textContent = task.desc;
  p1.addEventListener("dblclick",editTask);
  taskElement.append(taskContent);
  descWrapper.appendChild(completeBtn);
  descWrapper.appendChild(p1);
  taskContent.append(descWrapper);
  const editForm = constructEditForm();
  taskContent.appendChild(actionBar);
  actionBar.appendChild(editBtn);
  actionBar.appendChild(deleteBtn);
  taskElement.append(editForm);

  return taskElement;
}

function constructDltBtn(){
  const deleteBtn = createElement('button',"close");
  deleteBtn.textContent="\u00D7";
  deleteBtn.addEventListener("click",deleteTask);
  return deleteBtn;
}
function constructCompleteBtn(task){
  const completeBtn = createElement('button',"check");
  if(task.status=="active"){
    completeBtn.textContent="\u25EF";
  } else if (task.status=="completed"){
    completeBtn.textContent="\u2713";
  }
  completeBtn.addEventListener('click',completeTask);
  return completeBtn;
}
function constructEditForm(){
  const editForm = createElement('form',"editForm");
  editForm.classList.add("hidden");
  const descField = createElement('input',"descField");
  descField.type = 'text';
  const dateField = createElement('input',"dateField");
  dateField.type = 'date';
  const saveBtn = constructSaveBtn();
  const cancelBtn = constructCancelBtn();
  editForm.append(descField,saveBtn,cancelBtn);
  editForm.insertBefore(dateField,cancelBtn);
  return editForm;
}
function constructSaveBtn(){
  const saveBtn = createElement('button',"save");
  saveBtn.textContent="Save";
  saveBtn.addEventListener("click",saveEdit);
  return saveBtn;
}
function constructCancelBtn(){
  const cancelBtn = createElement('button',"cancel");
  cancelBtn.textContent="Cancel";
  cancelBtn.addEventListener("click",cancelEdit);
  return cancelBtn;
}

function constructEditBtn(){
  const editBtn = createElement('button',"edit");
  editBtn.addEventListener("click",editTask);
  const editIcon = document.createElement('i');
  editIcon.className = "fas fa-pencil-alt fa-sm";
  editBtn.append(editIcon);
  return editBtn;
}
function deleteTask(ev){
  ev.preventDefault();
  var confirmDeleteDialog = createElement('dialog', "confimDeleteDialog");
  var main = document.querySelector('.main');
  main.appendChild(confirmDeleteDialog);
  var title = createElement('h3',"dialog-title");
  title.textContent = "Delete Task?"
  confirmDeleteDialog.append(title);
  var deleteMessage = createElement('p',"delete-message");
  var deleteMessageText = "Do you want to delete this task?";
  deleteMessage.textContent = deleteMessageText;
  confirmDeleteDialog.append(deleteMessage); 
  var yesBtn = createElement('button',"yesBtn");
  var noBtn = createElement('button',"noBtn");
  yesBtn.textContent="Yes";
  noBtn.textContent="No";
  confirmDeleteDialog.append(noBtn,yesBtn);
  confirmDeleteDialog.showModal();
  yesBtn.addEventListener("click",(event)=>{
    changeState(ev,"deleted");
    updateTaskList();
    confirmDeleteDialog.close();
  });
  noBtn.addEventListener("click",(event)=>{
    confirmDeleteDialog.close();
  })
  
}
function completeTask(ev){
  ev.preventDefault();
  this.textContent="\u2713";
  changeState(ev,"completed");
  updateTaskList();
}
function changeState(ev,state){
  const tasks = obj["tasks"];
  var card = getRoot(ev.target,"task");
  card.classList.add(state);
  var idNum = taskFromDiv(card);
  let task = getTaskFromID(idNum);
  task.status = state;
  storeObj(obj);
}

function getRoot(element,className){
  while(!element.classList.contains(className)){
    element = element.parentElement;
  }
  return element;
}
function createElement(tag, className){
  const element = document.createElement(tag);
  if(className) element.classList.add(className);
  return element;
}
var completedVisible = true; ///This is a random global variable in the middle of a file
function filterCompletedTasks(ev){
  ev.preventDefault();
  if(completedVisible){
    this.textContent = "Show Completed Tasks";
  }else{
    this.textContent = "Hide Completed Tasks";
  }
  toggleCompletedTasks();
  completedVisible = !completedVisible;
}
function toggleCompletedTasks(){
  let completedTasks = document.querySelectorAll('.completed');
  for(let i = 0; i < completedTasks.length; i++){
    if(completedVisible){
      completedTasks[i].classList.add("hidden");
    }else{
      completedTasks[i].classList.remove("hidden");
    }
  }
}

function editTask(ev){
  ev.preventDefault();
  let taskElement = getRoot(ev.target,"task");
  let taskDesc = taskElement.querySelector('.desc').innerHTML;
  let descField = taskElement.querySelector('.descField');
  let dateField = taskElement.querySelector('.dateField');
  descField.value = taskDesc;
  let dateSection = getRoot(taskElement,"dateSection");
  dateField.value = dateSection.dataset.date;
  showEditView(taskElement);

}
function saveEdit(ev){
  ev.preventDefault();
  let taskElement = getRoot(ev.target,"task");
  let taskDesc = taskElement.querySelector('.desc');
  let descField = taskElement.querySelector('.descField');
  taskDesc.innerHTML = descField.value;
  let dateField = taskElement.querySelector('.dateField');
  let taskID = taskFromDiv(taskElement);
  let task = getTaskFromID(taskID);
  task.desc = descField.value;
  task.date = dateField.value;
  storeObj(obj);
  updateTaskList();
  hideEditView(taskElement);
}
function cancelEdit(ev){
  ev.preventDefault();
  let taskElement = getRoot(ev.target,"task");
  hideEditView(taskElement);
}
function showEditView(element){

  const taskContent = element.querySelector(".task_content");
  const editForm = element.querySelector(".editForm");
  taskContent.classList.add("hidden");
  editForm.classList.remove("hidden");
}
function hideEditView(element){
  const taskContent = element.querySelector(".task_content");
  const editForm = element.querySelector(".editForm");
  taskContent.classList.remove("hidden");
  editForm.classList.add("hidden");
}
function updateTaskList(){
  let taskList = document.querySelector('.tasklist');
  while (taskList.firstChild){
    taskList.removeChild(taskList.firstChild);
  }
  populateSection(obj);
}
function divFromTask(task){
  console.log(task);
  var idStr = "task"+task.id.toString();
  console.log(idStr);
  return document.getElementById(idStr);
}
function taskFromDiv(div){
  var divID=div.getAttribute('id');
  console.log(divID);
  var idStr = divID.slice(4);
  console.log(idStr);
  var idNum = parseInt(idStr);
  return idNum;
}

function getTaskFromID(idNum){
  let taskList = obj['tasks'];
  for (let task of taskList){
    if(task.id==idNum){
      return task;
    }
  }
}

function storeObj(obj){
  myJSON = JSON.stringify(obj);
  localStorage.setItem("testJSON", myJSON);
  text = localStorage.getItem("testJSON");
}
function Task(desc,date,id,status){
  this.desc=desc;
  this.date=date;
  this.id=id;
  this.status=status;
}

//ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

function miniCalendar(){
  let miniCal = document.querySelector('.mini-cal');
  let prevBtn = document.querySelector('.prev');
  let nextBtn = document.querySelector('.next');
  prevBtn.addEventListener('click',prevMonth);
  nextBtn.addEventListener('click',nextMonth);
  let currentDate = new Date();
  // let displayDate = new Date();
  let monthDisplayed = currentDate.getMonth();
  // displayDate.setMonth(monthDisplayed);
  // displayDate.setYear(currentDate.getYear());
  let months =["January","Febuary","March","April",
               "May","June","July","August",
               "September","October","November","December"];

  let constructMiniCal = function(monthNum){
    let monthHeading = document.querySelector('.month-heading');

    let monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setMonth(monthNum);
    monthHeading.innerHTML = months[monthStart.getMonth()]+" "+monthStart.getFullYear();
    let weekStart = monthStart;
    weekStart.setDate(monthStart.getDate()-monthStart.getDay());
    let dateTraverse = weekStart;
    for(let i = 0; i<(7*6);i++){
      let cell = document.createElement('div');
      cell.classList.add("mini-cal-cell");
      if(taskFunctions.zeroTime(currentDate).valueOf() === taskFunctions.zeroTime(dateTraverse).valueOf()){
        //console.log("today's date");
        cell.classList.add("today");
      }
      if(dateTraverse.getMonth()!=monthDisplayed){
        cell.classList.add("other-month");
      }
      let day = document.createElement('p');
      // let taskCount = createElement('div',"task-count");
      day.innerHTML=dateTraverse.getDate();
      miniCal.append(cell);
      cell.append(day);
      cell.dataset.date = dateTraverse;
      dateTraverse.setDate(dateTraverse.getDate()+1);
    }
    miniCalOpacity(obj);
  }
  let miniCalOpacity=function(obj){
    let tasks = obj['tasks'];
    let cellList = document.querySelectorAll('.mini-cal-cell');
    for(let cell of cellList){
      let taskCount = 0;
      for(let task of tasks){
        if(task.status!="deleted"){
          let date = new Date(task.date+' 00:00:00');
          date = taskFunctions.zeroTime(date);
          let cellDate = new Date(cell.dataset.date);
          cellDate=taskFunctions.zeroTime(cellDate);
          if(date.valueOf() == cellDate.valueOf()){
            taskCount++;
            cell.style.backgroundColor = "rgba(255,69,0,"+(taskCount/5)+")";
          }
        }
      }
    }

  }
  function nextMonth(ev){
    ev.preventDefault();
    let miniCal = document.querySelector('.mini-cal');
    let miniCalCells = miniCal.querySelectorAll('.mini-cal-cell');
    for(let i = 0; i < miniCalCells.length; i++){
      miniCalCells[i].remove();
    }
    monthDisplayed+=1;
    constructMiniCal(monthDisplayed);
  }
  function prevMonth(ev){
    ev.preventDefault();
    let miniCal = document.querySelector('.mini-cal');
    let miniCalCells = miniCal.querySelectorAll('.mini-cal-cell');
    for(let i = 0; i < miniCalCells.length; i++){
      miniCalCells[i].remove();
    }
    monthDisplayed-=1;
    constructMiniCal(monthDisplayed);
  }
  return{
    constructMiniCal: constructMiniCal,
    // miniCalOpacity: miniCalOpacity,
    monthDisplayed: monthDisplayed
  }
}
