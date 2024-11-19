


import { useState,useEffect } from "react";
import React from "react";
import { fund_nation2_backend } from 'declarations/fund-nation2-backend';
import {  idlFactory, canisterId } from "declarations/fund-nation2-backend";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";





const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null); // null means no filter by type

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
  
        actor.listProjects2().then((data) => {
    
  
       const aa =  mergeOwnerAndProject(data)
       setprojects(aa)
        //console.log(aa)
  
          }); 
      }

     
    };

    initializeTronWeb();
}, []);

  const navigate = useNavigate()

  // // Filter projects by search query
  // const filterBySearch = (projects, query) => {
  //   return projects.filter(project =>
  //     project.name.toLowerCase().includes(query.toLowerCase())
  //   );
  // };

  // // Filter projects by selected type
  // const filterByType = (projects, type) => {
  //   return type ? projects.filter(project => project.type === type) : projects;
  // };

  // // Get the projects based on both search and type filters
  // const getFilteredProjects = () => {
  //   let filteredProjects = filterBySearch(projects, searchQuery);
  //   filteredProjects = filterByType(filteredProjects, selectedType);
  //   return filteredProjects;
  // };



  // Filter projects by search query
const filterBySearch = (projects, query) => {
  if (!projects || projects.length === 0) return [];
  return projects.filter(project =>
    project.title.toLowerCase().includes(query.toLowerCase())
  );
};

// Filter projects by selected type
const filterByType = (projects, type) => {
  if (!projects || projects.length === 0) return [];
  return type ? projects.filter(project => project.projecttype === type) : projects;
};

