import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calendar, TrendingUp, Heart, Brain, MessageSquare, User, Settings, Bell } from 'lucide-react';

const WellnessMonitor = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [moodEntries, setMoodEntries] = useState([
    { date: '2024-01-01', mood: 7, anxiety: 3, stress: 4, energy: 6, notes: 'Started new semester, feeling optimistic' },
    { date: '2024-01-02', mood: 6, anxiety: 4, stress: 5, energy: 5, notes: 'Lots of coursework already' },
    { date: '2024-01-03', mood: 8, anxiety: 2, stress: 3, energy: 8, notes: 'Great day with friends, feeling balanced' },
    { date: '2024-01-04', mood: 5, anxiety: 6, stress: 7, energy: 4, notes: 'Midterm stress kicking in' },
    { date: '2024-01-05', mood: 7, anxiety: 3, stress: 4, energy: 7, notes: 'Meditation helped a lot' },
    { date: '2024-01-06', mood: 6, anxiety: 4, stress: 5, energy: 6, notes: 'Regular day, staying consistent' },
    { date: '2024-01-07', mood: 9, anxiety: 1, stress: 2, energy: 9, notes: 'Amazing weekend with family!' }
  ]);
  
  const [todayMood, setTodayMood] = useState({
    mood: 5,
    anxiety: 5,
    stress: 5,
    energy: 5,
    notes: ''
  });

  // Sentiment Analysis Function
  const analyzeSentiment = (text) => {
    const positiveWords = ['great', 'amazing', 'wonderful', 'happy', 'excited', 'optimistic', 'balanced', 'good', 'fantastic', 'love', 'joy', 'peaceful'];
    const negativeWords = ['stress', 'anxious', 'worried', 'tired', 'overwhelmed', 'sad', 'depressed', 'difficult', 'hard', 'exhausted', 'frustrated'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  };

  // Generate Personalized Recommendations
  const getRecommendations = () => {
    const recentEntries = moodEntries.slice(-3);
    const avgMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    const avgAnxiety = recentEntries.reduce((sum, entry) => sum + entry.anxiety, 0) / recentEntries.length;
    const avgStress = recentEntries.reduce((sum, entry) => sum + entry.stress, 0) / recentEntries.length;
    const avgEnergy = recentEntries.reduce((sum, entry) => sum + entry.energy, 0) / recentEntries.length;

    const recommendations = [];

    if (avgMood < 5) {
      recommendations.push({
        type: 'mood',
        title: 'Mood Enhancement',
        suggestion: 'Try engaging in activities you enjoy - listen to uplifting music, spend time with friends, or practice gratitude journaling.',
        icon: '😊'
      });
    }

    if (avgAnxiety > 6) {
      recommendations.push({
        type: 'anxiety',
        title: 'Anxiety Management',
        suggestion: 'Practice deep breathing exercises, try progressive muscle relaxation, or consider speaking with a counselor.',
        icon: '🧘'
      });
    }

    if (avgStress > 6) {
      recommendations.push({
        type: 'stress',
        title: 'Stress Reduction',
        suggestion: 'Break large tasks into smaller ones, practice time management, and ensure you\'re getting adequate sleep.',
        icon: '⏰'
      });
    }

    if (avgEnergy < 5) {
      recommendations.push({
        type: 'energy',
        title: 'Energy Boost',
        suggestion: 'Focus on regular exercise, maintain consistent sleep schedule, and eat nutritious meals throughout the day.',
        icon: '⚡'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'maintenance',
        title: 'Keep Up the Great Work!',
        suggestion: 'You\'re maintaining good wellness habits. Continue with regular self-care and stay connected with your support network.',
        icon: '🌟'
      });
    }

    return recommendations;
  };

  const handleMoodSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const sentiment = analyzeSentiment(todayMood.notes);
    
    const newEntry = {
      ...todayMood,
      date: today,
      sentiment
    };
    
    setMoodEntries(prev => [...prev.filter(entry => entry.date !== today), newEntry]);
    
    // Reset form
    setTodayMood({
      mood: 5,
      anxiety: 5,
      stress: 5,
      energy: 5,
      notes: ''
    });
    
    // Show success message (in a real app, you'd use a toast notification)
    alert('Mood entry saved successfully!');
  };

  const MoodSlider = ({ label, value, onChange, color }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}: {value}/10
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={onChange}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${color}`}
        style={{
          background: `linear-gradient(to right, ${color === 'bg-blue-200' ? '#bfdbfe' : color === 'bg-red-200' ? '#fecaca' : color === 'bg-yellow-200' ? '#fef3c7' : '#bbf7d0'} 0%, ${color === 'bg-blue-200' ? '#3b82f6' : color === 'bg-red-200' ? '#ef4444' : color === 'bg-yellow-200' ? '#f59e0b' : '#10b981'} ${value * 10}%, #e5e7eb ${value * 10}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );

  const DashboardView = () => {
    const recommendations = getRecommendations();
    const recentMood = moodEntries[moodEntries.length - 1];
    const weeklyData = moodEntries.slice(-7);

    const radarData = [
      { subject: 'Mood', A: recentMood?.mood || 5, fullMark: 10 },
      { subject: 'Energy', A: recentMood?.energy || 5, fullMark: 10 },
      { subject: 'Low Stress', A: 10 - (recentMood?.stress || 5), fullMark: 10 },
      { subject: 'Low Anxiety', A: 10 - (recentMood?.anxiety || 5), fullMark: 10 }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Current Mood</p>
                <p className="text-2xl font-bold">{recentMood?.mood || 'N/A'}/10</p>
              </div>
              <Heart className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Energy Level</p>
                <p className="text-2xl font-bold">{recentMood?.energy || 'N/A'}/10</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Stress Level</p>
                <p className="text-2xl font-bold">{recentMood?.stress || 'N/A'}/10</p>
              </div>
              <Brain className="w-8 h-8 text-yellow-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Check-ins</p>
                <p className="text-2xl font-bold">{moodEntries.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Weekly Mood Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis domain={[1, 10]} />
                <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Wellness Radar</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 10]} />
                <Radar name="Wellness" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{rec.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const CheckInView = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Daily Check-In</h2>
        
        <MoodSlider
          label="Overall Mood"
          value={todayMood.mood}
          onChange={(e) => setTodayMood(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
          color="bg-blue-200"
        />
        
        <MoodSlider
          label="Energy Level"
          value={todayMood.energy}
          onChange={(e) => setTodayMood(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
          color="bg-green-200"
        />
        
        <MoodSlider
          label="Stress Level"
          value={todayMood.stress}
          onChange={(e) => setTodayMood(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
          color="bg-yellow-200"
        />
        
        <MoodSlider
          label="Anxiety Level"
          value={todayMood.anxiety}
          onChange={(e) => setTodayMood(prev => ({ ...prev, anxiety: parseInt(e.target.value) }))}
          color="bg-red-200"
        />
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling today? (Optional)
          </label>
          <textarea
            value={todayMood.notes}
            onChange={(e) => setTodayMood(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Share your thoughts, experiences, or anything on your mind..."
          />
          {todayMood.notes && (
            <p className="mt-2 text-sm text-gray-600">
              Sentiment: <span className={`font-medium ${
                analyzeSentiment(todayMood.notes) === 'positive' ? 'text-green-600' :
                analyzeSentiment(todayMood.notes) === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {analyzeSentiment(todayMood.notes)}
              </span>
            </p>
          )}
        </div>
        
        <button
          onClick={handleMoodSubmit}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Submit Check-In
        </button>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Detailed Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={moodEntries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
            <YAxis domain={[1, 10]} />
            <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
            <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} name="Mood" />
            <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Energy" />
            <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} name="Stress" />
            <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} name="Anxiety" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {moodEntries.slice(-5).reverse().map((entry, index) => (
            <div key={index} className="border border-gray-200 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                <div className="flex space-x-2 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Mood: {entry.mood}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Energy: {entry.energy}</span>
                </div>
              </div>
              {entry.notes && (
                <p className="text-gray-600 text-sm">{entry.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Student Wellness Monitor</span>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-500" />
              <User className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${
                    currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentView('checkin')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${
                    currentView === 'checkin' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Daily Check-In</span>
                </button>
                <button
                  onClick={() => setCurrentView('analytics')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${
                    currentView === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
              </div>
            </nav>
          </div>

          <div className="flex-1">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'checkin' && <CheckInView />}
            {currentView === 'analytics' && <AnalyticsView />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessMonitor;