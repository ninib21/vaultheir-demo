'use client';

import { motion } from 'framer-motion';
import { Linkedin, Twitter, Globe, Award, Briefcase, GraduationCap } from 'lucide-react';

const team = [
  {
    name: 'Bashar Zarn',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
    initials: 'BZ',
    bio: 'Serial entrepreneur with 10+ years in fintech and blockchain. Previously founded two successful startups in the digital asset space.',
    credentials: [
      { icon: Briefcase, text: 'Ex-Goldman Sachs' },
      { icon: GraduationCap, text: 'MIT Computer Science' },
      { icon: Award, text: 'Forbes 30 Under 30' },
    ],
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Sarah Mitchell',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    initials: 'SM',
    bio: 'Blockchain architect with deep expertise in distributed systems. Led engineering at two unicorn startups before joining VaultHeir.',
    credentials: [
      { icon: Briefcase, text: 'Ex-Coinbase' },
      { icon: GraduationCap, text: 'Stanford PhD' },
      { icon: Award, text: 'Hedera Council Member' },
    ],
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Michael Chen',
    role: 'Chief Legal Officer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    initials: 'MC',
    bio: 'IP law expert with 15+ years experience. Former partner at Baker McKenzie, specializing in technology and blockchain intellectual property.',
    credentials: [
      { icon: Briefcase, text: 'Ex-Baker McKenzie' },
      { icon: GraduationCap, text: 'Harvard Law' },
      { icon: Award, text: '500+ IP Cases Won' },
    ],
    social: {
      linkedin: '#',
    },
  },
  {
    name: 'Emily Rodriguez',
    role: 'VP of Product',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    initials: 'ER',
    bio: 'Product visionary who scaled products to millions of users at Dropbox and Notion. Passionate about making complex technology accessible.',
    credentials: [
      { icon: Briefcase, text: 'Ex-Dropbox, Notion' },
      { icon: GraduationCap, text: 'Berkeley MBA' },
      { icon: Award, text: 'Product Hunt #1' },
    ],
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
];

const advisors = [
  { name: 'Dr. James Wright', role: 'Blockchain Advisor', company: 'Hedera Hashgraph' },
  { name: 'Lisa Park', role: 'Legal Advisor', company: 'Morrison & Foerster' },
  { name: 'Robert Kim', role: 'Growth Advisor', company: 'Former Stripe' },
];

export default function Team() {
  return (
    <section id="team" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Meet the Team</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Industry veterans building the future of intellectual property protection
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-effect-strong rounded-2xl p-6 border border-white/10 hover:border-primary-500/30 transition-all group"
            >
              {/* Photo */}
              <div className="relative mb-5">
                <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden ring-2 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all shadow-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl">${member.initials}</div>`;
                    }}
                  />
                </div>
                {/* Status indicator */}
                <div className="absolute bottom-1 right-1/2 translate-x-1/2 translate-y-1/2">
                  <span className="flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-black"></span>
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary-400 font-medium text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{member.bio}</p>

                {/* Credentials */}
                <div className="space-y-2 mb-4">
                  {member.credentials.map((cred, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <cred.icon className="w-3 h-3" />
                      <span>{cred.text}</span>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  {member.social.linkedin && (
                    <motion.a
                      href={member.social.linkedin}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-all"
                    >
                      <Linkedin className="w-4 h-4" />
                    </motion.a>
                  )}
                  {member.social.twitter && (
                    <motion.a
                      href={member.social.twitter}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-all"
                    >
                      <Twitter className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Advisors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-effect rounded-2xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Advisory Board</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advisors.map((advisor, index) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">{advisor.name}</div>
                  <div className="text-sm text-gray-400">{advisor.role}</div>
                  <div className="text-xs text-primary-400">{advisor.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '2023', label: 'Founded' },
            { value: '15+', label: 'Team Members' },
            { value: '$2.5M', label: 'Seed Funding' },
            { value: '3', label: 'Patents Pending' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="text-center p-4"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
