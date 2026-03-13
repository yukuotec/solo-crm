/**
 * i18n - 国际化模块
 *
 * 使用方法:
 *
 * 1. 在组件中使用 useTranslation hook:
 *    const { t } = useTranslation();
 *    <h1>{t('nav.dashboard')}</h1>
 *
 * 2. 在组件中使用 useLocale 获取完整上下文:
 *    const { locale, t, setLocale } = useLocale();
 *    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
 *      <option value="zh">中文</option>
 *      <option value="en">English</option>
 *    </select>
 *
 * 3. 在非组件中使用 translations:
 *    import { t, setLocale } from '@/i18n';
 *    setLocale('zh');
 *    const text = t('nav.dashboard');
 */

export { translations, defaultLocale, t, setLocale, getLocale, getSupportedLocales } from './translations';
export { LocaleProvider, useLocale, useTranslation } from './LocaleProvider';
