export default class Likes {
    constructor () {
        this.likes = [];
    }

    addLike (id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Add to localStorage
        this.changeData();

        return like;
    }

    deleteLike (id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Delete from localStorage
        this.changeData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes () {
        return this.likes.length;
    }

    changeData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readLocalStorage () {
        const storage = JSON.parse(localStorage.getItem('likes')); // if nothing returns null
        if (storage) this.likes = storage;
    }
}