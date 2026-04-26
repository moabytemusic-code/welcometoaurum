'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function GoogleTranslate() {
  useEffect(() => {
    // Define the init function on the window for the external Google Script callback
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      }
    };

    // Tier 1 & Tier 2 Country to Language mapping
    const countryToLang = {
      // Tier 1
      "AU": "en", "AT": "de", "BE": "nl", "CA": "en", "DK": "da",
      "FI": "fi", "FR": "fr", "DE": "de", "IE": "en", "IT": "it",
      "JP": "ja", "LU": "fr", "NL": "nl", "NZ": "en", "NO": "no",
      "SG": "en", "ES": "es", "SE": "sv", "CH": "de", "GB": "en", "US": "en",

      // Tier 2
      "AR": "es", "BR": "pt", "BG": "bg", "CL": "es", "CN": "zh-CN",
      "CO": "es", "HR": "hr", "CY": "el", "CZ": "cs", "EE": "et",
      "GR": "el", "HK": "zh-CN", "HU": "hu", "IS": "is", "IN": "hi",
      "ID": "id", "IL": "iw", "LV": "lv", "LT": "lt", "MY": "ms",
      "MT": "mt", "MX": "es", "MA": "ar", "OM": "ar", "PA": "es",
      "PE": "es", "PH": "tl", "PL": "pl", "PT": "pt", "QA": "ar",
      "RO": "ro", "RU": "ru", "SA": "ar", "RS": "sr", "SK": "sk",
      "SI": "sl", "ZA": "en", "KR": "ko", "TH": "th", "TR": "tr",
      "UA": "uk", "AE": "ar", "UY": "es", "VN": "vi",

      // Original/Additional High-Traffic
      "PK": "ur", "NG": "en"
    };

    const runAutoTranslate = () => {
      // Use our internal secure proxy to avoid CORS and rate limits
      fetch('/api/location')
        .then(response => response.json())
        .then(data => {
          const country = data.country_code;
          const targetLang = countryToLang[country] || null;

          if (targetLang && targetLang !== 'en') {
            console.log(`🌍 Auto-translating to ${targetLang} for country ${country}`);
            
            // Poll for the selector to ensure the widget is ready
            let attempts = 0;
            const timer = setInterval(() => {
              const select = document.querySelector('.goog-te-combo');
              if (select) {
                select.value = targetLang;
                select.dispatchEvent(new Event('change'));
                clearInterval(timer);
              }
              if (++attempts > 25) clearInterval(timer);
            }, 800);
          } else {
            console.log(`🌍 Keeping English for ${country || 'unknown'}`);
          }
        })
        .catch(err => {
          console.log('IP detection failed, using browser language', err);
        });
    };

    // Trigger on mount or load
    if (document.readyState === 'complete') {
      runAutoTranslate();
    } else {
      window.addEventListener('load', runAutoTranslate);
      return () => window.removeEventListener('load', runAutoTranslate);
    }
  }, []);

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      <Script 
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
