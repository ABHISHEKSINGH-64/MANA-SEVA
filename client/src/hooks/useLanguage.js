import { useContext } from 'react';
import { LanguageContext } from '../context/languageContext';

export const useLanguage = () => useContext(LanguageContext);
