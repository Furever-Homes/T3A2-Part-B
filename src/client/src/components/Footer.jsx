import React from "react";
import "../styles/Footer.css"; // Link to footer styles

const Footer = () => {
  return (
    <footer className="footer">
      <p>📞 Contact us: <a href="tel:+123456789">+1 (234) 567-89</a></p>
      <p>📧 Email: <a href="mailto:contact@fureverhomes.com">contact@fureverhomes.com.au</a></p>
    </footer>
  );
};

export default Footer;