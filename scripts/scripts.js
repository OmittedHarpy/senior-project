
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


function populateSection(obj){
  const tasks = obj['tasks'];
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
  var div = document.createElement('div');
  var p = document.createElement('h3');
  var hr = document.createElement('hr');
  div.classList.add("dateSection");
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
        // console.log("added to end of list");
      }else if (dateSectionList[0].dataset.date>dateSection.dataset.date) {
        tasklist.prepend(dateSection);
        // console.log("added to beginning of list");
      }else{
        for(let i = len-1; i>1; i--){
          if(dateSectionList[i].dataset.date>dateSection.dataset.date
            && dateSection.dataset.date>dateSectionList[i-1].dataset.date){
            tasklist.insertBefore(dateSection, dateSectionList[i]);
          }
        }
      }
      // console.log(dateSectionList);
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
  const div = document.createElement('div');
  const p1 = document.createElement('span');
  const completeBtn = constructCompleteBtn(task);
  const actionBar = document.createElement('span');
  actionBar.classList.add("action_bar");
  const deleteBtn = constructDltBtn();
  const editBtn = constructEditBtn();
  div.id='task'+task.id;
  p1.textContent = task.desc;
  div.appendChild(completeBtn);
  div.appendChild(p1);
  div.appendChild(actionBar);
  actionBar.appendChild(editBtn);
  actionBar.appendChild(deleteBtn);

  div.className="task";
  return div;
}

function constructDltBtn(){
  const deleteBtn = document.createElement('button');
  deleteBtn.className="close";
  deleteBtn.textContent="\u00D7";
  deleteBtn.addEventListener("click",deleteTask);
  return deleteBtn;
}
function constructCompleteBtn(task){
  const completeBtn = document.createElement('button');
  completeBtn.className="check";
  if(task.status=="active"){
    completeBtn.textContent="\u25EF";
  } else if (task.status=="completed"){
    completeBtn.textContent="\u2713";
  }
  completeBtn.addEventListener('click',completeTask);
  return completeBtn;
}
function constructEditBtn(){
  const editBtn = document.createElement('button');
  editBtn.className="edit";
  const editIcon = document.createElement('i');
  editIcon.className = "fas fa-pencil-alt fa-sm";
  editBtn.append(editIcon);
  return editBtn;
}
function deleteTask(ev){
  changeState(ev,"deleted");
}
function completeTask(ev){
  this.textContent="\u2713";
  changeState(ev,"completed");
}
function changeState(ev,state){
  const tasks = obj["tasks"];
  if(state==="deleted"){
    var actionBar = ev.target.parentElement;
    var card = actionBar.parentElement;
  }else{
    var card = ev.target.parentElement;
  }
  card.classList.add(state);
  var idNum = taskFromDiv(card);
  for (let task of tasks){
    if(task.id==idNum){
      task.status=state;
    }
  }
  storeObj(obj);
}

var completedVisible = true;
function filterCompletedTasks(ev){
  if(completedVisible){
    this.textContent = "Show Completed";
  }else{
    this.textContent = "Hide Completed";
  }
  toggleCompletedTasks();
  completedVisible = !completedVisible;
}
function toggleCompletedTasks(){
  // window.alert("This button doesn't do anything yet!");
  let completedTasks = document.querySelectorAll('.completed');
  for(let i = 0; i < completedTasks.length; i++){
    if(completedVisible){
      completedTasks[i].classList.add("hidden");
    }else{
      completedTasks[i].classList.remove("hidden");
    }
  }
}

function editTask(){

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
