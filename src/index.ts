import { changeLanguage, initI18n } from './config/i18n.js';

const i18n = await initI18n();
console.log(i18n.t('appTitle'));

await changeLanguage('es');
console.log(i18n.t('appTitle'));
