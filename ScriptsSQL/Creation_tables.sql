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


create table devis_texte (
    ID_DEVIS_TEXTE INT NOT NULL AUTO_INCREMENT,
    CATEGORIE CHAR(20),
    TEXTE_NL VARCHAR NOT NULL,
    TEXTE_FR VARCHAR NOT NULL,
    CONSTRAINT pk__devis_texte PRIMARY KEY (ID_DEVIS_TEXTE)
)


create table devis (
    ID_DEVIS INT NOT NULL AUTO_INCREMENT,
    ID_CLIENT INT NOT NULL AUTO_INCREMENT,
    DATE_DEVIS DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier
    CHANTIER,
    CHOIX_PRIX,
    MODIFICATION_PRIX_%,
    MODIFICATION_PRIX_FIXE,
    ID_TEXTE_PRIX,
    ID_TEXTE_PAIEMENT,
    ID_TEXTE_INTRODUCTION,
)


create table articles (
    ID_ARTICLE INT NOT NULL AUTO_INCREMENT,
    LIBELLE_FR VARCHAR NOT NULL,
    LIBELLE_NL VARCHAR NOT NULL,
    CATEGORIE CHAR(20),
    PRIX_1 INT NOT NULL,
    PRIX_2 INT,
    PRIX_3 INT,
    CONSTRAINT pk__articles PRIMARY KEY (ID_ARTICLE)
)


create table articles_rgie (
    ID_ARTICLE_RGIE INT NOT NULL AUTO_INCREMENT,
    LIBELLE_FR VARCHAR NOT NULL,
    LIBELLE_NL VARCHAR NOT NULL,
    PRIX_1 INT NOT NULL?
    PRIX_2 INT,
    CONSTRAINT pk__articles_rgie PRIMARY KEY (ID_ARTICLE_RGIE)
)


create table articles_devis (
    ID_DEVIS INT NOT NULL AUTO_INCREMENT,
    ID_ARTICLE_DEVIS INT NOT NULL AUTO_INCREMENT,
   
)


create table listes_articles_rgie (
    ID_LISTE_ARTICLE_RGIE
)


create table liste_articles(
    ID_LISTE_ARTICLE,
    ID_ARTICLE_RGIE,
    LIBELLE,
    PRIX_1,
    PRIX_2,
    QUANTITE,
    CONSTRAINT pk__liste_articles PRIMARY KEY (ID_LISTE_ARTICLE),
    CONSTRAINT fk__liste_articles__articles_rgie FOREIGN KEY (ID_ARTICLE_RGIE) REFERENCES articles_rgie (ID_ARTICLE_RGIE),
    CONSTRAINT fk__liste_articles__listes_articles_rgie FOREIGN KEY (ID_LISTE_ARTICLE_RGIE) REFERENCES listes_articles_rgie (ID_LISTE_ARTICLE_RGIE)
)


create table factures                                                    -- 3 foreign keys textefacture/devis/client
(
    ID_FACTURE INT NOT NULL AUTO_INCREMENT,
    ID_CLIENT INT NOT NULL AUTO_INCREMENT,
    ID_DEVIS INT NOT NULL AUTO_INCREMENT,
    DATE_FACTURE DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier
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
    CONSTRAINT fk__factures__clients FOREIGN KEY (ID_CLIENT) REFERENCES clients (ID_CLIENT),
    CONSTRAINT fk__factures__devis FOREIGN KEY (ID_DEVIS) REFERENCES devis (ID_DEVIS)
)
