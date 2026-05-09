// Wrapper around react-datepicker — adds branded styling.
// Limits user to today through (today + advanceBookingDays).

import ReactDatePicker from "react-datepicker";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = ({
  value,
  onChange,
  advanceBookingDays = 30,
  disabledDates = [],
  inline = false,
}) => {
  const minDate = new Date();
  const maxDate = addDays(new Date(), advanceBookingDays);

  return (
    <ReactDatePicker
      selected={value}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      excludeDates={disabledDates}
      inline={inline}
      dateFormat="EEE, MMM d yyyy"
      placeholderText="Choose a date"
      className="input-luxe"
      calendarClassName="!font-body"
    />
  );
};

export default DatePicker;
