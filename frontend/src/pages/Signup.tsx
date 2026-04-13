import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Mail, Lock, User, Eye, EyeOff, GraduationCap, AtSign, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SignupSkeleton } from "@/components/LoadingSkeleton";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { signupSchema, signupStep2Schema } from "@/lib/validations";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";


const Signup = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1 fields
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2 fields
  const [username, setUsername] = useState("");
  const [university, setUniversity] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile/edit";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse({ fullname, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Validation passed → move to step 2
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupStep2Schema.safeParse({ username, university, branch, year, semester });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Both steps validated → submit everything to the backend
    setSubmitting(true);

    try {
      const { data } = await api.post("/api/auth/register", {
        fullname,
        username,
        email,
        password,
        university,
        department: branch,
        year: parseInt(year, 10),
        semester: parseInt(semester, 10),
      });

      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }

      await queryClient.invalidateQueries({ queryKey: ["user"] });

      toast({
        title: "Welcome to UniNotes! 🎉",
        description: "Your account has been created successfully.",
      });

      navigate(from, { replace: true });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(axiosError.response?.data?.message);
      const message = axiosError.response?.data?.message || "Something went wrong";
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <SignupSkeleton />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">UniNotes</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {step === 1 ? "Create your account" : "Complete your profile"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === 1
              ? "Join thousands of students sharing notes"
              : "Just a few more details to get you started"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold transition-colors ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            1
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold transition-colors ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            2
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">

          {/* ───── STEP 1: Account Basics ───── */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Google Sign-Up", description: "Backend not connected yet." })}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Apple Sign-Up", description: "Backend not connected yet." })}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or sign up with email</span></div>
              </div>

              <form onSubmit={handleStep1} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="fullname" placeholder="Your full name" className="pl-10" value={fullname} onChange={e => setFullname(e.target.value)} maxLength={100} required />
                  </div>
                  {errors.fullname && <p className="text-xs text-destructive">{errors.fullname}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-email" type="email" placeholder="you@university.edu" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} maxLength={255} required />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" className="pl-10 pr-10" value={password} onChange={e => setPassword(e.target.value)} maxLength={128} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  <p className="text-xs text-muted-foreground">Must include uppercase, lowercase, number & special character</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" className="pl-10 pr-10" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} maxLength={128} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}

          {/* ───── STEP 2: Profile Setup ───── */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="username" placeholder="Choose a unique username" className="pl-10" value={username} onChange={e => setUsername(e.target.value)} maxLength={50} required />
                </div>
                {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University / College</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input id="university" placeholder="e.g. IIT Delhi" className="pl-10" value={university} onChange={e => setUniversity(e.target.value)} maxLength={200} required />
                </div>
                {errors.university && <p className="text-xs text-destructive">{errors.university}</p>}
              </div>

              <div className="space-y-2">
                <Label>Branch / Department</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger><SelectValue placeholder="Select your branch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.branch && <p className="text-xs text-destructive">{errors.branch}</p>}
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger><SelectValue placeholder="Select your year" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
                {errors.year && <p className="text-xs text-destructive">{errors.year}</p>}
              </div>
              
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger><SelectValue placeholder="Select your semester" /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.semester && <p className="text-xs text-destructive">{errors.semester}</p>}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => { setStep(1); setErrors({}); }}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={submitting}>
                  {submitting ? "Creating account…" : "Create Account"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-secondary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
