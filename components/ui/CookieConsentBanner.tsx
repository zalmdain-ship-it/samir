import React from 'react';
import { Cookie } from 'lucide-react';
import { useCookieConsent } from '../../hooks/useCookieConsent';

const CookieConsentBanner: React.FC = () => {
    const { hasConsented, giveConsent } = useCookieConsent();

    if (hasConsented) {
        return null;
    }

    return (
        <div 
            className="fixed bottom-0 inset-x-0 p-4 bg-slate-800 text-white shadow-lg z-50 transform transition-transform duration-500 ease-in-out translate-y-0"
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent banner"
        >
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Cookie className="w-8 h-8 flex-shrink-0 text-yellow-400" />
                    <p className="text-sm text-slate-300">
                        نحن نستخدم ملفات تعريف الارتباط لضمان حصولك على أفضل تجربة على موقعنا.
                    </p>
                </div>
                <button
                    onClick={giveConsent}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors flex-shrink-0"
                    aria-label="Accept cookies"
                >
                    موافق
                </button>
            </div>
        </div>
    );
};

export default CookieConsentBanner;
