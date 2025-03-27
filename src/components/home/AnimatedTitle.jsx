import { useEffect, useRef } from "react";

const AnimatedTitle = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let progress = 0;
    let animationFrameId;

    const easeInOutQuart = (x) => {
      return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    };

    const drawText = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let fontSize;
      if (window.innerWidth > 1200) {
        fontSize = window.innerWidth * 0.1;
      } else if (window.innerWidth > 768) {
        fontSize = window.innerWidth * 0.08;
      } else {
        fontSize = window.innerWidth * 0.06;
      }

      fontSize = Math.min(Math.max(fontSize, 32), 120);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = 0.5 + 0.5 * easeInOutQuart(progress);

      // Text settings
      ctx.font = `${fontSize * scale}px Graphik`;
      ctx.textAlign = "center";
      ctx.letterSpacing = "0.1em";
      ctx.textBaseline = "middle";

      // Draw the full text
      ctx.fillStyle = "black";
      ctx.fillText("POWERHOUSE", canvas.width / 2, canvas.height / 2);

      // Create gradient mask for fade effect
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(progress, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(progress + 0.1, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      // Apply mask
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      if (progress < 1) {
        progress += 0.003;
        animationFrameId = requestAnimationFrame(drawText);
      }
    };

    drawText();

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      progress = 1;
      drawText();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

export default AnimatedTitle;
