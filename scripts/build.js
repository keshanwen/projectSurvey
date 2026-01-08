import { getRollupConfigs, clearDist } from "./buildBase.js";
import { rollup } from "rollup";
import terser from "@rollup/plugin-terser";

// 定义异步构建函数
async function build() {
  // 获取 Rollup 打包配置
  const configs = await getRollupConfigs();

  // 遍历每个配置进行打包
  for (const name in configs) {
    // 清空输出目录
    clearDist(name);

    // 获取当前配置
    const config = configs[name];

    console.log(`📦 正在打包: ${name}`);

    // 使用 Rollup 进行打包
    const bundle = await rollup({
      input: config.input, // 输入文件
      plugins: [...config.plugins, terser()], // 插件列表，添加 Terser 压缩
      external: config.external // 外部依赖
    });

    // 创建打包任务数组
    const tasks = [];

    // 遍历输出配置，为每个输出创建写入任务
    for (const output of config.output) {
      tasks.push(bundle.write(output));
    }

    // 等待所有写入任务完成
    await Promise.all(tasks);

    console.log(`✅ ${name} 打包完成`);
  }
}

build();
