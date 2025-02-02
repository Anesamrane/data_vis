import Image from "next/image";
import SideBar from "./components/Sidebar";
import PieChart from "./components/page1/PieChart";
import LineChart from "./components/page1/LineChart";
import HorizontalBarChart from "./components/page1/HorizontalBarChart";
import BarChart from "./components/page1/BarChart";
import BoxPlot from "./components/page1/BoxPlot";
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
          <PieChart />
        </div>
        <div style={{ flex: "1 1 300px", backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
         }}>
          <LineChart />
        </div>
        <div style={{ flex: "1 1 300px", backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
         }}>
          <HorizontalBarChart />
        </div>
        <div style={{ flex: "1 1 300px", backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
         }}>
          <BarChart />
        </div>
        <div style={{ flex: "1 1 300px", backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
         }}>
          <BoxPlot />
        </div>
      </div>
    </div>
  );
}
