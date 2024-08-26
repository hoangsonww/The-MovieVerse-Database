'use strict';
/**
 * This module vendors the data fetched from ISO 3166-1 catalog.  Those data
 * are automatically fetched and replaced by the build process.
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.authoritativeLabels = exports.authoritativeLabelLanguages = exports.languageCodes = exports.updatedDate = void 0;
/*
 * NOTE that the comments look like the following in the source code are
 * placeholders for the build process:
 *
 *     // TERM //
 *     ...
 *     // END TERM //
 *
 * Therefore, you should not edit the comments and the lines between them by
 * hand.  There are 4 terms in this file: UPDATED DATE, CODES, LABEL LANGUAGES,
 * and LABELS.  The build process replaces the contents for each term with the
 * actual data.
 */
/**
 * The date when the data were last updated.  In other words, this date means
 * the version of the data.  Note that the time part of this object is mostly
 * meaningless.
 */
exports.updatedDate = new Date(
  // UPDATED DATE //
  '2009-09-01T04:00:00.000Z'
);
/**
 * The array of all valid language codes.  This array contains only the
 * two-letter language codes defined in ISO 3166-1 with lower case.
 * @constant
 */
exports.languageCodes = [
  // cSpell:disable
  // CODES //
  'aa',
  'ab',
  'ae',
  'af',
  'ak',
  'am',
  'an',
  'ar',
  'as',
  'av',
  'ay',
  'az',
  'ba',
  'be',
  'bg',
  'bh',
  'bi',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'ce',
  'ch',
  'co',
  'cr',
  'cs',
  'cu',
  'cv',
  'cy',
  'da',
  'de',
  'dv',
  'dz',
  'ee',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'ff',
  'fi',
  'fj',
  'fo',
  'fr',
  'fy',
  'ga',
  'gd',
  'gl',
  'gn',
  'gu',
  'gv',
  'ha',
  'he',
  'hi',
  'ho',
  'hr',
  'ht',
  'hu',
  'hy',
  'hz',
  'ia',
  'id',
  'ie',
  'ig',
  'ii',
  'ik',
  'io',
  'is',
  'it',
  'iu',
  'ja',
  'jv',
  'ka',
  'kg',
  'ki',
  'kj',
  'kk',
  'kl',
  'km',
  'kn',
  'ko',
  'kr',
  'ks',
  'ku',
  'kv',
  'kw',
  'ky',
  'la',
  'lb',
  'lg',
  'li',
  'ln',
  'lo',
  'lt',
  'lu',
  'lv',
  'mg',
  'mh',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'my',
  'na',
  'nb',
  'nd',
  'ne',
  'ng',
  'nl',
  'nn',
  'no',
  'nr',
  'nv',
  'ny',
  'oc',
  'oj',
  'om',
  'or',
  'os',
  'pa',
  'pi',
  'pl',
  'ps',
  'pt',
  'qu',
  'rm',
  'rn',
  'ro',
  'ru',
  'rw',
  'sa',
  'sc',
  'sd',
  'se',
  'sg',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sq',
  'sr',
  'ss',
  'st',
  'su',
  'sv',
  'sw',
  'ta',
  'te',
  'tg',
  'th',
  'ti',
  'tk',
  'tl',
  'tn',
  'to',
  'tr',
  'ts',
  'tt',
  'tw',
  'ty',
  'ug',
  'uk',
  'ur',
  'uz',
  've',
  'vi',
  'vo',
  'wa',
  'wo',
  'xh',
  'yi',
  'yo',
  'za',
  'zh',
  'zu', // Zulu
  // END CODES //
  // cSpell:enable
];
/**
 * The array of language codes, which are valid authoritative label language.
 * @constant
 */
