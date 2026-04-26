import { QRCodeCanvas } from "qrcode.react";
import { useSearchParams } from "react-router";
export default function GetDrive() {
  const [searchParams] = useSearchParams();
  const print = () => {
    window.print();
  }
  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <QR value={searchParams.get("url")} />
      <p className="font-semibold">Scan QR untuk mendapatkan foto</p>
      <button onClick={print}>Cetak</button>
    </main>
  );
}

function QR({ value }) {
  return (
    <div>
      <QRCodeCanvas value={value} size={200} />
    </div>
  );
}
