"use client";
import { jsPDF } from "jspdf";
import type { ScanResult } from "../../types/cyberscope";

interface ReportGenProps {
  result: ScanResult | null;
}

export function ReportGen({ result }: ReportGenProps) {
  const generatePDF = (): void => {
    if (!result) return;

    const doc = new jsPDF();

    console.log(result);

    // Title
    doc.setFontSize(20);
    doc.text("Trinex Security Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Scan ID: ${result.id || "N/A"}`, 20, 35);
    doc.text(`Scanned URL: ${result.url || "N/A"}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 55);

    // Security Score
    // doc.text(`Security Score: ${result.securityScore ?? "N/A"}`, 20, 70);

    // Scripts
    doc.text(`Scripts Detected: ${result.totalScripts ?? 0}`, 20, 85);

    // Network
    if (result.networkCalls) {
      doc.text(`Network Calls: ${result.totalNetworkCalls ?? 0}`, 20, 100);
    }

    // SEO
    if (result.seoAnalysis) {
      doc.text(
        `SEO Score: ${result.seoAnalysis.score ?? "N/A"}/100`,
        20,
        115
      );
    }

    // Alerts
    if (Array.isArray(result.criticalAlerts) && result.criticalAlerts.length > 0) {
      doc.text("Critical Alerts:", 20, 130);
      result.criticalAlerts.slice(0, 5).forEach((alert: { message?: string; }, idx: number) => {
        // Ensure `alert` has a message field
        const message =
          (alert as { message?: string }).message ?? "Alert detected";
        doc.text(`- ${message}`, 25, 140 + idx * 10);
      });
    }

    // Save file
    doc.save(`Trinex_Report_${result.url || "scan"}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      disabled={!result}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg disabled:opacity-50"
    >
      Generate Report
    </button>
  );
}
