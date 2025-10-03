const MAX_SECONDS_THRESHOLD = 600;
const NO_TIMER_ATTRIBUTE = 'time_limit="0"';

/**
 * @note This function is intended to work with `topic.xml` translations.
 *
 * Removes short dialog timers in the given XML content.
 *
 * @param {string} xmlContent - The `topic.xml` content containing dialog timer attributes.
 * @returns {string} A new XML string with the same format with timers removed.
 */
export const transformDialogTimers = (
  xmlContent: string,
  maxSecondsThreshold = MAX_SECONDS_THRESHOLD,
): string => {
  const timerRegex = /time_limit="(\d+)"/g;

  return xmlContent.replace(timerRegex, (match, timeLimit) => {
    const seconds = Number(timeLimit);
    const hasShortDuration = seconds > 0 && seconds < maxSecondsThreshold;

    return hasShortDuration ? NO_TIMER_ATTRIBUTE : match;
  });
};
