import {
  getFollowedOfferIds,
  toggleFollowOffer,
} from "./storage.js";

const container = document.querySelector("#saved-container");
const countElement = document.querySelector("#saved-count");
const clearButton = document.querySelector("#clear-followed");


async function loadFollowedOffers() {
  try {
    const followedIds = getFollowedOfferIds();

    if (followedIds.length === 0) {
      renderEmpty();
      updateCount(0);
      return;
    }

    const response = await fetch("/api/offers");

    if (!response.ok) {
      throw new Error("Impossible de charger les offres");
    }

    const offers = await response.json();

    const followedOffers = offers.filter((offer) =>
      followedIds.includes(Number(offer.id))
    );

    renderFollowedOffers(followedOffers);

    updateCount(followedOffers.length);

  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <div class="empty-box">
        <div class="empty-inner">
          <p>Impossible de charger les offres suivies.</p>
        </div>
      </div>
    `;
  }
}


function renderFollowedOffers(offers) {
  if (offers.length === 0) {
    renderEmpty();
    return;
  }

  container.innerHTML = offers
    .map((offer) => {

      const initials = offer.entreprise
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

      const technologies = offer.technologies
        ? offer.technologies.split(",")
        : [];

      const contractClass =
        offer.type_contrat === "Stage"
          ? "badge-stage"
          : "badge-alternance";

      return `
        <article class="card saved-card">

          <div class="saved-card-main">

            <div class="job-head">

              <div class="job-title-wrap">

                <div class="logo-box">
                  ${initials}
                </div>

                <div>
                  <h3>${offer.titre}</h3>

                  <div class="company-line">
                    ${offer.entreprise} • ${offer.ville}
                  </div>
                </div>

              </div>

              <span class="badge badge-contract ${contractClass}">
                ${offer.type_contrat}
              </span>

            </div>

            <p class="job-description">
              ${offer.description_courte}
            </p>

            <div class="badges">

              ${technologies
                .map(
                  (technologie) =>
                    `<span class="badge">${technologie}</span>`
                )
                .join("")}

            </div>

          </div>

          <div class="saved-card-footer">

            <div class="job-date">
              ${new Date(
                offer.date_publication
              ).toLocaleDateString("fr-FR")}
            </div>

            <div class="job-actions">

              <a
                class="btn btn-primary"
                href="/offer/${offer.id}"
              >
                Voir l'offre →
              </a>

              <button
                class="btn btn-secondary btn-remove-follow"
                data-id="${offer.id}"
                type="button"
              >
                ✕ Retirer
              </button>

            </div>

          </div>

        </article>
      `;
    })
    .join("");

  addRemoveListeners();
}


function addRemoveListeners() {
  const removeButtons =
    document.querySelectorAll(".btn-remove-follow");

  removeButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const offerId = Number(button.dataset.id);

      toggleFollowOffer(offerId);

      loadFollowedOffers();
    });

  });
}


function renderEmpty() {
  container.innerHTML = `
    <div class="empty-box">

      <div class="empty-inner">

        <div class="empty-icon">
          ♧
        </div>

        <h2>
          Aucune offre suivie
        </h2>

        <p class="muted">
          Vous n'avez pas encore enregistré d'offre.
          Parcourez les offres et ajoutez celles qui vous intéressent.
        </p>

        <a
          class="btn btn-primary"
          href="/offers"
        >
          ⌕ Découvrir les offres
        </a>

      </div>

    </div>
  `;
}


function updateCount(count) {
  countElement.textContent =
    `${count} offre${count > 1 ? "s" : ""} enregistrée${count > 1 ? "s" : ""}`;
}


clearButton.addEventListener("click", () => {

  const followedIds = getFollowedOfferIds();

  followedIds.forEach((id) => {
    toggleFollowOffer(id);
  });

  loadFollowedOffers();
});


loadFollowedOffers();