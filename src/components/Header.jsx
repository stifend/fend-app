import React from 'react';

const Header = () => {
  return (
    <header className="dashboard-header">
      <div className="header-inner">
        <div className="header-info">
          <span>Hello Stifend</span>
          <h2>Welcome To Dashboard</h2>
        </div>

        <div className="header-actions">
          <div className="search-field">
            <span></span>
            <input type="search" placeholder="Search here" />
          </div>
          <button type="button" className="btn btn-notif">
             Notification
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
