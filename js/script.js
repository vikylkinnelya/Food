'use strict';

window.addEventListener('DOMContentLoaded', () => {

    //скрыть ненужные табы
    //показать нужный таб
    //создать обработчик событий, который будет манипулировать функциями

    const tabs = document.querySelectorAll('.tabheader__item'), //те три стиля питания
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items'); //родитель для последующего делегирования событий

    function hideTabContent() {
        tabsContent.forEach(tab => {
            tab.classList.add('hide');
            tab.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active'); //удаляем класс активности
        });
    }

    function showTabContent(i = 0) { //по умолчанию 0
        tabsContent[i].classList.add('show', 'fade'); //показать 
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('tabheader__item_active'); //добавляем класс активности, чтобы показывалось
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (ev) => { //обертка со всеми табами делегир одинаковое событие от клика на все
        const target = ev.target;
        if (target && target.classList.contains('tabheader__item')) { //ищем таб
            tabs.forEach((el, idx) => { //перебрать все табы
                if (target == el) { //сравнить табы с искомым
                    hideTabContent(); //скрыть старые табы
                    showTabContent(idx); //открыть новый искомый
                }
            });
        }
    });


    //функция устан таймер
    //определтя разницу во времени, дедлайн
    //вычислить время
    //найти разницу
    //обновление таймера

    const deadline = '2020-12-31';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - new Date(),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`; //добавляется 0 если число однозначное
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector), //вводится при вызове функции
            days = timer.querySelector('#days'), // # for searching айди
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock(); //для того, чтобы часы обновлялись сразу после обновления странцы без перескока

        function updateClock() {
            const t = getTimeRemaining(endtime); //обьект со всеми временами 
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            stopClock();

            function stopClock() {
                if (t.total <= 0) { //если сегодняшняя дата больше дедлайна
                    clearInterval(timeInterval); //интервал очищается дедлайн не считается
                }
            }
        }
    }
    setClock('.timer', deadline);

    //modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(el => {
        el.addEventListener('click', modalOpen);
    });

    function modalOpen() {
        modal.classList.add('show');
        modal.classList.remove('hide');

        //modal.classList.toggle('show'); //если нет добавляем

        //modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; //экран за модальным окном не прокручивается
        clearInterval(modalTimerId); //после модала он не открывается еще раз
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');

        //modal.classList.toggle('show'); //если есть убираем

        //modal.style.display = 'none';
        document.body.style.overflow = ''; //вернуть прокрутку при закрытии модальног окна
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            //при клике на подложку или на крестик закрывается
            closeModal();
        }
    });

    document.addEventListener('keydown', (ev) => { //при нажатии на клавиатуру
        if (ev.code === 'Escape' && modal.style.display == 'block') {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(modalOpen, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight == document.documentElement.scrollHeight) {
            modalOpen();
            removeEventListener('scroll', showModalByScroll); //после открытия один раз это событие удалыетс
        }
    }
    //window.pageYOffset сколько пролистал 
    //document.documentElement.clientHeight видимая часть для клиента

    window.addEventListener('scroll', showModalByScroll);

    class FoodCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAN();
        }
        changeToUAN() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
            this.parent.append(element);
        }
    }

    const getResourse = async (url) => { //настраивает запрос 
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldnt fetch ${url}, status: ${res.status}`);
        }

        return await res.json(); //дожидаетс и возвращает промис
    };

    getResourse('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => { //деструктуриз
                new FoodCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    /* getResourse('http://localhost:3000/menu')
        .then(data => createCard(data)); // получает масив

    function createCard(data) {
        data.forEach(({
            img,
            altimg,
            title,
            descr,
            price
        }) => {
            const element = document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML = `
                <img src=${img} alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> грн/день</div>
                </div>
            `;
            document.querySelector('.menu .container').append(element);
        });
    } */


    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с Вами свяжемся',
        fail: 'Что-то пошло не так.',
    };

    forms.forEach(el => {
        bindPostData(el);
    });

    const postData = async (url, data) => { //настраивает запрос 
        const res = await fetch(url, { //дождаться результата
            method: 'POST', //посылает запрос на сервер
            headers: {
                'Content-type': 'application/json; charset = UTF-8'
            },
            body: data
        });
        return await res.json(); //дожидаетс и возвращает промис
    };


    function bindPostData(form) {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault(); //без перезагрузки страницы

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto; 
            `; //по центру

            form.insertAdjacentElement('afterend', statusMessage); //вставка изображения под формой(после нее)

            const formData = new FormData(form); //собираем все данные из формы
            //если данные идут на сервер то в html inputa нужно всегда указывать name

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            //берем данные с формы, превр в массив массивов, после в обьект, после в джос 

            //request.send(formData); //без json
            //request.send(json);

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data); //результат ответа из сервера
                    showThanksModal(message.success); //показать сообщение пользователю что все хорошо
                    statusMessage.remove();
                }).catch(() => { //в плохом случае
                    showThanksModal(message.fail); //показать сообщ что всё плохо
                }).finally(() => { // в любом случае
                    form.reset(); //сбрасывем форму
                });
        });
    }

    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__dialog');
        prevModal.classList.add('hide');
        modalOpen();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        modal.append(thanksModal);

        setTimeout(() => {
            thanksModal.remove(); //посл 4сек удалется окно благодарн
            prevModal.classList.add('show'); //и возвращается норм модал
            prevModal.classList.remove('hide'); //на будушее если его снова откроют
            closeModal(); //и закрывается модалка вообще
        }, 40000);
    }
    fetch('http://localhost:3000/menu')
        .then(data => data.json());




});