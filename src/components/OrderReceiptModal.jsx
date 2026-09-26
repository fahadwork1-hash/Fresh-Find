import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, X, Download, Store, Truck, Calendar, ShoppingBag } from 'lucide-react';

export default function OrderReceiptModal() {
  const { orderReceipt, setOrderReceipt } = useApp();

  if (!orderReceipt) return null;

  const handleDownloadReceipt = () => {
    let text = `====================================================\n`;
    text += ` FRESHFIND - FARM FRESH ORDER RECEIPT\n`;
    text += ` Order ID: ${orderReceipt.orderId}\n`;
    text += ` Date: ${orderReceipt.date}\n`;
    text += `====================================================\n\n`;
    text += `CUSTOMER DETAILS:\n`;
    text += `Name: ${orderReceipt.customerName}\n`;
    text += `Email: ${orderReceipt.customerEmail}\n\n`;
    text += `FULFILLMENT:\n`;
    text += `Type: ${orderReceipt.fulfillmentType === 'delivery' ? 'Doorstep Delivery' : 'Farmers Market Pick-Up'}\n`;
    text += `Details: ${orderReceipt.fulfillmentDetails}\n`;
    text += `Payment: ${orderReceipt.paymentMethod}\n\n`;
    text += `----------------------------------------------------\n`;
    text += `ITEMS ORDERED:\n`;
    text += `----------------------------------------------------\n`;

    orderReceipt.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name} (${item.quantity} ${item.unit || 'kg'}) - Rs. ${item.price * item.quantity}\n`;
    });

    text += `----------------------------------------------------\n`;
    text += `Subtotal: Rs. ${orderReceipt.subtotal}\n`;
    text += `Delivery / Pickup Fee: Rs. ${orderReceipt.deliveryFee}\n`;
    text += `TOTAL PAID: Rs. ${orderReceipt.total}\n`;
    text += `====================================================\n`;
    text += `Thank you for supporting local growers with FreshFind!\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FreshFind-Receipt-${orderReceipt.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-elevated border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 text-white text-center relative shrink-0">
          <button
            type="button"
            onClick={() => setOrderReceipt(null)}
            className="absolute top-4 right-4 p-2 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-300" />
          </div>

          <h2 id="receipt-modal-title" className="text-2xl font-black tracking-tight">
            Order Confirmed!
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            Thank you, {orderReceipt.customerName}! Your fresh farm order has been received.
          </p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-stone-800">
          {/* Order Details Bar */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Order ID</span>
              <strong className="text-emerald-800 font-mono text-sm">{orderReceipt.orderId}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Date & Time</span>
              <span className="font-semibold text-stone-700">{orderReceipt.date}</span>
            </div>
          </div>

          {/* Fulfillment Info */}
          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              {orderReceipt.fulfillmentType === 'delivery' ? (
                <>
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Doorstep Delivery Address:</span>
                </>
              ) : (
                <>
                  <Store className="w-4 h-4 text-emerald-700" />
                  <span>Market Pick-up Location:</span>
                </>
              )}
            </div>
            <p className="text-stone-700 pl-6 leading-relaxed font-medium">
              {orderReceipt.fulfillmentDetails}
            </p>
            <div className="text-[11px] text-stone-500 pl-6 pt-1">
              Payment Method: <strong>{orderReceipt.paymentMethod}</strong>
            </div>
          </div>

          {/* Items Summary Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Items Ordered ({orderReceipt.items.length})
            </h3>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
              {orderReceipt.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <div className="font-bold text-stone-900">{item.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {item.quantity} × Rs. {item.price} / {item.unit || 'kg'}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-stone-900 font-mono">
                    Rs. {item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal:</span>
              <span className="font-mono">Rs. {orderReceipt.subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Fulfillment Fee:</span>
              <span className="font-mono">
                {orderReceipt.deliveryFee === 0 ? 'FREE' : `Rs. ${orderReceipt.deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-900">
              <span>Total Paid:</span>
              <span className="text-emerald-800 font-mono text-base">Rs. {orderReceipt.total}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-emerald-800 border border-stone-200 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderReceipt(null)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shadow-soft transition-colors cursor-pointer"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
