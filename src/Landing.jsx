import React, { useState, useEffect } from 'react';
import { Cloud, Shield, Download, Upload, Zap, Lock, Users, Star, ArrowRight, CheckCircle, Play } from 'lucide-react';
import { useAuth } from "react-oidc-context";
const Landing = () => {
  const { signinRedirect } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Military-Grade Security",
      description: "Your files are protected with end-to-end encryption and advanced security protocols."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Upload and download files at blazing speeds with our optimized cloud infrastructure."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Share files securely with your team and collaborate in real-time."
    }
  ];

  const stats = [
    { number: "10M+", label: "Files Stored" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Countries" },
    { number: "50K+", label: "Happy Users" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-spin slow"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CloudSafe
          </span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 lg:px-12 text-center">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Your Files,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Safely in the Cloud
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Store, sync, and share your files with military-grade security. Access your data from anywhere, anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-2xl" onClick={() => signinRedirect()}>
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center space-x-2 px-8 py-4 rounded-full border-2 border-gray-600 hover:border-blue-400 transition-all duration-300 transform hover:scale-105">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Floating UI Elements */}
        <div className="relative mt-16 max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-semibold mb-2">Upload</h3>
                <p className="text-gray-400">Drag & drop files instantly</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-lg font-semibold mb-2">Secure</h3>
                <p className="text-gray-400">End-to-end encryption</p>
              </div>
              <div className="text-center">
                <Download className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-semibold mb-2">Download</h3>
                <p className="text-gray-400">Access from anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose CloudSafe?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the perfect blend of security, speed, and simplicity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-500 transform hover:scale-105 ${
                  index === activeFeature ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 backdrop-blur-xl border border-gray-700">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Secure Your Files?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join millions of users who trust CloudSafe with their most important files
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2" onClick={() => signinRedirect()}>
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-full border-2 border-gray-600 hover:border-blue-400 transition-all duration-300 transform hover:scale-105">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 lg:px-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CloudSafe
              </span>
            </div>
            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 CloudSafe. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .slow {
          animation-duration: 20s;
        }
      `}</style>
    </div>
  );
};
export default Landing;