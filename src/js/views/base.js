export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResults: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages')
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
    if (mode === 'start') {
    parent.insertAdjacentHTML('afterbegin', loader);
    } else if (mode === 'end') {
        parent.removeChild(parent.firstElementChild);
    }
};