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

-- ---------------------------------------------------------------------------
-- Astrology reference data (transcribed from Astrology.md). Rerunnable.
-- ---------------------------------------------------------------------------

INSERT INTO astrology_signs (key, name, glyph, modality, element, ruling_planet, keywords, associations) VALUES
('aries','Aries','♈','cardinal','fire','mars',ARRAY['courage','leader','energetic','impulse'],ARRAY['Competitive actions','Extreme scenarios','High anxiety','Letting things go','Impulsivity','Intense reactions and situations']),
('taurus','Taurus','♉','fixed','earth','venus',ARRAY['sensual','security','patient','practical'],ARRAY['Stubbornness','Sensitive nature','Sadness caused by others','Emotional release']),
('gemini','Gemini','♊','mutable','air','mercury',ARRAY['curious','adaptable','restless'],ARRAY['Mischievous actions','Curious nature','Clever thoughts','Emotional maturity','Duality','Emotions over rationality']),
('cancer','Cancer','♋','cardinal','water','moon',ARRAY['nurturing','sensitive','receptive'],ARRAY['Nurturing attitude','Heavy emotional outpours','Loyal nature','Craving attention','Lost friendships']),
('leo','Leo','♌','fixed','fire','sun',ARRAY['warm','expressive','creative','shine'],ARRAY['Confidence','Stamina','Leadership','Pride','Being the center of attention']),
('virgo','Virgo','♍','mutable','earth','mercury',ARRAY['ordered','precise','analytical'],ARRAY['Being alone','Cynical thoughts','Rational actions','Taking on too much']),
('libra','Libra','♎','cardinal','air','venus',ARRAY['mediator','balance','art','beauty'],ARRAY['Finding peace amid chaos','Channeling good feelings','Achieving a balance in life','Harmony or the need to harmonize']),
('scorpio','Scorpio','♏','fixed','water','pluto',ARRAY['depth','intensity','passion'],ARRAY['Power grabbing','Firm ideals','Secret emotions','Truth and honesty','Transformative abilities']),
('sagittarius','Sagittarius','♐','mutable','fire','jupiter',ARRAY['travel','optimistic','blunt'],ARRAY['Optimistic goals and positivity','Adventure-seeking','Looking for peace','Exposing the truth']),
('capricorn','Capricorn','♑','cardinal','earth','saturn',ARRAY['disciplined','ambitious','cautious'],ARRAY['Possessive tendencies','Controlling attitude','Aptitude for business','Isolation']),
('aquarius','Aquarius','♒','fixed','air','uranus',ARRAY['humanitarian','inventive','individual'],ARRAY['Longing for communication','Uncontrollable stress or anxiety','Self-evaluation and introspection','Unknown future events']),
('pisces','Pisces','♓','mutable','water','neptune',ARRAY['dreamer','imaginative','compassion'],ARRAY['Sympathetic motives','Dishonest friends','Escaping reality','Innocent nature'])
ON CONFLICT (key) DO UPDATE SET name=EXCLUDED.name, glyph=EXCLUDED.glyph, modality=EXCLUDED.modality, element=EXCLUDED.element, ruling_planet=EXCLUDED.ruling_planet, keywords=EXCLUDED.keywords, associations=EXCLUDED.associations;

