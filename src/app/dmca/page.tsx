'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, ArrowLeft } from 'lucide-react';

export default function DMCAPage() {
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
              <span className="gradient-text">DMCA Policy</span>
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
                  This Digital Millennium Copyright Act Policy ("DMCA Policy") describes the procedures by which BidayaX LLC, a Delaware limited liability company ("BidayaX," "Company," "we," "us," or "our"), responds to claims of copyright infringement on the Vaultheir platform and related services (the "Services").
                </p>
                <p className="mt-4">
                  BidayaX respects the intellectual property rights of others and expects users of our Services to do the same. In accordance with the Digital Millennium Copyright Act of 1998 (17 U.S.C. 512) ("DMCA"), we will respond expeditiously to notices of alleged copyright infringement that comply with the DMCA and other applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. NOTIFICATION OF CLAIMED INFRINGEMENT</h2>
                <p>
                  If you are a copyright owner, or an agent authorized to act on behalf of one, and you believe that copyrighted work has been copied, posted, or distributed via our Services in a way that constitutes copyright infringement, please submit a notification pursuant to the DMCA by providing our Designated Copyright Agent with the following information in writing:
                </p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Required Elements of a Valid DMCA Notice:</h3>
                <ol className="list-decimal pl-6 space-y-3 mt-3">
                  <li>
                    <strong>Signature:</strong> A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                  </li>
                  <li>
                    <strong>Identification of Copyrighted Work:</strong> Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site.
                  </li>
                  <li>
                    <strong>Identification of Infringing Material:</strong> Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material (e.g., specific URLs or file identifiers).
                  </li>
                  <li>
                    <strong>Contact Information:</strong> Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and, if available, an email address.
                  </li>
                  <li>
                    <strong>Good Faith Statement:</strong> A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                  </li>
                  <li>
                    <strong>Accuracy Statement:</strong> A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                  </li>
                </ol>

                <p className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <strong className="text-yellow-400">WARNING:</strong> Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages, including costs and attorneys' fees, incurred by the alleged infringer, by any copyright owner or copyright owner's authorized licensee, or by a service provider.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. DESIGNATED COPYRIGHT AGENT</h2>
                <p>DMCA notifications must be sent to our Designated Copyright Agent at:</p>
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p><strong>BidayaX LLC</strong></p>
                  <p>Attn: DMCA Copyright Agent</p>
                  <p>Email: <a href="mailto:support@bidayax.com" className="text-primary-400 hover:underline">support@bidayax.com</a></p>
                  <p>Subject Line: "DMCA Takedown Notice - [Your Name/Company]"</p>
                  <p className="mt-2">Delaware, United States</p>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  Please note that communications unrelated to DMCA notices may not receive a response if sent to this address.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. PROCESSING OF DMCA NOTICES</h2>
                <p>Upon receipt of a valid DMCA notification, we will:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Acknowledge receipt of the notification within 2 business days</li>
                  <li>Review the notification for compliance with DMCA requirements</li>
                  <li>If valid, expeditiously remove or disable access to the allegedly infringing material (typically within 24-72 hours)</li>
                  <li>Notify the user who uploaded the content that the material has been removed</li>
                  <li>Preserve copies of the notification and any removed content for our records</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. COUNTER-NOTIFICATION PROCEDURES</h2>
                <p>
                  If you believe that your content was removed or disabled by mistake or misidentification, you may submit a counter-notification to our Designated Copyright Agent containing the following:
                </p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Required Elements of a Valid Counter-Notification:</h3>
                <ol className="list-decimal pl-6 space-y-3 mt-3">
                  <li>
                    <strong>Signature:</strong> Your physical or electronic signature.
                  </li>
                  <li>
                    <strong>Identification of Material:</strong> Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or disabled.
                  </li>
                  <li>
                    <strong>Statement Under Penalty of Perjury:</strong> A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled.
                  </li>
                  <li>
                    <strong>Contact Information:</strong> Your name, address, and telephone number.
                  </li>
                  <li>
                    <strong>Consent to Jurisdiction:</strong> A statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or if you are outside the United States, for any judicial district in which we may be found), and that you will accept service of process from the person who provided the original DMCA notification or an agent of such person.
                  </li>
                </ol>

                <p className="mt-4 p-4 bg-white/5 rounded-lg">
                  <strong className="text-white">Processing Timeline:</strong> Upon receipt of a valid counter-notification, we will promptly forward a copy to the original complaining party. If the complaining party does not file a court action seeking to restrain the allegedly infringing activity within 10-14 business days, we may restore the removed material.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. REPEAT INFRINGER POLICY</h2>
                <p>
                  In accordance with the DMCA and other applicable laws, we have adopted a policy of terminating, in appropriate circumstances and at our sole discretion, users who are deemed to be repeat infringers.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><strong>First Offense:</strong> Written warning and removal of infringing content</li>
                  <li><strong>Second Offense:</strong> 30-day account suspension and removal of infringing content</li>
                  <li><strong>Third Offense:</strong> Permanent account termination without refund</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to terminate any account at any time for repeated or egregious infringement, even on a first offense for willful or commercial-scale infringement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. SPECIAL CONSIDERATIONS FOR BLOCKCHAIN RECORDS</h2>
                <p className="p-4 bg-white/5 rounded-lg">
                  <strong className="text-white">IMPORTANT NOTICE:</strong> Vaultheir records cryptographic hashes of content on the Hedera Hashgraph blockchain. These blockchain records are:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><strong>Immutable:</strong> Once recorded on the blockchain, transaction hashes cannot be modified or deleted.</li>
                  <li><strong>Non-Content:</strong> Blockchain records contain only cryptographic hashes (not the actual content). The hash alone does not reveal or reproduce the original content.</li>
                  <li><strong>Removable from Platform:</strong> While blockchain records are permanent, we can remove the associated content and metadata from our platform.</li>
                </ul>
                <p className="mt-4">
                  Upon a valid DMCA takedown, we will: (1) remove the infringing content from our servers, (2) disable access to associated certificates and metadata, and (3) mark the blockchain record as subject to a DMCA claim in our internal records.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. SUBPOENAS AND LAW ENFORCEMENT</h2>
                <p>
                  We may disclose user information in response to valid subpoenas, court orders, or other legal processes. We may also disclose information when we have a good faith belief that disclosure is necessary to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Comply with applicable law or legal process</li>
                  <li>Protect the rights, property, or safety of BidayaX, our users, or the public</li>
                  <li>Detect, prevent, or address fraud, security, or technical issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. PRESERVATION REQUESTS</h2>
                <p>
                  If you are a copyright owner or law enforcement authority investigating potential infringement, you may submit a preservation request to preserve relevant evidence. Preservation requests should be sent to our Designated Copyright Agent and include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Identification of the user account or content to be preserved</li>
                  <li>The legal basis for the preservation request</li>
                  <li>Contact information for follow-up</li>
                </ul>
                <p className="mt-4">
                  We will preserve identified materials for 90 days, renewable upon request, pending receipt of formal legal process.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. INTERNATIONAL CONSIDERATIONS</h2>
                <p>
                  While this policy is based on the U.S. DMCA, we also comply with equivalent copyright laws in other jurisdictions, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>European Union Copyright Directive (EU 2019/790)</li>
                  <li>UK Copyright, Designs and Patents Act 1988</li>
                  <li>Canadian Copyright Act</li>
                  <li>Australian Copyright Act 1968</li>
                </ul>
                <p className="mt-4">
                  International copyright holders may submit takedown requests following similar procedures, identifying the applicable legal framework.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. MODIFICATIONS TO THIS POLICY</h2>
                <p>
                  We reserve the right to modify this DMCA Policy at any time. Changes will be effective immediately upon posting. Your continued use of the Services after any changes indicates your acceptance of the modified policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. CONTACT INFORMATION</h2>
                <p>For questions about this DMCA Policy:</p>
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p><strong>BidayaX LLC</strong></p>
                  <p>Attn: DMCA Copyright Agent</p>
                  <p>Email: <a href="mailto:support@bidayax.com" className="text-primary-400 hover:underline">support@bidayax.com</a></p>
                  <p>Delaware, United States</p>
                </div>
              </section>

              <section className="border-t border-white/10 pt-8">
                <p className="text-sm text-gray-500">
                  This DMCA Policy is provided in English. In the event of any conflict between the English version and any translation, the English version shall prevail.
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
