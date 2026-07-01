import ProfileCard from "./ProfileCard";

const pakistaniPeople = [
    {
        name: "Ayesha Khan",
        role: "Software Engineer",
        bio: "Passionate full-stack developer with 5 years of experience in React and Node.js. Love solving complex problems.",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
        isOnline: true
    },
    {
        name: "Muhammad Ali",
        role: "Graphic Designer",
        bio: "Creative designer specializing in branding and UI/UX. Helping brands tell their visual stories.",
        avatarUrl: "https://i.pravatar.cc/150?img=2",
        isOnline: false
    },
    {
        name: "Fatima Ahmed",
        role: "Medical Doctor",
        bio: "Dedicated healthcare professional committed to providing compassionate care to patients in need.",
        avatarUrl: "https://i.pravatar.cc/150?img=3",
        isOnline: true
    },
    {
        name: "Usman Raza",
        role: "Data Analyst",
        bio: "Turning raw data into actionable insights. Expert in Python, SQL, and data visualization.",
        avatarUrl: "https://i.pravatar.cc/150?img=4",
        isOnline: false
    },
    {
        name: "Sana Malik",
        role: "Content Writer",
        bio: "Wordsmith crafting engaging content for brands. Passionate about storytelling and digital marketing.",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
        isOnline: true
    },
    {
        name: "Bilal Hassan",
        role: "Marketing Manager",
        bio: "Strategic marketer with 8 years of experience in digital campaigns and brand management.",
        avatarUrl: "https://i.pravatar.cc/150?img=6",
        isOnline: false
    },
    {
        name: "Zara Tariq",
        role: "Teacher",
        bio: "Educator dedicated to shaping young minds. Believes in inclusive and engaging learning environments.",
        avatarUrl: "https://i.pravatar.cc/150?img=7",
        isOnline: true
    },
    {
        name: "Hamza Chaudhry",
        role: "Entrepreneur",
        bio: "Founder of a tech startup focused on AI solutions. Passionate about innovation and business growth.",
        avatarUrl: "https://i.pravatar.cc/150?img=8",
        isOnline: false
    },
    {
        name: "Iqra Naeem",
        role: "Architect",
        bio: "Designing sustainable and modern spaces. Love blending aesthetics with functionality.",
        avatarUrl: "https://i.pravatar.cc/150?img=9",
        isOnline: true
    },
    {
        name: "Ali Raza",
        role: "Photographer",
        bio: "Capturing moments through the lens. Specializing in portrait and landscape photography.",
        avatarUrl: "https://i.pravatar.cc/150?img=10",
        isOnline: false
    }
];
const ProfileList = () => {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {pakistaniPeople.map((p, i) => (
                < ProfileCard key={i} name={p.name} role={p.role} bio={p.bio} avatarUrl={p.avatarUrl} isOnline={p.isOnline} />
            ))}

        </div>
    )
}

export default ProfileList