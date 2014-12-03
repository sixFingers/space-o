/***************************************************************************
 *   Copyright (C) 2013, Paul Lutus                                        *
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 *   This program is distributed in the hope that it will be useful,       *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
 *   GNU General Public License for more details.                          *
 *                                                                         *
 *   You should have received a copy of the GNU General Public License     *
 *   along with this program; if not, write to the                         *
 *   Free Software Foundation, Inc.,                                       *
 *   59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.             *
 ***************************************************************************/
var engine = engine || {}

engine.G = 6.6742e-11; // universal gravitational constant

engine.frame_delay_ms = 4; // milliseconds

engine.frame_count = 0;
engine.animate = true;
engine.legend = true;
engine.darkEnergyFlag = false;

engine.toRad = Math.PI / 180.0;

engine.xAngle = 0;
engine.yAngle = -20;

engine.oldXAngle = engine.xAngle;
engine.oldYAngle = engine.yAngle;

engine.initx = 0;
engine.inity = 0;

engine.anaglyphic = false;
engine.anaglyphSep = 0.1;

engine.zoom = 1.0;

// initial drawing scale
engine.drawingScale = 1e-12;

// perspective factor
engine.pFactor = 1000;

engine.inverse = false;

engine.cometFlag = true;
engine.cometCount = 16;
engine.planetFlag = true;
engine.orbitTimer = null;

engine.zoomFlag = false;

engine.ntrp = function(x,xa,xb,ya,yb) {
  return (x-xa) * (yb-ya) / (xb-xa) + ya;
}

engine.reset = function() {
  // set defaults after reset is pressed
  engine.xAngle = 0;
  engine.yAngle = -20;
  engine.oldXAngle = engine.xAngle;
  engine.oldYAngle = engine.yAngle;
  engine.zoom = 1.0;
  engine.orbit_timer = null;
  engine.darkEnergyCheck.checked = false;
  engine.animateCheck.checked = true;
  engine.anaglyphicCheck.checked = false;
  engine.inverseCheck.checked = false;
  engine.legendCheck.checked = true;
  engine.cometCheck.checked = true;
  engine.planetCheck.checked = true;
  engine.orbit_data = new OrbitData();
  engine.readControls();
  engine.setupControlEvents();
  if(engine.orbitTimer == null) {
    engine.perform(true);
  }
}

engine.updateTrigValues = function(xa,ya) {
  xa *= engine.toRad;
  ya *= engine.toRad;
  engine.sinx = Math.sin(xa);
  engine.cosx = Math.cos(xa);
  engine.siny = Math.sin(ya);
  engine.cosy = Math.cos(ya);
}

engine.perform = function(oneFrame) {
  var fd = engine.frame_delay_ms;
  if(engine.animate || oneFrame) {
    engine.render(oneFrame);
    engine.frame_count += 1;
  }
  else {
    // wait for user to enable animation
    fd = 100;
  }
  if(!oneFrame || engine.orbitTimer == null) {
    engine.orbitTimer = setTimeout(engine.perform,fd,false);
  }
}

// perform gravitational computations
engine.updateObjects = function(array, dt) {
  // lambda (ðš²) = dark energy term
  var lambda = (engine.darkEnergyFlag) ? parseFloat(engine.darkEnergyControl.value) : 0.0;
  // compute gravitation only wrt the sun, not wrt all other bodies
  for (var i = 0;i < array.length;i++) {
    engine.updateOrbit(array[i], engine.sun, dt, lambda);
  }
}

// perform a time step in a physics numerical differential equation
engine.updateOrbit = function(pa, pb, dt, lambda) {
  // don't compute self-gravitation
  if (pa != undefined && pb != undefined && pa != pb) {
    // this trig-free method does this:
    // 1. vel += dt * radius * -G * mass * radius.abs()^-3
    // 2. pos += dt * vel
    // including an optional dark energy constant (lambda)

    // compute radius of separation
    var radius = pa.pos.sub(pb.pos);
    // update velocity with gravitational acceleration
    pa.vel.addTo(radius.mult(dt * (lambda - engine.G * pb.mass * radius.invSumCube())));
    // update position with velocity
    pa.pos.addTo(pa.vel.mult(dt));
  }
}


