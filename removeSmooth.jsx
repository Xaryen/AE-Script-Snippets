(function() {

app.beginUndoGroup("remove smoothing");


if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
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

var myComp = app.project.activeItem;

if (!myComp || !(myComp instanceof CompItem)) {
    return; 
}

var myLayers = myComp.selectedLayers;
var effectsToRemove = ["OLM Smoother", "PSOFT ANTI-ALIASING"];


function removeEffects(myLayer, effectNames) {
    var myEffects = myLayer.property("ADBE Effect Parade");
    if (!myEffects) return;
    
    for (var i = myEffects.numProperties; i > 0; i--) {
        var myEffect = myEffects.property(i);
        if (effectNames.indexOf(myEffect.matchName)  !== -1) {
            myEffect.remove();
        }

    }

}



for (var i = 0; i < myLayers.length; i++) {
    removeEffects(myLayers[i], effectsToRemove);
}






app.endUndoGroup();
})();