INSERT INTO astrology_planets (key, name, glyph, keywords, associations) VALUES
('sun','Sun','☉',ARRAY['vitality','ego','consciousness'],ARRAY['Feelings of authority','Father figures','The ego','Inner self','Vital force','Staying power','Origination']),
('moon','Moon','☽',ARRAY['emotions','instincts','nurturing'],ARRAY['Instinctual impulses','Health of your emotions','The unconscious mind','Natural rhythms','Habitual patterns']),
('mercury','Mercury','☿',ARRAY['communication','intellect','logic'],ARRAY['Use of language','Conveying information (verbal and non-verbal)','Brilliance of the mind','Use of reason and intelligence']),
('venus','Venus','♀',ARRAY['relationships','love','beauty','art'],ARRAY['Physical and mental attractions','True love','Inner beauty','Artistic harmony']),
('mars','Mars','♂',ARRAY['desire','drive','action','aggression'],ARRAY['Competitive forces','Aggressive acts','Craving','Sex','Courageous attitudes']),
('jupiter','Jupiter','♃',ARRAY['abundance','luck','excess','prosperity'],ARRAY['An optimistic attitude','Spiritual expansion','Inner growth','Abundant luck','Sympathy and understanding']),
('saturn','Saturn','♄',ARRAY['structure','authority','boundaries','discipline'],ARRAY['Responsible acts','Aspiration or ambition','Indebtedness or obligation','Rule of law']),
('uranus','Uranus','♅',ARRAY['freedom','liberation','science'],ARRAY['Reforming old habits','Drastic change','Chaotic feelings','Inspiring acts','Rebellious nature']),
('neptune','Neptune','♆',ARRAY['dreams','intuition','illusion','hidden','fantasy'],ARRAY['Imaginary insights','Predictions','Dream states','Instinctive knowledge and psychic ability','Spirituality and mysticism','Delusions']),
('pluto','Pluto','♇',ARRAY['transformation','death','depth','power'],ARRAY['Extreme power','Transformative acts','Reborn faith','Modifying lifestyle','Death','Evolution']),
('nnode','North Node','☊',ARRAY['destiny','fate','lessons'],ARRAY['The road ahead','Future knowledge and lessons that must be learned','Rational and irrational fear including of the unknown','Destiny and fate']),
('snode','South Node','☋',ARRAY['past','karma','release'],ARRAY['Cosmic past','Spiritual misgivings','Examining past mistakes','Karmic baggage']),
('chiron','Chiron','⚷',ARRAY[]::TEXT[],ARRAY[]::TEXT[]),
('lilith','Lilith','⚸',ARRAY[]::TEXT[],ARRAY[]::TEXT[])
ON CONFLICT (key) DO UPDATE SET name=EXCLUDED.name, glyph=EXCLUDED.glyph, keywords=EXCLUDED.keywords, associations=EXCLUDED.associations;

INSERT INTO astrology_houses (number, name, keywords, associations) VALUES
(1,'1st House',ARRAY['self','beginnings','appearance','body','identity','character'],ARRAY['Outer beauty and how you look','Intimate details of your personal life','Second chances or new beginnings','Warnings of future mishaps or accidents']),
(2,'2nd House',ARRAY['money','finances','values','possessions','income'],ARRAY['Drastic financial changes either good or bad','Destitution or poverty','Riches or wealth','Material needs','Pilfered or lost possessions','Business transactions']),
(3,'3rd House',ARRAY['early education','short trips','neighbors','communication','siblings','errands'],ARRAY['Family, siblings, people tied to your blood and location','Need to venture to new places','School and education especially early childhood education','Expecting correspondence from unlikely places','Warns of future gossip, ridicule, or harassment from unknown sources']),
(4,'4th House',ARRAY['home','roots','family','private life','property','parents'],ARRAY['Bond between you and your parents or parental figures','Signals that you question your domestic situation','Possible land acquisition or inheritance','Endings of any situation']),
(5,'5th House',ARRAY['children','creativity','sex','romance','play','self-expression'],ARRAY['Displays romantic love','The joys of children','Length of pregnancy','Creative nature','Rain','Water','Education','Gambling','Hobbies']),
(6,'6th House',ARRAY['injuries','health','work','coworkers','service','daily routines','self-improvement','fitness'],ARRAY['Signifies the condition of your pets, co-workers, and subordinates','Hygienic routines','Specific details related to your health','Injuries']),
(7,'7th House',ARRAY['relationships','marriage','partnerships','contracts'],ARRAY['Personal and business-related relationships in your life','Could signify an upcoming court case','Marriage separation','Surprising new friends','Antagonizing competitor','New contract on the horizon']),
(8,'8th House',ARRAY['sudden losses','inheritance','death','shared finances','regeneration','secrets','debt'],ARRAY['Ominous signs of death','Revitalization','Black magic or the occult','Uncollected taxes','Unpaid debts','Potential dangers','Criminal and civil investigations','Long suffering']),
(9,'9th House',ARRAY['higher education','foreign travel','philosophy','law and religion','foreigners','publishing','ethics'],ARRAY['Vital to astrologers','Successful divination','Religious virtues','Philosophical pursuits','Artistic talent','Writing competence']),
(10,'10th House',ARRAY['career','reputation','long-term goals','public image','superiors','status'],ARRAY['Involves your future success','Personal wealth','Attaining glory','Improving your reputation','Environmental awareness']),
(11,'11th House',ARRAY['friends','networking','dreams','hopes','alliances','groups','humanitarianism','technology'],ARRAY['Focused on the value of good luck','Involves strangers becoming friends','New-found wealth','Surprise presents and money','True faith in improvement']),
(12,'12th House',ARRAY['endings','healing','loss','sickness','confinement','hidden enemies','solitude','subconscious','closure','spirituality'],ARRAY['Worst elements of humankind','Crippling addictions','Violent death','Extreme loss and pain','Suicidal tendencies','Secret thoughts','Solitude'])
ON CONFLICT (number) DO UPDATE SET name=EXCLUDED.name, keywords=EXCLUDED.keywords, associations=EXCLUDED.associations;

