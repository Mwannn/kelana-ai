'use client';

import { useState } from 'react';
import TripCard from './TripCard';

interface Trip {
  id: number;
  destination: string;
  budget: number;
  currency: string;
  days: number;
  travel_style: string;
}

export default function TripDashboardClient({ initialTrips }: { initialTrips: Trip[] }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search logic
  const filteredTrips = initialTrips.filter(trip => {
    const q = search.toLowerCase();
    return (
      trip.destination.toLowerCase().includes(q) ||
      trip.travel_style.toLowerCase().includes(q)
    );
  });

  // Sort logic
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'highest-budget') {
      return b.budget - a.budget;
    } else if (sortBy === 'oldest') {
      return a.id - b.id;
    }
    // Default: latest
    return b.id - a.id;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedTrips.length / itemsPerPage);
  const paginatedTrips = sortedTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-32 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-12 h-px bg-[#1A1612]"></span>
        <span className="section-num text-[#E85D2F] font-bold">MY TRIPS</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2">Trip History</h1>
          <p className="text-[#6B5D4F]">{initialTrips.length} saved itineraries</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#6B5D4F]"></i>
            <input 
              type="text" 
              placeholder="Search destination or style..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-3 bg-white border border-[#1A1612]/20 rounded-xl w-full sm:w-64 focus:outline-none focus:border-[#E85D2F] transition-colors"
            />
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 bg-white border border-[#1A1612]/20 rounded-xl focus:outline-none focus:border-[#E85D2F] transition-colors cursor-pointer"
          >
            <option value="latest">Latest (Newest First)</option>
            <option value="oldest">Oldest (First Trip First)</option>
            <option value="highest-budget">Highest Budget</option>
          </select>
        </div>
      </div>

      {sortedTrips.length === 0 ? (
        <div className="bg-[#F4EFE6] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <i className="fa-solid fa-plane-departure text-3xl text-[#E85D2F]"></i>
          </div>
          <h3 className="font-display text-2xl font-bold mb-2">No trips found.</h3>
          <p className="text-[#6B5D4F] mb-8">
            {initialTrips.length === 0 ? "You haven't generated any itineraries yet." : "No trips match your search criteria."}
          </p>
          <a href="/#planner" className="btn-primary px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2">
            Generate a Trip <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-[#1A1612]/10">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-[#1A1612]/20 hover:bg-[#E85D2F] hover:border-[#E85D2F] hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-[#1A1612]/20 disabled:hover:text-[#1A1612]"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <span className="font-mono text-sm px-4">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-[#1A1612]/20 hover:bg-[#E85D2F] hover:border-[#E85D2F] hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-[#1A1612]/20 disabled:hover:text-[#1A1612]"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
