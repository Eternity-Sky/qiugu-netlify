"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Spin, Alert } from "antd";
const { Title, Paragraph } = Typography;

export default function UserProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || "获取用户信息失败");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card style={{ maxWidth: 500, margin: "32px auto", padding: 32 }}>
      <Title level={3}>个人信息</Title>
      {loading ? <Spin /> : error ? <Alert type="error" message={error} /> : (
        <>
          <Paragraph>用户名：<b>{data?.username}</b></Paragraph>
          <Button type="primary">修改密码</Button>
        </>
      )}
    </Card>
  );
} 