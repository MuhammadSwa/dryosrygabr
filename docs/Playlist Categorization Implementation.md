## Playlist Categorization Implementation
- Playlists are categorized automatically based on keyword matching in their titles. Here's how it works:

1. Category Keywords Configuration (sync.ts lines 21-32)
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "تصوف": ["تصوف", "صوفي", "الحضرة", "الأوراد", "ذكر", "مجلس"],
  "فقه": ["فقه", "الفقه", "شافعي", "حنفي", "مالكي", "حنبلي", "أحكام"],
  "تفسير": ["تفسير", "القرآن", "سورة", "آية"],
  "حديث": ["حديث", "البخاري", "مسلم", "الأربعين", "النووي"],
  "عقيدة": ["عقيدة", "توحيد", "إيمان", "أشعري"],
  "سيرة": ["سيرة", "النبي", "الرسول", "محمد"],
  "ردود": ["رد", "ردود", "شبه", "دفاع"],
  "صلوات": ["صلوات", "صلاة", "صلى"],
  "خطب": ["خطبة", "خطب", "جمعة"],
  "متنوع": [], // Default fallback category
}
2. Category Inference Function (sync.ts lines 205-215)
function inferCategory(title: string): string {
  const lower = title.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k.toLowerCase()))) {
      return cat
    }
  }
  return "متنوع" // Default if no keywords match
}
3. Assignment During Playlist Fetching (line 117)
- When playlists are fetched from YouTube, the category is assigned:
category: inferCategory(item.snippet.title)

-How It Works:
-Fetches playlist from YouTube → Gets the playlist title
-Checks title against keywords → Searches for specific Arabic keywords in the title
-Assigns first matching category → Returns the first category whose keywords match
-Falls back to "متنوع" → If no keywords match, assigns "متنوع" (Miscellaneous)
Examples from your data:
"شرح البرهان في علوم القرآن" → Contains "القرآن" → تفسير
"شرح صحيح البخاري" → Contains "البخاري" → حديث
"خطب الجمعة" → Contains "خطب" and "جمعة" → خطب
"الصلوات اليسرية" → Contains "الصلوات" → صلوات
Videos in playlists inherit the playlist's category for filtering purposes
