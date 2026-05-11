export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Food & Drink": [
    "starbucks", "mcdonalds", "restaurant", "cafe", "coffee", "pizza", "burger", 
    "uber eats", "doordash", "grocery", "supermarket", "walmart", "kroger", "whole foods",
    "dinner", "lunch", "breakfast", "snack"
  ],
  "Transport": [
    "uber", "lyft", "gas", "petrol", "shell", "chevron", "train", "bus", "subway", 
    "parking", "toll", "flight", "airline", "delta", "united", "auto"
  ],
  "Entertainment": [
    "netflix", "spotify", "hulu", "disney+", "cinema", "movie", "concert", "ticket",
    "game", "steam", "playstation", "xbox", "nintendo"
  ],
  "Utilities": [
    "electric", "water", "gas bill", "internet", "comcast", "verizon", "at&t", "phone",
    "garbage", "rent", "mortgage"
  ],
  "Shopping": [
    "amazon", "ebay", "target", "clothing", "shoes", "mall", "apple", "best buy"
  ],
  "Health": [
    "pharmacy", "cvs", "walgreens", "doctor", "dentist", "hospital", "gym", "fitness"
  ]
};

/**
 * Suggests a category based on the provided note.
 */
export function suggestCategory(note: string, availableCategories: { id: string; name: string }[]): string | null {
  if (!note) return null;

  const normalizedNote = note.toLowerCase();

  for (const [categoryName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => normalizedNote.includes(keyword.toLowerCase()))) {
      // Find the actual category ID from available categories that matches this name
      // We do a loose match on the name
      const found = availableCategories.find(c => 
        c.name.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(c.name.toLowerCase())
      );
      
      if (found) return found.id;
    }
  }

  return null;
}
