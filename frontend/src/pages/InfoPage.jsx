import React, { useState, useEffect } from 'react'
import Card from '../components/Card';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function InfoPage() {
  const [healthArticles, setHealthArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/information`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Transform backend data to match Card component format
          const transformedData = data.data.map((item) => ({
            id: item._id,
            title: item.title,
            description: item.excerpt,
            category: item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('-', ' '),
            date: new Date(item.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            content: item.content,
            imageUrl: item.imageUrl,
            views: item.views
          }));
          setHealthArticles(transformedData);
        }
      } catch (err) {
        console.error('Error fetching information:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInformation();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Latest Health Information</h2>
          <p className="text-slate-500">Stay updated with essential health guidelines and wellness tips.</p>
        </div>
        <div className="space-y-6">
          <p className="text-center text-slate-600">Loading health information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Latest Health Information</h2>
          <p className="text-slate-500">Stay updated with essential health guidelines and wellness tips.</p>
        </div>
        <div className="space-y-6">
          <p className="text-center text-red-600">Error loading information: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Latest Health Information</h2>
        <p className="text-slate-500">Stay updated with essential health guidelines and wellness tips.</p>
      </div>

      {/* Health Cards Grid */}
      <div className="space-y-6">
        {healthArticles.length > 0 ? (
          healthArticles.map((topic) => (
            <Card key={topic.id} data={topic} />
          ))
        ) : (
          <p className="text-center text-slate-600">No health information available.</p>
        )}
      </div>
    </div>
  )
}

export default InfoPage