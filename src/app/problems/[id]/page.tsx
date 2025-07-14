"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, Tag, Spin, Alert, Card } from "antd";
import SubmitPanel from "./submit-panel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css';
const { Title, Paragraph } = Typography;

interface ProblemDetail {
  id: number;
  title: string;
  difficulty: string;
  tags: string;
  description: string;
}

export default function ProblemDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/problems/${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || "获取题目详情失败");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin size="large" style={{ margin: 48 }} />;
  if (error) return <Alert type="error" message={error} style={{ margin: 48 }} />;
  if (!data) return null;

  return (
    <Card style={{ maxWidth: 900, margin: "32px auto", padding: 32 }}>
      <Title level={2}>{data.title}</Title>
      <div style={{ marginBottom: 16 }}>
        <Tag color={data.difficulty === "简单" ? "green" : data.difficulty === "中等" ? "orange" : "red"}>{data.difficulty}</Tag>
        {data.tags?.split(",").map(t => <Tag key={t}>{t}</Tag>)}
      </div>
      <Paragraph style={{ fontSize: 16, whiteSpace: "pre-line" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {data.description || ''}
        </ReactMarkdown>
      </Paragraph>
      <SubmitPanel problemId={data.id} />
    </Card>
  );
} 