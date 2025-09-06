/**
 * Помощник для добавления новых step definitions
 * Запуск: node scripts/add-step-definition.js "Given I am on homepage"
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function findAllStepFiles() {
    // Ищем все файлы с step definitions
    const stepFiles = glob.sync('src/steps/**/*.ts', { cwd: path.join(__dirname, '..') });
    return stepFiles.map(file => path.join(__dirname, '..', file));
}

function checkDuplicateInAllFiles(stepDescription) {
    const allStepFiles = findAllStepFiles();
    
    for (const file of allStepFiles) {
        if (!fs.existsSync(file)) continue;
        
        const content = fs.readFileSync(file, 'utf8');
        // Более точный поиск step definition
        const stepDefPattern = new RegExp(`(Given|When|Then)\\('${stepDescription.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`);
        if (stepDefPattern.test(content)) {
            return { exists: true, file: file };
        }
    }
    
    return { exists: false, file: null };
}

function addStepDefinition(stepText) {
    const stepsFile = path.join(__dirname, '../src/steps/AuthenticationSteps.ts');
    
    if (!fs.existsSync(stepsFile)) {
        console.log('❌ Файл step definitions не найден:', stepsFile);
        return false;
    }
    
    const content = fs.readFileSync(stepsFile, 'utf8');
    
    // Парсим step text
    const match = stepText.match(/^(Given|When|Then)\s+(.+)$/);
    if (!match) {
        console.log('❌ Неверный формат step. Используйте: "Given|When|Then текст шага"');
        return false;
    }
    
    const stepType = match[1];
    const stepDescription = match[2];
    
    // Генерируем step definition
    const parametrizedDesc = stepDescription
        .replace(/"([^"]+)"/g, '{string}')
        .replace(/\b\d+\b/g, '{int}');
        
    const functionParams = [];
    let paramIndex = 0;
    const finalDesc = parametrizedDesc
        .replace(/{string}/g, () => {
            functionParams.push(`param${paramIndex++}: string`);
            return '{string}';
        })
        .replace(/{int}/g, () => {
            functionParams.push(`param${paramIndex++}: number`);
            return '{int}';
        });
    
    // Проверяем, что step definition уже не существует во всех файлах
    const duplicateCheck = checkDuplicateInAllFiles(finalDesc);
    if (duplicateCheck.exists) {
        console.log('✅ Step definition уже существует в файле:', duplicateCheck.file);
        console.log('📝 Step text:', stepText);
        return true;
    }
    
    const funcSignature = functionParams.length > 0 
        ? `async function (${functionParams.join(', ')})` 
        : 'async function ()';
    
    const newStepDef = `
${stepType}('${finalDesc}', ${funcSignature} {
  console.log('🔄 Выполняется: ${stepText}');
  // TODO: Implement step logic
  console.log('✅ Step завершен: ${stepText}');
});`;

    // Добавляем в конец файла (перед последней закрывающей скобкой, если есть)
    const updatedContent = content.trimEnd() + newStepDef + '\n';
    
    fs.writeFileSync(stepsFile, updatedContent);
    console.log('✅ Добавлен step definition:', stepText);
    return true;
}

// Если вызывается как скрипт
if (require.main === module) {
    const stepText = process.argv[2];
    if (!stepText) {
        console.log('❌ Укажите step definition. Пример:');
        console.log('node scripts/add-step-definition.js "Given I am on homepage"');
        process.exit(1);
    }
    
    const success = addStepDefinition(stepText);
    process.exit(success ? 0 : 1);
}

module.exports = { addStepDefinition };
