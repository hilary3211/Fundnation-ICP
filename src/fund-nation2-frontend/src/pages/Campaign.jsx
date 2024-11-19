// pages/index.js
import Header from '../components/Header';
import CampaignPage from '../components/CampaignPage';
import Footer from '../components/Footer';


export default function Campaign() {
  return (
    <div className=" text-white bg-darkBlue ">
      <Header page={"home"} />
      <CampaignPage/>
      <Footer />
   
    </div>
  );
}
