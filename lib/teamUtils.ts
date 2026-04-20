import prisma from "./db";

/**
 * Generates unique team name suggestions based on a base name.
 */
export async function generateTeamNameSuggestions(baseName: string, count: number = 3): Promise<string[]> {
  const suggestions: string[] = [];
  let attempt = 1;

  // Suffixes for variety
  const suffixes = ["Elite", "Pro", "Squad", "Warriors", "Champions", "Legends"];
  let suffixIndex = 0;

  while (suggestions.length < count && attempt < 20) {
    let candidate: string;
    
    if (attempt <= 3) {
      // First 3 suggestions: numbers
      candidate = `${baseName} ${attempt}`;
    } else if (suffixIndex < suffixes.length) {
      // Next: suffixes
      candidate = `${baseName} ${suffixes[suffixIndex]}`;
      suffixIndex++;
    } else {
      // Random number if we ran out of suffixes
      candidate = `${baseName} ${Math.floor(Math.random() * 999)}`;
    }

    // Check if candidate exists in DB
    const existing = await prisma.team.findFirst({
      where: {
        name: {
          equals: candidate,
          mode: "insensitive",
        },
      },
    });

    if (!existing && !suggestions.includes(candidate)) {
      suggestions.push(candidate);
    }
    
    attempt++;
  }

  return suggestions;
}
