import {
  DepartmentConfig,
  IDepartment,
  IOpening,
  TBaseDept,
} from "../../../types";
import {
  DataAnalyticsOpeningIcon,
  FinanceOpeningIcon,
  LeadershipOpeningIcon,
  MarketingOpeningIcon,
  OperationsOpeningIcon,
  ProductOpeningIcon,
  SalesOpeningIcon,
  SpecializedOpeningIcon,
  TechnologyOpeningIcon,
} from "../children/OpeningIcons";

export const DEPARTMENT_AND_TEAMS_DATA: IDepartment[] = [
  {
    title: "Executive / Leadership",
    value: "executive_or_leadership",
    employees: [
      {
        name: "Nageshwar Pawar",
        role: "Founder",
        gender: "Male",
        image: "/images/company/teams/male/Nageshwar-Pawar.webp",
        description: {
          title: "Vision Beyond Beauty",
          description:
            "Just like every business built websites and came online, very soon, each one will have immersive beauty experiences. What we’re building today will shape how the world explores, feels, and enjoys beauty tomorrow.",
        },
      },
      {
        name: "Manjusha Magar",
        role: "Co-Founder",
        gender: "Female",
        image: "/images/company/teams/female/Manjusha-Magar.webp",
      },
      {
        name: "Deepika Padukone",
        role: "CEO (Chief Executive Officer)",
        gender: "Female",
        image: "/images/company/teams/female/Deepika-Padukone.webp",
      },
      {
        name: "Akshay Kumar",
        role: "COO (Chief Operating Officer)",
        gender: "Male",
        image: "/images/company/teams/male/Akshay-Kumar.webp",
      },
      {
        name: "Kareena Kapoor",
        role: "CFO (Chief Financial Officer)",
        gender: "Female",
        image: "/images/company/teams/female/Kareena-Kapoor.webp",
      },
      {
        name: "Ranveer Singh",
        role: "CMO (Chief Marketing Officer)",
        gender: "Male",
        image: "/images/company/teams/male/Ranveer-Singh.webp",
      },
      {
        name: "Priyanka Chopra",
        role: "CTO (Chief Technology Officer)",
        gender: "Female",
        image: "/images/company/teams/female/Priyanka-Chopra.webp",
      },
      {
        name: "Hrithik Roshan",
        role: "CPO (Chief Product Officer)",
        gender: "Male",
        image: "/images/company/teams/male/Hrithik-Roshan.webp",
      },
    ],
  },
  {
    title: "Product & Merchandising",
    value: "product_and_merchandising",
    employees: [
      {
        name: "Alia Bhatt",
        role: "Head of Product",
        gender: "Female",
        image: "/images/company/teams/female/Alia-Bhatt.webp",
        description: {
          title: "Crafting Icons",
          description:
            "Just like the world shifted from basic products to thoughtful experiences, beauty will move toward personalized science-led creation. We are designing formulas and innovation that redefine what true premium care feels like.",
        },
      },
      {
        name: "Varun Dhawan",
        role: "Category Manager",
        gender: "Male",
        image: "/images/company/teams/male/Varun-Dhawan.webp",
      },
      {
        name: "Kriti Sanon",
        role: "Merchandiser",
        gender: "Female",
        image: "/images/company/teams/female/Kriti-Sanon.webp",
      },
      {
        name: "Vicky Kaushal",
        role: "Product Analyst",
        gender: "Male",
        image: "/images/company/teams/male/Vicky-Kaushal.webp",
      },
    ],
  },
  {
    title: "Technology / Engineering",
    value: "technology_or_engineering",
    employees: [
      {
        name: "Ranbir Kapoor",
        role: "Head of Engineering",
        gender: "Male",
        image: "/images/company/teams/male/Ranbir-Kapoor.webp",
        description: {
          title: "Engineering Tomorrow",
          description:
            "Just like every major innovation reshaped how we live, tech will re-invent how beauty interacts with people. We build intelligent systems that make beauty smarter, simpler, and deeply personal for everyone.",
        },
      },
      {
        name: "Anushka Sharma",
        role: "Engineering Manager",
        gender: "Female",
        image: "/images/company/teams/female/Anushka-Sharma.webp",
      },
      {
        name: "Tiger Shroff",
        role: "Frontend Developer",
        gender: "Male",
        image: "/images/company/teams/male/Tiger-Shroff.webp",
      },
      {
        name: "Sara Ali Khan",
        role: "Backend Developer",
        gender: "Female",
        image: "/images/company/teams/female/Sara-Ali-Khan.webp",
      },
      {
        name: "Ayushmann Khurrana",
        role: "Full-stack Developer",
        gender: "Male",
        image: "/images/company/teams/male/Ayushmann-Khurrana.webp",
      },
      {
        name: "Shah Rukh Khan",
        role: "Full-stack AI Developer",
        gender: "Male",
        image: "/images/company/teams/male/Shah-Rukh-Khan.webp",
      },
      {
        name: "Shraddha Kapoor",
        role: "Android/IOS Developer",
        gender: "Female",
        image: "/images/company/teams/female/Shraddha-Kapoor.webp",
      },
      {
        name: "Sidharth Malhotra",
        role: "DevOps Engineer",
        gender: "Male",
        image: "/images/company/teams/male/Sidharth-Malhotra.webp",
      },
      {
        name: "Taapsee Pannu",
        role: "QA Engineer",
        gender: "Female",
        image: "/images/company/teams/female/Taapsee-Pannu.webp",
      },
      {
        name: "Rajkummar Rao",
        role: "UI/UX Designer",
        gender: "Male",
        image: "/images/company/teams/male/Rajkummar-Rao.webp",
      },
    ],
  },
  {
    title: "Marketing & Growth",
    value: "marketing_and_growth",
    employees: [
      {
        name: "Katrina Kaif",
        role: "Head of Marketing",
        gender: "Female",
        image: "/images/company/teams/female/Katrina-Kaif.webp",
        description: {
          title: "Redefining Influence",
          description:
            "Just like storytelling evolved from print to screens and now to immersive experiences, beauty influence will transform too. We craft narratives that inspire confidence, culture, and meaningful connection.",
        },
      },
      {
        name: "Shahid Kapoor",
        role: "Digital Marketing Manager",
        gender: "Male",
        image: "/images/company/teams/male/Shahid-Kapoor.webp",
      },
      {
        name: "Kiara Advani",
        role: "Content Writer",
        gender: "Female",
        image: "/images/company/teams/female/Kiara-Advani.webp",
      },
      {
        name: "Nawazuddin Siddiqui",
        role: "SEO Specialist",
        gender: "Male",
        image: "/images/company/teams/male/Nawazuddin-Siddiqui.webp",
      },
      {
        name: "Parineeti Chopra",
        role: "Social Media Manager",
        gender: "Female",
        image: "/images/company/teams/female/Parineeti-Chopra.webp",
      },
      {
        name: "John Abraham",
        role: "Email Specialist",
        gender: "Male",
        image: "/images/company/teams/male/John-Abraham.webp",
      },
      {
        name: "Madhuri Dixit",
        role: "Influencer Manager",
        gender: "Female",
        image: "/images/company/teams/female/Madhuri-Dixit.webp",
      },
      {
        name: "Saif Ali Khan",
        role: "Graphic Designer",
        gender: "Male",
        image: "/images/company/teams/male/Saif-Ali-Khan.webp",
      },
    ],
  },
  {
    title: "Sales & Customer Engagement",
    value: "sales_and_customer_engagement",
    employees: [
      {
        name: "Ajay Devgn",
        role: "Head of Sales",
        gender: "Male",
        image: "/images/company/teams/male/Ajay-Devgn.webp",
        description: {
          title: "Relationships First",
          description:
            "Just like commerce evolved from shops to hyper-personal digital touchpoints, customer trust is evolving too. We are building a system where every interaction feels human, honest, and emotionally connected.",
        },
      },
      {
        name: "Jacqueline Fernandez",
        role: "BD Manager",
        gender: "Female",
        image: "/images/company/teams/female/Jacqueline-Fernandez.webp",
      },
      {
        name: "Farhan Akhtar",
        role: "Client Success Manager",
        gender: "Male",
        image: "/images/company/teams/male/Farhan-Akhtar.webp",
      },
      {
        name: "Disha Patani",
        role: "Sales Associate",
        gender: "Female",
        image: "/images/company/teams/female/Disha-Patani.webp",
      },
      {
        name: "Arjun Kapoor",
        role: "Customer Support",
        gender: "Male",
        image: "/images/company/teams/male/Arjun-Kapoor.webp",
      },
      {
        name: "Vidya Balan",
        role: "Chat Support",
        gender: "Female",
        image: "/images/company/teams/female/Vidya-Balan.webp",
      },
    ],
  },
  {
    title: "Operations & Logistics",
    value: "operations_and_logistics",
    employees: [
      {
        name: "Salman Khan",
        role: "Head of Operations",
        gender: "Male",
        image: "/images/company/teams/male/Salman-Khan.webp",
        description: {
          title: "Operational Mastery",
          description:
            "Just like global supply systems reinvented speed and quality, beauty logistics is entering a precision era. We ensure every product reaches with care, commitment, and seamless reliability.",
        },
      },
      {
        name: "Sonakshi Sinha",
        role: "Inventory Manager",
        gender: "Female",
        image: "/images/company/teams/female/Sonakshi-Sinha.webp",
      },
      {
        name: "Abhishek Bachchan",
        role: "Warehouse Manager",
        gender: "Male",
        image: "/images/company/teams/male/Abhishek-Bachchan.webp",
      },
      {
        name: "Sonam Kapoor",
        role: "Logistics Coordinator",
        gender: "Female",
        image: "/images/company/teams/female/Sonam-Kapoor.webp",
      },
      {
        name: "R. Madhavan",
        role: "Vendor Manager",
        gender: "Male",
        image: "/images/company/teams/male/R-Madhavan.webp",
      },
      {
        name: "Radhika Apte",
        role: "Packaging Staff",
        gender: "Female",
        image: "/images/company/teams/female/Radhika-Apte.webp",
      },
    ],
  },
  {
    title: "Finance & Admin",
    value: "finance_and_admin",
    employees: [
      {
        name: "Kartik Aaryan",
        role: "Finance Manager",
        gender: "Male",
        image: "/images/company/teams/male/Kartik-Aaryan.webp",
        description: {
          title: "Strategic Stability",
          description:
            "Just like strong foundations built iconic companies, future-beauty brands need disciplined boldness. We balance smart risk with sustainable growth to create a brand built to last decades.",
        },
      },
      {
        name: "Bhumika Pednekar",
        role: "Accountant",
        gender: "Female",
        image: "/images/company/teams/female/Bhumika-Pednekar.webp",
      },
      {
        name: "Dulquer Salmaan",
        role: "Payroll Specialist",
        gender: "Male",
        image: "/images/company/teams/male/Dulquer-Salmaan.webp",
      },
      {
        name: "Nora Fatehi",
        role: "HR Manager",
        gender: "Female",
        image: "/images/company/teams/female/Nora-Fatehi.webp",
      },
      {
        name: "Aamir Khan",
        role: "Office Administrator",
        gender: "Male",
        image: "/images/company/teams/male/Aamir-Khan.webp",
      },
    ],
  },
  {
    title: "Data & Analytics",
    value: "data_and_analytics",
    employees: [
      {
        name: "Amrita Rao",
        role: "Head of Data",
        gender: "Female",
        image: "/images/company/teams/female/Amrita-Rao.webp",
        description: {
          title: "Insights Into Action",
          description:
            "Just like data reshaped world-changing industries, beauty is stepping into an intelligent era. We turn numbers into intuition, enabling better products, deeper loyalty, and limitless innovation.",
        },
      },
      {
        name: "Raj Patel",
        role: "Data Analyst",
        gender: "Male",
        image: "/images/company/teams/male/Raj-Patel.webp",
      },
      {
        name: "Kajol Devgn",
        role: "BI Analyst",
        gender: "Female",
        image: "/images/company/teams/female/Kajol-Devgn.webp",
      },
      {
        name: "Kunal Kapoor",
        role: "Data Scientist",
        gender: "Male",
        image: "/images/company/teams/male/Kunal-Kapoor.webp",
      },
      {
        name: "Urvashi Rautela",
        role: "Marketing Analyst",
        gender: "Female",
        image: "/images/company/teams/female/Urvashi-Rautela.webp",
      },
    ],
  },
  {
    title: "Specialized Roles",
    value: "specialized_roles",
    employees: [
      {
        name: "Anil Kapoor",
        role: "Legal Counsel",
        gender: "Male",
        image: "/images/company/teams/male/Anil-Kapoor.webp",
        description: {
          title: "Ethics & Trust",
          description:
            "Just like the future demands transparency and fairness in all innovation, beauty needs legal integrity. We protect our mission with clarity, compliance, and responsibility at every step.",
        },
      },
      {
        name: "Vivek Oberoi",
        role: "Cybersecurity Engineer",
        gender: "Male",
        image: "/images/company/teams/male/Vivek-Oberoi.webp",
      },
      {
        name: "Janhvi Kapoor",
        role: "Photographer",
        gender: "Female",
        image: "/images/company/teams/female/Janhvi-Kapoor.webp",
      },
      {
        name: "Manoj Bajpayee",
        role: "Content Moderator",
        gender: "Male",
        image: "/images/company/teams/male/Manoj-Bajpayee.webp",
      },
    ],
  },
];

