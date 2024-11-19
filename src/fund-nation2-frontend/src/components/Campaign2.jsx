
import React, { useState ,useEffect} from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Circles } from 'react-loader-spinner'
import { useParams } from 'react-router-dom';
// import { my_project_backend } from '../my_project_backend';
import {  idlFactory, canisterId } from "declarations/fund-nation2-backend";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";

const FormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  story: z.string().min(1),
  amount: z.string(),
  months: z.string().min(1),


});

const Uploadpost = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Other');
  const [isOpen, setIsOpen] = useState(false);
  const  docName  = useParams()
  const [selectedOption2, setSelectedOption2] = useState("ckBTC");
  const [isOpen2, setIsOpen2] = useState(false);

  const [loading, setLoading] = useState(true); 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isdonate, setisdonate] = useState(true);
    const [proncipal, setproncipal] = useState(null);


    const navigate = useNavigate()
    
 
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        title: '',
      description: '',
      story: '',
      amount: '',
      months: ''
    }
  });

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

  async function handleAuthenticated() {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const userPrincipal = identity.getPrincipal().toString();
    setproncipal(userPrincipal)
    console.log("Authenticated user principal:", userPrincipal);
   
  }

  const onSubmit = async (formData) => {
    //setModalIsOpen(true)
    setLoading(true)
    if (imageBase64 === null){
    alert("Upload an image file to proceed")
   setLoading(false)
    }else{
      let data 

      if (docName.id === "Petition"){
         data = {
          cover: imageBase64,
          title: formData.title,
          description: formData.description,
          projecttype: docName.id,
          story: formData.story,
          category: selectedOption,
          goal : parseInt(formData.amount) * 100000000,
          principalid: proncipal,
          tags:["nil"],
          raised:0,
          donations:[[]] ,
          token:  [{petition : null}]
  
        };
      }else{
        data = {
          cover: imageBase64,
          title: formData.title,
          description: formData.description,
          projecttype: docName.id,
          story: formData.story,
          category: selectedOption,
          goal : parseInt(formData.amount) * 100000000,
          principalid: proncipal ,
          tags:["nil"],
          raised:0,
          donations:[[]] ,
          token:  selectedOption2 === "iCP" ? [{iCP : null}] : [{ckBTC : null}]
  
        };
      }
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const userPrincipal = identity.getPrincipal()
      const agent = new HttpAgent({ identity });

      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.CANISTER_ID_FUND_NATION2_BACKEND,
      });

      actor.createProject(data).then((greeting) => {
      //console.log(greeting)
       navigate("/explore")
       setLoading(false)
        }); 
    }
  
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSelect2 = (option) => {
    // if (option === "ckBTC"){
    //   setSelectedOption2([{ckBTC : null}]);
    // }else if (option === "iCP"){
    //   setSelectedOption2([{iCP : null}]);
    // }else{
    //   setSelectedOption2([{petition : null}]);
    // }

    setSelectedOption2(option);
    
    setIsOpen2(false);
  };

  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop: handleFilesAdded,
  //   accept: 'image/*', // Only accept image files
  //   multiple: false,
  // });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFilesAdded,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'], // Only accept JPEG and JPG image files
    },
    multiple: false,
});

// async function handleAuthenticated2() {
//   const authClient = await AuthClient.create();
//   if (await authClient.isAuthenticated()) {
//     setlogstate(true)
//   } else {
//     setlogstate(false)
//   }
//   // const identity = await authClient.getIdentity();
//   // const userPrincipal = identity.getPrincipal()
//   // fund_nation2_backend.getProfile(userPrincipal).then((greeting) => {
//   //   // if (greeting.lastName === "" && greeting.firstName === ""){
//   //   //   setshowprof(false)
//   //   // }else{
//   //   //   setshowprof(true)
//   //   // }
//   //   setshowprof(!(greeting.lastName === "" && greeting.firstName === ""));

   

//   //     }); 

