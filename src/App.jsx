import { Routes, Route } from "react-router-dom";
import About from "./components/about/About";
import AnimatedTitle from "./components/home/AnimatedTitle";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about/*" element={<About />} />
    </Routes>
  );
}

// Home component for the root path
function Home() {
  return (
    <div className="home">
      <main className="home-content">
        <AnimatedTitle />
      </main>
    </div>
  );
}

export default App;
