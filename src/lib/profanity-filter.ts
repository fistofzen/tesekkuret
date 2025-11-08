// Simple profanity filter for Turkish content
const profanityWords = [
  'amk',
  'aq',
  'orospu',
  'piç',
  'sik',
  'göt',
  'salak',
  'aptal',
  'gerizekalı',
  'mal',
  'ahmak',
  // Add more Turkish profanity words as needed
];

export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Check for exact word matches (with word boundaries)
  for (const word of profanityWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      return true;
    }
  }
  
  // Check for variations with common substitutions
  const normalizedText = lowerText
    .replace(/[0@]/g, 'o')
    .replace(/[1!]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[4]/g, 'a')
    .replace(/[5]/g, 's')
    .replace(/[7]/g, 't');
  
  for (const word of profanityWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(normalizedText)) {
      return true;
    }
  }
  
  return false;
}

export function validateProfanity(text: string): { valid: boolean; error?: string } {
  if (containsProfanity(text)) {
    return {
      valid: false,
      error: 'İçerik uygunsuz kelimeler içeriyor. Lütfen daha uygun bir dil kullanın.',
    };
  }
  
  return { valid: true };
}
