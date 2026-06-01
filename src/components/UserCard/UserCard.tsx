import { Card, Avatar, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined, MailOutlined } from "@ant-design/icons";
import { memo } from "react";
import type { User } from "@/types/user";

interface Props {
  user: User;
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}

function UserCard({ user, onEdit, onDelete }: Props) {
  return (
    <Card
      hoverable
      style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
      styles={{ body: { padding: 20 } }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Avatar src={user.avatar} size={80} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600, color: "#0F172A", fontSize: 16 }}>
            {user.first_name} {user.last_name}
          </div>
          <div style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
            <MailOutlined style={{ marginRight: 6 }} />
            {user.email}
          </div>
        </div>
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(user)} aria-label={`Edit ${user.first_name}`}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(user)} aria-label={`Delete ${user.first_name}`}>
            Delete
          </Button>
        </Space>
      </div>
    </Card>
  );
}

export default memo(UserCard);
