import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import SpecialistList from './pages/SpecialistList/SpecialistList';
import Specialist from './pages/Specialist/Specialist';
import Profile from './pages/Profile/Profile';
import Recommendations from './pages/Recommendations/Recommendations';

function App() {
  return (
    <Router>
      <Header />
      <div style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/specialistlist" element={<SpecialistList />} />
          <Route path="/specialist/:id" element={<Specialist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
