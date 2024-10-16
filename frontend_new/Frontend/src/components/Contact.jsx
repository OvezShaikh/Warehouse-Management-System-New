import React, { useState } from 'react';
import Footer from './FooterComponent';
import { FaPhone } from "react-icons/fa6";
import { FaFax } from "react-icons/fa";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';


const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        sendCopy: false
    });

    const links = [
        { href: '#', label: 'Home' },
        { href: '#', label: 'About' },
        { href: '/contact-us', label: 'Contact' },
    ];

    const socialLinks = [
        { href: '#', label: 'LinkedIn', icon: <LinkedInIcon /> },
        { href: '#', label: 'Twitter', icon: <TwitterIcon /> },
        { href: '#', label: 'Facebook', icon: <FacebookIcon /> },
    ];

    const [formStatus, setFormStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log("Input changed:", name, value);
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send the data to the backend API
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setFormStatus({ type: 'success', message: 'Message sent successfully!' });
                setFormData({ name: '', email: '', message: '', sendCopy: true }); // Reset form after submission
            } else {
                setFormStatus({ type: 'error', message: result.message || 'Something went wrong!' });
            }
        } catch (error) {
            setFormStatus({ type: 'error', message: 'Error while sending the message!' });
        }
    };


    return (
        <section className="flex flex-col min-h-screen">
            <div id="map" className="relative h-[300px] overflow-hidden bg-cover bg-[50%] bg-no-repeat">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d561.9638679807683!2d73.79972439589594!3d18.644815529584687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b834124aa203%3A0x6c82c98c2c2120ea!2sUnoStar%20Value%20Chain%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1728908806439!5m2!1sen!2sin&gestureHandling=none"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    draggable="false"
                ></iframe>
            </div>

            <div className="container px-6 md:px-12 mb-20 flex justify-center items-center mx-auto">
                <div className="block rounded-lg bg-[hsla(0,0%,100%,0.8)] px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px] border border-gray-300">
                    <div className="flex flex-wrap">
                        <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
                            <form>
                                <div className="relative mb-6" data-te-input-wrapper-init>
                                    <input
                                        type="text"
                                        name="name"
                                        className="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <label
                                        className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary"
                                        htmlFor="exampleInput90"
                                    >
                                        Name
                                    </label>
                                </div>
                                <div className="relative mb-6" data-te-input-wrapper-init>
                                    <input
                                        type="email"
                                        name="email"
                                        className="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <label
                                        className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary"
                                        htmlFor="exampleInput91"
                                    >
                                        Email address
                                    </label>
                                </div>
                                <div className="relative mb-6" data-te-input-wrapper-init>
                                    <textarea
                                        id="message" // Changed the ID for clarity and reference
                                        className="peer block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all duration-200 ease-linear"
                                        name="message" // Ensure the name matches the form data key
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="3"
                                    />
                                    <label
                                        htmlFor="message" // Make sure this corresponds to the ID of the textarea
                                        className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary"
                                    >
                                        Message
                                    </label>
                                </div>
                                <div className="mb-6  min-h-[1.5rem] flex items-center">
                                    <input
                                        className="h-4 w-4 mr-2 border border-neutral-300 rounded-sm  outline-none"
                                        type="checkbox"
                                        name="sendCopy"
                                        checked={formData.sendCopy}
                                        onChange={handleChange}
                                    />
                                    <label className="text-sm text-neutral-700 hover:cursor-pointer" htmlFor="exampleCheck96">
                                        Send me a copy of this message
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="mb-6 w-full rounded bg-sky-500 text-white px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal lg:mb-0"
                                >
                                    Send
                                </button>

                                {formStatus && (
                                    <div className={`mt-4 p-2 text-center ${formStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {formStatus.message}
                                    </div>
                                )}

                            </form>
                        </div>
                        <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
                            <div className="flex flex-wrap">
                                <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:w-6/12">
                                    <div className="flex items-start">
                                        <div className="shrink-0">
                                            <div className="inline-block rounded-md bg-sky-200 p-4 text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-6 grow">
                                            <p className="mb-2 font-bold">Technical support</p>
                                            <a href="mailto:sales@unostar.in" className="text-sm text-neutral-500">
                                                sales@unostar.in
                                            </a>
                                            {/* <p className="text-sm text-neutral-500">020 - 27451946</p> */}

                                            <div className="flex flex-col space-y-4">
                                                {/* Phone Number */}
                                                <div className="flex items-center mt-2">
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path fillRule="evenodd" d="M2.7 5.4A17.5 17.5 0 0118.6 21.3c1.2-1.2 1.7-2.8 1.2-4.4l-1-3.5c-.3-1.2-1.5-2-2.8-1.8l-3.5.7a2 2 0 01-2.2-1l-1.7-2.6a2 2 0 00-2.2-1l-3.5.7c-1.5.3-2.7-1-2.8-2.5l-.2-2c-.1-1.5 1-2.8 2.5-3z" clipRule="evenodd" />
                                                    </svg> */}
                                                    <FaPhone />
                                                    <p className="text-sm text-neutral-500 ml-2">020 - 27451946</p>
                                                </div>

                                                {/* Fax Number */}
                                                <div className="flex items-center">
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path fillRule="evenodd" d="M6.75 3a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H6.75zM3.75 6A2.25 2.25 0 006 8.25v7.5A2.25 2.25 0 003.75 18H3a2.25 2.25 0 01-2.25-2.25v-6A2.25 2.25 0 013 7.5h.75zM9 12.75A.75.75 0 019 15h6a.75.75 0 000-1.5H9zm.75 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM9 9a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 019 9zm10.5-1.5h.75a2.25 2.25 0 012.25 2.25v6A2.25 2.25 0 0120.25 18h-.75a2.25 2.25 0 01-2.25-2.25v-7.5A2.25 2.25 0 0117.25 6z" clipRule="evenodd" />
                                                    </svg> */}
                                                    <FaFax />
                                                    <p className="text-sm text-neutral-500 ml-2">020 - 27451947</p>
                                                </div>
                                            </div>



                                        </div>
                                    </div>
                                </div>
                                <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:w-6/12">
                                    <div className="flex items-start">
                                        <div className="shrink-0">
                                            <div className="inline-block rounded-md bg-sky-200 p-4 text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-6 grow">
                                            <p className="mb-2 font-bold">Office address</p>
                                            <p className="text-sm text-neutral-500"> D-II Block, Plot No. SEI - 1/2,
                                                2nd Floor Opp. Dali & Sameer Co.
                                                Chinchwad MIDC</p>
                                            <p className="text-sm text-neutral-500">Pune - 411019 Maharashtra, India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <Footer />

        </section >
    );
};

export default ContactSection;