export const TEAMS_DEPARTMENTS: TBaseDept[] = DEPARTMENT_AND_TEAMS_DATA.map(
  ({ title, value }) => ({ title, value })
);

export const OPENINGS_DATA: IOpening[] = [
  {
    department: { title: "All", value: "all" },
    openings: [],
  },
  {
    department: {
      title: "Executive / Leadership",
      value: "executive_or_leadership",
    },
    openings: [
      // {
      //   role: "Founder / Co-Founder",
      //   experience: "10+ Years",
      //   description:
      //     "Lead and shape the vision of our beauty e-commerce brand, driving strategy, partnerships, and market expansion.",
      //   type: "Full-Time",
      //   location: "Bengaluru / Remote",
      //   salary: "Negotiable",
      //   tags: ["Leadership", "Strategy", "Vision"],
      //   technologies: [],
      // },
      {
        role: "CEO (Chief Executive Officer)",
        experience: "8+ Years",
        description:
          "Oversee all operations, lead growth initiatives, and ensure organizational excellence in a fast-paced cosmetics business.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "Negotiable",
        tags: ["Leadership", "Management"],
        technologies: [],
      },
      {
        role: "COO (Chief Operating Officer)",
        experience: "7+ Years",
        description:
          "Manage day-to-day operations, optimize processes, and ensure seamless logistics and fulfillment across departments.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "Negotiable",
        tags: ["Operations", "Process Management"],
        technologies: [],
      },
      {
        role: "CFO (Chief Financial Officer)",
        experience: "7+ Years",
        description:
          "Manage company finances, budgeting, financial planning, and investor relations to ensure sustainable growth.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "Negotiable",
        tags: ["Finance", "Strategy"],
        technologies: [],
      },
      {
        role: "CMO (Chief Marketing Officer)",
        experience: "7+ Years",
        description:
          "Drive brand strategy, marketing campaigns, and customer engagement for a global cosmetics audience.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "Negotiable",
        tags: ["Marketing", "Brand Strategy", "Growth"],
        technologies: [],
      },
      {
        role: "CTO (Chief Technology Officer)",
        experience: "8+ Years",
        description:
          "Lead technology vision, oversee engineering, product tech, and innovation for the digital beauty experience.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "Negotiable",
        tags: ["Technology", "Leadership"],
        technologies: ["Node.js", "React", "Cloud", "AI"],
      },
      {
        role: "CPO (Chief Product Officer)",
        experience: "7+ Years",
        description:
          "Lead product strategy, R&D, and merchandising innovation for a premium cosmetics line.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "Negotiable",
        tags: ["Product Management", "Innovation"],
        technologies: [],
      },
    ],
  },
  {
    department: {
      title: "Product & Merchandising",
      value: "product_and_merchandising",
    },
    openings: [
      {
        role: "Head of Product",
        experience: "5+ Years",
        description:
          "Design and lead product strategy, innovation, and merchandising for our cosmetic products.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹12L–₹18L",
        tags: ["Product Strategy", "Merchandising"],
        technologies: ["Excel", "Product Analytics"],
      },
      {
        role: "Category Manager",
        experience: "3+ Years",
        description:
          "Manage product categories, optimize listings, and drive category growth for cosmetics.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹8L–₹12L",
        tags: ["Category Management", "Analytics"],
        technologies: ["Excel", "ERP Tools"],
      },
      {
        role: "Merchandiser",
        experience: "2+ Years",
        description:
          "Plan, execute, and optimize product display strategies to maximize sales and customer experience.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹6L–₹10L",
        tags: ["Merchandising", "Retail", "Product Planning"],
        technologies: ["Excel", "PowerPoint"],
      },
      {
        role: "Product Analyst",
        experience: "2–4 Years",
        description:
          "Analyze sales, inventory, and trends to optimize product assortment and merchandising strategies.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹7L–₹11L",
        tags: ["Analytics", "Data Driven"],
        technologies: ["Excel", "SQL", "Tableau"],
      },
    ],
  },
  {
    department: {
      title: "Technology / Engineering",
      value: "technology_or_engineering",
    },
    openings: [
      {
        role: "Head of Engineering",
        experience: "5+ Years",
        description:
          "Lead the engineering team, define architecture, and ensure high-quality delivery of our beauty tech platform.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹18L–₹25L",
        tags: ["Engineering Leadership", "Architecture"],
        technologies: ["Node.js", "React", "AWS"],
      },
      {
        role: "Engineering Manager",
        experience: "4+ Years",
        description:
          "Manage engineering teams, drive projects, and ensure delivery excellence across backend and frontend.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹15L–₹20L",
        tags: ["Team Management", "Engineering"],
        technologies: ["Node.js", "React", "Agile"],
      },
      {
        role: "Frontend Developer",
        experience: "2–4 Years",
        description:
          "Develop beautiful and responsive user interfaces for our digital beauty platform.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹8L–₹14L",
        tags: ["Frontend", "React", "UI/UX"],
        technologies: ["React", "Next.js", "TypeScript", "Tailwind"],
      },
      {
        role: "Backend Developer",
        experience: "2–5 Years",
        description:
          "Build scalable APIs, manage database schemas, and integrate third-party services for our e-commerce platform.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹10L–₹16L",
        tags: ["Backend", "Node.js", "API"],
        technologies: ["Node.js", "Express", "MongoDB", "Cloudinary", "AWS"],
      },
      {
        role: "Full-stack Developer",
        experience: "2–5 Years",
        description:
          "Work across frontend and backend to deliver end-to-end features for our digital beauty experience.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹10L–₹18L",
        tags: ["Full-stack", "React", "Node.js"],
        technologies: ["React", "Next.js", "Node.js", "Express", "MongoDB"],
      },
      {
        role: "Full-stack AI Developer",
        experience: "3–6 Years",
        description:
          "Develop AI-driven features like virtual try-on, recommendations, and personalization systems.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹14L–₹22L",
        tags: ["AI", "Full-stack", "Machine Learning"],
        technologies: ["Python", "Node.js", "TensorFlow", "React"],
      },
      {
        role: "Android/iOS Developer",
        experience: "2–4 Years",
        description:
          "Build and maintain mobile applications for our beauty platform.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹8L–₹14L",
        tags: ["Mobile", "Android", "iOS"],
        technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
      },
      {
        role: "DevOps Engineer",
        experience: "3+ Years",
        description:
          "Ensure smooth deployment, CI/CD, and cloud infrastructure management for our platform.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹10L–₹16L",
        tags: ["DevOps", "Cloud", "CI/CD"],
        technologies: ["AWS", "Docker", "Kubernetes", "Terraform"],
      },
      {
        role: "QA Engineer",
        experience: "2–4 Years",
        description:
          "Write and execute test plans, perform QA for web and mobile apps ensuring high quality standards.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹6L–₹10L",
        tags: ["QA", "Testing", "Automation"],
        technologies: ["Selenium", "Cypress", "Jest", "Playwright"],
      },
      {
        role: "UI/UX Designer",
        experience: "2–4 Years",
        description:
          "Design intuitive, engaging interfaces and workflows for the beauty e-commerce platform.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹7L–₹12L",
        tags: ["UI/UX", "Design"],
        technologies: ["Figma", "Adobe XD", "Illustrator"],
      },
    ],
  },
  {
    department: {
      title: "Marketing & Growth",
      value: "marketing_and_growth",
    },
    openings: [
      {
        role: "Head of Marketing",
        experience: "5+ Years",
        description:
          "Lead marketing strategy, brand campaigns, and customer engagement to strengthen our beauty brand presence.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹15L–₹25L",
        tags: ["Marketing Strategy", "Brand Management", "Leadership"],
        technologies: [
          "Google Analytics",
          "CRM Tools",
          "Social Media Platforms",
        ],
      },
      {
        role: "Digital Marketing Manager",
        experience: "3–5 Years",
        description:
          "Plan and execute digital campaigns, SEO/SEM, and performance marketing initiatives.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹8L–₹12L",
        tags: ["Digital Marketing", "SEO", "SEM"],
        technologies: ["Google Ads", "Facebook Ads", "SEO Tools"],
      },
      {
        role: "Content Writer",
        experience: "2–4 Years",
        description:
          "Create compelling content for blogs, social media, and product descriptions to engage beauty enthusiasts.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹5L–₹8L",
        tags: ["Content Creation", "Copywriting", "SEO"],
        technologies: ["WordPress", "SEO Tools", "Google Docs"],
      },
      {
        role: "SEO Specialist",
        experience: "2–4 Years",
        description:
          "Optimize website content, track performance, and improve organic search visibility for our e-commerce platform.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹6L–₹10L",
        tags: ["SEO", "Analytics", "Content Optimization"],
        technologies: ["Google Analytics", "Ahrefs", "SEMRush"],
      },
      {
        role: "Social Media Manager",
        experience: "2–5 Years",
        description:
          "Manage social channels, engage audiences, and implement campaigns to grow brand presence online.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹6L–₹10L",
        tags: ["Social Media", "Campaign Management", "Community Engagement"],
        technologies: ["Instagram", "Facebook", "LinkedIn", "Canva"],
      },
      {
        role: "Email Specialist",
        experience: "2–4 Years",
        description:
          "Create, manage, and optimize email marketing campaigns to drive customer engagement and retention.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹5L–₹8L",
        tags: ["Email Marketing", "CRM", "Analytics"],
        technologies: ["Mailchimp", "HubSpot", "Salesforce"],
      },
      {
        role: "Influencer Manager",
        experience: "3+ Years",
        description:
          "Identify, onboard, and manage influencers to expand brand visibility and engagement across platforms.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹7L–₹12L",
        tags: ["Influencer Marketing", "Partnerships"],
        technologies: ["Instagram", "YouTube", "TikTok"],
      },
      {
        role: "Graphic Designer",
        experience: "2–4 Years",
        description:
          "Design creative visual content for campaigns, social media, and product promotions.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹5L–₹9L",
        tags: ["Graphic Design", "Branding", "Creativity"],
        technologies: ["Photoshop", "Illustrator", "Figma"],
      },
    ],
  },
  {
    department: {
      title: "Sales & Customer Engagement",
      value: "sales_and_customer_engagement",
    },
    openings: [
      {
        role: "Head of Sales",
        experience: "5+ Years",
        description:
          "Lead the sales team, drive revenue growth, and build strong client relationships in the beauty sector.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹15L–₹25L",
        tags: ["Sales Leadership", "Client Relationships"],
        technologies: ["CRM Tools", "Salesforce", "MS Excel"],
      },
      {
        role: "BD Manager",
        experience: "3–5 Years",
        description:
          "Identify business opportunities, negotiate deals, and grow partnerships for the brand.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹8L–₹12L",
        tags: ["Business Development", "Negotiation", "Networking"],
        technologies: ["CRM", "Excel", "LinkedIn Sales Navigator"],
      },
      {
        role: "Client Success Manager",
        experience: "2–4 Years",
        description:
          "Ensure client satisfaction, manage accounts, and deliver tailored solutions to partners.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹6L–₹10L",
        tags: ["Client Management", "Relationship Building"],
        technologies: ["CRM", "Slack", "Excel"],
      },
      {
        role: "Sales Associate",
        experience: "1–3 Years",
        description:
          "Assist customers, manage inquiries, and drive sales both online and offline.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹4L–₹7L",
        tags: ["Sales", "Customer Engagement"],
        technologies: ["POS Systems", "CRM"],
      },
      {
        role: "Customer Support",
        experience: "1–3 Years",
        description:
          "Provide excellent customer support, resolve issues, and enhance customer experience.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹4L–₹7L",
        tags: ["Customer Support", "Communication Skills"],
        technologies: ["Zendesk", "Freshdesk", "CRM"],
      },
      {
        role: "Chat Support",
        experience: "1–2 Years",
        description:
          "Assist customers via chat platforms, answer queries, and maintain high customer satisfaction.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹3.5L–₹6L",
        tags: ["Chat Support", "Customer Service"],
        technologies: ["Zendesk", "Intercom", "Freshdesk"],
      },
    ],
  },
  {
    department: {
      title: "Operations & Logistics",
      value: "operations_and_logistics",
    },
    openings: [
      {
        role: "Head of Operations",
        experience: "5+ Years",
        description:
          "Oversee operations, supply chain, and logistics to ensure smooth delivery of products to customers.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹15L–₹25L",
        tags: ["Operations Leadership", "Supply Chain"],
        technologies: ["ERP Systems", "Excel", "Logistics Tools"],
      },
      {
        role: "Inventory Manager",
        experience: "2–4 Years",
        description:
          "Manage inventory levels, stock control, and warehouse operations for optimal efficiency.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹6L–₹10L",
        tags: ["Inventory Management", "Stock Control"],
        technologies: ["ERP", "Excel"],
      },
      {
        role: "Warehouse Manager",
        experience: "3–5 Years",
        description:
          "Supervise warehouse operations, team management, and product dispatch for timely delivery.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹7L–₹12L",
        tags: ["Warehouse Management", "Logistics"],
        technologies: ["Warehouse Management Software", "ERP"],
      },
      {
        role: "Logistics Coordinator",
        experience: "2–4 Years",
        description:
          "Coordinate shipments, track deliveries, and ensure efficient logistics operations.",
        type: "Full-Time",
        location: "Remote / Bengaluru",
        salary: "₹5L–₹9L",
        tags: ["Logistics", "Coordination"],
        technologies: ["ERP", "Shipping Tools"],
      },
      {
        role: "Vendor Manager",
        experience: "3–5 Years",
        description:
          "Manage vendor relationships, negotiate contracts, and optimize procurement processes.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹7L–₹12L",
        tags: ["Vendor Management", "Negotiation"],
        technologies: ["ERP", "CRM"],
      },
      {
        role: "Packaging Staff",
        experience: "1–2 Years",
        description:
          "Handle packaging of products ensuring quality and timely dispatch.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹3L–₹5L",
        tags: ["Packaging", "Operations"],
        technologies: [],
      },
    ],
  },
  {
    department: {
      title: "Finance & Admin",
      value: "finance_and_admin",
    },
    openings: [
      {
        role: "Finance Manager",
        experience: "5+ Years",
        description:
          "Oversee financial planning, budgeting, and strategic financial decisions to ensure business growth.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹12L–₹20L",
        tags: ["Finance Strategy", "Budgeting", "Leadership"],
        technologies: ["Tally", "MS Excel", "ERP Software"],
      },
      {
        role: "Accountant",
        experience: "2–5 Years",
        description:
          "Manage accounts, reconcile financial records, and ensure compliance with accounting standards.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹5L–₹8L",
        tags: ["Accounting", "Bookkeeping", "Compliance"],
        technologies: ["Tally", "QuickBooks", "MS Excel"],
      },
      {
        role: "Payroll Specialist",
        experience: "2–4 Years",
        description:
          "Handle employee payroll, tax compliance, and benefits administration with accuracy.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹6L–₹9L",
        tags: ["Payroll Management", "Compliance"],
        technologies: ["Payroll Software", "MS Excel"],
      },
      {
        role: "HR Manager",
        experience: "3–6 Years",
        description:
          "Manage HR operations, recruitment, employee relations, and ensure organizational compliance.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹8L–₹14L",
        tags: ["Human Resources", "Recruitment", "Employee Engagement"],
        technologies: ["HRMS", "Payroll Software", "MS Excel"],
      },
      {
        role: "Office Administrator",
        experience: "2–4 Years",
        description:
          "Maintain office operations, manage schedules, and provide administrative support.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹4L–₹7L",
        tags: ["Office Management", "Administrative Support"],
        technologies: ["MS Office", "ERP"],
      },
    ],
  },
  {
    department: {
      title: "Data & Analytics",
      value: "data_and_analytics",
    },
    openings: [
      {
        role: "Head of Data",
        experience: "5+ Years",
        description:
          "Lead data strategy, analytics, and insights to drive informed business decisions.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹15L–₹25L",
        tags: ["Data Strategy", "Leadership", "Analytics"],
        technologies: ["Python", "SQL", "Power BI", "Tableau"],
      },
      {
        role: "Data Analyst",
        experience: "2–4 Years",
        description:
          "Analyze data, generate reports, and provide insights to support business growth.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹6L–₹10L",
        tags: ["Data Analysis", "Reporting", "Visualization"],
        technologies: ["Excel", "SQL", "Tableau", "Power BI"],
      },
      {
        role: "BI Analyst",
        experience: "2–4 Years",
        description:
          "Develop business intelligence reports and dashboards for data-driven decision-making.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹6L–₹10L",
        tags: ["Business Intelligence", "Analytics", "Visualization"],
        technologies: ["Power BI", "Tableau", "SQL"],
      },
      {
        role: "Data Scientist",
        experience: "3–5 Years",
        description:
          "Build predictive models, perform advanced analytics, and derive actionable insights.",
        type: "Full-Time",
        location: "Bengaluru / Remote",
        salary: "₹12L–₹20L",
        tags: ["Machine Learning", "Data Modeling", "Analytics"],
        technologies: ["Python", "R", "TensorFlow", "SQL"],
      },
      {
        role: "Marketing Analyst",
        experience: "2–4 Years",
        description:
          "Analyze marketing campaigns, customer behavior, and sales data to optimize performance.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹5L–₹9L",
        tags: ["Marketing Analytics", "Data Analysis", "Reporting"],
        technologies: ["Google Analytics", "Excel", "Tableau"],
      },
    ],
  },
  {
    department: {
      title: "Specialized Roles",
      value: "specialized_roles",
    },
    openings: [
      {
        role: "Legal Counsel",
        experience: "5+ Years",
        description:
          "Provide legal guidance, ensure compliance, and protect company interests in all business matters.",
        type: "Full-Time",
        location: "Bengaluru",
        salary: "₹12L–₹20L",
        tags: ["Legal", "Compliance", "Corporate Law"],
        technologies: ["MS Office", "Legal Research Tools"],
      },
      {
        role: "Cybersecurity Engineer",
        experience: "3–5 Years",
        description:
          "Protect company systems and data by implementing security measures and monitoring for threats.",
        type: "Full-Time",
        location: "Remote / Bengaluru",
        salary: "₹10L–₹18L",
        tags: ["Cybersecurity", "Network Security", "Risk Management"],
        technologies: ["Firewalls", "SIEM Tools", "Python"],
      },
      {
        role: "Photographer",
        experience: "2–5 Years",
        description:
          "Capture high-quality product and lifestyle images for marketing and e-commerce purposes.",
        type: "Full-Time / Contract",
        location: "Bengaluru / On-site",
        salary: "₹4L–₹8L",
        tags: ["Photography", "Product Photography", "Editing"],
        technologies: ["Camera Equipment", "Photoshop", "Lightroom"],
      },
      {
        role: "Content Moderator",
        experience: "1–3 Years",
        description:
          "Review and moderate user-generated content to ensure compliance with company guidelines.",
        type: "Full-Time",
        location: "Remote",
        salary: "₹3.5L–₹6L",
        tags: ["Content Moderation", "Quality Control"],
        technologies: ["CMS Tools", "Moderation Software"],
      },
    ],
  },
];

