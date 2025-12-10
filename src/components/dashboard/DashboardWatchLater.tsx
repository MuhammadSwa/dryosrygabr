import { For, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";
import { formatRelativeTime, type WatchLaterItem } from "../../lib/studyStore";

interface DashboardWatchLaterProps {
  watchLater: WatchLaterItem[];
  onRemoveWatchLater: (videoId: string) => void;
}

export default function DashboardWatchLater(props: DashboardWatchLaterProps) {
  return (
    <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
      <h3 class="text-xl font-bold text-amber-400 mb-4">📋 شاهد لاحقاً</h3>
      <Show
        when={props.watchLater.length > 0}
        fallback={
          <div class="text-center py-12 text-emerald-400">
            <div class="text-5xl mb-4">📋</div>
            <p class="text-lg mb-2">قائمة المشاهدة فارغة</p>
            <p class="text-sm text-emerald-500">أضف فيديوهات للمشاهدة لاحقاً من صفحة الدرس</p>
          </div>
        }
      >
        <div class="space-y-3">
          <For each={props.watchLater}>
            {(item, index) => {
              const priorityColors = {
                high: "border-red-500/50 bg-red-500/10",
                medium: "border-amber-500/50 bg-amber-500/10",
                low: "border-emerald-500/50 bg-emerald-500/10",
              };
              const priorityLabels = {
                high: "عالي",
                medium: "متوسط",
                low: "منخفض",
              };
              const priority = (item.priority || "medium") as "high" | "medium" | "low";
              return (
                <div class={`flex gap-4 p-4 rounded-xl border ${priorityColors[priority]}`}>
                  <span class="text-emerald-500 font-mono text-lg shrink-0">{index() + 1}</span>
                  <Link to="/study/$id" params={{ id: item.videoId }} class="shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      class="w-32 aspect-video object-cover rounded-lg"
                    />
                  </Link>
                  <div class="flex-1 min-w-0">
                    <Link
                      to="/study/$id"
                      params={{ id: item.videoId }}
                      class="font-medium text-emerald-100 hover:text-amber-400 line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <div class="flex items-center gap-3 mt-2 text-sm">
                      <span class={`px-2 py-0.5 rounded text-xs ${
                        priority === "high" ? "bg-red-500/20 text-red-300" :
                        priority === "medium" ? "bg-amber-500/20 text-amber-300" :
                        "bg-emerald-500/20 text-emerald-300"
                      }`}>
                        {priorityLabels[priority]}
                      </span>
                      <span class="text-emerald-500">
                        أضيف {formatRelativeTime(item.addedAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => props.onRemoveWatchLater(item.videoId)}
                    class="shrink-0 p-2 text-emerald-500 hover:text-red-400 transition-colors"
                    title="إزالة"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}
