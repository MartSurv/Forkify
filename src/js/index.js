import "@babel/polyfill";
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
    const query = searchView.getInput();
    console.log(query);

    if (query) {
        renderLoader(elements.searchResults, 'start');
        state.search = new Search(query);
        await state.search.getResults();
        renderLoader(elements.searchResults, 'end');
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