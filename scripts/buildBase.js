import path from "node:path";        
import URL from "node:url";          
import fs from "node:fs";            
import { nodeResolve } from "@rollup/plugin-node-resolve";  
import commonjs from "@rollup/plugin-commonjs";             
import typescript from "rollup-plugin-typescript2";        
import vue from "@vitejs/plugin-vue";                     
import postcss from "rollup-plugin-postcss";              


const __filename = URL.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义需要打包的包列表
const packages = ["utils"];

// 获取包的根目录路径
function getPackageRoots() {
  return packages.map(pkg => path.resolve(__dirname, "../packages", pkg));
}

// 读取指定目录下的 package.json 文件
async function packageJson(root) {
  // 构建 package.json 的完整路径
  const jsonPath = path.resolve(root, "package.json");
  const content = await fs.promises.readFile(jsonPath, "utf-8");
  return JSON.parse(content);
}

// 生成单个包的 Rollup 配置
async function getRollupConfig(root) {
  // 读取包的配置信息
  const config = await packageJson(root);
  // 构建 TypeScript 配置文件路径
  const tsconfig = path.resolve(root, "tsconfig.json");
  // 从 package.json 中获取构建选项
  const { name, formats } = config.buildOptions || {};
  // 构建输出目录路径
  const dist = path.resolve(root, "./dist");
  // 构建入口文件路径
  const entry = path.resolve(root, "./src/index.ts");
  
  // 定义 Rollup 配置对象
  const rollupOptions = {
    input: entry,              // 入口文件
    sourcemap: true,           // 生成源映射
    external: ["vue"],         // 外部依赖，不打包到输出文件中,因为用到该组件一定用的是该框架
    plugins: [                 // 插件列表
      nodeResolve(),           // 解析 node_modules 中的模块
      commonjs(),              // 将 CommonJS 模块转换为 ES6 模块
      typescript({
        tsconfig,              // TypeScript 配置文件
        compilerOptions: {
          outDir: dist         // TypeScript 编译输出目录
        }
      }),
      postcss()                // 处理 CSS 文件
    ],
    dir: dist                  // 输出目录
  };
  
  // 构建输出配置数组
  const output = [];
  for (const format of formats) {
    // 定义单个输出格式的配置
    const outputItem = {
      format,                   // 输出格式 (如 es, cjs, iife 等)
      file: path.resolve(dist, `index.${format}.js`),  // 输出文件路径
      sourcemap: true,         // 生成源映射
      globals: {               // 全局变量映射
        vue: "Vue"
      }
    };
    // 如果是 IIFE 格式，需要指定库的全局变量名
    if (format === "iife") {
      outputItem.name = name;  // 库名
    }
    output.push(outputItem);
  }
  rollupOptions.output = output;
  
  // 配置监听选项
  rollupOptions.watch = {
    include: path.resolve(root, "src/**"),      // 监听 src 目录下的所有文件
    exclude: path.resolve(root, "node_modules/**"),  // 排除 node_modules 目录
    clearScreen: false                          // 不清屏
  };
  return rollupOptions;
}

// 获取所有包的 Rollup 配置
export async function getRollupConfigs() {
  // 获取所有包的根目录
  const roots = getPackageRoots();
  // 并行生成每个包的配置
  const configs = await Promise.all(roots.map(getRollupConfig));
  // 构建配置对象，以包名为键名
  const result = {};
  for (let i = 0; i < packages.length; i++) {
    result[packages[i]] = configs[i];
  }
  return result;
}

// 清空指定包的 dist 目录
export function clearDist(name) {
  // 构建 dist 目录路径
  const dist = path.resolve(__dirname, "../packages", name, "dist");
  // 检查目录是否存在
  if (fs.existsSync(dist)) {
    // 递归删除目录及其内容
    fs.rmSync(dist, { recursive: true, force: true });
  }
}