const all_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-all-bg",
  headingClass: "opening-dept-all-heading-bg",
  color: "#2e90fa",
};

const executive_or_leadership_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-executive_or_leadership-bg",
  headingClass: "opening-dept-executive_or_leadership-heading-bg",
  color: "#f79009",
  icon: LeadershipOpeningIcon,
};

const product_and_merchandising_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-product_and_merchandising-bg",
  headingClass: "opening-dept-product_and_merchandising-heading-bg",
  color: "#f7d158",
  icon: ProductOpeningIcon,
};

const technology_or_engineering_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-technology_or_engineering-bg",
  headingClass: "opening-dept-technology_or_engineering-heading-bg",
  color: "#ee46bc",
  icon: TechnologyOpeningIcon,
};

const marketing_and_growth_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-marketing_and_growth-bg",
  headingClass: "opening-dept-marketing_and_growth-heading-bg",
  color: "#9747ff",
  icon: MarketingOpeningIcon,
};

const sales_and_customer_engagement_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-sales_and_customer_engagement-bg",
  headingClass: "opening-dept-sales_and_customer_engagement-heading-bg",
  color: "#12b76a",
  icon: SalesOpeningIcon,
};

const operations_and_logistics_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-operations_and_logistics-bg",
  headingClass: "opening-dept-operations_and_logistics-heading-bg",
  color: "#00e5d1",
  icon: OperationsOpeningIcon,
};

