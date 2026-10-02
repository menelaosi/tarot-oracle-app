type DateInputProps = {
  date: string;
  label: string;
  type?: 'date' | 'datetime-local'; // 'date' for a day-only pick (e.g. transit day); 'datetime-local' when the time matters (birth moment)
  onDateChange: (value: string) => void;
};

function DateInput({ date, label, type = 'date', onDateChange }: DateInputProps) {
  return (
    <label>
      <span>{`${label} date & time`}</span>
      <input type={type} value={date} onChange={(event) => onDateChange(event.target.value)} />
    </label>
  );
}

export default DateInput;
