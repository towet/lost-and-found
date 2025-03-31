import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, MapPin, Calendar,
  CheckCircle, Eye, Mail, Search as SearchIcon,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Item } from '../types/item';
import { getItems, searchItems, markAsRetrieved } from '../services/itemService';
import AdminAuthModal from '../components/AdminAuthModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showReportTypeModal, setShowReportTypeModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      console.log('Loading items...');
      const fetchedItems = await getItems();
      console.log('Items loaded:', fetchedItems);
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);

    try {
      if (query.trim()) {
        const results = await searchItems(query);
        setItems(results);
      } else {
        await loadItems(); // Reload all items when search is cleared
      }
    } catch (error) {
      console.error('Error searching items:', error);
    }

    setIsSearching(false);
  };

  const handleMarkAsRetrieved = async (item: Item) => {
    try {
      await markAsRetrieved(item.id);
      // Update local state immediately
      setItems(prevItems => prevItems.filter(i => i.id !== item.id));
      setShowClaimModal(false);
      setShowAdminAuthModal(false);
    } catch (error) {
      console.error('Error marking item as retrieved:', error);
    }
  };

  const ReportTypeModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setShowReportTypeModal(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">What would you like to report?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl border-2 border-[#800020] bg-white hover:bg-[#800020] hover:text-white group transition-all"
            onClick={() => {
              setShowReportTypeModal(false);
              navigate('/report', { state: { type: 'lost' } });
            }}
          >
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-[#800020] group-hover:text-white" />
            <h3 className="text-lg font-semibold text-center">Lost Item</h3>
            <p className="text-sm text-gray-600 text-center mt-2 group-hover:text-white">
              Report an item you've lost
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl border-2 border-[#2E8B57] bg-white hover:bg-[#2E8B57] hover:text-white group transition-all"
            onClick={() => {
              setShowReportTypeModal(false);
              navigate('/report', { state: { type: 'found' } });
            }}
          >
            <SearchIcon className="w-12 h-12 mx-auto mb-4 text-[#2E8B57] group-hover:text-white" />
            <h3 className="text-lg font-semibold text-center">Found Item</h3>
            <p className="text-sm text-gray-600 text-center mt-2 group-hover:text-white">
              Report an item you've found
            </p>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  const ItemCard = ({ item }: { item: Item }) => (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="relative">
        <img
          src={item.image_url || 'https://via.placeholder.com/500x300'}
          alt={item.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
          item.type === 'found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {item.type === 'found' ? 'Found' : 'Lost'}
        </span>
      </div>

      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          {item.location}
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          {format(new Date(item.date), 'MMM d, yyyy')}
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedItem(item);
          setShowClaimModal(true);
        }}
        className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
          item.type === 'lost'
            ? 'bg-[#800020] text-white hover:bg-[#600018]'
            : 'border-2 border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white'
        }`}
      >
        {item.type === 'lost' ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            I Found This
          </>
        ) : (
          <>
            <Eye className="w-5 h-5 mr-2" />
            Claim Item
          </>
        )}
      </button>
    </div>
  );

  const ClaimModal = ({ item }: { item: Item }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6"
      onClick={() => setShowClaimModal(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-[800px] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center mb-6">
          {item.type === 'found' ? (
            <CheckCircle className="w-8 h-8 text-[#2E8B57] mr-3" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-[#800020] mr-3" />
          )}
          <h2 className="text-2xl font-bold">
            {item.type === 'found' ? 'Claim Item' : 'Contact Owner'}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <img
                src={item.image_url || 'https://via.placeholder.com/500x300'}
                alt={item.title}
                className="rounded-lg w-full h-[300px] object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>

              {item.type === 'found' && item.claim_requirements && item.claim_requirements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Claim Requirements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {item.claim_requirements.map((req: string, index: number) => (
                      <li key={index} className="text-gray-600">{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-2">
                  {item.contact_info && (
                    <>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.contact_info.department}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {item.contact_info.department}
                        </a>
                      </div>
                    </>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.user_email}&su=${encodeURIComponent(`Regarding your ${item.type} item: ${item.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {item.user_email}
                    </a>
                  </div>
                  <button
                    onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${item.user_email}&su=${encodeURIComponent(`Regarding your ${item.type} item: ${item.title}`)}`, '_blank')}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={() => setShowAdminAuthModal(true)}
            className="px-4 py-2 bg-[#2E8B57] text-white rounded-lg hover:bg-[#236B42]"
          >
            Mark as Retrieved
          </button>
          <button
            onClick={() => setShowClaimModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.type === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track, report, and claim lost items</p>
        </div>
        <button 
          className="btn-primary flex items-center"
          onClick={() => setShowReportTypeModal(true)}
        >
          <Plus className="mr-2" /> Report Item
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for items..."
              className="input-field pl-10 w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#800020] border-t-transparent"></div>
              </div>
            )}
          </div>
          <button className="btn-primary bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
            <Filter className="mr-2" /> Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Items', value: items.length, icon: Eye, color: 'text-blue-600' },
          { 
            label: 'Items Found', 
            value: items.filter(i => i.type === 'found').length, 
            icon: CheckCircle, 
            color: 'text-green-600' 
          },
          { 
            label: 'Items Lost', 
            value: items.filter(i => i.type === 'lost').length, 
            icon: AlertTriangle, 
            color: 'text-red-600' 
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full bg-opacity-10 ${stat.color} bg-current`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'lost', label: 'Lost Items' },
          { id: 'found', label: 'Found Items' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-[#800020] text-[#800020]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {items.slice(0, 3).map((item) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card min-w-[300px] flex-shrink-0"
            >
              <div className="p-4 flex items-center space-x-4">
                <img
                  src={item.image_url || 'https://via.placeholder.com/500x300'}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{format(new Date(item.date), 'MMM d, yyyy')}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.type === 'found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  } mt-2`}>
                    {item.type === 'found' ? 'Found' : 'Lost'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -4 }}
            className="card"
          >
            <ItemCard item={item} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showReportTypeModal && <ReportTypeModal key="report-type-modal" />}
        {showClaimModal && selectedItem && (
          <ClaimModal key="claim-modal" item={selectedItem} />
        )}
        <AdminAuthModal
          key="admin-auth-modal"
          isOpen={showAdminAuthModal}
          onClose={() => setShowAdminAuthModal(false)}
          onSuccess={() => handleMarkAsRetrieved(selectedItem!)}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;