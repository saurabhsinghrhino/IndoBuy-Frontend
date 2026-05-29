import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const initTimer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Hero entrance
        gsap.fromTo(
          ".about-hero-title",
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.2 },
        );
        gsap.fromTo(
          ".about-hero-subtitle",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 },
        );

        // Story section
        gsap.fromTo(
          ".story-image",
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".story-section",
              start: "top 80%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );
        gsap.fromTo(
          ".story-content",
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".story-section",
              start: "top 80%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // Values cards stagger
        gsap.fromTo(
          ".value-card",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".values-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // Team cards
        gsap.fromTo(
          ".team-card",
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".team-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // Stats counter animation
        gsap.fromTo(
          ".stat-number",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".stats-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // Timeline
        gsap.fromTo(
          ".timeline-item",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".timeline-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // CTA
        gsap.fromTo(
          ".about-cta-content",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".about-cta-section",
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

  const values = [
    {
      icon: "🎯",
      title: "Customer First",
      desc: "Every decision we make starts with you. Your satisfaction drives our innovation.",
    },
    {
      icon: "🌱",
      title: "Sustainable Future",
      desc: "Eco-friendly packaging and carbon-neutral delivery for a greener tomorrow.",
    },
    {
      icon: "⚡",
      title: "Speed & Quality",
      desc: "Lightning-fast delivery without compromising on product excellence.",
    },
    {
      icon: "🤝",
      title: "Transparency",
      desc: "Honest pricing, real reviews, and open communication at every step.",
    },
  ];

  const team = [
    {
      name: "Aarav Sharma",
      role: "Founder & CEO",
      image:
        "https://thumbs.dreamstime.com/b/happy-bearded-indian-business-man-leader-standing-office-headshot-portrait-looking-camera-hallway-professional-smiling-297664384.jpg",
      bio: "Former Amazon India PM turned entrepreneur. Aarav founded Indo-Buy in 2020 with a vision to democratize premium living for Indian households. He holds an MBA from IIM Bangalore and previously scaled two D2C brands to ₹50Cr ARR.",
      expertise: ["Strategy", "Growth", "Leadership"],
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Priya Patel",
      role: "Head of Design",
      image:
        "https://www.shutterstock.com/image-photo/closeup-headshot-face-portrait-beautiful-260nw-2491646077.jpg",
      bio: "NID Ahmedabad graduate with 8+ years in UX/UI. Priya leads our design philosophy of 'functional beauty' — creating interfaces that feel intuitive yet visually stunning. Previously designed for Flipkart and Myntra.",
      expertise: ["UX/UI", "Branding", "Product Design"],
      social: { linkedin: "#", dribbble: "#" },
    },
    {
      name: "Rohan Gupta",
      role: "CTO & Operations Lead",
      image:
        "https://www.shutterstock.com/image-photo/portrait-developer-programming-technology-career-260nw-2687458625.jpg",
      bio: "IIT Delhi CS alum and ex-Microsoft engineer. Rohan built our entire logistics tech stack from scratch, enabling same-day delivery across metros. He's obsessed with optimizing every microsecond of the user journey.",
      expertise: ["Engineering", "Logistics", "AI/ML"],
      social: { linkedin: "#", github: "#" },
    },
    {
      name: "Neha Reddy",
      role: "VP Customer Success",
      image:
        "https://media.istockphoto.com/id/1299077582/photo/positivity-puts-you-in-a-position-of-power.jpg?s=612x612&w=0&k=20&c=baDuyrwRTscUZzyAqV44hnCq7d6tXUqwf26lJTcAE0A=",
      bio: "Customer experience veteran with stints at Zomato and Ola. Neha built our 24/7 support team and maintains our 4.9★ rating. She personally reads every piece of customer feedback — yes, all 50,000+ of them.",
      expertise: ["CX", "Team Building", "Retention"],
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  const timeline = [
    {
      year: "2020",
      title: "The Beginning",
      desc: "Started from a small apartment in Bangalore with a dream to revolutionize Indian e-commerce.",
    },
    {
      year: "2021",
      title: "First 10K Customers",
      desc: "Reached our first milestone, proving that quality and trust matter most.",
    },
    {
      year: "2022",
      title: "Pan-India Expansion",
      desc: "Expanded operations to all 28 states with same-day delivery in metro cities.",
    },
    {
      year: "2023",
      title: "Sustainability Initiative",
      desc: "Launched 100% eco-friendly packaging and carbon-neutral shipping.",
    },
    {
      year: "2024",
      title: "Community of 50K+",
      desc: "Celebrating 50,000 happy customers and counting. The journey continues.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fefeff] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="px-5 pt-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#f0eeed] rounded-3xl p-8 md:p-16 shadow-lg shadow-gray-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-200 to-transparent rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-300 to-transparent rounded-full blur-2xl opacity-30" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                🚀 Our Story
              </div>
              <h1 className="about-hero-title font-sekuya text-5xl md:text-7xl font-bold text-black leading-tight mb-6">
                Crafting{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">
                  Excellence
                </span>{" "}
                Since 2020
              </h1>
              <p className="about-hero-subtitle text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We believe shopping should be effortless, enjoyable, and
                trustworthy. From a small idea to India's most loved e-commerce
                destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section px-5 py-16 bg-[#fefeff]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "10K+", label: "Products Listed" },
              { value: "28", label: "States Covered" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className="stat-number text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <p className="text-4xl md:text-5xl font-bold text-black mb-2 font-sekuya">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="story-section px-5 py-20 bg-[#f0eeed]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="story-image relative">
              <div className="bg-white rounded-3xl p-6 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-9xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80"
                    alt="Our Office"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-black text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
                  Est. 2020
                </div>
              </div>
            </div>

            <div className="story-content space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-black font-sekuya leading-tight">
                From a Small Apartment to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">
                  Pan-India
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                What started as a weekend project in a Bangalore apartment has
                grown into one of India's most trusted e-commerce platforms. We
                saw a gap — a need for curated, high-quality products with
                transparent pricing and genuine customer care.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, Indo-Buy serves over 50,000 customers across all 28
                states, but our mission remains the same: to make premium living
                accessible to every Indian household.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => navigate("/products")}
                  className="group relative overflow-hidden bg-black text-white px-8 py-4 rounded-full font-medium transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Collection
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section px-5 py-20 bg-[#fefeff]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              💎 What Drives Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sekuya">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card bg-[#f0eeed] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-sekuya">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section px-5 py-20 bg-[#f0eeed]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              📅 Timeline
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-sekuya">
              Our Journey
            </h2>
            <p className="text-gray-600 text-lg">
              Milestones that shaped who we are today
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gray-300" />

            {timeline.map((item, index) => (
              <div
                key={index}
                className={`timeline-item relative flex items-start gap-8 mb-12 last:mb-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full border-4 border-[#f0eeed] z-10" />

                {/* Content */}
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                  }`}
                >
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500">
                    <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold text-black mb-2 font-sekuya">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - ENHANCED */}
      <section className="team-section px-5 py-20 bg-[#fefeff]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              👥 The People
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sekuya">
              Meet the Team
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Passionate individuals working to deliver the best experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="team-card group bg-[#f0eeed] rounded-3xl overflow-hidden shadow-md hover:shadow-xl shadow-gray-400 transition-all duration-700"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Container */}
                  <div className="md:w-2/5 relative overflow-hidden">
                    <div className="aspect-square md:aspect-auto md:h-full bg-gradient-to-b from-gray-50 to-[#f0eeed]">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    {/* Hover Overlay with Social */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
                      <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </button>
                      <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-black mb-1 font-sekuya">
                        {member.name}
                      </h3>
                      <p className="text-black/70 text-sm font-medium uppercase tracking-wider">
                        {member.role}
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {member.bio}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-black text-white text-xs rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="border-l-2 border-black pl-4 mt-2">
                      <p className="text-gray-500 text-xs italic">
                        "
                        {index === 0
                          ? "Build something people love, and they'll never leave."
                          : index === 1
                            ? "Design is not just what it looks like — it's how it works."
                            : index === 2
                              ? "Every millisecond matters. Speed is a feature."
                              : "Happy customers don't just come back, they bring friends."}
                        "
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section px-5 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="about-cta-content bg-black rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-gray-400">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-50" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-sekuya">
                Be Part of Our Story
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join 50,000+ customers who trust Indo-Buy for their lifestyle
                needs. Quality products, honest prices, real people.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/products")}
                  className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Shopping
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-500"
                >
                  Contact Us
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

export default AboutPage;
