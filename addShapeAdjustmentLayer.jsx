
{
	app.beginUndoGroup("new shape adjustment layer");

	var ac = app.project.activeItem;
	var targetLayer = null;
		
	if (ac instanceof CompItem) 
	{
		if ( ac.selectedLayers.length>0)
		{
			targetLayer = ac.selectedLayers[0];
		}
	}
	else
	{
		alert("Please select a composition",this.cap);
	}
	
	var myShapeLayer = ac.layers.addShape();
		myShapeLayer.name = "ADJ"
	
	var rct = myShapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
	rct.name = "rect";

	//Add expressions  to auto resize/position layer, posterizetime(0) means expression only updates once on first frame
	rct.property("ADBE Vector Rect Size").expression = "posterizeTime(0);[thisComp.width*thisComp.pixelAspect,thisComp.height];";
	rct.property("ADBE Vector Rect Position").expression = "posterizeTime(0);[0,0];";
	rct.property("ADBE Vector Rect Roundness").expression = "posterizeTime(0);0;";

	myShapeLayer.property("ADBE Transform Group").property("ADBE Anchor Point").expression = "posterizeTime(0);[0,0];";
	myShapeLayer.property("ADBE Transform Group").property("ADBE Position").expression = "posterizeTime(0);[thisComp.width/2, thisComp.height/2];";

	var fil = myShapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
	fil.name = "fill";
	fil.property("ADBE Vector Fill Color").setValue( [1,1,1] );

	myShapeLayer.adjustmentLayer = true;

	if ( targetLayer != null)
	{
		myShapeLayer.moveBefore(targetLayer); 
	}

	app.endUndoGroup();
}