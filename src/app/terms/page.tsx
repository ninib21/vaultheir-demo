'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
              <FileText className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-400 font-medium">Legal Document</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Terms of Service</span>
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
                  These Terms of Service ("Terms," "Agreement") constitute a legally binding agreement between you ("User," "you," or "your") and BidayaX LLC, a Delaware limited liability company ("BidayaX," "Company," "we," "us," or "our"), governing your access to and use of the Vaultheir platform, website located at vaultheir.com, mobile applications, and all related services (collectively, the "Services").
                </p>
                <p className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <strong className="text-yellow-400">IMPORTANT:</strong> PLEASE READ THESE TERMS CAREFULLY BEFORE USING OUR SERVICES. BY ACCESSING OR USING THE SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS AND OUR PRIVACY POLICY. IF YOU DO NOT AGREE TO ALL TERMS, DO NOT USE THE SERVICES.
                </p>
                <p className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <strong className="text-red-400">ARBITRATION NOTICE:</strong> THESE TERMS CONTAIN A BINDING ARBITRATION CLAUSE AND CLASS ACTION WAIVER IN SECTION 15. PLEASE READ CAREFULLY.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. DEFINITIONS</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>"Content"</strong> means any text, graphics, images, documents, files, or other materials uploaded, submitted, or transmitted through the Services.</li>
                  <li><strong>"Intellectual Property" or "IP"</strong> means patents, copyrights, trademarks, trade secrets, and other proprietary rights.</li>
                  <li><strong>"Notarization"</strong> means the process of creating a cryptographic hash of Content and recording it on a distributed ledger.</li>
                  <li><strong>"User Account"</strong> means an account created by a User to access the Services.</li>
                  <li><strong>"Subscription"</strong> means a paid plan providing access to premium features.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. ELIGIBILITY AND ACCOUNT REGISTRATION</h2>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Eligibility</h3>
                <p>You must be at least 18 years old and have the legal capacity to enter into a binding agreement. If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization to these Terms.</p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Account Registration</h3>
                <p>To access certain features, you must create a User Account. You agree to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3 Account Termination</h3>
                <p>We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or any reason at our sole discretion, with or without notice.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. SERVICES DESCRIPTION</h2>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 IP Notarization Services</h3>
                <p>Vaultheir provides blockchain-based timestamping and notarization services for digital content using the Hedera Hashgraph distributed ledger. Our Services:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Create cryptographic hashes (SHA-256) of your Content</li>
                  <li>Record these hashes on the Hedera Hashgraph public ledger</li>
                  <li>Provide certificates of notarization with transaction IDs</li>
                  <li>Offer secure encrypted storage for your documents</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2 Service Limitations</h3>
                <p className="p-4 bg-white/5 rounded-lg">
                  <strong className="text-white">IMPORTANT DISCLAIMER:</strong> Vaultheir provides PROOF OF EXISTENCE at a specific point in time. Our Services do NOT constitute:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Legal notarization by a commissioned notary public</li>
                  <li>Registration with any government intellectual property office</li>
                  <li>Legal advice or opinions on IP ownership or validity</li>
                  <li>Guarantee of copyright, patent, or trademark protection</li>
                  <li>Evidence admissible in all courts (jurisdiction-dependent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. USER CONTENT AND INTELLECTUAL PROPERTY</h2>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1 Your Content</h3>
                <p>You retain all ownership rights to Content you upload. By using our Services, you grant us a limited, non-exclusive license to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Process and hash your Content for notarization purposes</li>
                  <li>Store encrypted copies as part of the Services</li>
                  <li>Display Content to you within your account</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.2 Content Warranties</h3>
                <p>You represent and warrant that:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>You own or have rights to the Content you upload</li>
                  <li>Your Content does not infringe any third-party rights</li>
                  <li>Your Content complies with all applicable laws</li>
                  <li>Your Content does not contain malware or harmful code</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.3 Our Intellectual Property</h3>
                <p>The Services, including but not limited to the Vaultheir name, logo, website design, software, algorithms, and documentation, are owned by BidayaX LLC and protected by intellectual property laws. You may not:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Copy, modify, or distribute our proprietary materials</li>
                  <li>Reverse engineer or decompile our software</li>
                  <li>Use our trademarks without written permission</li>
                  <li>Create derivative works based on our Services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. PROHIBITED USES</h2>
                <p>You agree NOT to use the Services to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Upload illegal, fraudulent, or infringing content</li>
                  <li>Falsely claim ownership of others' intellectual property</li>
                  <li>Attempt to circumvent security measures</li>
                  <li>Interfere with or disrupt the Services</li>
                  <li>Use automated systems (bots, scrapers) without permission</li>
                  <li>Resell or redistribute the Services without authorization</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Upload content containing child exploitation material</li>
                  <li>Engage in money laundering or terrorist financing</li>
                  <li>Harass, threaten, or harm others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. FEES AND PAYMENT</h2>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.1 Subscription Plans</h3>
                <p>Certain features require a paid Subscription. Current pricing is available at vaultheir.com/pricing. Fees are subject to change with 30 days notice.</p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.2 Billing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>You authorize us to charge your payment method automatically</li>
                  <li>Failed payments may result in service suspension</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.3 Free Trial</h3>
                <p>Pro and Enterprise plans include a 7-day free trial. You may cancel before the trial ends to avoid charges. Only one free trial per user.</p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.4 Cancellation</h3>
                <p>You may cancel your Subscription at any time. Cancellation takes effect at the end of the current billing period. No partial refunds are provided.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. DISCLAIMERS OF WARRANTIES</h2>
                <p className="p-4 bg-white/5 rounded-lg uppercase">
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND TITLE.
                </p>
                <p className="mt-4">WE DO NOT WARRANT THAT:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>The Services will be uninterrupted, error-free, or secure</li>
                  <li>Defects will be corrected</li>
                  <li>Notarization records will be accepted as evidence in any legal proceeding</li>
                  <li>The Services will meet your specific requirements</li>
                  <li>Blockchain records will remain accessible indefinitely</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. LIMITATION OF LIABILITY</h2>
                <p className="p-4 bg-white/5 rounded-lg uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, BIDAYAX LLC AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Your use or inability to use the Services</li>
                  <li>Unauthorized access to your data</li>
                  <li>Any third-party conduct on the Services</li>
                  <li>Loss or corruption of your Content</li>
                  <li>Blockchain network failures or delays</li>
                </ul>
                <p className="mt-4 p-4 bg-white/5 rounded-lg">
                  <strong className="text-white">MAXIMUM LIABILITY:</strong> Our total liability shall not exceed the greater of (a) the fees you paid in the 12 months preceding the claim, or (b) $100 USD.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. INDEMNIFICATION</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless BidayaX LLC and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Your use of the Services</li>
                  <li>Your Content</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Your violation of any applicable law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. DMCA AND COPYRIGHT POLICY</h2>
                <p>
                  We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). See our separate <a href="/dmca" className="text-primary-400 hover:underline">DMCA Policy</a> for details on reporting infringement and our counter-notification procedures.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. PRIVACY</h2>
                <p>
                  Your use of the Services is governed by our <a href="/privacy" className="text-primary-400 hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. MODIFICATIONS TO SERVICES AND TERMS</h2>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">12.1 Service Modifications</h3>
                <p>We reserve the right to modify, suspend, or discontinue any part of the Services at any time with or without notice.</p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">12.2 Terms Modifications</h3>
                <p>We may update these Terms at any time. Material changes will be notified via email or in-app notice at least 30 days before taking effect. Continued use after changes constitutes acceptance.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. TERMINATION</h2>
                <p>Either party may terminate this Agreement at any time. Upon termination:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Your right to access the Services immediately ceases</li>
                  <li>We may delete your Content after a 30-day grace period</li>
                  <li>Blockchain records remain permanent and cannot be deleted</li>
                  <li>Provisions that should survive termination shall survive</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">14. GOVERNING LAW AND JURISDICTION</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles. Subject to the arbitration provisions below, any disputes shall be resolved in the state or federal courts located in Delaware.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">15. DISPUTE RESOLUTION AND ARBITRATION</h2>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">15.1 Informal Resolution</h3>
                <p>Before initiating formal proceedings, you agree to contact us at support@bidayax.com and attempt to resolve disputes informally for at least 30 days.</p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">15.2 Binding Arbitration</h3>
                <p className="p-4 bg-white/5 rounded-lg">
                  Any dispute not resolved informally shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. Arbitration shall be conducted in Delaware, USA, or via telephone/video at your option.
                </p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">15.3 Class Action Waiver</h3>
                <p className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <strong className="text-red-400">YOU AGREE THAT ANY CLAIMS WILL BE BROUGHT IN YOUR INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, OR REPRESENTATIVE PROCEEDING.</strong>
                </p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">15.4 Exceptions</h3>
                <p>This arbitration agreement does not apply to: (a) claims in small claims court; (b) claims for injunctive relief for IP infringement; (c) claims that cannot be arbitrated under applicable law.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">16. GENERAL PROVISIONS</h2>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.1 Entire Agreement</h3>
                <p>These Terms, together with the Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and BidayaX LLC.</p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.2 Severability</h3>
                <p>If any provision is found unenforceable, the remaining provisions shall continue in effect.</p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.3 Waiver</h3>
                <p>Our failure to enforce any right or provision shall not constitute a waiver.</p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.4 Assignment</h3>
                <p>You may not assign your rights under these Terms without our written consent. We may assign our rights freely.</p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">16.5 Force Majeure</h3>
                <p>We shall not be liable for failures due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, pandemics, or infrastructure failures.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">17. CONTACT INFORMATION</h2>
                <p>For questions about these Terms:</p>
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p><strong>BidayaX LLC</strong></p>
                  <p>Attn: Legal Department</p>
                  <p>Email: <a href="mailto:support@bidayax.com" className="text-primary-400 hover:underline">support@bidayax.com</a></p>
                  <p>Delaware, United States</p>
                </div>
              </section>

              <section className="border-t border-white/10 pt-8">
                <p className="text-sm text-gray-500">
                  By using Vaultheir, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
