import "./App.css";
import { useCallback,useState } from "react";
import DateRangePicker from "./DateRangePicker.tsx";

function App() {
  const [val, setVal] = useState(0);
  const changeState = useCallback(() => {
    setVal(val + 1);
  }, [val]);

  return (
    <div>
      <DateRangePicker></DateRangePicker>
    </div>
  );
}

export default App;
