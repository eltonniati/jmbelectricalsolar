import { HardHat } from "lucide-react";

const teamMembers = [
  {
    name: "Sipho Ndlovu",
    role: "Master Electrician",
    quote:
      "I've been with Jimmy Batukeba Electrical for 8 years. The company invests in our ongoing training and provides excellent benefits.",
  },
  {
    name: "Grace Mutombo",
    role: "Electrical Engineer",
    quote:
      "The work-life balance here is great, and management truly values our input on projects. It's a rewarding career.",
  },
  {
    name: "Pieter Botha",
    role: "Journeyman Electrician",
    quote:
      "Jimmy Batukeba Electrical supports our professional growth with certification programs and the latest tools. Safety is always the priority.",
  },
];

const stats = [
  { value: "98%", label: "Employee Satisfaction" },
  { value: "12+", label: "Years Average Experience" },
  { value: "100+", label: "Certifications" },
  { value: "24/7", label: "Support & Emergency Service" },
];

const Team = () => {
  return (
    <section id="team" className="py-20 bg-secondary text-secondary-foreground">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-white relative inline-block section-title-underline pb-4">
            Our Team & Job Satisfaction
          </h2>
          <p className="text-secondary-foreground/80 mt-6">
            Happy electricians deliver the best service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="text-center bg-white/10 p-8 rounded-lg hover:bg-white/15 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <HardHat className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-1">
                {member.name}
              </h3>
              <p className="text-primary mb-4">{member.role}</p>
              <p className="text-secondary-foreground/80 text-sm">
                "{member.quote}"
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-around text-center mt-12">
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
