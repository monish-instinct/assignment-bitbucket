import { Empty } from "antd";

export default function EmptyState({ description = "No users found" }: { description?: string }) {
  return (
    <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
      <Empty description={description} />
    </div>
  );
}
