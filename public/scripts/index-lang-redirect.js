(() => {
  const script = document.currentScript;
  const fallbackLang = script?.dataset.fallbackLang || 'ko';
  const langTargets = {
    ko: script?.dataset.koUrl || '/ko/',
    en: script?.dataset.enUrl || '/en/',
  };
  const supportedLangs = Object.keys(langTargets);

  const browserLanguages =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language || fallbackLang];

  const detectedLang =
    browserLanguages
      .map((value) => String(value).toLowerCase().split('-')[0])
      .find((value) => supportedLangs.includes(value)) || fallbackLang;

  const targetUrl = langTargets[detectedLang] || langTargets[fallbackLang];

  if (window.location.pathname === '/' && targetUrl) {
    const destination = `${targetUrl}${window.location.search || ''}${window.location.hash || ''}`;
    window.location.replace(destination);
  }
})();
