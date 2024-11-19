// pages/index.js
import Header from '../components/Header.jsx';
import CampaignPage from '../components/Hero.jsx';
import Footer from '../components/Footer';
// import NFTsGrid from '../components/Nfts';
// import Footer from '../components/Footer';


export default function Home() {
  return (
    <div className=" text-white bg-darkBlue ">
      <Header page={"home"} />
      <CampaignPage/>
      <Footer />
  
    </div>
  );
}
