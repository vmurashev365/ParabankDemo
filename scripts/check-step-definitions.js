/**
 * Утилита для проверки дубликатов step definitions
 * Запуск: node scripts/check-step-definitions.js
 */

const fs = require('fs');
const path = require('path');

function checkStepDefinitions() {
    const stepsFile = path.join(__dirname, '../src/steps/AuthenticationSteps.ts');
    
    if (!fs.existsSync(stepsFile)) {
        console.log('❌ Файл step definitions не найден:', stepsFile);
        return false;
    }
    
    const content = fs.readFileSync(stepsFile, 'utf8');
    const lines = content.split('\n');
    
    // Находим все step definitions
    const stepDefinitions = [];
    const duplicates = [];
    
    lines.forEach((line, index) => {
        const match = line.match(/^(Given|When|Then)\('([^']+)'.*async function/);
        if (match) {
            const stepType = match[1];
            const stepText = match[2];
            const stepSignature = `${stepType}('${stepText}'`;
            
            const existing = stepDefinitions.find(s => s.signature === stepSignature);
            if (existing) {
                duplicates.push({
                    signature: stepSignature,
                    lines: [existing.line, index + 1]
                });
            } else {
                stepDefinitions.push({
                    signature: stepSignature,
                    line: index + 1,
                    type: stepType,
                    text: stepText
                });
            }
        }
    });
    
    // Выводим результат
    console.log(`📊 Проверка step definitions в ${stepsFile}`);
    console.log(`📝 Найдено step definitions: ${stepDefinitions.length}`);
    
    if (duplicates.length > 0) {
        console.log(`❌ Найдено дубликатов: ${duplicates.length}`);
        duplicates.forEach(dup => {
            console.log(`   🔄 "${dup.signature}" на строках: ${dup.lines.join(', ')}`);
        });
        return false;
    } else {
        console.log('✅ Дубликатов не найдено!');
        
        // Выводим статистику по типам
        const stats = stepDefinitions.reduce((acc, step) => {
            acc[step.type] = (acc[step.type] || 0) + 1;
            return acc;
        }, {});
        
        console.log('📈 Статистика по типам:');
        Object.entries(stats).forEach(([type, count]) => {
            console.log(`   ${type}: ${count}`);
        });
        
        return true;
    }
}

function findMissingStepDefinitions(featureFile) {
    if (!fs.existsSync(featureFile)) {
        console.log('❌ Feature файл не найден:', featureFile);
        return;
    }
    
    const stepsFile = path.join(__dirname, '../src/steps/AuthenticationSteps.ts');
    const stepsContent = fs.readFileSync(stepsFile, 'utf8');
    const featureContent = fs.readFileSync(featureFile, 'utf8');
    
    // Извлекаем все шаги из feature файла
    const featureSteps = [];
    const featureLines = featureContent.split('\n');
    
    featureLines.forEach((line, index) => {
        const trimmed = line.trim();
        const match = trimmed.match(/^(Given|When|Then|And|But)\s+(.+)$/);
        if (match) {
            let stepType = match[1];
            const stepText = match[2];
            
            // And/But наследуют тип от предыдущего шага
            if (stepType === 'And' || stepType === 'But') {
                // Ищем предыдущий Given/When/Then
                for (let i = index - 1; i >= 0; i--) {
                    const prevMatch = featureLines[i].trim().match(/^(Given|When|Then)\s+/);
                    if (prevMatch) {
                        stepType = prevMatch[1];
                        break;
                    }
                }
            }
            
            featureSteps.push({
                type: stepType,
                text: stepText,
                line: index + 1
            });
        }
    });
    
    // Проверяем, какие шаги отсутствуют в step definitions
    const missingSteps = [];
    
    featureSteps.forEach(step => {
        // Упрощенная проверка (без учета параметров)
        const stepRegex = step.text
            .replace(/"/g, '{string}')
            .replace(/\d+/g, '{int}')
            .replace(/\([^)]+\)/g, ''); // Убираем скобки для упрощения
            
        const found = stepsContent.includes(`${step.type}('${step.text}'`) ||
                     stepsContent.includes(`${step.type}('${stepRegex}'`) ||
                     stepsContent.includes(`${step.type}('${step.text.replace(/"/g, '{string}')}'`);
                     
        if (!found) {
            missingSteps.push(step);
        }
    });
    
    if (missingSteps.length > 0) {
        console.log(`\n❌ Отсутствующие step definitions для ${featureFile}:`);
        missingSteps.forEach(step => {
            console.log(`   📍 Строка ${step.line}: ${step.type} "${step.text}"`);
        });
    } else {
        console.log(`\n✅ Все step definitions найдены для ${featureFile}`);
    }
}

// Основная проверка
const isValid = checkStepDefinitions();

// Проверяем конкретные feature файлы
const featureFiles = [
    'features/authentication.feature',
    'features/registration.feature'
];

featureFiles.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
        findMissingStepDefinitions(fullPath);
    }
});

process.exit(isValid ? 0 : 1);
