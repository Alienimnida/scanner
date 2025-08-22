"use client";
import React, { useState, useEffect } from "react";
import { SignUpButton } from "@clerk/nextjs";
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
  AlertCircleIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

export default function TrinexLandingPage1() {
  const [scanCount, setScanCount] = useState(0);
  const [threatCount, setThreatCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const scanInterval = setInterval(() => {
      setScanCount((prev) => (prev + 1) % 100);
    }, 150);

    const threatInterval = setInterval(() => {
      setThreatCount(Math.floor(Math.random() * 50) + 20);
    }, 2000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(threatInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white overflow-hidden relative">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <Shield className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Trinex
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="relative text-gray-300 hover:text-white transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-400 after:to-orange-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 scroll-smooth"
              style={{ paddingBottom: "4px" }}
            >
              Features
            </a>
            <a
              href="#security"
              className="relative text-gray-300 hover:text-white transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-400 after:to-orange-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 scroll-smooth"
              style={{ paddingBottom: "4px" }}
            >
              Security
            </a>
            <a
              href="#seo"
              className="relative text-gray-300 hover:text-white transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-400 after:to-orange-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 scroll-smooth"
              style={{ paddingBottom: "4px" }}
            >
              SEO Analysis
            </a>
            <a
              href="#pricing"
              className="relative text-gray-300 hover:text-white transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-400 after:to-orange-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 scroll-smooth"
              style={{ paddingBottom: "4px" }}
            >
              Pricing
            </a>
          </div>
          <SignUpButton>
            <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 active:scale-95">
            Get Started
          </button>
          </SignUpButton>
          
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        {/* Left blob - opacity kom, size kom, dark theme er sthe match texture */}
        <div className="absolute left-[-80px] top-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-purple-900 via-gray-800 to-blue-900 rounded-full blur-2xl opacity-20 animate-spin-slow pointer-events-none"></div>
        {/* Right blob - opacity kom, size kom, dark theme er sthe match texture */}
        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 rounded-full blur-2xl opacity-20 animate-spin-slower pointer-events-none"></div>

        {/* Overlay theme-related icons (Lock icon moved to left side, not behind text) */}
        <Shield className="absolute top-32 left-1/4 w-14 h-14 text-orange-900 opacity-30 animate-pulse pointer-events-none" />
        <Activity className="absolute top-1/2 right-32 w-12 h-12 text-purple-900 opacity-30 animate-pulse pointer-events-none" />

        {/* Other icons remain as overlays, but you can adjust/remove as needed */}

        <style>{`
          .animate-spin-slow { animation: spin 18s linear infinite; }
          .animate-spin-slower { animation: spin 32s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
        `}</style>
        <div className="max-w-7xl mx-auto text-center">
          <div
            className={`inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-gray-700 transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
            <span className="text-sm text-gray-300">
              Advanced Security & SEO Analysis
            </span>
          </div>
          {/* Secure Your App.with orange gradient text */}
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 leading-tight transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            {/* Secure Your App + Alert icon */}
            <span className="inline-flex items-center">
              <span className="bg-gradient-to-r from-orange-500 via-red-400 to-yellow-500 bg-clip-text text-transparent">
                Secure Your App
              </span>
              <span className="ml-3">
                <AlertCircleIcon className="w-10 h-10 text-red-700 opacity-70 animate-pulse" />
              </span>
            </span>
            <br />
            {/* Boost Your SEO + Search icon */}
            <span
              className="inline-flex items-center px-6 py-2 rounded-xl font-semibold text-white"
              style={{
                background:
                  "linear-gradient(90deg, #f59e42 0%, #f43f5e 50%, #eab308 100%)",
                marginTop: "18px",
                display: "inline-flex",
              }}
            >
              <span style={{ display: "inline-block" }}>Boost Your SE</span>
              <span className="text-white animate-pulse">🔍</span>
            </span>
          </h1>
          {/* Enhanced description with animated gradient text */}
          <p
            className={`text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-500 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            Trinex provides comprehensive security vulnerability scanning and
            advanced SEO analysis to protect and optimize your web applications.
            Detect threats before they become breaches.
          </p>
          <div
            className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16 transition-all duration-1000 delay-700 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-110 flex items-center space-x-2 hover:shadow-2xl hover:shadow-red-500/25 active:scale-95 group">
              <span>Start Free Scan</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-gray-800/50 hover:scale-105 hover:shadow-lg active:scale-95">
              Watch Demo
            </button>
          </div>
          {/* Enhanced Stats with animations */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/10 group">
              <div className="text-3xl font-bold text-red-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                10M+
              </div>
              <div className="text-gray-400">Vulnerabilities Detected</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10 group">
              <div className="text-3xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <div className="text-gray-400">Detection Accuracy</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/10 group">
              <div className="text-3xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                50K+
              </div>
              <div className="text-gray-400">Apps Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 px-6 py-20 bg-gray-900/50"
      >
        {/* Left blob */}
        <div className="absolute left-[-120px] top-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full blur-3xl opacity-30 animate-spin-slow pointer-events-none"></div>
        {/* Right blob */}
        <div className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full blur-3xl opacity-30 animate-spin-slower pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Comprehensive Protection & Optimization
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced tools to secure your applications and maximize your
              online presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Security Features */}
            {/* --- Feature Cards Start --- */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-red-800/30 rounded-xl p-8 hover:border-red-600/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-red-500/10 transform hover:-translate-y-2">
              <div className="h-12 w-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600/30 transition-all group-hover:rotate-6 group-hover:scale-110">
                <Shield className="h-6 w-6 text-red-400 group-hover:text-red-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-red-300 transition-colors">
                Vulnerability Scanning
              </h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                Deep security analysis identifying SQL injection, XSS, CSRF, and
                other critical vulnerabilities in real-time.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse" />
                  <span>OWASP Top 10 Coverage</span>
                </li>
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse delay-100" />
                  <span>Custom Rule Engine</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-orange-800/30 rounded-xl p-8 hover:border-orange-600/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10 transform hover:-translate-y-2">
              <div className="h-12 w-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-600/30 transition-all group-hover:rotate-6 group-hover:scale-110">
                <Eye className="h-6 w-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-300 transition-colors">
                Penetration Testing
              </h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                Automated penetration testing to simulate real-world attacks and
                identify security weaknesses.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse" />
                  <span>Automated Attack Simulation</span>
                </li>
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse delay-100" />
                  <span>Detailed Exploit Reports</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-800/30 rounded-xl p-8 hover:border-blue-600/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2">
              <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-all group-hover:rotate-6 group-hover:scale-110">
                <Search className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-300 transition-colors">
                SEO Analysis
              </h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                Comprehensive SEO auditing with actionable insights to improve
                your search engine rankings.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse" />
                  <span>Technical SEO Audit</span>
                </li>
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse delay-100" />
                  <span>Performance Optimization</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-800/30 rounded-xl p-8 hover:border-purple-600/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:-translate-y-2">
              <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600/30 transition-all group-hover:rotate-6 group-hover:scale-110">
                <Activity className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-300 transition-colors">
                Real-time Monitoring
              </h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                24/7 continuous monitoring with instant alerts for new threats
                and SEO issues.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse" />
                  <span>Instant Threat Alerts</span>
                </li>
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse delay-100" />
                  <span>Performance Tracking</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-green-800/30 rounded-xl p-8 hover:border-green-600/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 transform hover:-translate-y-2">
              <div className="h-12 w-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600/30 transition-all group-hover:rotate-6 group-hover:scale-110">
                <Lock className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-green-300 transition-colors">
                Compliance Checking
              </h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                Ensure your applications meet GDPR, HIPAA, SOC 2, and other
                compliance requirements.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse" />
                  <span>Multi-standard Support</span>
                </li>
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse delay-100" />
                  <span>Audit Trail Generation</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-800/30 rounded-xl p-8 hover:border-yellow-600/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 transform hover:-translate-y-2">
              <div className="h-12 w-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-600/30 transition-all group-hover:rotate-6 group-hover:scale-110">
                <TrendingUp className="h-6 w-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-yellow-300 transition-colors">
                Competitor Analysis
              </h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                Advanced competitor analysis to identify opportunities and stay
                ahead in search rankings.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse" />
                  <span>Keyword Gap Analysis</span>
                </li>
                <li className="flex items-center space-x-2 group-hover:text-gray-400 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 animate-pulse delay-100" />
                  <span>Backlink Intelligence</span>
                </li>
              </ul>
            </div>
            {/* --- Feature Cards End --- */}
          </div>
        </div>
      </section>

      {/* Security Dashboard Preview */}
      <section id="security" className="relative z-10 px-6 py-20">
        <div className="absolute left-[-120px] top-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full blur-3xl opacity-30 animate-spin-slow pointer-events-none"></div>
        <div className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full blur-3xl opacity-30 animate-spin-slower pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Security Dashboard</h2>
            <p className="text-xl text-gray-400">
              Real-time visibility into your security posture
            </p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-red-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-red-400 animate-pulse" />
                  <span>Critical Alerts</span>
                  <div className="ml-auto bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full animate-pulse">
                    {threatCount} Active
                  </div>
                </h3>
                <div className="space-y-4">
                  <Alert className="border-red-800 bg-red-900/20 hover:bg-red-900/30 transition-all duration-300 animate-slideInLeft">
                    <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
                    <AlertDescription className="text-red-200">
                      SQL Injection vulnerability detected in user
                      authentication
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-orange-800 bg-orange-900/20 hover:bg-orange-900/30 transition-all duration-300 animate-slideInLeft delay-200">
                    <AlertTriangle className="h-4 w-4 text-orange-400 animate-pulse" />
                    <AlertDescription className="text-orange-200">
                      XSS vulnerability found in comment system
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-yellow-800 bg-yellow-900/20 hover:bg-yellow-900/30 transition-all duration-300 animate-slideInLeft delay-400">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 animate-pulse" />
                    <AlertDescription className="text-yellow-200">
                      Outdated dependencies with known vulnerabilities
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
                  <Activity className="h-6 w-6 text-green-400 animate-pulse" />
                  <span>Security Metrics</span>
                  <div className="ml-auto bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                    Live
                  </div>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 group">
                    <div className="text-2xl font-bold text-red-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                      23
                    </div>
                    <div className="text-sm text-gray-400">Critical Issues</div>
                    <div className="w-full bg-red-900/20 rounded-full h-1 mt-2">
                      <div className="bg-red-500 h-1 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 group">
                    <div className="text-2xl font-bold text-orange-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                      145
                    </div>
                    <div className="text-sm text-gray-400">Medium Issues</div>
                    <div className="w-full bg-orange-900/20 rounded-full h-1 mt-2">
                      <div className="bg-orange-500 h-1 rounded-full w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 group">
                    <div className="text-2xl font-bold text-yellow-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                      89
                    </div>
                    <div className="text-sm text-gray-400">Low Issues</div>
                    <div className="w-full bg-yellow-900/20 rounded-full h-1 mt-2">
                      <div className="bg-yellow-500 h-1 rounded-full w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                    <div className="text-2xl font-bold text-green-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                      {scanCount}%
                    </div>
                    <div className="text-sm text-gray-400">Security Score</div>
                    <div className="w-full bg-green-900/20 rounded-full h-1 mt-2">
                      <div
                        className="bg-green-500 h-1 rounded-full animate-pulse"
                        style={{ width: `${scanCount}%` }}
                      ></div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-green-500/10 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-red-900/20 to-orange-900/20">
        {/* Left & Right blobs removed from CTA section */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Secure Your Application?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of developers who trust Trinex to protect their
            applications and optimize their SEO.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-gray-800/50">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                Trinex
              </span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>
              &copy; 2025 Trinex. All rights reserved. Securing the web, one
              application at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
