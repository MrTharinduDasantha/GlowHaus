// Date-range picker + "Export PDF" button that downloads the revenue report.

import { useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { IoDownloadOutline } from "react-icons/io5";
import { reportApi } from "../../api/report.api.js";

const ReportExportBtn = () => {
  const [from, setFrom] = useState(
    format(new Date(Date.now() - 30 * 24 * 3600 * 1000), "yyyy-MM-dd"),
  );
  const [to, setTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloading(true);
    try {
      const res = await reportApi.downloadRevenuePdf({ from, to });
      // Build a downloadable Blob URL and click an invisible <a>
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `glowhaus-revenue-${from}-to-${to}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (err) {
      toast.error(err.userMessage || "Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs text-text-muted mb-1">From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="input-luxe py-2"
        />
      </div>
      <div>
        <label className="block text-xs text-text-muted mb-1">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="input-luxe py-2"
        />
      </div>
      <button
        onClick={download}
        disabled={downloading}
        className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
      >
        <IoDownloadOutline />
        {downloading ? "Generating…" : "Export PDF"}
      </button>
    </div>
  );
};

export default ReportExportBtn;
