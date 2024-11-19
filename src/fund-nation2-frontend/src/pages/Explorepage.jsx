// pages/index.js
import Header from '../components/Header';
import Explore from '../components/Explore';
import Footer from '../components/Footer';
// import NFTsGrid from '../components/Nfts';
// import Footer from '../components/Footer';


export default function Explorepage() {
  return (
    <div className=" text-white bg-darkBlue ">
      <Header page={"home"} />
      <Explore/>
      <Footer />
      {/* <Hero />
      
      <HIW />

      <Footer /> */}
    </div>
  );
}
