import { useState } from "react";
import { X, ShoppingCart, User, Mail, Phone, MapPin, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sendPushNotification } from "@/lib/sendPushNotification";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const CartModal = ({ isOpen, onClose, items, onRemoveItem, onClearCart }: CartModalProps) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Send order email notification
  const sendOrderEmail = async (orderData: typeof customerDetails, orderItems: typeof items, orderTotal: number) => {
    try {
      const itemsText = orderItems.map(item => 
        `${item.name} (Qty: ${item.quantity}) - R${item.price.toFixed(2)} each = R${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const emailBody = `
NEW ORDER RECEIVED - JMB Electrical

ORDER DETAILS:
==============
${itemsText}

TOTAL: R${orderTotal.toFixed(2)}

CUSTOMER INFORMATION:
====================
Name: ${orderData.name}
Email: ${orderData.email}
Phone: ${orderData.phone || 'Not provided'}
Address: ${orderData.address || 'Not provided'}
Notes: ${orderData.notes || 'None'}

TIMESTAMP: ${new Date().toLocaleString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}

================================
This is an automated notification from JMB Electrical website.
`;

      // Try FormSubmit service first
      try {
        const formSubmitResponse = await fetch("https://formsubmit.co/ajax/info@jmbcontractors.co.za", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `NEW ORDER - JMB Electrical - R${orderTotal.toFixed(2)} from ${orderData.name}`,
            _template: "table",
            customer_name: orderData.name,
            customer_email: orderData.email,
            customer_phone: orderData.phone || "Not provided",
            total_amount: `R${orderTotal.toFixed(2)}`,
            items: itemsText,
            timestamp: new Date().toISOString(),
            fullMessage: emailBody
          })
        });

        const result = await formSubmitResponse.json();
        if (formSubmitResponse.ok && result.success === "true") {
          return { success: true };
        }
      } catch (formSubmitError) {
        console.log('FormSubmit failed, using mailto fallback');
      }

      // Fallback to mailto
      const subject = `NEW ORDER - JMB Electrical - R${orderTotal.toFixed(2)}`;
      const mailtoLink = `mailto:info@jmbcontractors.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink, '_blank');
      
      return { success: true };
    } catch (error) {
      console.error('Error sending order email:', error);
      return { success: false };
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerDetails.name,
          customer_email: customerDetails.email,
          customer_phone: customerDetails.phone || null,
          customer_address: customerDetails.address || null,
          total_amount: total,
          notes: customerDetails.notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order error:', orderError);
        toast.error('Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        toast.error('Failed to save order items. Please contact support.');
        setIsSubmitting(false);
        return;
      }

      // Send push notification to admin
      await sendPushNotification(
        "🛒 New Order Received!",
        `Order from ${customerDetails.name} - R${total.toFixed(2)}`,
        "/"
      );

      // Send email notification automatically
      await sendOrderEmail(customerDetails, items, total);

      toast.success("Order placed successfully! We will contact you soon.");
      
      // Reset form and cart
      setCustomerDetails({ name: "", email: "", phone: "", address: "", notes: "" });
      setShowCheckout(false);
      onClearCart();
      onClose();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowCheckout(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={handleClose}
        />
      )}

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-card shadow-xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 bg-secondary text-secondary-foreground">
          <h3 className="text-lg font-poppins font-semibold flex items-center gap-2">
            <ShoppingCart size={20} />
            {showCheckout ? "Checkout" : "Your Shopping Cart"}
          </h3>
          <button
            onClick={handleClose}
            className="text-secondary-foreground hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {!showCheckout ? (
          <>
            <div className="p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start py-4 border-b border-border"
                  >
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-muted-foreground text-sm">
                        R{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <strong>R{(item.price * item.quantity).toFixed(2)}</strong>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="block mt-1 text-accent text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <>
                <div className="p-6 bg-muted flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>R{total.toFixed(2)}</span>
                </div>

                <div className="p-6">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-accent text-accent-foreground py-3 rounded font-semibold hover:bg-accent/90 transition-colors"
                  >
                    Proceed to Order
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <MapPin size={16} />
                  Delivery Address
                </label>
                <textarea
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Enter your delivery address"
                  rows={2}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <FileText size={16} />
                  Order Notes
                </label>
                <textarea
                  value={customerDetails.notes}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Any special instructions..."
                  rows={2}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Order Summary</h4>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span>R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-accent-foreground py-3 rounded font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>

              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="w-full bg-muted text-foreground py-3 rounded font-semibold hover:bg-muted/80 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default CartModal;