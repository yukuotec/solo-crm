import React from 'react';
import { useLocale } from '../i18n';

/**
 * LanguageSwitcher - 语言切换器组件
 *
 * 使用示例:
 * <LanguageSwitcher />
 * 或
 * <LanguageSwitcher showCurrent={true} />
 */
export function LanguageSwitcher({ showCurrent = false }) {
  const { locale, setLocale } = useLocale();

  const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const handleToggle = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    setLocale(newLocale);
  };

  const currentLang = languages.find(l => l.code === locale);

  return (
    <div className="language-switcher">
      <button
        className="language-btn"
        onClick={handleToggle}
        title={`Switch to ${locale === 'zh' ? 'English' : '中文'}`}
      >
        {showCurrent && (
          <span className="current-language">
            {currentLang?.flag} {currentLang?.name}
          </span>
        )}
        <span className="language-icon">
          {locale === 'zh' ? '🇨🇳' : '🇺🇸'}
        </span>
      </button>
    </div>
  );
}

export default LanguageSwitcher;
