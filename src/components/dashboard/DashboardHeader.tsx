import { Link } from "@tanstack/solid-router";

interface DashboardHeaderProps {
  activeTab: "overview" | "favorites" | "watchlater" | "history" | "settings";
  setActiveTab: (tab: "overview" | "favorites" | "watchlater" | "history" | "settings") => void;
  favoritesCount: number;
  watchLaterCount: number;
}

export default function DashboardHeader(props: DashboardHeaderProps) {
  return (
    <header class="bg-gradient-to-b from-emerald-900 to-emerald-950 py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-amber-400 mb-2">
              📊 لوحة التحكم
            </h1>
            <p class="text-emerald-300">تتبع تقدمك في الدراسة وإدارة قوائمك</p>
          </div>
          <Link
            to="/study"
            class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-emerald-950 rounded-lg font-medium transition-colors"
          >
            ← العودة للدروس
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div class="flex flex-wrap gap-2">
          <button
            onClick={() => props.setActiveTab("overview")}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              props.activeTab === "overview"
                ? "bg-amber-500 text-emerald-950"
                : "bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50"
            }`}
          >
            📈 نظرة عامة
          </button>
          <button
            onClick={() => props.setActiveTab("favorites")}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              props.activeTab === "favorites"
                ? "bg-amber-500 text-emerald-950"
                : "bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50"
            }`}
          >
            ⭐ المفضلة ({props.favoritesCount})
          </button>
          <button
            onClick={() => props.setActiveTab("watchlater")}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              props.activeTab === "watchlater"
                ? "bg-amber-500 text-emerald-950"
                : "bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50"
            }`}
          >
            📋 شاهد لاحقاً ({props.watchLaterCount})
          </button>
          <button
            onClick={() => props.setActiveTab("history")}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              props.activeTab === "history"
                ? "bg-amber-500 text-emerald-950"
                : "bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50"
            }`}
          >
            🕐 السجل
          </button>
          <button
            onClick={() => props.setActiveTab("settings")}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              props.activeTab === "settings"
                ? "bg-amber-500 text-emerald-950"
                : "bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50"
            }`}
          >
            ⚙️ الإعدادات
          </button>
        </div>
      </div>
    </header>
  );
}
