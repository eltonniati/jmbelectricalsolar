import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_EMAIL = "info@jmbcontractors.co.za";

export const useContactEmail = () => {
  const [contactEmail, setContactEmail] = useState(DEFAULT_EMAIL);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContactEmail = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'contact_email')
        .maybeSingle();

      if (error) {
        console.error('Error fetching contact email:', error);
        return;
      }

      if (data?.value) {
        setContactEmail(data.value);
      }
    } catch (error) {
      console.error('Error fetching contact email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContactEmail = async (newEmail: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('settings')
        .update({ value: newEmail })
        .eq('key', 'contact_email');

      if (error) {
        console.error('Error updating contact email:', error);
        return false;
      }

      setContactEmail(newEmail);
      return true;
    } catch (error) {
      console.error('Error updating contact email:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchContactEmail();
  }, []);

  return { contactEmail, isLoading, updateContactEmail, refetch: fetchContactEmail };
};

export default useContactEmail;
