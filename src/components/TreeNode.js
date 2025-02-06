import React, { useState } from "react";

const TreeNode = ({ node, onNodeSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleSelect = () => {
    onNodeSelect(node);
  };

  return (
    <div style={{ marginLeft: node.level * 10 }}>
      <div
        style={{
          display: "block", // Chuyển sang hiển thị block
          cursor: node.children && node.children.length > 0 ? "default" : "pointer",
        }}
        onClick={handleSelect}
      >
        {/* Hiển thị mũi tên nếu có con */}
        {node.children && node.children.length > 0 ? (
          <span
            onClick={handleExpand}
            style={{
              marginRight: 5,
              cursor: "pointer",
              display: "inline-block",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)", // Xoay mũi tên
              transition: "transform 0.2s ease",
            }}
          >
            ▶
          </span>
        ) : (
          <span style={{ marginRight: 5, visibility: "hidden" }}>▶</span> // Ẩn mũi tên nếu không có con
        )}
        {/* Hiển thị nhãn của node */}
        <span>{node.label}</span>
      </div>
      {/* Hiển thị danh sách con nếu expanded */}
      {expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} onNodeSelect={onNodeSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
