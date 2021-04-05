export function Calendar(){

  let currentDate = new Date();
  // let displayDate = new Date();
  let monthDisplayed = currentDate.getMonth();
  // displayDate.setMonth(monthDisplayed);
  // displayDate.setYear(currentDate.getYear());

  let constructMonthHeading = function(element){
    let months =["January","Febuary","March","April",
                 "May","June","July","August",
                 "September","October","November","December"];
    this.element = element;
    this.element.innerHTML=months[currentDate.getMonth()];
  }
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
      let taskCount = createElement('div',"task-count");
      day.innerHTML=dateTraverse.getDate();
      miniCal.append(cell);
      cell.append(day,taskCount);
      cell.dataset.date = dateTraverse;
      dateTraverse.setDate(dateTraverse.getDate()+1);
    }
    miniCalOpacity(obj);
  }
  let miniCalOpacity=function(obj){
    let tasks = obj['tasks'];
    let cellList = document.querySelectorAll('.mini-cal-cell');
    for(let cell of cellList){
      for(let task of tasks){
        if(task.status!="deleted"){
          let date = new Date(task.date+' 00:00:00');
          date = taskFunctions.zeroTime(date);
          let cellDate = new Date(cell.dataset.date);
          cellDate=taskFunctions.zeroTime(cellDate);
          if(date.valueOf() == cellDate.valueOf()){
            let taskCount = cell.querySelector('.task-count');
            let opacity = taskCount.style.opacity;
            taskCount.style.opacity = opacity ? (parseFloat(opacity)+0.2) : 0.2;
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
