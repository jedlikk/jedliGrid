
// // Custom scripts to initialize demo
// Get container for messages
const consoleContainer = document.querySelector("[data-item='grid-console']");

// Get grid container
const grid = document.querySelector("[data-item='grid']");
// Variable for grid;
var gridInit;

// Init grid
document.querySelector("[data-action='init-grid']").addEventListener('click', () => {
    grid.addEventListener('afterInit', () => {
        console.log("afterInit");
        gridInit.addRow(1, ['body', 'head'] );
        console.log(gridInit.structure.root);

        document.querySelector("[data-action='delete']").addEventListener('click', () => {
            gridInit.destroy().then(() => {
                console.log(gridInit)
            })
        })
    })

    gridInit = new jedliGrid(grid);


    // console.log("grid initialized, here is object of it:");
    // console.log(gridInit);
    // updateConsole("grid initialized, here is object of it: <br><br>" + JSON.stringify(gridInit));
    // console.log("----------");

    // Show playground options
    // document.querySelector("[data-item='playground-options']").style.display = 'block';
})

// Handle add row 
let addRowForm = document.querySelector("[data-action='add-row']");
addRowForm.addEventListener('submit', e => {
    e.preventDefault();
    let amount = addRowForm.querySelector("[name='amount']").value;
    let target = addRowForm.querySelector("[name='target']").value;
    let params = addRowForm.querySelector("[name='customParams']").value;
    let content = addRowForm.querySelector("[name='content']").value;

    let addRow = gridInit.addRow(1, ['body', 'head'] );
})


// function to update console container
function updateConsole(content) {
    consoleContainer.innerHTML = content;
}
