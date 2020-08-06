import "@babel/polyfill";
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * Search controller
 */
const controlSearch = async () => {
    const query = searchView.getInput();

    if (query) {
        renderLoader(elements.searchResults, 'start');
        state.search = new Search(query);
        try {
            await state.search.getResults();
        } catch (err) {
            alert('Error processing recipe.');
        }
        renderLoader(elements.searchResults, 'clear');
        searchView.renderResults(state.search.result);
        searchView.clearInput();
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * Recipe controller
 */
const controlRecipe = async () => {

    //Get ID from url
    const hash = window.location.hash.replace('#', '');

    if (hash) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe, 'start');
        state.recipe = new Recipe(hash);
        try {

            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Highlight selected search item
            if (state.search) {
                searchView.highlightSelected(hash);
            }

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            renderLoader(elements.recipe, 'clear');
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(hash));
        } catch (err) {
            console.error(err);
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List controller
 */
const controlList = () => {
    // Create a new list if there is none
    if (!state.list) state.list = new List();

    // Add item object to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Handle shopping list item delete
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});

/**
 * Like controller
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        //Toggle like button
        likesView.toggleLikeBtn(true);

        // Add like to the UI
        likesView.renderLike(newLike);

    // User has liked current recipe
    } else {
        // Delete like from the state
        state.likes.deleteLike(currentID);

        // Toggle like button
        likesView.toggleLikeBtn(false);

        // Delete like from the UI
        likesView.deleteLike(currentID);
    }
};

// Store liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Read storage for likes
    state.likes.readLocalStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});