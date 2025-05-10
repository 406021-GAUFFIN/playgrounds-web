import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-50" />,
});

export default MapComponent;
