// =============================================
// src/components/StatsBar.jsx
// =============================================
// Shows 4 stat cards at the top of the dashboard:
// Total, Fake, Real, Suspicious counts.

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const StatCard = ({ label, value, color, icon, delay }) => {
  const valueRef = useRef(null);

  // Animate numbers counting up
  useEffect(() => {
    if (!valueRef.current || value === 0) {
      if (valueRef.current) valueRef.current.innerText = "0";
      return;
    }

    gsap.fromTo(
      valueRef.current,
      { innerText: 0 },
      {
        innerText: value,
        duration: 1.2,
        ease: "power2.out",
        delay,
        snap: { innerText: 1 },
        onUpdate: function () {
          valueRef.current.innerText = Math.round(this.targets()[0].innerText);
        },
      }
    );
  }, [value, delay]);

  return (
    <div className="glass-card rounded-xl p-4 flex-1 min-w-[120px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      </div>
      <div
        ref={valueRef}
        className="text-3xl font-display font-bold mb-1"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

const StatsBar = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <StatCard
        label="Total Analyzed"
        value={stats.total}
        color="#6366f1"
        icon="📊"
        delay={0}
      />
      <StatCard
        label="Fake News"
        value={stats.fake}
        color="#ef4444"
        icon="⚠️"
        delay={0.1}
      />
      <StatCard
        label="Real News"
        value={stats.real}
        color="#22c55e"
        icon="✅"
        delay={0.2}
      />
      <StatCard
        label="Suspicious"
        value={stats.suspicious}
        color="#f59e0b"
        icon="🔍"
        delay={0.3}
      />
    </div>
  );
};

export default StatsBar;
