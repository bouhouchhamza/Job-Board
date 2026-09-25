const pool = require("../config/db");

async function getAllEntreprises() {
  const [rows] = await pool.execute(`
    SELECT id, nom
    FROM entreprise
    ORDER BY nom
  `);

  return rows;
}

module.exports = {
  getAllEntreprises,
};