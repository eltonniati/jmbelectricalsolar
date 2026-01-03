import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

const Footer = () => {
  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/27724144797", "_blank");
  };

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-primary text-xl font-poppins font-semibold mb-6">
              JMB ELECTRICAL
            </h3>
            <p className="text-secondary-foreground/80 mb-6">
              Professional electrical services with over 15 years of experience.
              Licensed, insured, and committed to safety and customer
              satisfaction.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleWhatsAppClick}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:-translate-y-1 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-400 hover:-translate-y-1 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-600 hover:-translate-y-1 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-primary text-xl font-poppins font-semibold mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "#home", label: "Home" },
                { href: "#services", label: "Services" },
                { href: "#feedback", label: "Customer Feedback" },
                { href: "#team", label: "Our Team" },
                { href: "#products", label: "Shop Products" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleScroll(link.href)}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-primary text-xl font-poppins font-semibold mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                "Residential Wiring",
                "Commercial Electrical",
                "Solar Installation",
                "EV Charger Setup",
                "Emergency Repair",
              ].map((service) => (
                <li key={service}>
                  <button
                    onClick={() => handleScroll("#services")}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-primary text-xl font-poppins font-semibold mb-6">
              Contact Info
            </h3>
            <ul className="space-y-3 text-secondary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                678 Mance Ave, Pretoria, South Africa
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 shrink-0" />
                +27 72 414 4797
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 shrink-0 text-green-400" />
                <button
                  onClick={handleWhatsAppClick}
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp Us
                </button>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 shrink-0" />
                info@jmbelectrical.co.za
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-5 h-5 shrink-0" />
                Mon-Fri: 8am-6pm
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-secondary-foreground/60">
          <p>
            © 2024 JMB ELECTRICAL. All rights reserved. | Pretoria, South Africa
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