// }

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
  
        actor.getProfile(userPrincipal).then((greeting) => {
         // console.log(greeting)
          if(greeting){
            if ( greeting.firstName === "" &&  greeting.lastName === ""){
          
              navigate("/profile")
              setLoading(false)
              alert("Please Complete Your Profile")
            }else{
              setLoading(false)
             
            }
          }else{
            navigate("/campaign")
            setLoading(false)
            alert("Please Connect wallet")
          }
  
  
          if ( docName.id === "Petition" ){
            setSelectedOption2([{petition : null}]);
          }
  
          
          }); 
      }

    };

    initializeTronWeb();
    handleAuthenticated()
}, []);



  return (
    <>
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
     
    <div className="flex flex-col grow w-full max-md:max-w-full md:h-calc-100vh-120" >
        <div style={{height: 110}}>

        </div>
      <section className="flex flex-col justify-center items-center px-5 py-8 max-md:max-w-full md:px-20  text-white">
        <header className="flex gap-2 flex-wrap md:flex-nowrap w-full max-w-2xl text-white justify-center">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl leading-normal font-semibold text-slate-800 text-white" style={{ background: "linear-gradient(to right, rgba(112, 174, 18, 0.8), rgba(152, 224, 32, 0.8))",
          WebkitBackgroundClip: "text",
          color: "transparent", }}>Tell us more about your campaign</h2>
            <p className="mt-2 text-sm font-medium text-gray-400">This will be uploaded to your campaign list, awaiting you to launch it </p>
          </div>
        </header>
        <form className="flex flex-col w-full max-w-2xl  text-white" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="mt-8 text-sm font-bold text-gray-400 text-white">
            <span className="text-slate-800 text-white" style={{fontSize: 20}}>Image</span>
           
          </label>
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
          <label htmlFor="title" className="mt-8 text-sm font-bold text-gray-400 text-white">
            <span  className="text-slate-800 text-white"  style={{fontSize: 15,   color: "black"}}>Title</span>
            {/* <span className="text-gray-400" style={{ fontSize: 11 }}> (Enter title of Subject)</span> */}
          </label>
          <input
            type="text"
            id="title"
            className="justify-center items-start p-2.5 mt-1 w-full text-xs font-medium bg-white rounded-lg border text-black"
            placeholder="Enter title for post"
            aria-label="name"
            style={{fontSize: 15,    color: "black", background:"rgba(203, 213, 225, 0.3)"}}
            {...register('title')}
          />
          {errors.title && <span className="text-red-600">{errors.title.message}</span>}


          <label htmlFor="description" className="mt-4 text-sm font-bold text-gray-400">
            <span className="text-slate-800 text-white" style={{fontSize: 15,   color: "black"}}>Description</span>
            {/* <span className="text-gray-400" style={{ fontSize: 11 }}> (Describe what your brand, product or service does)</span> */}
          </label>
          <textarea
            id="description"
            className="justify-center items-start p-2.5 mt-1 w-full text-xs font-medium bg-white rounded-lg border text-black"
            placeholder="Enter description here"
            aria-label="description"
            rows={5}
            style={{fontSize: 15,    color: "black", background:"rgba(203, 213, 225, 0.3)"}}
            {...register('description')}
          ></textarea>
          {errors.description && <span className="text-red-600">{errors.description.message}</span>}
         
          <label htmlFor="medication" className="mt-4 text-sm font-bold text-gray-400">
            <span className="text-slate-800 text-white" style={{fontSize: 15,   color: "black"}}>Story Behind Project</span>
            {/* <span className="text-gray-400" style={{ fontSize: 11 }}></span> */}
          </label>

          <textarea
            type="text"
            id="story"
            className="justify-center items-start p-2.5 mt-1 w-full text-xs font-medium bg-white rounded-lg border text-black"
            placeholder="Enter story here"
            aria-label="story"
            rows={5}
            style={{fontSize: 15,    color: "black", background:"rgba(203, 213, 225, 0.3)"}}
            {...register('story')}
          />
          {errors.story && <span className="text-red-600">{errors.story.message}</span>}

