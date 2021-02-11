import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import profile_en from "./en/profile.json";
import profile_fr from "./fr/profile.json";

import general_en from "./en/general.json";
import general_fr from "./fr/general.json";
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                profile: profile_en,
                general: general_en,
            },
            fr: {
                profile: profile_fr,
                general: general_fr,
            },
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: false,
    });


export default i18n;