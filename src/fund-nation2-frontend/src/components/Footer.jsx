import React from 'react';
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer className="bg-gray-100 py-8 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Column 1 */}
        {/* <div>
          <h3 className="text-lg font-semibold text-green-600">Home</h3>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>My favorites</li>
            <li>Recents</li>
          </ul>
        </div> */}

        {/* Column 2 */}
        {/* <div>
          <h3 className="text-lg font-semibold text-gray-800">Explore</h3>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>Lists</li>
            <li className="flex items-center">
              Maps
              <span className="bg-green-100 text-green-600 text-xs font-semibold ml-2 px-2 py-0.5 rounded-full">Soon</span>
            </li>
          </ul>
        </div> */}

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Campaigns</h3>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li  className='cursor-pointer' onClick={() => {navigate(`/`)}}>Home</li>
            <li className="flex items-center cursor-pointer" onClick={() => {navigate(`/explore`)}}>
              Explore
              {/* <span className="bg-green-100 text-green-600 text-xs font-semibold ml-2 px-2 py-0.5 rounded-full">12</span> */}
            </li>
            <li className="flex items-center cursor-pointer" onClick={() => {navigate(`/campaign`)}}>
               Campaigns
              {/* <span className="bg-green-100 text-green-600 text-xs font-semibold ml-2 px-2 py-0.5 rounded-full">4</span> */}
            </li>
            {/* <li>Analytics</li> */}
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li className='cursor-pointer' onClick={() => {navigate(`/profile`)}}>Settings</li>
            <li  onClick={() => {navigate(`/mycampaigns`)}} className="flex items-center cursor-pointer">
            My Campaigns
              <span className="bg-green-100 text-green-600 text-xs font-semibold ml-2 px-2 py-0.5 rounded-full">Hot</span>
            </li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Resources</h3>
          <ul  className="mt-2 space-y-1 text-gray-700">
            {/* <li>How to use Crowdfy</li> */}
            {/* <li>Docs</li> */}
            <li>Legal Terms  <span className="bg-green-100 text-green-600 text-xs font-semibold ml-2 px-2 py-0.5 rounded-full">Soon</span></li>
            <li>Blog  <span className="bg-green-100 text-green-600 text-xs font-semibold ml-2 px-2 py-0.5 rounded-full">Soon</span></li>
            <li>Merch  <span className="bg-green-100 text-green-600 text-xs font-semibold ml-2 px-2 py-0.5 rounded-full">Soon</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 border-t border-gray-300 pt-4 text-gray-600 text-sm">
        <div className="flex items-center space-x-0">
          <img src="/assets/logo.svg" alt="Crowdfy Logo" className="h-25 w-25" />
          <span className="font-bold text-gray-800">und nation</span>
        </div>
        <p className="mt-4 sm:mt-0">&copy; 2024 Fundnation. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
