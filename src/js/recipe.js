import * as $ from 'jquery';

let recipes = [];

export function getRecipes(callback) {
    $.get('./api/recipes.json', callback);
}

export function getRecipeListItemTemplete(recipe) {
    const {imageUrl, title, description, id} = recipe;
    return `
        <div id="${id}" class="col-sm-4 col-md-3 col-xs-6">
            <a href="recipe.html?id=${id}">
            <div class="thumbnail">
                <img src="${imageUrl}" alt="${title}">
                <div class="caption">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <p>
                        <button class="btn btn-primary" role="button">Add to cart</button>
                    </p>
                </div>
            </div>
            </a>
        </div>
    `;
}