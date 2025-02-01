import { Home, BarChart, Film } from "lucide-react"; // Using Lucide icons
import Link from "next/link";

export default function SideBar() {
  return (
    <div className="h-screen w-64 bg-[#024959] text-white flex flex-col items-center p-5 shadow-lg" style={{ position: "fixed" }}>
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold">🎬 MovieStats</h1>
      </div>

      {/* Navigation */}
      <nav className="w-full">
        <NavItem href="/" icon={<Home size={20} />} text="Analyse des genre" />
        <NavItem href="/page2" icon={<BarChart size={20} />} text="Analyse des not et vote" />
        <NavItem href="/top-movies" icon={<Film size={20} />} text="Analyse des recette et des realisateur" />
      </nav>
    </div>
  );
}

// Reusable Navigation Item
function NavItem({ href, icon, text }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#03677d] transition">
      {icon}
      <span className="text-lg">{text}</span>
    </Link>
  );
}
