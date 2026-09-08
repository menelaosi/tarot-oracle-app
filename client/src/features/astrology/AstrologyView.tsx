import './astrology.css';
import BirthdayControl from './components/BirthdayControl';

function AstrologyView() {
  return (
    <section className="astrology-section" aria-labelledby="astrology-title">
      <div className="section-heading">
        <p className="eyebrow">Astrology</p>
        <h2 id="astrology-title">Birth chart</h2>
      </div>

      <BirthdayControl />
    </section>
  );
}

export default AstrologyView;
