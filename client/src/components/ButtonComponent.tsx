interface ButtonComponentProps {
  /** Picks the CSS class: primary-action (filled) vs secondary-action (outline). */
  actionType: 'primary' | 'secondary';
  onClick: () => void;
  /** Doubles as the disabled state — the button can't be clicked while the request runs. */
  isLoading: boolean;
  buttonText?: string;
  loadingButtonText?: string;
}

/** The app's single action button (draw / cast / interpret / analyze). */
function ButtonComponent({
  actionType, 
  onClick, 
  isLoading, 
  buttonText = 'Generate',
  loadingButtonText = 'Loading...',
}: ButtonComponentProps) {
  return (
    <button
      className={actionType === 'primary' ? 'primary-action' : 'secondary-action'}
      type="button"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? loadingButtonText : buttonText}
      <span aria-hidden="true">✦</span>
    </button>
  );
};

export default ButtonComponent; 
