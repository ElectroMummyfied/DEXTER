function init() {
	
	dxtr = new DEXTER();
	
	var i;
	for(i = 0;i < 4; i++) {
		dxtr.objs[i] = new Polygon(150,i+3);
	}
	dxtr.objs[0].translate(150,150,0);
	dxtr.objs[1].translate(-150,-150,0);
	dxtr.objs[2].translate(-150,150,0);
	dxtr.objs[3].translate(150,-150,0);
	
	
	angle = Math.PI/128;
	setInterval(function () {
		dxtr.objs[0].rotate(angle,0,angle);
		dxtr.objs[1].rotate(angle,0,angle);
		dxtr.objs[2].rotate(-1*angle,0,-1*angle);
		dxtr.objs[3].rotate(-1*angle,0,-1*angle);
		dxtr.render();
	},50);
	
	//dxtr.render();
}
