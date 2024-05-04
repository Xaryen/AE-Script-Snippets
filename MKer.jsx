(function buildUI(thisObj) {

    var MKpath = "D:\\OtakuVs\\OTACHAN-S2\\_SOZAI\\99_MK"

    String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
    String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("\\");if(i>=0) r=this.substring(i+1);
		return r;
	}
    String.prototype.endsWith = function(suffix){
		if (suffix.length > this.length) return false; // Ensure the suffix isn't longer than the string
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};

    function button1func(){
        var myLayers = app.project.activeItem.selectedLayers;
        var myLayer;
        app.beginUndoGroup("refresh");
        for (var i = 0; i < myLayers.length; i++){
            myLayer = myLayers[i];
            celRename(myLayer);
        }
        app.endUndoGroup();
    }

    function findFolder(folderName) {
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof FolderItem && item.name === folderName) {
                return item; // Return the existing folder
            }
        }
        return null;
};

    function findMKdir(path){
        //tbd
        return new Folder(path);
    }

    function addMKboard(path, duration){
        //import MK footage file
        app.beginUndoGroup("add MK board");
        var importOptions = new ImportOptions(File(path));
        var MKitem = app.project.importFile(importOptions)
        var etcFolder = findFolder("0-0_etc")
        if (!etcFolder) {alert("etc folder not found")}
        MKitem.parentFolder = etcFolder;

        //get current playhead position
        var comp = app.project.activeItem;

        var currentTime = comp.time;

        //place into comp at current time
        var MKlayer = comp.layers.add(MKitem);
        MKlayer.transform.scale.setValue([50, 50]);
        MKlayer.startTime = currentTime;
        MKlayer.outPoint = currentTime + duration*comp.frameDuration
        app.endUndoGroup();
    }



    var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "MKer", undefined, {resizeable:true});

    if (myPanel != null) {


        var MKdir = findMKdir(MKpath)

         if (!MKdir.exists) {
        alert("MK images directory wasn't found.");
        return;
        }

        var files;
        var fileList = [];
        var btnList = [];
        var pathList = [];
        var MKdur = 10;

        function updateMKlist() {
            files = MKdir.getFiles();
            fileList = [];
            pathList = [];
            btnList = [];

            for (var i = 0; i < files.length; i++) {
                var m_path = files[i].fsName;
                var m_name = files[i].fsName.getName();
                m_name = m_name.split(" ")[0]
                btnList[i] = myPanel.add("button", undefined, m_name);
                pathList[i] = m_path;


                (function(index) {
                btnList[index].onClick = function(){addMKboard(pathList[index], MKdur)}; 
                })(i);
            }
        }

        updateMKlist();
        var MKdurInput = myPanel.add("edittext", undefined, "");
        MKdurInput.text = MKdur;
        MKdurInput.size = [50, 25];
        var button1 = myPanel.add("button", undefined, "Refresh");

        myPanel.layout.layout(true);
        myPanel.layout.resize();
        myPanel.onResizing = myPanel.onResize = function () { this.layout.resize(); }

        button1.onClick = function(){updateMKlist();};
        MKdurInput.onChanging = function(){
            MKdur = parseInt(MKdurInput.text, 10)};
    }

    if (myPanel instanceof Window) {
        myPanel.show();
    } else {
        myPanel.layout.layout(true);
    }

})(this);

