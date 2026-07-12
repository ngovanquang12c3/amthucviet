import React, { useState } from 'react';
import { Search, Heart, Clock, AlertTriangle, Check, Info, Flame, Leaf, Wheat } from 'lucide-react';
import { MenuItem, Language, Dictionary } from '../types';

interface MenuSectionProps {
  menuItems: MenuItem[];
  currentLanguage: Language;
  dict: Dictionary;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string, qty: number, notes?: string) => void;
  categoryNames?: Record<string, { en: string; vi: string; tl: string }>;
}

export default function MenuSection({
  menuItems,
  currentLanguage,
  dict,
  favorites,
  onToggleFavorite,
  onAddToCart,
  categoryNames
}: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [dishNotes, setDishNotes] = useState('');
  const [dishQty, setDishQty] = useState(1);
  const [addedItemAlert, setAddedItemAlert] = useState<string | null>(null);

  // Extract all unique categories from menu items
  const uniqueCategories = Array.from(new Set(menuItems.map(item => item.category)));

  const categories = [
    { id: 'all', label: dict.all },
    ...Object.entries(categoryNames || {}).map(([id, langs]) => ({
      id,
      label: langs[currentLanguage] || (dict as any)[id] || id
    })),
    ...uniqueCategories
      .filter(cat => !Object.keys(categoryNames || {}).includes(cat))
      .map(cat => ({
        id: cat,
        label: (dict as any)[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))
      }))
  ];

  // Filter items based on category and search query
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    const name = (
      currentLanguage === 'vi' ? item.nameVi :
      currentLanguage === 'tl' ? item.nameTl :
      item.nameEn
    ).toLowerCase();

    const desc = (
      currentLanguage === 'vi' ? item.descriptionVi :
      currentLanguage === 'tl' ? item.descriptionTl :
      item.descriptionEn
    ).toLowerCase();

    const matchesSearch = name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getDishName = (item: MenuItem) => {
    if (currentLanguage === 'vi') return item.nameVi;
    if (currentLanguage === 'tl') return item.nameTl;
    return item.nameEn;
  };

  const getDishDescription = (item: MenuItem) => {
    if (currentLanguage === 'vi') return item.descriptionVi;
    if (currentLanguage === 'tl') return item.descriptionTl;
    return item.descriptionEn;
  };

  const getDishIngredients = (item: MenuItem) => {
    if (currentLanguage === 'vi') return item.ingredientsVi;
    if (currentLanguage === 'tl') return item.ingredientsTl;
    return item.ingredientsEn;
  };

  const handleOpenDetail = (item: MenuItem) => {
    setSelectedDish(item);
    setDishNotes('');
    setDishQty(1);
  };

  const handleAddFromDetail = () => {
    if (selectedDish) {
      onAddToCart(selectedDish.id, dishQty, dishNotes);
      setAddedItemAlert(selectedDish.id);
      setSelectedDish(null);
      setTimeout(() => setAddedItemAlert(null), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white" id="menu-section">
      
      {/* Title & Search Panel */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-gray-900 sm:text-3xl">
            {dict.menu}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {dict.tagline}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-2.5 text-sm bg-gray-50 hover:bg-gray-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Category Chips Selector */}
      <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-none mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Culinary Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Info className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">No dishes found matching your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isFav = favorites.includes(item.id);
            const isAlert = addedItemAlert === item.id;

            return (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Media frame */}
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden cursor-pointer" onClick={() => handleOpenDetail(item)}>
                  <img
                    src={item.image}
                    alt={getDishName(item)}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 rounded-md bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-extrabold tracking-wide uppercase text-emerald-800 shadow-xs">
                    {categories.find(c => c.id === item.category)?.label || item.category}
                  </div>

                  {/* Favorite Toggle button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur-xs text-gray-400 hover:text-rose-500 shadow-xs hover:scale-105 transition-all cursor-pointer"
                  >
                    <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Hot/Promo Indicator */}
                  {item.originalPrice && (
                    <div className="absolute bottom-3 left-3 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      SALE ₱{(item.price - item.originalPrice)} OFF
                    </div>
                  )}
                </div>

                {/* Card details */}
                <div className="flex flex-col flex-1 p-5 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-sans font-bold text-base text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors cursor-pointer" onClick={() => handleOpenDetail(item)}>
                      {getDishName(item)}
                    </h3>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        {item.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ₱{item.originalPrice}
                          </span>
                        )}
                        <span className="font-mono font-bold text-sm text-emerald-700">
                          ₱{item.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Log */}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1 text-gray-500 font-semibold">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{item.preparationTime} {dict.mins}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {getDishDescription(item)}
                  </p>

                  {/* Dynamic Indicators */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.isSpicy && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-700 border border-rose-100">
                        <Flame className="h-2.5 w-2.5" />
                        <span>{dict.spicy}</span>
                      </span>
                    )}
                    {item.isGlutenFree && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-100">
                        <Wheat className="h-2.5 w-2.5" />
                        <span>{dict.glutenFree}</span>
                      </span>
                    )}
                    {item.isAvailable && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-100">
                        <Leaf className="h-2.5 w-2.5" />
                        <span>{dict.vegetarian}</span>
                      </span>
                    )}
                  </div>

                  {/* CTA Box */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleOpenDetail(item)}
                      className="flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        onAddToCart(item.id, 1);
                        setAddedItemAlert(item.id);
                        setTimeout(() => setAddedItemAlert(null), 2000);
                      }}
                      disabled={!item.isAvailable}
                      className={`flex-1 flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                        !item.isAvailable
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isAlert
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-sm'
                      }`}
                    >
                      {isAlert ? <Check className="h-4 w-4" /> : null}
                      <span>{isAlert ? dict.addedToCart : item.isAvailable ? dict.addToCart : dict.soldOut}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Culinary Detail & Ingredients Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Media */}
            <div className="relative h-48 sm:h-56 bg-gray-50">
              <img
                src={selectedDish.image}
                alt={getDishName(selectedDish)}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-gray-800 hover:bg-white shadow-sm font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 rounded-md bg-white/95 backdrop-blur-xs px-3 py-1 text-xs font-extrabold tracking-wide uppercase text-emerald-800 shadow-sm">
                ₱{selectedDish.price}
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h3 className="font-sans font-bold text-xl text-gray-900">
                  {getDishName(selectedDish)}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="text-amber-400 font-bold">★ {selectedDish.rating.toFixed(1)}</span>
                  <span>({selectedDish.reviewsCount} reviews)</span>
                  <span>•</span>
                  <span>{selectedDish.preparationTime} {dict.mins} prep time</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {getDishDescription(selectedDish)}
              </p>

              {/* Ingredients Box */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>🥬 {dict.ingredients}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {getDishIngredients(selectedDish).map((ing, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-600 border border-gray-100 shadow-2xs"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cooking Notes Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span>✏️ {dict.notesLabel}</span>
                  <span className="text-[10px] text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={dishNotes}
                  onChange={(e) => setDishNotes(e.target.value)}
                  placeholder={dict.notesPlaceholder}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Quantity selectors */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setDishQty(Math.max(1, dishQty - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm w-4 text-center">{dishQty}</span>
                  <button
                    onClick={() => setDishQty(dishQty + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Estimated Total</span>
                  <span className="font-mono font-extrabold text-base text-emerald-800">
                    ₱{selectedDish.price * dishQty}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={() => setSelectedDish(null)}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFromDetail}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
              >
                {dict.addToCart} ({dishQty})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
