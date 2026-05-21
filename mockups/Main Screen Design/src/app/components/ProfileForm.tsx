import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export function ProfileForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    university: 'Rutgers University',
    major: '',
    year: 'Freshman',
    email: '',
    bio: '',
    budgetMin: '600',
    budgetMax: '1000',
    housingType: 'Open to Any',
    cleanliness: 50,
    sleepSchedule: 'Flexible',
    studyHabits: 'Moderate (some background noise okay)',
    noiseTolerance: 50,
    guestsFrequency: 50,
    temperaturePreference: 'Flexible',
    willingToShare: false,
    interests: [] as string[]
  });

  const quickAddInterests = [
    'Gaming', 'Cooking', 'Fitness', 'Reading', 'Music', 'Art',
    'Hiking', 'Travel', 'Photography', 'Sports', 'Coding', 'Yoga'
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#B487C4' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <span className="text-purple-300 text-sm">Verified with university email</span>
        </div>

        <h1 className="text-4xl font-bold text-white text-center mb-2">My Profile</h1>
        <p className="text-white/60 text-center mb-8">
          Tell us about yourself so we can find your perfect roommate match.
        </p>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Basic Information</h2>
            <p className="text-white/50 text-sm mb-6">Your public profile info shown to other students</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm mb-2 block">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-white text-sm mb-2 block">Age *</label>
                  <input
                    type="number"
                    placeholder="18"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">University *</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm mb-2 block">Major *</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-white text-sm mb-2 block">Year *</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option>Freshman</option>
                    <option>Sophomore</option>
                    <option>Junior</option>
                    <option>Senior</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">University Email *</label>
                <input
                  type="email"
                  placeholder="yourname@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400"
                />
                <p className="text-white/40 text-xs mt-1">✓ Used for verification only, not shown publicly</p>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Bio *</label>
                <textarea
                  placeholder="Tell potential roommates about yourself, your habits, what you're looking for..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  maxLength={500}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 resize-none"
                />
                <p className="text-white/40 text-xs text-right mt-1">{formData.bio.length}/500</p>
              </div>
            </div>
          </div>

          {/* Budget & Housing */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Budget & Housing</h2>
            <p className="text-white/50 text-sm mb-6">What type of housing are you looking for?</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm mb-2 block">Budget Min ($/mo)</label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({...formData, budgetMin: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-white text-sm mb-2 block">Budget Max ($/mo)</label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({...formData, budgetMax: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Preferred Housing Type</label>
                <select
                  value={formData.housingType}
                  onChange={(e) => setFormData({...formData, housingType: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  <option>Open to Any</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Dorm</option>
                  <option>Studio</option>
                </select>
              </div>
            </div>
          </div>

          {/* Living Preferences */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Living Preferences</h2>
            <p className="text-white/50 text-sm mb-6">These power your compatibility score — be honest!</p>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white text-sm">Cleanliness</label>
                  <span className="text-purple-300 text-sm">Very tidy</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.cleanliness}
                  onChange={(e) => setFormData({...formData, cleanliness: parseInt(e.target.value)})}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                />
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Sleep Schedule</label>
                <select
                  value={formData.sleepSchedule}
                  onChange={(e) => setFormData({...formData, sleepSchedule: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  <option>Flexible</option>
                  <option>Early Bird (before 10pm)</option>
                  <option>Night Owl (after midnight)</option>
                  <option>Moderate (10pm - midnight)</option>
                </select>
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Study Habits</label>
                <select
                  value={formData.studyHabits}
                  onChange={(e) => setFormData({...formData, studyHabits: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  <option>Moderate (some background noise okay)</option>
                  <option>Quiet (need silence to focus)</option>
                  <option>Flexible (can study anywhere)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white text-sm">Noise Tolerance</label>
                  <span className="text-purple-300 text-sm">Noise is fine</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.noiseTolerance}
                  onChange={(e) => setFormData({...formData, noiseTolerance: parseInt(e.target.value)})}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white text-sm">Guests Frequency</label>
                  <span className="text-purple-300 text-sm">Very often</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.guestsFrequency}
                  onChange={(e) => setFormData({...formData, guestsFrequency: parseInt(e.target.value)})}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                />
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Temperature Preference</label>
                <select
                  value={formData.temperaturePreference}
                  onChange={(e) => setFormData({...formData, temperaturePreference: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  <option>Flexible</option>
                  <option>Warm</option>
                  <option>Cool</option>
                  <option>Very Warm</option>
                  <option>Very Cool</option>
                </select>
              </div>

              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <div>
                  <p className="text-white text-sm font-medium">Willing to Share Items</p>
                  <p className="text-white/50 text-xs">Food, essentials, household supplies</p>
                </div>
                <button
                  onClick={() => setFormData({...formData, willingToShare: !formData.willingToShare})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.willingToShare ? 'bg-purple-400' : 'bg-white/20'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    formData.willingToShare ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Interests & Hobbies */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Interests & Hobbies</h2>
            <p className="text-white/50 text-sm mb-6">Shared interests increase your compatibility score</p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a custom interest..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400"
                />
                <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  Add
                </button>
              </div>

              <div>
                <p className="text-white/50 text-xs mb-3">Quick add</p>
                <div className="flex flex-wrap gap-2">
                  {quickAddInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      + {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-4 rounded-full transition-all">
            Save Profile & Find My Roommate →
          </button>

          <p className="text-white/40 text-xs text-center">
            ✓ All info protected by our privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
