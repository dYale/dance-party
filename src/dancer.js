function Dancer(top, left, timeBetweenSteps, number) {
  this.$node = $('<img src="src/img/guy.png" class="dancer"/>');
  this.timeBetweenSteps = timeBetweenSteps;
  this.behavior = "default";
  this.step();
  this.setPosition(top, left);
  this.number = number;
  this.partner = null;
}

Dancer.prototype.step = function() {
  
  if (this.$node.is(':visible')) {
    this.$node.toggleClass('flipped');
  }

  if (this.behavior === "default") {
    this.defaultStep();
  } else {
    this[this.behavior]();
  }
  // Bind like a boss; otherwise when setTimeout calls step, window will be the "this".
  setTimeout(this.step.bind(this), (this.behavior === "default" ? this.timeBetweenSteps : 400));
};

Dancer.prototype.x_pos = function () {
  return parseInt(this.$node.css("left"),10);
};

Dancer.prototype.y_pos = function () {
  return parseInt(this.$node.css("top"),10);
};

Dancer.prototype.setPosition = function (top, left) {
  var styleSettings = {
    top: top,
    left: left
  };
  this.$node.css(styleSettings);
};

Dancer.prototype.moveTo = function (top, left, speed) {
  speed = speed || 200;
  var styleSettings = {
    top: top,
    left: left
  };
  this.$node.animate(styleSettings, speed, "linear");
};

Dancer.prototype.lineUp = function() {
  this.$node.show();
  var height = $('body').height();
  var targety = 40 + (24*this.number) % (Math.floor((height - 40)/24)*24);
  var targetx = 50 + 24*Math.floor((40+24*(this.number-1))/(Math.floor((height - 40)/24)*24));
  // We check if they're positioned in line so they don't queue up a lot of animations.
  if (parseInt(this.$node.css("top"),10) !== targety || parseInt(this.$node.css("left"),10) !== targetx) {
    this.moveTo(targety,targetx, "slow");
  }
};

Dancer.prototype.conga = function() {
  this.$node.show();
  // Leader.
  var x, y;
  if (this.partner === null) {
    var angle = generateAngle(20);
    var radius = Math.cos(angle)*Math.cos(angle)*$('body').width()/2.3;

    x = radius*Math.cos(angle) + $('body').width()/2 + Math.random()*$('body').width()/30;
    y = (radius*Math.cos(angle) < 0 ? 1 : -1)*radius*Math.sin(angle) + $('body').height()/2 + Math.random()*$('body').height()/20;

    if (calcDistance(this.x_pos(), this.y_pos(), x, y) > 100) {
      x = this.x_pos() + (x-this.x_pos())/3;
      y = this.y_pos() + (y-this.y_pos())/3;
    }

    this.moveTo(y, x, 280);
  // Follower.
  } else {
    x = this.partner.x_pos();
    y = this.partner.y_pos();

    var distance = calcDistance(this.x_pos(), this.y_pos(), x, y);
    if (distance > 200) {
      x = this.x_pos() + 60*(x-this.x_pos())/distance;
      y = this.y_pos() + 60*(y-this.y_pos())/distance;
    }

    if (parseInt(this.$node.css("top"),10) !== y || parseInt(this.$node.css("left"),10) !== x) {
      this.moveTo(y, x, 280);
    }
  }
};

Dancer.prototype.battle = function() {
  this.$node.show();

  var x_mid = (this.x_pos() + this.partner.x_pos())/2;
  var y_mid = (this.y_pos() + this.partner.y_pos())/2;
  var new_x, new_y;


  var distance = calcDistance(this.x_pos(), this.y_pos(), this.partner.x_pos(), this.partner.y_pos());
  if (distance > 30) {

    new_x = this.x_pos() + 60*(x_mid - this.x_pos())/distance;
    new_y = this.y_pos() + 60*(y_mid - this.y_pos())/distance;

  } else {

    var angle = (generateAngle(2) + Math.floor(this.number/2)) % (2 * Math.PI);
    var radius = 10;

    new_x = x_mid + (2*(this.number % 2) - 1)*radius*Math.cos(angle);
    new_y = y_mid + (2*(this.number % 2) - 1)*radius*Math.sin(angle);

  }

  this.moveTo(new_y, new_x);
};


