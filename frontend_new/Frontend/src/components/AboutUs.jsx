import React from 'react';
import Footer from './FooterComponent';

const AboutUs = () => {
  return (
    <div className="bg-white">
      <header className="text-white text-center py-12" style={{ backgroundColor: '#5b8fd7' }}>
        <h1 className="text-4xl font-bold mt-16">About Us</h1>
      </header>

      <section className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold">Mission And Values</h2>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
          Our mission is to provide exceptional warehouse and logistics services with a focus on reliability, efficiency, and customer satisfaction.
        </p>
        <div className="flex justify-center space-x-8 mt-8 animate-fadeIn">
          <div className="transition transform hover:scale-110">
            <h3 className="text-xl font-bold">50+</h3>
            <p className="text-gray-700">Warehouses</p>
          </div>
          <div className="transition transform hover:scale-110">
            <h3 className="text-xl font-bold">30+</h3>
            <p className="text-gray-700">Years of Experience</p>
          </div>
        </div>
      </section>

      <section className="text-white py-12 px-4" style={{ backgroundColor: '#5b8fd7' }}>
        <h2 className="text-2xl font-bold text-center">Our Vision</h2>
        <p className="mt-4 text-center max-w-2xl mx-auto">
          Revolutionizing supply chain management by providing seamless and efficient storage and distribution services across the globe.
        </p>
      </section>

      <section className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold">Our Warehouse Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          <div className="p-4 shadow-lg rounded-lg bg-blue-200 hover:bg-blue-300 transition-colors">
            <h3 className="text-xl font-bold">Inventory Management</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-blue-200 hover:bg-blue-300 transition-colors">
            <h3 className="text-xl font-bold">Order Fulfillment</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-blue-200 hover:bg-blue-300 transition-colors">
            <h3 className="text-xl font-bold">Shipping & Distribution</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-blue-200 hover:bg-blue-300 transition-colors">
            <h3 className="text-xl font-bold">Custom Storage Solutions</h3>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-12 px-4">
        <h2 className="text-2xl font-bold text-center">Advanced Warehouse Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-5xl mx-auto">
          <div className="p-4 shadow-lg rounded-lg bg-white hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold">Automated Storage Systems</h3>
            <p className="text-gray-700 mt-2">We use cutting-edge automation technology for fast and accurate inventory management.</p>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-white hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold">Warehouse Management Software</h3>
            <p className="text-gray-700 mt-2">Real-time tracking and management of stock levels and orders with our advanced software solutions.</p>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-white hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold">Robotic Pick and Pack</h3>
            <p className="text-gray-700 mt-2">Efficient packing and picking processes to speed up order fulfillment.</p>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-white hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold">Temperature Controlled Storage</h3>
            <p className="text-gray-700 mt-2">Specialized storage solutions for perishable goods with temperature-sensitive requirements.</p>
          </div>
        </div>
      </section>

      <section className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold">Committed To Your Storage Needs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          <div className="p-4 shadow-lg rounded-lg bg-blue-200 hover:bg-blue-300 transition-colors">
            <h3 className="text-xl font-bold">Secure Storage</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-blue-200 hover:bg-blue-300 transition-colors">
            <h3 className="text-xl font-bold">Real-Time Tracking</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-blue-200 hover:bg-blue-300 transition-colors">
            <h3 className="text-xl font-bold">Flexible Contracts</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-blue-200 hover:bg-blue-300 transition-colors">
            <h3 className="text-xl font-bold">Fast Order Fulfillment</h3>
          </div>
        </div>
      </section>

      <section className="text-white text-center py-12 px-4" style={{ backgroundColor: '#5b8fd7' }}>
        <h2 className="text-2xl font-bold">Client Testimonials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 max-w-5xl mx-auto">
          <div className="p-4 shadow-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors">
            <p>"Your warehouse service has transformed our inventory management process, making it so much easier to stay organized."</p>
            <h3 className="mt-4 font-bold">- Client A</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors">
            <p>"The automated systems and real-time tracking have been a game changer for our supply chain logistics."</p>
            <h3 className="mt-4 font-bold">- Client B</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors">
            <p>"We are extremely satisfied with the temperature-controlled storage facilities provided for our sensitive goods."</p>
            <h3 className="mt-4 font-bold">- Client C</h3>
          </div>
        </div>
      </section>

      <section className="text-center py-12 px-4 w-full">
        <h2 className="text-2xl font-bold">Get Answer To Your Most Asked Questions</h2>
        <div className="mt-8">
          <div className="p-4 border rounded-lg shadow-md transition transform hover:scale-100 scale-90">
            <h3 className="text-xl font-bold">How do I rent warehouse space?</h3>
            <p className="mt-2 text-gray-700">You can rent warehouse space through our website or by contacting our sales team directly.</p>
          </div>
          <div className="p-4 border rounded-lg shadow-md transition transform hover:scale-100 scale-90 mt-4">
            <h3 className="text-xl font-bold">What types of goods can you store?</h3>
            <p className="mt-2 text-gray-700">We store a wide range of goods, including perishable items, electronics, and industrial products.</p>
          </div>
          <div className="p-4 border rounded-lg shadow-md transition transform hover:scale-100 scale-90 mt-4">
            <h3 className="text-xl font-bold">Do you offer international shipping?</h3>
            <p className="mt-2 text-gray-700">Yes, we offer international shipping services with reliable logistics solutions.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
