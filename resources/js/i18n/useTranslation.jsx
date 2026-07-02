import { usePage } from '@inertiajs/react';
import translations from './translations';

export default function useTranslation() {
    const locale = usePage().props.locale || 'en';

    const t = (key, fallback = key) => {
        return translations[locale]?.[key] ?? translations.en?.[key] ?? fallback;
    };

    return {
        locale,
        t,
        supportedLocales: Object.keys(translations),
    };
}
