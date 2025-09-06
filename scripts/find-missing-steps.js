/**
 * Утилита для поиска Gherkin steps без step definitions
 * Запуск: node scripts/find-missing-steps.js
 * Опции: node scripts/find-missing-steps.js --feature features/specific.feature
 */

const fs = require('fs');
const path = require('path');

class GherkinStepAnalyzer {
    constructor() {
        this.stepsFile = path.join(__dirname, '../src/steps/AuthenticationSteps.ts');
        this.featuresDir = path.join(__dirname, '../features');
        this.stepDefinitions = new Set();
        this.featureSteps = [];
        this.missingSteps = [];
    }

    // Загружаем все step definitions из файла
    loadStepDefinitions() {
        if (!fs.existsSync(this.stepsFile)) {
            console.log('❌ Файл step definitions не найден:', this.stepsFile);
            return false;
        }

        const content = fs.readFileSync(this.stepsFile, 'utf8');
        const lines = content.split('\n');

        lines.forEach(line => {
            // Ищем строки вида: Given('text', async function
            const match = line.match(/^(Given|When|Then)\('([^']+)',\s*async\s+function/);
            if (match) {
                const stepType = match[1];
                const stepText = match[2];
                
                // Добавляем в набор с нормализацией
                this.stepDefinitions.add(`${stepType}|${this.normalizeStepText(stepText)}`);
                
                // Также добавляем точное совпадение
                this.stepDefinitions.add(`${stepType}|${stepText}`);
            }
        });

        console.log(`📚 Загружено ${this.stepDefinitions.size / 2} step definitions`);
        return true;
    }

