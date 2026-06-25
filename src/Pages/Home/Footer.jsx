import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-10 md:py-12">
      
      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 text-center sm:text-left">
          
          {/* Logo + Description */}
          <div>
            <h2 className="text-[#EE5E44] font-semibold text-lg mb-4">
              WanderLust
            </h2>
            <p className="text-gray-400 text-sm leading-6">
              Redefining the art of travel through seamless planning and curated
              experiences. Your horizon, our guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#EE5E44] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="cursor-pointer">About Us</li>
              <li className="cursor-pointer">Terms of Service</li>
              <li className="cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[#EE5E44] font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>Contact</li>
              <li>Support Center</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[#EE5E44] font-semibold mb-4">Newsletter</h3>

            <div className="flex items-center bg-white border rounded-full overflow-hidden w-full max-w-xs mx-auto sm:mx-0">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 text-sm outline-none flex-1"
              />
              <button className="bg-[#EE5E44] w-10 h-10 flex items-center justify-center rounded-full">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M7.10208 5.25H0V4.08333H7.10208L3.83542 0.816667L4.66667 0L9.33333 4.66667L4.66667 9.33333L3.83542 8.51667L7.10208 5.25Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t text-sm text-gray-400 gap-4">
          
          <p>© 2026 WanderLust</p>

          <div className="flex items-center gap-4">
            {/* Globe */}
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4812 2.19375 12.8062C1.51875 12.1312 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1312 1.51875 12.8062 2.19375C13.4812 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4812 12.1312 12.8062 12.8062C12.1312 13.4812 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15Z"
                fill="#94A3B8"
              />
            </svg>

            {/* Share */}
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none">
              <path
                d="M11.25 15C10.625 15 10.0938 14.7812 9.65625 14.3438C9.21875 13.9062 9 13.375 9 12.75C9 12.675 9.01875 12.5 9.05625 12.225L3.7875 9.15C3.5875 9.3375 3.35625 9.48438 3.09375 9.59062C2.83125 9.69687 2.55 9.75 2.25 9.75C1.625 9.75 1.09375 9.53125 0.65625 9.09375C0.21875 8.65625 0 8.125 0 7.5C0 6.875 0.21875 6.34375 0.65625 5.90625C1.09375 5.46875 1.625 5.25 2.25 5.25C2.55 5.25 2.83125 5.30313 3.09375 5.40938C3.35625 5.51562 3.5875 5.6625 3.7875 5.85L9.05625 2.775C9.03125 2.6875 9.01562 2.60312 9.00937 2.52187C9.00312 2.44062 9 2.35 9 2.25C9 1.625 9.21875 1.09375 9.65625 0.65625C10.0938 0.21875 10.625 0 11.25 0C11.875 0 12.4062 0.21875 12.8438 0.65625C13.2812 1.09375 13.5 1.625 13.5 2.25C13.5 2.875 13.2812 3.40625 12.8438 3.84375C12.4062 4.28125 11.875 4.5 11.25 4.5C10.95 4.5 10.6687 4.44687 10.4062 4.34062C10.1438 4.23438 9.9125 4.0875 9.7125 3.9L4.44375 6.975C4.46875 7.0625 4.48438 7.14687 4.49062 7.22813C4.49687 7.30938 4.5 7.4 4.5 7.5C4.5 7.6 4.49687 7.69062 4.49062 7.77187C4.48438 7.85313 4.46875 7.9375 4.44375 8.025L9.7125 11.1C9.9125 10.9125 10.1438 10.7656 10.4062 10.6594C10.6687 10.5531 10.95 10.5 11.25 10.5C11.875 10.5 12.4062 10.7188 12.8438 11.1562C13.2812 11.5938 13.5 12.125 13.5 12.75C13.5 13.375 13.2812 13.9062 12.8438 14.3438C12.4062 14.7812 11.875 15 11.25 15Z"
                fill="#94A3B8"
              />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;