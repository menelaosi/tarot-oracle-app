BEGIN;

INSERT INTO cards (name, arcana, suit, number, image_path, meaning_upright, meaning_reversed) VALUES
('The Fool', 'major', NULL, NULL, '/tarot/TheFool.png', 'new beginnings, spontaneity, innocence, free spirit', 'recklessness, naivety, poor judgment, fear of change'),
('The Magician', 'major', NULL, NULL, '/tarot/TheMagician.png', 'manifestation, resourcefulness, power, inspired action', 'manipulation, poor planning, untapped talents, deception'),
('The High Priestess', 'major', NULL, NULL, '/tarot/TheHighPriestess.png', 'intuition, sacred knowledge, subconscious, mystery', 'secrets, disconnected intuition, withdrawal, hidden motives'),
('The Empress', 'major', NULL, NULL, '/tarot/TheEmpress.png', 'abundance, fertility, nurturing, creativity', 'creative block, dependence, smothering, lack of growth'),
('The Emperor', 'major', NULL, NULL, '/tarot/TheEmperor.png', 'authority, structure, stability, leadership', 'rigidity, domination, lack of discipline, control issues'),
('The Hierophant', 'major', NULL, NULL, '/tarot/TheHierophant.png', 'tradition, spiritual guidance, conformity, shared beliefs', 'rebellion, unconventionality, restriction, questioning beliefs'),
('The Lovers', 'major', NULL, NULL, '/tarot/TheLovers.png', 'partnership, union, choices, aligned values', 'disharmony, imbalance, misalignment, difficult choices'),
('The Chariot', 'major', NULL, NULL, '/tarot/TheChariot.png', 'determination, willpower, control, forward movement', 'lack of direction, aggression, scattered energy, loss of control'),
('Strength', 'major', NULL, NULL, '/tarot/Strength.png', 'courage, compassion, patience, inner strength', 'self-doubt, weakness, insecurity, lack of confidence'),
('The Hermit', 'major', NULL, NULL, '/tarot/TheHermit.png', 'introspection, solitude, inner guidance, searching', 'isolation, loneliness, withdrawal, avoiding reflection'),
('Wheel of Fortune', 'major', NULL, NULL, '/tarot/WheelOfFortune.png', 'cycles, change, luck, turning point', 'bad luck, resistance to change, lack of control, repeated patterns'),
('Justice', 'major', NULL, NULL, '/tarot/Justice.png', 'truth, fairness, accountability, cause and effect', 'injustice, dishonesty, avoidance of responsibility, bias'),
('The Hanged Man', 'major', NULL, NULL, '/tarot/TheHangedMan.png', 'surrender, new perspective, pause, letting go', 'stalling, resistance, indecision, needless sacrifice'),
('Death', 'major', NULL, NULL, '/tarot/Death.png', 'transformation, endings, release, renewal', 'resistance to change, stagnation, fear of endings, attachment'),
('Temperance', 'major', NULL, NULL, '/tarot/Temperance.png', 'balance, moderation, integration, patience', 'extremes, imbalance, impatience, lack of harmony'),
('The Devil', 'major', NULL, NULL, '/tarot/TheDevil.png', 'attachment, temptation, materialism, shadow self', 'release, reclaiming power, breaking patterns, freedom'),
('The Tower', 'major', NULL, NULL, '/tarot/TheTower.png', 'upheaval, revelation, sudden change, falling structures', 'avoided disaster, delayed change, fear of upheaval, resistance'),
('The Star', 'major', NULL, NULL, '/tarot/TheStar.png', 'hope, healing, inspiration, renewal', 'discouragement, doubt, disconnection, lack of faith'),
('The Moon', 'major', NULL, NULL, '/tarot/TheMoon.png', 'illusion, uncertainty, dreams, subconscious fears', 'clarity, truth revealed, releasing fear, confusion lifting'),
('The Sun', 'major', NULL, NULL, '/tarot/TheSun.png', 'joy, vitality, success, clarity', 'temporary sadness, blocked joy, excessive optimism, delayed success'),
('Judgement', 'major', NULL, NULL, '/tarot/Judgement.png', 'awakening, reflection, reckoning, renewal', 'self-doubt, refusal of a call, harsh judgment, unresolved past'),
('The World', 'major', NULL, NULL, '/tarot/TheWorld.png', 'completion, achievement, wholeness, integration', 'unfinished business, delays, incomplete cycle, lack of closure'),

