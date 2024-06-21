-- CREATE TYPE DOMAINE_LANGUAGE char(2) NOT NULL DEFAULT 'FR' check(@col in( 'FR','NL' ) );

create table material_loaning                               -- aucun lien avec le reste, client ou employé ?
(
    ID_MATERIAL_LOANING SERIAL2,
    MATERIAL_NAME VARCHAR(100) NOT NULL,
    LOANER_NAME VARCHAR(50) NOT NULL,
    PHONE VARCHAR(15),
    EMAIL VARCHAR(50),
    START_DATE DATE NOT NULL, -- a vérifier
    END_DATE DATE,
    CONSTRAINT pk_material_loaning PRIMARY KEY (ID_MATERIAL_LOANING)
);


create table invoice_text                                -- 1 lien avec facture
(
    ID_INVOICE_TEXT SERIAL4,
    CATEGORY VARCHAR(50) NOT NULL,
    TEXT_FR VARCHAR(255) NOT NULL,
    TEXT_NL VARCHAR(255) NOT NULL,
    TEXT_EN VARCHAR(255) NOT NULL,
    CONSTRAINT pk_invoice_text PRIMARY KEY (ID_INVOICE_TEXT)
);

create table customers                                     -- 1 lien avec facture (censé avoir 3 liens facture/etiquette/devis)
(
    ID_CUSTOMER SERIAL2,
    LAST_NAME VARCHAR(50) NOT NULL,
    FIRST_NAME VARCHAR(50),
    COMPANY VARCHAR(50),
    PRIMARY_ADDRESS VARCHAR(100) NOT NULL,
    SECONDARY_ADDRESS VARCHAR(100),
    BTW_TVA_NUMBER VARCHAR(20),
    LANGUAGE CHAR(3), -- le domaine casse les couilles
    DEFAULT_ARCHITECT INT,
    CLIENT_TITLE VARCHAR(50) NOT NULL,
    PHONE VARCHAR(15),
    PHONE2 VARCHAR(15),
    EMAIL VARCHAR(50),
    CREATION_DATE TIMESTAMP NOT NULL,
    LAST_MODIFIED TIMESTAMP NOT NULL,
    CONSTRAINT pk_customers PRIMARY KEY (ID_CUSTOMER)
);


create table labels                                                  -- 1 foreign key vers client (id)
(
    ID_LABEL SERIAL4,
    ID_CUSTOMER INT NOT NULL,
    CONSTRUCTION_SITE VARCHAR(100) NOT NULL, -- qu'est ce que ca represente ?
    CODE_JSON TEXT,                 -- qu'est ce que ca represente ?
    CREATION_DATE TIMESTAMP NOT NULL,
    LAST_MODIFIED TIMESTAMP NOT NULL,
    CONSTRAINT pk_labels PRIMARY KEY (ID_LABEL),
    CONSTRAINT fk_labels_customers FOREIGN KEY (ID_CUSTOMER) REFERENCES customers (ID_CUSTOMER)
);


create table estimate_text (
    ID_ESTIMATE_TEXT SERIAL4,
    CATEGORY VARCHAR(20),
    TEXT_NL VARCHAR(255) NOT NULL,
    TEXT_FR VARCHAR(255) NOT NULL,
    TEXT_EN VARCHAR(255) NOT NULL,
    CONSTRAINT pk_estimate_text PRIMARY KEY (ID_ESTIMATE_TEXT)
);


create table estimates (
    ID_ESTIMATE SERIAL4,
    ID_CUSTOMER INT NOT NULL,
    ID_ESTIMATE_TEXT INT NOT NULL,
    CREATION_DATE TIMESTAMP NOT NULL, -- a vérifier
    LAST_MODIFIED TIMESTAMP NOT NULL,
    CONSTRUCTION_SITE TEXT,
    PRICE_CHOICE INT,              -- BETWEEN 1 AND 3 ,
    PRICE_BIAS_PERCENTAGE INT,
    PRICE_BIAS_CONST INT,
    ID_PRICE_TEXT INT,
    ID_PAYEMENT_TEXT INT,
    ID_INTRO_TEXT INT,
    CONSTRUCTION_SITE_NAME varchar(255),
    COMMENT varchar(255),
    CONSTRAINT pk_estimates PRIMARY KEY (ID_ESTIMATE),
    CONSTRAINT fk_estimates__customers FOREIGN KEY (ID_CUSTOMER) REFERENCES customers (ID_CUSTOMER),
    CONSTRAINT fk_estimates__estimate_text FOREIGN KEY (ID_ESTIMATE_TEXT) REFERENCES estimate_text (ID_ESTIMATE_TEXT)
);


