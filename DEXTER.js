///DEXTER LIBRARY
function DEXTER() {
	this.scr = new screen();
	this.cmnd = new cmnd_prmpt(this);
	
	this.objs = new Array(); 
	
	this.ops = function (arg) {
		switch(arg[0]) {
			case "create":
				if (arg[1]) {
					this.objects(arg);
				} else {
					this.cmnd.print("create what?");
				}
				
				break;
			default:
				this.cmnd.print("Error: Command not recognized");
		}
	}
	this.objects = function (arg) {
		switch(arg[1]) {
			case "polygon":
				penta = new polygon(100,5);
				this.scr.draw(penta);
				this.scr.ctx.stroke();
				
				break;
			default:
				this.cmnd.print("Error: Command not recognized");
		}
	}
	this.render = function() {
		var i;
		
		this.scr.ctx.beginPath();
		for(i = 0;i < this.objs.length; i++) {
			this.scr.draw(this.objs[i]);
		}
		this.scr.ctx.clearRect(-1*(this.scr.obj.width)/2,-1*(this.scr.obj.height)/2,(this.scr.obj.width),(this.scr.obj.height))
		this.scr.ctx.fill();
	}
	
	this.cmnd.print("DEXTER INITIALIZED");
}
function screen() {
	this.obj = document.getElementById("DXTR_CNVS");
	this.ctx = this.obj.getContext("2d");
	
	this.views = new Array;
	this.views[0] = new Camera();
	this.cam = 0;
	
	this.draw = function(obj) {
		var i;
		var M;
		
		M = this.views[this.cam].M_t(obj.Vs[0]);
		this.ctx.moveTo(obj.Vs[0].x*M,-1*obj.Vs[0].y*M);
		for(i = 1; i < obj.Vs.length; i++) {
			M = this.views[this.cam].M_t(obj.Vs[i]);
			this.ctx.lineTo(obj.Vs[i].x*M,-1*obj.Vs[i].y*M);
		}
		this.ctx.closePath();
	};
	
	this.obj.width = document.getElementById("DXTR_WND").clientWidth;
	this.obj.height = document.getElementById("DXTR_WND").clientHeight;
	this.ctx.translate((this.obj.width)/2,(this.obj.height)/2);
}
function cmnd_prmpt(hndlr) {
	this.hndlr = hndlr;
	this.ln = document.getElementById("cmnd_ln");
	this.hs = document.getElementById("cmnd_hs");
	
	this.print = function (arg) {
		this.hs.innerHTML = 	this.hs.innerHTML + "<code>" +
								"<br> >> " + 
								arg + "</code>";
	}
	this.hndl = function () {
		
		//parse command
		var arg = this.ln.value.split(" ");
		
		
		if (arg[0]) { hndlr.ops(arg); }
		
		this.hs.scrollTop = this.hs.scrollHeight;
		this.ln.value = "";
	}
}


