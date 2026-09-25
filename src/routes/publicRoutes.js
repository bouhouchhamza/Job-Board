const express = require("express");
const offerRepository = require("../repositories/offreRepository");

const router = express.Router();


// ================= HOME =================

router.get("/", (req, res) => {
  res.redirect("/offers");
});


// ================= OFFERS LIST =================

router.get("/offers", async (req, res) => {
  try {
    const ville = req.query.ville;
    const type_contrat = req.query.type_contrat;
    const technologie = req.query.technologie;
    const search = req.query.search;
    const sort = req.query.sort;

    const offers = await offerRepository.getAllOffers({
      ville,
      type_contrat,
      technologie,
      search,
      sort,
    });

    res.render("offers", {
      offers,
      filters: {
        ville,
        type_contrat,
        technologie,
        search,
        sort,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
});


// ================= OFFER DETAIL =================

router.get("/offer/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send("ID invalide");
    }

    const offer = await offerRepository.getOfferById(id);

    if (!offer) {
      return res.status(404).send("Offre introuvable");
    }

    res.render("offer-detail", {
      offer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
});


// ================= FOLLOWED OFFERS =================

router.get("/offres-suivies", (req, res) => {
  res.render("offres-suivies");
});


module.exports = router;