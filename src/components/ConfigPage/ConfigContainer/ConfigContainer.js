import React, { useState, useEffect } from "react";
import PickTime from "./PickTime/PickTime";
import TimezoneSelect from "react-timezone-select";

import "./ConfigContainer.css";

const ConfigContainer = ({ schedule, timezone, saveConfig }) => {
  const [mon, setMon] = useState(schedule[0]);
  const [tue, setTue] = useState(schedule[1]);
  const [wed, setWed] = useState(schedule[2]);
  const [thu, setThu] = useState(schedule[3]);
  const [fri, setFri] = useState(schedule[4]);
  const [sat, setSat] = useState(schedule[5]);
  const [sun, setSun] = useState(schedule[6]);

  const [selectedTimezone, setSelectedTimezone] = useState(
    timezone
      ? timezone
      : {
          value: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
  );

  return (
    <div className="config-container">
      <h1 className="config-title">Configure Schedule</h1>
      <h2 className="subtitle">Select Your Timezone:</h2>
      <TimezoneSelect value={selectedTimezone} onChange={setSelectedTimezone} />
      <PickTime name="Monday" onChange={setMon} value={mon} />
      <PickTime name="Tuesday" onChange={setTue} value={tue} />
      <PickTime name="Wednesday" onChange={setWed} value={wed} />
      <PickTime name="Thursday" onChange={setThu} value={thu} />
      <PickTime name="Friday" onChange={setFri} value={fri} />
      <PickTime name="Saturday" onChange={setSat} value={sat} />
      <PickTime name="Sunday" onChange={setSun} value={sun} />
      <div className="button-container">
        <button
          className="form-button"
          onClick={() =>
            saveConfig({
              timezone: selectedTimezone.value
                ? selectedTimezone.value
                : selectedTimezone,
              schedule: [mon, tue, wed, thu, fri, sat, sun],
            })
          }
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ConfigContainer;
