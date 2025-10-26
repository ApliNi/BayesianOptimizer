
```
这是一个由 DeepSeek & Gemini & GLM 编写的简单超参数优化器.
它被用于自动寻找软件的全局最优配置. 参考示例部分了解如何使用它.
```

# Hyperparameter Optimizer

一个基于遗传算法的超参数优化器，使用选择、交叉和突变操作来智能地搜索最优参数组合。

## 特性

- 🧬 **遗传算法**：基于自然选择原理的全局优化算法
- 🎯 **锦标赛选择**：使用锦标赛选择机制保留优秀个体
- 🔧 **多参数支持**：支持多维参数空间的优化
- ⚡ **并行评估**：支持并行评估目标函数
- 🎲 **可重现性**：支持随机数种子设置

## 快速开始

```javascript
import { GeneticOptimizer } from "./GeneticOptimizer_v1.js";

// 使用示例
const bestResult = await GeneticOptimizer({

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
	iterations: 50,

	// 定义随机数种子
	seed: 123,

	// 调试模式 (打印日志)
	debug: true,
});

console.log('最优参数:', result.bestParams);
console.log('最优损失:', result.bestLoss);

// bestResult: {
//   bestParams: {
//     x: -5.047565157750344,
//     y: 10,
//     z: 4.809293552812071,
//     a: 24.944958847736626
//   },
//   bestLoss: 0.2933127572016474,
//   totalIterations: 50
// }
```
