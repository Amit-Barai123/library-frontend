// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Students from './components/Students';
import Books from './components/Books';
import Allotment from './components/Allotment';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/books" element={<Books />} />
          <Route path="/allotment" element={<Allotment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
