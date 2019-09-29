/* tslint:disable:interface-name */
// Source:
// https://github.com/metadevpro/openapi3-ts

// Typed interfaces for OpenAPI 3.0.0-RC
// see https://github.com/OAI/OpenAPI-Specification/blob/3.0.0-rc0/versions/3.0.md

// Suport for Specification Extensions
// as described in
// https://github.com/OAI/OpenAPI-Specification/blob/3.0.0-rc0/versions/3.0.md#specificationExtensions

//  Specification Extensions
//   ^x-
export interface ISpecificationExtension {
	// Cannot constraint to "^x-" but can filter them later to access to them
	[extensionName: string]: any;
}
//
// export class SpecificationExtension implements ISpecificationExtension {
// 	// Cannot constraint to "^x-" but can filter them later to access to them
// 	[extensionName: string]: any;
//
// 	static isValidExtension(extensionName: string) {
// 		return /^x\-/.test(extensionName);
// 	}
//
// 	getExtension(extensionName: string): any {
// 		if (!SpecificationExtension.isValidExtension(extensionName)) {
// 			throw new Error('Invalid specification extension: \'' +
// 				extensionName + '\'. Extensions must start with prefix \'x-');
// 		}
// 		if (this[extensionName]) {
// 			return this[extensionName];
// 		}
// 		return null;
// 	}
//
// 	addExtension(extensionName: string, payload: any): void {
// 		if (!SpecificationExtension.isValidExtension(extensionName)) {
// 			throw new Error('Invalid specification extension: \'' +
// 				extensionName + '\'. Extensions must start with prefix \'x-');
// 		}
// 		this[extensionName] = payload;
// 	}
//
// 	listExtensions(): string[] {
// 		let res: string[] = [];
// 		for (let propName in this) {
// 			if (this.hasOwnProperty(propName)) {
// 				if (SpecificationExtension.isValidExtension(propName)) {
// 					res.push(propName);
// 				}
// 			}
// 		}
// 		return res;
// 	}
// }
//
// export function getExtension(obj: ISpecificationExtension, extensionName: string): any {
// 	if (SpecificationExtension.isValidExtension(extensionName)) {
// 		return obj[extensionName];
// 	}
// 	return undefined;
// }
//
// export function addExtension(obj: ISpecificationExtension, extensionName: string, extension: any): void {
// 	if (SpecificationExtension.isValidExtension(extensionName)) {
// 		obj[extensionName] = extension;
// 	}
// }

export interface OpenAPIObject extends ISpecificationExtension {
	openapi: string;
	info: InfoObject;
	servers?: Array<ServerObject>;
	paths: PathsObject;
	components?: ComponentsObject;
	security?: Array<SecurityRequirementObject>;
	tags?: Array<TagObject>;
	externalDocs?: ExternalDocumentationObject;
}

export interface InfoObject extends ISpecificationExtension {
	title: string;
	description?: string;
	termsOfService?: string;
	contact?: ContactObject;
	license?: LicenseObject;
	version: string;
}

export interface ContactObject extends ISpecificationExtension {
	name: string;
	url: string;
	email: string;
}

export interface LicenseObject extends ISpecificationExtension {
	name: string;
	url?: string;
}

export interface ServerObject extends ISpecificationExtension {
	url: string;
	description?: string;
	variables?: { [v: string]: ServerVariableObject };
}

export interface ServerVariableObject extends ISpecificationExtension {
	enum?: Array<string> | Array<boolean> | Array<number>;
	default: string | boolean | number;
	description?: string;
}

export interface ComponentsObject extends ISpecificationExtension {
	schemas?: { [schema: string]: SchemaObject };
	responses?: { [response: string]: ResponseObject };
	parameters?: { [parameter: string]: ParameterObject };
	examples?: { [example: string]: ExampleObject };
	requestBodies?: { [request: string]: RequestBodyObject };
	headers?: { [heaer: string]: HeaderObject };
	securitySchemes?: { [securityScheme: string]: SecuritySchemeObject };
	links?: { [link: string]: LinkObject };
	callbacks?: { [callback: string]: CallbackObject };
}

/**
 * Rename it to Paths Object to be consistent with the spec
 * See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#pathsObject
 */
export interface PathsObject extends ISpecificationExtension {
	// [path: string]: PathItemObject;
	[path: string]: PathItemObject | any;   // Hack for allowing ISpecificationExtension
}

