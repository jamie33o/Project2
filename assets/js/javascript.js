    // Select the <p> element with the ID "question"
const questionElement = document.getElementById("question");


//Select the buttons elements for the answer's and add an event listener to triger checkanswer function
const button_A = document.getElementById("answer_a_btn");
button_A.addEventListener("click", (evt) => checkAnswer(button_A.textContent));

const button_B = document.getElementById("answer_b_btn");
button_B.addEventListener("click", (evt) => checkAnswer(button_B.textContent));

const button_C = document.getElementById("answer_c_btn");
button_C.addEventListener("click", (evt) => checkAnswer(button_C.textContent));

const button_D = document.getElementById("answer_d_btn");
button_D.addEventListener("click", (evt) => checkAnswer(button_D.textContent));

//----Global variables----
//store the question and answer's object retrieved from the api 
let qnaObjectArray;
//counter used to increment trough the question's
let counter = 0;
//store the correct answer of each question
let correctAnswer;

//increment up each time answer
// is correct to change color of prize background
let prizeCounter = 13;


//--------functions for question and answers -----------

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
    const qNaObject = qnaObjectArray[counter];
    const questionText = qNaObject.question.text;

    //extract the 3 incorrect Answers from the response data
    const wrongAnswers = qNaObject.incorrectAnswers;

    //extract the correct answer from the the response data
    correctAnswer = qNaObject.correctAnswer;

    update_QnA_content(questionText,wrongAnswers,correctAnswer);
    counter++;
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
 * and then goes to next question
 */
function checkAnswer(buttonText) {
    if (buttonText === correctAnswer){
        nextQuestion();
        incrementPrize();
    }
}
//------------functions for prize section -------------

/**
 * changes the prize that the user is on  to green 
 */
function incrementPrize() {
    // Select the <li> element you want to update
    const liElement = document.querySelectorAll("#prizes ul li");
   
    //change background image of the prize li
    liElement[prizeCounter].style.backgroundImage = "url('assets/images/green_answer_box.png')";
    //if its not on the first prize then change 
    //the prize before it back to original colour black
    if (prizeCounter < 13){
        let previousPrizeLi = prizeCounter;
        previousPrizeLi++;
        liElement[previousPrizeLi].style.backgroundImage = "url('assets/images/answer_box.png')";
    }

    //decrement counter after updating the image
    prizeCounter--;
   
}


const liElements = document.querySelectorAll("#prizes ul li");

liElements.forEach(function(liElement) {
  // Access the <p> element within the <li>
  var paragraph = liElement.querySelector("p");

  // Retrieve the text content of the <p> element
  var prize = paragraph.textContent;

  console.log(prize);
});