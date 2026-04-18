(() => {
  const detectShortcut = () => {
    const platform = String(
      navigator.userAgentData?.platform ||
        navigator.platform ||
        '',
    ).toLowerCase();
    const userAgent = String(navigator.userAgent || '').toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS || isAndroid) {
      return null;
    }

    if (platform.includes('mac')) {
      return '⌘ + P';
    }

    if (platform.includes('win')) {
      return 'CTRL + P';
    }

    return null;
  };

  const getPlainText = (lang, shortcut) => {
    if (lang === 'ko') {
      return shortcut
        ? `인쇄(${shortcut}) 시 배경 그래픽 포함 + 여백 없음 설정으로 깔끔하게 출력 가능`
        : '인쇄 시 배경 그래픽 포함 + 여백 없음 설정으로 깔끔하게 출력 가능';
    }

    return shortcut
      ? `Print (${shortcut}) tip: Background Graphics + Margins None`
      : 'Print tip: Background Graphics + Margins None';
  };

  const getLeadText = (lang, shortcut) => {
    if (lang === 'ko') {
      return shortcut ? `인쇄(${shortcut})` : '인쇄';
    }

    return shortcut ? `Print (${shortcut})` : 'Print';
  };

  const getRestText = (lang) =>
    lang === 'ko'
      ? ' 시 배경 그래픽 포함 + 여백 없음 설정으로 깔끔하게 출력 가능'
      : ' tip: Background Graphics + Margins None';

  const applyPrintHints = () => {
    const shortcut = detectShortcut();

    document.querySelectorAll('[data-print-hint-plain]').forEach((element) => {
      const lang = element.dataset.lang || 'ko';
      element.textContent = getPlainText(lang, shortcut);
    });

    document.querySelectorAll('[data-print-hint-lead]').forEach((element) => {
      const lang = element.dataset.lang || 'ko';
      element.textContent = getLeadText(lang, shortcut);
    });

    document.querySelectorAll('[data-print-hint-rest]').forEach((element) => {
      const lang = element.dataset.lang || 'ko';
      element.textContent = getRestText(lang);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPrintHints, { once: true });
  } else {
    applyPrintHints();
  }
})();
