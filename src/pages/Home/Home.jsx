import "./Home.css";
import { Sidebar, MapContainer, FormEnrollment, FormStatistic } from "./components";

const Home = () => {
  return (
    <div className="main">
      <Sidebar />
      <MapContainer />
      <FormEnrollment />
      <FormStatistic />
    </div>
  );
};

export default Home;
