import React, { useState ,useEffect} from 'react';

import {  idlFactory, canisterId } from "declarations/fund-nation2-backend";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
const projects2 = [
  {
    id: 1,
    name: "Ms. Saint-Martin Doraniya Pascal",
    description: "Representing Saint-Martin...",
    image: "/assets/cancer.svg",
    author: "Olivia Rhye",
    amount: "€8,516.95",
    progress: 50,
  },
  {
    id: 2,
    name: "Educación en Academia...",
    description: "Hola, mi nombre es Xhaomi...",
    image: "/assets/solar.svg",
    author: "Olivia Rhye",
    amount: "€9,977.32",
    progress: 20,
  },
  {
    id: 3,
    name: "Aidez la famille Mimba...",
    description: "Les enfants MIMBA ont été...",
    image: "/assets/cats.svg",
    author: "Olivia Rhye",
    amount: "€8,129.86",
    progress: 75,
  },
];

const CampaignCard = ({ title, donations, imageSrc, creatorName, creatorAddress, percentage, id, token }) => {
  const navigate = useNavigate()
  
  return (
    <div onClick={() => {navigate(`/campaigns/id-${id}`)}} className="flex flex-col p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between  items-center rounded-lg overflow-hidden" style={{background: "linear-gradient(180deg, rgba(0, 255, 0, 0.08) 9.74%, rgba(0, 255, 0, 0.00) 75.82%), var(--background-accent-green, #013220)"}}>
        <div className="flex-1 p-4">
        <div className="flex items-center text-xl font-bold" style={{marginTop: -30}}>
    <img src="/assets/logo.svg" alt="img" width={20} height={20} />

  <span className="ml-0" style={{fontSize: 12}}>und nation</span>
</div>
          <h2 className="text-2xl font-bold mt-1">{title}</h2>
          <div className="mt-4">
            <p className="text-sm font-semibold">{creatorName}</p>
            <p className="text-xs text-gray-600">{creatorAddress}</p>
          </div>
        </div>
        <div className="flex-shrink-0 w-1/3">
          <img
            src={imageSrc}
            alt={title}
            className="object-cover w-64 h-64 rounded-r-lg"
          />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">Total donations</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xl font-bold" style={{color: "black"}}>${donations} {'iCP' in token ? "ICP" : "ckBTC"}</span>
        </div>
        <div className="w-full bg-gray-300 h-2 mt-2 rounded-full">
          <div className="bg-lime-500 h-2 rounded-full" style={{ width: `${percentage}%`, }}></div>
        </div>
      </div>
    </div>
  );
};

