/**
 * Given a desired username (e.g. "mattfx"),
 * generate 3 suggestions in the style:
 *   1) Insert a dot somewhere (e.g. "matt.fx")
 *   2) Insert an underscore similarly (e.g. "matt_fx")
 *   3) Append a random 2-digit number (e.g. "mattfx65")
 */
export function generateUsernameSuggestions(username: string) {
  const splitPos = username.length - 2;
  const leftPart = username.substring(0, splitPos);
  const rightPart = username.substring(splitPos);

  const randomNum = Math.floor(Math.random() * 90) + 10;

  const suggestions = [
    `${leftPart}.${rightPart}`,
    `${leftPart}_${rightPart}`,
    `${username}${randomNum}`,
  ];

  return suggestions;
}
