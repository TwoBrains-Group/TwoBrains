BEGIN TRANSACTION;
SET search_path TO main;

-- locales --
CREATE TABLE main.locales (
    locale_id SERIAL2 NOT NULL,
    code VARCHAR(2) NOT NULL,
    label TEXT NOT NULL,
    translatable BOOL NOT NULL DEFAULT FALSE,
    state main.state NOT NULL DEFAULT 'enabled'::main.state,
    "default" BOOL NOT NULL DEFAULT FALSE,
    CONSTRAINT locales_locale_id_pkey PRIMARY KEY (locale_id),
    CONSTRAINT locales_code_ukey UNIQUE (code)
);

CREATE UNIQUE INDEX locales_default_ukey ON main.locales("default") WHERE ("default" IS TRUE);

COMMENT ON TABLE main.locales IS 'Locales table';
COMMENT ON COLUMN main.locales.locale_id IS 'Locale id';
COMMENT ON COLUMN main.locales.code IS 'ISO 639-1 locale code';
COMMENT ON COLUMN main.locales.translatable IS 'Is used for content translation';
COMMENT ON COLUMN main.locales.state IS 'Locale state - enabled/disabled';

-- locales_l10n --
CREATE TABLE main.locales_l10n (
    locale_id INT2 NOT NULL,
    label TEXT NOT NULL,
    CONSTRAINT locales_l10n_locale_id_fkey FOREIGN KEY (locale_id) REFERENCES main.locales(locale_id),
    CONSTRAINT locales_l10n_locale_id_ukey UNIQUE (locale_id)
);

COMMENT ON TABLE main.locales_l10n IS 'Locales l10n data';
COMMENT ON COLUMN main.locales_l10n.label IS 'Locale localized label';

-- get_default_locale --
CREATE OR REPLACE FUNCTION main.get_default_locale() RETURNS INT2
AS $$
    BEGIN
        RETURN
            (SELECT
                l.locale_id
            FROM
                main.locales AS l
            WHERE
                l.code = 'en');
    END;
$$ LANGUAGE plpgsql;

