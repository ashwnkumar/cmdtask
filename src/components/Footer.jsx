import React from "react";

const Footer = () => {
    return (
        <footer className="">

            <p className="text-xs">
                &copy; 2025 cmdtask. All rights reserved.
                Designed and developed by{" "}
                <a
                    href="https://ashwinkumar-dev.web.app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-500 underline underline-offset-2 hover:text-brand-dark transition"
                >
                    Ashwin Kumar
                </a>
            </p>
        </footer>
    );
};

export default Footer;