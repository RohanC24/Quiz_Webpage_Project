const questions = [
    {
        question: "Which type of JavaScript language is?",
        answers: ["Object-Oriented", "Object-Based", "Assembly-language", "High-level"],
        correctAnswer: 1
    },
    {
        question: "Which function is used to serialize an object into a JSON string in JavaScript?",
        answers: ["stringify()", "parse()", "convert()", "None of the above"],
        correctAnswer: 0
    },
    {
        question: "Which of the following are closures in JavaScript?",
        answers: ["variables", "Functions", "objects", "All of the above"],
        correctAnswer: 3
    },
    {
        question: "Which of the following is not a JavaScript framework?",
        answers: ["Node", "Vue", "React", "Cassandra"],
        correctAnswer: 3
    },
    {
        question: "Which of the following keywords is used to define a variable in JavaScript?",
        answers: ["var", "let", "Both A and B", "None of the above"],
        correctAnswer: 2
    }
];


let link = document.getElementsByClassName("link");
let questionElement = document.getElementById("question");
let answerButtons = document.querySelectorAll("#answer-buttons .btn");
let nextButton = document.getElementById("next-btn");
let backButton = document.getElementById("back-btn");

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = new Array(questions.length).fill(null);


let timeLeft = 300; 
const timerElement = document.getElementById('time');
let timer;

function updatePagination() {
    for (let l of link) {
        l.classList.remove("active");
    }
    link[currentQuestionIndex].classList.add("active");
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers.fill(null);


    timeLeft = 300; 
    timerElement.textContent = "05:00"; 

    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up! Submitting your answers.");
            submitQuiz();
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);

    nextButton.textContent = "Next";
    backButton.style.display = "inline-block";

    //
    answerButtons.forEach(button => button.style.display = "block");

    updatePagination();
    showQuestion();
}


function showQuestion() {
    resetState();
    updatePagination();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    answerButtons.forEach((button, index) => {
        button.textContent = currentQuestion.answers[index];
        button.onclick = () => selectAnswer(button, index);
    });

    if (userAnswers[currentQuestionIndex] !== null) {
        const selectedAnswerIndex = userAnswers[currentQuestionIndex];
        answerButtons[selectedAnswerIndex].classList.add(
            selectedAnswerIndex === currentQuestion.correctAnswer ? "correct" : "incorrect"
        );
    }
}

function selectAnswer(button, selectedAnswer) {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if (userAnswers[currentQuestionIndex] === null) {
        if (selectedAnswer === correctAnswer) {
            score++;
        }
    } else {
        if (userAnswers[currentQuestionIndex] === correctAnswer && selectedAnswer !== correctAnswer) {
            score--;
        } else if (userAnswers[currentQuestionIndex] !== correctAnswer && selectedAnswer === correctAnswer) {
            score++;
        }
    }

    userAnswers[currentQuestionIndex] = selectedAnswer;

    answerButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctAnswer) {
            btn.classList.add("correct");
        } else if (index === selectedAnswer) {
            btn.classList.add("incorrect");
        }
    });
}

function resetState() {
    answerButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove("correct", "incorrect");
    });
}

function showScore() {
    
    clearInterval(timer);

    // Display the user's score
    questionElement.textContent = `Your score is ${score} out of ${questions.length}.`;
    nextButton.textContent = "Play Again";
    backButton.style.display = "none";
    answerButtons.forEach(button => button.style.display = "none");
}

function handleNextButton() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        submitQuiz();
    }
}

function handleBackButton() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function submitQuiz() {
    console.log("Quiz submitted.");
    showScore();
    clearInterval(timer); 
}

nextButton.addEventListener("click", () => {
    if (nextButton.textContent === "Play Again") {
        startQuiz();
    } else {
        handleNextButton();
    }
});

backButton.addEventListener("click", handleBackButton);

for (let i = 0; i < link.length; i++) {
    link[i].addEventListener("click", (event) => {
        currentQuestionIndex = i;
        showQuestion();
    });
}

startQuiz();
