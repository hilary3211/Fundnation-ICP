import React from 'react';
import { Link,NavLink } from "react-router-dom";
// import image4 from '../../public/assets/image4.svg'


const CampaignPage = () => {

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <div
  className="hidden md:flex  w-full min-h-screen bg-cover bg-center relative"
  style={{ backgroundImage: `url(/assets/Image4.jpg)` }}

>


  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 ">
    <h1
      className="text-white font-bold text-center mb-4 leading-tight"
      style={{ fontSize: 49, marginTop: -200 }}
    >
      Solve problems all around the world
    </h1>
    <p
      className="text-white text-base md:text-lg text-center mb-6"
      style={{ marginTop: 80 }}
    >
      Fund and sign campaigns and missions in all the 234 countries on the globe
    </p>
    <Link  to={"/campaign"} className="bg-green-500 text-white px-4 py-2 md:px-6 md:py-2 rounded-full mb-4">
      Get Started
    </Link>
   
  </div>


  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-8 bg-white shadow-lg rounded-lg p-4 md:p-6 w-full max-w-lg" style={{bottom: -50}}>
   


      <div className="flex items-center mb-4">
        <img src="/assets/profile.JPG" alt="Profile" className="w-14 h-14 rounded-full border-2 border-green-400 mr-4" />
        <h2 className="text-xl font-bold leading-tight" style={{color:"black"}}>Help us Teach English for Kids on China Countryside</h2>
      </div>


      <p className="text-gray-700 text-sm mb-6">
        I need about <span className="font-bold">9,000 signatures</span> to deliver to my mayor in two weeks and get that grant!
        Check more about our project and if you want to see how we are changing lovely children’s lives on China countryside
        just teaching how they can use the internet.
      </p>


      <div className="flex items-center mb-4">
        <img src="/assets/profile.JPG" alt="Mateus Rodrigues" className="w-8 h-8 rounded-full border-2 border-green-400 mr-2" />
        <div className="flex items-center text-gray-700 text-sm mr-14">
          <span className="font-semibold">Hillary Ogbodo</span>
          <span className="mx-2"> <img src="/assets/loc.svg" alt="Profile" className="w-5 h-5  mr-1" /></span>
          <span>Abuja, Nigeria</span>
        </div>
        <button disabled className="bg-green-400  text-white text-sm px-4 py-2 rounded-full shadow" style={{borderRadius:12}}>
          Sign campaign
        </button>
      </div>

   
      <div className="flex items-center mb-4">
       
         <img src="/assets/Avatar.svg" alt="Supporter 1" className="w-70 h-8 rounded-full border border-white" />
       
      </div>

      <div className="flex items-center mb-4 gap-20" >
      <div className="w-full bg-gray-200 rounded-full h-2 " style={{maxWidth:300}}>
        <div className="bg-green-400 h-2 rounded-full" style={{ width: '40%' }}></div>
      </div>
         <div className="text-gray-700 font-semibold" style={{fontSize:16}}>4,533/9,000</div>
      </div>

     
      <div className="mt-6 text-gray-700 text-sm">
        <strong>Roadmap</strong> <span className="text-gray-500">(Coming Soon)</span>
      </div>

  </div>


</div>



<div
  className="md:hidden  w-full min-h-screen bg-cover bg-center relative"
  style={{ backgroundImage: `url(/assets/Image4.jpg)` }}

>
  {/* Hero Section */}
  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 ">
    <h1
      className="text-white font-bold text-center mb-4 leading-tight"
      style={{ fontSize: 29, marginTop: -170 }}
    >
      Solve problems all around the world
    </h1>
    <p
      className="text-white text-base md:text-lg text-center mb-6"
      style={{ marginTop: 20 }}
    >
      Fund and sign campaigns and missions in all the 234 countries on the globe
    </p>
    <Link to={"/campaign"} className="bg-green-500 text-white px-4 py-2 md:px-6 md:py-2 rounded-full mb-4">
      Get Started
    </Link>
    {/* <p className="text-white text-sm md:text-base">
      Already have an account? <span className="underline cursor-pointer">Log in</span>
    </p> */}
  </div>


</div>

<div className="md:hidden relative mb-8 bg-white shadow-lg rounded-lg p-4 md:p-6 w-full max-w-lg"   style={{marginTop: -250, width: "90%"}}>
   

   {/* Header */}
   <div className="flex items-center mb-4">
     <img src="/assets/profile.JPG" alt="Profile" className="w-14 h-14 rounded-full border-2 border-green-400 mr-4" />
     <h2 className="text-xl font-bold leading-tight" style={{color:"black"}}>Help us Teach English for Kids on Nigeria Countryside</h2>
   </div>

   {/* Description */}
   <p className="text-gray-700 text-sm mb-6">
     I need about <span className="font-bold">9,000 signatures</span> to deliver to my mayor in two weeks and get that grant!
     Check more about our project and if you want to see how we are changing lovely children’s lives on China countryside
     just teaching how they can use the internet.
   </p>

   {/* User Info */}
   <div className="flex flex-col md:flex-row items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
  {/* Profile Image */}
  <img src="/assets/profile.JPG" alt="Mateus Rodrigues" className="w-8 h-8 rounded-full border-2 border-green-400" />

  {/* User Info */}
  <div className="flex flex-col md:flex-row items-center text-gray-700 text-sm space-y-2 md:space-y-0 md:space-x-2">
    <span className="font-semibold">Hillary Ogbodo</span>
    <span className="flex items-center">
      <img src="/assets/loc.svg" alt="Location" className="w-5 h-5 mr-1" />
      <span>Abuja, Nigeria</span>
    </span>
  </div>

  {/* Sign Campaign Button */}
  <button
    disabled
    className="bg-green-400 text-white text-sm px-4 py-2 rounded-full shadow w-full md:w-auto"
    style={{ borderRadius: 12 }}
  >
    Sign campaign
  </button>
</div>


   {/* Supporters */}
   <div className="flex items-center mb-4">
     {/* <div className="flex -space-x-2">
       <img src="/path-to-avatar1.jpg" alt="Supporter 1" className="w-8 h-8 rounded-full border border-white" />
       <img src="/path-to-avatar2.jpg" alt="Supporter 2" className="w-8 h-8 rounded-full border border-white" />
       <img src="/path-to-avatar3.jpg" alt="Supporter 3" className="w-8 h-8 rounded-full border border-white" />
       <img src="/path-to-avatar4.jpg" alt="Supporter 4" className="w-8 h-8 rounded-full border border-white" />
     
       <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-xs">+99</div>
     </div> */}
      <img src="/assets/Avatar.svg" alt="Supporter 1" className="w-70 h-8 rounded-full border border-white" />
    
   </div>

   <div className="flex items-center mb-4 gap-10" >
   <div className="w-full bg-gray-200 rounded-full h-2 " >
     <div className="bg-green-400 h-2 rounded-full" style={{ width: '40%' }}></div>
   </div>
      <div className="text-gray-700 font-semibold" style={{fontSize:16}}>4,533/9,000</div>
   </div>

  
   <div className="mt-6 text-gray-700 text-sm">
     <strong>Roadmap</strong> <span className="text-gray-500">(Coming Soon)</span>
   </div>

</div>


  
    </div>
  );
};

export default CampaignPage;