('Ace of Wands', 'minor', 'wands', 1, '/tarot/AceOfWands.png', 'inspiration, potential, creative spark, new opportunity', 'delays, lack of energy, creative block, missed opportunity'),
('Two of Wands', 'minor', 'wands', 2, '/tarot/TwoOfWands.png', 'planning, future vision, progress, personal power', 'fear of the unknown, poor planning, limited options, hesitation'),
('Three of Wands', 'minor', 'wands', 3, '/tarot/ThreeOfWands.png', 'expansion, foresight, overseas opportunities, momentum', 'delays, frustration, lack of progress, restricted outlook'),
('Four of Wands', 'minor', 'wands', 4, '/tarot/FourOfWands.png', 'celebration, stability, homecoming, community', 'lack of support, instability, tension at home, delayed celebration'),
('Five of Wands', 'minor', 'wands', 5, '/tarot/FiveOfWands.png', 'competition, conflict, challenge, lively debate', 'avoiding conflict, tension released, inner conflict, compromise'),
('Six of Wands', 'minor', 'wands', 6, '/tarot/SixOfWands.png', 'victory, recognition, confidence, public success', 'egotism, lack of recognition, fall from grace, self-doubt'),
('Seven of Wands', 'minor', 'wands', 7, '/tarot/SevenOfWands.png', 'defense, perseverance, standing ground, conviction', 'overwhelm, giving up, defensiveness, lack of support'),
('Eight of Wands', 'minor', 'wands', 8, '/tarot/EightOfWands.png', 'speed, movement, messages, rapid progress', 'delays, frustration, miscommunication, scattered energy'),
('Nine of Wands', 'minor', 'wands', 9, '/tarot/NineOfWands.png', 'resilience, persistence, boundaries, guarded strength', 'exhaustion, paranoia, defensiveness, weakened boundaries'),
('Ten of Wands', 'minor', 'wands', 10, '/tarot/TenOfWands.png', 'burden, responsibility, hard work, overloaded effort', 'release of burdens, delegation, collapse, inability to cope'),
('Page of Wands', 'minor', 'wands', 11, '/tarot/PageOfWands.png', 'enthusiasm, exploration, discovery, adventurous message', 'bad news, lack of direction, immaturity, creative delay'),
('Knight of Wands', 'minor', 'wands', 12, '/tarot/KnightOfWands.png', 'adventure, action, confidence, passionate pursuit', 'impulsiveness, haste, anger, unreliable action'),
('Queen of Wands', 'minor', 'wands', 13, '/tarot/QueenOfWands.png', 'confidence, warmth, independence, determined creativity', 'jealousy, insecurity, demanding behavior, loss of confidence'),
('King of Wands', 'minor', 'wands', 14, '/tarot/KingOfWands.png', 'vision, leadership, boldness, entrepreneurial energy', 'impulsiveness, arrogance, tyranny, unrealistic expectations'),

('Ace of Cups', 'minor', 'cups', 1, '/tarot/AceOfCups.png', 'emotional beginning, love, compassion, spiritual openness', 'emotional blockage, emptiness, suppressed feelings, self-love needed'),
('Two of Cups', 'minor', 'cups', 2, '/tarot/TwoOfCups.png', 'partnership, mutual attraction, harmony, emotional exchange', 'imbalance, separation, tension, broken connection'),
('Three of Cups', 'minor', 'cups', 3, '/tarot/ThreeOfCups.png', 'friendship, celebration, community, joyful reunion', 'overindulgence, isolation, gossip, strained friendships'),
('Four of Cups', 'minor', 'cups', 4, '/tarot/FourOfCups.png', 'apathy, contemplation, reevaluation, missed possibilities', 'awareness, renewed interest, acceptance, emerging motivation'),
('Five of Cups', 'minor', 'cups', 5, '/tarot/FiveOfCups.png', 'grief, disappointment, regret, focusing on loss', 'acceptance, moving on, forgiveness, emotional recovery'),
('Six of Cups', 'minor', 'cups', 6, '/tarot/SixOfCups.png', 'nostalgia, childhood, generosity, familiar comfort', 'living in the past, unrealistic nostalgia, immaturity, moving forward'),
('Seven of Cups', 'minor', 'cups', 7, '/tarot/SevenOfCups.png', 'choices, imagination, illusion, many possibilities', 'clarity, decisive action, temptation rejected, realistic choice'),
('Eight of Cups', 'minor', 'cups', 8, '/tarot/EightOfCups.png', 'walking away, seeking meaning, transition, emotional maturity', 'fear of leaving, stagnation, returning, avoidance'),
('Nine of Cups', 'minor', 'cups', 9, '/tarot/NineOfCups.png', 'contentment, wishes fulfilled, pleasure, emotional satisfaction', 'dissatisfaction, indulgence, shallow success, unmet wishes'),
('Ten of Cups', 'minor', 'cups', 10, '/tarot/TenOfCups.png', 'harmony, family joy, lasting love, emotional fulfillment', 'disharmony, broken ideals, family tension, disconnection'),
('Page of Cups', 'minor', 'cups', 11, '/tarot/PageOfCups.png', 'emotional curiosity, sensitivity, creative message, intuition', 'emotional immaturity, insecurity, blocked creativity, escapism'),
('Knight of Cups', 'minor', 'cups', 12, '/tarot/KnightOfCups.png', 'romance, charm, idealism, heartfelt invitation', 'moodiness, unrealistic expectations, emotional manipulation, withdrawal'),
('Queen of Cups', 'minor', 'cups', 13, '/tarot/QueenOfCups.png', 'compassion, empathy, intuition, emotional depth', 'emotional dependence, insecurity, martyrdom, poor boundaries'),
('King of Cups', 'minor', 'cups', 14, '/tarot/KingOfCups.png', 'emotional balance, wisdom, diplomacy, compassionate leadership', 'emotional suppression, volatility, manipulation, detachment'),

