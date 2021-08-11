// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');

const countdownPage = document.getElementById('countdown-page');
const splashPage = document.getElementById('splash-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

// Refresh Splash page best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

// Check local storage for best scores and set bestscoreArray value
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores)
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// To update our bestScoreArray
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // selectthe correct best score to update
    if (questionAmount == score.questions) {
      // Return the best score as a number with one decimel
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replaceing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }

    }
  });
  //Update splash page
  bestScoresToDOM();
  //save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}


// Reset Game to play again
function playAgain() {
  // gamePage.addEventListener('click', startTimer); // removed as not using click event listener which wasnt functioning on time for mobile devices
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;

}

// Show score page
function showScorePage() {
  // show play again button after one second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  },1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Format and Display time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to top of item container and go to our score page
  itemContainer.scrollTo({ top: 0, behavior: 'instant'});
  showScorePage();

}

// Stop the Timer and process the results
function checkTime() {
  console.log('Time played',timePlayed)
  if (playerGuessArray.length == questionAmount) {
    console.log('player guess array: ', playerGuessArray)
    clearInterval(timer);
    //check for wrong guess and add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // correct Guess, No penalty
      } else {
        // incorrect Guess, add penalty
        penaltyTime +=0.5; // will add 0.5 seconds to the time as penalty if answer is wrong i.e. not match as per if statement
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log('Time:', timePlayed, 'Penalty:', penaltyTime, 'Final Time:', finalTime);
    scoresToDOM();
  }
}

// Add a tneth of a secon to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}


// Start time when game page is clicked
function startTimer() {
  //reset the times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100); // set intervals of tenth of a second to execute function addTime
  // gamePage.removeEventListener('click', startTimer); // so that this event function only starts once // Now removed as not using click listener
}

// scroll, store user selection in the playerGuessArray
function select(guessedTrue) {
  // console.log('player guess array: ', playerGuessArray)
  // Scroll 80 pixels at a time
  valueY += 80; // this will allow for each time it scrolls to add 80, i.e. 80, 160 and so on
  itemContainer.scroll(0,valueY);
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

//Displays Game Page
function showGamePage() {
    gamePage.hidden = false;
  countdownPage.hidden = true; 
}

// Get Random Number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('Correct equations:', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('Wrong equations:', wrongEquations);
  // Loop through, multiply random numbers up to 12, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(12);
    secondNumber = getRandomInt(12);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(12);
    secondNumber = getRandomInt(12);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
  // console.log('equations array:', equationsArray);
  // equationsToDOM();
}

// Equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Displays 3,2,1, Go!
function countdownStart() {
  let count = 3;
  countdown.textContent = count;
  const timeCountDown = setInterval(() => {
    count--;
    if(count === 0) {
      countdown.textContent = 'Go!';
    } else if (count === -1) {
      showGamePage();
      startTimer();
      clearInterval(timeCountDown);
    } else {
      countdown.textContent = count;
    }
  }, 1000);
}
//   countdown.textContent = '3'
//   setTimeout(() => {
//     countdown.textContent = '2';
//   }, 1000);
//   setTimeout(() => {
//     countdown.textContent = '1';
//   }, 2000);
//   setTimeout(() => {
//     countdown.textContent = 'Go!';
//   }, 3000);
// }

// Navigate from Splash page to countdown page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
}

// Get the value of selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}


// Form that decides the amount of Questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('Question amount:', questionAmount);
  if (questionAmount) {
    showCountdown();
  }
}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove selected Label Styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
// gamePage.addEventListener('click', startTimer); // removed this listener as it will not work on mobile devices

//Onload
getSavedBestScores();
