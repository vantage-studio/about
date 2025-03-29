import { Routes, Route, Navigate } from "react-router-dom";
import About from "./components/about/About";
import AnimatedTitle from "./components/home/AnimatedTitle";
import AnimatedNav from "./components/nav/AnimatedNav";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Redirect root to /about */}
      <Route path="/" element={<Navigate to="/about" replace />} />

      {/* Main about page with AnimatedTitle */}
      <Route path="/about" element={<Home />} />

      {/* Nested about routes */}
      <Route path="/about/about/*" element={<About />} />
    </Routes>
  );
}

// Home component now renders at /about
function Home() {
  return (
    <div className="home">
      <main className="home-content">
        <AnimatedNav />
        <AnimatedTitle />
      </main>
    </div>
  );
}

export default App;