('Ace of Swords', 'minor', 'swords', 1, '/tarot/AceOfSwords.png', 'clarity, truth, breakthrough, decisive thought', 'confusion, misinformation, harsh words, clouded judgment'),
('Two of Swords', 'minor', 'swords', 2, '/tarot/TwoOfSwords.png', 'stalemate, difficult choice, guarded thinking, truce', 'indecision, information revealed, avoidance ending, inner conflict'),
('Three of Swords', 'minor', 'swords', 3, '/tarot/ThreeOfSwords.png', 'heartbreak, sorrow, painful truth, separation', 'healing, forgiveness, releasing pain, lingering grief'),
('Four of Swords', 'minor', 'swords', 4, '/tarot/FourOfSwords.png', 'rest, recovery, retreat, mental renewal', 'restlessness, burnout, forced activity, delayed recovery'),
('Five of Swords', 'minor', 'swords', 5, '/tarot/FiveOfSwords.png', 'conflict, hollow victory, tension, winning at a cost', 'reconciliation, remorse, ending conflict, unresolved resentment'),
('Six of Swords', 'minor', 'swords', 6, '/tarot/SixOfSwords.png', 'transition, moving on, calmer waters, necessary journey', 'resistance to transition, baggage, delayed departure, unresolved issues'),
('Seven of Swords', 'minor', 'swords', 7, '/tarot/SevenOfSwords.png', 'strategy, secrecy, independence, avoiding direct conflict', 'exposure, confession, consequences, abandoning deception'),
('Eight of Swords', 'minor', 'swords', 8, '/tarot/EightOfSwords.png', 'restriction, fear, limiting beliefs, feeling trapped', 'release, new perspective, reclaiming agency, self-imposed limits lifted'),
('Nine of Swords', 'minor', 'swords', 9, '/tarot/NineOfSwords.png', 'anxiety, worry, nightmares, mental anguish', 'hope, recovery, facing fears, easing anxiety'),
('Ten of Swords', 'minor', 'swords', 10, '/tarot/TenOfSwords.png', 'ending, painful conclusion, betrayal, finality', 'recovery, regeneration, resisting an ending, surviving hardship'),
('Page of Swords', 'minor', 'swords', 11, '/tarot/PageOfSwords.png', 'curiosity, vigilance, new ideas, direct communication', 'gossip, haste, defensiveness, lack of preparation'),
('Knight of Swords', 'minor', 'swords', 12, '/tarot/KnightOfSwords.png', 'ambition, swift action, determination, intellectual force', 'recklessness, aggression, scattered thought, rushing ahead'),
('Queen of Swords', 'minor', 'swords', 13, '/tarot/QueenOfSwords.png', 'clear judgment, independence, honesty, perceptiveness', 'bitterness, coldness, cynicism, excessive criticism'),
('King of Swords', 'minor', 'swords', 14, '/tarot/KingOfSwords.png', 'intellect, truth, authority, rational decision-making', 'cold logic, misuse of power, manipulation, rigid thinking'),

('Ace of Pentacles', 'minor', 'pentacles', 1, '/tarot/AceOfPentacles.png', 'material opportunity, prosperity, grounded beginning, security', 'missed opportunity, poor planning, scarcity mindset, unstable foundation'),
('Two of Pentacles', 'minor', 'pentacles', 2, '/tarot/TwoOfPentacles.png', 'balance, adaptability, priorities, managing change', 'overwhelm, disorganization, imbalance, dropping responsibilities'),
('Three of Pentacles', 'minor', 'pentacles', 3, '/tarot/ThreeOfPentacles.png', 'teamwork, skill, collaboration, quality work', 'poor teamwork, lack of recognition, weak planning, isolated effort'),
('Four of Pentacles', 'minor', 'pentacles', 4, '/tarot/FourOfPentacles.png', 'security, control, saving, holding resources', 'greed, possessiveness, fear of loss, releasing control'),
('Five of Pentacles', 'minor', 'pentacles', 5, '/tarot/FiveOfPentacles.png', 'hardship, insecurity, isolation, material struggle', 'recovery, assistance, improved finances, returning hope'),
('Six of Pentacles', 'minor', 'pentacles', 6, '/tarot/SixOfPentacles.png', 'generosity, support, reciprocity, fair exchange', 'one-sided giving, debt, strings attached, imbalance'),
('Seven of Pentacles', 'minor', 'pentacles', 7, '/tarot/SevenOfPentacles.png', 'patience, assessment, long-term investment, cultivation', 'impatience, poor return, wasted effort, lack of progress'),
('Eight of Pentacles', 'minor', 'pentacles', 8, '/tarot/EightOfPentacles.png', 'diligence, craftsmanship, learning, focused practice', 'perfectionism, boredom, careless work, lack of commitment'),
('Nine of Pentacles', 'minor', 'pentacles', 9, '/tarot/NineOfPentacles.png', 'independence, abundance, self-sufficiency, refined success', 'financial dependence, setbacks, overwork, lack of reward'),
('Ten of Pentacles', 'minor', 'pentacles', 10, '/tarot/TenOfPentacles.png', 'legacy, family wealth, stability, lasting success', 'financial loss, instability, broken tradition, family conflict'),
('Page of Pentacles', 'minor', 'pentacles', 11, '/tarot/PageOfPentacles.png', 'study, ambition, practical opportunity, new skills', 'procrastination, lack of progress, unrealistic plans, poor focus'),
('Knight of Pentacles', 'minor', 'pentacles', 12, '/tarot/KnightOfPentacles.png', 'reliability, routine, patience, steady progress', 'stagnation, stubbornness, laziness, excessive caution'),
('Queen of Pentacles', 'minor', 'pentacles', 13, '/tarot/QueenOfPentacles.png', 'practical care, abundance, resourcefulness, grounded nurture', 'self-neglect, imbalance, insecurity, work-life strain'),
('King of Pentacles', 'minor', 'pentacles', 14, '/tarot/KingOfPentacles.png', 'wealth, business, discipline, dependable prosperity', 'greed, materialism, financial instability, possessiveness')
ON CONFLICT (name) DO NOTHING;

COMMIT;

