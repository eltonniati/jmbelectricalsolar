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
      className="relative bg-cover bg-center py-24 md:py-32"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80')`,
      }}
    >
      <div className="container text-center text-white">
        <h1 className="text-3xl md:text-5xl font-poppins font-bold mb-6">
          Professional Electrical Services
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
          Licensed electricians providing reliable residential and commercial
          electrical services. 24/7 emergency service available with 100%
          satisfaction guarantee.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleScroll("#contact")}
            className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded font-semibold text-lg hover:bg-accent/90 hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            Book a Service
          </button>
          <button
            onClick={() => handleScroll("#products")}
            className="inline-block bg-transparent border-2 border-primary text-primary px-8 py-3 rounded font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Shop Electrical Items
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
