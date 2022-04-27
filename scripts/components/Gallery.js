class GalleryCard {
    constructor(objectID) {
        this.objectID = objectID;
    }

    requestData = (resolve, reject) => {
        axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${this.objectID}`, 
        {
            // No additional parameters
        }).then( response => {
            // Keep track of the data
            this.objectData = response.data;

            // Isolate some specific fields we need
            this.title = objectData.title;
            this.objectDate = objectData.objectDate;
            this.artistDisplayName = objectData.artistDisplayName;
            this.primaryImageSmall = objectData.primaryImageSmall;
            this.objectURL = objectData.objectURL;

            resolve();

        }).catch(error => {
            console.error ("Failed to receive object from API.");
            console.error (error);

            reject();
        });

        this.imageUrl = imageUrl;
    }

    render = () => {

        let requestDataPromise = new Promise(this.requestData);
        requestDataPromise.then({
            return `<img class="card" src="${this.primaryImageSmall}?width=160">`;
        });
    }
}

class Gallery {
    constructor(parentContainerDOM) {
        this.parentContainerDOM = parentContainerDOM;
    }

    populate = (listOfObjectIDs) => {
        this.listOfObjectIDs = listOfObjectIDs;

        this.galleryCards = [];

        // Limit the number of cards to 5, or whichever is smaller
        const smallerValue = (this.listOfObjectIDs.length > 5) ? 5 : this.listOfObjectIDs.length;

        for (let index = 0; index < smallerValue; index ++) {
            this.galleryCards.push( (new GalleryCard(this.listOfObjectIDs[index])) );
        }
    }

    /**
     * We're going to render some HTML based on what cards we have.
     * @returns HTML
     */
     renderCards = () => {
        let cardHTMLRender = [];

        this.galleryCards.forEach(galleryCard => {
            cardHTMLRender.push(galleryCard.render());
        });

        return cardHTMLRender.join('');
    }

    render = () => {
        this.parentContainerDOM.innerHTML = `
        <div class="gallery">
            ${this.renderCards()}
        </div>
        `;
    }
}