BEGIN;

INSERT INTO suit_correspondences (suit, display_name, element, polarity, planets, signs, positive_associations, negative_associations) VALUES
('wands', 'Wands', 'Fire', 'Masculine, Yang, Positive', ARRAY['Mars','Sun','Uranus','Jupiter'], ARRAY['Aries','Leo','Sagittarius'], ARRAY['Freedom','Energy','Vitality','Willpower','Electricity','Adaptive','Faith','Luck','Activating','Creative','Expressive','Generative','Direct','Extroverted','Movement','Passionate','Purifying','Motivating','Ambition','Spontaneity','Catalyzing'], ARRAY['Destructive','Burning','Impulsive','Reactive','Consuming','Unpredictable','Self-Centered','Hot-headed','Selfish','Vain','Demanding','Insatiable','Disruptive','Erratic','Fury','Rage']),
('cups', 'Cups', 'Water', 'Feminine, Yin, Negative', ARRAY['Moon','Neptune','Pluto'], ARRAY['Cancer','Scorpio','Pisces'], ARRAY['Love','Healing','Spirituality','Relationship','Emotion','Feelings','Intuition','Attunement','Empathy','Compassion','Joy','Cleansing','Responsiveness','Sensitivity','Dreams'], ARRAY['Enmeshment','Depression','Irrationality','Illusions','Fantasies','Repression','Disconnection','Isolation','Creative Blocks','Escapism']),
('swords', 'Swords', 'Air', 'Masculine, Yang, Positive', ARRAY['Mercury','Venus','Uranus'], ARRAY['Gemini','Libra','Aquarius'], ARRAY['Truth','Logic','Rationality','Mentality','Language','Communication','Perspective','Intellect','Strategies','Plans','Analysis','Beliefs','Ideas','Thoughts','Objectivity','Law','Justice','Judgment','Discernment','Decision','Nonattachment','Words','Actions'], ARRAY['Nervousness','Anxiety','Ruthlessness','Emotional Disconnection','Sacrifice','Victimization','Pain','Mental Chatter','Confusion','Indecision','Worry','Regret','Insensitivity','Conniving','Ignorance','Coldness']),
('pentacles', 'Pentacles', 'Earth', 'Feminine, Yin, Negative', ARRAY['Earth','Venus','Saturn'], ARRAY['Taurus','Virgo','Capricorn'], ARRAY['Stability','Traditional','Practical','Grounded','Nature','Environment','Money','Manifestation','Resources','Abundance','Wealth','Matter','Worth','Form','Value','Quality','Health','Body','Sensuality','Pleasure','Security','Structure'], ARRAY['Scarcity','Poverty','Addiction','Lust','Materialism','Greed','Consumption','Superficiality','Lack','Stubborn','Inflexible','Stuck','Disease','Objectification','Dense','Overbearing','Rigid'])
ON CONFLICT (suit) DO UPDATE SET display_name=EXCLUDED.display_name, element=EXCLUDED.element, polarity=EXCLUDED.polarity, planets=EXCLUDED.planets, signs=EXCLUDED.signs, positive_associations=EXCLUDED.positive_associations, negative_associations=EXCLUDED.negative_associations;

INSERT INTO numerology_correspondences (number, associations) VALUES
(1, ARRAY['New beginnings','Opportunity','Potential','Inspiration','Unity']),
(2, ARRAY['Balance','Partnership','Duality','Choices']),
(3, ARRAY['Creativity','Groups','Growth','Completion Phase']),
(4, ARRAY['Structure','Stability','Manifestation','Foundation','Endurance']),
(5, ARRAY['Change','Instability','Conflict','Regeneration']),
(6, ARRAY['Communication','Cooperation','Harmony','Adjustment','Alignment','Equilibrium']),
(7, ARRAY['Reflection','Assessment','Knowledge','Introspection','Unseen']),
(8, ARRAY['Mastery','Action','Accomplishment','Rebirth','Changes','Infinity']),
(9, ARRAY['Fruition','Attainment','Fulfillment','Transition period','Culmination','Nearing completion']),
(10, ARRAY['Completion','End of a cycle','Renewal','Moving Forward','Rebirth'])
ON CONFLICT (number) DO UPDATE SET associations=EXCLUDED.associations;

INSERT INTO court_rank_correspondences (rank, description) VALUES
('page', 'The youngster; explorative, playful, much to learn, fresh views'),
('knight', 'The teenager; prone to shift erratically within the suit energy; proactive but unbalanced'),
('queen', 'Inwardly mature adult; radiates energy from the inside out; leads by example through intention and beliefs'),
('king', 'Outwardly mature adult; projects energy outwards; leads through action by setting external guidelines')
ON CONFLICT (rank) DO UPDATE SET description=EXCLUDED.description;

