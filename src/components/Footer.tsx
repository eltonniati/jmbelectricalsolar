import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-primary text-xl font-poppins font-semibold mb-6">
              ProSpark Electrical
            </h3>
            <p className="text-secondary-foreground/80 mb-6">
              Professional electrical services with over 15 years of experience.
              Licensed, insured, and committed to safety and customer
              satisfaction.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:-translate-y-1 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
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
                123 Electric Ave, Power City
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 shrink-0" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 shrink-0" />
                info@prospark.com
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
            © 2023 ProSpark Electrical. All rights reserved. | License #EC123456
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
