import { Star, StarHalf, User, UserRound } from "lucide-react";
import FeedbackForm from "./FeedbackForm";

const testimonials = [
  {
    text: "JMB Electrical arrived on time, diagnosed the issue quickly, and fixed it at a reasonable price. Highly professional!",
    rating: 5,
    name: "Thabo Mokoena",
    role: "Homeowner, Pretoria",
    icon: User,
  },
  {
    text: "We hired JMB Electrical to rewire our entire office building. They completed the project ahead of schedule with minimal disruption.",
    rating: 4.5,
    name: "Naledi van der Merwe",
    role: "Business Owner, Johannesburg",
    icon: UserRound,
  },
  {
    text: "The team installed solar panels on my home. They were knowledgeable, efficient, and the system works perfectly!",
    rating: 5,
    name: "Patrick Kabongo",
    role: "Residential Client, Centurion",
    icon: User,
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex text-primary my-2">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="w-5 h-5 fill-current" />}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section id="feedback" className="py-20 bg-feedback">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-secondary relative inline-block section-title-underline pb-4">
            Customer Feedback
          </h2>
          <p className="text-muted-foreground mt-6 mb-4">
            What our clients say about our services
          </p>
          <FeedbackForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground rounded-lg p-8 shadow-md relative testimonial-quote"
            >
              <p className="text-foreground mb-4">{testimonial.text}</p>
              <RatingStars rating={testimonial.rating} />
              <div className="flex items-center mt-6">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mr-4">
                  <testimonial.icon className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h4 className="font-poppins font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
