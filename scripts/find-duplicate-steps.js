#!/usr/bin/env node
/**
 * Поиск дубликатов step definitions во всех файлах
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function findAllStepFiles() {
    const stepFiles = glob.sync('src/steps/**/*.ts', { cwd: path.join(__dirname, '..') });
    return stepFiles.map(file => path.join(__dirname, '..', file));
}

function extractStepDefinitions(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const steps = [];

    lines.forEach((line, index) => {
        const stepMatch = line.match(/(Given|When|Then)\s*\(\s*['"`]([^'"`]+)['"`]/);
        if (stepMatch) {
            steps.push({
                file: filePath,
                line: index + 1,
                type: stepMatch[1],
                expression: stepMatch[2],
                fullLine: line.trim()
            });
        }
    });

    return steps;
}

function findDuplicates() {
    const allFiles = findAllStepFiles();
    const allSteps = [];

    // Собираем все step definitions
    for (const file of allFiles) {
        const steps = extractStepDefinitions(file);
        allSteps.push(...steps);
    }

    // Группируем по выражению
    const grouped = {};
    allSteps.forEach(step => {
        const key = `${step.type}:${step.expression}`;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(step);
    });

    // Находим дубликаты
    const duplicates = {};
    Object.keys(grouped).forEach(key => {
        if (grouped[key].length > 1) {
            duplicates[key] = grouped[key];
        }
    });

    return duplicates;
}

function generateReport(duplicates) {
    console.log('🔍 ОТЧЕТ О ДУБЛИРОВАННЫХ STEP DEFINITIONS');
    console.log('==========================================');

    const duplicateKeys = Object.keys(duplicates);
    if (duplicateKeys.length === 0) {
        console.log('✅ Дубликатов не найдено!');
        return;
    }

    console.log(`❌ Найдено ${duplicateKeys.length} дублированных step definitions:\n`);

    duplicateKeys.forEach((key, index) => {
        const steps = duplicates[key];
        const [type, expression] = key.split(':');
        
        console.log(`${index + 1}. ${type} '${expression}'`);
        console.log(`   Найдено в ${steps.length} местах:`);
        
        steps.forEach((step, stepIndex) => {
            const relativePath = path.relative(process.cwd(), step.file);
            console.log(`   ${stepIndex + 1}) ${relativePath}:${step.line}`);
        });
        console.log('');
    });

    // Предложения по исправлению
    console.log('🛠️  РЕКОМЕНДАЦИИ:');
    console.log('==================');
    console.log('1. Удалите дублирующие step definitions, оставив только один');
    console.log('2. Убедитесь, что оставшийся step definition имеет корректную логику');
    console.log('3. Запустите тесты для проверки работоспособности');
}

// Если вызывается как скрипт
if (require.main === module) {
    const duplicates = findDuplicates();
    generateReport(duplicates);
    process.exit(Object.keys(duplicates).length > 0 ? 1 : 0);
}

module.exports = { findDuplicates, generateReport };
