import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, ShoppingCart, MessageSquare, Plus, Edit3, Check, Trash2, AlertTriangle, Play, CheckCircle, XCircle } from 'lucide-react';
import { MenuItem, Order, Review, Language, Dictionary } from '../types';

interface AdminPanelProps {
  menuItems: MenuItem[];
  orders: Order[];
  reviews: Review[];
  dict: Dictionary;
  currentLanguage: Language;
  onUpdateMenu: (updated: MenuItem[]) => void;
  onUpdateOrders: (updated: Order[]) => void;
  onUpdateReviews: (updated: Review[]) => void;
}

export default function AdminPanel({
  menuItems,
  orders,
  reviews,
  dict,
  currentLanguage,
  onUpdateMenu,
  onUpdateOrders,
  onUpdateReviews
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'menu' | 'reviews'>('stats');
  
  // CMS Dish Form State
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [dishNameEn, setDishNameEn] = useState('');
  const [dishNameVi, setDishNameVi] = useState('');
  const [dishNameTl, setDishNameTl] = useState('');
  const [dishPrice, setDishPrice] = useState(0);
  const [dishCategory, setDishCategory] = useState<'pho' | 'banhmi' | 'buncha' | 'springrolls' | 'drinks' | 'desserts'>('pho');
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
    setDishCategory(dish.category);
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

    if (isAddingNew) {
      const newDish: MenuItem = {
        id: "dish-" + Date.now(),
        nameEn: dishNameEn,
        nameVi: dishNameVi || dishNameEn,
        nameTl: dishNameTl || dishNameEn,
        price: Number(dishPrice),
        category: dishCategory,
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
            category: dishCategory,
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

    setIsAddingNew(false);
    setEditingDish(null);
  };

  const handleDeleteDish = (id: string) => {
    const updated = menuItems.filter(item => item.id !== id);
    onUpdateMenu(updated);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100 min-h-[80vh]">
      
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-gray-900 flex items-center gap-2">
            <span>🛡️ {dict.adminDashboard}</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium">Viet Bistro Bonifacio High Street Operations Control Center</p>
        </div>

        {/* CMS Sub-Navigation Tabs */}
        <div className="flex gap-1.5 overflow-x-auto bg-gray-200/60 p-1 rounded-xl">
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
          
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="font-sans font-bold text-base text-gray-800">{dict.menuManagement}</h3>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>{dict.addDish}</span>
            </button>
          </div>

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
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="pho">Pho</option>
                    <option value="banhmi">Banh Mi</option>
                    <option value="buncha">Bun Cha / Bowls</option>
                    <option value="springrolls">Spring Rolls</option>
                    <option value="drinks">Drinks / Coffee</option>
                    <option value="desserts">Desserts</option>
                  </select>
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
                      <td className="whitespace-nowrap px-6 py-4 uppercase font-bold text-[10px] text-gray-400">{item.category}</td>
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

    </div>
  );
}
