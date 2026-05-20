// ========================================
// COMPONENTS INDEX - EXPORT SEMUA KOMPONEN
// ========================================
// File ini memudahkan import komponen dari satu tempat
// Contoh: import { Button, Input, Card } from './components';

// UI Components
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card } from './Card';
export { default as Modal } from './Modal';
export { default as Badge } from './Badge';
export { default as Avatar } from './Avatar';

// Data Display Components
export { default as Table } from './Table';
export { default as Tabs } from './Tabs';
export { default as Dropdown } from './Dropdown';

// Navigation Components
export { default as Pagination } from './Pagination';
export { default as Navbar } from './Navbar';
export { default as Breadcrumb } from './Breadcrumb';
export { default as Sidebar } from './Sidebar';

// Feedback Components
export { default as Alert } from './Alert';
export { default as Loader } from './Loader';
export { default as EmptyState } from './EmptyState';

// Layout Components
export { default as Header } from './Header';

// Dashboard Specific Components
export { default as MetricCard } from './MetricCard';
export { default as RoomCard } from './RoomCard';
export { default as StatusRow } from './StatusRow';
export { default as FeedbackItem } from './FeedbackItem';

// ========================================
// CARA PENGGUNAAN:
// ========================================
// 
// 1. Import satu komponen:
//    import { Button } from './components';
//
// 2. Import beberapa komponen:
//    import { Button, Input, Card } from './components';
//
// 3. Import semua komponen:
//    import * as Components from './components';
//    <Components.Button>Click</Components.Button>
//
// ========================================
