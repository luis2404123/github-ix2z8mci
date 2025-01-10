// Language service to manage available languages
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }
];

export function populateLanguageDropdowns() {
  const sourceSelect = document.getElementById('source-language');
  const targetSelect = document.getElementById('target-language');
  
  if (!sourceSelect || !targetSelect) return;

  const options = languages.map(lang => 
    `<option value="${lang.code}">${lang.name}</option>`
  ).join('');

  sourceSelect.innerHTML = '<option value="">Select language</option>' + options;
  targetSelect.innerHTML = '<option value="">Select language</option>' + options;
}