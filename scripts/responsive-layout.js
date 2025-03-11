const slideoutButton = document.querySelector('.slideoutButton');
var slideoutOpen = true; 

if(screen.width>600){ //start the sidebar elements open if on a large screen - pc/tablet
    document.getElementById("addTaskFormDetails").open = true;
    document.getElementById("mini-calDetails").open = true;
  }

slideoutButton.addEventListener('click',toggleSlideout);

function toggleSlideout(ev){
  ev.preventDefault();
  var sidebar = document.querySelector('.menu');
  var main = document.querySelector('.main');
  
  if (slideoutOpen){
    sidebar.classList.add("sidebar-closed");
    main.classList.add("full-width-main");
  }else {
    sidebar.classList.remove("sidebar-closed");
    main.classList.remove("full-width-main");
  }  
  slideoutOpen = !slideoutOpen;
}
screen.orientation.addEventListener("change", (event)=>{
    var type = event.target.type;
    if(type="landscape-primary"){
        var sidebar = document.querySelector('.menu');
        var main = document.querySelector('.main');
        sidebar.classList.remove("sidebar-closed");
        main.classList.remove("full-width-main");
    } 
    if(screen.width>600){
        document.getElementById("addTaskFormDetails").open = true;
        document.getElementById("mini-calDetails").open = true;
    }else{
        document.getElementById("addTaskFormDetails").open = false;
        document.getElementById("mini-calDetails").open = false;
    }
});