INSERT INTO court_suit_correspondences (rank, suit, orientation, associations) VALUES
('page','wands','positive',ARRAY['Be creative','Be enthusiastic','Be courageous','Be confident']), ('page','cups','positive',ARRAY['Be emotional','Be intuitive','Be intimate','Be loving']), ('page','swords','positive',ARRAY['Use your mind','Be truthful','Be just','Have fortitude']), ('page','pentacles','positive',ARRAY['Have an effect','Be practical','Be prosperous','Be trusting/trustworthy']),
('knight','wands','positive',ARRAY['Charming','Self-confident','Daring','Adventurous']), ('knight','cups','positive',ARRAY['Passionate','Romantic','Imaginative','Sensitive']), ('knight','swords','positive',ARRAY['Refined','Introspective','Direct','Authoritative']), ('knight','pentacles','positive',ARRAY['Incisive','Knowledgeable','Logical','Unwavering']),
('knight','wands','negative',ARRAY['Superficial','Cocky','Foolhardy','Restless']), ('knight','cups','negative',ARRAY['Hot-tempered','Overemotional','Fanciful','Temperamental']), ('knight','swords','negative',ARRAY['Overrefined','Introverted','Blunt','Overbearing']), ('knight','pentacles','negative',ARRAY['Cutting','Opinionated','Unfeeling','Stubborn']),
('queen','wands','positive',ARRAY['Attractive','Wholehearted','Energetic','Cheerful','Self-assured']), ('queen','cups','positive',ARRAY['Loving','Tenderhearted','Intuitive','Psychic','Spiritual']), ('queen','swords','positive',ARRAY['Honest','Astute','Forthright','Witty','Experienced']), ('queen','pentacles','positive',ARRAY['Nurturing','Bighearted','Down-to-earth','Resourceful','Trustworthy']),
('king','wands','positive',ARRAY['Creative','Inspiring','Forceful','Charismatic','Bold']), ('king','cups','positive',ARRAY['Wise','Calm','Diplomatic','Caring','Tolerant']), ('king','swords','positive',ARRAY['Intellectual','Analytical','Articulate','Just','Ethical']), ('king','pentacles','positive',ARRAY['Enterprising','Adept','Reliable','Supporting','Steady'])
ON CONFLICT (rank,suit,orientation) DO UPDATE SET associations=EXCLUDED.associations;

UPDATE cards SET meaning_upright='Innocence, new beginnings, free spirit', meaning_reversed='Recklessness, being taken advantage of, inconsideration' WHERE name='The Fool';
UPDATE cards SET meaning_upright='Willpower, desire, creation, manifestation', meaning_reversed='Trickery, illusions, out of touch' WHERE name='The Magician';
UPDATE cards SET meaning_upright='Intuition, unconscious, inner voice', meaning_reversed='Lack of center, lost inner voice, repressed feelings' WHERE name='The High Priestess';
UPDATE cards SET meaning_upright='Motherhood, fertility, nature', meaning_reversed='Dependence, smothering, emptiness' WHERE name='The Empress';
UPDATE cards SET meaning_upright='Authority, structure, control, fatherhood', meaning_reversed='Tyranny, rigidity, coldness' WHERE name='The Emperor';
UPDATE cards SET meaning_upright='Tradition, conformity, morality and ethics', meaning_reversed='Rebellion, subversiveness, new approaches' WHERE name='The Hierophant';
UPDATE cards SET meaning_upright='Partnerships, union, duality, choice', meaning_reversed='Loss of balance, one-sidedness, disharmony' WHERE name='The Lovers';
UPDATE cards SET meaning_upright='Direction, control, willpower', meaning_reversed='Lack of control, lack of direction, aggression' WHERE name='The Chariot';
UPDATE cards SET meaning_upright='Bravery, compassion, focus, inner strength', meaning_reversed='Self-doubt, weakness, insecurity' WHERE name='Strength';
UPDATE cards SET meaning_upright='Contemplation, search for truth, inner guidance', meaning_reversed='Loneliness, isolation, lost your way' WHERE name='The Hermit';
UPDATE cards SET meaning_upright='Change, cycles, inevitable fate', meaning_reversed='No control, clinging to control, bad luck' WHERE name='Wheel of Fortune';
UPDATE cards SET meaning_upright='Cause and effect, clarity, truth', meaning_reversed='Dishonesty, unaccountability, unfairness' WHERE name='Justice';
UPDATE cards SET meaning_upright='Sacrifice, release, martyrdom', meaning_reversed='Stalling, needless sacrifice, fear of sacrifice' WHERE name='The Hanged Man';
UPDATE cards SET meaning_upright='End of a cycle, beginnings, change, metamorphosis', meaning_reversed='Fear of change, holding on, stagnation' WHERE name='Death';
UPDATE cards SET meaning_upright='The middle path, patience, finding meaning', meaning_reversed='Extremes, excess, lack of balance' WHERE name='Temperance';
UPDATE cards SET meaning_upright='Excess, materialism, playfulness', meaning_reversed='Freedom, release, restoring control' WHERE name='The Devil';
UPDATE cards SET meaning_upright='Sudden upheaval, pride, disaster', meaning_reversed='Disaster avoided, delaying disaster, fear of suffering' WHERE name='The Tower';
UPDATE cards SET meaning_upright='Hope, faith, rejuvenation', meaning_reversed='Insecurity, discouragement, faithlessness' WHERE name='The Star';
UPDATE cards SET meaning_upright='Unconscious, illusions, intuition', meaning_reversed='Confusion, fear, misinterpretation' WHERE name='The Moon';
UPDATE cards SET meaning_upright='Joy, success, celebration, positivity', meaning_reversed='Negativity, depression, sadness' WHERE name='The Sun';
UPDATE cards SET meaning_upright='Reflection, reckoning, inner voice', meaning_reversed='Lack of self-awareness, doubt, self-loathing' WHERE name='Judgement';
UPDATE cards SET meaning_upright='Fulfillment, harmony, completion', meaning_reversed='Unfinished, no closure, incomplete goals' WHERE name='The World';

