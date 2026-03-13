import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, defaultLocale, t as translate, setLocale, getLocale } from '../i18n/translations';

const LocaleContext = createContext({
  locale: defaultLocale,
  t: translate,
  setLocale: setLocale,
});

/**
 * LocaleProvider - 语言上下文提供者
 */
export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(defaultLocale);
  const [ready, setReady] = useState(false);

  // 初始化时从 localStorage 读取语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem('solo-crm-locale') || defaultLocale;
    setLocaleState(savedLocale);
    setLocale(savedLocale);
    setReady(true);
  }, []);

  // 处理语言切换
  const handleSetLocale = useCallback((newLocale) => {
    if (translations[newLocale]) {
      setLocaleState(newLocale);
      setLocale(newLocale);
      localStorage.setItem('solo-crm-locale', newLocale);
    }
  }, []);

  // 监听自定义事件
  useEffect(() => {
    const handleLocaleChange = (event) => {
      if (event.detail && event.detail.locale) {
        handleSetLocale(event.detail.locale);
      }
    };

    window.addEventListener('locale-changed', handleLocaleChange);
    return () => window.removeEventListener('locale-changed', handleLocaleChange);
  }, [handleSetLocale]);

  const value = {
    locale,
    t: (key) => translate(key, locale),
    setLocale: handleSetLocale,
    ready,
  };

  if (!ready) {
    return null;
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * useLocale - 获取语言上下文
 * @returns {{ locale: string, t: Function, setLocale: Function, ready: boolean }}
 */
export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

/**
 * useTranslation - 获取翻译函数
 * @returns {{ t: Function, locale: string }}
 */
export function useTranslation() {
  const { locale, t } = useLocale();
  return { t, locale };
}
