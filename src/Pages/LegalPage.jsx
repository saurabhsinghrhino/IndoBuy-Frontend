import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Shield,
  FileText,
  Lock,
  Eye,
  Share2,
  Cookie,
  Mail,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ============================================
// LEGAL PAGE COMPONENT - Main container for Terms & Privacy
// ============================================
const LegalPage = () => {
  // State to track which policy is active: 'terms' or 'privacy'
  const [activePolicy, setActivePolicy] = useState("terms");

  // State for mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  // ============================================
  // USEEFFECT - Initialize GSAP animations on mount
  // ============================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation: slides down from top with fade
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Content sections stagger animation
      // Each section fades in as user scrolls
      gsap.from(".policy-section", {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Sidebar items animation
      gsap.from(".sidebar-item", {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.3,
      });
    });

    // Cleanup GSAP animations on unmount
    return () => ctx.revert();
  }, [activePolicy]); // Re-run when policy changes

  // ============================================
  // HANDLE POLICY SWITCH - Updates active tab and scrolls to top
  // ============================================
  const handlePolicyChange = (policy) => {
    setActivePolicy(policy);
    // Close mobile sidebar after selection
    setSidebarOpen(false);
    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fefeff]">
      {/* Navigation Header - Matches your navbar styling */}
      <div ref={headerRef} className="sticky top-0 z-50 bg-[#fefeff]">
        <div className="p-4 md:p-5">
          <nav className="bg-[#f0eeed] p-4 md:p-5 rounded-3xl flex items-center justify-between shadow-lg shadow-gray-400 max-w-7xl mx-auto">
            {/* Back button to return to homepage */}
            <a
              href="/"
              className="flex items-center gap-2 text-black hover:bg-black py-2.5 px-4 rounded-full hover:text-white transition-all duration-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Back to Home</span>
            </a>

            {/* Page Title */}
            <h1 className="text-xl md:text-2xl font-bold font-sekuya text-black">
              Legal Information
            </h1>

            {/* Desktop Tab Switcher - Matches your navbar button style */}
            <div className="hidden md:flex bg-white rounded-full p-1 shadow-inner">
              <button
                onClick={() => handlePolicyChange("terms")}
                className={`px-6 py-2.5 rounded-full text-sm cursor-pointer font-medium transition-all duration-700 ${
                  activePolicy === "terms"
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Terms
              </button>
              <button
                onClick={() => handlePolicyChange("privacy")}
                className={`px-6 py-2.5 rounded-full text-sm cursor-pointer font-medium transition-all duration-700 ${
                  activePolicy === "privacy"
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Privacy
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-black hover:text-white transition-all duration-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FileText className="w-6 h-6" />
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Tab Switcher - Only visible on small screens */}
      <div className="md:hidden px-4 pb-4">
        <div className="bg-[#f0eeed] rounded-2xl p-1.5 flex shadow-md shadow-gray-400">
          <button
            onClick={() => handlePolicyChange("terms")}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-700 ${
              activePolicy === "terms"
                ? "bg-black text-white shadow-lg"
                : "text-gray-600"
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => handlePolicyChange("privacy")}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-700 ${
              activePolicy === "privacy"
                ? "bg-black text-white shadow-lg"
                : "text-gray-600"
            }`}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-5 pb-20">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* LEFT SIDEBAR - Quick Navigation */}
          {/* Sticky sidebar that follows scroll on desktop */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-32 space-y-4">
              {/* Sidebar Card with warm gray background */}
              <div className="bg-[#f0eeed] rounded-3xl p-6 shadow-lg shadow-gray-400">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  {activePolicy === "terms" ? (
                    <>
                      <FileText className="w-5 h-5" />
                      Terms Sections
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Privacy Sections
                    </>
                  )}
                </h3>

                {/* Dynamic sidebar links based on active policy */}
                <nav className="space-y-2">
                  {(activePolicy === "terms"
                    ? termsSections
                    : privacySections
                  ).map((section, index) => (
                    <a
                      key={index}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 p-3 rounded-2xl text-sm text-gray-700 hover:bg-white hover:shadow-md transition-all duration-500 group"
                    >
                      <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black shadow-sm group-hover:bg-black group-hover:text-white transition-colors duration-300">
                        {index + 1}
                      </span>
                      <span className="flex-1">{section.title}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Contact Card */}
              <div className="bg-black rounded-3xl p-6 shadow-lg shadow-gray-400 text-white">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Questions?
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                  Contact our legal team for clarifications.
                </p>
                <a
                  href="mailto:legal@indobuy.com"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                >
                  legal@indobuy.com →
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT AREA - Main Policy Content */}
          <main ref={contentRef} className="flex-1 lg:w-3/4">
            <div className="bg-[#f0eeed] rounded-3xl shadow-lg shadow-gray-400 overflow-hidden">
              {/* Content Header with Icon */}
              <div className="bg-black text-white p-8 md:p-12 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-800/50 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-4 backdrop-blur-sm">
                    {activePolicy === "terms" ? (
                      <>
                        <FileText className="w-4 h-4" />
                        Last Updated: April 16, 2026
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Effective Date: April 16, 2026
                      </>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 font-sekuya">
                    {activePolicy === "terms"
                      ? "Terms & Conditions"
                      : "Privacy Policy"}
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                    {activePolicy === "terms"
                      ? "Please read these terms carefully before using our platform. By accessing Indo-Buy, you agree to be bound by these terms."
                      : "Your privacy is important to us. This policy explains how we collect, use, and protect your personal information."}
                  </p>
                </div>
              </div>

              {/* Scrollable Content Sections */}
              <div className="p-6 md:p-12 space-y-12">
                {activePolicy === "terms" ? (
                  <TermsContent />
                ) : (
                  <PrivacyContent />
                )}
              </div>

              {/* Footer Acceptance Section */}
              <div className="p-6 md:p-8 bg-white border-t border-gray-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600 text-center md:text-left">
                    By using Indo-Buy, you acknowledge that you have read and
                    understood our policies.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:border-black hover:text-black transition-all duration-500 cursor-pointer"
                    >
                      Print / Save PDF
                    </button>
                    <a
                      href="/"
                      className="px-6 py-3 rounded-full bg-black text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-700 cursor-pointer flex items-center"
                    >
                      Continue Shopping
                      <span>
                        <ShoppingCart />{" "}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TERMS CONTENT COMPONENT - All Terms & Conditions sections
// ============================================
const TermsContent = () => {
  return (
    <>
      {termsSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="policy-section scroll-mt-32"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shrink-0">
              {section.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black mb-2">
                {section.title}
              </h3>
              <div className="h-1 w-20 bg-black rounded-full" />
            </div>
          </div>

          <div className="pl-16 space-y-4 text-gray-700 leading-relaxed">
            {section.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-base md:text-lg">
                {paragraph}
              </p>
            ))}

            {/* Render subsections if they exist */}
            {section.subsections && (
              <ul className="space-y-3 mt-4">
                {section.subsections.map((sub, sIndex) => (
                  <li key={sIndex} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-black mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-black block mb-1">
                        {sub.title}
                      </strong>
                      <span className="text-gray-600">{sub.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </>
  );
};

// ============================================
// PRIVACY CONTENT COMPONENT - All Privacy Policy sections
// ============================================
const PrivacyContent = () => {
  return (
    <>
      {privacySections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="policy-section scroll-mt-32"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shrink-0">
              {section.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black mb-2">
                {section.title}
              </h3>
              <div className="h-1 w-20 bg-black rounded-full" />
            </div>
          </div>

          <div className="pl-16 space-y-4 text-gray-700 leading-relaxed">
            {section.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-base md:text-lg">
                {paragraph}
              </p>
            ))}

            {/* Special rendering for data table in section 2 */}
            {section.dataTable && (
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-md">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="pb-3 font-bold text-black">Data Type</th>
                      <th className="pb-3 font-bold text-black">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {section.dataTable.map((row, rIndex) => (
                      <tr
                        key={rIndex}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-3 font-medium">{row.type}</td>
                        <td className="py-3 text-gray-600">{row.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
};

// ============================================
// DATA STRUCTURES - Sections for Terms & Privacy
// ============================================

// Terms & Conditions sections data
const termsSections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: "✓",
    content: [
      "Welcome to Indo-Buy. By accessing or using our website, mobile applications, or any related services (collectively, the 'Services'), you agree to be bound by these Terms and Conditions ('Terms'). If you do not agree to these Terms, please do not use our Services.",
      "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the site. Your continued use of the Services following any changes indicates your acceptance of the new Terms.",
    ],
  },
  {
    id: "eligibility",
    title: "User Eligibility",
    icon: "👤",
    content: [
      "You must be at least 18 years old or the age of majority in your jurisdiction to use our Services. By using Indo-Buy, you represent and warrant that you meet these eligibility requirements.",
      "If you are using our Services on behalf of a business or entity, you represent that you have authority to bind that entity to these Terms.",
    ],
    subsections: [
      {
        title: "Account Registration",
        desc: "You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.",
      },
      {
        title: "Account Security",
        desc: "You agree to notify us immediately of any unauthorized access to or use of your account. Indo-Buy is not liable for any loss or damage arising from your failure to secure your account.",
      },
    ],
  },
  {
    id: "purchases",
    title: "Purchases & Payments",
    icon: "💳",
    content: [
      "All purchases made through Indo-Buy are subject to our acceptance. We reserve the right to refuse or cancel any order for any reason, including product availability, errors in product or pricing information, or suspected fraud.",
      "Prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. Shipping costs are calculated at checkout based on your location and selected delivery method.",
    ],
    subsections: [
      {
        title: "Payment Methods",
        desc: "We accept UPI, credit/debit cards, net banking, and select digital wallets. All payments are processed through secure, encrypted channels.",
      },
      {
        title: "Pricing Errors",
        desc: "In the event of a pricing error, we reserve the right to cancel orders placed at the incorrect price and refund any amounts paid.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: "🚚",
    content: [
      "Indo-Buy aims to deliver products within the estimated timeframes provided at checkout. However, delivery dates are estimates and not guaranteed. We are not responsible for delays caused by circumstances beyond our control.",
      "Risk of loss and title for items pass to you upon delivery to the carrier. You are responsible for filing any claims with carriers for damaged or lost shipments.",
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    icon: "↩️",
    content: [
      "We offer a 30-day return policy for most items. Products must be unused, in original packaging, and accompanied by proof of purchase. Certain items such as perishables, intimate apparel, and personalized products are non-returnable.",
      "Refunds will be processed to the original payment method within 7-10 business days of receiving the returned item. Shipping costs for returns are the customer's responsibility unless the item is defective or incorrect.",
    ],
  },
  {
    id: "intellectual",
    title: "Intellectual Property",
    icon: "©️",
    content: [
      "All content on Indo-Buy, including text, graphics, logos, images, and software, is the property of Indo-Buy or its content suppliers and is protected by Indian and international copyright laws.",
      "You may not reproduce, distribute, modify, or create derivative works from any content without express written permission from Indo-Buy.",
    ],
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    icon: "⚠️",
    content: [
      "To the fullest extent permitted by law, Indo-Buy shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Services.",
      "Our total liability to you for any claim arising from these Terms or your use of the Services shall not exceed the amount you paid to Indo-Buy in the six months preceding the claim.",
    ],
  },
  {
    id: "governing",
    title: "Governing Law",
    icon: "⚖️",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.",
      "Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in [Your City], India.",
    ],
  },
];

// Privacy Policy sections data
const privacySections = [
  {
    id: "introduction",
    title: "Introduction",
    icon: "📋",
    content: [
      "At Indo-Buy, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.",
      "By accessing or using our Services, you consent to the practices described in this Privacy Policy. We encourage you to read this document carefully to understand our views and practices regarding your personal data.",
    ],
  },
  {
    id: "collection",
    title: "Information We Collect",
    icon: "📊",
    content: [
      "We collect several types of information from and about users of our Services. This includes information you provide directly, data collected automatically, and information from third-party sources.",
    ],
    dataTable: [
      {
        type: "Personal Identifiers",
        purpose:
          "Name, email, phone number for account creation and order processing",
      },
      {
        type: "Payment Information",
        purpose:
          "Encrypted card details and UPI IDs for transaction processing",
      },
      {
        type: "Device Information",
        purpose:
          "IP address, browser type, and device identifiers for security",
      },
      {
        type: "Usage Data",
        purpose:
          "Browsing history and purchase patterns to improve recommendations",
      },
      {
        type: "Location Data",
        purpose: "Shipping address and geolocation for delivery optimization",
      },
    ],
  },
  {
    id: "usage",
    title: "How We Use Your Information",
    icon: "🎯",
    content: [
      "We use the information we collect about you for various purposes, including to provide and improve our Services, process transactions, communicate with you, and ensure platform security.",
    ],
    subsections: [
      {
        title: "Service Provision",
        desc: "To process orders, manage your account, and provide customer support.",
      },
      {
        title: "Personalization",
        desc: "To recommend products, customize content, and enhance your shopping experience.",
      },
      {
        title: "Marketing",
        desc: "To send promotional offers and updates (with your consent, which can be withdrawn anytime).",
      },
      {
        title: "Security",
        desc: "To detect fraud, prevent abuse, and protect the rights of users and Indo-Buy.",
      },
    ],
  },
  {
    id: "sharing",
    title: "Information Sharing",
    icon: "🤝",
    content: [
      "We do not sell your personal information to third parties. We may share your data with trusted partners who assist us in operating our website, conducting business, or servicing you, provided they agree to keep this information confidential.",
      "We may also disclose information when required by law, to enforce our site policies, or to protect our rights, property, or safety.",
    ],
    subsections: [
      {
        title: "Service Providers",
        desc: "Payment processors, shipping partners, and cloud hosting services.",
      },
      {
        title: "Business Transfers",
        desc: "In connection with a merger, acquisition, or sale of assets.",
      },
      {
        title: "Legal Requirements",
        desc: "When compelled by court order, law, or government regulation.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: "🍪",
    content: [
      "Indo-Buy uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. Cookies are small data files stored on your device.",
      "You can choose to disable cookies through your browser settings, but this may affect the functionality of our Services.",
    ],
    subsections: [
      {
        title: "Essential Cookies",
        desc: "Required for basic site functionality like shopping cart and login sessions.",
      },
      {
        title: "Analytics Cookies",
        desc: "Help us understand how visitors interact with our website.",
      },
      {
        title: "Marketing Cookies",
        desc: "Used to deliver relevant advertisements and track ad performance.",
      },
    ],
  },
  {
    id: "security",
    title: "Data Security",
    icon: "🔒",
    content: [
      "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption, regular security audits, and strict access controls.",
      "While we strive to use commercially acceptable means to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: "⏱️",
    content: [
      "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.",
      "Account information is retained until you request deletion or close your account. Transaction records are kept for 7 years as required by Indian tax laws.",
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: "✋",
    content: [
      "Under applicable data protection laws, you have certain rights regarding your personal information. These include the right to access, correct, delete, or restrict processing of your data.",
    ],
    subsections: [
      {
        title: "Access & Portability",
        desc: "Request a copy of your personal data in a structured, machine-readable format.",
      },
      {
        title: "Correction",
        desc: "Update or correct inaccurate or incomplete information.",
      },
      {
        title: "Deletion",
        desc: "Request deletion of your personal data, subject to legal obligations.",
      },
      {
        title: "Opt-out",
        desc: "Unsubscribe from marketing communications at any time.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: "📧",
    content: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer.",
      "Email: privacy@indobuy.com",
      "Address: Indo-Buy Legal Department, Lucknow U.P, India",
      "We aim to respond to all inquiries within 48 hours.",
    ],
  },
];

export default LegalPage;
