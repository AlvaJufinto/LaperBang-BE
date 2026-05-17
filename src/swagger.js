/** @format */

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "LaperBang API",
			version: "1.0.0",
			description: "LaperBang Backend API Documentation",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./src/routes/*.js"],
	apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

//console.log("Swagger paths:", Object.keys(swaggerSpec.paths || {}));

export default swaggerSpec;
