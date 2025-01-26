export async function GET(req) {
  try {
    // Add a unique query parameter to ensure the URL is different each time
    const response = await fetch(`http://api.quotable.io/random?timestamp=${Date.now()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch the quote.');
    }

    const data = await response.json();
    return new Response(JSON.stringify({ quote: data.content, author: data.author }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unable to fetch the quote.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
