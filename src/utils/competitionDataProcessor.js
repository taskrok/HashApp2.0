/**
 * Processes the raw, normalized competition data into a single, enriched list for easy use.
 */
export const processCompetitionData = ({ placements, eventAwards, events, competitions }) => {
  const eventMap = new Map(events.map(event => [event.eventId, event]));
  const competitionMap = new Map(competitions.map(comp => [comp.competitionId, comp]));

  const processedWinners = [];

  // Process ranked placements
  placements.forEach(placement => {
    const event = eventMap.get(placement.eventId);
    if (!event) return;
    const competition = competitionMap.get(event.competitionId);

    processedWinners.push({
      type: 'placement',
      strain: placement.entryNameRaw,
      category: placement.category, // e.g., "Solventless - Rosin"
      rank: placement.rank,
      winner: placement.winnerNameRaw,
      event: event.name,
      competition: competition ? competition.name : 'Unknown Competition',
      year: event.year,
    });
  });

  // Process special awards
  eventAwards.forEach(award => {
    const event = eventMap.get(award.eventId);
    if (!event) return;
    const competition = competitionMap.get(event.competitionId);

    processedWinners.push({
      type: 'award',
      strain: award.strain,
      category: award.category,
      award: award.awardName, // e.g., "Highest Terpenes"
      winner: award.winnerNameRaw,
      details: award.details, // e.g., "5.12%"
      event: event.name,
      competition: competition ? competition.name : 'Unknown Competition',
      year: event.year,
    });
  });

  return processedWinners;
};