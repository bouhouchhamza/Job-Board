import {
  isOfferFollowed,
  toggleFollowOffer
} from "./storage.js";

const followButtons = document.querySelectorAll(".btn-follow");

followButtons.forEach((button) => {
  const offerId = Number(button.dataset.id);

  if (isOfferFollowed(offerId)) {
    button.textContent = "★";
    button.classList.add("active");
  } else {
    button.textContent = "☆";
    button.classList.remove("active");
  }

  button.addEventListener("click", () => {
    toggleFollowOffer(offerId);

    if (isOfferFollowed(offerId)) {
      button.textContent = "★";
      button.classList.add("active");
    } else {
      button.textContent = "☆";
      button.classList.remove("active");
    }
  });
});