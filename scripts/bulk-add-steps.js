#!/usr/bin/env node
/**
 * Массовое добавление step definitions из файла
 * Использование: node scripts/bulk-add-steps.js features/account-management.feature
 */

const { spawn } = require('child_process');
const { GherkinStepAnalyzer } = require('./find-missing-steps.js');

async function runCommand(command) {
    return new Promise((resolve, reject) => {
        const process = spawn('node', command.split(' ').slice(1), {
            stdio: 'inherit',
            shell: true
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
}

async function bulkAddSteps(featureFile) {
    console.log('🚀 МАССОВОЕ ДОБАВЛЕНИЕ STEP DEFINITIONS');
    console.log('=======================================');
    
    const analyzer = new GherkinStepAnalyzer();
    
    // Загружаем step definitions
    if (!analyzer.loadStepDefinitions()) {
        process.exit(1);
    }
    
    // Анализируем feature файл
    analyzer.analyzeFeatureFile(featureFile);
    
    if (analyzer.missingSteps.length === 0) {
        console.log('✅ Все step definitions уже существуют!');
        return;
    }
    
    // Убираем дубликаты
    const uniqueSteps = new Map();
    analyzer.missingSteps.forEach(step => {
        const key = `${step.type}|${step.text}`;
        if (!uniqueSteps.has(key)) {
            uniqueSteps.set(key, step);
        }
    });
    
    console.log(`📝 Найдено ${uniqueSteps.size} уникальных step definitions для добавления`);
    console.log('⏳ Начинаем добавление...\n');
    
    let added = 0;
    for (const step of uniqueSteps.values()) {
        const command = `node scripts/add-step-definition.js "${step.type} ${step.text}"`;
        console.log(`[${added + 1}/${uniqueSteps.size}] Добавляем: ${step.type} ${step.text.substring(0, 50)}...`);
        
        try {
            await runCommand(command);
            added++;
        } catch (error) {
            console.error(`❌ Ошибка при добавлении: ${error.message}`);
        }
    }
    
    console.log('\n🎉 Массовое добавление завершено!');
    console.log(`✅ Добавлено: ${added} step definitions`);
    console.log(`❌ Ошибок: ${uniqueSteps.size - added}`);
}

// Основная функция
if (require.main === module) {
    const featureFile = process.argv[2];
    
    if (!featureFile) {
        console.log('❌ Не указан feature файл');
        console.log('Использование: node scripts/bulk-add-steps.js features/account-management.feature');
        process.exit(1);
    }
    
    bulkAddSteps(featureFile).catch(error => {
        console.error('💥 Критическая ошибка:', error);
        process.exit(1);
    });
}
