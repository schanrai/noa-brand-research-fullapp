import type { Metadata } from "next"
import LoginNavigation from "@/components/login-navigation"

export const metadata: Metadata = {
  title: "Terms of Service | Scova",
  description: "Terms of Service for Scova Brand Research Tool",
}

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LoginNavigation />
      
      <div className="flex flex-1 flex-col bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-muted-foreground">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Scova Brand Research Tool ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access or use the Service. These Terms apply to all users, including visitors, registered users, and subscribers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
              <p className="mb-4">
                Scova provides a platform for brand research, discovery, and analysis. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Brand research and discovery capabilities</li>
                <li>Company profile generation and analysis</li>
                <li>Market intelligence and insights</li>
                <li>Data export and reporting features</li>
                <li>CRM integration capabilities</li>
                <li>User account management and authentication</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
              <p className="mb-4">To access certain features of the Service, you must register for an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information to keep it accurate</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access or security breach</li>
              </ul>
              <p>
                You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
              <p className="mb-4">You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Transmit any malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Reproduce, duplicate, copy, or resell any portion of the Service</li>
                <li>Use the Service for any commercial purpose without our express written consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
              <p className="mb-4">
                Certain features of the Service may require payment. If you purchase a subscription or paid service:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>You agree to pay all fees associated with your subscription</li>
                <li>Fees are billed in advance on a recurring basis (monthly or annually)</li>
                <li>All fees are non-refundable except as required by law or as explicitly stated</li>
                <li>We reserve the right to change our pricing with 30 days' notice</li>
                <li>Late payments may result in suspension or termination of your account</li>
                <li>You are responsible for any taxes applicable to your use of the Service</li>
              </ul>
              <p>
                We may suspend or terminate your access to paid features if payment is not received by the due date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
              <p className="mb-4">
                The Service and its original content, features, and functionality are owned by Scova and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="mb-4">
                You retain ownership of any content you submit, post, or display through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content solely for the purpose of providing and improving the Service.
              </p>
              <p>
                You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may you reverse engineer or attempt to extract the source code of that software.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data and Content</h2>
              <p className="mb-4">
                You are responsible for the accuracy and legality of any data or content you provide through the Service. We do not claim ownership of your data, but you grant us the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Store and process your data to provide the Service</li>
                <li>Use aggregated and anonymized data for analytics and service improvement</li>
                <li>Comply with legal obligations and enforce these Terms</li>
              </ul>
              <p>
                We reserve the right to remove any content that violates these Terms or is otherwise objectionable, at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Service Availability and Modifications</h2>
              <p>
                We strive to provide reliable and continuous access to the Service, but we do not guarantee uninterrupted or error-free operation. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services and Integrations</h2>
              <p className="mb-4">
                The Service may integrate with third-party services, including CRM systems, authentication providers, and other tools. Your use of third-party services is subject to their respective terms and conditions. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>The availability or performance of third-party services</li>
                <li>The content, accuracy, or practices of third-party services</li>
                <li>Any issues arising from your use of third-party integrations</li>
              </ul>
              <p>
                You are responsible for granting necessary access permissions and complying with third-party service terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Disclaimers and Warranties</h2>
              <p className="mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT</li>
                <li>WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE</li>
                <li>WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF INFORMATION PROVIDED</li>
              </ul>
              <p>
                We do not guarantee specific results from your use of the Service. Research data and insights are provided for informational purposes only and should not be considered as professional advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SCOVA, ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                <li>LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES</li>
                <li>DAMAGES RESULTING FROM YOUR USE OR INABILITY TO USE THE SERVICE</li>
              </ul>
              <p>
                Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim, or $100, whichever is greater.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Scova and its affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, violation of these Terms, or infringement of any rights of another party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Termination</h2>
              <p className="mb-4">We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Non-payment of fees (for paid accounts)</li>
                <li>Extended periods of account inactivity</li>
              </ul>
              <p>
                You may terminate your account at any time by contacting us or using account deletion features. Upon termination, your right to use the Service will cease immediately, and we may delete your account data in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Force Majeure</h2>
              <p>
                We shall not be liable for any failure or delay in performance under these Terms resulting from circumstances beyond our reasonable control, including natural disasters, war, terrorism, labor disputes, government actions, internet failures, or other force majeure events.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Governing Law and Dispute Resolution</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from or relating to these Terms or the Service shall be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization], except where prohibited by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of the Service after such changes constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">17. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">18. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Scova regarding the Service and supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">19. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> help@scova.io</p>
                <p className="mb-2"><strong>Address:</strong> [Your Company Address]</p>
                <p><strong>Phone:</strong> [Your Contact Phone Number]</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              <a href="/privacy" className="text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors">
                Privacy Policy
              </a>
              {' • '}
              <a href="/login" className="text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors">
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

