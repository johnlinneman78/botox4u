#!/usr/bin/env node
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const API_KEY = 'mcp-internal-999';
const BASE_URL = 'http://localhost:3000/api/v1'; // Local dev default

async function handleToolCall(name, args) {
    try {
        if (name === 'search_providers') {
            const { city, style, min_truescore } = args;
            const res = await axios.get(`${BASE_URL}/providers`, {
                params: { city, style, min_truescore },
                headers: { 'x-api-key': API_KEY }
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }]
            };
        }

        if (name === 'get_provider') {
            const { slug } = args;
            const res = await axios.get(`${BASE_URL}/providers/${slug}`, {
                headers: { 'x-api-key': API_KEY }
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }]
            };
        }

        if (name === 'list_cities') {
            const res = await axios.get(`${BASE_URL}/cities`, {
                headers: { 'x-api-key': API_KEY }
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }]
            };
        }

        throw new Error(`Tool not found: ${name}`);
    } catch (err) {
        return {
            isError: true,
            content: [{ type: 'text', text: err.response?.data?.error || err.message }]
        };
    }
}

// Basic MCP over STDIO
process.stdin.on('data', async (data) => {
    try {
        const request = JSON.parse(data.toString());
        if (request.method === 'initialize') {
            console.log(JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                result: { protocolVersion: '2024-11-05', capabilities: {}, serverInfo: { name: 'InjectorIndex', version: '1.0.0' } }
            }));
        } else if (request.method === 'tools/list') {
            console.log(JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                result: {
                    tools: [
                        {
                            name: 'search_providers',
                            description: 'Search for ranked injectors by city and style',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    city: { type: 'string', description: 'City name (e.g. portland)' },
                                    style: { type: 'string', description: 'Style tag (e.g. natural)' },
                                    min_truescore: { type: 'number', description: 'Minimum TrueScore (0-100)' }
                                },
                                required: ['city']
                            }
                        },
                        {
                            name: 'get_provider',
                            description: 'Get full professional details for a specific injector',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    slug: { type: 'string', description: 'Provider URL slug' }
                                },
                                required: ['slug']
                            }
                        },
                        {
                            name: 'list_cities',
                            description: 'List all indexed cities with provider counts',
                            inputSchema: { type: 'object', properties: {} }
                        }
                    ]
                }
            }));
        } else if (request.method === 'tools/call') {
            const result = await handleToolCall(request.params.name, request.params.arguments);
            console.log(JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                result
            }));
        }
    } catch (e) {
        // Silent catch for parsing errors
    }
});
