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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nasync function POST(req) {\n    const { prompt, model = \"openai/gpt-4-0-search-preview\" } = await req.json();\n    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {\n        method: 'POST',\n        headers: {\n            'Authorization': `Bearer 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`,\n            'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({\n            model,\n            messages: [\n                {\n                    role: 'system',\n                    content: 'You are a helpful assistant for brand research.'\n                },\n                {\n                    role: 'user',\n                    content: prompt\n                }\n            ],\n            //max_tokens: 1024,\n            temperature: 0.7\n        })\n    });\n    if (!response.ok) {\n        // Get the actual error response from OpenRouter\n        let errorDetails = {};\n        try {\n            errorDetails = await response.json();\n        } catch  {\n            errorDetails = {\n                text: await response.text()\n            };\n        }\n        // Log to server console for debugging\n        console.error('OpenRouter error:', errorDetails);\n        // Return the error details in the API response\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'LLM request failed',\n            response: errorDetails\n        }, {\n            status: 500\n        });\n    }\n    const data = await response.json();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        result: data.choices[0].message.content\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2xsbS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUF3RDtBQUVqRCxlQUFlQyxLQUFLQyxHQUFnQjtJQUN6QyxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSwrQkFBK0IsRUFBRSxHQUFHLE1BQU1GLElBQUlHLElBQUk7SUFFMUUsTUFBTUMsV0FBVyxNQUFNQyxNQUFNLGlEQUFpRDtRQUM1RUMsUUFBUTtRQUNSQyxTQUFTO1lBQ1AsaUJBQWlCLENBQUMsZ0ZBQWdGLENBQUM7WUFDbkcsZ0JBQWdCO1FBQ2xCO1FBQ0FDLE1BQU1DLEtBQUtDLFNBQVMsQ0FBQztZQUNuQlI7WUFDQVMsVUFBVTtnQkFDUjtvQkFBRUMsTUFBTTtvQkFBVUMsU0FBUztnQkFBa0Q7Z0JBQzdFO29CQUFFRCxNQUFNO29CQUFRQyxTQUFTWjtnQkFBTzthQUNqQztZQUNELG1CQUFtQjtZQUNuQmEsYUFBYTtRQUNmO0lBQ0Y7SUFFQSxJQUFJLENBQUNWLFNBQVNXLEVBQUUsRUFBRTtRQUNoQixnREFBZ0Q7UUFDaEQsSUFBSUMsZUFBZSxDQUFDO1FBQ3BCLElBQUk7WUFDQUEsZUFBZSxNQUFNWixTQUFTRCxJQUFJO1FBQ3RDLEVBQUUsT0FBTTtZQUNKYSxlQUFlO2dCQUFFQyxNQUFNLE1BQU1iLFNBQVNhLElBQUk7WUFBRztRQUNqRDtRQUNBLHNDQUFzQztRQUN0Q0MsUUFBUUMsS0FBSyxDQUFDLHFCQUFxQkg7UUFDbkMsK0NBQStDO1FBQy9DLE9BQU9sQixxREFBWUEsQ0FBQ0ssSUFBSSxDQUFDO1lBQUVnQixPQUFPO1lBQXNCZixVQUFVWTtRQUFZLEdBQUc7WUFBRUksUUFBUTtRQUFJO0lBQ2pHO0lBRUEsTUFBTUMsT0FBTyxNQUFNakIsU0FBU0QsSUFBSTtJQUNoQyxPQUFPTCxxREFBWUEsQ0FBQ0ssSUFBSSxDQUFDO1FBQUVtQixRQUFRRCxLQUFLRSxPQUFPLENBQUMsRUFBRSxDQUFDQyxPQUFPLENBQUNYLE9BQU87SUFBQztBQUNyRSIsInNvdXJjZXMiOlsiL1VzZXJzL3N1c2hpY2hhbi9Eb2N1bWVudHMvX1dPUksvTlVNQkVSU19PTkxZL051bWJlcnNPbmx5QmFja2VuZC9ub2EtYnJhbmQtcmVzZWFyY2gtZnVsbGFwcC9hcHAvYXBpL2xsbS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IE5leHRSZXF1ZXN0KSB7XG4gIGNvbnN0IHsgcHJvbXB0LCBtb2RlbCA9IFwib3BlbmFpL2dwdC00LTAtc2VhcmNoLXByZXZpZXdcIiB9ID0gYXdhaXQgcmVxLmpzb24oKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCdodHRwczovL29wZW5yb3V0ZXIuYWkvYXBpL3YxL2NoYXQvY29tcGxldGlvbnMnLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyIHNrLW9yLXYxLTc4NjMzZGM2M2ZkY2U5YmExOWNjOGI5MWZlOTJjOTYxMjJjYTdlZDJmZDQxNmUwNjMwZjY1MmU4ZmU5NmU3NWJgLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIG1vZGVsLFxuICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgeyByb2xlOiAnc3lzdGVtJywgY29udGVudDogJ1lvdSBhcmUgYSBoZWxwZnVsIGFzc2lzdGFudCBmb3IgYnJhbmQgcmVzZWFyY2guJyB9LFxuICAgICAgICB7IHJvbGU6ICd1c2VyJywgY29udGVudDogcHJvbXB0IH1cbiAgICAgIF0sXG4gICAgICAvL21heF90b2tlbnM6IDEwMjQsXG4gICAgICB0ZW1wZXJhdHVyZTogMC43LFxuICAgIH0pLFxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgLy8gR2V0IHRoZSBhY3R1YWwgZXJyb3IgcmVzcG9uc2UgZnJvbSBPcGVuUm91dGVyXG4gICAgbGV0IGVycm9yRGV0YWlscyA9IHt9O1xuICAgIHRyeSB7XG4gICAgICAgIGVycm9yRGV0YWlscyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgICAgZXJyb3JEZXRhaWxzID0geyB0ZXh0OiBhd2FpdCByZXNwb25zZS50ZXh0KCkgfTtcbiAgICB9XG4gICAgLy8gTG9nIHRvIHNlcnZlciBjb25zb2xlIGZvciBkZWJ1Z2dpbmdcbiAgICBjb25zb2xlLmVycm9yKCdPcGVuUm91dGVyIGVycm9yOicsIGVycm9yRGV0YWlscyk7XG4gICAgLy8gUmV0dXJuIHRoZSBlcnJvciBkZXRhaWxzIGluIHRoZSBBUEkgcmVzcG9uc2VcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0xMTSByZXF1ZXN0IGZhaWxlZCcsIHJlc3BvbnNlOiBlcnJvckRldGFpbHN9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG5cbiAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgcmVzdWx0OiBkYXRhLmNob2ljZXNbMF0ubWVzc2FnZS5jb250ZW50IH0pO1xufSAiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiUE9TVCIsInJlcSIsInByb21wdCIsIm1vZGVsIiwianNvbiIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXNzYWdlcyIsInJvbGUiLCJjb250ZW50IiwidGVtcGVyYXR1cmUiLCJvayIsImVycm9yRGV0YWlscyIsInRleHQiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGF0dXMiLCJkYXRhIiwicmVzdWx0IiwiY2hvaWNlcyIsIm1lc3NhZ2UiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/llm/route.ts\n");

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