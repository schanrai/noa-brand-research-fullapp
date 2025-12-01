import type { Metadata } from "next"
import LoginNavigation from "@/components/login-navigation"

export const metadata: Metadata = {
  title: "Privacy Policy | Scova",
  description: "Privacy Policy for Scova Brand Research Tool",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LoginNavigation />
      
      <div className="flex flex-1 flex-col bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <h1 className="mb-8 text-2xl font-bold tracking-tight">Privacy Policy</h1>
          
          <div className="prose max-w-none space-y-8 text-sm">
            <p className="text-muted-foreground">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-lg font-semibold mb-4">1. Information Collection</h2>
              <p className="mb-4">
                We collect information that you provide directly to us when you use our brand research and discovery platform. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Personal identification information (name, email address, job title)</li>
                <li>Account credentials and authentication information</li>
                <li>Company information and business details</li>
                <li>Research queries and search history</li>
                <li>Communication preferences and feedback</li>
                <li>Payment and billing information (processed through secure third-party providers)</li>
              </ul>
              <p>
                We also automatically collect certain information when you visit our website, including your IP address, browser type, device information, and usage patterns through cookies and similar tracking technologies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">2. Use of Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Provide, maintain, and improve our brand research services</li>
                <li>Process your requests and deliver research results</li>
                <li>Send you service-related communications and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our terms of service</li>
                <li>Send you marketing communications (with your consent, where required)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">3. Data Protection and Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure data storage and backup procedures</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies are small data files stored on your device that help us:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve our services and user experience</li>
                <li>Provide personalized content and features</li>
              </ul>
              <p>
                You can control cookie preferences through your browser settings. However, disabling cookies may limit your ability to use certain features of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">5. Information Sharing and Disclosure</h2>
              <p className="mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., hosting, analytics, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of our users</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">6. Third-Party Links</h2>
              <p>
                Our platform may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">7. Your Rights and Choices</h2>
              <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided in the &ldquo;Contact Us&rdquo; section below.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">8. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">9. Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our services, you consent to the transfer of your information to these countries.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on this page and updating the &ldquo;Last Updated&rdquo; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">12. Contact Us</h2>
              <p className="mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> help@scova.io</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              <a href="/terms" className="text-blue-600 underline hover:text-blue-800 hover:no-underline transition-colors">
                Terms of Service
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

