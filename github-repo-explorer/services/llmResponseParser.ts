/**
 * Utility functions for parsing and cleaning responses from LLMs.
 */

/**
 * Strips Markdown code fences (e.g., ```json ... ``` or ``` ... ```) from a string.
 *
 * @param rawText The raw text string, potentially containing code fences.
 * @returns The content within the code fences, or the original trimmed text if no fences are found.
 */
export function stripMarkdownCodeFences(rawText: string): string {
  if (typeof rawText !== 'string') {
    return ''; // Or throw an error, depending on desired strictness
  }
  const text = rawText.trim();
  // Regex to match markdown code fences: ```[language]\n[code]\n``` or ```\n[code]\n```
  // It captures the language (optional) and the content.
  // s flag allows . to match newline characters.
  const fenceRegex = /^```(?:\w*\s*)?\n?([\s\S]*?)\n?```$/s;
  const match = text.match(fenceRegex);

  if (match && typeof match[1] === 'string') { // Group 1 is the content
    return match[1].trim();
  }
  return text; // Return original trimmed text if no fences
}

/**
 * Parses a JSON string, typically from an LLM response, after attempting to strip Markdown code fences.
 *
 * @param rawText The raw text string from the LLM.
 * @template T The expected type of the parsed JSON object.
 * @returns The parsed JSON object of type T, or null if parsing fails or input is invalid.
 */
export function parseJsonFromLlmResponse<T>(rawText: string | null | undefined): T | null {
  if (rawText === null || rawText === undefined || typeof rawText !== 'string' || rawText.trim() === '') {
    console.warn("[llmResponseParser] Input to parseJsonFromLlmResponse was null, undefined, or empty.");
    return null;
  }

  const cleanedText = stripMarkdownCodeFences(rawText);
  if (cleanedText === '') {
    console.warn("[llmResponseParser] Text became empty after stripping fences.");
    return null;
  }

  try {
    const parsedData = JSON.parse(cleanedText) as T;
    return parsedData;
  } catch (error) {
    console.warn("[llmResponseParser] Failed to parse JSON from LLM response. Error:", error, "Cleaned text was (first 500 chars):", cleanedText.substring(0, 500));
    return null;
  }
}
