#!/bin/bash
# 🔄 Emergency Rollback Script for Feature Optimization

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in ParaBank project directory"
    exit 1
fi

# Check git status
echo "📊 Checking git status..."
git status

# Ask for confirmation
read -p "⚠️  This will rollback ALL optimization changes. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

# Create emergency backup of current state
echo "🛡️  Creating emergency backup..."
timestamp=$(date +"%Y%m%d_%H%M%S")
mkdir -p "emergency_backups/${timestamp}"
cp -r features/ "emergency_backups/${timestamp}/features_backup"
cp -r scripts/ "emergency_backups/${timestamp}/scripts_backup"

# Restore from backup if exists
if [ -d "features/backup" ]; then
    echo "🔄 Restoring original feature files..."
    for backup_file in features/backup/*.backup; do
        if [ -f "$backup_file" ]; then
            original_name=$(basename "$backup_file" .backup)
            cp "$backup_file" "features/$original_name"
            echo "✅ Restored: $original_name"
        fi
    done
else
    echo "📂 No backup directory found, using git reset..."
    git checkout HEAD -- features/
fi

# Remove optimized directories
echo "🗑️  Removing optimized directories..."
rm -rf features/optimized/
rm -rf features/backup/

# Remove migration scripts
echo "🗑️  Removing migration scripts..."
rm -f scripts/migrate-phase1.js
rm -f scripts/validate-optimization.js
rm -f MIGRATION_PLAN.md

# Reset git to last known good state
echo "🔄 Resetting git to last stable commit..."
git add .
git commit -m "Emergency rollback: restore original feature files"

# Run tests to verify rollback
echo "🧪 Running tests to verify rollback..."
npm test || npx cucumber-js features/account-management.feature

# Final status
echo ""
echo "✅ ROLLBACK COMPLETE"
echo "==================="
echo "📁 Emergency backup saved to: emergency_backups/${timestamp}/"
echo "🧪 Test status: $(if [ $? -eq 0 ]; then echo 'PASSING ✅'; else echo 'FAILING ❌'; fi)"
echo "📊 Next steps:"
echo "   1. Verify all tests are passing"
echo "   2. Check BrowserPoolManager still works" 
echo "   3. Investigate what went wrong"
echo "   4. Plan safer migration approach"
