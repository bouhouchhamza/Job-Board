CREATE DATABASE job_board;

USE job_board;

CREATE TABLE entreprise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    site_web VARCHAR(255),
    logo VARCHAR(255)
);

CREATE TABLE offre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description_courte VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    profil_recherche TEXT,
    ville VARCHAR(100) NOT NULL,
    type_contrat VARCHAR(50) NOT NULL,
    date_publication DATE NOT NULL,
    lien_candidature VARCHAR(255),
    entreprise_id INT NOT NULL,

    FOREIGN KEY (entreprise_id)
        REFERENCES entreprise(id)
);

CREATE TABLE technologie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE offre_technologie (
    offre_id INT NOT NULL,
    technologie_id INT NOT NULL,

    PRIMARY KEY (offre_id, technologie_id),

    FOREIGN KEY (offre_id)
        REFERENCES offre(id),

    FOREIGN KEY (technologie_id)
        REFERENCES technologie(id)
);