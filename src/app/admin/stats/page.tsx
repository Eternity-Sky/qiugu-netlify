"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Spin, Alert } from "antd";
const { Title } = Typography;

export default function AdminStatsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || "获取统计失败");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={3}>系统统计</Title>
      {loading ? <Spin size="large" /> : error ? <Alert type="error" message={error} /> : data && (
        <Row gutter={24}>
          <Col xs={24} sm={8}><Card><Title level={4}>题目数</Title><div style={{fontSize:32}}>{data.problems}</div></Card></Col>
          <Col xs={24} sm={8}><Card><Title level={4}>用户数</Title><div style={{fontSize:32}}>{data.users}</div></Card></Col>
          <Col xs={24} sm={8}><Card><Title level={4}>提交数</Title><div style={{fontSize:32}}>{data.submissions}</div></Card></Col>
        </Row>
      )}
    </div>
  );
} 