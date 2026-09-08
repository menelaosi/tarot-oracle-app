import { NavLink } from 'react-router-dom';

// One entry per top-level section. Add a route in App.tsx to match.
const tabs = [
  { to: '/tarot', label: 'Tarot' },
  { to: '/astrology', label: 'Astrology' },
];

function TabNav() {
  return (
    <nav className="tab-nav" aria-label="Sections">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => (isActive ? 'tab-link tab-link-active' : 'tab-link')}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default TabNav;
