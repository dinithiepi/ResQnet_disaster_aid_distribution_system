import { useState } from "react";

export default function Donors() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    item: "",
    quantity: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Example API call (you can replace this URL with your backend endpoint)
      const response = await fetch("http://localhost:5000/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert(
          `Thank you, ${form.name}! Your donation of ${form.quantity} ${form.item}(s) has been registered.`
        );
        setForm({ name: "", email: "", item: "", quantity: "" });
      } else {
        alert("There was a problem submitting your donation. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="donor-page">
      <div className="donor-container">
        <h2>Become a Donor</h2>
        <p className="donor-intro">
          Welcome to <b>ResQNet’s Donor Network</b>! Every contribution helps us
          reach those in need faster and more effectively.  
          Your kindness makes a real difference — thank you for supporting
          relief efforts.
        </p>

        <form className="donor-form" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            type="email"
            required
          />
          <input
            name="item"
            value={form.item}
            onChange={handleChange}
            placeholder="Item to Donate"
            required
          />
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            type="number"
            required
          />

          <button type="submit" className="button-green">
            Submit Donation
          </button>
        </form>
      </div>
    </div>
  );
}
