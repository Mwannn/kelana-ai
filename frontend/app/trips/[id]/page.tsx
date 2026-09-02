'use client';

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getTrip } from "@/services/tripService";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Footer from "@/components/Footer";

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const [tripData, setTripData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const data = await getTrip(resolvedParams.id);
        setTripData(data);
      } catch (err: any) {
        console.error("Failed to fetch trip detail:", err);
        if (err.message.includes('401') || err.message.includes('Failed to fetch')) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          setError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [resolvedParams.id, router]);

  if (isLoading) {
    return (
      <main className="bg-[#F4EFE6] min-h-screen py-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1A1612]/20 border-t-[#E85D2F] rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !tripData) {
    return (
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-32 min-h-screen text-center">
        <h1 className="font-display text-4xl font-bold mb-4">Trip Not Found</h1>
        <p className="text-[#6B5D4F] mb-8">We couldn't find the trip you're looking for.</p>
        <Link href="/trips" className="text-[#E85D2F] font-semibold hover:underline">
          &larr; Back to Trips
        </Link>
      </div>
    );
  }

  return (
    <>
    <main className="bg-[#F4EFE6] min-h-screen py-32">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        <Link href="/trips" className="inline-flex items-center gap-2 text-[#6B5D4F] hover:text-[#E85D2F] transition-colors font-medium mb-8 cursor-hover-target">
          <i className="fa-solid fa-arrow-left"></i> Back to Trips
        </Link>
        
        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-8">{tripData.destination}</h1>
        
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-[#1A1612]/10">
            <div className="font-mono text-xs text-[#E85D2F] font-bold tracking-widest uppercase mb-1">Destination</div>
            <div className="font-medium text-lg text-[#1A1612]">{tripData.destination}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#1A1612]/10">
            <div className="font-mono text-xs text-[#E85D2F] font-bold tracking-widest uppercase mb-1">Budget</div>
            <div className="font-medium text-lg text-[#1A1612]">
              {new Intl.NumberFormat(tripData.currency === 'IDR' ? 'id-ID' : 'en-US', {
                style: 'currency',
                currency: tripData.currency,
                minimumFractionDigits: 0
              }).format(tripData.budget)}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#1A1612]/10">
            <div className="font-mono text-xs text-[#E85D2F] font-bold tracking-widest uppercase mb-1">Category / Style</div>
            <div className="font-medium text-lg text-[#1A1612] capitalize">
              {tripData.travel_style}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#1A1612]/10">
            <div className="font-mono text-xs text-[#E85D2F] font-bold tracking-widest uppercase mb-1">Days</div>
            <div className="font-medium text-lg text-[#1A1612]">{tripData.days} days</div>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <h2 className="font-mono text-sm tracking-widest font-bold text-[#6B5D4F] uppercase">Kelana AI Recommendation</h2>
          <div className="h-px bg-[#1A1612]/10 flex-1"></div>
        </div>

        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-[#1A1612]/10 shadow-sm">
          <div className="markdown-content max-w-none">
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }) {
                  const content = String(children).trim();
                  if (content.startsWith('icon:')) {
                    const iconClass = content.replace('icon:', '').trim();
                    return <i className={`${iconClass} text-[#E85D2F] mr-2`}></i>;
                  }
                  return <code className={className} {...props}>{children}</code>;
                }
              }}
            >
              {(tripData.ai_recommendation || "No detailed itinerary available.").replace(/icon:(fa-[a-z0-9-]+ fa-[a-z0-9-]+)/g, '`icon:$1`')}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
