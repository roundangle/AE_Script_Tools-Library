var OS = (function(){
  function calcDist(point1, point2){
    var a = point1[0] - point2[0];
    var b = point1[1] - point2[1];

    Math.sqrt( a*a + b*b );
  }
  function rotatePoint(anchPnt, pntToRot, newAng, inRadBool) {    // inRadBool true if input is in radians
      // Determine Hypotenuse length
      // var hypLngth = length(anchPnt, pntToRot);   // For Expression only
      var hypLngth = calcDist(anchPnt, pntToRot);   // For Script only
      //Maybe use a Try / Catch

      var coordDist = [Math.abs(anchPnt[0] - pntToRot[0]), Math.abs(anchPnt[1] - pntToRot[1])];  // Determine X & Y dist from anchor
      var curAngle = Math.atan(coordDist[1]/coordDist[0]);

      if ((anchPnt[0] <= pntToRot[0]) && (anchPnt[1] < pntToRot[1])) {
          //curAngle += 0; //no change
      } else if ((pntToRot[0] < anchPnt[0]) && (anchPnt[1] <= pntToRot[1])) {
          curAngle = Math.PI - curAngle; //Angle is measure down from straight line
      } else if ((pntToRot[0] <= anchPnt[0]) && (pntToRot[1] < anchPnt[1])) {
          curAngle = Math.PI + curAngle; //Angle is measure up from straight line
      } else if ((anchPnt[0] < pntToRot[0]) && (pntToRot[1] <= anchPnt[1])) {
          curAngle = (2*Math.PI)- curAngle; //Angle is measure down from full circle
      }

      var newAngleRad;    // Convert to Radians if requested
      if (inRadBool ==  false) {
          newAngleRad = degreesToRadians(newAng);
      } else {
          newAngleRad = newAng;
      }

      // Calc new angle in radians
      newAngle = curAngle + newAngleRad;
      newAngle = newAngle % (2*Math.PI);  //Mod at full circle

      var rotatedPoint = [hypLngth*(Math.cos(newAngle)), hypLngth*(Math.sin(newAngle))];  //determine rotatedPoint value--from anchPnt
      rotatedPoint = [rotatedPoint[0] + anchPnt[0], rotatedPoint[1] + anchPnt[1]];

      return rotatedPoint;
  }

  return {    // Public Functions
    calcDist: calcDist,
    rotatePoint:  rotatePoint
  };
})();