/**
 * @deprecated
 * Create a type alias for backward compatibility
 */
export type PathObject = PathsObject;
//
// export function getPath(pathsObject: PathsObject, path: string): PathItemObject {
// 	if (SpecificationExtension.isValidExtension(path)) {
// 		return undefined;
// 	}
// 	return pathsObject[path] as PathItemObject;
// }

export interface PathItemObject extends ISpecificationExtension {
	$ref?: string;
	summary?: string;
	description?: string;
	get?: OperationObject;
	put?: OperationObject;
	post?: OperationObject;
	delete?: OperationObject;
	options?: OperationObject;
	head?: OperationObject;
	patch?: OperationObject;
	trace?: OperationObject;
	servers?: Array<ServerObject>;
	parameters?: Array<ParameterObject | ReferenceObject>;
}

export interface OperationObject extends ISpecificationExtension {
	tags?: Array<string>;
	summary?: string;
	description?: string;
	externalDocs?: ExternalDocumentationObject;
	operationId?: string;
	parameters?: Array<ParameterObject | ReferenceObject>;
	requestBody?: RequestBodyObject | ReferenceObject;
	responses: ResponsesObject;
	callbacks?: CallbacksObject;
	deprecated?: boolean;
	security?: Array<SecurityRequirementObject>;
	servers?: Array<ServerObject>;
}

export interface ExternalDocumentationObject extends ISpecificationExtension {
	description?: string;
	url: string;
}

/**
 * The location of a parameter.
 * Possible values are "query", "header", "path" or "cookie".
 * Specification:
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameter-locations
 */
export type ParameterLocation = 'query' | 'header' | 'path' | 'cookie';

/**
 * The style of a parameter.
 * Describes how the parameter value will be serialized.
 * (serialization is not implemented yet)
 * Specification:
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#style-values
 */
export type ParameterStyle =
	'matrix'
	| 'label'
	| 'form'
	| 'simple'
	| 'spaceDelimited'
	| 'pipeDelimited'
	| 'deepObject';

export interface ParameterObject extends ISpecificationExtension {
	name: string;
	in: ParameterLocation; // "query" | "header" | "path" | "cookie";
	description?: string;
	required?: boolean;
	deprecated?: boolean;
	allowEmptyValue?: boolean;

	style?: ParameterStyle; // "matrix" | "label" | "form" | "simple" | "spaceDelimited" | "pipeDelimited" | "deepObject";
	explode?: boolean;
	allowReserved?: boolean;
	schema?: SchemaObject | ReferenceObject;
	examples?: { [param: string]: ExampleObject | ReferenceObject };
	example?: any;
	content?: ContentObject;
}

export interface RequestBodyObject extends ISpecificationExtension {
	description?: string;
	content: ContentObject;
	required?: boolean;
}

export interface ContentObject {
	[mediatype: string]: MediaTypeObject;
}

export interface MediaTypeObject extends ISpecificationExtension {
	schema?: SchemaObject | ReferenceObject;
	examples?: [ExampleObject | ReferenceObject];
	example?: ExampleObject | ReferenceObject;
	encoding?: EncodingObject;
}

export interface EncodingObject extends ISpecificationExtension {
	// [property: string]: EncodingPropertyObject;
	[property: string]: EncodingPropertyObject | any;   // Hack for allowing ISpecificationExtension
}

export interface EncodingPropertyObject {
	contentType?: string;
	headers?: { [key: string]: HeaderObject | ReferenceObject };
	style?: string;
	explode?: boolean;
	allowReserved?: boolean;

	[key: string]: any;   // (any) = Hack for allowing ISpecificationExtension
}

export interface ResponsesObject extends ISpecificationExtension {
	default?: ResponseObject | ReferenceObject;

	// [statuscode: string]: ResponseObject | ReferenceObject;
	[statuscode: string]: ResponseObject | ReferenceObject | any;   // (any) = Hack for allowing ISpecificationExtension
}

export interface ResponseObject extends ISpecificationExtension {
	description: string;
	headers?: HeadersObject;
	content?: ContentObject;
	links?: LinksObject;
}

export interface CallbacksObject extends ISpecificationExtension {
	// [name: string]: CallbackObject | ReferenceObject;
	[name: string]: CallbackObject | ReferenceObject | any;   // Hack for allowing ISpecificationExtension
}

export interface CallbackObject extends ISpecificationExtension {
	// [name: string]: PathItemObject;
	[name: string]: PathItemObject | any;   // Hack for allowing ISpecificationExtension
}

