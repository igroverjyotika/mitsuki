import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <Loader2 className="w-10 h-10 text-slate-800 animate-spin" />
    </div>
  );
};

export default Loading;
