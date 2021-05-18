import React, { useState, useEffect } from "react";
import PickTime from "./PickTime/PickTime";
import TimezoneSelect from "react-timezone-select";

import "./ConfigContainer.css";

const ConfigContainer = ({ schedule, timezone, saveConfig }) => {
  const [mon, setMon] = useState(schedule ? schedule[0] : null);
  const [tue, setTue] = useState(schedule ? schedule[1] : null);
  const [wed, setWed] = useState(schedule ? schedule[2] : null);
  const [thu, setThu] = useState(schedule ? schedule[3] : null);
  const [fri, setFri] = useState(schedule ? schedule[4] : null);
  const [sat, setSat] = useState(schedule ? schedule[5] : null);
  const [sun, setSun] = useState(schedule ? schedule[6] : null);

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
