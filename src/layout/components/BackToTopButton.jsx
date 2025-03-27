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
            className="fixed bottom-16 right-4 bg-primary-900 text-white p-3 rounded-full hover:bg-primary-700 z-50"
        >
            ↑
        </button>
    );
}

export default BackToTopButton;
