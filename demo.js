
// Custom scripts to initialize demo

const grid = document.querySelector("[data-item='grid']");
const initGrid = new jedliGrid(grid);

grid.addEventListener('afterInit', () => {
    initGrid.addRow(1, ['head'], { customParam1: "Example 1", customParam2: "Example 2" })
    initGrid.addRow(3, ['body'], { customParam1: "Example 1", customParam2: "Example 2" })
    for (let i = 0; i < 3; i++) {
        initGrid.addCol(1, ['body'], i, 'col 1', { customParam1: "Example 1", customParam2: "Example 2" })
        initGrid.addCol(1, ['body'], i, 'col 2', { customParam1: "Example 1", customParam2: "Example 2" })
    }

    // json to crate custom col
    let contentObject = {
        element1: {
            content: 'head col 1',
            params: {
                customParam1: "Example 1",
                customParam2: "Example 2"
            }
        },
        element2: {
            content: 'head col 1',
            params: {
                customParam1: "Example 1",
                customParam2: "Example 2"
            }
        }
    }

    console.log("add row with content");

    // Add row with content
    initGrid.addRow(1, ['head'], {}, contentObject)

    // Add listener to handle row and col click
    grid.addEventListener('rowClick', (event) => {
        console.log(event.detail.clickedElement);
    })

    grid.addEventListener('colClick', () => {
        console.log(event.detail.clickedElement);
    })
})

const buttonDelete = document.querySelector("[data-action='delete-row']");
buttonDelete.addEventListener('click', () => {
    initGrid.deleteRow(0, ['body']);
})

const buttonDeleteCol = document.querySelector("[data-action='delete-col']");
buttonDeleteCol.addEventListener('click', () => {
    initGrid.clear(0, ['body'], 0);
})

const buttonClear = document.querySelector("[data-action='clear-all']");
buttonClear.addEventListener('click', () => {
    initGrid.clear();
})

const buttonClearHead = document.querySelector("[data-action='clear-head']");
buttonClearHead.addEventListener('click', () => {
    initGrid.clearHead();
})

const buttonClearBody = document.querySelector("[data-action='clear-body']");
buttonClearBody.addEventListener('click', () => {
    initGrid.clearBody();
})

const buttonGetRoot = document.querySelector("[data-action='get-root']");
buttonGetRoot.addEventListener('click', () => {
    const root = initGrid.getRoot();
    console.log(root);
})

const buttonGetHead = document.querySelector("[data-action='get-head']");
buttonGetHead.addEventListener('click', () => {
    const head = initGrid.getHead();
    console.log(head);
})

const buttonGetBody = document.querySelector("[data-action='get-body']");
buttonGetBody.addEventListener('click', () => {
    const body = initGrid.getBody();
    console.log(body);
})


const buttonGetContent = document.querySelector("[data-action='get-content']");
buttonGetContent.addEventListener('click', () => {
    const element = initGrid.structure.body.querySelector('[data-jedli-grid="row"][jedli-grid-index="0"]');
    const content = initGrid.getContent(element);
})
