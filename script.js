let culture;
let allCultures = [];
let allImageUrl = [];
let dropdownCulture;

/**
 * When called, will request for a list of objects from the server.
 */
 function requestGalleryObjects() {

    culture = dropdownCulture.getSelectedCultureId();

    axios.get('https://api.harvardartmuseums.org/object', 
    {
        // Note: "classification": 26 is "Painting"
        params: {
            "apikey": '6205a0f6-7380-42b6-9a01-272d7c020f4f',
            "culture": culture,
            "hasimage": 1
        }
    }).then(response => {
        const foundGalleryObjects = response.data;

        console.log(foundGalleryObjects);

        foundGalleryObjects.records.forEach( record => {

            if (record.primaryimageurl) {
                allImageUrl.push(record.primaryimageurl);
            }
        });

        console.log(allImageUrl);

    }).catch(error => {
        console.error ("Failed to receive objects from API.");
        console.error (error);
    });
}

document.getElementById("getArt").addEventListener("click", requestGalleryObjects);

dropdownCulture = new DropdownCulture(document.getElementById("culture-select"));

// Web components

class GalleryCard {
    constructor() {

    }
    render (){
        return `
        <section class="gallery">
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
        </section>
        `
    }
}

class Gallery {
    constructor() {
        this.galleryCard = new GalleryCard;
    }

    render () {
        return `
            ${this.galleryCard.render()}
        `
    }
}

let galleryField = document.getElementById('gallery');
let gallery = new Gallery;
galleryField.innerHTML = gallery.render();

// render images on the page
const cardItem = document.querySelector('card');

function displayArt () {
    for (var i = 0; 1 < allImageUrl.length; i++) {
        cardItem.innerHTML = allImageUrl[i];
        // return;
    }
}

displayArt (allImageUrl);