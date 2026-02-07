"use client";

import * as React from "react";

export type AnalyticsBarChartItem = {
	label: string;
	value?: number;
	unit?: string;
	color?: string;
};

export type AnalyticsBarChartProps = {
	title?: string;
	subtitle?: string;
	items?: AnalyticsBarChartItem[];
};

export function AnalyticsBarChart({ title, subtitle, items }: AnalyticsBarChartProps) {
	const safeItems = items ?? [];
	const maxValue = Math.max(1, ...safeItems.map((item) => item.value));

	return (
		<div
			style={{
				width: "100%",
				padding: "16px",
				borderRadius: "16px",
				background: "rgba(10, 10, 14, 0.85)",
				border: "1px solid rgba(255,255,255,0.08)",
				color: "white",
			}}
		>
			{title ? (
				<div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
					{title}
				</div>
			) : null}
			{subtitle ? (
				<div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", marginBottom: "12px" }}>
					{subtitle}
				</div>
			) : null}

			<div style={{ display: "grid", gap: "10px" }}>
				{safeItems.length === 0 ? (
					<div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)" }}>
						No chart data available.
					</div>
				) : null}
				{safeItems.map((item) => {
							const safeValue = Number.isFinite(item.value) ? item.value : 0;
							const width = `${Math.round((safeValue / maxValue) * 100)}%`;
					const barColor = item.color || "#22d3ee";
					const safeLabel = item.label || "Unknown";
					return (
						<div key={safeLabel} style={{ display: "grid", gap: "6px" }}>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
								<span>{safeLabel}</span>
								<span style={{ color: "rgba(255,255,255,0.7)" }}>
											{safeValue}
									{item.unit ? ` ${item.unit}` : ""}
								</span>
							</div>
							<div
								style={{
									height: "10px",
									borderRadius: "999px",
									background: "rgba(255,255,255,0.08)",
									overflow: "hidden",
								}}
							>
								<div
									style={{
										width,
										height: "100%",
										background: barColor,
										boxShadow: `0 0 12px ${barColor}`,
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
