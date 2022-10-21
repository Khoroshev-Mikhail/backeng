/* psql -U postgres -d english -f words.sql */
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    eng VARCHAR(25),
    rus VARCHAR(25),
    img VARCHAR(100) DEFAULT null,
    audio VARCHAR(100) DEFAULT null
);

INSERT INTO "words" ("eng", "rus") VALUES ('Nouns1', 'Существительное1');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns2', 'Существительное2');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns3', 'Существительное3');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns4', 'Существительное4');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns5', 'Существительное5');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns6', 'Существительное6');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns7', 'Существительное7');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns8', 'Существительное8');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns9', 'Существительное9');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives1', 'Прилагательное1');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives2', 'Прилагательное2');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives3', 'Прилагательное3');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives4', 'Прилагательное4');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives5', 'Прилагательное5');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives6', 'Прилагательное6');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives7', 'Прилагательное7');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives8', 'Прилагательное8');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives9', 'Прилагательное9');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb1', 'Глагол1');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb2', 'Глагол2');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb3', 'Глагол3');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb4', 'Глагол4');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb5', 'Глагол5');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb6', 'Глагол6');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb7', 'Глагол7');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb8', 'Глагол8');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb9', 'Глагол9');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb1', 'Наречие1');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb2', 'Наречие2');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb3', 'Наречие3');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb4', 'Наречие4');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb5', 'Наречие5');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb6', 'Наречие6');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb7', 'Наречие7');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb8', 'Наречие8');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb9', 'Наречие9');

