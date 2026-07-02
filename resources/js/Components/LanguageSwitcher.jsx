import { useEffect } from 'react';
import { Languages } from 'lucide-react';
import { router } from '@inertiajs/react';
import useTranslation from '@/i18n/useTranslation';

export default function LanguageSwitcher() {
    const { locale, t } = useTranslation();

    useEffect(() => {
        document.documentElement.lang = locale;

        if (locale === 'am') {
            document.documentElement.classList.add('font-amharic');
        } else {
            document.documentElement.classList.remove('font-amharic');
        }
    }, [locale]);

    const toggleLocale = () => {
        const next = locale === 'en' ? 'am' : 'en';
        router.post('/locale', { locale: next }, {
            preserveScroll: true,
        });
    };

    const label = locale === 'en' ? 'EN' : 'አማ';

    return (
        <button
            type="button"
            onClick={toggleLocale}
            aria-label={t('language')}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
            <Languages className="h-3.5 w-3.5" />
            <span>{label}</span>
        </button>
    );
}
