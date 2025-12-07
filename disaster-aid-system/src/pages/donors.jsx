import { useState } from "react";

export default function Donors() {
  const [form, setForm] = useState({
    volunteername: "",
    volunteeremail: "",
    volunteerphoneno: "",
    volunteeraddress: "",
    itemcategory: "",
    quantity: "",
    notes: ""
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/inventory/donations/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setForm({ 
          volunteername: "", 
          volunteeremail: "", 
          volunteerphoneno: "", 
          volunteeraddress: "", 
          itemcategory: "", 
          quantity: "",
          notes: ""
        });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="donor-page">
      <div className="donor-container">
        <h2>Become a Donor</h2>
        <p className="donor-intro">
          Welcome to <b>ResQNet's Donor Network</b>! Submit your donation details below. 
          Our admin team will review and contact you to arrange collection or delivery.
          Your kindness makes a real difference!
        </p>

        {submitStatus === 'success' && (
          <div className="alert alert-success">
            ✅ Thank you! Your donation has been submitted. An admin will contact you shortly to arrange collection.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="alert alert-error">
            ❌ Error submitting donation. Please try again or contact us at info@resqnet.lk
          </div>
        )}

        <form className="donor-form" onSubmit={handleSubmit}>
          <input
            name="volunteername"
            value={form.volunteername}
            onChange={handleChange}
            placeholder="Full Name *"
            required
          />
          <input
            name="volunteeremail"
            value={form.volunteeremail}
            onChange={handleChange}
            placeholder="Email Address *"
            type="email"
            required
          />
          <input
            name="volunteerphoneno"
            value={form.volunteerphoneno}
            onChange={handleChange}
            placeholder="Phone Number *"
            type="tel"
            required
          />
          <textarea
            name="volunteeraddress"
            value={form.volunteeraddress}
            onChange={handleChange}
            placeholder="Address for Pickup/Delivery *"
            rows="3"
            required
          />
          <input
            name="itemcategory"
            value={form.itemcategory}
            onChange={handleChange}
            placeholder="Item Category (e.g., Rice, Water, Clothes, Medicine) *"
            required
          />
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity *"
            type="number"
            min="1"
            required
          />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Additional Notes (optional)"
            rows="3"
          />

          <button type="submit" className="button-green" disabled={submitStatus === 'submitting'}>
            {submitStatus === 'submitting' ? '⏳ Submitting...' : '📤 Submit Donation Request'}
          </button>
          
          <p className="form-note">
            💡 <strong>How it works:</strong> After submission, an admin will review your donation 
            and contact you within 24 hours to arrange collection or delivery.
          </p>
        </form>
      </div>
    </div>
  );
}
