/**
 * checks if a path to a folder/file is valid, find the most recent retake version if present (based on _r appended to the name, e.g. TITLE01_001_paint_rr for a second retake)
 * @param {string} basePath - the base path where the item e.g. a cut folder or a bg file will be located
 * @param {string} regexPattern - the naming scheme used for the give work, the suffix like _paint or _BG or a file extension isn't needed
 * @param {string} inputType - either "file" or "folder"
 * @returns {string|null} if the path is valid it returns the full path to the file or folder, otherwise returns null
 *
 * Example usage
 * 1: for folder
 * var basePath = "E:/WORKTITLE/EPISODE 01/0-3_CEL_FOLDER/";
 * var testVar = "TITLE01_C001";
 * var regexPattern = "^" + RegExp.escape(testVar);
 * var type = "folder"; 
 * var path = validatePathWithRegex(basePath, regexPattern, type);
 * 2: for file
 * var basePath = "E:/WORKTITLE/EPISODE 01/0-1_BG/";
 * var testVar = "TITLE01_C001";
 * var regexPattern = "^" + RegExp.escape(testVar);
 * var type = "file"; 
 * var path = validatePathWithRegex(basePath, regexPattern, type);
 * check the result:
 * $.writeln("Selected item: " + path);
 */
(function(){

function validatePathWithRegex(basePath, regexPattern, inputType) {
    var base = new Folder(basePath)
    var maxRetakeCount = -1; // Set to -1 so items with no 'r's can be considered
    var verifiedPath = null;
    var isFolder = inputType === "folder" || (!inputType && base instanceof Folder);

    if (base.exists) {
        var items = base instanceof Folder ? base.getFiles() : [base];

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isItemFolder = item instanceof Folder;
            var isItemTypeMatched = isFolder ? isItemFolder : !isItemFolder;
            var valRegex = new RegExp(regexPattern, "i");

            if (isItemTypeMatched && valRegex.test(item.name)) {
                var match = item.name.match(/_r+/gi) || [];
                var rCount = match.join('').length - match.length; 

                if (rCount >= maxRetakeCount) {
                    maxRetakeCount = rCount;
                    verifiedPath = item;
                }
            }
        }
    }

    if (!verifiedPath) {
        verifiedPath = isFolder ? base.selectDlg("No matching folder found. Please select a folder.") :
                                  base.openDlg("No matching file found. Please select a file.");
    }

    return verifiedPath ? verifiedPath.fsName : null;
}

RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};



}());

