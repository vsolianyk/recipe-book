import * as $ from 'jquery';
import { addIngredients } from './cart';

let recipes = JSON.parse(localStorage.getItem('recipeBook-recipes')) || null;

export function getRecipes(callback) {
    if(recipes) {
        callback(recipes);
    } else {
        $.get('./api/recipes.json', (data) => {
            callback(data);
            localStorage.setItem('recipeBook-recipes', JSON.stringify(data));
        });
    }
}

export function getRecipe(id, callback) {
    getRecipes((data) => {
        let found = data.find((item) => item.id == id);
        if (found) {
            callback(found);
        }
    });
}

export function addRecipe(recipe) {
    recipes = recipes || [];
    recipe = Object.assign({
        id: 10 + recipes.length,
        title: '',
        description: '',
        category: '',
        imageUrl: 'javascript:void(0)',
        ingredients: []
    }, recipe);
    recipes.push(recipe);
    localStorage.setItem('recipeBook-recipes', JSON.stringify(recipes));
}

export function editRecipe(recipe) {
    recipes = recipes || [];

    let index = recipes.findIndex((r) => r.id === recipe.id);
    recipe = Object.assign({
        title: '',
        description: '',
        category: '',
        imageUrl: 'javascript:void(0)',
        ingredients: []
    }, recipe);
    recipes.splice(index, 1, recipe);
    localStorage.setItem('recipeBook-recipes', JSON.stringify(recipes));
}

export function renderRecipes(selector, list) {
    let tpl = '';
    list.forEach((item) => {
        tpl += getRecipeListItemTemplete(item);
    });
    $.find(selector)[0].innerHTML = tpl;
}

export function renderRecipe(item) {
    let img = $.find('#image')[0];
    img.src = item.imageUrl;
    $.find('#edit-link')[0].href = '/recipe-form.html?id=' + item.id;
    $.find('#title')[0].innerHTML = item.title;
    $.find('#description')[0].innerHTML = item.description;
    $.find('#category')[0].innerHTML = item.category;
    renderIngredients('#ingredients-list', item.ingredients);

    $.find('#ingredients-list')[0].addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') {
            let id = +e.target.getAttribute('id').split('-')[1];
            let ing = item.ingredients.find((i) => i.id === id);

            addIngredients([ing]);
        }
    });
}

function renderIngredients(selector, list) {
    $.find(selector)[0].innerHTML = list.reduce((tpl, ing) => {
        return tpl + `<li class="list-group-item clearfix">
            <span>${ing.name}(${ing.count} ${ing.units})</span>
            <button id="ing-${ing.id}" class="btn btn-success pull-right">+</button>
        </li>`;
    }, '');
    // <button id="ingredient-${ing.id}" class="btn btn-sm btn-danger pull-right">x</button>
}

function getRecipeListItemTemplete(recipe) {
    const {imageUrl, title, description, id} = recipe;
    return `
        <div class="col-sm-4 col-md-3 col-xs-6">
            <a href="recipe.html?id=${id}">
            <div class="thumbnail">
                <img src="${imageUrl}" alt="${title}">
                <div class="caption">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <p>
                        <button id="addRecipe-${id}" class="btn btn-primary" role="button">Add to cart</button>
                    </p>
                </div>
            </div>
            </a>
        </div>
    `;
}
