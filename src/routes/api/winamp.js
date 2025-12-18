export async function GET({ url }) {
  const audioPath = url.searchParams.get('file');
  
  if (!audioPath) {
    return new Response(
      JSON.stringify({ error: 'No audio file specified' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      status: 'success',
      message: 'Audio file ready for Winamp playback',
      file: audioPath,
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

export async function POST({ request }) {
  const data = await request.json();
  const { file, action } = data;

  if (action === 'play' && file) {
    return new Response(
      JSON.stringify({
        status: 'success',
        action: 'play',
        file,
        message: 'Playing file in Winamp'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ error: 'Invalid action' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
