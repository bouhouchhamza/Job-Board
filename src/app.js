require("dotenv").config();
const express = require("express");
const pool = require("./config/db");
const offerRepository = require("./repositories/offreRepository");
const app = express();
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
app.post("/admin/offers", (req, res) => {
  console.log(req.body);
  res.send("Data recue");
});

app.get("/admin/offers/new", (req, res) => {
  res.send(`
            <form action="/admin/offers" method='POST'>
                <input type="text" name="titre" placeholder="Titre" />
                <input type="text" name="ville" placeholder="Ville" />
                <button type="submit">Ajouter</button>
            </form>
        `);
});
app.get("/", (req, res) => {
  res.send("Job Board srever in running");
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

    res.json(offer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});
app.get("/offers", async (req, res) => {
  try {
    const offers = await offerRepository.getAllOffers();
    res.json(offers);
  } catch (error) {
    console.error("ERROR: ", error);
    res.status(500).send("Error serveur");
  }
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
