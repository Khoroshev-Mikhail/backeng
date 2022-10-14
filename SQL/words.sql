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

INSERT INTO "words" ("eng", "rus") VALUES ('Love', 'Любовь');
INSERT INTO "words" ("eng", "rus") VALUES ('Purposefulness', 'Целеустремленность');
INSERT INTO "words" ("eng", "rus") VALUES ('Perseverance', 'Настойчивость');
INSERT INTO "words" ("eng", "rus") VALUES ('Persistence', 'Упорство');
INSERT INTO "words" ("eng", "rus") VALUES ('Love1', 'Любовь1');
INSERT INTO "words" ("eng", "rus") VALUES ('Love2', 'Любовь2');
INSERT INTO "words" ("eng", "rus") VALUES ('Love3', 'Любовь3');
INSERT INTO "words" ("eng", "rus") VALUES ('Love4', 'Любовь4');
INSERT INTO "words" ("eng", "rus") VALUES ('Love5', 'Любовь5');
INSERT INTO "words" ("eng", "rus") VALUES ('Love6', 'Любовь6');
INSERT INTO "words" ("eng", "rus") VALUES ('Love7', 'Любовь7');