Camera.prototype = new Operations();
function Camera() {
	this.F = 1;
	this.Vs = new Vertex(0,0,500);
	
	//WORK ON THIS BEAUTY... FUCK THIS SHIT!!!!!
	this.M_t = function(Vs) {
		dot(Vs,this.Vs);
		//var P = this.Vs.z - Vs.z;
		return 500*this.F/(this.Vs.z - (Vs.z + this.F));
	}
}
function dot(Vs_1,Vs_2) {
	return Vs_1.x*Vs_2.x + Vs_1.y*Vs_2.y + Vs_1.z*Vs_2.z;
}
Polygon.prototype = new Operations();
function Polygon(r,n) {
	this.r = r;					//Radius
	this.n = n;					//Number of sides
	this.Vs = new Array();		//Vertices
	
	
	//MAKE ALL THIS A PROTOTYPE FUNCTION
	var i;						//iterator
	var a = 2*Math.PI/n;		//Angle between vertices
	
	//store vertices
	for(i = 0;i < n; i++) {
		this.Vs[i] = new Vertex(this.r*Math.cos((i)*a),this.r*Math.sin((i)*a),0);
	}
}
function Vertex(x,y,z) {
	this.tx = 0;
	this.ty = 0;
	this.tz = 0;
	
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;
	
	this.gx = x;
	this.gy = y;
	this.gz = z;
	
	this.ux = 0;
	this.uy = 0;
	this.uz = 0;
	
	this.x = x;
	this.y = y;
	this.z = z;
	
	this.M = 0;
	
	this.unitMap = function() {
		this.ux = this.x / this.M;
		this.uy = this.y / this.M;
		this.uz = this.z / this.M;
	}
	this.mag = function() {
		this.M = Math.pow(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2),1/2);
	}
	
	this.translate = function(x,y,z) {
		this.tx += x;
		this.ty += y;
		this.tz += z;
		
		this.remap();
	}
	this.rotate = function(ox,oy,oz) {
		var d;
		
		d = (this.gy + this.ry)*Math.cos(ox) - (this.gz + this.rz)*Math.sin(ox);
		this.rz = (this.gy + this.ry)*Math.sin(ox) + (this.gz + this.rz)*Math.cos(ox);
		this.ry = d;
		
		this.ry = this.ry - this.gy;
		this.rz = this.rz - this.gz;
		
		d = (this.gz + this.rz)*Math.cos(oy) - (this.gx + this.rx)*Math.sin(oy);
		this.rx = (this.gz + this.rz)*Math.sin(oy) + (this.gx + this.rx)*Math.cos(oy);
		
		this.rz = this.rz - this.gz;
		this.rx = this.rx - this.gx;
		
		d = (this.gx + this.rx)*Math.cos(oz) - (this.gy + this.ry)*Math.sin(oz);
		this.ry = (this.gx + this.rx)*Math.sin(oz) + (this.gy+ this.ry)*Math.cos(oz);
		this.rx = d;
		
		
		this.rx = this.rx - this.gx;
		this.ry = this.ry - this.gy;
		
		this.remap();
	}
	this.translationReset = function() {
		this.tx = 0;
		this.ty = 0;
		this.tz = 0;
	}
	this.rotationReset = function() {
		this.rx = 0;
		this.ry = 0;
		this.rz = 0;
	}
	this.remap = function() {
		this.x = this.gx + this.tx + this.rx;
		this.y = this.gy + this.ty + this.ry;
		this.z = this.gz + this.tz + this.rz;
	}
}
function Vertex_new(x,y,z) {
	this.T = new Vector(0,0,0);
	this.R = new Vector(0,0,0);
	this.G = new Vector(x,y,z);
	this.U = new Vector(0,0,0);
	this.P = new Vector(x,y,z);
	
	this.unitMap = function() {
		this.ux = this.x / this.M;
		this.uy = this.y / this.M;
		this.uz = this.z / this.M;
	}
	this.mag = function() {
		this.M = Math.pow(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2),1/2);
	}
	
	this.translate = function(x,y,z) {
		this.tx += x;
		this.ty += y;
		this.tz += z;
		
		this.remap();
	}
	this.rotate = function(ox,oy,oz) {
		var d;
		
		d = (this.gy + this.ry)*Math.cos(ox) - (this.gz + this.rz)*Math.sin(ox);
		this.rz = (this.gy + this.ry)*Math.sin(ox) + (this.gz + this.rz)*Math.cos(ox);
		this.ry = d;
		
		this.ry = this.ry - this.gy;
		this.rz = this.rz - this.gz;
		
		d = (this.gz + this.rz)*Math.cos(oy) - (this.gx + this.rx)*Math.sin(oy);
		this.rx = (this.gz + this.rz)*Math.sin(oy) + (this.gx + this.rx)*Math.cos(oy);
		
		this.rz = this.rz - this.gz;
		this.rx = this.rx - this.gx;
		
		d = (this.gx + this.rx)*Math.cos(oz) - (this.gy + this.ry)*Math.sin(oz);
		this.ry = (this.gx + this.rx)*Math.sin(oz) + (this.gy+ this.ry)*Math.cos(oz);
		this.rx = d;
		
		
		this.rx = this.rx - this.gx;
		this.ry = this.ry - this.gy;
		
		this.remap();
	}
	this.translationReset = function() {
		this.tx = 0;
		this.ty = 0;
		this.tz = 0;
	}
	this.rotationReset = function() {
		this.rx = 0;
		this.ry = 0;
		this.rz = 0;
	}
	this.remap = function() {
		this.x = this.gx + this.tx + this.rx;
		this.y = this.gy + this.ty + this.ry;
		this.z = this.gz + this.tz + this.rz;
	}
}
function Vector(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	
	this.M = 0;
	
	this.mag = function() {
		this.M = Math.pow(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2),1/2);
	}
	
	this.mag();
}
function Operations() {
	this.translate = function(x,y,z) {
		var i;
		for(i = 0;i < this.Vs.length;i++) {
			this.Vs[i].translate(x,y,z);
		}
	}
	this.rotate = function(x,y,z) {
		var i;
		for(i = 0;i < this.Vs.length;i++) {
			this.Vs[i].rotate(x,y,z);
		}
	}
	this.translateReset = function() {
		var i;
		for(i = 0;i < this.Vs.length;i++) {
			this.Vs[i].translateReset();
		}
	}
	this.rotateReset = function() {
		var i;
		for(i = 0;i < this.Vs.length;i++) {
			this.Vs[i].rotateReset();
		}
	}
}
