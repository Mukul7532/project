import Navbar from "./Navbar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">{children}</main>
    </div>
  );
}