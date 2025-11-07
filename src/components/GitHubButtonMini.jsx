import { FaGithub } from "react-icons/fa";

export default function GitHubButtonMini() {
  return (
    <a
      href="https://github.com/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      title="GitHub"
      className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-text text-muted
                 transition-all duration-300 ease-out hover:text-white hover:scale-105 hover:shadow-[0_0_8px_#6e5494] hover:animate-glow
                 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
    >
      <FaGithub className="text-lg" />
    </a>
  );
}