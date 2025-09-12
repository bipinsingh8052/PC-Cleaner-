/* global chrome */
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import Navbar from "./navbar";
import HeroSection from "./herosection";
export default function App() {
    const [count, setCount] = useState(0);
  const [spinning, setSpinning] = useState(false);
   const [direction, setDirection] = useState("up"); // "up" or "down"
  const handleClick = (type) => {
    // This alert always runs when any button is clicked
    // alert(`You clicked the "${type}" button!`);
       if (spinning) return;
    setSpinning(true);
    // Toggle direction if at bounds
    if (count >= 100) setDirection("down");
    else if (count <= 0) setDirection("up");

    if (!chrome || !chrome.browsingData) {
      console.log("chrome.browsingData API not available");
      return;
    }

    const dataMap = {
      history: { history: true },
      cookies: { cookies: true },
      cache: { cache: true },
    };

    chrome.browsingData.remove({ since: 0 }, dataMap[type], () => {
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} cleared ✅`);
    });
  };


useEffect(() => {
    let interval;
    if (spinning) {
      interval = setInterval(() => {
        setCount(prev => {
          let next = direction === "up" ? prev + 1 : prev - 1;
          if (next > 100) next = 100;
          if (next < 0) next = 0;
          // Stop spinning when limit reached
          if ((direction === "up" && next === 100) || (direction === "down" && next === 0)) {
            clearInterval(interval);
            setSpinning(false);
          }
          return next;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [spinning, direction]);


  return (
    <>
  
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>PC Cleaner</h2>
      <button onClick={() => handleClick("history")}>Clear History</button>
      <button onClick={() => handleClick("cookies")}>Clear Cookies</button>
      <button onClick={() => handleClick("cache")}>Clear Cache</button>
     
    </div>
     <div className="spinner-container">
      <div className={`spinner ${direction === "up" ? "up" : "down"}`}>
        {count}%
      </div>
      <button className="spin-btn" onClick={() => handleClick("history")}>Start</button>
    </div>
    </>
  );
}
