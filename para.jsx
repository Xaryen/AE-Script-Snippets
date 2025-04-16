(function() {
	app.beginUndoGroup("Create Para");

	var target_layer = null;
	var current_comp = app.project.activeItem;	

	if (current_comp instanceof CompItem) {
		if (current_comp.selectedLayers.length>0) {
			target_layer = current_comp.selectedLayers[0];
		}
	}

	var comp_width = current_comp.width
	var comp_height = current_comp.height

	var para_layer = current_comp.layers.addShape();

	para_layer.name            = "ParaCurve";
	para_layer.adjustmentLayer = true;
	// alternatively use multiply + fill effect like the flare
	//para_layer.transform.opacity.setValue([50]);
	//para_layer.blendingMode  = BlendingMode.MULTIPLY;

	var m_rect  = para_layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
	m_rect.name = "rect";
	m_rect.property("ADBE Vector Rect Size").expression = "posterizeTime(0);[thisComp.width*thisComp.pixelAspect,thisComp.height];";
	m_rect.property("ADBE Vector Rect Position").expression = "posterizeTime(0);[0,0];";
	m_rect.property("ADBE Vector Rect Roundness").expression = "posterizeTime(0);0;";
	para_layer.property("ADBE Transform Group").property("ADBE Anchor Point").expression = "posterizeTime(0);[0,0];";
	para_layer.property("ADBE Transform Group").property("ADBE Position").expression = "posterizeTime(0);[thisComp.width/2, thisComp.height/2];";
	var m_fill  = para_layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
	m_fill.name = "fill";
	m_fill.property("ADBE Vector Fill Color").setValue([1,1,1]);

	var effects_group = para_layer("Effects");
	effects_group.addProperty("ADBE CurvesCustom");
	//var effects_group = para_layer("Effects");
	//effects_group.addProperty("ADBE Fill")("Color").setValue([0,0,0]);

	var a = (comp_height)/2;
	var b = (comp_width)/2;
	var c = comp_height;
	var d = comp_width;
	var x = 1.81;

	var m_mask_shape         = new Shape();
	// Values for a Solid with origin in top left
	//m_mask_shape.vertices    = [[0, a],  [ b,  0],[d, a],  [ b,c]];
	//m_mask_shape.inTangents  = [[0, a/x],[-b/x,0],[0,-a/x],[ b/x,0]];
	//m_mask_shape.outTangents = [[0,-a/x],[ b/x,0],[0, a/x],[-b/x,0]];
	// Values for a shape layer with origin in the center
	m_mask_shape.vertices    = [[-b, 0],  [ 0,-a],  [b, 0],  [ 0,a]];
	m_mask_shape.inTangents  = [[ 0, a/x],[-b/ x,0],[0,-a/x],[ b/x,0]];
	m_mask_shape.outTangents = [[ 0,-a/x],[ b/ x,0],[0, a/x],[-b/x,0]];
	m_mask_shape.closed      = true;

	var m_mask = para_layer.property("ADBE Mask Parade").addProperty("Mask");
	m_mask.property("ADBE Mask Shape").setValue(m_mask_shape);
	m_mask.property("ADBE Mask Feather").setValue([200, 200]);
	m_mask.inverted = true;
	// Optionally:
	//m_mask.rotoBezier = true;

	if (target_layer != null) {
		para_layer.moveBefore(target_layer); 
	}

	para_layer.label = 10;

	app.endUndoGroup();
})();