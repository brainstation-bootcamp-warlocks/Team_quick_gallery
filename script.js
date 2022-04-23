// create a global variable for the api key:
const apiKey = "8d993ff2-370d-4e97-8167-4168a5c74070";

// retrieve comments using the key: 
const artURL = '?api_key=https://api.harvardartmuseums.org/gallery/1220'+apiKey;

console.log(artURL)

let artImages = document.getElementById('gallery');

// function for API communication:
function artFetch () {
    return axios.get(artURL).then((response) => {
    console.log(response)
    
    const artArray = response.data;
    return artArray;
    
});
}