INSERT INTO astrology_aspects (key, name, glyph, angle, meaning) VALUES
('conjunction','Conjunction','☌',0,'conflict / contradicting'),
('sextile','Sextile','⚹',60,'blended / integrated energies'),
('trine','Trine','△',120,'natural flowing energy'),
('square','Square','□',90,'friction / tension'),
('opposition','Opposition','☍',180,'harmonious')
ON CONFLICT (key) DO UPDATE SET name=EXCLUDED.name, glyph=EXCLUDED.glyph, angle=EXCLUDED.angle, meaning=EXCLUDED.meaning;

INSERT INTO astrology_dignities (planet_key, sign_key, dignity) VALUES
('sun','leo','rulership'),('moon','cancer','rulership'),('mercury','gemini','rulership'),('mercury','virgo','rulership'),
('venus','taurus','rulership'),('venus','libra','rulership'),('mars','aries','rulership'),('mars','scorpio','rulership'),
('jupiter','sagittarius','rulership'),('jupiter','pisces','rulership'),('saturn','capricorn','rulership'),('saturn','aquarius','rulership'),
('sun','aquarius','detriment'),('moon','capricorn','detriment'),('mercury','sagittarius','detriment'),('mercury','pisces','detriment'),
('venus','aries','detriment'),('venus','scorpio','detriment'),('mars','libra','detriment'),('mars','taurus','detriment'),
('jupiter','gemini','detriment'),('jupiter','virgo','detriment'),('saturn','cancer','detriment'),('saturn','leo','detriment'),
('sun','aries','exaltation'),('moon','taurus','exaltation'),('mercury','virgo','exaltation'),('venus','pisces','exaltation'),
('mars','capricorn','exaltation'),('jupiter','cancer','exaltation'),('saturn','libra','exaltation'),
('sun','libra','fall'),('moon','scorpio','fall'),('mercury','pisces','fall'),('venus','virgo','fall'),
('mars','cancer','fall'),('jupiter','capricorn','fall'),('saturn','aries','fall')
ON CONFLICT (planet_key, sign_key, dignity) DO NOTHING;

