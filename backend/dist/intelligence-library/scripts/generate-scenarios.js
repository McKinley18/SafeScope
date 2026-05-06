const fs = require('fs');
const families = ["Guarding", "Electrical", "Access", "PPE", "Fall Protection", "Mobile Equipment", "Housekeeping", "Dust/Silica"];
const templates = ["{kw} missing", "{kw} broken", "need to report {kw}", "check {kw} standard", "found {kw} issue"];
const descriptors = ["", "immediately", "near plant", "crusher area", "urgent", "needs review"];
const scenarios = [];
families.forEach(f => {
    templates.forEach(t => {
        descriptors.forEach(d => {
            scenarios.push({ family: f, input: t.replace('{kw}', f.split('/')[0]) + ' ' + d });
        });
    });
});
fs.writeFileSync('backend/src/intelligence-library/data/50k-scenarios.json', JSON.stringify(scenarios, null, 2));
console.log('Generated ' + scenarios.length + ' scenarios.');
//# sourceMappingURL=generate-scenarios.js.map