INSERT INTO major_arcana_correspondences (card_id, planets, signs, representations, positive_associations, negative_associations, core_theme)
SELECT c.id, d.planets, d.signs, d.representations, d.positive_associations, d.negative_associations, d.core_theme
FROM (VALUES
('The Fool',ARRAY['Uranus'],ARRAY[]::TEXT[],ARRAY['Pan','Aeolas','Zeus','Dionysus'],ARRAY['Innocence','New beginnings','Free spirit'],ARRAY['Recklessness','Being taken advantage of','Inconsideration'],'Beginnings'),
('The Magician',ARRAY['Mercury'],ARRAY[]::TEXT[],ARRAY['Hermes'],ARRAY['Willpower','Desire','Creation','Manifestation'],ARRAY['Trickery','Illusions','Out of touch'],'Manifestation'),
('The High Priestess',ARRAY[]::TEXT[],ARRAY[]::TEXT[],ARRAY['Hecate','Demeter','Selene','Artemis','The Moon'],ARRAY['Intuition','Unconscious','Inner voice'],ARRAY['Lack of center','Lost inner voice','Repressed feelings'],'Intuition'),
('The Empress',ARRAY['Venus'],ARRAY[]::TEXT[],ARRAY['Hera','Aphrodite'],ARRAY['Motherhood','Fertility','Nature'],ARRAY['Dependence','Smothering','Emptiness'],'Abundance'),
('The Emperor',ARRAY[]::TEXT[],ARRAY['Aries'],ARRAY['Zeus','Ares','Athena'],ARRAY['Authority','Structure','Control','Fatherhood'],ARRAY['Tyranny','Rigidity','Coldness'],'Authority'),
('The Hierophant',ARRAY[]::TEXT[],ARRAY['Taurus'],ARRAY['Dionysus','Zagreus'],ARRAY['Tradition','Conformity','Morality and ethics'],ARRAY['Rebellion','Subversiveness','New approaches'],'Tradition'),
('The Lovers',ARRAY[]::TEXT[],ARRAY['Gemini'],ARRAY['Eros and Psyche','Aphrodite and Ares','Castor and Pollux'],ARRAY['Partnerships','Union','Duality','Choice'],ARRAY['Loss of balance','One-sidedness','Disharmony'],'Choice'),
('The Chariot',ARRAY[]::TEXT[],ARRAY['Cancer'],ARRAY['Apollo'],ARRAY['Direction','Control','Willpower'],ARRAY['Lack of control','Lack of direction','Aggression'],'Willpower'),
('Strength',ARRAY[]::TEXT[],ARRAY['Leo'],ARRAY['Heracles','Hestia'],ARRAY['Bravery','Compassion','Focus','Inner strength'],ARRAY['Self-doubt','Weakness','Insecurity'],'Courage'),
('The Hermit',ARRAY[]::TEXT[],ARRAY['Virgo'],ARRAY['Cronos','Persephone','Astraea'],ARRAY['Contemplation','Search for truth','Inner guidance'],ARRAY['Loneliness','Isolation','Lost your way'],'Reflection'),
('Wheel of Fortune',ARRAY['Jupiter'],ARRAY[]::TEXT[],ARRAY['Zeus','Tyche'],ARRAY['Change','Cycles','Inevitable fate'],ARRAY['No control','Clinging to control','Bad luck'],'Cycle'),
('Justice',ARRAY[]::TEXT[],ARRAY['Libra'],ARRAY['Themis','Athena'],ARRAY['Cause and effect','Clarity','Truth'],ARRAY['Dishonesty','Unaccountability','Unfairness'],'Fairness'),
('The Hanged Man',ARRAY['Neptune'],ARRAY[]::TEXT[],ARRAY['Adonis','Poseidon','Dionysus'],ARRAY['Sacrifice','Release','Martyrdom'],ARRAY['Stalling','Needless sacrifice','Fear of sacrifice'],'Perspective'),
('Death',ARRAY[]::TEXT[],ARRAY['Scorpio'],ARRAY['Thanatos','Ares','Hades'],ARRAY['End of a cycle','Beginnings','Change','Metamorphosis'],ARRAY['Fear of change','Holding on','Stagnation'],'Transformation'),
('Temperance',ARRAY[]::TEXT[],ARRAY['Sagittarius'],ARRAY['Artemis','Chiron','Iris','Hermaphroditus'],ARRAY['The middle path','Patience','Finding meaning'],ARRAY['Extremes','Excess','Lack of balance'],'Balance'),
('The Devil',ARRAY[]::TEXT[],ARRAY['Capricorn'],ARRAY['Priapus','Pan'],ARRAY['Excess','Materialism','Playfulness'],ARRAY['Freedom','Release','Restoring control'],'Bondage'),
('The Tower',ARRAY['Mars'],ARRAY[]::TEXT[],ARRAY['Ares'],ARRAY['Sudden upheaval','Pride','Disaster'],ARRAY['Disaster avoided','Delaying disaster','Fear of suffering'],'Upheaval'),
('The Star',ARRAY[]::TEXT[],ARRAY['Aquarius'],ARRAY['Hebe','Ganymede','Astraea','Aphrodite'],ARRAY['Hope','Faith','Rejuvenation'],ARRAY['Insecurity','Discouragement','Faithlessness'],'Hope'),
('The Moon',ARRAY[]::TEXT[],ARRAY['Pisces'],ARRAY['Selene','Artemis','Hecate','Poseidon'],ARRAY['Unconscious','Illusions','Intuition'],ARRAY['Confusion','Fear','Misinterpretation'],'Illusion'),
('The Sun',ARRAY[]::TEXT[],ARRAY[]::TEXT[],ARRAY['Helios','Apollo','The Sun'],ARRAY['Joy','Success','Celebration','Positivity'],ARRAY['Negativity','Depression','Sadness'],'Joy'),
('Judgement',ARRAY['Pluto'],ARRAY[]::TEXT[],ARRAY['Hephaestus'],ARRAY['Reflection','Reckoning','Inner voice'],ARRAY['Lack of self-awareness','Doubt','Self-loathing'],'Awakening'),
('The World',ARRAY['Saturn'],ARRAY[]::TEXT[],ARRAY['Cronos','Gaea','Demeter'],ARRAY['Fulfillment','Harmony','Completion'],ARRAY['Unfinished','No closure','Incomplete goals'],'Completion')) AS d(name,planets,signs,representations,positive_associations,negative_associations,core_theme)
JOIN cards c ON c.name=d.name
ON CONFLICT (card_id) DO UPDATE SET planets=EXCLUDED.planets, signs=EXCLUDED.signs, representations=EXCLUDED.representations, positive_associations=EXCLUDED.positive_associations, negative_associations=EXCLUDED.negative_associations, core_theme=EXCLUDED.core_theme;

