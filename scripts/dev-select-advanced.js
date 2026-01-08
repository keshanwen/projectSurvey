#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import readline from "readline";
import chalk from "chalk";

const execAsync = promisify(exec);

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = query =>
  new Promise(resolve => {
    rl.question(query, resolve);
  });

async function selectAndRunApp() {
  try {
    const appsDir = path.join(process.cwd(), "apps");

    // 检查 apps 目录是否存在
    try {
      await fs.access(appsDir);
    } catch {
      console.log(chalk.red("❌ apps 目录不存在！"));
      process.exit(1);
    }

    // 读取 apps 目录下的一级文件夹
    const items = await fs.readdir(appsDir, { withFileTypes: true });
    const appDirs = items.filter(item => item.isDirectory()).map(dir => dir.name);

    if (appDirs.length === 0) {
      console.log(chalk.yellow("⚠️  apps 目录下没有子目录！"));
      process.exit(1);
    }

    console.log(chalk.cyan("📱 请选择要启动的应用："));
    console.log("");

    // 显示选项列表
    appDirs.forEach((app, index) => {
      console.log(chalk.green(`  ${index + 1}. ${app}`));
    });
    console.log(chalk.gray(`  0. 全部启动`));
    console.log("");

    // 获取用户选择
    const answer = await question(chalk.blue("➡️  请输入序号（用逗号分隔可以选择多个）: "));

    // 处理用户输入
    let selections = [];
    if (answer.trim() === "0") {
      selections = appDirs;
    } else {
      const indexes = answer
        .split(",")
        .map(num => parseInt(num.trim()) - 1)
        .filter(index => index >= 0 && index < appDirs.length);

      selections = indexes.map(index => appDirs[index]);

      if (selections.length === 0) {
        console.log(chalk.red("❌ 无效的选择！"));
        rl.close();
        process.exit(1);
      }
    }

    // 显示选择结果
    console.log("");
    console.log(chalk.cyan(`🎯 已选择：${selections.join(", ")}`));
    console.log("");

    // 检查并执行 dev 命令
    const results = [];

    for (const appDir of selections) {
      const appPath = path.join(appsDir, appDir);
      const packageJsonPath = path.join(appPath, "package.json");

      try {
        // 检查 package.json 是否存在
        await fs.access(packageJsonPath);

        // 读取 package.json
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));

        // 检查是否有 dev 脚本
        if (!packageJson.scripts || !packageJson.scripts.dev) {
          console.log(chalk.yellow(`⚠️  ${appDir} 没有 dev 脚本，跳过`));
          continue;
        }

        console.log(chalk.green(`🚀 启动 ${appDir}...`));

        // 使用 concurrently 并行执行，或者按顺序执行
        const command = `cd ${appPath} && npm run dev`;

        // 在新进程中执行命令
        const child = exec(command, {
          cwd: appPath,
          stdio: "inherit"
        });

        // 监听输出
        child.stdout?.on("data", data => {
          console.log(chalk.blue(`[${appDir}] ${data}`));
        });

        child.stderr?.on("data", data => {
          console.log(chalk.red(`[${appDir} ERROR] ${data}`));
        });

        results.push({
          app: appDir,
          process: child
        });

        // 等待 500ms，避免日志混在一起
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.log(chalk.red(`❌ ${appDir} 启动失败: ${error.message}`));
      }
    }

    if (results.length === 0) {
      console.log(chalk.yellow("⚠️  没有成功启动任何应用"));
      rl.close();
      process.exit(1);
    }

    console.log("");
    console.log(chalk.green("✅ 所有应用已启动完成！"));
    console.log(chalk.gray("按 Ctrl+C 停止所有应用"));
    console.log("");

    // 处理进程退出
    const cleanup = () => {
      console.log(chalk.yellow("\n🛑 正在停止所有应用..."));
      results.forEach(result => {
        result.process.kill("SIGINT");
      });
      rl.close();
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
  } catch (error) {
    console.error(chalk.red(`❌ 发生错误: ${error.message}`));
    rl.close();
    process.exit(1);
  }
}

// 运行主函数
selectAndRunApp();
