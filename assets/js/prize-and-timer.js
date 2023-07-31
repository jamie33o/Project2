
//---------Global variables----------

// counter for the prize section
let prizeCounter;
/**stores prize text */
let prize;
/**boolean to restart timer*/
let restartTimer;

/**boolean to let sound play if false or not if true  */
let mute = true;

/**stop user from pressing button when pop up active */
let popUpActive = false;

/**if true timer isnt restarted if false startgame is called so user can use menu during game to
 * see score and instructions but it does not stop the timer
 */
let menuBoolean;

/**boolean that is set to trough when correct 
*answer is clicked to hide the results of the lifeline
*/
let hideResultsBool;

//------Global arrays------

/**array of used usedLifeLines */
let usedLifeLines = [];

/**lifelines button array */
let lifeline_btns = [phoneAfriend_btn,fiftyFifty_btn,askAudience_btn];

//-------Global selectors-------

/**Select the <li> element you want to update */ 
const liElement = document.querySelectorAll("#prizes ul li");
  
/**used to Retrieve prizecounter from local storage */ 
let storedCount = localStorage.getItem("prizeCounter");



//------------functions for prize section-------------

/**
 * changes the prize that the user is on to green and checks if 
 * the user has reached any of the take home prizes
 */
function incrementPrize() {
    //counter for the previous prize li element
    let previousPrizeLi = prizeCounter; 
    
    liElement[previousPrizeLi].style.backgroundImage = "url('assets/images/answer_box.png')";
    //get the p element from the previous prize and then change its color
    let previosParagraph = liElement[previousPrizeLi].querySelector("p");
    previosParagraph.style.color = "grey";

    // Access the <p> element within the <li>
    let paragraph = liElement[previousPrizeLi].querySelector("p");

    // Retrieve the text content of the <p> element
    prize = paragraph.textContent;
    //checks if user reaches a take home prize
    if(prize === "€5,000" || prize ==="€50,000") {
        // Call the playSound function and pass the URL of the sound file
        playAudioWithSrc('assets/sounds/milestone_prize.mp3');
        popUp(`WELL DONE!!!`, `You have reached ${prize}!!! \n ${prize === "€5,000" ? "50" : "500"} points will be added to your score!!! \n Would you like to continue or save your progress and come back later
        ?`, "CONTINUE", "SAVE");
        readThenUpdate(prize === "€5,000" ? 50 : 500);
      }else if (prize === "Million"){
        playAudioWithSrc('assets/sounds/million_sound.mp3');
        popUp(`Congratulations!!!`, `You have WON!! Congradulations you are a millionaire!!! 1000 points will be added to your score!!`, "PLAY AGAIN", "QUIT");
        readThenUpdate(1000);
    }
   
    //decrement counter after updating the image
    prizeCounter--;

    if(prizeCounter >0 ){
    //change background image of the prize li
    liElement[prizeCounter].style.backgroundImage = "url('assets/images/green_answer_box.png')";
    }
}

//---------pop up-----------
/**
 * This function generates a re-useable pop up window to notify user of progress 
 * and when its called you pass in the text for the h2, paragraph, button 1 and button 2, btn1 will make the pop up dissapear
 * while btn2 will save progress and bring user back to homepage and also save some variables to local or session storage
 * @param {text} h2_text - text for the h2 element
 * @param {text} p_text - text for the p element
 * @param {text} btn1Text - text for button element
 * @param {text} btn2Text - text for button element
 */
function popUp(h2_text, p_text, btn1Text, btn2Text) {
    popUpActive = true;
    let popUp_element = document.getElementById("pop_up");
    popUp_element.style.display = "flex";
    //  Create the <h2> element
    const h2Element = document.createElement("h2");
    // Set anyattributes or content 
    h2Element.textContent = h2_text;
    // Get the reference to an existing child element 
    const existingChild = popUp_element.firstElementChild;
    // Insert the <h2> element before the existing child element
    popUp_element.insertBefore(h2Element, existingChild);

    popUp_element.querySelector("p").textContent = p_text;
    popUp_element.querySelector("#btn1").textContent = btn1Text;
    popUp_element.querySelector("#btn2").textContent = btn2Text;
 
    popUp_element.querySelector("#btn1").addEventListener('click',  function() {
        if (btn1Text === "PLAY AGAIN") {
            localStorage.setItem("prizeCounter", 13);//resets prize to first one when game over win the million
            location.reload();
        }
        popUpActive = false;
        popUp_element.style.display = "none";
        h2Element.remove();
    });

    popUp_element.querySelector("#btn2").addEventListener('click',  function() {
           
        if (btn2Text === "QUIT") {    
                // Navigate to a new page, replacing the current page in the browser history
                localStorage.setItem("prizeCounter", 13);
        }else {
                    // Save data to local storage
                localStorage.setItem("prizeCounter", prizeCounter);
                
        }
        localStorage.setItem("startScreen", 'true');
        location.reload();
    }); 
}

//-----------Timer function section-----------
let intervalTimer;
/**
 * This function creates a 30second timer that restarts each time the user
 * answers a question if it goes to 0 its game over
 */
function timer() {
    let number = document.getElementById("number");
    let timerCount = 30;
    restartAnimation();
     intervalTimer = setInterval(() => {
        if(!popUpActive) {
            if (restartTimer){
                timerCount = 30;
                number.innerHTML = 30; 
                playAudioWithSrc("assets/sounds/suspense_sound.mp3");
                // Set the animation back to its original value
                restartAnimation();
                restartTimer = false;
            }else if(timerCount === 0){
                clearInterval(intervalTimer);
                gameOver();
                playAudioWithSrc("assets/sounds/lose.mp3");
            }else{
                timerCount--;
                number.innerHTML = timerCount;
            }
        }
    },1000);
}
     
/**
 * This function is for the timer circle animation
 */
function restartAnimation () {
    const element = document.querySelector("circle");
    element.animate(
              { strokeDashoffset: [0, -219] },
              { duration: 30000, easing: 'linear', fill: 'forwards' }
            );
}

/**
 * This function generates pop up to inform user game is over
 * and ask if they would like to play again or quit
 */
function gameOver() {
    popUp("Game Over!!!", `Hard luck the correct answer was "${correctAnswer}"...Would you like to play again?`, "PLAY AGAIN", "QUIT" );
}


