import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, ShoppingCart, MessageSquare, Plus, Edit3, Check, Trash2, AlertTriangle, Play, CheckCircle, XCircle, Lock, User, LogOut, Settings, MapPin, Info } from 'lucide-react';
import { MenuItem, Order, Review, Language, Dictionary, StoreSettings } from '../types';

interface AdminPanelProps {
  menuItems: MenuItem[];
  orders: Order[];
  reviews: Review[];
  dict: Dictionary;
  currentLanguage: Language;
  onUpdateMenu: (updated: MenuItem[]) => void;
  onUpdateOrders: (updated: Order[]) => void;
  onUpdateReviews: (updated: Review[]) => void;
  categoryNames?: Record<string, { en: string; vi: string; tl: string }>;
  onUpdateCategoryNames?: (updated: Record<string, { en: string; vi: string; tl: string }>) => void;
  bannerImages?: string[];
  onUpdateBannerImages?: (updated: string[]) => void;
  storeSettings?: StoreSettings;
  onUpdateStoreSettings?: (updated: StoreSettings) => void;
}

export default function AdminPanel({
  menuItems,
  orders,
  reviews,
  dict,
  currentLanguage,
  onUpdateMenu,
  onUpdateOrders,
  onUpdateReviews,
  categoryNames,
  onUpdateCategoryNames,
  bannerImages = [],
  onUpdateBannerImages,
  storeSettings,
  onUpdateStoreSettings
}: AdminPanelProps) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('vb_admin_logged') === 'true';
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim() === 'admin' && loginPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('vb_admin_logged', 'true');
      setLoginError('');
    } else {
      setLoginError(currentLanguage === 'vi' ? 'Sai tài khoản hoặc mật khẩu quản trị!' : 'Invalid admin username or password!');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('vb_admin_logged');
  };

  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'menu' | 'reviews' | 'settings'>('stats');
  
  // Store Settings States
  const [storeNameInput, setStoreNameInput] = useState(storeSettings?.storeName || '');
  const [storeAddressInput, setStoreAddressInput] = useState(storeSettings?.storeAddress || '');
  const [googleMapsEmbedUrlInput, setGoogleMapsEmbedUrlInput] = useState(storeSettings?.googleMapsEmbedUrl || '');
  const [googleMapsUrlInput, setGoogleMapsUrlInput] = useState(storeSettings?.googleMapsUrl || '');
  const [storeWeekdaysInput, setStoreWeekdaysInput] = useState(storeSettings?.storeWeekdays || '');
  const [storeWeekendsInput, setStoreWeekendsInput] = useState(storeSettings?.storeWeekends || '');
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Sync inputs if props change
  React.useEffect(() => {
    if (storeSettings) {
      setStoreNameInput(storeSettings.storeName);
      setStoreAddressInput(storeSettings.storeAddress);
      setGoogleMapsEmbedUrlInput(storeSettings.googleMapsEmbedUrl);
      setGoogleMapsUrlInput(storeSettings.googleMapsUrl);
      setStoreWeekdaysInput(storeSettings.storeWeekdays);
      setStoreWeekendsInput(storeSettings.storeWeekends);
    }
  }, [storeSettings]);

  // Category management temp state
  const [tempCategoryNames, setTempCategoryNames] = useState<Record<string, { en: string; vi: string; tl: string }>>({});
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [categorySavedAlert, setCategorySavedAlert] = useState(false);

  // Banner management state
  const [isEditingBanners, setIsEditingBanners] = useState(false);
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // CMS Dish Form State
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [dishNameEn, setDishNameEn] = useState('');
  const [dishNameVi, setDishNameVi] = useState('');
  const [dishNameTl, setDishNameTl] = useState('');
  const [dishPrice, setDishPrice] = useState(0);
  const [dishCategory, setDishCategory] = useState<string>('pho');
  const [customCategory, setCustomCategory] = useState('');
  const [dishDescriptionEn, setDishDescriptionEn] = useState('');
  const [dishDescriptionVi, setDishDescriptionVi] = useState('');
  const [dishDescriptionTl, setDishDescriptionTl] = useState('');
  const [dishIngredientsEn, setDishIngredientsEn] = useState('');
  const [dishIngredientsVi, setDishIngredientsVi] = useState('');
  const [dishIngredientsTl, setDishIngredientsTl] = useState('');
  const [dishIsSpicy, setDishIsSpicy] = useState(false);
  const [dishIsGluten, setDishIsGluten] = useState(false);
  const [dishIsAvail, setDishIsAvail] = useState(true);

  // Review Reply State
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [ownerReplyText, setOwnerReplyText] = useState('');

  // 1. Calculations
  const totalSales = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const activeOrdersCount = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
  
  const totalReviewsCount = reviews.length;

  // 2. Charts preparation
  // Real-time Revenue trend (last 6 orders mock dates or index)
  const revenueData = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .map((o, idx) => ({
      name: o.orderDate || `Order ${idx + 1}`,
      amount: o.totalAmount
    }));

  // If no orders yet, add standard seeds
  const chartRevenueData = revenueData.length > 0 ? revenueData : [
    { name: "10:00 AM", amount: 380 },
    { name: "11:30 AM", amount: 760 },
    { name: "01:00 PM", amount: 1140 },
    { name: "03:15 PM", amount: 1530 },
    { name: "06:45 PM", amount: 2840 },
    { name: "08:30 PM", amount: 4120 }
  ];

  // Popular Dishes counts
  const dishesCounts: Record<string, number> = {};
  orders.forEach(o => {
    o.items.forEach(it => {
      dishesCounts[it.nameEn] = (dishesCounts[it.nameEn] || 0) + it.quantity;
    });
  });

  const popularDishesData = Object.keys(dishesCounts).map(name => ({
    name: name.split(" ")[0], // short name
    ordersCount: dishesCounts[name]
  })).sort((a, b) => b.ordersCount - a.ordersCount).slice(0, 5);

  const chartPopularData = popularDishesData.length > 0 ? popularDishesData : [
    { name: "Beef Pho", ordersCount: 15 },
    { name: "Pork Banh", ordersCount: 12 },
    { name: "Bun Cha", ordersCount: 10 },
    { name: "Spring", ordersCount: 8 },
    { name: "Coffee", ordersCount: 18 }
  ];

  // 3. Order Status Modification
  const handleUpdateStatus = (orderId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, orderStatus: status };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  // 4. Review Owner Replies
  const handlePublishReply = (reviewId: string) => {
    if (!ownerReplyText.trim()) return;
    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return { ...r, reply: ownerReplyText };
      }
      return r;
    });
    onUpdateReviews(updated);
    setActiveReviewId(null);
    setOwnerReplyText('');
  };

  // 5. CMS Dish Operations
  const handleEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setIsAddingNew(false);
    setDishNameEn(dish.nameEn);
    setDishNameVi(dish.nameVi || '');
    setDishNameTl(dish.nameTl || '');
    setDishPrice(dish.price);
    
    const standardCategories = ['pho', 'banhmi', 'buncha', 'springrolls', 'drinks', 'desserts'];
    if (standardCategories.includes(dish.category)) {
      setDishCategory(dish.category);
      setCustomCategory('');
    } else {
      setDishCategory('custom');
      setCustomCategory(dish.category);
    }
    
    setDishDescriptionEn(dish.descriptionEn);
    setDishDescriptionVi(dish.descriptionVi || '');
    setDishDescriptionTl(dish.descriptionTl || '');
    setDishIngredientsEn((dish.ingredientsEn || []).join(", "));
    setDishIngredientsVi((dish.ingredientsVi || []).join(", "));
    setDishIngredientsTl((dish.ingredientsTl || []).join(", "));
    setDishIsSpicy(dish.isSpicy);
    setDishIsGluten(dish.isGlutenFree);
    setDishIsAvail(dish.isAvailable);
  };

  const handleOpenAdd = () => {
    setEditingDish(null);
    setIsAddingNew(true);
    setDishNameEn('');
    setDishNameVi('');
    setDishNameTl('');
    setDishPrice(150);
    setDishCategory('pho');
    setCustomCategory('');
    setDishDescriptionEn('');
    setDishDescriptionVi('');
    setDishDescriptionTl('');
    setDishIngredientsEn('');
    setDishIngredientsVi('');
    setDishIngredientsTl('');
    setDishIsSpicy(false);
    setDishIsGluten(false);
    setDishIsAvail(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishNameEn || !dishPrice) return;

    const ingEn = dishIngredientsEn.split(",").map(i => i.trim()).filter(Boolean);
    const ingVi = dishIngredientsVi.split(",").map(i => i.trim()).filter(Boolean);
    const ingTl = dishIngredientsTl.split(",").map(i => i.trim()).filter(Boolean);

    const finalCategory = (dishCategory === 'custom' ? customCategory.trim().toLowerCase().replace(/\s+/g, '') : dishCategory) || 'pho';

    if (isAddingNew) {
      const newDish: MenuItem = {
        id: "dish-" + Date.now(),
        nameEn: dishNameEn,
        nameVi: dishNameVi || dishNameEn,
        nameTl: dishNameTl || dishNameEn,
        price: Number(dishPrice),
        category: finalCategory,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        descriptionEn: dishDescriptionEn,
        descriptionVi: dishDescriptionVi || dishDescriptionEn,
        descriptionTl: dishDescriptionTl || dishDescriptionEn,
        rating: 5.0,
        reviewsCount: 0,
        isSpicy: dishIsSpicy,
        isGlutenFree: dishIsGluten,
        isAvailable: dishIsAvail,
        preparationTime: 10,
        ingredientsEn: ingEn,
        ingredientsVi: ingVi.length > 0 ? ingVi : ingEn,
        ingredientsTl: ingTl.length > 0 ? ingTl : ingEn
      };
      onUpdateMenu([...menuItems, newDish]);
    } else if (editingDish) {
      const updated = menuItems.map((item) => {
        if (item.id === editingDish.id) {
          return {
            ...item,
            nameEn: dishNameEn,
            nameVi: dishNameVi,
            nameTl: dishNameTl,
            price: Number(dishPrice),
            category: finalCategory,
            descriptionEn: dishDescriptionEn,
            descriptionVi: dishDescriptionVi,
            descriptionTl: dishDescriptionTl,
            ingredientsEn: ingEn,
            ingredientsVi: ingVi,
            ingredientsTl: ingTl,
            isSpicy: dishIsSpicy,
            isGlutenFree: dishIsGluten,
            isAvailable: dishIsAvail
          };
        }
        return item;
      });
      onUpdateMenu(updated);
    }

    // Auto register new custom category in categoryNames
    if (finalCategory && categoryNames && !categoryNames[finalCategory] && onUpdateCategoryNames) {
      const displayName = customCategory.trim() || finalCategory;
      onUpdateCategoryNames({
        ...categoryNames,
        [finalCategory]: { en: displayName, vi: displayName, tl: displayName }
      });
    }

    setIsAddingNew(false);
    setEditingDish(null);
  };

  const handleOpenCategoryManager = () => {
    if (categoryNames) {
      const allCategoryIds = Array.from(new Set([
        'pho', 'banhmi', 'buncha', 'springrolls', 'drinks', 'desserts',
        ...menuItems.map(item => item.category)
      ]));

      const initialTemp: Record<string, { en: string; vi: string; tl: string }> = {};
      allCategoryIds.forEach(id => {
        initialTemp[id] = categoryNames[id] || {
          en: id.charAt(0).toUpperCase() + id.slice(1),
          vi: id.charAt(0).toUpperCase() + id.slice(1),
          tl: id.charAt(0).toUpperCase() + id.slice(1)
        };
      });

      setTempCategoryNames(initialTemp);
      setIsEditingCategories(!isEditingCategories);
    }
  };

  const handleUpdateTempCategory = (id: string, lang: 'en' | 'vi' | 'tl', value: string) => {
    setTempCategoryNames(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [lang]: value
      }
    }));
  };

  const handleSaveCategories = () => {
    if (onUpdateCategoryNames) {
      onUpdateCategoryNames(tempCategoryNames);
      setCategorySavedAlert(true);
      setTimeout(() => setCategorySavedAlert(false), 4000);
    }
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const url = newBannerUrl.trim();
    if (!url) return;
    
    if (onUpdateBannerImages) {
      if (bannerImages.includes(url)) {
        setBannerAlert("This banner image URL already exists.");
        return;
      }
      onUpdateBannerImages([...bannerImages, url]);
      setNewBannerUrl('');
      setBannerAlert("Banner image added successfully!");
      setTimeout(() => setBannerAlert(null), 3500);
    }
  };

  const handleRemoveBanner = (url: string) => {
    if (onUpdateBannerImages) {
      onUpdateBannerImages(bannerImages.filter(img => img !== url));
      setBannerAlert("Banner image removed.");
      setTimeout(() => setBannerAlert(null), 3500);
    }
  };

  const handleDeleteDish = (id: string) => {
    const updated = menuItems.filter(item => item.id !== id);
    onUpdateMenu(updated);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="font-sans font-bold text-xl tracking-tight text-gray-900">
              {currentLanguage === 'vi' ? 'Hệ Thống Quản Trị CMS' : 'Admin CMS Portal'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {currentLanguage === 'vi' 
                ? 'Đăng nhập để quản lý thực đơn, đơn hàng và hình ảnh trang chủ' 
                : 'Log in to manage menu items, kitchen orders, and homepage banners'}
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {currentLanguage === 'vi' ? 'Tên đăng nhập' : 'Username'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {currentLanguage === 'vi' ? 'Mật khẩu' : 'Password'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-xs cursor-pointer transform active:scale-[0.98]"
            >
              {currentLanguage === 'vi' ? 'Đăng Nhập Quản Trị' : 'Access Admin CMS'}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-[11px] text-amber-800 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <span>💡</span>
              <span>{currentLanguage === 'vi' ? 'Tài khoản dùng thử:' : 'Demo Credentials:'}</span>
            </p>
            <div className="font-mono text-[10px] pl-4 space-y-0.5">
              <p>Username: <strong className="text-amber-900 bg-amber-100 px-1 py-0.5 rounded">admin</strong></p>
              <p>Password: <strong className="text-amber-900 bg-amber-100 px-1 py-0.5 rounded">admin123</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100 min-h-[80vh]">
      
      {/* Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-gray-900 flex items-center gap-2">
            <span>🛡️ {dict.adminDashboard}</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium">Viet Bistro Bonifacio High Street Operations Control Center</p>
        </div>

        {/* CMS Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-gray-200/60 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'stats' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'}`}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'}`}
          >
            🛵 Orders Queue
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'menu' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'}`}
          >
            🍳 Culinary Menu CMS
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'reviews' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'}`}
          >
            💬 Review Moderation
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-100 transition-colors cursor-pointer shadow-3xs"
            title={currentLanguage === 'vi' ? 'Đăng xuất tài khoản quản trị' : 'Sign out of Admin Session'}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{currentLanguage === 'vi' ? 'Đăng Xuất' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Card row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Cumulative Revenue */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex items-center gap-5">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{dict.totalSales}</span>
                <h3 className="font-mono font-extrabold text-2xl text-gray-900 mt-0.5">₱{totalSales.toLocaleString()}</h3>
                <span className="text-[10px] text-emerald-600 font-bold block">● Real-time updates active</span>
              </div>
            </div>

            {/* Active kitchen queue */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex items-center gap-5">
              <div className="h-12 w-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{dict.activeOrders}</span>
                <h3 className="font-mono font-extrabold text-2xl text-gray-900 mt-0.5">{activeOrdersCount}</h3>
                <span className="text-[10px] text-amber-600 font-bold block">⚡️ Culinary kitchen streaming</span>
              </div>
            </div>

            {/* Total reviews */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex items-center gap-5">
              <div className="h-12 w-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{dict.pendingReviews}</span>
                <h3 className="font-mono font-extrabold text-2xl text-gray-900 mt-0.5">{totalReviewsCount}</h3>
                <span className="text-[10px] text-blue-600 font-bold block">⭐️ Verified client metrics</span>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Visualization Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Trend Area Chart */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4">
              <span className="text-[10px] uppercase font-mono font-extrabold text-emerald-600 tracking-wider block">Live Stream Chart</span>
              <h4 className="font-sans font-bold text-sm text-gray-800 leading-none">
                {dict.revenueChart}
              </h4>
              
              <div className="h-[240px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={9} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Dishes Bar Chart */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4">
              <span className="text-[10px] uppercase font-mono font-extrabold text-amber-600 tracking-wider block">Bestsellers Breakdown</span>
              <h4 className="font-sans font-bold text-sm text-gray-800 leading-none">
                {dict.popularDishesChart}
              </h4>

              <div className="h-[240px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartPopularData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={9} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Bar dataKey="ordersCount" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                      {chartPopularData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f59e0b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="font-sans font-bold text-base text-gray-800">{dict.orderManagement}</h3>
            <span className="text-xs text-gray-400">Total processed logs: {orders.length}</span>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-xs font-semibold">No operational order logs registered.</p>
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white border border-gray-200 p-5 rounded-2xl space-y-4 shadow-3xs"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-50 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-extrabold text-sm text-emerald-800">{o.id}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          o.orderStatus === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          o.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          o.orderStatus === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold block">Order placed at {o.orderDate}</span>
                    </div>

                    {/* Dropdown status update controls */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">{dict.updateStatus}:</span>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value as any)}
                        className="rounded-lg border border-gray-200 bg-gray-50 text-xs px-2.5 py-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending confirmation</option>
                        <option value="processing">Kitchen Cooking</option>
                        <option value="completed">Completed / Dispatched</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Contents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-gray-400 font-bold uppercase block">Dishes Ordered:</span>
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between font-semibold text-gray-700">
                          <span>{it.quantity}x {it.nameEn}</span>
                          <span className="font-mono text-gray-500">₱{it.price * it.quantity}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-50 pt-1.5 flex justify-between font-bold text-gray-900 text-[13px]">
                        <span>Grand Total paid:</span>
                        <span className="font-mono text-emerald-700">₱{o.totalAmount}</span>
                      </div>
                    </div>

                    <div className="space-y-1 bg-gray-50 p-3.5 rounded-xl text-[11px] text-gray-600">
                      <span className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Customer Delivery coordinates:</span>
                      <div><strong>Name:</strong> {o.customerName}</div>
                      <div><strong>Phone:</strong> {o.customerPhone}</div>
                      <div><strong>District:</strong> {o.customerDistrict}</div>
                      <div><strong>Address:</strong> {o.customerAddress}</div>
                      {o.paymentDetails && (
                        <div className="mt-1.5 text-[10px] text-blue-600 font-semibold">
                          💳 Method: {o.paymentMethod.toUpperCase()} | {o.paymentDetails.gcashNumber || o.paymentDetails.cardNumber || o.paymentDetails.bankRef}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Menu CMS Editor Tab */}
      {activeTab === 'menu' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 gap-3">
            <h3 className="font-sans font-bold text-base text-gray-800">{dict.menuManagement}</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setIsEditingBanners(!isEditingBanners);
                  setIsEditingCategories(false);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isEditingBanners ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <span>🎨 {isEditingBanners ? 'Close Banner Editor' : 'Manage Banners'}</span>
              </button>
              <button
                onClick={() => {
                  handleOpenCategoryManager();
                  setIsEditingBanners(false);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isEditingCategories ? 'bg-slate-900 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                <span>📁 {isEditingCategories ? 'Close Category Editor' : 'Manage Categories'}</span>
              </button>
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>{dict.addDish}</span>
              </button>
            </div>
          </div>

          {/* Banner Slider Manager Panel */}
          {isEditingBanners && (
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                <div>
                  <h4 className="font-sans font-bold text-sm text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
                    <span>🎨 Banner Slider Manager</span>
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Add, view, and remove banner images displayed on the homepage. They will slide/fade automatically every 4 seconds.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingBanners(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xs"
                >
                  Close
                </button>
              </div>

              {bannerAlert && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>{bannerAlert}</span>
                </div>
              )}

              {/* Add New Banner Form */}
              <form onSubmit={handleAddBanner} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <label className="block text-xs font-bold text-gray-700">Add New Banner Image URL:</label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-... or any direct image link"
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shrink-0 transition-all cursor-pointer shadow-xs"
                  >
                    + Add to Slider
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">
                  Tip: Copy high-quality images from Unsplash or upload your own, then paste the direct URL link here.
                </p>
              </form>

              {/* Current Banners Grid */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Current Banners in Carousel ({bannerImages.length})
                </h5>
                
                {bannerImages.length === 0 ? (
                  <p className="text-xs italic text-gray-400">No banner images configured. Add at least one above!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {bannerImages.map((img, idx) => (
                      <div key={idx} className="relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-xs flex flex-col">
                        <div className="aspect-[16/9] w-full bg-slate-100 relative">
                          <img
                            src={img}
                            alt={`Slide preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 left-2 bg-black/60 text-white font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                            #{idx + 1}
                          </span>
                        </div>
                        <div className="p-3 flex items-center justify-between gap-2 mt-auto">
                          <p className="text-[10px] text-gray-400 font-mono truncate flex-1" title={img}>{img}</p>
                          <button
                            type="button"
                            onClick={() => handleRemoveBanner(img)}
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Delete banner"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Category Names Manager Panel */}
          {isEditingCategories && (
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                <div>
                  <h4 className="font-sans font-bold text-sm text-gray-800 uppercase tracking-wide">
                    📁 Category Names Manager
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Edit the display names of standard and custom categories in English, Tiếng Việt, and Tagalog.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingCategories(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xs"
                >
                  Close
                </button>
              </div>

              {categorySavedAlert && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Category translations saved successfully! The updates are now live.</span>
                </div>
              )}

              <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                <div className="hidden md:grid grid-cols-4 gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3">
                  <div>Category Key</div>
                  <div>English (EN)</div>
                  <div>Vietnamese (VI)</div>
                  <div>Tagalog (TL)</div>
                </div>

                {Object.keys(tempCategoryNames).map((id) => {
                  const langs = tempCategoryNames[id];
                  return (
                    <div key={id} className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                      <div className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wide">
                        🏷️ {id}
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block md:hidden mb-0.5">English</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          value={langs.en}
                          onChange={(e) => handleUpdateTempCategory(id, 'en', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block md:hidden mb-0.5">Vietnamese</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          value={langs.vi}
                          onChange={(e) => handleUpdateTempCategory(id, 'vi', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block md:hidden mb-0.5">Tagalog</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          value={langs.tl}
                          onChange={(e) => handleUpdateTempCategory(id, 'tl', e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveCategories}
                  className="rounded-xl bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 shadow-xs hover:bg-emerald-700 cursor-pointer flex items-center gap-1.5"
                >
                  <span>💾 Save Category Translations</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCategories(false)}
                  className="rounded-xl border border-gray-200 bg-white text-gray-600 font-bold text-xs px-5 py-2.5 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Add / Edit Form Panel */}
          {(isAddingNew || editingDish) && (
            <form onSubmit={handleSaveDish} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                <h4 className="font-sans font-bold text-sm text-gray-800 uppercase tracking-wide">
                  {isAddingNew ? dict.addDish : `${dict.editDish}: ${editingDish?.nameEn}`}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingDish(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xs"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Name EN */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{dict.dishNameEn}</label>
                  <input
                    type="text"
                    required
                    value={dishNameEn}
                    onChange={(e) => setDishNameEn(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>
                {/* Name VI */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{dict.dishNameVi}</label>
                  <input
                    type="text"
                    required
                    value={dishNameVi}
                    onChange={(e) => setDishNameVi(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>
                {/* Name TL */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{dict.dishNameTl}</label>
                  <input
                    type="text"
                    required
                    value={dishNameTl}
                    onChange={(e) => setDishNameTl(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{dict.dishPrice}</label>
                  <input
                    type="number"
                    required
                    value={dishPrice}
                    onChange={(e) => setDishPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{dict.dishCategory}</label>
                  <select
                    value={dishCategory}
                    onChange={(e: any) => setDishCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none cursor-pointer mb-2"
                  >
                    {Object.entries(categoryNames || {}).map(([id, langs]) => (
                      <option key={id} value={id}>
                        {langs[currentLanguage] || langs['en'] || id}
                      </option>
                    ))}
                    {Array.from(new Set(menuItems.map(item => item.category)))
                      .filter(cat => !Object.keys(categoryNames || {}).includes(cat))
                      .map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)} (Custom)
                        </option>
                      ))
                    }
                    <option value="custom">✏️ + Thêm danh mục mới (Tự nhập)...</option>
                  </select>
                  {dishCategory === 'custom' && (
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: comtam, snacks,..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full rounded-lg border border-emerald-500 px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold placeholder:font-normal placeholder:text-gray-400"
                    />
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Stock Availability</label>
                  <select
                    value={dishIsAvail ? "true" : "false"}
                    onChange={(e) => setDishIsAvail(e.target.value === "true")}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={dishDescriptionEn}
                    onChange={(e) => setDishDescriptionEn(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 resize-none focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Mô tả (Tiếng Việt)</label>
                  <textarea
                    rows={2}
                    value={dishDescriptionVi}
                    onChange={(e) => setDishDescriptionVi(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 resize-none focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Paglalarawan (Tagalog)</label>
                  <textarea
                    rows={2}
                    value={dishDescriptionTl}
                    onChange={(e) => setDishDescriptionTl(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 resize-none focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Ingredients (Comma separated)</label>
                  <input
                    type="text"
                    value={dishIngredientsEn}
                    placeholder="Beef, Noodles, Chili, Mint"
                    onChange={(e) => setDishIngredientsEn(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Thành phần (Dấu phẩy cách)</label>
                  <input
                    type="text"
                    value={dishIngredientsVi}
                    placeholder="Bò, Bánh phở, Ớt, Húng quế"
                    onChange={(e) => setDishIngredientsVi(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Mga Sangkap (Koma separator)</label>
                  <input
                    type="text"
                    value={dishIngredientsTl}
                    placeholder="Baka, Noodles, Sili, Basil"
                    onChange={(e) => setDishIngredientsTl(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-4 items-center pt-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishIsSpicy}
                    onChange={(e) => setDishIsSpicy(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>🌶️ Spicy Recipe</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishIsGluten}
                    onChange={(e) => setDishIsGluten(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>🌾 Gluten-Free</span>
                </label>
              </div>

              {/* Save CTAs */}
              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 shadow-xs hover:bg-emerald-700 cursor-pointer"
                >
                  {dict.saveChanges}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingDish(null);
                  }}
                  className="rounded-xl border border-gray-200 bg-white text-gray-600 font-bold text-xs px-5 py-2.5 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Table display list */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-left text-xs text-gray-500 font-medium">
                <thead className="bg-gray-50 font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Image</th>
                    <th scope="col" className="px-6 py-3.5">Dish Title</th>
                    <th scope="col" className="px-6 py-3.5">Price</th>
                    <th scope="col" className="px-6 py-3.5">Category</th>
                    <th scope="col" className="px-6 py-3.5">Status</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100 bg-white">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <img src={item.image} alt={item.nameEn} className="h-10 w-10 rounded-lg object-cover bg-gray-100" referrerPolicy="no-referrer" />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">
                        {currentLanguage === 'vi' ? item.nameVi : currentLanguage === 'tl' ? item.nameTl : item.nameEn}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-emerald-800">₱{item.price}</td>
                      <td className="whitespace-nowrap px-6 py-4 uppercase font-bold text-[10px] text-gray-400">
                        {categoryNames?.[item.category]?.[currentLanguage] || categoryNames?.[item.category]?.['en'] || item.category}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${item.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {item.isAvailable ? 'In Stock' : 'Sold Out'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEditDish(item)}
                            className="p-1.5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-600 cursor-pointer"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDish(item.id)}
                            className="p-1.5 rounded-lg border border-gray-100 bg-white hover:bg-rose-50 text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Reviews Moderator Queue Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="font-sans font-bold text-base text-gray-800">{dict.pendingReviews}</h3>
            <span className="text-xs text-gray-400">Total feedbacks logged: {reviews.length}</span>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-gray-200 p-5 rounded-2xl space-y-4 shadow-3xs"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{rev.author}</span>
                      <span className="text-[9px] text-gray-400 font-mono">{rev.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">"{rev.comment}"</p>
                  </div>

                  <span className="font-mono font-bold text-amber-500">★ {rev.rating}</span>
                </div>

                {/* Owner Reply Block */}
                {rev.reply ? (
                  <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 text-[11px] text-emerald-800 leading-relaxed italic">
                    <strong>My Response:</strong> "{rev.reply}"
                  </div>
                ) : activeReviewId === rev.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={ownerReplyText}
                      onChange={(e) => setOwnerReplyText(e.target.value)}
                      placeholder={dict.writeReplyPlaceholder}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePublishReply(rev.id)}
                        className="rounded-lg bg-emerald-600 text-white font-bold text-[10px] px-3.5 py-1.5 cursor-pointer hover:bg-emerald-700"
                      >
                        {dict.sendReply}
                      </button>
                      <button
                        onClick={() => {
                          setActiveReviewId(null);
                          setOwnerReplyText('');
                        }}
                        className="rounded-lg border border-gray-200 bg-white text-gray-500 text-[10px] px-3.5 py-1.5 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveReviewId(rev.id);
                      setOwnerReplyText('');
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <span>💬 {dict.replyToReview}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-sans font-bold text-base text-gray-800">⚙️ {currentLanguage === 'vi' ? 'Cấu hình chi nhánh & Vị trí' : 'Restaurant & Branch Settings'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {currentLanguage === 'vi' 
                  ? 'Quản lý thông tin chi nhánh, giờ mở cửa và liên kết Google Maps của nhà hàng.' 
                  : 'Manage store details, operating hours, and Google Maps integration.'}
              </p>
            </div>
          </div>

          {settingsSavedAlert && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-bounce shadow-2xs">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>
                {currentLanguage === 'vi'
                  ? '🎉 Đã cập nhật thông tin vị trí và giờ hoạt động thành công!'
                  : '🎉 Restaurant settings and map location updated successfully!'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateStoreSettings) {
                  onUpdateStoreSettings({
                    storeName: storeNameInput,
                    storeAddress: storeAddressInput,
                    googleMapsEmbedUrl: googleMapsEmbedUrlInput,
                    googleMapsUrl: googleMapsUrlInput,
                    storeWeekdays: storeWeekdaysInput,
                    storeWeekends: storeWeekendsInput
                  });
                  setSettingsSavedAlert(true);
                  setTimeout(() => setSettingsSavedAlert(false), 3000);
                }
              }} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-3xs space-y-5">
                
                {/* Branch name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">
                    {currentLanguage === 'vi' ? '🏷️ Tên chi nhánh / Cửa hàng' : '🏷️ Branch / Store Name'}
                  </label>
                  <input
                    type="text"
                    value={storeNameInput}
                    onChange={(e) => setStoreNameInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-gray-900"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">
                    {currentLanguage === 'vi' ? '🏠 Địa chỉ chi nhánh' : '🏠 Physical Address'}
                  </label>
                  <textarea
                    rows={2}
                    value={storeAddressInput}
                    onChange={(e) => setStoreAddressInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-gray-900"
                    required
                  />
                </div>

                {/* Grid for Google Maps Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Google Maps Embed Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">
                      {currentLanguage === 'vi' ? '🗺️ Link Nhúng Google Map (Iframe src)' : '🗺️ Google Maps Embed Link (Iframe src)'}
                    </label>
                    <input
                      type="text"
                      value={googleMapsEmbedUrlInput}
                      onChange={(e) => setGoogleMapsEmbedUrlInput(e.target.value)}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-mono text-gray-900"
                      required
                    />
                  </div>

                  {/* Google Maps App URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">
                      {currentLanguage === 'vi' ? '📍 Link Định Vị Google Maps (Direct Link)' : '📍 Google Maps Direct Link (App Link)'}
                    </label>
                    <input
                      type="text"
                      value={googleMapsUrlInput}
                      onChange={(e) => setGoogleMapsUrlInput(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-mono text-gray-900"
                      required
                    />
                  </div>
                </div>

                {/* Grid for Operating Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">
                      {currentLanguage === 'vi' ? '⏰ Giờ mở cửa ngày thường (Thứ 2 - Thứ 6)' : '⏰ Weekdays Operating Hours'}
                    </label>
                    <input
                      type="text"
                      value={storeWeekdaysInput}
                      onChange={(e) => setStoreWeekdaysInput(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-gray-900"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">
                      {currentLanguage === 'vi' ? '🎉 Giờ mở cửa cuối tuần (Thứ 7 - CN)' : '🎉 Weekends Operating Hours'}
                    </label>
                    <input
                      type="text"
                      value={storeWeekendsInput}
                      onChange={(e) => setStoreWeekendsInput(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-gray-900"
                      required
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{currentLanguage === 'vi' ? 'Lưu Thiết Lập' : 'Save Restaurant Settings'}</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Tutorial Column / Live Preview */}
            <div className="space-y-6">
              
              {/* How to get Embed link Guide Card */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-md border border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  <span>{currentLanguage === 'vi' ? 'Hướng dẫn lấy link Google Map' : 'How to get Google Maps Link'}</span>
                </h4>
                <ol className="text-[11px] text-slate-300 space-y-2 list-decimal pl-4 leading-relaxed">
                  <li>{currentLanguage === 'vi' ? 'Truy cập trang google.com/maps' : 'Go to google.com/maps'}</li>
                  <li>{currentLanguage === 'vi' ? 'Tìm kiếm địa chỉ nhà hàng / chi nhánh của bạn.' : 'Search for your restaurant address.'}</li>
                  <li>{currentLanguage === 'vi' ? 'Nhấn nút "Chia sẻ" (Share), sau đó chọn tab "Nhúng bản đồ" (Embed Map).' : 'Click "Share" and select the "Embed a map" tab.'}</li>
                  <li>
                    {currentLanguage === 'vi' 
                      ? 'Sao chép giá trị thuộc tính "src" bên trong thẻ iframe.' 
                      : 'Copy only the value of the "src" attribute from the iframe tag.'}
                    <br />
                    <span className="text-[9px] text-slate-400 font-mono block mt-1 bg-slate-950 p-1.5 rounded select-all break-all border border-slate-800">
                      https://www.google.com/maps/embed?pb=...
                    </span>
                  </li>
                  <li>{currentLanguage === 'vi' ? 'Dán vào trường cấu hình Link nhúng bên trái.' : 'Paste it into the Embed Link field on the left.'}</li>
                </ol>
              </div>

              {/* Real-time Map Preview Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4.5 space-y-3.5 shadow-3xs">
                <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span>{currentLanguage === 'vi' ? 'Xem trước bản đồ trực tiếp' : 'Live Map Iframe Preview'}</span>
                </h4>
                {googleMapsEmbedUrlInput ? (
                  <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-gray-200 relative">
                    <iframe
                      title="Google Maps Admin Preview"
                      src={googleMapsEmbedUrlInput}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-slate-100 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                    {currentLanguage === 'vi' ? 'Hãy dán link nhúng để xem trước' : 'Paste embed link to preview map'}
                  </div>
                )}
                <div className="text-[10px] text-gray-500 leading-normal">
                  💡 {currentLanguage === 'vi' 
                    ? 'Bản đồ này sẽ hiển thị trực tiếp cho khách hàng ở chân trang chủ để định vị và dẫn đường.' 
                    : 'This map will render in real-time at the homepage footer for customers to navigate.'}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
