// TODO(you): Write the JavaScript necessary to complete the assignment.
let attemptId;

const body = document.querySelector("body");

// DOM SCREEN
const introductionScreen = document.querySelector("#introduction");
const attemptScreen = document.querySelector("#attempt-quiz");
const reviewScreen = document.querySelector("#review-quiz");

// DOM BUTTON START
const startButton = document.querySelector("#btn-start");

// DOM POPUP
const popup = document.querySelector("#popup");

// DOM BUTTON
const noButton = document.querySelector(".no");
const yesButton = document.querySelector(".yes");
const tryAgainButton = document.querySelector("#btn-try-again");

// DOM
const submitButton = document.querySelector("#btn-submit");

const reviewQuizContainer = document.querySelector(".review-quiz-container");

function attemptQuestion() {
  const attemptQuestion = document.querySelector(".attempt-quiz-questions");
  // const APIAttempt = "";
  // const takeData = {
 
  // };
  fetch('http://localhost:3000/attempts', {
    method: "POST"
    // headers: {
    //   "Content-Type": "application/json"
    // }
  })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log(json);
      attemptId = json._id;
      const questionArray = json.questions;
      questionArray.forEach((question, index) => {
        const attemptQuestionContainer = document.createElement("div");
        attemptQuestionContainer.classList.add("attempt-question-container");

        const attemptH2 = document.createElement("h2");
        attemptH2.classList.add("question-index");
        attemptH2.textContent = `Question ${index + 1} of ${
          questionArray.length
        }`;
        const attemptQuestionText = document.createElement("div");
        attemptQuestionText.classList.add("question-text");
        attemptQuestionText.textContent = question.text;

        const attemptForm = document.createElement("form");
        attemptForm.classList.add("attempt-form");
        attemptForm.id = question._id;

        const arrayAnswer = question.answers;
        arrayAnswer.forEach((answer, index2) => {
          const attemptLabel = document.createElement("label");
          attemptLabel.classList.add("attempt-option");

          const attemptInput = document.createElement("input");
          attemptInput.type = "radio";
          attemptInput.name = question._id;
          attemptInput.value = index2;

          const attemptPContainer = document.createElement("p");
          attemptPContainer.textContent = answer;
          attemptPContainer.classList.add("attempt-answer");

          attemptLabel.appendChild(attemptInput);
          attemptLabel.appendChild(attemptPContainer);

          attemptForm.appendChild(attemptLabel);
        });

        let attemptOptions = attemptForm.querySelectorAll(".attempt-option");
        for (let attemptOption of attemptOptions) {
          attemptOption.addEventListener("click", (e) => {
            let attemptSelectedOption = attemptForm.querySelector(".option-selected");
            if (attemptSelectedOption) {
              attemptSelectedOption.classList.remove("option-selected");
            }
            e.currentTarget.classList.add("option-selected");
          });
        }
        attemptQuestionContainer.appendChild(attemptH2);
        attemptQuestionContainer.appendChild(attemptQuestionText);
        attemptQuestionContainer.appendChild(attemptForm);

        attemptQuestion.appendChild(attemptQuestionContainer);
      });
    });
}


attemptQuestion();
function handleStartQuiz() {
  introductionScreen.classList.add("hidden");
  attemptScreen.classList.remove("hidden");
  scrollScreen();
}

startButton.addEventListener("click", handleStartQuiz);

function handleClosePopup() {
  hidePopup();
}
noButton.addEventListener("click", handleClosePopup);

function scrollScreen() {
  body.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "start",
  });
}

function showPopUp() {
  popup.classList.remove("hidden");
}
function hidePopup() {
  popup.classList.add("hidden");
}

function handleSubmitButton() {
  showPopUp();
}
submitButton.addEventListener("click", handleSubmitButton);

