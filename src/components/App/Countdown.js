import React, { useState, useEffect } from "react";
import "./Countdown.css";
import moment from "moment-timezone";

const calculateCountdown = (streamSchedule) => {
  let streamDay = 1;
  let streamTime = moment("00:00", "HH:mm");

  // Get current datetime
  const today = moment();
  // Number of days until stream
  let dayNum = today.day();
  //Check if there's a stream today
  let streamToday = false;

  if (streamSchedule[dayNum - 1] != null) {
    let nextStream = moment(streamSchedule[dayNum - 1], "HH:mm").toDate();
    streamToday = streamSchedule[dayNum - 1] != null && nextStream > today;
  }

  if (!streamToday) {
    for (let i = 0; i < 6; i++) {
      dayNum = dayNum < 7 ? dayNum + 1 : 1;
      if (streamSchedule[dayNum - 1] == null) continue;
      break;
    }
  }

  streamTime = moment(streamSchedule[dayNum - 1], "HH:mm");

  let daysToStream = streamToday
    ? 0
    : dayNum - (today.day() < dayNum ? today.day() : today.day() - 7);

  // Milliseconds until stream
  let streamDateTime = moment(+today);
  streamDateTime.set(streamDateTime.add(daysToStream, "d"));
  streamDateTime.set({
    hour: streamTime.hour(),
    minute: streamTime.minute(),
    second: streamTime.second(),
  });

  // Round up ms
  let ms = Math.ceil(streamDateTime.subtract(today) / 1000) * 1000;

  return ms;
};

const Countdown = ({ streamSchedule }) => {
  if (streamSchedule.every((time) => time === null)) {
    return <div className="timer">No Streams This Week :(</div>;
  }

  let ms = calculateCountdown(streamSchedule);

  const [timer_d, setTimer_d] = useState((ms / 8.64e7) | 0);
  const [timer_h, setTimer_h] = useState(((ms % 8.64e7) / 3.6e6) | 0);
  const [timer_m, setTimer_m] = useState(((ms % 3.6e6) / 6e4) | 0);
  const [timer_s, setTimer_s] = useState(((ms % 6e4) / 1e3) | 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let ms = calculateCountdown(streamSchedule);
      setTimer_d((ms / 8.64e7) | 0);
      setTimer_h(((ms % 8.64e7) / 3.6e6) | 0);
      setTimer_m(((ms % 3.6e6) / 6e4) | 0);
      setTimer_s(((ms % 6e4) / 1e3) | 0);
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="timer">
      <div className="time-labels">
        <div className="label">
          <div>DAYS</div>
          <div className="time">{timer_d}</div>
        </div>
        <div className="label">
          <div>HOURS</div>
          <div className="time">{timer_h}</div>
        </div>
        <div className="label">
          <div>MINUTES</div>
          <div className="time">{timer_m}</div>
        </div>
        <div className="label">
          <div>SECONDS</div>
          <div className="time">{timer_s}</div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
