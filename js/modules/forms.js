import {closeModal, modalOpen} from './modal';
import {postData} from '../servises/servises';

function forms(formSelector, modalTimerId) {

    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с Вами свяжемся',
        fail: 'Что-то пошло не так.',
    };

    forms.forEach(el => {
        bindPostData(el);
    });

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
        modalOpen('.modal', modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove(); //посл 4сек удалется окно благодарн
            prevModal.classList.add('show'); //и возвращается норм модал
            prevModal.classList.remove('hide'); //на будушее если его снова откроют
            closeModal('.modal'); //и закрывается модалка вообще
        }, 40000);
    }
    fetch('http://localhost:3000/menu')
        .then(data => data.json());

}

export default forms;