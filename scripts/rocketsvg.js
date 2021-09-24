/**
 * The js for the svg rocket
 */

// Redfining colors here to avoid making this a module
const COLORS2 = [
  // Possible colors to loop thorugh
  "#E37B00",
  "#E3CD00",
  "#FAFF00",
  "#2400FF",
  "#FF0000",
  "#000000",
  "#00B934",
  "#C4C4C4",
];
// The position of the group is dependent on this css variable
const rocketPositionVar = "--rocket-position";

/**
 * Rotating the fill of the first element with the given className
 * @param {string} className The class of the element to switch fill in.
 */
const changeFill = (className) => {
  const element = $(`.${className}`);
  const currentFill = element.attr("fill");
  // Choosing the next color in the list from the one selected, when overflow it starts at 0 again.
  const newFillIndex = (COLORS.indexOf(currentFill) + 1) % COLORS.length;
  element.attr("fill", COLORS[newFillIndex]);
};

/**
 * Moving the rocket in the provided direction
 * @param {"left" | "right"} direction The direction to move the rocket, either "left" or "right".
 * Moves the group 10px right if direction is "right" and otherwise 10px left.
 */
const move = (direction) => {
  const root = $(":root");
  const currentPosition = root.css(rocketPositionVar);
  root.css(
    rocketPositionVar,
    currentPosition +
      ` translate(${direction === "right" ? "10px" : "-10px"}, 0px)`
  );
};

/**
 * Handling launching of the rocket.
 */
const launch = () => {
  const group = $("#group");
  const platform = $("#platform");
  // Removing the platform
  platform.css("display", "none");

  /**
   * Function handling the resetting the rocket to its initial position
   * and preparing for new interaction.
   */
  const resetRocket = () => {
    group.removeClass("explode launch");
    platform.css("display", "block");
  };

  /**
   * After the explosion, you should be able to click
   * any rocket part to reset the positions of the rocket parts.
   */
  const explodeFinished = () => {
    group.one("click", resetRocket);
  };

  /**
   * Handling the explosion of the rocket.
   */
  const explode = () => {
    group.one("transitionend", explodeFinished);
    group.addClass("explode");
  };

  // Launch the rocket and explode when the launch is finished.
  // (.one makes it remove the handler after it is excecuted on that event)
  group.one("animationend", explode);
  group.addClass("launch");
};
