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

    const easeInExpo = (x) => {
      return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    };

    const easeOutExpo = (x) => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    // Image grid setup
    const IMAGE_WIDTH = 350;
    const SQUARE_HEIGHT = IMAGE_WIDTH;
    const RECT_HEIGHT = IMAGE_WIDTH * 1.5;
    const SPACING = IMAGE_WIDTH * 0.2;

    const imageUrls = [
      "https://static.powerhouse-company.com/wp-content/uploads/2022/06/21085946/New-00.jpg",
      "https://static.powerhouse-company.com/wp-content/uploads/2021/07/30095141/Powerhouse-Company-District-E-01.jpg",
    ];

    const generateImages = () => {
      const images = [];
      const TOTAL_IMAGES = 100;
      const COLUMNS = 10;
      const IMAGES_PER_COLUMN = Math.ceil(TOTAL_IMAGES / COLUMNS);

      const TEXT_ANIMATION_DELAY = 0.3;
      const initialScaleFactor = 0.2;

      // Calculate full canvas spread
      const viewportWidth = window.innerWidth;
      const totalWidth = viewportWidth * 0.9; // Use 90% of viewport width
      const initialColumnSpacing = totalWidth / (COLUMNS - 1); // Space columns evenly

      for (let col = 0; col < COLUMNS; col++) {
        // Final positions (spread out)
        const xPosition = (col - (COLUMNS - 1) / 2) * (IMAGE_WIDTH + SPACING);
        let yPosition = -(IMAGES_PER_COLUMN * (RECT_HEIGHT + SPACING)) / 2;

        // Initial position spread across full width
        const initialX = -totalWidth / 2 + col * initialColumnSpacing;

        for (let i = 0; i < IMAGES_PER_COLUMN; i++) {
          const isRectangle = Math.random() < 0.5;
          const height = isRectangle ? RECT_HEIGHT : SQUARE_HEIGHT;

          const delay = TEXT_ANIMATION_DELAY + (Math.random() * 0.2 + 0.1);

          images.push({
            url: isRectangle ? imageUrls[1] : imageUrls[0],
            x: initialX, // Start position spread across viewport
            y: yPosition * initialScaleFactor,
            width: IMAGE_WIDTH,
            height: height,
            delay: delay,
            initialScale: 0.2,
            targetScale: 1,
            finalX: xPosition, // Final position remains the same
            finalY: yPosition,
          });

          yPosition += height + SPACING;
        }
      }
      return images;
    };

    const allImages = generateImages();

    // Load images
    const loadedImages = allImages.map((img) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = img.url;
        image.onload = () => resolve({ ...img, element: image });
      });
    });

    // Add mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let hoveredImage = null;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left - canvas.width / 2;
      mouseY = e.clientY - rect.top - canvas.height / 2;
    });

    const drawText = (loadedImgs = []) => {
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

      // Original text animation with gradient mask
      const scale = 0.5 + 0.5 * easeInOutQuart(Math.min(1, progress));
      ctx.font = `${fontSize * scale}px Graphik`;
      ctx.textAlign = "center";
      ctx.letterSpacing = "0.1em";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black";
      ctx.fillText("POWERHOUSE", canvas.width / 2, canvas.height / 2);

      // Create gradient mask for text fade effect
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(Math.min(1, progress), "rgba(255, 255, 255, 1)");
      gradient.addColorStop(
        Math.min(1, progress + 0.1),
        "rgba(255, 255, 255, 0)"
      );
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      // Apply mask to text
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      // After text animation, draw images
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      loadedImgs.forEach((img) => {
        if (img.element) {
          const imageProgress = Math.min(
            1,
            Math.max(0, (progress - img.delay) * 1.5)
          );

          const easedProgress = easeInOutQuart(imageProgress);

          ctx.globalAlpha = Math.min(1, imageProgress * 1.5);

          const currentX = img.x + (img.finalX - img.x) * easedProgress;
          const currentY = img.y + (img.finalY - img.y) * easedProgress;

          // Check hover only after initial animation
          if (imageProgress >= 1) {
            const dx = mouseX - currentX;
            const dy = mouseY - (currentY + img.height / 2);
            const isHovered =
              Math.abs(dx) < img.width / 2 && Math.abs(dy) < img.height / 2;

            if (isHovered) {
              hoveredImage = img;
              canvas.style.cursor = "pointer";
            } else if (hoveredImage === img) {
              hoveredImage = null;
              canvas.style.cursor = "default";
            }
          }

          // Add subtle hover scale
          let currentScale =
            img.initialScale +
            (img.targetScale - img.initialScale) * easedProgress;
          if (hoveredImage === img) {
            currentScale *= 1.05; // 5% scale up on hover
          }

          ctx.save();
          ctx.translate(currentX, currentY + img.height / 2);
          ctx.scale(currentScale, currentScale);
          ctx.drawImage(
            img.element,
            -img.width / 2,
            -img.height / 2,
            img.width,
            img.height
          );
          ctx.restore();
        }
      });

      ctx.restore();

      // Update progress during animation phase
      if (progress < 1.1) {
        progress += 0.003;
      }

      // Always continue the animation loop
      animationFrameId = requestAnimationFrame(() => drawText(loadedImgs));
    };

    // Start animation after images are loaded
    Promise.all(loadedImages).then((loadedImgs) => {
      drawText(loadedImgs);
    });

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      drawText(loadedImages); // Pass loaded images
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
