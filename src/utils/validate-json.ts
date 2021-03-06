import ajv from 'ajv';

const jsonvalidator = new ajv(); // options can be passed, e.g. {allErrors: true}

export type JSONValidator = ajv.ValidateFunction;

export function jsonValidator(schema: any): JSONValidator {
	return jsonvalidator.compile(schema);
}

export async function validateJSON(data: any, schemaValidator: JSONValidator): Promise<{ errors: Array<ajv.ErrorObject> }> {
	const result = schemaValidator(data);
	const valid = typeof result === 'boolean' ? result : await (result as Promise<boolean>);
	if (valid) {
		return {errors: []};
	}
	if (schemaValidator.errors) {
		return {errors: schemaValidator.errors};
	}
	return {
		errors: [{
			keyword: 'unknown',
			dataPath: 'unknown',
			schemaPath: 'unknown',
			params: []
		}]
	};
}