// class OrbitData, a collection of planets and comets
function OrbitData() {
  // create a solar system with known planet traits

  this.genPlanets = function() {
    // name,distance from sun,mass,orbital velocity
    var raw_data =
    "Name,OrbitRad,BodyRad,Mass,OrbitVel\n"
    + "Sun,0,695000000,1.989E+030,0\n"
    + "Mercury,57900000000,2440000,3.33E+023,47900\n"
    + "Venus,108000000000,6050000,4.869E+024,35000\n"
    + "Earth,150000000000,6378140,5.976E+024,29800\n"
    + "Mars,227940000000,3397200,6.421E+023,24100\n"
    + "Jupiter,778330000000,71492000,1.9E+027,13100\n"
    + "Saturn,1429400000000,60268000,5.688E+026,9640\n"
    + "Uranus,2870990000000,25559000,8.686E+025,6810\n"
    + "Neptune,4504300000000,24746000,1.024E+026,5430\n"
    // I guess Pluto isn't really a planet any more, but...
    + "Pluto,5913520000000,1137000,1.27E+022,4740\n";

    this.planet_array = new Array();
    var sdat = raw_data.split("\n");
    var vals = new Array();
    var len = (engine.planetFlag)?sdat.length:2;
    for(var i = 1;i < len;i++) {
      var fields = sdat[i].split(",");
      if(fields[0].length > 0) {
        for(var j = 1;j < fields.length;j++) {
          vals[j-1] = parseFloat(fields[j]);
        }
      }
      var pos = new Cart3(-vals[0], 0, 0);
      var vel = new Cart3(0, 0, vals[3]);
      var color = engine.planetColors[i % engine.planetColors.length];
      var body = new OrbitBody(fields[0], vals[1], pos, vel, vals[2], color);
      this.planet_array.push(body);
    }
    engine.sun = this.planet_array[0];
  }

  // create some randomly placed comets with elliptical orbits

  this.genComets = function(count) {
    this.comet_array = new Array();
    for (var i = 0; i < count; i++) {
      name = "comet" + i;
      var ca = Math.random() * 360; // angle in x-z plane
      var cr = (Math.random() * 100000) + 100000; // distance from sun
      cr *= 4e6;
      var pos = new Cart3(cr * Math.sin(ca * engine.toRad), 0, cr * Math.cos(ca * engine.toRad));
      // comet initial velocity
      var v = ((Math.random() * 200) + 100) * 50.0;
      v = (i % 2 == 1) ? -v : v;
      var vel = new Cart3(0, v, 0);
      var color = engine.planetColors[i % engine.planetColors.length];
      var comet = new OrbitBody(name, 1e3, pos, vel, 1e9, color);
      this.comet_array.push(comet);
    }
  }
  this.genPlanets();
  this.genComets(engine.cometCount);
}

// class OrbitBody, a simple data class

OrbitBody = function(name, radius, pos, vel, mass, color) {
  this.name = name; // string
  this.radius = radius; // scalar
  this.mass = mass; // scalar
  this.pos = pos; // Cart3 3D vector
  this.vel = vel; // Cart3 3D vector
  this.color = color; // string
}

// class Cart3, a three-simensional Cartesian vector class

function Cart3(x,y,z) {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  if(x instanceof Cart3) {
    this.x = x.x;
    this.y = x.y;
    this.z = x.z;
  }
  else {
    if(x != undefined) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }
  this.sub = function(a) {
    return new Cart3(this.x - a.x, this.y - a.y, this.z - a.z);
  }

  this.mult = function(m) {
    return new Cart3(this.x * m, this.y * m, this.z * m);
  }

  this.addTo = function(a) {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
    return this;
  }

  this.invSumCube = function() {
    return Math.pow(this.x*this.x + this.y*this.y + this.z*this.z,-1.5);
  }

  this.abs = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  }

  this.toString = function() {
    return this.x + "," + this.y + "," + this.z;
  }
}
