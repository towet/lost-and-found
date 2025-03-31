import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Upload, Search as SearchIcon,
  AlertTriangle
} from 'lucide-react';
import { createItem } from '../services/itemService';
import { useAuth } from '../contexts/AuthContext';

const ReportItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const reportType = location.state?.type as 'lost' | 'found' || 'lost';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    claim_requirements: [''],
    reward: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to report an item');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const itemData = {
        ...formData,
        type: reportType,
        user_email: user.email!,
        claim_requirements: formData.claim_requirements.filter(req => req.trim() !== '')
      };

      await createItem(itemData, selectedImage || undefined);
      navigate('/dashboard');
    } catch (error) {
      setError('Error submitting item. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center mb-6">
            {reportType === 'lost' ? (
              <AlertTriangle className="w-8 h-8 text-[#800020] mr-3" />
            ) : (
              <SearchIcon className="w-8 h-8 text-[#2E8B57] mr-3" />
            )}
            <h1 className="text-2xl font-bold">
              Report {reportType === 'lost' ? 'Lost' : 'Found'} Item
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., Blue Nike Backpack"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field min-h-[100px] w-full"
                placeholder={reportType === 'lost' 
                  ? "Provide detailed description of your lost item..."
                  : "Provide detailed description of the item you found..."}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder={`Where was it ${reportType}?`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#800020] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {selectedImage ? (
                    <div className="space-y-2">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="max-h-32 mx-auto"
                      />
                      <p className="text-sm text-gray-500">Click to change image</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {reportType === 'found' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claim Requirements
                </label>
                {formData.claim_requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => {
                        const newReqs = [...formData.claim_requirements];
                        newReqs[index] = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          claim_requirements: newReqs
                        }));
                      }}
                      className="input-field flex-1"
                      placeholder="e.g., Must provide serial number"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newReqs = formData.claim_requirements.filter((_, i) => i !== index);
                        setFormData(prev => ({
                          ...prev,
                          claim_requirements: newReqs
                        }));
                      }}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      claim_requirements: [...prev.claim_requirements, '']
                    }));
                  }}
                  className="text-sm text-[#800020] hover:text-[#600018]"
                >
                  + Add requirement
                </button>
              </div>
            )}

            {reportType === 'lost' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reward (Optional)
                </label>
                <input
                  type="text"
                  name="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="e.g., $50"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#600018] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;
