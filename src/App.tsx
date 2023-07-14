import { useState } from "react";
import { SimulationPoint, loadGpx } from "./data";
import Simulation from "./Simulation";

export default function App() {
  const [gpxData, setGpxData] = useState<
    { filename: string; points: Array<SimulationPoint> } | undefined
  >(undefined);

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
        <div className="w-[256px] h-full bg-gray-900 flex flex-col border-r-2 border-r-green-950">
          <p className="mx-auto my-auto text-lg font-sans text-gray-300">
            Import a GPX file
          </p>
          <input
            type="file"
            className="mx-auto my-auto"
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
        </div>
      </main>
    );
  }
}
