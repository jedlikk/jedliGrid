
// jedliGrid by Bartłomiej Jedlikowski
// linkedIn: https://www.linkedin.com/in/jedlibartlomiej/

// v 1.0.0

class jedliGrid {
    constructor(item, options) {
        // Set item (container) as part of class
        this.item = item;

        // Default options
        this.defaultOptions = {
            // noOfColumns: 2,
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


    // TODO: creating rows from json
    // let files = Object.keys(fileList);
    // files.forEach(singleKey => {
    //     sigFilesGrid.addRow(1, ["body"], {}, fileList[singleKey]);
    // });

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
                else {
                    // If no elements has been found and category is 'row' reset index
                    if (category === 'row') {
                        // Reset index for right target (head/body)
                        switch (singleTarget) {
                            case 'head':
                                this.state.nextIndexRowHead = 0;
                                this.state.lastIndexRowHead = -1;
                                break;

                            case 'body':
                                this.state.nextIndexRowBody = 0;
                                this.state.lastIndexRowBody = -1;
                                break;
                        }
                    }
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

    // amount = int
    // How many cols will be added, by default one
    // target = array of strings
    // Specified where this row is, head or body

    // rowIndex = int/string  (default 0)
    // Specified index of row where col will be added

    // content = string/html
    // Contains what will be added to col

    // customParams = object
    // Allows to add custom params to specified row
    async addCol(amount = 1, target = ['head', 'body'], rowIndex = 0, content = "", customParams = {}) {
        // Loop through targets and add to all targets
        if (target.length > 0) {
            // Loop whole adding function, depends of specified 'amount' number
            for (let i = 0; i < amount; i++) {
                target.forEach(element => {
                    // Find row with specified index
                    let row = this.structure[element].querySelector(`[data-jedli-grid='row'][jedli-grid-index='${rowIndex}']`);
                    if (row) {
                        // Create html element for col
                        // th for head and td for body
                        let col;
                        if (element === 'head') {
                            col = document.createElement("th");
                        } else {
                            col = document.createElement('td');
                        }

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

                        // Add event listener on col click
                        col.addEventListener('click', () => {
                            this.eventColClick(col);
                        })
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

    // target = array of strings, can contain 'head', 'body' or both
    // Specified where row will be added, by default to both head and body

    // customParams = object
    // Allows to add custom params to specified row

    // content = object
    // Create cols for all elements in array with custom parameters
    // How json should look like:
    // let contentJson = {
    //     col1: {
    //         content: "your content here",
    //         params: {
    //                 class: 'yourClass'
    //         }
    //     },
    //     col2: {
    //         content: "12312312",
    //         params: {
    //                 class: 'yourClass'
    //         }
    //     }
    // }
    async addRow(amount = 1, target = ['head', 'body'], customParams = {}, content = {}) {
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

                    // Add event listener on row click
                    row.addEventListener('click', () => {
                        this.eventRowClick(row);
                    })

                    // Append to specified place in dom
                    this.structure[element].appendChild(row);

                    // Create columns with content if content parameter is specified
                    let contentKeys = Object.keys(content);
                    if (contentKeys.length > 0) {
                        // Get index of this row
                        let index = row.getAttribute("jedli-grid-index");
                        // Loop through object with content
                        contentKeys.forEach(contentKey => {
                            // Get right element from content object
                            let contentElement = content[contentKey];

                            // Add col to this row
                            this.addCol(1, [element], index, contentElement['content'], contentElement['params']);
                        });
                    }
                });
            }
        }
    }

    // Return content of element, co
    // @Params

    // element = DOM element 
    // Element from which content will be taken

    // @Return
    // content of element
    // simple content or object of contents if element is row
    getContent(element) {
        // Check what type is element (tag name)
        const tagName = element.tagName;
        // Variable for content
        let content;

        // TODO: Get content function
        switch (tagName) {
            // If element is col (th or td), get whole inner html
            case 'TD':
                content = element.innerHTML;
                break;

            case 'TH':
                content = element.innerHTML;
                break;

            // If element is row, return object with content of all cols inside
            case 'TR':
                // Get all cols inside
                const colsInside = element.querySelectorAll("[data-jedli-grid='col']");
                // If there is any coll, loop through them, if not return null
                if (colsInside.length > 0) {
                    // Create object structure for content
                    content = {};
                    colsInside.forEach(singleCol => {
                        // Add content of every col into object
                        let colContent = this.getContent(singleCol);

                        // Name of col that will be in content object
                        let colName = `col-${singleCol.getAttribute('jedli-grid-index')}`;

                        // Add content of this col to 'content' object that will be returned with all cols
                        content[colName] = colContent
                    });
                }
                else {
                    content = null;
                }
        }

        return content;
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

    async deleteCol(index, target = [], indexOfParent) {
        this.deleteElement('col', index, target, indexOfParent);
    }

    // Functon to delet element row/col
    // @Params 
    // type = string
    // defines if should remove col or row

    // index = int/string
    // Index of element to delete

    // target = array, can contain 'head', 'body' or both
    // Specified where to find element, by default to both head and body

    // indexOfParent = int/string
    // Index of parent where element should be find

    async deleteElement(category, index, target = [], indexOfParent) {
        // Find right element in right target
        const keys = target.keys;
        // Loop through targets and add to all targets
        if (keys) {
            target.forEach(singleTarget => {
                // Find right element
                let element;
                switch (category) {
                    case 'row':
                        element = this.structure[singleTarget].querySelector(`[data-jedli-grid='${category}'][jedli-grid-index='${index}']`);
                        break;

                    case 'col':
                        // Find element in row
                        element = this.structure[singleTarget].querySelector(`[data-jedli-grid='row'][jedli-grid-index='${indexOfParent}']`).querySelector(`[data-jedli-grid='${category}'][jedli-grid-index='${index}']`);
                        break;
                }

                // Check if element exists
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

    // FUNCTIONS TO UPDATE STRUCTURE 
    // @Params:
    // element = dom instance
    // Element which should have updated content

    // content = string
    // New content of element

    async update(element, content) {
        // Clear old structure
        element.innerHTML = "";

        // Add new
        element.insertAdjacentHTML('beforeend', content);
    }

    // Update col
    // @Params:
    // rowIndex = string/int
    // Index of row -> parent of col

    // colIndex = string/int
    // Index of col to update

    // target = array, can contain 'head', 'body' or both
    // Specified where find this row/col

    // content = string
    // New content of element

    async updateCol(rowIndex, colIndex, target = ['head', 'body'], content = "") {
        const keys = target.keys;
        // Loop through targets to find row and col
        if (keys) {
            target.forEach(singleTarget => {
                // Find row
                let row = this.structure[singleTarget].querySelector(`[data-jedli-grid='row'][jedli-grid-index="${rowIndex}"]`);
                if(row) {
                    // Find right col
                    let col = row.querySelector(`[data-jedli-grid='col'][jedli-grid-index="${colIndex}"]`);
                    console.log(`[data-jedli-grid='col'][jedli-grid-index="${colIndex}"]`);
                    if(col) {
                        // Init function to update
                        this.update(col, content);
                    }
                    else {
                        console.error("jedliGrid: Col to update not found")
                    }
                }
                else {
                    console.error("jedliGrid: Row to update not found")
                }
            });
        }
    }

    // FUNCTIONS TO CLEAR STRUCTURE 

    // Clear all elements in specified category, by default both head and body

    // @Params:
    // target = array, can contain 'head', 'body' or both
    // Specified which part should be cleared

    // type = string (by default 'row')
    // Specified what elements should be removed, columns or rows
    async clear(target = ['head', 'body'], type = 'row') {
        const keys = target.keys;
        // Loop through targets and clear all targets
        if (keys) {
            target.forEach(singleTarget => {
                // Remove all rows from specified target
                let elements = this.structure[singleTarget].querySelectorAll(`[data-jedli-grid='${type}']`);
                // Loop through all elements
                elements.forEach(singleElement => {
                    singleElement.remove();
                });

                // If type was 'row', reset index of right target (head/body)
                if (type === 'row') {
                    this.updateIndex('row', [singleTarget]);
                }
            });
        }
    }


    // Clear all elements in head

    // @Params:
    // none
    async clearHead() {
        this.clear(['head']);
    }

    // Clear all elements in body

    // @Params:
    // none
    async clearBody() {
        this.clear(['body']);
    }

    // Destroy whole instance and structure
    async destroy() {
        // Clear structure
        this.item.innerHTML = "";
    }

    // Get root element of grid
    // @Params: none

    // Return: root element
    getRoot() {
        return this.structure.root;
    }


    // Get head element of grid
    // @Params: none

    // Return: head element
    getHead() {
        return this.structure.head;
    }

    // Get body element of grid
    // @Params: none

    // Return: body element
    getBody() {
        return this.structure.body;
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

    eventRowClick(element) {
        const eventRowClick = new CustomEvent(
            'rowClick',
            {
                detail: {
                    clickedElement: element
                },
                bubbles: false,
                cancelable: false,
            }
        )

        this.item.dispatchEvent(eventRowClick);
    }


    eventColClick(element) {
        const eventColClick = new CustomEvent(
            'colClick',
            {
                detail: {
                    clickedElement: element
                },
                bubbles: false,
                cancelable: false,
            }
        )

        this.item.dispatchEvent(eventColClick);
    }
};

// export default jedliGrid;