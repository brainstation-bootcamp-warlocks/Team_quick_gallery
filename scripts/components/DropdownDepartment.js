class DropdownDepartment {

    constructor(parentContainerDOM) {
        this.parentContainerDOM = parentContainerDOM;
        this.allDepartments = [];

        this.intialRequestPromise = new Promise(this.intialRequestDepartments);

        this.intialRequestPromise
            .then(this.generateRows)
            .then(this.populateDropdown)
            .then(this.render)
            .catch(undefined);
    }

    /**
     * When called, will request for a list of departments from the server.
     */
     intialRequestDepartments = (resolve, reject) => {

        axios.get('https://collectionapi.metmuseum.org/public/collection/v1/departments', 
        {

        }).then( response => {
            resolve(response.data.departments);
        }).catch(error => {
            console.error ("Failed to receive departments from API.");
            console.error (error);
        });
    }


    generateRows = (result) => {

        let rows = [];

        result.forEach(department => {
            rows.push(`<option value=${department.departmentId}>${department.displayName}</option>`);
            }
        );
        
        return rows;
    }

    populateDropdown = (result) => {

        return `    
        <select name="department" id="department-dropdown-selector">
            ${result.join('')}
        </select>`;
    }
    
    /**
     * This will get whatever value is currently selected in this dropdown selector.
     * @returns The currently selected department ID
     */
    getSelectedDepartmentId() {
        return this.parentContainerDOM.querySelector('#department-dropdown-selector').value;
    }

    render = (result) => {
        this.parentContainerDOM.innerHTML = result;
    }
}