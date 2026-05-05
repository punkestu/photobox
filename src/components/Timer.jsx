import { useContext, useEffect } from "react";
import { timerProvider } from "../hooks/useTimerProvider";

export default function Timer() {
  const [timer, setTimer] = useContext(timerProvider);
  const minute = () => String(Math.floor(timer / 60)).padStart(2, "0");
  const second = () => String(timer % 60).padStart(2, "0");

  useEffect(() => {
    if (timer <= 0) {
        return;
    }
    const intervalID = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => {
      clearInterval(intervalID);
    };
  }, [timer, setTimer]);
  return (
    <div className="absolute right-0 m-8 px-2 py-1 rounded-xl bg-gray-500/50">
      <p>
        {minute()}:{second()}
      </p>
    </div>
  );
}
