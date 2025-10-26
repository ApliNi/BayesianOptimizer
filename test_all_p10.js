import { BayesianOptimizer as BayesianOptimizer_v1 } from "./BayesianOptimizer_v1.js";
import { BayesianOptimizer as BayesianOptimizer_v2 } from "./BayesianOptimizer_v2.js";
import { BayesianOptimizer as BayesianOptimizer_v3 } from "./BayesianOptimizer_v3.js";
import { BayesianOptimizer as BayesianOptimizer_v4 } from "./BayesianOptimizer_v4.js";

// 测试配置
const testConfig = {
    searchSpace: {
        p1: [-10, 10],
        p2: [0, 10],
        p3: [0, 10],
        p4: [-50, 50],
		p5: [-10, 10],
        p6: [0, 10],
		p7: [0, 10],
        p8: [-50, 50],
		p9: [-10, 10],
        p10: [0, 10],
    },
    iterations: 100, // 70
    seed: 123,
    debug: false,
};

// 目标函数 - 寻找最优参数 [-5, 10, 5, 25]
const objective = (params, idx) => {
    const { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10 } = params;
    const optimalParams = [-5, 10, 5, 25, -5, 10, 5, 25, -5, 10, 5, 25];
    const loss = Math.abs(p1 - optimalParams[0]) +
                 Math.abs(p2 - optimalParams[1]) +
                 Math.abs(p4 - optimalParams[3]) +
                 Math.abs(p5 - optimalParams[4]) +
                 Math.abs(p6 - optimalParams[5]) +
                 Math.abs(p7 - optimalParams[6]) +
                 Math.abs(p8 - optimalParams[7]) +
                 Math.abs(p9 - optimalParams[8]) +
                 Math.abs(p10 - optimalParams[9]);
    return loss;
};

// 测试函数
const testVersion = async (version, optimizer, config) => {
    console.log(`\n=== 测试版本 ${version} ===`);
    
    const startTime = performance.now();
    
    try {
        const testConfig = { ...config, objective };
        const result = await optimizer(testConfig);
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        console.log(`最优参数:`, result.bestParams);
        console.log(`最优损失: ${result.bestLoss.toFixed(6)}`);
        console.log(`执行时间: ${executionTime.toFixed(2)}ms`);
        
        return {
            version,
            bestParams: result.bestParams,
            bestLoss: result.bestLoss,
            executionTime,
            success: true,
        };
    } catch (error) {
        console.error(`版本 ${version} 测试失败:`, error.message);
        return {
            version,
            bestLoss: Infinity,
            executionTime: 0,
            success: false,
            error: error.message,
        };
    }
};

// 运行所有测试
const testBayesianOptimizerBest = async () => {
    
    const results = [];
    
	// 测试不同版本
    results.push(await testVersion('v1', BayesianOptimizer_v1, testConfig));
    results.push(await testVersion('v2', BayesianOptimizer_v2, testConfig));
    results.push(await testVersion('v3', BayesianOptimizer_v3, testConfig));
    results.push(await testVersion('v4', BayesianOptimizer_v4, testConfig));
    
    // 分析结果
    console.log('\n=== 测试结果汇总 ===');
    console.log('版本\t最优损失\t执行时间(ms)\t状态');
    console.log('----\t---------\t-----------\t----');
    
    let successfulTests = results.filter(r => r.success);
    
    if (successfulTests.length === 0) {
        console.log('所有测试都失败了！');
        return;
    }
    
    successfulTests.forEach(result => {
        console.log(`${result.version}\t${result.bestLoss.toFixed(6)}\t${result.executionTime.toFixed(2)}\t\t成功`);
    });
    
    // 输出最优结果
    const bestResult = successfulTests.reduce((best, current) => current.bestLoss < best.bestLoss ? current : best);
    return bestResult;
};

// 得到最优结果
const bestResult = testBayesianOptimizerBest();
// console.log(bestResult);

