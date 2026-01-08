#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取 apps 目录路径
const appsDir = path.join(__dirname, "..", "apps");

// 检查 apps 目录是否存在
if (!fs.existsSync(appsDir)) {
  console.error("apps 目录不存在");
  process.exit(1);
}

// 获取 apps 目录下的一级子目录
const getSubdirectories = dir => {
  return fs.readdirSync(dir).filter(item => {
    const itemPath = path.join(dir, item);
    return fs.statSync(itemPath).isDirectory();
  });
};

// 检查目录是否包含 package.json 并有 dev 脚本
const hasDevScript = dir => {
  const packageJsonPath = path.join(dir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return packageJson.scripts && packageJson.scripts.dev;
  } catch (error) {
    return false;
  }
};

// 获取有效的项目目录
const validProjects = getSubdirectories(appsDir).filter(projectName => {
  const projectPath = path.join(appsDir, projectName);
  return hasDevScript(projectPath);
});

if (validProjects.length === 0) {
  console.log("没有找到包含 dev 脚本的项目");
  process.exit(0);
}

// 显示项目列表并让用户选择
console.log("请选择要运行 dev 命令的项目:");
validProjects.forEach((project, index) => {
  console.log(`${index + 1}. ${project}`);
});

const readline = process.stdin;
readline.setEncoding("utf8");
readline.setRawMode?.(true); // 设置为原始模式以支持箭头键

let inputBuffer = "";
let selectedIndex = 0;

console.log("\n使用数字键或方向键选择，按回车确认:");

readline.on("data", chunk => {
  inputBuffer += chunk;

  // 处理回车键
  if (chunk.includes("\n") || chunk.includes("\r")) {
    const selection = inputBuffer.trim();
    let projectIndex;

    if (/^\d+$/.test(selection)) {
      // 如果输入的是数字
      projectIndex = parseInt(selection) - 1;
    } else {
      // 如果输入的是序号对应的数字
      projectIndex = selectedIndex;
    }

    if (projectIndex >= 0 && projectIndex < validProjects.length) {
      const selectedProject = validProjects[projectIndex];
      const projectPath = path.join(appsDir, selectedProject);

      console.log(`\n正在启动项目: ${selectedProject}`);
      console.log(`路径: ${projectPath}`);

      // 执行 pnpm --filter 项目名 dev
      const command = `pnpm --filter ${selectedProject} dev`;
      console.log(`执行命令: ${command}`);

      const child = exec(command, { cwd: process.cwd() });

      // 将子进程的输出传递到主进程
      child.stdout?.on("data", data => {
        process.stdout.write(data);
      });

      child.stderr?.on("data", data => {
        process.stderr.write(data);
      });

      child.on("close", code => {
        console.log(`\n子进程退出，退出码: ${code}`);
        process.exit(code || 0);
      });

      readline.removeAllListeners("data");
    } else {
      console.log("无效选择，请重新选择");
      inputBuffer = "";
      selectedIndex = 0;
    }
  } else if (chunk === "\u0003") {
    // Ctrl+C
    console.log("\n退出");
    process.exit(0);
  } else {
    // 处理数字输入
    const char = chunk.trim();
    if (/^\d$/.test(char)) {
      const num = parseInt(char) - 1;
      if (num >= 0 && num < validProjects.length) {
        selectedIndex = num;
        console.log(`\n已选择: ${validProjects[selectedIndex]}`);
        console.log("按回车确认或重新选择:");
        inputBuffer = "";
      }
    }
  }
});
