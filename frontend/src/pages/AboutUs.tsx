import Navbar from "@/components/Navbar";
import { AboutUsSkeleton } from "@/components/LoadingSkeleton";

import { BookOpen, Users, Target, Heart } from "lucide-react";
import { useState, useEffect } from "react";

const AboutUs = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AboutUsSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border gradient-hero py-16">
        <div className="container text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            About <span className="text-gradient">UniNotes</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Built by students, for students — making quality education accessible to everyone.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                UniNotes was born from a simple frustration — finding quality study materials shouldn't be hard. We believe every student deserves access to the best notes, previous year questions, and study resources regardless of their university or background.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our platform connects students across 200+ universities, enabling them to share knowledge and help each other succeed in their academic journey.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, label: "50K+ Resources", desc: "Study materials shared" },
                { icon: Users, label: "10K+ Students", desc: "Active community members" },
                { icon: Target, label: "200+ Universities", desc: "Across India" },
                { icon: Heart, label: "100% Free", desc: "Always will be" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 text-center shadow-card">
                  <item.icon className="mx-auto h-8 w-8 text-secondary mb-2" />
                  <div className="font-display font-bold text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { title: "Open Knowledge", desc: "Education should be free and accessible. Every resource on UniNotes is shared freely by the community." },
                { title: "Quality First", desc: "Our rating and review system ensures only the best materials rise to the top, saving you time." },
                { title: "Community Driven", desc: "UniNotes is powered by students who believe in giving back. Upload, rate, and help others succeed." },
              ].map((v, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default AboutUs;
