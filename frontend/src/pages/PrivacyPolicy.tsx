import Navbar from "@/components/Navbar";
import { LegalPageSkeleton } from "@/components/LoadingSkeleton";
import { useState, useEffect } from "react";

const sections = [
  { title: "Information We Collect", content: "We collect information you provide when creating an account (name, email, university, branch), resources you upload, and usage data such as pages visited and search queries. We do not sell your personal information." },
  { title: "How We Use Your Information", content: "Your information is used to provide and improve our services, personalize your experience, display your profile on the scoreboard, and communicate important updates. Uploaded resources are shared publicly with proper attribution." },
  { title: "Data Sharing", content: "We do not share your personal data with third parties for marketing. We may share anonymized, aggregated data for analytics. Your uploaded study materials are publicly accessible on the platform." },
  { title: "Data Security", content: "We use industry-standard security measures to protect your data, including encryption in transit and at rest. However, no method of electronic storage is 100% secure." },
  { title: "Your Rights", content: "You can access, update, or delete your account and personal data at any time through your profile settings. You can also request removal of uploaded resources by contacting us." },
  { title: "Cookies", content: "We use essential cookies for authentication and preferences. We may use analytics cookies to understand usage patterns. You can control cookie settings in your browser." },
  { title: "Changes to This Policy", content: "We may update this privacy policy from time to time. We will notify you of significant changes via email or a notice on our platform." },
  { title: "Contact Us", content: "If you have questions about this privacy policy, contact us at privacy@uninotes.in." },
];

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LegalPageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border gradient-hero py-16">
        <div className="container text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: March 1, 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl space-y-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-lg font-semibold text-foreground mb-2">{i + 1}. {s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
};

export default PrivacyPolicy;
