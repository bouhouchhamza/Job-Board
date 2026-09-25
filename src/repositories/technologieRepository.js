const pool = require("../config/db");

async function getAllTechnologies() {
  const [rows] = await pool.execute(`
    SELECT id, nom
    FROM technologie
    ORDER BY nom
  `);

  return rows;
}

module.exports = {
  getAllTechnologies,
};