import { elements } from './base';

const renderRecipe = recipe => {
    const markup =
        `
    <li>
        <a class="results__link results__link--active" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

const limitRecipeTitle = (title, limit = 17) => {
    if (title.length > limit) {
        let shortTitle = title.substring(0, limit);
        shortTitle = shortTitle.substring(0, Math.min(shortTitle.length, shortTitle.lastIndexOf(' ')))
        return `${shortTitle} ...`;
    } else {
        return title;
    }
};

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

const showButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
</button>
`

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button
    if (page === 1 && pages > 1) {
        button = showButton(page, 'next');
    } else if (page < pages) {
        button =
            `
        ${showButton(page, 'prev')}
        ${showButton(page, 'next')}
        `
    } else if (page === pages && pages > 1) {
        button = showButton(page, 'prev');
    }
    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
}