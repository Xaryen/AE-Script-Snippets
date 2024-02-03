(function buildUI(thisObj) {

    String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
    String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
    String.prototype.endsWith = function(suffix){
		if (suffix.length > this.length) return false; // Ensure the suffix isn't longer than the string
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};


    function celRename(selectedLayer){
        if (!selectedLayer){$.writeln("nothing selected");return;} 

        var originalName = selectedLayer.name;
        var trimmedName = originalName;
        var startIndex = originalName.indexOf('[');

        if (startIndex !== -1) {
            trimmedName = originalName.substring(0, startIndex).trim();
            //$.writeln(trimmedName);
            if (trimmedName.endsWith("_")){

                trimmedName = trimmedName.slice(0, -1);
            }
            //$.writeln(trimmedName);
            selectedLayer.name = trimmedName;
            return trimmedName;
        }else{
            return trimmedName;
        }
    }

    function celPrecomp(selectedLayer, pO){
        if (!selectedLayer){$.writeln("nothing selected");return;} 

        var layer = selectedLayer;
        var parentComp = layer.containingComp;
        var selectedLayerIndex = [layer.index];
        var precompName = celRename(layer);
        //$.writeln(precompName);
        if (layer && parentComp && selectedLayerIndex){
            parentComp.layers.precompose(selectedLayerIndex, precompName, pO);
        }
       
    }

    function celGetName(selectedLayer){
        if (!selectedLayer){$.writeln("nothing selected");return;} 
        var layer = selectedLayer;
        var originalName = layer.name;
        var newName = "";
        if (layer.source && layer.source instanceof FootageItem && layer.source.file) {
            newName = layer.source.file.path;
            newName = newName.getName().trim();
        }
        //$.writeln(newName)
        selectedLayer.source.name = selectedLayer.name = newName + originalName;
    }

    function button1func(){
        var myLayers = app.project.activeItem.selectedLayers;
        var myLayer;
        app.beginUndoGroup("cel rename");
        for (var i = 0; i < myLayers.length; i++){
            myLayer = myLayers[i];
            celRename(myLayer);
        }
        app.endUndoGroup();
    }

    function button2func(){
        var myLayers = app.project.activeItem.selectedLayers;
        var myLayer;
        var x = 1;
        app.beginUndoGroup("cel precomp");
        for (var i = 0; i < myLayers.length; i++){
            myLayer = myLayers[i];
            celPrecomp(myLayer, x);
        }
        app.endUndoGroup();
    }
    function button2bfunc(){
        var myLayers = app.project.activeItem.selectedLayers;
        var myLayer;
        var x = 0;
        app.beginUndoGroup("cel precomp");
        for (var i = 0; i < myLayers.length; i++){
            myLayer = myLayers[i];
            celPrecomp(myLayer, x);
        }
        app.endUndoGroup();
    }

    function button3func(){
        var myLayers = app.project.activeItem.selectedLayers;
        var myLayer;
        var parentComp = myLayers[0].containingComp;
        var precompName = "";
        var myLayersNames = [];
        var myLayersIndexes = [];
        app.beginUndoGroup("cel combine");
        for (var i = 0; i < myLayers.length; i++){
            myLayer = myLayers[i];
            myLayersNames[i] = celRename(myLayer).charAt(0);
            myLayersIndexes[i] = myLayer.index;
        }
        myLayersNames.sort();
        precompName = myLayersNames.join("");
        parentComp.layers.precompose(myLayersIndexes, precompName, 1)

        app.endUndoGroup();
    }

    function button4func(){
        var myLayers = app.project.activeItem.selectedLayers;
        var myLayer;
        app.beginUndoGroup("cel rename");
        for (var i = 0; i < myLayers.length; i++){
            myLayer = myLayers[i];
            celGetName(myLayer);
        }
        app.endUndoGroup();
    }

    var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Cel Manager", undefined, {resizeable:true});

    if (myPanel != null) {
        var button1 = myPanel.add("button", undefined, "rename");
        var button2 = myPanel.add("button", undefined, "precomp");
        var button2b = myPanel.add("button", undefined, "precompL");
        var button3 = myPanel.add("button", undefined, "combine");
        var button4 = myPanel.add("button", undefined, "get name");

        button1.onClick = function(){button1func();};
        button2.onClick = function(){button2func();};
        button2b.onClick = function(){button2bfunc();};
        button3.onClick = function(){button3func();};
        button4.onClick = function(){button4func();};

        myPanel.layout.layout(true);
        myPanel.layout.resize();
        myPanel.onResizing = myPanel.onResize = function () { this.layout.resize(); }
    }

    if (myPanel instanceof Window) {
        myPanel.show();
    } else {
        myPanel.layout.layout(true);
    }
})(this);

