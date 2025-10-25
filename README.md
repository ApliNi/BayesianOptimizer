
```
这是一个由 DeepSeek AI 编写的简单超参数优化器.
它被用于自动寻找软件的全局最优配置. 参考示例部分了解如何使用它.
```

# Bayesian Optimizer

一个基于高斯过程的贝叶斯超参数优化器，使用 Expected Improvement (EI) 采集函数来智能地搜索最优参数组合。

## 特性

- 🎯 **高斯过程回归**：使用 RBF 核函数作为代理模型
- 📈 **Expected Improvement**：智能的采集函数，平衡探索与利用
- 🔧 **多参数支持**：支持多维参数空间的优化
- ⚡ **并行评估**：支持并行评估目标函数
- 🎲 **可重现性**：支持随机数种子设置

## 快速开始

```javascript
import { BayesianOptimizer } from "./BayesianOptimizer_v2.js";

// 使用示例
const bestResult = await BayesianOptimizer({

	// 目标函数
	// 你可以在这里添加各种东西, 比如运行一些其他软件, 并对结果进行评估
	// 确保此函数的输出值越接近 0 表示输入的参数越合适即可
	objective: (params, idx) => {
		const { x, y, z, a } = params;

		// 设定最优参数是这些
		const optimalParams = [-5, 10, 5, 25];

		// 输入参数距离设定最优参数越近时, loss 越接近 0
		const loss = Math.abs(x - optimalParams[0]) + Math.abs(y - optimalParams[1]) + Math.abs(z - optimalParams[2]) + Math.abs(a - optimalParams[3]);

		console.log(`[${idx}] Loss: ${loss}`);

		return loss;
	},

	// 定义参数搜索空间
	searchSpace: {
		x: [-10, 10],
		y: [0, 10],
		z: [0, 10],
		a: [-50, 50],
	},

	// 定义迭代次数
	iterations: 100,
});

console.log('最优参数:', result.bestParams);
console.log('最优损失:', result.bestLoss);
```

## 版本对比

### 版本1 (BayesianOptimizer_v1.js)
- **基础实现**：提供核心的贝叶斯优化功能
- **简单高效**：执行速度快，资源占用少
- **适用场景**：快速原型验证、简单优化问题
- **特点**：
  - 基础的随机初始化
  - 固定的核长度尺度 (0.5)
  - 单一采集函数 (Expected Improvement)
  - 无超参数优化

### 版本2 (BayesianOptimizer_v2.js)
- **增强实现**：在版本1基础上增加了多项改进
- **更优性能**：优化效果更好，但执行时间稍长
- **适用场景**：复杂优化问题、需要更高精度的场景
- **特点**：
  - 拉丁超立方采样 (LHS) 初始化，提供更好的空间覆盖
  - 自动超参数优化，根据数据动态调整核长度尺度
  - 多种采集函数支持 (EI, UCB, PI)
  - 内存管理机制，限制最大观测点数量防止内存爆炸
  - 边界处理优化，避免数值问题

### 性能对比

根据测试结果（50次迭代）：

| 指标 | 版本1 | 版本2 | 改进 |
|------|-------|-------|------|
| 最优损失 | 10.273 | 5.358 | **47.85%** |
| 执行时间 | 94ms | 184ms | +95.41% |
| 内存使用 | 低 | 中等 | - |

**结论**：版本2在优化效果上有显著提升（损失减少47.85%），但代价是执行时间增加约95%。选择哪个版本取决于您的具体需求：
- 如果速度是首要考虑因素，选择版本1
- 如果优化质量更重要，选择版本2
