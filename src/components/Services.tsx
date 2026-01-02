import { Home, Building2, SunMedium, BatteryCharging } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Residential Wiring",
    description:
      "Complete home electrical installation, repair, and upgrades with safety as our top priority.",
  },
  {
    icon: Building2,
    title: "Commercial Electrical",
    description:
      "Electrical systems for businesses, offices, and commercial properties of any size.",
  },
  {
    icon: SunMedium,
    title: "Solar Installation",
    description:
      "Professional solar panel installation and integration with your existing electrical system.",
  },
  {
    icon: BatteryCharging,
    title: "EV Charger Installation",
    description:
      "Home and commercial electric vehicle charging station installation and setup.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-secondary relative inline-block section-title-underline pb-4">
            Our Electrical Services
          </h2>
          <p className="text-muted-foreground mt-6">
            Comprehensive electrical solutions for homes and businesses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground rounded-lg p-8 text-center shadow-md hover:-translate-y-3 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
