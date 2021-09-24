/**
 * Js for the canvas rocket
 */

// Possible colors to loop thorugh
const COLORS = [
  "#E37B00",
  "#E3CD00",
  "#FAFF00",
  "#2400FF",
  "#FF0000",
  "#000000",
  "#00B934",
  "#C4C4C4",
  "#555555",
];

// A constant defining the different types of paths a shape can have.
const SHAPE_TYPES = {
  RECT: "RECT",
  TRIANGLE: "TRIANGLE",
  ELLIPSE: "ELLIPSE",
  STAR: "STAR",
};

// An object containing the shape ids
const SHAPE_IDS = {
  MAIN_BODY: "main-body",
  NOSE: "nose",
  LEFT_ENGINE: "left-engine",
  RIGHT_ENGINE: "right-engine",
  INNER_WINDOW: "inner-window",
  OUTER_WINDOW: "outer-window",
  STAR: "star",
  LEFT_PLATFORM: "left-platform",
  MIDDLE_PLATFORM: "middle-platform",
  RIGHT_PLATFORM: "right-platform",
};

/**
 * A function to create the default shapes (to make a rocket).
 * This function is used to be able to recreate the default shapes when
 * we want to reset the position of the rocket parts.
 * @param {*} ctx - The context of the canvas the shapes will be drawn in.
 * @param {{x: number; y: number}} - rocketPos The start position of the rocket.
 * @returns The default shapes to make a rocket.
 */
const createDefaultShapes = (ctx, rocketPos = { x: 150, y: 245 }) => {
  const shapes = [
    // Main body rect
    {
      id: SHAPE_IDS.MAIN_BODY,
      type: SHAPE_TYPES.RECT,
      left: rocketPos.x + 8,
      top: rocketPos.y + 20,
      width: 40,
      height: 60,
      color: COLORS[6],
      show: true,
      rotate: 0,
      onClick: (shapes) => changeColor(shapes, ctx, SHAPE_IDS.MAIN_BODY),
    },
    // Nose
    {
      id: SHAPE_IDS.NOSE,
      type: SHAPE_TYPES.TRIANGLE,
      left: rocketPos.x + 8,
      top: rocketPos.y + 0,
      width: 40,
      height: 20,
      color: COLORS[3],
      show: true,
      rotate: 0,
      onClick: (shapes) => changeColor(shapes, ctx, SHAPE_IDS.NOSE),
    },
    // Left engine
    {
      id: SHAPE_IDS.LEFT_ENGINE,
      type: SHAPE_TYPES.TRIANGLE,
      left: rocketPos.x + 0,
      top: rocketPos.y + 72,
      width: 16,
      height: 14,
      color: COLORS[4],
      show: true,
      rotate: 0,
      onClick: (shapes) => changeColor(shapes, ctx, SHAPE_IDS.LEFT_ENGINE),
    },
    // Right engine
    {
      id: SHAPE_IDS.RIGHT_ENGINE,
      type: SHAPE_TYPES.TRIANGLE,
      left: rocketPos.x + 40,
      top: rocketPos.y + 72,
      width: 16,
      height: 14,
      color: COLORS[4],
      show: true,
      rotate: 0,
      onClick: (shapes) => changeColor(shapes, ctx, SHAPE_IDS.RIGHT_ENGINE),
    },
    // Outer window
    {
      id: SHAPE_IDS.OUTER_WINDOW,
      type: SHAPE_TYPES.ELLIPSE,
      left: rocketPos.x + 28,
      top: rocketPos.y + 39,
      width: 20,
      height: 20,
      color: COLORS[5],
      show: true,
      rotate: 0,
      onClick: (shapes) => changeColor(shapes, ctx, SHAPE_IDS.OUTER_WINDOW),
    },
    // Inner window
    {
      id: SHAPE_IDS.INNER_WINDOW,
      type: SHAPE_TYPES.ELLIPSE,
      left: rocketPos.x + 28,
      top: rocketPos.y + 39,
      width: 16,
      height: 16,
      color: COLORS[7],
      show: true,
      rotate: 0,
      onClick: (shapes) => changeColor(shapes, ctx, SHAPE_IDS.INNER_WINDOW),
    },
    // Star
    {
      id: SHAPE_IDS.STAR,
      type: SHAPE_TYPES.STAR,
      left: rocketPos.x + 28,
      top: rocketPos.y + 65,
      width: 15,
      // Height actually does not matter here
      height: 5,
      color: COLORS[3],
      show: true,
      rotate: 0,
      onClick: (shapes) => changeColor(shapes, ctx, SHAPE_IDS.STAR),
    },
    // Left platform
    {
      id: SHAPE_IDS.LEFT_PLATFORM,
      type: SHAPE_TYPES.RECT,
      left: rocketPos.x - 63,
      top: rocketPos.y + 86,
      width: 60,
      height: 20,
      color: COLORS[8],
      text: "Left",
      show: true,
      rotate: 0,
      onClick: (shapes) => moveRocket(shapes, ctx, "left"),
    },
    // Middle (launch) platform
    {
      id: SHAPE_IDS.MIDDLE_PLATFORM,
      type: SHAPE_TYPES.RECT,
      left: rocketPos.x - 2.5,
      top: rocketPos.y + 86,
      width: 60,
      height: 20,
      color: COLORS[8],
      text: "Launch",
      show: true,
      rotate: 0,
      onClick: (shapes) => launchRocket(shapes, ctx),
    },
    // Right platform
    {
      id: SHAPE_IDS.RIGHT_PLATFORM,
      type: SHAPE_TYPES.RECT,
      left: rocketPos.x + 58,
      top: rocketPos.y + 86,
      width: 60,
      height: 20,
      color: COLORS[8],
      text: "Right",
      show: true,
      rotate: 0,
      onClick: (shapes) => moveRocket(shapes, ctx, "right"),
    },
  ];
  return shapes;
};

