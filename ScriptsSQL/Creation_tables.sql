-- CREATE TYPE DOMAINE_LANGUAGE char(2) NOT NULL DEFAULT 'FR' check(@col in( 'FR','NL' ) );

create table suivi_materiel                               -- aucun lien avec le reste, client ou employé ?
(
    ID_SUIVI_MATERIEL INT NOT NULL AUTO_INCREMENT,
    MATERIEL VARCHAR(100) NOT NULL,
    NOM VARCHAR(50) NOT NULL,
    TEL VARCHAR(20),
    EMAIL VARCHAR(50),
    DATE_EMPRUNT DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier
    DATE_RETOUR DATE,
    CONSTRAINT pk__suivi_materiel PRIMARY KEY (ID_SUIVI_MATERIEL)
);


create table texte_factures                                -- 1 lien avec facture
(
    ID_TEXTE_FACTURE INT NOT NULL AUTO_INCREMENT,
    CATEGORIE VARCHAR(50) NOT NULL,
    TEXTE_FR VARCHAR(255) NOT NULL,
    TEXTE_NL VARCHAR(255) NOT NULL,
    CONSTRAINT pk__texte_facture PRIMARY KEY (ID_TEXTE_FACTURE)
);

create table clients                                      -- 1 lien avec facture (censé avoir 3 liens facture/etiquette/devis)
(
    ID_CLIENT INT NOT NULL AUTO_INCREMENT,
    NOM_CLIENT VARCHAR(50) NOT NULL,
    PRENOM_CLIENT VARCHAR(50),
    SOCIETE_CLIENT VARCHAR(50),
    ADRESSE_CLIENT VARCHAR(100) NOT NULL,
    ADRESSE_CLIENT_SECONDAIRE VARCHAR(100),
    NUMERO_TVA_CLIENT VARCHAR(20),
    LANGUE_CLIENT CHAR(3), -- le domaine casse les couilles
    NOM_ARCHITECT VARCHAR(50),
    TITRE_CLIENT VARCHAR(50) NOT NULL,
    TELEPHONE_CLIENT VARCHAR(15),
    EMAIL_CLIENT VARCHAR(50),
    CONSTRAINT pk__clients PRIMARY KEY (ID_CLIENT)
);


create table etiquettes                                                  -- 1 foreign key vers client (id)
(
    ID_ETIQUETTE INT NOT NULL AUTO_INCREMENT,
    ID_CLIENT INT NOT NULL,
    CHANTIER VARCHAR(100) NOT NULL, -- qu'est ce que ca represente ?
    CODE_JSON LONGTEXT,                 -- qu'est ce que ca represente ?
    DATE_ETIQUETTE DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier,
    CONSTRAINT pk__etiquettes PRIMARY KEY (ID_ETIQUETTE),
    CONSTRAINT fk__etiquettes__clients FOREIGN KEY (ID_CLIENT) REFERENCES clients (ID_CLIENT)
);


create table devis_texte (
    ID_DEVIS_TEXTE INT NOT NULL AUTO_INCREMENT,
    CATEGORIE VARCHAR(20),
    TEXTE_NL VARCHAR(255) NOT NULL,
    TEXTE_FR VARCHAR(255) NOT NULL,
    CONSTRAINT pk__devis_texte PRIMARY KEY (ID_DEVIS_TEXTE)
);


create table devis (
    ID_DEVIS INT NOT NULL AUTO_INCREMENT,
    ID_CLIENT INT NOT NULL,
    ID_DEVIS_TEXTE INT NOT NULL,
    DATE_DEVIS DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier
    CHANTIER LONGTEXT,
    CHOIX_PRIX INT,              -- BETWEEN 1 AND 3 ,
    MODIFICATION_PRIX_POURCENTAGE INT,
    MODIFICATION_PRIX_FIXE INT,
    ID_TEXTE_PRIX INT,
    ID_TEXTE_PAIEMENT INT,
    ID_TEXTE_INTRODUCTION INT,
    CHANTIER_NOM varchar(255),
    COMMENTAIRE varchar(255),
    CONSTRAINT pk__devis PRIMARY KEY (ID_DEVIS),
    CONSTRAINT fk__devis__clients FOREIGN KEY (ID_CLIENT) REFERENCES clients (ID_CLIENT),
    CONSTRAINT fk__devis__devis_texte FOREIGN KEY (ID_DEVIS_TEXTE) REFERENCES devis_texte (ID_DEVIS_TEXTE)
);


