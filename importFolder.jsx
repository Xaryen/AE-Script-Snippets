(function() {
    var scriptName = "XFolderImportScript";
    var filterCharacter = '_';
    var excludeRegex = /nuriwake|_pool/i;
    var excludeExtensions = ['.txt', '.csv','.ini','.aep','.psd','.cf6','.clip'];

    function selectFolder() {
        var lastFolderPath = app.settings.haveSetting(scriptName, "lastFolderPath")
            ? app.settings.getSetting(scriptName, "lastFolderPath")
            : "";
        var folder = new Folder(lastFolderPath);

        var selectedFolder = folder.selectDlg("Select the folder to import");
        if (selectedFolder) {
            app.settings.saveSetting(scriptName, "lastFolderPath", selectedFolder.fsName);
        }
        return selectedFolder;
    }

    function shouldExclude(fileName) {
        return excludeRegex.test(fileName) || endsWithAny(fileName, excludeExtensions);
    }

    function endsWithAny(str, extensions) {
        for (var i = 0; i < extensions.length; i++) {
            if (str.substr(-extensions[i].length).toLowerCase() === extensions[i].toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    function canBeImportedAsSequence(fileName) {
        var imageExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.tga', '.exr', '.bmp'];
        
        for (var i = 0; i < imageExtensions.length; i++) {
            var extension = imageExtensions[i];
            if (fileName.toLowerCase().substr(-extension.length) === extension) {
                return true;
            }
        }
        return false;
    }

    function importFolderContents(folderPath, parentFolderItem) {
        var folder = new Folder(folderPath);
        if (!folder.exists) return;

        var files = folder.getFiles();
        var lastImportedSequence = "";

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            if (file instanceof Folder) {
                handleFolder(file, parentFolderItem);
                continue;
            }

            if (shouldExclude(file.name)) continue;

            var options = new ImportOptions(File(file));
            if (!canBeImportedAsSequence(file.name)) {
                options.sequence = false;
            } else if (!isPartOfSequence(file.name, lastImportedSequence)) {
                options.sequence = file.parent.displayName.indexOf(filterCharacter) !== 0;
                lastImportedSequence = options.sequence ? getBaseNameForSequence(file.name) : "";
            } else {
                continue; // Skip file as it's part of an already imported sequence
            }

            var importedItem = app.project.importFile(options);
            importedItem.parentFolder = parentFolderItem;
        }
    }

    function isPartOfSequence(fileName, lastImportedSequence) {
        var baseName = getBaseNameForSequence(fileName);
        return baseName === lastImportedSequence;
    }

    function getBaseNameForSequence(fileName) {
        // Logic to extract the base name from the file name (e.g., "A0001.tga" -> "A")
        // Adjust the logic based on your file naming convention
        var match = fileName.match(/^[A-Za-z]+/);
        return match ? match[0] : "";
    }

    function handleFolder(folder, parentFolderItem) {
        if (!shouldExclude(folder.name)) {
            var newFolder = app.project.items.addFolder(folder.name);
            newFolder.parentFolder = parentFolderItem;
            importFolderContents(folder.fsName, newFolder);
        }
    }

    function handleFile(file, parentFolderItem) {
        if (shouldExclude(file.name)) return;

        var options = new ImportOptions(File(file));
        options.sequence = file.parent.displayName.indexOf(filterCharacter) !== 0;
        //options.forceAlphabetical = file.parent.displayName.indexOf(filterCharacter) === 0;
        var importedItem = app.project.importFile(options);
        importedItem.parentFolder = parentFolderItem;
    }

    function main() {
        var folderPath = selectFolder();
        if (folderPath) {
            var rootFolder = app.project.items.addFolder(folderPath.displayName);
            importFolderContents(folderPath.fsName, rootFolder);
        }
    }

    main();
})();
