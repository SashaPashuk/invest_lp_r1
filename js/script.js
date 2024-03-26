// Функция инициализации, когда форма появляется
function initializeForm() {
  console.log("Form Activatiojn");
  var intlTelInputOptions = {
    initialCountry: "ru",
    geoIpLookup: (callback) => {
      fetch("https://ipapi.co/json")
        .then((res) => res.json())
        .then((data) => callback(data.country_code))
        .catch(() => callback("us"));
    },
    separateDialCode: true,
    formatOnDisplay: true,
    autoPlaceholder: "off",
    placeholderNumberType: "MOBILE",
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.3.3/js/utils.js",
  };

  var phoneInput = intlTelInput(
    document.querySelector("#phone"),
    intlTelInputOptions
  );
  function getErrorMessage(errorCode) {
    switch (errorCode) {
      case intlTelInputUtils.validationError.IS_POSSIBLE:
        return "Номер возможно существует, но некорректен.";
      case intlTelInputUtils.validationError.INVALID_COUNTRY_CODE:
        return "Неверный код страны.";
      case intlTelInputUtils.validationError.TOO_SHORT:
        return "Слишком короткий номер.";
      case intlTelInputUtils.validationError.TOO_LONG:
        return "Слишком длинный номер.";
      case intlTelInputUtils.validationError.NOT_A_NUMBER:
        return "Номер должен содержать только цифры.";
      default:
        return "Некорректный номер телефона.";
    }
  }

  // Изначально блокируем и делаем кнопку полупрозрачной
  $("#registrationForm button[type=submit]")
    .prop("disabled", true)
    .css("opacity", "0.5");

  $("#firstName, #lastName, #email, #phone").on("input", function () {
    validateField(this);
    toggleSubmitButton();
  });

  $("#firstName, #lastName, #email, #phone").on("change", function () {
    validateField(this);
    toggleSubmitButton();
  });

  function validateField(input) {
    var field = $(input);
    var fieldId = field.attr("id");

    switch (fieldId) {
      case "firstName":
      case "lastName":
        validateName(field, fieldId === "firstName" ? "Имя" : "Фамилия");
        break;
      case "email":
        validateEmail(field);
        break;
      case "phone":
        validatePhone(field);
        break;
    }
  }

  function validateName($input, nameType) {
    var nameRegex = /^[а-яА-ЯёЁa-zA-Z\s]+$/; // Разрешаем пробелы в регулярном выражении
    var minLength = 2;
    var $error = $("#error" + capitalizeFirstLetter($input.attr("id")));
    var spaceCount = ($input.val().match(/\s/g) || []).length; // Подсчет количества пробелов

    if ($input.val().length < minLength) {
      $error.text(`${nameType} должно содержать минимум ${minLength} буквы.`);
      $input.removeClass("valid").addClass("invalid");
    } else if (!$input.val().match(nameRegex) || spaceCount > 3) {
      // Проверяем на соответствие регулярному выражению и количеству пробелов
      $error.text(
        `В поле ${nameType} допустимы только буквы и не более трех пробелов.`
      );
      $input.removeClass("valid").addClass("invalid");
    } else {
      $error.text("");
      $input.removeClass("invalid").addClass("valid");
    }
  }

  function validateEmail($input) {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    var $error = $("#errorEmail");
    if ($input.val().length === 0 || !$input.val().match(emailRegex)) {
      $error.text("Введите корректную почту.");
      $input.removeClass("valid").addClass("invalid");
    } else {
      mailcheckValidation($input);
    }
  }

  function mailcheckValidation($input) {
    Mailcheck.run({
      email: $input.val(),
      suggested: function (suggestion) {
        var suggestionElement = $("<span class='suggestion'>").text(
          suggestion.full
        );
        suggestionElement.on("click", function () {
          $input.val(suggestion.full).removeClass("invalid").addClass("valid");
          $("#errorEmail").text("");
        });
        $("#errorEmail")
          .html("Возможно вы имели в виду: ")
          .append(suggestionElement)
          .append("?");
        $input.removeClass("valid").addClass("invalid");
      },
      empty: function () {
        $("#errorEmail").text("");
        $input.removeClass("invalid").addClass("valid");
      },
    });
  }

  function validatePhone($input) {
    var phoneRegex = /^[0-9()+\-\s]+$/; // Разрешены только цифры, скобки, дефисы и пробелы
    var $error = $("#errorPhone");
    var selectedCountryData = phoneInput.getSelectedCountryData(); // Получение данных о выбранной стране

    if (
      selectedCountryData.iso2 !== "ru" ||
      !phoneInput.isValidNumber() ||
      !$input.val().match(phoneRegex)
    ) {
      var errorCode = phoneInput.getValidationError();
      var errorMessage = getErrorMessage(errorCode);
      $error.text(errorMessage); // Отображение сообщения об ошибке на русском
      $input.addClass("invalid").removeClass("valid");
    } else {
      $error.text("");
      $input.removeClass("invalid").addClass("valid");
    }
    toggleSubmitButton(); // Обновление состояния кнопки отправки формы
  }

  function toggleSubmitButton() {
    var isFormValid =
      $("#firstName").hasClass("valid") &&
      $("#lastName").hasClass("valid") &&
      $("#email").hasClass("valid") &&
      $("#phone").hasClass("valid");

    $("#registrationForm button[type=submit]")
      .prop("disabled", !isFormValid)
      .css("opacity", isFormValid ? "1" : "0.5");
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function preparePhoneNumber(phoneNumber) {
    // Удаление начальных символов +7, если они есть
    var cleanNumber = phoneNumber.startsWith("+7")
      ? phoneNumber.slice(2)
      : phoneNumber;

    // Удаление скобок, дефисов и пробелов
    return cleanNumber.replace(/[()+\-\s]/g, "");
  }

  $("#registrationForm").on("submit", function (e) {
    e.preventDefault();

    // Проведение валидации для каждого поля
    validateName($("#firstName"), "Имя");
    validateName($("#lastName"), "Фамилия");
    validateEmail($("#email"));
    validatePhone($("#phone"));

    // Проверка, что все поля валидны
    if (
      $("#firstName").hasClass("valid") &&
      $("#lastName").hasClass("valid") &&
      $("#email").hasClass("valid") &&
      $("#phone").hasClass("valid")
    ) {
      // Получение данных о выбранной стране
      var selectedCountryData = phoneInput.getSelectedCountryData();

      // Формирование полного номера телефона с кодом страны
      var fullPhoneNumber =
        "+" +
        selectedCountryData.dialCode +
        preparePhoneNumber($("#phone").val());

      const payLoad = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        email: $("#email").val(),
        phoneNumber: fullPhoneNumber,
        landing: php_var.landing_name,
        slug: "334",
        buyer: php_var.rule_name,
        source: php_var.traffic_source_name,
        campaing_id: php_var.campaing_id,
        subid: php_var.sub1,
        citizenship: engine.citizenship,
        leadage: engine.leadage,
        questions: getLastQuestionsText(engine.stages.slice(0, -2)),
        answers: objectValuesToString(engine.answers),
      };

      const formData = new FormData();
      for (const key in payLoad) {
        formData.append(key, payLoad[key]);
      }
      // AJAX запрос
      $.ajax({
        url: "../action.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        beforeSend: function () {
          $(".pageloader").show();
          $("#registrationForm button[type=submit]")
            .prop("disabled", true)
            .css("opacity", "0.5");
        },
        success: function (response) {
          if (response.status === "success") {
            if (response.autologin_url) {
              localStorage.setItem("autologin_url", response.autologin_url);
            }
            bge_ec_register();
            localStorage.setItem("thanks", true);
            toastr.success("Вы успешно зарегистрированы!");
            window.location.href = "thanks.html";
          } else {
            if (response.status === "error") {
              window.location.href = "thanks.html";
              //toastr.error(response.message, "Error!");
            } else {
              $(".pageloader").hide();
              $("#registrationForm button[type=submit]")
                .prop("disabled", true)
                .css("opacity", "0.5");
              // toastr.error("Unknown error", "Error!");
              window.location.href = "thanks.html";
            }
          }
        },
        error: function (xhr, status, error) {
          $("#registrationForm button[type=submit]")
            .prop("disabled", true)
            .css("opacity", "0.5");
          // toastr.error("Произошла ошибка, повторите попытку позже!", "Ошибка");
          window.location.href = "thanks.html";
        },
      });
      // ...
    } else {
      $(".pageloader").hide();
      $("#registrationForm button[type=submit]")
        .prop("disabled", true)
        .css("opacity", "0.5");
      alert("Пожалуйста, заполните все поля корректно.");
    }
  });
}

// Создание наблюдателя
var isFormInitialized = false;

var observer = new MutationObserver(function (mutations) {
  if (!isFormInitialized && document.getElementById("registrationForm")) {
    initializeForm();
    isFormInitialized = true;
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
