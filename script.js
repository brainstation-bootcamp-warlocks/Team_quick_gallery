let culture = 37525950;
let allImageUrl = [];

/**
 * When called, will request for a list of objects from the server.
 */
 function requestGalleryObjects() {

    
    axios.get('https://api.harvardartmuseums.org/object', 
    {
        params: {
            "apikey": '6205a0f6-7380-42b6-9a01-272d7c020f4f',
            "culture": culture,
        }
    }).then(response => {

        const foundGalleryObjects = response.data;
        foundGalleryObjects.records.forEach( record => {
            allImageUrl.push(record.images[0].baseimageurl);
        });

        console.log(allImageUrl);

    }).catch(error => {
        console.error ("Failed to receive objects from API.");
        console.error (error);
    });
}

document.getElementById("getArt").addEventListener("click", requestGalleryObjects);