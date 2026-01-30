import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: 'linear-gradient(to bottom right, #38bdf8, #0284c7)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '24px', // Bo góc nhẹ cho icon mobile
          fontWeight: 800,
          fontFamily: 'sans-serif',
        }}
      >
        VT
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
