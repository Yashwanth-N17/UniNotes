import Navbar from "@/components/Navbar";
import { ContactSkeleton } from "@/components/LoadingSkeleton";

import { Mail, MapPin, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { contactSchema } from "@/lib/validations";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse({ name, email, subject, message });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    toast({ title: "Message sent!", description: "We'll get back to you soon. (UI only)" });
    setTimeout(() => setSubmitting(false), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <ContactSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border gradient-hero py-16">
        <div className="container text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            Have questions, feedback, or partnership ideas? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground">support@uninotes.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">Location</h3>
                  <p className="text-sm text-muted-foreground">New Delhi, India</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MessageSquare className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">Response Time</h3>
                  <p className="text-sm text-muted-foreground">Within 24 hours</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="Your name" className="bg-background" value={name} onChange={e => setName(e.target.value)} maxLength={100} required />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@university.edu" className="bg-background" value={email} onChange={e => setEmail(e.target.value)} maxLength={255} required />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="How can we help?" className="bg-background" value={subject} onChange={e => setSubject(e.target.value)} maxLength={200} required />
                {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Tell us more..." className="bg-background min-h-32" value={message} onChange={e => setMessage(e.target.value)} maxLength={2000} required />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold" disabled={submitting}>
                {submitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