/**
 * Handles clicking on elements in the canvas.
 * @param {*} event - The click event.
 * @param {*} shapes - The shapes that are used to draw in the canvas.
 * @param {*} paths - The corresponding paths made from the shapes.
 * @param {*} ctx - The context of the canvas that the shapes are drawn in.
 */
const handleCanvasClick = (event, shapes, paths, ctx) => {
  const canvas = ctx.canvas;
  let clickedPath = false;
  // Getting the x and y position of the mouse relative to canvas
  const x = event.offsetX;
  const y = event.offsetY;

  // Check if the area clicked is within a path
  // Goes though paths in reverse as the elements drawn later in the list drawn over those before them.
  // To allow for clicking on layered paths, ou therefore have to go through paths in reverse.
  paths
    .slice() // Creates a shallow copy of paths
    .reverse() // Reverses paths
    .forEach((path, index) => {
      if (ctx.isPointInPath(path, x, y)) {
        // Perform the onClick functionality of the corresponding shape if the shape is shown
        const shape = shapes[shapes.length - 1 - index];
        if (shape.show && !clickedPath) {
          clickedPath = true;
          shape.onClick?.(shapes);
        }
      }
    });
  if (!clickedPath) {
    // If they clicked outside, just add the event listener to canvas again.
    canvas.addEventListener(
      "click",
      (event) => handleCanvasClick(event, shapes, paths, ctx),
      {
        once: true,
      }
    );
  }
};

// Functions for creating paths

/**
 * Creating a rectangular path from a shape.
 * @param {*} shape
 * @returns A path object as a rect.
 */
const createRectPath = (shape) => {
  const path = new Path2D();
  path.rect(shape.left, shape.top, shape.width, shape.height);
  return path;
};

/**
 * Creating a iscoceles triangular path from a shape.
 * @param {*} shape
 * @returns A path object an iscoceles triangle.
 */
const createIscocelesTrianglePath = (shape) => {
  const path = new Path2D();
  path.moveTo(shape.left, shape.top + shape.height);
  path.lineTo(shape.left + shape.width, shape.top + shape.height);
  path.lineTo(shape.left + shape.width / 2, shape.top);
  path.closePath();
  return path;
};

/**
 * Creating an ellipse path from a shape.
 * @param {*} shape
 * @returns A path object as an ellipse.
 */
const createEllipsePath = (shape) => {
  const path = new Path2D();
  path.ellipse(
    shape.left,
    shape.top,
    shape.width / 2,
    shape.height / 2,
    0,
    0,
    2 * Math.PI
  );
  return path;
};

// Inspiration from https://jsfiddle.net/baivong/ujnckxoa/
/**
 * Creating a star path object.
 * @param {*} cx - Origin x position
 * @param {*} cy - Origin y position
 * @param {*} spikes - Number of spikes.
 * @param {*} outerRadius - Outer radius of the star.
 * @param {*} innerRadius - Inner radius of the star.
 * @returns A path object as a star.
 */
const createStarPathTemplate = (cx, cy, spikes, outerRadius, innerRadius) => {
  const path = new Path2D();
  const step = Math.PI / spikes;
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;

  path.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    path.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    path.lineTo(x, y);
    rot += step;
  }
  path.lineTo(cx, cy - outerRadius);
  path.closePath();
  return path;
};

/**
 * Using createStarPathTemplate to create a star from a shape object.
 * @param {*} shape
 * @returns A path as a star.
 */
