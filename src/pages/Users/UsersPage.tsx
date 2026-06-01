import { Layout, Row, Col, Pagination, Modal, App as AntApp, Card, Statistic } from "antd";
import { ExclamationCircleOutlined, TeamOutlined, MailOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  setPage,
} from "@/features/users/usersSlice";
import Navbar from "@/components/Navbar/Navbar";
import UserTable from "@/components/UserTable/UserTable";
import UserCard from "@/components/UserCard/UserCard";
import UserModal from "@/components/UserModal/UserModal";
import Loader from "@/components/Loader/Loader";
import EmptyState from "@/components/EmptyState/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import type { User, UserFormValues } from "@/types/user";

const PAGE_SIZE = 6;

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { notification, modal } = AntApp.useApp();
  const { users, loading, error, viewMode, searchTerm, currentPage } = useAppSelector((s) => s.users);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) notification.error({ message: error });
  }, [error, notification]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.first_name.toLowerCase().includes(q) || u.last_name.toLowerCase().includes(q),
    );
  }, [users, debouncedSearch]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleAdd = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((u: User) => {
    setEditing(u);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (u: User) => {
      modal.confirm({
        title: "Delete user",
        icon: <ExclamationCircleOutlined />,
        content: `Are you sure you want to delete ${u.first_name} ${u.last_name}?`,
        okText: "Delete",
        okButtonProps: { danger: true },
        onOk: async () => {
          const res = await dispatch(deleteUser(u.id));
          if (deleteUser.fulfilled.match(res)) {
            notification.success({ message: "User deleted" });
          } else {
            notification.error({ message: (res.payload as string) || "Failed to delete" });
          }
        },
      });
    },
    [dispatch, modal, notification],
  );

  const handleSubmit = useCallback(
    async (values: UserFormValues) => {
      setSubmitting(true);
      const action = editing
        ? await dispatch(updateUser({ id: editing.id, values }))
        : await dispatch(createUser(values));
      setSubmitting(false);
      if (
        (editing && updateUser.fulfilled.match(action)) ||
        (!editing && createUser.fulfilled.match(action))
      ) {
        notification.success({ message: editing ? "User updated" : "User created" });
        setModalOpen(false);
      } else {
        notification.error({ message: (action.payload as string) || "Operation failed" });
      }
    },
    [dispatch, editing, notification],
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <Navbar onAddUser={handleAdd} />
      <Layout.Content style={{ padding: 24, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}>
              <Statistic title="Total users" value={users.length} prefix={<TeamOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}>
              <Statistic title="Filtered" value={filtered.length} prefix={<MailOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}>
              <Statistic title="View" value={viewMode === "list" ? "List" : "Cards"} prefix={<AppstoreOutlined />} />
            </Card>
          </Col>
        </Row>

        {loading && users.length === 0 ? (
          <Loader tip="Loading users..." />
        ) : paginated.length === 0 ? (
          <EmptyState />
        ) : viewMode === "list" ? (
          <UserTable users={paginated} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <Row gutter={[16, 16]}>
            {paginated.map((u) => (
              <Col key={u.id} xs={24} sm={12} md={8} lg={6}>
                <UserCard user={u} onEdit={handleEdit} onDelete={handleDelete} />
              </Col>
            ))}
          </Row>
        )}

        {filtered.length > PAGE_SIZE && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onChange={(p) => dispatch(setPage(p))}
              showSizeChanger={false}
            />
          </div>
        )}
      </Layout.Content>

      <UserModal
        open={modalOpen}
        mode={editing ? "edit" : "create"}
        initialUser={editing}
        loading={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
}
