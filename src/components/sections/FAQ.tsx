'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How does blockchain notarization protect my IP?',
    answer: 'When you upload a document, we create a cryptographic hash (digital fingerprint) and store it on the Hedera Hashgraph blockchain. This creates an immutable, timestamped proof that your intellectual property existed at that exact moment. This proof is legally admissible and cannot be altered or deleted.',
  },
  {
    question: 'What is Hedera Hashgraph and why do you use it?',
    answer: 'Hedera Hashgraph is an enterprise-grade public ledger known for its speed, security, and low cost. Unlike traditional blockchains, Hedera can process 10,000+ transactions per second with finality in 3-5 seconds. Each transaction costs approximately $0.001, making it ideal for IP notarization at scale.',
  },
  {
    question: 'Is my data stored on the blockchain?',
    answer: 'No. Only the cryptographic hash of your document is stored on the blockchain. Your actual files remain encrypted and stored securely in our private infrastructure. This ensures your sensitive IP is never exposed while still providing immutable proof of existence.',
  },
  {
    question: 'How much money can I save compared to traditional IP filing?',
    answer: 'Traditional patent filing can cost $10,000-$30,000+ per patent. Trademark registration typically costs $2,000-$5,000. With Vaultheir™, you can notarize unlimited IP assets starting at $4.99/month, potentially saving 95% or more while establishing provable creation dates.',
  },
  {
    question: 'What types of IP can I protect with Vaultheir™?',
    answer: 'You can protect virtually any type of intellectual property: patents, trademarks, copyrights, trade secrets, source code, designs, formulas, business plans, contracts, creative works, and more. If it\'s a digital file, we can notarize it.',
  },
  {
    question: 'Can blockchain notarization replace traditional patents?',
    answer: 'Blockchain notarization complements traditional IP protection. It provides immediate, low-cost proof of creation that can be crucial in disputes. For full legal protection, you may still want to pursue formal registration, but notarization gives you documented proof from day one.',
  },
  {
    question: 'What happens if VaultHeir goes out of business?',
    answer: 'Your blockchain proofs exist permanently on Hedera\'s public ledger, independent of our company. You\'ll always be able to verify your notarizations using the transaction IDs, even if VaultHeir ceases to exist. We also provide export tools to download all your records.',
  },
  {
    question: 'How do I prove ownership in a legal dispute?',
    answer: 'Each notarization creates a verifiable record including: the document hash, timestamp, and transaction ID. You can present this evidence in court, showing that your IP existed at the recorded time. We also provide official certificates and verification links for legal proceedings.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary-500/30 mb-6">
            <HelpCircle className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-primary-400 font-medium">Got Questions?</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about protecting your intellectual property with blockchain
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full glass-effect rounded-xl p-5 text-left transition-all border ${
                  openIndex === index
                    ? 'border-primary-500/50 shadow-lg shadow-primary-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 ${openIndex === index ? 'text-primary-400' : 'text-gray-400'}`} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-gray-400 leading-relaxed border-t border-white/10 pt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <motion.a
            href="mailto:support@bidayax.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-xl border border-primary-500/30 text-primary-400 font-semibold hover:border-primary-500/50 transition-all"
          >
            Contact Support
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
