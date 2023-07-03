    // Select the <p> element with the ID "question"
const questionElement = document.getElementById("question");

//Select the <p> element for answers A,B,C,D
const answerElement_A = document.getElementById("answer_a");
const answerElement_B = document.getElementById("answer_b");
const answerElement_C = document.getElementById("answer_c");
const answerElement_D = document.getElementById("answer_d");

function questionAnswers() {

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

    //update the content of the <p> elements for the answers a,b,c,d
    answerElement_A.textContent = wrongAnswers[0];
    answerElement_B.textContent = wrongAnswers[1];
    answerElement_C.textContent = wrongAnswers[2];
    answerElement_D.textContent = correctAnswer;

    // Update the content of the <p> element with the question id
    questionElement.textContent = questionText;
  })
  .catch(error => {
    console.error("Error fetching question:", error);
  });

}

questionAnswers();