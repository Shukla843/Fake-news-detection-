// =============================================
// src/components/ConfidenceMeter.jsx
// =============================================
// Animated progress bar showing AI confidence %.
// Color changes based on label.

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ConfidenceMeter = ({ confidence, label }) => {
  const barRef = useRef(null);
  const numberRef = useRef(null);

  // Color map per label
  const colorMap = {
    Fake: "#ef4444",
    Real: "#22c55e",
    Suspicious: "#f59e0b",
  };

  const barColor = colorMap[label] || "#6366f1";

  // ── GSAP Animation: count up the number ────
  useEffect(() => {
    if (!numberRef.current) return;

    // Animate the number from 0 to actual confidence
    gsap.fromTo(
      numberRef.current,
      { innerText: 0 },
      {
        innerText: confidence,
        duration: 1.5,
        ease: "power2.out",
        snap: { innerText: 1 }, // Snap to integers
        onUpdate: function () {
          numberRef.current.innerText =
            Math.round(this.targets()[0].innerText) + "%";
        },
      }
    );

    // Animate the bar width from 0 to confidence%
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      {
        width: `${confidence}%`,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.1,
      }
    );
  }, [confidence]);

  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-400 font-medium">
          AI Confidence
        </span>
        <span
          ref={numberRef}
          className="text-xl font-display font-bold"
          style={{ color: barColor }}
        >
          0%
        </span>
      </div>

      {/* Progress bar track */}
      <div className="w-full h-2.5 bg-panel rounded-full overflow-hidden border border-border">
        {/* Animated fill */}
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            backgroundColor: barColor,
            boxShadow: `0 0 10px ${barColor}80`,
            width: "0%",
          }}
        />
      </div>
    </div>
  );
};

export default ConfidenceMeter;
