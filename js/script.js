'use strict';

window.addEventListener('DOMContentLoaded', () => {

    const tabs = require('./modules/tabs'),
        calculator = require('./modules/calculator'),
        cards = require('./modules/cards'),
        forms = require('./modules/forms'),
        modal = require('./modules/modal'),
        slides = require('./modules/slides'),
        timer = require('./modules/timer');

    tabs();
    calculator();
    cards();
    forms();
    modal();
    slides();
    timer();





});