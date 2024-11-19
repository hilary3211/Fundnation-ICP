"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link,NavLink } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory, canisterId } from "declarations/fund-nation2-backend";

export default function Navbar() {
    const menuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
   
    const [imageBase64, setImageBase64] = useState(null);
const [logstate, setlogstate] = useState(false)

const [showprof, setshowprof] = useState(false)


    async function login() {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
      } else {
        await authClient.login({
          identityProvider: process.env.DFX_NETWORK === "ic" 
            ? "https://identity.ic0.app/#authorize" 
            : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/#authorize`,
            
          onSuccess: () => {
            handleAuthenticated(authClient);
          },
        });
      }
    }

    async function logout() {
      const authClient = await AuthClient.create();
      await authClient.logout();
      // Update your UI to reflect the logged-out state
      console.log("User logged out");
    }
    
    async function handleAuthenticated(authClient) {
      const identity = await authClient.getIdentity();
      const userPrincipal = identity.getPrincipal().toString();
      console.log("Authenticated user principal:", userPrincipal);
     
    }


    async function handleAuthenticated2() {
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const agent = new HttpAgent({ identity });
      if (await authClient.isAuthenticated()) {
        setlogstate(true)
        const agent = new HttpAgent({ identity });

        const actor = Actor.createActor(idlFactory, {
          agent,
          canisterId: process.env.CANISTER_ID_FUND_NATION2_BACKEND,
        });
        actor.getProfile(identity.getPrincipal()).then((data) => {

          setImageBase64(data.img)
        }); 
      } else {
        setlogstate(false)
      }
      // const identity = await authClient.getIdentity();
      // const userPrincipal = identity.getPrincipal()
      // fund_nation2_backend.getProfile(userPrincipal).then((greeting) => {
      //   // if (greeting.lastName === "" && greeting.firstName === ""){
      //   //   setshowprof(false)
      //   // }else{
      //   //   setshowprof(true)
      //   // }
      //   setshowprof(!(greeting.lastName === "" && greeting.firstName === ""));

       

      //     }); 

    }

    useEffect(() => {
      handleAuthenticated2()
    }, [logstate])



   
  
  return (
<>
<div className="hidden md:flex justify-center w-full mt-10 fixed top-0 left-0 z-50">
    <nav
      style={{
        background:
          "linear-gradient(180deg, rgba(0, 255, 0, 0.08) 9.74%, rgba(0, 255, 0, 0.00) 75.82%), var(--background-accent-green, #013220)",
        maxWidth: "800px", // Set max width for consistency
        width: "100%",
        border: "1px solid var(--border-action-normal, rgba(243, 223, 255, 0.27))",
        borderRadius: "10px",
      }}
      className="flex items-center justify-between px-6 py-3 text-white shadow-md "
    >
      {/* Logo */}
      <div className="flex items-center text-xl font-bold">
  <Link  to={'/'} className="flex flex-row">
    <img src="/assets/logo.svg" alt="img" width={30} height={30} />

  <span className="ml-0">und nation</span>
  </Link>
</div>


      {/* Menu Links */}
      <div className="flex space-x-8">
   
         <div
            
            className="relative"
          >
            <Link
            to={'/'}
              className="hover:text-gray-300"
              style={{
                color: "var(--text-base-primary, #EDEEF3)",
                fontFamily: "Helvetica Neue",
              }}
            >
              Home
            </Link>
            
          </div>
          <div
           
            className="relative"
          >
             <Link
            to={'/explore'}
              className="hover:text-gray-300"
              style={{ color: "#EDEEF3", fontFamily: "Helvetica Neue" }}
            >
              Explore
              </Link>
          
          </div>

          <div
           
           
            className="relative "
          >
            <Link
            to={'/mycampaigns'}
              className="hover:text-gray-300"
              style={{ color: "#EDEEF3", fontFamily: "Helvetica Neue", }}
            >
              Campaigns
              </Link>
           
          </div>
      </div>

      {/* Start for Free Button */}
      <div className="flex items-center space-x-4">
  {!logstate ? <Link
  to="/profile"
    style={{
      width: "40px", // Set the desired size for the profile circle
      height: "40px",
      borderRadius: "50%",
      background: "url('/assets/prf.png') center center / cover no-repeat", // Replace with actual image path
      boxShadow: "0px 1px 2px 0px rgba(24, 20, 26, 0.1)",
    }}
  ></Link> : <Link
  to="/profile" style={{ width: "40px", // Set the desired size for the profile circle
  height: "40px",
  borderRadius: "50%",  boxShadow: "0px 1px 2px 0px rgba(24, 20, 26, 0.1)",}}>
<img src={imageBase64} className='w-full rounded-lg' />
</Link>}

  

  <button onClick={() => {
    if (logstate){
      logout()
    }else{
      login()
    }
  }}>
    <div
      style={{
        borderRadius: "10px",
        border: "1px solid var(--border-action-normal, #CCCED7)",
        background: "var(--background-button-secondary, #FFF)",
        boxShadow: "0px 1px 2px 0px rgba(24, 20, 26, 0.05)",
        color: "#1E1F24",
        fontSize: 14,
      }}
      className="px-4 py-2 font-semibold hover:bg-gray-100 transition"
    >
      {logstate ? "Disconnect wallet" : "Connect wallet"}
    </div>
  </button>
</div>

    </nav>
  </div>






  <div className="w-full md:hidden fixed top-0 left-0 z-50">
    
  <div
    className="flex flex-row justify-between items-center px-4 py-2"
    style={{
      background:
      "linear-gradient(180deg, rgba(0, 255, 0, 0.08) 9.74%, rgba(0, 255, 0, 0.00) 75.82%), var(--background-accent-green, #013220)",
      width: "100%",
      height: 80,
      borderBottomColor:'#5E6069',
      borderBottomWidth:1
    }}
    ref={menuRef}
  >

    <div className="flex items-center text-xl font-bold">
    <Link href="/" className="flex flex-row">
    <img src="/assets/logo.svg" alt="img" width={30} height={30} />
 
  <span className="ml-0">und nation</span>
  </Link>
</div>


 <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="text-3xl focus:outline-none flex justify-end relative w-10 h-10"
    >
      <span
        className={`absolute transition-transform duration-300 ${
          menuOpen ? 'opacity-0 rotate-45 scale-75' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        ☰
      </span>
      <span
        className={`absolute transition-transform duration-300 ${
          menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-45 scale-75'
        }`}
      >
        ✕
      </span>
    </button>
  </div>

  {/* Dropdown Menu */}
  <div style={{ width: "100%", marginTop : -5 }} ref={menuRef}>
  <div className="relative w-full">


      {/* Sidebar Menu */}
      {menuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-purple-50 z-10 flex flex-col items-start px-6 py-8">
            <div className="w-full mb-4">
          <Link
            to={'/'}
             style={{fontFamily: "Helvetica Neue", fontSize: 17, fontWeight: 400, color:"#1E1F24"}}  className="text-black font-semibold text-lg flex justify-between w-full">
              Home <span style={{fontSize: 13}}className="text-xl">〉</span>
            </Link>
            
          </div>

          <div className="w-full mb-4">
          <Link
            to={'/explore'}
            style={{fontFamily: "Helvetica Neue", fontSize: 17, fontWeight: 400, color:"#1E1F24"}}
            className="text-black font-semibold text-lg flex justify-between w-full">
              Explore <span className="text-xl" style={{fontSize: 13}}>〉</span>
            </Link>
            
          </div>

          {/* Company Section */}
          <div className="w-full mb-4">
          <Link
            to={'/mycampaigns'}
            style={{fontFamily: "Helvetica Neue", fontSize: 17, fontWeight: 400, color:"#1E1F24"}} className="text-black font-semibold text-lg flex justify-between w-full">
              Campaigns <span style={{fontSize: 13}} className="text-xl">〉</span>
            </Link>
           
          </div>
          <div className="w-full mb-4">
          <Link
           to="/profile"
            style={{fontFamily: "Helvetica Neue", fontSize: 17, fontWeight: 400, color:"#1E1F24"}} className="text-black font-semibold text-lg flex justify-between w-full">
              Profile <span style={{fontSize: 13}} className="text-xl">〉</span>
            </Link>
           
          </div>
         
  
       
          {/* Start for Free Button */}
          <div className="mt-6 mb-4">
          
              {/* <button style={{border: "var(--radius-xl, 12px)", background: "var(--background-button-primary, #1E1F24)", fontSize: 13}} className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-900 transition">
                Connect wallet
              </button> */}

              <button onClick={() => {
    if (logstate){
      logout()
    }else{
      login()
    }
  }}>
    <div
     style={{border: "var(--radius-xl, 12px)", background: "var(--background-button-primary, #1E1F24)", fontSize: 13}} className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-900 transition">
      {logstate ? "Disconnect wallet" : "Connect wallet"}
    </div>
    </button>   
          </div>

          {/* <div className="mt-10 mb-8">
            <p className="text-gray-600 mb-2">Let’s connect</p>
            <div className="flex space-x-4" style={{marginTop: 10}}>
              <Link style={{borderRadius: 714.286, background: "var(--surface-surface-hover, rgba(0, 0, 0, 0.03))", width: 40, height: 40, justifyContent: "center", alignItems: "center", display: "flex", padding: "5.714px 5.714px 5.715px 5.715px"}} href="https://www.linkedin.com/company/almondnigeria/">
                <img src="/assets/linkedin.svg" alt="LinkedIn" width={24} height={24} />
              </Link>
              <Link style={{borderRadius: 714.286, background: "var(--surface-surface-hover, rgba(0, 0, 0, 0.03))", width: 40, height: 40, justifyContent: "center", alignItems: "center", display: "flex", padding: "5.714px 5.714px 5.715px 5.715px"}} href="https://www.instagram.com/almondapp.ng/">
                <img src="/assets/x.png" alt="Twitter" width={15} height={24} />
              </Link>
      
              <Link style={{borderRadius: 714.286, background: "var(--surface-surface-hover, rgba(0, 0, 0, 0.03))", width: 40, height: 40, justifyContent: "center", alignItems: "center", display: "flex", padding: "5.714px 5.714px 5.715px 5.715px"}} href="https://x.com/almondincorp">
                <img src="/assets/instagram.svg" alt="Instagram" width={24} height={24} />
              </Link>
            </div>
          </div> */}
        </div>
      )}
    </div>
  </div>
</div>


</>
 




  );
}
