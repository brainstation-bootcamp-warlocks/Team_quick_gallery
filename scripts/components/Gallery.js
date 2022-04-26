class GalleryCard {
    constructor(imageUrl) {
        this.imageUrl = imageUrl;
    }

    render = () => {
        return `<img class="card" src="${this.imageUrl}?width=160">`
    }
}

class Gallery {
    constructor(parentContainerDOM) {
        this.parentContainerDOM = parentContainerDOM;
    }

    generateCards = (listOfImageUrls) => {
        this.cards = [];

        listOfImageUrls.forEach(url => {
            this.cards.push( (new GalleryCard(url)).render() );
            }
        );

        return this.cards.join('');
    }

    render = (listOfImageUrls) => {
        this.parentContainerDOM.innerHTML = `
        <div class="gallery">
            ${this.generateCards(listOfImageUrls)}
        </div>
        `;
    }
}