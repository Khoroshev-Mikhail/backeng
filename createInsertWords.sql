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

