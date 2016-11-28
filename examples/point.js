$(document).ready(function(){
  var get = function(name){
    var val = $("#"+name).val();
    val = parseInt(val);
    if(isNaN(val))
      $("#"+name).val(val = 0);

    return val;
  }
  var set = function(name, value){
    var val = parseInt(value);
    if(isNaN(val)) return;
    $("#"+name).val( val + '' );
    return val;
  }

  window.Canvas.init()
  var render = function(){
    var p1 = new strokejs.Point([get('p1x'), get('p1y')]);
    var p2 = new strokejs.Point([get('p2x'), get('p2y')]);
    var l1 = new strokejs.Point([get('l1x'), get('l1y')]);
    var l2 = new strokejs.Point([get('l2x'), get('l2y')]);

    window.Canvas.clear()
    window.Canvas.point(p1, 5, "#ff0000", "P1")
    window.Canvas.point(p2, 5, "#0000ff", "P2")

    window.Canvas.line(l1, l2, 1, "#00ffff")
    window.Canvas.point(l1, 3, "#ff0000")
    window.Canvas.point(l2, 3, "#ff0000", "L1")

    var p1ToL1 = p1.distanceToLine([l1,l2]);

    window.Canvas.circle(p1, p1ToL1, "#ff0000")
    window.Canvas.line(p1, new strokejs.Point([p1.x-p1ToL1, p1.y]), 1, "#ff000000", Math.round(p1ToL1*100)/100+"")

    var text = "Distance between P1 and P2 : " + p1.distanceTo(p2) + "\n";
    text += "Distance between P1 and L2 : " + p1ToL1 + "\n";

    $("#output").html(text);

  }

  var isClicked = function(click, point){
    var point = new strokejs.Point(point);
    return point.distanceTo(new strokejs.Point(click)) < 5;
  }

  render();
  $("input").change(render)

  var drag = false;
  $("canvas:first")
  .mousedown(function(e){
    drag = false;
    if(isClicked([e.offsetX, e.offsetY], [get('p1x'), get('p1y')])) drag = "P1";
    if(isClicked([e.offsetX, e.offsetY], [get('p2x'), get('p2y')])) drag = "P2";
    if(isClicked([e.offsetX, e.offsetY], [get('l1x'), get('l1y')])) drag = "L1";
    if(isClicked([e.offsetX, e.offsetY], [get('l2x'), get('l2y')])) drag = "L2";
  })
  .mousemove(function(e){
    switch (drag) {
      case "P1":
        set("p1x", e.offsetX)
        set("p1y", e.offsetY)
        render();
      break;
      case "P2":
        set("p2x", e.offsetX)
        set("p2y", e.offsetY)
        render();
      break;
      case "L1":
        set("l1x", e.offsetX)
        set("l1y", e.offsetY)
        render();
      break;
      case "L2":
        set("l2x", e.offsetX)
        set("l2y", e.offsetY)
        render();
      break;
    }
  })
  .mouseup(function(){
    drag = false;
  });

});
