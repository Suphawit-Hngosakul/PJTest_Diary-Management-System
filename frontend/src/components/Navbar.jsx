import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Navbar() {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">Navbar</div>
      {name && (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none"
          >
            {name}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
              <div className="p-2 border-b">{email}</div>
              <button
                onClick={handleLogout}
                className="w-full text-left p-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;