SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE word_groups (
    id SERIAL PRIMARY KEY,
    title VARCHAR (100),
    title_rus VARCHAR (100),
    word_ids INTEGER[]
);

INSERT INTO "word_groups" ("title", "title_rus", "word_ids") VALUES ('100nouns', 'Топ-100 Существительных', ARRAY[1,2,3,4,5,6,7,8,9]);
INSERT INTO "word_groups" ("title", "title_rus", "word_ids") VALUES ('100adjectives', 'Топ-100 Прилагательных', ARRAY[1,2,3]);
INSERT INTO "word_groups" ("title", "title_rus", "word_ids") VALUES ('100adverbs', 'Топ-100 Наречий', ARRAY[1,2,3]);
INSERT INTO "word_groups" ("title", "title_rus", "word_ids") VALUES ('100verbs', 'Топ-100 Глаголов', ARRAY[1,2,3]);


