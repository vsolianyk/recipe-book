import * as $ from 'jquery';

let isOpen = false;

let cart = []; 
/* 
{
    id: 1,
    name: 'test',
    count: 2
}
*/

function updateCartTemplate() {
    updateIngredientsList();
    updateCartCounter();
}

function updateCartCounter() {
    $.find('.counter')[0].innerHTML = cart.length;
}

function updateIngredientsList() {
    $.find('#ingredients')[0].innerHTML = cart.reduce((tpl, ing) => {
        return tpl + `<li class="list-group-item">${ing.name}</li>`;
    }, '');
}

export function init() {
    $.find('#cart-button')[0].addEventListener('click', (e) => {
        e.preventDefault();
        isOpen = !isOpen;
        document.body.className = isOpen ?
            document.body.className + ' cart-open' :
            document.body.className.replace('cart-open', '');
    });
}

export function addIngredients(list) {
    cart.push(...list);
    updateCartTemplate();
}