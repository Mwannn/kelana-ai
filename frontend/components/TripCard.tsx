import Link from 'next/link';

interface Trip {
  id: number;
  destination: string;
  budget: number;
  currency: string;
  days: number;
  travel_style: string;
}

const getDestinationIcon = (destination: string) => {
  const dest = destination.toLowerCase();
  if (dest.includes('japan')) return '🇯🇵';
  if (dest.includes('bali')) return '🏝️';
  if (dest.includes('singapore')) return '🇸🇬';
  if (dest.includes('bromo')) return '🌋';
  if (dest.includes('toba')) return '🏞️';
  if (dest.includes('raja ampat') || dest.includes('labuan bajo') || dest.includes('gili')) return '🐢';
  return '📍';
};

const getCategoryBadge = (budget: number, currency: string) => {
  const isUSD = currency === 'USD';
  const thresholdStandard = isUSD ? 300 : 3000000;
  const thresholdLuxury = isUSD ? 1500 : 15000000;

  if (budget < thresholdStandard) {
    return { label: 'Backpacker', color: 'bg-green-100 text-green-800' };
  } else if (budget < thresholdLuxury) {
    return { label: 'Standard', color: 'bg-blue-100 text-blue-800' };
  } else {
    return { label: 'Luxury', color: 'bg-purple-100 text-purple-800' };
  }
};

const getTravelStyleBadge = (style: string) => {
  const normalized = style.toLowerCase();
  if (normalized === 'luxury' || normalized === 'relaxation') return 'Couple';
  if (normalized === 'adventure' || normalized === 'budget') return 'Solo';
  return 'Family'; // cultural, etc.
};

export default function TripCard({ trip }: { trip: Trip }) {
  const category = getCategoryBadge(trip.budget, trip.currency);
  const travelStyleGroup = getTravelStyleBadge(trip.travel_style);
  const icon = getDestinationIcon(trip.destination);
  const formattedBudget = new Intl.NumberFormat(trip.currency === 'IDR' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: trip.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(trip.budget);

  return (
    <div className="bg-white border border-[#1A1612]/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#F4EFE6] flex items-center justify-center text-2xl flex-shrink-0">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-display font-bold text-xl text-[#1A1612]">{trip.destination}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${category.color}`}>
              {category.label}
            </span>
          </div>
          <p className="text-[#6B5D4F] text-sm flex items-center gap-2">
            <span>{trip.days} days</span>
            <span className="w-1 h-1 rounded-full bg-[#1A1612]/20"></span>
            <span className="font-medium text-[#1A1612]">{formattedBudget}</span>
            <span className="w-1 h-1 rounded-full bg-[#1A1612]/20"></span>
            <span className="flex items-center gap-1">
              <i className={travelStyleGroup === 'Solo' ? 'fa-solid fa-user' : travelStyleGroup === 'Couple' ? 'fa-solid fa-user-group' : 'fa-solid fa-users'}></i>
              {travelStyleGroup}
            </span>
          </p>
        </div>
      </div>
      
      <Link href={`/trips/${trip.id}`} className="btn-primary w-full sm:w-auto px-6 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 flex-shrink-0">
        View Details <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </div>
  );
}
