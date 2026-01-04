import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";

interface CompletedJob {
  id: string;
  image: string;
  title: string;
  location: string;
}

const completedJobs: CompletedJob[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    title: "Solar Installation - Residential",
    location: "Johannesburg, Gauteng"
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&h=600&fit=crop",
    title: "Commercial Solar System",
    location: "Pretoria, Gauteng"
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
    title: "Inverter & Battery Setup",
    location: "Centurion, Gauteng"
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&h=600&fit=crop",
    title: "Rooftop Solar Panels",
    location: "Sandton, Gauteng"
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800&h=600&fit=crop",
    title: "Energy Storage System",
    location: "Midrand, Gauteng"
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
    title: "Complete Solar Solution",
    location: "Soweto, Gauteng"
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1597079910443-60c43fc25754?w=800&h=600&fit=crop",
    title: "Off-Grid Installation",
    location: "Kempton Park, Gauteng"
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop",
    title: "Electrical Wiring Upgrade",
    location: "Randburg, Gauteng"
  }
];

const CompletedJobs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const itemsPerView = 3;

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev + 1 >= completedJobs.length - itemsPerView + 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev === 0 ? completedJobs.length - itemsPerView : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev + 1 >= completedJobs.length - itemsPerView + 1 ? 0 : prev + 1
    );
  };

  const visibleJobs = completedJobs.slice(currentIndex, currentIndex + itemsPerView);
  
  // Handle wraparound for carousel
  const displayJobs = visibleJobs.length < itemsPerView 
    ? [...visibleJobs, ...completedJobs.slice(0, itemsPerView - visibleJobs.length)]
    : visibleJobs;

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-poppins font-bold">
              Our Completed Jobs
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our portfolio of successful solar and electrical installations across South Africa
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background shadow-lg rounded-full p-3 hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background shadow-lg rounded-full p-3 hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden mx-8">
            <div className="flex gap-6 transition-transform duration-500 ease-in-out">
              {displayJobs.map((job, index) => (
                <div
                  key={`${job.id}-${index}`}
                  className="flex-shrink-0 w-full md:w-1/3"
                >
                  <div className="bg-background rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={job.image}
                        alt={job.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-poppins font-semibold text-lg mb-1">{job.title}</h3>
                      <p className="text-muted-foreground text-sm">{job.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: completedJobs.length - itemsPerView + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompletedJobs;
