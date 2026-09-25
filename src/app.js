require("dotenv").config();
const express = require("express");
const path = require("path");
// const pool = require("./config/db");
const offerRepository = require("./repositories/offreRepository");
const entrepriseRepository = require("./repositories/entrepriseRepository");
const technologieRepository = require("./repositories/technologieRepository");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("Request received: ", req.method, req.url);
  next();
});

// app.get('/test-db',async(req,res)=>{
//     try{
//         const [rows] = await pool.execute('SELECT 1 AS test');
//         console.log(rows);
//         res.json(rows)
//     }catch(error){
//         console.log(error);
//         res.status(500).send('Database conection error')
//     }
// });
app.get("/admin/offers", async (req, res) => {
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
// app.post("/admin/offers", (req,res)=>{
//   console.log(req.body);
//   res.send("data recue");
// })
app.get("/admin/offers/new", async (req, res) => {
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
app.get('/admin/offers/:id/edit', async(req,res)=>{
  try{
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
      return res.status(400).send('ID invalide');
    }
    const [offer,entreprises,technologies] =  await Promise.all([
      offerRepository.getOfferById(id),
      entrepriseRepository.getAllEntreprises(),
      technologieRepository.getAllTechnologies(),
    ]);
    if(!offer){
      return res.status(404).send('Offre introuvable');
    }
    const selectedTechnologyIds = offer.technologie_ids ? offer.technologie_ids 
    .split(',').map((id)=>Number(id)) : [];
    res.render('admin/edit-offer',{
      offer,
      entreprises,
      technologies,
      selectedTechnologyIds,
    })
  }catch(error){
    console.error(error);
    res.status(500).send('Erreur serveur');

  }
});
app.post('/admin/offers/:id/edit', async(req,res)=>{
  try{
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
      return res.status(400).send('ID invalide');
    }
    let technologies = req.body.technologies || [];
    if(!Array.isArray(technologies)){
      technologies = [technologies];
    }
    technologies = technologies.map((technologyId)=>Number(technologyId)).filter((technologyId)=> !Number.isNaN(technologyId));
    const offerData = {
      titre: req.body.titre,
      description_courte: req.body.description_courte,
      description: req.body.description,
      profil_recherche: req.body.profil_recherche,
      ville: req.body.ville,
      type_contrat: req.body.type_contrat,
      date_publication: req.body.date_publication,
      lien_candidature: req.body.lien_candidature,
      entreprise_id: Number(req.body.entreprise_id),
      technologies,
    };
    await offerRepository.updateOffer(id, offerData);
    res.redirect('/admin/offers');
  }catch(error){
    console.error(error);
    res.status(500).send(
      "Error lors de la modification de l'offer"
    );
  }
});
app.post("/admin/offers", async (req, res) => {
  try {
    let technologies = req.body.technologies || [];
    if (!Array.isArray(technologies)) {
      technologies = [technologies];
    }
    technologies = technologies
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));
    const offerData = {
      titre: req.body.titre,
      description_courte: req.body.description_courte,
      description: req.body.description,
      profil_recherche: req.body.profil_recherche,
      ville: req.body.ville,
      type_contrat: req.body.type_contrat,
      date_publication: req.body.date_publication,
      lien_candidature: req.body.lien_candidature,
      entreprise_id: Number(req.body.entreprise_id),
      technologies,
    };
    await offerRepository.createOffer(offerData);
    res.redirect("/admin/offers");
  } catch (error) {
    console.error(error);

    res.status(500).send("Erreur lors de création de l'offre");
  }
});
app.get("/", (req, res) => {
  res.send("Job Board srever in running");
});
app.get("/api/offers", async (req, res) => {
  try {
    const offers = await offerRepository.getAllOffers();
    res.json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error serveur",
    });
  }
});
app.get("/offer/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "ID invalide",
      });
    }

    const offer = await offerRepository.getOfferById(id);

    if (!offer) {
      return res.status(404).json({
        message: "Offre introuvable",
      });
    }

    res.render("offer-detail", {
      offer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});
app.get("/offres-suivies", (req, res) => {
  res.render("offres-suivies");
});
app.get("/offers", async (req, res) => {
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
    console.error("ERROR: ", error);
    res.status(500).send("Error serveur");
  }
});
app.get("/test.ejs", (req, res) => {
  res.render("test", {
    message: "EJS fonctionne",
  });
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
