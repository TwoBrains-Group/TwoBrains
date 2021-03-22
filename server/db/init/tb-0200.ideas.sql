BEGIN TRANSACTION;
SET search_path TO main;

-- idea_relation --
CREATE TYPE main.idea_relation AS ENUM ('user', 'project');

-- ideas --
DROP TABLE IF EXISTS main.ideas;
CREATE TABLE main.ideas (
    idea_id SERIAL8 NOT NULL,
    user_id INT4 NOT NULL,
    name TEXT NOT NULL,
    "text" TEXT NOT NULL,
    relation main.idea_relation NOT NULL DEFAULT 'user'::main.idea_relation,
    creation_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_edit_datetime TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    deleted TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    tsv tsvector NOT NULL,
    CONSTRAINT ideas_idea_id_pkey PRIMARY KEY (idea_id),
    CONSTRAINT ideas_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id)
);

COMMENT ON TABLE main.ideas IS 'Ideas table';
COMMENT ON COLUMN main.ideas.idea_id IS 'Idea id';
COMMENT ON COLUMN main.ideas.user_id IS 'Idea user id foreign key';
COMMENT ON COLUMN main.ideas.name IS 'Idea name';
COMMENT ON COLUMN main.ideas.text IS 'Idea text';
COMMENT ON COLUMN main.ideas.relation IS 'Idea relation';
COMMENT ON COLUMN main.ideas.creation_datetime IS 'Idea creation datetime';
COMMENT ON COLUMN main.ideas.last_edit_datetime IS 'Idea last edit datetime';
COMMENT ON COLUMN main.ideas.deleted IS 'Idea deletion datetime';
COMMENT ON COLUMN main.ideas.tsv IS 'Idea tsvector for search';

-- ideas_tsv_idx --
CREATE INDEX ideas_tsv_idx ON main.ideas USING gin(tsv);

-- ideas_tsv_update --
CREATE FUNCTION ideas_tsv_update() RETURNS trigger AS $$
BEGIN
    new.tsv =
        setweight(to_tsvector(new.name), 'A') ||
        setweight(to_tsvector(new.text), 'D');
    return new;
END
$$ LANGUAGE plpgsql;

-- ideas_tsv_update_trigger --
CREATE TRIGGER ideas_tsv_update_trigger BEFORE INSERT OR UPDATE
ON main.ideas FOR EACH ROW EXECUTE PROCEDURE ideas_tsv_update();

-- ideas_likes --
CREATE TABLE main.ideas_likes (
    user_id INT4 NOT NULL,
    idea_id INT8 NOT NULL,
    dislike BOOL NOT NULL DEFAULT FALSE,
    creation_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT users_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT users_likes_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES main.ideas(idea_id)
);

COMMENT ON TABLE main.ideas_likes IS 'Ideas-likes binding table';
COMMENT ON COLUMN main.ideas_likes.user_id IS 'User id foreign key';
COMMENT ON COLUMN main.ideas_likes.idea_id IS 'Idea id foreign key';
COMMENT ON COLUMN main.ideas_likes.dislike IS 'Dislike flag';
COMMENT ON COLUMN main.ideas_likes.creation_datetime IS 'Creation timestamp';

-- ideas_comments --
CREATE TABLE main.ideas_comments (
    idea_comment_id BIGSERIAL NOT NULL,
    idea_id INT8 NOT NULL,
    user_id INT4 NOT NULL,
    text TEXT NOT NULL,
    reply_to INT8 DEFAULT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_edit_datetime TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    deleted TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT ideas_comments_idea_comment_id_pkey PRIMARY KEY (idea_comment_id),
    CONSTRAINT ideas_comments_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES main.ideas(idea_id),
    CONSTRAINT ideas_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT ideas_comments_reply_to_fkey FOREIGN KEY (idea_comment_id) REFERENCES main.ideas_comments(idea_comment_id)
);

COMMENT ON TABLE main.ideas_comments IS 'Ideas-comments table';
COMMENT ON COLUMN main.ideas_comments.idea_comment_id IS 'Idea comment id';
COMMENT ON COLUMN main.ideas_comments.idea_id IS 'Idea comment idea_id foreign key';
COMMENT ON COLUMN main.ideas_comments.user_id IS 'Idea comment user_id foreign key';
COMMENT ON COLUMN main.ideas_comments.text IS 'Idea comment text';
COMMENT ON COLUMN main.ideas_comments.reply_to IS 'Idea comment reply comment id foreign key';
COMMENT ON COLUMN main.ideas_comments.creation_datetime IS 'Idea comment creation timestamp';
COMMENT ON COLUMN main.ideas_comments.last_edit_datetime IS 'Idea comment last edit datetime';
COMMENT ON COLUMN main.ideas_comments.deleted IS 'Idea comment deletion timestamp';

-- ideas_comments_likes --
CREATE TABLE main.ideas_comments_likes (
    idea_comment_id INT8 NOT NULL,
    user_id INT4 NOT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT ideas_comments_likes_idea_comment_id_fkey FOREIGN KEY (idea_comment_id) REFERENCES main.ideas_comments(idea_comment_id),
    CONSTRAINT ideas_comments_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id)
);

COMMENT ON TABLE main.ideas_comments_likes IS 'Ideas-comments-likes binding table';
COMMENT ON COLUMN main.ideas_comments_likes.idea_comment_id IS 'Idea comment like id foreign key';
COMMENT ON COLUMN main.ideas_comments_likes.user_id IS 'User id foreign key';
COMMENT ON COLUMN main.ideas_comments_likes.creation_datetime IS 'Creation timestamp';

-- ideas_tags --
CREATE TABLE main.ideas_tags (
    idea_id INT8 NOT NULL,
    tag_id INT2 NOT NULL,
    CONSTRAINT ideas_tags_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES main.ideas(idea_id),
    CONSTRAINT ideas_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES main.tags(tag_id),
    CONSTRAINT ideas_tags_idea_id_tag_id_ukey UNIQUE (idea_id, tag_id)
);

COMMENT ON TABLE main.ideas_tags IS 'Ideas tags table';
COMMENT ON COLUMN main.ideas_tags.idea_id IS 'Idea id';
COMMENT ON COLUMN main.ideas_tags.tag_id IS 'Tag id';


COMMIT;
