// Initialize back4app Parse databse
Parse.initialize("IhNUqCfsmmW0MvFQ3TioMfv9gw54kNxzUgvmJKVl", "iIvlL1BIiVkZFmbzjClkWhbzbZVuCQA7ASADL7i4"); 
Parse.serverURL = "https://parseapi.back4app.com/";

//--------Global variables with event listenerers------


//the 4 answer button elements for the answer's with an event listener to triger checkanswer function 
//and pass in the the text content of the button
const button_A = document.getElementById("answer_a_btn");
button_A.addEventListener("click", (evt) => checkAnswer(button_A.textContent));

const button_B = document.getElementById("answer_b_btn");
button_B.addEventListener("click", (evt) => checkAnswer(button_B.textContent));

const button_C = document.getElementById("answer_c_btn");
button_C.addEventListener("click", (evt) => checkAnswer(button_C.textContent));

const button_D = document.getElementById("answer_d_btn");
button_D.addEventListener("click", (evt) => checkAnswer(button_D.textContent));

//event listeners for the lifeline buttons 
const fiftyFifty_btn = document.getElementById("fiftyFifty");
fiftyFifty_btn.addEventListener("click", (evt) => fiftyFifty());

const phoneAfriend_btn = document.getElementById("phoneAfriend");
phoneAfriend_btn.addEventListener("click", (evt) => phoneAfriend());

const askAudience_btn = document.getElementById("askAudience");
askAudience_btn.addEventListener("click", (evt) => askAudience());

/**start button on menu overlay */
const start_btn = document.getElementById("start");
start_btn.addEventListener("click", function(){
    if(!menuBoolean){
        startGame();
        menuBoolean = false;
    }
    document.querySelector("#overlay").style.display = "none";
});

//---------Global variables----------
/**store the question and answer's object retrieved from the api */
let qnaObjectArray;
/**counter used to increment trough the question's object from api*/
let questionCounter;
/**store the correct answer of each question*/
let correctAnswer;
/**array of wrong answers */
let wrongAnswers;
/**counter for prize li elements */
let prizeCounter;
/**stores prize text */
let prize;
/**boolean to restart timer*/
let restartTimer;

/**used to stop current audio when new one is starting */
let currentAudio = null;
/**boolean to let sound play if false or not if true  */
let mute = true;

/**stop user from pressing button when pop up active */
let popUpActive = false;

/**if true timer isnt restarted if false startgame is called so user can use menu during game to
 * see score and instructions but it does not stop the timer
 */
let menuBoolean;

/**current user score */
//let score;

/**boolean that is set to trough when correct 
*answer is clicked to hide the results of the lifeline
*/
let hideResultsBool;

/**store the current value of the CSS overflow property of the <body> */
const previousOverflow = document.body.style.overflow;

//------Global arrays------

/**array of the wrong and correct answer used so correct 
answer not always in same place */
let shuffledAnswers = [];

/**array of used usedLifeLines */
let usedLifeLines = [];

/**lifelines button array */
let lifeline_btns = [phoneAfriend_btn,fiftyFifty_btn,askAudience_btn]

//-------Global selectors-------

/**Select the <p> element with the ID "question"*/
const questionElement = document.getElementById("question");

/**Select the <li> element you want to update */ 
const liElement = document.querySelectorAll("#prizes ul li");
  
/**used to Retrieve prizecounter from local storage */ 
let storedCount = localStorage.getItem("prizeCounter");

/**audio element selector for adding source of audio */
const audio = document.getElementById('track');

/**for password text content on form */
const password = document.getElementById("password");
/**for username text content on form */
const username = document.getElementById("username");

/** play/pause button */
const mutePlayButton = document.querySelectorAll('.mute-play-btn');

/**div with sign up form */
const signUp = document.getElementById("sign-up");
/**for email text content */
let emailInput = document.getElementById("email-input");

let instruction = document.getElementById("instructions");


let leaderBoard = document.getElementById("leader-board");
let outerContainer = document.getElementById("outer-container");

 // Add h2 to leader borard and instructions
 const htmlContent = '<h2 id="inst-leader" class="center"></h2>';
 

let instructions_LeaderBoard_h2;

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

document.getElementById("done").addEventListener('click', function() {
   outerContainer.style.display = "none";
   leaderBoard.style.display = "none";
   instruction.style.display = "none";
   //remove the h2 tag
   instructions_LeaderBoard_h2.remove();
});

