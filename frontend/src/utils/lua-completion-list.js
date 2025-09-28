import { parseCompletionList } from "./cm_cl_importer";
import keyword_data from "./cm_lua/keywords.json";

import mathLib_data from "./cm_lua/lib_math.json";
import stringLib_data from "./cm_lua/lib_string.json";
import factorioLib_data from "./cm_lua/lib_factorio.json";
import serpentLib_data from "./cm_lua/lib_serpent_fac.json";

import special_global_data from "./cm_lua/special_global.json";
import core_data from "./cm_lua/core.json";

export const keywords = parseCompletionList(keyword_data);

export const mathLib = parseCompletionList(mathLib_data);
export const stringLib = parseCompletionList(stringLib_data);
export const factorioLib = parseCompletionList(factorioLib_data);
export const serpentLib = parseCompletionList(serpentLib_data);

export const special_global_vars = parseCompletionList(special_global_data);

export const core_base = parseCompletionList(core_data);

export const defaultPackages = [...mathLib, ...stringLib, ...factorioLib, ...serpentLib];

export const core = [...keywords, ...special_global_vars, ...defaultPackages, ...core_base];
