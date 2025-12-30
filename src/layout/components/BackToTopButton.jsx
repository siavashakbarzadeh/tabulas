import { useState, useEffect } from "react";

function BackToTopButton() {
    const [visible, setVisible] = useState(false);

    // Show button after user scrolls down 300px
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-4 bg-primary-900 text-white w-12 h-12 rounded-full hover:bg-primary-700 z-50 shadow-lg flex items-center justify-center text-xl"
            aria-label="Torna in cima"
        >
            ↑
        </button>
    );
}

export default BackToTopButton;
