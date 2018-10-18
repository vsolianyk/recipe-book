import * as $ from 'jquery';

let isOpen = false;

let cart = []; 
let $cartElem;
/* 
{
    id: 1,
    name: 'test',
    count: 2,
    units: "pc"
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
        return tpl + `<li class="list-group-item clearfix">
            <span>${ing.name}(${ing.count} ${ing.units})</span>
            <button id="ingredient-${ing.id}" class="btn btn-sm btn-danger pull-right">x</button>
        </li>`;
    }, '');
    if (cart.length > 0) {
        $cartElem.querySelector('.alert').style.display = 'none';
    } else {
        $cartElem.querySelector('.alert').style.display = '';
    }
}

function renderCart(elem) {
    $cartElem = document.createElement('div');
    $cartElem.className = 'cart';
    $cartElem.id = 'cart';
    $cartElem.innerHTML = `
        <div class="row">
            <div id="ingredients" class="list-group"></div>
            <div class="alert alert-warning"> No items </div>
        </div>
    `;
    elem.insertBefore($cartElem, elem.firstChild);
}

export function init(containerElem) {
    cart = JSON.parse(localStorage.getItem('recipeBook-cart')) || [];

    renderCart(containerElem);
    if (cart.length) {
        updateCartTemplate();
    }
    $.find('#cart-button')[0].addEventListener('click', (e) => {
        e.preventDefault();
        isOpen = !isOpen;
        document.body.className = isOpen ?
            document.body.className + ' cart-open' :
            document.body.className.replace('cart-open', '');
    });
    $.find('#ingredients')[0].addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') {
            let id = +e.target.id.split('-')[1];
            removeIngredientById(id);
        }
    });
}

export function addIngredients(list) {
    list.forEach((ing) => {
        let found = cart.find((i) => i.id === ing.id);
        if (found) {
            found.count += ing.count;
        } else {
            cart.push(Object.assign({}, ing));
        }
    });
    localStorage.setItem('recipeBook-cart', JSON.stringify(cart));
    updateCartTemplate();
}

export function removeIngredientById(id) {
    let index = cart.findIndex((i) => i.id === id);
    if (index > -1) {
        cart.splice(index, 1);
    }
    localStorage.setItem('recipeBook-cart', JSON.stringify(cart));
    updateCartTemplate();
}