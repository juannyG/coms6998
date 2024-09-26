"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const SwitchTheme = ({ className }: { className?: string }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  console.log(resolvedTheme);

  return (
    <div className={`flex items-center justify-center text-sm ${className}`}>
      <label className="label">Set color theme:</label>
      <select className="select select-bordered" value={resolvedTheme} onChange={e => setTheme(e.target.value)}>
        <option>business</option>
        <option>dark</option>
        <option>light</option>
      </select>
    </div>
  );
};

export const Footer = () => {
  return (
    <>
      <div className="columns-2 p-10">
        <div className="flex flex-col items-center justify-center text-sm pt-5">
          FOOTER: We could populate this with blockexplorer/other debug tools when in DEV/LOCAL mode
        </div>
        <SwitchTheme />
      </div>
    </>
  );
};
