import { Link } from "@tanstack/solid-router"

export default function NotFoundPage() {
  return (
    <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950">
      {/* Background Pattern */}
      <div class="absolute inset-0 opacity-5 pointer-events-none">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="notFoundPattern"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0 L80 40 L40 80 L0 40 Z"
                fill="none"
                stroke="currentColor"
                stroke-width="0.5"
                class="text-amber-300"
              />
              <circle
                cx="40"
                cy="40"
                r="15"
                fill="none"
                stroke="currentColor"
                stroke-width="0.5"
                class="text-amber-300"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#notFoundPattern)" />
        </svg>
      </div>

      {/* Ambient Light Effects */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div class="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div class="relative z-10 text-center px-6 py-12 animate-fadeIn">
        <div class="max-w-2xl mx-auto">
          {/* 404 Number */}
          <div class="mb-8 animate-scaleIn">
            <h1 class="text-9xl font-bold text-amber-400 text-shadow-gold mb-4 font-cairo">
              404
            </h1>
            <div class="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8" />
          </div>

          {/* Arabic Message */}
          <div class="space-y-6 animate-slideUp delay-200">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 font-cairo">
              الصفحة غير موجودة
            </h2>

            <p class="text-xl text-emerald-100 font-amiri leading-relaxed mb-8">
              عذراً، الصفحة التي تبحث عنها غير متاحة أو تم نقلها
            </p>

            {/* Action Buttons */}
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link
                to="/"
                class="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105"
              >
                <span class="relative z-10 flex items-center gap-2">
                  <svg
                    class="w-5 h-5 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  العودة للرئيسية
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              </Link>

              <button
                onClick={() => window.history.back()}
                class="group px-8 py-4 bg-transparent border-2 border-amber-400 text-amber-400 rounded-lg font-bold text-lg transition-all duration-300 hover:bg-amber-400 hover:text-emerald-950 hover:shadow-lg hover:shadow-amber-400/30"
              >
                <span class="flex items-center gap-2">
                  <svg
                    class="w-5 h-5 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                    />
                  </svg>
                  العودة للخلف
                </span>
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div class="mt-16 flex justify-center gap-4 animate-fadeIn delay-300">
            <div class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div class="w-3 h-3 rounded-full bg-amber-400 animate-pulse delay-100" />
            <div class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse delay-200" />
          </div>
        </div>
      </div>

      {/* Bottom Decorative Wave */}
      <div class="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          class="w-full h-full"
        >
          <path
            d="M0,50 C150,80 350,0 600,50 C850,100 1050,20 1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
            class="text-amber-400"
          />
        </svg>
      </div>
    </section>
  )
}