const createStarPath = (shape) => {
  return createStarPathTemplate(
    shape.left,
    shape.top,
    5,
    shape.width / 2,
    shape.width / 4
  );
};

/**
 * Creating a corresponsing path for a shape depending on shape.type
 * @param {*} shape
 * @returns - The corresponsing path object if the shape has a valid type.
 * If shape.show is false, an emtpy path is returned.
 * If a shape with an invalid type is provided, then an error message
 * will be logged and an empty path will be returned.
 */
const createPath = (shape) => {
  // If the shape should not be shown, return a empty Path2D object
  if (!shape.show) return new Path2D();
  if (shape.type === SHAPE_TYPES.RECT) return createRectPath(shape);
  else if (shape.type === SHAPE_TYPES.TRIANGLE)
    return createIscocelesTrianglePath(shape);
  else if (shape.type === SHAPE_TYPES.ELLIPSE) return createEllipsePath(shape);
  else if (shape.type === SHAPE_TYPES.STAR) return createStarPath(shape);
  console.error("Invalid shape type", shape);
  return new Path2D();
};

/**
 * Rendering the canvas by converting a shapes array to paths, and rendering the paths.
 * @param ctx - The context of the canvas that is used for rendering.
 * @param {{
 *    id: string;
 *    type: keyof typeof SHAPE_TYPES;
 *    width: number;
 *    height: number;
 *    top: number;
 *    left: number;
 *    show: boolean;
 *    color: string;
 *    rotate: number;
 *    text?: string;
 *    onClick?: (shapes) => void;
 * }[]} shapes - An array of shapes.
 */
const renderCanvas = (shapes, ctx, animation = false) => {
  const canvas = ctx.canvas;
  /*   if (!canvas) return; */
  // Clear the canvas and paths for redrawing if it is defined
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Create the paths from the shapes.
  const paths = shapes.map((shape) => createPath(shape));

  // Drawing the shapes via the paths.
  paths.forEach((path, index) => {
    // The corresponding shape to that path
    const corrShape = shapes[index];
    ctx.lineWidth = 0.1;
    // Handle rotation if it is set.
    // If rotate is not undefined and not 0
    if (corrShape.rotate) {
      const midX = corrShape.left + corrShape.width / 2;
      const midY = corrShape.top + corrShape.height / 2;
      ctx.translate(midX, midY);
      ctx.rotate(corrShape.rotate);
      ctx.translate(-midX, -midY);
    }
    ctx.strokeStyle = corrShape.color;
    // For lines, you have to stroke first
    if (corrShape.type === SHAPE_TYPES.TRIANGLE) ctx.stroke();

    // Make the path visible
    ctx.fillStyle = corrShape.color;
    ctx.fill(path);
    // Make text for a rect if text is defined and the shape should be shown
    if (
      corrShape.type === SHAPE_TYPES.RECT &&
      corrShape.text !== undefined &&
      corrShape.show
    ) {
      ctx.font = "14px Roboto";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000000";
      ctx.fillText(
        corrShape.text,
        corrShape.left + corrShape.width / 2,
        corrShape.top + corrShape.height / 2
      );
    }
    // Reset context (ctx) transform to the identity matrix (starting position).
    // This is only applicable if ctx was transformed because of rotation.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Reset context rotation for drawing the next element.
    ctx.rotate(0);
  });
  // Add event listener to handle click functionality in canvas if it is not an animation.
  // Have to add the event listener every render to update the shapes that
  // are provided as an argument in a shape's onClick function.
  if (!animation)
    canvas.addEventListener(
      "click",
      (event) => handleCanvasClick(event, shapes, paths, ctx),
      {
        once: true,
      }
    );
};

/**
 * Function to change the color of a canvas with a given id.
 * @param {*} shapes The shapes used to draw in the canvas with.
 * @param {*} ctx The context of the canvas that is drawn in.
 * @param {*} id The id of the shape to change the color of.
 */
const changeColor = (shapes, ctx, id) => {
  // Rotate the color of the shape with the given id.
  const newShapes = shapes.map((shape) => {
    if (shape.id === id) {
      const currentColor = shape.color;
      // Choosing the next color in the list from the one selected, when overflow it starts at 0 again.
      const newColorIndex = (COLORS.indexOf(currentColor) + 1) % COLORS.length;
      return {
        ...shape,
        color: COLORS[newColorIndex],
      };
    } else return { ...shape };
  });
  // Rerender the canvas to see the results
  renderCanvas(newShapes, ctx);
};

/**
 * Function to move the rocket by 10 px left of right in the canvas.
 * @param {*} shapes The shapes that are drawn in the canvas.
 * @param {*} ctx The context of the canvas the is drawn in.
 * @param {"left" | "right"} direction The direction to move the rocket in the canvas
 */
