
// Custom scripts to initialize demo

const grid = document.querySelector("[data-item='grid']");
const initGrid = new jedliGrid(grid);

grid.addEventListener('afterInit', () => {
    console.log("After init");
    initGrid.addRow(1, 'head', {head1: "Nagłowek tekst 1", head2: "Muszka Gruszka"})
})