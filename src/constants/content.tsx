export const NAV_ITEMS = [
  { label: 'ABOUT', target: 'about' },
  { label: 'WORK', target: 'work' },
  { label: 'CONTACT', target: 'contact' }
] as const;

export const HERO = {
  title: 'Joaquin Godoy',
  subtitle: 'I turn coffee and messy ideas into real working products',
  traits: ['User-Focused', 'Practical', 'Analytical', 'Quality-Oriented'],
  status: 'Available'
} as const;

export const ABOUT_CHAPTERS = [
  {
    number: '01',
    title: 'PRESS START',
    paragraphs: [
      'Everything started when I was 15, hacking together my first game server in Java. No tutorials, no roadmap, just curiosity.',
      'I was obsessed with understanding how computers worked and how to bend them to my will. Turns out, breaking stuff is a pretty good way to learn.'
    ]
  },
  {
    number: '02',
    title: 'FROM BUENOS AIRES TO THE WORLD',
    paragraphs: [
      'I studied Computer Science in Buenos Aires, but my real classroom was the internet and a bunch of late nights coding.',
      'My curiosity took me to Spain, where I landed my first real job as a Full Stack Junior Developer at Vodafone. New country, new (massive) codebase, same chaos... just bigger.'
    ]
  },
  {
    number: '03',
    title: 'BUILDING REAL THINGS',
    paragraphs: [
      'About three years later, life brought me back to Argentina, where I moved in with my girlfriend. I joined a startup building AI-powered tools for content generation. Things moved fast, and mistakes moved way faster.',
      'That’s where I learned what it really means to ship products people actually use.'
    ]
  },
  {
    number: '04',
    title: 'FROM ZERO TO... SOMETHING',
    paragraphs: [
      <>
        Today I work as a Software Engineer at{' '}
        <a
          href="https://marketfully.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-primary)', textUnderlineOffset: '3px' }}>
          MarketFully
        </a>
        .
      </>,
      'I like to live mostly on the backend side of things.',
      'I love building products from zero and turning an empty repo into something real.',
      'Programming with music blasting in my headphones is one of my favorite ways to connect two of the worlds I love and fall straight into the zone.'
    ]
  }
];
