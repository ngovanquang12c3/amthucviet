import React, { useState } from 'react';
import { Menu, ShoppingCart, Heart, Shield, Globe, User } from 'lucide-react';
import { Language, Dictionary } from '../types';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  dict: Dictionary;
  cartCount: number;
  favoritesCount: number;
  onCartToggle: () => void;
  onFavoritesToggle: () => void;
  onAdminToggle: () => void;
  isAdmin: boolean;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Navbar({
  currentLanguage,
  onLanguageChange,
  dict,
  cartCount,
  favoritesCount,
  onCartToggle,
  onFavoritesToggle,
  onAdminToggle,
  isAdmin,
  activeSection,
  setActiveSection
}: NavbarProps) {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const sections = [
    { id: 'home', label: dict.home },
    { id: 'menu', label: dict.menu },
    { id: 'reviews', label: dict.reviews },
    { id: 'location', label: dict.location }
  ];

  const languages = [
    { code: 'en' as Language, label: 'English (EN)' },
    { code: 'vi' as Language, label: 'Tiếng Việt (VI)' },
    { code: 'tl' as Language, label: 'Tagalog (TL)' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg shadow-sm">
            🇻🇳
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg tracking-tight text-gray-900 sm:text-xl">
              {dict.vietcuisine}
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 font-medium">
              {dict.operatingIn}
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="hidden md:flex items-center gap-1">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(sec.id);
                if (isAdmin) onAdminToggle(); // Close admin panel if active
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === sec.id && !isAdmin
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 bg-white shadow-sm cursor-pointer"
            >
              <Globe className="h-4 w-4 text-gray-500" />
              <span>{currentLanguage.toUpperCase()}</span>
            </button>
            
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg bg-white p-1 shadow-lg ring-1 ring-black/5 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-xs font-medium transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favorites Button */}
          <button
            onClick={onFavoritesToggle}
            className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-rose-600 transition-colors cursor-pointer"
            title={dict.favorites}
          >
            <Heart className={`h-5.5 w-5.5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onCartToggle}
            className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors cursor-pointer"
            title={dict.cart}
          >
            <ShoppingCart className="h-5.5 w-5.5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin CMS Access */}
          <button
            onClick={onAdminToggle}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
            title={dict.admin}
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{dict.admin}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
