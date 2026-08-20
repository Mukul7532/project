import { useState } from "react";
import "./App.css";

function App() {
  const [shipmentId, setShipmentId] = useState("");

  const handleSearch = () => {
    console.log("Searching for shipment:", shipmentId);
    // TODO: connect to GET /shipment/:id once backend is ready
  };

  return (
    <div className="dashboard">
      <h1>Audit Trail Dashboard</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter Shipment ID"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default App;