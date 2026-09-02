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
  if (dest.includes('japan')) return <i className="fa-solid fa-torii-gate text-[#E85D2F]"></i>;
  if (dest.includes('bali')) return <i className="fa-solid fa-umbrella-beach text-[#E85D2F]"></i>;
  if (dest.includes('singapore')) return <i className="fa-solid fa-city text-[#E85D2F]"></i>;
  if (dest.includes('bromo')) return <i className="fa-solid fa-mountain text-[#E85D2F]"></i>;
  if (dest.includes('toba')) return <i className="fa-solid fa-water text-[#E85D2F]"></i>;
  if (dest.includes('raja ampat') || dest.includes('labuan bajo') || dest.includes('gili')) return <i className="fa-solid fa-sailboat text-[#E85D2F]"></i>;
  return <i className="fa-solid fa-map-location-dot text-[#E85D2F]"></i>;
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

export default function TripCard({ trip, onDelete }: { trip: Trip, onDelete?: (id: number) => void }) {
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
    <div className="bg-white border border-[#1A1612]/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-lg transition-all duration-300 relative group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#F4EFE6] flex items-center justify-center text-2xl flex-shrink-0">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1 pr-8">
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

      <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 flex-shrink-0">
        {onDelete && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(trip.id);
            }}
            className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 flex-shrink-0"
            title="Delete Trip"
          >
            <i className="fa-solid fa-trash-can text-sm"></i>
          </button>
        )}
        <Link href={`/trips/${trip.id}`} className="btn-primary w-full sm:w-auto px-6 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 flex-shrink-0">
          <span>View Details <i className="fa-solid fa-arrow-right"></i></span>
        </Link>
      </div>
    </div>
  );
}
