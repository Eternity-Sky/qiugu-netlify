"use client";
import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography, message } from "antd";
import { useRouter } from "next/navigation";
const { Title } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    if (values.password !== values.confirm) {
      setError("两次输入的密码不一致");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: values.username, password: values.password }),
      });
      const data = await res.json();
      if (data.success) {
        message.success("注册成功，请登录");
        router.push("/user/login");
      } else {
        setError(data.message || "注册失败");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "64px auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={3} style={{ textAlign: "center" }}>用户注册</Title>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}> 
          <Input.Password />
        </Form.Item>
        <Form.Item label="确认密码" name="confirm" rules={[{ required: true, message: "请再次输入密码" }]}> 
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>注册</Button>
        </Form.Item>
      </Form>
      {error && <Alert type="error" message={error} />}
    </div>
  );
} 