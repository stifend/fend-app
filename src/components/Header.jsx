// Header component untuk dashboard dengan search bar dan profile
const Header = () => {
  return (
    <header className="dashboard-header-novotel">
      {/* Logo + Brand Name */}
      <div className="header-brand">
        <div className="header-logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#3b82f6"/>
            <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" fill="white"/>
            <path d="M16 8V16M16 16L24 12M16 16L8 12" stroke="#3b82f6" strokeWidth="1.5"/>
          </svg>
        </div>
        <span className="header-brand-name">Novotel</span>
      </div>

      {/* Search Bar */}
      <div className="header-search">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 19L14.65 14.65" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input 
          type="search" 
          placeholder="Search for rooms and offers" 
          className="header-search-input"
        />
      </div>

      {/* Right Actions: Notification + Profile */}
      <div className="header-actions">
        {/* Notification Icon */}
        <button className="header-notif-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Profile Picture */}
        <div className="header-profile">
          <img 
            src="https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff" 
            alt="Profile" 
            className="header-profile-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
