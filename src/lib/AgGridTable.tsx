"use client";

import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AgGridTable<U>(props: AgGridReactProps<U>) {
  return <AgGridReact<U> {...props} />;
}
