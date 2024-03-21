(function(){

var TimeInFrames = 8; 
var TimeInTicks = TimeInFrames/24 * 254016000000; 
var myItems = app.getCurrentProjectViewSelection()

for (i = 0; i < myItems.length; i++)
{
    try 
    { 
        myItems[i].setInPoint(TimeInTicks.toString(), 4);
    }
    catch(e)
    {
        //nothing
    }

}


})()
