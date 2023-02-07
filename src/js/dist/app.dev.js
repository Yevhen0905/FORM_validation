'use strict'; /////////  коли наш DOM  завантажений

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('form'); /// для перехоплення відправки форми при нажимані кнопки

  form.addEventListener('submit', formSend); /// вішаємо подію на цю зміну

  function formSend(e) {
    var error, formData, response, result;
    return regeneratorRuntime.async(function formSend$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            error = formValidate(form); //отримую дані форм

            formData = new FormData(form); // отримує за допомогою FormData витягую всі дані полей

            formData.append('image', formImage[0]); // додається ще formData  зображення

            if (!(error === 0)) {
              _context.next = 23;
              break;
            }

            form.classList.add('_sending');
            _context.next = 8;
            return regeneratorRuntime.awrap(fetch('sendmail.php', {
              // відправка форми AJAX методом fetch 
              method: 'POST',
              body: formData
            }));

          case 8:
            response = _context.sent;

            if (!response.ok) {
              _context.next = 19;
              break;
            }

            _context.next = 12;
            return regeneratorRuntime.awrap(response.json());

          case 12:
            result = _context.sent;
            alert(result.message);
            formPreview.innerHTML = ''; // очистка форми після відправки 

            form.reser(); //   очищення всіх полів форми

            form.classList.remove('_sending'); // видалення класу

            _context.next = 21;
            break;

          case 19:
            alert('error');
            form.classList.remove('_sending');

          case 21:
            _context.next = 24;
            break;

          case 23:
            alert('please fill in the fields');

          case 24:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  ;

  function formValidate(form) {
    var error = 0;
    var formReq = document.querySelectorAll('._req'); //// required обов'язове поле

    for (var index = 0; index < formReq.length; index++) {
      ///// отримання всіх необхідних інпутів для валідації
      var input = formReq[index];
      formRemoveError(input); // при перевірці прибираємо клас _error 

      if (input.classList.contains('_email')) {
        // перевіряємо _email, прив'язалися до класу
        if (emailTest(input)) {
          // якщо тест не пройшов - додаємо класс _error 
          formAddError(input);
          error++; //  збільшуємо на одиницю нашу переміну error інкремент
        }
      } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
        // перевірка наявністі checkbox, якщо він є робити перевірки
        formAddError(input); // перевіряємо на тип і також якщо цей checkbox не включений

        error++;
      } else {
        if (input.value === '') {
          // заповнене поле загалом, якщо порожня вішаємо _error
          formAddError(input);
          error++;
        }
      }
    }

    return error;
  } /// 2 допоміжні функції formAddError,formRemoveError додають самому об'єкту клас  _error


  function formAddError(input) {
    input.parentElement.classList.add('_error'); // додає батьківському

    input.classList.add('_error'); //  додає самому об'єкту
  }

  function formRemoveError(input) {
    input.parentElement.classList.remove('_error'); // віднімає батьківському

    input.classList.remove('_error'); // віднімає  самого об'єкта
  } // функція теста емейла перевіряє на відповідність(собачка, кількість символів і т.д.)


  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  } //для FILE , отримуємо імпут в зміну


  var formImage = document.getElementById('formImage'); // отримуємо дів для прев'ю в зміну 

  var formPreview = document.getElementById('formPreview'); // прослуховуємо зміну в импуті FILE, для самого об'єкта вибору файла додаємо подію change, 
  //тобто коли буду обирати файл буде спрацьовувати ця подія і буде відправляти в функцію upLoadFile 
  //і передавати туди файл який обраний 

  formImage.addEventListener('change', function () {
    upLoadFile(formImage.files[0]);
  });

  function upLoadFile(file) {
    //перевіряю тип файлу
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('only images are allowed');
      formImage.value = '';
      return;
    } //перевіряю розмір файлу(2 мб)


    if (file.size > 2 * 1024 * 1024) {
      alert('file must be < 2');
      return;
    }

    var reader = new FileReader();

    reader.onload = function (e) {
      // коли файл вдало завантажений, 
      formPreview.innerHTML = "<img src=\"".concat(e.target.result, "\" alt=\"foto\">"); // формується зображення і розміщеємо всередину div
    };

    reader.onerror = function (e) {
      //якщо буде помилка отримаємо повідомлення
      alert('error');
    };

    reader.readAsDataURL(file); //прожовжуємо роботу
  }
});