import { MapPin, DollarSign, Calendar, Users, Heart, Star, Wifi, Sparkles, Coffee, Dumbbell } from 'lucide-react';

const listings = [
  {
    id: 1,
    title: 'Spacious Room in Downtown Loft',
    location: 'Downtown, San Francisco',
    price: 1200,
    available: 'June 1, 2026',
    roommates: 2,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    verified: true,
    rating: 4.8,
    amenities: ['Wifi', 'Gym', 'Furnished']
  },
  {
    id: 2,
    title: 'Cozy Room Near University',
    location: 'Mission District, SF',
    price: 950,
    available: 'May 15, 2026',
    roommates: 3,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    verified: true,
    rating: 4.9,
    amenities: ['Wifi', 'Pet-friendly', 'Furnished']
  },
  {
    id: 3,
    title: 'Modern Studio with Great View',
    location: 'SOMA, San Francisco',
    price: 1800,
    available: 'June 15, 2026',
    roommates: 0,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    verified: true,
    rating: 5.0,
    amenities: ['Wifi', 'Gym', 'Balcony']
  },
  {
    id: 4,
    title: 'Bright Room in Shared House',
    location: 'Sunset District, SF',
    price: 1100,
    available: 'May 20, 2026',
    roommates: 4,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
    verified: false,
    rating: 4.7,
    amenities: ['Wifi', 'Garden', 'Parking']
  }
];

const amenityIcons: Record<string, any> = {
  'Wifi': Wifi,
  'Gym': Dumbbell,
  'Furnished': Coffee,
  'Pet-friendly': Heart,
  'Balcony': Sparkles,
  'Garden': Sparkles,
  'Parking': MapPin
};

export function FeaturedListings() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Featured Listings
            </h2>
            <p className="text-neutral-600">
              Hand-picked rooms and roommates from verified hosts
            </p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-semibold">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-neutral-700" />
                </button>
                {listing.verified && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900 line-clamp-2">
                    {listing.title}
                  </h3>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Calendar className="w-4 h-4" />
                    Available {listing.available}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Users className="w-4 h-4" />
                    {listing.roommates === 0 ? 'Private' : `${listing.roommates} roommates`}
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {listing.amenities.slice(0, 3).map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Wifi;
                    return (
                      <span
                        key={index}
                        className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-md flex items-center gap-1"
                      >
                        <Icon className="w-3 h-3" />
                        {amenity}
                      </span>
                    );
                  })}
                </div>

                {/* Price & Rating */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <div>
                    <span className="text-xl font-bold text-neutral-900">
                      ${listing.price}
                    </span>
                    <span className="text-sm text-neutral-600">/month</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-neutral-900">
                      {listing.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
