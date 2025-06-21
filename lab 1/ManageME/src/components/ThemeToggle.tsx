import { useEffect, useState } from "react";

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("theme");
            if (saved) return saved;
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }
        return "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <button
            id="theme-toggle"
            className="nav-link me-3"
            aria-label="Przełącz tryb"
            onClick={toggleTheme}
            type="button"
        >
            <span id="theme-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
        </button>
    );
};

export default ThemeToggle;