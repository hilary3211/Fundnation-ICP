import React, { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Circles } from 'react-loader-spinner'
import {  idlFactory, canisterId } from "declarations/fund-nation2-backend";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";


const Camprof = () => {
  const [proncipal, setproncipal] = useState(null);
  const [proncipal2, setproncipal2] = useState(null);
  const [funding , setfunding] = useState('1')
  const [words, setwords] = useState('')
  const [loading, setLoading] = useState(false); 
  const [isdonate , setisdonate] = useState(false)
  const [dons , setdons] = useState([])
  function getTextAfterHyphen(str) {
    if (str.includes('-')) {
      //setisdonate(false)
      return str.split('-')[1];
    } 
    
   // setisdonate(true)
    return str; 
   
  }

  const navigate = useNavigate()

  async function handleAuthenticated(data) {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const userPrincipal = identity.getPrincipal().toString();
    setproncipal(userPrincipal)
    setproncipal2(identity.getPrincipal())
    if(data === userPrincipal){
      setisdonate(false)
    }else{
      setisdonate(true)
    }
    console.log("Authenticated user principal:", userPrincipal);
   
  }


    function getTokenType(project) {
      if (project && project.token && Array.isArray(project.token) && project.token.length > 0) {
        const tokenVariant = project.token[0];
        if ('iCP' in tokenVariant) {
          return "ICP";
        } else if ('ckBTC' in tokenVariant) {
          return "ckBTC";
        }
      }
      return "Unknown"; // or handle this case as appropriate for your application
    }
      const [projects, setprojects] = useState([])
      const [activities, setactivities] = useState([])
      const  docName  = useParams()

      // const docs = getTextAfterHyphen(docName.id)


      function mergeOwnerAndProject(data) {
        return data.map(item => {
            const { owner, project } = item;
    
            // Merge owner and project data into a single object
            const mergedProject = { ...owner, ...project };
    
            // Return an array with the merged object
            return mergedProject;
        });
    }
      useEffect(() => {
        const initializeTronWeb = async () => {
          const docs = getTextAfterHyphen(docName.id)
          const authClient = await AuthClient.create();
          const identity = await authClient.getIdentity();
          const userPrincipal = identity.getPrincipal()
          const agent = new HttpAgent({ identity });
          if(identity.getPrincipal().toString() === "2vxsx-fae"){
            alert("Please Connect wallet")
            navigate('/')
          }else{
            const actor = Actor.createActor(idlFactory, {
              agent,
              canisterId: process.env.CANISTER_ID_FUND_NATION2_BACKEND,
            });
  
            actor.getProjectWithOwner(docs).then((data) => {
        
              //console.log(data)
           const aa =  mergeOwnerAndProject([data])
           setprojects(aa[0])
           //console.log(aa[0].donations)
           actor.convertDonationsToArray(aa[0].donations).then((data) => {
            setactivities(data)

          //   actor.convertDonationsToArray(aa[0].donations).then((data) => {
          //   setactivities(data)
  
          //  })
  
           })
           handleAuthenticated(aa[0].principalid)
           
          
          
   
              }); 
           
          }
          
        };
       
        initializeTronWeb();

    }, []);


    const Donatefunc = async () => {
      const docs = getTextAfterHyphen(docName.id)
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const userPrincipal = identity.getPrincipal()
      const agent = new HttpAgent({ identity });

      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.CANISTER_ID_FUND_NATION2_BACKEND,
      });

      setLoading(true)
      actor.getProfile(userPrincipal).then((data) => {
        actor.contribute(docs, parseInt(funding), data.img, words, `${data.firstName} ${data.lastName}`).then((data2) => {
      
          console.log(data2)
          setLoading(false)
  
          }); 
      }); 
     
    }

    const Widrawfunc = async () => {
      const docs = getTextAfterHyphen(docName.id)
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const userPrincipal = identity.getPrincipal()
      const agent = new HttpAgent({ identity });

      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.CANISTER_ID_FUND_NATION2_BACKEND,
      });


      setLoading(true)
      if (proncipal === projects.principalid){
        actor.withdrawFunds(docs,proncipal2).then((data) => {
            
          console.log(data)
          setLoading(false)

          }); 
      }else{
        alert("Incorrect Principal ID")
      }
          
   

        setLoading(false)
    }
    
    

    const handlefundingChange = (e) => {
      setfunding(e.target.value);
    };

    const handlewordsChange = (e) => {
      setwords(e.target.value);
    };


    function convertNanosecondsToDate(nanoseconds) {
      // Convert nanoseconds to milliseconds
      const milliseconds = Number(nanoseconds) / 1_000_000;
    
      // Create a Date object
      const date = new Date(milliseconds);
    
      // Extract the month and day
      const day = date.getDate(); // Day of the month (1-31)
      const month = date.toLocaleString('default', { month: 'long' }); // Full month name
    
      // Format: "Day Month" (e.g., "12 November")
      return `${day} ${month}`;
    }

  return (
    <div className="bg-white-150 p-6 md:p-10">
       {loading? <div className="flex flex-col items-center justify-center min-h-screen bg-darkBlue text-white">
    <Circles
  height="60"
  width="60"
  color="rgba(132, 204, 22, 0.8)"
  ariaLabel="circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />
    </div> : 
    <>
        <div style={{height: 100}}></div>
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        {/* Left Section */}
        <div className="md:w-2/3 p-6">

            <div className="flex flex-row justify-between">
                
            <h1 className="text-3xl font-bold text-gray-800">{projects.title}</h1>
          <div className="hidden md:flex flex items-center justify-center space-x-2 px-2 py-1" style={{ background: "rgba(132, 204, 22, 0.8)", borderRadius: 10 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.66675 8V13.3333C2.66675 13.687 2.80722 14.0261 3.05727 14.2761C3.30732 14.5262 3.64646 14.6667 4.00008 14.6667H12.0001C12.3537 14.6667 12.6928 14.5262 12.9429 14.2761C13.1929 14.0261 13.3334 13.687 13.3334 13.3333V8" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6666 4.00004L7.99992 1.33337L5.33325 4.00004" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 1.33337V10" stroke="#1E293B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  <p className="text-white text-lg " style={{color: "black", fontSize:15}}>Share campaign</p>
</div>

    </div>

            <p className="text-gray-600 mt-2">{projects.description}</p>
          <img
            src={projects.cover}// replace with actual image URL
            alt="Campaign"
            className="w-full mt-4 rounded-lg"
          />
          <div className="mt-4">
            <p className="text-gray-700">
            {projects.story}
            </p>
            {/* <button className="mt-2 text-blue-500 underline">Read more</button> */}
          </div>

          {/* Organizer */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">Organizer</h2>
            <div className="flex items-center mt-2">
              <img
                 src={projects.img} // replace with actual profile image
                alt="Organizer"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="text-gray-800 font-medium">{projects.firstName} {projects.lastName}</p>
                <p className="text-gray-500">{projects.bio}</p>
              </div>
            </div>
          </div>

          {/* Words of Support */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">Words of support</h2>

            {activities?.map((activity, index) => (
            <div key={index} className="mt-4">
            <div className="flex items-center">
              <img
                 src={activity.userimg}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="text-gray-800 font-medium">{activity.username}</p>
                <p className="text-gray-500">{activity.userwords}</p>
              </div>
            </div>

            {/* <button className="mt-4 text-blue-500 underline">Show more</button> */}
          </div>
        ))}
          
          </div>
        </div>
 
        {/* Right Section */}
        <div className="md:w-1/3 bg-white-100 p-6">
          {/* Donation Amount */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            {projects.projecttype === "Donation" ? <>
            <h2 className="text-lg font-bold text-gray-800">{projects.projecttype === "Donation" ? "Funds donated to this campaign" : "Signatures for this Campaign"}</h2>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-semibold text-gray-800">{parseInt(projects.raised)} {getTokenType(projects)}</span>
              <span className="text-gray-500">/ ${parseInt(projects.goal)/100000000} {getTokenType(projects)}</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(parseInt(projects.raised) / parseInt(projects.goal)) * 100}%`}}></div>
            </div>
            <p className="text-gray-500 mt-4">{activities?.length} donations</p>
            </> : <>
            <h2 className="text-lg font-bold text-gray-800">{projects.projecttype === "Donation" ? "Funds donated to this campaign" : "Signatures for this Campaign"}</h2>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-semibold text-gray-800">{parseInt(projects.raised)}</span>
              <span className="text-gray-500">/ {parseInt(projects.goal)/100000000}</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(parseInt(projects.raised) / parseInt(projects.goal)) * 100}%`}}></div>
            </div>
            <p className="text-gray-500 mt-4">{activities?.length} Signatures</p>
            </>}
           

           
            <ul className="space-y-4">
        {activities?.map((activity, index) => (
          <li key={index} className="flex flex-col items-left space-x-">
            
            <div className="flex flex-row gap-5">
            <img
              src={activity.userimg}
              alt={activity.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{color:"black"}}>{activity.username}</p>
              <p className="text-xs text-gray-500" style={{fontSize:14}}><span>{convertNanosecondsToDate(activity.timestamp)}</span></p> 
            </div>
            </div>

         

          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center space-x-2 px-2 py-1" style={{ background: "rgba(132, 204, 22, 0.8)", borderRadius: 10, marginTop: 40 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.66675 8V13.3333C2.66675 13.687 2.80722 14.0261 3.05727 14.2761C3.30732 14.5262 3.64646 14.6667 4.00008 14.6667H12.0001C12.3537 14.6667 12.6928 14.5262 12.9429 14.2761C13.1929 14.0261 13.3334 13.687 13.3334 13.3333V8" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6666 4.00004L7.99992 1.33337L5.33325 4.00004" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 1.33337V10" stroke="#1E293B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  <p className="text-white text-lg " style={{color: "black", fontSize:15}}>Share campaign</p>
</div>
          </div>

          {/* Fund This Campaign */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
           {projects.projecttype === "Donation" && isdonate &&<>
           <h2 className="text-lg font-bold text-gray-800">Fund this campaign</h2>
            <input
              type="number"
              placeholder="Funding"
              className="mt-4 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200"
              style={{color : "black"}}
              value={funding}
              onChange={handlefundingChange}
            />
           </> }
           {isdonate && <textarea
              placeholder="Words of Support ✨"
              className="mt-4 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200"
              rows="3"
              style={{color : "black"}}
              value={words}
              onChange={handlewordsChange}
            ></textarea>}
{isdonate ?  <button onClick={() => {Donatefunc()}} className="w-full mt-4 bg-green-500 text-white py-2 rounded-md " style={{background:"rgba(132, 204, 22, 0.8)", color: "black"}}>{ projects.projecttype === "Donation" ? "Donate now" : "Sign Petition"}</button> :
 <button onClick={() => {Widrawfunc()}} className="w-full mt-4 bg-green-500 text-white py-2 rounded-md " style={{background:"rgba(132, 204, 22, 0.8)", color: "black"}}>Withdraw funds</button>
}
           
          </div>
        </div>
      </div>
      </>
      }
    </div>
  );
};

export default Camprof;
