
let allImageUrl = [];

let searchTotalRecords;
let searchObjectIDs;

let existingDepartmentId;
let gallery;

let loadMoreButton;

/**
 * When called, will request for a list of objects from the server.
 */
 function requestGalleryObjects() {

    departmentId = dropdownDepartment.getSelectedDepartmentId();

    // If the user hasn't picked anything.
    if (departmentId === "-1") {
        
        return;
    }

    // Only make this query if we switched departments
    if (existingDepartmentId !== departmentId) {

        axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search', 
        {
            // Note: for some reason, the params must be in this ordering, with 'q' at the end
            params: {
                "departmentId": departmentId,
                "hasImages": true,
                "q": "\"\"",
            }
        }).then( response => {
            searchTotalRecords = response.data.total;
            searchObjectIDs = response.data.objectIDs;

            existingDepartmentId = departmentId

            // Now that we have the URLs for the gallery, populate and render them.
            gallery.clearGallery();
            gallery.populate(searchObjectIDs);

            // Show the "Show more" button
            loadMoreButton.classList.add("load-more__button--show");
            
            
        }).catch(error => {
            console.error ("Failed to receive objects from API.");
            console.error (error);
        });
    } else {
        // The list hasn't changed, so just render from the existing list.
        gallery.populate();
    }
}

function requestMoreObjects () {
    requestGalleryObjects();
}

document.getElementById("getArt").addEventListener("click", requestGalleryObjects);
loadMoreButton = document.getElementById("loadMore");
loadMoreButton.addEventListener("click", requestMoreObjects);

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