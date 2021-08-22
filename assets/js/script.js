// variables based on the DOM selectors
var startButton = document.createElement("button");
var timer = document.querySelector(".timer");
var quizQueries = document.querySelector(".questions");
var createList = document.createElement("ul");
var highScoreList = document.createElement("ol");
var viewScores = document.querySelector(".score");

// Create game instructions object
var instructionContent = {
    header: "Coding Quiz Challenge",
    directions: "Try to answer the following code-related questions within the time limit.Keep in mind that incorrect answers will penalize your score/time by 10 seconds!!",
}


// question objects
var questions = [{
        question: "Commonly used data types do NOT include: ___.",
        options: ["1.Strings", "2.Booleans", "3.Alerts", "4.Numbers"],
        answer: "3.Alerts"
    },
    {
        question: "The condition in an if/else statement is enclosed within: ___.",
        options: ["1.Quotations", "2.Curly braces", "3.Parentheses", "4.Square brackets"],
        answer: "3.Parentheses"
    },
    {
        question: "Arrays in JavaScript can be used to store: ___.",
        options: ["1.Numbers", "2.Other arrays", "3.Booleans", "4.All of the above"],
        answer: "4.All of the above"
    },
    {
        question: "String value must be enclosed within ___ when being assigned to variables.",
        options: ["1.Commas", "2.Curly braces", "3.Quotations", "4.Parentheses"],
        answer: "3.Quotations"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is: ___",
        options: ["1.JavaScript", "2.Terminal/bash", "3.Alerts", "4.Console.log"],
        answer: "4.Console.log"
    },
]

// other global variables
var questionNum;
var secondsLeft;
var correctAnswer;
var timerInterval;
var initialsInput;
var initialsEntered;
var allScores;
var highScoreHeader;
var orderedScores;

// Show instructions on load
renderInstructions();

// Render instructions on page
function renderInstructions() {
    // reset content to blank
    quizQueries.innerHTML = "";

    // add a header
    var dirHeader = document.createElement("h1");
    dirHeader.setAttribute("id", "dirHeader");
    dirHeader.textContent = instructionContent.header;
    // render on page
    quizQueries.appendChild(dirHeader);

    // add a paragraph
    var initInstruct = document.createElement("p");
    initInstruct.setAttribute("id", "initInstruct");
    initInstruct.textContent = instructionContent.directions;
    // render on page
    quizQueries.appendChild(initInstruct);

    // add the start button
    startButton.textContent = "Start Quiz";
    // render on page
    quizQueries.appendChild(startButton);
}

// start the quiz
startButton.addEventListener("click", function() {
    setTimer();
});

// Timer
function setTimer() {
    questionNum = 0;
    secondsLeft = 75;
    correctAnswer = 0;

    timerInterval = setInterval(function() {
        secondsLeft--;
        // add secondsleft to timer
        timer.textContent = "Timer :" + secondsLeft;

        if (secondsLeft === 0) {
            //stop timer
            clearInterval(timerInterval);
            setScore();
            timer.textContent = "Time is up!"
        }
    }, 1000);

    AddQuestions(questionNum);
}


// Add questions to the DOM
function AddQuestions(questionNum) {

    // reset queries content
    quizQueries.innerHTML = "";
    createList.innerHTML = "";

    // change queries content
    var selectQuery = questions[questionNum].question;
    var selectOptions = questions[questionNum].options;

    var query = document.createElement("h2");
    query.textContent = selectQuery
    quizQueries.appendChild(query);

    // create list items for the objectives in the options array and render it to page
    selectOptions.forEach(function(newItem) {
        var listItem = document.createElement("li");
        listItem.textContent = newItem;
        quizQueries.appendChild(createList);
        createList.appendChild(listItem);

        // add listener to verify the answer
        listItem.addEventListener("click", checkAnswer);

    })
}

// Check if correct answer selected using events
function checkAnswer(event) {
    var element = event.target;
    // if target event is a list item
    if (element.matches("li")) {
        // create element where selected answer appears
        var answerSelected = document.createElement("div");
        answerSelected.setAttribute("id", "selectedAnswer");

        // user chooses correct answer
        if (element.textContent == questions[questionNum].answer) {
            correctAnswer++;
            answerSelected.textContent = "Correct! The answer for the previous query was: " + questions[questionNum].answer;
            // user chooses incorrect answer
        } else {
            // penalize your score/time by 10 seconds!!
            secondsLeft = secondsLeft - 10;
            answerSelected.textContent = "Wrong! The answer for the previous query was: " + questions[questionNum].answer + " .You lose 10 secs!";
        }
    }

    //  move  to next question
    questionNum++;

    // if question index is larger than our array length, show score page
    if (questionNum >= questions.length) {
        setScore();
        answerSelected.textContent = "";
        // otherwise show next question
    } else {
        AddQuestions(questionNum);
    }

    // render on page
    quizQueries.appendChild(answerSelected);
}

