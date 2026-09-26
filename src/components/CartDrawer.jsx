import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShoppingCart,
  Trash2,
  Truck,
  Store,
  CreditCard,
  Banknote,
  ArrowRight,
  ShieldCheck,
  MapPin,
  AlertCircle
} from 'lucide-react';
import marketsData from '../data/markets.json';

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCartDrawer,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
    currentUser,
    openAuthModal,
    setOrderReceipt,
    addToast
  } = useApp();

  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery' | 'pickup'
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState(marketsData[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [checkoutError, setCheckoutError] = useState('');

  if (!isCartOpen) return null;

  const deliveryFee = fulfillmentType === 'pickup' ? 0 : 150;
  const finalTotal = cartTotal + deliveryFee;

  const handleCheckout = (e) => {
    e.preventDefault();
    setCheckoutError('');

    // Validation
    if (fulfillmentType === 'delivery') {
      if (!deliveryAddress.trim() || deliveryAddress.trim().length < 8) {
        setCheckoutError('Please enter a complete delivery street address.');
        return;
      }
    }

    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      setCheckoutError('Please enter a valid contact phone number (e.g. 0300-1234567).');
      return;
    }

    const selectedMarket = marketsData.find((m) => m.id === selectedMarketId);
    const fulfillmentDetails =
      fulfillmentType === 'delivery'
        ? `${deliveryAddress.trim()} (Phone: ${phoneNumber.trim()})`
        : `${selectedMarket?.name || 'Selected Farmers Market'}, ${selectedMarket?.area || ''} (Phone: ${phoneNumber.trim()})`;

    const orderData = {
      orderId: `FF-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-PK', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customerName: currentUser?.name || 'Resident Customer',
      customerEmail: currentUser?.email || 'guest@freshfind.local',
      items: [...cart],
      subtotal: cartTotal,
      deliveryFee: deliveryFee,
      total: finalTotal,
      fulfillmentType,
      fulfillmentDetails,
      paymentMethod:
        fulfillmentType === 'pickup' && paymentMethod === 'Cash on Delivery'
          ? 'Pay at Market Pickup'
          : paymentMethod
    };

    clearCart();
    closeCartDrawer();
    setOrderReceipt(orderData);
    addToast(`Order confirmed! Thank you${currentUser?.name ? `, ${currentUser.name}` : ''}!`, 'success');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-forest p-5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-200">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 id="cart-drawer-title" className="font-extrabold text-base tracking-tight">
                Fresh Market Cart
              </h2>
              <p className="text-[11px] text-emerald-200/80">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCartDrawer}
            aria-label="Close cart drawer"
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-stone-800 text-base mb-1.5">
              Your cart is empty
            </h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed mb-5">
              Explore local farm produce and add fresh vegetables, fruits, and organic staples to your cart!
            </p>
            <button
              type="button"
              onClick={closeCartDrawer}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-soft transition-colors cursor-pointer"
            >
              Explore Fresh Produce
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Cart Items List */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Cart Items ({cartItemCount})
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                {cart.map((item) => (
                  <div key={item.id} className="p-3 sm:p-3.5 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 bg-stone-100"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-emerald-800 font-mono mt-0.5">
                        Rs. {item.price} <span className="text-[10px] text-stone-500 font-sans">/ {item.unit || 'kg'}</span>
                      </p>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-black text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold text-xs sm:text-sm text-stone-900 font-mono">
                          Rs. {item.price * item.quantity}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Fulfillment Selector (Delivery vs Market Pickup) */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Fulfillment Preference
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    fulfillmentType === 'delivery'
                      ? 'bg-white border-emerald-600 text-emerald-900 shadow-sm'
                      : 'bg-stone-100/70 border-stone-200 text-stone-600 hover:bg-white'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Home Delivery</span>
                  <span className="text-[10px] text-stone-500 font-normal">Rs. 150</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    fulfillmentType === 'pickup'
                      ? 'bg-white border-emerald-600 text-emerald-900 shadow-sm'
                      : 'bg-stone-100/70 border-stone-200 text-stone-600 hover:bg-white'
                  }`}
                >
                  <Store className="w-4 h-4 text-emerald-700" />
                  <span>Market Pick-up</span>
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase">FREE</span>
                </button>
              </div>

              {/* Delivery Details Inputs */}
              {fulfillmentType === 'delivery' ? (
                <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. House 14, Street 6, Sector F-8, Islamabad"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Choose Pick-up Market
                    </label>
                    <select
                      value={selectedMarketId}
                      onChange={(e) => setSelectedMarketId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      {marketsData.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.area})
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Pick-up will be ready at the FreshFind Community Stall during market operating hours!
                  </p>
                </div>
              )}

              {/* Contact Phone */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Payment Method
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-white border-emerald-600 text-emerald-900 shadow-sm'
                      : 'bg-stone-100/70 border-stone-200 text-stone-600 hover:bg-white'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span>{fulfillmentType === 'pickup' ? 'Pay at Pick-up' : 'Cash on Delivery'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Debit / Credit Card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'Debit / Credit Card'
                      ? 'bg-white border-emerald-600 text-emerald-900 shadow-sm'
                      : 'bg-stone-100/70 border-stone-200 text-stone-600 hover:bg-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Card Payment</span>
                </button>
              </div>

              {paymentMethod === 'Debit / Credit Card' && (
                <div className="pt-1.5 animate-in fade-in duration-150">
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242 (Simulated Sandbox)"
                    className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-500 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Error Banner */}
            {checkoutError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Bill Summary */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-stone-900 font-mono">Rs. {cartTotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Fulfillment Fee:</span>
                <span className="font-bold text-stone-900 font-mono">
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-900">
                <span>Total Amount:</span>
                <span className="text-emerald-800 font-mono text-base">Rs. {finalTotal}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-soft transition-all duration-150 cursor-pointer"
              >
                <span>Confirm & Place Order (Rs. {finalTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-stone-400 text-center mt-2">
                {currentUser
                  ? `Signed in as ${currentUser.name}. You will receive order details instantly.`
                  : 'Instant simulated order confirmation. No account required.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