    // Нормализует текст шага для сравнения
    normalizeStepText(text) {
        return text
            // Заменяем параметры на плейсхолдеры
            .replace(/\{string\}/g, '"[PARAM]"')
            .replace(/\{int\}/g, '[NUMBER]')
            .replace(/\{float\}/g, '[FLOAT]')
            // Заменяем кавычки в тексте
            .replace(/"([^"]+)"/g, '"[PARAM]"')
            // Заменяем числа
            .replace(/\b\d+(\.\d+)?\b/g, '[NUMBER]')
            // Убираем экранирование
            .replace(/\\\(/g, '(')
            .replace(/\\\)/g, ')')
            .replace(/\\\./g, '.')
            .replace(/\\\+/g, '+');
    }

    // Извлекает шаги из feature файла
    extractStepsFromFeature(featureFile) {
        const content = fs.readFileSync(featureFile, 'utf8');
        const lines = content.split('\n');
        const steps = [];
        let currentStepType = 'Given'; // По умолчанию

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            
            // Пропускаем комментарии, пустые строки и служебные строки
            if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('Feature:') || 
                trimmed.startsWith('Scenario:') || trimmed.startsWith('Background:') ||
                trimmed.startsWith('Examples:') || trimmed.startsWith('|') ||
                trimmed.startsWith('@')) {
                return;
            }

            // Ищем шаги
            const stepMatch = trimmed.match(/^(Given|When|Then|And|But)\s+(.+)$/);
            if (stepMatch) {
                let stepType = stepMatch[1];
                const stepText = stepMatch[2];

                // And/But наследуют тип от предыдущего шага
                if (stepType === 'And' || stepType === 'But') {
                    // Ищем предыдущий Given/When/Then
                    for (let i = index - 1; i >= 0; i--) {
                        const prevMatch = lines[i].trim().match(/^(Given|When|Then)\s+/);
                        if (prevMatch) {
                            stepType = prevMatch[1];
                            break;
                        }
                    }
                } else {
                    currentStepType = stepType;
                }

                steps.push({
                    type: stepType,
                    text: stepText,
                    line: index + 1,
                    file: path.relative(process.cwd(), featureFile),
                    original: trimmed
                });
            }
        });

        return steps;
    }

    // Проверяет, есть ли step definition для данного шага
    hasStepDefinition(step) {
        const normalizedText = this.normalizeStepText(step.text);
        
        // Проверяем точное совпадение
        if (this.stepDefinitions.has(`${step.type}|${step.text}`)) {
            return true;
        }

        // Проверяем нормализованное совпадение
        if (this.stepDefinitions.has(`${step.type}|${normalizedText}`)) {
            return true;
        }

        // Дополнительные проверки для сложных случаев
        for (const stepDef of this.stepDefinitions) {
            const [defType, defText] = stepDef.split('|', 2);
            
            if (defType === step.type) {
                // Проверяем с учетом параметризации
                if (this.matchesParametrized(step.text, defText)) {
                    return true;
                }
            }
        }

        return false;
    }

    // Проверяет соответствие с параметризованными step definitions
    matchesParametrized(stepText, defText) {
        // Создаем регекс из definition text
        let pattern = defText
            .replace(/\{string\}/g, '"[^"]*"')
            .replace(/\{int\}/g, '\\d+')
            .replace(/\{float\}/g, '\\d+(?:\\.\\d+)?')
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Экранируем спецсимволы

        try {
            const regex = new RegExp(`^${pattern}$`);
            return regex.test(stepText);
        } catch (e) {
            return false;
        }
    }

    // Анализирует feature файл
    analyzeFeatureFile(featureFile) {
        console.log(`\n📄 Анализ файла: ${path.relative(process.cwd(), featureFile)}`);
        
        const steps = this.extractStepsFromFeature(featureFile);
        const missingInFile = [];

        steps.forEach(step => {
            if (!this.hasStepDefinition(step)) {
                missingInFile.push(step);
                this.missingSteps.push(step);
            }
        });

        if (missingInFile.length === 0) {
            console.log('✅ Все шаги имеют step definitions');
        } else {
            console.log(`❌ Найдено ${missingInFile.length} шагов без step definitions:`);
            missingInFile.forEach(step => {
                console.log(`   📍 Строка ${step.line}: ${step.type} "${step.text}"`);
            });
        }

        return {
            total: steps.length,
            missing: missingInFile.length,
            steps: missingInFile
        };
    }

    // Анализирует все feature файлы
    analyzeAllFeatures() {
        if (!fs.existsSync(this.featuresDir)) {
            console.log('❌ Папка features не найдена:', this.featuresDir);
            return false;
        }

        const featureFiles = this.findFeatureFiles(this.featuresDir);
        
        if (featureFiles.length === 0) {
            console.log('❌ Feature файлы не найдены');
            return false;
        }

        console.log(`🔍 Найдено ${featureFiles.length} feature файлов`);

        const results = {};
        let totalSteps = 0;
        let totalMissing = 0;

        featureFiles.forEach(file => {
            const result = this.analyzeFeatureFile(file);
            results[file] = result;
            totalSteps += result.total;
            totalMissing += result.missing;
        });

        this.printSummary(totalSteps, totalMissing, results);
        return true;
    }

    // Рекурсивно находит все .feature файлы
    findFeatureFiles(dir) {
        const files = [];
        
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                files.push(...this.findFeatureFiles(fullPath));
            } else if (item.endsWith('.feature')) {
                files.push(fullPath);
            }
        });

        return files;
    }

    // Выводит итоговую статистику
    printSummary(totalSteps, totalMissing, results) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 ИТОГОВАЯ СТАТИСТИКА');
        console.log('='.repeat(60));
        console.log(`📝 Всего Gherkin шагов: ${totalSteps}`);
        console.log(`✅ Шагов с step definitions: ${totalSteps - totalMissing}`);
        console.log(`❌ Шагов БЕЗ step definitions: ${totalMissing}`);
        console.log(`📈 Покрытие: ${((totalSteps - totalMissing) / totalSteps * 100).toFixed(1)}%`);

        if (totalMissing > 0) {
            console.log('\n🔧 РЕКОМЕНДАЦИИ ПО ИСПРАВЛЕНИЮ:');
            
            // Группируем по типам шагов
            const missingByType = this.groupMissingByType();
            
            Object.entries(missingByType).forEach(([type, steps]) => {
                console.log(`\n${type} шаги (${steps.length}):`);
                steps.slice(0, 5).forEach(step => { // Показываем первые 5
                    console.log(`   node scripts/add-step-definition.js "${step.type} ${step.text}"`);
                });
                if (steps.length > 5) {
                    console.log(`   ... и еще ${steps.length - 5} шагов`);
                }
            });
        }
    }

    // Группирует недостающие шаги по типам
    groupMissingByType() {
        const grouped = {
            'Given': [],
            'When': [],
            'Then': []
        };

        this.missingSteps.forEach(step => {
            if (grouped[step.type]) {
                grouped[step.type].push(step);
            }
        });

        return grouped;
    }

    // Генерирует команды для добавления недостающих step definitions
    generateAddCommands() {
        if (this.missingSteps.length === 0) {
            console.log('\n✅ Все шаги имеют step definitions!');
            return;
        }

        console.log('\n🛠️ КОМАНДЫ ДЛЯ ДОБАВЛЕНИЯ НЕДОСТАЮЩИХ STEP DEFINITIONS:');
        console.log('='.repeat(70));
        
        // Убираем дубликаты
        const uniqueSteps = new Map();
        this.missingSteps.forEach(step => {
            const key = `${step.type}|${step.text}`;
            if (!uniqueSteps.has(key)) {
                uniqueSteps.set(key, step);
            }
        });

        uniqueSteps.forEach(step => {
            console.log(`node scripts/add-step-definition.js "${step.type} ${step.text}"`);
        });

        console.log(`\n📊 Всего команд: ${uniqueSteps.size}`);
    }
}

// Основная функция
function main() {
    const args = process.argv.slice(2);
    const analyzer = new GherkinStepAnalyzer();

    console.log('🔍 АНАЛИЗАТОР GHERKIN STEPS БЕЗ STEP DEFINITIONS');
    console.log('='.repeat(60));

    // Загружаем step definitions
    if (!analyzer.loadStepDefinitions()) {
        process.exit(1);
    }

    // Проверяем аргументы командной строки
    if (args.includes('--feature')) {
        const featureIndex = args.indexOf('--feature');
        if (featureIndex + 1 < args.length) {
            const featureFile = path.resolve(args[featureIndex + 1]);
            if (fs.existsSync(featureFile)) {
                analyzer.analyzeFeatureFile(featureFile);
            } else {
                console.log('❌ Feature файл не найден:', featureFile);
                process.exit(1);
            }
        } else {
            console.log('❌ Не указан путь к feature файлу');
            process.exit(1);
        }
    } else {
        // Анализируем все feature файлы
        analyzer.analyzeAllFeatures();
    }

    // Генерируем команды для исправления
    if (args.includes('--generate-commands')) {
        analyzer.generateAddCommands();
    }

    // Показываем команды по умолчанию, если есть недостающие шаги
    if (analyzer.missingSteps.length > 0 && !args.includes('--no-commands')) {
        analyzer.generateAddCommands();
    }
}

// Запуск
if (require.main === module) {
    main();
}

module.exports = { GherkinStepAnalyzer };
