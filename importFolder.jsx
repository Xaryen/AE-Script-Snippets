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

        var files = folder.getFiles().sort(); // Sort the files for consistent processing
        var lastSequenceName = ""; // Track the name of the last imported sequence

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file instanceof Folder) {
                handleFolder(file, parentFolderItem);
                continue;
            }

            if (shouldExclude(file.name)) continue;

            var options = new ImportOptions(File(file));
            var baseName = getBaseNameForSequence(file.name, file.parent.name);
            var isStartOfNewSequence = (baseName !== lastSequenceName) && canBeImportedAsSequence(file.name);
            var fileStartsWithUnderscore = file.name.indexOf('_') === 0;
            
            // Adjust the condition to account for files starting with '_'
            options.sequence = isStartOfNewSequence && !fileStartsWithUnderscore && file.parent.displayName.indexOf(filterCharacter) !== 0;

            if (isStartOfNewSequence || !canBeImportedAsSequence(file.name) || fileStartsWithUnderscore) {
                var importedItem = app.project.importFile(options);
                importedItem.parentFolder = parentFolderItem;

                if (options.sequence) {
                    lastSequenceName = baseName; // Update the last sequence name
                }
            }
        }
    }

    function isPartOfSequence(fileName, lastImportedSequence) {
        var baseName = getBaseNameForSequence(fileName);
        return baseName === lastImportedSequence;
    }

    function getBaseNameForSequence(fileName, parentFolderName) {
        // Extract the base name from the file name for files with leading alphabetic characters
        var match = fileName.match(/^[A-Za-z]+/);
        if (match) {
            return match[0];
        }
        // For files that are just numbered (like "1.png"), use the parent folder's name as the base name
        return parentFolderName;
    }

    function handleFolder(folder, parentFolderItem) {
        if (!shouldExclude(folder.name)) {
            var newFolder = app.project.items.addFolder(folder.name);
            newFolder.parentFolder = parentFolderItem;
            importFolderContents(folder.fsName, newFolder);
        }
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
