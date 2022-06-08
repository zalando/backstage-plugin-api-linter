import React from "react";
import { createDevApp } from "@backstage/dev-utils";
import { APILinterPlugin } from "../src/plugin";
import { APILinter } from "../src/components/APILinter";

createDevApp()
  .registerPlugin(APILinterPlugin)
  .addPage({
    element: <APILinter />,
    title: "Root Page",
    path: "/api-linter",
  })
  .render();