UPDATE cards SET meaning_upright='Creation, willpower, inspiration, desire', meaning_reversed='Lack of energy, lack of passion, boredom' WHERE name='Ace of Wands';
UPDATE cards SET meaning_upright='Planning, making plans, discovery', meaning_reversed='Lack of planning, disorganization, bad planning' WHERE name='Two of Wands';
UPDATE cards SET meaning_upright='Looking ahead, expansion, rapid growth', meaning_reversed='Obstacles, delays, frustration' WHERE name='Three of Wands';
UPDATE cards SET meaning_upright='Community, home, celebration', meaning_reversed='Lack of communication, instability, home conflicts' WHERE name='Four of Wands';
UPDATE cards SET meaning_upright='Competition, conflict, rivalry', meaning_reversed='Avoiding conflict, respecting differences' WHERE name='Five of Wands';
UPDATE cards SET meaning_upright='Victory, success, public reward', meaning_reversed='Self-doubt, lack of recognition, punishment' WHERE name='Six of Wands';
UPDATE cards SET meaning_upright='Perseverance, defensive, maintaining control', meaning_reversed='Give up, destroyed confidence, feeling overwhelmed' WHERE name='Seven of Wands';
UPDATE cards SET meaning_upright='Rapid action, movement, quick decisions', meaning_reversed='Obstacles, waiting, slowing down' WHERE name='Eight of Wands';
UPDATE cards SET meaning_upright='Resilience, pushing forward, last stretch', meaning_reversed='Exhaustion, fatigue, reaching burnout' WHERE name='Nine of Wands';
UPDATE cards SET meaning_upright='Accomplishment, responsibility, burden', meaning_reversed='Inability to delegate, lack of priorities' WHERE name='Ten of Wands';
UPDATE cards SET meaning_upright='Exploration, excitement, freedom', meaning_reversed='Lack of direction, negativity, feeling caged' WHERE name='Page of Wands';
UPDATE cards SET meaning_upright='Action, adventure, fearlessness', meaning_reversed='Anger, impulsiveness, recklessness' WHERE name='Knight of Wands';
UPDATE cards SET meaning_upright='Courage, determination, joy', meaning_reversed='Selfishness, jealousy, demanding' WHERE name='Queen of Wands';
UPDATE cards SET meaning_upright='Big picture, leader, overcoming challenges', meaning_reversed='Impulsive, overbearing, unachievable expectations' WHERE name='King of Wands';
UPDATE cards SET meaning_upright='New love, overflowing feelings, creativity', meaning_reversed='Wasted emotions, blocked creativity, emptiness' WHERE name='Ace of Cups';
UPDATE cards SET meaning_upright='Unity, partnership, two become one', meaning_reversed='Imbalance, broken communication, tension' WHERE name='Two of Cups';
UPDATE cards SET meaning_upright='Friendship, community, happiness', meaning_reversed='Herd mentality, conformity, solitude' WHERE name='Three of Cups';
UPDATE cards SET meaning_upright='Apathy, contemplation, disconnectedness', meaning_reversed='Boredom, taking for granted, aloofness' WHERE name='Four of Cups';
UPDATE cards SET meaning_upright='Loss, grief, disappointment', meaning_reversed='Acceptance, moving on, finding peace' WHERE name='Five of Cups';
UPDATE cards SET meaning_upright='Nostalgia, happy memories, reunion', meaning_reversed='Resisting change, clinging to past, unrealistic expectations' WHERE name='Six of Cups';
UPDATE cards SET meaning_upright='Choices, fantasy, illusion', meaning_reversed='Temptation, diversion, confusion' WHERE name='Seven of Cups';
UPDATE cards SET meaning_upright='Walking away, disillusionment, leaving behind', meaning_reversed='Confusion, fear of the unknown, fear of loss' WHERE name='Eight of Cups';
UPDATE cards SET meaning_upright='Comfort, emotional stability, luxury', meaning_reversed='Greed, smugness, dissatisfaction' WHERE name='Nine of Cups';
UPDATE cards SET meaning_upright='Peace, contentment, fulfillment, celebration', meaning_reversed='Shattered dreams, broken family, bad relationships' WHERE name='Ten of Cups';
UPDATE cards SET meaning_upright='Delightful surprise, inner child, intuition', meaning_reversed='Immaturity, escapism, lack of creativity' WHERE name='Page of Cups';
UPDATE cards SET meaning_upright='Messenger, romance, adventure', meaning_reversed='Moodiness, disappointment, dependence' WHERE name='Knight of Cups';
UPDATE cards SET meaning_upright='Compassion, calm, comfort', meaning_reversed='Coldness, insecurity, dependence' WHERE name='Queen of Cups';
UPDATE cards SET meaning_upright='Compassion, control, balance', meaning_reversed='Manipulation, moodiness, trickery' WHERE name='King of Cups';
UPDATE cards SET meaning_upright='Victory, raw strength, sharp mind', meaning_reversed='Confusion, brutality, chaos' WHERE name='Ace of Swords';
UPDATE cards SET meaning_upright='Difficult choices, indecision, stalemate', meaning_reversed='Lesser of two evils, no right choices, confusion' WHERE name='Two of Swords';
UPDATE cards SET meaning_upright='Heartbreak, suffering, grief', meaning_reversed='Recovery, forgiveness, moving on' WHERE name='Three of Swords';
UPDATE cards SET meaning_upright='Rest, restoration, contemplation', meaning_reversed='Restlessness, burnout, stress' WHERE name='Four of Swords';
UPDATE cards SET meaning_upright='Unbridled ambition, win at all costs, sneakiness', meaning_reversed='Lingering resentment, desire to reconcile, desire to forgive' WHERE name='Five of Swords';
UPDATE cards SET meaning_upright='Transition, leaving behind, moving on', meaning_reversed='Emotional baggage, unresolved issues, resisting transition' WHERE name='Six of Swords';
UPDATE cards SET meaning_upright='Deception, trickery, turning a blind eye', meaning_reversed='Turn a new leaf, desire to reform, desire to change' WHERE name='Seven of Swords';
UPDATE cards SET meaning_upright='Imprisonment, powerlessness, self-victimization', meaning_reversed='Self-acceptance, new perspective, freedom' WHERE name='Eight of Swords';
UPDATE cards SET meaning_upright='Anxiety, hopelessness, nightmares', meaning_reversed='Fear, lack of objectivity, despair' WHERE name='Nine of Swords';
UPDATE cards SET meaning_upright='Betrayal, back-stabbing, defeat', meaning_reversed='Reviving, rejuvenation, inevitable end' WHERE name='Ten of Swords';
UPDATE cards SET meaning_upright='Curiosity, restlessness, mental energy', meaning_reversed='Hastiness, rushing through, all talk' WHERE name='Page of Swords';
UPDATE cards SET meaning_upright='Drive, speed, ambition', meaning_reversed='No direction, disregard for consequence, unpredictability' WHERE name='Knight of Swords';
UPDATE cards SET meaning_upright='Complexity, perceptive, clear mindedness', meaning_reversed='Cold-hearted, cruel, bitterness' WHERE name='Queen of Swords';
UPDATE cards SET meaning_upright='Intellectual, power, truth', meaning_reversed='Manipulative, cruel, criticism' WHERE name='King of Swords';
UPDATE cards SET meaning_upright='Opportunity, prosperity, new venture', meaning_reversed='Lost opportunity, missed chance' WHERE name='Ace of Pentacles';
UPDATE cards SET meaning_upright='Balance, priorities, adapting to change', meaning_reversed='Loss of balance, disorganized, overwhelmed' WHERE name='Two of Pentacles';
UPDATE cards SET meaning_upright='Teamwork, collaboration, building', meaning_reversed='Lack of teamwork, disorganized, group conflict, competition' WHERE name='Three of Pentacles';
UPDATE cards SET meaning_upright='Conservation, security, frugality', meaning_reversed='Greediness, stinginess, possessiveness' WHERE name='Four of Pentacles';
UPDATE cards SET meaning_upright='Need, poverty, insecurity', meaning_reversed='Recovery, isolation' WHERE name='Five of Pentacles';
UPDATE cards SET meaning_upright='Charity, generosity, sharing', meaning_reversed='Selfishness, stinginess, debt' WHERE name='Six of Pentacles';
UPDATE cards SET meaning_upright='Hard work, perseverance, diligence', meaning_reversed='Work without results, distractions, lack of rewards' WHERE name='Seven of Pentacles';
UPDATE cards SET meaning_upright='Education, apprenticeship, achievement', meaning_reversed='No focus, no ambition, no motivation' WHERE name='Eight of Pentacles';
UPDATE cards SET meaning_upright='Fruits of labor, independence, rewards', meaning_reversed='Mistakes, obsession with work, setbacks' WHERE name='Nine of Pentacles';
UPDATE cards SET meaning_upright='Legacy, inheritance, culmination', meaning_reversed='Failure, lack of stability, lack of resources' WHERE name='Ten of Pentacles';
UPDATE cards SET meaning_upright='Dreams, desire, new opportunity', meaning_reversed='Daydreaming, impracticality, laziness' WHERE name='Page of Pentacles';
UPDATE cards SET meaning_upright='Efficiency, hard work, routine', meaning_reversed='Laziness, obsessiveness, work without reward' WHERE name='Knight of Pentacles';
UPDATE cards SET meaning_upright='Practicality, creature comforts, financial security', meaning_reversed='Work life imbalance, smothering, work without reward' WHERE name='Queen of Pentacles';
UPDATE cards SET meaning_upright='Abundance, power, security', meaning_reversed='Greed, indulgence, sensuality' WHERE name='King of Pentacles';

COMMIT;
