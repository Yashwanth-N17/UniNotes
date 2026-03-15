import Navbar from "@/components/Navbar";
import { LegalPageSkeleton } from "@/components/LoadingSkeleton";
import { useState, useEffect } from "react";

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using UniNotes, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform." },
  { title: "User Accounts", content: "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and all activities under it. You must be at least 16 years old to use our services." },
  { title: "Content Guidelines", content: "You may only upload study materials that you have the right to share. Do not upload copyrighted textbooks, proprietary content, or materials that violate academic integrity policies. We reserve the right to remove content that violates these guidelines." },
  { title: "Acceptable Use", content: "You agree not to: upload malicious content, impersonate others, spam or harass users, attempt to gain unauthorized access, or use the platform for commercial purposes without permission." },
  { title: "Intellectual Property", content: "You retain ownership of content you upload. By uploading, you grant UniNotes a non-exclusive, worldwide license to display and distribute your content on the platform. Other users may download and use your materials for personal educational purposes." },
  { title: "Disclaimer", content: "UniNotes is a platform for sharing student-created study materials. We do not guarantee the accuracy, completeness, or quality of uploaded content. Use materials at your own discretion." },
  { title: "Limitation of Liability", content: "UniNotes shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or reliance on uploaded content." },
  { title: "Termination", content: "We may suspend or terminate accounts that violate these terms. You may delete your account at any time through your profile settings." },
  { title: "Changes to Terms", content: "We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms." },
  { title: "Contact", content: "For questions about these terms, contact us at legal@uninotes.in." },
];

const TermsOfService = () => {
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
            Terms of <span className="text-gradient">Service</span>
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

export default TermsOfService;
