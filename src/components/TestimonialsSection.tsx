import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  metric: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "We were losing $15k/month in missed calls. PoofAgent recovered that in the first week. It's like hiring a team of receptionists who never sleep.",
    author: "Sarah Chen",
    role: "Owner",
    company: "Premier Plumbing Co.",
    avatar: "SC",
    rating: 5,
    metric: "+$180k/year recovered",
  },
  {
    quote: "The verification process sold us. Every other AI felt like a gamble—PoofAgent actually tested our agent with real scenarios before going live.",
    author: "Marcus Johnson",
    role: "Operations Director",
    company: "Smile Dental Group",
    avatar: "MJ",
    rating: 5,
    metric: "40hrs/week saved",
  },
  {
    quote: "Our patients can't tell it's AI. The natural conversation flow and HIPAA compliance gave us confidence to deploy across all 12 locations.",
    author: "Dr. Emily Rodriguez",
    role: "Chief Medical Officer",
    company: "HealthFirst Clinics",
    avatar: "ER",
    rating: 5,
    metric: "12 locations deployed",
  },
  {
    quote: "I was skeptical of AI phone agents after bad experiences. PoofAgent's human review process and accuracy guarantees changed my mind completely.",
    author: "Tom Williams",
    role: "CEO",
    company: "Williams Auto Group",
    avatar: "TW",
    rating: 5,
    metric: "98.7% accuracy rate",
  },
  {
    quote: "Setup took 30 minutes, not 30 days. Our real estate team qualified 3x more leads in the first month without hiring anyone.",
    author: "Jessica Park",
    role: "Broker",
    company: "Skyline Realty",
    avatar: "JP",
    rating: 5,
    metric: "3x lead qualification",
  },
  {
    quote: "The ROI dashboard is incredible. I can see exactly how much revenue PoofAgent captures vs what we'd lose with voicemail. No-brainer investment.",
    author: "David Martinez",
    role: "Founder",
    company: "Martinez HVAC",
    avatar: "DM",
    rating: 5,
    metric: "$24k/month captured",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="glass-dark border-y border-white/10 py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full glass-card bg-magic/15 px-4 py-1.5 text-sm font-medium text-magic border border-magic/30">
            ✨ Customer Stories
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Trusted by 500+ Growing Businesses
          </h2>
          <p className="text-lg text-muted-foreground">
            Real results from real businesses. No cherry-picked reviews—just verified success stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="rounded-2xl glass-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover border border-white/10"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              {/* Quote Icon */}
              <Quote size={24} className="mb-4 text-magic/40" />

              {/* Quote */}
              <p className="mb-6 text-sm leading-relaxed text-foreground/90">
                "{testimonial.quote}"
              </p>

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-sparkle text-sparkle" />
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-magic to-sparkle text-sm font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Metric Badge */}
              <div className="mt-4 rounded-lg bg-sparkle/10 px-3 py-2 text-center">
                <span className="text-sm font-semibold text-sparkle">{testimonial.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
