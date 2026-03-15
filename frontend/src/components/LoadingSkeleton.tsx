import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const shimmer = {
  hidden: { opacity: 0.4 },
  show: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 1.2,
      ease: "easeInOut" as const,
    },
  },
};

const SkeletonPulse = ({ className }: { className?: string }) => (
  <motion.div variants={shimmer} initial="hidden" animate="show">
    <Skeleton className={className} />
  </motion.div>
);

// Mobile-specific skeleton with slide-up animation
const MobileSkeletonPulse = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
  >
    <motion.div variants={shimmer} initial="hidden" animate="show">
      <Skeleton className={className} />
    </motion.div>
  </motion.div>
);

export const IndexSkeleton = () => (
  <motion.div
    className="bg-background"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {/* Hero Skeleton */}
    <section className="relative overflow-hidden gradient-hero">
      <div className="container py-12 sm:py-20 lg:py-32">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
          <div className="space-y-6 sm:space-y-8">
            <MobileSkeletonPulse className="h-8 w-48 rounded-full" delay={0} />
            <div className="space-y-3">
              <MobileSkeletonPulse className="h-8 sm:h-12 lg:h-14 w-full" delay={0.1} />
              <MobileSkeletonPulse className="h-8 sm:h-12 lg:h-14 w-3/4" delay={0.15} />
            </div>
            <MobileSkeletonPulse className="h-5 w-full max-w-lg" delay={0.2} />
            <MobileSkeletonPulse className="h-4 w-4/5 max-w-md" delay={0.25} />
            <div className="flex flex-col gap-4 sm:flex-row">
              <MobileSkeletonPulse className="h-12 flex-1 rounded-lg" delay={0.3} />
              <MobileSkeletonPulse className="h-12 w-full sm:w-32 rounded-lg" delay={0.35} />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <MobileSkeletonPulse key={i} className="h-8 w-8 rounded-full border-2 border-background" delay={0.4 + i * 0.05} />
                ))}
              </div>
              <MobileSkeletonPulse className="h-4 w-40" delay={0.6} />
            </div>
          </div>
          <div className="hidden lg:block">
            <MobileSkeletonPulse className="h-80 w-full rounded-2xl" delay={0.3} />
          </div>
        </div>
      </div>
    </section>

    {/* Stats Skeleton */}
    <section className="py-12 sm:py-16 border-y border-border bg-card">
      <div className="container">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="text-center space-y-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <SkeletonPulse className="h-8 sm:h-10 w-20 sm:w-24 mx-auto" />
              <SkeletonPulse className="h-4 w-24 sm:w-28 mx-auto" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Categories Skeleton */}
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="container">
        <div className="mb-8 sm:mb-12 text-center space-y-3">
          <SkeletonPulse className="h-8 sm:h-10 w-64 mx-auto" />
          <SkeletonPulse className="h-5 w-80 mx-auto" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <SkeletonPulse className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg" />
              <SkeletonPulse className="h-4 w-3/4" />
              <SkeletonPulse className="h-3 w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works Skeleton */}
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="container">
        <div className="mb-12 sm:mb-16 text-center space-y-3">
          <SkeletonPulse className="h-8 sm:h-10 w-56 mx-auto" />
          <SkeletonPulse className="h-5 w-48 mx-auto" />
        </div>
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <SkeletonPulse className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl mx-auto" />
              <SkeletonPulse className="h-5 w-32 mx-auto" />
              <SkeletonPulse className="h-4 w-full max-w-xs mx-auto" />
              <SkeletonPulse className="h-4 w-3/4 mx-auto" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Skeleton */}
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="container">
        <motion.div
          className="rounded-3xl bg-muted p-8 sm:p-12 lg:p-16 text-center space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SkeletonPulse className="h-8 sm:h-10 lg:h-12 w-3/4 mx-auto" />
          <SkeletonPulse className="h-6 sm:h-8 w-1/2 mx-auto" />
          <SkeletonPulse className="h-5 w-full max-w-xl mx-auto" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <SkeletonPulse className="h-12 w-40 rounded-lg" />
            <SkeletonPulse className="h-12 w-44 rounded-lg" />
          </div>
        </motion.div>
      </div>
    </section>

    {/* Footer Skeleton */}
    <div className="border-t border-border bg-card py-8 sm:py-12">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <SkeletonPulse className="h-5 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <SkeletonPulse key={j} className="h-4 w-28" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export const CardSkeleton = () => (
  <motion.div
    className="rounded-xl border border-border bg-card p-5 space-y-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between">
      <SkeletonPulse className="h-5 w-16 rounded-full" />
      <SkeletonPulse className="h-4 w-10" />
    </div>
    <div className="flex items-start gap-3">
      <SkeletonPulse className="h-10 w-10 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-full" />
        <SkeletonPulse className="h-3 w-2/3" />
      </div>
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-border">
      <SkeletonPulse className="h-3 w-20" />
      <SkeletonPulse className="h-3 w-24" />
    </div>
  </motion.div>
);

