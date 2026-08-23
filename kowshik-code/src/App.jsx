import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import DisclaimerBanner from './components/DisclaimerBanner';
import Footer from './components/Footer';
import LandingView from './views/LandingView';
import HowItWorksView from './views/HowItWorksView';
import WorkspaceView from './views/WorkspaceView';
import PopulationView from './views/PopulationView';
import ImplantMatchingView from './views/ImplantMatchingView';
import ReportView from './views/ReportView';
import AboutView from './views/AboutView';
import MRIExplorerView from './views/MRIExplorerView';
import { syntheticCases } from './data/syntheticCases';

export default function App() {
  const [activeCase, setActiveCase] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a]">
      {/* Global Navigation Header */}
      <Header />

      {/* Persistent Clinical Decision Support Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main View Router */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/how-it-works" element={<HowItWorksView />} />
          <Route
            path="/workspace"
            element={
              <WorkspaceView
                activeCase={activeCase}
                setActiveCase={setActiveCase}
              />
            }
          />
          <Route path="/mri-explorer" element={<MRIExplorerView />} />
          <Route path="/population" element={<PopulationView activeCase={activeCase} />} />
          <Route path="/implant-matching" element={<ImplantMatchingView activeCase={activeCase} setActiveCase={setActiveCase} />} />
          <Route path="/report" element={<ReportView activeCase={activeCase} />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
