import { supabase } from "@/integrations/supabase/client";

export async function sendPushNotification(title: string, body: string, url?: string) {
  try {
    const { data, error } = await supabase.functions.invoke("send-push-notification", {
      body: { title, body, url },
    });

    if (error) {
      console.error("Error sending push notification:", error);
      return false;
    }

    console.log("Push notification result:", data);
    return true;
  } catch (error) {
    console.error("Error invoking push function:", error);
    return false;
  }
}
