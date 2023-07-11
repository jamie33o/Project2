
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

//---------Global variables----------

//store the question and answer's object retrieved from the api 
let qnaObjectArray;
//counter used to increment trough the question's
let questionCounter = 0;
//store the correct answer of each question
let correctAnswer;
let prizeCounter;
let prize;

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
    const wrongAnswers = qNaObject.incorrectAnswers;

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
    }
}
//------------functions for prize section -------------

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
        popUp(`Congradulations!!!`, `You have reached WON!! Congradulations you are a millionaire`, "Play Again", "Quit");
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

function popUp(h2_text, p_text, btn1Text, btn2Text) {
    
    let popUp_element = document.getElementById("pop_up");
    popUp_element.style.display = "flex";

    popUp_element.querySelector("h2").textContent = h2_text;

    popUp_element.querySelector("p").textContent = p_text;
    popUp_element.querySelector("#btn1").textContent = btn1Text;
    popUp_element.querySelector("#btn2").textContent = btn2Text;
 
    popUp_element.querySelector("#btn1").addEventListener('click',  function() {
        if (btn1Text === "Play Again") {
            location.reload();
        }
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



   
     

