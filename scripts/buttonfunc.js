/**
 * Functions to handle other functionality than canvas or svg.
 */

/**
 * Function to open the popup
 */
const openPopup = () => {
  // Display popup
  $("#popup").css("display", "flex");
  // Blur background
  $(".content").addClass("blur");
};

/**
 * Function to close the popup
 */
const closePopup = () => {
  // Close popup
  $("#popup").css("display", "none");
  // Unblur background
  $(".content").removeClass("blur");
};
