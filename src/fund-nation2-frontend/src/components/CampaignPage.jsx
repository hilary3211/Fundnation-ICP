
import React, { useState ,useEffect} from 'react';
import { Link,NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const CampaignPage = () => {
  const [isType , setType] = useState(null)
  const navigate = useNavigate()
  return (
    <div className="">
<div className='hidden md:flex min-h-screen flex flex-col md:flex-row gap-8 p-8 bg-gray-50'>
<div className="w-full md:w-1/2 mt-28 md:mb-[500px]">
        <h1 className="text-2xl font-semibold mb-2" style={{color: "black"}}>Choose your campaign style</h1>
        <p className="text-gray-500 mb-6">What it&apos;s about your campaign?</p>
        
        <div className="flex gap-4 h-[400px]">
          {/* Donation Option */}
          <button onClick={() => {setType("Donation")}} className="flex flex-col items-left justify-end w-full h-full p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer" style ={{ borderColor: isType === "Donation" ? "rgba(112, 174, 18, 0.8)" : ""}}>
  <div className="w-12 h-12 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
  <img src="/assets/piggy-bank.svg" alt="Petition Icon" className="w-7 h-7" />
  </div>
  <h2 className="text-lg font-semibold" style={{ color : "black", fontSize: 20}}>Donation</h2>
  <p className="text-gray-500">Create a donation to receive funds</p>
</button>


          {/* Petition Option */}
          <button onClick={() => {setType("Petition")}} className="flex flex-col items-left justify-end w-full h-full p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer" style ={{ borderColor: isType === "Petition" ? "rgba(112, 174, 18, 0.8)" : ""}}>
  <div className="w-12 h-12 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
  <img src="/assets/file-signature.svg" alt="Petition Icon" className="w-7 h-7" />
  </div>
  <h2 className="text-lg font-semibold" style={{ color : "black", fontSize: 20}}>Petition</h2>
  <p className="text-gray-500 text-left">Create a petition to crowd signatures</p>
</button>

        </div>
        

         <div className="flex gap-4 mt-7 text-sm font-medium flex-wrap" style={{ width: "100%", alignSelf: "center",}}>
            <button
            disabled={!isType}
            //  to={{ pathname: `/campaign2/${isType}`}}
             onClick={() => {navigate(`/campaign2/${isType}`)}}
              type="submit"
              className="justify-center p-2.5 text-white bg-violet-800 rounded-lg"
              style={{ background: "linear-gradient(to right, rgba(112, 174, 18, 0.8), rgba(152, 224, 32, 0.8))",
              width: "100%", height: 50, borderRadius: 50,  marginTop: 32 , fontSize:20,  }}
            >
              Continue
            </button>


       
          </div>
      </div>


      <div className=" rounded-lg overflow-hidden" style={{ borderRadius: 20, marginTop : 200, width:"40%" ,height: "40%" }}>

      <img
        src="/assets/camp.svg"
        alt="Campaign background"
        className="w-full h-full object-contain"
      />
    </div>


</div>

<div className='md:hidden min-h-screen flex flex-col md:flex-row gap-8 p-8 bg-gray-50'>
<div style={{ height: 50}}></div>
  <div style={{ }}>
  <h1 className="text-2xl font-semibold mb-2" style={{color: "black", fontSize: 22}}>Choose your campaign style</h1>
        <p className="text-gray-500 mb-6">What it&apos;s about your campaign?</p>
  </div>




    <div className="w-full h-full rounded-lg overflow-hidden" style={{ borderRadius: 20, marginBottom: 100 }}>
      <img
        src="/assets/camp.svg"
        alt="Campaign background"
        className="w-full h-full object-contain"
      />
    </div>


<div className="w-full md:w-1/2  md:mb-[500px]" style={{marginTop: -100}}>

        
        <div className="flex gap-4 h-[300px]">
        
          <button onClick={() => {setType("Donation")}} className="flex flex-col items-left justify-end w-full h-full p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer" style ={{ borderColor: isType === "Donation" ? "rgba(112, 174, 18, 0.8)" : ""}}>
  <div className="w-9 h-9 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
  <img src="/assets/piggy-bank.svg" alt="Petition Icon" className="w-5 h-5" />
  </div>
  <h2 className="text-lg font-semibold" style={{ color : "black", fontSize: 18}}>Donation</h2>
  <p className="text-gray-500" style={{ fontSize: 14}}>Create a donation to receive funds</p>
</button>


          {/* Petition Option */}
          <button onClick={() => {setType("Petition")}} className="flex flex-col items-left justify-end w-full h-full p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer" style ={{ borderColor: isType === "Petition" ? "rgba(112, 174, 18, 0.8)" : ""}}>
  <div className="w-9 h-9 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
  <img src="/assets/file-signature.svg" alt="Petition Icon" className="w-5 h-5" />
  </div>
  <h2 className="text-lg font-semibold" style={{ color : "black", fontSize: 18}}>Petition</h2>
  <p className="text-gray-500" style={{ fontSize: 14}}>Create a petition to crowd signatures</p>
</button>

        </div>
        <div className="flex gap-4 mt-7 text-sm font-medium flex-wrap" style={{ width: "100%", alignSelf: "center",}}>
            <button
                         onClick={() => {navigate(`/campaign2/${isType}`)}}
              type="submit"
              className="justify-center p-2.5 text-white bg-violet-800 rounded-lg"
              style={{ background: "linear-gradient(to right, rgba(112, 174, 18, 0.8), rgba(152, 224, 32, 0.8))",
              width: "100%", height: 50, borderRadius: 50,  marginTop: 32  }}
            >
              Continue
            </button>


       
          </div>
    
      </div>


      
</div>


  
    </div>
  );
};

export default CampaignPage;
