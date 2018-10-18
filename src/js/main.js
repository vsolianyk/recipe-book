import {getRecipes, getRecipe, renderRecipe, renderRecipes} from './recipe';
import { init as initCart, addIngredients } from './cart';
import * as $ from 'jquery';


const pageName = getPageName();

initCart($.find('#main')[0]);

if (pageName === 'recipesList') {
    initRecipesList();
}
if (pageName === 'recipeDetails') {
    initRecipeDetails();
}

function getPageName() {
    switch(window.location.pathname) {
        case '/':
        case '/index.html':
            return 'recipesList';
        case '/recipe.html':
            return 'recipeDetails';
        default:
            return '';
    }
}

function initRecipesList() {
    let recipes;
    $.find('#recipes')[0].addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') {
            e.stopPropagation();
            e.preventDefault();
            let id = +e.target.id.split('-')[1];
            let found = recipes.find((r) => r.id === id);
            if (found) {
                addIngredients(found.ingredients);
            }
        }
    });

    getRecipes((data) => {
        recipes = data;
        renderRecipes('#recipes', data);
    });
}

function initRecipeDetails() {
    let queryStr = window.location.search.slice(1);
    // ['id=12', 'name=vasy']
    let query = queryStr.split('&').reduce((obj, item) => {
        let parts = item.split('='); // ['id', '12']
        obj[parts[0]] = parts[1];
        return obj;
    }, {});

    getRecipe(query.id, renderRecipe);

}
