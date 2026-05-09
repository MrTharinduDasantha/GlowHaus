// Multi-date picker for days off. Click a date to toggle add/remove.

import ReactDatePicker from "react-datepicker";
import { format, isSameDay } from "date-fns";
import { IoCloseCircle } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";

const DaysOffEditor = ({ value = [], onChange }) => {
  const toggleDate = (date) => {
    if (!date) return;
    const exists = value.some((d) => isSameDay(d, date));
    onChange(
      exists ? value.filter((d) => !isSameDay(d, date)) : [...value, date],
    );
  };

  const remove = (date) => onChange(value.filter((d) => !isSameDay(d, date)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-xl overflow-hidden border border-line-soft">
        <ReactDatePicker
          inline
          selected={null}
          onChange={toggleDate}
          highlightDates={value}
          minDate={new Date()}
        />
      </div>

      <div>
        <p className="eyebrow text-rose-gold mb-2">Selected ({value.length})</p>
        {value.length === 0 ? (
          <p className="text-text-muted text-sm">
            Click a date in the calendar to add a day off.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {value
              .slice()
              .sort((a, b) => a - b)
              .map((d, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-elevated border border-line-soft text-xs"
                >
                  {format(d, "MMM d, yyyy")}
                  <button
                    type="button"
                    onClick={() => remove(d)}
                    aria-label="Remove"
                  >
                    <IoCloseCircle className="text-text-muted hover:text-danger" />
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DaysOffEditor;