const ActivityFeed = ({ data }) => {
  const [activities, setActivities] = useState([]);
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
  async function getAllDonations(arrayOfObjects) {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const userPrincipal = identity.getPrincipal()
    const agent = new HttpAgent({ identity });

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.CANISTER_ID_FUND_NATION2_BACKEND,
    });

    
    try {
      if (!Array.isArray(arrayOfObjects)) {
        throw new Error('Input should be an array of objects');
      }
  
      const donationsArrays = await Promise.all(
        arrayOfObjects
          .filter((obj) => obj && Array.isArray(obj.donations))
          .map(async (obj) => {
            // Convert donations to array
            const donations = await actor.convertDonationsToArray(obj.donations);
  
            // Add projecttype to each donation object
            return donations.map((donation) => ({
              ...donation,
              projecttype: obj.projecttype,
              token: obj.token,
            }));
          })
      );
  
      // Flatten all returned arrays into one final array
      const finalDonationsArray = donationsArrays.flat();
      console.log(finalDonationsArray)
      return finalDonationsArray;
    } catch (error) {
      console.error('Error in getAllDonations:', error.message);
      return [];
    }
  }
  

  // Fetch activities data on component mount
  useEffect(() => {
    getAllDonations(data).then((allDonations) => {
      setActivities(allDonations); // Set resolved data to activities state
    });
  }, [data]); // Dependency array ensures this runs when data changes

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'black' }}>Activity</h2>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li key={index} className="flex flex-col items-left space-x-4">
            <div className="flex flex-row gap-5">
              <img
                src={activity.userimg}
                alt={activity.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "black" }}>
                  {activity.username}
                </p>
                <p className="text-xs text-gray-500" style={{ fontSize: 14 }}>
                  {activity.userwords}
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-1">
              <div style={{ width: 2, height: 40, background: "#EAECF0", marginTop: 10 }}></div>
              {activity.projecttype === "Petition" ?<div
                className="flex items-center space-x-3"
                style={{ marginLeft: 50, marginTop: 15 }}
              >
                {/* <div className="flex items-center justify-center w-10 h-10 bg-lime-100 rounded-full">
                  <span className="text-lime-500 font-bold text-lg">$</span>
                </div> */}
                <div>
                  <p className="text-lg text-lime-600" style={{ fontSize: 17 }}>
                Signed Your Petition
                  </p>
                  {/* <p className="text-gray-500">{activity.amount}</p> */}
                </div>
              </div> : <div
                className="flex items-center space-x-3"
                style={{ marginLeft: 50, marginTop: 15 }}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-lime-100 rounded-full">
                  <span className="text-lime-500 font-bold text-lg">$</span>
                </div>
                <div>
                  <p className="text-lg text-lime-600" style={{ fontSize: 17 }}>
                    {`+${activity.amount}`} {getTokenType(activities)}
                  </p>
                  <p className="text-gray-500">{activity.amount}</p>
                </div>
              </div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


const CampDashboard = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()


  const [projects, setprojects] = useState([])


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
    
        actor.getProfile(userPrincipal).then((data) => {
         // const aa =  mergeOwnerAndProject(data)
          setprojects(data)
          // console.log(data)
         // console.log(aa)
     
          }); 
      }

    };

    initializeTronWeb();
}, []);


  // Filtered projects based on search query
  // const filteredProjects = projects.filter((project) =>
  //   project?.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredProjects2 = (projects, searchQuery) => {
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return [];
    }
  
    if (!searchQuery || typeof searchQuery !== 'string') {
      return projects;
    }
  
    return projects.filter((project) => {
      if (!project || typeof project !== 'object') {
        return false;
      }
  
      const title = project.title;
      if (typeof title !== 'string') {
        return false;
      }
  
      return title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };
  let filteredProjects = filteredProjects2(projects, searchQuery);
  return (
    <div className=" p-6 md:p-16 bg-white-100 min-h-screen">
      <div style={{height: 100}}>

      </div>

      <div className="hidden md:block">
      <div className="flex justify-between items-center mb-14">
        <div className="flex space-x-4">
        <div className="flex items-center justify-center space-x-2 px-2 py-1" style={{  borderRadius: 10 }}>
  <img src="/assets/Rocket.svg" alt="Gallery Icon" className="w-5 h-6" />
  <p className="text-white text-lg " style={{color: "black", fontSize:15}}>Campaigns</p>
</div>
 
     
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Where do you want to help?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 px-4 py-2 rounded-md border border-gray-300"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
        <h1 className="text-2xl font-bold mb-3" style={{color:"black"}}>My Campaigns</h1>
        <p className="text-gray-500 text-left" style={{marginLeft: -0}}>Your current sales summary and activity.</p>
        </div>
       
        <div className="flex gap-4">


<button onClick={() => {navigate(`/campaign`)}} className="flex items-center justify-center space-x-2 px-2 py-1" style={{ background: "rgba(132, 204, 22, 0.8)", borderRadius: 10 }}>
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.66669 9.93272C2.17138 9.42666 1.79773 8.81453 1.57405 8.14268C1.35036 7.47083 1.28249 6.75688 1.3756 6.05492C1.4687 5.35296 1.72033 4.68139 2.11142 4.09108C2.50251 3.50077 3.02281 3.0072 3.63291 2.64775C4.24301 2.28831 4.92691 2.07242 5.6328 2.01644C6.33869 1.96046 7.04807 2.06585 7.7072 2.32463C8.36633 2.58341 8.95793 2.98879 9.43718 3.51008C9.91643 4.03136 10.2708 4.65488 10.4734 5.33339H11.6667C12.3104 5.33331 12.937 5.54027 13.454 5.92368C13.971 6.30709 14.351 6.84663 14.5379 7.46259C14.7247 8.07855 14.7085 8.73827 14.4916 9.3443C14.2747 9.95033 13.8686 10.4705 13.3334 10.8281" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 8V14" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6667 10.6667L8.00004 8L5.33337 10.6667" stroke="#1E293B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  <p className="text-white text-lg " style={{color: "black", fontSize:15}}>Create Campaign</p>
</button>
          
        </div>
      </div>
      </div>


      <div className="md:hidden">
      <div className="flex flex-col justify-between items-center mb-4">
        <div className="flex space-x-4">
        <div className="flex items-center justify-center space-x-2 px-2 py-1" style={{  borderRadius: 10 }}>
  <img src="/assets/Rocket.svg" alt="Gallery Icon" className="w-5 h-6" />
  <p className="text-white text-lg " style={{color: "black", fontSize:15}}>Campaigns</p>
</div>
 
     
        </div>

      </div>
      <div className="flex items-center space-x-4 mb-14">
          <input
            type="text"
            placeholder="Where do you want to help?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 px-4 py-2 rounded-md border border-gray-300"
          />
        </div>
      <div className="flex flex-col justify-between items-left mb-3, gap-10">
        <div>
        <h1 className="text-2xl font-bold mb-3" style={{color:"black"}}>My Campaigns</h1>
        <p className="text-gray-500 text-left" style={{marginLeft: -0}}>Your current sales summary and activity.</p>
        </div>
       
        <div className="flex gap-4">


<div onClick={() => {navigate(`/campaign`)}} className="flex items-center justify-center space-x-2 px-2 py-1" style={{ background: "rgba(132, 204, 22, 0.8)", borderRadius: 10 }}>
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.66669 9.93272C2.17138 9.42666 1.79773 8.81453 1.57405 8.14268C1.35036 7.47083 1.28249 6.75688 1.3756 6.05492C1.4687 5.35296 1.72033 4.68139 2.11142 4.09108C2.50251 3.50077 3.02281 3.0072 3.63291 2.64775C4.24301 2.28831 4.92691 2.07242 5.6328 2.01644C6.33869 1.96046 7.04807 2.06585 7.7072 2.32463C8.36633 2.58341 8.95793 2.98879 9.43718 3.51008C9.91643 4.03136 10.2708 4.65488 10.4734 5.33339H11.6667C12.3104 5.33331 12.937 5.54027 13.454 5.92368C13.971 6.30709 14.351 6.84663 14.5379 7.46259C14.7247 8.07855 14.7085 8.73827 14.4916 9.3443C14.2747 9.95033 13.8686 10.4705 13.3334 10.8281" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 8V14" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6667 10.6667L8.00004 8L5.33337 10.6667" stroke="#1E293B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  <p className="text-white text-lg " style={{color: "black", fontSize:15}}>Create Campaign</p>
</div>
          
        </div>
      </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            {filteredProjects.map((project) => (
           <CampaignCard
           title={project.title}
           donations={parseInt(project.goal)/ 100000000}
           imageSrc={project.cover} // Replace with actual image URL
           creatorName={project.category}
           percentage={(parseInt(project.raised) / parseInt(project.goal)) * 100}
           id={project.id}
           token={project.token[0]}
           //creatorAddress="0xbb AC23 43af 98fg"
         />
          ))}
        


          </div>
        </div>
        <div className="col-span-1">
          <ActivityFeed data={filteredProjects} />
        </div>
      </div>
 
    </div>
  );
};

export default CampDashboard;