//-------function for start menu---------

/**this function is for the menu button it shows the menu over lay so the user can see
 * sores and instructions it doesnt stop the timer
 */
function menu() {
    document.querySelector("#overlay").style.display = "flex";
    start_btn.innerHTML = "Continue";
    displayScores();
    menuBoolean = true;
}
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
    }
    retrieve_QnA();
    timer();
    questionCounter = 0;
}


//----------Function's for database register/log in and display score--------------

/**
 * Function to fetch scores from back4app and display them on the leader board
 * 
 *  */ 
async function displayScores() {
    let i =0;
    let query = new Parse.Query("User");
    query.descending("score"); // Sort the results by the "score" property in descending order

    query.find().then(function(objects){
        if(objects){
            const scoreList = document.getElementById('score-list');
            scoreList.innerHTML = ''; // Clear the existing list

            objects.forEach(object => {
                i++;
              const listItem = document.createElement('li');
              listItem.textContent = `${i}. ${object.get("username")} => score : ${object.get("score")}`;
              scoreList.appendChild(listItem);
            });        
        } else {
           console.log("Nothing found, please try again");
        }
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);       
    });
  }

  // Function to add a new user to the scores.json file
  async function register() {

    if(emailInput.style.display === "none"){
        emailInput.style.display = "flex";
    }else{
     // Creates a new Parse "User" object, which is created by default in your Parse app
        let user = new Parse.User();
        // Set the input values to the new "User" object
        user.set("username", username.value);
        user.set("email", document.getElementById("email").value);
        user.set("password", password.value);
        
        try {
            // Call the save method, which returns the saved object if successful
            user = await user.save();
            if (user !== null) {
                signUp.style.display = "none";
            // Get the session token from the user object
            const sessionToken = user.getSessionToken();

            // Store the session token in local storage
            localStorage.setItem('sessionToken', sessionToken);  
            setUserSessionToken(sessionToken);    
            // Notify the success by getting the attributes from the "User" object, by using the get method (the id attribute needs to be accessed directly, though)
            alert(
                `New user created with success! ObjectId: ${
                user.id
                }, ${user.get("username")}`
            );
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
  }

  function readThenUpdate(score) {
    const currentUser = Parse.User.current();
    if (currentUser) {
        const currentUsername = currentUser.get("username"); // Get the current user's username

        query = new Parse.Query("User");
        query.equalTo("username", currentUsername);
        query.first().then(function (object) {
        if (object) {
            update(object, score);
        } else {
            console.log("Nothing found, please try again");
        }
        }).catch(function (error) {
        console.log("Error: " + error.code + " " + error.message);
        });
  }
}

function update(foundObject, score) {
    let newScore = foundObject.get("score") + score;
    foundObject.set('score', newScore);

    foundObject.save().then(function (object) {
      console.log('score updated! Username: ' + object.get("username") + ' and new score: ' + object.get("score"));
    }).catch(function(error) {
      console.log('Error: ' + error.message);
    });
}

async function logIn() {
    if (emailInput.style.display === "" || emailInput.style.display === "flex") {
      emailInput.style.display = "none";
    } else {
      try {
        // Log in the user using Parse.User.logIn()
        const user = await Parse.User.logIn(username.value, password.value);
  
        // Get the session token from the user object
        const sessionToken = user.getSessionToken();
  
        // Store the session token in local storage
        localStorage.setItem('sessionToken', sessionToken);
        setUserSessionToken(sessionToken);    

        // Hide the signup form
        signUp.style.display = "none";
  
        // Log the user login success
        console.log('User logged in successfully with name: ' + user.get("username") + ' and email: ' + user.get("email"));
      } catch (error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    }
}
 
// Function to check if a user is logged in
function checkUserLogin() {
    const sessionToken = localStorage.getItem('sessionToken'); // Fetch the session token from local storage
    if (sessionToken) {
        // To disable scrolling
        document.body.style.overflow = "hidden";
        //plays the start theme
        playAudioWithSrc("assets/sounds/start_theme.mp3");
        //event listener of the start up overlay
        setUserSessionToken(sessionToken);
        signUp.style.display = "none";
      }else {
        signUp.style.display = "flex";
        // To disable scrolling
        document.body.style.overflow = "hidden";
      }
}
checkUserLogin();

/**this function checks if the user is logged in
 * if they are not it shows the sign up/log in form otherwise it doesnt
 */
async function setUserSessionToken(sessionToken){
    try {
        await Parse.User.become(sessionToken); // Set up the user session using the session token
        return true;
    } catch (error) {
        console.error('Error setting up user session:', error);
        // Handle any errors if token is invalid or expired
    }
}

//-------functions for audio--------

/**function's for mute/unmute audio */
  function toggleMutePlay() {
    if (audio.paused) {
      audio.play();
      //sets the image for mute/sound button on start over lay and in game
      mutePlayButton.forEach(button => {
        button.style.backgroundImage = 'url("assets/images/no-sound.png")';
      });
      mute = false;
    } else {
      audio.pause();
      mutePlayButton.forEach(button => {
      button.style.backgroundImage = 'url("assets/images/sound-on.png")';
      });
      mute = true;
    }
  }
  
/** 
 * Function to change the audio source, and then play it if sound not muted 
 * @param {url} sourceUrl - url of audio file
 * */ 
  function playAudioWithSrc(sourceUrl) {
    audio.src = sourceUrl;
    if(mute){
        audio.pause();
    } else {
        audio.play();
    }
  }

//--------functions for question and answers section-----------

/**
 * This function retrievs the question and answers object trough the trivia api 
 * and then call's the function to load the content to the page
 * or catch's and display any errors
 */
function retrieve_QnA() {
    // Fetch the question from the https://the-trivia-api.com/ API
    fetch('https://the-trivia-api.com/v2/questions')
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        qnaObjectArray = data;
        nextQuestion();
    })
    .catch(error => {
        questionElement.textContent = `Error fetching question: ${error}`
    });
}

/**
 * go to next question in the object array 
 */
function nextQuestion() {
    // Extract the question from the response data
    const qNaObject = qnaObjectArray[questionCounter];
    const questionText = qNaObject.question.text;

    //extract the 3 incorrect Answers from the response data
    wrongAnswers = qNaObject.incorrectAnswers;

    //extract the correct answer from the the response data
    correctAnswer = qNaObject.correctAnswer;

    update_QnA_content(questionText,wrongAnswers,correctAnswer);
    questionCounter++;
}

/**
 * function triggered by any answer button pressed check's if the answer is correct
 * and then goes to next question or gets new qna object array if reaches 9
 */
function checkAnswer(buttonText) {
    if(!popUpActive){
        if (buttonText === correctAnswer){
            if (questionCounter <= 9){
                nextQuestion();       
            }else {
                questionCounter = 0;
                retrieve_QnA();
            }
            incrementPrize();
            restartTimer = true;
        }else {
            //gameOver();
        }
        hideResultsBool = true;
    }
}

/**
 * Array shuffling function using Fisher-Yates algorithm from stack-overflow 
 *  */ 
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

/**
 * Shufle the anwers and update the question and answers elements with text content
 */
function update_QnA_content(questionText, wrongAnswers, correctAnswer) {
    const answersArray = [wrongAnswers[0],wrongAnswers[1],wrongAnswers[2],correctAnswer];
    shuffledAnswers = shuffleArray(answersArray);
    //update the content of the <p> elements for the answers a,b,c,d
    button_A.textContent = shuffledAnswers[0];
    button_B.textContent = shuffledAnswers[1];
    button_C.textContent = shuffledAnswers[2];
    button_D.textContent = shuffledAnswers[3];
    // Update the content of the <p> element with the question id
    questionElement.textContent = questionText;
}

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
            sessionStorage.setItem("startScreen", 'false');//stops the start screen from showing if user playing again
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
        sessionStorage.setItem("startScreen", 'true')
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
                playAudioWithSrc("assets/sounds/lose.mp3")
            }else{
                timerCount--;
                number.innerHTML = timerCount;
            }
        }
    },1000)
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
    popUp("Game Over!!!", `Hard luck the correct answer was "${correctAnswer}"...Would you like to play again?`, "PLAY AGAIN", "QUIT" )
}

