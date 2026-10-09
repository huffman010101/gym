/*
 * The owner's own notes for Mind → My Notes, organised and de-duplicated.
 * `locked` groups only show once the Game Plan password has been entered.
 * Where a note's claim is shaky or risky, the wording keeps the useful part
 * and says so honestly.
 */

export type NoteGroup = { title: string; tag: string; locked?: boolean; items: [string, string][] };

export const NOTE_GROUPS: NoteGroup[] = [
  {
    title: 'Who I am', tag: 'The mindset everything else comes from', items: [
      ['Act like the man I want to be', 'Walk, talk and decide like your dream self today, not when you feel ready. Step into the hero role — do not be an extra in someone else\'s film. Confidence is built from doing what you said you would do.'],
      ['My validation is the only one I need', 'Stop seeking approval and stop complaining. Take responsibility for your own success and never blame other people.'],
      ['Flip the frame', 'Not "how do I get them to like me" but "what can they do to make me like them?" You have values and standards; people earn their way in.'],
      ['Core values', 'Integrity, kindness, value. Find your worth in God, in being productive and in managing your own money — never in another person\'s approval.'],
      ['Love your life', 'Drop the energy drainers and put everything into what you want. Train hard. Think about what you have earned and how hard you work — you are not easy to impress.'],
      ['You vs you', 'Never compare yourself with anyone. Take care of yourself and the world takes care of you.'],
      ['Accept who I am', 'Everything is in God\'s hands. Let go, have fun, and believe in yourself.'],
      ['Numb to failure', 'Step outside a little delusional. Rejection is not deep and never personal — move on, do not be soft about it. Everyone forgets the moment within a year. The win is in the approach.'],
      ['Abundance', 'If one person does not like you, plenty do. Seek new experiences and discover other people\'s lives.'],
      ['Control the reaction', 'Assume good intent. Do not defend yourself or explain. Stop reacting to everything and taking it personally — do not hand out free reactions. Calm and a bit nonchalant.'],
      ['Calm with women\'s arguments', 'Never get mad or upset. Stay calm, let it pass, respond when you are ready. The calmer one holds the frame.'],
      ['Confident, not cocky', 'Calm and collected, never loud or aggressive. Do not get into pissing contests. Build other people up instead of putting them down.'],
      ['Be yourself, maturely', 'Genuinely do not try too hard. Playful is good; goofy all the time is not. Mature with a bit of mischief is the mix.'],
      ['The camera test', 'Do not do anything you would not do if there were cameras around.'],
      ['Learn to say no', 'If something is not going your way, you can walk away. Do not give away time you do not have.'],
    ],
  },
  {
    title: 'Belief, self-image, confidence', tag: 'The three layers — change them in this order', items: [
      ['1. Belief', 'How you look at things decides how they show up for you. Write down the limiting beliefs holding you back (about girls, money, success). You cannot fix what you have not named.'],
      ['2. Self-image', 'Who you think you are is a cage: you will not perform beyond it. Find the things that made you insecure in the past, then rewrite the picture. Imagine your best self in detail and step into him.'],
      ['3. Confidence', 'The action part. With the right belief and self-image, confidence is just taking the opportunity when it shows up.'],
      ['Fake it until you make it', 'It is delusion backed by facts: you train, you work, you are improving. Picture someone confident in the mirror and be him. Predict success — "I am extremely likeable."'],
      ['Visualise', 'See the success before it happens — the conversation going well, the best-looking girls attracted to you, the task done. While you work, picture the result or your key motivation.'],
      ['Obsess over the work', 'Pick tasks and get obsessed with solving them. Happiness comes from that, not from distraction.'],
      ['Go back to basics', 'When stuck: humble yourself and do the work again.'],
      ['Aura builders', 'Authenticity, open-mindedness, consistency, and being willing to fail.'],
      ['Aura killers', 'Not taking action, assuming the worst, negative thinking, bad relationships.'],
    ],
  },
  {
    title: 'Voice', tag: 'Slow, low, from the stomach', items: [
      ['Slow down', 'Speak slowly and slow your mind down with it. Take one second before answering a question — it reads as composed, not unsure.'],
      ['Breathe right', 'Breathe deep into the stomach, not the chest, and through the nose. When anxious, one long breath before you speak.'],
      ['Downtalk', 'End sentences on a lower pitch. Rising at the end sounds like asking permission; dropping sounds like a statement.'],
      ['10-20% deeper and slower', 'Practise it alone, then use it. Loud and clear, every word pronounced properly with energy and authority.'],
      ['Talk through a smile', 'Loud tonality with a smile in it is confident without being aggressive.'],
      ['Do not force it', 'A deeper voice comes from a relaxed, open throat and stomach breathing. Do not press on your throat or force your voice box down — that strains the voice.'],
    ],
  },
  {
    title: 'How I carry myself', tag: 'Body, eyes, presence', items: [
      ['Open up', 'Chest up towards the ceiling, shoulders back, stand tall. Be fine with being big and being seen — do not shrink.'],
      ['Walk slow', 'Head straight, slower walk. Walk like your dream self.'],
      ['Use your hands', 'Gesture when you talk. Hidden hands look nervous; open hands look sure.'],
      ['Less physically reactive', 'Do not flinch, jump or fidget at every noise or comment. Stillness reads as power.'],
      ['Relaxed and fluid', 'If you want to stretch, lean back, order a drink or move, do it. Freezing up looks more nervous than moving.'],
      ['Expression', 'Smile when you speak and when you walk past people. React expressively and exaggerate words a little. Energy is attractive.'],
      ['Eye contact', 'Strong and about 70%: eye, eye, mouth and back, then look to the side. When you break it, peel away slowly — like toffee. If it is too intense, look at the middle of the forehead.'],
      ['Stop scanning the room', 'Looking around for approval reads as desperate. Enjoy your own company and your own people — that is what makes others gravitate to you. Do not hand out attention cheaply.'],
    ],
  },
  {
    title: 'How I talk to people', tag: 'Make them feel seen and heard', items: [
      ['The simplest way to be liked', 'Make people feel seen and heard. Let them speak and express themselves, and they associate you with good feelings — even if they know nothing about you.'],
      ['Let them talk 75%', 'Ask, listen, follow up. "Tell me about yourself", what they do for fun, then go into specifics. No one-word questions, no interrupting, open mind.'],
      ['Remember the details', 'Use their name. Bring up what they told you last time: "you said you liked this — have you tried that?"'],
      ['Make them feel important', 'Let their ego come out: focus on their experiences and what they love. People love how you make them feel.'],
      ['Treat everyone like you already know them', 'Assume they like you and everyone is your friend. Ask name, where they are from, what they do, and build off it.'],
      ['Statements over questions', 'Make assumptions and playful guesses instead of interviewing. Be direct and say what you want.'],
      ['Openers that hook', '"Can I share something really interesting with you?" · "You won\'t believe what I found out the other day." · "Imagine what we could do if we did this together."'],
      ['Better questions', 'Would you want to be famous — for what? What are you most passionate about right now? What is your favourite memory from when you were young? What would your perfect day look like?'],
      ['Have stories', 'Try new things and know things, so you have stories to tell and can say "I have done that too." Share selective vulnerability — a real story, not a list of weaknesses.'],
      ['Tease, lightly', 'Light stuff in good fun, never sensitive topics like their body. Once you are close, treat them like an annoying little sister: a head shake, a sigh, a side-eye smile. Playfully challenge them.'],
      ['Misdirection and humour', 'Break the pattern. "How are you?" — "Blessed." Weird, ridiculous answers, high energy, make them laugh.'],
      ['When they test you', 'A jab like "why do you think you are so hot?" — do not defend or explain. Smile, laugh, agree and exaggerate, or change the subject.'],
      ['Push and pull', 'Show interest but not neediness. Warm, then a bit of tease or distance. Stop trying to appeal to everyone.'],
      ['Be kind, without wanting anything', 'Compliment people genuinely and expect nothing back. Universally kind — but not eager to please.'],
    ],
  },
  {
    title: 'Psychology and influence', tag: 'Levers that make people like and agree with you', items: [
      ['Say their name', 'People light up at their own name. Use it early and once or twice more, not every sentence.'],
      ['Mirror them', 'Subtly match their words, emotions, posture and pace. Smile when they smile. It feels familiar and safe.'],
      ['Silence', 'If someone says something you do not like, say nothing and hold a calm look. In a negotiation, wait — silence shows confidence.'],
      ['Do not overshare with new people', 'A bit of mystery keeps people curious. Leave things on a cliffhanger sometimes.'],
      ['Show a flaw or two', 'Someone competent who admits a small flaw is more likeable than someone flawless. One or two, not a confession.'],
      ['Ben Franklin effect', 'People like you more after doing you a small favour. Borrow a charger, ask for a recommendation.'],
      ['Plant the seed', 'Drop pieces of an idea and let them reach the conclusion themselves. People commit to ideas they think are theirs.'],
      ['Repair with credit', 'If you annoyed someone, give them genuine credit for something. It resets the mood.'],
      ['Two options', '"Thursday or Saturday?" beats yes or no. Put the one you want next to a less appealing one.'],
      ['Light touch', 'A brief touch on the arm while laughing builds warmth. Keep it natural and watch their reaction.'],
      ['Nod and "no"', 'Nod slightly as you ask — people mirror it. Questions that make no easy ("Would it be crazy if…?") feel safer to answer.'],
      ['The six principles', 'Reciprocity (give first), liking, authority, social proof (be seen with people), scarcity (do not be always available), consistency (small yeses lead to bigger ones).'],
      ['Framing and anchoring', 'Frame things by what they gain, not what they cost. Whatever you put attention on first becomes the anchor people judge everything else by.'],
      ['The honest bit', 'These amplify genuine interest; they do not replace it. Used as tricks on people you do not care about, they get spotted.'],
    ],
  },
  {
    title: 'Grooming and image', tag: 'Small things people notice', items: [
      ['Teeth and breath', 'Brush at a 45° angle to the gum line in small strokes, then brush your tongue and the inside of your cheeks — that is where bad breath lives. Oil pulling (swishing olive or coconut oil) is harmless but does not whiten teeth; whitening strips do.'],
      ['Cologne', 'Two or three sprays on the neck and chest, or onto your hand and then the temples and a light touch through the hair. Do not rub wrists together.'],
      ['Colours for brown eyes', 'Green, blue and warm yellow make brown eyes stand out.'],
      ['Profile picture', 'Real, high quality, clearly you, no AI. It is the first impression, so make it a good one.'],
      ['Neck holds', 'Chin tuck down to the chest, turn right, turn left, press the head back against your hand: 3 sets of 5-second holds each way. The full neck routine is in Looks.'],
      ['Salt spray on the face', 'Some use a salt-water spray (2 tbsp salt in warm water) once or twice a week. It can dry oily skin out; it can also irritate. Stop if skin goes tight or red — your proper routine is in Looks → Skin.'],
      ['The after-drip', 'After peeing, press gently just behind your balls and stroke forward, then shake. It clears the last drop that otherwise ends up in your boxers.'],
    ],
  },
  {
    title: 'Approaching', tag: 'It is a conversation, not a transaction', locked: true, items: [
      ['The structure', 'Attention, context, intent, introduction. "Hey, excuse me — I saw you walking past and thought you looked good. I\'m Roy."'],
      ['Close in', 'Speak to her up close, not from across the room. It makes everything after easier. Do not rush anything.'],
      ['It is just talking', 'Approaching someone is about speaking to them, not sleeping with them. Remove that pressure and you will do it more.'],
      ['Nervous?', 'Do 40 press-ups or a quick jog beforehand — your body puts the racing heart down to exercise and calms you. Or imagine everyone in their underwear.'],
      ['Do not overthink', 'Talk to her like anyone else, relaxed. Do not care what people think — most are thinking about themselves.'],
    ],
  },
  {
    title: 'Clubs', tag: 'Have fun first, the rest follows', locked: true, items: [
      ['Mindset', 'Believe you can attract anyone in there, kill the negative thoughts, and do not take yourself too seriously. Most guys are self-conscious and boring — be the fun one.'],
      ['Small group, light on drink', 'Go with a few mates. Drink little or nothing so your timing and confidence are your own.'],
      ['Dance', 'Find where people gather and dance. Cannot dance? Sway to the beat, move your hips, enjoy the music. Respect personal space.'],
      ['Initiative', 'Do not stand in the corner waiting. Eye contact and dancing near her build tension that leads to easy kisses.'],
      ['Numbers game', 'Not everyone will be into it — respect a no and move on. Some will say they have a boyfriend; let that be her call.'],
      ['Height and genes', 'Blaming looks does not help. Effort and practice matter more. Expect other guys to get jealous; do not be paranoid about it.'],
      ['Less social media', 'Cutting it down makes you better and more confident in real life.'],
    ],
  },
  {
    title: 'Girls', tag: 'No pedestal, no thirst', locked: true, items: [
      ['Her 10 is another man\'s 5', 'Acknowledge you want her, then remember she is just a girl. Treat her as normal — the pedestal is what makes you freeze.'],
      ['You are the chooser', 'Assume she likes you. You have standards and a life she would be lucky to be part of. Say what is on your mind.'],
      ['Do not be thirsty', 'Do not be overly friendly or give her all your attention — at parties, just vibe. Do not fall in love first.'],
      ['Compliments', 'Genuine, from confidence, not as a fan. Turn it up only when she is clearly into you, and do not overdo it.'],
      ['Signs she is into you', 'Feet pointed at you · laughs at your jokes · touches her hair · looks at your lips then away · leans towards you · flushed cheeks · finds excuses to touch you · lingers at goodbye · looks up at you after a hug · licks her lips. Four to seven of these and she is interested.'],
      ['The dangerous gentleman', 'Smell good, look sharp, be respectful with a bit of edge. Tease and touch together, hold her hand a little longer than expected, a bit of innuendo — and do not react to her tests.'],
      ['Out of the friend zone', 'Say it straight: let her know you are interested rather than hoping she guesses.'],
      ['Semen retention', 'There is no good evidence it raises testosterone or attraction long-term. If it helps your discipline or cutting porn, fine — just do not expect magic.'],
    ],
  },
  {
    title: 'The kiss', tag: 'Only when the vibe is already there', locked: true, items: [
      ['Be close first', 'Sit or stand next to her. You cannot kiss someone from across the table.'],
      ['Build the tension', 'Hold eye contact and think about what you want to do with her — it shows. Never make the move out of desperation.'],
      ['The triangle', 'One eye, the other eye, her lips, then a slight smile. Repeat slowly, then hold eye contact and go quiet.'],
      ['Watch her reaction', 'Stays or moves closer: good. Pulls back: stop and carry on talking — no hard feelings.'],
      ['Lead', 'Say her name, go in slow. "Come here", hand to her cheek or waist, lean in 90% and let her close the last 10%. That is her yes.'],
      ['Slow, then build', 'Lead with your lips, soft at first, then let the tempo rise. Hands on her waist, back or face to build tension — like eating ice cream, not rushing it.'],
    ],
  },
  {
    title: 'In bed', tag: 'Confident, attentive, and agreed', locked: true, items: [
      ['Talk first', 'Ask what she is into before anything rougher. Confident guys ask — it is part of being in control, not the opposite.'],
      ['Positions', 'Missionary with her hands held above her head. A pillow under her lower back changes the angle. Glute bridges in the gym help.'],
      ['A bit rougher', 'Spanking and pinning hands only once she has said yes to it, and stop the moment she says so. Never the neck or the mouth.'],
      ['Hands', 'Slow, a "come here" motion with your fingers, and let her reactions guide the pressure.'],
    ],
  },
  {
    title: 'Texting', tag: 'Texting is not dating', locked: true, items: [
      ['Getting the number is the win', 'Then turn it into a plan. She owes you nothing over text; do not stress if she is slow.'],
      ['Match her energy', 'Similar length and pace. Ask about her. Be busy on your grind so you are not replying instantly.'],
      ['Compliments sparingly', 'One genuine one, not back to back.'],
      ['Leave some space', 'After a good connection, do not be over-available. Space builds desire.'],
    ],
  },
  {
    title: 'Odds and ends', tag: 'Notes that do not fit anywhere else', items: [
      ['Padel', 'Aim for the ceiling. Look for the bone and pull the trigger.'],
    ],
  },
];

