const inputContainer = document.getElementById('input-container')
const countdownForm = document.getElementById('countdownForm')
const dateElem = document.getElementById('date-picker')

const countdownElem = document.getElementById('countdown')
let countdownTitleElem = document.getElementById('countdown-title')
const countdownBtn = document.getElementById('countdown-button')
const timeElements = document.querySelectorAll('span')

const completeElem = document.getElementById('complete')
const completeInfo = document.getElementById('complete-info')
const completeBtn = document.getElementById('complete-button')

let countdownTitle = ''
let countdownDate = ''
/* Выбранная дата в формате Timestamp  */
let countdownValue = new Date()
let countdownActive
let countdownSaved

/* Значения даты в (мс) */
const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

/* Устанавливаем текущую дату как минимальную для выбора в инпуте */
let today = new Date().toISOString().split('T')[0]
dateElem.setAttribute('min', today)

/* Заполняем счетчик */
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime()
    const distance = countdownValue - now

    /* Переводим оставшееся время в обычный формат  */
    const days = Math.floor(distance / day)
    const hours = Math.floor((distance % day) / hour)
    const minutes = Math.floor((distance % hour) / minute)
    const seconds = Math.floor((distance % minute) / second)

    inputContainer.hidden = true

    /* Если обратный отсчёт закончен, показываем итог */
    if (distance < 0) {
      countdownElem.hidden = true
      clearInterval(countdownActive)
      completeInfo.textContent = `${countdownTitle} завершён ${countdownDate}`
      completeElem.hidden = false
    }
    else {
      /* Иначе показываем текущий обратный отсчёт */
      countdownTitleElem.textContent = `${countdownTitle}`
      timeElements[0].textContent = `${days}`
      timeElements[1].textContent = `${hours}`
      timeElements[2].textContent = `${minutes}`
      timeElements[3].textContent = `${seconds}`
      completeElem.hidden = true
      countdownElem.hidden = false
    }
  }, second)
}

/* Получаем значения из формы */
function updateCountdown(e) {
  e.preventDefault()
  countdownTitle = e.srcElement[0].value
  countdownDate = e.srcElement[1].value
  /* Сохраняем пользовательские данные в LocalStorage */
  countdownSaved = {
    title: countdownTitle,
    date: countdownDate,
  }
  localStorage.setItem('countdown', JSON.stringify(countdownSaved))
  /* Валидация */
  if (countdownDate === '') {
    alert('Пожалуйста, выберите дату для обратного отсчёта')
  } else {
    /* Получаем Timestamp для выбранной даты и обновляем DOM */
    countdownValue = new Date(countdownDate).getTime()
    updateDOM()
  }
}

function reset(e) {
  clearTimeout(countdownActive)
  countdownElem.hidden = true
  completeElem.hidden = true
  inputContainer.hidden = false
  countdownTitle = ''
  countdownDate = ''
  localStorage.removeItem('countdown')
}

function restorePreviousCountdown() {
  /* Получаем данные из LocalStorage, если они есть */
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true
    countdownSaved = JSON.parse(localStorage.getItem('countdown'))
    countdownTitle = countdownSaved.title
    countdownDate = countdownSaved.date
    countdownValue = new Date(countdownDate).getTime()
    updateDOM()
  }
}

countdownForm.addEventListener('submit', updateCountdown)
countdownBtn.addEventListener('click', reset)
completeBtn.addEventListener('click', reset)

restorePreviousCountdown()