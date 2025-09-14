/* global chrome */
import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [count, setCount] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [direction, setDirection] = useState("up");
  const [recycleBin, setRecycleBin] = useState([]); // log of deleted items

  const dataMap = {
    history: { history: true },
    cookies: { cookies: true },
    cache: { cache: true },
  };

  const handleClick = (type) => {
    if (spinning) return;
    setSpinning(true);

    if (count >= 100) setDirection("down");
    else if (count <= 0) setDirection("up");

    if (!chrome || !chrome.browsingData) {
      console.log("chrome.browsingData API not available");
      return;
    }

    // Remove immediately from browser
    chrome.browsingData.remove({ since: 0 }, dataMap[type], () => {
      alert(`${type} cleared from browser ✅`);

      // Add a log entry in recycle bin
      setRecycleBin((prev) => [...prev, `${type} (cleared)`]);

      setSpinning(false);
    });
  };

  const clearRecycleBin = () => {
    console.log(recycleBin,"find it length of this and give me code ")
    setRecycleBin([]);
    alert("Recycle Bin log cleared 🗑️");
  };

  useEffect(() => {
    let interval;
    if (spinning) {
      interval = setInterval(() => {
        setCount((prev) => {
          let next = direction === "up" ? prev + 1 : prev - 1;
          if (next > 100) next = 100;
          if (next < 0) next = 0;
          if (
            (direction === "up" && next === 100) ||
            (direction === "down" && next === 0)
          ) {
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

        <h3>Recycle Bin (Log)</h3>
        {recycleBin.length === 0 ? (
          <p>Recycle Bin is empty</p>
        ) : (
          <ul>
            {recycleBin.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
        <button onClick={clearRecycleBin} disabled={recycleBin.length === 0}>
          Empty Recycle Bin Log
        </button>
      </div>

      <div className="spinner-container">
        <div className={`spinner ${direction === "up" ? "up" : "down"}`}>
          {count}%
        </div>
        <button className="spin-btn" onClick={() => handleClick("history")}>
          Start
        </button>
      </div>
    </>
  );
}
