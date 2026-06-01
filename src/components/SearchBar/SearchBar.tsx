import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { memo } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

function SearchBar({ value, onChange }: Props) {
  return (
    <Input
      allowClear
      size="large"
      prefix={<SearchOutlined style={{ color: "#64748B" }} />}
      placeholder="Search by first or last name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ borderRadius: 12, maxWidth: 420 }}
      aria-label="Search users"
    />
  );
}

export default memo(SearchBar);
