// pages/index.js
import Header from '../components/Header';
import CampDashboard from '../components/CampDashboard';
import Footer from '../components/Footer';


export default function Camp3() {
  return (
    <div className=" text-white bg-darkBlue ">
      <Header page={"home"} />
      <CampDashboard/>
      <Footer />
   
    </div>
  );
}



