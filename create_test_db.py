import mysql.connector

test_db = mysql.connector.connect(
    host="localhost",
    user="root",
    password=""
)

cursor = test_db.cursor()

cursor.execute("CREATE DATABASE test_db")

test_db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="test_psw",
    database="test_db"
)

cursor = test_db.cursor()

cursor.execute("""
    create table suivi_materiel
    (
        ID_SUIVI_MATERIEL INT NOT NULL AUTO_INCREMENT,
        MATERIEL VARCHAR(100) NOT NULL,
        NOM VARCHAR(50) NOT NULL,
        TEL VARCHAR(20),
        EMAIL VARCHAR(50),
        DATE_EMPRUNT DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier
        DATE_RETOUR DATE,
        CONSTRAINT pk__suivi_materiel PRIMARY KEY (ID_SUIVI_MATERIEL)
    )
""")

cursor.execute("""
    create table clients
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
    )
""")

cursor.execute("""
    create table texte_factures
    (
        ID_TEXTE_FACTURE INT NOT NULL AUTO_INCREMENT,
        CATEGORIE VARCHAR(50) NOT NULL,
        TEXTE_FR VARCHAR(255) NOT NULL,
        TEXTE_NL VARCHAR(255) NOT NULL,
        CONSTRAINT pk__texte_facture PRIMARY KEY (ID_TEXTE_FACTURE)
    )
""")

cursor.execute("""
    create table etiquettes 
    (
        ID_ETIQUETTE INT NOT NULL AUTO_INCREMENT,
        ID_CLIENT INT NOT NULL,
        CHANTIER VARCHAR(100) NOT NULL, -- qu'est ce que ca represente ?
        CODE_JSON LONGTEXT,                 -- qu'est ce que ca represente ?
        DATE_ETIQUETTE DATETIME DEFAULT CURRENT_TIMESTAMP, -- a vérifier,
        CONSTRAINT pk__etiquettes PRIMARY KEY (ID_ETIQUETTE),
        CONSTRAINT fk__etiquettes__clients FOREIGN KEY (ID_CLIENT) REFERENCES clients (ID_CLIENT)
    )
""")

cursor.execute("""
    create table devis_texte
    (
        ID_DEVIS_TEXTE INT NOT NULL AUTO_INCREMENT,
        CATEGORIE VARCHAR(20),
        TEXTE_NL VARCHAR(255) NOT NULL,
        TEXTE_FR VARCHAR(255) NOT NULL,
        CONSTRAINT pk__devis_texte PRIMARY KEY (ID_DEVIS_TEXTE)
    )
""")

cursor.execute("""
    create table devis 
    (
        ID_DEVIS INT NOT NULL AUTO_INCREMENT,
        ID_CLIENT INT NOT NULL,
        ID_DEVIS_TEXTE,
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
    )
""")

cursor.execute("""
    create table articles
    (
        ID_ARTICLE INT NOT NULL AUTO_INCREMENT,
        LIBELLE_FR VARCHAR(255) NOT NULL,
        LIBELLE_NL VARCHAR(255) NOT NULL,
        CATEGORIE VARCHAR(20),
        PRIX_1 INT NOT NULL,
        PRIX_2 INT,
        PRIX_3 INT,
        CONSTRAINT pk__articles PRIMARY KEY (ID_ARTICLE)
    )
""")

cursor.execute("""
    CREATE TABLE `rgie` (
        `ID_LISTE_ARTICLE_RGIE` int NOT NULL AUTO_INCREMENT,
        `ID_CLIENT` int NOT NULL,
        `CHANTIER` varchar(255) DEFAULT NULL,
        `DATE` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`ID_LISTE_ARTICLE_RGIE`),
        KEY `fk__rgie__clients` (`ID_CLIENT`),
        CONSTRAINT `fk__rgie__clients` FOREIGN KEY (`ID_CLIENT`) REFERENCES `clients` (`ID_CLIENT`)
    )
""")

cursor.execute("""
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
    )
""")

sql_statement = """
    INSERT INTO clients (
        NOM_CLIENT, PRENOM_CLIENT, TITRE_CLIENT, SOCIETE_CLIENT,
        LANGUE_CLIENT, ADRESSE_CLIENT, NUMERO_TVA_CLIENT, TELEPHONE_CLIENT,
        EMAIL_CLIENT
    )
    VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""
arguments = (
    'Dupont',
    'Jean',
    'Mr',
    'test_societe',
    'Fr',
    'test_street 000, 0000 test_city',
    '010101010101',
    '050505050505',
    'jeandupont@example.com',
)

cursor.execute(sql_statement, arguments)

test_db.commit()
