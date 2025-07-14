"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Spin, Alert, Modal, Form, Input, Select, message, Popconfirm } from "antd";
const { Title } = Typography;
const { Option } = Select;

const difficultyOptions = [
  { label: "简单", value: "简单" },
  { label: "中等", value: "中等" },
  { label: "困难", value: "困难" },
];

export default function AdminProblemsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/problems")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || "获取题目失败");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
  };
  const openEdit = (record: any) => {
    setEditRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/admin/problems", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        message.success("删除成功");
        fetchData();
      } else {
        message.error(data.message || "删除失败");
      }
    } catch (e: any) {
      message.error(e.message);
    }
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let res;
      if (editRecord) {
        res = await fetch("/api/admin/problems", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, id: editRecord.id }),
        });
      } else {
        res = await fetch("/api/admin/problems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      }
      const data = await res.json();
      if (data.success) {
        message.success(editRecord ? "编辑成功" : "新增成功");
        setModalOpen(false);
        fetchData();
      } else {
        message.error(data.message || "操作失败");
      }
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "标题", dataIndex: "title", key: "title" },
    { title: "难度", dataIndex: "difficulty", key: "difficulty" },
    { title: "标签", dataIndex: "tags", key: "tags" },
    { title: "操作", key: "action", render: (_: any, record: any) => (
      <>
        <Button type="link" onClick={() => openEdit(record)}>编辑</Button>
        <Popconfirm title="确定删除该题目吗？" onConfirm={() => handleDelete(record.id)} okText="删除" cancelText="取消">
          <Button type="link" danger>删除</Button>
        </Popconfirm>
      </>
    ) },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "32px auto", background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
      <Title level={3}>题目管理</Title>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={openAdd}>新增题目</Button>
      {loading ? <Spin size="large" /> : error ? <Alert type="error" message={error} /> : (
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 20 }} />
      )}
      <Modal
        title={editRecord ? "编辑题目" : "新增题目"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" initialValues={{ difficulty: "简单" }}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: "请输入标题" }]}><Input /></Form.Item>
          <Form.Item label="难度" name="difficulty" rules={[{ required: true, message: "请选择难度" }]}><Select options={difficultyOptions} /></Form.Item>
          <Form.Item label="标签" name="tags"><Input placeholder="用逗号分隔" /></Form.Item>
          <Form.Item label="题目描述" name="description"><Input.TextArea rows={5} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 