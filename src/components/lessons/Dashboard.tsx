import { createSignal, onMount, Show } from "solid-js";
import {
  calculateGlobalStatsAsync,
  getFavoritesAsync,
  getWatchLaterAsync,
  getRecentlyWatchedAsync,
  getRecentSessionsAsync,
  removeFromFavoritesAsync,
  removeFromWatchLaterAsync,
  exportAllDataAsync,
  importAllDataAsync,
  type GlobalStats,
  type FavoriteVideo,
  type WatchLaterItem,
  type StudySession,
} from "../../lib/studyStore";
import { getVideo, type VideoDetails } from "../../lib/staticData";

// Import sub-components
import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardOverview from "../dashboard/DashboardOverview";
import DashboardFavorites from "../dashboard/DashboardFavorites";
import DashboardWatchLater from "../dashboard/DashboardWatchLater";
import DashboardHistory from "../dashboard/DashboardHistory";
import DashboardSettings from "../dashboard/DashboardSettings";

export default function StudyDashboard() {
  const [stats, setStats] = createSignal<GlobalStats | null>(null);
  const [favorites, setFavorites] = createSignal<FavoriteVideo[]>([]);
  const [watchLater, setWatchLater] = createSignal<WatchLaterItem[]>([]);
  const [recentlyWatched, setRecentlyWatched] = createSignal<{ videoId: string; lastWatched: string; percentage: number }[]>([]);
  const [recentVideos, setRecentVideos] = createSignal<Record<string, VideoDetails>>({});
  const [recentSessions, setRecentSessions] = createSignal<StudySession[]>([]);
  const [activeTab, setActiveTab] = createSignal<"overview" | "favorites" | "watchlater" | "history" | "settings">("overview");
  const [isLoaded, setIsLoaded] = createSignal(false);

  // Refresh data
  const refreshData = async () => {
    const [
      newStats,
      newFavorites,
      newWatchLater,
      newRecentlyWatched,
      newRecentSessions
    ] = await Promise.all([
      calculateGlobalStatsAsync(),
      getFavoritesAsync(),
      getWatchLaterAsync(),
      getRecentlyWatchedAsync(10),
      getRecentSessionsAsync(10)
    ]);

    setStats(newStats);
    setFavorites(newFavorites);
    setWatchLater(newWatchLater);
    setRecentlyWatched(newRecentlyWatched);
    setRecentSessions(newRecentSessions);

    // Fetch details for recent videos
    const details: Record<string, VideoDetails> = {};
    await Promise.all(newRecentlyWatched.map(async (item) => {
      if (!recentVideos()[item.videoId]) {
        const v = await getVideo(item.videoId);
        if (v) details[item.videoId] = v;
      }
    }));
    
    if (Object.keys(details).length > 0) {
      setRecentVideos(prev => ({ ...prev, ...details }));
    }
  };

  onMount(async () => {
    await refreshData();
    setIsLoaded(true);
  });

  // Handle remove from favorites
  const handleRemoveFavorite = async (videoId: string) => {
    await removeFromFavoritesAsync(videoId);
    await refreshData();
  };

  // Handle remove from watch later
  const handleRemoveWatchLater = async (videoId: string) => {
    await removeFromWatchLaterAsync(videoId);
    await refreshData();
  };

  // Handle export
  const handleExport = async () => {
    try {
      const data = await exportAllDataAsync();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `study-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("خطأ في تصدير البيانات");
    }
  };

  // Handle import
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          await importAllDataAsync(data, true);
          await refreshData();
          alert("تم استيراد البيانات بنجاح!");
        } catch (err) {
          alert("خطأ في استيراد الملف");
        }
      }
    };
    input.click();
  };

  return (
    <div class="min-h-screen bg-emerald-950 text-emerald-50 pt-20">
      {/* Header */}
      <DashboardHeader
        activeTab={activeTab()}
        setActiveTab={setActiveTab}
        favoritesCount={favorites().length}
        watchLaterCount={watchLater().length}
      />

      {/* Main Content */}
      <main class="container mx-auto px-4 py-8">
        <Show when={!isLoaded()}>
          <div class="text-center py-16">
            <div class="animate-spin text-4xl mb-4">⏳</div>
            <p class="text-emerald-400">جاري التحميل...</p>
          </div>
        </Show>

        <Show when={isLoaded()}>
          {/* Overview Tab */}
          <Show when={activeTab() === "overview"}>
            <DashboardOverview
              stats={stats()}
              recentlyWatched={recentlyWatched()}
              recentVideos={recentVideos()}
            />
          </Show>

          {/* Favorites Tab */}
          <Show when={activeTab() === "favorites"}>
            <DashboardFavorites
              favorites={favorites()}
              onRemoveFavorite={handleRemoveFavorite}
            />
          </Show>

          {/* Watch Later Tab */}
          <Show when={activeTab() === "watchlater"}>
            <DashboardWatchLater
              watchLater={watchLater()}
              onRemoveWatchLater={handleRemoveWatchLater}
            />
          </Show>

          {/* History Tab */}
          <Show when={activeTab() === "history"}>
            <DashboardHistory
              recentSessions={recentSessions()}
              recentlyWatched={recentlyWatched()}
              recentVideos={recentVideos()}
            />
          </Show>

          {/* Settings Tab */}
          <Show when={activeTab() === "settings"}>
            <DashboardSettings
              stats={stats()}
              onExport={handleExport}
              onImport={handleImport}
            />
          </Show>
        </Show>
      </main>
    </div>
  );
}
