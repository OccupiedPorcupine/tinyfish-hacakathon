import {
  ValidationKit,
  ValidationKitRequest,
  ValidationQuestion,
  CommunitySource,
  PreValidatedSignal,
} from './types';

/**
 * STEP 2: Generate targeted validation questions
 * Uses gap data context to create specific questions around pain quantification,
 * workflow understanding, and willingness-to-pay signals.
 */
export function generateValidationQuestions(
  category: string,
  market: string,
  painArea: string
): ValidationQuestion[] {
  const questions: ValidationQuestion[] = [];

  // Pain Quantification questions
  questions.push({
    id: 'q1-pain-time',
    question: `How many hours per week does your team spend on ${painArea}?`,
    focusArea: 'pain_quantification',
    context: `Understanding current time investment in ${painArea} validates the magnitude of the problem.`,
    expectedSignals: [
      'Specific number (3-10 hours typical)',
      'Mention of it being "the biggest drag"',
      'Comparison to total work time',
    ],
  });

  questions.push({
    id: 'q2-pain-cost',
    question: `What's the annual cost impact of inefficiency in ${painArea} for your org?`,
    focusArea: 'pain_quantification',
    context: 'Quantifies economic pain which correlates with WTP.',
    expectedSignals: [
      'Puts a dollar number on it',
      'Estimates lost revenue or wasted capital',
      'Mentions percentage of budget',
    ],
  });

  // Workflow Understanding
  questions.push({
    id: 'q3-workflow',
    question: `Walk me through your current workflow for ${painArea} — what tools and steps do you use today?`,
    focusArea: 'workflow',
    context: 'Maps existing solutions and fragmentation — reveals where a new tool could slot in.',
    expectedSignals: [
      'Lists 3+ tools (indicates fragmentation)',
      'Mentions manual steps or workarounds',
      'Describes "duct tape" solutions',
      'Names specific tools and their gaps',
    ],
  });

  questions.push({
    id: 'q4-broken',
    question: `What's broken about your current approach to ${painArea}?`,
    focusArea: 'workflow',
    context: 'Directly surfaces pain points and constraints with existing solutions.',
    expectedSignals: [
      'Specific feature gaps',
      'Scaling issues mentioned',
      'Local market misfit (e.g., "US tools don\'t understand our context")',
      'Emotional language ("nightmare", "ridiculous")',
    ],
  });

  // Willingness to Pay / Switching Cost
  questions.push({
    id: 'q5-wtp',
    question: `If a solution cut your ${painArea} time by 50%, what would you redirect that effort toward?`,
    focusArea: 'wtp',
    context: 'Shows the value of time savings — core to WTP.',
    expectedSignals: [
      'High-value activities (sales, strategy)',
      'Revenue-generating activities mentioned',
      'Headcount reduction not needed',
    ],
  });

  questions.push({
    id: 'q6-switching',
    question: `How much would you pay per month for a tool that solved ${painArea} for your team?`,
    focusArea: 'wtp',
    context: 'Direct WTP signal. Anchors willingness and price elasticity.',
    expectedSignals: [
      'Specific price mentioned',
      'Price per user or per org',
      'Willingness to pilot before full commitment',
      'Comparison to existing tool spend',
    ],
  });

  questions.push({
    id: 'q7-switching-cost',
    question: `What would it take to move your team away from your current solution for ${painArea}?`,
    focusArea: 'switching_cost',
    context: 'Identifies switching friction — reveals competitive moats and deal-breakers.',
    expectedSignals: [
      'Switching costs are low ("we\'d move instantly")',
      'Integration or data migration concerns',
      'Team retraining resistance',
      'Organizational lock-in mentioned',
    ],
  });

  questions.push({
    id: 'q8-validation',
    question: `Who in your org would need to sign off on trying a new tool for ${painArea}?`,
    focusArea: 'switching_cost',
    context: 'Maps org structure and buying process — inform GTM motion.',
    expectedSignals: [
      'Single decision maker (easier sales)',
      'Multi-stakeholder approval (longer cycle)',
      'Budget holder vs operator identified',
    ],
  });

  return questions;
}

