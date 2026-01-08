import { Bell, BellOff } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const NotificationButton = () => {
  const { isSubscribed, isSupported, isLoading, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return null;
  }

  if (isSubscribed) {
    return (
      <button
        onClick={unsubscribe}
        disabled={isLoading}
        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        <Bell size={18} />
        {isLoading ? "..." : "Notifications On"}
      </button>
    );
  }

  return (
    <button
      onClick={subscribe}
      disabled={isLoading}
      className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
    >
      <BellOff size={18} />
      {isLoading ? "..." : "Enable Notifications"}
    </button>
  );
};

export default NotificationButton;