INSERT INTO astrology_modalities (key, name, keywords, signs) VALUES
('cardinal','Cardinal',ARRAY['Create','take action','initiate relationships'],ARRAY['capricorn','libra','cancer','aries']),
('fixed','Fixed',ARRAY['Build','maintain','control'],ARRAY['taurus','aquarius','scorpio','leo']),
('mutable','Mutable',ARRAY['Adapt','organize','change/transform'],ARRAY['virgo','gemini','pisces','sagittarius'])
ON CONFLICT (key) DO UPDATE SET name=EXCLUDED.name, keywords=EXCLUDED.keywords, signs=EXCLUDED.signs;

INSERT INTO astrology_elements (key, name, keywords, signs) VALUES
('earth','Earth',ARRAY['Sensation','security','managing reality'],ARRAY['capricorn','taurus','virgo']),
('air','Air',ARRAY['Thought','communication','social interaction'],ARRAY['libra','aquarius','gemini']),
('water','Water',ARRAY['Emotion','response','instinctual depth'],ARRAY['cancer','scorpio','pisces']),
('fire','Fire',ARRAY['Intuition','ego recognition','possibility'],ARRAY['aries','leo','sagittarius'])
ON CONFLICT (key) DO UPDATE SET name=EXCLUDED.name, keywords=EXCLUDED.keywords, signs=EXCLUDED.signs;

INSERT INTO astrology_reference_notes (key, title, body) VALUES
('angles','Angles & Elements','ASC: Ascendant. DSC: Descendant. MC: Midheaven. IC: Imum Coeli.'),
('critical_degrees','Critical Degrees','Cardinal signs: 0, 13, 26. Fixed signs: 8-9, 21-22. Mutable signs: 4, 17. All signs: 0 and 29 are critical degrees.'),
('degree_theory','Nikola Stojanovic Degree Theory','Degrees carry the flavour of a sign regardless of the sign a planet is actually in. 1, 13, 25 = Aries. 2, 14, 26 = Taurus. 3, 15, 27 = Gemini. 4, 16, 28 = Cancer. 5, 17, 29 = Leo. 6, 18 = Virgo. 7, 19 = Libra. 8, 20 = Scorpio. 9, 21 = Sagittarius. 10, 22 = Capricorn. 11, 23 = Aquarius. 12, 24 = Pisces. 0 = the truest expression of the sign it is in.')
ON CONFLICT (key) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body;

-- ---------------------------------------------------------------------------
-- Greek Alphabet Oracle (Olympian inscription). Rerunnable.
-- ---------------------------------------------------------------------------

INSERT INTO greek_oracle_letters (letter, name, position, oracle, meaning, keywords) VALUES
('Α','Alpha',1,
 'The God Apollo says you will do everything {Apanta} successfully.',
 'The Alpha oracle is a reassurance and motivation for what lies ahead. These next steps are beneficial to the progress of your goals. You may complete your goals with success.',
 ARRAY['Apollo','achievement','alignment','success']),
('Β','Beta',2,
 'With the help of Tyche, you will have an assistant {Boethos}, (the Pythian) Apollo.',
 'Your responsibilities are yours and must be shouldered, but if you ask Apollo and Luck is with you, you may receive His assistance. Beta refers to help of a prophetic or mystic nature; this oracle reveals meanings and truths that echo our instincts. Assistance can seem to arrive ''just in time''.',
 ARRAY['Apollo','luck','truth','hidden meanings','mentorship','synchronicity']),
('Γ','Gamma',3,
 'Gaia (the Earth) {Ge} will give you the ripe fruit of your labors.',
 'What has been sown will be harvested in kind. Gamma is often revealed when hard work will pay off in a tangible way, usually from the Earth''s natural resources.',
 ARRAY['Gaea','Earth','reward','harvest','payment','fruits','abundance']),
('Δ','Delta',4,
 'In customs inopportune strength {Dynamis} is weak.',
 'Delta''s message is to plan actions carefully when approaching that which is new to us. Poor timing, inexperience or improper planning sets one up for a difficult time, yet the situation may call for quick action. Choose battles wisely.',
 ARRAY['practice','planning','organization','motivation']),
