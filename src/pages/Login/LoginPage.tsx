import { Card, Form, Input, Button, Checkbox, Typography, App as AntApp } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { login } from "@/features/auth/authSlice";

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

const schema: yup.ObjectSchema<LoginValues> = yup.object({
  email: yup.string().trim().required("Email is required").email("Enter a valid email"),
  password: yup.string().required("Password is required").min(6, "Min 6 characters"),
  remember: yup.boolean().default(true),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notification } = AntApp.useApp();
  const { loading, isAuthenticated, error } = useAppSelector((s) => s.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: "eve.holt@reqres.in", password: "cityslicka", remember: true },
  });

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/users" });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: LoginValues) => {
    const res = await dispatch(login({ email: values.email, password: values.password }));
    if (login.fulfilled.match(res)) {
      notification.success({ message: "Welcome back!", placement: "topRight" });
      navigate({ to: "/users" });
    } else {
      notification.error({
        message: "Login failed",
        description: (res.payload as string) || error || "Please try again",
        placement: "topRight",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Card
        style={{ width: "100%", maxWidth: 420, borderRadius: 12, boxShadow: "0 10px 40px rgba(15,23,42,0.08)" }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <Typography.Title level={3} style={{ margin: 0, color: "#0F172A" }}>
            Welcome back
          </Typography.Title>
          <Typography.Text type="secondary">Sign in to manage your users</Typography.Text>
        </div>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Email" validateStatus={errors.email ? "error" : ""} help={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} size="large" prefix={<MailOutlined />} autoComplete="email" />}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} size="large" prefix={<LockOutlined />} autoComplete="current-password" />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Remember me
                </Checkbox>
              )}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
}
