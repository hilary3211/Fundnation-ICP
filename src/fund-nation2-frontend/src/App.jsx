import { useState } from 'react';
import { fund_nation2_backend } from 'declarations/fund-nation2-backend';
import {Routes, Route} from 'react-router-dom';
import Home from "./pages/Home.jsx"
import Explorepage from "./pages/Explorepage"
import Campaign from "./pages/Campaign"
import Camp2 from "./pages/Camp2"
import Camp3 from "./pages/Campdashpage"
import Camp4 from "./pages/Campshow"
import Weeee from "./pages/Profilepage"


function App() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/explore" element={<Explorepage />} />
    <Route path="/campaign" element={<Campaign />} />
    <Route path="/campaign2/:id" element={<Camp2 />} />
    <Route path="/mycampaigns" element={<Camp3 />} />
    <Route path="/campaigns/:id" element={<Camp4 />} />
    <Route path="/profile" element={<Weeee />} />

  </Routes>
  );
}

export default App;
// function App() {
//   const [greeting, setGreeting] = useState('');

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   const name = event.target.elements.name.value;
    // fund_nation2_backend.greet(name).then((greeting) => {
    //   setGreeting(greeting);
    // });
  //   return false;
  // }

//   return (
//     <main>
//       <img src="/logo2.svg" alt="DFINITY logo" />
//       <br />
//       <br />
//       <form action="#" onSubmit={handleSubmit}>
//         <label htmlFor="name">Enter your name: &nbsp;</label>
//         <input id="name" alt="Name" type="text" />
//         <button type="submit">Click Me!</button>
//       </form>
//       <section id="greeting">{greeting}</section>
//     </main>
//   );
// }

// export default App;