export const ResourceGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: i * 0.08 }}
      >
        <CardSkeleton />
      </motion.div>
    ))}
  </div>
);

export const CategorySkeleton = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="rounded-xl border border-border bg-card p-6 space-y-3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
      >
        <SkeletonPulse className="h-12 w-12 rounded-lg" />
        <SkeletonPulse className="h-4 w-3/4" />
        <SkeletonPulse className="h-3 w-1/2" />
      </motion.div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    {/* Profile Header */}
    <section className="border-b border-border bg-card py-10">
      <div className="container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <SkeletonPulse className="h-24 w-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <SkeletonPulse className="h-8 w-48" />
                <div className="flex flex-wrap items-center gap-3">
                  <SkeletonPulse className="h-4 w-32" />
                  <SkeletonPulse className="h-4 w-24" />
                  <SkeletonPulse className="h-4 w-36" />
                  <SkeletonPulse className="h-4 w-28" />
                </div>
              </div>
              <SkeletonPulse className="h-10 w-[120px] rounded-md" />
            </div>
            <SkeletonPulse className="h-4 w-full max-w-xl" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border bg-background p-4 text-center space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <SkeletonPulse className="h-5 w-5 mx-auto rounded" />
              <SkeletonPulse className="h-6 w-12 mx-auto" />
              <SkeletonPulse className="h-3 w-16 mx-auto" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Badges */}
    <section className="border-b border-border py-6">
      <div className="container">
        <SkeletonPulse className="h-4 w-28 mb-3" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-9 w-36 rounded-full" />
          ))}
        </div>
      </div>
    </section>

    {/* Tabs */}
    <section className="py-6 sm:py-10">
      <div className="container">
        <div className="mb-4 sm:mb-6 flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>
        <div className="space-y-2 sm:space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border bg-card p-3 sm:p-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <div className="flex items-start gap-3">
                <SkeletonPulse className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonPulse className="h-4 w-3/4" />
                  <div className="flex items-center gap-2">
                    <SkeletonPulse className="h-5 w-14 rounded-full" />
                    <SkeletonPulse className="h-3 w-20" />
                    <SkeletonPulse className="h-3 w-16" />
                    <SkeletonPulse className="h-3 w-10" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

export const ListItemSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-start gap-3">
      <SkeletonPulse className="h-10 w-10 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-3/4" />
        <SkeletonPulse className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);

export const ListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: i * 0.08 }}
      >
        <ListItemSkeleton />
      </motion.div>
    ))}
  </div>
);

export const BrowseSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    {/* Hero Search */}
    <section className="border-b border-border gradient-hero py-12 lg:py-16">
      <div className="container text-center">
        <SkeletonPulse className="h-10 w-64 mx-auto" />
        <SkeletonPulse className="h-5 w-80 mx-auto mt-3" />
        <div className="mt-8 max-w-2xl mx-auto">
          <SkeletonPulse className="h-14 w-full rounded-2xl" />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-7 w-28 rounded-full" />
          ))}
        </div>
      </div>
    </section>

    {/* Filters Bar */}
    <section className="border-b border-border bg-card/50 py-4">
      <div className="container flex flex-wrap items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-10 w-full sm:w-40 rounded-md" />
        ))}
      </div>
    </section>

    {/* Department Grid */}
    <section className="py-8 border-b border-border">
      <div className="container">
        <SkeletonPulse className="h-6 w-48 mb-4" />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <SkeletonPulse className="h-8 w-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <SkeletonPulse className="h-4 w-3/4" />
                <SkeletonPulse className="h-3 w-1/2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Resource Grid */}
    <section className="py-10">
      <div className="container">
        <div className="mb-6">
          <SkeletonPulse className="h-4 w-32" />
        </div>
        <ResourceGridSkeleton count={6} />
      </div>
    </section>
  </motion.div>
);

