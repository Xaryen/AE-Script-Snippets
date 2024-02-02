
(function buildUI(thisObj) {

    String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}

    String.prototype.getName = function(){
        var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
        return r;
    }
	String.prototype.endsWith = function(suffix) {
		if (suffix.length > this.length) return false; // Ensure the suffix isn't longer than the string
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};


    function celRename(selectedLayer){
        if (!selectedLayer){$.writeln("nothing selected");return;} 

        var originalName = selectedLayer.name;
        var removedStuff = "";
        var trimmedName = originalName;
        var startIndex = originalName.indexOf('[');

        if (startIndex !== -1) {
            extractedContent = originalName.substring(startIndex);
            trimmedName = originalName.substring(0, startIndex).trim();
            $.writeln(trimmedName);
            if (trimmedName.endsWith("_")){

                trimmedName = trimmedName.slice(0, -1);
            }
            $.writeln(trimmedName);
            selectedLayer.name = trimmedName;
            return trimmedName;
        }else{
            return trimmedName;
        }
    }

    function celPrecomp(selectedLayer){
        if (!selectedLayer){$.writeln("nothing selected");return;} 

        var layer = selectedLayer;
        var parentComp = layer.containingComp;
        var selectedLayerIndex = [layer.index];
        var precompName = celRename(layer);
        $.writeln(precompName);
        if (layer && parentComp && selectedLayerIndex){
            parentComp.layers.precompose(selectedLayerIndex, precompName, 1)
        }
       
    }
    function celCombine(){
        
    }

    function celGetName(){
        $.writeln("test3");
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
        var myLayers.sort();
        app.beginUndoGroup("cel precomp");
        for (var i = 0; i < myLayers.length; i++){
            myLayer = myLayers[i];
            celPrecomp(myLayer);
        }
        app.endUndoGroup();
    }

    function button3func(){
        var myLayers = app.project.activeItem.selectedLayers;
        var myLayer;
        app.beginUndoGroup("cel combine");
        for (var i = 0; i < myLayers.length; i++){
            myLayer = myLayers[i];
            celPrecomp(myLayer);
        }
        app.endUndoGroup();
    }

    var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Cel Manager", undefined, {resizeable:true});

    if (myPanel != null) {
        var button1 = myPanel.add("button", undefined, "rename");
        var button2 = myPanel.add("button", undefined, "precomp");
        var button3 = myPanel.add("button", undefined, "combine");
        var button4 = myPanel.add("button", undefined, "get name");

        button1.onClick = function(){button1func();};
        button2.onClick = function(){button2func();};
        button3.onClick = function(){button3func();};
        button4.onClick = function(){};

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

