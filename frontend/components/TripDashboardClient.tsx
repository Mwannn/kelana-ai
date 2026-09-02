'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TripCard from './TripCard';
import { getTrips, deleteTrip } from '@/services/tripService';

interface Trip {
  id: number;
  destination: string;
  budget: number;
  currency: string;
  days: number;
  travel_style: string;
}

export default function TripDashboardClient() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const itemsPerPage = 10;
  
  const sortOptions = [
    { value: 'latest', label: 'Latest (Newest First)' },
    { value: 'oldest', label: 'Oldest (First Trip First)' },
    { value: 'highest-budget', label: 'Highest Budget' },
  ];

  const handleDeleteTrip = async (id: number) => {
    if (confirm("Are you sure you want to delete this trip history?")) {
      try {
        await deleteTrip(id);
        setTrips(trips.filter(t => t.id !== id));
      } catch (error) {
        console.error("Failed to delete trip", error);
        alert("Failed to delete trip. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (err: any) {
        console.error("Error fetching trips:", err);
        // If unauthorized, redirect to login
        if (err.message.includes('Failed to fetch') || err.message.includes('401')) {
           localStorage.removeItem('token');
           router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrips();
  }, [router]);

  // Search logic
  const filteredTrips = trips.filter(trip => {
    const q = search.toLowerCase();
    return (
      trip.destination.toLowerCase().includes(q) ||
      (trip.travel_style && trip.travel_style.toLowerCase().includes(q))
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
          <p className="text-[#6B5D4F]">{trips.length} saved itineraries</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <a href="/#planner" className="bg-[#E85D2F] hover:bg-[#C8431C] text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors cursor-hover-target whitespace-nowrap flex-shrink-0">
            <i className="fa-solid fa-plus"></i> New Trip
          </a>
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
          
          {/* Custom Select Dropdown */}
          <div className="relative w-full sm:w-[220px]">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full px-4 py-3 bg-white border border-[#1A1612]/20 rounded-xl focus:outline-none focus:border-[#E85D2F] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span className="text-[#1A1612] truncate">{sortOptions.find(o => o.value === sortBy)?.label}</span>
              <i className={`fa-solid fa-chevron-down text-sm text-[#6B5D4F] transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`}></i>
            </button>
            
            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#1A1612]/10 rounded-xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setCurrentPage(1);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#F4EFE6] ${sortBy === option.value ? 'font-bold text-[#E85D2F] bg-[#F4EFE6]/50' : 'text-[#1A1612]'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-[#F4EFE6] rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-[#1A1612]/20 border-t-[#E85D2F] rounded-full animate-spin"></div>
          <p className="mt-4 font-mono text-sm text-[#6B5D4F]">Loading your trips...</p>
        </div>
      ) : sortedTrips.length === 0 ? (
        <div className="bg-[#F4EFE6] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <i className="fa-solid fa-plane-departure text-3xl text-[#E85D2F]"></i>
          </div>
          <h3 className="font-display text-2xl font-bold mb-2">No trips found.</h3>
          <p className="text-[#6B5D4F] mb-8">
            {trips.length === 0 ? "You haven't generated any itineraries yet." : "No trips match your search criteria."}
          </p>
          <a href="/#planner" className="btn-primary px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2">
            <span>Generate a Trip <i className="fa-solid fa-arrow-right"></i></span>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
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