('Ε','Epsilon',5,
 'You desire {Eros} to see the offspring of righteous marriages.',
 'Epsilon is an oracle which does not necessarily refer to a desire to have children. You have done what you can, tried your best, and now your wish is to see this through to the ''good part''. You seek validation or closure, a happily ever after or a fix that works.',
 ARRAY['hope','unity','compensation','repair']),
('Ζ','Zeta',6,
 'Flee the very great storm {Zale}, lest you be disabled in some way.',
 'Save your energy and resources for the time they will be most effective. Avoid danger by stepping away physically, emotionally, or mentally. Zeta may also carry the literal warning ''avoid acting in bad weather.''',
 ARRAY['retreat','protection','shelter','storms','volatility','weather','Zeus']),
('Η','Eta',7,
 'Bright {Helios} (the Sun), who watches everything, watches you.',
 'The life-giving Sun makes Nature''s blessings known and causes growth. Just as the light of the sun touches all, Helios watches and knows if a lie is told or a promise broken. Eta says hiding the truth is of no benefit to self or others.',
 ARRAY['Helios','Sun','promise','light','life','morality','clarity']),
('Θ','Theta',8,
 'You have the helping Gods {Theoi} of this path.',
 'The god(s) you are familiar with will protect and care for you within the scope of their respective domain. Answered prayers often follow Theta''s appearance.',
 ARRAY['gift','blessing','ease','comfort']),
('Ι','Iota',9,
 'There is sweat {Idros}; it excels more than everything.',
 'Iota is a reminder that effort put forth is of great value. Physical labor is denoted by this oracle, yet it also refers to feats of mental capacity and reasoning.',
 ARRAY['strength','mental toughness','perseverance','faith']),
('Κ','Kappa',10,
 'To fight with the waves {Kyma} is difficult; endure friend.',
 'Kappa says your best course is to endure with courage, or to retreat for now and regroup until the time is better. Above all, do not give up!',
 ARRAY['confidence','courage','struggle','persistence']),
('Λ','Lambda',11,
 'The one passing on the left {Laios} bodes well for everything.',
 'The ''left'' refers to the unconscious realms and may also symbolize the sinister or unfortunate. Something good comes from an unlikely source. Lambda is the ''wild idea'' or unconventional source that is initially misunderstood.',
 ARRAY['perspective','patience','invention','opportunity']),
('Μ','Mu',12,
 'It is necessary to labor {Mokhtheo}, but the change will be admirable.',
 'Mu is an oracle which speaks very clearly. The best changes will occur as a direct result of the energy put into this situation. Keep going!',
 ARRAY['change','reward','transformation']),
('Ν','Nu',13,
 'The strife-bearing {Nikephoros} gift fulfills the oracle.',
 'Something will be given that brings inconvenience or ill fortune, but this gift means an answer is coming soon. Nu can also signify an end to bad luck.',
 ARRAY['completion','reversal','shifts']),
('Ξ','Xi',14,
 'There is no fruit to take from a withered {Xeros} shoot.',
 'Set your expectations carefully and realistically. Take inventory of behaviors and thoughts, releasing what does not benefit. Xi is both cautionary and freeing.',
 ARRAY['release','introspection','maintenance of goals','insight']),
('Ο','Omicron',15,
 'There are no {Ouk esti} crops to be reaped that were not sown.',
 'Focus on the beginning, not the end. Omicron suggests the benefits to come will not happen alone, help is needed.',
 ARRAY['responsibility','new beginnings','motivation']),
('Π','Pi',16,
 'Completing many {Polla} contests, you will seize the crown.',
 'You will persevere if you keep trying. Have faith as adversity passes; Pi is related to successful problem solving and a measure of fame.',
 ARRAY['success','recognition','awards']),
('Ρ','Rho',17,
 'You will go on more easily {Rhaion} if you wait a short time.',
 'It is best if you wait for now and continue later with your plan. Rho is not specific regarding length of time.',
 ARRAY['pause','restraint','patience']),
