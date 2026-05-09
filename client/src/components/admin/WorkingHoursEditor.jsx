// Per-day working hours grid — closed toggle + start/end + optional break.

const dayLabels = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const WorkingHoursEditor = ({ value = [], onChange }) => {
  const update = (idx, patch) => {
    const next = [...value];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="hidden sm:grid grid-cols-12 gap-2 px-3 text-[10px] uppercase tracking-widest font-bold text-text-muted">
        <div className="col-span-2">Day</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-4 text-center border-b border-line-soft pb-1">
          Working (Start — End)
        </div>
        <div className="col-span-4 text-center border-b border-line-soft pb-1">
          Break (Start — End)
        </div>
      </div>

      <div className="space-y-2">
        {value.map((wh, i) => (
          <div
            key={wh.day}
            className="grid grid-cols-12 items-center gap-2 p-3 bg-bg-surface border border-line-soft rounded-lg"
          >
            {/* Day label */}
            <div className="col-span-12 sm:col-span-2 font-medium text-sm">
              {dayLabels[wh.day]}
            </div>

            {/* Closed toggle */}
            <label className="col-span-6 sm:col-span-2 flex items-center gap-2 text-xs text-text-muted">
              <input
                type="checkbox"
                checked={wh.closed}
                onChange={(e) => update(i, { closed: e.target.checked })}
                className="accent-rose-gold"
              />
              Closed
            </label>

            {/* Start / End */}
            <input
              type="time"
              value={wh.startTime}
              disabled={wh.closed}
              onChange={(e) => update(i, { startTime: e.target.value })}
              className="col-span-6 sm:col-span-2 input-luxe py-2"
              placeholder="Start time"
            />
            <input
              type="time"
              value={wh.endTime}
              disabled={wh.closed}
              onChange={(e) => update(i, { endTime: e.target.value })}
              className="col-span-6 sm:col-span-2 input-luxe py-2"
              placeholder="End time"
            />

            {/* Break Start / End (optional) */}
            <input
              type="time"
              value={wh.breakStart || ""}
              disabled={wh.closed}
              placeholder="Break start"
              onChange={(e) => update(i, { breakStart: e.target.value })}
              className="col-span-6 sm:col-span-2 input-luxe py-2"
            />
            <input
              type="time"
              value={wh.breakEnd || ""}
              disabled={wh.closed}
              placeholder="Break end"
              onChange={(e) => update(i, { breakEnd: e.target.value })}
              className="col-span-6 sm:col-span-2 input-luxe py-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkingHoursEditor;