INSERT INTO main.locales (code, label) values ('aa', 'Afar');
INSERT INTO main.locales (code, label) values ('ab', 'Abkhazian');
INSERT INTO main.locales (code, label) values ('ae', 'Avestan');
INSERT INTO main.locales (code, label) values ('af', 'Afrikaans');
INSERT INTO main.locales (code, label) values ('ak', 'Akan');
INSERT INTO main.locales (code, label) values ('am', 'Amharic');
INSERT INTO main.locales (code, label) values ('an', 'Aragonese');
INSERT INTO main.locales (code, label) values ('ar', 'Arabic');
INSERT INTO main.locales (code, label) values ('as', 'Assamese');
INSERT INTO main.locales (code, label) values ('av', 'Avaric');
INSERT INTO main.locales (code, label) values ('ay', 'Aymara');
INSERT INTO main.locales (code, label) values ('az', 'Azerbaijani');
INSERT INTO main.locales (code, label) values ('ba', 'Bashkir');
INSERT INTO main.locales (code, label) values ('be', 'Belarusian');
INSERT INTO main.locales (code, label) values ('bg', 'Bulgarian');
INSERT INTO main.locales (code, label) values ('bh', 'Bihari languages');
INSERT INTO main.locales (code, label) values ('bi', 'Bislama');
INSERT INTO main.locales (code, label) values ('bm', 'Bambara');
INSERT INTO main.locales (code, label) values ('bn', 'Bengali');
INSERT INTO main.locales (code, label) values ('bo', 'Tibetan');
INSERT INTO main.locales (code, label) values ('br', 'Breton');
INSERT INTO main.locales (code, label) values ('bs', 'Bosnian');
INSERT INTO main.locales (code, label) values ('ca', 'Catalan; Valencian');
INSERT INTO main.locales (code, label) values ('ce', 'Chechen');
INSERT INTO main.locales (code, label) values ('ch', 'Chamorro');
INSERT INTO main.locales (code, label) values ('co', 'Corsican');
INSERT INTO main.locales (code, label) values ('cr', 'Cree');
INSERT INTO main.locales (code, label) values ('cs', 'Czech');
INSERT INTO main.locales (code, label) values ('cu', 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic');
INSERT INTO main.locales (code, label) values ('cv', 'Chuvash');
INSERT INTO main.locales (code, label) values ('cy', 'Welsh');
INSERT INTO main.locales (code, label) values ('da', 'Danish');
INSERT INTO main.locales (code, label) values ('de', 'German');
INSERT INTO main.locales (code, label) values ('dv', 'Divehi; Dhivehi; Maldivian');
INSERT INTO main.locales (code, label) values ('dz', 'Dzongkha');
INSERT INTO main.locales (code, label) values ('ee', 'Ewe');
INSERT INTO main.locales (code, label) values ('el', 'Greek, Modern (1453-)');
INSERT INTO main.locales (code, label) values ('en', 'English');
INSERT INTO main.locales (code, label) values ('eo', 'Esperanto');
INSERT INTO main.locales (code, label) values ('es', 'Spanish; Castilian');
INSERT INTO main.locales (code, label) values ('et', 'Estonian');
INSERT INTO main.locales (code, label) values ('eu', 'Basque');
INSERT INTO main.locales (code, label) values ('fa', 'Persian');
INSERT INTO main.locales (code, label) values ('ff', 'Fulah');
INSERT INTO main.locales (code, label) values ('fi', 'Finnish');
INSERT INTO main.locales (code, label) values ('fj', 'Fijian');
INSERT INTO main.locales (code, label) values ('fo', 'Faroese');
INSERT INTO main.locales (code, label) values ('fr', 'French');
INSERT INTO main.locales (code, label) values ('fy', 'Western Frisian');
INSERT INTO main.locales (code, label) values ('ga', 'Irish');
INSERT INTO main.locales (code, label) values ('gd', 'Gaelic; Scottish Gaelic');
INSERT INTO main.locales (code, label) values ('gl', 'Galician');
INSERT INTO main.locales (code, label) values ('gn', 'Guarani');
INSERT INTO main.locales (code, label) values ('gu', 'Gujarati');
INSERT INTO main.locales (code, label) values ('gv', 'Manx');
INSERT INTO main.locales (code, label) values ('ha', 'Hausa');
INSERT INTO main.locales (code, label) values ('he', 'Hebrew');
INSERT INTO main.locales (code, label) values ('hi', 'Hindi');
INSERT INTO main.locales (code, label) values ('ho', 'Hiri Motu');
INSERT INTO main.locales (code, label) values ('hr', 'Croatian');
INSERT INTO main.locales (code, label) values ('ht', 'Haitian; Haitian Creole');
INSERT INTO main.locales (code, label) values ('hu', 'Hungarian');
INSERT INTO main.locales (code, label) values ('hy', 'Armenian');
INSERT INTO main.locales (code, label) values ('hz', 'Herero');
INSERT INTO main.locales (code, label) values ('ia', 'Interlingua (International Auxiliary Language Association)');
INSERT INTO main.locales (code, label) values ('id', 'Indonesian');
INSERT INTO main.locales (code, label) values ('ie', 'Interlingue; Occidental');
INSERT INTO main.locales (code, label) values ('ig', 'Igbo');
INSERT INTO main.locales (code, label) values ('ii', 'Sichuan Yi; Nuosu');
INSERT INTO main.locales (code, label) values ('ik', 'Inupiaq');
INSERT INTO main.locales (code, label) values ('io', 'Ido');
INSERT INTO main.locales (code, label) values ('is', 'Icelandic');
INSERT INTO main.locales (code, label) values ('it', 'Italian');
INSERT INTO main.locales (code, label) values ('iu', 'Inuktitut');
INSERT INTO main.locales (code, label) values ('ja', 'Japanese');
INSERT INTO main.locales (code, label) values ('jv', 'Javanese');
INSERT INTO main.locales (code, label) values ('ka', 'Georgian');
INSERT INTO main.locales (code, label) values ('kg', 'Kongo');
INSERT INTO main.locales (code, label) values ('ki', 'Kikuyu; Gikuyu');
INSERT INTO main.locales (code, label) values ('kj', 'Kuanyama; Kwanyama');
INSERT INTO main.locales (code, label) values ('kk', 'Kazakh');
INSERT INTO main.locales (code, label) values ('kl', 'Kalaallisut; Greenlandic');
INSERT INTO main.locales (code, label) values ('km', 'Central Khmer');
INSERT INTO main.locales (code, label) values ('kn', 'Kannada');
INSERT INTO main.locales (code, label) values ('ko', 'Korean');
INSERT INTO main.locales (code, label) values ('kr', 'Kanuri');
INSERT INTO main.locales (code, label) values ('ks', 'Kashmiri');
INSERT INTO main.locales (code, label) values ('ku', 'Kurdish');
INSERT INTO main.locales (code, label) values ('kv', 'Komi');
INSERT INTO main.locales (code, label) values ('kw', 'Cornish');
INSERT INTO main.locales (code, label) values ('ky', 'Kirghiz; Kyrgyz');
INSERT INTO main.locales (code, label) values ('la', 'Latin');
INSERT INTO main.locales (code, label) values ('lb', 'Luxembourgish; Letzeburgesch');
INSERT INTO main.locales (code, label) values ('lg', 'Ganda');
INSERT INTO main.locales (code, label) values ('li', 'Limburgan; Limburger; Limburgish');
INSERT INTO main.locales (code, label) values ('ln', 'Lingala');
INSERT INTO main.locales (code, label) values ('lo', 'Lao');
INSERT INTO main.locales (code, label) values ('lt', 'Lithuanian');
INSERT INTO main.locales (code, label) values ('lu', 'Luba-Katanga');
INSERT INTO main.locales (code, label) values ('lv', 'Latvian');
INSERT INTO main.locales (code, label) values ('mg', 'Malagasy');
INSERT INTO main.locales (code, label) values ('mh', 'Marshallese');
INSERT INTO main.locales (code, label) values ('mi', 'Maori');
INSERT INTO main.locales (code, label) values ('mk', 'Macedonian');
INSERT INTO main.locales (code, label) values ('ml', 'Malayalam');
INSERT INTO main.locales (code, label) values ('mn', 'Mongolian');
INSERT INTO main.locales (code, label) values ('mr', 'Marathi');
INSERT INTO main.locales (code, label) values ('ms', 'Malay');
INSERT INTO main.locales (code, label) values ('mt', 'Maltese');
INSERT INTO main.locales (code, label) values ('my', 'Burmese');
INSERT INTO main.locales (code, label) values ('na', 'Nauru');
INSERT INTO main.locales (code, label) values ('nb', 'Bokmål, Norwegian; Norwegian Bokmål');
INSERT INTO main.locales (code, label) values ('nd', 'Ndebele, North; North Ndebele');
INSERT INTO main.locales (code, label) values ('ne', 'Nepali');
INSERT INTO main.locales (code, label) values ('ng', 'Ndonga');
INSERT INTO main.locales (code, label) values ('nl', 'Dutch; Flemish');
INSERT INTO main.locales (code, label) values ('nn', 'Norwegian Nynorsk; Nynorsk, Norwegian');
INSERT INTO main.locales (code, label) values ('no', 'Norwegian');
INSERT INTO main.locales (code, label) values ('nr', 'Ndebele, South; South Ndebele');
INSERT INTO main.locales (code, label) values ('nv', 'Navajo; Navaho');
INSERT INTO main.locales (code, label) values ('ny', 'Chichewa; Chewa; Nyanja');
INSERT INTO main.locales (code, label) values ('oc', 'Occitan (post 1500)');
INSERT INTO main.locales (code, label) values ('oj', 'Ojibwa');
INSERT INTO main.locales (code, label) values ('om', 'Oromo');
INSERT INTO main.locales (code, label) values ('or', 'Oriya');
INSERT INTO main.locales (code, label) values ('os', 'Ossetian; Ossetic');
INSERT INTO main.locales (code, label) values ('pa', 'Panjabi; Punjabi');
INSERT INTO main.locales (code, label) values ('pi', 'Pali');
INSERT INTO main.locales (code, label) values ('pl', 'Polish');
INSERT INTO main.locales (code, label) values ('ps', 'Pushto; Pashto');
INSERT INTO main.locales (code, label) values ('pt', 'Portuguese');
INSERT INTO main.locales (code, label) values ('qu', 'Quechua');
INSERT INTO main.locales (code, label) values ('rm', 'Romansh');
INSERT INTO main.locales (code, label) values ('rn', 'Rundi');
INSERT INTO main.locales (code, label) values ('ro', 'Romanian; Moldavian; Moldovan');
INSERT INTO main.locales (code, label) values ('ru', 'Russian');
INSERT INTO main.locales (code, label) values ('rw', 'Kinyarwanda');
INSERT INTO main.locales (code, label) values ('sa', 'Sanskrit');
INSERT INTO main.locales (code, label) values ('sc', 'Sardinian');
INSERT INTO main.locales (code, label) values ('sd', 'Sindhi');
INSERT INTO main.locales (code, label) values ('se', 'Northern Sami');
INSERT INTO main.locales (code, label) values ('sg', 'Sango');
INSERT INTO main.locales (code, label) values ('si', 'Sinhala; Sinhalese');
INSERT INTO main.locales (code, label) values ('sk', 'Slovak');
INSERT INTO main.locales (code, label) values ('sl', 'Slovenian');
INSERT INTO main.locales (code, label) values ('sm', 'Samoan');
INSERT INTO main.locales (code, label) values ('sn', 'Shona');
INSERT INTO main.locales (code, label) values ('so', 'Somali');
INSERT INTO main.locales (code, label) values ('sq', 'Albanian');
INSERT INTO main.locales (code, label) values ('sr', 'Serbian');
INSERT INTO main.locales (code, label) values ('ss', 'Swati');
INSERT INTO main.locales (code, label) values ('st', 'Sotho, Southern');
INSERT INTO main.locales (code, label) values ('su', 'Sundanese');
INSERT INTO main.locales (code, label) values ('sv', 'Swedish');
INSERT INTO main.locales (code, label) values ('sw', 'Swahili');
INSERT INTO main.locales (code, label) values ('ta', 'Tamil');
INSERT INTO main.locales (code, label) values ('te', 'Telugu');
INSERT INTO main.locales (code, label) values ('tg', 'Tajik');
INSERT INTO main.locales (code, label) values ('th', 'Thai');
INSERT INTO main.locales (code, label) values ('ti', 'Tigrinya');
INSERT INTO main.locales (code, label) values ('tk', 'Turkmen');
INSERT INTO main.locales (code, label) values ('tl', 'Tagalog');
INSERT INTO main.locales (code, label) values ('tn', 'Tswana');
INSERT INTO main.locales (code, label) values ('to', 'Tonga (Tonga Islands)');
INSERT INTO main.locales (code, label) values ('tr', 'Turkish');
INSERT INTO main.locales (code, label) values ('ts', 'Tsonga');
INSERT INTO main.locales (code, label) values ('tt', 'Tatar');
INSERT INTO main.locales (code, label) values ('tw', 'Twi');
INSERT INTO main.locales (code, label) values ('ty', 'Tahitian');
INSERT INTO main.locales (code, label) values ('ug', 'Uighur; Uyghur');
INSERT INTO main.locales (code, label) values ('uk', 'Ukrainian');
INSERT INTO main.locales (code, label) values ('ur', 'Urdu');
INSERT INTO main.locales (code, label) values ('uz', 'Uzbek');
INSERT INTO main.locales (code, label) values ('ve', 'Venda');
INSERT INTO main.locales (code, label) values ('vi', 'Vietnamese');
INSERT INTO main.locales (code, label) values ('vo', 'Volapük');
INSERT INTO main.locales (code, label) values ('wa', 'Walloon');
INSERT INTO main.locales (code, label) values ('wo', 'Wolof');
INSERT INTO main.locales (code, label) values ('xh', 'Xhosa');
INSERT INTO main.locales (code, label) values ('yi', 'Yiddish');
INSERT INTO main.locales (code, label) values ('yo', 'Yoruba');
INSERT INTO main.locales (code, label) values ('za', 'Zhuang; Chuang');
INSERT INTO main.locales (code, label) values ('zh', 'Chinese');
INSERT INTO main.locales (code, label) values ('zu', 'Zulu');

COMMIT;
