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

    // Country to Language mapping provided by user
    const countryToLang = {
      "ID": "id",   // Indonesia → Bahasa Indonesia
      "BR": "pt",   // Brazil → Portuguese
      "PH": "tl",   // Philippines → Tagalog/Filipino
      "IN": "hi",   // India → Hindi
      "PK": "ur",   // Pakistan → Urdu
      "NG": "en",   // Nigeria → English (no translation)
    };

    const runAutoTranslate = () => {
      fetch('https://ipapi.co/json/')
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
              if (++attempts > 20) clearInterval(timer);
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
