-- \i /Users/tatanaarhipova/MikeIT/backeng/SQL/groups.sql

SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    title VARCHAR (100),
    title_rus VARCHAR (100),
    img VARCHAR (100),
    is_global BOOLEAN DEFAULT true,
    words INTEGER[] /*Когда удаляется слово надо автоматически удалять айдишник слова из этого массива. Желательно удалять из массива*/
);

INSERT INTO "groups" ("title", "title_rus", "words") VALUES ('100nouns', 'Топ-100 Существительных', ARRAY[1,2,3,4,5,6,7,8,9]);
INSERT INTO "groups" ("title", "title_rus", "words") VALUES ('100adjectives', 'Топ-100 Прилагательных', ARRAY[10,11,12,13,14,15,16,17,18]);
INSERT INTO "groups" ("title", "title_rus", "words") VALUES ('100adverbs', 'Топ-100 Наречий', ARRAY[19,20,21,22,23,24,25,26,27]);
INSERT INTO "groups" ("title", "title_rus", "words") VALUES ('100verbs', 'Топ-100 Глаголов', ARRAY[28,29,30,31,32,33,34,35,36]);


