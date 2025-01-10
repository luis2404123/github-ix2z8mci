export async function extractTextFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Error reading file'));

    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

export function createTranslatedFile(translatedText, originalFileName, targetLanguage) {
  const blob = new Blob([translatedText], { type: 'text/plain' });
  const fileName = `${originalFileName.split('.')[0]}_${targetLanguage}.txt`;
  return { blob, fileName };
}