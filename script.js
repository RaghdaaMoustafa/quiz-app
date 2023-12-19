let questions = []
let time = 10
let result = 0
let currentQuestion
let timer

const startButton = document.querySelector('.start')
const category = document.querySelector('#category')
const numOfQuestions = document.querySelector('#num-questions')
const difficulty = document.querySelector('#difficulty')
const quizScreen = document.querySelector('.quiz')
const initialScreen = document.querySelector('.initial-screen')
const submitButton = document.querySelector('.submit')
const nextButton = document.querySelector('.next')

const beginQuiz = () => {
  const url = `https://opentdb.com/api.php?amount=${numOfQuestions.value}&category=${category.value}&difficulty=${difficulty.value}&type=multiple`
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results
      console.log(questions)
      initialScreen.classList.add('hide')
      quizScreen.classList.remove('hide')
      console.log(currentQuestion)
      currentQuestion = 1
      showQuestion(questions[0])
    })
}
// event listener on start button
startButton.addEventListener('click', beginQuiz)

const showQuestion = (question) => {
  const questionText = document.querySelector('.question')
  const answersContainer = document.querySelector('.answer-container')
  const questionNumber = document.querySelector('.number')
  questionText.innerHTML = question.question

  // mixing correct and wrong answers
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ]

  // randomizing or shuffling the place of correct answer
  // so that it won't be always at last
  answers.sort(() => Math.random() - 0.5)
  answersContainer.innerHTML = ''
  answers.forEach((answer) => {
    answersContainer.innerHTML += `
    <div class="answer">
    <span class="text">${answer}</span>
    <span class="checkbox">✓</span>
  </div>`
  })
  questionNumber.innerHTML = `Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
  <span class="total">/${questions.length}</span>`

  // event listener on selecting answers
  const allAnswers = document.querySelectorAll('.answer')
  allAnswers.forEach((answer) => {
    answer.addEventListener('click', () => {
      if (!answer.classList.contains('checked')) {
        allAnswers.forEach((answer) => {
          answer.classList.remove('selected')
        })
        answer.classList.add('selected')
        submitButton.disabled = false
      }
    })
  })
}
submitButton.addEventListener('click', () => {
  answerChecker()
  console.log('[current in submit]', currentQuestion)
  console.log('[questions in submit]', questions.length)
  console.log('[questions in submit]', questions.length)
})

const answerChecker = () => {
  const selectedAnswer = document.querySelector('.answer.selected')
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector('.text').innerHTML
    console.log(currentQuestion)
    if (answer === questions[currentQuestion - 1].correct_answer) {
      // increase result if answer matched withh the question's correct answer
      result++
      // add right class on selected
      selectedAnswer.classList.add('right')
    } else {
      // if wrong answer is slected add wrong class on selected
      // and right class on the right answer
      const correctAnswer = document
        .querySelectorAll('.answer')
        .forEach((answer) => {
          if (
            answer.querySelector('.text').innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            answer.classList.add('right')
          }
        })
      selectedAnswer.classList.add('wrong')
    }
  }

  const allAnswers = document.querySelectorAll('.answer')
  allAnswers.forEach((answer) => {
    answer.classList.add('checked')
  })
  submitButton.style.display = 'none'
  nextButton.style.display = 'block'
}
// next button event listener
nextButton.addEventListener('click', () => {
  nextQuestion()
  submitButton.style.display = 'block'
  nextButton.style.display = 'none'
})
const nextQuestion = () => {
  // if questions is not finished
  console.log('[current in next]', currentQuestion)
  console.log('[questions in next]', questions.length)
  if (currentQuestion < questions.length) {
    currentQuestion++
    showQuestion(questions[currentQuestion - 1])
  } else {
    showResult()
  }
}

const finalScreen = document.querySelector('.final-screen')
const finalResult = document.querySelector('.final-result')
const totalResult = document.querySelector('.total-result')
const showResult = () => {
  finalScreen.classList.remove('hide')
  quizScreen.classList.add('hide')
  finalResult.innerHTML = result
  totalResult.innerHTML = `/${questions.length}`
  const average = result / questions.length
  if (average >= 0.5) {
    document.getElementById('winner').style.display = 'block'
    document.getElementById('loser').style.display = 'none'
  } else {
    document.getElementById('winner').style.display = 'none'
    document.getElementById('loser').style.display = 'block'
  }
}

const reattemptButton = document.querySelector('.restart')
reattemptButton.addEventListener('click', () => {
  // reload page
  window.location.reload()
})
