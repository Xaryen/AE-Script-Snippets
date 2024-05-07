(function buildUI(thisObj) {

    var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "My Panel", undefined, {resizeable:true});

    if (myPanel != null) {
        //make UI element
        var button1 = myPanel.add("button", undefined, "Do Thing");

        //event listenere
        button1.onClick = function(){};

        //window settigns
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

