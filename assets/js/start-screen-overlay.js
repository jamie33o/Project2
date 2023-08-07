
//instructions pop up
const instruction = document.getElementById("instructions");

//instructions and leader board h2 tag
let instructions_LeaderBoard_h2;

//leader bord pop up
const leaderBoard = document.getElementById("leader-board");

//outer container for leader-board and instruction pop up
const outerContainer = document.getElementById("outer-container");

// Add h2 to leader borard and instructions
const htmlContent = '<h2 id="inst-leader" class="center"></h2>';

/**store the current value of the CSS overflow property of the <body> */
const previousOverflow = document.body.style.overflow;

// Loop through the NodeList and add the event listener to each element using forEach
mutePlayButton.forEach(btn => {
    btn.addEventListener('click', toggleMutePlay);
  });
  
// if user clicks play again dont show start screen and start game
if(localStorage.getItem("startScreen") === "false"){
    startGame();
    localStorage.setItem("startScreen", "true");
}else {
    document.body.style.overflow = "hidden";
    //plays the start theme
    playAudioWithSrc("assets/sounds/start_theme.mp3");
}

//event listener for instructions button
document.getElementById("instructions-btn").addEventListener('click', function() {
    if(leaderBoard.style.display === "block") {
        leaderBoard.style.display = "none";
    }
    instruction.style.display = "block";
    outerContainer.style.display = "flex";
    // Insert the h2 tag before other content of the "outerContainer"
    outerContainer.insertAdjacentHTML("afterbegin", htmlContent);

    //get the h2 that was added by class and add text
    instructions_LeaderBoard_h2 = document.getElementById("inst-leader");
    instructions_LeaderBoard_h2.innerHTML = "Instruction's";
});

//event listener for leader board button
document.getElementById("leader-board-btn").addEventListener('click', function() {
    if(instruction.style.display === "block") {
        instruction.style.display = "none";
    }
    leaderBoard.style.display = "block";
    outerContainer.style.display = "flex";
    //Insert the h2 content before the other content of the "outerContainer"
    outerContainer.insertAdjacentHTML("afterbegin", htmlContent);

    //get the h2 that was added by class and add text
    instructions_LeaderBoard_h2 = document.getElementById("inst-leader");
    instructions_LeaderBoard_h2.innerHTML = "Leader Board";
    displayScores();
});

// event listener for done button on instructions and leaderboard pop up
document.getElementById("done").addEventListener('click', function() {
   outerContainer.style.display = "none";
   leaderBoard.style.display = "none";
   instruction.style.display = "none";
   //remove the h2 tag
   instructions_LeaderBoard_h2.remove();
});

/**start button on menu overlay and event listener for it */
const start_btn = document.getElementById("start");
start_btn.addEventListener("click", function(){
   if(start_btn.textContent != "Log in/Register"){
    if(!menuBoolean){
        startGame();
        menuBoolean = false;
    }
     // To disable scrolling
    document.body.style.overflow = previousOverflow;
    document.querySelector("#overlay").style.display = "none";
}else{
    signUp.style.display = "flex";
}
});

 /**
     * check if there is a previously stored prize  
    * set prize counter to it then changes all previous
    * prize amounts to gray and set background of current prize amount to green 
    * and background back to black for milestone also starts timer
    * and calls the function that retrieve qna object
    */
 function startGame() {
    /**used to Retrieve prizecounter from local storage */ 
    const storedCount = localStorage.getItem("prizeCounter");
    //play the suspense sound for timer
    playAudioWithSrc("assets/sounds/suspense_sound.mp3");
    // To re-enable scrolling
    document.querySelector("#overlay").style.display = "none";
    if (storedCount > 0){
        prizeCounter = storedCount;
        //change background image of the prize li
        liElement[prizeCounter].style.backgroundImage = "url('assets/images/green_answer_box.png')";
    
        //sets text to grey and background back to black for milestones for li elements before the prize
        // the user was on when they saved the game
        for (let i = prizeCounter; i < liElement.length; i++){
            if (i === prizeCounter){
                    continue;
            }     
            let prizeAmount = liElement[i].querySelector("p");
            prizeAmount.style.color = "grey";
            if (prizeAmount.textContent === "€5,000" || prizeAmount.textContent === "€50,000") {
                liElement[i].style.backgroundImage = "url('assets/images/answer_box.png')";
            }
        }
        localStorage.setItem("prizeCounter", 0);
    }else {
        prizeCounter = 13;
        liElement[prizeCounter].style.backgroundImage = "url('assets/images/green_answer_box.png')";

    }
    retrieve_QnA();
    timer();
    questionCounter = 0;
    showNotification("30 second Timer started", "success")
}