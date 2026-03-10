/**
 * Parses title options from a Stage 7 (Closer) output.
 * Expects a TITLE OPTIONS section with lines in the format:
 *   - Title Name: one sentence explanation
 * OR
 *   * Title Name: one sentence explanation
 * OR just numbered/bulleted title lines.
 * Returns an array of title strings (without the explanation).
 */
export function parseTitles(closerOutput: string): string[] {
    const section = closerOutput.match(/TITLE OPTIONS([\s\S]*?)(?=BLURB|$)/i)?.[1] || '';
    const lines = section.split('\n').filter(l => l.trim());
    const titles: string[] = [];
    for (const line of lines) {
        // Match lines like: "- The Fissure in the Gold: Emphasises..."
        // or "* The Fissure in the Gold — Emphasises..."
        // or "1. The Fissure in the Gold: ..."
        const match = line.match(/^[\-\*\d\.\s]+([^:\-–—]+)[:\-–—]/);
        if (match) {
            const title = match[1].trim();
            if (title.length > 0 && title.length < 100) {
                titles.push(title);
            }
        }
    }
    // Fallback: if parsing found nothing, return a single option from the project title
    return titles.length > 0 ? titles : [];
}
