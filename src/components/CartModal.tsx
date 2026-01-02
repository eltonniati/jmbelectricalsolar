import { X } from "lucide-react";
import { toast } from "sonner";

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
}

const CartModal = ({ isOpen, onClose, items, onRemoveItem }: CartModalProps) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    toast.success(
      "Proceeding to checkout... In a real implementation, this would redirect to a payment gateway."
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={onClose}
        />
      )}

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 w-full max-w-sm h-full bg-card shadow-xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 bg-secondary text-secondary-foreground">
          <h3 className="text-lg font-poppins font-semibold">
            Your Shopping Cart
          </h3>
          <button
            onClick={onClose}
            className="text-secondary-foreground hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Your cart is empty
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start py-4 border-b border-border"
              >
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-muted-foreground text-sm">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
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

        <div className="p-6 bg-muted flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="p-6">
          <button
            onClick={handleCheckout}
            className="w-full bg-accent text-accent-foreground py-3 rounded font-semibold hover:bg-accent/90 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartModal;
