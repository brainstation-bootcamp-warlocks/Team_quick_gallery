class DropdownCulture {

    constructor(parentContainerDOM) {
        this.parentContainerDOM = parentContainerDOM;
        this.allCultures = [];

        this.intialRequestPromise = new Promise(this.intialRequestCultures);

        this.intialRequestPromise
            .then(this.generateRows)
            .then(this.populateDropdown)
            .then(this.render)
            .catch(undefined);
    }

    /**
     * When called, will request for a list of cultures from the server.
     */
     intialRequestCultures = (resolve, reject) => {

        axios.get('https://api.harvardartmuseums.org/culture', 
        {
            params: {
                "apikey": '6205a0f6-7380-42b6-9a01-272d7c020f4f',
            }
        }).then( response => {

            this.totalRecords = response.data.info.totalrecords;

            return axios.get('https://api.harvardartmuseums.org/culture', 
            {
                params: {
                    "apikey": '6205a0f6-7380-42b6-9a01-272d7c020f4f',
                    "size": response.data.info.totalrecords,
                    "sort": "name"
                }
            });

        }).then( response => {
            const foundGalleryCulture = response.data;
            resolve(foundGalleryCulture.records);
        }).catch(error => {
            console.error ("Failed to receive cultures from API.");
            console.error (error);
        });
    }


    generateRows = (result) => {

        let rows = [];

        result.forEach(culture => {
            rows.push(`<option value=${culture.id}>${culture.name}</option>`);
            }
        );

        return rows;
    }

    populateDropdown = (result) => {

        return `    
        <select name="culture" id="culture-dropdown-selector">
            ${result.join('')}
        </select>`;
    }

    render = (result) => {
        this.parentContainerDOM.innerHTML = result;
    }

    getSelectedCultureId() {
        return this.parentContainerDOM.querySelector('#culture-dropdown-selector').value;
    }
}