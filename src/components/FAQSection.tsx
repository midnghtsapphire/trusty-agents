import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How is PoofAgent different from other AI phone agents?",
    answer:
      "Every PoofAgent is human-reviewed and verified before deployment. We stress-test agents with real-world scenarios, check for hallucinations, and ensure accuracy meets our 98%+ standard. No generic chatbots—just verified, industry-specific agents that actually work.",
  },
  {
    question: "What does 'verified' actually mean?",
    answer:
      "Verified means our team has tested your specific agent configuration against 100+ real-world scenarios for your industry. We check call handling accuracy, conversation flow, edge cases, and integration reliability. Only agents that pass our rigorous review process get the ✨ Verified badge.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most businesses go live within 24 hours. Choose your agent from the marketplace, configure your business details, and connect your phone system. Our verification review typically completes within 2-4 hours during business hours.",
  },
  {
    question: "Can the AI handle complex conversations?",
    answer:
      "Yes! Our agents handle multi-turn conversations, follow-up questions, objection handling, and complex scheduling scenarios. They're trained on thousands of real business conversations and continuously improve based on your specific call patterns.",
  },
  {
    question: "What happens if the AI can't handle a call?",
    answer:
      "Agents are configured with smart escalation rules. Complex situations automatically transfer to your team with full context. You can set custom triggers for immediate escalation—we believe in AI that knows its limits.",
  },
  {
    question: "Is my data secure? What about HIPAA?",
    answer:
      "Absolutely. We're SOC 2 Type II certified and HIPAA compliant. All calls are encrypted end-to-end, data is stored in secure US-based servers, and we never use your conversations to train other customers' agents.",
  },
  {
    question: "Can I customize the agent's voice and personality?",
    answer:
      "Professional and Enterprise plans include custom voice selection and personality tuning. Match your brand's tone—professional, friendly, authoritative, or casual. We offer 20+ voice options across different accents and styles.",
  },
  {
    question: "What integrations are available?",
    answer:
      "We integrate with major CRMs (Salesforce, HubSpot, Zoho), scheduling tools (Calendly, Acuity), phone systems (RingCentral, Twilio, Vonage), and 1000+ apps via Zapier. Custom API integrations available for Enterprise customers.",
  },
  {
    question: "What's the money-back guarantee?",
    answer:
      "30 days, no questions asked. If PoofAgent doesn't work for your business, we'll refund your subscription in full. We also offer a ROI guarantee—if you don't see measurable improvement in call handling, we'll work with you until you do or refund your fees.",
  },
  {
    question: "Can I try before I commit?",
    answer:
      "Yes! Every plan includes a 14-day free trial with full access to features. Test your agent with real calls, review the analytics, and see the magic yourself before entering payment details.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full glass-card bg-sparkle/15 px-4 py-1.5 text-sm font-medium text-sparkle border border-sparkle/30">
            <HelpCircle size={16} />
            FAQ
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Questions? We've Got Answers
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about PoofAgent. Can't find what you're looking for?{" "}
            <a href="#contact" className="font-medium text-magic hover:underline">
              Chat with our team
            </a>
            .
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl glass-card border border-border px-6 shadow-card data-[state=open]:shadow-card-hover transition-all"
              >
                <AccordionTrigger className="py-5 text-left text-foreground hover:no-underline [&[data-state=open]>svg]:rotate-180">
                  <span className="pr-4 font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="#contact" className="font-medium text-magic hover:underline">
              Schedule a free consultation →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
