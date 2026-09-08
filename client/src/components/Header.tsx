interface HeaderProps {
  title: string;
  intro: string;
}

function Header({ title, intro }: HeaderProps) {
  return (
    <header className="masthead">
      <div>
        <h1>{title} LLM</h1>
        <p className="intro">
          {intro}. You can then ask for an interpretation, grounded from
          curated meanings and interpreted by Claude.
        </p>
      </div>
      <div className="moon-mark" aria-hidden="true">
        ☾
      </div>
    </header>
  );
}

export default Header;
