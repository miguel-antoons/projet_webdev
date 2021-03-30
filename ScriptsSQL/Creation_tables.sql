CREATE DOMAIN DOMAINE_LANGUAGE char(2) NOT NULL DEFAULT 'FR' check(@col in( 'FR','NL' ) );

create table suivi_materiel                               -- aucun lien avec le reste, client ou employé ?
(
	ID_SUIVI_MATERIEL INT NOT NULL AUTO_INCREMENT,
    MATERIEL CHAR(100) NOT NULL,
    NOM CHAR(50) NOT NULL,
    TEL INT,
    EMAIL CHAR(50),
    DATE_EMPRUNT DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier
	DATE_RETOUR DATE,
	CONSTRAINT pk__suivi_materiel PRIMARY KEY (ID_SUIVI_MATERIEL)
)


create table texte_factures                                -- 1 lien avec facture
(
	ID_TEXTE_FACTURE INT NOT NULL AUTO_INCREMENT,
    CATEGORIE CHAR(50) NOT NULL,
    TEXTE_FR VARCHAR NOT NULL,
    TEXTE_NL VARCHAR NOT NULL,
	CONSTRAINT pk__texte_facture PRIMARY KEY (ID_TEXTE_FACTURE)
)


create table clients                                      -- 1 lien avec facture (censé avoir 3 liens facture/etiquette/devis)
(
	ID_CLIENT INT NOT NULL AUTO_INCREMENT,
    NOM_CLIENT CHAR(50) NOT NULL,
    PRENOM_CLIENT CHAR(50),
    SOCIETE_CLIENT CHAR(50),
    ADRESSE_CLIENT CHAR(100) NOT NULL,
    ADRESSE_CLIENT_SECONDAIRE CHAR(100),
	NUMERO_TVA_CLIENT INT,
	LANGUE_CLIENT DOMAINE_LANGUAGE, -- voir le domaine creé plus haut
	NOM_ARCHITECT CHAR(50),
	TITRE_CLIENT CHAR(50) NOT NULL,
	TELEPHONE_CLIENT INT,
	EMAIL_CLIENT CHAR(50),
	CONSTRAINT pk__clients PRIMARY KEY (ID_CLIENT)
)


create table etiquettes                                                  -- 1 foreign key vers client (id)
(
	ID_ETIQUETTE INT NOT NULL AUTO_INCREMENT,
	ID_CLIENT INT NOT NULL AUTO_INCREMENT,
    CHANTIER VARCHAR NOT NULL, -- qu'est ce que ca represente ?
	CODE_XML XML,                  -- qu'est ce que ca represente ?
	CODE_JSON VARCHAR,                 -- qu'est ce que ca represente ?
	DATE_ETIQUETTE DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier,
	CONSTRAINT pk__etiquettes PRIMARY KEY (ID_ETIQUETTE),
	CONSTRAINT fk__etiquettes__clients FOREIGN KEY (ID_CLIENT) REFERENCES clients (ID_CLIENT)
)



create table devis ()

create table factures                                                    -- 3 foreign keys textefacture/devis/client
(
	ID_FACTURE INT NOT NULL AUTO_INCREMENT,
    ID_CLIENT INT NOT NULL AUTO_INCREMENT,
    ID_DEVIS INT NOT NULL,
    DATE_DEVIS DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier
    DATE_ECHEANCE DATE,
    DATE_FIN_TRAVAUX DATE,
	TAUX_TVA DOUBLE(3,2),	 -- 0.21 ou autre
	COMMENTAIRE VARCHAR,
	MONTANT INT,
	ID_TEXTE_TVA INT,
	ID_TEXTE_TRAVAUX INT,
	TEXTE_TRAVAUX VARCHAR,
	ID_TEXTE_FACTURE INT NOT NULL AUTO_INCREMENT,
	CONSTRAINT pk__factures PRIMARY KEY (ID_FACTURE),
    CONSTRAINT fk__factures__texte_factures FOREIGN KEY (ID_TEXTE_FACTURE) REFERENCES texte_factures (ID_TEXTE_FACTURE),
	CONSTRAINT fk__factures__clients FOREIGN KEY (ID_CLIENT) REFERENCES clients (ID_CLIENT)
)
