const pool = require("../config/db");

async function getAllOffers() {
  const [rows] = await pool.execute(
    `SELECT 
            o.id,
            o.titre,
            o.description_courte,
            o.description,
            o.profil_recherche,
            o.ville,
            o.type_contrat,
            o.date_publication,
            o.lien_candidature,
            e.nom as entreprise,
            GROUP_CONCAT(t.nom SEPARATOR ',') AS technologies
        FROM offre o 
        JOIN entreprise e ON e.id = o.entreprise_id
        LEFT JOIN offre_technologie ot ON ot.offre_id = o.id
        LEFT JOIN technologie t ON t.id = ot.technologie_id
        GROUP BY o.id, e.nom
        ORDER BY o.date_publication DESC`,
  );
  return rows;
}
async function getOfferById(id) {
  const [rows] = await pool.execute(
    ` SELECT o.id,o.titre,o.description_courte,o.description,o.profil_recherche,o.ville,o.type_contrat,o.date_publication,o.lien_candidature, e.nom AS entreprise, GROUP_CONCAT(t.nom SEPARATOR ",")  AS technologies FROM offre o JOIN entreprise e ON e.id = o.entreprise_id LEFT JOIN offre_technologie ot ON ot.offre_id = o.id LEFT JOIN technologie t ON t.id = ot.technologie_id WHERE o.id = ? GROUP BY o.id,e.nom
        `,
    [id],
  );
  return rows[0];
}

module.exports = {
  getAllOffers,
  getOfferById,
};
