import * as Cesium from "cesium";
import { useEffect, useRef } from "react";

export default function CesiumView({
  entities,
}: {
  entities: Array<Cesium.Entity>;
}) {
  const viewerNode = useRef<HTMLDivElement>(null);
  const viewer = useRef<Cesium.Viewer>();

  useEffect(() => {
    const cartodb = Cesium.ImageryLayer.fromProviderAsync(
      Promise.resolve(
        new Cesium.UrlTemplateImageryProvider({
          url: "http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        })
      ),
      {}
    );
    viewer.current = new Cesium.Viewer(viewerNode.current!, {
      animation: false,
      fullscreenButton: false,
      vrButton: false,
      homeButton: false,
      navigationHelpButton: false,
      scene3DOnly: true,
      skyBox: false,
      skyAtmosphere: false,
      baseLayerPicker: false,
      baseLayer: cartodb,
      timeline: false,
      terrainShadows: Cesium.ShadowMode.ENABLED,
      useBrowserRecommendedResolution: true,
    });
    viewer.current.provider;
    viewer.current.cesiumWidget.creditContainer.remove();

    return () => {
      viewer.current?.destroy();
      viewer.current = undefined;
    };
  }, [viewerNode]);

  useEffect(() => {
    if (viewer.current == null) {
      return;
    }
    // Figure out how to avoid needing to do this every time...if possible? Why is it updating every time though?
    viewer.current.entities.removeAll();
    viewer.current.entities.suspendEvents();
    for (const entity of entities) {
      viewer.current.entities.add(entity);
    }
    viewer.current.entities.resumeEvents();
    viewer.current.zoomTo(viewer.current.entities);
  }, [viewer, entities]);

  return <div ref={viewerNode} className="w-full h-full p-0 m-0" />;
}
