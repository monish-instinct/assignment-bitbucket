import { Layout, Button, Segmented, Space, Typography } from "antd";
import { LogoutOutlined, PlusOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { logout } from "@/features/auth/authSlice";
import { toggleView } from "@/features/users/usersSlice";
import SearchBar from "@/components/SearchBar/SearchBar";
import { setSearch } from "@/features/users/usersSlice";

const { Header } = Layout;

interface Props {
  onAddUser: () => void;
}

export default function Navbar({ onAddUser }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { viewMode, searchTerm } = useAppSelector((s) => s.users);

  const handleLogout = () => {
    dispatch(logout());
    navigate({ to: "/login" });
  };

  return (
    <Header
      style={{
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        height: "auto",
        minHeight: 64,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Typography.Title level={4} style={{ margin: 0, color: "#5B5FEF", fontWeight: 700 }}>
        UserHub
      </Typography.Title>
      <div style={{ flex: "1 1 280px", minWidth: 200 }}>
        <SearchBar value={searchTerm} onChange={(v) => dispatch(setSearch(v))} />
      </div>
      <Space wrap>
        <Segmented
          value={viewMode}
          onChange={(v) => dispatch(toggleView(v as "list" | "card"))}
          options={[
            { label: "List", value: "list", icon: <UnorderedListOutlined /> },
            { label: "Cards", value: "card", icon: <AppstoreOutlined /> },
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddUser}>
          Add User
        </Button>
        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </Header>
  );
}
