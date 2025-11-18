import React from 'react'
import Card from '../components/Card';


// --- Data for the articles ---
// In a real app, this would come from an API.
const healthArticles = [
  {
    id: 1,
    title: "COVID-19 Updates",
    description: "Stay informed about the latest COVID-19 guidelines and vaccination information.",
    category: "Infectious Disease",
    date: "Oct 24, 2025"
  },
  {
    id: 2,
    title: "Seasonal Flu Prevention",
    description: "Learn about steps you can take to prevent the seasonal flu and when to get vaccinated.",
    category: "Prevention",
    date: "Sep 15, 2025"
  },
  {
    id: 3,
    title: "Mental Health Awareness",
    description: "Explore resources and support options for maintaining good mental health.",
    category: "Wellness",
    date: "Ongoing"
  }
];

function InfoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Latest Health Information</h2>
        <p className="text-slate-500">Stay updated with essential health guidelines and wellness tips.</p>
      </div>

      {/* Health Cards Grid */}
      <div className="space-y-6">
        {healthArticles.map((topic) => (
          <Card key={topic.id} data={topic} />
        ))}
      </div>
    </div>
  )
}

export default InfoPage