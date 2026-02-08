"use client";

import * as React from "react";

export type AnalyticsPieChartItem = {
  label: string;
  value?: number;
  color?: string;
};

export type AnalyticsPieChartProps = {
  title?: string;
  subtitle?: string;
  items?: AnalyticsPieChartItem[];
};

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    cx,
    cy,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

export function AnalyticsPieChart({ title, subtitle, items }: AnalyticsPieChartProps) {
  const safeItems = items ?? [];
  const total = safeItems.reduce((sum, item) => {
    const value = Number.isFinite(item.value) ? (item.value as number) : 0;
    return sum + Math.max(0, value);
  }, 0);

  const palette = ["#22d3ee", "#38bdf8", "#0ea5e9", "#14b8a6", "#f97316", "#eab308"];
  let currentAngle = 0;

  return (
    <div
      style={{
        width: "100%",
        padding: "16px",
        borderRadius: "16px",
        background: "rgba(10, 10, 14, 0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "white",
        display: "grid",
        gap: "12px",
      }}
    >
      {title ? (
        <div style={{ fontSize: "14px", fontWeight: 600 }}>{title}</div>
      ) : null}
      {subtitle ? (
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)" }}>{subtitle}</div>
      ) : null}

      {safeItems.length === 0 || total <= 0 ? (
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)" }}>
          No chart data available.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width="160" height="160" viewBox="0 0 120 120" role="img">
              {safeItems.map((item, idx) => {
                const value = Number.isFinite(item.value) ? Math.max(0, item.value as number) : 0;
                if (value <= 0) return null;
                const sliceAngle = (value / total) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + sliceAngle;
                currentAngle = endAngle;
                const fill = item.color || palette[idx % palette.length];
                return (
                  <path
                    key={`${item.label}-${idx}`}
                    d={describeArc(60, 60, 50, startAngle, endAngle)}
                    fill={fill}
                  />
                );
              })}
            </svg>
          </div>
          <div style={{ display: "grid", gap: "6px" }}>
            {safeItems.map((item, idx) => {
              const value = Number.isFinite(item.value) ? Math.max(0, item.value as number) : 0;
              if (value <= 0) return null;
              const color = item.color || palette[idx % palette.length];
              const percent = total ? Math.round((value / total) * 100) : 0;
              return (
                <div key={`${item.label}-legend-${idx}`} style={{ display: "flex", gap: "8px", fontSize: "12px" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "999px",
                      background: color,
                      marginTop: "3px",
                    }}
                  />
                  <span style={{ flex: 1 }}>{item.label || "Unknown"}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
