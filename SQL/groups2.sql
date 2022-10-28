SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE word_groups (
    id SERIAL PRIMARY KEY,
    title VARCHAR (100),
    title_rus VARCHAR (100),
);

CREATE TABLE words_groups_references (
    id SERIAL PRIMARY KEY,
    id_word VARCHAR (100),
    id_group VARCHAR (100),
);

INSERT INTO "word_groups" ("title", "title_rus", "word_ids") VALUES ('100nouns', '���-100 ���������������', ARRAY[1,2,3,4,5,6,7,8,9]);
INSERT INTO "word_groups" ("title", "title_rus", "word_ids") VALUES ('100adjectives', '���-100 ��������������', ARRAY[10,11,12,13,14,15,16,17,18]);
INSERT INTO "word_groups" ("title", "title_rus", "word_ids") VALUES ('100adverbs', '���-100 �������', ARRAY[19,20,21,22,23,24,25,26,27]);
INSERT INTO "word_groups" ("title", "title_rus", "word_ids") VALUES ('100verbs', '���-100 ��������', ARRAY[28,29,30,31,32,33,34,35,36]);


