import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './css/admin.css';
import './css/login.css';
import './css/opensans-font.css';
import './css/style.css';

export default function Home() {
    const navigate = useNavigate()
    
    useEffect(() => {
      if (!localStorage.getItem('token')) {
        navigate('/login');
      }
    })

    
    return (
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
      </div>
    )
}
