const app = document.getElementById("app");
const chat = document.getElementById("chat");
const typingLoader = document.getElementById("typing_loader");

const engine = {
  currentChatStage: 0,
  isChecking: true,
  answers: [],
  citizenship: false,
  leadage: "underage",
  under25: {
    text: "Спасибо за желание участвовать в\nпрограмме «Сбербанк Инвестиции»,\nоднако участие в ней могут\nпринимать только граждане РФ,\nдостигшие 25 лет. Хорошего дня!",
  },
  stages: [
    {
      questions: [
        {
          text: `Здравствуйте! Меня зовут Ирина, я Ваш личный помощник в программе «СберИнвестиции». 
          Для Вас только что открылась возможность зарабатывать от 50,000 рублей в неделю  на торговле акциями Сбербанка.`,
        },
        {
          text: `Мои услуги являются бесплатными для Вас, я готов помочь ознакомится с проектом «СберИнвестиции».`,
        },
        {
          text: "Для дальнейшей работы с Вами мне необходимо уточнить некоторую информацию:",
        },
        { text: "Укажите свой возраст:" },
      ],
      options: ["до 21", "22-40", "40-65", "Более 65"],
    },
    {
      questions: [
        {
          text: "Проживаете ли вы на территории Российской Федерации и являетесь ее гражданином?",
        },
      ],
      options: ["да", "нет"],
    },
    {
      questions: [{ text: "Какой уровень дохода вы имеете на данный момент?" }],
      options: [
        "до 10,000 руб",
        "10,000 - 20,000 руб",
        "20,000 - 40,000 руб",
        "больше 40,000 руб",
      ],
    },
    {
      questions: [
        {
          text: "Отлично! В проекте «Сберинвестиции» я Вам помогу увеличить доход минимум в 5 раз!",
        },
        {
          text: "Инвестировали ли вы ранее в ценные бумаги, акции, цифровую валюту?",
        },
      ],
      options: ["да", "нет"],
    },
    {
      questions: [
        {
          text: "Да - Ваш опыт будет полезен и ускорит поможет начать зарабатывать быстрее!",
        },
        { text: "На какую сумму вы хотели бы приобрести акций Сбербанка? " },
      ],
      options: [
        "до 10,000 руб",
        "10,000-15,000 руб",
        "15,000-20,000 руб",
        "более 20,000 руб",
      ],
    },
    {
      questions: [
        {
          text: "Нет - Отсутствие опыта не помешает Вам начать зарабатывать в скорейшем времени!",
        },
        { text: "На какую сумму вы хотели бы приобрести акций Сбербанка? " },
      ],
      options: [
        "до 10,000 руб",
        "10,000-15,000 руб",
        "15,000-20,000 руб",
        "более 20,000 руб",
      ],
    },
    {
      questions: [
        {
          text: "Данная сумма идеальна для старта. С ней Вы уже можете приобрести от 250 акций наших партнеров и заработать с каждой от 350Р за акцию. То есть ваш первоначальный заработок 87 500 рублей, и это только на старте!",
        },
        {
          text: "Сколько времени вы готовы выделить на ознакомление с приложением “Сберинвестиции”?",
        },
      ],
      options: ["пол часа", "час", "два часа", "более двух часов"],
    },
    {
      questions: [
        {
          text: "Чем больше времени вы сможете уделить - тем быстрее вы заработаете свои первые деньги в проекте!",
        },
        {
          text: "В какое время Вам будет удобно пообщаться со мной для ознакомления с приложением и обсуждении всех условий работы в проекте? ",
        },
      ],
      options: [
        "В ближайшее время",
        "в любое время сегодня",
        "в любое время завтра",
      ],
    },
    {
      questions: [
        {
          text: "Благодарю что ответили на все вопросы!",
        },
        {
          text: "Минимальная сумма, которую зарабатывали мои клиенты в “Сберинвестиции” на последней неделе - 45,000 рублей. Я уверен, что при внимательной работе в проекте вы сможете заработать еще больше, чем 76% наших клиентов! Желаю вам быстро освоить программу и получить прибыль с первой акции уже сегодня!",
        },
        {
          text: "Оставьте, пожалуйста, свою контактную информацию в поле ниже для связи с вами. В случае указания неверных данных связь с вами будет невозможна. Перед подтверждением убедитесь что номер телефона введен корректно.",
        },
      ],
      options: "form",
    },
    {
      questions: [
        { text: "Спасибо за регистрацию.\nПожалуйста, ожидайте звонка!" },
      ],
      options: [],
    },
  ],
};