function handleYesButton() {
  hidePopup();
  handleYesEvent();

  const data = {
    userAnswers: {},
  };
  const attemptForm = document.querySelectorAll(".attempt-form");
  attemptForm.forEach((answer) => {
    const attemptSelectedAnswer = answer.querySelector(
      'input[type="radio"]:checked'
    );
    console.log(attemptSelectedAnswer);
    if (attemptSelectedAnswer) {
      data.userAnswers[attemptSelectedAnswer.name] =
        attemptSelectedAnswer.value;
    }
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  console.log(JSON.stringify(data));
  fetch(
    `http://localhost:3000/attempts/${attemptId}/submit`,
    options
  )
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      // const attemptQuestionsAPI = json.questions;
      // const attemptAnswerAPI = json.userAnswers || {};
      // const attemptCorrectAnswerAPI = json.correctAnswers;
      // reviewHandleLogic(
      //   attemptQuestionsAPI,
      //   reviewQuizContainer,
      //   attemptAnswerAPI,
      //   attemptCorrectAnswerAPI
      // );

      // function reviewHandleLogic(
      //   questionsArray,
      //   divContainer,
      //   answersArray,
      //   correctAnswerArray
      // ) {
      const questionsArray = json.questions;
      const answersArray = json.userAnswers || {};
      const correctAnswerArray = json.correctAnswers;

      questionsArray.forEach((question, index) => {
        const reviewQuestionContainer = document.createElement("div");
        reviewQuestionContainer.classList.add("review-question-container");

        const reviewH2 = document.createElement("h2");
        reviewH2.classList.add("question-index");
        reviewH2.textContent = `Question ${index + 1} of ${
          questionsArray.length
        }`;

        const reviewQuestionText = document.createElement("p");
        reviewQuestionText.classList.add("question-text");
        reviewQuestionText.textContent = question.text;

        const reviewForm = document.createElement("form");
        reviewForm.classList.add("review-form");
        reviewForm.id = question._id;

        const reviewAnswerText = question.answers;

        reviewAnswerText.forEach((answer, innerIndex) => {
          const reviewLabel = document.createElement("label");
          reviewLabel.classList.add("review-option");

          const reviewInput = document.createElement("input");
          reviewInput.type = "radio";
          reviewInput.name = question._id;
          reviewInput.value = innerIndex;
          reviewInput.disabled = true;

          if (
            question._id in answersArray &&
            innerIndex == answersArray[question._id]
          ) {
            if (innerIndex == correctAnswerArray[question._id]) {
              reviewLabel.classList.add("correct-answer");
            } else {
              reviewLabel.classList.add("wrong-answer");
            }
          } else if (innerIndex == correctAnswerArray[question._id]) {
            reviewLabel.classList.add("option-correct");
          }

          const reviewPContainer = document.createElement("p");
          reviewPContainer.textContent = answer;

          reviewLabel.appendChild(reviewInput);
          reviewLabel.appendChild(reviewPContainer);
          reviewForm.appendChild(reviewLabel);
        });
        reviewQuestionContainer.appendChild(reviewH2);
        reviewQuestionContainer.appendChild(reviewQuestionText);
        reviewQuestionContainer.appendChild(reviewForm);

        reviewQuizContainer.appendChild(reviewQuestionContainer);
      });
      // }

      // REPRESENT MARK
      let resultScore = document.querySelector("#result-score");
      let resultByPercentage = document.querySelector("#result-by-percentage");
      let resultByText = document.querySelector("#result-by-text");
      resultScore.textContent = `${json.score}/10`;
      resultByPercentage.textContent = `${json.score * 10}%`;
      resultByText.textContent = json.scoreText;
    });
}

function handleYesEvent() {
  attemptScreen.classList.add("hidden");
  reviewScreen.classList.remove("hidden");
}
yesButton.addEventListener("click", handleYesButton);

function handleTryAgainButton() {
  scrollScreen();
  handleEventTryAgain();
  location.reload();
}
function handleEventTryAgain() {
  introductionScreen.classList.remove("hidden");
  attemptScreen.classList.add("hidden");
  reviewScreen.classList.add("hidden");
}
tryAgainButton.addEventListener("click", handleTryAgainButton);

function uncheckedOption() {
  const checkedOptions = document.querySelectorAll(
    'input[type="radio"]:checked'
  );
  checkedOptions.forEach((checked) => {
    checked.checked = false;
  });
}

function unselectedOption() {
  const selectedOptions = document.querySelectorAll("option-selected");
  selectedOptions.forEach((selected) => {
    selected.classList.remove("option-selected");
  });
}

function refreshQuestion() {
  uncheckedOption();
  unselectedOption();
}
