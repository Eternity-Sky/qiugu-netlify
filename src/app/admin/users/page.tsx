"use client";
import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Alert } from "antd";
const { Title } = Typography;

export default function AdminUsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || "获取用户失败");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "通过题数", dataIndex: "solved", key: "solved" },
    // 后续可加操作列
  ];

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={3}>用户管理</Title>
      {loading ? <Spin size="large" /> : error ? <Alert type="error" message={error} /> : (
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 20 }} />
      )}
    </div>
  );
} 