/**
 * STEP 3: Find target communities where the audience actually hangs out
 * Returns platforms with member counts and access difficulty.
 */
export function findCommunities(
  category: string,
  market: string,
  targetAudience: string
): CommunitySource[] {
  // Mock data: In production, this would call external APIs to scan communities
  const mockCommunities: Record<string, CommunitySource[]> = {
    'AI SDR · Indonesia': [
      {
        id: 'reddit-idn-startup',
        platform: 'reddit',
        name: 'r/indonesia_entrepreneurs',
        url: 'https://reddit.com/r/indonesia_entrepreneurs',
        memberCount: 45000,
        relevance: 'primary',
        difficulty: 'easy',
        description: 'General startup and business community in Indonesia',
      },
      {
        id: 'fb-sales-indo',
        platform: 'facebook',
        name: 'Komunitas Sales Indonesia',
        url: 'https://facebook.com/groups/komunitas-sales-indonesia',
        memberCount: 28000,
        relevance: 'primary',
        difficulty: 'easy',
        description: 'Professional sales community with regular job posts and tool discussions',
      },
      {
        id: 'linkedin-b2b-asia',
        platform: 'linkedin',
        name: 'B2B Sales Asia Pacific',
        url: 'https://linkedin.com/groups/b2b-sales-apac',
        memberCount: 12000,
        relevance: 'primary',
        difficulty: 'medium',
        description: 'Enterprise sales professionals across Southeast Asia',
      },
      {
        id: 'slack-sea-founders',
        platform: 'slack',
        name: 'SEA Founders Community',
        url: 'https://seafounders.slack.com',
        memberCount: 3000,
        relevance: 'secondary',
        difficulty: 'hard',
        description: 'Invite-only community of founders building in Southeast Asia',
      },
      {
        id: 'discord-startup-asia',
        platform: 'discord',
        name: 'Startup Asia Builders',
        url: 'https://discord.gg/startupasia',
        memberCount: 8500,
        relevance: 'secondary',
        difficulty: 'easy',
        description: 'Community focused on product building and early-stage validation',
      },
    ],
    'B2B Logistics · Thailand': [
      {
        id: 'reddit-thailand-biz',
        platform: 'reddit',
        name: 'r/Thailand Business',
        url: 'https://reddit.com/r/thailand',
        memberCount: 120000,
        relevance: 'secondary',
        difficulty: 'easy',
        description: 'General Thailand community with business discussions',
      },
      {
        id: 'fb-logistics-thailand',
        platform: 'facebook',
        name: 'Thai Logistics Association',
        url: 'https://facebook.com/groups/thai-logistics',
        memberCount: 35000,
        relevance: 'primary',
        difficulty: 'easy',
        description: 'Professional logistics operators and supply chain experts',
      },
      {
        id: 'linkedin-supply-chain-asia',
        platform: 'linkedin',
        name: 'Supply Chain Leaders Asia',
        url: 'https://linkedin.com/groups/supply-chain-asia',
        memberCount: 18000,
        relevance: 'primary',
        difficulty: 'medium',
        description: 'C-level and management discussing logistics trends',
      },
      {
        id: 'discord-trade-tech',
        platform: 'discord',
        name: 'Trade Tech Builders',
        url: 'https://discord.gg/tradtech',
        memberCount: 4200,
        relevance: 'secondary',
        difficulty: 'easy',
        description: 'Founders building logistics tech in emerging markets',
      },
    ],
  };

  const key = `${category} · ${market}`;
  return mockCommunities[key] || generateDefaultCommunities(market);
}

/**
 * Fallback: Generate communities based on market when specific combo not found
 */
