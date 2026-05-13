import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Terms of Service - PixelLift AI",
  description: "Terms of Service for PixelLift AI.",
};

const sections = [
  {
    title: "1. About PixelLift AI",
    body: [
      "PixelLift AI is an AI-powered image enhancement web application and AI blog platform. It allows users to upload images, enhance them using AI, preview before-and-after results, download enhanced images, create accounts, view enhancement history, and read AI-related tutorials or blog content.",
      "According to the current project version, PixelLift AI supports image enhancement features such as 2x upscale, 4x upscale, denoise, and sharpen. The service processes images using Replicate API and the Real-ESRGAN model.",
    ],
  },
  {
    title: "2. Eligibility",
    bullets: [
      "You are at least 13 years old.",
      "You are not prohibited from using the service under applicable law.",
      "You will follow these Terms and all applicable laws.",
      "Any information you provide is accurate and not misleading.",
    ],
  },
  {
    title: "3. User Accounts",
    body: [
      "Some features may require an account. PixelLift AI may allow users to register and log in using email and password or Google OAuth login.",
      "You are responsible for keeping your login credentials secure, all activity under your account, notifying us of unauthorized access, and providing accurate account information.",
    ],
  },
  {
    title: "4. Image Upload and Processing",
    body: [
      "PixelLift AI allows users to upload images for AI enhancement.",
    ],
    bullets: [
      "Supported file formats are JPG, JPEG, PNG, and WEBP.",
      "The maximum file size is 5MB.",
      "We may validate the file type and file size.",
      "We may check whether you have remaining daily usage.",
      "We may send the image to Replicate API for enhancement.",
      "We may return an enhanced image URL and store enhancement history if you are logged in.",
    ],
  },
  {
    title: "5. Your Rights to Uploaded Images",
    body: [
      "You retain ownership of images you upload to PixelLift AI.",
      "By uploading an image, you grant PixelLift AI a limited, temporary, non-exclusive, worldwide license to process, transmit, store, display, and return the image only as necessary to provide the service.",
    ],
  },
  {
    title: "6. User Responsibility for Uploaded Content",
    bullets: [
      "You do not own or have permission to use.",
      "Violate copyright, trademark, privacy, publicity, or other rights.",
      "Contain illegal material.",
      "Contain malware, hidden scripts, or harmful files.",
      "Are abusive, exploitative, harassing, hateful, or threatening.",
      "Involve child sexual abuse material or exploitation.",
      "Violate another person’s privacy.",
      "Are used for fraud, impersonation, deception, or illegal activity.",
    ],
  },
  {
    title: "7. AI Output Disclaimer",
    bullets: [
      "Enhanced images may contain visual errors.",
      "AI processing may alter details.",
      "Results may vary depending on image quality.",
      "Face or object details may be sharpened or modified inaccurately.",
      "We do not guarantee professional-grade results.",
      "You must review all outputs before using them publicly or commercially.",
    ],
  },
  {
    title: "8. Usage Limits",
    body: [
      "PixelLift AI includes daily usage limits. Anonymous users receive 3 image enhancements per day, registered users receive 10 image enhancements per day, and usage limits reset at midnight UTC.",
      "You must not attempt to bypass usage limits by creating fake accounts, using VPNs or proxies, manipulating cookies or sessions, exploiting bugs, or sharing accounts to avoid restrictions.",
    ],
  },
  {
    title: "9. Free Service and No Paid Plans in Version 1.0",
    body: [
      "PixelLift AI is currently designed as a free image enhancement service with usage limits. We do not currently offer paid subscriptions, process payment card details, or provide paid credits or premium plans.",
    ],
  },
  {
    title: "10. Blog Content",
    body: [
      "PixelLift AI includes a blog and content platform with AI tutorials and image editing content. Blog content is provided for general informational and educational purposes only.",
    ],
  },
  {
    title: "11. Advertising",
    body: [
      "PixelLift AI may display advertisements through Google AdSense on blog pages. Ads are intended for blog pages and not for tool pages.",
    ],
  },
  {
    title: "12. Prohibited Uses",
    bullets: [
      "Break any law or regulation.",
      "Upload illegal, harmful, abusive, or infringing content.",
      "Violate intellectual property rights.",
      "Impersonate another person.",
      "Generate deceptive, fraudulent, or misleading content.",
      "Harass, threaten, or harm others.",
      "Upload malware or harmful files.",
      "Attempt to reverse engineer the service.",
      "Scrape, crawl, or automate use without permission.",
      "Attack, overload, or disrupt the service.",
      "Bypass usage limits.",
      "Access another user’s account or data.",
    ],
  },
  {
    title: "13. Security Rules",
    body: [
      "PixelLift AI applies security controls to protect the service and users. You must not attempt to interfere with these protections or access secret keys, private APIs, database records, internal logs, or another user’s data.",
    ],
  },
  {
    title: "14. Third-Party Services",
    bullets: [
      "Vercel for hosting and serverless functions.",
      "Supabase for authentication, database, usage logs, and user profiles.",
      "Replicate API for AI image processing.",
      "Google OAuth for login.",
      "Google AdSense for blog ads.",
    ],
  },
  {
    title: "15. Service Availability",
    body: [
      "PixelLift AI is provided on an as available basis. We do not guarantee that the service will always be available, image processing will always succeed, download links will remain available forever, or the service will be free from bugs or interruptions.",
    ],
  },
  {
    title: "16. Temporary Image URLs",
    body: [
      "Enhanced image URLs may be temporary. You should download enhanced images promptly after processing. We are not responsible if a temporary image URL expires or becomes unavailable later.",
    ],
  },
  {
    title: "17. Enhancement History",
    body: [
      "Logged-in users may have access to enhancement history through the dashboard. Enhancement history is provided for convenience only, and we do not guarantee permanent storage of original or enhanced images.",
    ],
  },
  {
    title: "18. Intellectual Property",
    body: [
      "PixelLift AI, including its website design, software, interface, branding, logo, text, blog content, code, features, and visual elements, is owned by PixelLift AI or its licensors.",
    ],
  },
  {
    title: "19. Feedback",
    body: [
      "If you send us suggestions, bug reports, ideas, feature requests, or other feedback, you grant us permission to use that feedback without restriction or compensation.",
    ],
  },
  {
    title: "20. Account Suspension and Termination",
    body: [
      "We may suspend, restrict, or terminate your access to PixelLift AI if you violate these Terms, abuse usage limits, upload prohibited content, attempt to harm the service, infringe another person’s rights, or create legal, technical, or security risk.",
    ],
  },
  {
    title: "21. Disclaimer of Warranties",
    body: [
      "PixelLift AI is provided on an as is and as available basis. To the maximum extent permitted by law, we disclaim all warranties, including fitness for a particular purpose, merchantability, non-infringement, accuracy, reliability, availability, security, and error-free operation.",
    ],
  },
  {
    title: "22. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, PixelLift AI and its owners, developers, employees, contractors, partners, and service providers will not be liable for loss of data, lost profits, business interruption, reputation damage, failed image processing, temporary URL expiration, AI output errors, third-party service failures, or unauthorized access caused by your own negligence.",
    ],
  },
  {
    title: "23. Indemnification",
    body: [
      "You agree to defend, indemnify, and hold harmless PixelLift AI, its owners, developers, contractors, service providers, and affiliates from any claims, damages, losses, liabilities, costs, or expenses arising from your use of the service or your violation of these Terms.",
    ],
  },
  {
    title: "24. Copyright Complaints",
    body: [
      "If you believe that content on PixelLift AI infringes your copyright, contact us at [Support Email] and include your name, contact details, description of the copyrighted work, URL or location of the allegedly infringing content, a statement that you believe the use is unauthorized, a statement that the information you provide is accurate, and your physical or electronic signature.",
    ],
  },
  {
    title: "25. Privacy",
    body: [
      "Your use of PixelLift AI is also governed by our Privacy Policy.",
    ],
  },
  {
    title: "26. Changes to the Service",
    body: [
      "We may modify, suspend, or discontinue any part of PixelLift AI at any time, including enhancement modes, usage limits, account features, blog features, dashboard history, third-party integrations, free access, and advertising features.",
    ],
  },
  {
    title: "27. Changes to These Terms",
    body: [
      "We may update these Terms from time to time. When we update them, we will revise the Last Updated date. If changes are significant, we may provide additional notice through the website, email, or in-app notice.",
    ],
  },
  {
    title: "28. Governing Law",
    body: [
      "These Terms are governed by the laws of [Jurisdiction], without regard to conflict of law principles.",
      "Any disputes will be handled in the courts or dispute resolution forums located in [Jurisdiction], unless applicable law requires otherwise.",
    ],
  },
  {
    title: "29. Contact Information",
    body: [
      "PixelLift AI",
      "Company / Owner: [Company Name]",
      "Address: [Business Address]",
      "Jurisdiction: [Jurisdiction]",
      "Email: [Support Email]",
      "Website: [Website URL]",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="relative overflow-hidden bg-[#F8FAFC]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_42%)]" />
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Terms of Service</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Terms of Service for PixelLift AI
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Welcome to PixelLift AI. These Terms govern your access to and use of the website, image
            enhancement tool, user accounts, dashboard, blog, and related services.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-500">Effective Date: [Effective Date]</p>
            <p className="mt-1 text-sm text-slate-500">Last Updated: [Last Updated Date]</p>
          </div>
        </header>

        <div className="mt-12 space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8"
            >
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
                {section.body?.map((line) => <p key={line}>{line}</p>)}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
