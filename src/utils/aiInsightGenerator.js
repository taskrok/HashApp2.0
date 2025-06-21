import { Trophy, Target, Sparkles, Award, TrendingUp } from 'lucide-react';

const getAverage = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

function checkRankedWinner(project, processedWinners) {
  const winner = processedWinners.find(w => 
    w.type === 'placement' &&
    w.strain === project.strain &&
    w.category.includes('Rosin')
  );

  if (winner) {
    return {
      icon: Trophy,
      title: `You're Processing a Champion!`,
      message: `${winner.strain} took #${winner.rank} place for ${winner.category} at the ${winner.event}. Keep refining this proven winner!`,
      confidence: 96,
      action: 'View Award Info'
    };
  }
  return null;
}

function checkSpecialAward(project, processedWinners) {
  const awardWinner = processedWinners.find(w =>
    w.type === 'award' &&
    w.strain === project.strain
  );
  
  if (awardWinner) {
    return {
      icon: Award,
      title: `Insight for ${awardWinner.strain}`,
      message: `This strain is known for winning '${awardWinner.award}'. The winning entry had: ${awardWinner.details}. See how your results compare!`,
      confidence: 93,
      action: 'Analyze Details'
    };
  }
  return null;
}

function findUntappedPotential(userProjects, processedWinners) {
  const processedStrains = new Set(userProjects.map(p => p.strain));
  const untappedWinner = processedWinners.find(
    w => w.type === 'placement' && w.rank === 1 && !processedStrains.has(w.strain)
  );

  if (untappedWinner) {
    return {
      icon: Sparkles,
      title: 'Explore a New Champion',
      message: `The strain '${untappedWinner.strain}' won 1st place at ${untappedWinner.event}. It could be a highly profitable strain to add to your roster.`,
      confidence: 91,
      action: 'Research Strain'
    };
  }
  return null;
}

export const generateAIInsights = (projects, processedWinners, context) => {
  const insights = [];
  const latestProject = projects.length > 0 ? projects[0] : null;

  if (latestProject) {
    const rankedInsight = checkRankedWinner(latestProject, processedWinners);
    if (rankedInsight) insights.push(rankedInsight);

    const awardInsight = checkSpecialAward(latestProject, processedWinners);
    if (awardInsight && !rankedInsight) insights.push(awardInsight);
  }
  
  if (insights.length < 2) {
    const untappedInsight = findUntappedPotential(projects, processedWinners);
    if (untappedInsight) insights.push(untappedInsight);
  }

  if (insights.length === 0 && projects.length > 0) {
    insights.push({
      icon: Target,
      title: 'Keep Up the Great Work',
      message: 'Your processes are running smoothly. Continue logging projects to uncover new patterns and optimization opportunities.',
      confidence: 90,
      action: 'Add Project'
    });
  }

  return insights.slice(0, 3);
};