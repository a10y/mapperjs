import { Cartesian3, Color, ConstantPositionProperty, Entity } from "cesium";
import { useEffect, useMemo, useRef, useState } from "react";
import { SimulationPoint } from "./data";
import clsx from "clsx";
import CesiumView from "./CesiumView";

// When paused, we should clear interval for this thing.
// When we pause, clear interval instead so counter doesn't increase.
// Store the last TS in real time.

const PLAYBACK_SCALE = [1, 2, 5, 10, 20, 60, 600];

interface SimulationTimeParams {
  simulationTimeBase: number;
  wallTimeBase: number;
  simulationTimeCurrent: number;
  playbackSpeed: number;
}

export default function Simulation({
  filename,
  points,
}: {
  filename: string;
  points: Array<SimulationPoint>;
}) {
  const entities = useRef<Array<Entity>>();
  const [simulationTime, setSimulationTime] = useState<SimulationTimeParams>({
    simulationTimeBase: points[0].time,
    wallTimeBase: Date.now(),
    simulationTimeCurrent: points[0].time,
    playbackSpeed: PLAYBACK_SCALE[3], // Default 10x playback
  });
  const [haeBias, setHaeBias] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    console.log("mounting effect", new Date());
    const timer = setInterval(() => {
      if (paused) {
        return;
      }

      setSimulationTime((prev) => {
        const deltaMs = Date.now() - prev.wallTimeBase;
        return {
          wallTimeBase: prev.wallTimeBase,
          simulationTimeBase: prev.simulationTimeBase,
          simulationTimeCurrent:
            prev.simulationTimeBase + prev.playbackSpeed * deltaMs,
          playbackSpeed: prev.playbackSpeed,
        };
      });
    }, 100);
    return () => {
      console.log("unmounting effect", new Date());
      clearInterval(timer);
    };
  }, [paused]);

  const point = useMemo(() => {
    for (let i = 0; i < points.length; i++) {
      if (points[i].time >= simulationTime.simulationTimeCurrent) {
        return points[i];
      }
    }

    return points[points.length - 1];
  }, [simulationTime]);

  const { lon, lat } = point;
  const position = Cartesian3.fromDegrees(lon, lat);
  // We don't want to keep making new entity objects, we want to actually preserve the same ones over and over again...etc.
  // How can we populate the remote value with this shit instead?
  if (!entities.current) {
    console.log("creating new entity");
    entities.current = [
      new Entity({
        position: position,
        point: {
          color: Color.BLUE,
          pixelSize: 20,
        },
        id: filename,
        description: JSON.stringify(point, null, 2),
      }),
    ];
  } else {
    entities.current[0].position = new ConstantPositionProperty(position);
  }

  return (
    <main className="w-screen h-screen flex">
      <div className="w-[256px] h-full bg-gray-900 flex flex-col border-r-2 border-r-green-950">
        <div className="group bg-purple-950 outline-[5px] outline-cyan-500 outline-offset-2 rounded-xl w-2/3 px-3 h-10 flex mt-6 mx-auto">
          <button
            className="mx-auto my-auto text-gray-200 group-hover:text-green-500"
            onClick={() => {
              setPaused((p) => !p);
              setSimulationTime((prev) => ({
                simulationTimeBase: prev.simulationTimeCurrent,
                wallTimeBase: Date.now(),
                simulationTimeCurrent: prev.simulationTimeCurrent,
                playbackSpeed: prev.playbackSpeed,
              }));
            }}
          >
            <p
              className={clsx("font-mono text-xs overflow-hidden", {
                "text-red-600": paused,
                "text-green-500": !paused,
              })}
            >
              {new Date(simulationTime.simulationTimeCurrent).toISOString()}
            </p>
          </button>
        </div>
        <div className="group bg-purple-950 outline-2 outline-offset-2 outline-red-600 rounded-xl w-2/3 px-3 h-10 flex flex-col mt-6 mx-auto">
          <label className="text-gray-200">
            Speed: {simulationTime.playbackSpeed}x
          </label>
          <input
            type="range"
            min={0}
            defaultValue={3}
            max={PLAYBACK_SCALE.length - 1}
            onChange={(evt) =>
              setSimulationTime((prev) => ({
                simulationTimeBase: prev.simulationTimeCurrent,
                simulationTimeCurrent: prev.simulationTimeCurrent,
                wallTimeBase: Date.now(),
                playbackSpeed: PLAYBACK_SCALE[evt.target.valueAsNumber!],
              }))
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
        <CesiumView entities={entities.current} />
      </div>
    </main>
  );
}
