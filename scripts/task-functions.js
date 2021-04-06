let obj, text, myJSON;
text = localStorage.getItem("testJSON");
obj = JSON.parse(text);
export function zeroTime(date){
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
export function divFromTask(task){
  console.log(task);
  var idStr = "task"+task.id.toString();
  console.log(idStr);
  return document.getElementById(idStr);
}
export function taskFromDiv(div){
  var divID=div.getAttribute('id');
  console.log(divID);
  var idStr = divID.slice(4);
  console.log(idStr);
  var idNum = parseInt(idStr);
  return idNum;
}

export function getTaskFromID(idNum){
  let taskList = obj['tasks'];
  for (let task of taskList){
    if(task.id==idNum){
      return task;
    }
  }
}

export function storeObj(){
  myJSON = JSON.stringify(obj);
  localStorage.setItem("testJSON", myJSON);
  text = localStorage.getItem("testJSON");
}
