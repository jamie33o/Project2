
/**store the question and answer's object retrieved from the api */
let qnaObjectArray;
/**counter used to increment trough the question's object from api*/
let questionCounter;
/**store the correct answer of each question*/
let correctAnswer;
/**array of wrong answers */
let wrongAnswers;
/**counter for prize li elements */

/**array of the wrong and correct answer used so correct 
answer not always in same place */
let shuffledAnswers = [];

/**Select the <p> element with the ID "question"*/
const questionElement = document.getElementById("question");

//the 4 answer button elements for the answer's with an event listener to triger checkanswer function 
//and pass in the the text content of the button
const button_A = document.getElementById("answer_a_btn");
button_A.addEventListener("click", () => checkAnswer(button_A.textContent));

const button_B = document.getElementById("answer_b_btn");
button_B.addEventListener("click", () => checkAnswer(button_B.textContent));

const button_C = document.getElementById("answer_c_btn");
button_C.addEventListener("click", () => checkAnswer(button_C.textContent));

const button_D = document.getElementById("answer_d_btn");
button_D.addEventListener("click", () => checkAnswer(button_D.textContent));

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
        questionElement.textContent = `Error fetching question: ${error}`;
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
        // remove's the A: , B: , C:, D: from the button text
        buttonText= buttonText.substring(buttonText.indexOf(" ") + 1);

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
            gameOver();
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
    button_A.textContent = "A: " + shuffledAnswers[0];
    button_B.textContent = "B: " + shuffledAnswers[1];
    button_C.textContent = "C: " + shuffledAnswers[2];
    button_D.textContent = "D: " + shuffledAnswers[3];
    // Update the content of the <p> element with the question id
    questionElement.textContent = questionText;
}
