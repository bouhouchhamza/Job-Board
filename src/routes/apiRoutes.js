const express = require("express");
const offerRepository = require("../repositories/offreRepository");

const router = express.Router();

router.get("/offers", async (req, res) => {
  try {
    const offers = await offerRepository.getAllOffers();

    res.json(offers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

module.exports = router;