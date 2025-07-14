"use client";
import React, { useState } from "react";
import { Select, Button, message, Spin, Alert, Input } from "antd";
const { TextArea } = Input;

const languageOptions = [
  { label: "C++", value: "cpp" },
  { label: "Python3", value: "python3" },
  { label: "Java", value: "java" },
];

export default function SubmitPanel({ problemId }: { problemId: number }) {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, language, code }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        message.success("提交成功，评测结果已返回");
      } else {
        setError(data.message || "提交失败");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 32, padding: 24, background: "#fafbfc", borderRadius: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <Select
          options={languageOptions}
          value={language}
          onChange={setLanguage}
          style={{ width: 160 }}
        />
      </div>
      <TextArea
        rows={12}
        value={code}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
        placeholder="请在此输入你的代码..."
        style={{ fontFamily: 'monospace', fontSize: 15, marginBottom: 16 }}
      />
      <div>
        <Button type="primary" onClick={handleSubmit} loading={loading} disabled={!code.trim()}>
          提交代码
        </Button>
      </div>
      {loading && <Spin style={{ marginTop: 16 }} />}
      {error && <Alert type="error" message={error} style={{ marginTop: 16 }} />}
      {result && (
        <Alert
          type={result.status === "Accepted" ? "success" : "error"}
          message={`评测结果：${result.status}`}
          description={result.detail}
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
} 