//---------------life lines sections----------------
const lifeLineResults = document.getElementById("life_line_results");
const grid = document.querySelector(".grid");
let phoneAfriendResults = document.querySelector(".phoneAfriendResults");

/**
 * This function makes the lifeline results and the button of
 * the selected life line dissapear
 * @param {- button will dissapear that was pressed} button 
 */
function hideResults(button) {
    disableLifeLineBtns();
    let resultsDissapear = setInterval(() => {
    if(hideResultsBool){
        if(button === askAudience_btn){
            button.style.backgroundImage = "url('assets/images/redX_ask_the_audience_img.png')";
            grid.style.display = "none";
            lifeLineResults.style.display = "none";
        }else if(button === fiftyFifty_btn){
            button.style.backgroundImage = "url('assets/images/redX_50_50_img.png')";
        }else {
            phoneAfriendResults.style.display = "none";
            button.style.backgroundImage = "url('assets/images/redX_phone_a_friend_img.png')";
    }
        
        clearInterval(resultsDissapear);

        hideResultsBool = false;
        //keeps the button that is pressed disabled and enable the others
        usedLifeLines.push(button);
        // Create a new array with elements from array1 that are not present in array2
        let unusedLifeLines =  lifeline_btns.filter((element) => !usedLifeLines.includes(element))
        unusedLifeLines.forEach((element) => {
                element.disabled = false;
            
          });
    }
   },1000);
}

