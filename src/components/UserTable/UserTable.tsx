import { Table, Avatar, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { memo, useMemo } from "react";
import type { User } from "@/types/user";

interface Props {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}

function UserTable({ users, onEdit, onDelete }: Props) {
  const columns = useMemo<ColumnsType<User>>(
    () => [
      {
        title: "Avatar",
        dataIndex: "avatar",
        key: "avatar",
        width: 80,
        render: (src: string, r) => <Avatar src={src} alt={r.first_name} />,
      },
      { title: "First Name", dataIndex: "first_name", key: "first_name" },
      { title: "Last Name", dataIndex: "last_name", key: "last_name" },
      { title: "Email", dataIndex: "email", key: "email", responsive: ["md"] },
      {
        title: "Actions",
        key: "actions",
        width: 200,
        render: (_v, record) => (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
              Edit
            </Button>
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)}>
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={users}
      pagination={false}
      scroll={{ x: "max-content" }}
      style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0" }}
    />
  );
}

export default memo(UserTable);
