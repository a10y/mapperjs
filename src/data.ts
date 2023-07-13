export interface SimulationPoint {
  time: number;
  lat: number;
  ele: number;
  lon: number;
}

export function loadGpx(gpx: string): Array<SimulationPoint> {
  const tree = new DOMParser().parseFromString(gpx, "text/xml");

  const trkpts = tree.getElementsByTagName("trkpt");

  const points: Array<SimulationPoint> = [];

  for (const trkpt of trkpts) {
    const time = new Date(trkpt.querySelector("time")!.textContent!).getTime();
    const lon = parseFloat(trkpt.getAttribute("lon")!);
    const lat = parseFloat(trkpt.getAttribute("lat")!);
    const ele = parseFloat(trkpt.querySelector("ele")!.textContent!);
    points.push({
      time,
      lon,
      lat,
      ele,
    });
  }

  return points;
}
