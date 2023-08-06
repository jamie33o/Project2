
//--------Global variables with event listenerers------
//event listeners for the lifeline buttons 
const fiftyFifty_btn = document.getElementById("fiftyFifty");
fiftyFifty_btn.addEventListener("click", () => fiftyFifty());

const phoneAfriend_btn = document.getElementById("phoneAfriend");
phoneAfriend_btn.addEventListener("click", () => phoneAfriend());

const askAudience_btn = document.getElementById("askAudience");
askAudience_btn.addEventListener("click", () => askAudience());


//------Global arrays------

/**array of used usedLifeLines */
let usedLifeLines = [];

/**lifelines button array */
let lifeline_btns = [phoneAfriend_btn,fiftyFifty_btn,askAudience_btn];

/**boolean that is set to trough when correct 
*answer is clicked to hide the results of the lifeline
*/
let hideResultsBool;

//---------------life lines sections----------------
const lifeLineResults = document.getElementById("life_line_results");
const grid = document.querySelector(".grid");
let phoneAfriendResults = document.querySelector(".phoneAfriendResults");

let lifeLinesBox = document.getElementById("life-lines")
//button for displaying and and hiding prize section on smaller devices
let showLifeLines = document.querySelector(".life-line-show-hide");
showLifeLines.addEventListener("click", function() {
    if(lifeLinesBox.style.display === "flex"){
        lifeLinesBox.style.display = "none";
    }else {
        lifeLinesBox.style.display = "flex";
        prizeBox.style.display = "none";
    }
})

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
    
        hideResultsBool = false;
        //keeps the button that is pressed disabled and enable the others
        usedLifeLines.push(button);
        // Create a new array with elements from array1 that are not present in array2
        let unusedLifeLines =  lifeline_btns.filter((element) => !usedLifeLines.includes(element));
        unusedLifeLines.forEach((element) => {
                element.disabled = false;
            
          });
          clearInterval(resultsDissapear);
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
    
    hideResultsBool = false;
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
    hideResultsBool = false;

    hideResults(askAudience_btn);
}

/**This function is for the 50/50 lifeline button
 * it hides two wrong answer
 */
function fiftyFifty() {
    playAudioWithSrc("assets/sounds/life-lines.mp3");
    let buttonTxtafter = [];

    fiftyFifty_btn.style.backgroundImage = `url('assets/images/green_50_50.png')`;

    let answerButtonsArray = [button_A,button_B,button_C,button_D];
    answerButtonsArray.forEach((element) => {
            let buttonTxt = element.textContent;
            buttonTxtafter.push(buttonTxt.substring(buttonTxt.indexOf(" ") + 1));
      });
   
    for(let i = 0;i <= 1;i++){
        switch(wrongAnswers[i]){
            case buttonTxtafter[0]:
                button_A.textContent = "";
                break;
            case buttonTxtafter[1]:
                button_B.textContent = "";
                break;
            case buttonTxtafter[2]:
                button_C.textContent = "";
                break;
            case buttonTxtafter[3]:
                button_D.textContent = "";
                break;
        }
    }
    hideResultsBool = false;
    hideResults(fiftyFifty_btn);    
}

/**disables the lifeline buttons */
function disableLifeLineBtns() {
    lifeline_btns.forEach((element) => {
        element.disabled = true;
    });
}