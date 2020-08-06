export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResults: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

export const elementsClasses = {
    loader: 'loader'
}

export const renderLoader = (parent, mode) => {
    const loader =
    `
    <div class="${elementsClasses.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
`;
    mode === 'start' ? parent.insertAdjacentHTML('afterbegin', loader) : parent.removeChild(parent.firstElementChild);
};