import { Loader } from "@rte-ds/react";
const LoadingState = ({ message }: { message: string }) => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "100%" }}
    >
      <Loader
        appearance="brand"
        label={message}
        labelPosition="under"
        showLabel
        size="large"
      />
    </div>
  );
};
export default LoadingState;
