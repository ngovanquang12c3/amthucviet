import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, ShieldAlert, CreditCard, Landmark, Phone, CheckCircle, Info } from 'lucide-react';
import { MenuItem, CartItem, Language, Dictionary, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  menuItems: MenuItem[];
  currentLanguage: Language;
  dict: Dictionary;
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNewOrder: (order: Order) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  menuItems,
  currentLanguage,
  dict,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onNewOrder
}: CartDrawerProps) {
  // Checkout Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('bgc');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gcash' | 'bank'>('gcash');
  
  // Custom Payment Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Delivery configuration in PHP
  const deliveryRates: Record<string, { label: string, fee: number, time: string }> = {
    bgc: { label: "BGC / Taguig", fee: 50, time: "15-20 mins" },
    makati: { label: "Makati District", fee: 80, time: "20-30 mins" },
    pasay: { label: "Pasay & Manila City", fee: 120, time: "30-40 mins" },
    qc: { label: "Quezon City", fee: 180, time: "45-60 mins" }
  };

  const getMenuItem = (id: string) => menuItems.find(m => m.id === id);

  const subtotal = cart.reduce((acc, item) => {
    const menu = getMenuItem(item.menuItemId);
    return acc + (menu ? menu.price * item.quantity : 0);
  }, 0);

  const deliveryFee = deliveryRates[district]?.fee || 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!fullName || !phone || !address || !agreePrivacy) return;

    setIsSubmitting(true);

    // Simulate safe secure processing latency
    setTimeout(() => {
      const orderId = "VB-" + Math.floor(100000 + Math.random() * 900000);
      const itemsList = cart.map((item) => {
        const menu = getMenuItem(item.menuItemId)!;
        return {
          menuItemId: item.menuItemId,
          nameEn: menu.nameEn,
          quantity: item.quantity,
          price: menu.price
        };
      });

      const newOrder: Order = {
        id: orderId,
        items: itemsList,
        totalAmount: total,
        deliveryFee,
        customerName: fullName,
        customerPhone: phone,
        customerAddress: address,
        customerDistrict: deliveryRates[district]?.label || district,
        paymentMethod,
        paymentStatus: 'paid', // simulated paid immediately
        orderStatus: 'pending',
        orderDate: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        notes: "No dynamic notes",
        paymentDetails: {
          cardNumber: paymentMethod === 'card' ? `**** **** **** ${cardNumber.slice(-4)}` : undefined,
          gcashNumber: paymentMethod === 'gcash' ? gcashNumber : undefined,
          bankRef: paymentMethod === 'bank' ? 'REF-' + Math.floor(10000 + Math.random() * 90000) : undefined
        }
      };

      onNewOrder(newOrder);
      setConfirmedOrder(newOrder);
      setIsSubmitting(false);
      onClearCart();
    }, 2000);
  };

  const handleResetSuccess = () => {
    setConfirmedOrder(null);
    setFullName('');
    setPhone('');
    setAddress('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setGcashNumber('');
    setAgreePrivacy(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header Drawer */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6 bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5.5 w-5.5 text-emerald-600" />
            <span className="font-sans font-bold text-base text-gray-900">
              {confirmedOrder ? dict.orderSuccess : dict.yourCart}
            </span>
          </div>
          <button
            onClick={confirmedOrder ? handleResetSuccess : onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Screen */}
        {confirmedOrder ? (
          <div className="flex-1 overflow-y-auto p-8 text-center flex flex-col justify-center items-center space-y-6">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xs">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-xl text-gray-900">
                {dict.orderSuccess}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Your authentic Vietnamese meal is being prepped in BGC. A rider will contact you soon.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left space-y-3.5">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2 text-xs">
                <span className="font-bold text-gray-500 uppercase tracking-wider">{dict.orderNumber}</span>
                <span className="font-mono font-extrabold text-emerald-700">{confirmedOrder.id}</span>
              </div>

              <div className="space-y-2">
                {confirmedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-gray-700">
                    <span>{it.quantity}x {it.nameEn}</span>
                    <span className="font-mono">₱{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>{dict.subtotal}</span>
                  <span className="font-mono">₱{confirmedOrder.totalAmount - confirmedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{dict.deliveryFeeLabel}</span>
                  <span className="font-mono">₱{confirmedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-1 text-sm border-t border-dashed border-gray-200">
                  <span>{dict.total}</span>
                  <span className="font-mono text-emerald-700">₱{confirmedOrder.totalAmount}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-gray-400 border-t border-gray-100 space-y-1">
                <div><strong>Delivery to:</strong> {confirmedOrder.customerName} ({confirmedOrder.customerPhone})</div>
                <div>{confirmedOrder.customerAddress}, {confirmedOrder.customerDistrict}</div>
                <div><strong>Payment:</strong> {confirmedOrder.paymentMethod.toUpperCase()} (Secure Instant Settled)</div>
              </div>
            </div>

            <button
              onClick={handleResetSuccess}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 font-bold text-sm shadow-md cursor-pointer transition-colors"
            >
              Order Something Else
            </button>
          </div>
        ) : (
          /* Normal Cart Layout */
          <div className="flex-1 overflow-y-auto flex flex-col">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <ShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm font-semibold text-gray-600">{dict.cartEmpty}</p>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {/* Cart list items */}
                <div className="space-y-4">
                  {cart.map((item) => {
                    const dish = getMenuItem(item.menuItemId);
                    if (!dish) return null;

                    return (
                      <div
                        key={item.menuItemId}
                        className="flex gap-4 items-center border-b border-gray-50 pb-4"
                      >
                        <img
                          src={dish.image}
                          alt={dish.nameEn}
                          className="h-14 w-14 rounded-lg object-cover bg-gray-50"
                          referrerPolicy="no-referrer"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans font-bold text-sm text-gray-900 truncate">
                            {currentLanguage === 'vi' ? dish.nameVi : currentLanguage === 'tl' ? dish.nameTl : dish.nameEn}
                          </h4>
                          <span className="font-mono text-xs text-emerald-700 font-semibold">
                            ₱{dish.price}
                          </span>
                        </div>

                        {/* Adjust Qty */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQty(item.menuItemId, item.quantity - 1)}
                            className="h-7 w-7 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 font-bold text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.menuItemId, item.quantity + 1)}
                            className="h-7 w-7 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 font-bold text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove item */}
                        <button
                          onClick={() => onRemoveItem(item.menuItemId)}
                          className="text-gray-400 hover:text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal Display */}
                <div className="space-y-2 border-b border-gray-100 pb-5">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{dict.subtotal}</span>
                    <span className="font-mono font-semibold">₱{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{dict.deliveryFeeLabel} ({deliveryRates[district]?.time || ''})</span>
                    <span className="font-mono font-semibold">₱{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-dashed border-gray-200">
                    <span>{dict.total}</span>
                    <span className="font-mono text-emerald-800 text-base">₱{total}</span>
                  </div>
                </div>

                {/* Secure Checkout Form */}
                <form onSubmit={handleCheckout} className="space-y-4">
                  <h3 className="font-sans font-bold text-sm text-gray-900 border-l-2 border-emerald-600 pl-2">
                    {dict.checkout}
                  </h3>

                  <div className="grid grid-cols-1 gap-3.5">
                    {/* Full Name */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{dict.fullName}</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Juan Dela Cruz"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{dict.phoneNumber}</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 09171234567"
                          className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* District selector */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{dict.districtLabel}</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 cursor-pointer"
                      >
                        <option value="bgc">BGC / Taguig City (₱50 Fee, 15m)</option>
                        <option value="makati">Makati Business District (₱80 Fee, 25m)</option>
                        <option value="pasay">Pasay & Manila Bay Area (₱120 Fee, 35m)</option>
                        <option value="qc">Quezon City Suburbs (₱180 Fee, 50m)</option>
                      </select>
                    </div>

                    {/* Detailed address */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{dict.deliveryAddress}</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Tower Name, Condo Unit, or Street Details"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                      />
                    </div>

                    {/* Payment choice */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{dict.paymentMethodLabel}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {/* GCash */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('gcash')}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                            paymentMethod === 'gcash'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span className="font-bold text-xs tracking-tight">GCash</span>
                          <span className="text-[8px] opacity-75">e-Wallet</span>
                        </button>
                        
                        {/* Card */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                            paymentMethod === 'card'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <CreditCard className="h-4 w-4" />
                          <span className="text-[8px] font-bold mt-0.5">Credit/Debit</span>
                        </button>

                        {/* Bank Transfer */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bank')}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                            paymentMethod === 'bank'
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <Landmark className="h-4 w-4" />
                          <span className="text-[8px] font-bold mt-0.5">Bank Direct</span>
                        </button>
                      </div>
                    </div>

                    {/* Payment Fields rendering */}
                    {paymentMethod === 'gcash' && (
                      <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                        <p className="text-[10px] text-blue-800 leading-normal">
                          📱 <strong>GCash Wallet Checkout:</strong> Please pay to our registered Merchant No. <strong>0917-123-4567</strong> or input your registered GCash number below for a simulated checkout request:
                        </p>
                        <input
                          type="text"
                          required
                          value={gcashNumber}
                          onChange={(e) => setGcashNumber(e.target.value)}
                          placeholder="0917XXXXXXX"
                          className="w-full rounded-lg border border-blue-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2.5">
                        <label className="text-[10px] text-emerald-800 leading-normal font-semibold block">
                          💳 Secure PCI-Compliant Visa/Mastercard Sandbox Checkout:
                        </label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card Number (4000 1234 5678 9010)"
                          className="w-full rounded-lg border border-emerald-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs focus:outline-none bg-white"
                          />
                          <input
                            type="password"
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="CVV"
                            maxLength={3}
                            className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs focus:outline-none bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'bank' && (
                      <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1.5 text-[11px] text-amber-800">
                        <p className="font-semibold">🏦 Direct OTC / Bank Transfer Details:</p>
                        <p><strong>Bank:</strong> Banco de Oro (BDO) Philippines</p>
                        <p><strong>Account Name:</strong> Viet Bistro PH Corp</p>
                        <p><strong>Account Number:</strong> 0012-3456-7890</p>
                        <p className="text-[9px] opacity-80 mt-1">Please keep reference of transfers. Cooking initiates immediately upon payment receipt.</p>
                      </div>
                    )}

                    {/* Data Privacy RA 10173 compliance box */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-start gap-2">
                        <ShieldAlert className="h-4.5 w-4.5 text-gray-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-gray-700 block">{dict.privacyNotice}</span>
                          <span className="text-[9px] text-gray-500 block leading-tight">{dict.privacyDetails}</span>
                        </div>
                      </div>
                      
                      <label className="flex items-center gap-2 text-[10px] text-gray-600 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer h-3.5 w-3.5"
                        />
                        <span>{dict.agreeTerms}</span>
                      </label>
                    </div>

                  </div>

                  {/* Submission triggers */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreePrivacy}
                    className={`w-full rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                      isSubmitting || !agreePrivacy
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isSubmitting ? dict.processingOrder : `${dict.placeOrder} (₱${total})`}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
