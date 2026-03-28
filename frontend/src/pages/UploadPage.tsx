import Navbar from "@/components/Navbar";
import { UploadPageSkeleton } from "@/components/LoadingSkeleton";
import api from "@/lib/axios";

import { Upload, FileUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadSchema, validateFiles } from "@/lib/validations";
import { useUser } from "@/hooks/use-user";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const UploadPage = () => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: user, isLoading: userLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          <p className="text-muted-foreground animate-pulse font-medium">
            Preparing upload space...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold">Please log in</h2>
          <p className="mt-2 text-muted-foreground">
            You need to be logged in to upload resources.
          </p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const { valid, errors: fileErrors } = validateFiles(
      Array.from(newFiles),
      files.length,
    );
    if (fileErrors.length > 0) {
      fileErrors.forEach((err) => {
        toast({
          title: "File rejected",
          description: err.fileName
            ? `${err.fileName}: ${err.reason}`
            : err.reason,
          variant: "destructive",
        });
      });
    }
    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Zod Validation
    const result = uploadSchema.safeParse({
      title,
      subject,
      resourceType,
      department,
      semester,
      description,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No files",
        description: "Please upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("resourceType", resourceType);
      formData.append("department", department);
      formData.append("semester", semester);
      formData.append("description", description);

      formData.append("file", files[0]);

      const response = await api.post(
        "/api/resources/",
        formData
      );


      const data = response.data;
    
      toast({
        title: "Upload Successful! 🎉",
        description: "Your resource is now live.",
      });

      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Upload failed";
      toast({
        title: "Upload Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <UploadPageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 lg:py-20">
        <div className="container max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Upload <span className="text-gradient">Resources</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Share your notes and help fellow students ace their exams
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
            noValidate
          >
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Data Structures - Complete Handwritten Notes"
                className="bg-background"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Subject and Resource Type Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground">Subject</Label>
                <Input
                  placeholder="e.g., Data Structures & Algorithms"
                  className="bg-background"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={200}
                  required
                />
                {errors.subject && (
                  <p className="text-xs text-destructive">{errors.subject}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Resource Type</Label>
                <Select value={resourceType} onValueChange={setResourceType}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notes">Notes</SelectItem>
                    <SelectItem value="pyq">Previous Year Questions</SelectItem>
                    <SelectItem value="solutions">Solutions</SelectItem>
                    <SelectItem value="cheatsheet">
                      Cheat Sheet / Formula Sheet
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.resourceType && (
                  <p className="text-xs text-destructive">
                    {errors.resourceType}
                  </p>
                )}
              </div>
            </div>

            {/* Department and Semester Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Electronics & Comm.">Electronics & Comm.</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Industrial Engineering">Industrial Engineering</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <SelectItem key={sem} value={String(sem)}>Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.semester && <p className="text-xs text-destructive">{errors.semester}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Description</Label>
              <Textarea
                placeholder="Briefly describe what this resource covers..."
                className="bg-background min-h-24"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">
                Upload Files{" "}
                <span className="text-muted-foreground font-normal">
                  (max 10 files, 25MB each)
                </span>
              </Label>
              <div
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                  dragOver
                    ? "border-secondary bg-secondary/5"
                    : "border-border bg-background hover:border-muted-foreground/30"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileRef.current?.click()}
              >
                <FileUp className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Drag & drop files here or click to browse
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, DOC, PPT, images (Max 25MB each)
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                />
              </div>

              {/* File List Display */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
                    >
                      <div className="flex flex-col mr-2 min-w-0">
                        <span className="text-sm text-foreground truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base h-12"
              disabled={submitting}
            >
              <Upload className="h-5 w-5" />{" "}
              {submitting ? "Uploading…" : "Upload Resource"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UploadPage;