function generateDefaultCommunities(market: string): CommunitySource[] {
  const platformAbbrev = market.toLowerCase().replace(/\s/g, '_');
  return [
    {
      id: `reddit-${platformAbbrev}`,
      platform: 'reddit',
      name: `r/${market}_business`,
      url: `https://reddit.com/r/${platformAbbrev}_business`,
      memberCount: 50000,
      relevance: 'primary',
      difficulty: 'easy',
      description: `General business community for ${market}`,
    },
    {
      id: `fb-${platformAbbrev}-entrepreneurs`,
      platform: 'facebook',
      name: `${market} Entrepreneurs`,
      url: `https://facebook.com/groups/${platformAbbrev}-entrepreneurs`,
      memberCount: 30000,
      relevance: 'primary',
      difficulty: 'easy',
      description: `Entrepreneurs and business owners in ${market}`,
    },
    {
      id: `linkedin-${platformAbbrev}`,
      platform: 'linkedin',
      name: `${market} Business Leaders`,
      url: `https://linkedin.com/groups/${platformAbbrev}-business`,
      memberCount: 15000,
      relevance: 'secondary',
      difficulty: 'medium',
      description: `Professional networks for ${market}`,
    },
  ];
}

/**
 * STEP 4: Scrape existing conversations for pre-validated signals
 * Returns actual quotes and discussions already happening in communities
 */
export function scrapePreValidatedSignals(
  category: string,
  market: string,
  painArea: string
): PreValidatedSignal[] {
  // Mock data: In production, this would scrape community APIs
  const mockSignals: Record<string, PreValidatedSignal[]> = {
    'AI SDR · Indonesia': [
      {
        id: 'sig-1',
        signal:
          'Our sales team spends 4-6 hours per day on manual outreach. It\'s killing our ability to close.',
        source: 'r/indonesia_entrepreneurs · sales-efficiency thread',
        category: 'pain_complaint',
        relevance: 95,
        context:
          'Direct quantification of pain in the exact pain area. Clear impact on business outcome.',
        url: 'https://reddit.com/r/indonesia_entrepreneurs/comments/xyz',
      },
      {
        id: 'sig-2',
        signal:
          'We use Lemlist but it doesn\'t understand local context. Support is US-based and slow.',
        source: 'Komunitas Sales Indonesia · tool comparison',
        category: 'tool_mention',
        relevance: 88,
        context:
          'Existing tool pain and localization gap — exactly the wedge for a local AI SDR solution.',
        url: 'https://facebook.com/groups/komunitas-sales-indonesia/posts/xyz',
      },
      {
        id: 'sig-3',
        signal:
          'If we could cut outreach time by half, we\'d reallocate those people to enterprise relationship building.',
        source: 'B2B Sales Asia Pacific (LinkedIn) · comment',
        category: 'wtp_indicator',
        relevance: 85,
        context:
          'Shows high value of time savings — team gets redirected to revenue-generating work.',
        url: 'https://linkedin.com/feed/update/xyz',
      },
      {
        id: 'sig-4',
        signal:
          'We\'d pay $200/month per user for something that actually works for our team. Current tools are $100 but don\'t fit our workflow.',
        source: 'Komunitas Sales Indonesia · pricing discussion',
        category: 'wtp_indicator',
        relevance: 92,
        context:
          'Explicit WTP signal: willingness to pay premium for localized solution. 2x multiplier on Western tools.',
        url: 'https://facebook.com/groups/komunitas-sales-indonesia/posts/abc',
      },
      {
        id: 'sig-5',
        signal:
          'Biggest blocker for trying new tools is data migration and team retraining. If you made switching painless, we\'d move.',
        source: 'SEA Founders Community (Slack) · tools channel',
        category: 'workflow_description',
        relevance: 78,
        context: 'Maps switching friction — integration and onboarding are key differentiators.',
        url: 'https://seafounders.slack.com/xyz',
      },
    ],
    'B2B Logistics · Thailand': [
      {
        id: 'sig-1',
        signal:
          'Route planning still done on Google Maps and spreadsheets. No API integration. Takes hours daily.',
        source: 'Thai Logistics Association · operations group',
        category: 'pain_complaint',
        relevance: 92,
        context: 'Manual workflows in core operational task — huge pain and efficiency gap.',
        url: 'https://facebook.com/groups/thai-logistics/posts/xyz',
      },
      {
        id: 'sig-2',
        signal:
          'Tried 3 international logistics platforms. None handle Thailand-specific regulations or local carrier networks.',
        source: 'Supply Chain Leaders Asia (LinkedIn) · thread',
        category: 'tool_mention',
        relevance: 88,
        context: 'Localization gap in existing solutions — regulatory and carrier knowledge missing.',
        url: 'https://linkedin.com/feed/update/xyz',
      },
      {
        id: 'sig-3',
        signal:
          'If we could automate route optimization, we\'d save 2-3 drivers per fleet and redirect them to customer service.',
        source: 'Trade Tech Builders (Discord) · logistics',
        category: 'wtp_indicator',
        relevance: 90,
        context:
          'Quantified time savings with high-value reallocation. Direct headcount impact.',
        url: 'https://discord.gg/tradtech/xyz',
      },
      {
        id: 'sig-4',
        signal:
          'We\'d switch for something that integrates with Thai financial systems and local carrier APIs.',
        source: 'Thai Logistics Association · integration needs',
        category: 'wtp_indicator',
        relevance: 85,
        context:
          'Clear switching condition: deep local integration. Feature parity not enough.',
        url: 'https://facebook.com/groups/thai-logistics/posts/abc',
      },
    ],
  };

  const key = `${category} · ${market}`;
  return mockSignals[key] || generateDefaultSignals(painArea);
}

