'use strict';

// Navegación simple: cada botón muestra una sección y oculta las demás.
const viewNames = ['inicio', 'reglas', 'posiciones', 'tecnicas', 'evaluacion'];

function showView(name) {
  if (!viewNames.includes(name)) return;
  document.querySelectorAll('.view').forEach((view) => {
    const isCurrent = view.id === `view-${name}`;
    view.classList.toggle('active', isCurrent);
    view.hidden = !isCurrent;
  });
  if (name === 'evaluacion' && !quizStarted) resetQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.go));
});

// Técnicas: al seleccionar un botón, se actualiza el texto explicativo.
const techniques = [
  { name: 'Saque', description: 'Pone la pelota en juego desde detrás de la línea de fondo.' },
  { name: 'Recepción', description: 'Controla el saque rival, generalmente con golpe de antebrazos.' },
  { name: 'Armado', description: 'Prepara la pelota para que un compañero pueda atacar.' },
  { name: 'Remate', description: 'Es un golpe de ataque para enviar la pelota al campo contrario.' },
  { name: 'Bloqueo', description: 'Es una acción cerca de la red para frenar o desviar el ataque rival.' },
  { name: 'Defensa', description: 'Busca evitar que la pelota toque el suelo del propio campo.' }
];

document.querySelectorAll('[data-technique]').forEach((button) => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.technique);
    const technique = techniques[index];
    if (!technique) return;
    document.querySelectorAll('[data-technique]').forEach((item) => item.classList.toggle('selected', item === button));
    document.getElementById('tech-number').textContent = `TÉCNICA 0${index + 1}`;
    document.getElementById('tech-name').textContent = technique.name;
    document.getElementById('tech-description').textContent = technique.description;
  });
});

// Evaluación de cinco preguntas: cada acierto suma 20 puntos.
const questions = [
  {
    text: '¿Cuántos jugadores de cada equipo están en la cancha?',
    answers: ['5 jugadores', '6 jugadores', '7 jugadores', '8 jugadores'],
    correct: 1,
    explanation: 'En el juego participan seis jugadores por equipo.'
  },
  {
    text: '¿A cuántos puntos se juega un set normal?',
    answers: ['15 puntos', '20 puntos', '25 puntos', '30 puntos'],
    correct: 2,
    explanation: 'Los primeros cuatro sets se juegan a 25 puntos y se debe ganar por una diferencia mínima de dos.'
  },
  {
    text: '¿Cuántos puntos se juegan en el quinto set decisivo?',
    answers: ['10 puntos', '15 puntos', '20 puntos', '25 puntos'],
    correct: 1,
    explanation: 'El quinto set se juega a 15 puntos, siempre con una diferencia mínima de dos.'
  },
  {
    text: '¿Cuántos toques puede realizar como máximo un equipo para devolver la pelota, sin contar el bloqueo?',
    answers: ['1 toque', '2 toques', '3 toques', '4 toques'],
    correct: 2,
    explanation: 'Cada equipo dispone de hasta tres toques. El contacto del bloqueo no cuenta dentro de ese límite.'
  },
  {
    text: '¿Qué está permitido al tocar la pelota?',
    answers: ['Agarrarla y lanzarla', 'Retenerla unos segundos', 'Tocarla con cualquier parte del cuerpo', 'Acompañarla con las manos'],
    correct: 2,
    explanation: 'La pelota puede tocar cualquier parte del cuerpo, pero no puede ser retenida, acompañada ni conducida.'
  }
];

let questionIndex = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let quizStarted = false;

const questionText = document.getElementById('question-text');
const answerList = document.getElementById('answer-list');
const nextButton = document.getElementById('next-question');
const feedback = document.getElementById('feedback');
const quizCard = document.getElementById('quiz-card');
const quizResult = document.getElementById('quiz-result');

function resetQuiz() {
  questionIndex = 0;
  score = 0;
  selectedAnswer = null;
  answered = false;
  quizStarted = true;
  quizCard.hidden = false;
  quizResult.hidden = true;
  renderQuestion();
}

function renderQuestion() {
  const question = questions[questionIndex];
  selectedAnswer = null;
  answered = false;
  document.getElementById('question-counter').textContent = `PREGUNTA ${questionIndex + 1} DE ${questions.length}`;
  document.getElementById('question-points').textContent = '20 PUNTOS';
  document.getElementById('quiz-progress').style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  document.getElementById('score-live').textContent = `Puntaje: ${score}`;
  questionText.textContent = question.text;
  answerList.replaceChildren();
  feedback.hidden = true;
  feedback.className = 'feedback';
  question.answers.forEach((answer, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'answer-option';
    option.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    option.querySelector('span:last-child').textContent = answer;
    option.addEventListener('click', () => {
      if (answered) return;
      selectedAnswer = index;
      document.querySelectorAll('.answer-option').forEach((item) => item.classList.toggle('chosen', item === option));
      nextButton.disabled = false;
      nextButton.textContent = 'Comprobar respuesta';
    });
    answerList.append(option);
  });
  nextButton.disabled = true;
  nextButton.textContent = 'Comprobar respuesta';
}

nextButton.addEventListener('click', () => {
  if (!answered) {
    if (selectedAnswer === null) return;
    const question = questions[questionIndex];
    const isCorrect = selectedAnswer === question.correct;
    answered = true;
    if (isCorrect) score += 20;
    document.querySelectorAll('.answer-option').forEach((option, index) => {
      option.disabled = true;
      if (index === question.correct) option.classList.add('correct');
      else if (index === selectedAnswer) option.classList.add('wrong');
    });
    feedback.textContent = `${isCorrect ? '¡Correcto!' : 'No es correcto.'} ${question.explanation}`;
    feedback.classList.add(isCorrect ? 'good' : 'bad');
    feedback.hidden = false;
    document.getElementById('score-live').textContent = `Puntaje: ${score}`;
    nextButton.textContent = questionIndex === questions.length - 1 ? 'Ver resultado' : 'Siguiente pregunta';
    return;
  }
  if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
  } else {
    quizCard.hidden = true;
    quizResult.hidden = false;
    document.getElementById('final-score').textContent = score;
    document.getElementById('result-message').textContent = score === 100 ? '¡Excelente! Respondiste correctamente todas las preguntas.' : score >= 60 ? '¡Buen trabajo! Podés repasar los contenidos y volver a intentarlo.' : 'Seguí repasando las secciones y volvé a intentarlo.';
  }
});

document.getElementById('retry-quiz').addEventListener('click', resetQuiz);

// La página siempre comienza en el menú principal.
showView('inicio');
