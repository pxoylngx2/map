var FullScreenNow = false;

function ToggleFullScreen1()
{
	if (FullScreenNow)
	{
		SetStandardStyle();
		
		FullScreenNow = false;
	}
	else
	{
		var leftDiv = document.getElementById("container");		
		leftDiv.style.width = "100%";
		leftDiv.style.height = "100%";
		
		CenterMarker.setMap(null);
		Map.setFitView(Map.getAllOverlays(), true);
		
		FullScreenNow = true;
	}
}