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

            // By just getting something back, we can assume it works. Otherwise, try the 'thumbnail' image
            if (response?.data) {
                this.primaryImageSmall = `https://collectionapi.metmuseum.org/api/collection/v1/iiif/${this.objectID}/restricted`;
                resolve();
            } else {
                return axios.get(`https://collectionapi.metmuseum.org/api/collection/v1/iiif/${this.objectID}/thumbnail`);
            }

        })
        .then( (response) => {

            // By just getting something back, we can assume it works. Otherwise, try the 'main-image' image
            if (response?.data) {
                this.primaryImageSmall = `https://collectionapi.metmuseum.org/api/collection/v1/iiif/${this.objectID}/thumbnail`;
                resolve();
            } else {
                return axios.get(`https://collectionapi.metmuseum.org/api/collection/v1/iiif/${this.objectID}/main-image`);
            }

        }).then( (response) => {

            // By just getting something back, we can assume it works.
            if (response?.data) {
                this.primaryImageSmall = `https://collectionapi.metmuseum.org/api/collection/v1/iiif/${this.objectID}/main-image`;
            }

            resolve();

        }).catch(error => {
            console.error ("Failed to receive object from API.");
            console.error (error);

            reject();
        });
    }

    render = () => {

        /* // Irina's Template
        <div class="card">
            <div class="image">image will be here</div>
            <div class="info">
                <p id="title">title</p>
                <p id="year">year</p>
                <p id="artist">artist</p>
            </div>
        </div> */

        return `
        <div class="card">
            <img class="card" src="${this.primaryImageSmall}">
            <div class="info">
                <p id="title">${this.title}</p>
                <p id="year">${this.objectDate}</p>
                <p id="artist">${this.artistDisplayName}</p>
            </div>
        </div>`;
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