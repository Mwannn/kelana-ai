'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTrips, deleteTrip } from '@/services/tripService';
import Link from 'next/link';

export default function ProfileDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUser(userData);
        setEditName(userData.name);
        setEditGender(userData.gender || "");
        setEditAvatar(userData.avatar_url || "");
        setEditEmail(userData.email || "");
        setTrips(await getTrips());
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!editEmail.includes('@')) {
      setValidationError("Format email tidak valid.");
      return;
    }

    if (editPassword || confirmPassword) {
      if (editPassword !== confirmPassword) {
        setValidationError("Password dan konfirmasi password tidak cocok.");
        return;
      }
      if (editPassword.length < 6) {
        setValidationError("Password minimal harus 6 karakter.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const payload: any = { 
        name: editName, 
        gender: editGender, 
        avatar_url: editAvatar,
        email: editEmail
      };
      
      if (editPassword) {
        payload.password = editPassword;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/me`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Gagal menyimpan perubahan");
      }
      
      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsSettingsOpen(false);
      setEditPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTrip = async (id: number) => {
    if (confirm("Are you sure you want to delete this trip history?")) {
      try {
        await deleteTrip(id);
        setTrips(trips.filter(t => t.id !== id));
      } catch (error) {
        alert("Failed to delete trip.");
      }
    }
  };

  if (isLoading) {
    return (
      <main className="bg-[#8EACA0] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </main>
    );
  }

  const tripCount = trips.length;
  const totalDays = trips.reduce((acc, trip) => acc + trip.days, 0);
  const totalBudget = trips.reduce((acc, trip) => {
    // Normalize budget to a rough IDR equivalent for a combined stat (simplified)
    const val = trip.currency === 'USD' ? trip.budget * 15000 : trip.budget;
    return acc + val;
  }, 0);
  const formattedTotalBudget = new Intl.NumberFormat('id-ID', { notation: 'compact', compactDisplay: 'short' }).format(totalBudget);
  
  const styles = trips.map(t => t.travel_style);
  const favStyle = styles.length > 0 ? styles.sort((a,b) => styles.filter(v=>v===a).length - styles.filter(v=>v===b).length).pop() : 'None';

  const pastelColors = ['bg-white', 'bg-[#F4EFE6]'];

  const avatarOptions = [
    "https://api.dicebear.com/9.x/micah/svg?seed=Kelana1&backgroundColor=E85D2F",
    "https://api.dicebear.com/9.x/micah/svg?seed=Kelana2&backgroundColor=E85D2F",
    "https://api.dicebear.com/9.x/micah/svg?seed=Kelana3&backgroundColor=E85D2F",
    "https://api.dicebear.com/9.x/micah/svg?seed=Kelana4&backgroundColor=E85D2F",
    "https://api.dicebear.com/9.x/micah/svg?seed=Kelana5&backgroundColor=E85D2F",
    "https://api.dicebear.com/9.x/micah/svg?seed=Kelana6&backgroundColor=E85D2F",
    "https://api.dicebear.com/9.x/micah/svg?seed=Kelana7&backgroundColor=E85D2F",
    "https://api.dicebear.com/9.x/micah/svg?seed=Kelana8&backgroundColor=E85D2F"
  ];

  // Filter trips based on search query
  const filteredTrips = trips.filter(trip => 
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) || 
    trip.travel_style.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.id.toString().includes(searchQuery)
  );

  return (
    <>
      <main className="bg-[#F4EFE6] min-h-screen pt-24 pb-8 px-4 sm:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 h-full">
        
        {/* SIDEBAR */}
        <div className="bg-[#1A1612] w-full lg:w-72 rounded-[2rem] p-8 flex flex-col relative overflow-hidden flex-shrink-0 shadow-xl">
          <div className="relative z-10">
            <h1 className="font-display text-2xl font-black text-white mb-12">Kelana<span className="text-[#E85D2F]">AI</span></h1>
            
            <nav className="space-y-4 mb-12">
              <Link href="/profile" className="flex items-center gap-4 text-[#1A1612] font-bold bg-[#E85D2F] px-4 py-3 rounded-xl transition-colors">
                <i className="fa-solid fa-border-all w-5"></i> Dashboard
              </Link>
              <Link href="/#planner" className="flex items-center gap-4 text-white/70 font-semibold hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-colors">
                <i className="fa-solid fa-calendar-plus w-5"></i> Plan a Trip
              </Link>
              <Link href="/trips" className="flex items-center gap-4 text-white/70 font-semibold hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-colors">
                <i className="fa-solid fa-map-location-dot w-5"></i> My Itineraries
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-4 text-white/70 font-semibold hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl w-full text-left transition-colors">
                <i className="fa-solid fa-arrow-right-from-bracket w-5"></i> Sign Out
              </button>
            </nav>
          </div>
          
          <div className="mt-auto relative z-10">
            <div className="text-sm font-semibold text-white/50 mb-2">Need help?</div>
            <button className="bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white hover:text-[#1A1612] transition-colors">
              Contact Support
            </button>
          </div>
          
          {/* Abstract Sidebar Graphics */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[120%] opacity-5 pointer-events-none text-white">
            <i className="fa-solid fa-plane text-9xl absolute bottom-20 right-10 rotate-[-45deg]"></i>
            <i className="fa-solid fa-compass text-9xl absolute bottom-10 left-10"></i>
            <i className="fa-solid fa-camera text-7xl absolute bottom-40 right-20"></i>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Top Stats Bar */}
          <div className="bg-white rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-[#1A1612]/5">
            
            {/* Search Input */}
            <div className="w-full md:w-auto flex-1">
              <div className="bg-[#F4EFE6] rounded-full px-5 py-3 flex items-center gap-3 max-w-sm focus-within:ring-2 focus-within:ring-[#E85D2F] transition-all">
                <i className="fa-solid fa-search text-[#6B5D4F]"></i>
                <input 
                  type="text" 
                  placeholder="Search destination or style..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full text-[#1A1612] placeholder:text-[#6B5D4F]" 
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-[#6B5D4F] hover:text-[#E85D2F]">
                    <i className="fa-solid fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 w-full md:w-auto">
              <div>
                <div className="text-xs text-[#6B5D4F] font-semibold mb-1 uppercase tracking-wider">Total Trips</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-[#1A1612]">{tripCount}</span>
                  <span className="text-sm font-bold text-[#E85D2F]">TRP</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#6B5D4F] font-semibold mb-1 uppercase tracking-wider">Total Days</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-[#1A1612]">{totalDays}</span>
                  <span className="text-sm font-bold text-[#E85D2F]">DYS</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#6B5D4F] font-semibold mb-1 uppercase tracking-wider">Total Est. Budget</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-[#1A1612]">{formattedTotalBudget}</span>
                  <span className="text-sm font-bold text-[#E85D2F]">IDR</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#6B5D4F] font-semibold mb-1 uppercase tracking-wider">Fav Style</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-[#E85D2F] capitalize truncate max-w-[100px]">{favStyle}</span>
                </div>
              </div>
            </div>

            {/* Profile Avatar Area */}
            <div className="flex items-center gap-4 bg-[#F4EFE6] pl-4 pr-6 py-2 rounded-full hidden xl:flex">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-white font-display font-bold text-xl overflow-hidden shadow-sm">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : user?.gender === 'Laki-laki' ? (
                  <img src={`https://api.dicebear.com/9.x/micah/svg?seed=Boy-${user?.name}&backgroundColor=E85D2F`} alt="avatar" className="w-full h-full object-cover" />
                ) : user?.gender === 'Perempuan' ? (
                  <img src={`https://api.dicebear.com/9.x/micah/svg?seed=Girl-${user?.name}&backgroundColor=E85D2F`} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#E85D2F] flex items-center justify-center text-white">{user?.name?.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1A1612]">{user?.name}</span>
                <span className="text-xs text-[#6B5D4F]">{user?.email}</span>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="ml-2 w-8 h-8 rounded-full bg-white hover:bg-[#E85D2F] hover:text-white transition-colors flex items-center justify-center shadow-sm text-[#1A1612]"
                title="Edit Profile"
              >
                <i className="fa-solid fa-pen text-xs"></i>
              </button>
            </div>
          </div>

          {/* Cards & Table Section */}
          <div className="bg-white rounded-[2rem] p-6 lg:p-8 flex-1 shadow-xl flex flex-col border border-[#1A1612]/5">
            
            {/* Colorful Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              
              {/* Card 1: Orange (Links to latest trip) */}
              <Link href={trips.length > 0 ? `/trips/${trips[0].id}` : '/#planner'} className="bg-[#E85D2F] rounded-3xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-[#E85D2F]/20 block">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-12">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"><i className="fa-solid fa-calendar-check text-sm"></i></div>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fa-solid fa-chevron-right text-[10px] text-[#E85D2F]"></i></div>
                </div>
                <div className="relative z-10">
                  <div className="text-xs text-white/80 font-medium mb-1">Latest Generated Trip</div>
                  <div className="font-bold text-lg leading-tight truncate">{trips.length > 0 ? trips[0].destination : 'No trips yet'}</div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              </Link>

              {/* Card 2: Dark Brown (Links to trips) */}
              <Link href="/trips" className="bg-[#1A1612] rounded-3xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-[#1A1612]/20 block">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-12">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"><i className="fa-solid fa-book-open-reader text-sm"></i></div>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fa-solid fa-chevron-right text-[10px] text-[#1A1612]"></i></div>
                </div>
                <div className="relative z-10">
                  <div className="text-xs text-white/60 font-medium mb-1">My Itineraries</div>
                  <div className="font-bold text-lg leading-tight">View all generated trips</div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              </Link>

              {/* Card 3: Cream (Links to planner) */}
              <Link href="/#planner" className="bg-[#F4EFE6] rounded-3xl p-6 text-[#1A1612] relative overflow-hidden group cursor-pointer shadow-sm border border-[#1A1612]/5 block">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-12">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"><i className="fa-solid fa-compass text-sm text-[#E85D2F]"></i></div>
                  <div className="w-6 h-6 rounded-full bg-[#1A1612] flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fa-solid fa-chevron-right text-[10px] text-white"></i></div>
                </div>
                <div className="relative z-10">
                  <div className="text-xs text-[#6B5D4F] font-medium mb-1">Explore New Places</div>
                  <div className="font-bold text-lg leading-tight">Generate a new trip itinerary</div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-2xl"></div>
              </Link>

              {/* Card 4: Light Orange/Peach (No link, info only) */}
              <div className="bg-[#ffe8d6] rounded-3xl p-6 text-[#1A1612] relative overflow-hidden group shadow-sm border border-[#E85D2F]/10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-12">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"><i className="fa-solid fa-star text-sm text-[#E85D2F]"></i></div>
                  <div className="w-6 h-6 rounded-full bg-[#E85D2F] flex items-center justify-center"><i className="fa-solid fa-check text-[10px] text-white"></i></div>
                </div>
                <div className="relative z-10">
                  <div className="text-xs text-[#6B5D4F] font-medium mb-1">Account Status</div>
                  <div className="font-bold text-lg leading-tight">Verified Kelana Explorer</div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-2xl"></div>
              </div>
              
            </div>

            {/* Trip History Table */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1A1612]">Trip History</h2>
                {searchQuery && (
                  <span className="text-xs font-semibold text-[#6B5D4F] bg-[#F4EFE6] px-3 py-1 rounded-full">
                    Found {filteredTrips.length} result(s)
                  </span>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-sm font-semibold text-[#6B5D4F]">
                      <th className="pb-3 px-4 font-medium">Id</th>
                      <th className="pb-3 px-4 font-medium">Destination</th>
                      <th className="pb-3 px-4 font-medium">Days</th>
                      <th className="pb-3 px-4 font-medium">Budget</th>
                      <th className="pb-3 px-4 font-medium">Style</th>
                      <th className="pb-3 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrips.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-[#6B5D4F]">
                          <i className="fa-solid fa-magnifying-glass mb-3 text-2xl opacity-50 block"></i>
                          {searchQuery ? "No trips found matching your search." : "No trips generated yet."}
                        </td>
                      </tr>
                    ) : (
                      filteredTrips.map((trip, index) => {
                        const bgClass = pastelColors[index % pastelColors.length];
                        return (
                          <tr key={trip.id} className="group">
                            <td className="py-2">
                              <div className={`${bgClass} rounded-l-xl px-4 py-3 text-sm font-mono text-[#6B5D4F] my-1 group-hover:brightness-95 transition-all`}>
                                #{trip.id}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className={`${bgClass} px-4 py-3 text-sm font-bold text-[#1A1612] my-1 group-hover:brightness-95 transition-all flex items-center gap-2`}>
                                <div className="w-6 h-6 rounded-full bg-white border border-[#1A1612]/5 flex items-center justify-center text-[10px] text-[#E85D2F] shadow-sm">
                                  <i className="fa-solid fa-location-dot"></i>
                                </div>
                                {trip.destination}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className={`${bgClass} px-4 py-3 text-sm font-semibold text-[#6B5D4F] my-1 group-hover:brightness-95 transition-all`}>
                                {trip.days} Days
                              </div>
                            </td>
                            <td className="py-2">
                              <div className={`${bgClass} px-4 py-3 text-sm font-semibold text-[#6B5D4F] my-1 group-hover:brightness-95 transition-all`}>
                                {trip.currency} {trip.budget.toLocaleString()}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className={`${bgClass} px-4 py-3 text-sm font-semibold text-[#6B5D4F] capitalize my-1 group-hover:brightness-95 transition-all`}>
                                {trip.travel_style}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className={`${bgClass} rounded-r-xl px-4 py-3 text-sm text-[#6B5D4F] my-1 group-hover:brightness-95 transition-all flex items-center justify-end gap-3`}>
                                <Link href={`/trips/${trip.id}`} className="w-8 h-8 bg-white border border-[#1A1612]/5 rounded-full flex items-center justify-center hover:bg-[#E85D2F] hover:text-white transition-colors shadow-sm">
                                  <i className="fa-solid fa-eye text-xs"></i>
                                </Link>
                                <button onClick={() => handleDeleteTrip(trip.id)} className="w-8 h-8 bg-white border border-[#1A1612]/5 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-sm text-red-400">
                                  <i className="fa-solid fa-trash-can text-xs"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-[#1A1612]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsSettingsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500">
              <i className="fa-solid fa-times text-xl"></i>
            </button>
            
            <h2 className="text-2xl font-bold font-display text-[#1A1612] mb-6 border-b pb-4">Edit Profile</h2>
            
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Kolom Kiri: Avatar & Gender */}
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#6B5D4F] mb-2">Pilih Avatar</label>
                <div className="grid grid-cols-4 gap-3">
                  {avatarOptions.map((url, i) => (
                    <button 
                      key={i} 
                      type="button" 
                      onClick={() => setEditAvatar(url)}
                      className={`rounded-xl overflow-hidden border-2 transition-all ${editAvatar === url ? 'border-[#E85D2F] ring-2 ring-[#E85D2F]/20 scale-105' : 'border-transparent hover:scale-105'}`}
                    >
                      <img src={url} alt={`Avatar ${i+1}`} className="w-full h-auto bg-[#F4EFE6]" />
                    </button>
                  ))}
                </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#6B5D4F] mb-2">Jenis Kelamin</label>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setEditGender('Laki-laki')}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${editGender === 'Laki-laki' ? 'border-[#E85D2F] text-[#E85D2F] bg-white' : 'border-transparent bg-[#F4EFE6] text-[#6B5D4F]'}`}
                      >
                        <i className="fa-solid fa-mars mr-2"></i> Laki-laki
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditGender('Perempuan')}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${editGender === 'Perempuan' ? 'border-[#E85D2F] text-[#E85D2F] bg-white' : 'border-transparent bg-[#F4EFE6] text-[#6B5D4F]'}`}
                      >
                        <i className="fa-solid fa-venus mr-2"></i> Perempuan
                      </button>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Info Personal */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#6B5D4F] mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#F4EFE6] border border-[#1A1612]/10 rounded-xl px-4 py-3 outline-none focus:border-[#E85D2F] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#6B5D4F] mb-2">Email (Gmail / Lainnya)</label>
                <input 
                  type="email" 
                  value={editEmail} 
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#F4EFE6] border border-[#1A1612]/10 rounded-xl px-4 py-3 outline-none focus:border-[#E85D2F] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#6B5D4F] mb-2">Password Baru (Opsional)</label>
                <input 
                  type="password" 
                  value={editPassword} 
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  className="w-full bg-[#F4EFE6] border border-[#1A1612]/10 rounded-xl px-4 py-3 outline-none focus:border-[#E85D2F] transition-colors"
                />
              </div>

              {editPassword.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-[#6B5D4F] mb-2">Konfirmasi Password Baru</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru"
                    className="w-full bg-[#F4EFE6] border border-[#1A1612]/10 rounded-xl px-4 py-3 outline-none focus:border-[#E85D2F] transition-colors"
                  />
                </div>
              )}

              {validationError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                  <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                  {validationError}
                </div>
              )}
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button type="submit" disabled={isSaving} className="w-full md:w-auto bg-[#E85D2F] text-white py-3 px-8 rounded-full font-bold shadow-[0_4px_14px_0_rgba(232,93,47,0.39)] hover:shadow-[0_6px_20px_rgba(232,93,47,0.23)] hover:-translate-y-1 transition-all disabled:opacity-50">
                  {isSaving ? (
                    <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Menyimpan...</>
                  ) : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
