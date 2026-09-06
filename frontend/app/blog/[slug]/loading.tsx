export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen bg-[#FBF8F2] pt-24 pb-20">
      {/* Header Skeleton */}
      <div className="max-w-[850px] mx-auto px-4 sm:px-6 pt-10 pb-8 space-y-5">
        <div className="h-4 w-40 bg-[#1A1612]/10 rounded-full animate-pulse" />
        <div className="h-5 w-24 bg-[#E85D2F]/20 rounded-full animate-pulse" />
        <div className="h-12 w-full bg-[#1A1612]/10 rounded-2xl animate-pulse" />
        <div className="h-10 w-4/5 bg-[#1A1612]/10 rounded-2xl animate-pulse" />
        
        <div className="flex items-center gap-4 pt-4 border-t border-[#1A1612]/10">
          <div className="w-10 h-10 rounded-full bg-[#1A1612]/10 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-[#1A1612]/10 rounded animate-pulse" />
            <div className="h-3 w-20 bg-[#1A1612]/10 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full pt-4">
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/8] max-h-[520px] rounded-2xl sm:rounded-3xl bg-[#1A1612]/10 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>

      {/* Article Body Skeleton */}
      <div className="max-w-[850px] mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="h-6 w-full bg-[#1A1612]/10 rounded-lg animate-pulse" />
        <div className="h-6 w-11/12 bg-[#1A1612]/10 rounded-lg animate-pulse" />
        <div className="h-6 w-4/5 bg-[#1A1612]/10 rounded-lg animate-pulse mb-8" />

        <div className="space-y-3 pt-6">
          <div className="h-8 w-1/2 bg-[#1A1612]/10 rounded-xl animate-pulse mb-4" />
          <div className="h-4 w-full bg-[#1A1612]/5 rounded animate-pulse" />
          <div className="h-4 w-full bg-[#1A1612]/5 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-[#1A1612]/5 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
