'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTrips, deleteTrip } from '@/services/tripService';
import { getConversations, Conversation } from '@/services/chatService';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'trips' | 'chats'>('profile');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings / Edit Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Custom Delete Trip Modal
  const [tripToDelete, setTripToDelete] = useState<any>(null);
  const [isDeletingTrip, setIsDeletingTrip] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
        setEditName(userData.name || "");
        setEditGender(userData.gender || "");
        setEditAvatar(userData.avatar_url || "");
        setEditEmail(userData.email || "");

        // Fetch user's trips and conversations concurrently
        const [tripsData, chatsData] = await Promise.all([
          getTrips().catch(() => []),
          getConversations().catch(() => [])
        ]);
        setTrips(tripsData);
        setConversations(chatsData);
      } catch (err) {
        console.error("Profile load error:", err);
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
        setValidationError("Password dan konfirmasi password baru tidak cocok.");
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
        name: editName.trim(), 
        gender: editGender, 
        avatar_url: editAvatar,
        email: editEmail.trim()
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
        throw new Error(errData.detail || "Gagal menyimpan perubahan profil.");
      }
      
      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsSettingsOpen(false);
      setEditPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || "Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const executeDeleteTrip = async () => {
    if (!tripToDelete) return;
    setIsDeletingTrip(true);
    try {
      await deleteTrip(tripToDelete.id);
      setTrips(prev => prev.filter(t => t.id !== tripToDelete.id));
      setTripToDelete(null);
    } catch (error) {
      console.error("Failed to delete trip:", error);
    } finally {
      setIsDeletingTrip(false);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-[#F4EFE6] min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 rounded-2xl bg-[#E85D2F]/10 text-[#E85D2F] flex items-center justify-center text-xl animate-bounce mb-3 shadow-xs">
          <i className="fa-solid fa-compass"></i>
        </div>
        <p className="font-display font-bold text-base text-[#1A1612]">Memuat Profil Pengguna...</p>
      </main>
    );
  }

  const tripCount = trips.length;
  const totalDays = trips.reduce((acc, trip) => acc + (trip.days || 0), 0);
  const totalBudget = trips.reduce((acc, trip) => {
    const val = trip.currency === 'USD' ? (trip.budget || 0) * 15000 : (trip.budget || 0);
    return acc + val;
  }, 0);
  const formattedTotalBudget = new Intl.NumberFormat('id-ID', { notation: 'compact', compactDisplay: 'short' }).format(totalBudget);
  
  const styles = trips.map(t => t.travel_style).filter(Boolean);
  const favStyle = styles.length > 0 
    ? styles.sort((a,b) => styles.filter(v=>v===a).length - styles.filter(v=>v===b).length).pop() 
    : 'Santai';

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

  const filteredTrips = trips.filter(trip => 
    trip.destination?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    trip.travel_style?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.id?.toString().includes(searchQuery)
  );

  const getEffectiveAvatar = () => {
    if (user?.avatar_url) return user.avatar_url;
    if (user?.gender === 'Laki-laki') return `https://api.dicebear.com/9.x/micah/svg?seed=Boy-${user?.name}&backgroundColor=E85D2F`;
    if (user?.gender === 'Perempuan') return `https://api.dicebear.com/9.x/micah/svg?seed=Girl-${user?.name}&backgroundColor=E85D2F`;
    return null;
  };

  return (
    <main className="bg-[#F4EFE6] min-h-screen pt-20 pb-12 px-3 sm:px-6 lg:px-8 font-sans text-[#1A1612]">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* ============================================================ */}
        {/* 1. HERO USER PROFILE CARD                                     */}
        {/* ============================================================ */}
        <div className="bg-white border border-[#1A1612]/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(26,22,18,0.05)] relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E85D2F]/10 via-[#D4A24C]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            
            {/* User Details & Avatar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              {/* Avatar Circle */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#E85D2F] to-[#D4A24C] p-1 shadow-lg shadow-[#E85D2F]/20">
                  <div className="w-full h-full rounded-[22px] bg-white overflow-hidden flex items-center justify-center">
                    {getEffectiveAvatar() ? (
                      <img src={getEffectiveAvatar()!} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display font-black text-3xl sm:text-4xl text-[#E85D2F]">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#1A1612] text-white hover:bg-[#E85D2F] transition-all flex items-center justify-center text-xs shadow-md"
                  title="Ganti Foto Profil"
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
              </div>

              {/* Identity Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-[#1A1612]">
                    {user?.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <i className="fa-solid fa-circle-check text-[10px]"></i>
                    <span>Verified Explorer</span>
                  </span>
                </div>

                <p className="text-sm text-[#6B5D4F] flex items-center justify-center sm:justify-start gap-2">
                  <i className="fa-regular fa-envelope text-xs text-[#E85D2F]"></i>
                  <span>{user?.email}</span>
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-[#6B5D4F]">
                  <span className="px-3 py-1 rounded-full bg-[#F4EFE6] font-medium border border-[#1A1612]/5">
                    <i className="fa-solid fa-venus-mars mr-1 text-[#E85D2F]"></i>
                    {user?.gender || 'Belum diatur'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#F4EFE6] font-mono border border-[#1A1612]/5">
                    ID: #USR-{user?.id ? String(user.id).padStart(4, '0') : '0001'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Profile Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="bg-[#1A1612] hover:bg-[#E85D2F] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-user-pen text-xs"></i>
                <span>Edit Profil</span>
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
                title="Keluar dari akun"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
                <span>Keluar</span>
              </button>
            </div>

          </div>

          {/* Key Metric Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#1A1612]/5">
            <div className="p-4 bg-[#FDFCFA] rounded-2xl border border-[#1A1612]/5">
              <span className="text-[11px] font-bold text-[#6B5D4F] uppercase tracking-wider block mb-1">Total Trip</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-2xl sm:text-3xl text-[#1A1612]">{tripCount}</span>
                <span className="text-xs font-bold text-[#E85D2F]">Trip Dibuat</span>
              </div>
            </div>

            <div className="p-4 bg-[#FDFCFA] rounded-2xl border border-[#1A1612]/5">
              <span className="text-[11px] font-bold text-[#6B5D4F] uppercase tracking-wider block mb-1">Total Hari</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-2xl sm:text-3xl text-[#1A1612]">{totalDays}</span>
                <span className="text-xs font-bold text-[#E85D2F]">Hari Liburan</span>
              </div>
            </div>

            <div className="p-4 bg-[#FDFCFA] rounded-2xl border border-[#1A1612]/5">
              <span className="text-[11px] font-bold text-[#6B5D4F] uppercase tracking-wider block mb-1">Estimasi Budget</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-2xl sm:text-3xl text-[#1A1612]">{formattedTotalBudget}</span>
                <span className="text-xs font-bold text-[#E85D2F]">IDR</span>
              </div>
            </div>

            <div className="p-4 bg-[#FDFCFA] rounded-2xl border border-[#1A1612]/5">
              <span className="text-[11px] font-bold text-[#6B5D4F] uppercase tracking-wider block mb-1">Chat Memori</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-2xl sm:text-3xl text-[#0E4F4A]">{conversations.length}</span>
                <span className="text-xs font-bold text-[#0E4F4A]">Sesi Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. TABBED NAVIGATION BAR                                      */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#1A1612]/10 w-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#E85D2F] text-white shadow-xs'
                : 'text-[#6B5D4F] hover:bg-[#F4EFE6] hover:text-[#1A1612]'
            }`}
          >
            <i className="fa-solid fa-id-card"></i>
            <span>Detail Profil</span>
          </button>

          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'trips'
                ? 'bg-[#E85D2F] text-white shadow-xs'
                : 'text-[#6B5D4F] hover:bg-[#F4EFE6] hover:text-[#1A1612]'
            }`}
          >
            <i className="fa-solid fa-map-location-dot"></i>
            <span>Riwayat Trip ({tripCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('chats')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'chats'
                ? 'bg-[#E85D2F] text-white shadow-xs'
                : 'text-[#6B5D4F] hover:bg-[#F4EFE6] hover:text-[#1A1612]'
            }`}
          >
            <i className="fa-regular fa-comments"></i>
            <span>Chat AI Memori ({conversations.length})</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 3. TAB CONTENT SECTIONS                                       */}
        {/* ============================================================ */}

        {/* ------------------------------------------------------------ */}
        {/* TAB 1: DETAIL PROFIL LENGKAP                                 */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Account Details Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1612]/10 shadow-[0_10px_30px_rgba(26,22,18,0.04)] space-y-6">
              <div className="flex items-center justify-between border-b border-[#1A1612]/5 pb-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#1A1612]">Informasi Akun Pribadi</h3>
                  <p className="text-xs text-[#6B5D4F]">Rincian data identitas akun KelanaAI Anda</p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-xs font-bold text-[#E85D2F] hover:underline flex items-center gap-1"
                >
                  <i className="fa-solid fa-pen text-[10px]"></i>
                  <span>Perbarui Data</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F4EFE6]/50 border border-[#1A1612]/5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5D4F] block mb-1">Nama Lengkap</span>
                  <p className="text-sm font-bold text-[#1A1612] flex items-center gap-2">
                    <i className="fa-solid fa-user text-xs text-[#E85D2F]"></i>
                    <span>{user?.name}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4EFE6]/50 border border-[#1A1612]/5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5D4F] block mb-1">Email Utama</span>
                  <p className="text-sm font-bold text-[#1A1612] flex items-center gap-2 truncate">
                    <i className="fa-solid fa-envelope text-xs text-[#E85D2F]"></i>
                    <span className="truncate">{user?.email}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4EFE6]/50 border border-[#1A1612]/5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5D4F] block mb-1">Jenis Kelamin</span>
                  <p className="text-sm font-bold text-[#1A1612] flex items-center gap-2">
                    <i className="fa-solid fa-venus-mars text-xs text-[#E85D2F]"></i>
                    <span>{user?.gender || 'Belum Ditentukan'}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4EFE6]/50 border border-[#1A1612]/5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5D4F] block mb-1">Gaya Perjalanan Favorit</span>
                  <p className="text-sm font-bold text-[#1A1612] flex items-center gap-2 capitalize">
                    <i className="fa-solid fa-heart text-xs text-[#E85D2F]"></i>
                    <span>{favStyle}</span>
                  </p>
                </div>
              </div>

              {/* Security Status Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm shrink-0">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Keamanan Akun Aktif</h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                    Akun Anda diamankan dengan enkripsi kata sandi standard dan sesi JWT token bearer. Anda dapat mengganti password kapan saja melalui menu Edit Profil.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-[#1A1612] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-[#E85D2F] text-white flex items-center justify-center text-lg">
                  <i className="fa-solid fa-sparkles"></i>
                </div>
                <h3 className="font-display font-bold text-xl text-white">Mulai Rencana Baru?</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Gunakan AI Generator untuk merancang itinerary kustom atau mengobrol langsung dengan asisten perjalanan KelanaAI.
                </p>

                <div className="space-y-2 pt-2">
                  <Link
                    href="/#planner"
                    className="w-full bg-[#E85D2F] hover:bg-[#C8431C] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                    <span>Buat Itinerary Baru</span>
                  </Link>

                  <Link
                    href="/chat"
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <i className="fa-regular fa-comments text-xs"></i>
                    <span>Buka Chat AI Memori</span>
                  </Link>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-white/50 relative z-10 flex items-center justify-between">
                <span>KelanaAI v1.0</span>
                <span>Session 10 Complete</span>
              </div>

              {/* Decorative background watermark */}
              <i className="fa-solid fa-compass absolute -bottom-10 -right-10 text-9xl text-white/5 pointer-events-none"></i>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB 2: RIWAYAT TRIP                                          */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'trips' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1612]/10 shadow-[0_10px_30px_rgba(26,22,18,0.04)] animate-fade-in space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1A1612]/5 pb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-[#1A1612]">Riwayat Trip Anda</h3>
                <p className="text-xs text-[#6B5D4F]">Daftar seluruh destinasi dan itinerary yang telah Anda buat</p>
              </div>

              {/* Search Bar */}
              <div className="w-full sm:w-72 bg-[#F4EFE6] px-3.5 py-2 rounded-xl border border-[#1A1612]/10 flex items-center gap-2 text-xs">
                <i className="fa-solid fa-magnifying-glass text-[#6B5D4F]"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari destinasi atau gaya..."
                  className="bg-transparent outline-none w-full text-[#1A1612]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-[#6B5D4F]">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Trips List / Table */}
            {filteredTrips.length === 0 ? (
              <div className="py-16 text-center text-[#6B5D4F] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] flex items-center justify-center mx-auto text-xl text-[#6B5D4F]/40">
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <p className="font-bold text-sm text-[#1A1612]">Belum ada itinerary ditemukan.</p>
                <Link href="/#planner" className="inline-block bg-[#E85D2F] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs">
                  + Buat Trip Pertama
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrips.map(trip => (
                  <div 
                    key={trip.id}
                    className="p-5 rounded-2xl bg-[#FDFCFA] border border-[#1A1612]/10 hover:border-[#E85D2F]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#6B5D4F]">
                          #{trip.id}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E85D2F]/10 text-[#E85D2F] capitalize">
                          {trip.travel_style || 'Standard'}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-lg text-[#1A1612] group-hover:text-[#E85D2F] transition-colors mb-1">
                        {trip.destination}
                      </h4>
                      <p className="text-xs text-[#6B5D4F]">
                        {trip.days} Hari • Budget: {trip.currency} {Number(trip.budget).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1A1612]/5">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="text-xs font-bold text-[#E85D2F] hover:underline flex items-center gap-1"
                      >
                        <span>Lihat Itinerary</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </Link>

                      <button
                        onClick={() => setTripToDelete(trip)}
                        className="w-7 h-7 rounded-lg text-[#6B5D4F] hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                        title="Hapus Trip"
                      >
                        <i className="fa-regular fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB 3: RIWAYAT CHAT AI MEMORI                                */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'chats' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1612]/10 shadow-[0_10px_30px_rgba(26,22,18,0.04)] animate-fade-in space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#1A1612]/5 pb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-[#1A1612]">Riwayat Percakapan AI Memori</h3>
                <p className="text-xs text-[#6B5D4F]">Sesi percakapan yang disimpan di database PostgreSQL</p>
              </div>

              <Link
                href="/chat"
                className="bg-[#E85D2F] hover:bg-[#C8431C] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
                <span>Buka Chat Room</span>
              </Link>
            </div>

            {conversations.length === 0 ? (
              <div className="py-16 text-center text-[#6B5D4F] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] flex items-center justify-center mx-auto text-xl text-[#6B5D4F]/40">
                  <i className="fa-regular fa-comments"></i>
                </div>
                <p className="font-bold text-sm text-[#1A1612]">Belum ada riwayat percakapan.</p>
                <Link href="/chat" className="inline-block bg-[#E85D2F] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs">
                  Mulai Chat Sekarang
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    className="p-4 rounded-2xl bg-[#FDFCFA] border border-[#1A1612]/10 hover:border-[#E85D2F]/40 transition-all flex items-center justify-between gap-4 shadow-2xs group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <h4 className="font-bold text-sm text-[#1A1612] truncate group-hover:text-[#E85D2F] transition-colors">
                          {conv.title || "Percakapan Baru"}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#6B5D4F] font-mono">
                        Dibuat: {new Date(conv.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <Link
                      href="/chat"
                      className="bg-white group-hover:bg-[#E85D2F] text-[#1A1612] group-hover:text-white border border-[#1A1612]/10 group-hover:border-[#E85D2F] text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs shrink-0 flex items-center gap-1.5"
                    >
                      <span>Lanjutkan</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* EDIT PROFILE MODAL                                           */}
      {/* ============================================================ */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto border border-[#1A1612]/10">
            <button 
              onClick={() => setIsSettingsOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-times text-base"></i>
            </button>
            
            <div className="flex items-center gap-3 mb-6 border-b border-[#1A1612]/5 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E85D2F]/10 text-[#E85D2F] flex items-center justify-center text-lg">
                <i className="fa-solid fa-user-gear"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-[#1A1612]">Edit Profil & Akun</h2>
                <p className="text-xs text-[#6B5D4F]">Perbarui data pribadi dan kata sandi akun Anda</p>
              </div>
            </div>
            
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5D4F] mb-2">
                  Pilih Avatar Profil
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {avatarOptions.map((url, i) => (
                    <button 
                      key={i} 
                      type="button" 
                      onClick={() => setEditAvatar(url)}
                      className={`rounded-2xl overflow-hidden border-2 transition-all p-1 bg-[#F4EFE6] ${
                        editAvatar === url 
                          ? 'border-[#E85D2F] ring-2 ring-[#E85D2F]/20 scale-105' 
                          : 'border-transparent hover:scale-105'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i+1}`} className="w-full h-auto rounded-xl" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5D4F] mb-1.5">
                    Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#1A1612]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E85D2F] focus:ring-2 focus:ring-[#E85D2F]/10 transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5D4F] mb-1.5">
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#1A1612]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E85D2F] focus:ring-2 focus:ring-[#E85D2F]/10 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Gender Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5D4F] mb-2">
                  Jenis Kelamin
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setEditGender('Laki-laki')}
                    className={`py-2.5 px-4 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      editGender === 'Laki-laki' 
                        ? 'border-[#E85D2F] text-[#E85D2F] bg-white shadow-xs' 
                        : 'border-transparent bg-[#F4EFE6] text-[#6B5D4F]'
                    }`}
                  >
                    <i className="fa-solid fa-mars"></i> Laki-laki
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditGender('Perempuan')}
                    className={`py-2.5 px-4 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      editGender === 'Perempuan' 
                        ? 'border-[#E85D2F] text-[#E85D2F] bg-white shadow-xs' 
                        : 'border-transparent bg-[#F4EFE6] text-[#6B5D4F]'
                    }`}
                  >
                    <i className="fa-solid fa-venus"></i> Perempuan
                  </button>
                </div>
              </div>

              {/* Change Password Area */}
              <div className="pt-2 border-t border-[#1A1612]/5 space-y-3">
                <span className="text-xs font-bold text-[#1A1612] block">
                  Ubah Kata Sandi (Opsional)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="password" 
                    value={editPassword} 
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Password baru (opsional)"
                    className="w-full bg-[#F4EFE6] border border-[#1A1612]/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#E85D2F]"
                  />
                  {editPassword.length > 0 && (
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi password baru"
                      className="w-full bg-[#F4EFE6] border border-[#1A1612]/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#E85D2F]"
                    />
                  )}
                </div>
              </div>

              {validationError && (
                <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{validationError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-[#1A1612]/5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#6B5D4F] hover:bg-[#F4EFE6] transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving} 
                  className="bg-[#E85D2F] hover:bg-[#C8431C] text-white py-2.5 px-6 rounded-xl font-bold text-xs shadow-md shadow-[#E85D2F]/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Menyimpan...</>
                  ) : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE TRIP MODAL (Custom alert)                             */}
      {/* ============================================================ */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#1A1612]/10">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-lg shrink-0 border border-red-100">
                <i className="fa-regular fa-trash-can"></i>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#1A1612]">
                  Hapus Riwayat Trip?
                </h3>
                <p className="text-xs text-[#6B5D4F] mt-1 leading-relaxed">
                  Itinerary ke <strong className="text-[#1A1612]">{tripToDelete.destination}</strong> akan dihapus secara permanen.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setTripToDelete(null)}
                disabled={isDeletingTrip}
                className="px-4 py-2.5 text-xs font-bold text-[#6B5D4F] hover:text-[#1A1612] rounded-xl hover:bg-[#F4EFE6] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteTrip}
                disabled={isDeletingTrip}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
              >
                {isDeletingTrip ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-trash-can text-xs"></i>
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
