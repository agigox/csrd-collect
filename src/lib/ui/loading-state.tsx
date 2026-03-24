import { Loader } from "@rte-ds/react";
const LoadingState = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "100%" }}
    >
      <Loader
        appearance="brand"
        label="Chargement des données..."
        labelPosition="under"
        showLabel
        size="large"
      />
    </div>
  );
};
export default LoadingState;
