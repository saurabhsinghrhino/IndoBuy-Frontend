import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Hero animations
        gsap.fromTo(
          ".contact-hero-title",
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.2 },
        );
        gsap.fromTo(
          ".contact-hero-subtitle",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 },
        );

        // Contact cards stagger
        gsap.fromTo(
          ".contact-card",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".contact-cards-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // Form section
        gsap.fromTo(
          ".form-section-content",
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".form-section",
              start: "top 80%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // Info sidebar
        gsap.fromTo(
          ".info-sidebar",
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".form-section",
              start: "top 80%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // FAQ section
        gsap.fromTo(
          ".faq-item",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".faq-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // Map/Location
        gsap.fromTo(
          ".location-content",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".location-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );
      });

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(initTimer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email Us",
      desc: "We reply within 24 hours",
      value: "hello@indo-buy.com",
      action: "mailto:hello@indo-buy.com",
      color: "bg-black",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Call Us",
      desc: "Mon-Sat, 9am to 8pm IST",
      value: "+91 80 1234 5678",
      action: "tel:+918012345678",
      color: "bg-gray-800",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      title: "Live Chat",
      desc: "Instant support on WhatsApp",
      value: "Start Chat",
      action: "https://wa.me/918012345678",
      color: "bg-gray-700",
    },
  ];

  const faqs = [
    {
      q: "How do I track my order?",
      a: "Once your order ships, you'll receive an email and SMS with a tracking link. You can also track orders in real-time from your account dashboard under 'My Orders'.",
    },
    {
      q: "What is your return policy?",
      a: "We offer a 30-day hassle-free return policy. Items must be unused and in original packaging. Simply initiate a return from your account, and we'll arrange a free pickup.",
    },
    {
      q: "Do you ship to all cities in India?",
      a: "Yes! We deliver to all 28 states and 8 union territories. Metro cities enjoy same-day or next-day delivery, while tier-2/3 cities typically receive orders within 3-5 business days.",
    },
    {
      q: "How can I change or cancel my order?",
      a: "Orders can be modified or cancelled within 1 hour of placement. After that, if the order hasn't shipped, contact our support team and we'll do our best to accommodate.",
    },
    {
      q: "Are your products authentic?",
      a: "Absolutely. We source directly from brands and authorized distributors. Every product comes with a 100% authenticity guarantee and original brand warranty.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fefeff] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="px-5 pt-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#f0eeed] rounded-3xl p-8 md:p-16 shadow-lg shadow-gray-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-200 to-transparent rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-300 to-transparent rounded-full blur-2xl opacity-30" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                📬 Get in Touch
              </div>
              <h1 className="contact-hero-title font-sekuya text-5xl md:text-7xl font-bold text-black leading-tight mb-6">
                We'd Love to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">
                  Hear
                </span>{" "}
                From You
              </h1>
              <p className="contact-hero-subtitle text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Have a question, feedback, or just want to say hello? Our team
                is here to help you with anything you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="contact-cards-section px-5 py-8 bg-[#fefeff]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.action}
                className="contact-card group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className={`${method.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 font-sekuya">
                  {method.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{method.desc}</p>
                <p className="text-black font-medium group-hover:underline">
                  {method.value} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info Section */}
      <section className="form-section px-5 py-20 bg-[#f0eeed]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="form-section-content lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg shadow-gray-400">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 font-sekuya">
                    Send a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </div>

                {submitted ? (
                  <div className="bg-black text-white rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold mb-2 font-sekuya">
                      Message Sent!
                    </h3>
                    <p className="text-gray-300">
                      Thank you for reaching out. We'll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full px-5 py-4 rounded-xl bg-[#f0eeed] border-2 border-transparent focus:border-black focus:bg-white focus:outline-none transition-all duration-300 text-black placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="w-full px-5 py-4 rounded-xl bg-[#f0eeed] border-2 border-transparent focus:border-black focus:bg-white focus:outline-none transition-all duration-300 text-black placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl bg-[#f0eeed] border-2 border-transparent focus:border-black focus:bg-white focus:outline-none transition-all duration-300 text-black appearance-none cursor-pointer"
                      >
                        <option value="">Select a topic</option>
                        <option value="order">Order Inquiry</option>
                        <option value="returns">Returns & Refunds</option>
                        <option value="product">Product Question</option>
                        <option value="partnership">
                          Business Partnership
                        </option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Something Else</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        className="w-full px-5 py-4 rounded-xl bg-[#f0eeed] border-2 border-transparent focus:border-black focus:bg-white focus:outline-none transition-all duration-300 text-black placeholder-gray-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative overflow-hidden w-full md:w-auto bg-black text-white px-10 py-4 rounded-full font-medium transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin w-5 h-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                              →
                            </span>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="info-sidebar lg:col-span-2 space-y-6">
              {/* Office Hours */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-4 font-sekuya">
                  Office Hours
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between text-gray-600">
                    <span>Monday – Friday</span>
                    <span className="font-medium text-black">
                      9:00 AM – 8:00 PM
                    </span>
                  </li>
                  <li className="flex justify-between text-gray-600">
                    <span>Saturday</span>
                    <span className="font-medium text-black">
                      10:00 AM – 6:00 PM
                    </span>
                  </li>
                  <li className="flex justify-between text-gray-600">
                    <span>Sunday</span>
                    <span className="font-medium text-red-500">Closed</span>
                  </li>
                </ul>
              </div>

              {/* Response Time */}
              <div className="bg-black text-white rounded-2xl p-8 shadow-lg">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 font-sekuya">
                  Fast Response
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  We typically respond to all inquiries within 2-4 hours during
                  business hours.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400">
                    Support team online now
                  </span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-black mb-4 font-sekuya">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  {[
                    { label: "Track Your Order", path: "/orders" },
                    { label: "Return Policy", path: "/returns" },
                    { label: "Shipping Info", path: "/shipping" },
                    { label: "Size Guide", path: "/size-guide" },
                  ].map((link, i) => (
                    <li key={i}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="flex items-center justify-between w-full text-gray-600 hover:text-black transition-colors group"
                      >
                        <span className="text-sm">{link.label}</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section px-5 py-20 bg-[#fefeff]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              ❓ FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sekuya">
              Common Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Quick answers to things people often ask us
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="faq-item bg-[#f0eeed] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <span className="font-bold text-black pr-4 group-hover:text-gray-700 transition-colors">
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center transition-transform duration-300 ${
                      activeFaq === index ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    activeFaq === index ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-300 pt-4">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">Still have questions?</p>
            <button
              onClick={() => navigate("/help")}
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-300"
            >
              Visit Help Center →
            </button>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location-section px-5 py-20 bg-[#f0eeed]">
        <div className="max-w-7xl mx-auto">
          <div className="location-content bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-400">
            <div className="grid lg:grid-cols-2">
              {/* Map Placeholder */}
              <div className="relative min-h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40" />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-black font-sekuya">
                    Bangalore HQ
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Koramangala, Bangalore — 560034
                  </p>
                </div>
              </div>

              {/* Address Details */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 font-sekuya">
                  Visit Our Office
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-1">
                        Headquarters
                      </h4>
                      <p className="text-gray-600 text-sm">
                        42, 4th Cross Road, Koramangala 5th Block
                        <br />
                        Bangalore, Karnataka — 560034
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-1">Warehouse</h4>
                      <p className="text-gray-600 text-sm">
                        Indo-Buy Fulfillment Center
                        <br />
                        Whitefield, Bangalore — 560066
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-500 text-sm mb-4">
                      We welcome visitors! Please schedule an appointment
                      beforehand.
                    </p>
                    <button
                      onClick={() => navigate("/book-visit")}
                      className="group relative overflow-hidden bg-black text-white px-8 py-3 rounded-full font-medium transition-all duration-500 hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Schedule a Visit
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-5 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-gray-400">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-50" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-sekuya">
                Let's Build Something Together
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Whether you're a brand looking to partner or a customer with
                feedback — we're all ears.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/partners")}
                  className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Partner With Us
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </span>
                </button>
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-500"
                >
                  Back to Top
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-12 bg-[#f0eeed] border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-sekuya text-black">
                Indo-Buy
              </h3>
              <p className="text-gray-600 text-sm">
                Premium e-commerce experience for the modern Indian consumer.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-black cursor-pointer transition-colors">
                  New Arrivals
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Best Sellers
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Deals
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-black cursor-pointer transition-colors">
                  About Us
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Careers
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Press
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Connect</h4>
              <div className="flex gap-4">
                {["📱", "📧", "💬", "📸"].map((icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Indo-Buy. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <span className="hover:text-black cursor-pointer transition-colors">
                Privacy Policy
              </span>
              <span className="hover:text-black cursor-pointer transition-colors">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
