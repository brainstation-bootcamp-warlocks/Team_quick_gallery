
let allImageUrl = [];

let searchTotalRecords;
let searchObjectIDs;

let dropdownCulture;
let gallery;

/**
 * When called, will request for a list of objects from the server.
 */
 function requestGalleryObjects() {

    departmentId = dropdownDepartment.getSelectedDepartmentId();

    axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search', 
    {
        params: {
            "q": '',
            "hasImages": true,
            "isPublicDomain": true,
            "departmentId": departmentId
        }
    }).then( response => {
        const searchTotalRecords = response.data.total;
        const searchObjectIDs = response.data.objectIDs;

        // Now that we have the URLs for the gallery, populate and render them.
        gallery.populate(searchObjectIDs);
        gallery.render();
        
    }).catch(error => {
        console.error ("Failed to receive objects from API.");
        console.error (error);
    });
}

document.getElementById("getArt").addEventListener("click", requestGalleryObjects);

// Web components
dropdownDepartment = new DropdownDepartment(document.getElementById("department-select"));
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