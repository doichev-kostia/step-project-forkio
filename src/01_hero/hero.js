const navBurger = document.querySelector(".hero__burger");
const navList = document.querySelector(".burger-menu");
navBurger.addEventListener("click", event =>{
    navBurger.classList.toggle("active");
    navList.classList.toggle("active");
});

document.body.addEventListener('click', function (event){
    if (!(event.target.classList.contains("active"))){
        navBurger.classList.remove("active");
        navList.classList.remove("active");
    }
})
