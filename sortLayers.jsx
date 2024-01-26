(function() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert('No active composition.');
        return;
    }

    app.beginUndoGroup('Sort Layers');

    var topLayersCamera = [];
    var topLayersLo = [];
    var topLayersPANTUSL = [];
    var bottomLayersBook = [];
    var bottomLayersBG = [];
    var bottomLayersSolid = [];
    var middleLayers = [];

    var regexCamera = /camera/i;
    var regexLo = /lo/i;
    var regexPANTUSL = /PAN|TU|SL/i;
    var regexBook = /BOOK/i;
    var regexBG = /BG/i;
    var regexSolid = /Solid /i;

    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        var name = layer.name;
        if (regexCamera.test(name)) {
            topLayersCamera.push(layer);
        } else if (regexLo.test(name)) {
            topLayersLo.push(layer);
        } else if (regexPANTUSL.test(name)) {
            topLayersPANTUSL.push(layer);
        } else if (regexBook.test(name)) {
            bottomLayersBook.push(layer);
        } else if (regexBG.test(name)) {
            bottomLayersBG.push(layer);
        } else if (regexSolid.test(name)) {
            bottomLayersSolid.push(layer);
        } else {
            middleLayers.push(layer);
        }
    }

    // Case-insensitive sorting for middle layers
    middleLayers.sort(function(a, b) {
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();
        return nameB.localeCompare(nameA);
    });

    function reorderLayers(layersArray) {
        for (var i = 0; i < layersArray.length; i++) {
            var layer = layersArray[i];
            for (var j = layer.index; j > i + 1; j--) {
                layer.moveBefore(comp.layer(j - 1));
            }
        }
    }

    // Reordering process
    reorderLayers(bottomLayersSolid.reverse());
    reorderLayers(bottomLayersBG.reverse());
    reorderLayers(bottomLayersBook.reverse());
    reorderLayers(middleLayers);
    reorderLayers(topLayersPANTUSL.reverse());
    reorderLayers(topLayersLo.reverse());
    reorderLayers(topLayersCamera.reverse());

    app.endUndoGroup();
})();
