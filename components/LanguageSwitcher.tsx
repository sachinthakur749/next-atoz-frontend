'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

const locales = ['en', 'fr', 'de', "ar", "es", "ru"];

const LanguageSwitcher = () => {
    const currentLocale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const t = useTranslations();

    console.log(currentLocale)


    const handleLocaleChange = (locale: string) => {
        const segments = pathname.split('/');
        // Replace only if the first segment is a supported locale
        if (locales.includes(segments[1])) {
            segments[1] = locale;
        } else {
            segments.unshift(locale); // add locale if missing
        }
        const newPath = segments.join('/') || '/';
        startTransition(() => {
            router.replace(newPath);
        });
    };

    return (
        <select
            className="p-2 border rounded text-sm"
            onChange={(e) => handleLocaleChange(e.target.value)}
            value={currentLocale}
            disabled={isPending}
        >
            {locales.map((locale) => (
                <option key={locale} value={locale}>
                    {t(`locales.${locale}`) || locale.toUpperCase()}
                </option>
            ))}
        </select>
    );
};

export default LanguageSwitcher;
