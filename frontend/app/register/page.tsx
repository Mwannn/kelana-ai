'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Registration failed');
      }

      // Automatically log in after registration, or redirect to login
      router.push('/login?registered=true');
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
          <p className="text-[#6B5D4F]">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A1612] mb-2 uppercase tracking-wider">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-[#F4EFE6] border border-transparent rounded-xl focus:outline-none focus:border-[#E85D2F] transition-colors"
              placeholder="Alice"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B5D4F] mt-8">
          Already have an account? <Link href="/login" className="text-[#E85D2F] font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
