import { type GlobalStats } from "../../lib/studyStore";

interface DashboardSettingsProps {
  stats: GlobalStats | null;
  onExport: () => void;
  onImport: () => void;
}

export default function DashboardSettings(props: DashboardSettingsProps) {
  return (
    <div class="max-w-2xl space-y-6">
      {/* Export/Import */}
      <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
        <h3 class="text-xl font-bold text-amber-400 mb-4">💾 النسخ الاحتياطي</h3>
        <p class="text-emerald-300 mb-4">
          قم بتصدير بياناتك للاحتفاظ بنسخة احتياطية أو نقلها لجهاز آخر
        </p>
        <div class="flex gap-4">
          <button
            onClick={props.onExport}
            class="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 rounded-lg font-medium transition-colors"
          >
            📤 تصدير البيانات
          </button>
          <button
            onClick={props.onImport}
            class="flex-1 px-4 py-3 bg-emerald-700 hover:bg-emerald-600 text-emerald-50 rounded-lg font-medium transition-colors"
          >
            📥 استيراد البيانات
          </button>
        </div>
      </div>

      {/* Data Summary */}
      <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
        <h3 class="text-xl font-bold text-amber-400 mb-4">📊 ملخص البيانات</h3>
        <div class="space-y-3">
          <div class="flex justify-between py-2 border-b border-emerald-700/50">
            <span class="text-emerald-300">فيديوهات شوهدت</span>
            <span class="text-emerald-100 font-medium">{props.stats?.totalVideosWatched || 0}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-emerald-700/50">
            <span class="text-emerald-300">فيديوهات مكتملة</span>
            <span class="text-emerald-100 font-medium">{props.stats?.totalVideosCompleted || 0}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-emerald-700/50">
            <span class="text-emerald-300">إجمالي الملاحظات</span>
            <span class="text-emerald-100 font-medium">{props.stats?.totalNotes || 0}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-emerald-700/50">
            <span class="text-emerald-300">إجمالي العلامات</span>
            <span class="text-emerald-100 font-medium">{props.stats?.totalBookmarks || 0}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-emerald-700/50">
            <span class="text-emerald-300">المفضلة</span>
            <span class="text-emerald-100 font-medium">{props.stats?.favoriteCount || 0}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-emerald-300">شاهد لاحقاً</span>
            <span class="text-emerald-100 font-medium">{props.stats?.watchLaterCount || 0}</span>
          </div>
        </div>
      </div>

      {/* About */}
      <div class="bg-emerald-900/50 rounded-2xl p-6 border border-emerald-700/50">
        <h3 class="text-xl font-bold text-amber-400 mb-4">ℹ️ عن المكتبة</h3>
        <p class="text-emerald-300 leading-relaxed">
          مركز دراسة متكامل لمتابعة دروس فضيلة الدكتور يسري جبر. 
          يتيح لك تدوين الملاحظات، وإضافة العلامات المرجعية، 
          وتتبع تقدمك في الدراسة، والاستئناف من حيث توقفت.
        </p>
      </div>
    </div>
  );
}
