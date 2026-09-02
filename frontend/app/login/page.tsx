'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.get('registered') === 'true') {
      setSuccess('Account created successfully. Please log in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      
      // Redirect to dashboard
      router.push('/trips');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#F4EFE6] min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-12 rounded-3xl w-full max-w-md shadow-sm border border-[#1A1612]/10">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-[#E85D2F] mb-2">KelanaAI</h1>
          <p className="text-[#6B5D4F]">Welcome back</p>
        </div>

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A1612] mb-2 uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-[#F4EFE6] border border-transparent rounded-xl focus:outline-none focus:border-[#E85D2F] transition-colors"
              placeholder="alice@email.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1A1612] mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-[#F4EFE6] border border-transparent rounded-xl focus:outline-none focus:border-[#E85D2F] transition-colors"
              placeholder="••••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-full font-bold mt-6 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B5D4F] mt-8">
          Don't have an account? <Link href="/register" className="text-[#E85D2F] font-bold hover:underline">Register</Link>
        </p>
      </div>
    </main>
  );
}
