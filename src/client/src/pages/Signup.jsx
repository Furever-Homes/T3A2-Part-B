import React from "react";
import "../styles/Signup.css";

const Signup = () => {
  return (
    <div className="signup-page">
      <h1>📝 Sign Up</h1>
      <form>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;