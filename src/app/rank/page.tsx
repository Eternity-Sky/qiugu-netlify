"use client";
import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Alert } from "antd";
const { Title } = Typography;

export default function RankPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rank")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || "获取排行榜失败");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "排名", dataIndex: "rank", key: "rank", width: 80 },
    { title: "用户名", dataIndex: "user", key: "user" },
    { title: "通过题数", dataIndex: "solved", key: "solved" },
  ];

  return (
    <div style={{ maxWidth: 700, margin: "32px auto", background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={3}>排行榜</Title>
      {loading ? <Spin size="large" /> : error ? <Alert type="error" message={error} /> : (
        <Table rowKey="rank" columns={columns} dataSource={data} pagination={false} />
      )}
    </div>
  );
} 