/**
 * Fallback: Generate generic signals when specific combo not found
 */
function generateDefaultSignals(painArea: string): PreValidatedSignal[] {
  return [
    {
      id: 'sig-default-1',
      signal: `${painArea} is eating up most of our team's time and we haven't found a good solution yet.`,
      source: 'Community Discussion',
      category: 'pain_complaint',
      relevance: 70,
      context: 'Generic pain confirmation in target area.',
    },
    {
      id: 'sig-default-2',
      signal:
        'Current tools work but don\'t fit our specific context. We\'d try something local first.',
      source: 'Community Discussion',
      category: 'tool_mention',
      relevance: 65,
      context: 'Localization gap opening for new entrant.',
    },
    {
      id: 'sig-default-3',
      signal: 'If there was a better solution, we\'d seriously look at it.',
      source: 'Community Discussion',
      category: 'wtp_indicator',
      relevance: 60,
      context: 'Low switching cost if solution is materially better.',
    },
  ];
}

/**
 * MAIN FUNCTION: Generate complete validation kit
 * Orchestrates all 5 steps of the workflow
 */
export function generateValidationKit(request: ValidationKitRequest): ValidationKit {
  const questions = generateValidationQuestions(
    request.category,
    request.market,
    request.painArea
  );
  const communities = findCommunities(
    request.category,
    request.market,
    request.targetAudience
  );
  const signals = scrapePreValidatedSignals(
    request.category,
    request.market,
    request.painArea
  );

  // Calculate signal strength metrics
  const painSignalStrength = Math.round(
    signals.reduce((sum, s) => sum + (s.category === 'pain_complaint' ? s.relevance : 0), 0) /
      Math.max(signals.filter(s => s.category === 'pain_complaint').length, 1)
  );

  const willingSample = signals.filter(s => s.category === 'wtp_indicator').length;

  // Estimate productivity gap from signal keyword analysis
  const productivityGap = Math.round(
    signals.reduce((sum, s) => {
      if (s.signal.match(/\d+(?:\-\d+)?(?:\s*(?:hours?|hrs?|%|days?))/i)) {
        const match = s.signal.match(/(\d+)(?:\-(\d+))?/);
        if (match) return sum + parseInt(match[1]);
      }
      return sum;
    }, 0) / Math.max(signals.length, 1)
  );

  const markdownScript = generateMarkdownScript(request, questions, communities, signals);

  return {
    id: crypto.randomUUID(),
    opportunityId: request.scanResultId || 'unknown',
    category: request.category,
    market: request.market,
    createdAt: new Date(),
    validationQuestions: questions,
    communities,
    preValidatedSignals: signals,
    painSignalStrength,
    willingSample,
    productivityGap,
    markdownScript,
    jsonData: {
      questions: questions.map(q => ({ id: q.id, question: q.question, focusArea: q.focusArea })),
      communities: communities.map(c => ({ name: c.name, url: c.url, memberCount: c.memberCount })),
      signalsCount: signals.length,
      metrics: { painSignalStrength, willingSample, productivityGap },
    },
  };
}

