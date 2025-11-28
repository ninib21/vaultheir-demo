'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary-500/30 mb-6">
              <Shield className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-400 font-medium">Legal Document</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Privacy Policy</span>
            </h1>
            <p className="text-gray-400">
              Effective Date: November 25, 2024 | Last Updated: November 25, 2024
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="prose prose-invert max-w-none"
          >
            <div className="glass-effect rounded-2xl p-8 mb-8 border border-white/10 space-y-8 text-gray-300 leading-relaxed">
              <section>
                <p className="text-lg">
                  This Privacy Policy ("Policy") describes how BidayaX LLC, a Delaware limited liability company ("BidayaX," "Company," "we," "us," or "our"), collects, uses, discloses, and protects information about users ("you" or "User") of the Vaultheir platform, website located at vaultheir.com, and related services (collectively, the "Services").
                </p>
                <p className="mt-4">
                  BY ACCESSING OR USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS PRIVACY POLICY. IF YOU DO NOT AGREE, PLEASE DO NOT ACCESS OR USE OUR SERVICES.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. INFORMATION WE COLLECT</h2>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">1.1 Information You Provide Directly</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> When you register, we collect your name, email address, phone number (optional), and encrypted password.</li>
                  <li><strong>Payment Information:</strong> Credit card details, billing address, and transaction history are processed through our PCI-DSS compliant payment processor (Stripe, Inc.) and are not stored on our servers.</li>
                  <li><strong>Documents and Content:</strong> Files you upload for notarization are encrypted client-side before transmission using AES-256-GCM encryption.</li>
                  <li><strong>Communications:</strong> Emails, support requests, and feedback you send to us.</li>
                  <li><strong>Identity Verification:</strong> If required, government-issued identification documents for enhanced verification.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">1.2 Information Collected Automatically</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers.</li>
                  <li><strong>Usage Data:</strong> Pages visited, features used, timestamps, referring URLs.</li>
                  <li><strong>Cookies and Tracking:</strong> Essential cookies for functionality and analytics cookies (with consent).</li>
                  <li><strong>Log Data:</strong> Server logs including access times, error reports, and system activity.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">1.3 Information from Third Parties</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Identity verification services</li>
                  <li>Fraud prevention providers</li>
                  <li>Social login providers (if you choose to authenticate via Google, etc.)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. HOW WE USE YOUR INFORMATION</h2>
                <p>We process your information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><strong>Service Delivery:</strong> To provide, maintain, and improve our IP notarization services.</li>
                  <li><strong>Blockchain Recording:</strong> To create cryptographic hashes of your documents and record them on the Hedera Hashgraph distributed ledger.</li>
                  <li><strong>Account Management:</strong> To create and manage your account, process transactions, and provide customer support.</li>
                  <li><strong>Security:</strong> To detect, prevent, and respond to fraud, abuse, or security incidents.</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
                  <li><strong>Communications:</strong> To send transactional emails, security alerts, and (with consent) marketing communications.</li>
                  <li><strong>Analytics:</strong> To understand usage patterns and improve our Services.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. LEGAL BASIS FOR PROCESSING (GDPR)</h2>
                <p>For users in the European Economic Area (EEA), UK, and Switzerland, we process personal data based on:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><strong>Contract Performance:</strong> Processing necessary to provide our Services.</li>
                  <li><strong>Legitimate Interests:</strong> Security, fraud prevention, service improvement.</li>
                  <li><strong>Legal Obligation:</strong> Compliance with applicable laws.</li>
                  <li><strong>Consent:</strong> Where required, such as for marketing communications.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. DATA SHARING AND DISCLOSURE</h2>
                <p className="font-semibold text-white">We do not sell your personal information.</p>
                <p className="mt-3">We may share information with:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><strong>Service Providers:</strong> Cloud hosting (AWS/Google Cloud), payment processing (Stripe), email services, analytics providers, under strict confidentiality agreements.</li>
                  <li><strong>Blockchain Networks:</strong> Cryptographic hashes (not content) are recorded on Hedera Hashgraph for notarization purposes.</li>
                  <li><strong>Legal Requirements:</strong> When required by law, subpoena, court order, or government request.</li>
                  <li><strong>Business Transfers:</strong> In connection with merger, acquisition, or sale of assets, with notice to you.</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize disclosure.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. DATA SECURITY</h2>
                <p>We implement industry-standard security measures:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>AES-256-GCM encryption for data at rest and in transit</li>
                  <li>TLS 1.3 for all communications</li>
                  <li>Zero-knowledge architecture for document storage</li>
                  <li>Multi-factor authentication options</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>SOC 2 Type II compliant infrastructure</li>
                  <li>Employee access controls and training</li>
                </ul>
                <p className="mt-3 text-yellow-400/80">
                  No method of transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. DATA RETENTION</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Data:</strong> Retained while your account is active and for 7 years after deletion for legal compliance.</li>
                  <li><strong>Notarization Records:</strong> Blockchain records are permanent and immutable by design.</li>
                  <li><strong>Encrypted Documents:</strong> Retained according to your subscription plan; deleted upon request or account termination.</li>
                  <li><strong>Log Data:</strong> Retained for up to 24 months for security and operational purposes.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. YOUR RIGHTS AND CHOICES</h2>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.1 All Users</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your account information</li>
                  <li>Delete your account (subject to legal retention requirements)</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Manage cookie preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.2 EEA, UK, and Swiss Users (GDPR)</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right of access (Article 15)</li>
                  <li>Right to rectification (Article 16)</li>
                  <li>Right to erasure ("right to be forgotten") (Article 17)</li>
                  <li>Right to restriction of processing (Article 18)</li>
                  <li>Right to data portability (Article 20)</li>
                  <li>Right to object (Article 21)</li>
                  <li>Right to withdraw consent</li>
                  <li>Right to lodge a complaint with a supervisory authority</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.3 California Residents (CCPA/CPRA)</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of sale (we do not sell personal information)</li>
                  <li>Right to non-discrimination</li>
                  <li>Right to correct inaccurate information</li>
                  <li>Right to limit use of sensitive personal information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. INTERNATIONAL DATA TRANSFERS</h2>
                <p>
                  Your information may be transferred to and processed in the United States and other countries where our service providers operate. For transfers from the EEA, UK, or Switzerland, we rely on:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                  <li>Data Processing Agreements with appropriate safeguards</li>
                  <li>Adequacy decisions where applicable</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. CHILDREN'S PRIVACY</h2>
                <p>
                  Our Services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will delete it promptly. If you believe a child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. THIRD-PARTY LINKS</h2>
                <p>
                  Our Services may contain links to third-party websites or services. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. CHANGES TO THIS POLICY</h2>
                <p>
                  We may update this Privacy Policy periodically. We will notify you of material changes by posting the new policy on our website and updating the "Last Updated" date. For significant changes, we will provide additional notice via email or in-app notification. Your continued use of our Services after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. CONTACT US</h2>
                <p>For privacy-related inquiries, data subject requests, or complaints:</p>
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p><strong>BidayaX LLC</strong></p>
                  <p>Attn: Privacy Officer</p>
                  <p>Email: <a href="mailto:support@bidayax.com" className="text-primary-400 hover:underline">support@bidayax.com</a></p>
                  <p>Delaware, United States</p>
                </div>
                <p className="mt-4">
                  We will respond to your request within 30 days (or sooner as required by applicable law).
                </p>
              </section>

              <section className="border-t border-white/10 pt-8">
                <p className="text-sm text-gray-500">
                  This Privacy Policy is provided in English. In the event of any conflict between the English version and any translation, the English version shall prevail.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Copyright 2024 BidayaX LLC. All rights reserved. Vaultheir is a trademark of BidayaX LLC.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
