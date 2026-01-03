import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-secondary via-secondary to-background py-16 md:py-24"
    >
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Logo Image */}
          <div className="flex-shrink-0">
            <img 
              src={heroBanner} 
              alt="JMB Electrical & Solar Logo" 
              className="w-64 md:w-80 lg:w-96 rounded-lg shadow-2xl"
            />
          </div>
          
          {/* Content */}
          <div className="text-center lg:text-left">
            <p className="text-primary font-semibold text-lg mb-2">JMB ELECTRICAL & SOLAR</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-poppins font-bold text-foreground mb-6">
              WE KEEP YOU<br />OUT OF THE DARK
            </h1>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 text-sm">
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full">Commercial Solutions</span>
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full">Residential Solutions</span>
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full">Guaranteed Performance</span>
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full">Latest Solar Technology</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => handleScroll("#services")}
                className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded font-semibold text-lg hover:bg-accent/90 hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                Learn More
              </button>
              <button
                onClick={() => handleScroll("#contact")}
                className="inline-block bg-transparent border-2 border-primary text-primary px-8 py-3 rounded font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Contact Us
              </button>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <a href="tel:+27724144797" className="flex items-center gap-2 hover:text-primary transition-colors">
                <span className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center">📞</span>
                +27 72 414 4797
              </a>
              <a href="mailto:info@jmbcontractors.co.za" className="hover:text-primary transition-colors">
                info@jmbcontractors.co.za
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
