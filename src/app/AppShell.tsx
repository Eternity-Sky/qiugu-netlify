"use client";
import React from "react";
import { Layout } from "antd";
import NavBar from "./NavBar";

const { Content, Footer } = Layout;

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <NavBar />
      <Content style={{ minHeight: 0 }}>{children}</Content>
      <Footer style={{ textAlign: "center", background: "#fff" }}>
        秋谷 OJ ©2025 秋谷 OJ | Powered by Next.js & Ant Design
      </Footer>
    </Layout>
  );
} 