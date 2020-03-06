
// jedliGrid by Bartłomiej Jedlikowski
// linkedIn: https://www.linkedin.com/in/jedlibartlomiej/

// v 1.0.0

class jedliGrid {
    constructor(item, options) {
        // Set item (container) as part of class
        this.item = item;

        // Default options
        this.defaultOptions = {
            noOfColumns: 2,
        }

        // Set options to default
        this.options = this.defaultOptions;

        // Get default user options
        this.initializedOptions = options;

        // Override options with given
        this.options = Object.assign(this.options, this.initializedOptions);

        // Set state that contains most important things
        this.state = {
            // Dom element where to init
            item: this.item,
            // Object with options
            options: this.options,
            // last and next index of col
            nextIndexRowHead: 0,
            lastIndexRowHead: -1,
            nextIndexRowBody: 0,
            lastIndexRowBody: -1,
        }

        // Set this.structure to contain whole structure
        // So it would be easy to destroy everything and create only part
        this.structure = {
            root: '',
            head: '',
            body: '',
        }

        // Init function <- init structure
        this.init();
    }

    // Default init function
    init() {
        // On init create structure
        this.initRoot().then(() => {
            this.initHead();
            this.initBody();
        })
            .then(() => {
                // Append whole structure to DOM
                this.initDOM();

                // Trigger event after init
                this.eventAfterInit();
            });
    }

    // Init root of grid
    async initRoot() {
        let root = document.createElement("table");
        // Add attr and classes
        root.setAttribute("data-jedli-grid", "root");
        root.classList.add("jedli-grid");

        // Add to structure 
        this.structure.root = root;
    }

    // init head of grid
    async initHead() {
        let head = document.createElement("thead");
        // Add attr and classes
        head.setAttribute("data-jedli-grid", "head");
        head.classList.add("jedli-grid__head");

        // Add to structure 
        this.structure.head = head;

        // Add to root
        this.structure.root.appendChild(head);
    }

    // init body of grid
    async initBody() {
        let body = document.createElement("tbody");
        // Add attr and classes
        body.setAttribute("data-jedli-grid", "body");
        body.classList.add("jedli-grid__body");

        // Add to structure 
        this.structure.body = body;

        // Add to root
        this.structure.root.appendChild(body);
    }

    // Init whole structure in DOM
    // Which means add created elements to specified container
    async initDOM() {
        this.item.appendChild(this.structure.root);
    }

    // ######
    // Custom functions to manage structure of grid
    // ######

    // Set and update index
    // @Params:
    // element = DOM element
    // Element to add attributes

    // Type = 'string'
    // Defines which type of index will be added
    // Index of cols or index of rows

    // target = string
    // Defines which index should be used, index for head or for body

    // Parent = element
    // Used for columns, allows to find last index in row
    async setIndex(element, type, target, parent) {
        // Get right index to add
        // And update old one
        let indexToAdd;
        switch (type) {
            case 'col':
                // In col find last col and set index as index of last col + 1
                // Get all cols
                let lastCol = parent.querySelectorAll("[data-jedli-grid='col']");
                // Check if there is any col
                if (lastCol.length > 0) {
                    // If true
                    // Get last col
                    lastCol = lastCol[lastCol.length - 1];
                    // Get index of last col
                    indexToAdd = +lastCol.getAttribute('jedli-grid-index');
                    // Increment it
                    indexToAdd++;

                }
                else {
                    // If not, set index as 0
                    indexToAdd = 0;
                }

                break;

            case 'row':
                // Use different indexes for body and head
                switch (target) {
                    case 'head':
                        indexToAdd = this.state.nextIndexRowHead;
                        this.state.nextIndexRowHead++;
                        this.state.lastIndexRowHead++;
                        break;

                    case 'body':
                        indexToAdd = this.state.nextIndexRowBody;
                        this.state.nextIndexRowBody++;
                        this.state.lastIndexRowBody++;
                        break;
                }
        }

        // Add attr
        element.setAttribute("jedli-grid-index", indexToAdd);
    }

    // @Params
    // category = string
    // Define what elements should have been updated

    // target = array, can contain 'head', 'body' or both
    // Specified where col be added, by default to both head and body
    async updateIndex(category, target = []) {
        // Loop through target and find all elements of this category in target
        const keys = target.keys;
        if (keys) {
            target.forEach(singleTarget => {
                // Get all elemnts of this category 
                let allElements = this.structure[singleTarget].querySelectorAll(`[data-jedli-grid='${category}']`);
                if (allElements.length > 0) {
                    // If there are any elements, loop through
                    allElements.forEach((element, index) => {
                        // Set index of loop as index of element
                        element.setAttribute("jedli-grid-index", index);
                    })
                }
            });
        }
    }

    // Add content to element in DOM
    // @Params:
    // element = DOM element
    // Element to add content

