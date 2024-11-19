// pages/index.js
import Header from '../components/Header';
import Uploadpost from '../components/Campaign2';
import Footer from '../components/Footer';


export default function Camp2() {
  return (
    <div className=" text-white bg-darkBlue ">
      <Header page={"home"} />
      <Uploadpost/>
      <Footer />
   
    </div>
  );
}