// Get the projects based on both search and type filters
const getFilteredProjects = () => {
  let filteredProjects = filterBySearch(projects, searchQuery);
  filteredProjects = filterByType(filteredProjects, selectedType);
  return filteredProjects;
};


  // Event handlers for search and type buttons
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };
    
  return (
    <div className="max-w-screen-xl mx-auto p-6">
        <div style={{height: 100}}></div>
        <div className="hidden md:block">
        <h2 className="text-2xl font-bold mb-4">Explore</h2>
      <div className="flex justify-between items-center mb-14">
        <div className="flex space-x-4">
        <div className="flex items-center justify-center space-x-2 px-2 py-1" style={{ background: "rgba(132, 204, 22, 0.8)", borderRadius: 10 }}>
  <img src="/assets/gal.svg" alt="Gallery Icon" className="w-5 h-6" />
  <p className="text-white text-lg " style={{color: "black", fontSize:15}}>Gallery</p>
</div>


<div className="flex items-center justify-center space-x-2 px-2 py-1" style={{ background: "transparent", borderRadius: 10 }}>
  <img src="/assets/map.svg" alt="Gallery Icon" className="w-5 h-6" />
  <p className="text-white text-lg " style={{color: "black", fontSize:15}}>Maps  <span className="bg-green-100 text-green-600 text-xs font-semibold ml-1 px-2 py-0.5 rounded-full">Soon</span></p>
</div>

<div className="flex items-center justify-center space-x-2 px-2 py-1" style={{ background: "transparent", borderRadius: 10 }}>
  <img src="/assets/newspaper.svg" alt="Gallery Icon" className="w-5 h-6" />
  <p className="text-white text-lg " style={{color: "black", fontSize:15}}>Feed  <span className="bg-green-100 text-green-600 text-xs font-semibold ml-1 px-2 py-0.5 rounded-full">Soon</span></p>
</div>
        
     
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Where do you want to help?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 px-4 py-2 rounded-md border border-gray-300"
            style={{ color: "black"}}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 " style={{marginBottom:30}}>

      <div className="flex flex-col items-left space-x-4">
        <h1 className="text-2xl font-bold" style={{color:"black"}}>Explore</h1>
        <p className="text-gray-600 text-left" style={{marginLeft: -0}}>Where do you want to help</p>
      </div>


      {/* <div className="flex items-center space-x-4">
        <div className="flex space-x-2" style={{fontWeight: 600, fontSize: 15}}>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md">
            ↑ Price
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md">
            ↓ Date
          </button>
        </div>

      </div> */}


     
    </div>
        </div>

        <div className="md:hidden">
        {/* <h2 className="text-2xl font-bold mb-4">Explore</h2> */}
        <div className="flex flex-wrap justify-between items-center mb-8">
  <div className="flex space-x-2 md:space-x-4 flex-grow">
    {/* Gallery Button */}
    <div
      className="flex items-center justify-center space-x-2 px-2 py-1"
      style={{
        height: 40,
        width: "100%",
        maxWidth: "120px",
        background: "rgba(132, 204, 22, 0.8)",
        borderRadius: 10,
      }}
    >
      <img src="/assets/gal.svg" alt="Gallery Icon" className="w-4 h-5" />
      <p className="text-black text-xs md:text-sm">Gallery</p>
    </div>

    {/* Maps Button */}
    <div
      className="flex items-center justify-center space-x-2 px-2 py-1"
      style={{
        height: 40,
        width: "100%",
        maxWidth: "120px",
        background: "transparent",
        borderRadius: 10,
      }}
    >
      <img src="/assets/map.svg" alt="Map Icon" className="w-4 h-5" />
      <p className="text-black text-xs md:text-sm">Maps</p>
      <span className="bg-green-100 text-green-600 text-xs font-semibold ml-1 px-2 py-0.5 rounded-full">
        Soon
      </span>
    </div>

    {/* Feed Button */}
    <div
      className="flex items-center justify-center space-x-2 px-2 py-1"
      style={{
        height: 40,
        width: "100%",
        maxWidth: "120px",
        background: "transparent",
        borderRadius: 10,
      }}
    >
      <img src="/assets/newspaper.svg" alt="Feed Icon" className="w-5 h-6" />
      <p className="text-black text-xs md:text-sm">Feed</p>
      <span className="bg-green-100 text-green-600 text-xs font-semibold ml-1 px-2 py-0.5 rounded-full">
        Soon
      </span>
    </div>
  </div>
</div>

      <div className="flex items-center space-x-4 mb-8">
          <input
            type="text"
            placeholder="Where do you want to help?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 px-4 py-2 rounded-md border border-gray-300"
            style={{ color: "black"}}
          />
        </div>

      <div className="flex flex-col md:flex-row justify-between items-left mb-4 space-y-4 md:space-y-0 " style={{marginBottom:30}}>

      <div className="flex flex-col items-left space-x-4">
        <h1 className="text-2xl font-bold" style={{color:"black" , fontSize: 20}}>Explore</h1>
        <p className="text-gray-600 text-left" style={{marginLeft: -0}}>Where do you want to help</p>
      </div>


      {/* <div className="flex items-center space-x-4">
        <div className="flex space-x-2" style={{fontWeight: 600, fontSize: 13}}>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md">
            ↑ Price
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md">
            ↓ Date
          </button>
        </div>

      </div> */}


     
    </div>
        </div>
   

    <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
    <div className="flex items-center space-x-2" style={{fontWeight: 600, fontSize: 13}}>
        <button onClick={() => { handleTypeClick(null)}} style={{background: !selectedType ? "rgba(203, 213, 225, 0.3)" : "white" }}  className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md">
          All views
        </button>
        <button onClick={() => { handleTypeClick('Petition')}}  style={{background: selectedType === "petition" ? "rgba(203, 213, 225, 0.3)" : "white" }} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md">
  <span role="img" aria-label="petition">
    <img src="/assets/file-signature.svg" alt="Petition Icon" className="w-5 h-5" />
  </span>
  <span>Petitions</span>
</button>

<button onClick={() => { handleTypeClick('Donation')}} style={{background: selectedType === "donation" ? "rgba(203, 213, 225, 0.3)" : "white" }} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md">
  <span role="img" aria-label="petition">
    <img src="/assets/piggy-bank.svg" alt="Petition Icon" className="w-5 h-5" />
  </span>
  <span>Donations</span>
</button>

      </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {getFilteredProjects().length > 0 ? (
          getFilteredProjects().map((project) => (
            <div   onClick={() => {navigate(`/campaigns/${project.id}`)}} key={project.id} className="bg-white border rounded-lg p-4 shadow" style={{color: "black"}}>
                <div className="relative">
            <div className="absolute top-3 right-3 flex space-x-2">
              {['settings'].map((icon, i) => (
                <button key={i} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition">
                   <img src={'/assets/heart.svg'} alt={`Icon`} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
            <img src={project.cover} alt={project.title} className="w-full h-40 object-cover rounded-md" />
            <div className="flex items-center mt-2">
              <img src={project.img} alt="Avatar" className="w-8 h-8 rounded-full" />
              <p className="ml-2 text-sm font-medium">{project.firstName} {project.lastName}</p>
            </div>
            <h3 className="mt-2 font-semibold text-lg">{project.title}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
            
            {/* {project.projecttype === "Petition" ?  <div className="flex justify-between items-center mt-4">
              <p className="flex items-center space-x-2 px-4 py-2"style={{color:  "black", marginLeft: -15, fontWeight: 600}}> <span role="img" aria-label="petition">
    <img src="/assets/sign.png" alt="Petition Icon" className="w-5 h-5" />
  </span><span>{parseInt(project.goal)/100000000} Signatures </span></p>
              <p className="text-sm text-gray-600">{(parseInt(project.raised) / parseInt(project.goal)) * 100}%</p>
            </div>: 
             <div className="flex justify-between items-center mt-4">
             <p className="flex items-center space-x-2 px-4 py-2"style={{color:  "black", marginLeft: -15, fontWeight: 600}}> <span role="img" aria-label="petition">
   <img src="/assets/gift.svg" alt="Petition Icon" className="w-5 h-5" />
 </span><span>{parseInt(project.goal)/ 100000000} {'iCP' in project.token[0] ? "ICP" : "ckBTC"}</span></p>
             <p className="text-sm text-gray-600">{(parseInt(project.raised) / parseInt(project.goal)) * 100}%</p>
           </div>
            } */}
            {project.projecttype === "Petition" ? (
  <div className="flex justify-between items-center mt-4">
    <p 
      className="flex items-center space-x-2 px-4 py-2" 
      style={{ color: "black", marginLeft: -15, fontWeight: 600 }}
    >
      <span role="img" aria-label="petition">
        <img src="/assets/sign.png" alt="Petition Icon" className="w-5 h-5" />
      </span>
      <span>{parseInt(project.goal) / 100000000} Signatures</span>
    </p>
    <p className="text-sm text-gray-600">
      {Math.max(1, Math.floor((parseInt(project.raised) / parseInt(project.goal)) * 100))}%
    </p>
  </div>
) : (
  <div className="flex justify-between items-center mt-4">
    <p 
      className="flex items-center space-x-2 px-4 py-2" 
      style={{ color: "black", marginLeft: -15, fontWeight: 600 }}
    >
      <span role="img" aria-label="petition">
        <img src="/assets/gift.svg" alt="Petition Icon" className="w-5 h-5" />
      </span>
      <span>
        {parseInt(project.goal) / 100000000} 
        {'iCP' in project.token[0] ? "ICP" : "ckBTC"}
      </span>
    </p>
    <p className="text-sm text-gray-600">
      {Math.max(1, Math.floor((parseInt(project.raised) / parseInt(project.goal)) * 100))}%
    </p>
  </div>
)}
           
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div
                className="bg-green-500 h-1 rounded-full"
                style={{ width: `${(parseInt(project.raised) / parseInt(project.goal)) * 100}%`, background: "rgba(132, 204, 22, 0.8)", }}
              ></div>
            </div>
          </div>
          ))
        ) : (
          <p className="text-gray-500">No projects found.</p>
        )}
      </div>
      <div className="flex justify-between items-center mt-6">
        <button className="text-gray-600">Previous</button>
        <div className="flex space-x-2">
          <button className="text-gray-600">1</button>
          <button className="text-gray-600">2</button>
          <button className="text-gray-600">3</button>
        </div>
        <button className="text-gray-600">Next</button>
      </div>
    </div>
  );
};

export default Explore;
