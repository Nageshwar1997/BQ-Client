const teamMembers = [
  {
    name: "Vineeta Singh",
    role: "CEO & Co-Founder",
    image:
      "https://images.indianexpress.com/2023/01/vineeta-singh-shark-tank-india.jpg",
  },
  {
    name: "Kaushik Mukherjee",
    role: "COO & Co-Founder",
    image:
      "https://globalprimenews.com/wp-content/uploads/2022/06/L-R-Kaushik-Mukherjee_COO-Co-founder-SUGAR-Cosmetic-and-Vineeta-Singh_CEO-Co-founder-SUGAR-Cosmetics-1-scaled.jpg",
  },
  {
    name: "Priya Sharma",
    role: "Head of Marketing",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rohit Patel",
    role: "Lead Developer",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Sneha Kapoor",
    role: "Product Designer",
    image: "https://randomuser.me/api/portraits/women/46.jpg",
  },
];

const Teams = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Meet Our Team
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          Our dedicated professionals working to bring you the best in beauty
          and cosmetics.
        </p>
      </header>

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] justify-center">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="rounded-2xl overflow-hidden shadow-md bg-primary-1 shadow-primary-10 border border-primary-30 w-full max-w-[220px] text-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-1 border-t border-t-primary-30">
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-tertiary">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
