import { For, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";
import { formatDuration, formatRelativeTime, type StudySession } from "../../lib/studyStore";
import type { VideoDetails } from "../../lib/staticData";

interface DashboardHistoryProps {
  recentSessions: StudySession[];
  recentlyWatched: { videoId: string; lastWatched: string; percentage: number }[];
  recentVideos: Record<string, VideoDetails>;
}

export default function DashboardHistory(props: DashboardHistoryProps) {
  return (
    <div class="space-y-6">
      {/* Recent Sessions */}
      <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
        <h3 class="text-xl font-bold text-amber-400 mb-4">📚 جلسات الدراسة</h3>
        <Show
          when={props.recentSessions.length > 0}
          fallback={
            <div class="text-center py-8 text-emerald-400">
              <div class="text-4xl mb-2">📚</div>
              <p>لا توجد جلسات دراسة مسجلة</p>
            </div>
          }
        >
          <div class="space-y-3">
            <For each={props.recentSessions}>
              {(session) => (
                <div class="flex items-center gap-4 p-4 bg-emerald-800/30 rounded-xl">
                  <div class="shrink-0 w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <span class="text-xl">📖</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <Link
                      to="/study/$id"
                      params={{ id: session.videoId }}
                      class="font-medium text-emerald-100 hover:text-amber-400 line-clamp-1"
                    >
                      {session.videoTitle}
                    </Link>
                    <div class="flex items-center gap-3 mt-1 text-sm text-emerald-400">
                      <span>{formatDuration(session.duration)}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(session.startTime)}</span>
                      <Show when={session.focusMode}>
                        <span class="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                          وضع التركيز
                        </span>
                      </Show>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* All Watched Videos */}
      <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
        <h3 class="text-xl font-bold text-amber-400 mb-4">🕐 سجل المشاهدة</h3>
        <Show
          when={props.recentlyWatched.length > 0}
          fallback={
            <div class="text-center py-8 text-emerald-400">
              <div class="text-4xl mb-2">🕐</div>
              <p>لا يوجد سجل مشاهدة</p>
            </div>
          }
        >
          <div class="space-y-2">
            <For each={props.recentlyWatched}>
              {(item) => {
                const video = props.recentVideos[item.videoId];
                return (
                  <Link
                    to="/study/$id"
                    params={{ id: item.videoId }}
                    class="flex items-center gap-4 p-3 bg-emerald-800/20 rounded-xl hover:bg-emerald-800/40 transition-colors"
                  >
                    <img
                      src={video?.thumbnail || `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`}
                      alt={video?.title}
                      class="w-24 aspect-video object-cover rounded-lg shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-emerald-100 line-clamp-1">
                        {video?.title || "فيديو"}
                      </div>
                      <div class="text-sm text-emerald-400 mt-1">
                        {formatRelativeTime(item.lastWatched)}
                      </div>
                    </div>
                    <div class="shrink-0 text-left">
                      <div class="text-amber-400 font-bold">{item.percentage}%</div>
                      <div class="w-16 h-1.5 bg-emerald-700 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-amber-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
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
