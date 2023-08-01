//----------Function's for database register/log in and display score--------------

// Initialize back4app Parse databse
Parse.initialize("IhNUqCfsmmW0MvFQ3TioMfv9gw54kNxzUgvmJKVl", "iIvlL1BIiVkZFmbzjClkWhbzbZVuCQA7ASADL7i4"); 
Parse.serverURL = "https://parseapi.back4app.com/";


/**for password text content on form */
const password = document.getElementById("password");
/**for username text content on form */
const username = document.getElementById("username");
/**div with sign up form */
const signUp = document.getElementById("sign-up");

/**for email text content */
let emailInputDiv = document.getElementById("email-input");
let emailInputText = document.getElementById("email");
document.getElementById("register").addEventListener('click',  register);
document.getElementById("log-in").addEventListener('click',  logIn);

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
          alert(`Error saving score please log in again.`);
        }
    }).catch(function(error){
      alert(`Error displaying score please log in again. Error message: `+ error.message);
    });
  }

 /**
  * this function saves new user username, password and email to back4app database
  */
  async function register() {
    if(emailInputDiv.style.display === "none"){
        emailInputDiv.style.display = "flex";
    }else if (username.value === "" || emailInputText.value === "" || password.value === "") {
          alert("Please fill in all fields.");
        } else if (password.value.length <= 4) {
          alert("Password must be at least 5 characters long.");
        } else if (!emailInputText.value.includes("@") || !emailInputText.value.includes(".")) {
          alert("Please enter a valid email address.");
        } else {
          // All conditions are met, proceed with further actions.
          
             // Creates a new Parse "User" object, which is created by default in your Parse app
        let user = new Parse.User();
        // Set the input values to the new "User" object
        user.set("username", username.value);
        user.set("email", emailInputText.value);
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
                `New user created with success! Username: ${user.get("username")}`
            );
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    
    }
  }

  readThenUpdate(0);
/**
 * This function gets the current user object from the data base then calls the update function to update the score
 * @param {number} score - this is the points the user got for reaching a milestone 
 */
  function readThenUpdate(score) {
    const currentUser = Parse.User.current();
    if (currentUser) {
        const currentUsername = currentUser.get("username"); // Get the current user's username

        let query = new Parse.Query("User");
        query.equalTo("username", currentUsername);
        query.first().then(function (object) {
        if (object) {
            update(object, score);
           
        } else {
          alert(`Error saving score please log in again. Error message: `+ error.message);
        }
        }).catch(function (error) {
          alert(`Error saving score please log in again. Error message: `+ error.message);
        });
  }
}

/**
 * This function adds the users stored points on the data base with the points they got for reaching a milestone and
 * then saves the new score to the database
 * @param {object} foundObject - this is the current user object
 * @param {number} score - this is the points the user got for reaching a milestone
 */
function update(foundObject, score) {
    let newScore = foundObject.get("score") + score;
    displayUserNameNscore(foundObject.get("username"),newScore);

    if(score > 0){
    foundObject.set('score', newScore);
    foundObject.save().then(function (object) {
    }).catch(function(error) {
      alert(`Error saving score please log in again. Error message: `+ error.message);
    });
  } 
}

/**
 * this function gets the username and password from the input fields and checks 
 * the against the objects in the database if they exist it logs the user in
 */
async function logIn() {
    if (emailInputDiv.style.display === "" || emailInputDiv.style.display === "flex") {
      emailInputDiv.style.display = "none";
    } else if (username.value === "" || password.value === "") {
      alert("Please fill in all fields.");
    } else if (password.value.length <= 4) {
      alert("Password must be at least 5 characters long.");
    } else 
      // All conditions are met, proceed with further actions.
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

        alert(`Hey ` + user.get("username") + ` you are Logged in`);
      } catch (error) {
        alert(`Hey ${username.value} you are not Logged in, Error: ${error.message}`);
      }
}

function displayUserNameNscore(username,score){
    let userScoreDiv = document.querySelector(".username-n-score p");
    userScoreDiv.innerHTML = `${username}: ${score} points`;
}
 
/** 
 *  This Function checks if a user is logged in by checking session token in local storage
 * */
function checkUserLogin() {
    const sessionToken = localStorage.getItem('sessionToken'); // Fetch the session token from local storage
    
    if (sessionToken) {
        //plays the start theme
        playAudioWithSrc("assets/sounds/start_theme.mp3");
        //event listener of the start up overlay
        setUserSessionToken(sessionToken);
        localStorage.setItem("startScreen", 'false');
        return true;
      }else {
        localStorage.setItem("startScreen", 'true');
        alert("Please register or log in!!!");
        return false;
      }
}



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
