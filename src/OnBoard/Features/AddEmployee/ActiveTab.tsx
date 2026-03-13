import React, { useRef, useState, useEffect } from "react";

interface StepItem {
  label: string;
}

interface StepButtonsProps {
  menus: StepItem[];
  active?: string;
  onClick?: (label: string) => void;
}

const StepButton: React.FC<StepButtonsProps> = ({ menus, onClick, active }) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Move the sliding indicator to the active tab
  useEffect(() => {
    const activeIndex = menus.findIndex((m) => m.label === active);
    const el = tabRefs.current[activeIndex];
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active, menus]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .steptab-root {
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border-bottom: 1.5px solid #e2e8f0;
          position: relative;
        }

        .steptab-nav {
          display: flex;
          gap: 0;
          position: relative;
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .steptab-btn {
          position: relative;
          padding: 16px 20px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.22s ease;
          white-space: nowrap;
          z-index: 1;
        }

        .steptab-btn:hover { color: #4f46e5; }

        .steptab-btn.active {
          color: #4f46e5;
          font-weight: 600;
        }

        /* Sliding bottom indicator */
        .steptab-indicator {
          position: absolute;
          bottom: -1.5px;
          height: 2.5px;
          background: #6366f1;
          border-radius: 2px 2px 0 0;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        /* Step number badge */
        .steptab-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          margin-right: 7px;
          transition: all 0.22s ease;
          background: #e2e8f0;
          color: #64748b;
        }

        .steptab-btn.active .steptab-badge {
          background: #6366f1;
          color: #fff;
        }
      `}</style>

      <div className="steptab-root">
        <div className="steptab-nav">
          {menus.map((step, index) => (
            <button
              key={index}
              ref={(el) => { tabRefs.current[index] = el; }}
              onClick={() => onClick?.(step.label)}
              className={`steptab-btn ${active === step.label ? "active" : ""}`}
            >
              <span className="steptab-badge">{index + 1}</span>
              {step.label}
            </button>
          ))}

          {/* Animated sliding underline */}
          <div
            className="steptab-indicator"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        </div>
      </div>
    </>
  );
};

export default StepButton;