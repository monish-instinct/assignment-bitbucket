import { Modal, Form, Input, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import type { User, UserFormValues } from "@/types/user";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialUser: User | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

const schema: yup.ObjectSchema<UserFormValues> = yup.object({
  first_name: yup.string().trim().required("First name is required").max(50),
  last_name: yup.string().trim().required("Last name is required").max(50),
  email: yup.string().trim().required("Email is required").email("Enter a valid email"),
  avatar: yup.string().trim().required("Avatar URL is required").url("Enter a valid URL"),
});

const empty: UserFormValues = { first_name: "", last_name: "", email: "", avatar: "" };

export default function UserModal({ open, mode, initialUser, loading, onClose, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: yupResolver(schema),
    defaultValues: empty,
  });

  useEffect(() => {
    if (open) {
      reset(
        initialUser
          ? {
              first_name: initialUser.first_name,
              last_name: initialUser.last_name,
              email: initialUser.email,
              avatar: initialUser.avatar,
            }
          : empty,
      );
    }
  }, [open, initialUser, reset]);

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Add User" : "Edit User"}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="First Name"
          validateStatus={errors.first_name ? "error" : ""}
          help={errors.first_name?.message}
        >
          <Controller name="first_name" control={control} render={({ field }) => <Input {...field} />} />
        </Form.Item>
        <Form.Item
          label="Last Name"
          validateStatus={errors.last_name ? "error" : ""}
          help={errors.last_name?.message}
        >
          <Controller name="last_name" control={control} render={({ field }) => <Input {...field} />} />
        </Form.Item>
        <Form.Item label="Email" validateStatus={errors.email ? "error" : ""} help={errors.email?.message}>
          <Controller name="email" control={control} render={({ field }) => <Input {...field} />} />
        </Form.Item>
        <Form.Item
          label="Avatar URL"
          validateStatus={errors.avatar ? "error" : ""}
          help={errors.avatar?.message}
        >
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => <Input {...field} placeholder="https://..." />}
          />
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading || isSubmitting}>
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
