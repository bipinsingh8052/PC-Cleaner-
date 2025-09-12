/* global chrome */
import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [progress, setProgress] = useState({
    history: 100,
    cookies: 100,
    cache: 100,
  });
  const [spinning, setSpinning] = useState({
    history: false,
    cookies: false,
    cache: false,
  });
  const [status, setStatus] = useState({
    history: "",
    cookies: "",
    cache: "",
  });

  const colors = {
    history: "#f44336", // red
    cookies: "#ff9800", // orange
    cache: "#4cafef", // blue
  };

  const handleClick = (type) => {
    if (spinning[type]) return; // prevent multiple clicks
    setSpinning((prev) => ({ ...prev, [type]: true }));
    setStatus((prev) => ({ ...prev, [type]: `Cleaning ${type}...` }));

    if (!chrome || !chrome.browsingData) {
      console.log("chrome.browsingData API not available");
      setStatus((prev) => ({ ...prev, [type]: "❌ Not supported here" }));
      setSpinning((prev) => ({ ...prev, [type]: false }));
      return;
    }

    const dataMap = {
      history: { history: true },
      cookies: { cookies: true },
      cache: { cache: true },
    };

    chrome.browsingData.remove({ since: 0 }, dataMap[type], () => {
      setTimeout(() => {
        setStatus((prev) => ({
          ...prev,
          [type]: `${type.charAt(0).toUpperCase() + type.slice(1)} cleared ✅`,
        }));
      }, 1000);
    });
  };

  // Animate progress (counting down)
  useEffect(() => {
    const intervals = [];

    Object.keys(spinning).forEach((type) => {
      if (spinning[type]) {
        const interval = setInterval(() => {
          setProgress((prev) => {
            let next = prev[type] - 2;
            if (next < 0) next = 0;

            if (next === 0) {
              clearInterval(interval);
              setSpinning((s) => ({ ...s, [type]: false }));
            }

            return { ...prev, [type]: next };
          });
        }, 30);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach((i) => clearInterval(i));
  }, [spinning]);

  return (
    <div className="app">
      <h2 className="title">🧹 Cleaner</h2>

      <div className="btn-group">
        {["history", "cookies", "cache"].map((type) => (
          <div key={type} className="cleaner-item">
            <button
              style={{ background: colors[type] }}
              onClick={() => handleClick(type)}
            >
              Clear {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>

            <div className="spinner-container">
              <div
                className="spinner"
                style={{
                  background: `conic-gradient(${colors[type]} ${
                    progress[type] * 3.6
                  }deg, #ddd ${progress[type] * 3.6}deg)`,
                }}
              >
                <span>{progress[type]}%</span>
              </div>
              <p className="status">{status[type]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