    // content = string
    // Content that will be inserted into element

    // type = string
    // Specified place where content will be added
    // Acceptable values: 
    // - beforebegin
    // - afterbegin 
    // - beforeend (default value)
    // - afterend
    async addContent(element, content, position = "beforeend") {
        element.insertAdjacentHTML(position, content);
    }

    // Add column 
    // @Params:

    // target = array of strings
    // Specified where this row is, head or body

    // rowIndex = int/string  (default 0)
    // Specified index of row where col will be added

    // content = string/html
    // Contains what will be added to col

    // customParams = object
    // Allows to add custom params to specified row
    async addCol(amount = 1, target = ['head', 'body'], rowIndex = 0, content = "", customParams = {}) {
        const keys = target.keys;
        // Loop through targets and add to all targets
        if (keys) {
            // Loop whole adding function, depends of specified 'amount' number
            for (let i = 0; i < amount; i++) {

                target.forEach(element => {
                    // Find row with specified index
                    let row = this.structure[element].querySelector(`[data-jedli-grid='row'][jedli-grid-index='${rowIndex}']`);
                    if (row) {
                        // Create html element for col
                        let col = document.createElement("td");

                        // Add specific attributes
                        col.setAttribute("data-jedli-grid", "col");
                        this.setIndex(col, 'col', element, row);
                        col.classList.add("jedli-grid__col");

                        // Add content to col
                        this.addContent(col, content);

                        // Loop through keys of custom params and add them to col
                        let paramsKeys = Object.keys(customParams);
                        if (paramsKeys.length > 0) {
                            paramsKeys.forEach(key => {
                                // Add param to row
                                col.setAttribute(key, customParams[key]);
                            });
                        }

                        // Append to specified place in dom
                        row.appendChild(col);
                    }
                    else {
                        console.error("jedliGrid ERROR! Row not found in function 'addCol()'")
                    }
                });
            }
        }
    }

    // Add row
    // @Params:
    // amount = int
    // How many rows will be added, by default one

    // target = array, can contain 'head', 'body' or both
    // Specified where col be added, by default to both head and body

    // customParams = object
    // Allows to add custom params to specified row
    async addRow(amount = 1, target = ['head', 'body'], customParams = {}) {
        const keys = target.keys;
        // Loop through targets and add to all targets
        if (keys) {
            // Loop whole adding function, depends of specified 'amount' number
            for (let i = 0; i < amount; i++) {
                target.forEach(element => {
                    // Create html element for row
                    let row = document.createElement('tr');

                    // Add specific attributes
                    row.setAttribute("data-jedli-grid", "row");
                    this.setIndex(row, 'row', element);
                    row.classList.add("jedli-grid__row");

                    // Loop through keys of custom params and add them to row
                    let paramsKeys = Object.keys(customParams);
                    if (paramsKeys.length > 0) {
                        paramsKeys.forEach(key => {
                            // Add param to row
                            row.setAttribute(key, customParams[key]);
                        });
                    }

                    // Append to specified place in dom
                    this.structure[element].appendChild(row);
                });
            }
        }
    }

    // Delete row
    // @Params:
    // index = int/string
    // Index of row to delete

    // target = array, can contain 'head', 'body' or both
    // Specified where to find row, by default to both head and body

    async deleteRow(index, target = []) {
        this.deleteElement('row', index, target);
    }

    // Delete col
    // @Params:
    // index = int/string
    // Index of col to delete

    // target = array, can contain 'head', 'body' or both
    // Specified where to find col, by default to both head and body

    async deleteCol(index, target = []) {
        this.deleteElement('col', index, target);
    }

    // Functon to delet element row/col
    // @Params 
    // type = string
    // defines if should remove col or row

    // index = int/string
    // Index of element to delete

    // target = array, can contain 'head', 'body' or both
    // Specified where to find element, by default to both head and body

    async deleteElement(category, index, indexOfParent, target = []) {
        // Find right element in right target
        const keys = target.keys;
        // Loop through targets and add to all targets
        if (keys) {
            target.forEach(singleTarget => {
                // Find right row
                let element = this.structure[singleTarget].querySelector(`[data-jedli-grid='${category}'][jedli-grid-index='${index}']`);
                // Check if row exists
                if (element) {
                    // If row has been found, remove it
                    element.remove();

                    // Update index of all rows that left
                    this.updateIndex(category, [singleTarget]);
                }
                else {
                    console.error("jedliGrid ERROR! Element not found in function 'deleteElement() (Function deleteElement() is used by deleteRow() and deleteCol()'")
                }
            });
        }
    }
    // EVENTS

    eventAfterInit() {
        const eventAfterInit = new CustomEvent(
            'afterInit',
            {
                bubbles: false,
                cancelable: false,
            }
        )

        this.item.dispatchEvent(eventAfterInit);
    }
};

// export default jedliGrid;