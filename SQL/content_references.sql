-- \i /Users/tatanaarhipova/MikeIT/backeng/SQL/content_references.sql

SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE content_references (
    id_group INTEGER REFERENCES word_groups (id) ON DELETE SET null DEFAULT null,
    id_text INTEGER REFERENCES texts (id) ON DELETE SET null DEFAULT null,
    id_video INTEGER REFERENCES audios (id) ON DELETE SET null DEFAULT null,
    id_audio INTEGER REFERENCES videos (id)  ON DELETE SET null DEFAULT null
);

INSERT INTO "content_references" ("id_group", "id_text") VALUES ('1', '1');
INSERT INTO "content_references" ("id_group", "id_text", "id_audio", "id_video") VALUES ('2', '2', '2', '2');
INSERT INTO "content_references" ("id_group", "id_text") VALUES ('3', '3');