export const ScoreboardSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    {/* Hero */}
    <section className="border-b border-border gradient-hero py-12">
      <div className="container text-center">
        <SkeletonPulse className="h-8 w-52 mx-auto rounded-full mb-4" />
        <SkeletonPulse className="h-10 w-64 mx-auto" />
        <SkeletonPulse className="h-5 w-96 mx-auto mt-3" />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </section>

    {/* Podium */}
    <section className="py-12">
      <div className="container">
        <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto mb-12 items-end">
          {[false, true, false].map((isCenter, i) => (
            <motion.div
              key={i}
              className={`relative rounded-2xl border-2 border-border bg-card p-6 text-center space-y-3 ${isCenter ? "sm:-mt-6 sm:scale-105" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <SkeletonPulse className="h-8 w-8 rounded-full" />
              </div>
              <SkeletonPulse className="h-16 w-16 rounded-full mx-auto mt-2" />
              <SkeletonPulse className="h-5 w-28 mx-auto" />
              <SkeletonPulse className="h-3 w-20 mx-auto" />
              <SkeletonPulse className="h-6 w-32 mx-auto rounded-full" />
              <SkeletonPulse className="h-3 w-16 mx-auto" />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="rounded-lg bg-muted/50 p-2 space-y-1.5">
                  <SkeletonPulse className="h-6 w-10 mx-auto" />
                  <SkeletonPulse className="h-3 w-12 mx-auto" />
                </div>
                <div className="rounded-lg bg-muted/50 p-2 space-y-1.5">
                  <SkeletonPulse className="h-6 w-10 mx-auto" />
                  <SkeletonPulse className="h-3 w-12 mx-auto" />
                </div>
              </div>
              <SkeletonPulse className="h-3 w-28 mx-auto" />
            </motion.div>
          ))}
        </div>

        {/* Full Rankings */}
        <div className="max-w-3xl mx-auto">
          <SkeletonPulse className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <SkeletonPulse className="h-10 w-10 rounded-full shrink-0" />
                <SkeletonPulse className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <SkeletonPulse className="h-4 w-36" />
                  <SkeletonPulse className="h-3 w-56" />
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="text-center space-y-1">
                      <SkeletonPulse className="h-5 w-10 mx-auto" />
                      <SkeletonPulse className="h-3 w-14 mx-auto" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

export const SubjectDetailSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    {/* Header */}
    <section className="border-b border-border bg-card py-10">
      <div className="container">
        <SkeletonPulse className="h-4 w-32 mb-4" />
        <SkeletonPulse className="h-10 w-72" />
        <SkeletonPulse className="h-4 w-56 mt-2" />
        <div className="mt-4 flex items-center gap-2">
          <SkeletonPulse className="h-4 w-4 rounded" />
          <SkeletonPulse className="h-4 w-48" />
        </div>
      </div>
    </section>

    {/* Filters */}
    <section className="border-b border-border bg-card/50 py-4">
      <div className="container flex flex-wrap items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-10 w-full sm:w-36 rounded-md" />
        ))}
      </div>
    </section>

    {/* Tabs + Grid */}
    <section className="py-10">
      <div className="container">
        <div className="mb-6 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <SkeletonPulse className="h-5 w-14 rounded-full" />
                    <SkeletonPulse className="h-5 w-16 rounded-full" />
                    <SkeletonPulse className="h-5 w-14 rounded-full" />
                  </div>
                  <SkeletonPulse className="h-4 w-10" />
                </div>
                <div className="flex items-start gap-3">
                  <SkeletonPulse className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <SkeletonPulse className="h-4 w-full" />
                    <SkeletonPulse className="h-3 w-2/3" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <SkeletonPulse className="h-3 w-20" />
                  <SkeletonPulse className="h-3 w-24" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

export const ResourceDetailSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    {/* Header */}
    <div className="border-b border-border bg-card py-8">
      <div className="container">
        <SkeletonPulse className="h-4 w-28 mb-4" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <SkeletonPulse className="h-5 w-16 rounded-full" />
              <SkeletonPulse className="h-5 w-24 rounded-full" />
            </div>
            <SkeletonPulse className="h-8 w-3/4" />
            <SkeletonPulse className="h-4 w-1/2" />
            <div className="flex flex-wrap items-center gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-4 w-24" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <SkeletonPulse className="h-10 w-40 rounded-md" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-10 w-10 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="py-8">
      <div className="container grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Preview */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-3 w-28" />
            </div>
            <SkeletonPulse className="h-96 w-full" />
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <SkeletonPulse className="h-5 w-28" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-5/6" />
            <SkeletonPulse className="h-4 w-2/3" />
            <div className="flex flex-wrap gap-2 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <SkeletonPulse className="h-5 w-36" />
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center min-w-[120px] space-y-2">
                <SkeletonPulse className="h-10 w-14" />
                <SkeletonPulse className="h-4 w-20" />
                <SkeletonPulse className="h-3 w-16" />
              </div>
              <div className="flex-1 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <SkeletonPulse className="h-3 w-3" />
                    <SkeletonPulse className="h-3 w-3" />
                    <SkeletonPulse className="h-2 flex-1 rounded-full" />
                    <SkeletonPulse className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <SkeletonPulse className="h-5 w-32" />
            <div className="flex gap-2">
              <SkeletonPulse className="h-10 flex-1 rounded-md" />
              <SkeletonPulse className="h-10 w-16 rounded-md" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="border-b border-border pb-4 last:border-0 space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between">
                  <SkeletonPulse className="h-4 w-24" />
                  <SkeletonPulse className="h-3 w-16" />
                </div>
                <SkeletonPulse className="h-4 w-full" />
                <SkeletonPulse className="h-3 w-8" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Uploader */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <SkeletonPulse className="h-4 w-24" />
            <div className="flex items-center gap-3">
              <SkeletonPulse className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5">
                <SkeletonPulse className="h-4 w-24" />
                <SkeletonPulse className="h-3 w-20" />
              </div>
            </div>
          </div>

          {/* Resource Info */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <SkeletonPulse className="h-4 w-28" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <SkeletonPulse className="h-3 w-20" />
                <SkeletonPulse className="h-3 w-24" />
              </div>
            ))}
          </div>

          {/* Related */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <SkeletonPulse className="h-4 w-36" />
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-lg border border-border p-3 space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between">
                  <SkeletonPulse className="h-4 w-14 rounded-full" />
                  <SkeletonPulse className="h-3 w-8" />
                </div>
                <SkeletonPulse className="h-4 w-full" />
                <SkeletonPulse className="h-3 w-2/3" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export const UploadPageSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    <section className="py-12 lg:py-20">
      <div className="container max-w-2xl">
        <div className="mb-8 text-center space-y-2">
          <SkeletonPulse className="h-10 w-64 mx-auto" />
          <SkeletonPulse className="h-4 w-80 mx-auto" />
        </div>
        <div className="space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          {/* Title */}
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-12" />
            <SkeletonPulse className="h-10 w-full rounded-md" />
          </div>
          {/* Department + Semester */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-24" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-20" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
          </div>
          {/* Subject + Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-28" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
          </div>
          {/* Tags */}
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-12" />
            <SkeletonPulse className="h-10 w-full rounded-md" />
          </div>
          {/* Description */}
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-24 w-full rounded-md" />
          </div>
          {/* File Upload Zone */}
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-28" />
            <div className="rounded-xl border-2 border-dashed border-border p-8 flex flex-col items-center gap-3">
              <SkeletonPulse className="h-10 w-10 rounded-lg" />
              <SkeletonPulse className="h-4 w-56" />
              <SkeletonPulse className="h-3 w-44" />
            </div>
          </div>
          {/* Submit Button */}
          <SkeletonPulse className="h-12 w-full rounded-md" />
        </div>
      </div>
    </section>
  </motion.div>
);

export const SubjectPageSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    {/* Header */}
    <section className="border-b border-border bg-card py-10">
      <div className="container">
        <SkeletonPulse className="h-4 w-28 mb-4" />
        <SkeletonPulse className="h-10 w-64" />
        <SkeletonPulse className="h-4 w-96 mt-2" />
        <div className="mt-6 flex flex-wrap gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <SkeletonPulse className="h-4 w-4 rounded" />
              <SkeletonPulse className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Content */}
    <section className="py-10">
      <div className="container">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SkeletonPulse className="h-6 w-56" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
            >
              <div className="flex items-start gap-3 flex-1">
                <SkeletonPulse className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <SkeletonPulse className="h-4 w-3/4" />
                  <SkeletonPulse className="h-3 w-20" />
                  <div className="flex items-center gap-2">
                    <SkeletonPulse className="h-5 w-14 rounded-full" />
                    <SkeletonPulse className="h-3 w-28" />
                  </div>
                </div>
              </div>
              <SkeletonPulse className="h-5 w-5 shrink-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

export const ContactSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    {/* Hero */}
    <section className="border-b border-border gradient-hero py-16">
      <div className="container text-center">
        <SkeletonPulse className="h-10 w-56 mx-auto" />
        <SkeletonPulse className="h-5 w-80 mx-auto mt-4" />
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-4xl">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <SkeletonPulse className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-1.5">
                  <SkeletonPulse className="h-4 w-20" />
                  <SkeletonPulse className="h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
          {/* Form */}
          <div className="lg:col-span-3 space-y-4 rounded-2xl border border-border bg-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <SkeletonPulse className="h-4 w-12" />
                <SkeletonPulse className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <SkeletonPulse className="h-4 w-12" />
                <SkeletonPulse className="h-10 w-full rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-32 w-full rounded-md" />
            </div>
            <SkeletonPulse className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

export const AboutUsSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    {/* Hero */}
    <section className="border-b border-border gradient-hero py-16">
      <div className="container text-center">
        <SkeletonPulse className="h-10 w-56 mx-auto" />
        <SkeletonPulse className="h-5 w-96 mx-auto mt-4" />
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-4xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <SkeletonPulse className="h-7 w-36" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-5/6" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-border bg-card p-5 text-center space-y-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <SkeletonPulse className="h-8 w-8 mx-auto rounded" />
                <SkeletonPulse className="h-5 w-24 mx-auto" />
                <SkeletonPulse className="h-3 w-28 mx-auto" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <SkeletonPulse className="h-7 w-32 mb-6" />
          <div className="grid gap-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-border bg-card p-6 space-y-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <SkeletonPulse className="h-5 w-28" />
                <SkeletonPulse className="h-3 w-full" />
                <SkeletonPulse className="h-3 w-full" />
                <SkeletonPulse className="h-3 w-2/3" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

export const EditProfileSkeleton = () => (
  <motion.div
    className="min-h-screen bg-background"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {/* Header */}
    <section className="border-b border-border bg-card py-10">
      <div className="container">
        <SkeletonPulse className="h-4 w-32 mb-4" />
        <SkeletonPulse className="h-9 w-56" />
        <SkeletonPulse className="h-4 w-72 mt-2" />
      </div>
    </section>

    <section className="py-10">
      <div className="container max-w-2xl space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <SkeletonPulse className="h-24 w-24 rounded-full shrink-0" />
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-3 w-40" />
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <SkeletonPulse className="h-5 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-20" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-12" />
            <SkeletonPulse className="h-24 w-full rounded-md" />
          </div>
        </div>

        {/* Academic Info Card */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <SkeletonPulse className="h-5 w-36" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-28" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-12" />
            <SkeletonPulse className="h-10 w-48 rounded-md" />
          </div>
        </div>

        {/* Social Links Card */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <SkeletonPulse className="h-5 w-28" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-20" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <SkeletonPulse className="h-10 w-20 rounded-md" />
          <SkeletonPulse className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </section>
  </motion.div>
);

export const LoginSkeleton = () => (
  <motion.div
    className="flex min-h-screen items-center justify-center bg-background px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2">
          <SkeletonPulse className="h-10 w-10 rounded-lg" />
          <SkeletonPulse className="h-6 w-24" />
        </div>
        <SkeletonPulse className="h-7 w-40 mx-auto" />
        <SkeletonPulse className="h-4 w-56 mx-auto" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <SkeletonPulse className="h-4 w-12" />
            <SkeletonPulse className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-3 w-24" />
            </div>
            <SkeletonPulse className="h-10 w-full rounded-md" />
          </div>
          <SkeletonPulse className="h-10 w-full rounded-md" />
        </div>
        <SkeletonPulse className="h-px w-full" />
        <div className="grid grid-cols-2 gap-3">
          <SkeletonPulse className="h-10 w-full rounded-md" />
          <SkeletonPulse className="h-10 w-full rounded-md" />
        </div>
      </div>
      <SkeletonPulse className="h-4 w-48 mx-auto" />
    </div>
  </motion.div>
);

export const SignupSkeleton = () => (
  <motion.div
    className="flex min-h-screen items-center justify-center bg-background px-4 py-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2">
          <SkeletonPulse className="h-10 w-10 rounded-lg" />
          <SkeletonPulse className="h-6 w-24" />
        </div>
        <SkeletonPulse className="h-7 w-48 mx-auto" />
        <SkeletonPulse className="h-4 w-56 mx-auto" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <SkeletonPulse className="h-10 w-full rounded-md" />
          <SkeletonPulse className="h-10 w-full rounded-md" />
        </div>
        <SkeletonPulse className="h-px w-full" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonPulse className="h-4 w-24" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
          ))}
          <SkeletonPulse className="h-10 w-full rounded-md" />
        </div>
      </div>
      <SkeletonPulse className="h-4 w-52 mx-auto" />
    </div>
  </motion.div>
);

export const LegalPageSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <section className="border-b border-border gradient-hero py-16">
      <div className="container text-center">
        <SkeletonPulse className="h-10 w-56 mx-auto" />
        <SkeletonPulse className="h-4 w-40 mx-auto mt-4" />
      </div>
    </section>
    <section className="py-16">
      <div className="container max-w-3xl space-y-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <SkeletonPulse className="h-5 w-48" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-11/12" />
            <SkeletonPulse className="h-4 w-3/4" />
          </motion.div>
        ))}
      </div>
    </section>
  </motion.div>
);