function objectValuesToString(obj) {
  let result = [];

  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      result.push(objectValuesToString(obj[key]));
    } else {
      result.push(obj[key]);
    }
  }
  return result.join(";");
}
function getLastQuestionsText(array) {
  return array
    .map((item) => {
      if (item.questions.length > 0) {
        return item.questions[item.questions.length - 1].text;
      }
    })
    .join(", ");
}

function showTypingLoader() {
  typingLoader.classList.remove("d-none");
}
function hideTypingLoader() {
  typingLoader.classList.add("d-none");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomfloat(min, max) {
  return +(Math.random() * (max - min + 1) + min).toFixed(2);
}
function range(start, stop, step = 1) {
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
}

function getQuestionNode(stageNumber, questionText) {
  const div = document.createElement("div");
  div.classList.add("message-wrapper");
  if (questionText.length <= 28) {
    div.classList.add("row");
  }
  div.dataset.stagereferer = stageNumber;
  div.dataset.messagetype = "question";

  const p = document.createElement("p");
  p.className = "message-text";
  p.textContent = questionText;

  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const timeStamp = `${hours}:${minutes}`;

  const span = document.createElement("span");
  span.className = "timestamp";
  span.textContent = timeStamp;

  div.appendChild(p);
  div.appendChild(span);

  return div;
}
function getOptionsNode(stageNumber, optionsArray, direction) {
  const ul = document.createElement("ul");
  ul.className = `options ${direction}`;
  ul.dataset.stagereferer = stageNumber;
  ul.dataset.messagetype = "optionLists";
  optionsArray.forEach((option, i) => {
    const li = document.createElement("li");
    li.className = "option";
    li.dataset.stagereferer = stageNumber;
    li.dataset.messagetype = "option";
    li.innerHTML = `<a href="#">${option}</a>`;
    li.addEventListener("click", function (e) {
      e.preventDefault();
      if (
        document.querySelector(
          `[data-stagereferer='${stageNumber}'][data-messageType='answer']`
        )
      )
        return;
      engine.answers[`stage${stageNumber}`] = `${option}`;
      setTimeout(() => {
        if (clientAnswer(stageNumber, i + 1)) {
          setTimeout(() => helperAsk(stageNumber + 1), randomfloat(2, 3) * 300);
        } else {
          setTimeout(() => helperAsk(99), randomfloat(2, 3) * 300);
        }
      }, randomfloat(1, 3) * 80);
    });
    ul.appendChild(li);
    app.scrollTop = app.scrollHeight;
  });
  return ul;
}
function getAnswerNode(stageNumber, answerText, isChecking) {
  const div = document.createElement("div");
  div.className = "answer-wrapper";
  div.dataset.stagereferer = stageNumber;
  div.dataset.messagetype = "answer";

  const p = document.createElement("p");
  p.className = "answer-text";
  p.textContent = answerText;
  div.append(p);

  const span = document.createElement("span");
  span.className = `timestamp ${isChecking ? "checked" : ""}`;
  span.textContent =
    String(new Date().getHours()).padStart(2, "0") +
    ":" +
    new Date().getMinutes();
  div.append(span);

  if (isChecking) {
    const img = document.createElement("img");
    img.className = "check-check";
    img.src = "./assets/images/check-check.svg";
    div.append(img);
  }

  return div;
}

function helperAsk(stageNumber) {
  if (stageNumber !== 1) {
    showTypingLoader();
  }
  const typingDelay = stageNumber === 1 ? 0 : randomInt(2000, 4000);

  setTimeout(() => {
    if (stageNumber !== 1) {
      hideTypingLoader();
    }

    if (stageNumber !== 99) {
      stageNumber = ((stageNumber - 1) % engine.stages.length) + 1;
    }

    let questionsList = document.querySelector(
      `[data-stagereferer='${stageNumber}'][data-messagetype='questionsList']`
    );

    if (!questionsList) {
      const list = document.createElement("div");
      list.className = "list-wrapper";
      list.dataset.stagereferer = stageNumber;
      list.dataset.messagetype = "list";

      const img = document.createElement("img");
      img.className = "avatar";
      img.src = "./assets/images/avatar.svg";

      questionsList = document.createElement("div");
      questionsList.className = "question-list";

      list.append(img, questionsList);
      chat.append(list);
    }

    const questions = engine.stages[stageNumber - 1].questions;
    for (const question of questions) {
      questionsList.append(getQuestionNode(stageNumber, question.text));
    }

    app.scrollTop = app.scrollHeight;
    helperGiveOptions(stageNumber);
  }, typingDelay);
}

function helperGiveForm() {
  const form = document.createElement("form");
  form.className = "registrationForm";
  form.id = "registrationForm";
  form.dataset.stageReferer = "8";
  form.dataset.messageType = "option";
  const formContent = `
		<h2 class="form-header">Запоните форму\n для обратной связи</h2>
        <div>
            <label for="firstName">Имя:</label>
            <input type="text" id="firstName" name="firstName" autocomplete="off" />
            <div id="errorFirstName" class="error-msg"></div>
        </div>
        <div>
            <label for="lastName">Фамилия:</label>
            <input type="text" id="lastName" name="lastName" autocomplete="off" />
            <div id="errorLastName" class="error-msg"></div>
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" />
            <div id="errorEmail" class="error-msg"></div>
        </div>
        <div style="width: 100%;">
            <label for="phone">Номер телефона:</label>
            <input type="tel" id="phone" name="phone" placeholder="(912) 345-67-89" style="padding-left: 90px;" autocomplete="off" />
            <div id="errorPhone" class="error-msg"></div>
        </div>
        <button type="submit">Завершить регистрацию</button>`;
  form.innerHTML = formContent;
  chat.append(form);
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (
      document.querySelector(
        `[data-stagereferer='9'][data-messageType='question']`
      )
    ) {
      return;
    }
    helperAsk(9);
  });
  app.scrollTop = app.scrollHeight;
}
function helperGiveOptions(stageNumber, direction = "col") {
  stageNumber = stageNumber % engine.stages.length || engine.stages.length;
  if (stageNumber == 8) {
    helperGiveForm();
    return;
  }
  const options = engine.stages[stageNumber - 1].options;
  if (options.length == 2) direction = "row";
  const optionsNode = getOptionsNode(stageNumber, options, direction);
  chat.append(optionsNode);
  app.scrollTop = app.scrollHeight;
}

function clientAnswer(
  stageNumber,
  answerNumber,
  isChecking = engine.isChecking
) {
  const stageCount = engine.stages.length;
  const safeStageNumber = (stageNumber - 1) % stageCount;

  stageNumber = safeStageNumber + 1;
  answerNumber =
    ((answerNumber - 1) % engine.stages[safeStageNumber].options.length) + 1;

  if (
    document.querySelector(
      `[data-stageReferer="${stageNumber}"][data-messagetype="answer"]`
    )
  ) {
    return false;
  }

  if (stageNumber === 8) {
    return 1;
  }

  const options = engine.stages[safeStageNumber].options;
  const answerNode = getAnswerNode(
    stageNumber,
    options[answerNumber - 1],
    isChecking
  );
  chat.append(answerNode);
  app.scrollTop = app.scrollHeight;

  if (stageNumber === 1) {
    engine.leadage = engine.answers.stage1;
  } else if (stageNumber === 2 && answerNumber === 1) {
    engine.citizenship = true;
  } else if (stageNumber === 4 && answerNumber === 1) {
    engine.stages.splice(5, 1);
  } else if (stageNumber === 4 && answerNumber === 2) {
    engine.stages.splice(4, 1);
  }

  return true;
}

helperAsk(1);
