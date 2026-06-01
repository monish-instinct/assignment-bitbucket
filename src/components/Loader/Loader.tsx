import { Spin } from "antd";

export default function Loader({ tip = "Loading..." }: { tip?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 240,
        width: "100%",
      }}
    >
      <Spin size="large" tip={tip} />
    </div>
  );
}
