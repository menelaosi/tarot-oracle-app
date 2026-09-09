type QuestionInputProps = {
  question: string;
  onQuestionChange: (value: string) => void;
};

function QuestionInput({ question, onQuestionChange }: QuestionInputProps) {
  return (
    <label className="question-field">
      <span>
        Question <em>optional</em>
      </span>
      <input
        value={question}
        onChange={(event) => onQuestionChange(event.target.value)}
        placeholder="What wants your attention?"
        maxLength={500}
      />
    </label>
  );
}

export default QuestionInput;
