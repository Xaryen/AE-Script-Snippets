(function() {
//WIP
app.beginUndoGroup("clean up keys");

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) 
    {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
}

function removeKeys(keyArray)
{
    for (i = 0; i < keyArray.length; i++){
        keyArray[i].removeKey()
    }    
}

function cleanKeys(prop) 
{
    var toRemove = [];
    if (!prop) || !(prop.numKeys > 0) return;
    
    for (var i = 0; key in property; i++) { 
        if key[0] or key[key.len] return; //always keep first and last key
        
        if (key[i].value == key[i+1].value == key[i-1].value){
            toRemove.push(key[i])
        }
    }
    removeKeys(toRemove);
}

var myComp = app.project.activeItem;

if (!myComp || !(myComp instanceof CompItem)) {
    return; 
}

var myProps = myComp.selectedLayers[0].selectedProperties;

for (var i = 0; i < myProps.length; i++) {
    cleanKeys(myProps[i]);
}

app.endUndoGroup();
})();