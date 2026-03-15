import Navbar from "@/components/Navbar";

import { AtSign } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { editProfileSchema } from "@/lib/validations";

const branches = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Electronics & Comm.",
  "Civil Engineering",
  "Chemical Engineering",
  "Information Technology",
  "Industrial Engineering",
];

const EditProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "Priya Sharma",
    username: "",
    email: "priya.sharma@iitd.ac.in",
    university: "IIT Delhi",
    branch: "Computer Science",
    year: "4th Year",
    bio: "Final year CSE student passionate about sharing knowledge. I believe quality notes should be accessible to everyone.",
    linkedin: "https://linkedin.com/in/priyasharma",
    github: "https://github.com/priyasharma",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = editProfileSchema.safeParse(form);
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
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved successfully.",
    });
    setTimeout(() => {
      setSubmitting(false);
      navigate("/profile");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-card py-10">
        <div className="container">
          <Link to="/profile" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Edit <span className="text-gradient">Profile</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Update your personal information and preferences</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-2xl">
          <form onSubmit={handleSave} className="space-y-8" noValidate>
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-secondary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {form.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">Profile Photo</p>
                <p className="text-xs text-muted-foreground">Click the camera icon to change</p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <h3 className="font-display font-semibold text-foreground">Personal Information</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="bg-background" maxLength={100} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="username" placeholder="Choose a unique username" value={form.username} onChange={(e) => handleChange("username", e.target.value)} className="bg-background pl-10" maxLength={50} />
                  </div>
                  {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="bg-background" maxLength={255} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} className="bg-background min-h-[100px]" placeholder="Tell others about yourself..." maxLength={500} />
                {errors.bio && <p className="text-xs text-destructive">{errors.bio}</p>}
                <p className="text-xs text-muted-foreground text-right">{form.bio.length}/500</p>
              </div>
            </div>

            {/* Academic Info */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <h3 className="font-display font-semibold text-foreground">Academic Details</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="university">University / College</Label>
                  <Input id="university" value={form.university} onChange={(e) => handleChange("university", e.target.value)} className="bg-background" maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select value={form.branch} onValueChange={(v) => handleChange("branch", v)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={form.year} onValueChange={(v) => handleChange("year", v)}>
                  <SelectTrigger className="bg-background w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                    <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <h3 className="font-display font-semibold text-foreground">Social Links</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" value={form.linkedin} onChange={(e) => handleChange("linkedin", e.target.value)} className="bg-background" placeholder="https://linkedin.com/in/..." maxLength={500} />
                  {errors.linkedin && <p className="text-xs text-destructive">{errors.linkedin}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input id="github" value={form.github} onChange={(e) => handleChange("github", e.target.value)} className="bg-background" placeholder="https://github.com/..." maxLength={500} />
                  {errors.github && <p className="text-xs text-destructive">{errors.github}</p>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Link to="/profile">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold" disabled={submitting}>
                <Save className="h-4 w-4" /> {submitting ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