const finance_and_admin_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-finance_and_admin-bg",
  headingClass: "opening-dept-finance_and_admin-heading-bg",
  color: "#fe026c",
  icon: FinanceOpeningIcon,
};

const data_and_analytics_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-data_and_analytics-bg",
  headingClass: "opening-dept-data_and_analytics-heading-bg",
  color: "#b519df",
  icon: DataAnalyticsOpeningIcon,
};

const specialized_roles_config: DepartmentConfig = {
  bgClass: "hover:opening-dept-specialized_roles-bg",
  headingClass: "opening-dept-specialized_roles-heading-bg",
  color: "#2e90fa",
  icon: SpecializedOpeningIcon,
};

export const departmentConfigMap: Record<TBaseDept["value"], DepartmentConfig> =
  {
    all: all_config,
    executive_or_leadership: executive_or_leadership_config,
    product_and_merchandising: product_and_merchandising_config,
    technology_or_engineering: technology_or_engineering_config,
    marketing_and_growth: marketing_and_growth_config,
    sales_and_customer_engagement: sales_and_customer_engagement_config,
    operations_and_logistics: operations_and_logistics_config,
    finance_and_admin: finance_and_admin_config,
    data_and_analytics: data_and_analytics_config,
    specialized_roles: specialized_roles_config,
  };
