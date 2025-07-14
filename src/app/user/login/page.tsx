"use client";
import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography, message } from "antd";
import { useRouter } from "next/navigation";
const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        message.success("登录成功");
        router.push("/");
      } else {
        setError(data.message || "登录失败");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "64px auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={3} style={{ textAlign: "center" }}>用户登录</Title>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}> 
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>登录</Button>
        </Form.Item>
      </Form>
      {error && <Alert type="error" message={error} />}
    </div>
  );
} 