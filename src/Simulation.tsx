// import { Viewer } from "resium";

import { Cartesian3 } from "cesium";
import { useEffect, useMemo, useState } from "react";
import { Viewer, Entity } from "resium";
import { SimulationPoint } from "./data";
import clsx from "clsx";

// When paused, we should clear interval for this thing.
// When we pause, clear interval instead so counter doesn't increase.
// Store the last TS in real time.

const PLAYBACK_SCALE = [1, 2, 5, 10, 20, 60, 600];

export default function Simulation({
  filename,
  points,
}: {
  filename: string,
  points: Array<SimulationPoint>;
}) {
  const gpxStreamStartTs = points[0].time;
  const [simulationTs, setSimulationTs] = useState(gpxStreamStartTs);
  const [haeBias, setHaeBias] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  useEffect(() => {
    console.log("mounting effect", new Date());
    const begin = Date.now();
    const timer = setInterval(() => {
      if (paused) {
        return;
      }

      const deltaMs = Date.now() - begin;
      setSimulationTs(gpxStreamStartTs + playbackSpeed * deltaMs);
    }, 100);
    return () => {
      console.log("unmounting effect", new Date());
      clearInterval(timer);
    };
  }, [paused, playbackSpeed]);

  const point = useMemo(() => {
    for (let i = 0; i < points.length; i++) {
      if (points[i].time >= simulationTs) {
        return points[i];
      }
    }

    return points[points.length - 1];
  }, [simulationTs]);

  const { lon, lat } = point;
  const position = Cartesian3.fromDegrees(lon, lat);

  return (
    <main className="w-screen h-screen flex">
      <div className="w-[256px] h-full bg-gray-900 flex flex-col border-r-2 border-r-green-950">
        <div className="group bg-purple-950 outline-[5px] outline-cyan-500 outline-offset-2 rounded-xl w-2/3 px-3 h-10 flex mt-6 mx-auto">
          <button
            className="mx-auto my-auto text-gray-200 group-hover:text-green-500"
            onClick={(evt) => {
              evt.preventDefault();
              setPaused((p) => !p);
            }}
          >
            <p
              className={clsx("font-mono text-xs overflow-hidden", {
                "text-red-600": paused,
                "text-green-500": !paused,
              })}
            >
              {new Date(simulationTs).toISOString()}
            </p>
          </button>
        </div>
        <div className="group bg-purple-950 outline-2 outline-offset-2 outline-red-600 rounded-xl w-2/3 px-3 h-10 flex flex-col mt-6 mx-auto">
          <label className="text-gray-200">Speed: {playbackSpeed}x</label>
          <input
            type="range"
            min={0}
            defaultValue={0}
            max={PLAYBACK_SCALE.length - 1}
            onChange={(evt) =>
              setPlaybackSpeed(PLAYBACK_SCALE[evt.target.valueAsNumber])
            }
          />
        </div>
        <div className="group bg-purple-950 outline-2 outline-offset-2 outline-red-600 rounded-xl w-3/4 px-3 h-24 flex flex-col mt-6 mx-auto">
          <label className="text-gray-200">±ele: {haeBias}</label>
          <input
            type="range"
            min={-100}
            defaultValue={25}
            max={75}
            onChange={(evt) => setHaeBias(evt.target.valueAsNumber)}
          />
        </div>
      </div>

      <div className="w-full grow flex">
        <Viewer timeline={false} animation={false}>
          <Entity
            description={JSON.stringify(point, null, 2)}
            name={filename}
            point={{ pixelSize: 10 }}
            position={position}
          />
          {/* <CameraFlyTo destination={position} duration={5} /> */}
        </Viewer>
      </div>
    </main>
  );
}