function setScore() {
    //  reset divs
    quizQueries.innerHTML = "";
    timer.innerHTML = "";

    // add a header
    var finalHeader = document.createElement("h1");
    finalHeader.setAttribute("id", "finalHeader");
    finalHeader.textContent = "All Done!";
    // render on page
    quizQueries.appendChild(finalHeader);

    // add a paragraph to show score
    var scoreSummary = document.createElement("p");
    scoreSummary.setAttribute("id", "scoreSummary");
    quizQueries.appendChild(scoreSummary);

    // set score and add to paragraph
    if (secondsLeft >= 0) {
        var timeLeft = secondsLeft;
        clearInterval(timerInterval);
        scoreSummary.textContent = "Your final score is: " + timeLeft + ".";
    }

    // get initials input
    var playerInitials = document.createElement("label");
    playerInitials.setAttribute("id", "initials");
    playerInitials.textContent = "Enter Initials here:  ";

    initialsInput = document.createElement("input");
    initialsInput.setAttribute("type", "text");
    initialsInput.setAttribute("id", "initialsInput");
    initialsInput.textContent = "";

    // render on page
    quizQueries.appendChild(playerInitials);
    quizQueries.appendChild(initialsInput);

    // create submit button
    var submitInitials = document.createElement("button");
    submitInitials.setAttribute("id", "submitInitials");
    submitInitials.textContent = "submit";

    // render to page
    quizQueries.appendChild(submitInitials);

    // add event listener to submit button to send score and initials to local storage
    submitInitials.addEventListener("click", function() {
        //  local variable to manipulate input
        initialsEntered = initialsInput.value;
        console.log("initals entered : " + initialsEntered);

        // if nothing is entered, log a message
        if (!initialsEntered.length) {
            console.log("initials invalid");

        } else {
            // otherwise create an object to save the score
            saveScore();
            // get the final score from local storage
            getScore();
        }

    });
}

function saveScore() {

    var userScore = {
        score: secondsLeft,
        name: initialsEntered
    }
    console.log(userScore);

    // pull all scores from local storage if there are multiple logged there
    allScores = localStorage.getItem("allScores");
    if (allScores === null) {
        // set all scores to be an array if nothing stored
        allScores = [];

        // otherwise create an object from info stored
    } else {
        allScores = JSON.parse(allScores);
    }

    // add a user's score to the all scores array
    allScores.push(userScore);

    // store a string that includes all scores
    var newScore = JSON.stringify(allScores);
    localStorage.setItem("allScores", newScore);

    // retrieve score and initials from local storage and sort
    orderedScores = allScores.sort(function(a, b) {
        return b.score - a.score;
    })
    console.log(orderedScores);
}
// get the final score on the page

function getScore() {
    // reset 
    quizQueries.innerHTML = "";

    // create ordered list of high scores
    highScoreHeader = document.createElement("h2");
    highScoreHeader.setAttribute("id", "highScore");
    highScoreHeader.textContent = "High Scores!!";
    // render on page
    quizQueries.appendChild(highScoreHeader);

    // empty the list
    while (highScoreList.firstChild) {
        highScoreList.removeChild(highScoreList.firstChild);
    }

    // add ordered list to page
    for (i = 0; i < orderedScores.length && i < 10; i++) {
        var scoreItem = orderedScores[i].name + " - " + orderedScores[i].score + " points";
        console.log(scoreItem);
        var highScoreItem = document.createElement("li");
        highScoreItem.textContent = scoreItem;
        quizQueries.appendChild(highScoreList);
        highScoreList.appendChild(highScoreItem);
    }
    // add button to return to the main screen
    playAgainButton();
    // add button to clear high scores
    clearHighScoreButton();
    // view high score appears after one game played by the user.
    viewHighScore()
}

//  view high score function
function viewHighScore() {
    // button to show high scores
    var viewHighScores = document.createElement("button");
    viewHighScores.setAttribute("id", "viewHighScores");
    viewHighScores.textContent = "View HighScores";
    viewScores.appendChild(viewHighScores);

    // Add event listener to button to show high scores
    viewHighScores.addEventListener("click", getScore);

}

//  play again button
function playAgainButton() {
    // add button to return to the main screen
    var returnBtn = document.createElement("button");
    returnBtn.setAttribute("id", "returnBtn");
    returnBtn.textContent = "Play Again!";
    quizQueries.appendChild(returnBtn);

    // add event listener to call renderInstructions function
    returnBtn.addEventListener("click", function() {
        renderInstructions();
    });
}

//  clear highscore
function clearHighScoreButton() {

    // add button to clear high scores
    var clearBtn = document.createElement("button");
    clearBtn.setAttribute("id", "clearBtn");
    clearBtn.textContent = "Clear High Scores";
    quizQueries.appendChild(clearBtn);

    // add event listener to clear local storage values
    clearBtn.addEventListener("click", function() {
        //clear storage
        localStorage.clear();
        sessionStorage.clear();
        localStorage.removeItem("allScores");

        // empty the list
        while (highScoreList.firstChild) {
            highScoreList.removeChild(highScoreList.firstChild);
        }
        //  Play again text
        highScoreHeader.textContent = "Want to Play again?? Click on the Play Again Button!";
        quizQueries.appendChild(highScoreHeader);
        clearBtn.remove();

    })

}