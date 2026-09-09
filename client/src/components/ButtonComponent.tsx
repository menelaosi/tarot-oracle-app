type ButtonComponentProps = {
  className: string;
  onClick: () => void;
  /** Doubles as the disabled state — the button can't be clicked while the request runs. */
  isLoading: boolean;
  buttonText?: string;
  loadingButtonText?: string;
  showIcon?: boolean;
};

/** The app's single action button (draw / cast / interpret / analyze). */
function ButtonComponent({
  className,
  onClick,
  isLoading,
  buttonText = 'Generate',
  loadingButtonText = 'Loading...',
  showIcon = true,
}: ButtonComponentProps) {
  return (
    <button
      className={className}
      type="button"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? loadingButtonText : buttonText}
      {showIcon && <span aria-hidden="true">✦</span>}
    </button>
  );
}

export default ButtonComponent;
