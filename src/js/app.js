'use strict'
                    /////////  коли наш DOM  завантажений
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');          /// для перехоплення відправки форми при нажимані кнопки
    form.addEventListener('submit', formSend);              /// вішаємо подію на цю зміну

    async function formSend(e) {
       e.preventDefault();

       let error = formValidate(form);
         //отримую дані форм
       let formData = new FormData(form);                    // отримує за допомогою FormData витягую всі дані полей
       formData.append('image', formImage[0]);               // додається ще formData  зображення
          
        if(error === 0) {
            form.classList.add('_sending');                  
            let response = await fetch('sendmail.php', {       // відправка форми AJAX методом fetch 
            method: 'POST',
            body: formData
            });
          // отримати відповідь вдала відправка чи ні, файл sendmail.php буде нам повертати деякий json відповідь
            if(response.ok) {
                let result = await response.json();
                alert(result.message);
                formPreview.innerHTML = '';               // очистка форми після відправки 
                form.reser();                             //   очищення всіх полів форми
                form.classList.remove('_sending');        // видалення класу
            } else {
                alert('error');
                form.classList.remove('_sending');   
            }
        } else {
            alert('please fill in the fields')
        }

    };

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req')              //// required обов'язове поле
        
        for (let index = 0; index < formReq.length; index++) {        ///// отримання всіх необхідних інпутів для валідації
            const input = formReq[index];
            formRemoveError(input);                                   // при перевірці прибираємо клас _error 
            
            if(input.classList.contains('_email')) {                  // перевіряємо _email, прив'язалися до класу
               if(emailTest(input)) {                                 // якщо тест не пройшов - додаємо класс _error 
                formAddError(input);  
                error++;                                              //  збільшуємо на одиницю нашу переміну error інкремент
               }
            } else if(input.getAttribute('type') === 'checkbox' && input.checked === false) {       // перевірка наявністі checkbox, якщо він є робити перевірки
                formAddError(input);                                                                // перевіряємо на тип і також якщо цей checkbox не включений
                error++;   
            } else {
                if(input.value === '') {                              // заповнене поле загалом, якщо порожня вішаємо _error
                    formAddError(input);                                                                
                    error++;   
                }                            
            }
        }
        return error;
    }
                                                                      /// 2 допоміжні функції formAddError,formRemoveError додають самому об'єкту клас  _error
    function formAddError(input) {
        input.parentElement.classList.add('_error');                  // додає батьківському
        input.classList.add('_error');                                //  додає самому об'єкту
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');               // віднімає батьківському
        input.classList.remove('_error');                             // віднімає  самого об'єкта
    }

    // функція теста емейла перевіряє на відповідність(собачка, кількість символів і т.д.)
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }
    
    //для FILE , отримуємо імпут в зміну
    const formImage = document.getElementById('formImage');
    // отримуємо дів для прев'ю в зміну 
    const formPreview = document.getElementById('formPreview');

    // прослуховуємо зміну в импуті FILE, для самого об'єкта вибору файла додаємо подію change, 
    //тобто коли буду обирати файл буде спрацьовувати ця подія і буде відправляти в функцію upLoadFile 
    //і передавати туди файл який обраний 
    formImage.addEventListener('change', () => {
        upLoadFile(formImage.files[0]);
    }) 

    function upLoadFile(file) {
        //перевіряю тип файлу
        if(!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert('only images are allowed');
            formImage.value = '';
            return;
        }
        //перевіряю розмір файлу(2 мб)
        if(file.size > 2 * 1024 * 1024) {
            alert('file must be < 2');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {                                                // коли файл вдало завантажений, 
            formPreview.innerHTML = `<img src="${e.target.result}" alt="foto">`      // формується зображення і розміщеємо всередину div
        }
        reader.onerror = function(e) {                                              //якщо буде помилка отримаємо повідомлення
            alert('error')
        };
        reader.readAsDataURL(file);                                                  //прожовжуємо роботу
    }

});
