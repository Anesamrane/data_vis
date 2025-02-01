import Image from "next/image";
import SideBar from "../../app/components/Sidebar";
import Histogram from "../components/page2/Histogram";
import HorizontalBarChart from "../components/page1/HorizontalBarChart";
import BarchartPopulaire from "../components/page2/BarchartPopulaire";
import ScatterPlot from "../components/page2/ScatterPlot";
// import BarChartGross from "./components/page1/BarChartGross";

export default function Home() {
  return (
    <div>
      <SideBar />
      
      <div
        style={{
          position: "absolute",
          left: "300px",
          top: "10px",
          display: "flex",
          flexWrap: "wrap", // Allow elements to wrap to the next line
          justifyContent: "space-between",
          gap: "10px", // Optional: Add some space between the charts
        }}
      >
        
        
        <div style={{ flex: "1 1 200px", backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
         }}> {/* Flex grow, shrink, and basis to control layout */}
          <Histogram />
        </div>
        <div style={{ flex: "1 1 200px", backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
         }}> {/* Flex grow, shrink, and basis to control layout */}
          <HorizontalBarChart />
        </div>
        <div style={{ flex: "1 1 200px", backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
         }}> {/* Flex grow, shrink, and basis to control layout */}
          <BarchartPopulaire />
        </div>
        <div style={{ flex: "1 1 200px", backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
         }}> {/* Flex grow, shrink, and basis to control layout */}
          <ScatterPlot />
        </div>
        
       
      </div>
    </div>
  );
}
