'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechStartup Inc.',
    company: 'TechStartup Inc.',
    image: 'SC',
    content: 'Vaultheir™ saved us over $150K in IP filing costs in our first year. The blockchain notarization is instant and the platform is incredibly user-friendly.',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'IP Attorney',
    company: 'Rodriguez Law Firm',
    image: 'MR',
    content: 'As an IP attorney, I recommend Vaultheir™ to all my clients. The Hedera blockchain integration is revolutionary, and my clients love the cost savings.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Innovation Director',
    company: 'Fortune 500 Corp',
    image: 'EW',
    content: 'We\'ve protected 500+ IP assets on Vaultheir™. The AI valuation feature is incredibly accurate, and the enterprise features are exactly what we needed.',
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
            See what our customers are saying about Vaultheir™
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-effect-strong rounded-2xl p-8 relative hover-lift group"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Quote className="w-10 h-10 text-primary-400/20 absolute top-6 right-6 group-hover:text-primary-400/30 transition-colors" />
              <div className="flex gap-1 mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                ))}
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed text-base relative z-10">{testimonial.content}</p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{testimonial.name}</div>
                  <div className="text-sm text-gray-400 font-medium">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

