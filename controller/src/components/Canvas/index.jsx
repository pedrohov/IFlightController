import React, { useEffect, useRef } from "react";

function Canvas(props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "#525564";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  });

  return <canvas ref={canvasRef} {...props} width="300" height="300"></canvas>;
}

export default Canvas;
