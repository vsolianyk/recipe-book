import * as $ from 'jquery';

export function getRecipes(callback) {
    $.get('./api/recipes.json', callback);
}

export function getRecipe(id, callback) {
    $.get('./api/recipes.json', (data) => {
        let found = data.find((item) => item.id == id);
        if (found) {
            callback(found);
        }
    });
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
    $.find('#title')[0].innerHTML = item.title;
    $.find('#description')[0].innerHTML = item.description;
    $.find('#category')[0].innerHTML = item.category;
    renderIngredients('#ingredients-list', item.ingredients);
}

function renderIngredients(selector, list) {
    $.find(selector)[0].innerHTML = list.reduce((tpl, ing) => {
        return tpl + `<li class="list-group-item clearfix">
            <span>${ing.name}(${ing.count} ${ing.units})</span>
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
