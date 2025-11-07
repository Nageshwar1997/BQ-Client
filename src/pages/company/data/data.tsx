import { IDepartment, IOpening, TBaseDept } from "../../../types";
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
    department: { title: "All", value: "all", color: "#2e90fa" },
    openings: [],
  },
  {
    department: {
      title: "Executive / Leadership",
      value: "executive_or_leadership",
      color: "#f79009",
      icon: LeadershipOpeningIcon,
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
      //   {
      //     role: "CEO (Chief Executive Officer)",
      //     experience: "8+ Years",
      //     description:
      //       "Oversee all operations, lead growth initiatives, and ensure organizational excellence in a fast-paced cosmetics business.",
      //     type: "Full-Time",
      //     location: "Bengaluru",
      //     salary: "Negotiable",
      //     tags: ["Leadership", "Management"],
      //     technologies: [],
      //     summary:
      //       "Lead the company vision and strategy, drive market growth, and ensure operational excellence in all departments.",
      //     responsibilities: [
      //       "Define and execute company strategy.",
      //       "Manage cross-department operations.",
      //       "Drive business growth and partnerships.",
      //       "Ensure organizational health and culture.",
      //     ],
      //     requirements: [
      //       "8+ years experience in executive roles.",
      //       "Proven leadership and management skills.",
      //       "Strong strategic thinking and problem-solving.",
      //       "Excellent communication and interpersonal skills.",
      //     ],
      //     qualifications: [
      //       "Experience in e-commerce or beauty industry.",
      //       "MBA or relevant executive education.",
      //     ],
      //     benefits: [
      //       "Competitive executive compensation.",
      //       "Performance-based incentives.",
      //       "Health insurance and wellness benefits.",
      //       "Opportunities for global exposure and strategic impact.",
      //     ],
      //   },
      //   {
      //     role: "COO (Chief Operating Officer)",
      //     experience: "7+ Years",
      //     description:
      //       "Manage day-to-day operations, optimize processes, and ensure seamless logistics and fulfillment across departments.",
      //     type: "Full-Time",
      //     location: "Bengaluru",
      //     salary: "Negotiable",
      //     tags: ["Operations", "Process Management"],
      //     technologies: [],
      //     summary:
      //       "Responsible for smooth operations, process optimization, and coordination across all business units.",
      //     responsibilities: [
      //       "Oversee daily operations of all departments.",
      //       "Implement operational strategies and processes.",
      //       "Ensure high efficiency and productivity.",
      //       "Support CEO in executing company strategy.",
      //     ],
      //     requirements: [
      //       "7+ years experience in operational leadership.",
      //       "Strong problem-solving and decision-making skills.",
      //       "Excellent organizational and planning abilities.",
      //     ],
      //     qualifications: ["Experience in logistics, e-commerce, or retail."],
      //     benefits: [
      //       "Competitive salary, incentives, health insurance, professional growth.",
      //     ],
      //   },
      //   {
      //     role: "CFO (Chief Financial Officer)",
      //     experience: "7+ Years",
      //     description:
      //       "Manage company finances, budgeting, financial planning, and investor relations to ensure sustainable growth.",
      //     type: "Full-Time",
      //     location: "Bengaluru",
      //     salary: "Negotiable",
      //     tags: ["Finance", "Strategy"],
      //     technologies: [],
      //     summary:
      //       "Lead financial planning, strategy, budgeting, and reporting to ensure long-term business sustainability.",
      //     responsibilities: [
      //       "Develop and manage financial strategy.",
      //       "Prepare budgets and forecasts.",
      //       "Monitor cash flow and financial performance.",
      //       "Ensure compliance with financial regulations.",
      //     ],
      //     requirements: [
      //       "7+ years experience in finance leadership roles.",
      //       "Expertise in budgeting, forecasting, and financial analysis.",
      //       "Strong analytical and strategic skills.",
      //     ],
      //     qualifications: ["CFA, CPA, or MBA in Finance."],
      //     benefits: [
      //       "Competitive executive compensation, incentives, health benefits, growth opportunities.",
      //     ],
      //   },
      //   {
      //     role: "CMO (Chief Marketing Officer)",
      //     experience: "7+ Years",
      //     description:
      //       "Drive brand strategy, marketing campaigns, and customer engagement for a global cosmetics audience.",
      //     type: "Full-Time",
      //     location: "Bengaluru / Remote",
      //     salary: "Negotiable",
      //     tags: ["Marketing", "Brand Strategy", "Growth"],
      //     technologies: [],
      //     summary:
      //       "Lead marketing strategy, brand campaigns, and customer engagement across all channels.",
      //     responsibilities: [
      //       "Define brand vision and marketing strategy.",
      //       "Oversee marketing campaigns and performance.",
      //       "Manage marketing teams and budgets.",
      //       "Drive customer acquisition and engagement.",
      //     ],
      //     requirements: [
      //       "7+ years in senior marketing roles.",
      //       "Proven success in branding and digital marketing.",
      //       "Strong leadership and communication skills.",
      //     ],
      //     qualifications: [
      //       "Experience in beauty, fashion, or e-commerce sectors.",
      //     ],
      //     benefits: [
      //       "Competitive salary, incentives, health insurance, growth opportunities.",
      //     ],
      //   },
      //   {
      //     role: "CTO (Chief Technology Officer)",
      //     experience: "8+ Years",
      //     description:
      //       "Lead technology vision, oversee engineering, product tech, and innovation for the digital beauty experience.",
      //     type: "Full-Time",
      //     location: "Bengaluru",
      //     salary: "Negotiable",
      //     tags: ["Technology", "Leadership"],
      //     technologies: ["Node.js", "React", "Cloud", "AI"],
      //     summary:
      //       "Define technology strategy, oversee development teams, and ensure innovative tech solutions for the business.",
      //     responsibilities: [
      //       "Lead engineering and product development teams.",
      //       "Define tech roadmap and architecture.",
      //       "Ensure scalability, security, and innovation in tech solutions.",
      //       "Collaborate with leadership to align tech with business goals.",
      //     ],
      //     requirements: [
      //       "8+ years in technology leadership.",
      //       "Strong knowledge of modern web technologies, cloud, and AI.",
      //       "Experience managing development teams.",
      //     ],
      //     qualifications: [
      //       "Experience in e-commerce or SaaS.",
      //       "Familiarity with serverless architectures.",
      //     ],
      //     benefits: [
      //       "Executive compensation, growth opportunities, health benefits, exposure to emerging tech.",
      //     ],
      //   },
      //   {
      //     role: "CPO (Chief Product Officer)",
      //     experience: "7+ Years",
      //     description:
      //       "Lead product strategy, R&D, and merchandising innovation for a premium cosmetics line.",
      //     type: "Full-Time",
      //     location: "Bengaluru",
      //     salary: "Negotiable",
      //     tags: ["Product Management", "Innovation"],
      //     technologies: [],
      //     summary:
      //       "Responsible for product vision, R&D, and delivering innovative products for the brand.",
      //     responsibilities: [
      //       "Define product roadmap and strategy.",
      //       "Manage product teams and development cycles.",
      //       "Ensure product-market fit and innovation.",
      //       "Collaborate with marketing and sales for product launches.",
      //     ],
      //     requirements: [
      //       "7+ years in product leadership roles.",
      //       "Strong understanding of consumer products and market trends.",
      //       "Excellent leadership and analytical skills.",
      //     ],
      //     qualifications: ["Experience in beauty, fashion, or consumer goods."],
      //     benefits: [
      //       "Competitive salary, performance incentives, health insurance, career growth.",
      //     ],
      //   },
    ],
  },
  {
    department: {
      title: "Product & Merchandising",
      value: "product_and_merchandising",
      color: "#f7d158",
      icon: ProductOpeningIcon,
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
        summary:
          "Lead product vision, strategy, and execution for all cosmetic product lines.",
        responsibilities: [
          "Define product roadmap and features.",
          "Lead cross-functional teams to deliver product innovation.",
          "Analyze market trends and customer needs.",
        ],
        requirements: [
          "5+ years in product management.",
          "Strong analytical and leadership skills.",
          "Experience in cosmetics or retail preferred.",
        ],
        qualifications: ["MBA or relevant product certifications."],
        benefits: [
          "Competitive salary, growth opportunities, health benefits.",
        ],
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
        summary:
          "Oversee category performance, optimize product assortment, and drive sales growth.",
        responsibilities: [
          "Analyze sales and trends for categories.",
          "Manage supplier and product relationships.",
          "Optimize product listings for sales.",
        ],
        requirements: [
          "3+ years experience in category management.",
          "Analytical mindset and reporting skills.",
        ],
        qualifications: ["Experience in retail or e-commerce."],
        benefits: ["Salary, incentives, health insurance."],
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
        summary:
          "Responsible for product display, promotions, and visual merchandising across all platforms.",
        responsibilities: [
          "Plan in-store and online merchandising strategies.",
          "Coordinate with suppliers and teams for product launches.",
          "Monitor sales performance and optimize displays.",
        ],
        requirements: [
          "2+ years in merchandising.",
          "Attention to detail and creativity.",
        ],
        qualifications: ["Experience in cosmetics or retail."],
        benefits: ["Salary, incentives, professional growth."],
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
        summary:
          "Analyze product and sales data to inform decisions and improve product performance.",
        responsibilities: [
          "Collect and analyze sales and inventory data.",
          "Provide actionable insights for product and merchandising decisions.",
          "Monitor trends and competitor analysis.",
        ],
        requirements: [
          "2+ years experience in analytics.",
          "Strong Excel and SQL skills.",
        ],
        qualifications: ["Experience with Tableau or BI tools."],
        benefits: ["Salary, incentives, growth opportunities."],
      },
    ],
  },
  {
    department: {
      title: "Technology / Engineering",
      value: "technology_or_engineering",
      color: "#ee46bc",
      icon: TechnologyOpeningIcon,
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
        summary:
          "Lead and inspire the engineering team, define technical strategy, and ensure the delivery of scalable, reliable, and high-quality products.",
        responsibilities: [
          "Define and implement technical strategy aligned with business goals.",
          "Lead and mentor engineering teams across frontend, backend, and DevOps.",
          "Ensure high-quality software delivery and robust architecture.",
          "Collaborate with product, design, and business teams to prioritize features.",
          "Drive adoption of best practices in coding, testing, and CI/CD.",
        ],
        requirements: [
          "5+ years in engineering leadership roles.",
          "Strong knowledge of modern web technologies (Node.js, React, Next.js).",
          "Experience with cloud platforms like AWS and serverless architectures.",
          "Proven track record of managing and scaling engineering teams.",
          "Strong problem-solving, communication, and organizational skills.",
        ],
        qualifications: [
          "Experience in e-commerce or beauty tech platforms.",
          "Familiarity with microservices, containerization (Docker/Kubernetes), and CI/CD pipelines.",
        ],
        benefits: [
          "Competitive salary and performance bonuses.",
          "Health insurance and wellness programs.",
          "Flexible work environment and remote options.",
          "Opportunities for professional growth and leadership.",
        ],
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
        summary:
          "Oversee engineering projects, coordinate cross-functional teams, and ensure timely, high-quality delivery of features and products.",
        responsibilities: [
          "Manage multiple engineering teams and projects.",
          "Coordinate with product and design teams to deliver features on time.",
          "Mentor and guide engineers to improve skills and performance.",
          "Establish and enforce coding standards and best practices.",
          "Ensure system reliability, scalability, and performance.",
        ],
        requirements: [
          "4+ years in software engineering or engineering management.",
          "Proficiency in fullstack development (Node.js, React, Next.js).",
          "Experience with Agile methodologies.",
          "Strong leadership, mentoring, and organizational skills.",
        ],
        qualifications: [
          "Experience in e-commerce or consumer tech platforms.",
          "Familiarity with cloud infrastructure (AWS/GCP).",
        ],
        benefits: [
          "Competitive salary and performance bonuses.",
          "Health insurance and flexible work options.",
          "Career growth opportunities and team-building events.",
        ],
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
        summary:
          "Build responsive, accessible, and visually appealing frontend interfaces that deliver a seamless user experience.",
        responsibilities: [
          "Develop new user-facing features using React and Next.js.",
          "Ensure the technical feasibility of UI/UX designs.",
          "Optimize applications for maximum speed and scalability.",
          "Collaborate with backend developers to integrate APIs.",
          "Maintain code quality through testing, code reviews, and documentation.",
        ],
        requirements: [
          "2+ years experience in frontend development with React.",
          "Proficiency in HTML, CSS, JavaScript, and TypeScript.",
          "Experience with TailwindCSS or similar styling frameworks.",
          "Knowledge of frontend build tools and performance optimization.",
          "Good understanding of responsive and accessible design principles.",
        ],
        qualifications: [
          "Experience in e-commerce or beauty/retail platforms.",
          "Familiarity with state management libraries (Redux, Zustand).",
        ],
        benefits: [
          "Competitive salary and performance incentives.",
          "Fully remote work option.",
          "Learning and professional development budget.",
          "Health insurance and wellness benefits.",
        ],
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
        summary:
          "Design, implement, and maintain robust backend systems and APIs that power our digital beauty e-commerce platform.",
        responsibilities: [
          "Develop and maintain RESTful APIs using Node.js and Express.",
          "Design and manage MongoDB schemas and data models.",
          "Integrate third-party services like Cloudinary, payment gateways, and analytics.",
          "Ensure backend performance, security, and scalability.",
          "Collaborate with frontend developers for seamless integration.",
        ],
        requirements: [
          "2+ years of backend development experience with Node.js and Express.",
          "Proficiency in MongoDB or other NoSQL databases.",
          "Experience with cloud platforms (AWS preferred).",
          "Familiarity with authentication, authorization, and security best practices.",
          "Good problem-solving skills and ability to work in a collaborative environment.",
        ],
        qualifications: [
          "Experience with serverless architectures and microservices.",
          "Familiarity with CI/CD pipelines and DevOps practices.",
        ],
        benefits: [
          "Competitive salary and performance incentives.",
          "Health insurance and flexible work environment.",
          "Opportunity to work on high-impact projects in e-commerce.",
          "Professional development and learning opportunities.",
        ],
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
        summary:
          "We are seeking a talented and experienced Fullstack Developer to join our dynamic team. The ideal candidate will have a strong front-end and back-end development background, with specific experience in React and Node.js. Additionally, a solid understanding of AWS and Azure cloud platforms is required.",
        responsibilities: [
          "Develop, test, and deploy high-quality web applications using React and Node.js.",
          "Collaborate with cross-functional teams to define, design, and ship new features.",
          "Write clean, maintainable, and efficient code.",
          "Ensure the performance, quality, and responsiveness of applications.",
          "Identify bottlenecks and bugs, and devise solutions to mitigate and address these issues.",
          "Maintain code integrity and organisation.",
          "Stay up-to-date with emerging technologies and industry trends.",
        ],
        requirements: [
          "2-5 years of professional experience in fullstack development.",
          "Strong proficiency in React.js, including state management, hooks, and component lifecycle.",
          "Proficient in Node.js and related frameworks (e.g., Express.js, Three.js).",
          "Solid understanding of AWS and Azure cloud services, including deployment and management of cloud-based applications.",
          "Experience with both SQL and NoSQL databases.",
          "Proficient with Git and version control systems.",
          "Experience with unit testing and integration testing.",
          "Familiarity with Agile development methodologies.",
          "Strong problem-solving skills, excellent communication skills, and ability to work collaboratively in a team environment.",
        ],
        qualifications: [
          "Experience with TypeScript.",
          "Knowledge of Docker and containerisation.",
          "Familiarity with CI/CD pipelines.",
          "Experience with serverless architectures and microservices.",
        ],
        benefits: [
          "Competitive salary and performance-based incentives.",
          "Health insurance and wellness benefits.",
          "A vibrant and collaborative work environment.",
          "Opportunities for professional growth and skill development.",
          "Exposure to innovative technologies and challenging projects.",
        ],
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
        summary:
          "Design and implement AI-powered features and full-stack solutions to enhance the digital beauty experience.",
        responsibilities: [
          "Develop and maintain AI-driven applications for virtual try-on, recommendations, and personalization.",
          "Collaborate with product and engineering teams to integrate AI solutions into the platform.",
          "Optimize machine learning models for performance and scalability.",
          "Write clean, maintainable code across frontend and backend.",
          "Monitor and troubleshoot AI system performance and reliability.",
        ],
        requirements: [
          "3+ years experience in full-stack development.",
          "Strong knowledge of Python, Node.js, TensorFlow, and React.",
          "Experience with AI/ML model development and deployment.",
          "Proficiency in cloud services (AWS/GCP) for AI workloads.",
          "Ability to work collaboratively in a fast-paced environment.",
        ],
        qualifications: [
          "Experience with computer vision and virtual try-on systems.",
          "Knowledge of recommendation systems and personalization algorithms.",
          "Familiarity with serverless architectures and microservices.",
        ],
        benefits: [
          "Competitive salary and performance incentives.",
          "Health insurance and wellness benefits.",
          "Opportunity to work on cutting-edge AI projects in e-commerce.",
          "Flexible work arrangements and professional growth opportunities.",
        ],
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
        summary:
          "Develop, deploy, and maintain mobile applications delivering a seamless beauty e-commerce experience.",
        responsibilities: [
          "Build mobile applications for iOS and Android using React Native, Flutter, Swift, or Kotlin.",
          "Collaborate with designers and backend engineers to integrate APIs and services.",
          "Ensure mobile apps are responsive, performant, and user-friendly.",
          "Perform debugging, testing, and continuous optimization of mobile apps.",
          "Stay updated with mobile development trends and best practices.",
        ],
        requirements: [
          "2+ years of mobile app development experience.",
          "Proficiency in React Native, Flutter, Swift, or Kotlin.",
          "Experience with REST APIs and integrating third-party services.",
          "Knowledge of mobile UI/UX principles and responsive design.",
          "Familiarity with version control (Git) and Agile workflows.",
        ],
        qualifications: [
          "Experience in e-commerce or beauty/retail mobile apps.",
          "Familiarity with CI/CD pipelines for mobile apps.",
          "Knowledge of push notifications, analytics, and app performance monitoring.",
        ],
        benefits: [
          "Competitive salary and performance bonuses.",
          "Flexible remote work options.",
          "Opportunity to work on innovative mobile experiences.",
          "Professional development and learning budget.",
        ],
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
        summary:
          "Manage infrastructure, automate deployments, and ensure reliable, scalable operations across cloud environments.",
        responsibilities: [
          "Design, implement, and maintain CI/CD pipelines.",
          "Manage cloud infrastructure on AWS using Terraform or similar tools.",
          "Monitor system performance, troubleshoot issues, and optimize resources.",
          "Implement containerization with Docker and orchestration with Kubernetes.",
          "Ensure security, scalability, and reliability of deployments.",
        ],
        requirements: [
          "3+ years experience as a DevOps engineer.",
          "Strong knowledge of AWS cloud services and infrastructure management.",
          "Experience with Docker, Kubernetes, and infrastructure-as-code tools.",
          "Familiarity with CI/CD tools and pipelines.",
          "Strong problem-solving and troubleshooting skills.",
        ],
        qualifications: [
          "Experience in e-commerce or high-traffic web platforms.",
          "Knowledge of monitoring and logging tools (Prometheus, Grafana, ELK stack).",
          "Familiarity with serverless and microservices architectures.",
        ],
        benefits: [
          "Competitive salary and performance incentives.",
          "Health insurance and wellness programs.",
          "Opportunity to work on cloud-native and scalable systems.",
          "Learning and skill development opportunities.",
        ],
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
        summary:
          "Ensure the quality, stability, and usability of web and mobile applications through rigorous testing and automation.",
        responsibilities: [
          "Design and execute test plans, test cases, and automated test scripts.",
          "Perform functional, regression, and performance testing.",
          "Collaborate with development teams to identify and resolve defects.",
          "Ensure adherence to QA standards and best practices.",
          "Monitor software quality metrics and recommend improvements.",
        ],
        requirements: [
          "2+ years of QA experience in web and mobile applications.",
          "Proficiency with automated testing frameworks like Selenium, Cypress, Jest, or Playwright.",
          "Knowledge of test planning, bug tracking, and QA methodologies.",
          "Experience with version control systems (Git).",
          "Strong analytical and problem-solving skills.",
        ],
        qualifications: [
          "Experience in e-commerce or beauty/retail applications.",
          "Familiarity with CI/CD pipelines and automated testing integration.",
          "Knowledge of performance testing tools and practices.",
        ],
        benefits: [
          "Competitive salary and performance-based incentives.",
          "Flexible remote work opportunities.",
          "Exposure to latest testing tools and technologies.",
          "Professional growth and skill development support.",
        ],
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
        summary:
          "Create visually appealing and user-friendly interfaces to enhance the digital beauty shopping experience.",
        responsibilities: [
          "Design UI/UX for web and mobile applications, ensuring intuitive user flows.",
          "Collaborate with product managers, developers, and marketing teams to translate requirements into designs.",
          "Create wireframes, prototypes, and high-fidelity mockups.",
          "Conduct user research, usability testing, and incorporate feedback into designs.",
          "Ensure brand consistency across all digital touchpoints.",
        ],
        requirements: [
          "2+ years of experience in UI/UX design.",
          "Proficiency in design tools like Figma, Adobe XD, and Illustrator.",
          "Strong understanding of user-centered design principles and best practices.",
          "Experience with responsive design for web and mobile.",
          "Good communication skills and ability to collaborate in cross-functional teams.",
        ],
        qualifications: [
          "Experience in e-commerce or beauty/retail platforms.",
          "Knowledge of HTML/CSS for design handoff.",
          "Familiarity with prototyping and user testing tools.",
        ],
        benefits: [
          "Competitive salary and performance incentives.",
          "Flexible remote work arrangements.",
          "Opportunity to work on innovative digital experiences in the beauty industry.",
          "Professional growth and design learning opportunities.",
        ],
      },
    ],
  },
  {
    department: {
      title: "Marketing & Growth",
      value: "marketing_and_growth",
      color: "#9747ff",
      icon: MarketingOpeningIcon,
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
        summary:
          "Oversee the marketing function, develop strategic campaigns, and drive brand growth for our cosmetics business.",
        responsibilities: [
          "Develop and implement marketing strategies across digital and offline channels.",
          "Lead marketing campaigns to enhance brand awareness and customer engagement.",
          "Collaborate with product, sales, and design teams for cohesive campaigns.",
          "Analyze performance metrics and adjust strategies to maximize ROI.",
          "Mentor and lead the marketing team.",
        ],
        requirements: [
          "5+ years in marketing leadership roles.",
          "Strong understanding of digital marketing, branding, and analytics.",
          "Experience managing teams and large-scale campaigns.",
          "Excellent communication and project management skills.",
        ],
        qualifications: [
          "Experience in the beauty or e-commerce industry.",
          "Familiarity with marketing automation tools.",
        ],
        benefits: [
          "Competitive salary and performance incentives.",
          "Flexible working options and professional growth.",
          "Exposure to innovative marketing campaigns in the beauty sector.",
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
        summary:
          "Manage and optimize digital campaigns to drive traffic, engagement, and conversions for the beauty e-commerce platform.",
        responsibilities: [
          "Plan and execute paid and organic campaigns across channels.",
          "Conduct keyword research and optimize website content for SEO.",
          "Monitor campaign performance and report on KPIs.",
          "Collaborate with content and design teams for campaign assets.",
          "Stay up-to-date with latest digital marketing trends and tools.",
        ],
        requirements: [
          "3+ years of digital marketing experience.",
          "Proficiency in SEO, SEM, PPC, and analytics tools.",
          "Experience managing campaigns and budgets.",
          "Strong analytical and problem-solving skills.",
        ],
        qualifications: [
          "Experience in e-commerce or beauty industry campaigns.",
          "Knowledge of social media advertising platforms.",
        ],
        benefits: [
          "Performance-based incentives.",
          "Opportunities for learning and career advancement.",
          "Flexible work environment.",
        ],
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
        summary:
          "Produce high-quality written content to enhance brand presence and drive customer engagement.",
        responsibilities: [
          "Write blog posts, product descriptions, and social media content.",
          "Optimize content for SEO and user engagement.",
          "Collaborate with marketing and design teams to align content strategy.",
          "Edit and proofread content for clarity, tone, and consistency.",
          "Stay updated on industry trends and content marketing best practices.",
        ],
        requirements: [
          "2+ years of professional writing experience.",
          "Excellent writing, editing, and proofreading skills.",
          "Understanding of SEO and content optimization.",
          "Ability to work independently and meet deadlines.",
        ],
        qualifications: [
          "Experience in the beauty or e-commerce sector.",
          "Familiarity with WordPress and CMS tools.",
        ],
        benefits: [
          "Flexible remote work.",
          "Opportunities for creative expression and career growth.",
          "Competitive compensation.",
        ],
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
        summary:
          "Improve organic search rankings, optimize website content, and increase traffic through effective SEO strategies.",
        responsibilities: [
          "Conduct keyword research and competitive analysis.",
          "Implement on-page and off-page SEO best practices.",
          "Monitor website performance and report insights.",
          "Collaborate with content and development teams to implement changes.",
          "Stay current with search engine algorithm updates and trends.",
        ],
        requirements: [
          "2+ years of SEO experience.",
          "Strong knowledge of SEO tools and analytics.",
          "Understanding of content strategy and digital marketing.",
          "Analytical mindset and attention to detail.",
        ],
        qualifications: [
          "Experience with e-commerce platforms.",
          "Basic knowledge of HTML/CSS.",
        ],
        benefits: [
          "Remote working flexibility.",
          "Learning and career growth opportunities.",
          "Performance-based incentives.",
        ],
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
        summary:
          "Build and execute social media strategies to grow followers, engagement, and brand visibility.",
        responsibilities: [
          "Develop content calendars and social campaigns.",
          "Engage with audiences across platforms.",
          "Track social metrics and adjust strategy accordingly.",
          "Collaborate with marketing and creative teams.",
          "Stay updated on social media trends and tools.",
        ],
        requirements: [
          "2+ years of social media management experience.",
          "Knowledge of major social platforms and tools.",
          "Strong communication and creative skills.",
          "Ability to analyze performance metrics and optimize campaigns.",
        ],
        qualifications: [
          "Experience in beauty or e-commerce brands.",
          "Basic graphic design skills.",
        ],
        benefits: [
          "Remote work flexibility.",
          "Opportunities for professional development.",
          "Performance-based incentives.",
        ],
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
        summary:
          "Design and implement email campaigns to increase customer engagement, retention, and conversions.",
        responsibilities: [
          "Develop email marketing strategies and schedules.",
          "Segment audiences for personalized campaigns.",
          "Analyze performance metrics and optimize campaigns.",
          "Collaborate with marketing and content teams.",
          "Ensure compliance with email marketing regulations.",
        ],
        requirements: [
          "2+ years of email marketing experience.",
          "Proficiency with email platforms (Mailchimp, HubSpot, Salesforce).",
          "Strong analytical and writing skills.",
          "Attention to detail and ability to meet deadlines.",
        ],
        qualifications: [
          "Experience in e-commerce or beauty industry.",
          "Knowledge of marketing automation and CRM systems.",
        ],
        benefits: [
          "Remote work and flexible hours.",
          "Career growth and skill development opportunities.",
          "Performance-based incentives.",
        ],
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
        summary:
          "Develop influencer partnerships to drive brand awareness, engagement, and campaign success.",
        responsibilities: [
          "Identify and onboard relevant influencers.",
          "Manage influencer relationships and contracts.",
          "Track campaign performance and report insights.",
          "Collaborate with marketing and creative teams.",
          "Ensure brand alignment and compliance in campaigns.",
        ],
        requirements: [
          "3+ years in influencer marketing or partnerships.",
          "Strong communication and negotiation skills.",
          "Familiarity with social platforms and trends.",
          "Ability to manage multiple campaigns simultaneously.",
        ],
        qualifications: [
          "Experience in beauty or e-commerce brands.",
          "Knowledge of influencer marketing platforms and analytics.",
        ],
        benefits: [
          "Flexible remote work options.",
          "Opportunities for career growth.",
          "Performance-based incentives.",
        ],
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
        summary:
          "Create visually compelling graphics for marketing campaigns, social media, and brand communication.",
        responsibilities: [
          "Design graphics for digital and print campaigns.",
          "Collaborate with marketing and content teams.",
          "Ensure brand consistency across all visuals.",
          "Produce assets for social media, email, and website.",
          "Stay updated on design trends and tools.",
        ],
        requirements: [
          "2+ years of professional graphic design experience.",
          "Proficiency in Photoshop, Illustrator, and Figma.",
          "Strong creative and conceptual skills.",
          "Attention to detail and ability to meet deadlines.",
        ],
        qualifications: [
          "Experience in beauty or e-commerce brands.",
          "Knowledge of motion graphics or video editing.",
        ],
        benefits: [
          "Remote work and flexible schedule.",
          "Opportunities to work on high-visibility campaigns.",
          "Performance-based incentives.",
        ],
      },
    ],
  },
  {
    department: {
      title: "Sales & Customer Engagement",
      value: "sales_and_customer_engagement",
      color: "#12b76a",
      icon: SalesOpeningIcon,
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
        summary:
          "Oversee the sales function, develop strategic sales plans, and ensure revenue growth for the beauty business.",
        responsibilities: [
          "Develop and implement sales strategies to achieve targets.",
          "Lead, mentor, and manage the sales team.",
          "Build and maintain strong client relationships.",
          "Monitor sales metrics and adjust plans to maximize performance.",
          "Collaborate with marketing and product teams to support initiatives.",
        ],
        requirements: [
          "5+ years in sales leadership roles.",
          "Proven track record in achieving revenue targets.",
          "Strong client relationship management skills.",
          "Excellent communication, negotiation, and leadership abilities.",
        ],
        qualifications: [
          "Experience in beauty or e-commerce sectors.",
          "Familiarity with CRM and sales analytics tools.",
        ],
        benefits: [
          "Competitive salary and performance incentives.",
          "Opportunities for professional growth and leadership development.",
          "Health and wellness benefits.",
        ],
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
        summary:
          "Drive business growth by identifying opportunities, building partnerships, and negotiating deals for the beauty brand.",
        responsibilities: [
          "Identify and pursue new business opportunities.",
          "Build and maintain strategic partnerships.",
          "Negotiate contracts and deals with clients and partners.",
          "Collaborate with sales and marketing teams for aligned initiatives.",
          "Report on business development performance and KPIs.",
        ],
        requirements: [
          "3+ years of business development experience.",
          "Strong negotiation, networking, and relationship-building skills.",
          "Proficiency with CRM and business analytics tools.",
          "Ability to manage multiple opportunities simultaneously.",
        ],
        qualifications: [
          "Experience in beauty, cosmetics, or e-commerce sectors.",
          "Familiarity with LinkedIn Sales Navigator and CRM analytics.",
        ],
        benefits: [
          "Performance-based incentives and bonuses.",
          "Career growth opportunities.",
          "Flexible work environment.",
        ],
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
        summary:
          "Manage client relationships, ensure satisfaction, and deliver customized solutions to enhance partnership success.",
        responsibilities: [
          "Serve as primary point of contact for assigned clients.",
          "Understand client needs and provide tailored solutions.",
          "Monitor account performance and provide insights for improvement.",
          "Collaborate with internal teams to ensure successful delivery.",
          "Proactively resolve client issues and enhance engagement.",
        ],
        requirements: [
          "2+ years of client success or account management experience.",
          "Strong communication and relationship-building skills.",
          "Ability to manage multiple accounts efficiently.",
          "Familiarity with CRM tools and reporting.",
        ],
        qualifications: [
          "Experience in beauty or e-commerce sectors.",
          "Remote work experience with strong self-management skills.",
        ],
        benefits: [
          "Remote work flexibility.",
          "Opportunities for career development.",
          "Performance-based incentives.",
        ],
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
        summary:
          "Support sales activities, provide excellent customer service, and contribute to revenue growth in physical and online channels.",
        responsibilities: [
          "Assist customers with product inquiries and purchases.",
          "Maintain sales records using POS and CRM systems.",
          "Achieve individual sales targets and KPIs.",
          "Provide feedback to management on customer needs and trends.",
          "Support promotional activities and store events.",
        ],
        requirements: [
          "1+ years of retail or sales experience.",
          "Good communication and interpersonal skills.",
          "Familiarity with POS and CRM systems.",
          "Customer-focused and target-driven mindset.",
        ],
        qualifications: [
          "Experience in beauty or cosmetics retail.",
          "Basic knowledge of online sales platforms.",
        ],
        benefits: [
          "Competitive salary and sales incentives.",
          "On-the-job training and career progression.",
          "Employee discounts on products.",
        ],
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
        summary:
          "Deliver top-notch customer support by resolving issues, answering inquiries, and ensuring customer satisfaction.",
        responsibilities: [
          "Respond to customer queries via email, calls, or chat.",
          "Resolve complaints and escalate complex issues.",
          "Update customer records in CRM systems.",
          "Collaborate with other teams to enhance service quality.",
          "Provide feedback on customer experience improvements.",
        ],
        requirements: [
          "1+ years of customer support experience.",
          "Excellent communication and problem-solving skills.",
          "Familiarity with customer support software (Zendesk, Freshdesk).",
          "Ability to handle multiple inquiries efficiently.",
        ],
        qualifications: [
          "Experience in e-commerce or beauty industry support.",
          "Remote work experience with self-discipline.",
        ],
        benefits: [
          "Remote work flexibility.",
          "Performance-based incentives.",
          "Career growth opportunities.",
        ],
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
        summary:
          "Provide real-time support to customers via chat, ensuring quick resolution of queries and excellent service.",
        responsibilities: [
          "Respond promptly to customer chat inquiries.",
          "Resolve issues efficiently and accurately.",
          "Document interactions and update CRM records.",
          "Escalate complex problems to appropriate teams.",
          "Maintain high customer satisfaction and response metrics.",
        ],
        requirements: [
          "1+ years of chat or online customer support experience.",
          "Strong written communication and typing skills.",
          "Familiarity with chat support tools (Zendesk, Intercom, Freshdesk).",
          "Ability to multitask and handle high-volume inquiries.",
        ],
        qualifications: [
          "Experience in beauty or e-commerce chat support.",
          "Remote work experience and self-management skills.",
        ],
        benefits: [
          "Remote work flexibility.",
          "Opportunities for skill development.",
          "Performance-based incentives.",
        ],
      },
    ],
  },
  {
    department: {
      title: "Operations & Logistics",
      value: "operations_and_logistics",
      color: "#00e5d1",
      icon: OperationsOpeningIcon,
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
        summary:
          "Lead operations and supply chain strategies to ensure timely and efficient delivery of products to customers.",
        responsibilities: [
          "Oversee all operational activities, including supply chain and logistics.",
          "Develop and implement operational policies and procedures.",
          "Optimize warehouse and inventory processes.",
          "Monitor key metrics to ensure efficiency and quality.",
          "Collaborate with other departments for seamless operations.",
        ],
        requirements: [
          "5+ years in operations or supply chain management.",
          "Strong leadership and team management skills.",
          "Experience with ERP systems and logistics tools.",
          "Excellent analytical and problem-solving abilities.",
        ],
        qualifications: [
          "Experience in e-commerce or beauty sector operations.",
          "Knowledge of modern supply chain and warehouse practices.",
        ],
        benefits: [
          "Competitive salary with performance incentives.",
          "Opportunities for professional growth and leadership roles.",
          "Health and wellness benefits.",
        ],
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
        summary:
          "Maintain accurate inventory levels and ensure smooth warehouse operations to support product availability.",
        responsibilities: [
          "Track inventory levels and manage stock replenishment.",
          "Conduct regular inventory audits.",
          "Ensure proper storage and handling of products.",
          "Coordinate with procurement and warehouse teams.",
          "Implement processes to minimize stock discrepancies.",
        ],
        requirements: [
          "2+ years of inventory management experience.",
          "Proficiency in ERP systems and Excel.",
          "Attention to detail and organizational skills.",
          "Ability to analyze inventory data and forecast needs.",
        ],
        qualifications: [
          "Experience in retail or e-commerce inventory management.",
          "Knowledge of warehouse management best practices.",
        ],
        benefits: [
          "Competitive salary and growth opportunities.",
          "Hands-on exposure to supply chain processes.",
          "Employee discounts and wellness benefits.",
        ],
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
        summary:
          "Manage warehouse operations, ensuring efficient storage, handling, and dispatch of products.",
        responsibilities: [
          "Supervise warehouse staff and daily operations.",
          "Maintain inventory accuracy and organize storage systems.",
          "Ensure timely product dispatch and shipping.",
          "Implement warehouse safety and quality protocols.",
          "Coordinate with logistics and inventory teams.",
        ],
        requirements: [
          "3+ years of warehouse management experience.",
          "Strong organizational and leadership skills.",
          "Proficiency with warehouse management systems and ERP tools.",
          "Ability to optimize processes and manage teams effectively.",
        ],
        qualifications: [
          "Experience in e-commerce or fast-moving consumer goods (FMCG).",
          "Knowledge of logistics and supply chain optimization.",
        ],
        benefits: [
          "Competitive salary and incentives.",
          "Leadership growth opportunities.",
          "Health and wellness benefits.",
        ],
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
        summary:
          "Manage and coordinate the logistics process to ensure timely and efficient delivery of products.",
        responsibilities: [
          "Coordinate shipments and deliveries with carriers.",
          "Track and monitor shipments for timely arrival.",
          "Manage documentation for logistics processes.",
          "Collaborate with warehouse and inventory teams.",
          "Identify and resolve logistics issues promptly.",
        ],
        requirements: [
          "2+ years of logistics or coordination experience.",
          "Proficiency in ERP and shipping tools.",
          "Strong organizational and communication skills.",
          "Ability to multitask and prioritize effectively.",
        ],
        qualifications: [
          "Experience in e-commerce or retail logistics.",
          "Familiarity with shipping regulations and documentation.",
        ],
        benefits: [
          "Remote work flexibility (if applicable).",
          "Performance-based incentives.",
          "Professional development opportunities.",
        ],
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
        summary:
          "Oversee vendor relationships, ensuring cost-effective procurement and timely supply of materials.",
        responsibilities: [
          "Identify and onboard new vendors.",
          "Negotiate contracts and pricing.",
          "Monitor vendor performance and compliance.",
          "Coordinate with procurement and operations teams.",
          "Develop strategies for vendor optimization.",
        ],
        requirements: [
          "3+ years of vendor management or procurement experience.",
          "Strong negotiation and relationship management skills.",
          "Proficiency in ERP and CRM tools.",
          "Analytical and decision-making abilities.",
        ],
        qualifications: [
          "Experience in beauty, e-commerce, or FMCG sectors.",
          "Knowledge of sourcing and procurement best practices.",
        ],
        benefits: [
          "Competitive salary and performance bonuses.",
          "Exposure to strategic vendor management.",
          "Career growth opportunities.",
        ],
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
        summary:
          "Package products efficiently and accurately to ensure timely delivery and quality standards.",
        responsibilities: [
          "Prepare and package products for dispatch.",
          "Ensure packaging meets quality and safety standards.",
          "Maintain organized and clean packaging area.",
          "Assist with inventory handling and labeling.",
          "Report any discrepancies or damages to supervisors.",
        ],
        requirements: [
          "1+ years of experience in packaging or operations support.",
          "Attention to detail and ability to follow instructions.",
          "Physical ability to handle packages and maintain speed.",
          "Team player with good communication skills.",
        ],
        qualifications: [
          "Experience in e-commerce or retail packaging.",
          "Basic knowledge of warehouse operations.",
        ],
        benefits: [
          "Competitive salary.",
          "On-the-job training and skill development.",
          "Employee discounts on products.",
        ],
      },
    ],
  },
  {
    department: {
      title: "Finance & Admin",
      value: "finance_and_admin",
      color: "#fe026c",
      icon: FinanceOpeningIcon,
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
        summary:
          "Lead the finance team to drive budgeting, forecasting, and financial strategy across the organization.",
        responsibilities: [
          "Develop and manage financial plans and budgets.",
          "Oversee accounting, reporting, and compliance processes.",
          "Provide strategic financial guidance to leadership.",
          "Monitor cash flow, investments, and expenses.",
          "Ensure adherence to financial policies and regulations.",
        ],
        requirements: [
          "5+ years of experience in finance or accounting management.",
          "Strong knowledge of financial planning, budgeting, and reporting.",
          "Proficiency in Tally, ERP systems, and MS Excel.",
          "Analytical mindset with attention to detail.",
        ],
        qualifications: [
          "Experience in e-commerce or retail finance.",
          "Professional certifications like CA, CMA, or CPA.",
        ],
        benefits: [
          "Competitive salary and performance bonuses.",
          "Professional development and training opportunities.",
          "Health and wellness benefits.",
        ],
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
        summary:
          "Maintain accurate financial records, manage accounts, and ensure compliance with accounting standards.",
        responsibilities: [
          "Record day-to-day financial transactions.",
          "Prepare financial statements and reports.",
          "Reconcile accounts and resolve discrepancies.",
          "Ensure compliance with tax and accounting regulations.",
          "Assist in audits and financial analysis.",
        ],
        requirements: [
          "2+ years of accounting experience.",
          "Proficiency in Tally, QuickBooks, and MS Excel.",
          "Attention to detail and organizational skills.",
          "Knowledge of accounting standards and compliance requirements.",
        ],
        qualifications: [
          "Experience in e-commerce or retail accounting.",
          "Basic understanding of taxation and payroll processes.",
        ],
        benefits: [
          "Flexible work options (Remote availability).",
          "Competitive compensation and growth opportunities.",
          "Health benefits and employee discounts.",
        ],
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
        summary:
          "Manage payroll processing, ensure compliance, and administer employee benefits efficiently.",
        responsibilities: [
          "Process monthly payroll accurately and on time.",
          "Maintain employee records and payroll data.",
          "Ensure compliance with tax and labor regulations.",
          "Handle employee queries related to payroll and benefits.",
          "Coordinate with HR and finance teams for payroll-related tasks.",
        ],
        requirements: [
          "2+ years of payroll or HR administration experience.",
          "Proficiency in payroll software and MS Excel.",
          "Strong understanding of payroll laws and compliance.",
          "Attention to detail and accuracy.",
        ],
        qualifications: [
          "Experience in e-commerce or corporate payroll.",
          "Knowledge of statutory compliance and labor laws.",
        ],
        benefits: [
          "Competitive salary and performance incentives.",
          "Opportunities to grow in HR and finance functions.",
          "Employee wellness and benefits programs.",
        ],
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
        summary:
          "Lead HR operations, talent acquisition, and employee engagement to support organizational growth.",
        responsibilities: [
          "Oversee recruitment, onboarding, and talent management.",
          "Manage employee relations and performance evaluations.",
          "Ensure compliance with HR policies and labor laws.",
          "Implement employee engagement and retention initiatives.",
          "Coordinate with leadership on workforce planning.",
        ],
        requirements: [
          "3+ years of HR management experience.",
          "Proficiency in HRMS and payroll software.",
          "Strong interpersonal and communication skills.",
          "Knowledge of labor laws and HR best practices.",
        ],
        qualifications: [
          "Experience in e-commerce, retail, or startup HR.",
          "Professional HR certifications (PHR/SPHR) are a plus.",
        ],
        benefits: [
          "Flexible work options (Remote availability).",
          "Professional development and training opportunities.",
          "Health benefits and wellness programs.",
        ],
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
        summary:
          "Ensure smooth daily office operations, administrative support, and organization management.",
        responsibilities: [
          "Manage office supplies and equipment.",
          "Coordinate schedules, meetings, and events.",
          "Support HR and finance with documentation and reporting.",
          "Maintain office records and filing systems.",
          "Ensure a safe and organized work environment.",
        ],
        requirements: [
          "2+ years of office administration experience.",
          "Proficiency in MS Office and basic ERP tools.",
          "Strong organizational and multitasking skills.",
          "Good communication and interpersonal abilities.",
        ],
        qualifications: [
          "Experience in e-commerce or corporate office administration.",
          "Knowledge of basic accounting or HR processes.",
        ],
        benefits: [
          "Competitive salary and growth opportunities.",
          "Professional development and training.",
          "Health and wellness benefits.",
        ],
      },
    ],
  },
  {
    department: {
      title: "Data & Analytics",
      value: "data_and_analytics",
      color: "#b519df",
      icon: DataAnalyticsOpeningIcon,
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
        summary:
          "Lead the data team to develop strategies, analytics solutions, and data-driven insights that guide business decisions.",
        responsibilities: [
          "Develop and execute data strategy aligned with business objectives.",
          "Oversee analytics, reporting, and data governance.",
          "Drive insights from data to influence strategy and operations.",
          "Manage and mentor data team members.",
          "Collaborate with cross-functional teams to utilize data effectively.",
        ],
        requirements: [
          "5+ years of experience in data management or analytics leadership.",
          "Strong knowledge of SQL, Python, and data visualization tools.",
          "Experience managing analytics teams and projects.",
        ],
        qualifications: [
          "Experience in e-commerce or tech industry data strategy.",
          "Advanced degrees in Data Science, Analytics, or related fields.",
        ],
        benefits: [
          "Health insurance",
          "Flexible working hours",
          "Stock options",
          "Professional development budget",
        ],
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
        summary:
          "Perform data analysis, generate actionable insights, and create reports for stakeholders.",
        responsibilities: [
          "Collect, clean, and analyze data from multiple sources.",
          "Develop dashboards and visual reports.",
          "Provide insights to improve business performance.",
          "Collaborate with teams to understand data needs.",
        ],
        requirements: [
          "2+ years of experience as a data analyst or similar role.",
          "Proficiency in SQL, Excel, and data visualization tools.",
          "Analytical mindset with strong problem-solving skills.",
        ],
        qualifications: [
          "Experience with e-commerce or consumer data.",
          "Knowledge of Python/R for data analysis.",
        ],
        benefits: [
          "Remote work",
          "Flexible schedule",
          "Health insurance",
          "Training and workshops",
        ],
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
        summary:
          "Build and maintain BI dashboards to provide insights for strategic business decisions.",
        responsibilities: [
          "Design, develop, and maintain BI reports and dashboards.",
          "Extract and transform data from multiple sources.",
          "Work closely with teams to gather requirements for analytics.",
          "Monitor key metrics and identify trends.",
        ],
        requirements: [
          "2+ years of experience in BI or data analytics.",
          "Strong skills in SQL and BI tools like Power BI/Tableau.",
          "Ability to communicate insights effectively.",
        ],
        qualifications: [
          "Experience in retail or e-commerce BI.",
          "Knowledge of data warehousing concepts.",
        ],
        benefits: [
          "Remote work",
          "Flexible hours",
          "Health insurance",
          "Professional growth opportunities",
        ],
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
        summary:
          "Develop and deploy machine learning models to solve business problems and enhance decision-making.",
        responsibilities: [
          "Analyze large datasets to uncover patterns and trends.",
          "Develop predictive and prescriptive models.",
          "Collaborate with teams to integrate models into products.",
          "Communicate insights to stakeholders.",
        ],
        requirements: [
          "3+ years of experience in data science or ML.",
          "Strong programming skills in Python/R and ML frameworks.",
          "Experience in predictive modeling, statistics, and analytics.",
        ],
        qualifications: [
          "Experience in e-commerce or consumer behavior analytics.",
          "Advanced degrees in Data Science or related fields.",
        ],
        benefits: [
          "Health insurance",
          "Remote flexibility",
          "Performance bonus",
          "Learning and development budget",
        ],
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
        summary:
          "Monitor and analyze marketing performance to provide actionable insights and recommendations.",
        responsibilities: [
          "Track and analyze marketing campaigns and metrics.",
          "Prepare reports and dashboards for marketing performance.",
          "Identify trends and recommend optimization strategies.",
          "Collaborate with marketing and sales teams for data-driven decisions.",
        ],
        requirements: [
          "2+ years of experience in marketing analytics.",
          "Proficiency in Google Analytics, Excel, and visualization tools.",
          "Analytical mindset and attention to detail.",
        ],
        qualifications: [
          "Experience in e-commerce or digital marketing.",
          "Knowledge of marketing automation tools.",
        ],
        benefits: [
          "Remote work",
          "Flexible hours",
          "Health insurance",
          "Professional development support",
        ],
      },
    ],
  },
  {
    department: {
      title: "Specialized Roles",
      value: "specialized_roles",
      color: "#2e90fa",
      icon: SpecializedOpeningIcon,
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
        summary:
          "Advise the company on legal matters, ensuring compliance and minimizing risk.",
        responsibilities: [
          "Provide legal advice on corporate, commercial, and employment matters.",
          "Draft, review, and negotiate contracts.",
          "Ensure compliance with laws and regulations.",
          "Support company policies and risk management strategies.",
        ],
        requirements: [
          "5+ years of corporate legal experience.",
          "Knowledge of compliance and regulatory frameworks.",
          "Strong communication and negotiation skills.",
        ],
        qualifications: [
          "Experience in e-commerce or tech industry legal matters.",
          "Law degree from a recognized institution.",
        ],
        benefits: [
          "Health insurance",
          "Flexible work hours",
          "Paid time off",
          "Professional development support",
        ],
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
        summary:
          "Ensure the security of company systems and data through proactive measures and monitoring.",
        responsibilities: [
          "Implement and maintain security measures for networks and systems.",
          "Monitor for potential threats and vulnerabilities.",
          "Respond to security incidents and breaches.",
          "Collaborate with teams to ensure secure development practices.",
        ],
        requirements: [
          "3+ years of experience in cybersecurity or IT security.",
          "Strong knowledge of network security, firewalls, and SIEM tools.",
          "Problem-solving skills and attention to detail.",
        ],
        qualifications: [
          "Certifications like CISSP, CEH, or CISM.",
          "Experience in e-commerce or cloud-based systems security.",
        ],
        benefits: [
          "Remote work flexibility",
          "Health insurance",
          "Training and certifications support",
          "Performance bonuses",
        ],
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
        summary:
          "Produce professional photos for products, campaigns, and social media to enhance brand image.",
        responsibilities: [
          "Capture product and lifestyle images as per brand guidelines.",
          "Edit and retouch images using software tools.",
          "Collaborate with marketing and design teams for visual content.",
        ],
        requirements: [
          "2+ years of professional photography experience.",
          "Proficiency with camera equipment and editing software.",
          "Creative eye and attention to detail.",
        ],
        qualifications: [
          "Experience in e-commerce product photography.",
          "Portfolio demonstrating photography and editing skills.",
        ],
        benefits: [
          "Flexible working hours",
          "Creative freedom",
          "Paid time off",
          "Professional growth opportunities",
        ],
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
        summary:
          "Monitor and manage user-generated content to maintain community standards and compliance.",
        responsibilities: [
          "Review content submitted by users for appropriateness.",
          "Enforce guidelines and policies for content quality.",
          "Report violations and take necessary actions.",
          "Collaborate with product and community teams.",
        ],
        requirements: [
          "1+ years of experience in content moderation or quality control.",
          "Familiarity with CMS tools and moderation software.",
          "Attention to detail and decision-making skills.",
        ],
        qualifications: [
          "Experience in e-commerce, social media, or digital platforms.",
        ],
        benefits: [
          "Remote work",
          "Health insurance",
          "Flexible hours",
          "Learning and skill development support",
        ],
      },
    ],
  },
];
