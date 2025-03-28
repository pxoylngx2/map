var StartDate;
var MovingOnMap = false;
var NowPoly;
var NowPolyText2;
const MOVE_SPEED = {"walk":5, "ride":20, "bus":30, "metro":50, "ship":20, "car":120, "train":200, "plane":1000};
const STANDARD_MAP_WIDTH = 956.2;

MoveMarker = new AMap.Marker(
{
	position:Map.getCenter(),
	offset: new AMap.Pixel(-15, -15)
})

function MoveOnMap()
{
	if (!MovingOnMap)
	{
		if (!FullScreenScript || !FullScreenNow)
			ToggleFullScreen();
		
		FitAll();
		Map.remove(Map.getAllOverlays());
		MoveMarker.setMap(Map);
		StartDate = new Date().getTime();
		MoveOnMapID = 0;
		MovingOnMap = true;
		NowPoly = null;
		
		NowPath = 0;
		NowSubpath = -1;
		NowPoint = -2;
		
		function MoveOnce()
		{
			var now = new Date().getTime();
			
			if (!MovingOnMap)
			{
				MoveMarker.setMap(null);
				RedrawMap();
				return;
			}
		
			var time = now - StartDate; // ms						
			
			//console.log(time);

			while (time > 0)
			{
				NowPoint++;
				if (NowPoint < 0 || NowPoint >= paths[NowPath].subpaths[NowSubpath].points.length)
				{
					NowPoint = 0;
					NowSubpath++;
					if (NowSubpath >= paths[NowPath].subpaths.length)
					{
						NowSubpath = 0;
						NowPath++;
					}
					
					if (NowPath >= paths.length)
					{
						NowPath = paths.length - 1;
						NowSubpath = paths[NowPath].subpaths.length - 1;
						NowPoint = paths[NowPath].subpaths[NowPoint].points.length - 1;
						MovingOnMap = false;
						setTimeout(MoveOnce, 100);
						return;
					}
					
					if (NowPoly && NowPoly.Text2)
						NowPoly.Text2.setMap(Map);
					NowPoly = GetPoly(paths[NowPath].subpaths[NowSubpath], paths.length == 1);
					NowPoly.setPath([ paths[NowPath].subpaths[NowSubpath].points[0], paths[NowPath].subpaths[NowSubpath].points[0] ]);
					if (NowPoly && NowPoly.Text2)
						NowPoly.Text2.setMap(null);
					
					// 屏幕越大，等级越大（比例尺越大）
					var rate = MapWidth / STANDARD_MAP_WIDTH;
					var lgrate = Math.log2(rate);
					if (paths.length == 1)
					{
						Map.setZoom(ZOOM_VIEW[paths[NowPath].subpaths[NowSubpath].category] + lgrate);
					}
					else
					{
						Map.setZoom(11 + lgrate);
					}
					Map.panTo(paths[NowPath].subpaths[NowSubpath].points[0]);
					
					var icon1 = new AMap.Icon(
					{
						size: new AMap.Size(30, 30),    // 图标尺寸
						image: "icon/" + paths[NowPath].subpaths[NowSubpath].category + ".png",
						imageSize: new AMap.Size(30, 30),   // 根据所设置的大小拉伸或压缩图片
					});
					MoveMarker.setIcon(icon1);
					
					StartDate = StartDate + 2000;
				}
				else
				{			
					var d = GetDis(paths[NowPath].subpaths[NowSubpath].points[NowPoint], paths[NowPath].subpaths[NowSubpath].points[NowPoint - 1]);
					// 8小时→4分钟（1条轨迹时）
					var dt = d / (MOVE_SPEED[paths[NowPath].subpaths[NowSubpath].category] * 1000 / 3600000) / 120;
					
					var lgrate = Math.log2(paths.length + 1) / paths.length;
					dt *= lgrate;
					
					//console.log(d, dt, MOVE_SPEED[paths[NowPath].subpaths[NowSubpath].type]);
					time -= dt;
					
					var arr = NowPoly.getPath();
					if (time > 0)
					{
						arr[arr.length - 1] = paths[NowPath].subpaths[NowSubpath].points[NowPoint];
						arr[arr.length] = paths[NowPath].subpaths[NowSubpath].points[NowPoint];
						
						//console.log(arr);
						StartDate = StartDate + dt;
					}
					else
					{
						var rate = (dt + time) / dt; // 接近NowPoint的比例 0-1
						
						var p1 = paths[NowPath].subpaths[NowSubpath].points[NowPoint];
						var p2 = paths[NowPath].subpaths[NowSubpath].points[NowPoint - 1];
						var p = [ p1.lng * rate + p2.lng * (1 - rate), p1.lat * rate + p2.lat * (1 - rate) ];
						arr[arr.length - 1] = p;
						
						//console.log(rate, p1, p2, p, arr);
						NowPoint--;
					}
					
					var pp = arr[arr.length - 1];
					var pixel = Map.lngLatToContainer(pp);
					var size = Map.getSize();
					var rate1 = pixel.x / size.width;
					var rate2 = pixel.y / size.height;
					//console.log(pixel, size, rate1, rate2);
					if (rate1 < 0.2 || rate1 > 0.8 || rate2 < 0.2 || rate2 > 0.8)
						Map.panTo(pp);
						
					MoveMarker.setPosition(pp);
					NowPoly.setPath(arr);
				}							
			}
			
			//var now2 = new Date().getTime();
			//var time2 = now2 - now; // ms	
			setTimeout(MoveOnce, 40);
		}
		
		setTimeout(MoveOnce, 40);
	}
	else
	{
		MovingOnMap = false;
	}
}