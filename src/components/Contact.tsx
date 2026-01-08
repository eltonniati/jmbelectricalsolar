import { useState } from "react";
import { Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sendPushNotification } from "@/lib/sendPushNotification";

interface ContactProps {
  onWhatsAppClick?: () => void;
}

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    line1: "+27 72 414 4797",
    line2: "24/7 Emergency Service Available",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    line1: "Click to WhatsApp",
    line2: "Quick response guaranteed",
  },
  {
    icon: Mail,
    title: "Email Us",
    line1: "info@jmbcontractors.co.za",
    line2: "Quotes & Inquiries",
  },
  {
    icon: Clock,
    title: "Business Hours",
    line1: "Mon-Fri: 8am-6pm",
    line2: "Sat: 9am-4pm",
  },
];

const Contact = ({ onWhatsAppClick }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsAppClick = () => {
    if (onWhatsAppClick) {
      onWhatsAppClick();
    } else {
      window.open("https://wa.me/27724144797", "_blank");
    }
  };

  // Function to send email notification
  const sendContactEmail = async (contactData: typeof formData) => {
    try {
      const emailBody = `
NEW CONTACT FORM SUBMISSION - JMB Electrical

CONTACT DETAILS:
================
Name: ${contactData.name}
Email: ${contactData.email}
Service Needed: ${contactData.service || "Not specified"}
Message: ${contactData.message || "No message provided"}

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
Please respond to this inquiry as soon as possible.
`;

      // Method 1: Try FormSubmit service
      try {
        const formSubmitResponse = await fetch("https://formsubmit.co/ajax/info@jmbcontractors.co.za", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `NEW CONTACT - JMB Electrical - ${contactData.name}`,
            _template: "table",
            name: contactData.name,
            email: contactData.email,
            service: contactData.service || "Not specified",
            message: contactData.message || "No message provided",
            timestamp: new Date().toISOString(),
            fullMessage: emailBody
          })
        });

        const result = await formSubmitResponse.json();
        if (formSubmitResponse.ok && result.success === "true") {
          return { success: true, method: 'formsubmit' };
        }
      } catch (formSubmitError) {
        console.log('FormSubmit failed, trying alternative...');
      }

      // Method 2: Fallback to mailto
      const subject = `NEW CONTACT - JMB Electrical - ${contactData.name}`;
      const mailtoLink = `mailto:info@jmbcontractors.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink, '_blank');
      
      return { success: true, method: 'mailto' };
      
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: 'Failed to send email' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save contact submission to database
      const { error } = await supabase.from("contact_submissions").insert({
        full_name: formData.name,
        email: formData.email,
        service_type: formData.service || null,
        message: formData.message || "No message provided",
      });

      if (error) {
        console.error("Error saving contact:", error);
        toast.error("Failed to send message. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Send push notification to admin
      await sendPushNotification(
        "📩 New Contact Form Submission!",
        `${formData.name} is interested in ${formData.service || "your services"}`,
        "/#contact"
      );

      // Send email notification
      const emailResult = await sendContactEmail(formData);
      
      if (emailResult.success) {
        if (emailResult.method === 'formsubmit') {
          toast.success("Message sent! We'll contact you soon.");
        } else {
          toast.success("Email client opened. Please send the email to complete your inquiry.");
        }
      } else {
        // If email fails, at least show success for database save
        toast.success("Message saved! We'll contact you soon.");
      }
      
      // Reset form
      setFormData({ name: "", email: "", service: "", message: "" });
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-feedback">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-secondary relative inline-block section-title-underline pb-4">
            Contact Us
          </h2>
          <p className="text-muted-foreground mt-6">
            Get in touch for electrical services or product inquiries
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="text-center cursor-pointer group"
                onClick={info.title === "WhatsApp" ? handleWhatsAppClick : undefined}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                  info.title === "WhatsApp" 
                    ? "bg-green-500 group-hover:bg-green-600 group-hover:scale-110" 
                    : "bg-secondary group-hover:bg-secondary/80 group-hover:scale-110"
                }`}>
                  <info.icon className={`w-7 h-7 ${
                    info.title === "WhatsApp" ? "text-white" : "text-primary"
                  }`} />
                </div>
                <h3 className="font-poppins font-semibold text-lg mb-2">
                  {info.title}
                </h3>
                <p className="text-foreground group-hover:text-primary transition-colors">
                  {info.line1}
                </p>
                <p className="text-muted-foreground text-sm">{info.line2}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card p-8 rounded-lg shadow-md border border-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium text-foreground">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-input rounded focus:outline-none focus:ring-2 focus:ring-secondary bg-background transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-foreground">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-input rounded focus:outline-none focus:ring-2 focus:ring-secondary bg-background transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-foreground">Service Needed</label>
              <select
                value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
                className="w-full px-4 py-3 border border-input rounded focus:outline-none focus:ring-2 focus:ring-secondary bg-background transition-colors"
              >
                <option value="">Select a service</option>
                <option value="residential">Residential Wiring</option>
                <option value="commercial">Commercial Electrical</option>
                <option value="solar">Solar Installation</option>
                <option value="ev">EV Charger Installation</option>
                <option value="maintenance">Electrical Maintenance</option>
                <option value="emergency">Emergency Electrical</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-foreground">Message</label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 border border-input rounded focus:outline-none focus:ring-2 focus:ring-secondary bg-background resize-none transition-colors"
                placeholder="Tell us about your project or inquiry..."
              />
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> After clicking "Send Message", you may see your email client open. 
                Please send the pre-filled email to complete your inquiry.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Emails are sent to: <strong>info@jmbcontractors.co.za</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-accent text-accent-foreground py-3 rounded font-semibold text-lg hover:bg-accent/90 hover:-translate-y-1 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded font-semibold text-lg hover:bg-green-600 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <MessageCircle size={20} />
                WhatsApp Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
