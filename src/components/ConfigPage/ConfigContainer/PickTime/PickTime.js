import React from "react";
import TimePicker from "react-time-picker";
import "./PickTime.css";

const PickTime = (props) => {
  return (
    <div className="time-picker">
      <p>{props.name}</p>
      <TimePicker
        amPmAriaLabel="Select AM/PM"
        clearAriaLabel="Clear value"
        clockAriaLabel="Toggle clock"
        hourAriaLabel="Hour"
        minuteAriaLabel="Minute"
        nativeInputAriaLabel="Time"
        format="hh:mm a"
        disableClock
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
};

export default PickTime;
