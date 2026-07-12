import React, { useState, useEffect } from 'react';
import { translations } from './data/translations';
import { initialMenuItems } from './data/menu';
import { Language, MenuItem, CartItem, Review, Order } from './types';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import MapSection from './components/MapSection';
import ChatWidget from './components/ChatWidget';
import AdminPanel from './components/AdminPanel';
import { Volume2, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

// Seed Orders for stats on first boot
const seedOrders: Order[] = [
  {
    id: "VB-105432",
    items: [
      { menuItemId: "pho-bo", nameEn: "Premium Beef Pho", quantity: 1, price: 380 },
      { menuItemId: "ca-phe-sua-da", nameEn: "Vietnamese Iced Coffee", quantity: 1, price: 160 }
    ],
    totalAmount: 590,
    deliveryFee: 50,
    customerName: "Maria Santos",
    customerPhone: "09172223344",
    customerAddress: "Tower 2, High Street South",
    customerDistrict: "BGC / Taguig City",
    paymentMethod: "gcash",
    paymentStatus: "paid",
    orderStatus: "completed",
    orderDate: "10:30 AM"
  },
  {
    id: "VB-105433",
    items: [
      { menuItemId: "banh-mi-thit", nameEn: "Special Pork Banh Mi", quantity: 2, price: 195 },
      { menuItemId: "pho-ga", nameEn: "Classic Chicken Pho", quantity: 1, price: 340 }
    ],
    totalAmount: 810,
    deliveryFee: 80,
    customerName: "Kenneth Lee",
    customerPhone: "09183334455",
    customerAddress: "Regent Parkway, 21st St",
    customerDistrict: "Makati District",
    paymentMethod: "card",
    paymentStatus: "paid",
    orderStatus: "completed",
    orderDate: "11:45 AM"
  },
  {
    id: "VB-105434",
    items: [
      { menuItemId: "bun-cha", nameEn: "Hanoi Bun Cha", quantity: 1, price: 390 },
      { menuItemId: "ca-phe-trung", nameEn: "Hanoi Egg Coffee", quantity: 1, price: 180 }
    ],
    totalAmount: 620,
    deliveryFee: 50,
    customerName: "Nguyen Tuan",
    customerPhone: "09194445566",
    customerAddress: "Serendra One, BGC",
    customerDistrict: "BGC / Taguig City",
    paymentMethod: "bank",
    paymentStatus: "paid",
    orderStatus: "processing",
    orderDate: "01:15 PM"
  },
  {
    id: "VB-105435",
    items: [
      { menuItemId: "goi-cuon", nameEn: "Fresh Shrimp Spring Rolls", quantity: 2, price: 180 },
      { menuItemId: "che-hat-sen", nameEn: "Lotus Seed & Longan", quantity: 1, price: 150 }
    ],
    totalAmount: 630,
    deliveryFee: 120,
    customerName: "Danica Cruz",
    customerPhone: "09156667788",
    customerAddress: "Vito Cruz St, Taft Ave",
    customerDistrict: "Pasay & Manila City",
    paymentMethod: "gcash",
    paymentStatus: "paid",
    orderStatus: "pending",
    orderDate: "02:40 PM"
  }
];

// Seed Reviews on first boot
const seedReviews: Review[] = [
  {
    id: "REV-101",
    author: "Maria Santos",
    rating: 5,
    comment: "The Beef Pho marrow broth is incredibly flavorful and rich! Literally feels like eating in Hanoi. Authentic herbs and perfect service.",
    date: "July 10, 2026",
    language: "en",
    reply: "Salamat po Maria! We slow-cook our marrow broth for 24 hours to achieve that authentic Hanoi flavor."
  },
  {
    id: "REV-102",
    author: "Nguyen Van A",
    rating: 5,
    comment: "Bánh mì đặc biệt kẹp pate béo ngậy đúng chuẩn vị truyền thống Hà Nội, vỏ bánh nướng giòn rụm tuyệt vời. Giao hàng BGC siêu nhanh.",
    date: "July 11, 2026",
    language: "vi",
    reply: "Cảm ơn quý khách! Đội ngũ Viet Bistro luôn tự hào mang đến chiếc bánh mì chuẩn vị nhất cho cộng đồng tại Philippines."
  },
  {
    id: "REV-103",
    author: "Kenneth Lee",
    rating: 4,
    comment: "Sarap ng Bun Cha! Worth every peso of the delivery fee to Quezon City. Pork belly charcoal grills are amazing.",
    date: "July 12, 2026",
    language: "tl"
  }
];

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Core Data Persistent states
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const local = localStorage.getItem('vb_menu');
    return local ? JSON.parse(local) : initialMenuItems;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('vb_cart');
    return local ? JSON.parse(local) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const local = localStorage.getItem('vb_favorites');
    return local ? JSON.parse(local) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('vb_orders');
    return local ? JSON.parse(local) : seedOrders;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const local = localStorage.getItem('vb_reviews');
    return local ? JSON.parse(local) : seedReviews;
  });

  const [categoryNames, setCategoryNames] = useState<Record<string, { en: string; vi: string; tl: string }>>(() => {
    const local = localStorage.getItem('vb_category_names');
    if (local) return JSON.parse(local);
    return {
      pho: { en: "Pho (Noodle Soup)", vi: "Phở truyền thống", tl: "Pho (Noodle Soup)" },
      banhmi: { en: "Banh Mi (Baguettes)", vi: "Bánh mì Việt Nam", tl: "Banh Mi (Baguettes)" },
      buncha: { en: "Bun Cha & Bowls", vi: "Bún chả & Bún trộn", tl: "Bun Cha at Bowls" },
      springrolls: { en: "Spring Rolls", vi: "Nem cuốn & Nem rán", tl: "Spring Rolls" },
      drinks: { en: "Drinks & Coffee", vi: "Thức uống & Cà phê", tl: "Mga Inumin at Kape" },
      desserts: { en: "Desserts", vi: "Món tráng miệng", tl: "Panghimagas" }
    };
  });

  const [bannerImages, setBannerImages] = useState<string[]>(() => {
    const local = localStorage.getItem('vb_banner_images');
    if (local) return JSON.parse(local);
    return [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600454021970-351feb2a5149?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1600&auto=format&fit=crop&q=80"
    ];
  });

  // Push Alert Notification for new orders
  const [alertNotify, setAlertNotify] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vb_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('vb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vb_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('vb_category_names', JSON.stringify(categoryNames));
  }, [categoryNames]);

  useEffect(() => {
    localStorage.setItem('vb_banner_images', JSON.stringify(bannerImages));
  }, [bannerImages]);

  const dict = translations[language];

  // Cart operations
  const handleAddToCart = (id: string, qty: number, notes?: string) => {
    setCart((prev) => {
      const existing = prev.find(item => item.menuItemId === id);
      if (existing) {
        return prev.map(item =>
          item.menuItemId === id
            ? { ...item, quantity: item.quantity + qty, notes: notes || item.notes }
            : item
        );
      }
      return [...prev, { menuItemId: id, quantity: qty, notes }];
    });
  };

  const handleUpdateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map(item =>
        item.menuItemId === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.menuItemId !== id));
  };

  const handleClearCart = () => setCart([]);

  // Favorites toggle
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter(fId => fId !== id);
      }
      return [...prev, id];
    });
  };

  // Submit new order and show live alert
  const handleNewOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // Push alert notification simulation
    setAlertNotify(newOrder.id);
    setTimeout(() => {
      setAlertNotify(null);
    }, 5000);
  };

  const handleAddReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  // Quick navigation anchor
  const handleExplore = () => {
    setActiveSection('menu');
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 antialiased">
      
      {/* Real-time Order push alerts */}
      {alertNotify && (
        <div className="fixed top-20 right-6 z-50 max-w-sm rounded-2xl bg-slate-900 text-white p-4 shadow-2xl border border-slate-800 animate-bounce flex gap-3 items-start">
          <Volume2 className="h-6 w-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1.5 flex-1">
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-amber-400 block">KITCHEN REAL-TIME ALERT</span>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              Order <strong className="text-white font-mono">{alertNotify}</strong> was successfully received! The Hanoi kitchen is initiating cooking.
            </p>
          </div>
          <button onClick={() => setAlertNotify(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={setLanguage}
        dict={dict}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        favoritesCount={favorites.length}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onFavoritesToggle={() => {
          // Toggle directly to menu to see favorited items easily
          setActiveSection('menu');
          setIsAdminPanelOpen(false);
          const el = document.getElementById('menu-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onAdminToggle={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
        isAdmin={isAdminPanelOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Container */}
      <main className="flex-1">
        {isAdminPanelOpen ? (
          /* Quản trị CMS backoffice */
          <AdminPanel
            menuItems={menuItems}
            orders={orders}
            reviews={reviews}
            dict={dict}
            currentLanguage={language}
            onUpdateMenu={setMenuItems}
            onUpdateOrders={setOrders}
            onUpdateReviews={setReviews}
            categoryNames={categoryNames}
            onUpdateCategoryNames={setCategoryNames}
            bannerImages={bannerImages}
            onUpdateBannerImages={setBannerImages}
          />
        ) : (
          /* Normal User Portal */
          <div className="space-y-4">
            
            {/* Show section conditional components */}
            {activeSection === 'home' && (
              <>
                <HeroSection dict={dict} onExploreMenu={handleExplore} bannerImages={bannerImages} />
                <MenuSection
                  menuItems={menuItems}
                  currentLanguage={language}
                  dict={dict}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  categoryNames={categoryNames}
                />
                <MapSection dict={dict} />
              </>
            )}

            {activeSection === 'menu' && (
              <div className="py-6">
                {favorites.length > 0 && (
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="bg-rose-50/50 border border-rose-100 p-4.5 rounded-2xl flex gap-3 items-center">
                      <Sparkles className="h-5 w-5 text-rose-500 shrink-0" />
                      <p className="text-xs text-rose-800 font-semibold leading-normal">
                        You have {favorites.length} favorited items! They are highlighted below with a solid pink heart.
                      </p>
                    </div>
                  </div>
                )}
                
                <MenuSection
                  menuItems={menuItems}
                  currentLanguage={language}
                  dict={dict}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  categoryNames={categoryNames}
                />
              </div>
            )}

            {activeSection === 'location' && (
              <div className="py-6">
                <MapSection dict={dict} />
              </div>
            )}

          </div>
        )}
      </main>

      {/* Floating Chat Widget Support */}
      <ChatWidget dict={dict} />

      {/* Sidebar Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        menuItems={menuItems}
        currentLanguage={language}
        dict={dict}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onNewOrder={handleNewOrder}
      />

      {/* Elegant Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1 info */}
          <div className="space-y-3">
            <h4 className="text-white font-sans font-bold text-sm tracking-tight">{dict.vietcuisine}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bringing premium Hanoian traditional pho broth recipes, hand-crafted banh mi baguettes, and drip coffee cultures directly to Bonifacio Global City, Taguig.
            </p>
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-600 block">
              {dict.operatingIn}
            </span>
          </div>

          {/* Column 2 navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-sans font-bold text-xs uppercase tracking-wider">Quick Navigate</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => { setActiveSection('home'); setIsAdminPanelOpen(false); }} className="hover:text-emerald-400 cursor-pointer">{dict.home}</button></li>
              <li><button onClick={() => { setActiveSection('menu'); setIsAdminPanelOpen(false); }} className="hover:text-emerald-400 cursor-pointer">{dict.menu}</button></li>
              <li><button onClick={() => { setActiveSection('location'); setIsAdminPanelOpen(false); }} className="hover:text-emerald-400 cursor-pointer">{dict.location}</button></li>
            </ul>
          </div>

          {/* Column 3 details */}
          <div className="space-y-3">
            <h4 className="text-white font-sans font-bold text-xs uppercase tracking-wider">Contact & Hotline</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>📞 <strong>Hotline:</strong> +63 (2) 8888-7777</li>
              <li>📱 <strong>Mobile GCash:</strong> 0917-123-4567</li>
              <li>✉️ <strong>Email:</strong> support@vietbistroph.com</li>
            </ul>
          </div>

          {/* Column 4 RA 10173 disclaimer */}
          <div className="space-y-3 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-1.5 text-rose-400">
              <ShieldAlert className="h-4.5 w-4.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Compliance Registry</span>
            </div>
            <p className="text-[9px] text-gray-500 leading-normal">
              Fully compliant with the <strong>Republic Act No. 10173</strong> (Data Privacy Act of 2012) of the Republic of the Philippines. Secure checkout details are isolated, heavily encrypted, and auto-purged following operational rider dispatching.
            </p>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-gray-900 text-center text-[10px] text-gray-600">
          <p>© 2026 Viet Bistro Philippines Corporation. All culinary, recipe, and media rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
