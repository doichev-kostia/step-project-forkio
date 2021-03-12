const navBurger = document.querySelector(".hero__burger");
const navList = document.querySelector(".burger-menu");
navBurger.addEventListener("click", event =>{
    // document.body.classList.toggle("active")
    navBurger.classList.toggle("active");
    navList.classList.toggle("active");
});