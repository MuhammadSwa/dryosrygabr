import { For, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";
import { formatDuration, type GlobalStats } from "../../lib/studyStore";
import type { VideoDetails } from "../../lib/staticData";

interface DashboardOverviewProps {
  stats: GlobalStats | null;
  recentlyWatched: { videoId: string; lastWatched: string; percentage: number }[];
  recentVideos: Record<string, VideoDetails>;
}

export default function DashboardOverview(props: DashboardOverviewProps) {
  return (
    <div class="space-y-8">
      {/* Stats Grid */}
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50 text-center">
          <div class="text-4xl font-bold text-amber-400 mb-2">{props.stats?.totalVideosWatched || 0}</div>
          <div class="text-emerald-300">فيديو شوهد</div>
        </div>
        <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50 text-center">
          <div class="text-4xl font-bold text-green-400 mb-2">{props.stats?.totalVideosCompleted || 0}</div>
          <div class="text-emerald-300">فيديو مكتمل</div>
        </div>
        <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50 text-center">
          <div class="text-4xl font-bold text-blue-400 mb-2">{props.stats?.totalNotes || 0}</div>
          <div class="text-emerald-300">ملاحظة</div>
        </div>
        <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50 text-center">
          <div class="text-4xl font-bold text-purple-400 mb-2">{props.stats?.totalBookmarks || 0}</div>
          <div class="text-emerald-300">علامة مرجعية</div>
        </div>
        <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50 text-center">
          <div class="text-4xl font-bold text-orange-400 mb-2">{props.stats?.currentStreak || 0}</div>
          <div class="text-emerald-300">يوم متتالي 🔥</div>
        </div>
      </div>

      {/* Streak & Time Cards */}
      <div class="grid md:grid-cols-2 gap-6">
        {/* Study Streak */}
        <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
          <h3 class="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            🔥 سلسلة الدراسة
          </h3>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-5xl font-bold text-orange-400">{props.stats?.currentStreak || 0}</div>
              <div class="text-emerald-400">يوم متتالي</div>
            </div>
            <div class="text-left">
              <div class="text-emerald-300 mb-1">أطول سلسلة</div>
              <div class="text-2xl font-bold text-emerald-100">{props.stats?.longestStreak || 0} يوم</div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-emerald-700/50">
            <p class="text-emerald-400 text-sm">
              {props.stats?.currentStreak === 0 
                ? "ابدأ بمشاهدة درس اليوم لبناء سلسلتك! 💪"
                : `أحسنت! استمر في الدراسة للحفاظ على سلسلتك 🌟`
              }
            </p>
          </div>
        </div>

        {/* Total Watch Time */}
        <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
          <h3 class="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            ⏱️ وقت المشاهدة
          </h3>
          <div class="text-3xl font-bold text-emerald-100 mb-2">
            {formatDuration(props.stats?.totalWatchTime || 0)}
          </div>
          <div class="text-emerald-400">إجمالي وقت الدراسة</div>
          <div class="mt-4 pt-4 border-t border-emerald-700/50">
            <div class="flex justify-between text-sm">
              <span class="text-emerald-400">متوسط التقييم</span>
              <span class="text-amber-400 font-bold">
                {props.stats?.averageRating || 0} ★
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Watched */}
      <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
        <h3 class="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
          🕐 شوهد مؤخراً
        </h3>
        <Show
          when={props.recentlyWatched.length > 0}
          fallback={
            <div class="text-center py-8 text-emerald-400">
              <div class="text-4xl mb-2">📺</div>
              <p>لم تشاهد أي فيديو بعد</p>
              <Link to="/study" class="text-amber-400 hover:text-amber-300 mt-2 inline-block">
                ابدأ المشاهدة الآن ←
              </Link>
            </div>
          }
        >
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <For each={props.recentlyWatched.slice(0, 5)}>
              {(item) => {
                const video = props.recentVideos[item.videoId];
                return (
                  <Link
                    to="/study/$id"
                    params={{ id: item.videoId }}
                    class="group relative rounded-xl overflow-hidden border border-emerald-700/50 hover:border-amber-500/50 transition-all"
                  >
                    <img
                      src={video?.thumbnail || `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`}
                      alt={video?.title || "فيديو"}
                      class="w-full aspect-video object-cover"
                    />
                    {/* Progress bar */}
                    <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                      <div
                        class="h-full bg-amber-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span class="text-white text-xs line-clamp-2">{video?.title || "فيديو"}</span>
                    </div>
                    <Show when={item.percentage === 100}>
                      <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                        ✓
                      </div>
                    </Show>
                  </Link>
                );
              }}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
