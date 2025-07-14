"use client";
import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Alert } from "antd";
const { Title } = Typography;

export default function AdminSubmissionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || "获取提交失败");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "用户ID", dataIndex: "user_id", key: "user_id" },
    { title: "题目ID", dataIndex: "problem_id", key: "problem_id" },
    { title: "状态", dataIndex: "status", key: "status" },
    { title: "语言", dataIndex: "language", key: "language" },
    { title: "提交时间", dataIndex: "submit_time", key: "submit_time" },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "32px auto", background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={3}>评测管理</Title>
      {loading ? <Spin size="large" /> : error ? <Alert type="error" message={error} /> : (
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 20 }} />
      )}
    </div>
  );
} 