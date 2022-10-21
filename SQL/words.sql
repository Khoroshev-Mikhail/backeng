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

INSERT INTO "words" ("eng", "rus") VALUES ('Nouns1', '���������������1');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns2', '���������������2');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns3', '���������������3');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns4', '���������������4');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns5', '���������������5');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns6', '���������������6');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns7', '���������������7');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns8', '���������������8');
INSERT INTO "words" ("eng", "rus") VALUES ('Nouns9', '���������������9');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives1', '��������������1');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives2', '��������������2');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives3', '��������������3');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives4', '��������������4');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives5', '��������������5');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives6', '��������������6');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives7', '��������������7');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives8', '��������������8');
INSERT INTO "words" ("eng", "rus") VALUES ('Adjectives9', '��������������9');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb1', '������1');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb2', '������2');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb3', '������3');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb4', '������4');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb5', '������5');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb6', '������6');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb7', '������7');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb8', '������8');
INSERT INTO "words" ("eng", "rus") VALUES ('Verb9', '������9');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb1', '�������1');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb2', '�������2');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb3', '�������3');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb4', '�������4');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb5', '�������5');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb6', '�������6');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb7', '�������7');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb8', '�������8');
INSERT INTO "words" ("eng", "rus") VALUES ('Adverb9', '�������9');

