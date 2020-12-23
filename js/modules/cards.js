function cards() {
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

    /* 
    //без axios
    getResourse('http://localhost:3000/menu') 
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price}) => { //деструктуриз
                new FoodCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        }); 
        
    const getResourse = async (url) => { //настраивает запрос 
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldnt fetch ${url}, status: ${res.status}`);
        }

        return await res.json(); //дожидаетс и возвращает промис
    };    
    */

    axios.get('http://localhost:3000/menu')
        .then(data => data.data.forEach(({
            img,
            altimg,
            title,
            descr,
            price
        }) => { //деструктуриз
            new FoodCard(img, altimg, title, descr, price, '.menu .container').render();
        }));

    /* 
    //вариант 2
    getResourse('http://localhost:3000/menu')
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
}

module.exports = cards;