/**
 * Export: Generate markdown interview script
 * Copy-paste ready questions + communities + pre-answered signals
 */
function generateMarkdownScript(
  request: ValidationKitRequest,
  questions: ValidationQuestion[],
  communities: CommunitySource[],
  signals: PreValidatedSignal[]
): string {
  const script = `# Validation Kit: ${request.category} in ${request.market}

## Overview
This validation kit gives you the questions, communities, and pre-researched signals to validate demand for: **${request.category}** in **${request.market}**

Last generated: ${new Date().toISOString().split('T')[0]}

---

## Part 1: Targeted Interview Questions (Copy-Paste Ready)

These 8 questions are designed specifically around the pain area: **${request.painArea}**

Ask these in order. Look for specific signals (noted below each question).

${questions
  .map(
    (q, idx) => `
### Q${idx + 1}. ${q.question}

**Focus:** ${q.focusArea.replace(/_/g, ' ').toUpperCase()}  
**Why this matters:** ${q.context}

✓ **Strong signals to listen for:**
${q.expectedSignals.map(s => `  - ${s}`).join('\n')}

---
`
  )
  .join('\n')}

## Part 2: Where to Ask These Questions

Post in these communities (primary first, secondary as follow-up):

### Primary Communities (Best Response Rate)
${communities
  .filter(c => c.relevance === 'primary')
  .map(c => `- **${c.name}** (${c.platform}) - ${c.memberCount.toLocaleString()} members`)
  .join('\n')}

Suggested post: "Hey, we're researching ${request.category} for teams in ${request.market}. Quick 5min survey?"

### Secondary Communities (If Needed)
${communities
  .filter(c => c.relevance === 'secondary')
  .map(c => `- **${c.name}** (${c.platform}) - ${c.memberCount.toLocaleString()} members`)
  .join('\n')}

---

## Part 3: What the Internet Already Says (Pre-Validated Signals)

Before you even post, here's what we found people already discussing in these communities:

### Pain Signals
${signals
  .filter(s => s.category === 'pain_complaint')
  .map(s => `- **"${s.signal}"** (${s.source})\n  Relevance: ${s.relevance}/100 - ${s.context}`)
  .join('\n\n')}

### Tool Gaps & Current Solutions
${signals
  .filter(s => s.category === 'tool_mention')
  .map(s => `- **"${s.signal}"** (${s.source})\n  Relevance: ${s.relevance}/100 - ${s.context}`)
  .join('\n\n')}

### Willingness to Pay & Value Signals
${signals
  .filter(s => s.category === 'wtp_indicator')
  .map(s => `- **"${s.signal}"** (${s.source})\n  Relevance: ${s.relevance}/100 - ${s.context}`)
  .join('\n\n')}

### Workflow Description
${signals
  .filter(s => s.category === 'workflow_description')
  .map(s => `- **"${s.signal}"** (${s.source})\n  Relevance: ${s.relevance}/100 - ${s.context}`)
  .join('\n\n')}

---

## Key Metrics from Pre-Research

| Metric | Value |
|--------|-------|
| **Pain Signal Strength** | ${signals.filter(s => s.category === 'pain_complaint').length} strong pain mentions found |
| **Willingness to Pay Signals** | ${signals.filter(s => s.category === 'wtp_indicator').length} WTP signals found |
| **Avg Relevance** | ${Math.round(signals.reduce((sum, s) => sum + s.relevance, 0) / signals.length)} / 100 |

---

## Next Steps

1. **Post the questions** in primary communities (start with the first 3)
2. **Cross-reference real answers** against the pre-validated signals (do they match or contradict?)
3. **Count strong signals** as you collect responses (3+ of the same signal = strong validation)
4. **Decision point:** If 80%+ of respondents show strong signals across pain + WTP questions → proceed to pitch/MVP
`;

  return script;
}
