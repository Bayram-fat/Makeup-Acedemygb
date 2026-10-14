// 50 supported languages. `google` maps to the translate engine code.
export interface Lang {
  code: string;
  native: string;
  english: string;
  rtl?: boolean;
  google: string;
}

export const LANGS: Lang[] = [
  { code: "en", native: "English", english: "English", google: "en" },
  { code: "es", native: "Español", english: "Spanish", google: "es" },
  { code: "fr", native: "Français", english: "French", google: "fr" },
  { code: "de", native: "Deutsch", english: "German", google: "de" },
  { code: "it", native: "Italiano", english: "Italian", google: "it" },
  { code: "pt", native: "Português", english: "Portuguese", google: "pt" },
  { code: "nl", native: "Nederlands", english: "Dutch", google: "nl" },
  { code: "pl", native: "Polski", english: "Polish", google: "pl" },
  { code: "ru", native: "Русский", english: "Russian", google: "ru" },
  { code: "uk", native: "Українська", english: "Ukrainian", google: "uk" },
  { code: "sv", native: "Svenska", english: "Swedish", google: "sv" },
  { code: "no", native: "Norsk", english: "Norwegian", google: "no" },
  { code: "da", native: "Dansk", english: "Danish", google: "da" },
  { code: "fi", native: "Suomi", english: "Finnish", google: "fi" },
  { code: "cs", native: "Čeština", english: "Czech", google: "cs" },
  { code: "sk", native: "Slovenčina", english: "Slovak", google: "sk" },
  { code: "sl", native: "Slovenščina", english: "Slovenian", google: "sl" },
  { code: "hr", native: "Hrvatski", english: "Croatian", google: "hr" },
  { code: "sr", native: "Српски", english: "Serbian", google: "sr" },
  { code: "bg", native: "Български", english: "Bulgarian", google: "bg" },
  { code: "ro", native: "Română", english: "Romanian", google: "ro" },
  { code: "hu", native: "Magyar", english: "Hungarian", google: "hu" },
  { code: "el", native: "Ελληνικά", english: "Greek", google: "el" },
  { code: "tr", native: "Türkçe", english: "Turkish", google: "tr" },
  { code: "ar", native: "العربية", english: "Arabic", rtl: true, google: "ar" },
  { code: "he", native: "עברית", english: "Hebrew", rtl: true, google: "iw" },
  { code: "fa", native: "فارسی", english: "Persian", rtl: true, google: "fa" },
  { code: "ur", native: "اردو", english: "Urdu", rtl: true, google: "ur" },
  { code: "hi", native: "हिन्दी", english: "Hindi", google: "hi" },
  { code: "bn", native: "বাংলা", english: "Bengali", google: "bn" },
  { code: "ta", native: "தமிழ்", english: "Tamil", google: "ta" },
  { code: "te", native: "తెలుగు", english: "Telugu", google: "te" },
  { code: "mr", native: "मराठी", english: "Marathi", google: "mr" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", google: "gu" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", google: "kn" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", google: "ml" },
  { code: "th", native: "ไทย", english: "Thai", google: "th" },
  { code: "vi", native: "Tiếng Việt", english: "Vietnamese", google: "vi" },
  { code: "id", native: "Bahasa Indonesia", english: "Indonesian", google: "id" },
  { code: "ms", native: "Bahasa Melayu", english: "Malay", google: "ms" },
  { code: "ko", native: "한국어", english: "Korean", google: "ko" },
  { code: "ja", native: "日本語", english: "Japanese", google: "ja" },
  { code: "zh-CN", native: "简体中文", english: "Chinese (Simplified)", google: "zh-CN" },
  { code: "zh-TW", native: "繁體中文", english: "Chinese (Traditional)", google: "zh-TW" },
  { code: "sw", native: "Kiswahili", english: "Swahili", google: "sw" },
  { code: "am", native: "አማርኛ", english: "Amharic", google: "am" },
  { code: "af", native: "Afrikaans", english: "Afrikaans", google: "af" },
  { code: "tl", native: "Filipino", english: "Filipino", google: "tl" },
  { code: "ne", native: "नेपाली", english: "Nepali", google: "ne" },
  { code: "et", native: "Eesti", english: "Estonian", google: "et" },
];

export const isRtl = (code: string): boolean =>
  LANGS.find((l) => l.code === code)?.rtl ?? false;

export const googleCode = (code: string): string =>
  LANGS.find((l) => l.code === code)?.google ?? code;

export const langByCode = (code: string): Lang =>
  LANGS.find((l) => l.code === code) ?? LANGS[0];
