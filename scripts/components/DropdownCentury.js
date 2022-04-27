class DropdownCentury {

    constructor(parentContainerDOM) {
        this.parentContainerDOM = parentContainerDOM;
        this.allCenturies = [];

        this.intialRequestPromise = new Promise(this.intialRequestCenturies);

        this.intialRequestPromise
            .then(this.generateRows)
            .then(this.populateDropdown)
            .then(this.render)
            .catch(undefined);
    }

    /**
     * When called, will request for a list of centuries from the server.
     */
     intialRequestCenturies = (resolve, reject) => {

        axios.get('https://api.harvardartmuseums.org/century', 
        {
            params: {
                "apikey": '6205a0f6-7380-42b6-9a01-272d7c020f4f',
                "size": 60, 
                "sort": "temporalorder",
            }
        }).then( response => {
            const foundGalleryCentury = response.data;
            resolve(foundGalleryCentury.records);
        }).catch(error => {
            console.error ("Failed to receive centuries from API.");
            console.error (error);
        });
    }


    generateRows = (result) => {

        let rows = [];

        result.forEach(century => {
            rows.push(`<option value=${century.id}>${century.name}</option>`);
            }
        );
        
        return rows;
    }

    populateDropdown = (result) => {

        return `    
        <select name="century" id="century-dropdown-selector">
            ${result.join('')}
        </select>`;
    }

    render = (result) => {
        this.parentContainerDOM.innerHTML = result;
    }

    getSelectedCenturyId() {
        return this.parentContainerDOM.querySelector('#century-dropdown-selector').value;
    }
}