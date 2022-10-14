/* psql -U postgres -d english -f createInsertWords.sql */
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    eng VARCHAR(25),
    rus VARCHAR(25)
);

INSERT INTO "words" ("eng", "rus") VALUES ('Love', '������');
INSERT INTO "words" ("eng", "rus") VALUES ('Purposefulness', '������������������');
INSERT INTO "words" ("eng", "rus") VALUES ('Perseverance', '�������������');
INSERT INTO "words" ("eng", "rus") VALUES ('Persistence', '��������');
INSERT INTO "words" ("eng", "rus") VALUES ('Love1', '������1');
INSERT INTO "words" ("eng", "rus") VALUES ('Love2', '������2');
INSERT INTO "words" ("eng", "rus") VALUES ('Love3', '������3');
INSERT INTO "words" ("eng", "rus") VALUES ('Love4', '������4');
INSERT INTO "words" ("eng", "rus") VALUES ('Love5', '������5');
INSERT INTO "words" ("eng", "rus") VALUES ('Love6', '������6');
INSERT INTO "words" ("eng", "rus") VALUES ('Love7', '������7');

