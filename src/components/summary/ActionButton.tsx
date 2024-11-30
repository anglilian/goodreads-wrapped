import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const ActionButton = ({ onClick, icon, label }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="btn-primary inline-flex items-center gap-2"
  >
    {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
    {label}
  </button>
);
