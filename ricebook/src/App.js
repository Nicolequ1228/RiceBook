import React from 'react';
import {BrowserRouter as Router,Route, Routes, Navigate } from 'react-router-dom';
import "./index.css";
import ProtectedRoute from './ProtectedRoute';
import Landing from './Landing/Landing';
import Main from "./Main/Main";
import Profile from "./Profile/Profile";
function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={ <Landing /> } />
                <Route path="main" element={<ProtectedRoute><Main /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<div> Not Found or you do not have permission.</div>}/>
            </Routes>
        </Router>
    );
}
export default App;