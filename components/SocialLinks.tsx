import { Facebook, Instagram } from "@/components/Icons";

export default function SocialLinks() {
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/eouaen/?locale=vi_VN",
      icon: Facebook,
      className: "hover:bg-blue-600",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/luanhoanggggg/",
      icon: Instagram,
      className: "hover:bg-pink-600",
    },
  ];

  return (
    <div className="flex gap-4">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full transition-all duration-300 group ${link.className}`}
          aria-label={link.name}
        >
          <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
      ))}
    </div>
  );
}