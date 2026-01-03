import { MessageCircle } from "lucide-react";

interface WhatsAppFloatProps {
  onClick?: () => void;
}

const WhatsAppFloat = ({ onClick }: WhatsAppFloatProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open("https://wa.me/27724144797", "_blank");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 text-white rounded-full shadow-xl hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center justify-center animate-bounce-once"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={32} />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
        Live
      </span>
    </button>
  );
};

export default WhatsAppFloat;
