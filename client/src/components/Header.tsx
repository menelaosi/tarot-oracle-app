type HeaderProps = {
  title: string; // Section name; " LLM" is appended and the whole thing is uppercased in CSS.
  intro: string; // Section-specific opening sentence; a shared AI disclosure line follows it.
};

/** The app masthead. Title and intro vary per route (see HEADERS in App.tsx). */
function Header({ title, intro }: HeaderProps) {
  return (
    <header className="masthead">
      <div>
        <h1>{title} LLM</h1>
        <p className="intro">
          {intro}. You can then ask for an interpretation, grounded from curated meanings and
          interpreted by Claude.
        </p>
      </div>
      <div className="moon-mark" aria-hidden="true">
        ☾
      </div>
    </header>
  );
}

export default Header;
