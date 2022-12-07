-- \i /Users/tatanaarhipova/MikeIT/backeng/SQL/content.sql

SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE texts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    title_rus VARCHAR(100),
    img VARCHAR(100) DEFAULT null,
    text_translation VARCHAR(100) DEFAULT null,
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
    title_rus VARCHAR(100),
    img VARCHAR(200) DEFAULT null,
    src VARCHAR(200) DEFAULT null,
    video_description TEXT, 
    is_global BOOLEAN DEFAULT true,
    visible BOOLEAN DEFAULT true
);

INSERT INTO "videos" ("title", "video_description") VALUES ('First video', 'first video desc');
INSERT INTO "videos" ("title", "video_description") VALUES ('Second video', 'Second video desc');

CREATE TABLE audios (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    title_rus VARCHAR(100),
    img VARCHAR(100) DEFAULT null,
    src VARCHAR(100) DEFAULT null,
    audio_description TEXT, 
    is_global BOOLEAN DEFAULT true,
    visible BOOLEAN DEFAULT true
);
INSERT INTO "audios" ("title", "audio_description") VALUES ('First audio', 'first audio desc');
INSERT INTO "audios" ("title", "audio_description") VALUES ('Second audio', 'Second audio desc');


