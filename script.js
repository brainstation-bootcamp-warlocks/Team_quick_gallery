let culture;
let allCultures = [];
let allImageUrl = [];
let dropdownCulture;
let gallery;

/**
 * When called, will request for a list of objects from the server.
 */
 function requestGalleryObjects() {

    culture = dropdownCulture.getSelectedCultureId();

    axios.get('https://api.harvardartmuseums.org/object', 
    {
        // First, we're going to just get the total number of items avaliable
        // Note: "classification": 26 is "Painting"
        params: {
            "apikey": '6205a0f6-7380-42b6-9a01-272d7c020f4f',
            "culture": culture,
            "hasimage": 1
        }
    }).then( response => {
        const totalRecords = response.data.info.totalrecords;

        const size = (totalRecords > 200) ? 200 : totalRecords;

        return axios.get('https://api.harvardartmuseums.org/object', 
        {
            params: {
                "apikey": '6205a0f6-7380-42b6-9a01-272d7c020f4f',
                "size": size,
                "culture": culture,
                "hasimage": 1,
                "sort": "name"
            }
        });

    }).then(response => {

        // Clear all stored image URLs
        allImageUrl = [];

        const foundGalleryObjects = response.data;
        foundGalleryObjects.records.forEach( record => {

            if (record.primaryimageurl) {
                allImageUrl.push(record.primaryimageurl);
            }
        });
    }).then( () => {

        // Now that we have the URLs for the gallery, render them.
        gallery.render(allImageUrl);
    }).catch(error => {
        console.error ("Failed to receive objects from API.");
        console.error (error);
    });
}

document.getElementById("getArt").addEventListener("click", requestGalleryObjects);

// Web components
dropdownCulture = new DropdownCulture(document.getElementById("culture-select"));
gallery = new Gallery(document.getElementById('gallery'));

// render images on the page
const cardItem = document.querySelector('card');

function displayArt () {
    for (var i = 0; 1 < allImageUrl.length; i++) {
        cardItem.innerHTML = allImageUrl[i];
        // return;
    }
}

displayArt (allImageUrl);