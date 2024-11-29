function CreateFish()
{
	fish = {};	
	
	var imgnode = document.createElement('img');
	imgnode.setAttribute('src', 'icon/cat6.png');
	imgnode.style.position = 'absolute';
	
	var leftDiv = document.getElementById("container");
	leftDiv.appendChild(imgnode);
	
	fish.Img = imgnode;
	
	RefreshFish(fish);
	
	return fish;
}

function RefreshFish(fish)
{
	var leftDiv = document.getElementById("container");
	
	fish.Pos = 
		[Math.random() * (leftDiv.offsetWidth - fish.Img.offsetWidth) + fish.Img.offsetWidth * 0.5,
		Math.random() * (leftDiv.offsetHeight - fish.Img.offsetHeight) + fish.Img.offsetHeight * 0.5];

	fish.Img.style.left = fish.Pos[0] - fish.Img.offsetWidth * 0.5;
	fish.Img.style.top = fish.Pos[1] - fish.Img.offsetHeight * 0.5;
}

function CreateCat(type)
{
	var cat = {};
	cat.Pos = [0, 0];
	cat.Speed = [0, 0];
	cat.Score = 30;
	cat.Type = type;

	var imgnode = document.createElement('img');
	imgnode.setAttribute('src', 'icon/cat' + cat.Type + '.png');
	imgnode.style.position = 'absolute';
	
	var leftDiv = document.getElementById("container");
	leftDiv.appendChild(imgnode);
	
	cat.Img = imgnode;
	UpdateCatPos(cat);
	
	return cat;
}

function UpdateCatPos(cat)
{
	var image = cat.Img;
	var leftDiv = document.getElementById("container");
	
	if (cat.Pos[0] > image.offsetWidth * 0.5 && cat.Pos[0] < leftDiv.offsetWidth - image.offsetWidth * 0.5)
		image.style.left = cat.Pos[0] - image.offsetWidth * 0.5;
	if (cat.Pos[1] > image.offsetHeight * 0.5 && cat.Pos[1] < leftDiv.offsetHeight - image.offsetHeight * 0.5)
		image.style.top = cat.Pos[1] - image.offsetHeight * 0.5;
	
	image.style.width = cat.Score;
	image.style.height = cat.Score;
}

const ACC = 70;
	
function UpdateCat(cat)
{	
	var func = this["GetAcc" + cat.Type];
	var acc = func(cat);
	acc = V2Normal(acc);
	acc = V2Times(acc, ACC);
	
	//console.log(acc);
	
	var now = new Date().getTime();
	var delta = (now - cat.LastUpdate) / 1000;
	
	var move = V2Times(cat.Speed, delta);
	var speedAdd = V2Times(acc, delta);
	
	//console.log(delta, move, speedAdd);
	
	cat.Pos = V2Add(cat.Pos, move);
	cat.Speed = V2Add(cat.Speed, speedAdd);	
	
	if (cat.Pos[0] < cat.Img.offsetWidth * 0.5)
	{	
		cat.Pos[0] = cat.Img.offsetWidth * 0.5;
		//cat.Speed[0] = 0;		
	}
	if (cat.Pos[0] > leftDiv.offsetWidth - cat.Img.offsetWidth * 0.5)
	{	
		cat.Pos[0] = leftDiv.offsetWidth - cat.Img.offsetWidth * 0.5;
		//cat.Speed[0] = 0;		
	}
	if (cat.Pos[1] < cat.Img.offsetHeight * 0.5)
	{	
		cat.Pos[1] = cat.Img.offsetHeight * 0.5;
		//cat.Speed[1] = 0;		
	}
	if (cat.Pos[1] > leftDiv.offsetHeight - cat.Img.offsetHeight * 0.5)
	{	
		cat.Pos[1] = leftDiv.offsetHeight - cat.Img.offsetHeight * 0.5;
		//cat.Speed[1] = 0;		
	}
	UpdateCatPos(cat);
	
	if (V2Dis(cat.Pos, Fish.Pos) < cat.Score * 0.8)
	{
		cat.Score += 1;
		RefreshFish(Fish);
	}
	
	cat.LastUpdate = new Date().getTime();
}

function GetAcc0(cat)
{
	var toTarget = V2Minus(Fish.Pos, cat.Pos);
	var speed = V2Length(cat.Speed);	
	var dot = 1;
	if (speed > 1)
		dot = V2Dot(toTarget, cat.Speed);
	if (dot > 0.998)
		acc = V2Normal(toTarget);
	else
		acc = V2Times(V2Normal(cat.Speed), -1);
	
	return acc;
}

function GetAcc1(cat)
{
	var toTarget = V2Minus(Fish.Pos, cat.Pos);
	var speed = V2Length(cat.Speed);	
	var dot = 1;
	if (speed > 1)
		dot = V2Dot(toTarget, cat.Speed);
	if (dot > 0.998)
	{
		var sl = GetSlowDownDis(speed, 50, ACC);
		if (sl * 1.01 > V2Length(toTarget))
			acc = V2Times(V2Normal(cat.Speed), -1);
		else
			acc = V2Normal(toTarget);
	}
	else
		acc = V2Times(V2Normal(cat.Speed), -1);
	
	return acc;
}

function GetAcc2(cat)
{
	var toTarget = V2Minus(Fish.Pos, cat.Pos);
	var speed = V2Length(cat.Speed);
	var dot = 1;
	if (speed > 1)
		dot = V2Dot(toTarget, cat.Speed);
	
	var v1 = V2Normal(toTarget);
	var v2 = V2Times(V2Normal(cat.Speed), -1);

	//if (speed > 70 && dot < 0.998)
	//	return v2;
	//else
	//	return v1;//
	
	if (dot > 0.998)
		acc = v1;
	else
		return V2Add(V2Times(v1, 0.5), V2Times(v2, 0.5));
	
	return acc;
	//console.log(v1,v2)
	//return V2Add(v1, v2);
}