/**
 * This function is for the phone a friend life line 
 * when the button is pressed this will show a line of 
 * text which includes an answer there is a random number
 * to show the percentage of how sure the "caller" is and
 * shows in the line of text if the number is over 50 its the correct answer
 * if not its the wrong answer
 * then the hide results function is called to hide the button and results
 */
function phoneAfriend() {
    playAudioWithSrc("assets/sounds/life-lines.mp3");

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let answer = randomNumber > 50 ? correctAnswer : wrongAnswers[0];
    phoneAfriend_btn.style.backgroundImage = `url('assets/images/green_phone_friend.png')`;
    phoneAfriendResults.innerHTML = `Hi im ${randomNumber}% sure the answer is "${answer}"`;   

    hideResults(phoneAfriend_btn);
}

/**
 * This function is for the ask the audience button when its pressed
 * it shows a bar chart of representing the audience answers
 * then hide results is called again to hide the button and the results
 */
function askAudience() {
    playAudioWithSrc("assets/sounds/life-lines.mp3");
    grid.style.display = "grid";
    lifeLineResults.style.display = "flex";
    //show the life line div again after display none
    askAudience_btn.style.backgroundImage = `url('assets/images/green_ask_audience.png')`;
    //for loop creates divs for the grid
    for (let i = 0; i < 100; i++) {
        const divElement = document.createElement('div');
        divElement.classList.add('grid-item');           
        grid.appendChild(divElement);
      }

      let barchartAddHeight = 0;
     
      const liElements = document.querySelectorAll('.bars li');
    //for loop adds the keyframe to the bars in the bar chart
    for (let i = 0; i < 4; i++) {
        const liElement = liElements[i];
        let ranNum = Math.floor(Math.random() * 140)+1;
        liElement.style.animation = `barchart${i} 2s linear forwards`;
        // add some extra hite to the bar on chart that matches the right question
        if(correctAnswer === shuffledAnswers[i]){
            barchartAddHeight = 60;
        }
        // Create the @keyframes animation dynamically
        let style = document.createElement('style');
        style.innerHTML = `@keyframes barchart${i} { 0% { height: 0; } 100% { height: ${ranNum+barchartAddHeight}px; } }`;
        barchartAddHeight = 0;
        document.head.appendChild(style);

    }
    hideResults(askAudience_btn);
}

/**This function is for the 50/50 lifeline button
 * it gets rid of two wrong questions
 */
function fiftyFifty() {
    playAudioWithSrc("assets/sounds/life-lines.mp3");

    fiftyFifty_btn.style.backgroundImage = `url('assets/images/green_50_50.png')`;

    for(let i = 0;i <= 1;i++){
        switch(wrongAnswers[i]){
            case button_A.textContent:
                button_A.textContent = "";
                break;
            case button_B.textContent:
                button_B.textContent = "";
                break;
            case button_C.textContent:
                button_C.textContent = "";
                break;
            case button_D.textContent:
                button_D.textContent = "";
                break;
        }
    }
    hideResults(fiftyFifty_btn);    
}

/**disables the lifeline buttons */
function disableLifeLineBtns() {
    lifeline_btns.forEach((element) => {
        element.disabled = true;
    });
}

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