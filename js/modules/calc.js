function calculator() {
    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }
    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) { //если чтото не заполнено
            result.textContent = ('_____');
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    calcTotal();

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.remove(activeClass);
            if (el.getAttribute('id') === localStorage.getItem('sex')) {
                el.classList.add(activeClass);
            }
            if (el.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                el.classList.add(activeClass);
            }
        });
    }
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');


    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector); //все дивы внутри родителя

        elements.forEach(el => {
            el.addEventListener('click', (ev) => {
                if (ev.target.getAttribute('data-ratio')) {
                    ratio = +ev.target.getAttribute('data-ratio'); //рацион
                    localStorage.setItem('ratio', +ev.target.getAttribute('data-ratio')); //сохр в браузере знач польз
                } else {
                    sex = ev.target.getAttribute('id'); //получаем пол
                    localStorage.setItem('sex', ev.target.getAttribute('id')); //сохр в браузере значение пользователя
                }
                elements.forEach(el => el.classList.remove(activeClass)); //скрыть активн неактивных

                ev.target.classList.add(activeClass); //класс активности для выбранного
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active'); //для пола
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active'); //для физ активности

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) { //при вводе букв
                input.style.boxShadow = '0px 4px 13px 5px rgba(255, 0, 0, 0.2)'; //горит подсветка
            } else {
                input.style.boxShadow = '0 4px 15px rgba(0,0,0,.2)'; //если цифры , подсветка убирается
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

module.exports = calculator;