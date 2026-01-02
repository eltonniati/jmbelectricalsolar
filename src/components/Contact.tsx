import { useState } from "react";
import { Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    line1: "+27 72 414 4797",
    line2: "24/7 Emergency Service Available",
  },
  {
    icon: Mail,
    title: "Email Us",
    line1: "info@batukeba.co.za",
    line2: "Quotes & Inquiries",
  },
  {
    icon: Clock,
    title: "Business Hours",
    line1: "Mon-Fri: 8am-6pm",
    line2: "Sat: 9am-4pm",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We will contact you soon.");
    setFormData({ name: "", email: "", service: "", message: "" });
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-poppins font-semibold text-lg mb-2">
                  {info.title}
                </h3>
                <p className="text-foreground">{info.line1}</p>
                <p className="text-muted-foreground text-sm">{info.line2}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card p-8 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-input rounded focus:outline-none focus:ring-2 focus:ring-secondary bg-background"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-input rounded focus:outline-none focus:ring-2 focus:ring-secondary bg-background"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Service Needed</label>
              <select
                value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
                className="w-full px-4 py-3 border border-input rounded focus:outline-none focus:ring-2 focus:ring-secondary bg-background"
              >
                <option value="">Select a service</option>
                <option value="residential">Residential Wiring</option>
                <option value="commercial">Commercial Electrical</option>
                <option value="solar">Solar Installation</option>
                <option value="ev">EV Charger Installation</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium">Message</label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 border border-input rounded focus:outline-none focus:ring-2 focus:ring-secondary bg-background resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground py-3 rounded font-semibold text-lg hover:bg-accent/90 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
