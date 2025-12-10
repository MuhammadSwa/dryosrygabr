import SearchBar from "./SearchBar";

export default function StudySkeleton() {
  return (
    <div class="min-h-screen bg-emerald-950 text-emerald-50">
      {/* Header Skeleton */}
      <div class="bg-gradient-to-b from-emerald-900 to-emerald-950 pt-24 pb-8">
        <div class="container mx-auto px-4">
           {/* Title & Desc - Static Content */}
           <div class="text-center mb-8">
             <h1 class="text-4xl md:text-5xl font-bold text-amber-400 mb-4 font-cairo">
               📚 المكتبة المرئية
             </h1>
             <p class="text-emerald-200 text-lg max-w-2xl mx-auto">
               قناة د. يسري جبر على اليوتيوب
             </p>
           </div>

           {/* Stats - Skeleton */}
           <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto animate-pulse">
             <div class="h-24 bg-emerald-800/50 rounded-xl"></div>
             <div class="h-24 bg-emerald-800/50 rounded-xl"></div>
             <div class="h-24 bg-emerald-800/50 rounded-xl"></div>
           </div>

           {/* Search - Static Component */}
           <SearchBar value="" onInput={() => {}} />
        </div>
      </div>

      <main class="container mx-auto px-4 py-8 animate-pulse">
        <div class="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <aside class="lg:w-80 order-2 lg:order-1">
             <div class="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/30 h-[600px]">
               <div class="h-8 w-32 bg-emerald-800/50 rounded mb-4"></div>
               <div class="space-y-2 mb-6">
                 <div class="h-10 bg-emerald-800/50 rounded"></div>
                 <div class="h-10 bg-emerald-800/50 rounded"></div>
                 <div class="h-10 bg-emerald-800/50 rounded"></div>
                 <div class="h-10 bg-emerald-800/50 rounded"></div>
               </div>
               <div class="h-8 w-32 bg-emerald-800/50 rounded mb-4"></div>
               <div class="space-y-2">
                 <div class="h-16 bg-emerald-800/50 rounded"></div>
                 <div class="h-16 bg-emerald-800/50 rounded"></div>
                 <div class="h-16 bg-emerald-800/50 rounded"></div>
               </div>
             </div>
          </aside>

          {/* Content Skeleton */}
          <div class="flex-1 order-1 lg:order-2">
             {/* Controls */}
             <div class="h-16 bg-emerald-900/30 rounded-xl mb-6"></div>
             {/* Grid */}
             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {Array(6).fill(0).map(() => (
                 <div class="bg-emerald-900/30 rounded-xl overflow-hidden h-80 border border-emerald-700/30">
                   <div class="h-48 bg-emerald-800/50"></div>
                   <div class="p-4 space-y-3">
                     <div class="h-6 bg-emerald-800/50 rounded w-3/4"></div>
                     <div class="h-4 bg-emerald-800/50 rounded w-1/2"></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
