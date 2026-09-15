import type { ReactNode } from 'react';

type HeaderProps = {
  title: string; // Section name; " LLM" is appended and the whole thing is uppercased in CSS.
  intro: string; // Section-specific opening sentence; a shared AI disclosure line follows it.
  // The moon mark used to live here as pure decoration; it's now AccountControl's own
  // trigger button (clicking it opens the sign-in/account popover), so it comes in
  // through this slot instead of being rendered unconditionally by Header itself.
  accessory?: ReactNode;
};

/** The app masthead. Title and intro vary per route (see HEADERS in App.tsx). */
function Header({ title, intro, accessory }: HeaderProps) {
  return (
    <header className="masthead">
      <div>
        <h1>{title} LLM</h1>
        <p className="intro">
          {intro}. You can then ask for an interpretation, grounded from curated meanings and
          interpreted by Claude.
        </p>
      </div>
      {accessory}
    </header>
  );
}

export default Header;
