"use client";
import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown } from "antd";
import { useRouter } from "next/navigation";

const { Header } = Layout;

const navItems = [
  { label: "首页", key: "home", path: "/" },
  { label: "题库", key: "problems", path: "/problems" },
];

const userMenuItems = [
  { label: "历史提交", key: "history", path: "/user/history" },
  { label: "个人信息", key: "profile", path: "/user/profile" },
];

function UserStatus() {
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    fetch("/api/user/me")
      .then(res => res.json())
      .then(res => {
        if (res.success) setUsername(res.data.username);
        else setUsername(null);
      });
  }, []);
  if (!mounted) return null;
  if (username) {
    return <span style={{ marginLeft: 32, fontWeight: 500, color: '#1890ff' }}>欢迎，{username}</span>;
  }
  return <span style={{ marginLeft: 32 }}><a href="/user/login">登录</a> / <a href="/user/register">注册</a></span>;
}

export default function NavBar() {
  const router = useRouter();
  return (
    <Header style={{ background: "#fff", boxShadow: "0 2px 8px #f0f1f2" }}>
      <div style={{ float: "left", fontWeight: 700, fontSize: 24, color: "#1890ff", marginRight: 32 }}>
        秋谷 OJ
      </div>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[]}
        items={[
          ...navItems.map(item => ({ label: item.label, key: item.key })),
          {
            label: (
              <Dropdown
                menu={{
                  items: userMenuItems.map(sub => ({
                    label: sub.label,
                    key: sub.key,
                  })),
                  onClick: ({ key }) => {
                    const sub = userMenuItems.find(i => i.key === key);
                    if (sub) router.push(sub.path);
                  },
                }}
                placement="bottom"
              >
                <span style={{ cursor: 'pointer' }}>用户中心</span>
              </Dropdown>
            ),
            key: "user",
          },
        ]}
        onClick={({ key }) => {
          const item = navItems.find(i => i.key === key);
          if (item) router.push(item.path);
          if (key === "user") router.push("/user");
        }}
        style={{ lineHeight: "64px", fontSize: 16, display: 'inline-block' }}
      />
      <UserStatus />
    </Header>
  );
} 