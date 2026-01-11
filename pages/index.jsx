import Layout from "./Layout.jsx";

import AccessibilityAnalyzer from "./AccessibilityAnalyzer";

import Carers from "./Carers";

import CleanScan from "./CleanScan";

import FamilyBridge from "./FamilyBridge";

import Harmony from "./Harmony";

import Home from "./Home";

import MoodSense from "./MoodSense";

import OfflineData from "./OfflineData";

import Pricing from "./Pricing";

import Privacy from "./Privacy";

import Profile from "./Profile";

import SecuritySettings from "./SecuritySettings";

import Settings from "./Settings";

import SignBridge from "./SignBridge";

import SocialEase from "./SocialEase";

import SocialEaseDashboard from "./SocialEaseDashboard";

import VisionVerse from "./VisionVerse";

import AdminAppManagement from "./AdminAppManagement";

import UserRoleManagement from "./UserRoleManagement";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    AccessibilityAnalyzer: AccessibilityAnalyzer,
    
    Carers: Carers,
    
    CleanScan: CleanScan,
    
    FamilyBridge: FamilyBridge,
    
    Harmony: Harmony,
    
    Home: Home,
    
    MoodSense: MoodSense,
    
    OfflineData: OfflineData,
    
    Pricing: Pricing,
    
    Privacy: Privacy,
    
    Profile: Profile,
    
    SecuritySettings: SecuritySettings,
    
    Settings: Settings,
    
    SignBridge: SignBridge,
    
    SocialEase: SocialEase,
    
    SocialEaseDashboard: SocialEaseDashboard,
    
    VisionVerse: VisionVerse,
    
    AdminAppManagement: AdminAppManagement,
    
    UserRoleManagement: UserRoleManagement,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<AccessibilityAnalyzer />} />
                
                
                <Route path="/AccessibilityAnalyzer" element={<AccessibilityAnalyzer />} />
                
                <Route path="/Carers" element={<Carers />} />
                
                <Route path="/CleanScan" element={<CleanScan />} />
                
                <Route path="/FamilyBridge" element={<FamilyBridge />} />
                
                <Route path="/Harmony" element={<Harmony />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/MoodSense" element={<MoodSense />} />
                
                <Route path="/OfflineData" element={<OfflineData />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/SecuritySettings" element={<SecuritySettings />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/SignBridge" element={<SignBridge />} />
                
                <Route path="/SocialEase" element={<SocialEase />} />
                
                <Route path="/SocialEaseDashboard" element={<SocialEaseDashboard />} />
                
                <Route path="/VisionVerse" element={<VisionVerse />} />
                
                <Route path="/AdminAppManagement" element={<AdminAppManagement />} />
                
                <Route path="/UserRoleManagement" element={<UserRoleManagement />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}