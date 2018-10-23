import * as $ from 'jquery';
import { addRecipe, editRecipe } from './recipe';

let id;
let ingredients = [];

export function init(selector, config) {
    $.find(selector)[0].addEventListener('submit', (e) => {
        e.preventDefault();
        let errors = isFormInvalid($.find(selector)[0], config);

        if(errors) {
            displayErrors(errors);
        } else {
            let value = getFormValue($.find(selector)[0]);
            value.ingredients = ingredients;
            if(!id) {
                addRecipe(value);
            } else {
                value.id = id;
                editRecipe(value);
            }
            window.location.href = '/';
        }
    });
    $.find('#ingredientsForm .btn')[0].addEventListener('click', (e) => {
        e.stopPropagation();
        let name = $.find('#ingName')[0].value.trim();
        let count = +$.find('#ingCount')[0].value.trim();
        let units = $.find('#ingUnits')[0].value.trim();
        if (name && count && units) {
            ingredients.push({name, count, units});
            renderIngredients(ingredients);
            $.find('#ingName')[0].value = '';
            $.find('#ingCount')[0].value = '';
            $.find('#ingUnits')[0].value = '';
        }
    });
    
    $.find('#imageUrl')[0].addEventListener('change', onImageUrlChange);

}

function onImageUrlChange() {
    $.find('#preview')[0].setAttribute('src', $.find('#imageUrl')[0].value);
    $.find('#preview')[0].parentNode.parentNode.style.display = 'block';
}

export function renderRecipeForm(selector, data) {
    id = data.id;
    let form = $.find(selector)[0];
    ['title', 'description', 'category', 'imageUrl'].forEach(key => {
        form.querySelector(`[name="${key}"]`).value = data[key];
    });
    onImageUrlChange();
    ingredients = data.ingredients;
    renderIngredients(data.ingredients);
}

function getFormValue(form) {
    let value = {};
    ['title', 'description', 'category', 'imageUrl'].forEach(key => {
        value[key] = form.querySelector(`[name="${key}"]`).value.trim();
    });
    return value;
}

function renderIngredients(list) {
    $.find('#addedIng')[0].innerHTML = list.reduce((tpl, ing) => {
        return tpl + `<li class="list-group-item clearfix">
            <span>${ing.name}(${ing.count} ${ing.units})</span>
        </li>`;
    }, '');
}

function isFormInvalid(form, config) {
    var errors = [];
    for (let fieldName in config) {
        let field = form.querySelector(`[name="${fieldName}"]`);
        let value = field.value;

        for (let validator in config[fieldName].validators) {
            switch(validator) {
                case 'required': 
                    if (!value.trim()) {
                        errors.push({fieldName, message: 'Field is required'});
                    }
                    break;
                case 'pattern': 
                    if (config[fieldName].validators[validator] instanceof RegExp &&
                        !config[fieldName].validators[validator].test(value)) {
                        errors.push({fieldName, message: 'Field not match pattern'});
                    }
                    break;
            }
        }
    }
    return errors.length ? errors : false;
}

function displayErrors(errors) {

}
