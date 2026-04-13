export async function addContactToBrevo(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;
  const listId = process.env.NEXT_PUBLIC_BREVO_LIST_ID;

  if (!apiKey) {
    console.warn('Brevo non configuré');
    return { success: true };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [Number(listId)],
        updateEnabled: true,
        attributes: { SOURCE: 'statutnet-simulateur' },
      }),
    });

    if (res.ok) return { success: true };

    const body = await res.json().catch(() => null);
    const message = body?.message ?? `Erreur ${res.status}`;

    if (res.status === 400 && message.includes('Contact already exist')) {
      return { success: true };
    }

    return { success: false, error: message };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur réseau',
    };
  }
}
