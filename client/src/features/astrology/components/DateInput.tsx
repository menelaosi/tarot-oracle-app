type DateInputProps = {
  date: string;
  label?: string;
  onDateChange: (value: string) => void;
};

function DateInput({ 
  date, 
  label = 'Birth date &amp; time', 
  onDateChange,
}: DateInputProps) {
  return (
    <label>
      <span>{label}</span>
      <input
        type="date"
        value={date}
        onChange={(event) => onDateChange(event.target.value)}
      />
    </label>
  );
};

export default DateInput;
