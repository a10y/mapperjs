import { useRef, useState } from "react";
import { SimulationPoint, loadGpx } from "./data";
import Simulation from "./Simulation";

export default function App() {
  const [gpxData, setGpxData] = useState<
    { filename: string; points: Array<SimulationPoint> } | undefined
  >(undefined);
  const uploadRef = useRef<HTMLInputElement>(null);

  if (gpxData != null) {
    return (
      <>
        <Simulation filename={gpxData.filename} points={gpxData.points} />
      </>
    );
  } else {
    // Render picker view
    return (
      <main className="w-screen h-screen flex">
        <div className="h-full w-full bg-black flex flex-col border-r-2 border-r-green-950">
          <input
            ref={uploadRef}
            type="file"
            className="hidden"
            onChange={(evt) => {
              const upload = evt.target.files![0]!;
              console.log(upload);
              upload
                .arrayBuffer()
                .then((buf) => new TextDecoder().decode(buf))
                .then((gpx) =>
                  setGpxData({
                    filename: upload.name,
                    points: loadGpx(gpx),
                  })
                );
            }}
          />
          <p className="mx-auto  my-auto px-6 py-5 bg-slate-300 rounded-lg text-slate-800 text-xl font-sans cursor-pointer" onClick={(evt) => {
            evt.preventDefault();
            if (uploadRef.current) {
              uploadRef.current.click();
            }
          }}>Upload GPX 🔼</p>
        </div>
      </main>
    );
  }
}
