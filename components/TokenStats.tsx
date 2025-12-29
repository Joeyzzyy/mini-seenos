'use client';

interface TokenStatsProps {
  inputTokens: number;
  outputTokens: number;
  tavilyCalls?: number;
  semrushCalls?: number;
  serperCalls?: number;
}

export default function TokenStats({ inputTokens, outputTokens, tavilyCalls = 0, semrushCalls = 0, serperCalls = 0 }: TokenStatsProps) {
  const totalTokens = inputTokens + outputTokens;
  
  // Debug log
  console.log('[TokenStats] serperCalls:', serperCalls, 'type:', typeof serperCalls);
  
  // GPT-4.1 pricing (per 1M tokens)
  // Input: $2.50, Output: $10.00
  const cost = (inputTokens * 2.50 / 1000000) + (outputTokens * 10.00 / 1000000);

  const gradientStyle = {
    background: 'linear-gradient(80deg, rgb(255, 175, 64) -21.49%, rgb(209, 148, 236) 18.44%, rgb(154, 143, 234) 61.08%, rgb(101, 180, 255) 107.78%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  return (
    <div className="text-xs text-[#9CA3AF] text-center">
      Current conversation consumed: {' '}
      <span style={gradientStyle as React.CSSProperties}>
        {totalTokens.toLocaleString()} tokens
      </span>
      {', '}
      <span style={gradientStyle as React.CSSProperties}>
        ${cost.toFixed(6)}
      </span>
      {semrushCalls > 0 && (
        <>
          {', '}
          <span style={gradientStyle as React.CSSProperties}>
            {semrushCalls}
          </span>
          {' Semrush '}
          {semrushCalls === 1 ? 'call' : 'calls'}
        </>
      )}
      {tavilyCalls > 0 && (
        <>
          {', '}
          <span style={gradientStyle as React.CSSProperties}>
            {tavilyCalls}
          </span>
          {' Tavily '}
          {tavilyCalls === 1 ? 'call' : 'calls'}
        </>
      )}
      {serperCalls > 0 && (
        <>
          {', '}
          <span style={gradientStyle as React.CSSProperties}>
            {serperCalls}
          </span>
          {' Serper '}
          {serperCalls === 1 ? 'call' : 'calls'}
        </>
      )}
    </div>
  );
}

