class GalleryCard {
    constructor(objectID) {
        this.objectID = objectID;

        // The default image in case we don't get anything.
        this.primaryImageSmall = `https://collectionapi.metmuseum.org/api/collection/v1/iiif/395022/thumbnail`;
    }

    requestData = (resolve, reject) => {
        axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${this.objectID}`, 
        {
            // No additional parameters
        }).then( response => {

            // Keep track of the data
            this.objectData = response.data;

            // Isolate some specific fields we need
            this.title = this.objectData.title;
            this.objectDate = this.objectData.objectDate;
            this.artistDisplayName = this.objectData.artistDisplayName;
            this.objectURL = this.objectData.objectURL;

            // There is potentially a copyright issue, since we can't sort by public
            // domain only. Therefore, try to see if we can get a 'restricted' image.
            if (this.objectData.primaryImageSmall !== ""){
                this.primaryImageSmall = this.objectData.primaryImageSmall;
                resolve();
            } else {
                return axios.get(`https://collectionapi.metmuseum.org/api/collection/v1/iiif/${this.objectID}/restricted`);
            }
        }).then( (response) => {

            if (response?.data) {
                this.primaryImageSmall = `https://collectionapi.metmuseum.org/api/collection/v1/iiif/${this.objectID}/restricted`;
                resolve();
            } else {
                return axios.get(`https://collectionapi.metmuseum.org/api/collection/v1/iiif/${this.objectID}/thumbnail`);
            }

        }).then( (response) => {

            // By just getting something back, we can assume it works. Otherwise, try the 'thumbnail' image
            if (response?.data) {
                this.primaryImageSmall = `https://collectionapi.metmuseum.org/api/collection/v1/iiif/${this.objectID}/thumbnail`;
            }
            resolve();

        }).catch(error => {
            console.error ("Failed to receive object from API.");
            console.error (error);

            reject();
        });
    }

    render = () => {
        return `<img class="card" src="${this.primaryImageSmall}">`;
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

        const requestDataMethods = this.galleryCards.map( x => new Promise(x.requestData));

        Promise.all(requestDataMethods).then( (values)=>{
            console.log(this.galleryCards);
            this.render();
        })
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

        console.log(cardHTMLRender);

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