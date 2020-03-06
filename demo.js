
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
})

const buttonDelete = document.querySelector("[data-action='delete-row']");
buttonDelete.addEventListener('click', () => {
    initGrid.deleteRow(0, ['body']);
})