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
      const TOTAL_IMAGES = 200;
      const COLUMNS = 20;
      const IMAGES_PER_COLUMN = Math.ceil(TOTAL_IMAGES / COLUMNS);

      const TEXT_ANIMATION_DELAY = 0.3;

      // Calculate initial compact positions (when scale is 0.2)
      const initialScaleFactor = 0.2; // matches initialScale
      const scaledWidth = IMAGE_WIDTH * initialScaleFactor;
      const scaledSpacing = SPACING * initialScaleFactor;

      for (let col = 0; col < COLUMNS; col++) {
        // Position will be small at start, then scale up to full size
        const xPosition = (col - (COLUMNS - 1) / 2) * (IMAGE_WIDTH + SPACING);
        let yPosition = -(IMAGES_PER_COLUMN * (RECT_HEIGHT + SPACING)) / 2;

        for (let i = 0; i < IMAGES_PER_COLUMN; i++) {
          const isRectangle = Math.random() < 0.5;
          const height = isRectangle ? RECT_HEIGHT : SQUARE_HEIGHT;

          const delay = TEXT_ANIMATION_DELAY + (Math.random() * 0.2 + 0.1);

          images.push({
            url: isRectangle ? imageUrls[1] : imageUrls[0],
            x: xPosition * initialScaleFactor,
            y: yPosition * initialScaleFactor,
            width: IMAGE_WIDTH,
            height: height,
            delay: delay,
            initialScale: 0.2,
            targetScale: 1,
            finalX: xPosition,
            finalY: yPosition,
            cursor: "pointer",
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

    // Keep track of drag state and momentum
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastTime = 0;

    // Calculate MAX_OFFSET based on content
    const calculateMaxOffset = () => {
      const TOTAL_COLUMNS = 20;
      const IMAGES_PER_COLUMN = Math.ceil(200 / TOTAL_COLUMNS);

      // Calculate total width and height of the grid
      const totalWidth = TOTAL_COLUMNS * (IMAGE_WIDTH + SPACING);
      const totalHeight = IMAGES_PER_COLUMN * (RECT_HEIGHT + SPACING);

      return {
        x: totalWidth / 3, // Allow more horizontal movement
        y: totalHeight / 1.5, // Allow more vertical movement
      };
    };

    // Use dynamic boundaries
    const BOUNDS = calculateMaxOffset();

    // Smooth drag event listeners
    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = Date.now();
      velocityX = 0;
      velocityY = 0;
      canvas.style.cursor = "grabbing";
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime || 16;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        velocityX = (dx / deltaTime) * 16;
        velocityY = (dy / deltaTime) * 16;

        const newOffsetX = offsetX + dx;
        const newOffsetY = offsetY + dy;

        // Looser boundaries
        if (Math.abs(newOffsetX) < BOUNDS.x) {
          offsetX = newOffsetX;
        }

        if (Math.abs(newOffsetY) < BOUNDS.y) {
          offsetY = newOffsetY;
        }

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = currentTime;
      }
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      canvas.style.cursor = "grab";
    });

    window.addEventListener("mouseleave", () => {
      isDragging = false;
      canvas.style.cursor = "grab";
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
      ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);

      // Check if all images are done animating before allowing pointer cursor
      const allImagesAnimated = loadedImgs.every((img) => {
        const imageProgress = Math.min(
          1,
          Math.max(0, (progress - img.delay) * 2)
        );
        return imageProgress >= 1;
      });

      loadedImgs.forEach((img) => {
        if (img.element) {
          const imageProgress = Math.min(
            1,
            Math.max(0, (progress - img.delay) * 2)
          );
          const easedProgress = easeInOutQuart(imageProgress);
          ctx.globalAlpha = Math.min(1, imageProgress * 1.5);

          const currentX = img.x + (img.finalX - img.x) * easedProgress;
          const currentY = img.y + (img.finalY - img.y) * easedProgress;
          const currentScale =
            img.initialScale +
            (img.targetScale - img.initialScale) * easedProgress;

          // Draw image
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

      // Add momentum animation in drawText function
      updateMomentum();

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

    // Update momentum function with dynamic boundaries
    const updateMomentum = () => {
      if (
        !isDragging &&
        (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1)
      ) {
        const newOffsetX = offsetX + velocityX;
        const newOffsetY = offsetY + velocityY;

        if (Math.abs(newOffsetX) < BOUNDS.x) {
          offsetX = newOffsetX;
        } else {
          velocityX *= 0.8; // Softer bounce
        }

        if (Math.abs(newOffsetY) < BOUNDS.y) {
          offsetY = newOffsetY;
        } else {
          velocityY *= 0.8; // Softer bounce
        }

        velocityX *= 0.96;
        velocityY *= 0.96;
      }
    };

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
        cursor: "grab",
      }}
    />
  );
};

export default AnimatedTitle;
