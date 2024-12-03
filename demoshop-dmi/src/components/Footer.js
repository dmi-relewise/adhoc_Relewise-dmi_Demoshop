import React, { useState } from "react";
import { tracker } from "../utils/Utils";
import getUser from "../userFile";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      // Create a user object and add the email
      const user = getUser();
      user.Email = email;

      // Send the UserUpdate request with the correct updateKind
      await tracker.trackUserUpdate({
        user,
        updateKind: "UpdateAndAppend", // Adjust based on your desired behavior
      });

      setMessage("Thank you for subscribing!");
      setEmail(""); // Clear the email field after a successful subscription
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <footer className="footer bg-dark text-white text-center py-4">
      <p>Subscribe to our newsletter 😎</p>
      <p>&copy; 2024 Demoshop. Relewise.</p>
      <div className="form-group">
        <input type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} className="form-control" />
        <button className="btn btn-primary mt-2" onClick={handleSubscribe}>
          Subscribe
        </button>
      </div>
      {message && <p className="mt-2">{message}</p>}
    </footer>
  );
};

export default Footer;
