# jedliSlider

![](https://img.shields.io/badge/version-1.1.1-blue.svg)

### DEMO page
[DEMO](http://jedlikk.github.io/jedliGrid/)

### What is jedliGrid?

jedliGrid is lightweight, easy to use, pure (vanilla) JavaScript library to show and manage data in tables.

### Compatibility

jedliGrid is made with functionality of ES6 like async/await, i haven't tested it yet on non 'present' browsers, but with some transpiler (like Babel) it should work on older browsers as well

## What's new?
### v. 1.1.1
- Added function destroy()

<!-- ### Previous update
- Added functionality to filter slides, show all or only from wanted category, with option to
    change category to show [See example here](http://jedlikk.github.io/jedliSlider/#filtering)
- Added events 'dragStart', 'dragEnd
- Added functionality to keep dragging slider when mouse is outside slider box
- Fixed bug when after drag there is no visible slides. Slider will now reset to first/last slide
- Fixed bug with dragging, and blocking of slider when slider was at start/end with infinite
    option set to fals -->

## How to use

### Instal via npm

"npm install jedligrid"

[NPM](https://www.npmjs.com/package/jedligrid)


### import library


## Events
<!-- See more [here](http://jedlikk.github.io/jedliSlider/#events) -->

- afterInit
 (it's important to declarate init events before initialization of slider)
- rowClick
- colClick

### How to catch events?
1. get your html element (for example by document.getElementById())
2. add event listener (for example element.addEventListener('afterInit), () => {}))
3. ??
4. Profit

rowClick and colClick returns clicked element, you can take it like this:
element.addEventListener('colClick', event => {
    let clickedCol = event.detail.clickedElement;
});

## Functions
<!-- See more [here](http://jedlikk.github.io/jedliSlider/#functions) -->

- init()
- initRoot()
- initHead()
- initBody()
- initDOM()
- setIndex()
- updateIndex()
- addContent()
- getContent()
- addCol()
- addRow()
- deleteElement()
- deleteRow()
- deleteCol()
- destroy()
- clear()
- clearHead()
- clearBody()
- getRoot()
- getHead()
- getBody()

## More info about functionality and function's params can be found in jedligrid.js file as comments
