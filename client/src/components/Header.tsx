function Header() {
  return (
    <header className="masthead">
      <div>
        <h1>Tarot Reader LLM</h1>
        <p className="intro">
          Draw a small spread to let the cards make a pattern. Every interpretation is
          grounded from curated meanings and interpreted by Claude.
        </p>
      </div>
      <div className="moon-mark" aria-hidden="true">☾</div>
    </header>
  );
}

export default Header;
