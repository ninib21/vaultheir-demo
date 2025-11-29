'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Lana Kim',
    role: 'CEO, TechStartup Inc.',
    company: 'TechStartup Inc.',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face',
    initials: 'LK',
    content: 'Vaultheir™ saved us over $150K in IP filing costs in our first year. The blockchain notarization is instant and the platform is incredibly user-friendly.',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'IP Attorney',
    company: 'Rodriguez Law Firm',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    initials: 'MR',
    content: 'As an IP attorney, I recommend Vaultheir™ to all my clients. The Hedera blockchain integration is revolutionary, and my clients love the cost savings.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Innovation Director',
    company: 'Fortune 500 Corp',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
    initials: 'EW',
    content: 'We\'ve protected 500+ IP assets on Vaultheir™. The AI valuation feature is incredibly accurate, and the enterprise features are exactly what we needed.',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Founder & CTO',
    company: 'BlockVentures',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    initials: 'DP',
    content: 'The Hedera integration is seamless. We notarized our entire patent portfolio in under an hour. This is the future of IP management.',
    rating: 5,
  },
  {
    name: 'Amanda Foster',
    role: 'General Counsel',
    company: 'Innovate Labs',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=100&h=100&fit=crop&crop=face',
    initials: 'AF',
    content: 'From a legal perspective, having immutable blockchain proof of our IP creation dates has been invaluable in disputes. Game changer.',
    rating: 5,
  },
  {
    name: 'James Mitchell',
    role: 'VP of Engineering',
    company: 'TechScale Inc.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    initials: 'JM',
    content: 'We integrated Vaultheir™ into our CI/CD pipeline. Every code commit is now automatically notarized. Brilliant solution.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Trusted by Innovators</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of companies protecting their intellectual property with Vaultheir™
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="glass-effect-strong rounded-2xl p-6 relative hover-lift group"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Quote className="w-8 h-8 text-primary-400/20 absolute top-5 right-5 group-hover:text-primary-400/30 transition-colors" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed text-sm relative z-10">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300 ring-2 ring-primary-500/30">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">${testimonial.initials}</div>`;
                    }}
                  />
                </div>
                <div>
                  <div className="font-bold text-white text-base">{testimonial.name}</div>
                  <div className="text-xs text-gray-400 font-medium">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

