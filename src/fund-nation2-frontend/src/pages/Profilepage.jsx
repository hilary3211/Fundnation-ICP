import Header from '../components/Header';
import ProfileSettings from '../components/Profile';
import Footer from '../components/Footer';



export default function Weeee() {
  return (
    <div className=" text-white bg-darkBlue ">
      <Header page={"home"} />
      <ProfileSettings/>
      <Footer />
    </div>
  );
}


