"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  Eye,
  Lock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Activity,
  ArrowRight,
  AlertCircle,
  Zap,
  Target,
  Users,
} from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

export default function TrinexLandingPage() {
  const [scanCount, setScanCount] = useState(0);
  const [threatCount, setThreatCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const scanInterval = setInterval(() => {
      setScanCount((prev) => (prev + 1) % 100);
    }, 150);

    const threatInterval = setInterval(() => {
      setThreatCount(Math.floor(Math.random() * 50) + 20);
    }, 2000);

    const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(scanInterval);
      clearInterval(threatInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animated background grid
  const GridBackground = () => (
    <div className="absolute inset-0 opacity-20">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(75, 85, 99, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(75, 85, 99, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}
      />
    </div>
  );

  // Floating orbs
  const FloatingOrbs = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10 animate-float"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            background: `radial-gradient(circle, rgba(156, 163, 175, 0.4) 0%, transparent 70%)`,
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${8 + i * 2}s`,
          }}
        />
      ))}
    </>
  );

  // Pulse rings
  const PulseRings = () => (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute border border-gray-600 rounded-full opacity-20 animate-ping"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            animationDelay: `${i * 1}s`,
            animationDuration: '4s',
            left: `${-100 - i * 50}px`,
            top: `${-100 - i * 50}px`,
          }}
        />
      ))}
    </div>
  );

  // Data stream effect
  const DataStream = () => (
    <div className="absolute right-0 top-0 h-full w-32 overflow-hidden opacity-30">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-transparent via-gray-400 to-transparent animate-stream"
          style={{
            height: '200px',
            left: `${i * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: '3s',
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes stream {
          0% { transform: translateY(-100vh); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes slideInUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeInScale {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(156, 163, 175, 0.3); }
          50% { box-shadow: 0 0 40px rgba(156, 163, 175, 0.5); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-stream { animation: stream 3s linear infinite; }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out forwards; }
        .animate-fadeInScale { animation: fadeInScale 0.6s ease-out forwards; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #ffffff 0%, #9ca3af 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .border-gradient {
          background: linear-gradient(135deg, rgba(156, 163, 175, 0.3) 0%, rgba(75, 85, 99, 0.3) 100%);
        }
      `}</style>

      <div className="min-h-screen bg-black text-gray-200 overflow-hidden relative">
        {/* Animated Background Elements */}
        <GridBackground />
        <FloatingOrbs />
        <PulseRings />
        <DataStream />
        
        {/* Mouse follower glow */}
        <div 
          className="fixed pointer-events-none z-0 opacity-20"
          style={{
            left: mousePos.x - 100,
            top: mousePos.y - 100,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(156, 163, 175, 0.4) 0%, transparent 70%)',
            transition: 'all 0.1s ease',
          }}
        />

        {/* Header */}
        <header className="relative z-20 px-6 py-4 border-b border-gray-800/50 backdrop-blur-xl bg-black/60">
          <nav className="max-w-7xl mx-auto flex items-center justify-between animate-slideInUp">
            <div className="flex items-center space-x-3 group">
              <div className="p-2 rounded-lg border border-gray-700 group-hover:border-gray-500 transition-all animate-glow">
                <Shield className="h-5 w-5 text-gray-300" />
              </div>
              <span className="text-xl font-bold tracking-wide text-gradient">Trinex</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-gray-400">
              <a href="#features" className="hover:text-white transition-all duration-300 hover:scale-105">Features</a>
              <a href="#security" className="hover:text-white transition-all duration-300 hover:scale-105">Security</a>
              <a href="#seo" className="hover:text-white transition-all duration-300 hover:scale-105">SEO</a>
              <a href="#pricing" className="hover:text-white transition-all duration-300 hover:scale-105">Pricing</a>
            </div>
            <SignUpButton>
            <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 text-sm font-medium hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Get Started
            </button>
            </SignUpButton>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 px-6 py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div
              className={`inline-flex items-center space-x-3 bg-gray-900/60 backdrop-blur-md px-6 py-3 rounded-full mb-12 border border-gray-700 text-sm text-gray-300 transition-all duration-1000 animate-fadeInScale`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <AlertTriangle className="h-4 w-4 text-gray-400" />
              <span>Live Security & SEO Analysis</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight animate-slideInUp" style={{ animationDelay: '0.4s' }}>
              <span className="text-gradient">Secure Your App</span>
              <br />
              <span className="text-gray-400 flex items-center justify-center gap-4">
                Boost Your 
                <div className="relative">
                  <span className="text-white">SEO</span>
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-600 to-gray-400 opacity-20 blur-lg rounded-lg"></div>
                </div>
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-16 animate-slideInUp" style={{ animationDelay: '0.6s' }}>
              Advanced vulnerability scanning and SEO optimization with real-time monitoring.
              <span className="block mt-2 text-lg text-gray-500">Protect and optimize with enterprise-grade tools.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-slideInUp" style={{ animationDelay: '0.8s' }}>
              <button className="group px-8 py-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 hover:border-gray-400 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3">
                <Zap className="h-5 w-5 group-hover:text-yellow-400 transition-colors" />
                <span className="font-medium">Start Free Scan</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-xl border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <span className="font-medium">Watch Demo</span>
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-slideInUp" style={{ animationDelay: '1s' }}>
              {[
                { value: "10M+", label: "Vulnerabilities Detected", icon: Shield, color: "text-red-400" },
                { value: "99.9%", label: "Detection Accuracy", icon: Target, color: "text-green-400" },
                { value: "50K+", label: "Apps Protected", icon: Users, color: "text-blue-400" }
              ].map((stat, i) => (
                <div key={i} className="group card-hover bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-gray-600 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    <stat.icon className={`h-6 w-6 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                  <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${stat.color.includes('red') ? 'from-red-500 to-red-300' : stat.color.includes('green') ? 'from-green-500 to-green-300' : 'from-blue-500 to-blue-300'} rounded-full animate-pulse`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative px-6 py-24 bg-gradient-to-b from-black to-gray-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 animate-slideInUp">
              <div className="inline-flex items-center space-x-2 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-gray-700">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm">CORE FEATURES</span>
              </div>
              <h2 className="text-4xl font-bold text-gradient mb-4">Advanced Security Suite</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">Comprehensive tools for modern application security and optimization</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "Vulnerability Scanning", desc: "Advanced threat detection with real-time monitoring", color: "text-red-400" },
                { icon: Eye, title: "Penetration Testing", desc: "Automated security assessments and breach simulation", color: "text-purple-400" },
                { icon: Search, title: "SEO Analysis", desc: "Complete optimization suite with competitor insights", color: "text-green-400" },
                { icon: Activity, title: "Real-time Monitoring", desc: "24/7 surveillance with instant alerts and reporting", color: "text-blue-400" },
                { icon: Lock, title: "Compliance Checks", desc: "Industry standard compliance validation", color: "text-yellow-400" },
                { icon: TrendingUp, title: "Performance Analytics", desc: "Detailed insights and actionable recommendations", color: "text-pink-400" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group card-hover bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-gray-600 transition-all duration-500 animate-slideInUp"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-3 rounded-xl bg-gray-800/50 border border-gray-700 group-hover:border-gray-500 transition-all duration-300 ${feature.color}`}>
                      <feature.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors">{feature.title}</h3>
                  </div>
                  <p className="text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">{feature.desc}</p>
                  <div className="mt-6 h-0.5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Security Dashboard */}
        <section id="security" className="relative px-6 py-24 bg-gradient-to-b from-gray-950 to-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-slideInUp">
              <h2 className="text-4xl font-bold text-gradient mb-4">Live Security Dashboard</h2>
              <p className="text-gray-500 text-lg">Real-time threat monitoring and analysis</p>
            </div>
            
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-2xl p-10 card-hover animate-fadeInScale">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Threat Alerts */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-white">Live Threats</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span>Active Monitoring</span>
                    </div>
                  </div>
                  
                  {[
                    { type: "SQL Injection", severity: "Critical", time: "2 min ago" },
                    { type: "XSS Attack", severity: "High", time: "5 min ago" },
                    { type: "CSRF Token", severity: "Medium", time: "12 min ago" }
                  ].map((alert, i) => (
                    <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 animate-slideInUp" style={{ animationDelay: `${i * 0.2}s` }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                          <span className="font-medium text-white">{alert.type}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          alert.severity === 'Critical' ? 'bg-red-900/50 text-red-300' :
                          alert.severity === 'High' ? 'bg-orange-900/50 text-orange-300' :
                          'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{alert.time}</p>
                    </div>
                  ))}
                </div>

                {/* Security Metrics */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-white mb-6">Security Metrics</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { value: "23", label: "Critical", color: "text-red-400", bg: "bg-red-900/20" },
                      { value: "145", label: "Medium", color: "text-yellow-400", bg: "bg-yellow-900/20" },
                      { value: "89", label: "Low", color: "text-green-400", bg: "bg-green-900/20" },
                      { value: `${scanCount}%`, label: "Security Score", color: "text-blue-400", bg: "bg-blue-900/20" }
                    ].map((metric, i) => (
                      <div key={i} className={`${metric.bg} border border-gray-700 rounded-xl p-6 text-center card-hover animate-fadeInScale`} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={`text-2xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
                        <div className="text-sm text-gray-400 font-medium">{metric.label}</div>
                        <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${metric.color.replace('text-', 'bg-')} rounded-full animate-pulse`} style={{width: `${Math.random() * 80 + 20}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA */}
        <section className="relative px-6 py-32 bg-gradient-to-b from-black to-gray-950">
          <div className="max-w-4xl mx-auto text-center animate-slideInUp">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700 text-sm text-gray-400 mb-6">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Ready to Deploy</span>
              </div>
              <h2 className="text-5xl font-bold text-gradient mb-6">
                Secure Your Future Today
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                Join thousands of developers who trust Trinex to protect and optimize their applications with cutting-edge security technology.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="group px-10 py-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 text-white hover:border-gray-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3">
                <Shield className="h-5 w-5 group-hover:text-green-400 transition-colors" />
                <span className="font-semibold text-lg">Start Free Trial</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="text-sm text-gray-500">
                <span>✓ No credit card required</span>
                <span className="mx-2">•</span>
                <span>✓ 14-day free trial</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative px-6 py-16 border-t border-gray-900/50 bg-black/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 animate-slideInUp">
              <div className="flex items-center space-x-3 mb-6 md:mb-0">
                <div className="p-2 rounded-lg border border-gray-800 animate-glow">
                  <Shield className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-lg font-semibold text-gradient">Trinex © 2025</span>
              </div>
              <div className="flex items-center space-x-8">
                <a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105">Privacy</a>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105">Terms</a>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105">Contact</a>
                <a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105">Documentation</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}