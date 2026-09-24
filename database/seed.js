require("dotenv").config();

const pool = require("../src/config/db");

async function seed() {
  try {
    await pool.execute("DELETE FROM offre_technologie");
    await pool.execute("DELETE FROM offre");
    await pool.execute("DELETE FROM technologie");
    await pool.execute("DELETE FROM entreprise");
    await pool.execute('ALTER TABLE offre AUTO_INCREMENT = 1');
    await pool.execute('ALTER TABLE technologie AUTO_INCREMENT = 1');
    await pool.execute('ALTER TABLE entreprise AUTO_INCREMENT = 1');
    console.log("Seeding database... ");

    const enreprises = [
      [
        "TechNova",
        "Entreprise spécialisée en développement web",
        "https://technova.example",
        null,
      ],
      [
        "Digital Factory",
        "Agence digitale",
        "https://digitalfactory.example",
        null,
      ],
      ["Atlas Tech", "Solutions numériques", "https://atlastech.example", null],
      [
        "CodeLab",
        "Développement de solutions logicielles",
        "https://codelab.example",
        null,
      ],
      ["NextDev", "Solutions web et mobile", "https://nextdev.example", null],
    ];
    const entrepriseIds = new Map();
    for (const entreprise of enreprises) {
      const [result] = await pool.execute(
        `   INSERT INTO entreprise 
                    (nom,description,site_web,logo)
                    VALUES(?,?,?,?)`,
        entreprise,
      );
      entrepriseIds.set(entreprise[0], result.insertId);
    }
    const technologies = [
      ["JavaScript"],
      ["Node.js"],
      ["Express.js"],
      ["MySQL"],
      ["HTML"],
      ["CSS"],
      ["React"],
      ["TypeScript"],
    ];
    const technologieIds = new Map();
    for (const technologie of technologies) {
      const [result] = await pool.execute(
        `INSERT INTO technologie(nom) VALUES(?)`,
        technologie,
      );
      technologieIds.set(technologie[0], result.insertId);
    }
    const offres = [
      [
        "Développeur Full Stack",
        "Développement d'applications web modernes.",
        "Participer au développement frontend et backend de plusieurs applications.",
        "Bonne maîtrise de JavaScript, Node.js et MySQL.",
        "Agadir",
        "CDI",
        "2026-09-20",
        "https://example.com/jobs/1",
        "TechNova",
        ["JavaScript", "Node.js", "MySQL"],
      ],

      [
        "Backend Developer",
        "Développement d'API avec Node.js.",
        "Concevoir et maintenir des API performantes.",
        "Maîtrise de Node.js, Express.js et MySQL.",
        "Casablanca",
        "CDI",
        "2026-09-19",
        "https://example.com/jobs/2",
        "Digital Factory",
        ["Node.js", "Express.js", "MySQL"],
      ],

      [
        "Frontend Developer",
        "Développement d'interfaces web modernes.",
        "Créer des interfaces responsives et interactives.",
        "Bonne maîtrise de HTML, CSS et JavaScript.",
        "Rabat",
        "CDD",
        "2026-09-18",
        "https://example.com/jobs/3",
        "Atlas Tech",
        ["JavaScript", "HTML", "CSS"],
      ],

      [
        "Développeur React",
        "Développement d'applications React.",
        "Participer à la création de composants réutilisables.",
        "Expérience avec React et JavaScript.",
        "Marrakech",
        "CDI",
        "2026-09-17",
        "https://example.com/jobs/4",
        "CodeLab",
        ["JavaScript", "React"],
      ],

      [
        "Développeur Node.js",
        "Développement backend avec Node.js.",
        "Créer des services backend et gérer les bases de données.",
        "Node.js, Express.js et MySQL.",
        "Agadir",
        "Stage",
        "2026-09-16",
        "https://example.com/jobs/5",
        "NextDev",
        ["Node.js", "Express.js", "MySQL"],
      ],

      [
        "Développeur JavaScript",
        "Développement web JavaScript.",
        "Travailler sur des fonctionnalités frontend et backend.",
        "Bonne maîtrise de JavaScript.",
        "Casablanca",
        "CDI",
        "2026-09-15",
        "https://example.com/jobs/6",
        "TechNova",
        ["JavaScript"],
      ],

      [
        "Intégrateur Web",
        "Intégration de maquettes web.",
        "Transformer des maquettes en pages HTML/CSS responsives.",
        "HTML, CSS et JavaScript.",
        "Rabat",
        "CDD",
        "2026-09-14",
        "https://example.com/jobs/7",
        "Digital Factory",
        ["JavaScript", "HTML", "CSS"],
      ],

      [
        "Développeur TypeScript",
        "Développement d'applications TypeScript.",
        "Participer au développement de projets web complexes.",
        "JavaScript et TypeScript.",
        "Tanger",
        "CDI",
        "2026-09-13",
        "https://example.com/jobs/8",
        "Atlas Tech",
        ["JavaScript", "TypeScript"],
      ],

      [
        "Junior Full Stack Developer",
        "Poste junior en développement web.",
        "Participer au développement complet d'applications.",
        "HTML, CSS, JavaScript, Node.js et MySQL.",
        "Agadir",
        "Stage",
        "2026-09-12",
        "https://example.com/jobs/9",
        "CodeLab",
        ["JavaScript", "Node.js", "MySQL", "HTML", "CSS"],
      ],

      [
        "Développeur Express.js",
        "Développement d'API Express.",
        "Créer et maintenir des routes et services backend.",
        "Node.js et Express.js.",
        "Casablanca",
        "CDI",
        "2026-09-11",
        "https://example.com/jobs/10",
        "NextDev",
        ["Node.js", "Express.js"],
      ],

      [
        "Frontend React Junior",
        "Développement frontend avec React.",
        "Créer des interfaces dynamiques et responsives.",
        "React, JavaScript, HTML et CSS.",
        "Marrakech",
        "Stage",
        "2026-09-10",
        "https://example.com/jobs/11",
        "TechNova",
        ["JavaScript", "HTML", "CSS", "React"],
      ],

      [
        "Développeur Web",
        "Développement de sites et applications web.",
        "Participer au développement et à la maintenance de projets web.",
        "HTML, CSS, JavaScript et MySQL.",
        "Rabat",
        "CDD",
        "2026-09-09",
        "https://example.com/jobs/12",
        "Digital Factory",
        ["JavaScript", "MySQL", "HTML", "CSS"],
      ],
    ];
    for (const offre of offres) {
      const entrepriseName = offre[8];
      const offerTechnologies = offre[9];
      const entrepriseId = entrepriseIds.get(entrepriseName);
      const [result] = await pool.execute(
        `INSERT INTO offre(titre,description_courte,description,profil_recherche,ville,type_contrat,date_publication,lien_candidature,entreprise_id) VALUES(?,?,?,?,?,?,?,?,?)`,
        [
          offre[0],
          offre[1],
          offre[2],
          offre[3],
          offre[4],
          offre[5],
          offre[6],
          offre[7],
          entrepriseId,
        ],
      );
      const offerId = result.insertId;
      for (const technologieName of offerTechnologies) {
        const technologieId = technologieIds.get(technologieName);
        await pool.execute(
          `  
            INSERT INTO offre_technologie 
                (offre_id,technologie_id) VALUES(?,?)
            `,
          [offerId, technologieId],
        );
      }
    }
    console.log("seed worked successfully");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await pool.end();
  }
}
seed();
