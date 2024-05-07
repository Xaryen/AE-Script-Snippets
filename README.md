# A collection of small AE scripts for animation production.

## Standalone scripts:

### addShapeAdjustmentLayer:
Adds a shape layer with expressions that fills the entire comp, sets it as an adjustment layer

### importFolder:
Imports a folder and all it's contents into an AE project, recreates the folder structure in the project panel.  
For subfolders starting with "_" contents will be imported as individual images, for rest as img sequences.

### Mker:
Create palette with buttons based on the contents of the specified folder, made for quick importing of images such as for Marking(MK).

### removeSmooth:
Removes smoothing effects(by default OLM smoother and PSOFT anti-aliasing) from the selected layer(s)

### reverseOrder:
Reverses the order of (only) the selected layers.

### sortLayers:
Sorts layers in the selected comp so that camera/layout is on top, bg on bottom and cels inbetween sorted in correct reverse alphabetical order.

### celManager
Precomp and rename cels. ScriptUI.

### setPremiereSlate:
Premiere pro script, sets the in point of all the selected items to the specified value (8 by default)

## Functions:

### scriptUI_boilerplate: 
Boilerplate for a dockable Script UI

### validatePathWithRegex
used to check if the path of a file/folder exists and make sure it's the newest revision (based on the amount of _R appended to the name, e.g. WORK_EPISODE#_CUT#_paint_RRR)
