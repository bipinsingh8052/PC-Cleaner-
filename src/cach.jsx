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
    recycle: false,
  });

  const [status, setStatus] = useState({
    history: "",
    cookies: "",
    cache: "",
    recycle: "",
  });

  // ♻️ recycle bin items
  const [recycleItems, setRecycleItems] = useState([]);

  const colors = {
    history: "#f44336",
    cookies: "#ff9800",
    cache: "#4cafef",
    recycle: "#4caf50",
  };

  // ✅ simulate real usage % at start
  const updateStorageUsage = async () => {
    if (navigator.storage && navigator.storage.estimate) {
      const { usage, quota } = await navigator.storage.estimate();
      const percent = Math.round((usage / quota) * 100);
      const finalPercent = percent === 0 ? 100 : percent;

      setProgress({
        history: finalPercent,
        cookies: finalPercent,
        cache: finalPercent,
      });
    }
  };

  const handleClick = (type) => {
    if (spinning[type]) return;

    // ♻️ empty recycle bin completely
    if (type === "recycle") {
      if (recycleItems.length === 0) return;

      setSpinning((prev) => ({ ...prev, recycle: true }));
      setStatus((prev) => ({ ...prev, recycle: `Emptying recycle bin...` }));

      setTimeout(() => {
        setRecycleItems([]); // clear everything
        setSpinning((prev) => ({ ...prev, recycle: false }));
        setStatus((prev) => ({ ...prev, recycle: "Recycle Bin Emptied ✅" }));
      }, 800);
      return;
    }

    // 🧹 history / cookies / cache
    setSpinning((prev) => ({ ...prev, [type]: true }));
    setStatus((prev) => ({ ...prev, [type]: `Cleaning ${type}...` }));

    if (!chrome || !chrome.browsingData) {
      setStatus((prev) => ({ ...prev, [type]: "❌ Not supported here" }));
      setSpinning((prev) => ({ ...prev, [type]: false }));
      return;
    }

    const dataMap = {
      history: { history: true },
      cookies: { cookies: true },
      cache: { cache: true },
    };

    // Perform cleanup
    chrome.browsingData.remove({ since: 0 }, dataMap[type], () => {
      // Animate from current % → 0
      let current = progress[type];
      const interval = setInterval(() => {
        current -= 2;
        if (current <= 0) {
          current = 0;
          clearInterval(interval);
          setSpinning((prev) => ({ ...prev, [type]: false }));
          setStatus((prev) => ({
            ...prev,
            [type]: `${type.charAt(0).toUpperCase() + type.slice(1)} cleared ✅`,
          }));
          setRecycleItems((prev) => [...prev, type]);
        }
        setProgress((prev) => ({ ...prev, [type]: current }));
      }, 30);
    });
  };

  // 🔄 initialize usage when mounted
  useEffect(() => {
    updateStorageUsage();
  }, []);

  return (
    <div className="app">
      <h2 className="title">🧹 Cleaner</h2>

      <div className="btn-group">
        {["history", "cookies", "cache", "recycle"].map((type) => (
          <div key={type} className="cleaner-item">
            <button
              style={{
                background: colors[type],
                opacity:
                  type === "recycle" && recycleItems.length === 0 ? 0.6 : 1,
                cursor:
                  type === "recycle" && recycleItems.length === 0
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={() => handleClick(type)}
              disabled={type === "recycle" && recycleItems.length === 0}
            >
              {type === "recycle"
                ? `Recycle Bin (${recycleItems.length})`
                : `Clear ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </button>

            <div className="spinner-container">
              <div
                className="spinner"
                style={{
                  background:
                    type === "recycle"
                      ? `conic-gradient(${colors.recycle} ${
                          (recycleItems.length / 10) * 360
                        }deg, #ddd ${(recycleItems.length / 10) * 360}deg)`
                      : `conic-gradient(${colors[type]} ${
                          progress[type] * 3.6
                        }deg, #ddd ${progress[type] * 3.6}deg)`,
                }}
              >
                <span>
                  {type === "recycle"
                    ? recycleItems.length
                    : `${progress[type]}%`}
                </span>
              </div>
              <p className="status">{status[type]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
