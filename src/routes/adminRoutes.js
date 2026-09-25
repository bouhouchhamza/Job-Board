const express = require("express");

const offerRepository = require("../repositories/offreRepository");
const entrepriseRepository = require("../repositories/entrepriseRepository");
const technologieRepository = require("../repositories/technologieRepository");

const router = express.Router();

function normalizeTechnologies(value) {
  let technologies = value || [];

  if (!Array.isArray(technologies)) {
    technologies = [technologies];
  }

  return technologies
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id));
}

function buildOfferData(body) {
  return {
    titre: body.titre,
    description_courte: body.description_courte,
    description: body.description,
    profil_recherche: body.profil_recherche,
    ville: body.ville,
    type_contrat: body.type_contrat,
    date_publication: body.date_publication,
    lien_candidature: body.lien_candidature,
    entreprise_id: Number(body.entreprise_id),
    technologies: normalizeTechnologies(body.technologies),
  };
}


// ================= LIST =================

router.get("/offers", async (req, res) => {
  try {
    const offers = await offerRepository.getAllOffers();

    res.render("admin/offers", {
      offers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
});


// ================= CREATE FORM =================

router.get("/offers/new", async (req, res) => {
  try {
    const [entreprises, technologies] = await Promise.all([
      entrepriseRepository.getAllEntreprises(),
      technologieRepository.getAllTechnologies(),
    ]);

    res.render("admin/new-offer", {
      entreprises,
      technologies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
});


// ================= CREATE =================

router.post("/offers", async (req, res) => {
  try {
    const offerData = buildOfferData(req.body);

    await offerRepository.createOffer(offerData);

    res.redirect("/admin/offers");
  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Erreur lors de la création de l'offre"
    );
  }
});


// ================= EDIT FORM =================

router.get("/offers/:id/edit", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send("ID invalide");
    }

    const [offer, entreprises, technologies] = await Promise.all([
      offerRepository.getOfferById(id),
      entrepriseRepository.getAllEntreprises(),
      technologieRepository.getAllTechnologies(),
    ]);

    if (!offer) {
      return res.status(404).send("Offre introuvable");
    }

    const selectedTechnologyIds = offer.technologie_ids
      ? offer.technologie_ids
          .split(",")
          .map((technologyId) => Number(technologyId))
      : [];

    res.render("admin/edit-offer", {
      offer,
      entreprises,
      technologies,
      selectedTechnologyIds,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
});


// ================= UPDATE =================

router.post("/offers/:id/edit", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send("ID invalide");
    }

    const offerData = buildOfferData(req.body);

    await offerRepository.updateOffer(id, offerData);

    res.redirect("/admin/offers");
  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Erreur lors de la modification de l'offre"
    );
  }
});


// ================= DELETE =================

router.post("/offers/:id/delete", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).send("ID invalide");
    }

    const deletedRows = await offerRepository.deleteOffer(id);

    if (deletedRows === 0) {
      return res.status(404).send("Offre introuvable");
    }

    res.redirect("/admin/offers");
  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Erreur lors de la suppression de l'offre"
    );
  }
});


module.exports = router;