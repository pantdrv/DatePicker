import React, { useState, useEffect } from "react";
import "./DatePicker.css";

const DateRangePicker = () => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [yearFrom, setYearFrom] = useState(new Date().getFullYear());
  const [monthFrom, setMonthFrom] = useState(new Date().getMonth());
  const [yearTo, setYearTo] = useState(new Date().getFullYear());
  const [monthTo, setMonthTo] = useState((new Date().getMonth() + 1) % 12);
  const [selectedRange, setSelectedRange] = useState([]);

  useEffect(() => {
    if (monthFrom === 11) {
      setYearTo(yearFrom + 1);
      setMonthTo(0);
    } else {
      setYearTo(yearFrom);
      setMonthTo(monthFrom + 1);
    }
  }, [yearFrom, monthFrom]);

  const togglePickerVisibility = () => setIsPickerVisible(!isPickerVisible);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  };

  const formatToISODate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getDaysOfMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleDateSelection = (date, isStartDate) => {
    if (!isWeekday(date)) return;
    if (isStartDate) {
      setStartDate(date);
      if (endDate && date >= endDate) setEndDate(null);
    } else {
      if (startDate && date > startDate) {
        setEndDate(date);
      }
    }
  };

  const applySelectedRange = () => {
    if (startDate && endDate) {
      const weekends = getWeekendsBetween(startDate, endDate);
      const finalRange = [[formatToISODate(startDate), formatToISODate(endDate)]];
      console.log(finalRange);
      setSelectedRange(finalRange);
      setIsPickerVisible(false);
    }
  };

  const getWeekendsBetween = (start, end) => {
    const weekends = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      if (!isWeekday(currentDate)) {
        weekends.push(formatToISODate(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return weekends;
  };

  const daysInCurrentMonthFrom = getDaysOfMonth(yearFrom, monthFrom);
  const daysInCurrentMonthTo = getDaysOfMonth(yearTo, monthTo);

  const isDateInRange = (date) =>
    startDate && endDate && date >= startDate && date <= endDate;

  const selectLast7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    setStartDate(start);
    setEndDate(end);
  };

  const selectLast30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="date-range-picker">
      <label onClick={togglePickerVisibility} className="picker-label">
        Select Date Range
      </label>
      <div style={{ marginTop: "20px" }}>
        <label style={{ marginTop: "20px" }}>
          Selected Range and Weekends: {selectedRange}
        </label>
      </div>
      {isPickerVisible && (
        <div className="picker-dropdown">
          <div className="calendar-section">
            <div className="calendar">
              <h3>From</h3>
              <select
                value={yearFrom}
                onChange={(e) => setYearFrom(Number(e.target.value))}
              >
                {[...Array(10).keys()].map((offset) => (
                  <option key={offset} value={yearFrom + offset - 5}>
                    {yearFrom + offset - 5}
                  </option>
                ))}
              </select>
              <select
                value={monthFrom}
                onChange={(e) => setMonthFrom(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
              <div className="calendar-grid">
                {daysInCurrentMonthFrom.map((date) => (
                  <button
                    key={date.toISOString()}
                    className={`day-button ${isWeekday(date) ? "weekday" : "weekend"} ${isDateInRange(date) && isWeekday(date) ? "in-range" : ""}`}
                    onClick={() => handleDateSelection(date, true)}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>

            <div className="calendar">
              <h3>To</h3>
              <select
                value={yearTo}
                onChange={(e) => setYearTo(Number(e.target.value))}
              >
                {[...Array(10).keys()].map((offset) => (
                  <option key={offset} value={yearTo + offset - 5}>
                    {yearTo + offset - 5}
                  </option>
                ))}
              </select>
              <select
                value={monthTo}
                onChange={(e) => setMonthTo(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
              <div className="calendar-grid">
                {daysInCurrentMonthTo.map((date) => (
                  <button
                    key={date.toISOString()}
                    className={`day-button ${isWeekday(date) ? "weekday" : "weekend"} ${isDateInRange(date) && isWeekday(date) ? "in-range" : ""}`}
                    onClick={() => handleDateSelection(date, false)}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="predefined-ranges">
            <button onClick={selectLast7Days}>Last 7 Days</button>
            <button onClick={selectLast30Days}>Last 30 Days</button>
          </div>

          <button className="apply-button" onClick={applySelectedRange}>
            Ok
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
