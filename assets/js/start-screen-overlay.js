let instruction = document.getElementById("instructions");

let instructions_LeaderBoard_h2;

let leaderBoard = document.getElementById("leader-board");

let outerContainer = document.getElementById("outer-container");

 // Add h2 to leader borard and instructions
 const htmlContent = '<h2 id="inst-leader" class="center"></h2>';
 
// Loop through the NodeList and add the event listener to each element using forEach
mutePlayButton.forEach(btn => {
    btn.addEventListener('click', toggleMutePlay);
  });

// if user clicks play again dont show start screen and start game
if(localStorage.getItem("startScreen") === "false"){
    startGame();
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
    if(!menuBoolean){
        startGame();
        menuBoolean = false;
    }
    document.querySelector("#overlay").style.display = "none";
});


 /**
     * check if there is a previously stored prize  
    * set prize counter to it then changes all previous
    * prize amounts to gray and set background of current prize amount to green 
    * and background back to black for milestone also starts timer
    * and calls the function that retrieve qna object
    */
 function startGame() {
    //play the suspense sound for timer
    playAudioWithSrc("assets/sounds/suspense_sound.mp3");
    // To re-enable scrolling
    document.body.style.overflow = previousOverflow;
    document.querySelector("#overlay").style.display = "none";
    if (storedCount != null){
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
    }else {
        prizeCounter = 13;
        liElement[prizeCounter].style.backgroundImage = "url('assets/images/green_answer_box.png')";

    }
    retrieve_QnA();
    timer();
    questionCounter = 0;
}