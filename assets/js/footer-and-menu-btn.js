/*this aevent handler shows the footer when user scrolls to bottom of
 page and hides it when user scrolls up */
 window.addEventListener('scroll', function() {
    var footer = document.getElementById('myFooter');
    var scrollPosition = window.innerHeight + window.scrollY;
    var documentHeight = document.body.offsetHeight;
    var footerHeight = 180;
    if (scrollPosition < documentHeight + footerHeight) {
        footer.style.display = 'none'; // Hide the footer when not at the bottom
    } else {
        footer.style.display = 'flex'; // Show the footer when scrolled to the bottom

    }
});

//-------function for start menu button---------

document.getElementById("menu-btn").addEventListener('click',  menu);

/**this function is for the menu button it shows the menu over lay so the user can see
 * sores and instructions it doesnt stop the timer
 */
function menu() {
    document.querySelector("#overlay").style.display = "flex";
    start_btn.innerHTML = "Continue";
    displayScores();
    menuBoolean = true;
    document.body.style.overflow = "hidden";
    logOut_btn.style.display = "none";
    feedback_btn.style.display = "none";
}