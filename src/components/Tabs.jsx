// ========================================
// 📑 TABS COMPONENT
// ========================================
// Komponen tabs reusable untuk navigasi tab
//
// PROPS:
// - tabs: array of { id, label, content, icon, badge, disabled }
// - activeTab: string (controlled)
// - onTabChange: function
// - className: string
//
// CONTOH PENGGUNAAN:
// import { Tabs } from './components';
// const tabs = [
//   { id: 'tab1', label: 'Overview', content: <div>Tab 1</div> },
//   { id: 'tab2', label: 'Details', content: <div>Tab 2</div>, badge: '5' }
// ];
// <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
// ========================================

import { useState } from 'react';

const Tabs = ({
  tabs = [],
  activeTab: controlledActiveTab,
  onTabChange,
  className = '',
  ...props
}) => {
  // State untuk uncontrolled mode
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  
  // Gunakan controlled atau uncontrolled
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  
  // Handle tab click
  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };
  
  // Cari tab yang aktif
  const activeTabContent = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`tabs-component ${className}`.trim()} {...props}>
      {/* Tab Headers */}
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`.trim()}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="tabs-content">
        {activeTabContent?.content}
      </div>
    </div>
  );
};

export default Tabs;

// Contoh penggunaan:
// const tabs = [
//   { id: 'tab1', label: 'Overview', content: <div>Tab 1 content</div> },
//   { id: 'tab2', label: 'Details', content: <div>Tab 2 content</div>, badge: '5' },
//   { id: 'tab3', label: 'Settings', content: <div>Tab 3 content</div>, disabled: true }
// ];
// <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
