import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-[#800020] text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold mb-6">
                Lost Something?
                <br />
                We'll Help You Find It
              </h1>
              <p className="text-lg mb-8 text-gray-200">
                Kabarak's premier lost and found platform. Report, search, and retrieve your lost items with ease.
              </p>
              <div className="flex space-x-4">
                <button onClick={handleAuthClick} className="btn-primary bg-[#2E8B57] hover:bg-[#236B42] text-white">
                  Report Lost Item
                </button>
                <button className="btn-primary border-2">
                  View Found Items
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <img
                src="https://www.educationnews.co.ke/wp-content/uploads/2024/10/Kabarak-University.-Photo-Courtesy.jpg"
                alt="Kabarak University"
                className="rounded-2xl shadow-2xl object-cover h-full w-full"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to recover your lost items</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-8 h-8 text-[#800020]" />,
                title: "Report Lost Item",
                description: "Submit details about your lost item including photos and location"
              },
              {
                icon: <Clock className="w-8 h-8 text-[#D4AF37]" />,
                title: "Wait for Matches",
                description: "Our system will notify you when matching items are found"
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-[#2E8B57]" />,
                title: "Retrieve Your Item",
                description: "Verify ownership and collect your item safely"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card p-6"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-[#800020] text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Lost Item?</h2>
          <p className="text-lg mb-8">Join our platform and let us help you recover what's lost.</p>
          <button
            onClick={handleAuthClick}
            className="btn-primary bg-[#2E8B57] hover:bg-[#236B42] text-white inline-flex items-center"
          >
            Get Started <ArrowRight className="ml-2" />
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;