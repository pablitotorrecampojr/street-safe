import rulesJson from './Rules.json';
export function validate(formData) {
    const errors = {};
    const rules = rulesJson;
    for (const field in rules) {
        const rule = rules[field];
        const value = formData[field];

        if (rule.required && (value === undefined || value === null || value === "")) {
        errors[field] = rule.message?.required || `${field} is required.`;
        continue;
        }

        if (rule.requiredIf) {
        const { field: condField, equals } = rule.requiredIf;
        if (formData[condField] === equals && (value === undefined || value === "")) {
            errors[field] =
            rule.message?.requiredIf || `${field} is required when ${condField} is ${equals}.`;
            continue;
        }
        }

        if (typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
            errors[field] = rule.message?.minLength;
        }
        if (rule.maxLength && value.length > rule.maxLength) {
            errors[field] = rule.message?.maxLength;
        }
        }

        if (rule.pattern && value) {
        const regex = new RegExp(rule.pattern);
        if (!regex.test(value)) {
            errors[field] = rule.message?.pattern;
        }
        }

        if (rule.allowedValues && value) {
        if (!rule.allowedValues.includes(value)) {
            errors[field] = rule.message?.allowedValues;
        }
        }

        if (rule.matchesField) {
        const matchValue = formData[rule.matchesField];
        if (value !== matchValue) {
            errors[field] = rule.message?.matchesField;
        }
        }

        if (rule.fileTypes && value) {
        if (value.type && !rule.fileTypes.includes(value.type)) {
            errors[field] = rule.message?.fileTypes;
        }
        if (rule.maxSizeMB && value.size) {
            const maxBytes = rule.maxSizeMB * 1024 * 1024;
            if (value.size > maxBytes) {
            errors[field] = rule.message?.maxSizeMB;
            }
        }
        }
    }

    return errors;
}
