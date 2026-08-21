'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState('');
  const [travelStyle, setTravelStyle] = useState('Standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTripData(null);

    try {
      // 1. Save the trip (Session 4 & 6)
      const saveRes = await fetch('http://localhost:8000/api/v1/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          budget: parseFloat(budget),
          days: parseInt(days),
          travel_style: travelStyle,
        }),
      });

      if (!saveRes.ok) throw new Error('Failed to save trip');
      const trip = await saveRes.json();

      // 2. Generate AI Recommendation (Session 5 & 6)
      const genRes = await fetch(`http://localhost:8000/api/v1/trips/${trip.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ travel_style: travelStyle }),
      });

      if (!genRes.ok) throw new Error('Failed to generate AI recommendation');
      const generatedTrip = await genRes.json();
      
      setTripData(generatedTrip);
    } catch (err: any) {
      setError('Unable to generate itinerary. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 sm:text-5xl">KelanaAI</h1>
          <p className="mt-4 text-lg text-gray-500">Plan your next adventure with the power of AI</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Japan"
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget (USD)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 2000"
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Days</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="e.g. 5"
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Travel Style</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Backpacker">Backpacker</option>
                  <option value="Standard">Standard</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Family">Family</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Amazon Bedrock is thinking...
                </span>
              ) : (
                'Generate AI Trip'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl mb-8">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Error</h3>
                <p className="text-red-700 mt-2">{error}</p>
              </div>
            </div>
          </div>
        )}

        {tripData && tripData.ai_recommendation && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-teal-500">
              <h2 className="text-2xl font-bold text-white">AI Recommendation for {tripData.destination}</h2>
              <p className="text-blue-100 mt-1">Category: {tripData.category} • Daily Budget: USD {tripData.daily_budget}</p>
            </div>
            <div className="p-8 prose prose-blue max-w-none">
              <ReactMarkdown>{tripData.ai_recommendation}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
