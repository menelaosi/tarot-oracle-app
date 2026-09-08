import { NavLink } from 'react-router-dom';

// One entry per top-level section; add a matching <Route> in App.tsx.
const tabs = [
  { to: '/tarot', label: 'Tarot' },
  { to: '/astrology', label: 'Astrology' },
  { to: '/transits', label: 'Transits' },
  { to: '/greek-oracle', label: 'Greek Alphabet Oracle' },
];

/** Top-level section switcher. NavLink handles the active-tab styling. */
function TabNav() {
  return (
    <nav className="tab-nav" aria-label="Sections">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `tab-link${isActive ? ' tab-link-active' : ''}`}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default TabNav;
