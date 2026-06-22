import { MapPin, Briefcase, Calendar, Heart, Star, Coffee, Music, Book, Dumbbell } from 'lucide-react';

const roommates = [
  {
    id: 1,
    name: 'Sarah Chen',
    age: 26,
    profession: 'Software Engineer',
    location: 'Downtown, San Francisco',
    budget: '$1000-1500',
    moveIn: 'June 1, 2026',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    verified: true,
    rating: 4.9,
    interests: ['Coffee', 'Gym', 'Reading']
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    age: 24,
    profession: 'Graphic Designer',
    location: 'Mission District, SF',
    budget: '$800-1200',
    moveIn: 'May 15, 2026',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    verified: true,
    rating: 5.0,
    interests: ['Music', 'Coffee', 'Reading']
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    age: 28,
    profession: 'Marketing Manager',
    location: 'SOMA, San Francisco',
    budget: '$1500-2000',
    moveIn: 'June 15, 2026',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
    verified: true,
    rating: 4.8,
    interests: ['Gym', 'Coffee', 'Music']
  },
  {
    id: 4,
    name: 'Alex Kumar',
    age: 25,
    profession: 'Data Analyst',
    location: 'Sunset District, SF',
    budget: '$900-1300',
    moveIn: 'May 20, 2026',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    verified: true,
    rating: 4.7,
    interests: ['Reading', 'Gym', 'Coffee']
  }
];

const interestIcons: Record<string, any> = {
  'Coffee': Coffee,
  'Gym': Dumbbell,
  'Reading': Book,
  'Music': Music
};

export function FeaturedRoommates() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Featured Roommates
            </h2>
            <p className="text-neutral-600">
              Connect with verified roommates looking for a place to share
            </p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-semibold">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roommates.map((roommate) => (
            <div
              key={roommate.id}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={roommate.image}
                  alt={roommate.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-neutral-700" />
                </button>
                {roommate.verified && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-lg">
                      {roommate.name}
                    </h3>
                    <p className="text-sm text-neutral-600">{roommate.age} years old</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-neutral-900">
                      {roommate.rating}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Briefcase className="w-4 h-4" />
                    {roommate.profession}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    {roommate.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Calendar className="w-4 h-4" />
                    Moving {roommate.moveIn}
                  </div>
                </div>

                {/* Interests */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {roommate.interests.map((interest, index) => {
                    const Icon = interestIcons[interest] || Coffee;
                    return (
                      <span
                        key={index}
                        className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-md flex items-center gap-1"
                      >
                        <Icon className="w-3 h-3" />
                        {interest}
                      </span>
                    );
                  })}
                </div>

                {/* Budget */}
                <div className="pt-3 border-t border-neutral-200">
                  <div className="text-sm text-neutral-600">Budget</div>
                  <div className="text-lg font-bold text-neutral-900">
                    {roommate.budget}
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