create table articles (
    ID_ARTICLE INT NOT NULL AUTO_INCREMENT,
    LIBELLE_FR VARCHAR(255) NOT NULL,
    LIBELLE_NL VARCHAR(255) NOT NULL,
    CATEGORIE VARCHAR(20),
    PRIX_1 INT NOT NULL,
    PRIX_2 INT,
    PRIX_3 INT,
    CONSTRAINT pk__articles PRIMARY KEY (ID_ARTICLE)
);


create table articles_rgie (
    ID_ARTICLE_RGIE INT NOT NULL AUTO_INCREMENT,
    LIBELLE_FR VARCHAR(255) NOT NULL,
    LIBELLE_NL VARCHAR(255) NOT NULL,
    PRIX_1 INT NOT NULL,
    PRIX_2 INT,
    CONSTRAINT pk__articles_rgie PRIMARY KEY (ID_ARTICLE_RGIE)
);


create table articles_devis (
    ID_ARTICLE_DEVIS INT NOT NULL AUTO_INCREMENT,
    ID_DEVIS INT NOT NULL,
    ID_ARTICLE INT NOT NULL,
    LIBELLE VARCHAR(255),
    PRIX_UNITAIRE INT,
    QUANTITE INT DEFAULT 1,
    PRIX_TOTAL INT, -- auto ?
    NIVEAU INT DEFAULT 1,
    PIECE INT DEFAULT 2,
    NUMERO_NIVEAU INT NOT NULL,
    NUMERO_PIECE INT NOT NULL,
    NUMERO_LIGNE INT NOT NULL,
    CONSTRAINT pk__articles_devis PRIMARY KEY (ID_ARTICLE_DEVIS),
    CONSTRAINT fk__articles_devis__articles FOREIGN KEY (ID_ARTICLE) REFERENCES articles (ID_ARTICLE),
    CONSTRAINT fk__articles_devis__devis FOREIGN KEY (ID_DEVIS) REFERENCES devis (ID_DEVIS)
);


create table listes_articles_rgie (
    ID_LISTE_ARTICLE_RGIE INT NOT NULL AUTO_INCREMENT,
    ID_CLIENT INT NOT NULL,
    ID_ARTICLE_DEVIS INT NOT NULL,
    CHANTIERS VARCHAR(255),
    DATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIX_TOTAL INT, -- auto ?
    CONSTRAINT pk__listes_articles_rgie PRIMARY KEY (ID_LISTE_ARTICLE_RGIE),
    CONSTRAINT fk__listes_articles_rgie__articles_devis FOREIGN KEY (ID_ARTICLE_DEVIS) REFERENCES articles_devis (ID_ARTICLE_DEVIS)
);


create table liste_articles(
    ID_LISTE_ARTICLE INT NOT NULL AUTO_INCREMENT,
    ID_LISTE_ARTICLE_RGIE INT NOT NULL,
    ID_ARTICLE_RGIE INT NOT NULL,
    LIBELLE VARCHAR(255),
    PRIX_1 INT,
    PRIX_2 INT,
    QUANTITE INT DEFAULT 1,
    CONSTRAINT pk__liste_articles PRIMARY KEY (ID_LISTE_ARTICLE),
    CONSTRAINT fk__liste_articles__articles_rgie FOREIGN KEY (ID_ARTICLE_RGIE) REFERENCES articles_rgie (ID_ARTICLE_RGIE),
    CONSTRAINT fk__liste_articles__listes_articles_rgie FOREIGN KEY (ID_LISTE_ARTICLE_RGIE) REFERENCES listes_articles_rgie (ID_LISTE_ARTICLE_RGIE)
);


create table factures                                                    -- 3 foreign keys textefacture/devis/client
(
    ID_FACTURE INT NOT NULL AUTO_INCREMENT,
    ID_CLIENT INT NOT NULL,
    ID_DEVIS INT,
    DATE_FACTURE DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier
    DATE_ECHEANCE DATE,
    DATE_FIN_TRAVAUX DATE,
    TAUX_TVA DOUBLE(4,2),	 -- 0.21 ou autre
    COMMENTAIRE VARCHAR(255),
    MONTANT INT,
    ID_TEXTE_TVA INT,
    ID_TEXTE_TRAVAUX INT,
    TEXTE_TRAVAUX VARCHAR(255),
    ID_TEXTE_FACTURE INT NOT NULL,
    CONSTRAINT pk__factures PRIMARY KEY (ID_FACTURE),
    CONSTRAINT fk__factures__texte_factures FOREIGN KEY (ID_TEXTE_FACTURE) REFERENCES texte_factures (ID_TEXTE_FACTURE),
    CONSTRAINT fk__factures__clients FOREIGN KEY (ID_CLIENT) REFERENCES clients (ID_CLIENT)
);
