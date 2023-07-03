// Select the <p> element with the ID "question"
const questionElement = document.getElementById("question");

// Fetch the question from the API
fetch('https://the-trivia-api.com/v2/questions')
  .then(response => response.json()) // Parse the response as JSON
  .then(data => {
    // Extract the question from the response data
    const chooseQuestion = data[0];
    const questionText = chooseQuestion.question.text;

    // Update the content of the <p> element with the question
    questionElement.textContent = questionText;
  })
  .catch(error => {
    console.error("Error fetching question:", error);
  });
