/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/llm/route";
exports.ids = ["app/api/llm/route"];
exports.modules = {

/***/ "(rsc)/./app/api/llm/route.ts":
/*!******************************!*\
  !*** ./app/api/llm/route.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nasync function POST(req) {\n    const { prompt, model = \"openai/gpt-4o-search-preview\", temperature, top_p, max_tokens, stop } = await req.json();\n    const requestBody = {\n        model,\n        messages: [\n            {\n                role: 'system',\n                content: 'You are a helpful assistant for brand research.'\n            },\n            {\n                role: 'user',\n                content: prompt\n            }\n        ],\n        temperature: temperature ?? 0.7\n    };\n    // Only add parameters if they are explicitly provided\n    if (top_p !== undefined) requestBody.top_p = top_p;\n    if (max_tokens !== undefined) requestBody.max_tokens = max_tokens;\n    if (stop !== undefined) requestBody.stop = stop;\n    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {\n        method: 'POST',\n        headers: {\n            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,\n            'Content-Type': 'application/json'\n        },\n        body: JSON.stringify(requestBody)\n    });\n    if (!response.ok) {\n        // Get the actual error response from OpenRouter\n        let errorDetails = {};\n        try {\n            errorDetails = await response.json();\n        } catch  {\n            errorDetails = {\n                text: await response.text()\n            };\n        }\n        // Log to server console for debugging\n        console.error('OpenRouter error:', errorDetails);\n        // Return the error details in the API response\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'LLM request failed',\n            response: errorDetails\n        }, {\n            status: 500\n        });\n    }\n    const data = await response.json();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        result: data.choices[0].message.content\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2xsbS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUF3RDtBQUVqRCxlQUFlQyxLQUFLQyxHQUFnQjtJQUN6QyxNQUFNLEVBQ0pDLE1BQU0sRUFDTkMsUUFBUSw4QkFBOEIsRUFDdENDLFdBQVcsRUFDWEMsS0FBSyxFQUNMQyxVQUFVLEVBQ1ZDLElBQUksRUFDSixHQUFHLE1BQU1OLElBQUlPLElBQUk7SUFFbEIsTUFBTUMsY0FBbUI7UUFDeEJOO1FBQ0FPLFVBQVU7WUFDUjtnQkFBRUMsTUFBTTtnQkFBVUMsU0FBUztZQUFrRDtZQUM3RTtnQkFBRUQsTUFBTTtnQkFBUUMsU0FBU1Y7WUFBTztTQUNqQztRQUNERSxhQUFhQSxlQUFlO0lBQzlCO0lBRUEsc0RBQXNEO0lBQ3RELElBQUlDLFVBQVVRLFdBQVdKLFlBQVlKLEtBQUssR0FBR0E7SUFDN0MsSUFBSUMsZUFBZU8sV0FBV0osWUFBWUgsVUFBVSxHQUFHQTtJQUN2RCxJQUFJQyxTQUFTTSxXQUFXSixZQUFZRixJQUFJLEdBQUdBO0lBRTNDLE1BQU1PLFdBQVcsTUFBTUMsTUFBTSxpREFBaUQ7UUFDNUVDLFFBQVE7UUFDUkMsU0FBUztZQUNQLGlCQUFpQixDQUFDLE9BQU8sRUFBRUMsUUFBUUMsR0FBRyxDQUFDQyxrQkFBa0IsRUFBRTtZQUMzRCxnQkFBZ0I7UUFDbEI7UUFDQUMsTUFBTUMsS0FBS0MsU0FBUyxDQUFDZDtJQUN2QjtJQUVBLElBQUksQ0FBQ0ssU0FBU1UsRUFBRSxFQUFFO1FBQ2hCLGdEQUFnRDtRQUNoRCxJQUFJQyxlQUFlLENBQUM7UUFDcEIsSUFBSTtZQUNBQSxlQUFlLE1BQU1YLFNBQVNOLElBQUk7UUFDdEMsRUFBRSxPQUFNO1lBQ0ppQixlQUFlO2dCQUFFQyxNQUFNLE1BQU1aLFNBQVNZLElBQUk7WUFBRztRQUNqRDtRQUNBLHNDQUFzQztRQUN0Q0MsUUFBUUMsS0FBSyxDQUFDLHFCQUFxQkg7UUFDbkMsK0NBQStDO1FBQy9DLE9BQU8xQixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1lBQUVvQixPQUFPO1lBQXNCZCxVQUFVVztRQUFZLEdBQUc7WUFBRUksUUFBUTtRQUFJO0lBQ2pHO0lBRUEsTUFBTUMsT0FBTyxNQUFNaEIsU0FBU04sSUFBSTtJQUNoQyxPQUFPVCxxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1FBQUV1QixRQUFRRCxLQUFLRSxPQUFPLENBQUMsRUFBRSxDQUFDQyxPQUFPLENBQUNyQixPQUFPO0lBQUM7QUFDckUiLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdXNoaWNoYW4vRG9jdW1lbnRzL19XT1JLL05VTUJFUlNfT05MWS9OdW1iZXJzT25seUJhY2tlbmQvbm9hLWJyYW5kLXJlc2VhcmNoLWZ1bGxhcHAvYXBwL2FwaS9sbG0vcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCB7IFxuICAgIHByb21wdCwgXG4gICAgbW9kZWwgPSBcIm9wZW5haS9ncHQtNG8tc2VhcmNoLXByZXZpZXdcIixcbiAgICB0ZW1wZXJhdHVyZSxcbiAgICB0b3BfcCxcbiAgICBtYXhfdG9rZW5zLFxuICAgIHN0b3BcbiAgIH0gPSBhd2FpdCByZXEuanNvbigpO1xuXG4gICBjb25zdCByZXF1ZXN0Qm9keTogYW55ID0ge1xuICAgIG1vZGVsLFxuICAgIG1lc3NhZ2VzOiBbXG4gICAgICB7IHJvbGU6ICdzeXN0ZW0nLCBjb250ZW50OiAnWW91IGFyZSBhIGhlbHBmdWwgYXNzaXN0YW50IGZvciBicmFuZCByZXNlYXJjaC4nIH0sXG4gICAgICB7IHJvbGU6ICd1c2VyJywgY29udGVudDogcHJvbXB0IH1cbiAgICBdLFxuICAgIHRlbXBlcmF0dXJlOiB0ZW1wZXJhdHVyZSA/PyAwLjcsIC8vIERlZmF1bHQgaWYgbm90IHByb3ZpZGVkXG4gIH07XG5cbiAgLy8gT25seSBhZGQgcGFyYW1ldGVycyBpZiB0aGV5IGFyZSBleHBsaWNpdGx5IHByb3ZpZGVkXG4gIGlmICh0b3BfcCAhPT0gdW5kZWZpbmVkKSByZXF1ZXN0Qm9keS50b3BfcCA9IHRvcF9wO1xuICBpZiAobWF4X3Rva2VucyAhPT0gdW5kZWZpbmVkKSByZXF1ZXN0Qm9keS5tYXhfdG9rZW5zID0gbWF4X3Rva2VucztcbiAgaWYgKHN0b3AgIT09IHVuZGVmaW5lZCkgcmVxdWVzdEJvZHkuc3RvcCA9IHN0b3A7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9vcGVucm91dGVyLmFpL2FwaS92MS9jaGF0L2NvbXBsZXRpb25zJywge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52Lk9QRU5ST1VURVJfQVBJX0tFWX1gLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlcXVlc3RCb2R5KSxcbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIC8vIEdldCB0aGUgYWN0dWFsIGVycm9yIHJlc3BvbnNlIGZyb20gT3BlblJvdXRlclxuICAgIGxldCBlcnJvckRldGFpbHMgPSB7fTtcbiAgICB0cnkge1xuICAgICAgICBlcnJvckRldGFpbHMgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIGVycm9yRGV0YWlscyA9IHsgdGV4dDogYXdhaXQgcmVzcG9uc2UudGV4dCgpIH07XG4gICAgfVxuICAgIC8vIExvZyB0byBzZXJ2ZXIgY29uc29sZSBmb3IgZGVidWdnaW5nXG4gICAgY29uc29sZS5lcnJvcignT3BlblJvdXRlciBlcnJvcjonLCBlcnJvckRldGFpbHMpO1xuICAgIC8vIFJldHVybiB0aGUgZXJyb3IgZGV0YWlscyBpbiB0aGUgQVBJIHJlc3BvbnNlXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdMTE0gcmVxdWVzdCBmYWlsZWQnLCByZXNwb25zZTogZXJyb3JEZXRhaWxzfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxuXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHJlc3VsdDogZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudCB9KTtcbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIlBPU1QiLCJyZXEiLCJwcm9tcHQiLCJtb2RlbCIsInRlbXBlcmF0dXJlIiwidG9wX3AiLCJtYXhfdG9rZW5zIiwic3RvcCIsImpzb24iLCJyZXF1ZXN0Qm9keSIsIm1lc3NhZ2VzIiwicm9sZSIsImNvbnRlbnQiLCJ1bmRlZmluZWQiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiaGVhZGVycyIsInByb2Nlc3MiLCJlbnYiLCJPUEVOUk9VVEVSX0FQSV9LRVkiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsIm9rIiwiZXJyb3JEZXRhaWxzIiwidGV4dCIsImNvbnNvbGUiLCJlcnJvciIsInN0YXR1cyIsImRhdGEiLCJyZXN1bHQiLCJjaG9pY2VzIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/llm/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fllm%2Froute&page=%2Fapi%2Fllm%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fllm%2Froute.ts&appDir=%2FUsers%2Fsushichan%2FDocuments%2F_WORK%2FNUMBERS_ONLY%2FNumbersOnlyBackend%2Fnoa-brand-research-fullapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsushichan%2FDocuments%2F_WORK%2FNUMBERS_ONLY%2FNumbersOnlyBackend%2Fnoa-brand-research-fullapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fllm%2Froute&page=%2Fapi%2Fllm%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fllm%2Froute.ts&appDir=%2FUsers%2Fsushichan%2FDocuments%2F_WORK%2FNUMBERS_ONLY%2FNumbersOnlyBackend%2Fnoa-brand-research-fullapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsushichan%2FDocuments%2F_WORK%2FNUMBERS_ONLY%2FNumbersOnlyBackend%2Fnoa-brand-research-fullapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_sushichan_Documents_WORK_NUMBERS_ONLY_NumbersOnlyBackend_noa_brand_research_fullapp_app_api_llm_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/llm/route.ts */ \"(rsc)/./app/api/llm/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/llm/route\",\n        pathname: \"/api/llm\",\n        filename: \"route\",\n        bundlePath: \"app/api/llm/route\"\n    },\n    resolvedPagePath: \"/Users/sushichan/Documents/_WORK/NUMBERS_ONLY/NumbersOnlyBackend/noa-brand-research-fullapp/app/api/llm/route.ts\",\n    nextConfigOutput,\n    userland: _Users_sushichan_Documents_WORK_NUMBERS_ONLY_NumbersOnlyBackend_noa_brand_research_fullapp_app_api_llm_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZsbG0lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmxsbSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmxsbSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnN1c2hpY2hhbiUyRkRvY3VtZW50cyUyRl9XT1JLJTJGTlVNQkVSU19PTkxZJTJGTnVtYmVyc09ubHlCYWNrZW5kJTJGbm9hLWJyYW5kLXJlc2VhcmNoLWZ1bGxhcHAlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGc3VzaGljaGFuJTJGRG9jdW1lbnRzJTJGX1dPUkslMkZOVU1CRVJTX09OTFklMkZOdW1iZXJzT25seUJhY2tlbmQlMkZub2EtYnJhbmQtcmVzZWFyY2gtZnVsbGFwcCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDZ0U7QUFDN0k7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9zdXNoaWNoYW4vRG9jdW1lbnRzL19XT1JLL05VTUJFUlNfT05MWS9OdW1iZXJzT25seUJhY2tlbmQvbm9hLWJyYW5kLXJlc2VhcmNoLWZ1bGxhcHAvYXBwL2FwaS9sbG0vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2xsbS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2xsbVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvbGxtL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL3N1c2hpY2hhbi9Eb2N1bWVudHMvX1dPUksvTlVNQkVSU19PTkxZL051bWJlcnNPbmx5QmFja2VuZC9ub2EtYnJhbmQtcmVzZWFyY2gtZnVsbGFwcC9hcHAvYXBpL2xsbS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fllm%2Froute&page=%2Fapi%2Fllm%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fllm%2Froute.ts&appDir=%2FUsers%2Fsushichan%2FDocuments%2F_WORK%2FNUMBERS_ONLY%2FNumbersOnlyBackend%2Fnoa-brand-research-fullapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsushichan%2FDocuments%2F_WORK%2FNUMBERS_ONLY%2FNumbersOnlyBackend%2Fnoa-brand-research-fullapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fllm%2Froute&page=%2Fapi%2Fllm%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fllm%2Froute.ts&appDir=%2FUsers%2Fsushichan%2FDocuments%2F_WORK%2FNUMBERS_ONLY%2FNumbersOnlyBackend%2Fnoa-brand-research-fullapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsushichan%2FDocuments%2F_WORK%2FNUMBERS_ONLY%2FNumbersOnlyBackend%2Fnoa-brand-research-fullapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();