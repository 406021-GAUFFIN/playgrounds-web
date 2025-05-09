import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponentClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center border-1 border-round">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Cargando mapa...</span>
      </div>
    </div>
  ),
});

export default MapComponent;
