
// pages/index.js
import Header from '../components/Header';
import Camprof from '../components/Camprof';
import Footer from '../components/Footer';


export default function Camp4() {
  return (
    <div className=" text-white bg-darkBlue ">
      <Header page={"home"} />
      <Camprof/>
      <Footer />
   
    </div>
  );
}



