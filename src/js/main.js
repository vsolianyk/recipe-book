import {getRecipes, getRecipeListItemTemplete} from './recipe';
import { init, addIngredients } from './cart';
import * as $ from 'jquery';


const pageName = getPageName();

init();

if (pageName === 'recipesList') {
    initRecipesList();
}

function getPageName() {
    switch(window.location.pathname) {
        case '/':
        case '/index.html':
            return 'recipesList';
        default:
            return '';
    }
}

function initRecipesList() {
    let recipes;
    function renderRecipes(list) {
        recipes = list;
        let tpl = '';
        list.forEach((item) => {
            tpl += getRecipeListItemTemplete(item);
        });
        $.find('#recipes')[0].innerHTML = tpl;
    }

    $.find('#recipes')[0].addEventListener('click', (e) => {
        debugger;
        if(e.target.tagName === 'BUTTON') {
            e.stopPropagation();
            e.preventDefault();
            addIngredients(recipes[0].ingredients);
        }
    });

    getRecipes(renderRecipes);
}
