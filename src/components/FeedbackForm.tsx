import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sendPushNotification } from "@/lib/sendPushNotification";
import { useContactEmail } from "@/hooks/useContactEmail";

const FeedbackForm = () => {
  const { contactEmail } = useContactEmail();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    rating: 5,
    message: "",
  });

  // Send feedback email notification
  const sendFeedbackEmail = async (feedbackData: typeof formData) => {
    try {
      const stars = "⭐".repeat(feedbackData.rating);
      const emailBody = `
NEW FEEDBACK RECEIVED - JMB Electrical

FEEDBACK DETAILS:
================
Rating: ${feedbackData.rating}/5 ${stars}
Name: ${feedbackData.customer_name}
Email: ${feedbackData.customer_email || 'Not provided'}

Message:
${feedbackData.message}

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
        const formSubmitResponse = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `NEW FEEDBACK - JMB Electrical - ${feedbackData.rating} Stars from ${feedbackData.customer_name}`,
            _template: "table",
            customer_name: feedbackData.customer_name,
            customer_email: feedbackData.customer_email || "Not provided",
            rating: `${feedbackData.rating}/5 ${stars}`,
            message: feedbackData.message,
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
      const subject = `NEW FEEDBACK - JMB Electrical - ${feedbackData.rating} Stars`;
      const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink, '_blank');
      
      return { success: true };
    } catch (error) {
      console.error('Error sending feedback email:', error);
      return { success: false };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name and message");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("feedback").insert({
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim() || null,
        rating: formData.rating,
        message: formData.message.trim(),
      });

      if (error) throw error;

      // Send push notification to admin
      await sendPushNotification(
        "⭐ New Feedback Received!",
        `${formData.customer_name} gave ${formData.rating} stars: "${formData.message.substring(0, 50)}..."`,
        "/#testimonials"
      );

      // Send email notification automatically
      await sendFeedbackEmail(formData);

      toast.success("Thank you for your feedback!");
      setFormData({ customer_name: "", customer_email: "", rating: 5, message: "" });
      setOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <MessageSquare className="h-5 w-5" />
          Share Your Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Share Your Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="feedback-name">Your Name *</Label>
            <Input
              id="feedback-name"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="feedback-email">Email (optional)</Label>
            <Input
              id="feedback-email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="feedback-message">Your Feedback *</Label>
            <Textarea
              id="feedback-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your experience..."
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
