import { useState,useEffect } from "react";
import React from "react";
import { useDropzone } from 'react-dropzone';
import { Circles } from 'react-loader-spinner'
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory, canisterId } from "declarations/fund-nation2-backend";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [imageBase64, setImageBase64] = useState(null);
    const [loading, setLoading] = useState(false);
    const [settings, setsetting] = useState(true)
    const [profiledata, setprofiledata] = useState('')
    const [email, setEmail] = useState('');
    const [firstname, setfirstname] = useState('');
    const [secondname, setsecondname] = useState('');
    const [bio, setbio] = useState('');

    const handlemailChange = (e) => {
      setEmail(e.target.value);
    };

    const handlefirstnameChange = (e) => {
      setfirstname(e.target.value);
    };


    const handlesecondnameChange = (e) => {
      setsecondname(e.target.value);
    };

    const handlebioChange = (e) => {
      setbio(e.target.value);
    };


    const navigate = useNavigate()






    const handleFilesAdded = (files) => {
        const file = files[0]; // Assuming single file upload
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageBase64(reader.result); // Set the full base64 string including data:image/...
          };
          reader.readAsDataURL(file); // Convert file to base64 format
        }
      };
    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleFilesAdded,
        accept: 'image/*', // Only accept image files
        multiple: false,
      });
      useEffect(() => {
        const initializeTronWeb = async () => {
          
          const authClient = await AuthClient.create();
          const identity = await authClient.getIdentity();
          const userPrincipal = identity.getPrincipal()
          if(identity.getPrincipal().toString() === "2vxsx-fae"){
            alert("Please Connect wallet")
            navigate('/')
          }else{
            const agent = new HttpAgent({ identity });

          const actor = Actor.createActor(idlFactory, {
            agent,
            canisterId: process.env.CANISTER_ID_FUND_NATION2_BACKEND,
          });
          actor.getProfile(userPrincipal).then((data) => {
            setbio(data.bio)
            setfirstname(data.firstName)
            setsecondname(data.lastName)
            setEmail(data.email)
            setImageBase64(data.img)
          }); 
          }
          
        };
    
        initializeTronWeb();
    }, []);
      
    const onSubmit = async () => {
      if (!imageBase64) {
        alert('Upload an image file to proceed');
        return;
      }
  
      setLoading(true);
      if (true) {
      
       
  
        try {
    
  
          if (true) {
            const authClient = await AuthClient.create();
          const identity = await authClient.getIdentity();
          const userPrincipal = identity.getPrincipal()
            const agent = new HttpAgent({ identity });

            const actor = Actor.createActor(idlFactory, {
              agent,
              canisterId: process.env.CANISTER_ID_FUND_NATION2_BACKEND,
            });
            actor.createProfile({bio : bio, img: imageBase64, email: email, lastName: secondname, firstName: firstname}).then((greeting) => {
            // console.log(greeting)
             setLoading(false)
         
            }); 
         
          } else {
           
          }
        } catch (error) {
         
        } 
      } else {
       
      }
    };



  return (
    <div className="p-6 max-w-6xl mx-auto">
      
    {     loading? <div className="flex flex-col items-center justify-center min-h-screen bg-darkBlue text-white">
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
    <div className="h-28"></div>
  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-14 space-y-4 md:space-y-0">
    <div className="flex space-x-4">
      
      {[
        { icon: '/assets/settings.svg', text: 'Settings', bgColor: settings && "rgba(132, 204, 22, 0.8)" },
    
        // { icon: '/assets/heart.svg', text: 'Favorites', bgColor: !settings && "rgba(132, 204, 22, 0.8)" },
      ].map((item, index) => (
        <button
      //  onClick={() => {setsetting(!settings)}}
          key={index}
          className={`flex items-center justify-center space-x-2 px-2 py-1  rounded-md`}
          style={{background: item.bgColor}}
        >
          <img src={item.icon} alt={`${item.text} Icon`} className="w-5 h-6" />
          <p className="text-black text-base">{item.text}</p>
        </button>
      ))}
    </div>

    {/* Search */}
    { !settings && <div className="flex items-center w-full md:w-auto">
      <input
        type="text"
        placeholder="Where do you want to help?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-72 px-4 py-2 rounded-md border border-gray-300"
      />
    </div>}
  </div>
{settings && <>


  {/* Personal Info Header */}
  <div className="flex items-center mb-4">
    <h1 className="text-2xl font-semibold text-black">Personal Info</h1>
    <button onClick={() => {onSubmit()}} className="ml-auto px-4 py-2 bg-green-500 text-white rounded-lg">Save settings</button>
  </div>
  <p className="text-gray-500 mb-8">Update your personal info with your data preferences</p>

  {/* Form Grid */}
  <div className="grid gap-8 md:grid-cols-2">

    <div>

      <div className="mb-6">
        <label className="block text-gray-600">Full Name</label>
        <div className="flex flex-col md:flex-row gap-4">
          <input onChange={handlefirstnameChange} value={firstname} className="w-full p-3 border rounded-lg" type="text" placeholder="Marcus" style={{ color: 'black' }} />
          <input onChange={handlesecondnameChange} value={secondname} className="w-full p-3 border rounded-lg" type="text" placeholder="Dutra" style={{ color: 'black' }} />
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-gray-600">Email</label>
        <input onChange={handlemailChange} value={email} className="w-full p-3 border rounded-lg" type="text" placeholder="ogbodotc@gmail.com" style={{ color: 'black' }} />
      </div>

      {/* Profile Image */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-4">Profile image</label>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              //background: "url('/assets/profile.JPG') center center / cover no-repeat",
              //boxShadow: "0px 1px 2px 0px rgba(24, 20, 26, 0.1)",
            }}
          >

<div className="mb-6">
      
        <div
          {...getRootProps()}
          className="flex justify-center items-center text-center px-4 py-2 mt-1 w-full text-sm rounded-lg border-2 border-dashed border-gray-300  text-white"
          style={{ cursor: 'pointer' }}
        >
          <input {...getInputProps()} />
          {imageBase64 ? (
            <img src={imageBase64} alt="Uploaded" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-gray-400">
              Drag and Drop files here or{' '}
              <span className="text-gray-400" style={{ color: 'blue', cursor: 'pointer' }}>
                choose file
              </span>
            </span>
          )}
        </div>
      </div>
          </div>
          {/* <div className="space-y-2">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="text-gray-600">Person</label>
                <select className="p-2 border rounded-lg mt-1" style={{ color: 'black' }}>
                  {['Mattew', 'James', 'Jerry', 'Kevin', 'Devon'].map((name, i) => (
                    <option key={i}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-600">Skin Tone</label>
                <select className="p-2 border rounded-lg mt-1" style={{ color: 'black' }}>
                  {['Black', 'White'].map((tone, i) => (
                    <option key={i}>{tone}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="text-gray-600">Type</label>
                <div className="flex gap-8 mt-2">
                  {['Male', 'Female'].map((type, i) => (
                    <label key={i} className="flex items-center text-black">
                      <input type="radio" name="gender" className="mr-1" /> {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-gray-600">Location</label>
        <input style={{color:"black"}} onChange={handlebioChange} value={bio} className="w-full p-3 border rounded-lg" type="text" placeholder="Abuja, Nigeria" />
      </div>

      {/* Banner Image Upload */}
      {/* <div className="mb-6">
        <label className="block text-gray-600">Banner Image</label>
        <div
          {...getRootProps()}
          className="flex justify-center items-center text-center px-4 py-2 mt-1 w-full text-sm rounded-lg border-2 border-dashed border-gray-300  text-white"
          style={{ cursor: 'pointer', height: 200 }}
        >
          <input {...getInputProps()} />
          {imageBase64 ? (
            <img src={imageBase64} alt="Uploaded" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-gray-400">
              Drag and Drop files here or{' '}
              <span className="text-gray-400" style={{ color: 'blue', cursor: 'pointer' }}>
                choose file
              </span>
            </span>
          )}
        </div>
      </div> */}
    </div>

    {/* Profile Card */}
    <div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
        <div className="relative">
          <img src="/assets/Abuja.svg" alt="Rio de Janeiro" className="w-full h-40 object-cover" />
          <div className="absolute top-3 right-3 flex space-x-2">
            {['settings'].map((icon, i) => (
              <button key={i} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition">
                  <img src={'/assets/heart.svg'} alt={`Icon`} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <img
              src={imageBase64}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white -mt-5 mr-3"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{firstname} {secondname}</h3>
              <p className="text-sm text-gray-500">{bio}</p>
            </div>
          </div>
          {/* <div className="mt-3">
            <div className="text-xs text-gray-500 mb-1">18,543 XP / 20,000 XP</div>
            <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '92%' }}></div>
            </div>
          </div> */}
          {/* <div className="text-right mt-2 text-gray-600 text-sm">Level 8</div> */}
        </div>
      </div>
    </div>
  </div>
  </>}

{/* {!settings && <>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <div key={project.id} className="bg-white border rounded-lg p-4 shadow" style={{color: "black"}}>
                        <div className="relative">
          <div className="absolute top-3 right-3 flex space-x-2">
            {['settings'].map((icon, i) => (
              <button key={i} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition">
                  <img src={'/assets/heart.svg'} alt={`Icon`} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
          <img src={project.image} alt={project.name} className="w-full h-40 object-cover rounded-md" />
          <div className="flex items-center mt-2">
            <img src="/assets/profile.JPG" alt="Avatar" className="w-8 h-8 rounded-full" />
            <p className="ml-2 text-sm font-medium">{project.author}</p>
          </div>
          <h3 className="mt-2 font-semibold text-lg">{project.name}</h3>
          <p className="text-sm text-gray-600">{project.description}</p>
          <div className="flex justify-between items-center mt-4">
            <p className="flex items-center space-x-2 px-4 py-2"style={{color:  "black", marginLeft: -15, fontWeight: 600}}> <span role="img" aria-label="petition">
  <img src="/assets/gift.svg" alt="Petition Icon" className="w-5 h-5" />
</span><span>{project.amount}</span></p>
            <p className="text-sm text-gray-600">{project.progress}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div
              className="bg-green-500 h-1 rounded-full"
              style={{ width: `${project.progress}%`, background: "rgba(132, 204, 22, 0.8)", }}
            ></div>
          </div>
        </div>
        ))
      ) : (
        <p className="text-gray-500">No projects found.</p>
      )}
    </div>
</>} */}
<div className="h-28"></div>
</>}

  </div>
  );
};

export default ProfileSettings;