export const AFFIRMATIONS: string[] = [
  'I look good.',
  'I am charismatic and confident.',
  'I am approachable.',
  'I solve problems and I am very smart.',
  'I am extremely likeable.',
  'I can drive confidently.',
];

export const BEFORE_OUT: string[] = [
  '40 press-ups or a quick jog first — it burns off the nerves.',
  'Beat your chest and say "I love myself" out loud. Feel stupid, do it anyway.',
  'Picture yourself as the guy who already has everything he wants — satisfied, not hungry.',
  'Walk out as your dream self: slow walk, head up, a smile for people you pass.',
  'In a year nobody remembers tonight. The win is the approach.',
  'Goal for the night: have the best time in the room. Everything else is a bonus.',
];

// Short versions for the daily rotation.
export const DAILY: string[] = [
  'Act like the man you want to be — today, not when you feel ready.',
  'The only validation you need is your own.',
  'No complaining, no blaming. Take responsibility.',
  'What can they do to make you like them?',
  'Speak slow. Take one second before you answer.',
  'Speak loud and clear, and drop the tone at the end of sentences.',
  'Breathe from your stomach.',
  'Walk slower, head straight, chest up.',
  'Use your hands when you talk.',
  'Stop looking around the room. Enjoy your own company.',
  'Smile when you speak and when you walk past people.',
  'Make people feel seen and heard.',
  'Let them talk 75% of the time.',
  'Use people\'s names.',
  'Remember one detail about someone and bring it up later.',
  'Statements over questions.',
  'Tease lightly — never about sensitive stuff.',
  'Do not defend yourself. Smile and shrug it off.',
  'Do not hand out free reactions. Stay calm.',
  'Assume they already like you.',
  'Treat everyone like you already know them.',
  'Rejection is not deep and never personal. Move on.',
  'Everyone forgets the moment in a year.',
  'No pedestal. She is just a girl.',
  'Do not chase attention. Do not hand it out cheaply either.',
  'Drop the energy drainers. Put everything into what you want.',
  'Keep your frame — chill, not the class clown.',
  'Confident, not cocky. Build people up.',
  'Eye contact: break it slowly, like toffee.',
  'Train hard today.',
  'Make someone laugh today.',
  'Compliment someone and want nothing back.',
  'Ask someone a small favour today.',
  'Do not overshare with someone new.',
  'Be direct. Say what you want.',
  'You vs you. No comparing.',
  'Visualise it going well before you do it.',
  'Let go and have fun. It is in God\'s hands.',
];