exports.authoritativeLabelLanguages = [
  // LABEL LANGUAGES //
  'de',
  'en',
  'fr',
  // END LABEL LANGUAGES //
];
/**
 * The authoritative labels of all valid language codes.  In the first
 * dimension, the object is indexed by the language code.  In the second
 * dimension, the object is indexed by the authoritative label language.
 * In the third dimension, the array consists of the authoritative labels
 * of the language code in the authoritative label language.
 *
 * For example, `authoritativeLabels.en.fr` is `["anglais"]`,
 * which means English in French, and `authoritativeLabels.fr.de` is
 * `["Französisch"]`, which means French in German.
 *
 * Note that although the authoritative labels for each language code are
 * usually one-element arrays, they can be multiple-element arrays in some
 * cases.  For example, `authoritativeLabels.es.en` consists of
 * `["Spanish", "Castilian"]`, as Spanish and Castilian are basically
 * the same language which are mutually intelligible.
 *
 * @constant
 */
exports.authoritativeLabels = {
  // cSpell:disable
  // LABELS //
  aa: {
    de: ['Danakil-Sprache'],
    en: ['Afar'],
    fr: ['afar'],
  },
  ab: {
    de: ['Abchasisch'],
    en: ['Abkhazian'],
    fr: ['abkhaze'],
  },
  ae: {
    de: ['Avestisch'],
    en: ['Avestan'],
    fr: ['avestique'],
  },
  af: {
    de: ['Afrikaans'],
    en: ['Afrikaans'],
    fr: ['afrikaans'],
  },
  ak: {
    de: ['Akan-Sprache'],
    en: ['Akan'],
    fr: ['akan'],
  },
  am: {
    de: ['Amharisch'],
    en: ['Amharic'],
    fr: ['amharique'],
  },
  an: {
    de: ['Aragonesisch'],
    en: ['Aragonese'],
    fr: ['aragonais'],
  },
  ar: {
    de: ['Arabisch'],
    en: ['Arabic'],
    fr: ['arabe'],
  },
  as: {
    de: ['Assamesisch'],
    en: ['Assamese'],
    fr: ['assamais'],
  },
  av: {
    de: ['Awarisch'],
    en: ['Avaric'],
    fr: ['avar'],
  },
  ay: {
    de: ['Aymará-Sprache'],
    en: ['Aymara'],
    fr: ['aymara'],
  },
  az: {
    de: ['Aserbeidschanisch'],
    en: ['Azerbaijani'],
    fr: ['azéri'],
  },
  ba: {
    de: ['Baschkirisch'],
    en: ['Bashkir'],
    fr: ['bachkir'],
  },
  be: {
    de: ['Weißrussisch'],
    en: ['Belarusian'],
    fr: ['biélorusse'],
  },
  bg: {
    de: ['Bulgarisch'],
    en: ['Bulgarian'],
    fr: ['bulgare'],
  },
  bh: {
    de: ['Bihari (Andere)'],
    en: ['Bihari languages'],
    fr: ['langues biharis'],
  },
  bi: {
    de: ['Beach-la-mar'],
    en: ['Bislama'],
    fr: ['bichlamar'],
  },
  bm: {
    de: ['Bambara-Sprache'],
    en: ['Bambara'],
    fr: ['bambara'],
  },
  bn: {
    de: ['Bengali'],
    en: ['Bengali'],
    fr: ['bengali'],
  },
  bo: {
    de: ['Tibetisch'],
    en: ['Tibetan'],
    fr: ['tibétain'],
  },
  br: {
    de: ['Bretonisch'],
    en: ['Breton'],
    fr: ['breton'],
  },
  bs: {
    de: ['Bosnisch'],
    en: ['Bosnian'],
    fr: ['bosniaque'],
  },
  ca: {
    de: ['Katalanisch'],
    en: ['Catalan', 'Valencian'],
    fr: ['catalan', 'valencien'],
  },
  ce: {
    de: ['Tschetschenisch'],
    en: ['Chechen'],
    fr: ['tchétchène'],
  },
  ch: {
    de: ['Chamorro-Sprache'],
    en: ['Chamorro'],
    fr: ['chamorro'],
  },
  co: {
    de: ['Korsisch'],
    en: ['Corsican'],
    fr: ['corse'],
  },
  cr: {
    de: ['Cree-Sprache'],
    en: ['Cree'],
    fr: ['cree'],
  },
  cs: {
    de: ['Tschechisch'],
    en: ['Czech'],
    fr: ['tchèque'],
  },
  cu: {
    de: ['Kirchenslawisch'],
    en: ['Church Slavic', 'Old Slavonic', 'Church Slavonic', 'Old Bulgarian', 'Old Church Slavonic'],
    fr: ["slavon d'église", 'vieux slave', 'slavon liturgique', 'vieux bulgare'],
  },
  cv: {
    de: ['Tschuwaschisch'],
    en: ['Chuvash'],
    fr: ['tchouvache'],
  },
  cy: {
    de: ['Kymrisch'],
    en: ['Welsh'],
    fr: ['gallois'],
  },
  da: {
    de: ['Dänisch'],
    en: ['Danish'],
    fr: ['danois'],
  },
  de: {
    de: ['Deutsch'],
    en: ['German'],
    fr: ['allemand'],
  },
  dv: {
    de: ['Maledivisch'],
    en: ['Divehi', 'Dhivehi', 'Maldivian'],
    fr: ['maldivien'],
  },
  dz: {
    de: ['Dzongkha'],
    en: ['Dzongkha'],
    fr: ['dzongkha'],
  },
  ee: {
    de: ['Ewe-Sprache'],
    en: ['Ewe'],
    fr: ['éwé'],
  },
  el: {
    de: ['Neugriechisch'],
    en: ['Greek, Modern (1453-)'],
    fr: ['grec moderne (après 1453)'],
  },
  en: {
    de: ['Englisch'],
    en: ['English'],
    fr: ['anglais'],
  },
  eo: {
    de: ['Esperanto'],
    en: ['Esperanto'],
    fr: ['espéranto'],
  },
  es: {
    de: ['Spanisch'],
    en: ['Spanish', 'Castilian'],
    fr: ['espagnol', 'castillan'],
  },
  et: {
    de: ['Estnisch'],
    en: ['Estonian'],
    fr: ['estonien'],
  },
  eu: {
    de: ['Baskisch'],
    en: ['Basque'],
    fr: ['basque'],
  },
  fa: {
    de: ['Persisch'],
    en: ['Persian'],
    fr: ['persan'],
  },
  ff: {
    de: ['Ful'],
    en: ['Fulah'],
    fr: ['peul'],
  },
  fi: {
    de: ['Finnisch'],
    en: ['Finnish'],
    fr: ['finnois'],
  },
  fj: {
    de: ['Fidschi-Sprache'],
    en: ['Fijian'],
    fr: ['fidjien'],
  },
  fo: {
    de: ['Färöisch'],
    en: ['Faroese'],
    fr: ['féroïen'],
  },
  fr: {
    de: ['Französisch'],
    en: ['French'],
    fr: ['français'],
  },
  fy: {
    de: ['Friesisch'],
    en: ['Western Frisian'],
    fr: ['frison occidental'],
  },
  ga: {
    de: ['Irisch'],
    en: ['Irish'],
    fr: ['irlandais'],
  },
  gd: {
    de: ['Gälisch-Schottisch'],
    en: ['Gaelic', 'Scottish Gaelic'],
    fr: ['gaélique', 'gaélique écossais'],
  },
  gl: {
    de: ['Galicisch'],
    en: ['Galician'],
    fr: ['galicien'],
  },
  gn: {
    de: ['Guaraní-Sprache'],
    en: ['Guarani'],
    fr: ['guarani'],
  },
  gu: {
    de: ['Gujarati-Sprache'],
    en: ['Gujarati'],
    fr: ['goudjrati'],
  },
  gv: {
    de: ['Manx'],
    en: ['Manx'],
    fr: ['manx', 'mannois'],
  },
  ha: {
    de: ['Haussa-Sprache'],
    en: ['Hausa'],
    fr: ['haoussa'],
  },
  he: {
    de: ['Hebräisch'],
    en: ['Hebrew'],
    fr: ['hébreu'],
  },
  hi: {
    de: ['Hindi'],
    en: ['Hindi'],
    fr: ['hindi'],
  },
  ho: {
    de: ['Hiri-Motu'],
    en: ['Hiri Motu'],
    fr: ['hiri motu'],
  },
  hr: {
    de: ['Kroatisch '],
    en: ['Croatian'],
    fr: ['croate'],
  },
  ht: {
    de: ['Haïtien (Haiti-Kreolisch)'],
    en: ['Haitian', 'Haitian Creole'],
    fr: ['haïtien', 'créole haïtien'],
  },
  hu: {
    de: ['Ungarisch'],
    en: ['Hungarian'],
    fr: ['hongrois'],
  },
  hy: {
    de: ['Armenisch'],
    en: ['Armenian'],
    fr: ['arménien'],
  },
  hz: {
    de: ['Herero-Sprache'],
    en: ['Herero'],
    fr: ['herero'],
  },
  ia: {
    de: ['Interlingua'],
    en: ['Interlingua (International Auxiliary Language Association)'],
    fr: ['interlingua (langue auxiliaire internationale)'],
  },
  id: {
    de: ['Bahasa Indonesia'],
    en: ['Indonesian'],
    fr: ['indonésien'],
  },
  ie: {
    de: ['Interlingue'],
    en: ['Interlingue', 'Occidental'],
    fr: ['interlingue'],
  },
  ig: {
    de: ['Ibo-Sprache'],
    en: ['Igbo'],
    fr: ['igbo'],
  },
  ii: {
    de: ['Lalo-Sprache'],
    en: ['Sichuan Yi', 'Nuosu'],
    fr: ['yi de Sichuan'],
  },
  ik: {
    de: ['Inupik'],
    en: ['Inupiaq'],
    fr: ['inupiaq'],
  },
  io: {
    de: ['Ido'],
    en: ['Ido'],
    fr: ['ido'],
  },
  is: {
    de: ['Isländisch'],
    en: ['Icelandic'],
    fr: ['islandais'],
  },
  it: {
    de: ['Italienisch'],
    en: ['Italian'],
    fr: ['italien'],
  },
  iu: {
    de: ['Inuktitut'],
    en: ['Inuktitut'],
    fr: ['inuktitut'],
  },
  ja: {
    de: ['Japanisch'],
    en: ['Japanese'],
    fr: ['japonais'],
  },
  jv: {
    de: ['Javanisch'],
    en: ['Javanese'],
    fr: ['javanais'],
  },
  ka: {
    de: ['Georgisch'],
    en: ['Georgian'],
    fr: ['géorgien'],
  },
  kg: {
    de: ['Kongo-Sprache'],
    en: ['Kongo'],
    fr: ['kongo'],
  },
  ki: {
    de: ['Kikuyu-Sprache'],
    en: ['Kikuyu', 'Gikuyu'],
    fr: ['kikuyu'],
  },
  kj: {
    de: ['Kwanyama-Sprache'],
    en: ['Kuanyama', 'Kwanyama'],
    fr: ['kuanyama', 'kwanyama'],
  },
  kk: {
    de: ['Kasachisch'],
    en: ['Kazakh'],
    fr: ['kazakh'],
  },
  kl: {
    de: ['Grönländisch'],
    en: ['Kalaallisut', 'Greenlandic'],
    fr: ['groenlandais'],
  },
  km: {
    de: ['Kambodschanisch'],
    en: ['Central Khmer'],
    fr: ['khmer central'],
  },
  kn: {
    de: ['Kannada'],
    en: ['Kannada'],
    fr: ['kannada'],
  },
  ko: {
    de: ['Koreanisch'],
    en: ['Korean'],
    fr: ['coréen'],
  },
  kr: {
    de: ['Kanuri-Sprache'],
    en: ['Kanuri'],
    fr: ['kanouri'],
  },
  ks: {
    de: ['Kaschmiri'],
    en: ['Kashmiri'],
    fr: ['kashmiri'],
  },
  ku: {
    de: ['Kurdisch'],
    en: ['Kurdish'],
    fr: ['kurde'],
  },
  kv: {
    de: ['Komi-Sprache'],
    en: ['Komi'],
    fr: ['kom'],
  },
  kw: {
    de: ['Kornisch'],
    en: ['Cornish'],
    fr: ['cornique'],
  },
  ky: {
    de: ['Kirgisisch'],
    en: ['Kirghiz', 'Kyrgyz'],
    fr: ['kirghiz'],
  },
  la: {
    de: ['Latein'],
    en: ['Latin'],
    fr: ['latin'],
  },
  lb: {
    de: ['Luxemburgisch'],
    en: ['Luxembourgish', 'Letzeburgesch'],
    fr: ['luxembourgeois'],
  },
  lg: {
    de: ['Ganda-Sprache'],
    en: ['Ganda'],
    fr: ['ganda'],
  },
  li: {
    de: ['Limburgisch'],
    en: ['Limburgan', 'Limburger', 'Limburgish'],
    fr: ['limbourgeois'],
  },
  ln: {
    de: ['Lingala'],
    en: ['Lingala'],
    fr: ['lingala'],
  },
  lo: {
    de: ['Laotisch'],
    en: ['Lao'],
    fr: ['lao'],
  },
  lt: {
    de: ['Litauisch'],
    en: ['Lithuanian'],
    fr: ['lituanien'],
  },
  lu: {
    de: ['Luba-Katanga-Sprache'],
    en: ['Luba-Katanga'],
    fr: ['luba-katanga'],
  },
  lv: {
    de: ['Lettisch'],
    en: ['Latvian'],
    fr: ['letton'],
  },
  mg: {
    de: ['Malagassi-Sprache'],
    en: ['Malagasy'],
    fr: ['malgache'],
  },
  mh: {
    de: ['Marschallesisch'],
    en: ['Marshallese'],
    fr: ['marshall'],
  },
  mi: {
    de: ['Maori-Sprache'],
    en: ['Maori'],
    fr: ['maori'],
  },
  mk: {
    de: ['Makedonisch'],
    en: ['Macedonian'],
    fr: ['macédonien'],
  },
  ml: {
    de: ['Malayalam'],
    en: ['Malayalam'],
    fr: ['malayalam'],
  },
  mn: {
    de: ['Mongolisch'],
    en: ['Mongolian'],
    fr: ['mongol'],
  },
  mr: {
    de: ['Marathi'],
    en: ['Marathi'],
    fr: ['marathe'],
  },
  ms: {
    de: ['Malaiisch'],
    en: ['Malay'],
    fr: ['malais'],
  },
  mt: {
    de: ['Maltesisch'],
    en: ['Maltese'],
    fr: ['maltais'],
  },
  my: {
    de: ['Birmanisch'],
    en: ['Burmese'],
    fr: ['birman'],
  },
  na: {
    de: ['Nauruanisch'],
    en: ['Nauru'],
    fr: ['nauruan'],
  },
  nb: {
    de: ['Bokmål'],
    en: ['Bokmål, Norwegian', 'Norwegian Bokmål'],
    fr: ['norvégien bokmål'],
  },
  nd: {
    de: ['Ndebele-Sprache (Simbabwe)'],
    en: ['Ndebele, North', 'North Ndebele'],
    fr: ['ndébélé du Nord'],
  },
  ne: {
    de: ['Nepali'],
    en: ['Nepali'],
    fr: ['népalais'],
  },
  ng: {
    de: ['Ndonga'],
    en: ['Ndonga'],
    fr: ['ndonga'],
  },
  nl: {
    de: ['Niederländisch'],
    en: ['Dutch', 'Flemish'],
    fr: ['néerlandais', 'flamand'],
  },
  nn: {
    de: ['Nynorsk'],
    en: ['Norwegian Nynorsk', 'Nynorsk, Norwegian'],
    fr: ['norvégien nynorsk', 'nynorsk, norvégien'],
  },
  no: {
    de: ['Norwegisch'],
    en: ['Norwegian'],
    fr: ['norvégien'],
  },
  nr: {
    de: ['Ndebele-Sprache (Transvaal)'],
    en: ['Ndebele, South', 'South Ndebele'],
    fr: ['ndébélé du Sud'],
  },
  nv: {
    de: ['Navajo-Sprache'],
    en: ['Navajo', 'Navaho'],
    fr: ['navaho'],
  },
  ny: {
    de: ['Nyanja-Sprache'],
    en: ['Chichewa', 'Chewa', 'Nyanja'],
    fr: ['chichewa', 'chewa', 'nyanja'],
  },
  oc: {
    de: ['Okzitanisch'],
    en: ['Occitan (post 1500)'],
    fr: ['occitan (après 1500)'],
  },
  oj: {
    de: ['Ojibwa-Sprache'],
    en: ['Ojibwa'],
    fr: ['ojibwa'],
  },
  om: {
    de: ['Galla-Sprache'],
    en: ['Oromo'],
    fr: ['galla'],
  },
  or: {
    de: ['Oriya-Sprache'],
    en: ['Oriya'],
    fr: ['oriya'],
  },
  os: {
    de: ['Ossetisch'],
    en: ['Ossetian', 'Ossetic'],
    fr: ['ossète'],
  },
  pa: {
    de: ['Pandschabi-Sprache'],
    en: ['Panjabi', 'Punjabi'],
    fr: ['pendjabi'],
  },
  pi: {
    de: ['Pali'],
    en: ['Pali'],
    fr: ['pali'],
  },
  pl: {
    de: ['Polnisch'],
    en: ['Polish'],
    fr: ['polonais'],
  },
  ps: {
    de: ['Paschtu'],
    en: ['Pushto', 'Pashto'],
    fr: ['pachto'],
  },
  pt: {
    de: ['Portugiesisch'],
    en: ['Portuguese'],
    fr: ['portugais'],
  },
  qu: {
    de: ['Quechua-Sprache'],
    en: ['Quechua'],
    fr: ['quechua'],
  },
  rm: {
    de: ['Rätoromanisch'],
    en: ['Romansh'],
    fr: ['romanche'],
  },
  rn: {
    de: ['Rundi-Sprache'],
    en: ['Rundi'],
    fr: ['rundi'],
  },
  ro: {
    de: ['Rumänisch'],
    en: ['Romanian', 'Moldavian', 'Moldovan'],
    fr: ['roumain', 'moldave'],
  },
  ru: {
    de: ['Russisch'],
    en: ['Russian'],
    fr: ['russe'],
  },
  rw: {
    de: ['Rwanda-Sprache'],
    en: ['Kinyarwanda'],
    fr: ['rwanda'],
  },
  sa: {
    de: ['Sanskrit'],
    en: ['Sanskrit'],
    fr: ['sanskrit'],
  },
  sc: {
    de: ['Sardisch'],
    en: ['Sardinian'],
    fr: ['sarde'],
  },
  sd: {
    de: ['Sindhi-Sprache'],
    en: ['Sindhi'],
    fr: ['sindhi'],
  },
  se: {
    de: ['Nordsaamisch'],
    en: ['Northern Sami'],
    fr: ['sami du Nord'],
  },
  sg: {
    de: ['Sango-Sprache'],
    en: ['Sango'],
    fr: ['sango'],
  },
  si: {
    de: ['Singhalesisch'],
    en: ['Sinhala', 'Sinhalese'],
    fr: ['singhalais'],
  },
  sk: {
    de: ['Slowakisch'],
    en: ['Slovak'],
    fr: ['slovaque'],
  },
  sl: {
    de: ['Slowenisch'],
    en: ['Slovenian'],
    fr: ['slovène'],
  },
  sm: {
    de: ['Samoanisch'],
    en: ['Samoan'],
    fr: ['samoan'],
  },
  sn: {
    de: ['Schona-Sprache'],
    en: ['Shona'],
    fr: ['shona'],
  },
  so: {
    de: ['Somali'],
    en: ['Somali'],
    fr: ['somali'],
  },
  sq: {
    de: ['Albanisch'],
    en: ['Albanian'],
    fr: ['albanais'],
  },
  sr: {
    de: ['Serbisch '],
    en: ['Serbian'],
    fr: ['serbe'],
  },
  ss: {
    de: ['Swasi-Sprache'],
    en: ['Swati'],
    fr: ['swati'],
  },
  st: {
    de: ['Süd-Sotho-Sprache'],
    en: ['Sotho, Southern'],
    fr: ['sotho du Sud'],
  },
  su: {
    de: ['Sundanesisch'],
    en: ['Sundanese'],
    fr: ['soundanais'],
  },
  sv: {
    de: ['Schwedisch'],
    en: ['Swedish'],
    fr: ['suédois'],
  },
  sw: {
    de: ['Swahili'],
    en: ['Swahili'],
    fr: ['swahili'],
  },
  ta: {
    de: ['Tamil'],
    en: ['Tamil'],
    fr: ['tamoul'],
  },
  te: {
    de: ['Telugu-Sprache'],
    en: ['Telugu'],
    fr: ['télougou'],
  },
  tg: {
    de: ['Tadschikisch'],
    en: ['Tajik'],
    fr: ['tadjik'],
  },
  th: {
    de: ['Thailändisch'],
    en: ['Thai'],
    fr: ['thaï'],
  },
  ti: {
    de: ['Tigrinja-Sprache'],
    en: ['Tigrinya'],
    fr: ['tigrigna'],
  },
  tk: {
    de: ['Turkmenisch'],
    en: ['Turkmen'],
    fr: ['turkmène'],
  },
  tl: {
    de: ['Tagalog'],
    en: ['Tagalog'],
    fr: ['tagalog'],
  },
  tn: {
    de: ['Tswana-Sprache'],
    en: ['Tswana'],
    fr: ['tswana'],
  },
  to: {
    de: ['Tongaisch'],
    en: ['Tonga (Tonga Islands)'],
    fr: ['tongan (Îles Tonga)'],
  },
  tr: {
    de: ['Türkisch'],
    en: ['Turkish'],
    fr: ['turc'],
  },
  ts: {
    de: ['Tsonga-Sprache'],
    en: ['Tsonga'],
    fr: ['tsonga'],
  },
  tt: {
    de: ['Tatarisch'],
    en: ['Tatar'],
    fr: ['tatar'],
  },
  tw: {
    de: ['Twi-Sprache'],
    en: ['Twi'],
    fr: ['twi'],
  },
  ty: {
    de: ['Tahitisch'],
    en: ['Tahitian'],
    fr: ['tahitien'],
  },
  ug: {
    de: ['Uigurisch'],
    en: ['Uighur', 'Uyghur'],
    fr: ['ouïgour'],
  },
  uk: {
    de: ['Ukrainisch'],
    en: ['Ukrainian'],
    fr: ['ukrainien'],
  },
  ur: {
    de: ['Urdu'],
    en: ['Urdu'],
    fr: ['ourdou'],
  },
  uz: {
    de: ['Usbekisch'],
    en: ['Uzbek'],
    fr: ['ouszbek'],
  },
  ve: {
    de: ['Venda-Sprache'],
    en: ['Venda'],
    fr: ['venda'],
  },
  vi: {
    de: ['Vietnamesisch'],
    en: ['Vietnamese'],
    fr: ['vietnamien'],
  },
  vo: {
    de: ['Volapük'],
    en: ['Volapük'],
    fr: ['volapük'],
  },
  wa: {
    de: ['Wallonisch'],
    en: ['Walloon'],
    fr: ['wallon'],
  },
  wo: {
    de: ['Wolof-Sprache'],
    en: ['Wolof'],
    fr: ['wolof'],
  },
  xh: {
    de: ['Xhosa-Sprache'],
    en: ['Xhosa'],
    fr: ['xhosa'],
  },
  yi: {
    de: ['Jiddisch'],
    en: ['Yiddish'],
    fr: ['yiddish'],
  },
  yo: {
    de: ['Yoruba-Sprache'],
    en: ['Yoruba'],
    fr: ['yoruba'],
  },
  za: {
    de: ['Zhuang'],
    en: ['Zhuang', 'Chuang'],
    fr: ['zhuang', 'chuang'],
  },
  zh: {
    de: ['Chinesisch'],
    en: ['Chinese'],
    fr: ['chinois'],
  },
  zu: {
    de: ['Zulu-Sprache'],
    en: ['Zulu'],
    fr: ['zoulou'],
  },
  // END LABELS //
  // cSpell:enable
};
