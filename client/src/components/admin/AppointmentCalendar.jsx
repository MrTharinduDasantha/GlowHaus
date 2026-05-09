// Date-picker driven daily list — admin picks a date, sees that day's appointments
// for ALL stylists (or a filtered stylist).

import { useState } from "react";
import { format } from "date-fns";
import ReactDatePicker from "react-datepicker";
import StylistScheduleView from "./StylistScheduleView.jsx";

const AppointmentCalendar = ({ appointments = [], onSelectAppointment }) => {
  const [date, setDate] = useState(new Date());

  // Filter appointments for the picked date
  const dayKey = format(date, "yyyy-MM-dd");
  const dayItems = appointments.filter(
    (a) => format(new Date(a.startTime), "yyyy-MM-dd") === dayKey,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Calendar */}
      <div className="rounded-2xl overflow-hidden border border-line-soft self-start">
        <ReactDatePicker selected={date} onChange={setDate} inline />
      </div>

      {/* List for selected day */}
      <div className="lg:col-span-2">
        <StylistScheduleView
          appointments={dayItems}
          onSelect={onSelectAppointment}
        />
      </div>
    </div>
  );
};

export default AppointmentCalendar;
