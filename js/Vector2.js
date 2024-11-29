function V2Add(v1, v2)
{
	return [v1[0] + v2[0], v1[1] + v2[1]];
}

function V2Minus(v1, v2)
{
	return [v1[0] - v2[0], v1[1] - v2[1]];
}

function V2Times(v, a)
{
	return [v[0] * a, v[1] * a];
}

function V2Length(v)
{
	return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function V2Normal(v)
{
	var length = V2Length(v);
	if (length < 0.001)
		return [0, 0];
	else
		return V2Times(v, 1 / length);
}

function V2Dis(v1, v2)
{
	var v = V2Minus(v1, v2);
	
	return V2Length(v);
}

function V2Dot(v1, v2)
{
	return (v1[0] * v2[0] + v1[1] * v2[1]) / (V2Length(v1) * V2Length(v2));
}
