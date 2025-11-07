import { FaGithub } from "react-icons/fa";

export default function GitHubButton() {
  return (
    <div className="flex items-center justify-center min-h-[150px] bg-bg">
      <a
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        title="GitHub"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full border border-white/10 bg-text text-muted
                   transition-all duration-300 ease-out hover:scale-110 hover:text-white focus-visible:ring-2
                   focus-visible:ring-primary focus:outline-none"
      >
        <FaGithub className="text-2xl transition-colors duration-300 group-hover:text-white" />
        <span
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
          style={{
            boxShadow:
              "0 0 15px 2px rgba(110,84,148,0.6), 0 0 25px 6px rgba(110,84,148,0.3)",
          }}
        />
      </a>
    </div>
  );
}