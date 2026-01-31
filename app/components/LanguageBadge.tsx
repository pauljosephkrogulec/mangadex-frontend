'use client';

interface LanguageBadgeProps {
  language: string;
  className?: string;
  showFlag?: boolean;
}

export default function LanguageBadge({
  language,
  className = '',
  showFlag = false,
}: LanguageBadgeProps) {
  const getLanguageDisplay = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      en: 'English',
      ja: 'Japanese',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      ru: 'Russian',
      zh: 'Chinese',
      ko: 'Korean',
      ar: 'Arabic',
      th: 'Thai',
      vi: 'Vietnamese',
      id: 'Indonesian',
      ms: 'Malay',
      tl: 'Filipino',
      pl: 'Polish',
      tr: 'Turkish',
      nl: 'Dutch',
      sv: 'Swedish',
      da: 'Danish',
      no: 'Norwegian',
      fi: 'Finnish',
      he: 'Hebrew',
      hi: 'Hindi',
      bn: 'Bengali',
      ta: 'Tamil',
      te: 'Telugu',
      mr: 'Marathi',
      gu: 'Gujarati',
      kn: 'Kannada',
      ml: 'Malayalam',
      pa: 'Punjabi',
      or: 'Oriya',
      as: 'Assamese',
      ne: 'Nepali',
      si: 'Sinhala',
      my: 'Burmese',
      km: 'Khmer',
      lo: 'Lao',
      ka: 'Georgian',
      am: 'Amharic',
      sw: 'Swahili',
      zu: 'Zulu',
      af: 'Afrikaans',
      is: 'Icelandic',
      mt: 'Maltese',
      cy: 'Welsh',
      ga: 'Irish',
      gd: 'Scottish Gaelic',
      eu: 'Basque',
      ca: 'Catalan',
      gl: 'Galician',
    };

    return languageMap[lang.toLowerCase()] || lang.toUpperCase();
  };

  const getFlagEmoji = (lang: string) => {
    const flagMap: { [key: string]: string } = {
      en: '🇺🇸',
      ja: '🇯🇵',
      es: '🇪🇸',
      fr: '🇫🇷',
      de: '🇩🇪',
      it: '🇮🇹',
      pt: '🇵🇹',
      ru: '🇷🇺',
      zh: '🇨🇳',
      ko: '🇰🇷',
      ar: '🇸🇦',
      th: '🇹🇭',
      vi: '🇻🇳',
      id: '🇮🇩',
      ms: '🇲🇾',
      tl: '🇵🇭',
      pl: '🇵🇱',
      tr: '🇹🇷',
      nl: '🇳🇱',
      sv: '🇸🇪',
      da: '🇩🇰',
      no: '🇳🇴',
      fi: '🇫🇮',
      he: '🇮🇱',
      hi: '🇮🇳',
      bn: '🇧🇩',
      ta: '🇱🇰',
      te: '🇮🇳',
      mr: '🇮🇳',
      gu: '🇮🇳',
      kn: '🇮🇳',
      ml: '🇮🇳',
      pa: '🇮🇳',
      or: '🇮🇳',
      as: '🇮🇳',
      ne: '🇳🇵',
      si: '🇱🇰',
      my: '🇲🇲',
      km: '🇰🇭',
      lo: '🇱🇦',
      ka: '🇬🇪',
      am: '🇪🇹',
      sw: '🇰🇪',
      zu: '🇿🇦',
      af: '🇿🇦',
      is: '🇮🇸',
      mt: '🇲🇹',
      cy: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      ga: '🇮🇪',
      gd: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      eu: '🏴󠁥󠁳󠁰󠁶󠁿',
      ca: '🏴󠁥󠁳󠁣󠁴󠁿',
      gl: '🏴󠁥󠁳󠁣󠁴󠁿',
    };

    return flagMap[lang.toLowerCase()] || '🌐';
  };

  return (
    <span
      className={`px-2 py-1 bg-gray-600 rounded text-xs font-semibold text-white ${className}`}
    >
      {showFlag && <span className="mr-1">{getFlagEmoji(language)}</span>}
      {getLanguageDisplay(language)}
    </span>
  );
}
