export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "mastering-personal-leadership",
    title: "Mastering Personal Leadership in a Digital Age",
    excerpt:
      "Explore how clarity and discipline define the modern leader in an increasingly noisy world.",
    category: "Leadership",
    date: "Jan 24, 2026",
    readTime: "6 min read",
    image: "/images/audience-executive.png",
    author: {
      name: "Mr. Kevin Dada",
      role: "Principal Coach",
      avatar: "/images/visionary.jpeg",
    },
    content: `
      <h2>The Core of Modern Leadership</h2>
      <p>Leadership in the 21st century isn't just about managing teams; it's about managing yourself first. In a world saturated with digital noise, the ability to maintain clarity of vision is the ultimate competitive advantage.</p>
      
      <img src="/images/blog-leadership.png" alt="Modern Leadership" class="rounded-2xl my-8 shadow-2xl border border-black/5 w-full object-cover aspect-video" />

      <h3>1. Clarity Over Complexity</h3>
      <p>Most leaders fall into the trap of over-complicating their strategies. True leadership is about stripping away the non-essential and focusing on the three main pillars that drive impact.</p>
      
      <blockquote>"Leadership is not defined by charisma, but by clarity and the courage to make sound decisions consistently."</blockquote>
      
      <h3>2. The Discipline of Execution</h3>
      <p>Visions are plenty, but execution is rare. At Made360Degrees, we emphasize the 'Clarity, Capability, Discipline' framework to ensure that leadership principles are applied, not just inspired.</p>
      
      <p>Whether you're leading a small team or an entire organization, your success depends on your ability to foster collaboration while maintaining a laser focus on growth.</p>
    `,
  },
  {
    slug: "strategic-collaboration-impact",
    title: "Strategic Collaboration for Global Impact",
    excerpt:
      "Why human-centric leadership is the key to sustainable organizational growth and success.",
    category: "Strategy",
    date: "Jan 20, 2026",
    readTime: "5 min read",
    image: "/images/leadership-collaboration.png",
    author: {
      name: "Mr. Kevin Dada",
      role: "Principal Coach",
      avatar: "/images/visionary.jpeg",
    },
    content: `
      <h2>Collaboration Beyond the Boardroom</h2>
      <p>Effective collaboration is the heartbeat of any thriving organization. However, many leaders treat it as a mechanical process rather than a human interaction.</p>
      
      <img src="/images/blog-collaboration.png" alt="Strategic Collaboration" class="rounded-2xl my-8 shadow-2xl border border-black/5 w-full object-cover aspect-video" />

      <h3>Building High-Trust Teams</h3>
      <p>Trust is the currency of high-performing teams. When leaders prioritize emotional intelligence over strict hierarchy, they unlock a level of creativity and commitment that data alone cannot achieve.</p>
      
      <p>Our training programs focus on developing the 'Human' aspect of leadership, ensuring that your organization is structured for success without losing its soul.</p>
    `,
  },
  {
    slug: "igniting-corporate-aspirations",
    title: "Igniting Your Aspirations for Corporate Success",
    excerpt:
      "How to navigate the corporate ladder with intentionality and emotional intelligence.",
    category: "Growth",
    date: "Jan 15, 2026",
    readTime: "8 min read",
    image: "/images/audience-professional.png",
    author: {
      name: "Mr. Kevin Dada",
      role: "Principal Coach",
      avatar: "/images/visionary.jpeg",
    },
    content: `
      <h2>The Journey to the Top</h2>
      <p>Navigating a corporate career requires more than just technical skill. It requires a strategic mindset and the emotional intelligence to build lasting alliances.</p>
      
      <img src="/images/blog-growth.png" alt="Corporate Growth" class="rounded-2xl my-8 shadow-2xl border border-black/5 w-full object-cover aspect-video" />

      <h3>Setting Realistic Horizons</h3>
      <p>We believe in 'application over inspiration'. Instead of waiting for a promotion, create the value that makes your promotion inevitable. This involves clear goal-setting and a disciplined approach to personal development.</p>
      
      <p>Join us at Made360Degrees as we guide you through the journey of self-discovery and corporate mastery.</p>
    `,
  },
];

export const CATEGORIES = ["All", "Leadership", "Strategy", "Growth", "Impact"];
