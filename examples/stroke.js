$(document).ready(function(){
  var get = function(name){
    var val = $("#"+name).val();
    val = parseInt(val);
    if(isNaN(val))
      $("#"+name).val(val = 3);

    return val;
  }
  window.Canvas.init()
  var stroke = new strokejs.Stroke([]);
  var render = function(){

    var simple = stroke.clone();
    simple.simplify( get('epsilon') )
    simple.translate(0, 250)

    window.Canvas.clear()

    window.Canvas.rect(stroke.boundaries(), 1, "#ffbbbb");
    window.Canvas.rect(simple.boundaries(), 1, "#ffbbbb");
    window.Canvas.line(new strokejs.Point([0,250]), new strokejs.Point([500,250]), 1, "#ff0000");
    window.Canvas.path(stroke.points(), 2, "#ff0000");

    window.Canvas.path(simple.points(), 1, "#ff4444");
    for(var i=0;i<simple.getPointCount();i++)
      window.Canvas.point(simple.point(i), 4, "#ff0000");



    var text = "Stroke contain : " + stroke.getPointCount() + " points\n";
    text += "Simplified to : " + simple.getPointCount() + " points\n";

    $("#output").html(text);
  }

  render();
  $("input").change(render)
  $("#clear").click(function(){
    stroke = new strokejs.Stroke([]);
  })
  $("#scale").click(function(){
    stroke.scale(0.7)
    render();
  })
  $("#dodge").click(function(){
    stroke.translate(Math.random()*10-5, Math.random()*10-5)
    render();
  })

  var drawing = false;
  $("canvas:first")
  .mousedown(function(e){

    if(e.offsetY<=250){
      drawing = true;
      stroke = new strokejs.Stroke([]);
      stroke.append([e.offsetX, e.offsetY])
      render();
    }
  })
  .mousemove(function(e){
     if(drawing){
      stroke.append([e.offsetX, Math.min(e.offsetY, 250)])
      render();
    }
  })
  .mouseup(function(e){
    if(drawing){
      drawing = false;
      stroke.append([e.offsetX, Math.min(e.offsetY, 250)])
      render();
    }
  });

});
