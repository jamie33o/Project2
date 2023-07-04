    // Select the <p> element with the ID "question"
const questionElement = document.getElementById("question");

//Select the <p> element for answers A,B,C,D
const answerElement_A = document.getElementById("answer_a");
const answerElement_B = document.getElementById("answer_b");
const answerElement_C = document.getElementById("answer_c");
const answerElement_D = document.getElementById("answer_d");


//Select the buttons elements for the answer's
const button_A = document.getElementById("answer_a_btn").addEventListener;
const button_B = document.getElementById("answer_b_btn");
const button_C = document.getElementById("answer_c_btn");
const button_D = document.getElementById("answer_d_btn");


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
    // Extract the question from the response data
    const qNaObject = data[0];
    const questionText = qNaObject.question.text;

    //extract the 3 incorrect Answers from the response data
    const wrongAnswers = qNaObject.incorrectAnswers;

    //extract the correct answer from the the response data
    const correctAnswer = qNaObject.correctAnswer;

    update_QnA_content(questionText,wrongAnswers,correctAnswer);
  })
  .catch(error => {
    questionElement.textContent = `Error fetching question: ${error}`
  });

}

//call retrieve qna so the first question and answer get loaded
retrieve_QnA();

// Array shuffling function using Fisher-Yates algorithm from stack-overflow 
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


//update the question and answers elements with content
function update_QnA_content(questionText, wrongAnswers, correctAnswer) {

    const answersArray = [wrongAnswers[0],wrongAnswers[1],wrongAnswers[2],correctAnswer];

    const shuffledAnswers = shuffleArray(answersArray);

    //update the content of the <p> elements for the answers a,b,c,d
    answerElement_A.textContent = shuffledAnswers[0];
    answerElement_B.textContent = shuffledAnswers[1];
    answerElement_C.textContent = shuffledAnswers[2];
    answerElement_D.textContent = shuffledAnswers[3];

    // Update the content of the <p> element with the question id
    questionElement.textContent = questionText;

}


