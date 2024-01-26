// Define the character used for filtering files
var filterCharacter = '_';

// Define the file dialog to select the folder
var folderPath = Folder.selectDialog("Select the folder to import");

// Define regular expressions and file extensions to exclude
var excludeRegex = /nuriwake|sheet/i; // Customize the regular expression patterns
var excludeExtensions = ['.txt', '.csv','.jpg']; // Customize the file extensions

// Function to check if a file should be excluded
function isExcluded(fileName) {
  // Check if the file matches the exclusion criteria
  return excludeRegex.test(fileName) || endsWithAnyExtension(fileName, excludeExtensions);
}

// Custom function to check if a string ends with any of the specified extensions
function endsWithAnyExtension(str, extensions) {
  for (var i = 0; i < extensions.length; i++) {
    var extension = extensions[i];
    if (str.length >= extension.length && str.substr(str.length - extension.length).toLowerCase() === extension.toLowerCase()) {
      return true;
    }
  }
  return false;
}

// Check if a folder is selected
if (folderPath !== null) {
  // Function to import contents recursively
  function importContents(parentFolder, parentItem) {
    var folder = new Folder(parentFolder);
    if (!folder.exists) return;

    var files = folder.getFiles();

    // Flag to track if the first non-folder file has been imported
    var firstNonFolderImported = false;

    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      if (file instanceof Folder) {
        // Check if the folder should be excluded
        if (!isExcluded(file.name)) {
          var newFolder = app.project.items.addFolder(file.name);
          newFolder.parentFolder = parentItem; // Associate folder with its parent
          importContents(file.fsName, newFolder); // Pass the parentItem to the recursive call
        } else {
          // Delete excluded folders and their contents
          file.remove();
        }
      } else {
        // Check if the file's parent folder starts with the specified character
        var parentFolderName = file.parent.displayName;

        // Check if the file should be excluded
        if (!isExcluded(file.name)) {
          if (parentFolderName.indexOf(filterCharacter) !== 0) {
            // Import only the first non-folder file in the folder as an image sequence
            if (!firstNonFolderImported) {
              var sequenceOptions = new ImportOptions(File(file));
              sequenceOptions.sequence = true; // Enable sequence import
              var importedItem = app.project.importFile(sequenceOptions);
                
              importedItem.parentFolder = parentItem; // Associate file with its parent
              firstNonFolderImported = true;
            }
          } else {
            // Import files in folders starting with the specified character
            var sequenceOptions = new ImportOptions(File(file));
            sequenceOptions.forceAlphabetical = true; // Sort files by name
            var importedItem = app.project.importFile(sequenceOptions);
            importedItem.parentFolder = parentItem; // Associate file with its parent
          }
        }
      }
    }
  }

  // Create a root folder item to hold the imported contents
  var rootFolder = app.project.items.addFolder(folderPath.displayName);

  // Run the import function
  importContents(folderPath.fsName, rootFolder);
}
