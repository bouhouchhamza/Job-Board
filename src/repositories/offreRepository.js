const pool = require("../config/db");

async function getAllOffers(filters = {}) {
  const conditions = [];
  const params = [];
  if (filters.ville) {
    conditions.push("o.ville = ?");
    params.push(filters.ville);
  }
  if (filters.type_contrat) {
    conditions.push("o.type_contrat = ?");
    params.push(filters.type_contrat);
  }
  if (filters.technologie) {
    conditions.push(`
          EXISTS (
          SELECT 1
          FROM offre_technologie ot_filter
          JOIN technologie t_filter
          ON t_filter.id = ot_filter.technologie_id
          WHERE ot_filter.offre_id = o.id
          AND t_filter.nom =  ? )
        `);
    params.push(filters.technologie);
  }
  if (filters.search) {
    conditions.push(`
        (o.titre LIKE ? 
        OR o.description_courte LIKE ?
        OR o.description LIKE ?
        OR  o.profil_recherche LIKE ?
        OR e.nom LIKE ? 
        )
        `);
    const searchValue = `%${filters.search}%`;
    params.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
    );
  }
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}  ` : "";
  let orderBy = "o.date_publication DESC";
  if (filters.sort === "oldest") {
    orderBy = "o.date_publication ASC";
  }
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
        ${whereClause}
        GROUP BY o.id, e.nom
        ORDER BY ${orderBy}`,
    params,
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
async function createOffer(offerData) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `
      INSERT INTO offre (
        titre,
        description_courte,
        description,
        profil_recherche,
        ville,
        type_contrat,
        date_publication,
        lien_candidature,
        entreprise_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        offerData.titre,
        offerData.description_courte,
        offerData.description,
        offerData.profil_recherche,
        offerData.ville,
        offerData.type_contrat,
        offerData.date_publication,
        offerData.lien_candidature || null,
        offerData.entreprise_id,
      ],
    );

    const offerId = result.insertId;

    for (const technologieId of offerData.technologies || []) {
      await connection.execute(
        `
        INSERT INTO offre_technologie (
          offre_id,
          technologie_id
        )
        VALUES (?, ?)
        `,
        [offerId, technologieId],
      );
    }

    await connection.commit();

    return offerId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getAllOffers,
  getOfferById,
  createOffer,
};
