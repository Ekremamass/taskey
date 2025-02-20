"use client";

import { FaTh, FaList } from "react-icons/fa";
import { Button } from "@/components/ui/button";

type ToggleButtonProps = {
  viewMode: "grid" | "list";
};

const ToggleButton: React.FC<ToggleButtonProps> = ({ viewMode }) => {
  const handleToggle = () => {
    const newViewMode = viewMode === "grid" ? "list" : "grid";
    const url = new URL(window.location.href);
    url.searchParams.set("viewMode", newViewMode);
    window.location.href = url.toString();
  };

  return (
    <Button onClick={handleToggle}>
      {viewMode === "grid" ? <FaList /> : <FaTh />}
    </Button>
  );
};

export default ToggleButton;
