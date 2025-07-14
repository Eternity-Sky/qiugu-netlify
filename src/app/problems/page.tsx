"use client";
import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Spin, Alert } from "antd";
const { Title } = Typography;

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  tags: string;
}

export default function ProblemsPage() {
  const [data, setData] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/problems")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || "获取题目失败");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "标题", dataIndex: "title", key: "title", render: (text: string, record: Problem) => <a href={`/problems/${record.id}`}>{text}</a> },
    { title: "难度", dataIndex: "difficulty", key: "difficulty", render: (d: string) => <Tag color={d === "简单" ? "green" : d === "中等" ? "orange" : "red"}>{d}</Tag> },
    { title: "标签", dataIndex: "tags", key: "tags", render: (tags: string) => tags?.split(",").map((t: string) => <Tag key={t}>{t}</Tag>) },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={2} style={{ marginBottom: 24 }}>题库</Title>
      {loading ? <Spin size="large" /> : error ? <Alert type="error" message={error} /> : (
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 20 }} />
      )}
    </div>
  );
} 