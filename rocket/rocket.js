// I have to use querySelector over jQuery selection since jQuery is not accessible here
// A jQuery.svg exits to do exactly this. However, jQuery.svg also has functionality
// to use svg in a canvas-like manner, which was not allowed for this project.

// Possible colors to loop thorugh
const colors = [
  "#E37B00",
  "#E3CD00",
  "#FAFF00",
  "#2400FF",
  "#FF0000",
  "#000000",
  "#00B934",
  "#C4C4C4",
];

/**
 * Rotating the fill of the first element with the given className
 * @param {string} className The class of the element to switch fill in.
 */
const changeFill = (className) => {
  const element = document.querySelector(`.${className}`);
  const currentFill = element.getAttribute("fill");
  // Choosing the next color in the list from the one selected, when overflow it starts at 0 again.
  const newFillIndex = (colors.indexOf(currentFill) + 1) % colors.length;
  element.setAttribute("fill", colors[newFillIndex]);
};

/**
 * Moving the rocket in the provided direction
 * @param {string} direction The direction to move the rocket, either "left" or "right".
 * Moves the group 10px right if direction is "right" and otherwise 10px left.
 */
const move = (direction) => {
  // The position of the group is dependent on this css variable
  const rocketPositionVar = "--rocket-position";
  const root = document.documentElement;
  const currentPosition =
    getComputedStyle(root).getPropertyValue(rocketPositionVar);
  // Adding more translates to the css varaible, moving the group in the desired direction
  root.style.setProperty(
    rocketPositionVar,
    currentPosition + ` translate(${direction === "right" ? "10px" : "-10px"})`
  );
};

/**
 * Handling launching of the rocket.
 */
const launch = () => {
  const group = document.querySelector("#group");
  // Removing the platform
  const platform = document.querySelector("#platform");
  platform.style.display = "none";

  /**
   * Function handling the resetting the rocket to its initial position
   * and preparing for new interaction.
   */
  const resetRocket = () => {
    group.classList.remove("explode", "launch");
    group.removeEventListener("animationend", explode);
    platform.style.display = "block";
    group.removeEventListener("click", resetRocket);
  };

  /**
   * After the explosion, you should be able to click
   * any rocket part to reset the positions of them.
   */
  const explodeFinished = () => {
    // When you click any of the rocket elements, reset everything.
    group.addEventListener("click", resetRocket);
    // Remove earlier event listener to avoid unwanted functiality
    group.removeEventListener("transitionend", explodeFinished);
  };

  /**
   * Handling the explosion of the rocket.
   */
  const explode = () => {
    group.addEventListener("transitionend", explodeFinished);
    group.classList.add("explode");
  };

  // Launch the rocket
  group.addEventListener("animationend", explode, false);
  group.classList.add("launch");
};