const moveRocket = (shapes, ctx, direction) => {
  const moveX = direction === "right" ? 10 : -10;
  const newShapes = shapes.map((shape) => {
    return { ...shape, left: shape.left + moveX };
  });
  renderCanvas(newShapes, ctx);
};

/**
 * Resetting the position of the rocket parts to their default positions.
 * @param {*} ctx The context of the canvas to reset.
 */
const resetCanvas = (ctx) => {
  const defaultShapes = createDefaultShapes(ctx);
  renderCanvas(defaultShapes, ctx);
};

/**
 * Function handling the animation of the rocket exploding.
 * @param {*} shapes The shapes that are drawn in the canvas.
 * @param {*} ctx The context of the canvas the shapes are drawn in.
 * @param {*} time The value used to calvulate the speed of which the parts of the rocket move at the Y axis downwards.
 */
const animateExplosion = (shapes, ctx, time) => () => {
  let isFlyingParts = false; // If there are still flying parts and the animation is stil ongoing.
  // The amount of movement at the Y axis is exponential (but x (speed) is always negative).
  const moveY = 50 * Math.pow(2, -time);
  const newShapes = shapes.map((shape) => {
    // The amount of movement at the X axis is random and
    // the the direction is based on what part it is.
    const moveX =
      Math.random() *
      Math.random() *
      40 *
      (shape.id.match(
        new RegExp(`(?:${SHAPE_IDS.NOSE}|right|${SHAPE_IDS.STAR})`)
      )
        ? 1
        : -1);
    // Check if they are at the bottom of the canvas, and if they are, translate them
    if (shape.top > 0 && shape.top < 290) {
      isFlyingParts = true;
      return {
        ...shape,
        left: shape.left + moveX,
        top: shape.top + moveY,
        rotate: shape.rotate + Math.random() * 2,
      };
    } else return { ...shape };
  });
  if (isFlyingParts) {
    renderCanvas(newShapes, ctx, true);
    // Increase speed by 01 and recurively call the animation function.
    window.requestAnimationFrame(animateExplosion(newShapes, ctx, time + 0.1));
  } else {
    // The animation is now over and all pieces have landed on the "ground".
    // Add reset functionality on click now
    const newShapes = shapes.map((shape) => {
      return {
        ...shape,
        onClick: (_shapes) => resetCanvas(ctx),
      };
    });
    renderCanvas(newShapes, ctx);
  }
};

/**
 * Function to handle the animation of the rocket launch.
 * @param {*} shapes The shapes that are drawn in the canvas.
 * @param {*} ctx The context of the canvas the shapes are drawn in.
 * @param {*} time The value used to calculate the speed the rocket moves at the Y axis upwards.
 * @returns
 */
const animateRocketLaunch = (shapes, ctx, time) => () => {
  // Translate the rocket position upwards at cubic speed
  const moveY = time * time * time - 2 * time - 3;
  const newShapes = shapes.map((shape) => {
    return {
      ...shape,
      top: shape.top - moveY,
    };
  });
  renderCanvas(newShapes, ctx, true);
  if (newShapes[1].top <= 20) {
    window.requestAnimationFrame(animateExplosion(newShapes, ctx, 0));
    return;
  }
  window.requestAnimationFrame(animateRocketLaunch(newShapes, ctx, time + 0.1));
};

/**
 * Function to handle the initial setup before the animation of the rocket launch starts.
 * @param {*} shapes The shapes that are drawn in the canvas.
 * @param {*} ctx The context of the canvas that the shapes are drawn in.
 */
const launchRocket = (shapes, ctx) => {
  // Remove the platform
  const newShapes = shapes.map((shape) => {
    if (
      [
        SHAPE_IDS.LEFT_PLATFORM,
        SHAPE_IDS.MIDDLE_PLATFORM,
        SHAPE_IDS.RIGHT_PLATFORM,
      ].indexOf(shape.id) > -1
    ) {
      return {
        ...shape,
        show: false,
      };
    } else return { ...shape };
  });
  // Start the animation with speed 0.
  window.requestAnimationFrame(animateRocketLaunch(newShapes, ctx, 0));
};

/**
 * Function to draw the default rocket with its initial functionality.
 */
const initializeCanvas = () => {
  // Using getElementById over jquery $ since i want pure js to handle the canvas api
  const canvas = document.getElementById("main-canvas");
  const ctx = canvas.getContext("2d");
  const shapes = createDefaultShapes(ctx);
  renderCanvas(shapes, ctx);
};

// Run the initialize function on load
window.addEventListener("load", initializeCanvas);
