import React, { useState } from 'react';
import Footer from './FooterComponent';

const Careers = () => {
  return (
    <div className="bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-blue-400 text-white py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Join Our Team</h1>
          <p className="mt-2 text-lg">Explore exciting opportunities to grow with us.</p>
        </div>
      </header>

      {/* Job Listings */}
      <section className="container mx-auto my-16 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Current Openings</h2>
          <p className="mt-4 text-gray-600">We are looking for talented individuals to join our team. Check out the roles below:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-10">
          <JobListing
            title="Frontend Developer"
            description="We're looking for a passionate frontend developer to build stunning and responsive user interfaces using React."
          />
          <JobListing
            title="Backend Developer"
            description="Join our backend team to develop scalable APIs and work with modern technologies like Node.js and MongoDB."
          />
          <JobListing
            title="Product Manager"
            description="Help us shape the future of our products by leading cross-functional teams and driving key initiatives."
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const JobListing = ({ title, description }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form inputs
    if (!formData.name || !formData.email || !formData.message) {
      setFormError('All fields are required.');
      return;
    }
  
    // Reset error message
    setFormError('');
  
    // Prepare form data for submission
    const applicationData = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      jobTitle: title,
    };
  
    try {
      // Send form data to backend to trigger email sending
      const response = await fetch('http://localhost:5000/send-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
  
      if (response.ok) {
        alert('Your application has been submitted successfully!');
        setFormData({ name: '', email: '', message: '' });
        setIsApplying(false); // Close form after successful submission
      } else {
        alert('There was an issue submitting your application. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again later.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-blue-600">{title}</h3>
      <p className="mt-2 text-gray-700">{description}</p>

      {/* Apply Button */}
      <button
        onClick={() => setIsApplying(!isApplying)}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        {isApplying ? 'Cancel' : 'Apply Now'}
      </button>

      {/* Application Form */}
      {isApplying && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700">Why do you want this job?</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {formError && <p className="text-red-500">{formError}</p>}
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md"
          >
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
};

export default Careers;