{docName.id === "Donation" ? <>
    <label htmlFor="name" className="mt-8 text-sm font-bold text-gray-400 text-white">
            <span className="text-slate-800 text-white" style={{fontSize: 15,   color: "black"}}>Amount Goal</span>
          </label>
          <input
            type="number"
            id="amount"
            className="justify-center items-start p-2.5 mt-1 w-full text-xs font-medium bg-white rounded-lg border text-black"
            placeholder="Enter amount you are trying to raise"
            aria-label="amount"
            style={{fontSize: 15,    color: "black", background:"rgba(203, 213, 225, 0.3)"}}
            {...register('amount')}
          />
          {errors.amount && <span className="text-red-600">{errors.amount.message}</span>}
</> : <>
    <label htmlFor="name" className="mt-8 text-sm font-bold text-gray-400 text-white">
            <span className="text-slate-800 text-white" style={{fontSize: 15,   color: "black"}}>Number of Signature Goal</span>
          </label>
          <input
            type="number"
            id="amount"
            className="justify-center items-start p-2.5 mt-1 w-full text-xs font-medium bg-white rounded-lg border text-black"
            placeholder="Enter Number of Signature Goal For Petition"
            aria-label="amount"
            style={{fontSize: 15,    color: "black", background:"rgba(203, 213, 225, 0.3)"}}
            {...register('amount')}
          />
          {errors.amount && <span className="text-red-600">{errors.amount.message}</span>}
</>}
         
          <label htmlFor="name" className="mt-8 text-sm font-bold text-gray-400 text-white">
            <span className="text-slate-800 text-white" style={{fontSize: 15,   color: "black"}}>Number of Months for campaign</span>
            {/* <span className="text-gray-400" style={{ fontSize: 11 }}> (Enter title of Subject)</span> */}
          </label>
          <input
             type="number"
            id="months"
            className="justify-center items-start p-2.5 mt-1 w-full text-xs font-medium bg-white rounded-lg border text-black"
            placeholder="Enter how many months for campaign eg 1 or 12"
            aria-label="months"
            style={{fontSize: 15,    color: "black", background:"rgba(203, 213, 225, 0.3)"}}
            {...register('months')}
          />
          {errors.months && <span className="text-red-600">{errors.months.message}</span>}
          <label htmlFor="website" className="mt-8 text-sm font-bold text-gray-400 text-white">
            <span className="text-slate-800 text-white" style={{fontSize: 15,   color: "black"}}>Category</span>
            <span className="text-gray-400" style={{ fontSize: 11 }}> (Select Category)</span>
          </label>
          <div className="relative inline-block w-full md:w-164 text-left mt-4">
            <button
              type="button"
              className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              id="options-menu"
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedOption}
              {/* <RiArrowDropDownLine className="w-5 h-5" /> */}
            </button>
            {isOpen && (
              <div
                className="absolute z-10 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="py-1" role="none">
                  {[
  "Charity & Social Causes",
  "Education & Learning",
  "Health & Wellness",
  "Creative Arts & Media",
  "Business & Startups",
  "Science & Technology",
  "Travel & Adventure",
  "Sports & Fitness",
  "Memorial & Emergency Support",
  "Personal Growth & Projects",
  "Environment & Sustainability",
  "Politics & Advocacy",
  "Religious & Spiritual Causes",
  "Events & Celebrations",
  "Housing & Shelter",
  "Other"
]
.map((option) => (
                    <button
                      key={option}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

     
         
         
         { docName.id === "Donation" &&<div className="relative inline-block w-full md:w-164 text-left mt-4">
         <label htmlFor="website" className="mt-8 text-sm font-bold text-gray-400 text-white">
            <span className="text-slate-800 text-white" style={{fontSize: 15,   color: "black"}}>Token type</span>
            <span className="text-gray-400" style={{ fontSize: 11 }}> (Select Fundraising token type)</span>
          </label>
            <button
              type="button"
              className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              id="options-menu"
              aria-expanded={isOpen2}
              aria-haspopup="true"
              onClick={() => setIsOpen2(!isOpen2)}
            >
              {selectedOption2}
              {/* <RiArrowDropDownLine className="w-5 h-5" /> */}
            </button>
            {isOpen2 && (
              <div
                className="absolute z-10 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="py-1" role="none">
                  {[
                "iCP",
                "ckBTC",
              ]
              .map((option) => (
                                  <button
                                    key={option}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                    role="menuitem"
                                    onClick={() => handleSelect2(option)}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>}
                      
         
          <div className="flex gap-4 mt-7 text-sm font-medium flex-wrap" style={{ width: "90%", alignSelf: "center",}}>
            <button
              type="submit"
              className="justify-center p-2.5 text-white bg-violet-800 rounded-lg"
              style={{ background: "linear-gradient(to right, rgba(112, 174, 18, 0.8), rgba(152, 224, 32, 0.8))",
              width: "100%", height: 50, borderRadius: 50,  marginTop: 32 , fontSize: 18  }}
            >
              Upload Campaign
            </button>


       
          </div>
        </form>


        <div style={{height: 100}}></div>

      </section>
      
    </div>
    }
    
    </>

  );
};

export default Uploadpost;


