import { For, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";
import { formatRelativeTime, type FavoriteVideo } from "../../lib/studyStore";

interface DashboardFavoritesProps {
  favorites: FavoriteVideo[];
  onRemoveFavorite: (videoId: string) => void;
}

export default function DashboardFavorites(props: DashboardFavoritesProps) {
  return (
    <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
      <h3 class="text-xl font-bold text-amber-400 mb-4">⭐ المفضلة</h3>
      <Show
        when={props.favorites.length > 0}
        fallback={
          <div class="text-center py-12 text-emerald-400">
            <div class="text-5xl mb-4">⭐</div>
            <p class="text-lg mb-2">لا توجد مفضلات بعد</p>
            <p class="text-sm text-emerald-500">أضف فيديوهات للمفضلة من صفحة الدرس</p>
          </div>
        }
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <For each={props.favorites}>
            {(fav) => {
              return (
                <div class="group relative bg-emerald-800/30 rounded-xl overflow-hidden border border-emerald-700/50">
                  <Link to="/study/$id" params={{ id: fav.videoId }}>
                    <img
                      src={fav.thumbnail}
                      alt={fav.title}
                      class="w-full aspect-video object-cover"
                    />
                  </Link>
                  <div class="p-3">
                    <Link
                      to="/study/$id"
                      params={{ id: fav.videoId }}
                      class="font-medium text-emerald-100 hover:text-amber-400 line-clamp-2 text-sm"
                    >
                      {fav.title}
                    </Link>
                    <div class="flex items-center justify-between mt-2">
                      <span class="text-xs text-emerald-500">
                        أضيف {formatRelativeTime(fav.addedAt)}
                      </span>
                      <button
                        onClick={() => props.onRemoveFavorite(fav.videoId)}
                        class="text-emerald-500 hover:text-red-400 transition-colors"
                        title="إزالة من المفضلة"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}
