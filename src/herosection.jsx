import React, { useState, useEffect } from "react";

function App() {
  const resourceData = [
    { name: "RAM", percentage: 42, color: "orange" },
    { name: "CPU", percentage: 48, color: "red" },
    { name: "Battery", percentage: 90, color: "green" },
  ];

  const totalProtectionPercentage = 75;

  // State for animated values
  const [animatedResources, setAnimatedResources] = useState(
    resourceData.map((r) => ({ ...r, percentage: 100 }))
  );
  const [animatedTotal, setAnimatedTotal] = useState(100);

  useEffect(() => {
    // Animate each resource
    const interval = setInterval(() => {
      setAnimatedResources((prev) =>
        prev.map((r, i) => {
          if (r.percentage > resourceData[i].percentage) {
            return { ...r, percentage: r.percentage - 1 };
          }
          return r;
        })
      );
      setAnimatedTotal((prev) =>
        prev > totalProtectionPercentage ? prev - 1 : prev
      );
    }, 100); // speed of animation

    return () => clearInterval(interval);
  }, []);

  const CircularProgress = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
      circumference - (percentage / 100) * circumference;

    return (
      <div
        style={{
          position: "relative",
          width: "140px",
          height: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
        >
          <circle
            strokeWidth="8"
            stroke="#e5e7eb"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            strokeWidth="8"
            stroke="#3b82f6"
            fill="transparent"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 0.2s",
            }}
            r={radius}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3b82f6",
          }}
        >
          <svg
            style={{ width: "50px", height: "50px" }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L3 6v5c0 4.418 2.864 8.28 7 9.85l2 1.15 2-1.15c4.136-1.57 7-5.432 7-9.85V6l-9-4zm-1 14l-4-4 1.41-1.41 2.59 2.58 5.59-5.59 1.41 1.41-7 7z" />
          </svg>
        </div>
      </div>
    );
  };

  const ResourceBar = ({ name, percentage, color }) => {
    const gradients = {
      orange: "linear-gradient(to right, #fb923c, #ea580c)",
      red: "linear-gradient(to right, #f87171, #dc2626)",
      green: "linear-gradient(to right, #34d399, #059669)",
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#444",
            width: "60px",
          }}
        >
          {name}
        </span>
        <div
          style={{
            flex: 1,
            background: "#e5e7eb",
            borderRadius: "9999px",
            height: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "9999px",
              transition: "width 0.2s",
              width: `${percentage}%`,
              background: gradients[color],
            }}
          ></div>
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#444",
            width: "40px",
            textAlign: "right",
          }}
        >
          {percentage}%
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        background: "#f7f7f7",
        minHeight: "500px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          padding: "20px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333",
                marginRight: "10px",
              }}
            >
              My Device
            </h1>
            <span
              style={{
                background: "#d1fae5",
                color: "#047857",
                fontSize: "12px",
                fontWeight: "600",
                padding: "4px 10px",
                borderRadius: "12px",
              }}
            >
              Being protected
            </span>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#666",
            }}
          >
            <svg
              style={{ width: "24px", height: "24px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
            alignItems: "center",
          }}
        >
          <CircularProgress percentage={animatedTotal} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              width: "100%",
            }}
          >
            {animatedResources.map((r, i) => (
              <ResourceBar
                key={i}
                name={r.name}
                percentage={r.percentage}
                color={r.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
