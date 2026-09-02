const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getAuthHeaders() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
  }
  return {};
}

export async function getTrips() {
  const res = await fetch(`${API_URL}/trips`, {
    cache: 'no-store', // Ensure we get fresh data
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch trips');
  return res.json();
}

export async function getTrip(id: number | string) {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    cache: 'no-store',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch trip');
  return res.json();
}

export async function generateTrip(data: any) {
  // Save basic trip details first
  const saveRes = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  
  if (!saveRes.ok) throw new Error('Failed to save trip');
  const trip = await saveRes.json();

  // Then generate the AI recommendation for this trip
  const genRes = await fetch(`${API_URL}/trips/${trip.id}/generate`, {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ 
      travel_style: data.travel_style, 
      language: data.language || 'Indonesian' 
    })
  });

  if (!genRes.ok) throw new Error('Failed to generate AI recommendation');
  return genRes.json();
}

export async function deleteTrip(id: number | string) {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete trip');
  return res.json();
}
