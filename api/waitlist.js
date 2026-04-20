export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Add contact to Brevo list #6 (Ozaia Waitlist)
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        listIds: [6],
        updateEnabled: true,
        attributes: {
          SIGNUP_SOURCE: 'ozaia.app',
          SIGNUP_DATE: new Date().toISOString().split('T')[0],
        },
      }),
    });

    if (response.ok || response.status === 204) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json();

    // Contact already exists — still a success for the user
    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true });
    }

    console.error('Brevo API error:', data);
    return res.status(500).json({ error: 'Could not save email' });
  } catch (err) {
    console.error('Waitlist error:', err);
    return res.status(500).json({ error: 'Could not save email' });
  }
}
