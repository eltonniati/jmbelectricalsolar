import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// VAPID public key - must match the one in edge function
const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    const supported = "serviceWorker" in navigator && "PushManager" in window;
    setIsSupported(supported);

    if (supported) {
      checkSubscriptionStatus();
    }
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const registerServiceWorker = async () => {
    try {
      // Register the push service worker
      const registration = await navigator.serviceWorker.register("/sw-push.js", {
        scope: "/",
      });
      await navigator.serviceWorker.ready;
      return registration;
    } catch (error) {
      console.error("Service worker registration failed:", error);
      throw error;
    }
  };

  const subscribe = async () => {
    if (!isSupported) {
      toast.error("Push notifications are not supported in this browser");
      return false;
    }

    setIsLoading(true);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Please allow notifications to receive updates");
        setIsLoading(false);
        return false;
      }

      // Register service worker
      const registration = await registerServiceWorker();

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subscriptionJson = subscription.toJSON();

      // Save subscription to database
      const { error } = await supabase.from("push_subscriptions").insert({
        endpoint: subscription.endpoint,
        p256dh: subscriptionJson.keys?.p256dh || "",
        auth: subscriptionJson.keys?.auth || "",
      });

      if (error) {
        console.error("Error saving subscription:", error);
        toast.error("Failed to save notification subscription");
        setIsLoading(false);
        return false;
      }

      setIsSubscribed(true);
      toast.success("You will now receive notifications for new orders and feedback!");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error subscribing to push:", error);
      toast.error("Failed to enable notifications");
      setIsLoading(false);
      return false;
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Remove from database
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", subscription.endpoint);

        // Unsubscribe from push
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      toast.success("Notifications disabled");
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast.error("Failed to disable notifications");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSubscribed,
    isSupported,
    isLoading,
    subscribe,
    unsubscribe,
  };
}
