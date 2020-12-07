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

    const deadline = '2020-12-6';

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
        modal = document.querySelector('.modal'),
        modalClose = modal.querySelector('.modal__close');

    function modalOpen() {
        //modal.classList.add('show');
        //modal.classList.remove('hide');

        //modal.classList.toggle('show'); //если нет добавляем

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; //экран за модальным окном не прокручивается
    }

    modalTrigger.forEach(el => {
        el.addEventListener('click', modalOpen);
    });

    function closeModal() {
        //modal.classList.add('hide');
        //modal.classList.remove('show')

        //modal.classList.toggle('show'); //если есть убираем

        modal.style.display = 'none';
        document.body.style.overflow = ''; //вернуть прокрутку при закрытии модальног окна
        clearInterval(modalTimerId); //после модала он не открывается еще раз
    }

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
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









});