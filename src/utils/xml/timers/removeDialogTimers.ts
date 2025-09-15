const TIMER_MAX_SECONDS = 600;
const NO_TIMER_ATTRIBUTE = 'time_limit="0"';

/**
 * Removes short dialog timers in the given XML content.
 *
 * @param {string} xmlContent - The `topic.xml` content containing dialog timer attributes.
 * @returns {string} A new XML string with the same format with timers removed.
 */
const removeDialogTimers = (xmlContent: string): string => {
  const timerRegex = /time_limit="(\d+)"/g;

  return xmlContent.replace(timerRegex, (match, timeLimit) => {
    const seconds = Number(timeLimit);
    const hasShortDuration = seconds > 0 && seconds < TIMER_MAX_SECONDS;

    return hasShortDuration ? NO_TIMER_ATTRIBUTE : match;
  });
};
