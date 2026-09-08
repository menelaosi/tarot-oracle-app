interface ButtonComponentProps{
  actionType: 'primary' | 'secondary';
  onClick: () => void;
  isLoading: boolean;
  buttonText?: string;
  loadingButtonText?: string;
};

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
