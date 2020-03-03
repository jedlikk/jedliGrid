
// jedliGrid by Bartłomiej Jedlikowski
// linkedIn: https://www.linkedin.com/in/jedlibartlomiej/

// v 1.0.0

class jedliGrid {
    constructor (item, options) {
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
            nextIndexCol: 0,
            lastIndexCol: -1,
            nextIndexRow: 0,
            lastIndexRow: -1,
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
            console.log(this);

            // Trigger event after init
            this.eventAfterInit();
        });
    }

    // Init root of grid
    async initRoot() {
        let root = document.createElement("table");
        // Add attr and classes
        root.setAttribute("data-jedli", "root");
        root.classList.add("jedli-grid");
        
        // Add to structure 
        this.structure.root = root;
    }

    // init head of grid
    async initHead() {
        let head = document.createElement("thead");
        // Add attr and classes
        head.setAttribute("data-jedli", "head");
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
        body.setAttribute("data-jedli", "body");
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
    async setIndex(element, type) {
        // Get right index to add
        // And update old one
        let indexToAdd;
        console.log(type);
        switch(type) {
            case 'col':
                indexToAdd = this.state.nextIndexCol;
                this.state.nextIndexCol++;
                this.state.lastIndexCol++;
                break;
            case 'row':
                indexToAdd = this.state.nextIndexRow;
                this.state.nextIndexRow++;
                this.state.lastIndexRow++;
                break;
        }
        
        // Add attr
        element.setAttribute("jedli-index", indexToAdd);
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
    // content = string/html
    // Contains what will be added to col

    // target = array, can contain 'head', 'body' or both
    // Specified where col be added, by default to both head and body
    async addCol(content = "", target = ['head', 'body']) {
        const keys = target.keys;
        // Loop through targets and add to all targets
        if(keys) {
            target.forEach(element => {
                // Create html element for col
                let col = document.createElement("td");;
                
                // Add specific attributes
                col.setAttribute("data-jedli", "col");
                this.setIndex(col, 'col');
                col.classList.add("jedli-grid__col");

                // Add content to col
                this.addContent(col, content);
                
                // Append to specified place in dom
                this.structure[element].appendChild(col);
            });
        }
    }

    // Add row
    // @Params:
    // amount = int
    // How many rows will be added, by default one

    // target = array, can contain 'head', 'body' or both
    // Specified where col be added, by default to both head and body
    async addRow(amount = 1, target = ['head', 'body'], customParams = ["custom-index", value]) {
        const keys = target.keys;
        // Loop through targets and add to all targets
        if(keys) {
            target.forEach(element => {
                // Create html element for row
                let row;
                // If target element is 'head' then create th
                
                // Add specific attributes
                row.setAttribute("data-jedli", "row");
                this.setIndex(col);
                row.classList.add("jedli-grid__row");

                // Add content to col
                this.addContent(row, content);
                
                // Append to specified place in dom
                this.structure[element].appendChild(row);
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