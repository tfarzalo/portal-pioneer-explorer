import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Properties } from './pages/Properties';
import { PropertyDetails } from './pages/PropertyDetails';
import { EditProperty } from './pages/EditProperty';
import { AddProperty } from './pages/AddProperty';
import { JobRequests } from './pages/JobRequests';
import { WorkOrders } from './pages/WorkOrders';
import { Grading } from './pages/Grading';
import { Invoicing } from './pages/Invoicing';
import { Completed } from './pages/Completed';
import { Cancelled } from './pages/Cancelled';
import { FullCalendar } from './pages/FullCalendar';
import { AgendaCalendar } from './pages/AgendaCalendar';
import { Activity } from './pages/Activity';
import { UserSettings } from './pages/UserSettings';
import { PropertyGroups } from './pages/PropertyGroups';
import { PropertyGroupDetails } from './pages/PropertyGroupDetails';
import { AddPropertyGroup } from './pages/AddPropertyGroup';
import { Administrators } from './pages/Administrators';
import { JGManagement } from './pages/JGManagement';
import { Subcontractors } from './pages/Subcontractors';
import { NewJobRequest } from './pages/NewJobRequest';
import { AllJobs } from './pages/AllJobs';
import { JobDetails } from './pages/JobDetails';
import { NewWorkOrder } from './pages/NewWorkOrder';
import { Scheduling } from './pages/Scheduling';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsSidebarCollapsed(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Router>
      <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-[#151823]' : 'bg-gray-50'}`}>
        <Sidebar 
          theme={theme} 
          isCollapsed={isSidebarCollapsed}
          onCollapse={setIsSidebarCollapsed}
        />
        <div className="flex-1 flex flex-col">
          <Header 
            theme={theme} 
            onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard theme={theme} />} />
              <Route path="/properties" element={<Properties theme={theme} />} />
              <Route path="/properties/:id" element={<PropertyDetails theme={theme} />} />
              <Route path="/properties/:id/edit" element={<EditProperty theme={theme} />} />
              <Route path="/add-property" element={<AddProperty theme={theme} />} />
              <Route path="/jobs" element={<AllJobs theme={theme} />} />
              <Route path="/jobs/:id" element={<JobDetails theme={theme} />} />
              <Route path="/jobs/:id/work-order/new" element={<NewWorkOrder theme={theme} />} />
              <Route path="/job-requests" element={<JobRequests theme={theme} />} />
              <Route path="/new-job-request" element={<NewJobRequest theme={theme} />} />
              <Route path="/work-orders" element={<WorkOrders theme={theme} />} />
              <Route path="/grading" element={<Grading theme={theme} />} />
              <Route path="/invoicing" element={<Invoicing theme={theme} />} />
              <Route path="/completed" element={<Completed theme={theme} />} />
              <Route path="/cancelled" element={<Cancelled theme={theme} />} />
              <Route path="/calendar" element={<FullCalendar theme={theme} />} />
              <Route path="/agenda" element={<AgendaCalendar theme={theme} />} />
              <Route path="/scheduling" element={<Scheduling theme={theme} />} />
              <Route path="/activity" element={<Activity theme={theme} />} />
              <Route path="/settings" element={<UserSettings theme={theme} />} />
              <Route path="/property-groups" element={<PropertyGroups theme={theme} />} />
              <Route path="/property-groups/new" element={<AddPropertyGroup theme={theme} />} />
              <Route path="/property-groups/:id" element={<PropertyGroupDetails theme={theme} />} />
              <Route path="/administrators" element={<Administrators theme={theme} />} />
              <Route path="/jg-management" element={<JGManagement theme={theme} />} />
              <Route path="/subcontractors" element={<Subcontractors theme={theme} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;