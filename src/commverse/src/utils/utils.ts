// type ClassDictionary = Record<string, unknown>;
// type ClassValue =
//   | string
//   | number
//   | boolean
//   | null
//   | undefined
//   | ClassDictionary
//   | ClassValue[];

// const isClassDictionary = (value: ClassValue): value is ClassDictionary =>
//   typeof value === 'object' && value !== null && !Array.isArray(value);

// export function cn(...inputs: ClassValue[]) {
//   // ... (existing cn implementation)
// }

export function getRawImageUrl(malformedUrl: string) {
  if (!malformedUrl || !malformedUrl.includes('url=')) {
    return malformedUrl;
  }
  try {
    const extractedString = malformedUrl.split('url=')[1];
    const firstDecode = decodeURIComponent(extractedString);
    const finalUrl = decodeURIComponent(firstDecode);
    return finalUrl;
  } catch (error) {
    console.error('Failed to decode URL:', error);
    return malformedUrl;
  }
}
