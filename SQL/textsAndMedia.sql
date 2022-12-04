-- \i /Users/tatanaarhipova/MikeIT/backeng/SQL/textsAndMedia.sql

SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE texts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    img VARCHAR(100) DEFAULT null,
    text_body TEXT, 
    is_global BOOLEAN DEFAULT true,
    visible BOOLEAN DEFAULT true
);

INSERT INTO "texts" ("title", "text_body") VALUES ('First test text', 'test text body');
INSERT INTO "texts" ("title", "text_body") VALUES ('Second text', 'second test text body');
INSERT INTO "texts" ("title", "text_body") VALUES ('Third text', 'third test text body');

CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    img VARCHAR(100) DEFAULT null,
    video_description TEXT, 
    is_global BOOLEAN DEFAULT true,
    visible BOOLEAN DEFAULT true
);

INSERT INTO "videos" ("title", "video_description") VALUES ('First video', 'first video desc');
INSERT INTO "videos" ("title", "video_description") VALUES ('Second video', 'Second video desc');

CREATE TABLE audios (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    img VARCHAR(100) DEFAULT null,
    audio_description TEXT, 
    is_global BOOLEAN DEFAULT true,
    visible BOOLEAN DEFAULT true
);
INSERT INTO "audios" ("title", "audio_description") VALUES ('First video', 'first video desc');
INSERT INTO "audios" ("title", "audio_description") VALUES ('Second video', 'Second video desc');

-- CREATE TABLE content_references (
--     id_group INTEGER REFERENCES word_groups (id) DEFAULT null ON DELETE SET null,
--     id_text INTEGER REFERENCES texts (id) DEFAULT null ON DELETE SET null,
--     id_video INTEGER REFERENCES texts (id) DEFAULT null ON DELETE SET null,
--     id_audio INTEGER REFERENCES texts (id) DEFAULT null ON DELETE SET null
-- );

-- INSERT INTO "content_references" ("id_group", "id_text", "id_audio", "id_video") VALUES ('1', '1', '1', '1');