('Σ','Sigma',18,
 '(Phoibos) Apollo speaks plainly {Saphos}; stay, friend.',
 'Phoibos Apollo (Bright and Pure) gives a clear message to cease action or advance. Do not give up or retreat, stand your ground but progress no further.',
 ARRAY['Apollo','stand by','delay']),
('Τ','Tau',19,
 'You will have a parting from the {Ton parouson} companions now around you.',
 'For better or worse, you will experience a separation from the persons around you. Tau can speak to travel, disagreements, and communication issues caused by breakdowns in technology; graduation or promotion may also be in play.',
 ARRAY['separation','division','detachment']),
('Υ','Upsilon',20,
 'The affair holds a noble undertaking {Yposkhesis}.',
 'What is being considered has a good cause or element. Upsilon is connected to excellence in the process of achieving a goal, and the honor of its completion.',
 ARRAY['mastery','charity','kindness']),
('Φ','Phi',21,
 'Having done something carelessly {Phaulos}, you will thereafter blame the Gods.',
 'Phi''s message is of personal responsibility and realistic thinking. Accept blame (not shame) and use this lesson to make better choices moving forward. Take care that any regret is not projected onto others, especially to the Divine.',
 ARRAY['responsibility','learning','ownership','integrity']),
('Χ','Khi',22,
 'Succeeding, friend, you will fulfill a golden {Khryseos} oracle.',
 'An exceptionally good or just element will be realized when your goal is complete. The finish line is in sight! Khi is associated with reputation, public recognition and occasionally matters of law.',
 ARRAY['performance','reputation','justice','law']),
('Ψ','Psi',23,
 'You have this righteous judgment {Psephos} from the Gods.',
 'The psephos is the stone or token used for divination or voting. One literal interpretation of Psi is the judgment at hand is seen by the Gods as fair and righteous, what is commonly called Fate or even Blessing. This oracle also concerns choices that reflect our morality and humanity.',
 ARRAY['acknowledgement','Fate','fairness','kindness','ethics']),
('Ω','Omega',24,
 'You will have a difficult {Omos} harvest season, not a fruitful one.',
 'The Omega oracle suggests this path may be difficult until its end. The rewards of your labors might be delayed or result in something unexpected.',
 ARRAY['interference','hindrances','surprise'])
ON CONFLICT (letter) DO UPDATE SET
  name=EXCLUDED.name, position=EXCLUDED.position, oracle=EXCLUDED.oracle,
  meaning=EXCLUDED.meaning, keywords=EXCLUDED.keywords;

-- ---------------------------------------------------------------------------
-- Astragalomancy: traditional meanings for the sum of three six-sided dice.
-- Rerunnable.
-- ---------------------------------------------------------------------------

INSERT INTO astragalomancy_meanings (total, meaning) VALUES
(3,  'Favorable, surprising news.'),
(4,  'Bad luck, disappointment.'),
(5,  'Your wish is granted but in an unexpected way; a stranger brings joy.'),
(6,  'Loss in business and money.'),
(7,  'Beware of backstabbing which causes setbacks.'),
(8,  'Injustice caused by outside influences. Victimization.'),
(9,  'Rekindling and forgiveness after arguing. Luck in marriage and in matters of the heart.'),
(10, 'Business success, promotion, domestic bliss.'),
(11, 'Parting of ways, some illness.'),
(12, 'Expect good written news, but seek counsel when replying to any correspondence.'),
(13, 'Sadness and grief.'),
(14, 'Help from a friend; getting to know a distant admirer.'),
(15, 'Beware of temptation.'),
(16, 'Safe and pleasant travels.'),
(17, 'A change of plan. Schedules may be altered by somebody abroad who is involved in your arrangements.'),
(18, 'Overall happiness involving prosperity and success.')
ON CONFLICT (total) DO UPDATE SET meaning = EXCLUDED.meaning;

COMMIT;