export interface HeadersObject {
	[name: string]: HeaderObject | ReferenceObject;
}

export interface ExampleObject {
	summary?: string;
	description?: string;
	value?: any;
	externalValue?: string;

	[property: string]: any; // Hack for allowing ISpecificationExtension
}

export interface LinksObject {
	[name: string]: LinkObject | ReferenceObject;
}

export interface LinkObject extends ISpecificationExtension {
	operationRef?: string;
	operationId?: string;
	parameters?: LinkParametersObject;
	requestBody?: any | string;
	description?: string;
	server?: ServerObject;

	[property: string]: any; // Hack for allowing ISpecificationExtension
}

export interface LinkParametersObject {
	[name: string]: any | string;
}

export interface HeaderObject {
	description?: string;
	required?: boolean;
	deprecated?: boolean;
	allowEmptyValue?: boolean;

	style?: ParameterStyle; // "matrix" | "label" | "form" | "simple" | "spaceDelimited" | "pipeDelimited" | "deepObject";
	explode?: boolean;
	allowReserved?: boolean;
	schema?: SchemaObject | ReferenceObject;
	examples?: { [param: string]: ExampleObject | ReferenceObject };
	example?: any;
	content?: ContentObject;
}

export interface TagObject extends ISpecificationExtension {
	name: string;
	description?: string;
	externalDocs?: ExternalDocumentationObject;

	[extension: string]: any; // Hack for allowing ISpecificationExtension
}

export interface ExamplesObject {
	[name: string]: any;
}

export interface ReferenceObject {
	$ref: string;
}

export interface SchemaObject extends ISpecificationExtension {
	nullable?: boolean;
	discriminator?: DiscriminatorObject;
	readOnly?: boolean;
	writeOnly?: boolean;
	xml?: XmlObject;
	externalDocs?: ExternalDocumentationObject;
	example?: any;
	examples?: Array<any>;
	deprecated?: boolean;

	type?: string;
	allOf?: Array<SchemaObject | ReferenceObject>;
	oneOf?: Array<SchemaObject | ReferenceObject>;
	anyOf?: Array<SchemaObject | ReferenceObject>;
	not?: SchemaObject | ReferenceObject;
	items?: SchemaObject | ReferenceObject;
	properties?: { [propertyName: string]: (SchemaObject | ReferenceObject) };
	additionalProperties?: (SchemaObject | ReferenceObject | boolean);
	description?: string;
	format?: string;
	default?: any;

	title?: string;
	multipleOf?: number;
	maximum?: number;
	exclusiveMaximum?: boolean;
	minimum?: number;
	exclusiveMinimum?: boolean;
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	maxItems?: number;
	minItems?: number;
	uniqueItems?: boolean;
	maxProperties?: number;
	minProperties?: number;
	required?: Array<string>;
	enum?: Array<any>;
}

export interface SchemasObject {
	[schema: string]: SchemaObject;
}

export interface DiscriminatorObject {
	propertyName: string;
	mapping?: { [key: string]: string };
}

export interface XmlObject extends ISpecificationExtension {
	name?: string;
	namespace?: string;
	prefix?: string;
	attribute?: boolean;
	wrapped?: boolean;
}

export type SecuritySchemeType =
	'apiKey'
	| 'http'
	| 'oauth2'
	| 'openIdConnect';

export interface SecuritySchemeObject extends ISpecificationExtension {
	type: SecuritySchemeType;
	description?: string;
	name?: string;              // required only for apiKey
	in?: string;                // required only for apiKey
	scheme?: string;            // required only for http
	bearerFormat?: string;
	flow?: OAuthFlowObject;     // required only for oauth2
	openIdConnectUrl?: string;  // required only for oauth2
}

export interface OAuthFlowsObject extends ISpecificationExtension {
	implicit?: OAuthFlowObject;
	password?: OAuthFlowObject;
	clientCredentials?: OAuthFlowObject;
	authorizationCode?: OAuthFlowObject;
}

export interface OAuthFlowObject extends ISpecificationExtension {
	authorizationUrl: string;
	tokenUrl: string;
	refreshUrl?: string;
	scopes: ScopesObject;
}

export interface ScopesObject extends ISpecificationExtension {
	[scope: string]: any; // Hack for allowing ISpecificationExtension
}

export interface SecurityRequirementObject {
	[name: string]: Array<string>;
}
