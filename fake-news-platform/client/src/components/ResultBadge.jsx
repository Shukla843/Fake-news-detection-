// =============================================
// src/components/ResultBadge.jsx
// =============================================
// Reusable badge that shows Fake / Real / Suspicious
// with the appropriate color and icon.

const ResultBadge = ({ label, size = "md" }) => {
  // Map label to styles and emoji
  const config = {
    Fake: {
      className: "badge-fake",
      icon: "⚠️",
      dot: "bg-red-500",
    },
    Real: {
      className: "badge-real",
      icon: "✅",
      dot: "bg-green-500",
    },
    Suspicious: {
      className: "badge-suspicious",
      icon: "🔍",
      dot: "bg-yellow-500",
    },
  };

  const { className, icon, dot } = config[label] || config["Suspicious"];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold font-display ${className} ${sizeClasses[size]}`}
    >
      {/* Animated pulsing dot */}
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      {icon} {label}
    </span>
  );
};

export default ResultBadge;
