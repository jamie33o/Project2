
//--------Global variables with event listenerers------

//Select the buttons elements for the answer's and add an event listener to triger checkanswer function
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

//---------Global variables----------

//store the question and answer's object retrieved from the api 
let qnaObjectArray;
//counter used to increment trough the question's
let questionCounter = 0;
//store the answer of each question
let correctAnswer;
let wrongAnswers;
let prizeCounter;
let prize;
//boolean to restart timer
let restartTimer;
let stopTimer = false;



// Select the <p> element with the ID "question"
const questionElement = document.getElementById("question");

// Select the <li> element you want to update
const liElement = document.querySelectorAll("#prizes ul li");
  

// Retrieve data from local storage
let storedCount = localStorage.getItem("prizeCounter");
/*
check if there is a previously stored prize  
set prize counter to it then change all previous
prize amounts to gray and set background of current prize amount to green
 */
if (storedCount != null){
    prizeCounter = storedCount;
     //change background image of the prize li
    liElement[prizeCounter].style.backgroundImage = "url('assets/images/green_answer_box.png')";
  
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

//call retrieve qna so the first question and answer get loaded
retrieve_QnA();

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
 * Shufle the anwers and update the question and answers elements with content
 */
function update_QnA_content(questionText, wrongAnswers, correctAnswer) {

    const answersArray = [wrongAnswers[0],wrongAnswers[1],wrongAnswers[2],correctAnswer];

    const shuffledAnswers = shuffleArray(answersArray);

    //update the content of the <p> elements for the answers a,b,c,d
    button_A.textContent = shuffledAnswers[0];
    button_B.textContent = shuffledAnswers[1];
    button_C.textContent = shuffledAnswers[2];
    button_D.textContent = shuffledAnswers[3];

    // Update the content of the <p> element with the question id
    questionElement.textContent = questionText;

    timer();
}



/**
 * function triggered by any answer button pressed check's if the answer is correct
 * and then goes to next question or gets new qna object array if reaches 9
 */

function checkAnswer(buttonText) {
    if (buttonText === correctAnswer){
        if (questionCounter <= 9){
            nextQuestion();       
        }else {
            counter = 0;
            retrieve_QnA();
        }
        incrementPrize();
        restartTimer = true;
    }else {
        //gameOver();
    }


}


//------------functions for prize section-------------

/**
 * changes the prize that the user is on to green and checks if 
 * the user has reached any of the take home prizes
 */
function incrementPrize() {
    //decrement counter after updating the image
    prizeCounter--;
    //counter for the previous prize li element
    let previousPrizeLi = prizeCounter; 
    
    if (prize === "€500,000"){
        popUp(`Congratulations!!!`, `You have reached WON!! Congradulations you are a millionaire`, "PLAY AGAIN", "Quit");
    }else if (prizeCounter < 13){
        previousPrizeLi++;
        liElement[previousPrizeLi].style.backgroundImage = "url('assets/images/answer_box.png')";
        //get the p element from the previous prize and then change its color
        let previosParagraph = liElement[previousPrizeLi].querySelector("p");
        previosParagraph.style.color = "grey";
    }
    // Access the <p> element within the <li>
    let paragraph = liElement[previousPrizeLi].querySelector("p");

    // Retrieve the text content of the <p> element
    prize = paragraph.textContent;

    //change background image of the prize li
    liElement[prizeCounter].style.backgroundImage = "url('assets/images/green_answer_box.png')";
    //if its not on the first prize then change 
    //the prize bg before it back to original colour black
   

   //checks if user reaches a take home prize
    if(prize === "€5,000" || prize ==="€50,000") {
        popUp(`WELL DONE!!!`, `You have reached ${prize} would you like to continue or save your progress and come back later
        ?`, "CONTINUE", "SAVE");
      }
   
}

//---------pop up-----------
/**
 * This function generates a re-useable pop up window to notify user of progress it has two buttons 
 * and when its called you pass in the text for the h2, paragraph, button 1 and button 2, btn1 will make the pop up dissapear
 * while btn2 will save progress and bring user back to homepage
 * @param {text} h2_text - text for the h2 element
 * @param {text} p_text - text for the p element
 * @param {text} btn1Text - text for button element
 * @param {text} btn2Text - text for button element
 */

function popUp(h2_text, p_text, btn1Text, btn2Text) {
    
    let popUp_element = document.getElementById("pop_up");
    popUp_element.style.display = "flex";

    stopTimer = true;

    popUp_element.querySelector("h2").textContent = h2_text;

    popUp_element.querySelector("p").textContent = p_text;
    popUp_element.querySelector("#btn1").textContent = btn1Text;
    popUp_element.querySelector("#btn2").textContent = btn2Text;
 
    popUp_element.querySelector("#btn1").addEventListener('click',  function() {
        if (btn1Text === "PLAY AGAIN") {
            location.reload();
        }
        
        restartTimer = true;
        timer();
        
        popUp_element.style.display = "none";
    });

    popUp_element.querySelector("#btn2").addEventListener('click',  function() {
           
        if (btn2Text === "Quit") {    
                // Navigate to a new page, replacing the current page in the browser history
                localStorage.setItem("prizeCounter", 13);
            } else {
                    // Save data to local storage
                localStorage.setItem("prizeCounter", prizeCounter);
                
            }
        window.location.replace("index.html");
    }); 
}

//-----------Timer function section-----------
  
function timer() {
    let number = document.getElementById("number");
    let timerCount = 30;
    const element = document.querySelector("circle");
 
    const animation = element.animate(
              { strokeDashoffset: [0, -472] },
              { duration: 32000, easing: 'linear', fill: 'forwards' }
            );
    let timer = setInterval(() => {
        if (restartTimer){
            clearInterval(timer);
            number.innerHTML = 30;
            // Restart the animation
            animation.play();
            // Set the animation back to its original value
            restartTimer = false;

        }else if(timerCount === 0){
            clearInterval(timer);
            animation.pause();
            gameOver();
        }else if (stopTimer) {
            clearInterval(timer);
            animation.pause();
            stopTimer = false;
        }else{
            timerCount--;
            number.innerHTML = timerCount;
        }
    },970)
}
     
function gameOver() {
    popUp("Game Over!!!", `Hard luck the correct answer was "${correctAnswer}"...Would you like to play again?`, "PLAY AGAIN", "QUIT" )
}

//---------------life lines sections----------------
const lifeLineResults = document.getElementById("life_line_results");

function phoneAfriend() {

   const randomNumber = Math.floor(Math.random() * 100) + 1;

   let answer = randomNumber > 50 ? correctAnswer : wrongAnswers[0];
   
   phoneAfriend_btn.style.backgroundImage = `url('assets/images/green_phone_friend.png')`;

   lifeLineResults.innerHTML = `<p style="text-align:center">Hi im ${randomNumber}% sure the answer is "${answer}"</p>`;
   let resultsDissapear = setInterval(() => {
    lifeLineResults.style.display = "none";
    phoneAfriend_btn.style.display = "none"

    clearInterval(resultsDissapear);
   },20000);
}

function askAudience() {

    for (let i = 0; i < 40; i++) {
        const divElement = document.createElement('div');
        divElement.classList.add('grid-item');
        divElement.innerHTML = '2';
      
        lifeLineResults.appendChild(divElement);
      }

}

function fiftyFifty() {

}