create table articles (
    ID_ARTICLE SERIAL4,
    LABEL_FR VARCHAR(255) NOT NULL,
    LABEL_NL VARCHAR(255) NOT NULL,
    LABEL_EN VARCHAR(255) NOT NULL,
    CATEGORY VARCHAR(20),
    PRICE_1 INT NOT NULL,
    PRICE_2 INT,
    PRICE_3 INT,
    CREATION_DATE TIMESTAMP NOT NULL,
    LAST_MODIFIED TIMESTAMP NOT NULL,
    CONSTRAINT pk_articles PRIMARY KEY (ID_ARTICLE)
);


create table articles_rgie (
    ID_ARTICLE_RGIE SERIAL4,
    LABEL_FR VARCHAR(255) NOT NULL,
    LABEL_NL VARCHAR(255) NOT NULL,
    LABEL_EN VARCHAR(255) NOT NULL,
    PRICE_1 INT NOT NULL,
    PRICE_2 INT,
    CREATION_DATE TIMESTAMP NOT NULL,
    LAST_MODIFIED TIMESTAMP NOT NULL,
    CONSTRAINT pk_articles_rgie PRIMARY KEY (ID_ARTICLE_RGIE)
);


create table articles_estimate (
    ID_ARTICLE_ESTIMATE SERIAL4,
    ID_ESTIMATE INT NOT NULL,
    ID_ARTICLE INT NOT NULL,
    LABEL VARCHAR(255),
    UNIT_PRICE INT,
    QUANTITY INT DEFAULT 1,
    TOTAL_PRICE INT, -- auto ?
    LEVEL INT DEFAULT 1,
    ROOM INT DEFAULT 2,
    LEVEL_NUMBER INT NOT NULL,
    ROOM_NUMBER INT NOT NULL,
    CIRCUIT_NUMBER INT NOT NULL,
    CONSTRAINT pk_articles_estimates PRIMARY KEY (ID_ARTICLE_ESTIMATE),
    CONSTRAINT fk_articles_estimates__articles FOREIGN KEY (ID_ARTICLE) REFERENCES articles (ID_ARTICLE),
    CONSTRAINT fk_articles_estimates__estimates FOREIGN KEY (ID_ESTIMATE) REFERENCES estimates (ID_ESTIMATE)
);


create table list_rgie_articles (
    ID_LIST_RGIE_ARTICLE SERIAL4,
    ID_CUSTOMER INT NOT NULL,
    ID_ARTICLE_ESTIMATE INT NOT NULL,
    CONSTRUCTION_SITE VARCHAR(255),
    CREATION_DATE TIMESTAMP NOT NULL,
    LAST_MODIFIED TIMESTAMP NOT NULL,
    TOTAL_PRICE INT, -- auto ?
    CONSTRAINT pk_list_rgie_articles PRIMARY KEY (ID_LIST_RGIE_ARTICLE),
    CONSTRAINT fk_list_rgie_article__articles_estimate FOREIGN KEY (ID_ARTICLE_ESTIMATE) REFERENCES articles_estimate (ID_ARTICLE_ESTIMATE)
);


create table list_articles(
    ID_LIST_ARTICLE SERIAL4,
    ID_LIST_RGIE_ARTICLE INT NOT NULL,
    ID_RGIE_ARTICLE INT NOT NULL,
    LABEL VARCHAR(255),
    PRICE_1 INT,
    PRICE_2 INT,
    QUANTITY INT DEFAULT 1,
    CONSTRAINT pk_list_articles PRIMARY KEY (ID_LIST_ARTICLE),
    CONSTRAINT fk_list_articles__articles_rgie FOREIGN KEY (ID_RGIE_ARTICLE) REFERENCES articles_rgie (ID_ARTICLE_RGIE),
    CONSTRAINT fk__list_articles__list_rgie_articles FOREIGN KEY (ID_LIST_RGIE_ARTICLE) REFERENCES list_rgie_articles (ID_LIST_RGIE_ARTICLE)
);


create table invoices                                                    -- 3 foreign keys textefacture/devis/client
(
    ID_INVOICE SERIAL4,
    ID_CUSTOMER INT NOT NULL,
    ID_ESTIMATE INT,
    CREATION_DATE TIMESTAMP NOT NULL,
    LAST_MODIFIED TIMESTAMP NOT NULL,
    DUE_DATE DATE,
    CONSTRUCTION_END_DATE DATE,
    TAX_RATE FLOAT4,	 -- 0.21 ou autre
    COMMENT VARCHAR(255),
    AMOUNT INT,
    ID_TAX_TEXT INT,
    ID_WORKS_TEXT INT,
    WORKS_TEXT VARCHAR(255),
    ID_INVOICE_TEXT INT NOT NULL,
    CONSTRAINT pk_invoices PRIMARY KEY (ID_INVOICE),
    CONSTRAINT fk_invoice__invoice_text FOREIGN KEY (ID_INVOICE_TEXT) REFERENCES invoice_text (ID_INVOICE_TEXT),
    CONSTRAINT fk_invoices__customers FOREIGN KEY (ID_CUSTOMER) REFERENCES customers (ID_CUSTOMER)
);
