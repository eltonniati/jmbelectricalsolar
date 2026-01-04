import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CompletedJob {
  id: string;
  image: string;
  title: string;
  location: string;
}

const CompletedJobs = () => {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerView = 3;

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('completed_jobs')
        .select('id, image, title, location')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching completed jobs:', error);
      } else {
        setCompletedJobs(data || []);
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || completedJobs.length <= itemsPerView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev + 1 >= completedJobs.length - itemsPerView + 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, completedJobs.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, completedJobs.length - itemsPerView) : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev + 1 >= completedJobs.length - itemsPerView + 1 ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading completed jobs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (completedJobs.length === 0) {
    return null;
  }

  const visibleJobs = completedJobs.slice(currentIndex, currentIndex + itemsPerView);
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
          {completedJobs.length > itemsPerView && (
            <>
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
            </>
          )}

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

          {completedJobs.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.max(1, completedJobs.length - itemsPerView + 1) }).map((_, index) => (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default CompletedJobs;
