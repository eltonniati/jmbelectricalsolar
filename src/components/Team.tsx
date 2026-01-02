const stats = [
  { value: "98%", label: "Customer Satisfaction" },
  { value: "12+", label: "Years Experience" },
  { value: "500+", label: "Projects Completed" },
  { value: "24/7", label: "Emergency Service" },
];

const Team = () => {
  return (
    <section id="team" className="py-20 bg-secondary text-secondary-foreground">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-white relative inline-block section-title-underline pb-4">
            Why Choose Us
          </h2>
          <p className="text-secondary-foreground/80 mt-6">
            Trusted electrical services across Pretoria and Gauteng
          </p>
        </div>

        <div className="flex flex-wrap justify-around text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-6">
              <span className="text-4xl md:text-5xl font-poppins font-bold text-primary block">
                {stat.value}
              </span>
              <p className="text-secondary-foreground/80 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
