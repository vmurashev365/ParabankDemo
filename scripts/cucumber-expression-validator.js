#!/usr/bin/env node
/**
 * Валидатор и автоматическое исправление Cucumber Expressions
 * Проверяет и исправляет проблемы с эскейпингом в step definitions
 */

const fs = require('fs');
const path = require('path');

class CucumberExpressionValidator {
    constructor() {
        this.problematicPatterns = [
            // Скобки без эскейпинга
            { pattern: /\([^\\)]*\/[^\\)]*\)/g, fix: this.fixSlashInParentheses },
            // НЕПРАВИЛЬНО экранированные символы валюты (доллар НЕ экранируется в Cucumber!)
            { pattern: /\\[\$]/g, fix: this.fixIncorrectCurrencyEscaping },
            // Двойные кавычки в строках
            { pattern: /"[^"]*"[^"]*"[^"]*"/g, fix: this.fixNestedQuotes }
        ];
        
        this.validationErrors = [];
        this.fixedExpressions = [];
    }

    /**
     * Исправляет слэши в скобках
     */
    fixSlashInParentheses(expression) {
        return expression.replace(/\(([^)]*)\//g, '\\($1\\/');
    }

    /**
     * Исправляет НЕПРАВИЛЬНО экранированные символы валюты  
     * В Cucumber Expressions символ $ НЕ нужно экранировать!
     */
    fixIncorrectCurrencyEscaping(expression) {
        return expression.replace(/\\[\$]/g, '$');
    }

    /**
     * Исправляет вложенные кавычки
     */
    fixNestedQuotes(expression) {
        // Заменяем внутренние кавычки на {string} параметры
        return expression.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, '{string}$2{string}');
    }

    /**
     * Проверяет Cucumber Expression на проблемы
     */
    validateExpression(expression, lineNumber = null) {
        const errors = [];
        
        // Проверка скобок со слэшами
        if (/\([^\\)]*\/[^\\)]*\)/.test(expression)) {
            errors.push({
                type: 'UNESCAPED_SLASH_IN_PARENTHESES',
                message: 'Неэкранированный слэш в скобках',
                suggestion: this.fixSlashInParentheses(expression),
                line: lineNumber
            });
        }

        // Проверка НЕПРАВИЛЬНО экранированных символов валюты  
        // В Cucumber Expressions символ $ НЕ должен экранироваться!
        if (/\\\$/.test(expression)) {
            errors.push({
                type: 'INCORRECTLY_ESCAPED_CURRENCY',
                message: 'Неправильно экранированный символ валюты ($ не нужно экранировать в Cucumber!)',
                suggestion: this.fixIncorrectCurrencyEscaping(expression),
                line: lineNumber
            });
        }

        // Проверка вложенных кавычек
        if (/"[^"]*"[^"]*"[^"]*"/.test(expression)) {
            errors.push({
                type: 'NESTED_QUOTES',
                message: 'Вложенные кавычки в expression',
                suggestion: this.fixNestedQuotes(expression),
                line: lineNumber
            });
        }

        return errors;
    }

    /**
     * Автоматически исправляет expression
     */
    autoFixExpression(expression) {
        let fixed = expression;
        
        // Применяем все исправления
        for (const pattern of this.problematicPatterns) {
            if (pattern.pattern.test(fixed)) {
                fixed = pattern.fix.call(this, fixed);
            }
        }
        
        return fixed;
    }

    /**
     * Сканирует файл step definitions
     */
    scanStepDefinitionsFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const errors = [];

        lines.forEach((line, index) => {
            // Ищем step definitions
            const stepMatch = line.match(/(Given|When|Then)\s*\(\s*['"`]([^'"`]+)['"`]/);
            if (stepMatch) {
                const expression = stepMatch[2];
                const lineErrors = this.validateExpression(expression, index + 1);
                errors.push(...lineErrors);
            }
        });

        return errors;
    }

    /**
     * Автоматически исправляет файл
     */
    autoFixFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        let fixedContent = content;
        const fixes = [];

        // Ищем и исправляем все step definitions
        fixedContent = fixedContent.replace(
            /(Given|When|Then)\s*\(\s*['"`]([^'"`]+)['"`]/g,
            (match, stepType, expression) => {
                const errors = this.validateExpression(expression);
                if (errors.length > 0) {
                    const fixedExpression = this.autoFixExpression(expression);
                    fixes.push({
                        original: expression,
                        fixed: fixedExpression,
                        errors: errors
                    });
                    return match.replace(expression, fixedExpression);
                }
                return match;
            }
        );

        return { content: fixedContent, fixes };
    }

    /**
     * Генерирует отчет о валидации
     */
    generateReport(errors) {
        console.log('\n🔍 ОТЧЕТ ВАЛИДАЦИИ CUCUMBER EXPRESSIONS');
        console.log('===============================================');
        
        if (errors.length === 0) {
            console.log('✅ Все Cucumber Expressions корректны!');
            return;
        }

        console.log(`❌ Найдено ${errors.length} проблем:\n`);

        errors.forEach((error, index) => {
            console.log(`${index + 1}. ${error.type}`);
            console.log(`   📍 Строка ${error.line || 'N/A'}: ${error.message}`);
            console.log(`   💡 Предложение: ${error.suggestion}`);
            console.log('');
        });

        console.log('🛠️  АВТОМАТИЧЕСКОЕ ИСПРАВЛЕНИЕ:');
        console.log('==============================');
        errors.forEach(error => {
            console.log(`node scripts/add-step-definition.js "${error.suggestion}"`);
        });
    }
}

// Основная функция
if (require.main === module) {
    const validator = new CucumberExpressionValidator();
    const stepsFile = path.join(__dirname, '..', 'src', 'steps', 'AuthenticationSteps.ts');
    
    console.log('🔍 Валидация Cucumber Expressions...');
    
    const errors = validator.scanStepDefinitionsFile(stepsFile);
    validator.generateReport(errors);
    
    if (process.argv.includes('--fix')) {
        console.log('\n🔧 Автоматическое исправление...');
        const result = validator.autoFixFile(stepsFile);
        
        if (result.fixes.length > 0) {
            fs.writeFileSync(stepsFile + '.fixed', result.content);
            console.log(`✅ Исправлено ${result.fixes.length} выражений`);
            console.log(`💾 Сохранено в: ${stepsFile}.fixed`);
        } else {
            console.log('✅ Исправлений не требуется');
        }
    }
}

module.exports = { CucumberExpressionValidator };
