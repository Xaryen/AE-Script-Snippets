(function() {
    var comp = app.project.activeItem; // Get the active composition

    if (!comp || !(comp instanceof CompItem)) {
        alert('Please select a composition.');
        return;
    }

    app.beginUndoGroup('Reverse Selected Layers'); // Begin undo group

    var selectedLayers = [];
    var indices = [];

    // Loop through the selected layers and store them in an array
    for (var i = 1; i <= comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i - 1];
        selectedLayers.push(layer);
        indices.push(layer.index);
    }

    // Sort indices in ascending order to handle them from bottom to top
    indices.sort(function(a, b) { return a - b; });

    for (var j = 0; j < selectedLayers.length; j++) {
        // Move each layer to the correct position based on the reversed order
        try {
            selectedLayers[j].moveBefore(comp.layer(indices[indices.length - j - 1]));
        } catch(e) {
            //nothing
        }
    }

    app.endUndoGroup(); // End undo group
})();
