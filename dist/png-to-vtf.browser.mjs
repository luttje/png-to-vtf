var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// scripts/stubs/fs.js
var fs_exports = {};
__export(fs_exports, {
  default: () => fs_default,
  readFileSync: () => readFileSync,
  writeFileSync: () => writeFileSync
});
var fs_default, writeFileSync, readFileSync;
var init_fs = __esm({
  "scripts/stubs/fs.js"() {
    fs_default = {};
    writeFileSync = () => {
    };
    readFileSync = () => {
    };
  }
});

// scripts/stubs/path.js
var path_exports = {};
__export(path_exports, {
  basename: () => basename,
  default: () => path_default,
  dirname: () => dirname,
  join: () => join,
  normalize: () => normalize,
  resolve: () => resolve
});
function normalize() {
  return "";
}
function join() {
  return "";
}
function resolve() {
  return "";
}
function dirname() {
  return "";
}
function basename() {
  return "";
}
var path_default;
var init_path = __esm({
  "scripts/stubs/path.js"() {
    path_default = {};
  }
});

// node_modules/dxt-js/src/squish.js
var require_squish = __commonJS({
  "node_modules/dxt-js/src/squish.js"(exports, module) {
    var Module;
    if (!Module) Module = (typeof Module !== "undefined" ? Module : null) || {};
    var moduleOverrides = {};
    for (key in Module) {
      if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
      }
    }
    var key;
    var ENVIRONMENT_IS_WEB = false;
    var ENVIRONMENT_IS_WORKER = false;
    var ENVIRONMENT_IS_NODE = false;
    var ENVIRONMENT_IS_SHELL = false;
    if (Module["ENVIRONMENT"]) {
      if (Module["ENVIRONMENT"] === "WEB") {
        ENVIRONMENT_IS_WEB = true;
      } else if (Module["ENVIRONMENT"] === "WORKER") {
        ENVIRONMENT_IS_WORKER = true;
      } else if (Module["ENVIRONMENT"] === "NODE") {
        ENVIRONMENT_IS_NODE = true;
      } else if (Module["ENVIRONMENT"] === "SHELL") {
        ENVIRONMENT_IS_SHELL = true;
      } else {
        throw new Error("The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.");
      }
    } else {
      ENVIRONMENT_IS_WEB = typeof window === "object";
      ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
      ENVIRONMENT_IS_NODE = typeof process === "object" && typeof __require === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
      ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
    }
    if (ENVIRONMENT_IS_NODE) {
      if (!Module["print"]) Module["print"] = console.log;
      if (!Module["printErr"]) Module["printErr"] = console.warn;
      Module["read"] = function shell_read(filename, binary) {
        if (!nodeFS) nodeFS = (init_fs(), __toCommonJS(fs_exports));
        if (!nodePath) nodePath = (init_path(), __toCommonJS(path_exports));
        filename = nodePath["normalize"](filename);
        var ret = nodeFS["readFileSync"](filename);
        return binary ? ret : ret.toString();
      };
      Module["readBinary"] = function readBinary(filename) {
        var ret = Module["read"](filename, true);
        if (!ret.buffer) {
          ret = new Uint8Array(ret);
        }
        assert(ret.buffer);
        return ret;
      };
      Module["load"] = function load(f) {
        globalEval(read(f));
      };
      if (!Module["thisProgram"]) {
        if (process["argv"].length > 1) {
          Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/");
        } else {
          Module["thisProgram"] = "unknown-program";
        }
      }
      Module["arguments"] = process["argv"].slice(2);
      if (typeof module !== "undefined") {
        module["exports"] = Module;
      }
      process["on"]("uncaughtException", (function(ex) {
        if (!(ex instanceof ExitStatus)) {
          throw ex;
        }
      }));
      Module["inspect"] = (function() {
        return "[Emscripten Module object]";
      });
    } else if (ENVIRONMENT_IS_SHELL) {
      if (!Module["print"]) Module["print"] = print;
      if (typeof printErr != "undefined") Module["printErr"] = printErr;
      if (typeof read != "undefined") {
        Module["read"] = read;
      } else {
        Module["read"] = function shell_read() {
          throw "no read() available";
        };
      }
      Module["readBinary"] = function readBinary(f) {
        if (typeof readbuffer === "function") {
          return new Uint8Array(readbuffer(f));
        }
        var data = read(f, "binary");
        assert(typeof data === "object");
        return data;
      };
      if (typeof scriptArgs != "undefined") {
        Module["arguments"] = scriptArgs;
      } else if (typeof arguments != "undefined") {
        Module["arguments"] = arguments;
      }
      if (typeof quit === "function") {
        Module["quit"] = (function(status, toThrow) {
          quit(status);
        });
      }
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      Module["read"] = function shell_read(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText;
      };
      if (ENVIRONMENT_IS_WORKER) {
        Module["readBinary"] = function readBinary(url) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.responseType = "arraybuffer";
          xhr.send(null);
          return new Uint8Array(xhr.response);
        };
      }
      Module["readAsync"] = function readAsync(url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      };
      if (typeof arguments != "undefined") {
        Module["arguments"] = arguments;
      }
      if (typeof console !== "undefined") {
        if (!Module["print"]) Module["print"] = function shell_print(x) {
          console.log(x);
        };
        if (!Module["printErr"]) Module["printErr"] = function shell_printErr(x) {
          console.warn(x);
        };
      } else {
        TRY_USE_DUMP = false;
        if (!Module["print"]) Module["print"] = TRY_USE_DUMP && typeof dump !== "undefined" ? (function(x) {
          dump(x);
        }) : (function(x) {
        });
      }
      if (ENVIRONMENT_IS_WORKER) {
        Module["load"] = importScripts;
      }
      if (typeof Module["setWindowTitle"] === "undefined") {
        Module["setWindowTitle"] = (function(title) {
          document.title = title;
        });
      }
    } else {
      throw "Unknown runtime environment. Where are we?";
    }
    var nodeFS;
    var nodePath;
    var TRY_USE_DUMP;
    function globalEval(x) {
      eval.call(null, x);
    }
    if (!Module["load"] && Module["read"]) {
      Module["load"] = function load(f) {
        globalEval(Module["read"](f));
      };
    }
    if (!Module["print"]) {
      Module["print"] = (function() {
      });
    }
    if (!Module["printErr"]) {
      Module["printErr"] = Module["print"];
    }
    if (!Module["arguments"]) {
      Module["arguments"] = [];
    }
    if (!Module["thisProgram"]) {
      Module["thisProgram"] = "./this.program";
    }
    if (!Module["quit"]) {
      Module["quit"] = (function(status, toThrow) {
        throw toThrow;
      });
    }
    Module.print = Module["print"];
    Module.printErr = Module["printErr"];
    Module["preRun"] = [];
    Module["postRun"] = [];
    for (key in moduleOverrides) {
      if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
      }
    }
    var key;
    moduleOverrides = void 0;
    var Runtime = { setTempRet0: (function(value) {
      tempRet0 = value;
      return value;
    }), getTempRet0: (function() {
      return tempRet0;
    }), stackSave: (function() {
      return STACKTOP;
    }), stackRestore: (function(stackTop) {
      STACKTOP = stackTop;
    }), getNativeTypeSize: (function(type2) {
      switch (type2) {
        case "i1":
        case "i8":
          return 1;
        case "i16":
          return 2;
        case "i32":
          return 4;
        case "i64":
          return 8;
        case "float":
          return 4;
        case "double":
          return 8;
        default: {
          if (type2[type2.length - 1] === "*") {
            return Runtime.QUANTUM_SIZE;
          } else if (type2[0] === "i") {
            var bits = parseInt(type2.substr(1));
            assert(bits % 8 === 0);
            return bits / 8;
          } else {
            return 0;
          }
        }
      }
    }), getNativeFieldSize: (function(type2) {
      return Math.max(Runtime.getNativeTypeSize(type2), Runtime.QUANTUM_SIZE);
    }), STACK_ALIGN: 16, prepVararg: (function(ptr, type2) {
      if (type2 === "double" || type2 === "i64") {
        if (ptr & 7) {
          assert((ptr & 7) === 4);
          ptr += 4;
        }
      } else {
        assert((ptr & 3) === 0);
      }
      return ptr;
    }), getAlignSize: (function(type2, size, vararg) {
      if (!vararg && (type2 == "i64" || type2 == "double")) return 8;
      if (!type2) return Math.min(size, 8);
      return Math.min(size || (type2 ? Runtime.getNativeFieldSize(type2) : 0), Runtime.QUANTUM_SIZE);
    }), dynCall: (function(sig, ptr, args) {
      if (args && args.length) {
        return Module["dynCall_" + sig].apply(null, [ptr].concat(args));
      } else {
        return Module["dynCall_" + sig].call(null, ptr);
      }
    }), functionPointers: [], addFunction: (function(func2) {
      for (var i2 = 0; i2 < Runtime.functionPointers.length; i2++) {
        if (!Runtime.functionPointers[i2]) {
          Runtime.functionPointers[i2] = func2;
          return 2 * (1 + i2);
        }
      }
      throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
    }), removeFunction: (function(index) {
      Runtime.functionPointers[(index - 2) / 2] = null;
    }), warnOnce: (function(text) {
      if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
      if (!Runtime.warnOnce.shown[text]) {
        Runtime.warnOnce.shown[text] = 1;
        Module.printErr(text);
      }
    }), funcWrappers: {}, getFuncWrapper: (function(func2, sig) {
      if (!func2) return;
      assert(sig);
      if (!Runtime.funcWrappers[sig]) {
        Runtime.funcWrappers[sig] = {};
      }
      var sigCache = Runtime.funcWrappers[sig];
      if (!sigCache[func2]) {
        if (sig.length === 1) {
          sigCache[func2] = function dynCall_wrapper() {
            return Runtime.dynCall(sig, func2);
          };
        } else if (sig.length === 2) {
          sigCache[func2] = function dynCall_wrapper(arg2) {
            return Runtime.dynCall(sig, func2, [arg2]);
          };
        } else {
          sigCache[func2] = function dynCall_wrapper() {
            return Runtime.dynCall(sig, func2, Array.prototype.slice.call(arguments));
          };
        }
      }
      return sigCache[func2];
    }), getCompilerSetting: (function(name) {
      throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work";
    }), stackAlloc: (function(size) {
      var ret = STACKTOP;
      STACKTOP = STACKTOP + size | 0;
      STACKTOP = STACKTOP + 15 & -16;
      return ret;
    }), staticAlloc: (function(size) {
      var ret = STATICTOP;
      STATICTOP = STATICTOP + size | 0;
      STATICTOP = STATICTOP + 15 & -16;
      return ret;
    }), dynamicAlloc: (function(size) {
      var ret = HEAP32[DYNAMICTOP_PTR >> 2];
      var end = (ret + size + 15 | 0) & -16;
      HEAP32[DYNAMICTOP_PTR >> 2] = end;
      if (end >= TOTAL_MEMORY) {
        var success = enlargeMemory();
        if (!success) {
          HEAP32[DYNAMICTOP_PTR >> 2] = ret;
          return 0;
        }
      }
      return ret;
    }), alignMemory: (function(size, quantum) {
      var ret = size = Math.ceil(size / (quantum ? quantum : 16)) * (quantum ? quantum : 16);
      return ret;
    }), makeBigInt: (function(low, high, unsigned) {
      var ret = unsigned ? +(low >>> 0) + +(high >>> 0) * 4294967296 : +(low >>> 0) + +(high | 0) * 4294967296;
      return ret;
    }), GLOBAL_BASE: 8, QUANTUM_SIZE: 4, __dummy__: 0 };
    Module["Runtime"] = Runtime;
    var ABORT = 0;
    var EXITSTATUS = 0;
    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed: " + text);
      }
    }
    function getCFunc(ident) {
      var func = Module["_" + ident];
      if (!func) {
        try {
          func = eval("_" + ident);
        } catch (e) {
        }
      }
      assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)");
      return func;
    }
    var cwrap;
    var ccall;
    (function() {
      var JSfuncs = { "stackSave": (function() {
        Runtime.stackSave();
      }), "stackRestore": (function() {
        Runtime.stackRestore();
      }), "arrayToC": (function(arr) {
        var ret = Runtime.stackAlloc(arr.length);
        writeArrayToMemory(arr, ret);
        return ret;
      }), "stringToC": (function(str) {
        var ret = 0;
        if (str !== null && str !== void 0 && str !== 0) {
          var len = (str.length << 2) + 1;
          ret = Runtime.stackAlloc(len);
          stringToUTF8(str, ret, len);
        }
        return ret;
      }) };
      var toC = { "string": JSfuncs["stringToC"], "array": JSfuncs["arrayToC"] };
      ccall = function ccallFunc(ident2, returnType2, argTypes2, args, opts) {
        var func2 = getCFunc(ident2);
        var cArgs = [];
        var stack = 0;
        if (args) {
          for (var i2 = 0; i2 < args.length; i2++) {
            var converter = toC[argTypes2[i2]];
            if (converter) {
              if (stack === 0) stack = Runtime.stackSave();
              cArgs[i2] = converter(args[i2]);
            } else {
              cArgs[i2] = args[i2];
            }
          }
        }
        var ret = func2.apply(null, cArgs);
        if (returnType2 === "string") ret = Pointer_stringify(ret);
        if (stack !== 0) {
          if (opts && opts.async) {
            EmterpreterAsync.asyncFinalizers.push((function() {
              Runtime.stackRestore(stack);
            }));
            return;
          }
          Runtime.stackRestore(stack);
        }
        return ret;
      };
      var sourceRegex = /^function\s*[a-zA-Z$_0-9]*\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
      function parseJSFunc(jsfunc) {
        var parsed = jsfunc.toString().match(sourceRegex).slice(1);
        return { arguments: parsed[0], body: parsed[1], returnValue: parsed[2] };
      }
      var JSsource = null;
      function ensureJSsource() {
        if (!JSsource) {
          JSsource = {};
          for (var fun in JSfuncs) {
            if (JSfuncs.hasOwnProperty(fun)) {
              JSsource[fun] = parseJSFunc(JSfuncs[fun]);
            }
          }
        }
      }
      cwrap = function cwrap(ident, returnType, argTypes) {
        argTypes = argTypes || [];
        var cfunc = getCFunc(ident);
        var numericArgs = argTypes.every((function(type2) {
          return type2 === "number";
        }));
        var numericRet = returnType !== "string";
        if (numericRet && numericArgs) {
          return cfunc;
        }
        var argNames = argTypes.map((function(x, i2) {
          return "$" + i2;
        }));
        var funcstr = "(function(" + argNames.join(",") + ") {";
        var nargs = argTypes.length;
        if (!numericArgs) {
          ensureJSsource();
          funcstr += "var stack = " + JSsource["stackSave"].body + ";";
          for (var i = 0; i < nargs; i++) {
            var arg = argNames[i], type = argTypes[i];
            if (type === "number") continue;
            var convertCode = JSsource[type + "ToC"];
            funcstr += "var " + convertCode.arguments + " = " + arg + ";";
            funcstr += convertCode.body + ";";
            funcstr += arg + "=(" + convertCode.returnValue + ");";
          }
        }
        var cfuncname = parseJSFunc((function() {
          return cfunc;
        })).returnValue;
        funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");";
        if (!numericRet) {
          var strgfy = parseJSFunc((function() {
            return Pointer_stringify;
          })).returnValue;
          funcstr += "ret = " + strgfy + "(ret);";
        }
        if (!numericArgs) {
          ensureJSsource();
          funcstr += JSsource["stackRestore"].body.replace("()", "(stack)") + ";";
        }
        funcstr += "return ret})";
        return eval(funcstr);
      };
    })();
    Module["ccall"] = ccall;
    Module["cwrap"] = cwrap;
    function setValue(ptr, value, type2, noSafe) {
      type2 = type2 || "i8";
      if (type2.charAt(type2.length - 1) === "*") type2 = "i32";
      switch (type2) {
        case "i1":
          HEAP8[ptr >> 0] = value;
          break;
        case "i8":
          HEAP8[ptr >> 0] = value;
          break;
        case "i16":
          HEAP16[ptr >> 1] = value;
          break;
        case "i32":
          HEAP32[ptr >> 2] = value;
          break;
        case "i64":
          tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
          break;
        case "float":
          HEAPF32[ptr >> 2] = value;
          break;
        case "double":
          HEAPF64[ptr >> 3] = value;
          break;
        default:
          abort("invalid type for setValue: " + type2);
      }
    }
    Module["setValue"] = setValue;
    function getValue(ptr, type2, noSafe) {
      type2 = type2 || "i8";
      if (type2.charAt(type2.length - 1) === "*") type2 = "i32";
      switch (type2) {
        case "i1":
          return HEAP8[ptr >> 0];
        case "i8":
          return HEAP8[ptr >> 0];
        case "i16":
          return HEAP16[ptr >> 1];
        case "i32":
          return HEAP32[ptr >> 2];
        case "i64":
          return HEAP32[ptr >> 2];
        case "float":
          return HEAPF32[ptr >> 2];
        case "double":
          return HEAPF64[ptr >> 3];
        default:
          abort("invalid type for setValue: " + type2);
      }
      return null;
    }
    Module["getValue"] = getValue;
    var ALLOC_NORMAL = 0;
    var ALLOC_STACK = 1;
    var ALLOC_STATIC = 2;
    var ALLOC_DYNAMIC = 3;
    var ALLOC_NONE = 4;
    Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
    Module["ALLOC_STACK"] = ALLOC_STACK;
    Module["ALLOC_STATIC"] = ALLOC_STATIC;
    Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
    Module["ALLOC_NONE"] = ALLOC_NONE;
    function allocate(slab, types, allocator, ptr) {
      var zeroinit, size;
      if (typeof slab === "number") {
        zeroinit = true;
        size = slab;
      } else {
        zeroinit = false;
        size = slab.length;
      }
      var singleType = typeof types === "string" ? types : null;
      var ret;
      if (allocator == ALLOC_NONE) {
        ret = ptr;
      } else {
        ret = [typeof _malloc === "function" ? _malloc : Runtime.staticAlloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === void 0 ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
      }
      if (zeroinit) {
        var ptr = ret, stop;
        assert((ret & 3) == 0);
        stop = ret + (size & ~3);
        for (; ptr < stop; ptr += 4) {
          HEAP32[ptr >> 2] = 0;
        }
        stop = ret + size;
        while (ptr < stop) {
          HEAP8[ptr++ >> 0] = 0;
        }
        return ret;
      }
      if (singleType === "i8") {
        if (slab.subarray || slab.slice) {
          HEAPU8.set(slab, ret);
        } else {
          HEAPU8.set(new Uint8Array(slab), ret);
        }
        return ret;
      }
      var i2 = 0, type2, typeSize, previousType;
      while (i2 < size) {
        var curr = slab[i2];
        if (typeof curr === "function") {
          curr = Runtime.getFunctionIndex(curr);
        }
        type2 = singleType || types[i2];
        if (type2 === 0) {
          i2++;
          continue;
        }
        if (type2 == "i64") type2 = "i32";
        setValue(ret + i2, curr, type2);
        if (previousType !== type2) {
          typeSize = Runtime.getNativeTypeSize(type2);
          previousType = type2;
        }
        i2 += typeSize;
      }
      return ret;
    }
    Module["allocate"] = allocate;
    function getMemory(size) {
      if (!staticSealed) return Runtime.staticAlloc(size);
      if (!runtimeInitialized) return Runtime.dynamicAlloc(size);
      return _malloc(size);
    }
    Module["getMemory"] = getMemory;
    function Pointer_stringify(ptr, length) {
      if (length === 0 || !ptr) return "";
      var hasUtf = 0;
      var t;
      var i2 = 0;
      while (1) {
        t = HEAPU8[ptr + i2 >> 0];
        hasUtf |= t;
        if (t == 0 && !length) break;
        i2++;
        if (length && i2 == length) break;
      }
      if (!length) length = i2;
      var ret = "";
      if (hasUtf < 128) {
        var MAX_CHUNK = 1024;
        var curr;
        while (length > 0) {
          curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
          ret = ret ? ret + curr : curr;
          ptr += MAX_CHUNK;
          length -= MAX_CHUNK;
        }
        return ret;
      }
      return Module["UTF8ToString"](ptr);
    }
    Module["Pointer_stringify"] = Pointer_stringify;
    function AsciiToString(ptr) {
      var str = "";
      while (1) {
        var ch = HEAP8[ptr++ >> 0];
        if (!ch) return str;
        str += String.fromCharCode(ch);
      }
    }
    Module["AsciiToString"] = AsciiToString;
    function stringToAscii(str, outPtr) {
      return writeAsciiToMemory(str, outPtr, false);
    }
    Module["stringToAscii"] = stringToAscii;
    var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : void 0;
    function UTF8ArrayToString(u8Array, idx) {
      var endPtr = idx;
      while (u8Array[endPtr]) ++endPtr;
      if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
      } else {
        var u0, u1, u2, u3, u4, u5;
        var str = "";
        while (1) {
          u0 = u8Array[idx++];
          if (!u0) return str;
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          u1 = u8Array[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue;
          }
          u2 = u8Array[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2;
          } else {
            u3 = u8Array[idx++] & 63;
            if ((u0 & 248) == 240) {
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3;
            } else {
              u4 = u8Array[idx++] & 63;
              if ((u0 & 252) == 248) {
                u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4;
              } else {
                u5 = u8Array[idx++] & 63;
                u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5;
              }
            }
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          }
        }
      }
    }
    Module["UTF8ArrayToString"] = UTF8ArrayToString;
    function UTF8ToString(ptr) {
      return UTF8ArrayToString(HEAPU8, ptr);
    }
    Module["UTF8ToString"] = UTF8ToString;
    function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i2 = 0; i2 < str.length; ++i2) {
        var u = str.charCodeAt(i2);
        if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i2) & 1023;
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          outU8Array[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          outU8Array[outIdx++] = 192 | u >> 6;
          outU8Array[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          outU8Array[outIdx++] = 224 | u >> 12;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        } else if (u <= 2097151) {
          if (outIdx + 3 >= endIdx) break;
          outU8Array[outIdx++] = 240 | u >> 18;
          outU8Array[outIdx++] = 128 | u >> 12 & 63;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        } else if (u <= 67108863) {
          if (outIdx + 4 >= endIdx) break;
          outU8Array[outIdx++] = 248 | u >> 24;
          outU8Array[outIdx++] = 128 | u >> 18 & 63;
          outU8Array[outIdx++] = 128 | u >> 12 & 63;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 5 >= endIdx) break;
          outU8Array[outIdx++] = 252 | u >> 30;
          outU8Array[outIdx++] = 128 | u >> 24 & 63;
          outU8Array[outIdx++] = 128 | u >> 18 & 63;
          outU8Array[outIdx++] = 128 | u >> 12 & 63;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        }
      }
      outU8Array[outIdx] = 0;
      return outIdx - startIdx;
    }
    Module["stringToUTF8Array"] = stringToUTF8Array;
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }
    Module["stringToUTF8"] = stringToUTF8;
    function lengthBytesUTF8(str) {
      var len = 0;
      for (var i2 = 0; i2 < str.length; ++i2) {
        var u = str.charCodeAt(i2);
        if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i2) & 1023;
        if (u <= 127) {
          ++len;
        } else if (u <= 2047) {
          len += 2;
        } else if (u <= 65535) {
          len += 3;
        } else if (u <= 2097151) {
          len += 4;
        } else if (u <= 67108863) {
          len += 5;
        } else {
          len += 6;
        }
      }
      return len;
    }
    Module["lengthBytesUTF8"] = lengthBytesUTF8;
    var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : void 0;
    function demangle(func2) {
      var __cxa_demangle_func = Module["___cxa_demangle"] || Module["__cxa_demangle"];
      if (__cxa_demangle_func) {
        try {
          var s = func2.substr(1);
          var len = lengthBytesUTF8(s) + 1;
          var buf = _malloc(len);
          stringToUTF8(s, buf, len);
          var status = _malloc(4);
          var ret = __cxa_demangle_func(buf, 0, 0, status);
          if (getValue(status, "i32") === 0 && ret) {
            return Pointer_stringify(ret);
          }
        } catch (e) {
        } finally {
          if (buf) _free(buf);
          if (status) _free(status);
          if (ret) _free(ret);
        }
        return func2;
      }
      Runtime.warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
      return func2;
    }
    function demangleAll(text) {
      var regex = /__Z[\w\d_]+/g;
      return text.replace(regex, (function(x) {
        var y = demangle(x);
        return x === y ? x : x + " [" + y + "]";
      }));
    }
    function jsStackTrace() {
      var err = new Error();
      if (!err.stack) {
        try {
          throw new Error(0);
        } catch (e) {
          err = e;
        }
        if (!err.stack) {
          return "(no stack trace available)";
        }
      }
      return err.stack.toString();
    }
    function stackTrace() {
      var js = jsStackTrace();
      if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
      return demangleAll(js);
    }
    Module["stackTrace"] = stackTrace;
    var WASM_PAGE_SIZE = 65536;
    var ASMJS_PAGE_SIZE = 16777216;
    var MIN_TOTAL_MEMORY = 16777216;
    function alignUp(x, multiple) {
      if (x % multiple > 0) {
        x += multiple - x % multiple;
      }
      return x;
    }
    var HEAP;
    var buffer;
    var HEAP8;
    var HEAPU8;
    var HEAP16;
    var HEAPU16;
    var HEAP32;
    var HEAPU32;
    var HEAPF32;
    var HEAPF64;
    function updateGlobalBuffer(buf) {
      Module["buffer"] = buffer = buf;
    }
    function updateGlobalBufferViews() {
      Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
      Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
      Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer);
    }
    var STATIC_BASE;
    var STATICTOP;
    var staticSealed;
    var STACK_BASE;
    var STACKTOP;
    var STACK_MAX;
    var DYNAMIC_BASE;
    var DYNAMICTOP_PTR;
    STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
    staticSealed = false;
    function abortOnCannotGrowMemory() {
      abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or (4) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ");
    }
    if (!Module["reallocBuffer"]) Module["reallocBuffer"] = (function(size) {
      var ret;
      try {
        if (ArrayBuffer.transfer) {
          ret = ArrayBuffer.transfer(buffer, size);
        } else {
          var oldHEAP8 = HEAP8;
          ret = new ArrayBuffer(size);
          var temp = new Int8Array(ret);
          temp.set(oldHEAP8);
        }
      } catch (e) {
        return false;
      }
      var success = _emscripten_replace_memory(ret);
      if (!success) return false;
      return ret;
    });
    function enlargeMemory() {
      var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
      var LIMIT = 2147483648 - PAGE_MULTIPLE;
      if (HEAP32[DYNAMICTOP_PTR >> 2] > LIMIT) {
        return false;
      }
      var OLD_TOTAL_MEMORY = TOTAL_MEMORY;
      TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY);
      while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR >> 2]) {
        if (TOTAL_MEMORY <= 536870912) {
          TOTAL_MEMORY = alignUp(2 * TOTAL_MEMORY, PAGE_MULTIPLE);
        } else {
          TOTAL_MEMORY = Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, PAGE_MULTIPLE), LIMIT);
        }
      }
      var replacement = Module["reallocBuffer"](TOTAL_MEMORY);
      if (!replacement || replacement.byteLength != TOTAL_MEMORY) {
        TOTAL_MEMORY = OLD_TOTAL_MEMORY;
        return false;
      }
      updateGlobalBuffer(replacement);
      updateGlobalBufferViews();
      return true;
    }
    var byteLength;
    try {
      byteLength = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get);
      byteLength(new ArrayBuffer(4));
    } catch (e) {
      byteLength = (function(buffer2) {
        return buffer2.byteLength;
      });
    }
    var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
    var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
    if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
    if (Module["buffer"]) {
      buffer = Module["buffer"];
    } else {
      {
        buffer = new ArrayBuffer(TOTAL_MEMORY);
      }
    }
    updateGlobalBufferViews();
    function getTotalMemory() {
      return TOTAL_MEMORY;
    }
    HEAP32[0] = 1668509029;
    HEAP16[1] = 25459;
    if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99) throw "Runtime error: expected the system to be little-endian!";
    Module["HEAP"] = HEAP;
    Module["buffer"] = buffer;
    Module["HEAP8"] = HEAP8;
    Module["HEAP16"] = HEAP16;
    Module["HEAP32"] = HEAP32;
    Module["HEAPU8"] = HEAPU8;
    Module["HEAPU16"] = HEAPU16;
    Module["HEAPU32"] = HEAPU32;
    Module["HEAPF32"] = HEAPF32;
    Module["HEAPF64"] = HEAPF64;
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
          callback();
          continue;
        }
        var func2 = callback.func;
        if (typeof func2 === "number") {
          if (callback.arg === void 0) {
            Module["dynCall_v"](func2);
          } else {
            Module["dynCall_vi"](func2, callback.arg);
          }
        } else {
          func2(callback.arg === void 0 ? null : callback.arg);
        }
      }
    }
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATMAIN__ = [];
    var __ATEXIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    var runtimeExited = false;
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function ensureInitRuntime() {
      if (runtimeInitialized) return;
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }
    function preMain() {
      callRuntimeCallbacks(__ATMAIN__);
    }
    function exitRuntime() {
      callRuntimeCallbacks(__ATEXIT__);
      runtimeExited = true;
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    Module["addOnPreRun"] = addOnPreRun;
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    Module["addOnInit"] = addOnInit;
    function addOnPreMain(cb) {
      __ATMAIN__.unshift(cb);
    }
    Module["addOnPreMain"] = addOnPreMain;
    function addOnExit(cb) {
      __ATEXIT__.unshift(cb);
    }
    Module["addOnExit"] = addOnExit;
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    Module["addOnPostRun"] = addOnPostRun;
    function intArrayFromString(stringy, dontAddNull, length) {
      var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    }
    Module["intArrayFromString"] = intArrayFromString;
    function intArrayToString(array) {
      var ret = [];
      for (var i2 = 0; i2 < array.length; i2++) {
        var chr = array[i2];
        if (chr > 255) {
          chr &= 255;
        }
        ret.push(String.fromCharCode(chr));
      }
      return ret.join("");
    }
    Module["intArrayToString"] = intArrayToString;
    function writeStringToMemory(string, buffer2, dontAddNull) {
      Runtime.warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!");
      var lastChar, end;
      if (dontAddNull) {
        end = buffer2 + lengthBytesUTF8(string);
        lastChar = HEAP8[end];
      }
      stringToUTF8(string, buffer2, Infinity);
      if (dontAddNull) HEAP8[end] = lastChar;
    }
    Module["writeStringToMemory"] = writeStringToMemory;
    function writeArrayToMemory(array, buffer2) {
      HEAP8.set(array, buffer2);
    }
    Module["writeArrayToMemory"] = writeArrayToMemory;
    function writeAsciiToMemory(str, buffer2, dontAddNull) {
      for (var i2 = 0; i2 < str.length; ++i2) {
        HEAP8[buffer2++ >> 0] = str.charCodeAt(i2);
      }
      if (!dontAddNull) HEAP8[buffer2 >> 0] = 0;
    }
    Module["writeAsciiToMemory"] = writeAsciiToMemory;
    if (!Math["imul"] || Math["imul"](4294967295, 5) !== -5) Math["imul"] = function imul(a, b) {
      var ah = a >>> 16;
      var al = a & 65535;
      var bh = b >>> 16;
      var bl = b & 65535;
      return al * bl + (ah * bl + al * bh << 16) | 0;
    };
    Math.imul = Math["imul"];
    if (!Math["clz32"]) Math["clz32"] = (function(x) {
      x = x >>> 0;
      for (var i2 = 0; i2 < 32; i2++) {
        if (x & 1 << 31 - i2) return i2;
      }
      return 32;
    });
    Math.clz32 = Math["clz32"];
    if (!Math["trunc"]) Math["trunc"] = (function(x) {
      return x < 0 ? Math.ceil(x) : Math.floor(x);
    });
    Math.trunc = Math["trunc"];
    var Math_abs = Math.abs;
    var Math_cos = Math.cos;
    var Math_sin = Math.sin;
    var Math_tan = Math.tan;
    var Math_acos = Math.acos;
    var Math_asin = Math.asin;
    var Math_atan = Math.atan;
    var Math_atan2 = Math.atan2;
    var Math_exp = Math.exp;
    var Math_log = Math.log;
    var Math_sqrt = Math.sqrt;
    var Math_ceil = Math.ceil;
    var Math_floor = Math.floor;
    var Math_pow = Math.pow;
    var Math_imul = Math.imul;
    var Math_fround = Math.fround;
    var Math_round = Math.round;
    var Math_min = Math.min;
    var Math_clz32 = Math.clz32;
    var Math_trunc = Math.trunc;
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    Module["addRunDependency"] = addRunDependency;
    function removeRunDependency(id) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    Module["removeRunDependency"] = removeRunDependency;
    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};
    var ASM_CONSTS = [];
    STATIC_BASE = Runtime.GLOBAL_BASE;
    STATICTOP = STATIC_BASE + 8624;
    __ATINIT__.push();
    allocate([116, 2, 0, 0, 148, 2, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 76, 2, 0, 0, 170, 2, 0, 0, 116, 2, 0, 0, 190, 2, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 116, 2, 0, 0, 209, 26, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 116, 2, 0, 0, 63, 27, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 116, 2, 0, 0, 236, 26, 0, 0, 96, 0, 0, 0, 0, 0, 0, 0, 76, 2, 0, 0, 13, 27, 0, 0, 116, 2, 0, 0, 26, 27, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 209, 2, 0, 0, 209, 8, 0, 0, 209, 2, 0, 0, 209, 14, 0, 0, 209, 20, 0, 0, 209, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 172, 29, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 196, 1, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 104, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 78, 54, 115, 113, 117, 105, 115, 104, 49, 48, 67, 108, 117, 115, 116, 101, 114, 70, 105, 116, 69, 0, 78, 54, 115, 113, 117, 105, 115, 104, 57, 67, 111, 108, 111, 117, 114, 70, 105, 116, 69, 0, 78, 54, 115, 113, 117, 105, 115, 104, 56, 82, 97, 110, 103, 101, 70, 105, 116, 69, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 2, 0, 1, 0, 0, 0, 3, 0, 1, 1, 0, 0, 4, 0, 2, 1, 1, 0, 3, 0, 2, 0, 1, 0, 2, 0, 2, 1, 1, 0, 1, 0, 3, 1, 1, 0, 0, 0, 3, 0, 1, 0, 1, 1, 2, 1, 1, 0, 2, 1, 2, 0, 1, 0, 3, 0, 4, 0, 1, 0, 4, 0, 5, 1, 2, 0, 3, 0, 5, 0, 2, 0, 2, 0, 5, 1, 2, 0, 1, 0, 6, 1, 2, 0, 0, 0, 6, 0, 2, 0, 1, 2, 3, 1, 2, 0, 2, 2, 3, 0, 2, 0, 3, 0, 7, 0, 2, 0, 4, 1, 6, 1, 3, 0, 3, 1, 6, 0, 3, 0, 2, 0, 8, 0, 3, 0, 1, 0, 9, 1, 3, 0, 0, 0, 9, 0, 3, 0, 1, 0, 9, 1, 3, 0, 2, 0, 10, 1, 3, 0, 3, 0, 10, 0, 3, 0, 4, 2, 7, 1, 4, 0, 4, 2, 7, 0, 4, 0, 3, 0, 11, 0, 4, 0, 2, 1, 10, 1, 4, 0, 1, 1, 10, 0, 4, 0, 0, 0, 12, 0, 4, 0, 1, 0, 13, 1, 4, 0, 2, 0, 13, 0, 4, 0, 3, 0, 13, 1, 4, 0, 4, 0, 14, 1, 5, 0, 3, 0, 14, 0, 5, 0, 2, 2, 11, 1, 5, 0, 1, 2, 11, 0, 5, 0, 0, 0, 15, 0, 5, 0, 1, 1, 14, 1, 5, 0, 2, 1, 14, 0, 5, 0, 3, 0, 16, 0, 5, 0, 4, 0, 17, 1, 6, 0, 3, 0, 17, 0, 6, 0, 2, 0, 17, 1, 6, 0, 1, 0, 18, 1, 6, 0, 0, 0, 18, 0, 6, 0, 1, 2, 15, 1, 6, 0, 2, 2, 15, 0, 6, 0, 3, 0, 19, 0, 6, 0, 4, 1, 18, 1, 7, 0, 3, 1, 18, 0, 7, 0, 2, 0, 20, 0, 7, 0, 1, 0, 21, 1, 7, 0, 0, 0, 21, 0, 7, 0, 1, 0, 21, 1, 7, 0, 2, 0, 22, 1, 7, 0, 3, 0, 22, 0, 7, 0, 4, 2, 19, 1, 8, 0, 4, 2, 19, 0, 8, 0, 3, 0, 23, 0, 8, 0, 2, 1, 22, 1, 8, 0, 1, 1, 22, 0, 8, 0, 0, 0, 24, 0, 8, 0, 1, 0, 25, 1, 8, 0, 2, 0, 25, 0, 8, 0, 3, 0, 25, 1, 8, 0, 4, 0, 26, 1, 9, 0, 3, 0, 26, 0, 9, 0, 2, 2, 23, 1, 9, 0, 1, 2, 23, 0, 9, 0, 0, 0, 27, 0, 9, 0, 1, 1, 26, 1, 9, 0, 2, 1, 26, 0, 9, 0, 3, 0, 28, 0, 9, 0, 4, 0, 29, 1, 10, 0, 3, 0, 29, 0, 10, 0, 2, 0, 29, 1, 10, 0, 1, 0, 30, 1, 10, 0, 0, 0, 30, 0, 10, 0, 1, 2, 27, 1, 10, 0, 2, 2, 27, 0, 10, 0, 3, 0, 31, 0, 10, 0, 4, 1, 30, 1, 11, 0, 3, 1, 30, 0, 11, 0, 2, 4, 24, 0, 11, 0, 1, 1, 31, 1, 11, 0, 0, 1, 31, 0, 11, 0, 1, 1, 31, 1, 11, 0, 2, 2, 30, 1, 11, 0, 3, 2, 30, 0, 11, 0, 4, 2, 31, 1, 12, 0, 4, 2, 31, 0, 12, 0, 3, 4, 27, 0, 12, 0, 2, 3, 30, 1, 12, 0, 1, 3, 30, 0, 12, 0, 0, 4, 28, 0, 12, 0, 1, 3, 31, 1, 12, 0, 2, 3, 31, 0, 12, 0, 3, 3, 31, 1, 12, 0, 4, 4, 30, 1, 13, 0, 3, 4, 30, 0, 13, 0, 2, 6, 27, 1, 13, 0, 1, 6, 27, 0, 13, 0, 0, 4, 31, 0, 13, 0, 1, 5, 30, 1, 13, 0, 2, 5, 30, 0, 13, 0, 3, 8, 24, 0, 13, 0, 4, 5, 31, 1, 14, 0, 3, 5, 31, 0, 14, 0, 2, 5, 31, 1, 14, 0, 1, 6, 30, 1, 14, 0, 0, 6, 30, 0, 14, 0, 1, 6, 31, 1, 14, 0, 2, 6, 31, 0, 14, 0, 3, 8, 27, 0, 14, 0, 4, 7, 30, 1, 15, 0, 3, 7, 30, 0, 15, 0, 2, 8, 28, 0, 15, 0, 1, 7, 31, 1, 15, 0, 0, 7, 31, 0, 15, 0, 1, 7, 31, 1, 15, 0, 2, 8, 30, 1, 15, 0, 3, 8, 30, 0, 15, 0, 4, 10, 27, 1, 16, 0, 4, 10, 27, 0, 16, 0, 3, 8, 31, 0, 16, 0, 2, 9, 30, 1, 16, 0, 1, 9, 30, 0, 16, 0, 0, 12, 24, 0, 16, 0, 1, 9, 31, 1, 16, 0, 2, 9, 31, 0, 16, 0, 3, 9, 31, 1, 16, 0, 4, 10, 30, 1, 17, 0, 3, 10, 30, 0, 17, 0, 2, 10, 31, 1, 17, 0, 1, 10, 31, 0, 17, 0, 0, 12, 27, 0, 17, 0, 1, 11, 30, 1, 17, 0, 2, 11, 30, 0, 17, 0, 3, 12, 28, 0, 17, 0, 4, 11, 31, 1, 18, 0, 3, 11, 31, 0, 18, 0, 2, 11, 31, 1, 18, 0, 1, 12, 30, 1, 18, 0, 0, 12, 30, 0, 18, 0, 1, 14, 27, 1, 18, 0, 2, 14, 27, 0, 18, 0, 3, 12, 31, 0, 18, 0, 4, 13, 30, 1, 19, 0, 3, 13, 30, 0, 19, 0, 2, 16, 24, 0, 19, 0, 1, 13, 31, 1, 19, 0, 0, 13, 31, 0, 19, 0, 1, 13, 31, 1, 19, 0, 2, 14, 30, 1, 19, 0, 3, 14, 30, 0, 19, 0, 4, 14, 31, 1, 20, 0, 4, 14, 31, 0, 20, 0, 3, 16, 27, 0, 20, 0, 2, 15, 30, 1, 20, 0, 1, 15, 30, 0, 20, 0, 0, 16, 28, 0, 20, 0, 1, 15, 31, 1, 20, 0, 2, 15, 31, 0, 20, 0, 3, 15, 31, 1, 20, 0, 4, 16, 30, 1, 21, 0, 3, 16, 30, 0, 21, 0, 2, 18, 27, 1, 21, 0, 1, 18, 27, 0, 21, 0, 0, 16, 31, 0, 21, 0, 1, 17, 30, 1, 21, 0, 2, 17, 30, 0, 21, 0, 3, 20, 24, 0, 21, 0, 4, 17, 31, 1, 22, 0, 3, 17, 31, 0, 22, 0, 2, 17, 31, 1, 22, 0, 1, 18, 30, 1, 22, 0, 0, 18, 30, 0, 22, 0, 1, 18, 31, 1, 22, 0, 2, 18, 31, 0, 22, 0, 3, 20, 27, 0, 22, 0, 4, 19, 30, 1, 23, 0, 3, 19, 30, 0, 23, 0, 2, 20, 28, 0, 23, 0, 1, 19, 31, 1, 23, 0, 0, 19, 31, 0, 23, 0, 1, 19, 31, 1, 23, 0, 2, 20, 30, 1, 23, 0, 3, 20, 30, 0, 23, 0, 4, 22, 27, 1, 24, 0, 4, 22, 27, 0, 24, 0, 3, 20, 31, 0, 24, 0, 2, 21, 30, 1, 24, 0, 1, 21, 30, 0, 24, 0, 0, 24, 24, 0, 24, 0, 1, 21, 31, 1, 24, 0, 2, 21, 31, 0, 24, 0, 3, 21, 31, 1, 24, 0, 4, 22, 30, 1, 25, 0, 3, 22, 30, 0, 25, 0, 2, 22, 31, 1, 25, 0, 1, 22, 31, 0, 25, 0, 0, 24, 27, 0, 25, 0, 1, 23, 30, 1, 25, 0, 2, 23, 30, 0, 25, 0, 3, 24, 28, 0, 25, 0, 4, 23, 31, 1, 26, 0, 3, 23, 31, 0, 26, 0, 2, 23, 31, 1, 26, 0, 1, 24, 30, 1, 26, 0, 0, 24, 30, 0, 26, 0, 1, 26, 27, 1, 26, 0, 2, 26, 27, 0, 26, 0, 3, 24, 31, 0, 26, 0, 4, 25, 30, 1, 27, 0, 3, 25, 30, 0, 27, 0, 2, 28, 24, 0, 27, 0, 1, 25, 31, 1, 27, 0, 0, 25, 31, 0, 27, 0, 1, 25, 31, 1, 27, 0, 2, 26, 30, 1, 27, 0, 3, 26, 30, 0, 27, 0, 4, 26, 31, 1, 28, 0, 4, 26, 31, 0, 28, 0, 3, 28, 27, 0, 28, 0, 2, 27, 30, 1, 28, 0, 1, 27, 30, 0, 28, 0, 0, 28, 28, 0, 28, 0, 1, 27, 31, 1, 28, 0, 2, 27, 31, 0, 28, 0, 3, 27, 31, 1, 28, 0, 4, 28, 30, 1, 29, 0, 3, 28, 30, 0, 29, 0, 2, 30, 27, 1, 29, 0, 1, 30, 27, 0, 29, 0, 0, 28, 31, 0, 29, 0, 1, 29, 30, 1, 29, 0, 2, 29, 30, 0, 29, 0, 3, 29, 30, 1, 29, 0, 4, 29, 31, 1, 30, 0, 3, 29, 31, 0, 30, 0, 2, 29, 31, 1, 30, 0, 1, 30, 30, 1, 30, 0, 0, 30, 30, 0, 30, 0, 1, 30, 31, 1, 30, 0, 2, 30, 31, 0, 30, 0, 3, 30, 31, 1, 30, 0, 4, 31, 30, 1, 31, 0, 3, 31, 30, 0, 31, 0, 2, 31, 30, 1, 31, 0, 1, 31, 31, 1, 31, 0, 0, 31, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 2, 0, 1, 0, 1, 0, 3, 1, 1, 0, 0, 0, 3, 0, 1, 0, 1, 0, 4, 0, 1, 0, 2, 0, 5, 0, 2, 0, 1, 0, 6, 1, 2, 0, 0, 0, 6, 0, 2, 0, 1, 0, 7, 0, 2, 0, 2, 0, 8, 0, 3, 0, 1, 0, 9, 1, 3, 0, 0, 0, 9, 0, 3, 0, 1, 0, 10, 0, 3, 0, 2, 0, 11, 0, 4, 0, 1, 0, 12, 1, 4, 0, 0, 0, 12, 0, 4, 0, 1, 0, 13, 0, 4, 0, 2, 0, 14, 0, 5, 0, 1, 0, 15, 1, 5, 0, 0, 0, 15, 0, 5, 0, 1, 0, 16, 0, 5, 0, 2, 1, 15, 0, 6, 0, 1, 0, 17, 0, 6, 0, 0, 0, 18, 0, 6, 0, 1, 0, 19, 0, 6, 0, 2, 3, 14, 0, 7, 0, 1, 0, 20, 0, 7, 0, 0, 0, 21, 0, 7, 0, 1, 0, 22, 0, 7, 0, 2, 4, 15, 0, 8, 0, 1, 0, 23, 0, 8, 0, 0, 0, 24, 0, 8, 0, 1, 0, 25, 0, 8, 0, 2, 6, 14, 0, 9, 0, 1, 0, 26, 0, 9, 0, 0, 0, 27, 0, 9, 0, 1, 0, 28, 0, 9, 0, 2, 7, 15, 0, 10, 0, 1, 0, 29, 0, 10, 0, 0, 0, 30, 0, 10, 0, 1, 0, 31, 0, 10, 0, 2, 9, 14, 0, 11, 0, 1, 0, 32, 0, 11, 0, 0, 0, 33, 0, 11, 0, 1, 2, 30, 0, 11, 0, 2, 0, 34, 0, 12, 0, 1, 0, 35, 0, 12, 0, 0, 0, 36, 0, 12, 0, 1, 3, 31, 0, 12, 0, 2, 0, 37, 0, 13, 0, 1, 0, 38, 0, 13, 0, 0, 0, 39, 0, 13, 0, 1, 5, 30, 0, 13, 0, 2, 0, 40, 0, 14, 0, 1, 0, 41, 0, 14, 0, 0, 0, 42, 0, 14, 0, 1, 6, 31, 0, 14, 0, 2, 0, 43, 0, 15, 0, 1, 0, 44, 0, 15, 0, 0, 0, 45, 0, 15, 0, 1, 8, 30, 0, 15, 0, 2, 0, 46, 0, 16, 0, 2, 0, 47, 0, 16, 0, 1, 1, 46, 0, 16, 0, 0, 0, 48, 0, 16, 0, 1, 0, 49, 0, 16, 0, 2, 0, 50, 0, 17, 0, 1, 2, 47, 0, 17, 0, 0, 0, 51, 0, 17, 0, 1, 0, 52, 0, 17, 0, 2, 0, 53, 0, 18, 0, 1, 4, 46, 0, 18, 0, 0, 0, 54, 0, 18, 0, 1, 0, 55, 0, 18, 0, 2, 0, 56, 0, 19, 0, 1, 5, 47, 0, 19, 0, 0, 0, 57, 0, 19, 0, 1, 0, 58, 0, 19, 0, 2, 0, 59, 0, 20, 0, 1, 7, 46, 0, 20, 0, 0, 0, 60, 0, 20, 0, 1, 0, 61, 0, 20, 0, 2, 0, 62, 0, 21, 0, 1, 8, 47, 0, 21, 0, 0, 0, 63, 0, 21, 0, 1, 1, 62, 0, 21, 0, 2, 1, 63, 0, 22, 0, 1, 10, 46, 0, 22, 0, 0, 2, 62, 0, 22, 0, 1, 2, 63, 0, 22, 0, 2, 3, 62, 0, 23, 0, 1, 11, 47, 0, 23, 0, 0, 3, 63, 0, 23, 0, 1, 4, 62, 0, 23, 0, 2, 4, 63, 0, 24, 0, 1, 13, 46, 0, 24, 0, 0, 5, 62, 0, 24, 0, 1, 5, 63, 0, 24, 0, 2, 6, 62, 0, 25, 0, 1, 14, 47, 0, 25, 0, 0, 6, 63, 0, 25, 0, 1, 7, 62, 0, 25, 0, 2, 7, 63, 0, 26, 0, 1, 16, 45, 0, 26, 0, 0, 8, 62, 0, 26, 0, 1, 8, 63, 0, 26, 0, 2, 9, 62, 0, 27, 0, 1, 16, 48, 0, 27, 0, 0, 9, 63, 0, 27, 0, 1, 10, 62, 0, 27, 0, 2, 10, 63, 0, 28, 0, 1, 16, 51, 0, 28, 0, 0, 11, 62, 0, 28, 0, 1, 11, 63, 0, 28, 0, 2, 12, 62, 0, 29, 0, 1, 16, 54, 0, 29, 0, 0, 12, 63, 0, 29, 0, 1, 13, 62, 0, 29, 0, 2, 13, 63, 0, 30, 0, 1, 16, 57, 0, 30, 0, 0, 14, 62, 0, 30, 0, 1, 14, 63, 0, 30, 0, 2, 15, 62, 0, 31, 0, 1, 16, 60, 0, 31, 0, 0, 15, 63, 0, 31, 0, 1, 24, 46, 0, 31, 0, 2, 16, 62, 0, 32, 0, 2, 16, 63, 0, 32, 0, 1, 17, 62, 0, 32, 0, 0, 25, 47, 0, 32, 0, 1, 17, 63, 0, 32, 0, 2, 18, 62, 0, 33, 0, 1, 18, 63, 0, 33, 0, 0, 27, 46, 0, 33, 0, 1, 19, 62, 0, 33, 0, 2, 19, 63, 0, 34, 0, 1, 20, 62, 0, 34, 0, 0, 28, 47, 0, 34, 0, 1, 20, 63, 0, 34, 0, 2, 21, 62, 0, 35, 0, 1, 21, 63, 0, 35, 0, 0, 30, 46, 0, 35, 0, 1, 22, 62, 0, 35, 0, 2, 22, 63, 0, 36, 0, 1, 23, 62, 0, 36, 0, 0, 31, 47, 0, 36, 0, 1, 23, 63, 0, 36, 0, 2, 24, 62, 0, 37, 0, 1, 24, 63, 0, 37, 0, 0, 32, 47, 0, 37, 0, 1, 25, 62, 0, 37, 0, 2, 25, 63, 0, 38, 0, 1, 26, 62, 0, 38, 0, 0, 32, 50, 0, 38, 0, 1, 26, 63, 0, 38, 0, 2, 27, 62, 0, 39, 0, 1, 27, 63, 0, 39, 0, 0, 32, 53, 0, 39, 0, 1, 28, 62, 0, 39, 0, 2, 28, 63, 0, 40, 0, 1, 29, 62, 0, 40, 0, 0, 32, 56, 0, 40, 0, 1, 29, 63, 0, 40, 0, 2, 30, 62, 0, 41, 0, 1, 30, 63, 0, 41, 0, 0, 32, 59, 0, 41, 0, 1, 31, 62, 0, 41, 0, 2, 31, 63, 0, 42, 0, 1, 32, 61, 0, 42, 0, 0, 32, 62, 0, 42, 0, 1, 32, 63, 0, 42, 0, 2, 41, 46, 0, 43, 0, 1, 33, 62, 0, 43, 0, 0, 33, 63, 0, 43, 0, 1, 34, 62, 0, 43, 0, 2, 42, 47, 0, 44, 0, 1, 34, 63, 0, 44, 0, 0, 35, 62, 0, 44, 0, 1, 35, 63, 0, 44, 0, 2, 44, 46, 0, 45, 0, 1, 36, 62, 0, 45, 0, 0, 36, 63, 0, 45, 0, 1, 37, 62, 0, 45, 0, 2, 45, 47, 0, 46, 0, 1, 37, 63, 0, 46, 0, 0, 38, 62, 0, 46, 0, 1, 38, 63, 0, 46, 0, 2, 47, 46, 0, 47, 0, 1, 39, 62, 0, 47, 0, 0, 39, 63, 0, 47, 0, 1, 40, 62, 0, 47, 0, 2, 48, 46, 0, 48, 0, 2, 40, 63, 0, 48, 0, 1, 41, 62, 0, 48, 0, 0, 41, 63, 0, 48, 0, 1, 48, 49, 0, 48, 0, 2, 42, 62, 0, 49, 0, 1, 42, 63, 0, 49, 0, 0, 43, 62, 0, 49, 0, 1, 48, 52, 0, 49, 0, 2, 43, 63, 0, 50, 0, 1, 44, 62, 0, 50, 0, 0, 44, 63, 0, 50, 0, 1, 48, 55, 0, 50, 0, 2, 45, 62, 0, 51, 0, 1, 45, 63, 0, 51, 0, 0, 46, 62, 0, 51, 0, 1, 48, 58, 0, 51, 0, 2, 46, 63, 0, 52, 0, 1, 47, 62, 0, 52, 0, 0, 47, 63, 0, 52, 0, 1, 48, 61, 0, 52, 0, 2, 48, 62, 0, 53, 0, 1, 56, 47, 0, 53, 0, 0, 48, 63, 0, 53, 0, 1, 49, 62, 0, 53, 0, 2, 49, 63, 0, 54, 0, 1, 58, 46, 0, 54, 0, 0, 50, 62, 0, 54, 0, 1, 50, 63, 0, 54, 0, 2, 51, 62, 0, 55, 0, 1, 59, 47, 0, 55, 0, 0, 51, 63, 0, 55, 0, 1, 52, 62, 0, 55, 0, 2, 52, 63, 0, 56, 0, 1, 61, 46, 0, 56, 0, 0, 53, 62, 0, 56, 0, 1, 53, 63, 0, 56, 0, 2, 54, 62, 0, 57, 0, 1, 62, 47, 0, 57, 0, 0, 54, 63, 0, 57, 0, 1, 55, 62, 0, 57, 0, 2, 55, 63, 0, 58, 0, 1, 56, 62, 1, 58, 0, 0, 56, 62, 0, 58, 0, 1, 56, 63, 0, 58, 0, 2, 57, 62, 0, 59, 0, 1, 57, 63, 1, 59, 0, 0, 57, 63, 0, 59, 0, 1, 58, 62, 0, 59, 0, 2, 58, 63, 0, 60, 0, 1, 59, 62, 1, 60, 0, 0, 59, 62, 0, 60, 0, 1, 59, 63, 0, 60, 0, 2, 60, 62, 0, 61, 0, 1, 60, 63, 1, 61, 0, 0, 60, 63, 0, 61, 0, 1, 61, 62, 0, 61, 0, 2, 61, 63, 0, 62, 0, 1, 62, 62, 1, 62, 0, 0, 62, 62, 0, 62, 0, 1, 62, 63, 0, 62, 0, 2, 63, 62, 0, 63, 0, 1, 63, 63, 1, 63, 0, 0, 63, 63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 2, 0, 0, 2, 0, 0, 3, 0, 1, 1, 0, 0, 4, 0, 1, 0, 1, 0, 3, 0, 1, 1, 1, 0, 2, 0, 1, 2, 1, 0, 1, 0, 2, 1, 1, 0, 0, 0, 2, 0, 1, 0, 1, 0, 2, 1, 1, 0, 2, 0, 2, 2, 1, 0, 3, 0, 3, 1, 1, 0, 4, 0, 3, 0, 2, 0, 3, 0, 3, 1, 2, 0, 2, 0, 3, 2, 2, 0, 1, 0, 4, 1, 2, 0, 0, 0, 4, 0, 2, 0, 1, 0, 4, 1, 2, 0, 2, 0, 4, 2, 2, 0, 3, 0, 5, 1, 2, 0, 4, 0, 5, 0, 3, 0, 3, 0, 5, 1, 3, 0, 2, 0, 5, 2, 3, 0, 1, 0, 6, 1, 3, 0, 0, 0, 6, 0, 3, 0, 1, 0, 6, 1, 3, 0, 2, 0, 6, 2, 3, 0, 3, 0, 7, 1, 3, 0, 4, 0, 7, 0, 4, 0, 4, 0, 7, 1, 4, 0, 3, 0, 7, 2, 4, 0, 2, 1, 7, 1, 4, 0, 1, 1, 7, 0, 4, 0, 0, 0, 8, 0, 4, 0, 1, 0, 8, 1, 4, 0, 2, 2, 7, 1, 4, 0, 3, 2, 7, 0, 4, 0, 4, 0, 9, 0, 5, 0, 3, 0, 9, 1, 5, 0, 2, 3, 7, 1, 5, 0, 1, 3, 7, 0, 5, 0, 0, 0, 10, 0, 5, 0, 1, 0, 10, 1, 5, 0, 2, 0, 10, 2, 5, 0, 3, 0, 11, 1, 5, 0, 4, 0, 11, 0, 6, 0, 3, 0, 11, 1, 6, 0, 2, 0, 11, 2, 6, 0, 1, 0, 12, 1, 6, 0, 0, 0, 12, 0, 6, 0, 1, 0, 12, 1, 6, 0, 2, 0, 12, 2, 6, 0, 3, 0, 13, 1, 6, 0, 4, 0, 13, 0, 7, 0, 3, 0, 13, 1, 7, 0, 2, 0, 13, 2, 7, 0, 1, 0, 14, 1, 7, 0, 0, 0, 14, 0, 7, 0, 1, 0, 14, 1, 7, 0, 2, 0, 14, 2, 7, 0, 3, 0, 15, 1, 7, 0, 4, 0, 15, 0, 8, 0, 4, 0, 15, 1, 8, 0, 3, 0, 15, 2, 8, 0, 2, 1, 15, 1, 8, 0, 1, 1, 15, 0, 8, 0, 0, 0, 16, 0, 8, 0, 1, 0, 16, 1, 8, 0, 2, 2, 15, 1, 8, 0, 3, 2, 15, 0, 8, 0, 4, 0, 17, 0, 9, 0, 3, 0, 17, 1, 9, 0, 2, 3, 15, 1, 9, 0, 1, 3, 15, 0, 9, 0, 0, 0, 18, 0, 9, 0, 1, 0, 18, 1, 9, 0, 2, 0, 18, 2, 9, 0, 3, 0, 19, 1, 9, 0, 4, 0, 19, 0, 10, 0, 3, 0, 19, 1, 10, 0, 2, 0, 19, 2, 10, 0, 1, 0, 20, 1, 10, 0, 0, 0, 20, 0, 10, 0, 1, 0, 20, 1, 10, 0, 2, 0, 20, 2, 10, 0, 3, 0, 21, 1, 10, 0, 4, 0, 21, 0, 11, 0, 3, 0, 21, 1, 11, 0, 2, 0, 21, 2, 11, 0, 1, 0, 22, 1, 11, 0, 0, 0, 22, 0, 11, 0, 1, 0, 22, 1, 11, 0, 2, 0, 22, 2, 11, 0, 3, 0, 23, 1, 11, 0, 4, 0, 23, 0, 12, 0, 4, 0, 23, 1, 12, 0, 3, 0, 23, 2, 12, 0, 2, 1, 23, 1, 12, 0, 1, 1, 23, 0, 12, 0, 0, 0, 24, 0, 12, 0, 1, 0, 24, 1, 12, 0, 2, 2, 23, 1, 12, 0, 3, 2, 23, 0, 12, 0, 4, 0, 25, 0, 13, 0, 3, 0, 25, 1, 13, 0, 2, 3, 23, 1, 13, 0, 1, 3, 23, 0, 13, 0, 0, 0, 26, 0, 13, 0, 1, 0, 26, 1, 13, 0, 2, 0, 26, 2, 13, 0, 3, 0, 27, 1, 13, 0, 4, 0, 27, 0, 14, 0, 3, 0, 27, 1, 14, 0, 2, 0, 27, 2, 14, 0, 1, 0, 28, 1, 14, 0, 0, 0, 28, 0, 14, 0, 1, 0, 28, 1, 14, 0, 2, 0, 28, 2, 14, 0, 3, 0, 29, 1, 14, 0, 4, 0, 29, 0, 15, 0, 3, 0, 29, 1, 15, 0, 2, 0, 29, 2, 15, 0, 1, 0, 30, 1, 15, 0, 0, 0, 30, 0, 15, 0, 1, 0, 30, 1, 15, 0, 2, 0, 30, 2, 15, 0, 3, 0, 31, 1, 15, 0, 4, 0, 31, 0, 16, 0, 4, 0, 31, 1, 16, 0, 3, 0, 31, 2, 16, 0, 2, 1, 31, 1, 16, 0, 1, 1, 31, 0, 16, 0, 0, 4, 28, 0, 16, 0, 1, 4, 28, 1, 16, 0, 2, 2, 31, 1, 16, 0, 3, 2, 31, 0, 16, 0, 4, 4, 29, 0, 17, 0, 3, 4, 29, 1, 17, 0, 2, 3, 31, 1, 17, 0, 1, 3, 31, 0, 17, 0, 0, 4, 30, 0, 17, 0, 1, 4, 30, 1, 17, 0, 2, 4, 30, 2, 17, 0, 3, 4, 31, 1, 17, 0, 4, 4, 31, 0, 18, 0, 3, 4, 31, 1, 18, 0, 2, 4, 31, 2, 18, 0, 1, 5, 31, 1, 18, 0, 0, 5, 31, 0, 18, 0, 1, 5, 31, 1, 18, 0, 2, 5, 31, 2, 18, 0, 3, 6, 31, 1, 18, 0, 4, 6, 31, 0, 19, 0, 3, 6, 31, 1, 19, 0, 2, 6, 31, 2, 19, 0, 1, 7, 31, 1, 19, 0, 0, 7, 31, 0, 19, 0, 1, 7, 31, 1, 19, 0, 2, 7, 31, 2, 19, 0, 3, 8, 31, 1, 19, 0, 4, 8, 31, 0, 20, 0, 4, 8, 31, 1, 20, 0, 3, 8, 31, 2, 20, 0, 2, 9, 31, 1, 20, 0, 1, 9, 31, 0, 20, 0, 0, 12, 28, 0, 20, 0, 1, 12, 28, 1, 20, 0, 2, 10, 31, 1, 20, 0, 3, 10, 31, 0, 20, 0, 4, 12, 29, 0, 21, 0, 3, 12, 29, 1, 21, 0, 2, 11, 31, 1, 21, 0, 1, 11, 31, 0, 21, 0, 0, 12, 30, 0, 21, 0, 1, 12, 30, 1, 21, 0, 2, 12, 30, 2, 21, 0, 3, 12, 31, 1, 21, 0, 4, 12, 31, 0, 22, 0, 3, 12, 31, 1, 22, 0, 2, 12, 31, 2, 22, 0, 1, 13, 31, 1, 22, 0, 0, 13, 31, 0, 22, 0, 1, 13, 31, 1, 22, 0, 2, 13, 31, 2, 22, 0, 3, 14, 31, 1, 22, 0, 4, 14, 31, 0, 23, 0, 3, 14, 31, 1, 23, 0, 2, 14, 31, 2, 23, 0, 1, 15, 31, 1, 23, 0, 0, 15, 31, 0, 23, 0, 1, 15, 31, 1, 23, 0, 2, 15, 31, 2, 23, 0, 3, 16, 31, 1, 23, 0, 4, 16, 31, 0, 24, 0, 4, 16, 31, 1, 24, 0, 3, 16, 31, 2, 24, 0, 2, 17, 31, 1, 24, 0, 1, 17, 31, 0, 24, 0, 0, 20, 28, 0, 24, 0, 1, 20, 28, 1, 24, 0, 2, 18, 31, 1, 24, 0, 3, 18, 31, 0, 24, 0, 4, 20, 29, 0, 25, 0, 3, 20, 29, 1, 25, 0, 2, 19, 31, 1, 25, 0, 1, 19, 31, 0, 25, 0, 0, 20, 30, 0, 25, 0, 1, 20, 30, 1, 25, 0, 2, 20, 30, 2, 25, 0, 3, 20, 31, 1, 25, 0, 4, 20, 31, 0, 26, 0, 3, 20, 31, 1, 26, 0, 2, 20, 31, 2, 26, 0, 1, 21, 31, 1, 26, 0, 0, 21, 31, 0, 26, 0, 1, 21, 31, 1, 26, 0, 2, 21, 31, 2, 26, 0, 3, 22, 31, 1, 26, 0, 4, 22, 31, 0, 27, 0, 3, 22, 31, 1, 27, 0, 2, 22, 31, 2, 27, 0, 1, 23, 31, 1, 27, 0, 0, 23, 31, 0, 27, 0, 1, 23, 31, 1, 27, 0, 2, 23, 31, 2, 27, 0, 3, 24, 31, 1, 27, 0, 4, 24, 31, 0, 28, 0, 4, 24, 31, 1, 28, 0, 3, 24, 31, 2, 28, 0, 2, 25, 31, 1, 28, 0, 1, 25, 31, 0, 28, 0, 0, 28, 28, 0, 28, 0, 1, 28, 28, 1, 28, 0, 2, 26, 31, 1, 28, 0, 3, 26, 31, 0, 28, 0, 4, 28, 29, 0, 29, 0, 3, 28, 29, 1, 29, 0, 2, 27, 31, 1, 29, 0, 1, 27, 31, 0, 29, 0, 0, 28, 30, 0, 29, 0, 1, 28, 30, 1, 29, 0, 2, 28, 30, 2, 29, 0, 3, 28, 31, 1, 29, 0, 4, 28, 31, 0, 30, 0, 3, 28, 31, 1, 30, 0, 2, 28, 31, 2, 30, 0, 1, 29, 31, 1, 30, 0, 0, 29, 31, 0, 30, 0, 1, 29, 31, 1, 30, 0, 2, 29, 31, 2, 30, 0, 3, 30, 31, 1, 30, 0, 4, 30, 31, 0, 31, 0, 3, 30, 31, 1, 31, 0, 2, 30, 31, 2, 31, 0, 1, 31, 31, 1, 31, 0, 0, 31, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 1, 1, 0, 0, 0, 2, 0, 1, 0, 1, 0, 3, 1, 1, 0, 2, 0, 3, 0, 2, 0, 1, 0, 4, 1, 2, 0, 0, 0, 4, 0, 2, 0, 1, 0, 5, 1, 2, 0, 2, 0, 5, 0, 3, 0, 1, 0, 6, 1, 3, 0, 0, 0, 6, 0, 3, 0, 1, 0, 7, 1, 3, 0, 2, 0, 7, 0, 4, 0, 1, 0, 8, 1, 4, 0, 0, 0, 8, 0, 4, 0, 1, 0, 9, 1, 4, 0, 2, 0, 9, 0, 5, 0, 1, 0, 10, 1, 5, 0, 0, 0, 10, 0, 5, 0, 1, 0, 11, 1, 5, 0, 2, 0, 11, 0, 6, 0, 1, 0, 12, 1, 6, 0, 0, 0, 12, 0, 6, 0, 1, 0, 13, 1, 6, 0, 2, 0, 13, 0, 7, 0, 1, 0, 14, 1, 7, 0, 0, 0, 14, 0, 7, 0, 1, 0, 15, 1, 7, 0, 2, 0, 15, 0, 8, 0, 1, 0, 16, 1, 8, 0, 0, 0, 16, 0, 8, 0, 1, 0, 17, 1, 8, 0, 2, 0, 17, 0, 9, 0, 1, 0, 18, 1, 9, 0, 0, 0, 18, 0, 9, 0, 1, 0, 19, 1, 9, 0, 2, 0, 19, 0, 10, 0, 1, 0, 20, 1, 10, 0, 0, 0, 20, 0, 10, 0, 1, 0, 21, 1, 10, 0, 2, 0, 21, 0, 11, 0, 1, 0, 22, 1, 11, 0, 0, 0, 22, 0, 11, 0, 1, 0, 23, 1, 11, 0, 2, 0, 23, 0, 12, 0, 1, 0, 24, 1, 12, 0, 0, 0, 24, 0, 12, 0, 1, 0, 25, 1, 12, 0, 2, 0, 25, 0, 13, 0, 1, 0, 26, 1, 13, 0, 0, 0, 26, 0, 13, 0, 1, 0, 27, 1, 13, 0, 2, 0, 27, 0, 14, 0, 1, 0, 28, 1, 14, 0, 0, 0, 28, 0, 14, 0, 1, 0, 29, 1, 14, 0, 2, 0, 29, 0, 15, 0, 1, 0, 30, 1, 15, 0, 0, 0, 30, 0, 15, 0, 1, 0, 31, 1, 15, 0, 2, 0, 31, 0, 16, 0, 2, 1, 31, 1, 16, 0, 1, 1, 31, 0, 16, 0, 0, 0, 32, 0, 16, 0, 1, 2, 31, 0, 16, 0, 2, 0, 33, 0, 17, 0, 1, 3, 31, 0, 17, 0, 0, 0, 34, 0, 17, 0, 1, 4, 31, 0, 17, 0, 2, 0, 35, 0, 18, 0, 1, 5, 31, 0, 18, 0, 0, 0, 36, 0, 18, 0, 1, 6, 31, 0, 18, 0, 2, 0, 37, 0, 19, 0, 1, 7, 31, 0, 19, 0, 0, 0, 38, 0, 19, 0, 1, 8, 31, 0, 19, 0, 2, 0, 39, 0, 20, 0, 1, 9, 31, 0, 20, 0, 0, 0, 40, 0, 20, 0, 1, 10, 31, 0, 20, 0, 2, 0, 41, 0, 21, 0, 1, 11, 31, 0, 21, 0, 0, 0, 42, 0, 21, 0, 1, 12, 31, 0, 21, 0, 2, 0, 43, 0, 22, 0, 1, 13, 31, 0, 22, 0, 0, 0, 44, 0, 22, 0, 1, 14, 31, 0, 22, 0, 2, 0, 45, 0, 23, 0, 1, 15, 31, 0, 23, 0, 0, 0, 46, 0, 23, 0, 1, 0, 47, 1, 23, 0, 2, 0, 47, 0, 24, 0, 1, 0, 48, 1, 24, 0, 0, 0, 48, 0, 24, 0, 1, 0, 49, 1, 24, 0, 2, 0, 49, 0, 25, 0, 1, 0, 50, 1, 25, 0, 0, 0, 50, 0, 25, 0, 1, 0, 51, 1, 25, 0, 2, 0, 51, 0, 26, 0, 1, 0, 52, 1, 26, 0, 0, 0, 52, 0, 26, 0, 1, 0, 53, 1, 26, 0, 2, 0, 53, 0, 27, 0, 1, 0, 54, 1, 27, 0, 0, 0, 54, 0, 27, 0, 1, 0, 55, 1, 27, 0, 2, 0, 55, 0, 28, 0, 1, 0, 56, 1, 28, 0, 0, 0, 56, 0, 28, 0, 1, 0, 57, 1, 28, 0, 2, 0, 57, 0, 29, 0, 1, 0, 58, 1, 29, 0, 0, 0, 58, 0, 29, 0, 1, 0, 59, 1, 29, 0, 2, 0, 59, 0, 30, 0, 1, 0, 60, 1, 30, 0, 0, 0, 60, 0, 30, 0, 1, 0, 61, 1, 30, 0, 2, 0, 61, 0, 31, 0, 1, 0, 62, 1, 31, 0, 0, 0, 62, 0, 31, 0, 1, 0, 63, 1, 31, 0, 2, 0, 63, 0, 32, 0, 2, 1, 63, 1, 32, 0, 1, 1, 63, 0, 32, 0, 0, 16, 48, 0, 32, 0, 1, 2, 63, 0, 32, 0, 2, 16, 49, 0, 33, 0, 1, 3, 63, 0, 33, 0, 0, 16, 50, 0, 33, 0, 1, 4, 63, 0, 33, 0, 2, 16, 51, 0, 34, 0, 1, 5, 63, 0, 34, 0, 0, 16, 52, 0, 34, 0, 1, 6, 63, 0, 34, 0, 2, 16, 53, 0, 35, 0, 1, 7, 63, 0, 35, 0, 0, 16, 54, 0, 35, 0, 1, 8, 63, 0, 35, 0, 2, 16, 55, 0, 36, 0, 1, 9, 63, 0, 36, 0, 0, 16, 56, 0, 36, 0, 1, 10, 63, 0, 36, 0, 2, 16, 57, 0, 37, 0, 1, 11, 63, 0, 37, 0, 0, 16, 58, 0, 37, 0, 1, 12, 63, 0, 37, 0, 2, 16, 59, 0, 38, 0, 1, 13, 63, 0, 38, 0, 0, 16, 60, 0, 38, 0, 1, 14, 63, 0, 38, 0, 2, 16, 61, 0, 39, 0, 1, 15, 63, 0, 39, 0, 0, 16, 62, 0, 39, 0, 1, 16, 63, 1, 39, 0, 2, 16, 63, 0, 40, 0, 1, 17, 63, 1, 40, 0, 0, 17, 63, 0, 40, 0, 1, 18, 63, 1, 40, 0, 2, 18, 63, 0, 41, 0, 1, 19, 63, 1, 41, 0, 0, 19, 63, 0, 41, 0, 1, 20, 63, 1, 41, 0, 2, 20, 63, 0, 42, 0, 1, 21, 63, 1, 42, 0, 0, 21, 63, 0, 42, 0, 1, 22, 63, 1, 42, 0, 2, 22, 63, 0, 43, 0, 1, 23, 63, 1, 43, 0, 0, 23, 63, 0, 43, 0, 1, 24, 63, 1, 43, 0, 2, 24, 63, 0, 44, 0, 1, 25, 63, 1, 44, 0, 0, 25, 63, 0, 44, 0, 1, 26, 63, 1, 44, 0, 2, 26, 63, 0, 45, 0, 1, 27, 63, 1, 45, 0, 0, 27, 63, 0, 45, 0, 1, 28, 63, 1, 45, 0, 2, 28, 63, 0, 46, 0, 1, 29, 63, 1, 46, 0, 0, 29, 63, 0, 46, 0, 1, 30, 63, 1, 46, 0, 2, 30, 63, 0, 47, 0, 1, 31, 63, 1, 47, 0, 0, 31, 63, 0, 47, 0, 1, 32, 63, 1, 47, 0, 2, 32, 63, 0, 48, 0, 2, 33, 63, 1, 48, 0, 1, 33, 63, 0, 48, 0, 0, 48, 48, 0, 48, 0, 1, 34, 63, 0, 48, 0, 2, 48, 49, 0, 49, 0, 1, 35, 63, 0, 49, 0, 0, 48, 50, 0, 49, 0, 1, 36, 63, 0, 49, 0, 2, 48, 51, 0, 50, 0, 1, 37, 63, 0, 50, 0, 0, 48, 52, 0, 50, 0, 1, 38, 63, 0, 50, 0, 2, 48, 53, 0, 51, 0, 1, 39, 63, 0, 51, 0, 0, 48, 54, 0, 51, 0, 1, 40, 63, 0, 51, 0, 2, 48, 55, 0, 52, 0, 1, 41, 63, 0, 52, 0, 0, 48, 56, 0, 52, 0, 1, 42, 63, 0, 52, 0, 2, 48, 57, 0, 53, 0, 1, 43, 63, 0, 53, 0, 0, 48, 58, 0, 53, 0, 1, 44, 63, 0, 53, 0, 2, 48, 59, 0, 54, 0, 1, 45, 63, 0, 54, 0, 0, 48, 60, 0, 54, 0, 1, 46, 63, 0, 54, 0, 2, 48, 61, 0, 55, 0, 1, 47, 63, 0, 55, 0, 0, 48, 62, 0, 55, 0, 1, 48, 63, 1, 55, 0, 2, 48, 63, 0, 56, 0, 1, 49, 63, 1, 56, 0, 0, 49, 63, 0, 56, 0, 1, 50, 63, 1, 56, 0, 2, 50, 63, 0, 57, 0, 1, 51, 63, 1, 57, 0, 0, 51, 63, 0, 57, 0, 1, 52, 63, 1, 57, 0, 2, 52, 63, 0, 58, 0, 1, 53, 63, 1, 58, 0, 0, 53, 63, 0, 58, 0, 1, 54, 63, 1, 58, 0, 2, 54, 63, 0, 59, 0, 1, 55, 63, 1, 59, 0, 0, 55, 63, 0, 59, 0, 1, 56, 63, 1, 59, 0, 2, 56, 63, 0, 60, 0, 1, 57, 63, 1, 60, 0, 0, 57, 63, 0, 60, 0, 1, 58, 63, 1, 60, 0, 2, 58, 63, 0, 61, 0, 1, 59, 63, 1, 61, 0, 0, 59, 63, 0, 61, 0, 1, 60, 63, 1, 61, 0, 2, 60, 63, 0, 62, 0, 1, 61, 63, 1, 62, 0, 0, 61, 63, 0, 62, 0, 1, 62, 63, 1, 62, 0, 2, 62, 63, 0, 63, 0, 1, 63, 63, 1, 63, 0, 0, 63, 63, 0, 78, 54, 115, 113, 117, 105, 115, 104, 49, 53, 83, 105, 110, 103, 108, 101, 67, 111, 108, 111, 117, 114, 70, 105, 116, 69, 0, 78, 49, 48, 95, 95, 99, 120, 120, 97, 98, 105, 118, 49, 49, 54, 95, 95, 115, 104, 105, 109, 95, 116, 121, 112, 101, 95, 105, 110, 102, 111, 69, 0, 83, 116, 57, 116, 121, 112, 101, 95, 105, 110, 102, 111, 0, 78, 49, 48, 95, 95, 99, 120, 120, 97, 98, 105, 118, 49, 50, 48, 95, 95, 115, 105, 95, 99, 108, 97, 115, 115, 95, 116, 121, 112, 101, 95, 105, 110, 102, 111, 69, 0, 78, 49, 48, 95, 95, 99, 120, 120, 97, 98, 105, 118, 49, 49, 55, 95, 95, 99, 108, 97, 115, 115, 95, 116, 121, 112, 101, 95, 105, 110, 102, 111, 69, 0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
    var tempDoublePtr = STATICTOP;
    STATICTOP += 16;
    function ___cxa_pure_virtual() {
      ABORT = true;
      throw "Pure virtual function called!";
    }
    function ___setErrNo(value) {
      if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
      return value;
    }
    function __ZSt18uncaught_exceptionv() {
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
    var EXCEPTIONS = { last: 0, caught: [], infos: {}, deAdjust: (function(adjusted) {
      if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted;
      for (var ptr in EXCEPTIONS.infos) {
        var info = EXCEPTIONS.infos[ptr];
        if (info.adjusted === adjusted) {
          return ptr;
        }
      }
      return adjusted;
    }), addRef: (function(ptr) {
      if (!ptr) return;
      var info = EXCEPTIONS.infos[ptr];
      info.refcount++;
    }), decRef: (function(ptr) {
      if (!ptr) return;
      var info = EXCEPTIONS.infos[ptr];
      assert(info.refcount > 0);
      info.refcount--;
      if (info.refcount === 0 && !info.rethrown) {
        if (info.destructor) {
          Module["dynCall_vi"](info.destructor, ptr);
        }
        delete EXCEPTIONS.infos[ptr];
        ___cxa_free_exception(ptr);
      }
    }), clearRef: (function(ptr) {
      if (!ptr) return;
      var info = EXCEPTIONS.infos[ptr];
      info.refcount = 0;
    }) };
    function ___resumeException(ptr) {
      if (!EXCEPTIONS.last) {
        EXCEPTIONS.last = ptr;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }
    function ___cxa_find_matching_catch() {
      var thrown = EXCEPTIONS.last;
      if (!thrown) {
        return (Runtime.setTempRet0(0), 0) | 0;
      }
      var info = EXCEPTIONS.infos[thrown];
      var throwntype = info.type;
      if (!throwntype) {
        return (Runtime.setTempRet0(0), thrown) | 0;
      }
      var typeArray = Array.prototype.slice.call(arguments);
      var pointer = Module["___cxa_is_pointer_type"](throwntype);
      if (!___cxa_find_matching_catch.buffer) ___cxa_find_matching_catch.buffer = _malloc(4);
      HEAP32[___cxa_find_matching_catch.buffer >> 2] = thrown;
      thrown = ___cxa_find_matching_catch.buffer;
      for (var i2 = 0; i2 < typeArray.length; i2++) {
        if (typeArray[i2] && Module["___cxa_can_catch"](typeArray[i2], throwntype, thrown)) {
          thrown = HEAP32[thrown >> 2];
          info.adjusted = thrown;
          return (Runtime.setTempRet0(typeArray[i2]), thrown) | 0;
        }
      }
      thrown = HEAP32[thrown >> 2];
      return (Runtime.setTempRet0(throwntype), thrown) | 0;
    }
    function ___gxx_personality_v0() {
    }
    function ___lock() {
    }
    var _llvm_pow_f32 = Math_pow;
    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
      return dest;
    }
    var SYSCALLS = { varargs: 0, get: (function(varargs) {
      SYSCALLS.varargs += 4;
      var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
      return ret;
    }), getStr: (function() {
      var ret = Pointer_stringify(SYSCALLS.get());
      return ret;
    }), get64: (function() {
      var low = SYSCALLS.get(), high = SYSCALLS.get();
      if (low >= 0) assert(high === 0);
      else assert(high === -1);
      return low;
    }), getZero: (function() {
      assert(SYSCALLS.get() === 0);
    }) };
    function ___syscall140(which, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
        var offset = offset_low;
        FS.llseek(stream, offset, whence);
        HEAP32[result >> 2] = stream.position;
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }
    function ___syscall146(which, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.get(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
        var ret = 0;
        if (!___syscall146.buffer) {
          ___syscall146.buffers = [null, [], []];
          ___syscall146.printChar = (function(stream2, curr) {
            var buffer2 = ___syscall146.buffers[stream2];
            assert(buffer2);
            if (curr === 0 || curr === 10) {
              (stream2 === 1 ? Module["print"] : Module["printErr"])(UTF8ArrayToString(buffer2, 0));
              buffer2.length = 0;
            } else {
              buffer2.push(curr);
            }
          });
        }
        for (var i2 = 0; i2 < iovcnt; i2++) {
          var ptr = HEAP32[iov + i2 * 8 >> 2];
          var len = HEAP32[iov + (i2 * 8 + 4) >> 2];
          for (var j = 0; j < len; j++) {
            ___syscall146.printChar(stream, HEAPU8[ptr + j]);
          }
          ret += len;
        }
        return ret;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }
    function ___syscall54(which, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }
    function ___unlock() {
    }
    function ___syscall6(which, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD();
        FS.close(stream);
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }
    __ATEXIT__.push((function() {
      var fflush = Module["_fflush"];
      if (fflush) fflush(0);
      var printChar = ___syscall146.printChar;
      if (!printChar) return;
      var buffers = ___syscall146.buffers;
      if (buffers[1].length) printChar(1, 10);
      if (buffers[2].length) printChar(2, 10);
    }));
    DYNAMICTOP_PTR = allocate(1, "i32", ALLOC_STATIC);
    STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
    STACK_MAX = STACK_BASE + TOTAL_STACK;
    DYNAMIC_BASE = Runtime.alignMemory(STACK_MAX);
    HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
    staticSealed = true;
    function invoke_iiii(index, a1, a2, a3) {
      try {
        return Module["dynCall_iiii"](index, a1, a2, a3);
      } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0);
      }
    }
    function invoke_viiiii(index, a1, a2, a3, a4, a5) {
      try {
        Module["dynCall_viiiii"](index, a1, a2, a3, a4, a5);
      } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0);
      }
    }
    function invoke_vi(index, a1) {
      try {
        Module["dynCall_vi"](index, a1);
      } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0);
      }
    }
    function invoke_vii(index, a1, a2) {
      try {
        Module["dynCall_vii"](index, a1, a2);
      } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0);
      }
    }
    function invoke_ii(index, a1) {
      try {
        return Module["dynCall_ii"](index, a1);
      } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0);
      }
    }
    function invoke_v(index) {
      try {
        Module["dynCall_v"](index);
      } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0);
      }
    }
    function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
      try {
        Module["dynCall_viiiiii"](index, a1, a2, a3, a4, a5, a6);
      } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0);
      }
    }
    function invoke_viiii(index, a1, a2, a3, a4) {
      try {
        Module["dynCall_viiii"](index, a1, a2, a3, a4);
      } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0);
      }
    }
    Module.asmGlobalArg = { "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array, "NaN": NaN, "Infinity": Infinity, "byteLength": byteLength };
    Module.asmLibraryArg = { "abort": abort, "assert": assert, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "invoke_iiii": invoke_iiii, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_v": invoke_v, "invoke_viiiiii": invoke_viiiiii, "invoke_viiii": invoke_viiii, "___lock": ___lock, "___syscall6": ___syscall6, "___setErrNo": ___setErrNo, "___syscall140": ___syscall140, "_llvm_pow_f32": _llvm_pow_f32, "___gxx_personality_v0": ___gxx_personality_v0, "_emscripten_memcpy_big": _emscripten_memcpy_big, "___syscall54": ___syscall54, "___unlock": ___unlock, "___resumeException": ___resumeException, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "___cxa_pure_virtual": ___cxa_pure_virtual, "___syscall146": ___syscall146, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX };
    var asm = (function(global, env, buffer2) {
      "almost asm";
      var a = global.Int8Array;
      var b = new a(buffer2);
      var c = global.Int16Array;
      var d = new c(buffer2);
      var e = global.Int32Array;
      var f = new e(buffer2);
      var g = global.Uint8Array;
      var h = new g(buffer2);
      var i2 = global.Uint16Array;
      var j = new i2(buffer2);
      var k = global.Uint32Array;
      var l = new k(buffer2);
      var m = global.Float32Array;
      var n = new m(buffer2);
      var o = global.Float64Array;
      var p = new o(buffer2);
      var q = global.byteLength;
      var r = env.DYNAMICTOP_PTR | 0;
      var s = env.tempDoublePtr | 0;
      var t = env.ABORT | 0;
      var u = env.STACKTOP | 0;
      var v = env.STACK_MAX | 0;
      var w = 0;
      var x = 0;
      var y = 0;
      var z = 0;
      var A = global.NaN, B = global.Infinity;
      var C = 0, D = 0, E = 0, F = 0, G = 0;
      var H = 0;
      var I = global.Math.floor;
      var J = global.Math.abs;
      var K = global.Math.sqrt;
      var L = global.Math.pow;
      var M = global.Math.cos;
      var N = global.Math.sin;
      var O = global.Math.tan;
      var P = global.Math.acos;
      var Q = global.Math.asin;
      var R = global.Math.atan;
      var S = global.Math.atan2;
      var T = global.Math.exp;
      var U = global.Math.log;
      var V = global.Math.ceil;
      var W = global.Math.imul;
      var X = global.Math.min;
      var Y = global.Math.max;
      var Z = global.Math.clz32;
      var _ = env.abort;
      var $ = env.assert;
      var aa = env.enlargeMemory;
      var ba = env.getTotalMemory;
      var ca = env.abortOnCannotGrowMemory;
      var da = env.invoke_iiii;
      var ea = env.invoke_viiiii;
      var fa = env.invoke_vi;
      var ga = env.invoke_vii;
      var ha = env.invoke_ii;
      var ia = env.invoke_v;
      var ja = env.invoke_viiiiii;
      var ka = env.invoke_viiii;
      var la = env.___lock;
      var ma = env.___syscall6;
      var na = env.___setErrNo;
      var oa = env.___syscall140;
      var pa = env._llvm_pow_f32;
      var qa = env.___gxx_personality_v0;
      var ra = env._emscripten_memcpy_big;
      var sa = env.___syscall54;
      var ta = env.___unlock;
      var ua = env.___resumeException;
      var va = env.__ZSt18uncaught_exceptionv;
      var wa = env.___cxa_pure_virtual;
      var xa = env.___syscall146;
      var ya = env.___cxa_find_matching_catch;
      var za = 0;
      function Aa(newBuffer) {
        if (q(newBuffer) & 16777215 || q(newBuffer) <= 16777215 || q(newBuffer) > 2147483648) return false;
        b = new a(newBuffer);
        d = new c(newBuffer);
        f = new e(newBuffer);
        h = new g(newBuffer);
        j = new i2(newBuffer);
        l = new k(newBuffer);
        n = new m(newBuffer);
        p = new o(newBuffer);
        buffer2 = newBuffer;
        return true;
      }
      function Ja(a2) {
        a2 = a2 | 0;
        var b2 = 0;
        b2 = u;
        u = u + a2 | 0;
        u = u + 15 & -16;
        return b2 | 0;
      }
      function Ka() {
        return u | 0;
      }
      function La(a2) {
        a2 = a2 | 0;
        u = a2;
      }
      function Ma(a2, b2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        u = a2;
        v = b2;
      }
      function Na(a2, b2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        if (!w) {
          w = a2;
          x = b2;
        }
      }
      function Oa(a2) {
        a2 = a2 | 0;
        H = a2;
      }
      function Pa() {
        return H | 0;
      }
      function Qa(a2, c2, d2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, f2 = 0, g2 = 0, i3 = 0;
        e2 = 0;
        do {
          f2 = e2 << 3;
          g2 = ~~(+(h[a2 + (f2 | 3) >> 0] | 0) * 0.05882352963089943 + 0.5);
          i3 = ~~(+(h[a2 + (f2 | 7) >> 0] | 0) * 0.05882352963089943 + 0.5);
          f2 = e2 << 1;
          b[d2 + e2 >> 0] = ((1 << (f2 | 1) & c2 | 0) == 0 | (i3 | 0) < 0 ? 0 : ((i3 | 0) < 15 ? i3 : 15) << 4) | ((1 << f2 & c2 | 0) == 0 | (g2 | 0) < 0 ? 0 : (g2 | 0) < 15 ? g2 : 15);
          e2 = e2 + 1 | 0;
        } while ((e2 | 0) != 8);
        return;
      }
      function Ra(a2, c2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        var d2 = 0;
        d2 = h[c2 >> 0] | 0;
        b[a2 + 3 >> 0] = d2 & 15 | d2 << 4;
        b[a2 + 7 >> 0] = d2 & 240 | d2 >>> 4;
        d2 = h[c2 + 1 >> 0] | 0;
        b[a2 + 11 >> 0] = d2 & 15 | d2 << 4;
        b[a2 + 15 >> 0] = d2 & 240 | d2 >>> 4;
        d2 = h[c2 + 2 >> 0] | 0;
        b[a2 + 19 >> 0] = d2 & 15 | d2 << 4;
        b[a2 + 23 >> 0] = d2 & 240 | d2 >>> 4;
        d2 = h[c2 + 3 >> 0] | 0;
        b[a2 + 27 >> 0] = d2 & 15 | d2 << 4;
        b[a2 + 31 >> 0] = d2 & 240 | d2 >>> 4;
        d2 = h[c2 + 4 >> 0] | 0;
        b[a2 + 35 >> 0] = d2 & 15 | d2 << 4;
        b[a2 + 39 >> 0] = d2 & 240 | d2 >>> 4;
        d2 = h[c2 + 5 >> 0] | 0;
        b[a2 + 43 >> 0] = d2 & 15 | d2 << 4;
        b[a2 + 47 >> 0] = d2 & 240 | d2 >>> 4;
        d2 = h[c2 + 6 >> 0] | 0;
        b[a2 + 51 >> 0] = d2 & 15 | d2 << 4;
        b[a2 + 55 >> 0] = d2 & 240 | d2 >>> 4;
        d2 = h[c2 + 7 >> 0] | 0;
        b[a2 + 59 >> 0] = d2 & 15 | d2 << 4;
        b[a2 + 63 >> 0] = d2 & 240 | d2 >>> 4;
        return;
      }
      function Sa(a2, c2, d2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, f2 = 0, g2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0;
        e2 = u;
        u = u + 64 | 0;
        f2 = e2 + 48 | 0;
        g2 = e2 + 40 | 0;
        i3 = e2 + 32 | 0;
        j2 = e2 + 16 | 0;
        k2 = e2;
        l2 = 0;
        m2 = 255;
        n2 = 0;
        o2 = 0;
        p2 = 255;
        while (1) {
          if (!(1 << n2 & c2)) {
            q2 = l2;
            r2 = o2;
            s2 = m2;
            t2 = p2;
          } else {
            v2 = b[a2 + (n2 << 2 | 3) >> 0] | 0;
            w2 = v2 & 255;
            q2 = v2 << 24 >> 24 != -1 & (w2 | 0) > (l2 | 0) ? w2 : l2;
            r2 = (w2 | 0) > (o2 | 0) ? w2 : o2;
            s2 = v2 << 24 >> 24 != 0 & (w2 | 0) < (m2 | 0) ? w2 : m2;
            t2 = (w2 | 0) < (p2 | 0) ? w2 : p2;
          }
          n2 = n2 + 1 | 0;
          if ((n2 | 0) == 16) break;
          else {
            l2 = q2;
            m2 = s2;
            o2 = r2;
            p2 = t2;
          }
        }
        p2 = (s2 | 0) > (q2 | 0) ? q2 : s2;
        s2 = (t2 | 0) > (r2 | 0) ? r2 : t2;
        t2 = p2 + 5 | 0;
        o2 = (q2 - p2 | 0) < 5 ? (t2 | 0) < 255 ? t2 : 255 : q2;
        q2 = o2 + -5 | 0;
        t2 = (o2 - p2 | 0) < 5 ? (q2 | 0) > 0 ? q2 : 0 : p2;
        p2 = s2 + 7 | 0;
        q2 = (r2 - s2 | 0) < 7 ? (p2 | 0) < 255 ? p2 : 255 : r2;
        r2 = q2 + -7 | 0;
        p2 = t2 & 255;
        b[g2 >> 0] = p2;
        m2 = o2 & 255;
        b[g2 + 1 >> 0] = m2;
        b[g2 + 2 >> 0] = ((t2 << 2) + o2 | 0) / 5 | 0;
        b[g2 + 3 >> 0] = ((t2 * 3 | 0) + (o2 << 1) | 0) / 5 | 0;
        b[g2 + 4 >> 0] = ((t2 << 1) + (o2 * 3 | 0) | 0) / 5 | 0;
        b[g2 + 5 >> 0] = (t2 + (o2 << 2) | 0) / 5 | 0;
        l2 = (q2 - s2 | 0) < 7 ? (r2 | 0) > 0 ? r2 : 0 : s2;
        b[g2 + 6 >> 0] = 0;
        b[g2 + 7 >> 0] = -1;
        s2 = l2 & 255;
        b[i3 >> 0] = s2;
        r2 = q2 & 255;
        b[i3 + 1 >> 0] = r2;
        b[i3 + 2 >> 0] = ((l2 * 6 | 0) + q2 | 0) / 7 | 0;
        b[i3 + 3 >> 0] = ((l2 * 5 | 0) + (q2 << 1) | 0) / 7 | 0;
        b[i3 + 4 >> 0] = ((l2 << 2) + (q2 * 3 | 0) | 0) / 7 | 0;
        b[i3 + 5 >> 0] = ((l2 * 3 | 0) + (q2 << 2) | 0) / 7 | 0;
        b[i3 + 6 >> 0] = ((l2 << 1) + (q2 * 5 | 0) | 0) / 7 | 0;
        b[i3 + 7 >> 0] = (l2 + (q2 * 6 | 0) | 0) / 7 | 0;
        n2 = Ta(a2, c2, g2, j2) | 0;
        if ((n2 | 0) <= (Ta(a2, c2, i3, k2) | 0)) {
          if ((t2 | 0) <= (o2 | 0)) {
            b[d2 >> 0] = p2;
            b[d2 + 1 >> 0] = m2;
            o2 = (h[j2 + 1 >> 0] | 0) << 3 | (h[j2 >> 0] | 0) | (h[j2 + 2 >> 0] | 0) << 6;
            t2 = (h[j2 + 3 >> 0] | 0) << 9 | o2 | (h[j2 + 4 >> 0] | 0) << 12 | (h[j2 + 5 >> 0] | 0) << 15;
            i3 = (h[j2 + 6 >> 0] | 0) << 18 | t2 | (h[j2 + 7 >> 0] | 0) << 21;
            b[d2 + 2 >> 0] = o2;
            b[d2 + 3 >> 0] = t2 >>> 8;
            b[d2 + 4 >> 0] = i3 >>> 16;
            i3 = (h[j2 + 9 >> 0] | 0) << 3 | (h[j2 + 8 >> 0] | 0) | (h[j2 + 10 >> 0] | 0) << 6;
            t2 = (h[j2 + 11 >> 0] | 0) << 9 | i3 | (h[j2 + 12 >> 0] | 0) << 12 | (h[j2 + 13 >> 0] | 0) << 15;
            o2 = (h[j2 + 14 >> 0] | 0) << 18 | t2 | (h[j2 + 15 >> 0] | 0) << 21;
            b[d2 + 5 >> 0] = i3;
            b[d2 + 6 >> 0] = t2 >>> 8;
            b[d2 + 7 >> 0] = o2 >>> 16;
            u = e2;
            return;
          }
          o2 = 0;
          do {
            t2 = b[j2 + o2 >> 0] | 0;
            switch (t2 << 24 >> 24) {
              case 0: {
                x2 = 1;
                break;
              }
              case 1: {
                x2 = 0;
                break;
              }
              default:
                if ((t2 & 255) < 6) x2 = 7 - (t2 & 255) & 255;
                else x2 = t2;
            }
            b[f2 + o2 >> 0] = x2;
            o2 = o2 + 1 | 0;
          } while ((o2 | 0) != 16);
          b[d2 >> 0] = m2;
          b[d2 + 1 >> 0] = p2;
          p2 = (h[f2 + 1 >> 0] | 0) << 3 | (h[f2 >> 0] | 0) | (h[f2 + 2 >> 0] | 0) << 6;
          m2 = (h[f2 + 3 >> 0] | 0) << 9 | p2 | (h[f2 + 4 >> 0] | 0) << 12 | (h[f2 + 5 >> 0] | 0) << 15;
          o2 = (h[f2 + 6 >> 0] | 0) << 18 | m2 | (h[f2 + 7 >> 0] | 0) << 21;
          b[d2 + 2 >> 0] = p2;
          b[d2 + 3 >> 0] = m2 >>> 8;
          b[d2 + 4 >> 0] = o2 >>> 16;
          o2 = (h[f2 + 9 >> 0] | 0) << 3 | (h[f2 + 8 >> 0] | 0) | (h[f2 + 10 >> 0] | 0) << 6;
          m2 = (h[f2 + 11 >> 0] | 0) << 9 | o2 | (h[f2 + 12 >> 0] | 0) << 12 | (h[f2 + 13 >> 0] | 0) << 15;
          p2 = (h[f2 + 14 >> 0] | 0) << 18 | m2 | (h[f2 + 15 >> 0] | 0) << 21;
          b[d2 + 5 >> 0] = o2;
          b[d2 + 6 >> 0] = m2 >>> 8;
          b[d2 + 7 >> 0] = p2 >>> 16;
          u = e2;
          return;
        }
        if ((l2 | 0) < (q2 | 0)) {
          q2 = b[k2 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              y2 = 1;
              break;
            }
            case 1: {
              y2 = 0;
              break;
            }
            default:
              y2 = 9 - (q2 & 255) & 255;
          }
          q2 = b[k2 + 1 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              z2 = 8;
              break;
            }
            case 1: {
              z2 = 0;
              break;
            }
            default:
              z2 = 9 - (q2 & 255) << 3 & 2040;
          }
          q2 = b[k2 + 2 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              A2 = 64;
              break;
            }
            case 1: {
              A2 = 0;
              break;
            }
            default:
              A2 = 9 - (q2 & 255) << 6 & 16320;
          }
          q2 = b[k2 + 3 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              B2 = 512;
              break;
            }
            case 1: {
              B2 = 0;
              break;
            }
            default:
              B2 = 9 - (q2 & 255) << 9 & 130560;
          }
          q2 = b[k2 + 4 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              C2 = 4096;
              break;
            }
            case 1: {
              C2 = 0;
              break;
            }
            default:
              C2 = 9 - (q2 & 255) << 12 & 1044480;
          }
          q2 = b[k2 + 5 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              D2 = 32768;
              break;
            }
            case 1: {
              D2 = 0;
              break;
            }
            default:
              D2 = 9 - (q2 & 255) << 15 & 8355840;
          }
          q2 = b[k2 + 6 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              E2 = 262144;
              break;
            }
            case 1: {
              E2 = 0;
              break;
            }
            default:
              E2 = 9 - (q2 & 255) << 18 & 66846720;
          }
          q2 = b[k2 + 7 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              F2 = 2097152;
              break;
            }
            case 1: {
              F2 = 0;
              break;
            }
            default:
              F2 = 9 - (q2 & 255) << 21 & 534773760;
          }
          q2 = b[k2 + 8 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              G2 = 1;
              break;
            }
            case 1: {
              G2 = 0;
              break;
            }
            default:
              G2 = 9 - (q2 & 255) & 255;
          }
          q2 = b[k2 + 9 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              H2 = 8;
              break;
            }
            case 1: {
              H2 = 0;
              break;
            }
            default:
              H2 = 9 - (q2 & 255) << 3 & 2040;
          }
          q2 = b[k2 + 10 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              I2 = 64;
              break;
            }
            case 1: {
              I2 = 0;
              break;
            }
            default:
              I2 = 9 - (q2 & 255) << 6 & 16320;
          }
          q2 = b[k2 + 11 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              J2 = 512;
              break;
            }
            case 1: {
              J2 = 0;
              break;
            }
            default:
              J2 = 9 - (q2 & 255) << 9 & 130560;
          }
          q2 = b[k2 + 12 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              K2 = 4096;
              break;
            }
            case 1: {
              K2 = 0;
              break;
            }
            default:
              K2 = 9 - (q2 & 255) << 12 & 1044480;
          }
          q2 = b[k2 + 13 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              L2 = 32768;
              break;
            }
            case 1: {
              L2 = 0;
              break;
            }
            default:
              L2 = 9 - (q2 & 255) << 15 & 8355840;
          }
          q2 = b[k2 + 14 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              M2 = 262144;
              break;
            }
            case 1: {
              M2 = 0;
              break;
            }
            default:
              M2 = 9 - (q2 & 255) << 18 & 66846720;
          }
          q2 = b[k2 + 15 >> 0] | 0;
          switch (q2 << 24 >> 24) {
            case 0: {
              N2 = 2097152;
              break;
            }
            case 1: {
              N2 = 0;
              break;
            }
            default:
              N2 = 9 - (q2 & 255) << 21 & 534773760;
          }
          b[d2 >> 0] = r2;
          b[d2 + 1 >> 0] = s2;
          q2 = z2 | y2 | A2;
          A2 = B2 | q2 | C2 | D2;
          b[d2 + 2 >> 0] = q2;
          b[d2 + 3 >> 0] = A2 >>> 8;
          b[d2 + 4 >> 0] = (E2 | A2 | F2) >>> 16;
          F2 = H2 | G2 | I2;
          I2 = J2 | F2 | K2 | L2;
          O2 = M2 | I2 | N2;
          P2 = I2;
          Q2 = F2;
        } else {
          b[d2 >> 0] = s2;
          b[d2 + 1 >> 0] = r2;
          r2 = (h[k2 + 1 >> 0] | 0) << 3 | (h[k2 >> 0] | 0) | (h[k2 + 2 >> 0] | 0) << 6;
          s2 = (h[k2 + 3 >> 0] | 0) << 9 | r2 | (h[k2 + 4 >> 0] | 0) << 12 | (h[k2 + 5 >> 0] | 0) << 15;
          F2 = (h[k2 + 6 >> 0] | 0) << 18 | s2 | (h[k2 + 7 >> 0] | 0) << 21;
          b[d2 + 2 >> 0] = r2;
          b[d2 + 3 >> 0] = s2 >>> 8;
          b[d2 + 4 >> 0] = F2 >>> 16;
          F2 = (h[k2 + 9 >> 0] | 0) << 3 | (h[k2 + 8 >> 0] | 0) | (h[k2 + 10 >> 0] | 0) << 6;
          s2 = (h[k2 + 11 >> 0] | 0) << 9 | F2 | (h[k2 + 12 >> 0] | 0) << 12 | (h[k2 + 13 >> 0] | 0) << 15;
          O2 = (h[k2 + 14 >> 0] | 0) << 18 | s2 | (h[k2 + 15 >> 0] | 0) << 21;
          P2 = s2;
          Q2 = F2;
        }
        b[d2 + 5 >> 0] = Q2;
        b[d2 + 6 >> 0] = P2 >>> 8;
        b[d2 + 7 >> 0] = O2 >>> 16;
        u = e2;
        return;
      }
      function Ta(a2, c2, d2, e2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        var f2 = 0, g2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0;
        f2 = d2 + 1 | 0;
        g2 = d2 + 2 | 0;
        i3 = d2 + 3 | 0;
        j2 = d2 + 4 | 0;
        k2 = d2 + 5 | 0;
        l2 = d2 + 6 | 0;
        m2 = d2 + 7 | 0;
        n2 = 0;
        o2 = 0;
        while (1) {
          if (!(1 << o2 & c2)) {
            b[e2 + o2 >> 0] = 0;
            p2 = n2;
          } else {
            q2 = h[a2 + (o2 << 2 | 3) >> 0] | 0;
            r2 = q2 - (h[d2 >> 0] | 0) | 0;
            s2 = W(r2, r2) | 0;
            r2 = q2 - (h[f2 >> 0] | 0) | 0;
            t2 = W(r2, r2) | 0;
            r2 = t2 >>> 0 < s2 >>> 0;
            u2 = r2 ? t2 : s2;
            s2 = q2 - (h[g2 >> 0] | 0) | 0;
            t2 = W(s2, s2) | 0;
            s2 = (t2 | 0) < (u2 | 0);
            v2 = s2 ? t2 : u2;
            u2 = q2 - (h[i3 >> 0] | 0) | 0;
            t2 = W(u2, u2) | 0;
            u2 = (t2 | 0) < (v2 | 0);
            w2 = u2 ? t2 : v2;
            v2 = q2 - (h[j2 >> 0] | 0) | 0;
            t2 = W(v2, v2) | 0;
            v2 = (t2 | 0) < (w2 | 0);
            x2 = v2 ? t2 : w2;
            w2 = q2 - (h[k2 >> 0] | 0) | 0;
            t2 = W(w2, w2) | 0;
            w2 = (t2 | 0) < (x2 | 0);
            y2 = w2 ? t2 : x2;
            x2 = q2 - (h[l2 >> 0] | 0) | 0;
            t2 = W(x2, x2) | 0;
            x2 = (t2 | 0) < (y2 | 0);
            z2 = x2 ? t2 : y2;
            y2 = q2 - (h[m2 >> 0] | 0) | 0;
            q2 = W(y2, y2) | 0;
            y2 = (q2 | 0) < (z2 | 0);
            b[e2 + o2 >> 0] = y2 ? 7 : x2 ? 6 : w2 ? 5 : v2 ? 4 : u2 ? 3 : s2 ? 2 : r2 & 1;
            p2 = (y2 ? q2 : z2) + n2 | 0;
          }
          o2 = o2 + 1 | 0;
          if ((o2 | 0) == 16) break;
          else n2 = p2;
        }
        return p2 | 0;
      }
      function Ua(a2, c2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, f2 = 0, g2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0;
        d2 = u;
        u = u + 32 | 0;
        e2 = d2 + 16 | 0;
        f2 = d2;
        g2 = b[c2 >> 0] | 0;
        i3 = g2 & 255;
        j2 = b[c2 + 1 >> 0] | 0;
        k2 = j2 & 255;
        b[e2 >> 0] = g2;
        b[e2 + 1 >> 0] = j2;
        if ((g2 & 255) > (j2 & 255)) {
          b[e2 + 2 >> 0] = (((i3 * 6 | 0) + k2 | 0) >>> 0) / 7 | 0;
          b[e2 + 3 >> 0] = (((i3 * 5 | 0) + (k2 << 1) | 0) >>> 0) / 7 | 0;
          b[e2 + 4 >> 0] = (((i3 << 2) + (k2 * 3 | 0) | 0) >>> 0) / 7 | 0;
          b[e2 + 5 >> 0] = (((i3 * 3 | 0) + (k2 << 2) | 0) >>> 0) / 7 | 0;
          b[e2 + 6 >> 0] = (((i3 << 1) + (k2 * 5 | 0) | 0) >>> 0) / 7 | 0;
          l2 = (((i3 + (k2 * 6 | 0) | 0) >>> 0) / 7 | 0) & 255;
        } else {
          b[e2 + 2 >> 0] = (((i3 << 2) + k2 | 0) >>> 0) / 5 | 0;
          b[e2 + 3 >> 0] = (((i3 * 3 | 0) + (k2 << 1) | 0) >>> 0) / 5 | 0;
          b[e2 + 4 >> 0] = (((i3 << 1) + (k2 * 3 | 0) | 0) >>> 0) / 5 | 0;
          b[e2 + 5 >> 0] = ((i3 + (k2 << 2) | 0) >>> 0) / 5 | 0;
          b[e2 + 6 >> 0] = 0;
          l2 = -1;
        }
        b[e2 + 7 >> 0] = l2;
        l2 = h[c2 + 2 >> 0] | 0;
        k2 = h[c2 + 3 >> 0] | 0;
        i3 = k2 << 8;
        j2 = b[c2 + 4 >> 0] | 0;
        g2 = j2 & 255;
        b[f2 >> 0] = l2 & 7;
        b[f2 + 1 >> 0] = l2 >>> 3 & 7;
        b[f2 + 2 >> 0] = (i3 | l2) >>> 6 & 7;
        b[f2 + 3 >> 0] = k2 >>> 1 & 7;
        b[f2 + 4 >> 0] = k2 >>> 4 & 7;
        b[f2 + 5 >> 0] = (g2 << 16 | i3) >>> 15 & 7;
        b[f2 + 6 >> 0] = g2 >>> 2 & 7;
        b[f2 + 7 >> 0] = (j2 & 255) >>> 5;
        j2 = h[c2 + 5 >> 0] | 0;
        g2 = h[c2 + 6 >> 0] | 0;
        i3 = g2 << 8;
        k2 = b[c2 + 7 >> 0] | 0;
        c2 = k2 & 255;
        b[f2 + 8 >> 0] = j2 & 7;
        b[f2 + 9 >> 0] = j2 >>> 3 & 7;
        b[f2 + 10 >> 0] = (i3 | j2) >>> 6 & 7;
        b[f2 + 11 >> 0] = g2 >>> 1 & 7;
        b[f2 + 12 >> 0] = g2 >>> 4 & 7;
        b[f2 + 13 >> 0] = (c2 << 16 | i3) >>> 15 & 7;
        b[f2 + 14 >> 0] = c2 >>> 2 & 7;
        b[f2 + 15 >> 0] = (k2 & 255) >>> 5;
        b[a2 + 3 >> 0] = b[e2 + (h[f2 >> 0] | 0) >> 0] | 0;
        b[a2 + 7 >> 0] = b[e2 + (h[f2 + 1 >> 0] | 0) >> 0] | 0;
        b[a2 + 11 >> 0] = b[e2 + (h[f2 + 2 >> 0] | 0) >> 0] | 0;
        b[a2 + 15 >> 0] = b[e2 + (h[f2 + 3 >> 0] | 0) >> 0] | 0;
        b[a2 + 19 >> 0] = b[e2 + (h[f2 + 4 >> 0] | 0) >> 0] | 0;
        b[a2 + 23 >> 0] = b[e2 + (h[f2 + 5 >> 0] | 0) >> 0] | 0;
        b[a2 + 27 >> 0] = b[e2 + (h[f2 + 6 >> 0] | 0) >> 0] | 0;
        b[a2 + 31 >> 0] = b[e2 + (h[f2 + 7 >> 0] | 0) >> 0] | 0;
        b[a2 + 35 >> 0] = b[e2 + (h[f2 + 8 >> 0] | 0) >> 0] | 0;
        b[a2 + 39 >> 0] = b[e2 + (h[f2 + 9 >> 0] | 0) >> 0] | 0;
        b[a2 + 43 >> 0] = b[e2 + (h[f2 + 10 >> 0] | 0) >> 0] | 0;
        b[a2 + 47 >> 0] = b[e2 + (h[f2 + 11 >> 0] | 0) >> 0] | 0;
        b[a2 + 51 >> 0] = b[e2 + (h[f2 + 12 >> 0] | 0) >> 0] | 0;
        b[a2 + 55 >> 0] = b[e2 + (h[f2 + 13 >> 0] | 0) >> 0] | 0;
        b[a2 + 59 >> 0] = b[e2 + (h[f2 + 14 >> 0] | 0) >> 0] | 0;
        b[a2 + 63 >> 0] = b[e2 + (h[f2 + 15 >> 0] | 0) >> 0] | 0;
        u = d2;
        return;
      }
      function Va(a2, c2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R2 = 0, S2 = 0, T2 = 0, U2 = 0, W2 = 0, X2 = 0, Y2 = 0, Z2 = 0, _2 = 0, $2 = 0, aa2 = 0, ba2 = 0, ca2 = 0, da2 = 0, ea2 = 0, fa2 = 0, ga2 = 0, ha2 = 0, ia2 = 0, ja2 = 0, ka2 = 0, la2 = 0, ma2 = 0, na2 = 0, oa2 = 0, pa2 = 0, qa2 = 0, ra2 = 0, sa2 = 0, ta2 = 0, ua2 = 0, va2 = 0, wa2 = 0, xa2 = 0, ya2 = 0, za2 = 0, Aa2 = 0, Ba2 = 0, Ca2 = 0, Da2 = 0, Ea2 = 0, Fa2 = 0, Ga2 = 0, Ha2 = 0, Ia2 = 0, Ja2 = 0, Ka2 = 0, La2 = 0, Ma2 = 0, Na2 = 0, Oa2 = 0, Pa2 = 0, Qa2 = 0, Ra2 = 0, Sa2 = 0, Ta2 = 0, Ua2 = 0, Va2 = 0, Wa2 = 0, Ya2 = 0, _a2 = 0, $a2 = 0, ab2 = 0, bb2 = 0, cb2 = 0, eb2 = 0, fb2 = 0, gb2 = 0, hb2 = 0, ib2 = 0, jb2 = 0, kb2 = 0, lb2 = 0, mb2 = 0, nb2 = 0, ob2 = 0, pb2 = 0, qb2 = 0, rb2 = 0, sb2 = 0, tb2 = 0, ub2 = 0, vb2 = 0, wb2 = 0, xb2 = 0, yb2 = 0, zb2 = 0, Ab2 = 0, Bb2 = 0, Cb2 = 0, Db2 = 0, Eb2 = 0, Fb2 = 0, Gb2 = 0, Hb2 = 0, Ib2 = 0, Jb2 = 0, Kb2 = 0, Lb2 = 0, Mb2 = 0, Nb2 = 0;
        d2 = u;
        u = u + 64 | 0;
        e2 = d2 + 40 | 0;
        g2 = d2 + 24 | 0;
        i3 = d2 + 12 | 0;
        j2 = d2;
        k2 = a2 + 4 | 0;
        l2 = f[f[k2 >> 2] >> 2] | 0;
        Xa(a2, a2 + 16 | 0, 0) | 0;
        m2 = a2 + 444 | 0;
        o2 = a2 + 448 | 0;
        p2 = a2 + 452 | 0;
        q2 = a2 + 456 | 0;
        r2 = (l2 | 0) > 0;
        s2 = a2 + 12 | 0;
        t2 = g2 + 4 | 0;
        v2 = g2 + 8 | 0;
        w2 = a2 + 156 | 0;
        x2 = a2 + 160 | 0;
        y2 = a2 + 164 | 0;
        z2 = a2 + 168 | 0;
        A2 = a2 + 412 | 0;
        B2 = a2 + 416 | 0;
        C2 = a2 + 420 | 0;
        D2 = a2 + 424 | 0;
        E2 = a2 + 428 | 0;
        F2 = a2 + 432 | 0;
        G2 = a2 + 436 | 0;
        H2 = 0;
        J2 = 0;
        K2 = 0;
        L2 = 0;
        M2 = +n[m2 >> 2];
        N2 = +n[p2 >> 2];
        O2 = +n[q2 >> 2];
        P2 = +n[o2 >> 2];
        Q2 = 0;
        R2 = 0;
        S2 = 0;
        T2 = 0;
        U2 = 0;
        W2 = 0;
        while (1) {
          if (r2) {
            X2 = +n[A2 >> 2];
            Y2 = +n[B2 >> 2];
            Z2 = +n[C2 >> 2];
            _2 = +n[D2 >> 2];
            $2 = +n[E2 >> 2];
            aa2 = +n[F2 >> 2];
            ba2 = +n[G2 >> 2];
            ca2 = 0;
            da2 = H2;
            ea2 = J2;
            fa2 = L2;
            ga2 = 0;
            ha2 = M2;
            ia2 = N2;
            ja2 = 0;
            ka2 = O2;
            la2 = 0;
            ma2 = 0;
            na2 = P2;
            oa2 = W2;
            pa2 = U2;
            qa2 = T2;
            ra2 = S2;
            sa2 = R2;
            ta2 = Q2;
            while (1) {
              ua2 = (ca2 | 0) == 0;
              if (ua2) {
                va2 = +n[w2 >> 2];
                wa2 = +n[x2 >> 2];
                xa2 = +n[y2 >> 2];
                ya2 = +n[z2 >> 2];
              } else {
                va2 = 0;
                wa2 = 0;
                xa2 = 0;
                ya2 = 0;
              }
              za2 = ua2 ? 1 : ca2;
              ua2 = da2;
              Aa2 = ea2;
              Ba2 = fa2;
              Ca2 = va2;
              Da2 = ha2;
              Ea2 = wa2;
              Fa2 = ia2;
              Ga2 = ka2;
              Ha2 = xa2;
              Ia2 = ya2;
              Ja2 = na2;
              Ka2 = ta2;
              La2 = sa2;
              Ma2 = ra2;
              Na2 = qa2;
              Oa2 = pa2;
              Pa2 = oa2;
              while (1) {
                Qa2 = Ca2 * 0.5;
                Ra2 = Ea2 * 0.5;
                Sa2 = Ha2 * 0.5;
                Ta2 = Ia2 * 0.25;
                Ua2 = ga2 + Qa2;
                Va2 = ma2 + Ra2;
                Wa2 = ja2 + Sa2;
                Ya2 = la2 + Ta2;
                _a2 = Qa2 + (X2 - Ca2 - ga2);
                Qa2 = Ra2 + (Y2 - Ea2 - ma2);
                Ra2 = Sa2 + (Z2 - Ha2 - ja2);
                Sa2 = Ta2 + (_2 - Ia2 - la2);
                $a2 = 1 / (Ya2 * Sa2 - Ta2 * Ta2);
                ab2 = (Ua2 * Sa2 - Ta2 * _a2) * $a2;
                bb2 = (Va2 * Sa2 - Ta2 * Qa2) * $a2;
                cb2 = (Wa2 * Sa2 - Ta2 * Ra2) * $a2;
                eb2 = (Ya2 * _a2 - Ua2 * Ta2) * $a2;
                fb2 = (Ya2 * Qa2 - Va2 * Ta2) * $a2;
                gb2 = (Ya2 * Ra2 - Wa2 * Ta2) * $a2;
                $a2 = ab2 > 0 ? ab2 : 0;
                ab2 = bb2 > 0 ? bb2 : 0;
                bb2 = cb2 > 0 ? cb2 : 0;
                cb2 = eb2 > 0 ? eb2 : 0;
                eb2 = fb2 > 0 ? fb2 : 0;
                fb2 = gb2 > 0 ? gb2 : 0;
                gb2 = ($a2 < 1 ? $a2 : 1) * 31 + 0.5;
                $a2 = (ab2 < 1 ? ab2 : 1) * 63 + 0.5;
                ab2 = (bb2 < 1 ? bb2 : 1) * 31 + 0.5;
                if (gb2 > 0) hb2 = +I(+gb2);
                else hb2 = +V(+gb2);
                if ($a2 > 0) ib2 = +I(+$a2);
                else ib2 = +V(+$a2);
                if (ab2 > 0) jb2 = +I(+ab2);
                else jb2 = +V(+ab2);
                ab2 = hb2 * 0.032258063554763794;
                $a2 = ib2 * 0.01587301678955555;
                gb2 = jb2 * 0.032258063554763794;
                bb2 = (cb2 < 1 ? cb2 : 1) * 31 + 0.5;
                cb2 = (eb2 < 1 ? eb2 : 1) * 63 + 0.5;
                eb2 = (fb2 < 1 ? fb2 : 1) * 31 + 0.5;
                if (bb2 > 0) kb2 = +I(+bb2);
                else kb2 = +V(+bb2);
                if (cb2 > 0) lb2 = +I(+cb2);
                else lb2 = +V(+cb2);
                if (eb2 > 0) mb2 = +I(+eb2);
                else mb2 = +V(+eb2);
                eb2 = kb2 * 0.032258063554763794;
                cb2 = lb2 * 0.01587301678955555;
                bb2 = mb2 * 0.032258063554763794;
                fb2 = $2 * (Ya2 * (ab2 * ab2) + Sa2 * (eb2 * eb2) + (Ta2 * (ab2 * eb2) - Ua2 * ab2 - _a2 * eb2) * 2) + aa2 * (Ya2 * ($a2 * $a2) + Sa2 * (cb2 * cb2) + (Ta2 * ($a2 * cb2) - Va2 * $a2 - Qa2 * cb2) * 2) + ba2 * (Ya2 * (gb2 * gb2) + Sa2 * (bb2 * bb2) + (Ta2 * (gb2 * bb2) - Wa2 * gb2 - Ra2 * bb2) * 2);
                if (!(fb2 < Da2 | fb2 < Ja2) ? !(fb2 < Fa2 | fb2 < Ga2) : 0) {
                  nb2 = ua2;
                  ob2 = Aa2;
                  pb2 = Ba2;
                  qb2 = Da2;
                  rb2 = Fa2;
                  sb2 = Ga2;
                  tb2 = Ja2;
                  ub2 = Ka2;
                  vb2 = La2;
                  wb2 = Ma2;
                  xb2 = Na2;
                  yb2 = Oa2;
                  zb2 = Pa2;
                } else {
                  nb2 = K2;
                  ob2 = ca2;
                  pb2 = za2;
                  qb2 = fb2;
                  rb2 = fb2;
                  sb2 = fb2;
                  tb2 = fb2;
                  ub2 = eb2;
                  vb2 = cb2;
                  wb2 = bb2;
                  xb2 = ab2;
                  yb2 = $a2;
                  zb2 = gb2;
                }
                if ((za2 | 0) == (l2 | 0)) break;
                gb2 = Ca2 + +n[a2 + 156 + (za2 << 4) >> 2];
                $a2 = Ea2 + +n[a2 + 156 + (za2 << 4) + 4 >> 2];
                ab2 = Ha2 + +n[a2 + 156 + (za2 << 4) + 8 >> 2];
                bb2 = Ia2 + +n[a2 + 156 + (za2 << 4) + 12 >> 2];
                za2 = za2 + 1 | 0;
                ua2 = nb2;
                Aa2 = ob2;
                Ba2 = pb2;
                Ca2 = gb2;
                Da2 = qb2;
                Ea2 = $a2;
                Fa2 = rb2;
                Ga2 = sb2;
                Ha2 = ab2;
                Ia2 = bb2;
                Ja2 = tb2;
                Ka2 = ub2;
                La2 = vb2;
                Ma2 = wb2;
                Na2 = xb2;
                Oa2 = yb2;
                Pa2 = zb2;
              }
              ga2 = ga2 + +n[a2 + 156 + (ca2 << 4) >> 2];
              ma2 = ma2 + +n[a2 + 156 + (ca2 << 4) + 4 >> 2];
              ja2 = ja2 + +n[a2 + 156 + (ca2 << 4) + 8 >> 2];
              la2 = la2 + +n[a2 + 156 + (ca2 << 4) + 12 >> 2];
              ca2 = ca2 + 1 | 0;
              if ((ca2 | 0) == (l2 | 0)) {
                Ab2 = nb2;
                Bb2 = ob2;
                Cb2 = pb2;
                Db2 = zb2;
                Eb2 = yb2;
                Fb2 = xb2;
                Gb2 = wb2;
                Hb2 = vb2;
                Ib2 = ub2;
                Jb2 = qb2;
                Kb2 = rb2;
                Lb2 = sb2;
                Mb2 = tb2;
                break;
              } else {
                da2 = nb2;
                ea2 = ob2;
                fa2 = pb2;
                ha2 = qb2;
                ia2 = rb2;
                ka2 = sb2;
                na2 = tb2;
                oa2 = zb2;
                pa2 = yb2;
                qa2 = xb2;
                ra2 = wb2;
                sa2 = vb2;
                ta2 = ub2;
              }
            }
          } else {
            Ab2 = H2;
            Bb2 = J2;
            Cb2 = L2;
            Db2 = W2;
            Eb2 = U2;
            Fb2 = T2;
            Gb2 = S2;
            Hb2 = R2;
            Ib2 = Q2;
            Jb2 = M2;
            Kb2 = N2;
            Lb2 = O2;
            Mb2 = P2;
          }
          if ((Ab2 | 0) != (K2 | 0)) {
            Nb2 = Ab2;
            break;
          }
          fa2 = K2 + 1 | 0;
          if ((fa2 | 0) == (f[s2 >> 2] | 0)) {
            Nb2 = K2;
            break;
          }
          n[g2 >> 2] = Ib2 - Fb2;
          n[t2 >> 2] = Hb2 - Eb2;
          n[v2 >> 2] = Gb2 - Db2;
          if (Xa(a2, g2, fa2) | 0) {
            ea2 = K2;
            J2 = Bb2;
            K2 = fa2;
            L2 = Cb2;
            M2 = Jb2;
            N2 = Kb2;
            O2 = Lb2;
            P2 = Mb2;
            Q2 = Ib2;
            R2 = Hb2;
            S2 = Gb2;
            T2 = Fb2;
            U2 = Eb2;
            W2 = Db2;
            H2 = ea2;
          } else {
            Nb2 = K2;
            break;
          }
        }
        if (((!(Jb2 < +n[m2 >> 2]) ? !(Mb2 < +n[o2 >> 2]) : 0) ? !(Kb2 < +n[p2 >> 2]) : 0) ? !(Lb2 < +n[q2 >> 2]) : 0) {
          u = d2;
          return;
        }
        K2 = (Nb2 << 4) + (a2 + 28) | 0;
        if ((Bb2 | 0) > 0) {
          a2 = 0;
          do {
            b[g2 + (h[K2 + a2 >> 0] | 0) >> 0] = 0;
            a2 = a2 + 1 | 0;
          } while ((a2 | 0) != (Bb2 | 0));
        }
        if ((Bb2 | 0) < (Cb2 | 0)) {
          a2 = Bb2;
          do {
            b[g2 + (h[K2 + a2 >> 0] | 0) >> 0] = 2;
            a2 = a2 + 1 | 0;
          } while ((a2 | 0) != (Cb2 | 0));
        }
        if ((Cb2 | 0) < (l2 | 0)) {
          a2 = Cb2;
          do {
            b[g2 + (h[K2 + a2 >> 0] | 0) >> 0] = 1;
            a2 = a2 + 1 | 0;
          } while ((a2 | 0) != (l2 | 0));
        }
        db(f[k2 >> 2] | 0, g2, e2);
        n[i3 >> 2] = Fb2;
        n[i3 + 4 >> 2] = Eb2;
        n[i3 + 8 >> 2] = Db2;
        n[j2 >> 2] = Ib2;
        n[j2 + 4 >> 2] = Hb2;
        n[j2 + 8 >> 2] = Gb2;
        Za(i3, j2, e2, c2);
        n[m2 >> 2] = Jb2;
        n[o2 >> 2] = Mb2;
        n[p2 >> 2] = Kb2;
        n[q2 >> 2] = Lb2;
        u = d2;
        return;
      }
      function Wa(a2, c2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R2 = 0, S2 = 0, T2 = 0, U2 = 0, W2 = 0, X2 = 0, Y2 = 0, Z2 = 0, _2 = 0, $2 = 0, aa2 = 0, ba2 = 0, ca2 = 0, da2 = 0, ea2 = 0, fa2 = 0, ga2 = 0, ha2 = 0, ia2 = 0, ja2 = 0, ka2 = 0, la2 = 0, ma2 = 0, na2 = 0, oa2 = 0, pa2 = 0, qa2 = 0, ra2 = 0, sa2 = 0, ta2 = 0, ua2 = 0, va2 = 0, wa2 = 0, xa2 = 0, ya2 = 0, za2 = 0, Aa2 = 0, Ba2 = 0, Ca2 = 0, Da2 = 0, Ea2 = 0, Fa2 = 0, Ga2 = 0, Ha2 = 0, Ia2 = 0, Ja2 = 0, Ka2 = 0, La2 = 0, Ma2 = 0, Na2 = 0, Oa2 = 0, Pa2 = 0, Qa2 = 0, Ra2 = 0, Sa2 = 0, Ta2 = 0, Ua2 = 0, Va2 = 0, Wa2 = 0, Ya2 = 0, Za2 = 0, $a2 = 0, ab2 = 0, bb2 = 0, cb2 = 0, eb2 = 0, fb2 = 0, gb2 = 0, hb2 = 0, ib2 = 0, jb2 = 0, kb2 = 0, lb2 = 0, mb2 = 0, nb2 = 0, ob2 = 0, pb2 = 0, qb2 = 0, rb2 = 0, sb2 = 0, tb2 = 0, ub2 = 0, vb2 = 0, wb2 = 0, xb2 = 0, yb2 = 0, zb2 = 0, Ab2 = 0, Bb2 = 0, Cb2 = 0, Db2 = 0, Eb2 = 0, Fb2 = 0, Gb2 = 0, Hb2 = 0, Ib2 = 0, Jb2 = 0, Kb2 = 0, Lb2 = 0, Mb2 = 0, Nb2 = 0, Ob2 = 0, Pb2 = 0, Qb2 = 0, Rb2 = 0, Sb2 = 0, Tb2 = 0, Ub2 = 0, Vb2 = 0, Wb2 = 0, Xb2 = 0, Yb2 = 0, Zb2 = 0, _b2 = 0, $b2 = 0, ac2 = 0, bc2 = 0, cc2 = 0, dc2 = 0, ec2 = 0, fc2 = 0, gc2 = 0, hc2 = 0, ic2 = 0, jc2 = 0, kc2 = 0, lc2 = 0, mc2 = 0, nc2 = 0, oc2 = 0, pc2 = 0, qc2 = 0, rc2 = 0;
        d2 = u;
        u = u + 64 | 0;
        e2 = d2 + 40 | 0;
        g2 = d2 + 24 | 0;
        i3 = d2 + 12 | 0;
        j2 = d2;
        k2 = a2 + 4 | 0;
        l2 = f[f[k2 >> 2] >> 2] | 0;
        Xa(a2, a2 + 16 | 0, 0) | 0;
        m2 = a2 + 444 | 0;
        o2 = a2 + 448 | 0;
        p2 = a2 + 452 | 0;
        q2 = a2 + 456 | 0;
        r2 = (l2 | 0) > 0;
        s2 = a2 + 12 | 0;
        t2 = g2 + 4 | 0;
        v2 = g2 + 8 | 0;
        w2 = a2 + 156 | 0;
        x2 = a2 + 160 | 0;
        y2 = a2 + 164 | 0;
        z2 = a2 + 168 | 0;
        A2 = a2 + 412 | 0;
        B2 = a2 + 416 | 0;
        C2 = a2 + 420 | 0;
        D2 = a2 + 424 | 0;
        E2 = a2 + 428 | 0;
        F2 = a2 + 432 | 0;
        G2 = a2 + 436 | 0;
        H2 = 0;
        J2 = 0;
        K2 = 0;
        L2 = 0;
        M2 = 0;
        N2 = +n[m2 >> 2];
        O2 = +n[p2 >> 2];
        P2 = +n[q2 >> 2];
        Q2 = +n[o2 >> 2];
        R2 = 0;
        S2 = 0;
        T2 = 0;
        U2 = 0;
        W2 = 0;
        X2 = 0;
        while (1) {
          if (r2) {
            Y2 = +n[A2 >> 2];
            Z2 = +n[B2 >> 2];
            _2 = +n[C2 >> 2];
            $2 = +n[D2 >> 2];
            aa2 = +n[E2 >> 2];
            ba2 = +n[F2 >> 2];
            ca2 = +n[G2 >> 2];
            da2 = 0;
            ea2 = J2;
            fa2 = K2;
            ga2 = L2;
            ha2 = M2;
            ia2 = 0;
            ja2 = N2;
            ka2 = O2;
            la2 = 0;
            ma2 = P2;
            na2 = 0;
            oa2 = 0;
            pa2 = Q2;
            qa2 = X2;
            ra2 = W2;
            sa2 = U2;
            ta2 = T2;
            ua2 = S2;
            va2 = R2;
            while (1) {
              wa2 = da2;
              xa2 = ga2;
              ya2 = ea2;
              za2 = fa2;
              Aa2 = ha2;
              Ba2 = 0;
              Ca2 = ja2;
              Da2 = ka2;
              Ea2 = ma2;
              Fa2 = 0;
              Ga2 = 0;
              Ha2 = pa2;
              Ia2 = 0;
              Ja2 = va2;
              Ka2 = ua2;
              La2 = ta2;
              Ma2 = sa2;
              Na2 = ra2;
              Oa2 = qa2;
              while (1) {
                Pa2 = (wa2 | 0) == 0;
                if (Pa2) {
                  Qa2 = +n[w2 >> 2];
                  Ra2 = +n[x2 >> 2];
                  Sa2 = +n[y2 >> 2];
                  Ta2 = +n[z2 >> 2];
                } else {
                  Qa2 = 0;
                  Ra2 = 0;
                  Sa2 = 0;
                  Ta2 = 0;
                }
                Ua2 = ia2 + Ba2 * 0.6666666865348816;
                Va2 = oa2 + Ia2 * 0.6666666865348816;
                Wa2 = la2 + Fa2 * 0.6666666865348816;
                Ya2 = na2 + Ga2 * 0.4444444477558136;
                Za2 = Ba2 * 0.3333333432674408;
                $a2 = Ia2 * 0.3333333432674408;
                ab2 = Fa2 * 0.3333333432674408;
                bb2 = Ga2 * 0.1111111119389534;
                cb2 = Pa2 ? 1 : wa2;
                Pa2 = xa2;
                eb2 = ya2;
                fb2 = za2;
                gb2 = Aa2;
                hb2 = Qa2;
                ib2 = Ca2;
                jb2 = Ra2;
                kb2 = Da2;
                lb2 = Ea2;
                mb2 = Sa2;
                nb2 = Ta2;
                ob2 = Ha2;
                pb2 = Ja2;
                qb2 = Ka2;
                rb2 = La2;
                sb2 = Ma2;
                tb2 = Na2;
                ub2 = Oa2;
                while (1) {
                  vb2 = Ua2 + hb2 * 0.3333333432674408;
                  wb2 = Va2 + jb2 * 0.3333333432674408;
                  xb2 = Wa2 + mb2 * 0.3333333432674408;
                  yb2 = Ya2 + nb2 * 0.1111111119389534;
                  zb2 = Za2 + (hb2 * 0.6666666865348816 + (Y2 - hb2 - Ba2 - ia2));
                  Ab2 = $a2 + (jb2 * 0.6666666865348816 + (Z2 - jb2 - Ia2 - oa2));
                  Bb2 = ab2 + (mb2 * 0.6666666865348816 + (_2 - mb2 - Fa2 - la2));
                  Cb2 = bb2 + (nb2 * 0.4444444477558136 + ($2 - nb2 - Ga2 - na2));
                  Db2 = (Ga2 + nb2) * 0.2222222238779068;
                  Eb2 = 1 / (yb2 * Cb2 - Db2 * Db2);
                  Fb2 = (vb2 * Cb2 - Db2 * zb2) * Eb2;
                  Gb2 = (wb2 * Cb2 - Db2 * Ab2) * Eb2;
                  Hb2 = (xb2 * Cb2 - Db2 * Bb2) * Eb2;
                  Ib2 = (yb2 * zb2 - vb2 * Db2) * Eb2;
                  Jb2 = (yb2 * Ab2 - wb2 * Db2) * Eb2;
                  Kb2 = (yb2 * Bb2 - xb2 * Db2) * Eb2;
                  Eb2 = Fb2 > 0 ? Fb2 : 0;
                  Fb2 = Gb2 > 0 ? Gb2 : 0;
                  Gb2 = Hb2 > 0 ? Hb2 : 0;
                  Hb2 = Ib2 > 0 ? Ib2 : 0;
                  Ib2 = Jb2 > 0 ? Jb2 : 0;
                  Jb2 = Kb2 > 0 ? Kb2 : 0;
                  Kb2 = (Eb2 < 1 ? Eb2 : 1) * 31 + 0.5;
                  Eb2 = (Fb2 < 1 ? Fb2 : 1) * 63 + 0.5;
                  Fb2 = (Gb2 < 1 ? Gb2 : 1) * 31 + 0.5;
                  if (Kb2 > 0) Lb2 = +I(+Kb2);
                  else Lb2 = +V(+Kb2);
                  if (Eb2 > 0) Mb2 = +I(+Eb2);
                  else Mb2 = +V(+Eb2);
                  if (Fb2 > 0) Nb2 = +I(+Fb2);
                  else Nb2 = +V(+Fb2);
                  Fb2 = Lb2 * 0.032258063554763794;
                  Eb2 = Mb2 * 0.01587301678955555;
                  Kb2 = Nb2 * 0.032258063554763794;
                  Gb2 = (Hb2 < 1 ? Hb2 : 1) * 31 + 0.5;
                  Hb2 = (Ib2 < 1 ? Ib2 : 1) * 63 + 0.5;
                  Ib2 = (Jb2 < 1 ? Jb2 : 1) * 31 + 0.5;
                  if (Gb2 > 0) Ob2 = +I(+Gb2);
                  else Ob2 = +V(+Gb2);
                  if (Hb2 > 0) Pb2 = +I(+Hb2);
                  else Pb2 = +V(+Hb2);
                  if (Ib2 > 0) Qb2 = +I(+Ib2);
                  else Qb2 = +V(+Ib2);
                  Ib2 = Ob2 * 0.032258063554763794;
                  Hb2 = Pb2 * 0.01587301678955555;
                  Gb2 = Qb2 * 0.032258063554763794;
                  Jb2 = aa2 * (yb2 * (Fb2 * Fb2) + Cb2 * (Ib2 * Ib2) + (Db2 * (Fb2 * Ib2) - vb2 * Fb2 - zb2 * Ib2) * 2) + ba2 * (yb2 * (Eb2 * Eb2) + Cb2 * (Hb2 * Hb2) + (Db2 * (Eb2 * Hb2) - wb2 * Eb2 - Ab2 * Hb2) * 2) + ca2 * (yb2 * (Kb2 * Kb2) + Cb2 * (Gb2 * Gb2) + (Db2 * (Kb2 * Gb2) - xb2 * Kb2 - Bb2 * Gb2) * 2);
                  if (!(Jb2 < ib2 | Jb2 < ob2) ? !(Jb2 < kb2 | Jb2 < lb2) : 0) {
                    Rb2 = Pa2;
                    Sb2 = eb2;
                    Tb2 = fb2;
                    Ub2 = gb2;
                    Vb2 = ib2;
                    Wb2 = kb2;
                    Xb2 = lb2;
                    Yb2 = ob2;
                    Zb2 = pb2;
                    _b2 = qb2;
                    $b2 = rb2;
                    ac2 = sb2;
                    bc2 = tb2;
                    cc2 = ub2;
                  } else {
                    Rb2 = H2;
                    Sb2 = cb2;
                    Tb2 = wa2;
                    Ub2 = da2;
                    Vb2 = Jb2;
                    Wb2 = Jb2;
                    Xb2 = Jb2;
                    Yb2 = Jb2;
                    Zb2 = Ib2;
                    _b2 = Hb2;
                    $b2 = Gb2;
                    ac2 = Fb2;
                    bc2 = Eb2;
                    cc2 = Kb2;
                  }
                  if ((cb2 | 0) == (l2 | 0)) break;
                  Kb2 = hb2 + +n[a2 + 156 + (cb2 << 4) >> 2];
                  Eb2 = jb2 + +n[a2 + 156 + (cb2 << 4) + 4 >> 2];
                  Fb2 = mb2 + +n[a2 + 156 + (cb2 << 4) + 8 >> 2];
                  Gb2 = nb2 + +n[a2 + 156 + (cb2 << 4) + 12 >> 2];
                  cb2 = cb2 + 1 | 0;
                  Pa2 = Rb2;
                  eb2 = Sb2;
                  fb2 = Tb2;
                  gb2 = Ub2;
                  hb2 = Kb2;
                  ib2 = Vb2;
                  jb2 = Eb2;
                  kb2 = Wb2;
                  lb2 = Xb2;
                  mb2 = Fb2;
                  nb2 = Gb2;
                  ob2 = Yb2;
                  pb2 = Zb2;
                  qb2 = _b2;
                  rb2 = $b2;
                  sb2 = ac2;
                  tb2 = bc2;
                  ub2 = cc2;
                }
                if ((wa2 | 0) == (l2 | 0)) break;
                ub2 = Ba2 + +n[a2 + 156 + (wa2 << 4) >> 2];
                tb2 = Ia2 + +n[a2 + 156 + (wa2 << 4) + 4 >> 2];
                sb2 = Fa2 + +n[a2 + 156 + (wa2 << 4) + 8 >> 2];
                rb2 = Ga2 + +n[a2 + 156 + (wa2 << 4) + 12 >> 2];
                wa2 = wa2 + 1 | 0;
                xa2 = Rb2;
                ya2 = Sb2;
                za2 = Tb2;
                Aa2 = Ub2;
                Ba2 = ub2;
                Ca2 = Vb2;
                Da2 = Wb2;
                Ea2 = Xb2;
                Fa2 = sb2;
                Ga2 = rb2;
                Ha2 = Yb2;
                Ia2 = tb2;
                Ja2 = Zb2;
                Ka2 = _b2;
                La2 = $b2;
                Ma2 = ac2;
                Na2 = bc2;
                Oa2 = cc2;
              }
              ia2 = ia2 + +n[a2 + 156 + (da2 << 4) >> 2];
              oa2 = oa2 + +n[a2 + 156 + (da2 << 4) + 4 >> 2];
              la2 = la2 + +n[a2 + 156 + (da2 << 4) + 8 >> 2];
              na2 = na2 + +n[a2 + 156 + (da2 << 4) + 12 >> 2];
              da2 = da2 + 1 | 0;
              if ((da2 | 0) == (l2 | 0)) {
                dc2 = Rb2;
                ec2 = Sb2;
                fc2 = Tb2;
                gc2 = Ub2;
                hc2 = cc2;
                ic2 = bc2;
                jc2 = ac2;
                kc2 = $b2;
                lc2 = _b2;
                mc2 = Zb2;
                nc2 = Vb2;
                oc2 = Wb2;
                pc2 = Xb2;
                qc2 = Yb2;
                break;
              } else {
                ea2 = Sb2;
                fa2 = Tb2;
                ga2 = Rb2;
                ha2 = Ub2;
                ja2 = Vb2;
                ka2 = Wb2;
                ma2 = Xb2;
                pa2 = Yb2;
                qa2 = cc2;
                ra2 = bc2;
                sa2 = ac2;
                ta2 = $b2;
                ua2 = _b2;
                va2 = Zb2;
              }
            }
          } else {
            dc2 = L2;
            ec2 = J2;
            fc2 = K2;
            gc2 = M2;
            hc2 = X2;
            ic2 = W2;
            jc2 = U2;
            kc2 = T2;
            lc2 = S2;
            mc2 = R2;
            nc2 = N2;
            oc2 = O2;
            pc2 = P2;
            qc2 = Q2;
          }
          if ((dc2 | 0) != (H2 | 0)) {
            rc2 = dc2;
            break;
          }
          ha2 = H2 + 1 | 0;
          if ((ha2 | 0) == (f[s2 >> 2] | 0)) {
            rc2 = H2;
            break;
          }
          n[g2 >> 2] = mc2 - jc2;
          n[t2 >> 2] = lc2 - ic2;
          n[v2 >> 2] = kc2 - hc2;
          if (Xa(a2, g2, ha2) | 0) {
            ga2 = H2;
            H2 = ha2;
            J2 = ec2;
            K2 = fc2;
            M2 = gc2;
            N2 = nc2;
            O2 = oc2;
            P2 = pc2;
            Q2 = qc2;
            R2 = mc2;
            S2 = lc2;
            T2 = kc2;
            U2 = jc2;
            W2 = ic2;
            X2 = hc2;
            L2 = ga2;
          } else {
            rc2 = H2;
            break;
          }
        }
        if (((!(nc2 < +n[m2 >> 2]) ? !(qc2 < +n[o2 >> 2]) : 0) ? !(oc2 < +n[p2 >> 2]) : 0) ? !(pc2 < +n[q2 >> 2]) : 0) {
          u = d2;
          return;
        }
        H2 = (rc2 << 4) + (a2 + 28) | 0;
        if ((gc2 | 0) > 0) {
          a2 = 0;
          do {
            b[g2 + (h[H2 + a2 >> 0] | 0) >> 0] = 0;
            a2 = a2 + 1 | 0;
          } while ((a2 | 0) != (gc2 | 0));
        }
        if ((gc2 | 0) < (fc2 | 0)) {
          a2 = gc2;
          do {
            b[g2 + (h[H2 + a2 >> 0] | 0) >> 0] = 2;
            a2 = a2 + 1 | 0;
          } while ((a2 | 0) != (fc2 | 0));
        }
        if ((fc2 | 0) < (ec2 | 0)) {
          a2 = fc2;
          do {
            b[g2 + (h[H2 + a2 >> 0] | 0) >> 0] = 3;
            a2 = a2 + 1 | 0;
          } while ((a2 | 0) != (ec2 | 0));
        }
        if ((ec2 | 0) < (l2 | 0)) {
          a2 = ec2;
          do {
            b[g2 + (h[H2 + a2 >> 0] | 0) >> 0] = 1;
            a2 = a2 + 1 | 0;
          } while ((a2 | 0) != (l2 | 0));
        }
        db(f[k2 >> 2] | 0, g2, e2);
        n[i3 >> 2] = jc2;
        n[i3 + 4 >> 2] = ic2;
        n[i3 + 8 >> 2] = hc2;
        n[j2 >> 2] = mc2;
        n[j2 + 4 >> 2] = lc2;
        n[j2 + 8 >> 2] = kc2;
        _a(i3, j2, e2, c2);
        n[m2 >> 2] = nc2;
        n[o2 >> 2] = qc2;
        n[p2 >> 2] = oc2;
        n[q2 >> 2] = pc2;
        u = d2;
        return;
      }
      function Xa(a2, c2, d2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, g2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0;
        e2 = u;
        u = u + 64 | 0;
        g2 = e2;
        i3 = a2 + 4 | 0;
        j2 = f[i3 >> 2] | 0;
        k2 = f[j2 >> 2] | 0;
        l2 = (d2 << 4) + (a2 + 28) | 0;
        m2 = (k2 | 0) > 0;
        if (m2) {
          o2 = c2 + 4 | 0;
          p2 = c2 + 8 | 0;
          q2 = 0;
          do {
            n[g2 + (q2 << 2) >> 2] = +n[j2 + 4 + (q2 * 12 | 0) >> 2] * +n[c2 >> 2] + +n[j2 + 4 + (q2 * 12 | 0) + 4 >> 2] * +n[o2 >> 2] + +n[j2 + 4 + (q2 * 12 | 0) + 8 >> 2] * +n[p2 >> 2];
            b[l2 + q2 >> 0] = q2;
            q2 = q2 + 1 | 0;
          } while ((q2 | 0) != (k2 | 0));
          if (m2) {
            q2 = 0;
            do {
              a: do
                if ((q2 | 0) > 0) {
                  p2 = q2;
                  r2 = +n[g2 + (q2 << 2) >> 2];
                  while (1) {
                    j2 = p2;
                    p2 = p2 + -1 | 0;
                    o2 = g2 + (p2 << 2) | 0;
                    t2 = +n[o2 >> 2];
                    if (!(r2 < t2)) break a;
                    c2 = g2 + (j2 << 2) | 0;
                    v2 = f[c2 >> 2] | 0;
                    n[c2 >> 2] = t2;
                    f[o2 >> 2] = v2;
                    o2 = l2 + j2 | 0;
                    c2 = l2 + p2 | 0;
                    w2 = b[o2 >> 0] | 0;
                    b[o2 >> 0] = b[c2 >> 0] | 0;
                    b[c2 >> 0] = w2;
                    if ((j2 | 0) <= 1) break;
                    else r2 = (f[s >> 2] = v2, +n[s >> 2]);
                  }
                }
              while (0);
              q2 = q2 + 1 | 0;
            } while ((q2 | 0) != (k2 | 0));
          }
        }
        b: do
          if ((d2 | 0) > 0) {
            if (m2) x2 = 0;
            else {
              y2 = 0;
              u = e2;
              return y2 | 0;
            }
            c: while (1) {
              q2 = (x2 << 4) + (a2 + 28) | 0;
              g2 = 0;
              while (1) {
                if ((b[l2 + g2 >> 0] | 0) != (b[q2 + g2 >> 0] | 0)) break;
                g2 = g2 + 1 | 0;
                if ((g2 | 0) >= (k2 | 0)) {
                  y2 = 0;
                  break c;
                }
              }
              x2 = x2 + 1 | 0;
              if ((x2 | 0) >= (d2 | 0)) break b;
            }
            u = e2;
            return y2 | 0;
          }
        while (0);
        d2 = f[i3 >> 2] | 0;
        i3 = a2 + 412 | 0;
        x2 = a2 + 416 | 0;
        g2 = a2 + 420 | 0;
        q2 = a2 + 424 | 0;
        f[i3 >> 2] = 0;
        f[i3 + 4 >> 2] = 0;
        f[i3 + 8 >> 2] = 0;
        f[i3 + 12 >> 2] = 0;
        if (m2) z2 = 0;
        else {
          y2 = 1;
          u = e2;
          return y2 | 0;
        }
        do {
          m2 = h[l2 + z2 >> 0] | 0;
          r2 = +n[d2 + 196 + (m2 << 2) >> 2];
          t2 = +n[d2 + 4 + (m2 * 12 | 0) >> 2] * r2;
          A2 = +n[d2 + 4 + (m2 * 12 | 0) + 4 >> 2] * r2;
          B2 = +n[d2 + 4 + (m2 * 12 | 0) + 8 >> 2] * r2;
          n[a2 + 156 + (z2 << 4) >> 2] = t2;
          n[a2 + 156 + (z2 << 4) + 4 >> 2] = A2;
          n[a2 + 156 + (z2 << 4) + 8 >> 2] = B2;
          n[a2 + 156 + (z2 << 4) + 12 >> 2] = r2;
          n[i3 >> 2] = t2 + +n[i3 >> 2];
          n[x2 >> 2] = A2 + +n[x2 >> 2];
          n[g2 >> 2] = B2 + +n[g2 >> 2];
          n[q2 >> 2] = r2 + +n[q2 >> 2];
          z2 = z2 + 1 | 0;
        } while ((z2 | 0) != (k2 | 0));
        y2 = 1;
        u = e2;
        return y2 | 0;
      }
      function Ya(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, h2 = 0;
        d2 = u;
        u = u + 48 | 0;
        e2 = d2 + 16 | 0;
        g2 = d2;
        ab(a2, b2, c2);
        f[a2 >> 2] = 128;
        c2 = a2 + 16 | 0;
        b2 = f[a2 + 8 >> 2] | 0;
        f[a2 + 12 >> 2] = b2 & 256 | 0 ? 8 : 1;
        n[a2 + 444 >> 2] = 34028234663852886e22;
        n[a2 + 448 >> 2] = 34028234663852886e22;
        n[a2 + 452 >> 2] = 34028234663852886e22;
        n[a2 + 456 >> 2] = 34028234663852886e22;
        h2 = (b2 & 32 | 0) == 0;
        n[a2 + 428 >> 2] = h2 ? 1 : 0.2125999927520752;
        n[a2 + 432 >> 2] = h2 ? 1 : 0.7152000069618225;
        n[a2 + 436 >> 2] = h2 ? 1 : 0.0722000002861023;
        n[a2 + 440 >> 2] = h2 ? 1 : 0;
        h2 = f[a2 + 4 >> 2] | 0;
        eb(e2, f[h2 >> 2] | 0, h2 + 4 | 0, h2 + 196 | 0);
        fb(g2, e2);
        f[c2 >> 2] = f[g2 >> 2];
        f[c2 + 4 >> 2] = f[g2 + 4 >> 2];
        f[c2 + 8 >> 2] = f[g2 + 8 >> 2];
        u = d2;
        return;
      }
      function Za(a2, c2, d2, e2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        var f2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R2 = 0, S2 = 0, T2 = 0;
        f2 = u;
        u = u + 16 | 0;
        g2 = f2;
        h2 = ~~(+n[a2 >> 2] * 31 + 0.5);
        i3 = ~~(+n[a2 + 4 >> 2] * 63 + 0.5);
        j2 = ~~(+n[a2 + 8 >> 2] * 31 + 0.5);
        a2 = ((i3 | 0) < 0 ? 0 : ((i3 | 0) < 63 ? i3 : 63) << 5) | ((h2 | 0) < 0 ? 0 : ((h2 | 0) < 31 ? h2 : 31) << 11) | ((j2 | 0) < 0 ? 0 : (j2 | 0) < 31 ? j2 : 31);
        j2 = ~~(+n[c2 >> 2] * 31 + 0.5);
        h2 = ~~(+n[c2 + 4 >> 2] * 63 + 0.5);
        i3 = ~~(+n[c2 + 8 >> 2] * 31 + 0.5);
        c2 = ((h2 | 0) < 0 ? 0 : ((h2 | 0) < 63 ? h2 : 63) << 5) | ((j2 | 0) < 0 ? 0 : ((j2 | 0) < 31 ? j2 : 31) << 11) | ((i3 | 0) < 0 ? 0 : (i3 | 0) < 31 ? i3 : 31);
        if ((a2 | 0) > (c2 | 0)) {
          i3 = b[d2 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              k2 = 1;
              break;
            }
            case 1: {
              k2 = 0;
              break;
            }
            default:
              k2 = i3;
          }
          b[g2 >> 0] = k2;
          i3 = b[d2 + 1 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              l2 = 1;
              break;
            }
            case 1: {
              l2 = 0;
              break;
            }
            default:
              l2 = i3;
          }
          b[g2 + 1 >> 0] = l2;
          i3 = b[d2 + 2 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              m2 = 1;
              break;
            }
            case 1: {
              m2 = 0;
              break;
            }
            default:
              m2 = i3;
          }
          b[g2 + 2 >> 0] = m2;
          i3 = b[d2 + 3 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              o2 = 1;
              break;
            }
            case 1: {
              o2 = 0;
              break;
            }
            default:
              o2 = i3;
          }
          b[g2 + 3 >> 0] = o2;
          i3 = b[d2 + 4 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              p2 = 1;
              break;
            }
            case 1: {
              p2 = 0;
              break;
            }
            default:
              p2 = i3;
          }
          b[g2 + 4 >> 0] = p2;
          i3 = b[d2 + 5 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              q2 = 1;
              break;
            }
            case 1: {
              q2 = 0;
              break;
            }
            default:
              q2 = i3;
          }
          b[g2 + 5 >> 0] = q2;
          i3 = b[d2 + 6 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              r2 = 1;
              break;
            }
            case 1: {
              r2 = 0;
              break;
            }
            default:
              r2 = i3;
          }
          b[g2 + 6 >> 0] = r2;
          i3 = b[d2 + 7 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              s2 = 1;
              break;
            }
            case 1: {
              s2 = 0;
              break;
            }
            default:
              s2 = i3;
          }
          b[g2 + 7 >> 0] = s2;
          i3 = b[d2 + 8 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              t2 = 1;
              break;
            }
            case 1: {
              t2 = 0;
              break;
            }
            default:
              t2 = i3;
          }
          b[g2 + 8 >> 0] = t2;
          i3 = b[d2 + 9 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              v2 = 1;
              break;
            }
            case 1: {
              v2 = 0;
              break;
            }
            default:
              v2 = i3;
          }
          b[g2 + 9 >> 0] = v2;
          i3 = b[d2 + 10 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              w2 = 1;
              break;
            }
            case 1: {
              w2 = 0;
              break;
            }
            default:
              w2 = i3;
          }
          b[g2 + 10 >> 0] = w2;
          i3 = b[d2 + 11 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              x2 = 1;
              break;
            }
            case 1: {
              x2 = 0;
              break;
            }
            default:
              x2 = i3;
          }
          b[g2 + 11 >> 0] = x2;
          i3 = b[d2 + 12 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              y2 = 1;
              break;
            }
            case 1: {
              y2 = 0;
              break;
            }
            default:
              y2 = i3;
          }
          b[g2 + 12 >> 0] = y2;
          i3 = b[d2 + 13 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              z2 = 1;
              break;
            }
            case 1: {
              z2 = 0;
              break;
            }
            default:
              z2 = i3;
          }
          b[g2 + 13 >> 0] = z2;
          i3 = b[d2 + 14 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              A2 = 1;
              break;
            }
            case 1: {
              A2 = 0;
              break;
            }
            default:
              A2 = i3;
          }
          b[g2 + 14 >> 0] = A2;
          i3 = b[d2 + 15 >> 0] | 0;
          switch (i3 << 24 >> 24) {
            case 0: {
              B2 = 1;
              break;
            }
            case 1: {
              B2 = 0;
              break;
            }
            default:
              B2 = i3;
          }
          b[g2 + 15 >> 0] = B2;
          C2 = a2;
          D2 = c2;
          E2 = y2;
          F2 = z2;
          G2 = A2;
          H2 = B2;
          I2 = k2;
          J2 = l2;
          K2 = m2;
          L2 = o2;
          M2 = p2;
          N2 = q2;
          O2 = r2;
          P2 = s2;
          Q2 = t2;
          R2 = v2;
          S2 = w2;
          T2 = x2;
        } else {
          x2 = g2;
          w2 = d2;
          d2 = x2 + 16 | 0;
          do {
            b[x2 >> 0] = b[w2 >> 0] | 0;
            x2 = x2 + 1 | 0;
            w2 = w2 + 1 | 0;
          } while ((x2 | 0) < (d2 | 0));
          C2 = c2;
          D2 = a2;
          E2 = b[g2 + 12 >> 0] | 0;
          F2 = b[g2 + 13 >> 0] | 0;
          G2 = b[g2 + 14 >> 0] | 0;
          H2 = b[g2 + 15 >> 0] | 0;
          I2 = b[g2 >> 0] | 0;
          J2 = b[g2 + 1 >> 0] | 0;
          K2 = b[g2 + 2 >> 0] | 0;
          L2 = b[g2 + 3 >> 0] | 0;
          M2 = b[g2 + 4 >> 0] | 0;
          N2 = b[g2 + 5 >> 0] | 0;
          O2 = b[g2 + 6 >> 0] | 0;
          P2 = b[g2 + 7 >> 0] | 0;
          Q2 = b[g2 + 8 >> 0] | 0;
          R2 = b[g2 + 9 >> 0] | 0;
          S2 = b[g2 + 10 >> 0] | 0;
          T2 = b[g2 + 11 >> 0] | 0;
        }
        b[e2 >> 0] = D2;
        b[e2 + 1 >> 0] = D2 >>> 8;
        b[e2 + 2 >> 0] = C2;
        b[e2 + 3 >> 0] = C2 >>> 8;
        b[e2 + 4 >> 0] = (J2 & 255) << 2 | I2 & 255 | (K2 & 255) << 4 | (L2 & 255) << 6;
        b[e2 + 5 >> 0] = (N2 & 255) << 2 | M2 & 255 | (O2 & 255) << 4 | (P2 & 255) << 6;
        b[e2 + 6 >> 0] = (R2 & 255) << 2 | Q2 & 255 | (S2 & 255) << 4 | (T2 & 255) << 6;
        b[e2 + 7 >> 0] = (F2 & 255) << 2 | E2 & 255 | (G2 & 255) << 4 | (H2 & 255) << 6;
        u = f2;
        return;
      }
      function _a(a2, c2, d2, e2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        var f2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R2 = 0, S2 = 0;
        f2 = u;
        u = u + 16 | 0;
        g2 = f2;
        h2 = ~~(+n[a2 >> 2] * 31 + 0.5);
        i3 = ~~(+n[a2 + 4 >> 2] * 63 + 0.5);
        j2 = ~~(+n[a2 + 8 >> 2] * 31 + 0.5);
        a2 = ((i3 | 0) < 0 ? 0 : ((i3 | 0) < 63 ? i3 : 63) << 5) | ((h2 | 0) < 0 ? 0 : ((h2 | 0) < 31 ? h2 : 31) << 11) | ((j2 | 0) < 0 ? 0 : (j2 | 0) < 31 ? j2 : 31);
        j2 = ~~(+n[c2 >> 2] * 31 + 0.5);
        h2 = ~~(+n[c2 + 4 >> 2] * 63 + 0.5);
        i3 = ~~(+n[c2 + 8 >> 2] * 31 + 0.5);
        c2 = ((h2 | 0) < 0 ? 0 : ((h2 | 0) < 63 ? h2 : 63) << 5) | ((j2 | 0) < 0 ? 0 : ((j2 | 0) < 31 ? j2 : 31) << 11) | ((i3 | 0) < 0 ? 0 : (i3 | 0) < 31 ? i3 : 31);
        do
          if ((a2 | 0) >= (c2 | 0)) if ((a2 | 0) == (c2 | 0)) {
            k2 = g2;
            l2 = k2 + 16 | 0;
            do {
              b[k2 >> 0] = 0;
              k2 = k2 + 1 | 0;
            } while ((k2 | 0) < (l2 | 0));
            m2 = a2;
            o2 = a2;
            p2 = 0;
            q2 = 0;
            r2 = 0;
            s2 = 0;
            t2 = 0;
            v2 = 0;
            w2 = 0;
            x2 = 0;
            y2 = 0;
            z2 = 0;
            A2 = 0;
            B2 = 0;
            C2 = 0;
            D2 = 0;
            E2 = 0;
            F2 = 0;
            break;
          } else {
            k2 = g2;
            i3 = d2;
            l2 = k2 + 16 | 0;
            do {
              b[k2 >> 0] = b[i3 >> 0] | 0;
              k2 = k2 + 1 | 0;
              i3 = i3 + 1 | 0;
            } while ((k2 | 0) < (l2 | 0));
            m2 = c2;
            o2 = a2;
            p2 = b[g2 >> 0] | 0;
            q2 = b[g2 + 1 >> 0] | 0;
            r2 = b[g2 + 2 >> 0] | 0;
            s2 = b[g2 + 3 >> 0] | 0;
            t2 = b[g2 + 4 >> 0] | 0;
            v2 = b[g2 + 5 >> 0] | 0;
            w2 = b[g2 + 6 >> 0] | 0;
            x2 = b[g2 + 7 >> 0] | 0;
            y2 = b[g2 + 8 >> 0] | 0;
            z2 = b[g2 + 9 >> 0] | 0;
            A2 = b[g2 + 10 >> 0] | 0;
            B2 = b[g2 + 11 >> 0] | 0;
            C2 = b[g2 + 12 >> 0] | 0;
            D2 = b[g2 + 13 >> 0] | 0;
            E2 = b[g2 + 14 >> 0] | 0;
            F2 = b[g2 + 15 >> 0] | 0;
            break;
          }
          else {
            i3 = b[d2 >> 0] & 3 ^ 1;
            b[g2 >> 0] = i3;
            j2 = b[d2 + 1 >> 0] & 3 ^ 1;
            b[g2 + 1 >> 0] = j2;
            h2 = b[d2 + 2 >> 0] & 3 ^ 1;
            b[g2 + 2 >> 0] = h2;
            G2 = b[d2 + 3 >> 0] & 3 ^ 1;
            b[g2 + 3 >> 0] = G2;
            H2 = b[d2 + 4 >> 0] & 3 ^ 1;
            b[g2 + 4 >> 0] = H2;
            I2 = b[d2 + 5 >> 0] & 3 ^ 1;
            b[g2 + 5 >> 0] = I2;
            J2 = b[d2 + 6 >> 0] & 3 ^ 1;
            b[g2 + 6 >> 0] = J2;
            K2 = b[d2 + 7 >> 0] & 3 ^ 1;
            b[g2 + 7 >> 0] = K2;
            L2 = b[d2 + 8 >> 0] & 3 ^ 1;
            b[g2 + 8 >> 0] = L2;
            M2 = b[d2 + 9 >> 0] & 3 ^ 1;
            b[g2 + 9 >> 0] = M2;
            N2 = b[d2 + 10 >> 0] & 3 ^ 1;
            b[g2 + 10 >> 0] = N2;
            O2 = b[d2 + 11 >> 0] & 3 ^ 1;
            b[g2 + 11 >> 0] = O2;
            P2 = b[d2 + 12 >> 0] & 3 ^ 1;
            b[g2 + 12 >> 0] = P2;
            Q2 = b[d2 + 13 >> 0] & 3 ^ 1;
            b[g2 + 13 >> 0] = Q2;
            R2 = b[d2 + 14 >> 0] & 3 ^ 1;
            b[g2 + 14 >> 0] = R2;
            S2 = b[d2 + 15 >> 0] & 3 ^ 1;
            b[g2 + 15 >> 0] = S2;
            m2 = a2;
            o2 = c2;
            p2 = i3;
            q2 = j2;
            r2 = h2;
            s2 = G2;
            t2 = H2;
            v2 = I2;
            w2 = J2;
            x2 = K2;
            y2 = L2;
            z2 = M2;
            A2 = N2;
            B2 = O2;
            C2 = P2;
            D2 = Q2;
            E2 = R2;
            F2 = S2;
          }
        while (0);
        b[e2 >> 0] = o2;
        b[e2 + 1 >> 0] = o2 >>> 8;
        b[e2 + 2 >> 0] = m2;
        b[e2 + 3 >> 0] = m2 >>> 8;
        b[e2 + 4 >> 0] = (q2 & 255) << 2 | p2 & 255 | (r2 & 255) << 4 | (s2 & 255) << 6;
        b[e2 + 5 >> 0] = (v2 & 255) << 2 | t2 & 255 | (w2 & 255) << 4 | (x2 & 255) << 6;
        b[e2 + 6 >> 0] = (z2 & 255) << 2 | y2 & 255 | (A2 & 255) << 4 | (B2 & 255) << 6;
        b[e2 + 7 >> 0] = (D2 & 255) << 2 | C2 & 255 | (E2 & 255) << 4 | (F2 & 255) << 6;
        u = f2;
        return;
      }
      function $a(a2, c2, d2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, f2 = 0, g2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0;
        e2 = u;
        u = u + 32 | 0;
        f2 = e2 + 16 | 0;
        g2 = e2;
        i3 = b[c2 + 1 >> 0] | 0;
        j2 = h[c2 >> 0] | 0;
        k2 = i3 & 255;
        l2 = k2 << 8 | j2;
        m2 = (i3 & 255) >>> 3;
        i3 = m2 << 3 & 255 | (m2 & 255) >>> 2;
        b[f2 >> 0] = i3;
        m2 = l2 >>> 5 << 2 | k2 >>> 1 & 3;
        b[f2 + 1 >> 0] = m2;
        k2 = j2 >>> 2 & 7 | j2 << 3;
        b[f2 + 2 >> 0] = k2;
        b[f2 + 3 >> 0] = -1;
        j2 = b[c2 + 3 >> 0] | 0;
        n2 = h[c2 + 2 >> 0] | 0;
        o2 = j2 & 255;
        p2 = o2 << 8 | n2;
        q2 = (j2 & 255) >>> 3;
        j2 = q2 << 3 & 255 | (q2 & 255) >>> 2;
        b[f2 + 4 >> 0] = j2;
        q2 = p2 >>> 5 << 2 | o2 >>> 1 & 3;
        b[f2 + 5 >> 0] = q2;
        o2 = n2 >>> 2 & 7 | n2 << 3;
        b[f2 + 6 >> 0] = o2;
        b[f2 + 7 >> 0] = -1;
        n2 = l2 >>> 0 > p2 >>> 0 | d2 ^ 1;
        if (n2) {
          b[f2 + 8 >> 0] = (((i3 << 1) + j2 | 0) >>> 0) / 3 | 0;
          b[f2 + 12 >> 0] = (((j2 << 1) + i3 | 0) >>> 0) / 3 | 0;
          d2 = m2 & 255;
          p2 = q2 & 255;
          b[f2 + 9 >> 0] = (((d2 << 1) + p2 | 0) >>> 0) / 3 | 0;
          b[f2 + 13 >> 0] = (((p2 << 1) + d2 | 0) >>> 0) / 3 | 0;
          d2 = k2 & 255;
          p2 = o2 & 255;
          b[f2 + 10 >> 0] = (((d2 << 1) + p2 | 0) >>> 0) / 3 | 0;
          r2 = ((((p2 << 1) + d2 | 0) >>> 0) / 3 | 0) & 255;
        } else {
          b[f2 + 8 >> 0] = (j2 + i3 | 0) >>> 1;
          b[f2 + 12 >> 0] = 0;
          b[f2 + 9 >> 0] = ((q2 & 255) + (m2 & 255) | 0) >>> 1;
          b[f2 + 13 >> 0] = 0;
          b[f2 + 10 >> 0] = ((o2 & 255) + (k2 & 255) | 0) >>> 1;
          r2 = 0;
        }
        b[f2 + 14 >> 0] = r2;
        b[f2 + 11 >> 0] = -1;
        b[f2 + 15 >> 0] = n2 << 31 >> 31;
        n2 = b[c2 + 4 >> 0] | 0;
        r2 = n2 & 255;
        k2 = r2 & 3;
        b[g2 >> 0] = k2;
        o2 = r2 >>> 2 & 3;
        b[g2 + 1 >> 0] = o2;
        m2 = r2 >>> 4 & 3;
        b[g2 + 2 >> 0] = m2;
        r2 = (n2 & 255) >>> 6;
        b[g2 + 3 >> 0] = r2;
        n2 = b[c2 + 5 >> 0] | 0;
        q2 = n2 & 255;
        i3 = q2 & 3;
        b[g2 + 4 >> 0] = i3;
        j2 = q2 >>> 2 & 3;
        b[g2 + 5 >> 0] = j2;
        d2 = q2 >>> 4 & 3;
        b[g2 + 6 >> 0] = d2;
        q2 = (n2 & 255) >>> 6;
        b[g2 + 7 >> 0] = q2;
        n2 = b[c2 + 6 >> 0] | 0;
        p2 = n2 & 255;
        l2 = p2 & 3;
        b[g2 + 8 >> 0] = l2;
        s2 = p2 >>> 2 & 3;
        b[g2 + 9 >> 0] = s2;
        t2 = p2 >>> 4 & 3;
        b[g2 + 10 >> 0] = t2;
        p2 = (n2 & 255) >>> 6;
        b[g2 + 11 >> 0] = p2;
        n2 = b[c2 + 7 >> 0] | 0;
        c2 = n2 & 255;
        v2 = c2 & 3;
        b[g2 + 12 >> 0] = v2;
        w2 = c2 >>> 2 & 3;
        b[g2 + 13 >> 0] = w2;
        x2 = c2 >>> 4 & 3;
        b[g2 + 14 >> 0] = x2;
        b[g2 + 15 >> 0] = (n2 & 255) >>> 6;
        n2 = f2 + (k2 << 2) | 0;
        k2 = h[n2 >> 0] | h[n2 + 1 >> 0] << 8 | h[n2 + 2 >> 0] << 16 | h[n2 + 3 >> 0] << 24;
        b[a2 >> 0] = k2;
        b[a2 + 1 >> 0] = k2 >> 8;
        b[a2 + 2 >> 0] = k2 >> 16;
        b[a2 + 3 >> 0] = k2 >> 24;
        k2 = a2 + 4 | 0;
        n2 = f2 + (o2 << 2) | 0;
        o2 = h[n2 >> 0] | h[n2 + 1 >> 0] << 8 | h[n2 + 2 >> 0] << 16 | h[n2 + 3 >> 0] << 24;
        b[k2 >> 0] = o2;
        b[k2 + 1 >> 0] = o2 >> 8;
        b[k2 + 2 >> 0] = o2 >> 16;
        b[k2 + 3 >> 0] = o2 >> 24;
        o2 = a2 + 8 | 0;
        k2 = f2 + (m2 << 2) | 0;
        m2 = h[k2 >> 0] | h[k2 + 1 >> 0] << 8 | h[k2 + 2 >> 0] << 16 | h[k2 + 3 >> 0] << 24;
        b[o2 >> 0] = m2;
        b[o2 + 1 >> 0] = m2 >> 8;
        b[o2 + 2 >> 0] = m2 >> 16;
        b[o2 + 3 >> 0] = m2 >> 24;
        m2 = a2 + 12 | 0;
        o2 = f2 + (r2 << 2 & 255) | 0;
        r2 = h[o2 >> 0] | h[o2 + 1 >> 0] << 8 | h[o2 + 2 >> 0] << 16 | h[o2 + 3 >> 0] << 24;
        b[m2 >> 0] = r2;
        b[m2 + 1 >> 0] = r2 >> 8;
        b[m2 + 2 >> 0] = r2 >> 16;
        b[m2 + 3 >> 0] = r2 >> 24;
        r2 = a2 + 16 | 0;
        m2 = f2 + (i3 << 2) | 0;
        i3 = h[m2 >> 0] | h[m2 + 1 >> 0] << 8 | h[m2 + 2 >> 0] << 16 | h[m2 + 3 >> 0] << 24;
        b[r2 >> 0] = i3;
        b[r2 + 1 >> 0] = i3 >> 8;
        b[r2 + 2 >> 0] = i3 >> 16;
        b[r2 + 3 >> 0] = i3 >> 24;
        i3 = a2 + 20 | 0;
        r2 = f2 + (j2 << 2) | 0;
        j2 = h[r2 >> 0] | h[r2 + 1 >> 0] << 8 | h[r2 + 2 >> 0] << 16 | h[r2 + 3 >> 0] << 24;
        b[i3 >> 0] = j2;
        b[i3 + 1 >> 0] = j2 >> 8;
        b[i3 + 2 >> 0] = j2 >> 16;
        b[i3 + 3 >> 0] = j2 >> 24;
        j2 = a2 + 24 | 0;
        i3 = f2 + (d2 << 2) | 0;
        d2 = h[i3 >> 0] | h[i3 + 1 >> 0] << 8 | h[i3 + 2 >> 0] << 16 | h[i3 + 3 >> 0] << 24;
        b[j2 >> 0] = d2;
        b[j2 + 1 >> 0] = d2 >> 8;
        b[j2 + 2 >> 0] = d2 >> 16;
        b[j2 + 3 >> 0] = d2 >> 24;
        d2 = a2 + 28 | 0;
        j2 = f2 + (q2 << 2 & 255) | 0;
        q2 = h[j2 >> 0] | h[j2 + 1 >> 0] << 8 | h[j2 + 2 >> 0] << 16 | h[j2 + 3 >> 0] << 24;
        b[d2 >> 0] = q2;
        b[d2 + 1 >> 0] = q2 >> 8;
        b[d2 + 2 >> 0] = q2 >> 16;
        b[d2 + 3 >> 0] = q2 >> 24;
        q2 = a2 + 32 | 0;
        d2 = f2 + (l2 << 2) | 0;
        l2 = h[d2 >> 0] | h[d2 + 1 >> 0] << 8 | h[d2 + 2 >> 0] << 16 | h[d2 + 3 >> 0] << 24;
        b[q2 >> 0] = l2;
        b[q2 + 1 >> 0] = l2 >> 8;
        b[q2 + 2 >> 0] = l2 >> 16;
        b[q2 + 3 >> 0] = l2 >> 24;
        l2 = a2 + 36 | 0;
        q2 = f2 + (s2 << 2) | 0;
        s2 = h[q2 >> 0] | h[q2 + 1 >> 0] << 8 | h[q2 + 2 >> 0] << 16 | h[q2 + 3 >> 0] << 24;
        b[l2 >> 0] = s2;
        b[l2 + 1 >> 0] = s2 >> 8;
        b[l2 + 2 >> 0] = s2 >> 16;
        b[l2 + 3 >> 0] = s2 >> 24;
        s2 = a2 + 40 | 0;
        l2 = f2 + (t2 << 2) | 0;
        t2 = h[l2 >> 0] | h[l2 + 1 >> 0] << 8 | h[l2 + 2 >> 0] << 16 | h[l2 + 3 >> 0] << 24;
        b[s2 >> 0] = t2;
        b[s2 + 1 >> 0] = t2 >> 8;
        b[s2 + 2 >> 0] = t2 >> 16;
        b[s2 + 3 >> 0] = t2 >> 24;
        t2 = a2 + 44 | 0;
        s2 = f2 + (p2 << 2 & 255) | 0;
        p2 = h[s2 >> 0] | h[s2 + 1 >> 0] << 8 | h[s2 + 2 >> 0] << 16 | h[s2 + 3 >> 0] << 24;
        b[t2 >> 0] = p2;
        b[t2 + 1 >> 0] = p2 >> 8;
        b[t2 + 2 >> 0] = p2 >> 16;
        b[t2 + 3 >> 0] = p2 >> 24;
        p2 = a2 + 48 | 0;
        t2 = f2 + (v2 << 2) | 0;
        v2 = h[t2 >> 0] | h[t2 + 1 >> 0] << 8 | h[t2 + 2 >> 0] << 16 | h[t2 + 3 >> 0] << 24;
        b[p2 >> 0] = v2;
        b[p2 + 1 >> 0] = v2 >> 8;
        b[p2 + 2 >> 0] = v2 >> 16;
        b[p2 + 3 >> 0] = v2 >> 24;
        v2 = a2 + 52 | 0;
        p2 = f2 + (w2 << 2) | 0;
        w2 = h[p2 >> 0] | h[p2 + 1 >> 0] << 8 | h[p2 + 2 >> 0] << 16 | h[p2 + 3 >> 0] << 24;
        b[v2 >> 0] = w2;
        b[v2 + 1 >> 0] = w2 >> 8;
        b[v2 + 2 >> 0] = w2 >> 16;
        b[v2 + 3 >> 0] = w2 >> 24;
        w2 = a2 + 56 | 0;
        v2 = f2 + (x2 << 2) | 0;
        x2 = h[v2 >> 0] | h[v2 + 1 >> 0] << 8 | h[v2 + 2 >> 0] << 16 | h[v2 + 3 >> 0] << 24;
        b[w2 >> 0] = x2;
        b[w2 + 1 >> 0] = x2 >> 8;
        b[w2 + 2 >> 0] = x2 >> 16;
        b[w2 + 3 >> 0] = x2 >> 24;
        x2 = a2 + 60 | 0;
        a2 = f2 + ((h[g2 + 15 >> 0] | 0) << 2 & 252) | 0;
        g2 = h[a2 >> 0] | h[a2 + 1 >> 0] << 8 | h[a2 + 2 >> 0] << 16 | h[a2 + 3 >> 0] << 24;
        b[x2 >> 0] = g2;
        b[x2 + 1 >> 0] = g2 >> 8;
        b[x2 + 2 >> 0] = g2 >> 16;
        b[x2 + 3 >> 0] = g2 >> 24;
        u = e2;
        return;
      }
      function ab(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        f[a2 >> 2] = 144;
        f[a2 + 4 >> 2] = b2;
        f[a2 + 8 >> 2] = c2;
        return;
      }
      function bb(a2, c2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        var d2 = 0;
        d2 = f[a2 >> 2] | 0;
        if (!(f[a2 + 8 >> 2] & 1)) {
          Ea[f[d2 + 4 >> 2] & 7](a2, c2);
          return;
        }
        Ea[f[d2 >> 2] & 7](a2, c2);
        if (b[(f[a2 + 4 >> 2] | 0) + 324 >> 0] | 0) return;
        Ea[f[(f[a2 >> 2] | 0) + 4 >> 2] & 7](a2, c2);
        return;
      }
      function cb(a2, c2, d2, e2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        var g2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0;
        f[a2 >> 2] = 0;
        g2 = a2 + 324 | 0;
        b[g2 >> 0] = 0;
        i3 = (e2 & 1 | 0) != 0;
        j2 = (e2 & 128 | 0) != 0;
        e2 = 0;
        do {
          a: do
            if (!(1 << e2 & d2)) f[a2 + 260 + (e2 << 2) >> 2] = -1;
            else {
              if (i3 ? (b[c2 + (e2 << 2 | 3) >> 0] | 0) > -1 : 0) {
                f[a2 + 260 + (e2 << 2) >> 2] = -1;
                b[g2 >> 0] = 1;
                break;
              }
              k2 = e2 << 2;
              l2 = c2 + k2 | 0;
              m2 = c2 + (k2 | 1) | 0;
              o2 = c2 + (k2 | 2) | 0;
              b: do
                if (!e2) p2 = 0;
                else {
                  c: do
                    if (i3) {
                      q2 = 0;
                      while (1) {
                        if ((((1 << q2 & d2 | 0 ? (r2 = q2 << 2, (b[l2 >> 0] | 0) == (b[c2 + r2 >> 0] | 0)) : 0) ? (b[m2 >> 0] | 0) == (b[c2 + (r2 | 1) >> 0] | 0) : 0) ? (b[o2 >> 0] | 0) == (b[c2 + (r2 | 2) >> 0] | 0) : 0) ? (b[c2 + (r2 | 3) >> 0] | 0) < 0 : 0) {
                          s2 = q2;
                          break c;
                        }
                        q2 = q2 + 1 | 0;
                        if ((q2 | 0) == (e2 | 0)) {
                          p2 = k2;
                          break b;
                        }
                      }
                    } else {
                      q2 = 0;
                      while (1) {
                        if (((1 << q2 & d2 | 0 ? (r2 = q2 << 2, (b[l2 >> 0] | 0) == (b[c2 + r2 >> 0] | 0)) : 0) ? (b[m2 >> 0] | 0) == (b[c2 + (r2 | 1) >> 0] | 0) : 0) ? (b[o2 >> 0] | 0) == (b[c2 + (r2 | 2) >> 0] | 0) : 0) {
                          s2 = q2;
                          break c;
                        }
                        q2 = q2 + 1 | 0;
                        if ((q2 | 0) == (e2 | 0)) {
                          p2 = k2;
                          break b;
                        }
                      }
                    }
                  while (0);
                  q2 = f[a2 + 260 + (s2 << 2) >> 2] | 0;
                  r2 = a2 + 196 + (q2 << 2) | 0;
                  n[r2 >> 2] = +n[r2 >> 2] + (j2 ? +((h[c2 + (k2 | 3) >> 0] | 0) + 1 | 0) * 390625e-8 : 1);
                  f[a2 + 260 + (e2 << 2) >> 2] = q2;
                  break a;
                }
              while (0);
              t2 = +(h[m2 >> 0] | 0) / 255;
              u2 = +(h[o2 >> 0] | 0) / 255;
              v2 = +((h[c2 + (p2 | 3) >> 0] | 0) + 1 | 0) * 390625e-8;
              k2 = f[a2 >> 2] | 0;
              n[a2 + 4 + (k2 * 12 | 0) >> 2] = +(h[l2 >> 0] | 0) / 255;
              n[a2 + 4 + (k2 * 12 | 0) + 4 >> 2] = t2;
              n[a2 + 4 + (k2 * 12 | 0) + 8 >> 2] = u2;
              n[a2 + 196 + (f[a2 >> 2] << 2) >> 2] = j2 ? v2 : 1;
              f[a2 + 260 + (e2 << 2) >> 2] = f[a2 >> 2];
              f[a2 >> 2] = (f[a2 >> 2] | 0) + 1;
            }
          while (0);
          e2 = e2 + 1 | 0;
        } while ((e2 | 0) != 16);
        if ((f[a2 >> 2] | 0) > 0) w2 = 0;
        else return;
        do {
          e2 = a2 + 196 + (w2 << 2) | 0;
          v2 = +K(+ +n[e2 >> 2]);
          n[e2 >> 2] = v2;
          w2 = w2 + 1 | 0;
        } while ((w2 | 0) < (f[a2 >> 2] | 0));
        return;
      }
      function db(a2, c2, d2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0;
        e2 = f[a2 + 260 >> 2] | 0;
        if ((e2 | 0) == -1) g2 = 3;
        else g2 = b[c2 + e2 >> 0] | 0;
        b[d2 >> 0] = g2;
        g2 = f[a2 + 264 >> 2] | 0;
        if ((g2 | 0) == -1) h2 = 3;
        else h2 = b[c2 + g2 >> 0] | 0;
        b[d2 + 1 >> 0] = h2;
        h2 = f[a2 + 268 >> 2] | 0;
        if ((h2 | 0) == -1) i3 = 3;
        else i3 = b[c2 + h2 >> 0] | 0;
        b[d2 + 2 >> 0] = i3;
        i3 = f[a2 + 272 >> 2] | 0;
        if ((i3 | 0) == -1) j2 = 3;
        else j2 = b[c2 + i3 >> 0] | 0;
        b[d2 + 3 >> 0] = j2;
        j2 = f[a2 + 276 >> 2] | 0;
        if ((j2 | 0) == -1) k2 = 3;
        else k2 = b[c2 + j2 >> 0] | 0;
        b[d2 + 4 >> 0] = k2;
        k2 = f[a2 + 280 >> 2] | 0;
        if ((k2 | 0) == -1) l2 = 3;
        else l2 = b[c2 + k2 >> 0] | 0;
        b[d2 + 5 >> 0] = l2;
        l2 = f[a2 + 284 >> 2] | 0;
        if ((l2 | 0) == -1) m2 = 3;
        else m2 = b[c2 + l2 >> 0] | 0;
        b[d2 + 6 >> 0] = m2;
        m2 = f[a2 + 288 >> 2] | 0;
        if ((m2 | 0) == -1) n2 = 3;
        else n2 = b[c2 + m2 >> 0] | 0;
        b[d2 + 7 >> 0] = n2;
        n2 = f[a2 + 292 >> 2] | 0;
        if ((n2 | 0) == -1) o2 = 3;
        else o2 = b[c2 + n2 >> 0] | 0;
        b[d2 + 8 >> 0] = o2;
        o2 = f[a2 + 296 >> 2] | 0;
        if ((o2 | 0) == -1) p2 = 3;
        else p2 = b[c2 + o2 >> 0] | 0;
        b[d2 + 9 >> 0] = p2;
        p2 = f[a2 + 300 >> 2] | 0;
        if ((p2 | 0) == -1) q2 = 3;
        else q2 = b[c2 + p2 >> 0] | 0;
        b[d2 + 10 >> 0] = q2;
        q2 = f[a2 + 304 >> 2] | 0;
        if ((q2 | 0) == -1) r2 = 3;
        else r2 = b[c2 + q2 >> 0] | 0;
        b[d2 + 11 >> 0] = r2;
        r2 = f[a2 + 308 >> 2] | 0;
        if ((r2 | 0) == -1) s2 = 3;
        else s2 = b[c2 + r2 >> 0] | 0;
        b[d2 + 12 >> 0] = s2;
        s2 = f[a2 + 312 >> 2] | 0;
        if ((s2 | 0) == -1) t2 = 3;
        else t2 = b[c2 + s2 >> 0] | 0;
        b[d2 + 13 >> 0] = t2;
        t2 = f[a2 + 316 >> 2] | 0;
        if ((t2 | 0) == -1) u2 = 3;
        else u2 = b[c2 + t2 >> 0] | 0;
        b[d2 + 14 >> 0] = u2;
        u2 = f[a2 + 320 >> 2] | 0;
        if ((u2 | 0) == -1) {
          v2 = 3;
          w2 = d2 + 15 | 0;
          b[w2 >> 0] = v2;
          return;
        }
        v2 = b[c2 + u2 >> 0] | 0;
        w2 = d2 + 15 | 0;
        b[w2 >> 0] = v2;
        return;
      }
      function eb(a2, b2, c2, d2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0;
        e2 = (b2 | 0) > 0;
        if (e2) {
          g2 = 0;
          h2 = 0;
          i3 = 0;
          j2 = 0;
          k2 = 0;
          while (1) {
            l2 = +n[d2 + (g2 << 2) >> 2];
            m2 = h2 + l2;
            o2 = i3 + l2 * +n[c2 + (g2 * 12 | 0) >> 2];
            p2 = k2 + l2 * +n[c2 + (g2 * 12 | 0) + 4 >> 2];
            q2 = j2 + l2 * +n[c2 + (g2 * 12 | 0) + 8 >> 2];
            g2 = g2 + 1 | 0;
            if ((g2 | 0) == (b2 | 0)) {
              r2 = m2;
              s2 = o2;
              t2 = q2;
              u2 = p2;
              break;
            } else {
              h2 = m2;
              i3 = o2;
              j2 = q2;
              k2 = p2;
            }
          }
        } else {
          r2 = 0;
          s2 = 0;
          t2 = 0;
          u2 = 0;
        }
        k2 = 1 / r2;
        r2 = s2 * k2;
        s2 = u2 * k2;
        u2 = t2 * k2;
        g2 = a2 + 4 | 0;
        v2 = a2 + 8 | 0;
        w2 = a2 + 12 | 0;
        x2 = a2 + 16 | 0;
        y2 = a2 + 20 | 0;
        f[a2 >> 2] = 0;
        f[a2 + 4 >> 2] = 0;
        f[a2 + 8 >> 2] = 0;
        f[a2 + 12 >> 2] = 0;
        f[a2 + 16 >> 2] = 0;
        f[a2 + 20 >> 2] = 0;
        if (e2) {
          z2 = 0;
          A2 = 0;
          B2 = 0;
          C2 = 0;
          D2 = 0;
          E2 = 0;
          F2 = 0;
        } else return;
        do {
          k2 = +n[c2 + (z2 * 12 | 0) >> 2] - r2;
          t2 = +n[c2 + (z2 * 12 | 0) + 4 >> 2] - s2;
          j2 = +n[c2 + (z2 * 12 | 0) + 8 >> 2] - u2;
          i3 = +n[d2 + (z2 << 2) >> 2];
          h2 = t2 * i3;
          p2 = j2 * i3;
          A2 = A2 + k2 * (k2 * i3);
          B2 = k2 * h2 + B2;
          C2 = k2 * p2 + C2;
          D2 = t2 * h2 + D2;
          E2 = t2 * p2 + E2;
          F2 = j2 * p2 + F2;
          z2 = z2 + 1 | 0;
        } while ((z2 | 0) != (b2 | 0));
        n[a2 >> 2] = A2;
        n[g2 >> 2] = B2;
        n[v2 >> 2] = C2;
        n[w2 >> 2] = D2;
        n[x2 >> 2] = E2;
        n[y2 >> 2] = F2;
        return;
      }
      function fb(a2, b2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        var c2 = 0, d2 = 0, e2 = 0, f2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0;
        c2 = +n[b2 >> 2];
        d2 = +n[b2 + 12 >> 2];
        e2 = c2 * d2;
        f2 = +n[b2 + 20 >> 2];
        g2 = +n[b2 + 4 >> 2];
        h2 = +n[b2 + 8 >> 2];
        i3 = +n[b2 + 16 >> 2];
        j2 = d2 * f2 + (e2 + c2 * f2) - g2 * g2 - h2 * h2 - i3 * i3;
        k2 = c2 + d2 + f2;
        l2 = k2 * 0.3333333432674408;
        m2 = j2 - k2 * l2;
        o2 = k2 * (k2 * (k2 * -0.07407407462596893)) + k2 * (j2 * 0.3333333432674408) - (e2 * f2 + g2 * 2 * h2 * i3 - i3 * (c2 * i3) - h2 * (d2 * h2) - g2 * (f2 * g2));
        e2 = o2 * (o2 * 0.25);
        j2 = m2 * (m2 * (m2 * 0.03703703731298447)) + e2;
        if (j2 > 11920928955078125e-23) {
          n[a2 >> 2] = 1;
          n[a2 + 4 >> 2] = 1;
          n[a2 + 8 >> 2] = 1;
          return;
        }
        if (j2 < -11920928955078125e-23) {
          m2 = +L(+ +K(+(e2 - j2)), 0.3333333432674408);
          e2 = +S(+ +K(+-j2), +(o2 * -0.5)) / 3;
          j2 = +M(+e2);
          k2 = l2 + m2 * 2 * j2;
          p2 = +N(+e2) * 1.7320507764816284;
          e2 = l2 - m2 * (j2 + p2);
          q2 = l2 - m2 * (j2 - p2);
          r2 = +J(+e2) > +J(+k2);
          p2 = r2 ? e2 : k2;
          r2 = +J(+q2) > +J(+p2);
          gb(a2, b2, r2 ? q2 : p2);
          return;
        }
        if (o2 < 0) s2 = -+L(+(o2 * -0.5), 0.3333333432674408);
        else s2 = +L(+(o2 * 0.5), 0.3333333432674408);
        o2 = l2 + s2;
        p2 = l2 - s2 * 2;
        if (!(+J(+o2) > +J(+p2))) {
          gb(a2, b2, p2);
          return;
        }
        p2 = c2 - o2;
        c2 = d2 - o2;
        d2 = f2 - o2;
        o2 = +J(+p2);
        f2 = +J(+g2);
        b2 = f2 > o2;
        s2 = b2 ? f2 : o2;
        o2 = +J(+h2);
        r2 = o2 > s2;
        f2 = r2 ? o2 : s2;
        s2 = +J(+c2);
        t2 = s2 > f2;
        o2 = t2 ? s2 : f2;
        f2 = +J(+i3);
        u2 = f2 > o2;
        v2 = +J(+d2) > (u2 ? f2 : o2);
        switch ((v2 ? 5 : u2 ? 4 : t2 ? 3 : r2 ? 2 : b2 & 1) & 7) {
          case 1:
          case 0: {
            w2 = 0;
            x2 = p2;
            y2 = -g2;
            break;
          }
          case 2: {
            w2 = -p2;
            x2 = 0;
            y2 = h2;
            break;
          }
          case 4:
          case 3: {
            w2 = c2;
            x2 = -i3;
            y2 = 0;
            break;
          }
          default: {
            w2 = i3;
            x2 = -d2;
            y2 = 0;
          }
        }
        n[a2 >> 2] = y2;
        n[a2 + 4 >> 2] = x2;
        n[a2 + 8 >> 2] = w2;
        return;
      }
      function gb(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = +c2;
        var d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0;
        d2 = u;
        u = u + 32 | 0;
        e2 = d2;
        g2 = +n[b2 >> 2] - c2;
        h2 = +n[b2 + 4 >> 2];
        i3 = +n[b2 + 8 >> 2];
        j2 = +n[b2 + 12 >> 2] - c2;
        k2 = +n[b2 + 16 >> 2];
        l2 = +n[b2 + 20 >> 2] - c2;
        c2 = j2 * l2 - k2 * k2;
        n[e2 >> 2] = c2;
        m2 = i3 * k2 - h2 * l2;
        b2 = e2 + 4 | 0;
        n[b2 >> 2] = m2;
        o2 = h2 * k2 - i3 * j2;
        p2 = e2 + 8 | 0;
        n[p2 >> 2] = o2;
        q2 = g2 * l2 - i3 * i3;
        r2 = e2 + 12 | 0;
        n[r2 >> 2] = q2;
        l2 = h2 * i3 - g2 * k2;
        s2 = e2 + 16 | 0;
        n[s2 >> 2] = l2;
        k2 = g2 * j2 - h2 * h2;
        t2 = e2 + 20 | 0;
        n[t2 >> 2] = k2;
        h2 = +J(+c2);
        c2 = +J(+m2);
        v2 = c2 > h2;
        m2 = v2 ? c2 : h2;
        h2 = +J(+o2);
        w2 = h2 > m2;
        o2 = w2 ? h2 : m2;
        m2 = +J(+q2);
        x2 = m2 > o2;
        q2 = x2 ? m2 : o2;
        o2 = +J(+l2);
        y2 = o2 > q2;
        z2 = +J(+k2) > (y2 ? o2 : q2);
        switch ((z2 ? 5 : y2 ? 4 : x2 ? 3 : w2 ? 2 : v2 & 1) & 7) {
          case 0: {
            A2 = b2;
            B2 = p2;
            C2 = e2;
            break;
          }
          case 3:
          case 1: {
            A2 = r2;
            B2 = s2;
            C2 = b2;
            break;
          }
          default: {
            A2 = s2;
            B2 = t2;
            C2 = p2;
          }
        }
        p2 = f[A2 >> 2] | 0;
        A2 = f[B2 >> 2] | 0;
        f[a2 >> 2] = f[C2 >> 2];
        f[a2 + 4 >> 2] = p2;
        f[a2 + 8 >> 2] = A2;
        u = d2;
        return;
      }
      function hb(a2, c2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0;
        d2 = u;
        u = u + 80 | 0;
        e2 = d2;
        g2 = d2 + 56 | 0;
        h2 = d2 + 40 | 0;
        i3 = f[a2 + 4 >> 2] | 0;
        j2 = f[i3 >> 2] | 0;
        k2 = a2 + 24 | 0;
        f[e2 >> 2] = f[k2 >> 2];
        f[e2 + 4 >> 2] = f[k2 + 4 >> 2];
        f[e2 + 8 >> 2] = f[k2 + 8 >> 2];
        l2 = a2 + 36 | 0;
        m2 = e2 + 12 | 0;
        f[m2 >> 2] = f[l2 >> 2];
        f[m2 + 4 >> 2] = f[l2 + 4 >> 2];
        f[m2 + 8 >> 2] = f[l2 + 8 >> 2];
        o2 = +n[k2 >> 2] * 0.5 + +n[l2 >> 2] * 0.5;
        p2 = +n[a2 + 28 >> 2] * 0.5 + +n[a2 + 40 >> 2] * 0.5;
        q2 = +n[a2 + 32 >> 2] * 0.5 + +n[a2 + 44 >> 2] * 0.5;
        n[e2 + 24 >> 2] = o2;
        n[e2 + 28 >> 2] = p2;
        n[e2 + 32 >> 2] = q2;
        if ((j2 | 0) > 0) {
          r2 = +n[a2 + 12 >> 2];
          s2 = +n[a2 + 16 >> 2];
          t2 = +n[a2 + 20 >> 2];
          v2 = +n[e2 >> 2];
          w2 = +n[e2 + 4 >> 2];
          x2 = +n[e2 + 8 >> 2];
          y2 = +n[e2 + 12 >> 2];
          z2 = +n[e2 + 16 >> 2];
          A2 = +n[e2 + 20 >> 2];
          B2 = 0;
          e2 = 0;
          while (1) {
            C2 = +n[i3 + 4 + (e2 * 12 | 0) >> 2];
            D2 = +n[i3 + 4 + (e2 * 12 | 0) + 4 >> 2];
            E2 = +n[i3 + 4 + (e2 * 12 | 0) + 8 >> 2];
            F2 = (C2 - v2) * r2;
            G2 = (D2 - w2) * s2;
            H2 = (E2 - x2) * t2;
            I2 = F2 * F2 + G2 * G2 + H2 * H2;
            H2 = I2 < 34028234663852886e22 ? I2 : 34028234663852886e22;
            I2 = (C2 - y2) * r2;
            G2 = (D2 - z2) * s2;
            F2 = (E2 - A2) * t2;
            J2 = I2 * I2 + G2 * G2 + F2 * F2;
            m2 = J2 < H2;
            F2 = m2 ? J2 : H2;
            H2 = (C2 - o2) * r2;
            C2 = (D2 - p2) * s2;
            D2 = (E2 - q2) * t2;
            E2 = H2 * H2 + C2 * C2 + D2 * D2;
            K2 = E2 < F2;
            b[g2 + e2 >> 0] = K2 ? 2 : m2 & 1;
            D2 = B2 + (K2 ? E2 : F2);
            e2 = e2 + 1 | 0;
            if ((e2 | 0) == (j2 | 0)) {
              L2 = D2;
              break;
            } else B2 = D2;
          }
        } else L2 = 0;
        j2 = a2 + 48 | 0;
        if (!(L2 < +n[j2 >> 2])) {
          u = d2;
          return;
        }
        db(i3, g2, h2);
        Za(k2, l2, h2, c2);
        n[j2 >> 2] = L2;
        u = d2;
        return;
      }
      function ib(a2, c2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0;
        d2 = u;
        u = u + 80 | 0;
        e2 = d2;
        g2 = d2 + 64 | 0;
        h2 = d2 + 48 | 0;
        i3 = f[a2 + 4 >> 2] | 0;
        j2 = f[i3 >> 2] | 0;
        k2 = a2 + 24 | 0;
        f[e2 >> 2] = f[k2 >> 2];
        f[e2 + 4 >> 2] = f[k2 + 4 >> 2];
        f[e2 + 8 >> 2] = f[k2 + 8 >> 2];
        l2 = a2 + 36 | 0;
        m2 = e2 + 12 | 0;
        f[m2 >> 2] = f[l2 >> 2];
        f[m2 + 4 >> 2] = f[l2 + 4 >> 2];
        f[m2 + 8 >> 2] = f[l2 + 8 >> 2];
        o2 = +n[k2 >> 2];
        p2 = +n[a2 + 28 >> 2];
        q2 = +n[a2 + 32 >> 2];
        r2 = +n[l2 >> 2];
        s2 = +n[a2 + 40 >> 2];
        t2 = +n[a2 + 44 >> 2];
        v2 = o2 * 0.6666666865348816 + r2 * 0.3333333432674408;
        w2 = p2 * 0.6666666865348816 + s2 * 0.3333333432674408;
        x2 = q2 * 0.6666666865348816 + t2 * 0.3333333432674408;
        n[e2 + 24 >> 2] = v2;
        n[e2 + 28 >> 2] = w2;
        n[e2 + 32 >> 2] = x2;
        y2 = o2 * 0.3333333432674408 + r2 * 0.6666666865348816;
        r2 = p2 * 0.3333333432674408 + s2 * 0.6666666865348816;
        s2 = q2 * 0.3333333432674408 + t2 * 0.6666666865348816;
        n[e2 + 36 >> 2] = y2;
        n[e2 + 40 >> 2] = r2;
        n[e2 + 44 >> 2] = s2;
        if ((j2 | 0) > 0) {
          t2 = +n[a2 + 12 >> 2];
          q2 = +n[a2 + 16 >> 2];
          p2 = +n[a2 + 20 >> 2];
          o2 = +n[e2 >> 2];
          z2 = +n[e2 + 4 >> 2];
          A2 = +n[e2 + 8 >> 2];
          B2 = +n[e2 + 12 >> 2];
          C2 = +n[e2 + 16 >> 2];
          D2 = +n[e2 + 20 >> 2];
          E2 = 0;
          e2 = 0;
          while (1) {
            F2 = +n[i3 + 4 + (e2 * 12 | 0) >> 2];
            G2 = +n[i3 + 4 + (e2 * 12 | 0) + 4 >> 2];
            H2 = +n[i3 + 4 + (e2 * 12 | 0) + 8 >> 2];
            I2 = (F2 - o2) * t2;
            J2 = (G2 - z2) * q2;
            K2 = (H2 - A2) * p2;
            L2 = I2 * I2 + J2 * J2 + K2 * K2;
            K2 = L2 < 34028234663852886e22 ? L2 : 34028234663852886e22;
            L2 = (F2 - B2) * t2;
            J2 = (G2 - C2) * q2;
            I2 = (H2 - D2) * p2;
            M2 = L2 * L2 + J2 * J2 + I2 * I2;
            m2 = M2 < K2;
            I2 = m2 ? M2 : K2;
            K2 = (F2 - v2) * t2;
            M2 = (G2 - w2) * q2;
            J2 = (H2 - x2) * p2;
            L2 = K2 * K2 + M2 * M2 + J2 * J2;
            N2 = L2 < I2;
            J2 = N2 ? L2 : I2;
            I2 = (F2 - y2) * t2;
            F2 = (G2 - r2) * q2;
            G2 = (H2 - s2) * p2;
            H2 = I2 * I2 + F2 * F2 + G2 * G2;
            O2 = H2 < J2;
            b[g2 + e2 >> 0] = O2 ? 3 : N2 ? 2 : m2 & 1;
            G2 = E2 + (O2 ? H2 : J2);
            e2 = e2 + 1 | 0;
            if ((e2 | 0) == (j2 | 0)) {
              P2 = G2;
              break;
            } else E2 = G2;
          }
        } else P2 = 0;
        j2 = a2 + 48 | 0;
        if (!(P2 < +n[j2 >> 2])) {
          u = d2;
          return;
        }
        db(i3, g2, h2);
        _a(k2, l2, h2, c2);
        n[j2 >> 2] = P2;
        u = d2;
        return;
      }
      function jb(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R2 = 0, S2 = 0, T2 = 0, U2 = 0, W2 = 0, X2 = 0, Y2 = 0, Z2 = 0, _2 = 0, $2 = 0, aa2 = 0;
        d2 = u;
        u = u + 48 | 0;
        e2 = d2 + 16 | 0;
        g2 = d2;
        ab(a2, b2, c2);
        f[a2 >> 2] = 160;
        c2 = (f[a2 + 8 >> 2] & 32 | 0) == 0;
        n[a2 + 12 >> 2] = c2 ? 1 : 0.2125999927520752;
        n[a2 + 16 >> 2] = c2 ? 1 : 0.7152000069618225;
        n[a2 + 20 >> 2] = c2 ? 1 : 0.0722000002861023;
        n[a2 + 48 >> 2] = 34028234663852886e22;
        c2 = f[a2 + 4 >> 2] | 0;
        b2 = f[c2 >> 2] | 0;
        eb(e2, b2, c2 + 4 | 0, c2 + 196 | 0);
        fb(g2, e2);
        if ((b2 | 0) > 0) {
          e2 = f[c2 + 4 >> 2] | 0;
          h2 = f[c2 + 8 >> 2] | 0;
          i3 = f[c2 + 12 >> 2] | 0;
          j2 = (f[s >> 2] = e2, +n[s >> 2]);
          k2 = +n[g2 >> 2];
          l2 = (f[s >> 2] = h2, +n[s >> 2]);
          m2 = +n[g2 + 4 >> 2];
          o2 = (f[s >> 2] = i3, +n[s >> 2]);
          p2 = +n[g2 + 8 >> 2];
          q2 = j2 * k2 + l2 * m2 + o2 * p2;
          if ((b2 | 0) == 1) {
            r2 = j2;
            t2 = j2;
            v2 = l2;
            w2 = o2;
            x2 = o2;
            y2 = l2;
          } else {
            l2 = q2;
            g2 = 1;
            o2 = q2;
            z2 = e2;
            A2 = e2;
            e2 = h2;
            B2 = i3;
            C2 = i3;
            i3 = h2;
            while (1) {
              q2 = +n[c2 + 4 + (g2 * 12 | 0) >> 2];
              j2 = +n[c2 + 4 + (g2 * 12 | 0) + 4 >> 2];
              D2 = +n[c2 + 4 + (g2 * 12 | 0) + 8 >> 2];
              E2 = q2 * k2 + j2 * m2 + D2 * p2;
              h2 = (n[s >> 2] = q2, f[s >> 2] | 0);
              F2 = (n[s >> 2] = j2, f[s >> 2] | 0);
              G2 = (n[s >> 2] = D2, f[s >> 2] | 0);
              if (!(E2 < l2)) if (E2 > o2) {
                H2 = l2;
                J2 = E2;
                K2 = h2;
                L2 = A2;
                M2 = F2;
                N2 = G2;
                O2 = C2;
                P2 = i3;
              } else {
                H2 = l2;
                J2 = o2;
                K2 = z2;
                L2 = A2;
                M2 = e2;
                N2 = B2;
                O2 = C2;
                P2 = i3;
              }
              else {
                H2 = E2;
                J2 = o2;
                K2 = z2;
                L2 = h2;
                M2 = e2;
                N2 = B2;
                O2 = G2;
                P2 = F2;
              }
              g2 = g2 + 1 | 0;
              if ((g2 | 0) >= (b2 | 0)) break;
              else {
                l2 = H2;
                o2 = J2;
                z2 = K2;
                A2 = L2;
                e2 = M2;
                B2 = N2;
                C2 = O2;
                i3 = P2;
              }
            }
            J2 = (f[s >> 2] = L2, +n[s >> 2]);
            o2 = (f[s >> 2] = P2, +n[s >> 2]);
            H2 = (f[s >> 2] = O2, +n[s >> 2]);
            l2 = (f[s >> 2] = K2, +n[s >> 2]);
            p2 = (f[s >> 2] = M2, +n[s >> 2]);
            r2 = l2;
            t2 = J2;
            v2 = p2;
            w2 = (f[s >> 2] = N2, +n[s >> 2]);
            x2 = H2;
            y2 = o2;
          }
        } else {
          r2 = 0;
          t2 = 0;
          v2 = 0;
          w2 = 0;
          x2 = 0;
          y2 = 0;
        }
        o2 = t2 > 0 ? t2 : 0;
        t2 = y2 > 0 ? y2 : 0;
        y2 = x2 > 0 ? x2 : 0;
        x2 = r2 > 0 ? r2 : 0;
        r2 = v2 > 0 ? v2 : 0;
        v2 = w2 > 0 ? w2 : 0;
        w2 = (o2 < 1 ? o2 : 1) * 31 + 0.5;
        o2 = (t2 < 1 ? t2 : 1) * 63 + 0.5;
        t2 = (y2 < 1 ? y2 : 1) * 31 + 0.5;
        if (w2 > 0) Q2 = +I(+w2);
        else Q2 = +V(+w2);
        if (o2 > 0) R2 = +I(+o2);
        else R2 = +V(+o2);
        if (t2 > 0) S2 = +I(+t2);
        else S2 = +V(+t2);
        n[a2 + 24 >> 2] = Q2 * 0.032258063554763794;
        n[a2 + 28 >> 2] = R2 * 0.01587301678955555;
        n[a2 + 32 >> 2] = S2 * 0.032258063554763794;
        S2 = (x2 < 1 ? x2 : 1) * 31 + 0.5;
        x2 = (r2 < 1 ? r2 : 1) * 63 + 0.5;
        r2 = (v2 < 1 ? v2 : 1) * 31 + 0.5;
        if (S2 > 0) T2 = +I(+S2);
        else T2 = +V(+S2);
        if (x2 > 0) U2 = +I(+x2);
        else U2 = +V(+x2);
        if (r2 > 0) {
          W2 = +I(+r2);
          X2 = T2 * 0.032258063554763794;
          Y2 = U2 * 0.01587301678955555;
          Z2 = W2 * 0.032258063554763794;
          _2 = a2 + 36 | 0;
          n[_2 >> 2] = X2;
          $2 = a2 + 40 | 0;
          n[$2 >> 2] = Y2;
          aa2 = a2 + 44 | 0;
          n[aa2 >> 2] = Z2;
          u = d2;
          return;
        } else {
          W2 = +V(+r2);
          X2 = T2 * 0.032258063554763794;
          Y2 = U2 * 0.01587301678955555;
          Z2 = W2 * 0.032258063554763794;
          _2 = a2 + 36 | 0;
          n[_2 >> 2] = X2;
          $2 = a2 + 40 | 0;
          n[$2 >> 2] = Y2;
          aa2 = a2 + 44 | 0;
          n[aa2 >> 2] = Z2;
          u = d2;
          return;
        }
      }
      function kb(a2, b2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        var c2 = 0, d2 = 0, e2 = 0, g2 = 0;
        c2 = u;
        u = u + 16 | 0;
        d2 = c2;
        mb(a2, 196);
        e2 = a2 + 44 | 0;
        g2 = a2 + 48 | 0;
        if ((f[e2 >> 2] | 0) >= (f[g2 >> 2] | 0)) {
          u = c2;
          return;
        }
        db(f[a2 + 4 >> 2] | 0, a2 + 40 | 0, d2);
        Za(a2 + 16 | 0, a2 + 28 | 0, d2, b2);
        f[g2 >> 2] = f[e2 >> 2];
        u = c2;
        return;
      }
      function lb(a2, b2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        var c2 = 0, d2 = 0, e2 = 0, g2 = 0;
        c2 = u;
        u = u + 16 | 0;
        d2 = c2;
        mb(a2, 184);
        e2 = a2 + 44 | 0;
        g2 = a2 + 48 | 0;
        if ((f[e2 >> 2] | 0) >= (f[g2 >> 2] | 0)) {
          u = c2;
          return;
        }
        db(f[a2 + 4 >> 2] | 0, a2 + 40 | 0, d2);
        _a(a2 + 16 | 0, a2 + 28 | 0, d2, b2);
        f[g2 >> 2] = f[e2 >> 2];
        u = c2;
        return;
      }
      function mb(a2, c2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0;
        d2 = a2 + 44 | 0;
        f[d2 >> 2] = 2147483647;
        e2 = a2 + 16 | 0;
        g2 = a2 + 20 | 0;
        i3 = a2 + 24 | 0;
        j2 = a2 + 28 | 0;
        k2 = a2 + 32 | 0;
        l2 = a2 + 36 | 0;
        m2 = a2 + 40 | 0;
        o2 = h[a2 + 12 >> 0] | 0;
        p2 = c2 + 4 | 0;
        q2 = h[a2 + 13 >> 0] | 0;
        r2 = c2 + 8 | 0;
        s2 = h[a2 + 14 >> 0] | 0;
        a2 = f[c2 >> 2] | 0;
        t2 = h[a2 + (o2 * 6 | 0) + 2 >> 0] | 0;
        u2 = W(t2, t2) | 0;
        t2 = f[p2 >> 2] | 0;
        v2 = h[t2 + (q2 * 6 | 0) + 2 >> 0] | 0;
        w2 = (W(v2, v2) | 0) + u2 | 0;
        u2 = f[r2 >> 2] | 0;
        v2 = h[u2 + (s2 * 6 | 0) + 2 >> 0] | 0;
        x2 = (W(v2, v2) | 0) + w2 | 0;
        y2 = +(h[t2 + (q2 * 6 | 0) >> 0] | 0) / 63;
        z2 = +(h[u2 + (s2 * 6 | 0) >> 0] | 0) / 31;
        n[e2 >> 2] = +(h[a2 + (o2 * 6 | 0) >> 0] | 0) / 31;
        n[g2 >> 2] = y2;
        n[i3 >> 2] = z2;
        z2 = +(h[t2 + (q2 * 6 | 0) + 1 >> 0] | 0) / 63;
        y2 = +(h[u2 + (s2 * 6 | 0) + 1 >> 0] | 0) / 31;
        n[j2 >> 2] = +(h[a2 + (o2 * 6 | 0) + 1 >> 0] | 0) / 31;
        n[k2 >> 2] = z2;
        n[l2 >> 2] = y2;
        b[m2 >> 0] = 0;
        f[d2 >> 2] = x2;
        a2 = f[c2 >> 2] | 0;
        c2 = h[a2 + (o2 * 6 | 0) + 5 >> 0] | 0;
        u2 = W(c2, c2) | 0;
        c2 = f[p2 >> 2] | 0;
        p2 = h[c2 + (q2 * 6 | 0) + 5 >> 0] | 0;
        t2 = (W(p2, p2) | 0) + u2 | 0;
        u2 = f[r2 >> 2] | 0;
        r2 = h[u2 + (s2 * 6 | 0) + 5 >> 0] | 0;
        p2 = (W(r2, r2) | 0) + t2 | 0;
        if ((p2 | 0) >= (x2 | 0)) return;
        y2 = +(h[c2 + (q2 * 6 | 0) + 3 >> 0] | 0) / 63;
        z2 = +(h[u2 + (s2 * 6 | 0) + 3 >> 0] | 0) / 31;
        n[e2 >> 2] = +(h[a2 + (o2 * 6 | 0) + 3 >> 0] | 0) / 31;
        n[g2 >> 2] = y2;
        n[i3 >> 2] = z2;
        z2 = +(h[c2 + (q2 * 6 | 0) + 4 >> 0] | 0) / 63;
        y2 = +(h[u2 + (s2 * 6 | 0) + 4 >> 0] | 0) / 31;
        n[j2 >> 2] = +(h[a2 + (o2 * 6 | 0) + 4 >> 0] | 0) / 31;
        n[k2 >> 2] = z2;
        n[l2 >> 2] = y2;
        b[m2 >> 0] = 2;
        f[d2 >> 2] = p2;
        return;
      }
      function nb(a2, c2, d2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        ab(a2, c2, d2);
        f[a2 >> 2] = 176;
        d2 = f[a2 + 4 >> 2] | 0;
        c2 = ~~(+n[d2 + 4 >> 2] * 255 + 0.5);
        b[a2 + 12 >> 0] = (c2 | 0) < 0 ? 0 : ((c2 | 0) < 255 ? c2 : 255) & 255;
        c2 = ~~(+n[d2 + 8 >> 2] * 255 + 0.5);
        b[a2 + 13 >> 0] = (c2 | 0) < 0 ? 0 : ((c2 | 0) < 255 ? c2 : 255) & 255;
        c2 = ~~(+n[d2 + 12 >> 2] * 255 + 0.5);
        b[a2 + 14 >> 0] = (c2 | 0) < 0 ? 0 : ((c2 | 0) < 255 ? c2 : 255) & 255;
        f[a2 + 48 >> 2] = 2147483647;
        return;
      }
      function ob(a2, b2, c2, d2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0;
        e2 = u;
        u = u + 800 | 0;
        g2 = e2 + 464 | 0;
        h2 = e2;
        i3 = d2 & 7;
        j2 = (i3 | 0) == 4 ? 4 : (i3 | 0) == 2 ? 2 : 1;
        i3 = (d2 & 280 | 0) == 16 ? 16 : 8;
        k2 = i3 | d2 & 128 | ((d2 & 96 | 0) == 64 ? 64 : 32) | j2;
        d2 = (j2 & 6 | 0) == 0 ? c2 : c2 + 8 | 0;
        cb(g2, a2, b2, k2);
        l2 = f[g2 >> 2] | 0;
        do
          if ((l2 | 0) != 1) if ((i3 & 16 | 0) != 0 | (l2 | 0) == 0) {
            jb(h2, g2, k2);
            bb(h2, d2);
            break;
          } else {
            Ya(h2, g2, k2);
            bb(h2, d2);
            break;
          }
          else {
            nb(h2, g2, k2);
            bb(h2, d2);
          }
        while (0);
        if (j2 & 2 | 0) {
          Qa(a2, b2, c2);
          u = e2;
          return;
        }
        if (!(j2 & 4)) {
          u = e2;
          return;
        }
        Sa(a2, b2, c2);
        u = e2;
        return;
      }
      function pb(a2, c2, d2, e2, f2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        f2 = f2 | 0;
        var g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0;
        g2 = u;
        u = u + 64 | 0;
        h2 = g2;
        i3 = f2 & 7;
        j2 = (i3 | 0) == 4 ? 4 : (i3 | 0) == 2 ? 2 : 1;
        i3 = ((f2 & 280 | 0) == 16 ? 16 : 8) | f2 & 128 | ((f2 & 96 | 0) == 64 ? 64 : 32) | j2;
        f2 = (j2 << 3 & 8 ^ 8) + 8 | 0;
        if ((d2 | 0) <= 0) {
          u = g2;
          return;
        }
        if ((c2 | 0) > 0) {
          k2 = e2;
          l2 = 0;
        } else {
          u = g2;
          return;
        }
        while (1) {
          e2 = 0;
          j2 = k2;
          do {
            m2 = e2 | 1;
            n2 = (m2 | 0) < (c2 | 0);
            o2 = e2 | 2;
            p2 = (o2 | 0) < (c2 | 0);
            q2 = e2 | 3;
            r2 = (q2 | 0) < (c2 | 0);
            s2 = 0;
            t2 = 0;
            v2 = h2;
            while (1) {
              w2 = s2 + l2 | 0;
              x2 = W(w2, c2) | 0;
              y2 = s2 << 2;
              if ((w2 | 0) < (d2 | 0)) {
                w2 = a2 + (e2 + x2 << 2) | 0;
                z2 = w2 + 1 | 0;
                b[v2 >> 0] = b[w2 >> 0] | 0;
                w2 = z2 + 1 | 0;
                b[v2 + 1 >> 0] = b[z2 >> 0] | 0;
                b[v2 + 2 >> 0] = b[w2 >> 0] | 0;
                b[v2 + 3 >> 0] = b[w2 + 1 >> 0] | 0;
                w2 = 1 << y2 | t2;
                if (n2) {
                  z2 = a2 + (m2 + x2 << 2) | 0;
                  A2 = z2 + 1 | 0;
                  b[v2 + 4 >> 0] = b[z2 >> 0] | 0;
                  z2 = A2 + 1 | 0;
                  b[v2 + 5 >> 0] = b[A2 >> 0] | 0;
                  b[v2 + 6 >> 0] = b[z2 >> 0] | 0;
                  b[v2 + 7 >> 0] = b[z2 + 1 >> 0] | 0;
                  B2 = 1 << (y2 | 1) | w2;
                } else B2 = w2;
                if (p2) {
                  w2 = a2 + (o2 + x2 << 2) | 0;
                  z2 = w2 + 1 | 0;
                  b[v2 + 8 >> 0] = b[w2 >> 0] | 0;
                  w2 = z2 + 1 | 0;
                  b[v2 + 9 >> 0] = b[z2 >> 0] | 0;
                  b[v2 + 10 >> 0] = b[w2 >> 0] | 0;
                  b[v2 + 11 >> 0] = b[w2 + 1 >> 0] | 0;
                  C2 = 1 << (y2 | 2) | B2;
                } else C2 = B2;
                if (r2) {
                  w2 = a2 + (q2 + x2 << 2) | 0;
                  x2 = w2 + 1 | 0;
                  b[v2 + 12 >> 0] = b[w2 >> 0] | 0;
                  w2 = x2 + 1 | 0;
                  b[v2 + 13 >> 0] = b[x2 >> 0] | 0;
                  b[v2 + 14 >> 0] = b[w2 >> 0] | 0;
                  b[v2 + 15 >> 0] = b[w2 + 1 >> 0] | 0;
                  D2 = 1 << (y2 | 3) | C2;
                } else D2 = C2;
              } else D2 = t2;
              s2 = s2 + 1 | 0;
              if ((s2 | 0) == 4) break;
              else {
                t2 = D2;
                v2 = v2 + 16 | 0;
              }
            }
            ob(h2, D2, j2, i3);
            j2 = j2 + f2 | 0;
            e2 = e2 + 4 | 0;
          } while ((e2 | 0) < (c2 | 0));
          l2 = l2 + 4 | 0;
          if ((l2 | 0) >= (d2 | 0)) break;
          else k2 = j2;
        }
        u = g2;
        return;
      }
      function qb(a2, c2, d2, e2, f2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        f2 = f2 | 0;
        var g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0;
        g2 = u;
        u = u + 64 | 0;
        h2 = g2;
        i3 = f2 & 7;
        f2 = (i3 | 0) == 4;
        j2 = f2 ? 4 : (i3 | 0) == 2 ? 2 : 1;
        i3 = (j2 << 3 & 8 ^ 8) + 8 | 0;
        if ((d2 | 0) <= 0) {
          u = g2;
          return;
        }
        k2 = (c2 | 0) > 0;
        l2 = f2 ? 4 : (j2 | 0) == 2 ? 2 : 1;
        j2 = (l2 & 6 | 0) == 0;
        f2 = (l2 & 1 | 0) != 0;
        m2 = (l2 & 2 | 0) == 0;
        n2 = (l2 & 4 | 0) == 0;
        l2 = e2;
        e2 = 0;
        while (1) {
          a: do
            if (k2) {
              if (m2) {
                o2 = 0;
                p2 = l2;
              } else {
                q2 = 0;
                r2 = l2;
                while (1) {
                  $a(h2, j2 ? r2 : r2 + 8 | 0, f2);
                  Ra(h2, r2);
                  s2 = q2 | 1;
                  t2 = (s2 | 0) < (c2 | 0);
                  v2 = q2 | 2;
                  w2 = (v2 | 0) < (c2 | 0);
                  x2 = q2 | 3;
                  y2 = (x2 | 0) < (c2 | 0);
                  z2 = 0;
                  A2 = h2;
                  while (1) {
                    B2 = z2 + e2 | 0;
                    C2 = W(B2, c2) | 0;
                    if ((B2 | 0) < (d2 | 0)) {
                      B2 = a2 + (q2 + C2 << 2) | 0;
                      D2 = B2 + 1 | 0;
                      b[B2 >> 0] = b[A2 >> 0] | 0;
                      B2 = D2 + 1 | 0;
                      b[D2 >> 0] = b[A2 + 1 >> 0] | 0;
                      b[B2 >> 0] = b[A2 + 2 >> 0] | 0;
                      b[B2 + 1 >> 0] = b[A2 + 3 >> 0] | 0;
                      if (t2) {
                        B2 = a2 + (s2 + C2 << 2) | 0;
                        D2 = B2 + 1 | 0;
                        b[B2 >> 0] = b[A2 + 4 >> 0] | 0;
                        B2 = D2 + 1 | 0;
                        b[D2 >> 0] = b[A2 + 5 >> 0] | 0;
                        b[B2 >> 0] = b[A2 + 6 >> 0] | 0;
                        b[B2 + 1 >> 0] = b[A2 + 7 >> 0] | 0;
                      }
                      if (w2) {
                        B2 = a2 + (v2 + C2 << 2) | 0;
                        D2 = B2 + 1 | 0;
                        b[B2 >> 0] = b[A2 + 8 >> 0] | 0;
                        B2 = D2 + 1 | 0;
                        b[D2 >> 0] = b[A2 + 9 >> 0] | 0;
                        b[B2 >> 0] = b[A2 + 10 >> 0] | 0;
                        b[B2 + 1 >> 0] = b[A2 + 11 >> 0] | 0;
                      }
                      if (y2) {
                        B2 = a2 + (x2 + C2 << 2) | 0;
                        C2 = B2 + 1 | 0;
                        b[B2 >> 0] = b[A2 + 12 >> 0] | 0;
                        B2 = C2 + 1 | 0;
                        b[C2 >> 0] = b[A2 + 13 >> 0] | 0;
                        b[B2 >> 0] = b[A2 + 14 >> 0] | 0;
                        b[B2 + 1 >> 0] = b[A2 + 15 >> 0] | 0;
                      }
                    }
                    z2 = z2 + 1 | 0;
                    if ((z2 | 0) == 4) break;
                    else A2 = A2 + 16 | 0;
                  }
                  A2 = r2 + i3 | 0;
                  q2 = q2 + 4 | 0;
                  if ((q2 | 0) >= (c2 | 0)) {
                    E2 = A2;
                    break a;
                  } else r2 = A2;
                }
              }
              while (1) {
                $a(h2, j2 ? p2 : p2 + 8 | 0, f2);
                if (!n2) Ua(h2, p2);
                r2 = o2 | 1;
                q2 = (r2 | 0) < (c2 | 0);
                A2 = o2 | 2;
                z2 = (A2 | 0) < (c2 | 0);
                x2 = o2 | 3;
                y2 = (x2 | 0) < (c2 | 0);
                v2 = 0;
                w2 = h2;
                while (1) {
                  s2 = v2 + e2 | 0;
                  t2 = W(s2, c2) | 0;
                  if ((s2 | 0) < (d2 | 0)) {
                    s2 = a2 + (o2 + t2 << 2) | 0;
                    B2 = s2 + 1 | 0;
                    b[s2 >> 0] = b[w2 >> 0] | 0;
                    s2 = B2 + 1 | 0;
                    b[B2 >> 0] = b[w2 + 1 >> 0] | 0;
                    b[s2 >> 0] = b[w2 + 2 >> 0] | 0;
                    b[s2 + 1 >> 0] = b[w2 + 3 >> 0] | 0;
                    if (q2) {
                      s2 = a2 + (r2 + t2 << 2) | 0;
                      B2 = s2 + 1 | 0;
                      b[s2 >> 0] = b[w2 + 4 >> 0] | 0;
                      s2 = B2 + 1 | 0;
                      b[B2 >> 0] = b[w2 + 5 >> 0] | 0;
                      b[s2 >> 0] = b[w2 + 6 >> 0] | 0;
                      b[s2 + 1 >> 0] = b[w2 + 7 >> 0] | 0;
                    }
                    if (z2) {
                      s2 = a2 + (A2 + t2 << 2) | 0;
                      B2 = s2 + 1 | 0;
                      b[s2 >> 0] = b[w2 + 8 >> 0] | 0;
                      s2 = B2 + 1 | 0;
                      b[B2 >> 0] = b[w2 + 9 >> 0] | 0;
                      b[s2 >> 0] = b[w2 + 10 >> 0] | 0;
                      b[s2 + 1 >> 0] = b[w2 + 11 >> 0] | 0;
                    }
                    if (y2) {
                      s2 = a2 + (x2 + t2 << 2) | 0;
                      t2 = s2 + 1 | 0;
                      b[s2 >> 0] = b[w2 + 12 >> 0] | 0;
                      s2 = t2 + 1 | 0;
                      b[t2 >> 0] = b[w2 + 13 >> 0] | 0;
                      b[s2 >> 0] = b[w2 + 14 >> 0] | 0;
                      b[s2 + 1 >> 0] = b[w2 + 15 >> 0] | 0;
                    }
                  }
                  v2 = v2 + 1 | 0;
                  if ((v2 | 0) == 4) break;
                  else w2 = w2 + 16 | 0;
                }
                w2 = p2 + i3 | 0;
                o2 = o2 + 4 | 0;
                if ((o2 | 0) >= (c2 | 0)) {
                  E2 = w2;
                  break;
                } else p2 = w2;
              }
            } else E2 = l2;
          while (0);
          e2 = e2 + 4 | 0;
          if ((e2 | 0) >= (d2 | 0)) break;
          else l2 = E2;
        }
        u = g2;
        return;
      }
      function rb(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        var d2 = 0;
        d2 = c2 & 7;
        return W(W((b2 + 3 | 0) / 4 | 0, (a2 + 3 | 0) / 4 | 0) | 0, (((d2 | 0) != 2 & (d2 | 0) != 4 & 1) << 3 ^ 8) + 8 | 0) | 0;
      }
      function sb(a2, b2, c2, d2, e2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        pb(a2, b2, c2, d2, e2);
        return;
      }
      function tb(a2, b2, c2, d2, e2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        qb(a2, b2, c2, d2, e2);
        return;
      }
      function ub(a2) {
        a2 = a2 | 0;
        var b2 = 0, c2 = 0, d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0, E2 = 0, F2 = 0, G2 = 0, H2 = 0, I2 = 0, J2 = 0, K2 = 0, L2 = 0, M2 = 0, N2 = 0, O2 = 0, P2 = 0, Q2 = 0, R2 = 0, S2 = 0, T2 = 0, U2 = 0, V2 = 0, W2 = 0, X2 = 0, Y2 = 0, Z2 = 0, _2 = 0, $2 = 0, aa2 = 0, ba2 = 0, ca2 = 0, da2 = 0, ea2 = 0, fa2 = 0, ga2 = 0, ha2 = 0, ia2 = 0, ja2 = 0, ka2 = 0, la2 = 0, ma2 = 0, na2 = 0, oa2 = 0, pa2 = 0, qa2 = 0, ra2 = 0, sa2 = 0, ta2 = 0, ua2 = 0, va2 = 0, wa2 = 0, xa2 = 0, ya2 = 0;
        b2 = u;
        u = u + 16 | 0;
        c2 = b2;
        do
          if (a2 >>> 0 < 245) {
            d2 = a2 >>> 0 < 11 ? 16 : a2 + 11 & -8;
            e2 = d2 >>> 3;
            g2 = f[1754] | 0;
            h2 = g2 >>> e2;
            if (h2 & 3 | 0) {
              i3 = (h2 & 1 ^ 1) + e2 | 0;
              j2 = 7056 + (i3 << 1 << 2) | 0;
              k2 = j2 + 8 | 0;
              l2 = f[k2 >> 2] | 0;
              m2 = l2 + 8 | 0;
              n2 = f[m2 >> 2] | 0;
              if ((j2 | 0) == (n2 | 0)) f[1754] = g2 & ~(1 << i3);
              else {
                f[n2 + 12 >> 2] = j2;
                f[k2 >> 2] = n2;
              }
              n2 = i3 << 3;
              f[l2 + 4 >> 2] = n2 | 3;
              i3 = l2 + n2 + 4 | 0;
              f[i3 >> 2] = f[i3 >> 2] | 1;
              o2 = m2;
              u = b2;
              return o2 | 0;
            }
            m2 = f[1756] | 0;
            if (d2 >>> 0 > m2 >>> 0) {
              if (h2 | 0) {
                i3 = 2 << e2;
                n2 = h2 << e2 & (i3 | 0 - i3);
                i3 = (n2 & 0 - n2) + -1 | 0;
                n2 = i3 >>> 12 & 16;
                e2 = i3 >>> n2;
                i3 = e2 >>> 5 & 8;
                h2 = e2 >>> i3;
                e2 = h2 >>> 2 & 4;
                l2 = h2 >>> e2;
                h2 = l2 >>> 1 & 2;
                k2 = l2 >>> h2;
                l2 = k2 >>> 1 & 1;
                j2 = (i3 | n2 | e2 | h2 | l2) + (k2 >>> l2) | 0;
                l2 = 7056 + (j2 << 1 << 2) | 0;
                k2 = l2 + 8 | 0;
                h2 = f[k2 >> 2] | 0;
                e2 = h2 + 8 | 0;
                n2 = f[e2 >> 2] | 0;
                if ((l2 | 0) == (n2 | 0)) {
                  i3 = g2 & ~(1 << j2);
                  f[1754] = i3;
                  p2 = i3;
                } else {
                  f[n2 + 12 >> 2] = l2;
                  f[k2 >> 2] = n2;
                  p2 = g2;
                }
                n2 = (j2 << 3) - d2 | 0;
                f[h2 + 4 >> 2] = d2 | 3;
                j2 = h2 + d2 | 0;
                f[j2 + 4 >> 2] = n2 | 1;
                f[j2 + n2 >> 2] = n2;
                if (m2 | 0) {
                  h2 = f[1759] | 0;
                  k2 = m2 >>> 3;
                  l2 = 7056 + (k2 << 1 << 2) | 0;
                  i3 = 1 << k2;
                  if (!(p2 & i3)) {
                    f[1754] = p2 | i3;
                    q2 = l2;
                    r2 = l2 + 8 | 0;
                  } else {
                    i3 = l2 + 8 | 0;
                    q2 = f[i3 >> 2] | 0;
                    r2 = i3;
                  }
                  f[r2 >> 2] = h2;
                  f[q2 + 12 >> 2] = h2;
                  f[h2 + 8 >> 2] = q2;
                  f[h2 + 12 >> 2] = l2;
                }
                f[1756] = n2;
                f[1759] = j2;
                o2 = e2;
                u = b2;
                return o2 | 0;
              }
              e2 = f[1755] | 0;
              if (e2) {
                j2 = (e2 & 0 - e2) + -1 | 0;
                n2 = j2 >>> 12 & 16;
                l2 = j2 >>> n2;
                j2 = l2 >>> 5 & 8;
                h2 = l2 >>> j2;
                l2 = h2 >>> 2 & 4;
                i3 = h2 >>> l2;
                h2 = i3 >>> 1 & 2;
                k2 = i3 >>> h2;
                i3 = k2 >>> 1 & 1;
                s2 = f[7320 + ((j2 | n2 | l2 | h2 | i3) + (k2 >>> i3) << 2) >> 2] | 0;
                i3 = (f[s2 + 4 >> 2] & -8) - d2 | 0;
                k2 = f[s2 + 16 + (((f[s2 + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0;
                if (!k2) {
                  t2 = s2;
                  v2 = i3;
                } else {
                  h2 = s2;
                  s2 = i3;
                  i3 = k2;
                  while (1) {
                    k2 = (f[i3 + 4 >> 2] & -8) - d2 | 0;
                    l2 = k2 >>> 0 < s2 >>> 0;
                    n2 = l2 ? k2 : s2;
                    k2 = l2 ? i3 : h2;
                    i3 = f[i3 + 16 + (((f[i3 + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0;
                    if (!i3) {
                      t2 = k2;
                      v2 = n2;
                      break;
                    } else {
                      h2 = k2;
                      s2 = n2;
                    }
                  }
                }
                s2 = t2 + d2 | 0;
                if (t2 >>> 0 < s2 >>> 0) {
                  h2 = f[t2 + 24 >> 2] | 0;
                  i3 = f[t2 + 12 >> 2] | 0;
                  do
                    if ((i3 | 0) == (t2 | 0)) {
                      n2 = t2 + 20 | 0;
                      k2 = f[n2 >> 2] | 0;
                      if (!k2) {
                        l2 = t2 + 16 | 0;
                        j2 = f[l2 >> 2] | 0;
                        if (!j2) {
                          w2 = 0;
                          break;
                        } else {
                          x2 = j2;
                          y2 = l2;
                        }
                      } else {
                        x2 = k2;
                        y2 = n2;
                      }
                      while (1) {
                        n2 = x2 + 20 | 0;
                        k2 = f[n2 >> 2] | 0;
                        if (k2 | 0) {
                          x2 = k2;
                          y2 = n2;
                          continue;
                        }
                        n2 = x2 + 16 | 0;
                        k2 = f[n2 >> 2] | 0;
                        if (!k2) break;
                        else {
                          x2 = k2;
                          y2 = n2;
                        }
                      }
                      f[y2 >> 2] = 0;
                      w2 = x2;
                    } else {
                      n2 = f[t2 + 8 >> 2] | 0;
                      f[n2 + 12 >> 2] = i3;
                      f[i3 + 8 >> 2] = n2;
                      w2 = i3;
                    }
                  while (0);
                  do
                    if (h2 | 0) {
                      i3 = f[t2 + 28 >> 2] | 0;
                      n2 = 7320 + (i3 << 2) | 0;
                      if ((t2 | 0) == (f[n2 >> 2] | 0)) {
                        f[n2 >> 2] = w2;
                        if (!w2) {
                          f[1755] = e2 & ~(1 << i3);
                          break;
                        }
                      } else {
                        f[h2 + 16 + (((f[h2 + 16 >> 2] | 0) != (t2 | 0) & 1) << 2) >> 2] = w2;
                        if (!w2) break;
                      }
                      f[w2 + 24 >> 2] = h2;
                      i3 = f[t2 + 16 >> 2] | 0;
                      if (i3 | 0) {
                        f[w2 + 16 >> 2] = i3;
                        f[i3 + 24 >> 2] = w2;
                      }
                      i3 = f[t2 + 20 >> 2] | 0;
                      if (i3 | 0) {
                        f[w2 + 20 >> 2] = i3;
                        f[i3 + 24 >> 2] = w2;
                      }
                    }
                  while (0);
                  if (v2 >>> 0 < 16) {
                    h2 = v2 + d2 | 0;
                    f[t2 + 4 >> 2] = h2 | 3;
                    e2 = t2 + h2 + 4 | 0;
                    f[e2 >> 2] = f[e2 >> 2] | 1;
                  } else {
                    f[t2 + 4 >> 2] = d2 | 3;
                    f[s2 + 4 >> 2] = v2 | 1;
                    f[s2 + v2 >> 2] = v2;
                    if (m2 | 0) {
                      e2 = f[1759] | 0;
                      h2 = m2 >>> 3;
                      i3 = 7056 + (h2 << 1 << 2) | 0;
                      n2 = 1 << h2;
                      if (!(g2 & n2)) {
                        f[1754] = g2 | n2;
                        z2 = i3;
                        A2 = i3 + 8 | 0;
                      } else {
                        n2 = i3 + 8 | 0;
                        z2 = f[n2 >> 2] | 0;
                        A2 = n2;
                      }
                      f[A2 >> 2] = e2;
                      f[z2 + 12 >> 2] = e2;
                      f[e2 + 8 >> 2] = z2;
                      f[e2 + 12 >> 2] = i3;
                    }
                    f[1756] = v2;
                    f[1759] = s2;
                  }
                  o2 = t2 + 8 | 0;
                  u = b2;
                  return o2 | 0;
                } else B2 = d2;
              } else B2 = d2;
            } else B2 = d2;
          } else if (a2 >>> 0 <= 4294967231) {
            i3 = a2 + 11 | 0;
            e2 = i3 & -8;
            n2 = f[1755] | 0;
            if (n2) {
              h2 = 0 - e2 | 0;
              k2 = i3 >>> 8;
              if (k2) if (e2 >>> 0 > 16777215) C2 = 31;
              else {
                i3 = (k2 + 1048320 | 0) >>> 16 & 8;
                l2 = k2 << i3;
                k2 = (l2 + 520192 | 0) >>> 16 & 4;
                j2 = l2 << k2;
                l2 = (j2 + 245760 | 0) >>> 16 & 2;
                D2 = 14 - (k2 | i3 | l2) + (j2 << l2 >>> 15) | 0;
                C2 = e2 >>> (D2 + 7 | 0) & 1 | D2 << 1;
              }
              else C2 = 0;
              D2 = f[7320 + (C2 << 2) >> 2] | 0;
              a: do
                if (!D2) {
                  E2 = 0;
                  F2 = 0;
                  G2 = h2;
                  H2 = 57;
                } else {
                  l2 = 0;
                  j2 = h2;
                  i3 = D2;
                  k2 = e2 << ((C2 | 0) == 31 ? 0 : 25 - (C2 >>> 1) | 0);
                  I2 = 0;
                  while (1) {
                    J2 = (f[i3 + 4 >> 2] & -8) - e2 | 0;
                    if (J2 >>> 0 < j2 >>> 0) if (!J2) {
                      K2 = i3;
                      L2 = 0;
                      M2 = i3;
                      H2 = 61;
                      break a;
                    } else {
                      N2 = i3;
                      O2 = J2;
                    }
                    else {
                      N2 = l2;
                      O2 = j2;
                    }
                    J2 = f[i3 + 20 >> 2] | 0;
                    i3 = f[i3 + 16 + (k2 >>> 31 << 2) >> 2] | 0;
                    P2 = (J2 | 0) == 0 | (J2 | 0) == (i3 | 0) ? I2 : J2;
                    J2 = (i3 | 0) == 0;
                    if (J2) {
                      E2 = P2;
                      F2 = N2;
                      G2 = O2;
                      H2 = 57;
                      break;
                    } else {
                      l2 = N2;
                      j2 = O2;
                      k2 = k2 << ((J2 ^ 1) & 1);
                      I2 = P2;
                    }
                  }
                }
              while (0);
              if ((H2 | 0) == 57) {
                if ((E2 | 0) == 0 & (F2 | 0) == 0) {
                  D2 = 2 << C2;
                  h2 = n2 & (D2 | 0 - D2);
                  if (!h2) {
                    B2 = e2;
                    break;
                  }
                  D2 = (h2 & 0 - h2) + -1 | 0;
                  h2 = D2 >>> 12 & 16;
                  d2 = D2 >>> h2;
                  D2 = d2 >>> 5 & 8;
                  s2 = d2 >>> D2;
                  d2 = s2 >>> 2 & 4;
                  g2 = s2 >>> d2;
                  s2 = g2 >>> 1 & 2;
                  m2 = g2 >>> s2;
                  g2 = m2 >>> 1 & 1;
                  Q2 = 0;
                  R2 = f[7320 + ((D2 | h2 | d2 | s2 | g2) + (m2 >>> g2) << 2) >> 2] | 0;
                } else {
                  Q2 = F2;
                  R2 = E2;
                }
                if (!R2) {
                  S2 = Q2;
                  T2 = G2;
                } else {
                  K2 = Q2;
                  L2 = G2;
                  M2 = R2;
                  H2 = 61;
                }
              }
              if ((H2 | 0) == 61) while (1) {
                H2 = 0;
                g2 = (f[M2 + 4 >> 2] & -8) - e2 | 0;
                m2 = g2 >>> 0 < L2 >>> 0;
                s2 = m2 ? g2 : L2;
                g2 = m2 ? M2 : K2;
                M2 = f[M2 + 16 + (((f[M2 + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0;
                if (!M2) {
                  S2 = g2;
                  T2 = s2;
                  break;
                } else {
                  K2 = g2;
                  L2 = s2;
                  H2 = 61;
                }
              }
              if ((S2 | 0) != 0 ? T2 >>> 0 < ((f[1756] | 0) - e2 | 0) >>> 0 : 0) {
                s2 = S2 + e2 | 0;
                if (S2 >>> 0 >= s2 >>> 0) {
                  o2 = 0;
                  u = b2;
                  return o2 | 0;
                }
                g2 = f[S2 + 24 >> 2] | 0;
                m2 = f[S2 + 12 >> 2] | 0;
                do
                  if ((m2 | 0) == (S2 | 0)) {
                    d2 = S2 + 20 | 0;
                    h2 = f[d2 >> 2] | 0;
                    if (!h2) {
                      D2 = S2 + 16 | 0;
                      I2 = f[D2 >> 2] | 0;
                      if (!I2) {
                        U2 = 0;
                        break;
                      } else {
                        V2 = I2;
                        W2 = D2;
                      }
                    } else {
                      V2 = h2;
                      W2 = d2;
                    }
                    while (1) {
                      d2 = V2 + 20 | 0;
                      h2 = f[d2 >> 2] | 0;
                      if (h2 | 0) {
                        V2 = h2;
                        W2 = d2;
                        continue;
                      }
                      d2 = V2 + 16 | 0;
                      h2 = f[d2 >> 2] | 0;
                      if (!h2) break;
                      else {
                        V2 = h2;
                        W2 = d2;
                      }
                    }
                    f[W2 >> 2] = 0;
                    U2 = V2;
                  } else {
                    d2 = f[S2 + 8 >> 2] | 0;
                    f[d2 + 12 >> 2] = m2;
                    f[m2 + 8 >> 2] = d2;
                    U2 = m2;
                  }
                while (0);
                do
                  if (g2) {
                    m2 = f[S2 + 28 >> 2] | 0;
                    d2 = 7320 + (m2 << 2) | 0;
                    if ((S2 | 0) == (f[d2 >> 2] | 0)) {
                      f[d2 >> 2] = U2;
                      if (!U2) {
                        d2 = n2 & ~(1 << m2);
                        f[1755] = d2;
                        X2 = d2;
                        break;
                      }
                    } else {
                      f[g2 + 16 + (((f[g2 + 16 >> 2] | 0) != (S2 | 0) & 1) << 2) >> 2] = U2;
                      if (!U2) {
                        X2 = n2;
                        break;
                      }
                    }
                    f[U2 + 24 >> 2] = g2;
                    d2 = f[S2 + 16 >> 2] | 0;
                    if (d2 | 0) {
                      f[U2 + 16 >> 2] = d2;
                      f[d2 + 24 >> 2] = U2;
                    }
                    d2 = f[S2 + 20 >> 2] | 0;
                    if (d2) {
                      f[U2 + 20 >> 2] = d2;
                      f[d2 + 24 >> 2] = U2;
                      X2 = n2;
                    } else X2 = n2;
                  } else X2 = n2;
                while (0);
                do
                  if (T2 >>> 0 >= 16) {
                    f[S2 + 4 >> 2] = e2 | 3;
                    f[s2 + 4 >> 2] = T2 | 1;
                    f[s2 + T2 >> 2] = T2;
                    n2 = T2 >>> 3;
                    if (T2 >>> 0 < 256) {
                      g2 = 7056 + (n2 << 1 << 2) | 0;
                      d2 = f[1754] | 0;
                      m2 = 1 << n2;
                      if (!(d2 & m2)) {
                        f[1754] = d2 | m2;
                        Y2 = g2;
                        Z2 = g2 + 8 | 0;
                      } else {
                        m2 = g2 + 8 | 0;
                        Y2 = f[m2 >> 2] | 0;
                        Z2 = m2;
                      }
                      f[Z2 >> 2] = s2;
                      f[Y2 + 12 >> 2] = s2;
                      f[s2 + 8 >> 2] = Y2;
                      f[s2 + 12 >> 2] = g2;
                      break;
                    }
                    g2 = T2 >>> 8;
                    if (g2) if (T2 >>> 0 > 16777215) _2 = 31;
                    else {
                      m2 = (g2 + 1048320 | 0) >>> 16 & 8;
                      d2 = g2 << m2;
                      g2 = (d2 + 520192 | 0) >>> 16 & 4;
                      n2 = d2 << g2;
                      d2 = (n2 + 245760 | 0) >>> 16 & 2;
                      h2 = 14 - (g2 | m2 | d2) + (n2 << d2 >>> 15) | 0;
                      _2 = T2 >>> (h2 + 7 | 0) & 1 | h2 << 1;
                    }
                    else _2 = 0;
                    h2 = 7320 + (_2 << 2) | 0;
                    f[s2 + 28 >> 2] = _2;
                    d2 = s2 + 16 | 0;
                    f[d2 + 4 >> 2] = 0;
                    f[d2 >> 2] = 0;
                    d2 = 1 << _2;
                    if (!(X2 & d2)) {
                      f[1755] = X2 | d2;
                      f[h2 >> 2] = s2;
                      f[s2 + 24 >> 2] = h2;
                      f[s2 + 12 >> 2] = s2;
                      f[s2 + 8 >> 2] = s2;
                      break;
                    }
                    d2 = T2 << ((_2 | 0) == 31 ? 0 : 25 - (_2 >>> 1) | 0);
                    n2 = f[h2 >> 2] | 0;
                    while (1) {
                      if ((f[n2 + 4 >> 2] & -8 | 0) == (T2 | 0)) {
                        H2 = 97;
                        break;
                      }
                      $2 = n2 + 16 + (d2 >>> 31 << 2) | 0;
                      h2 = f[$2 >> 2] | 0;
                      if (!h2) {
                        H2 = 96;
                        break;
                      } else {
                        d2 = d2 << 1;
                        n2 = h2;
                      }
                    }
                    if ((H2 | 0) == 96) {
                      f[$2 >> 2] = s2;
                      f[s2 + 24 >> 2] = n2;
                      f[s2 + 12 >> 2] = s2;
                      f[s2 + 8 >> 2] = s2;
                      break;
                    } else if ((H2 | 0) == 97) {
                      d2 = n2 + 8 | 0;
                      h2 = f[d2 >> 2] | 0;
                      f[h2 + 12 >> 2] = s2;
                      f[d2 >> 2] = s2;
                      f[s2 + 8 >> 2] = h2;
                      f[s2 + 12 >> 2] = n2;
                      f[s2 + 24 >> 2] = 0;
                      break;
                    }
                  } else {
                    h2 = T2 + e2 | 0;
                    f[S2 + 4 >> 2] = h2 | 3;
                    d2 = S2 + h2 + 4 | 0;
                    f[d2 >> 2] = f[d2 >> 2] | 1;
                  }
                while (0);
                o2 = S2 + 8 | 0;
                u = b2;
                return o2 | 0;
              } else B2 = e2;
            } else B2 = e2;
          } else B2 = -1;
        while (0);
        S2 = f[1756] | 0;
        if (S2 >>> 0 >= B2 >>> 0) {
          T2 = S2 - B2 | 0;
          $2 = f[1759] | 0;
          if (T2 >>> 0 > 15) {
            _2 = $2 + B2 | 0;
            f[1759] = _2;
            f[1756] = T2;
            f[_2 + 4 >> 2] = T2 | 1;
            f[_2 + T2 >> 2] = T2;
            f[$2 + 4 >> 2] = B2 | 3;
          } else {
            f[1756] = 0;
            f[1759] = 0;
            f[$2 + 4 >> 2] = S2 | 3;
            T2 = $2 + S2 + 4 | 0;
            f[T2 >> 2] = f[T2 >> 2] | 1;
          }
          o2 = $2 + 8 | 0;
          u = b2;
          return o2 | 0;
        }
        $2 = f[1757] | 0;
        if ($2 >>> 0 > B2 >>> 0) {
          T2 = $2 - B2 | 0;
          f[1757] = T2;
          S2 = f[1760] | 0;
          _2 = S2 + B2 | 0;
          f[1760] = _2;
          f[_2 + 4 >> 2] = T2 | 1;
          f[S2 + 4 >> 2] = B2 | 3;
          o2 = S2 + 8 | 0;
          u = b2;
          return o2 | 0;
        }
        if (!(f[1872] | 0)) {
          f[1874] = 4096;
          f[1873] = 4096;
          f[1875] = -1;
          f[1876] = -1;
          f[1877] = 0;
          f[1865] = 0;
          S2 = c2 & -16 ^ 1431655768;
          f[c2 >> 2] = S2;
          f[1872] = S2;
          aa2 = 4096;
        } else aa2 = f[1874] | 0;
        S2 = B2 + 48 | 0;
        c2 = B2 + 47 | 0;
        T2 = aa2 + c2 | 0;
        _2 = 0 - aa2 | 0;
        aa2 = T2 & _2;
        if (aa2 >>> 0 <= B2 >>> 0) {
          o2 = 0;
          u = b2;
          return o2 | 0;
        }
        X2 = f[1864] | 0;
        if (X2 | 0 ? (Y2 = f[1862] | 0, Z2 = Y2 + aa2 | 0, Z2 >>> 0 <= Y2 >>> 0 | Z2 >>> 0 > X2 >>> 0) : 0) {
          o2 = 0;
          u = b2;
          return o2 | 0;
        }
        b: do
          if (!(f[1865] & 4)) {
            X2 = f[1760] | 0;
            c: do
              if (X2) {
                Z2 = 7464;
                while (1) {
                  Y2 = f[Z2 >> 2] | 0;
                  if (Y2 >>> 0 <= X2 >>> 0 ? (ba2 = Z2 + 4 | 0, (Y2 + (f[ba2 >> 2] | 0) | 0) >>> 0 > X2 >>> 0) : 0) break;
                  Y2 = f[Z2 + 8 >> 2] | 0;
                  if (!Y2) {
                    H2 = 118;
                    break c;
                  } else Z2 = Y2;
                }
                n2 = T2 - $2 & _2;
                if (n2 >>> 0 < 2147483647) {
                  Y2 = ec(n2 | 0) | 0;
                  if ((Y2 | 0) == ((f[Z2 >> 2] | 0) + (f[ba2 >> 2] | 0) | 0)) if ((Y2 | 0) == (-1 | 0)) ca2 = n2;
                  else {
                    da2 = n2;
                    ea2 = Y2;
                    H2 = 135;
                    break b;
                  }
                  else {
                    fa2 = Y2;
                    ga2 = n2;
                    H2 = 126;
                  }
                } else ca2 = 0;
              } else H2 = 118;
            while (0);
            do
              if ((H2 | 0) == 118) {
                X2 = ec(0) | 0;
                if ((X2 | 0) != (-1 | 0) ? (e2 = X2, n2 = f[1873] | 0, Y2 = n2 + -1 | 0, U2 = ((Y2 & e2 | 0) == 0 ? 0 : (Y2 + e2 & 0 - n2) - e2 | 0) + aa2 | 0, e2 = f[1862] | 0, n2 = U2 + e2 | 0, U2 >>> 0 > B2 >>> 0 & U2 >>> 0 < 2147483647) : 0) {
                  Y2 = f[1864] | 0;
                  if (Y2 | 0 ? n2 >>> 0 <= e2 >>> 0 | n2 >>> 0 > Y2 >>> 0 : 0) {
                    ca2 = 0;
                    break;
                  }
                  Y2 = ec(U2 | 0) | 0;
                  if ((Y2 | 0) == (X2 | 0)) {
                    da2 = U2;
                    ea2 = X2;
                    H2 = 135;
                    break b;
                  } else {
                    fa2 = Y2;
                    ga2 = U2;
                    H2 = 126;
                  }
                } else ca2 = 0;
              }
            while (0);
            do
              if ((H2 | 0) == 126) {
                U2 = 0 - ga2 | 0;
                if (!(S2 >>> 0 > ga2 >>> 0 & (ga2 >>> 0 < 2147483647 & (fa2 | 0) != (-1 | 0)))) if ((fa2 | 0) == (-1 | 0)) {
                  ca2 = 0;
                  break;
                } else {
                  da2 = ga2;
                  ea2 = fa2;
                  H2 = 135;
                  break b;
                }
                Y2 = f[1874] | 0;
                X2 = c2 - ga2 + Y2 & 0 - Y2;
                if (X2 >>> 0 >= 2147483647) {
                  da2 = ga2;
                  ea2 = fa2;
                  H2 = 135;
                  break b;
                }
                if ((ec(X2 | 0) | 0) == (-1 | 0)) {
                  ec(U2 | 0) | 0;
                  ca2 = 0;
                  break;
                } else {
                  da2 = X2 + ga2 | 0;
                  ea2 = fa2;
                  H2 = 135;
                  break b;
                }
              }
            while (0);
            f[1865] = f[1865] | 4;
            ha2 = ca2;
            H2 = 133;
          } else {
            ha2 = 0;
            H2 = 133;
          }
        while (0);
        if (((H2 | 0) == 133 ? aa2 >>> 0 < 2147483647 : 0) ? (ca2 = ec(aa2 | 0) | 0, aa2 = ec(0) | 0, fa2 = aa2 - ca2 | 0, ga2 = fa2 >>> 0 > (B2 + 40 | 0) >>> 0, !((ca2 | 0) == (-1 | 0) | ga2 ^ 1 | ca2 >>> 0 < aa2 >>> 0 & ((ca2 | 0) != (-1 | 0) & (aa2 | 0) != (-1 | 0)) ^ 1)) : 0) {
          da2 = ga2 ? fa2 : ha2;
          ea2 = ca2;
          H2 = 135;
        }
        if ((H2 | 0) == 135) {
          ca2 = (f[1862] | 0) + da2 | 0;
          f[1862] = ca2;
          if (ca2 >>> 0 > (f[1863] | 0) >>> 0) f[1863] = ca2;
          ca2 = f[1760] | 0;
          do
            if (ca2) {
              ha2 = 7464;
              while (1) {
                ia2 = f[ha2 >> 2] | 0;
                ja2 = ha2 + 4 | 0;
                ka2 = f[ja2 >> 2] | 0;
                if ((ea2 | 0) == (ia2 + ka2 | 0)) {
                  H2 = 145;
                  break;
                }
                fa2 = f[ha2 + 8 >> 2] | 0;
                if (!fa2) break;
                else ha2 = fa2;
              }
              if (((H2 | 0) == 145 ? (f[ha2 + 12 >> 2] & 8 | 0) == 0 : 0) ? ca2 >>> 0 < ea2 >>> 0 & ca2 >>> 0 >= ia2 >>> 0 : 0) {
                f[ja2 >> 2] = ka2 + da2;
                fa2 = ca2 + 8 | 0;
                ga2 = (fa2 & 7 | 0) == 0 ? 0 : 0 - fa2 & 7;
                fa2 = ca2 + ga2 | 0;
                aa2 = (f[1757] | 0) + (da2 - ga2) | 0;
                f[1760] = fa2;
                f[1757] = aa2;
                f[fa2 + 4 >> 2] = aa2 | 1;
                f[fa2 + aa2 + 4 >> 2] = 40;
                f[1761] = f[1876];
                break;
              }
              if (ea2 >>> 0 < (f[1758] | 0) >>> 0) f[1758] = ea2;
              aa2 = ea2 + da2 | 0;
              fa2 = 7464;
              while (1) {
                if ((f[fa2 >> 2] | 0) == (aa2 | 0)) {
                  H2 = 153;
                  break;
                }
                ga2 = f[fa2 + 8 >> 2] | 0;
                if (!ga2) break;
                else fa2 = ga2;
              }
              if ((H2 | 0) == 153 ? (f[fa2 + 12 >> 2] & 8 | 0) == 0 : 0) {
                f[fa2 >> 2] = ea2;
                ha2 = fa2 + 4 | 0;
                f[ha2 >> 2] = (f[ha2 >> 2] | 0) + da2;
                ha2 = ea2 + 8 | 0;
                ga2 = ea2 + ((ha2 & 7 | 0) == 0 ? 0 : 0 - ha2 & 7) | 0;
                ha2 = aa2 + 8 | 0;
                c2 = aa2 + ((ha2 & 7 | 0) == 0 ? 0 : 0 - ha2 & 7) | 0;
                ha2 = ga2 + B2 | 0;
                S2 = c2 - ga2 - B2 | 0;
                f[ga2 + 4 >> 2] = B2 | 3;
                do
                  if ((c2 | 0) != (ca2 | 0)) {
                    if ((c2 | 0) == (f[1759] | 0)) {
                      ba2 = (f[1756] | 0) + S2 | 0;
                      f[1756] = ba2;
                      f[1759] = ha2;
                      f[ha2 + 4 >> 2] = ba2 | 1;
                      f[ha2 + ba2 >> 2] = ba2;
                      break;
                    }
                    ba2 = f[c2 + 4 >> 2] | 0;
                    if ((ba2 & 3 | 0) == 1) {
                      _2 = ba2 & -8;
                      $2 = ba2 >>> 3;
                      d: do
                        if (ba2 >>> 0 < 256) {
                          T2 = f[c2 + 8 >> 2] | 0;
                          X2 = f[c2 + 12 >> 2] | 0;
                          if ((X2 | 0) == (T2 | 0)) {
                            f[1754] = f[1754] & ~(1 << $2);
                            break;
                          } else {
                            f[T2 + 12 >> 2] = X2;
                            f[X2 + 8 >> 2] = T2;
                            break;
                          }
                        } else {
                          T2 = f[c2 + 24 >> 2] | 0;
                          X2 = f[c2 + 12 >> 2] | 0;
                          do
                            if ((X2 | 0) == (c2 | 0)) {
                              U2 = c2 + 16 | 0;
                              Y2 = U2 + 4 | 0;
                              n2 = f[Y2 >> 2] | 0;
                              if (!n2) {
                                e2 = f[U2 >> 2] | 0;
                                if (!e2) {
                                  la2 = 0;
                                  break;
                                } else {
                                  ma2 = e2;
                                  na2 = U2;
                                }
                              } else {
                                ma2 = n2;
                                na2 = Y2;
                              }
                              while (1) {
                                Y2 = ma2 + 20 | 0;
                                n2 = f[Y2 >> 2] | 0;
                                if (n2 | 0) {
                                  ma2 = n2;
                                  na2 = Y2;
                                  continue;
                                }
                                Y2 = ma2 + 16 | 0;
                                n2 = f[Y2 >> 2] | 0;
                                if (!n2) break;
                                else {
                                  ma2 = n2;
                                  na2 = Y2;
                                }
                              }
                              f[na2 >> 2] = 0;
                              la2 = ma2;
                            } else {
                              Y2 = f[c2 + 8 >> 2] | 0;
                              f[Y2 + 12 >> 2] = X2;
                              f[X2 + 8 >> 2] = Y2;
                              la2 = X2;
                            }
                          while (0);
                          if (!T2) break;
                          X2 = f[c2 + 28 >> 2] | 0;
                          Y2 = 7320 + (X2 << 2) | 0;
                          do
                            if ((c2 | 0) != (f[Y2 >> 2] | 0)) {
                              f[T2 + 16 + (((f[T2 + 16 >> 2] | 0) != (c2 | 0) & 1) << 2) >> 2] = la2;
                              if (!la2) break d;
                            } else {
                              f[Y2 >> 2] = la2;
                              if (la2 | 0) break;
                              f[1755] = f[1755] & ~(1 << X2);
                              break d;
                            }
                          while (0);
                          f[la2 + 24 >> 2] = T2;
                          X2 = c2 + 16 | 0;
                          Y2 = f[X2 >> 2] | 0;
                          if (Y2 | 0) {
                            f[la2 + 16 >> 2] = Y2;
                            f[Y2 + 24 >> 2] = la2;
                          }
                          Y2 = f[X2 + 4 >> 2] | 0;
                          if (!Y2) break;
                          f[la2 + 20 >> 2] = Y2;
                          f[Y2 + 24 >> 2] = la2;
                        }
                      while (0);
                      oa2 = c2 + _2 | 0;
                      pa2 = _2 + S2 | 0;
                    } else {
                      oa2 = c2;
                      pa2 = S2;
                    }
                    $2 = oa2 + 4 | 0;
                    f[$2 >> 2] = f[$2 >> 2] & -2;
                    f[ha2 + 4 >> 2] = pa2 | 1;
                    f[ha2 + pa2 >> 2] = pa2;
                    $2 = pa2 >>> 3;
                    if (pa2 >>> 0 < 256) {
                      ba2 = 7056 + ($2 << 1 << 2) | 0;
                      Z2 = f[1754] | 0;
                      Y2 = 1 << $2;
                      if (!(Z2 & Y2)) {
                        f[1754] = Z2 | Y2;
                        qa2 = ba2;
                        ra2 = ba2 + 8 | 0;
                      } else {
                        Y2 = ba2 + 8 | 0;
                        qa2 = f[Y2 >> 2] | 0;
                        ra2 = Y2;
                      }
                      f[ra2 >> 2] = ha2;
                      f[qa2 + 12 >> 2] = ha2;
                      f[ha2 + 8 >> 2] = qa2;
                      f[ha2 + 12 >> 2] = ba2;
                      break;
                    }
                    ba2 = pa2 >>> 8;
                    do
                      if (!ba2) sa2 = 0;
                      else {
                        if (pa2 >>> 0 > 16777215) {
                          sa2 = 31;
                          break;
                        }
                        Y2 = (ba2 + 1048320 | 0) >>> 16 & 8;
                        Z2 = ba2 << Y2;
                        $2 = (Z2 + 520192 | 0) >>> 16 & 4;
                        X2 = Z2 << $2;
                        Z2 = (X2 + 245760 | 0) >>> 16 & 2;
                        n2 = 14 - ($2 | Y2 | Z2) + (X2 << Z2 >>> 15) | 0;
                        sa2 = pa2 >>> (n2 + 7 | 0) & 1 | n2 << 1;
                      }
                    while (0);
                    ba2 = 7320 + (sa2 << 2) | 0;
                    f[ha2 + 28 >> 2] = sa2;
                    _2 = ha2 + 16 | 0;
                    f[_2 + 4 >> 2] = 0;
                    f[_2 >> 2] = 0;
                    _2 = f[1755] | 0;
                    n2 = 1 << sa2;
                    if (!(_2 & n2)) {
                      f[1755] = _2 | n2;
                      f[ba2 >> 2] = ha2;
                      f[ha2 + 24 >> 2] = ba2;
                      f[ha2 + 12 >> 2] = ha2;
                      f[ha2 + 8 >> 2] = ha2;
                      break;
                    }
                    n2 = pa2 << ((sa2 | 0) == 31 ? 0 : 25 - (sa2 >>> 1) | 0);
                    _2 = f[ba2 >> 2] | 0;
                    while (1) {
                      if ((f[_2 + 4 >> 2] & -8 | 0) == (pa2 | 0)) {
                        H2 = 194;
                        break;
                      }
                      ta2 = _2 + 16 + (n2 >>> 31 << 2) | 0;
                      ba2 = f[ta2 >> 2] | 0;
                      if (!ba2) {
                        H2 = 193;
                        break;
                      } else {
                        n2 = n2 << 1;
                        _2 = ba2;
                      }
                    }
                    if ((H2 | 0) == 193) {
                      f[ta2 >> 2] = ha2;
                      f[ha2 + 24 >> 2] = _2;
                      f[ha2 + 12 >> 2] = ha2;
                      f[ha2 + 8 >> 2] = ha2;
                      break;
                    } else if ((H2 | 0) == 194) {
                      n2 = _2 + 8 | 0;
                      ba2 = f[n2 >> 2] | 0;
                      f[ba2 + 12 >> 2] = ha2;
                      f[n2 >> 2] = ha2;
                      f[ha2 + 8 >> 2] = ba2;
                      f[ha2 + 12 >> 2] = _2;
                      f[ha2 + 24 >> 2] = 0;
                      break;
                    }
                  } else {
                    ba2 = (f[1757] | 0) + S2 | 0;
                    f[1757] = ba2;
                    f[1760] = ha2;
                    f[ha2 + 4 >> 2] = ba2 | 1;
                  }
                while (0);
                o2 = ga2 + 8 | 0;
                u = b2;
                return o2 | 0;
              }
              ha2 = 7464;
              while (1) {
                S2 = f[ha2 >> 2] | 0;
                if (S2 >>> 0 <= ca2 >>> 0 ? (ua2 = S2 + (f[ha2 + 4 >> 2] | 0) | 0, ua2 >>> 0 > ca2 >>> 0) : 0) break;
                ha2 = f[ha2 + 8 >> 2] | 0;
              }
              ha2 = ua2 + -47 | 0;
              ga2 = ha2 + 8 | 0;
              S2 = ha2 + ((ga2 & 7 | 0) == 0 ? 0 : 0 - ga2 & 7) | 0;
              ga2 = ca2 + 16 | 0;
              ha2 = S2 >>> 0 < ga2 >>> 0 ? ca2 : S2;
              S2 = ha2 + 8 | 0;
              c2 = ea2 + 8 | 0;
              aa2 = (c2 & 7 | 0) == 0 ? 0 : 0 - c2 & 7;
              c2 = ea2 + aa2 | 0;
              fa2 = da2 + -40 - aa2 | 0;
              f[1760] = c2;
              f[1757] = fa2;
              f[c2 + 4 >> 2] = fa2 | 1;
              f[c2 + fa2 + 4 >> 2] = 40;
              f[1761] = f[1876];
              fa2 = ha2 + 4 | 0;
              f[fa2 >> 2] = 27;
              f[S2 >> 2] = f[1866];
              f[S2 + 4 >> 2] = f[1867];
              f[S2 + 8 >> 2] = f[1868];
              f[S2 + 12 >> 2] = f[1869];
              f[1866] = ea2;
              f[1867] = da2;
              f[1869] = 0;
              f[1868] = S2;
              S2 = ha2 + 24 | 0;
              do {
                c2 = S2;
                S2 = S2 + 4 | 0;
                f[S2 >> 2] = 7;
              } while ((c2 + 8 | 0) >>> 0 < ua2 >>> 0);
              if ((ha2 | 0) != (ca2 | 0)) {
                S2 = ha2 - ca2 | 0;
                f[fa2 >> 2] = f[fa2 >> 2] & -2;
                f[ca2 + 4 >> 2] = S2 | 1;
                f[ha2 >> 2] = S2;
                c2 = S2 >>> 3;
                if (S2 >>> 0 < 256) {
                  aa2 = 7056 + (c2 << 1 << 2) | 0;
                  ba2 = f[1754] | 0;
                  n2 = 1 << c2;
                  if (!(ba2 & n2)) {
                    f[1754] = ba2 | n2;
                    va2 = aa2;
                    wa2 = aa2 + 8 | 0;
                  } else {
                    n2 = aa2 + 8 | 0;
                    va2 = f[n2 >> 2] | 0;
                    wa2 = n2;
                  }
                  f[wa2 >> 2] = ca2;
                  f[va2 + 12 >> 2] = ca2;
                  f[ca2 + 8 >> 2] = va2;
                  f[ca2 + 12 >> 2] = aa2;
                  break;
                }
                aa2 = S2 >>> 8;
                if (aa2) if (S2 >>> 0 > 16777215) xa2 = 31;
                else {
                  n2 = (aa2 + 1048320 | 0) >>> 16 & 8;
                  ba2 = aa2 << n2;
                  aa2 = (ba2 + 520192 | 0) >>> 16 & 4;
                  c2 = ba2 << aa2;
                  ba2 = (c2 + 245760 | 0) >>> 16 & 2;
                  Z2 = 14 - (aa2 | n2 | ba2) + (c2 << ba2 >>> 15) | 0;
                  xa2 = S2 >>> (Z2 + 7 | 0) & 1 | Z2 << 1;
                }
                else xa2 = 0;
                Z2 = 7320 + (xa2 << 2) | 0;
                f[ca2 + 28 >> 2] = xa2;
                f[ca2 + 20 >> 2] = 0;
                f[ga2 >> 2] = 0;
                ba2 = f[1755] | 0;
                c2 = 1 << xa2;
                if (!(ba2 & c2)) {
                  f[1755] = ba2 | c2;
                  f[Z2 >> 2] = ca2;
                  f[ca2 + 24 >> 2] = Z2;
                  f[ca2 + 12 >> 2] = ca2;
                  f[ca2 + 8 >> 2] = ca2;
                  break;
                }
                c2 = S2 << ((xa2 | 0) == 31 ? 0 : 25 - (xa2 >>> 1) | 0);
                ba2 = f[Z2 >> 2] | 0;
                while (1) {
                  if ((f[ba2 + 4 >> 2] & -8 | 0) == (S2 | 0)) {
                    H2 = 216;
                    break;
                  }
                  ya2 = ba2 + 16 + (c2 >>> 31 << 2) | 0;
                  Z2 = f[ya2 >> 2] | 0;
                  if (!Z2) {
                    H2 = 215;
                    break;
                  } else {
                    c2 = c2 << 1;
                    ba2 = Z2;
                  }
                }
                if ((H2 | 0) == 215) {
                  f[ya2 >> 2] = ca2;
                  f[ca2 + 24 >> 2] = ba2;
                  f[ca2 + 12 >> 2] = ca2;
                  f[ca2 + 8 >> 2] = ca2;
                  break;
                } else if ((H2 | 0) == 216) {
                  c2 = ba2 + 8 | 0;
                  S2 = f[c2 >> 2] | 0;
                  f[S2 + 12 >> 2] = ca2;
                  f[c2 >> 2] = ca2;
                  f[ca2 + 8 >> 2] = S2;
                  f[ca2 + 12 >> 2] = ba2;
                  f[ca2 + 24 >> 2] = 0;
                  break;
                }
              }
            } else {
              S2 = f[1758] | 0;
              if ((S2 | 0) == 0 | ea2 >>> 0 < S2 >>> 0) f[1758] = ea2;
              f[1866] = ea2;
              f[1867] = da2;
              f[1869] = 0;
              f[1763] = f[1872];
              f[1762] = -1;
              S2 = 0;
              do {
                c2 = 7056 + (S2 << 1 << 2) | 0;
                f[c2 + 12 >> 2] = c2;
                f[c2 + 8 >> 2] = c2;
                S2 = S2 + 1 | 0;
              } while ((S2 | 0) != 32);
              S2 = ea2 + 8 | 0;
              ba2 = (S2 & 7 | 0) == 0 ? 0 : 0 - S2 & 7;
              S2 = ea2 + ba2 | 0;
              c2 = da2 + -40 - ba2 | 0;
              f[1760] = S2;
              f[1757] = c2;
              f[S2 + 4 >> 2] = c2 | 1;
              f[S2 + c2 + 4 >> 2] = 40;
              f[1761] = f[1876];
            }
          while (0);
          da2 = f[1757] | 0;
          if (da2 >>> 0 > B2 >>> 0) {
            ea2 = da2 - B2 | 0;
            f[1757] = ea2;
            da2 = f[1760] | 0;
            ca2 = da2 + B2 | 0;
            f[1760] = ca2;
            f[ca2 + 4 >> 2] = ea2 | 1;
            f[da2 + 4 >> 2] = B2 | 3;
            o2 = da2 + 8 | 0;
            u = b2;
            return o2 | 0;
          }
        }
        da2 = Ab() | 0;
        f[da2 >> 2] = 12;
        o2 = 0;
        u = b2;
        return o2 | 0;
      }
      function vb(a2) {
        a2 = a2 | 0;
        var b2 = 0, c2 = 0, d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, u2 = 0, v2 = 0, w2 = 0, x2 = 0, y2 = 0, z2 = 0, A2 = 0, B2 = 0, C2 = 0, D2 = 0;
        if (!a2) return;
        b2 = a2 + -8 | 0;
        c2 = f[1758] | 0;
        d2 = f[a2 + -4 >> 2] | 0;
        a2 = d2 & -8;
        e2 = b2 + a2 | 0;
        do
          if (!(d2 & 1)) {
            g2 = f[b2 >> 2] | 0;
            if (!(d2 & 3)) return;
            h2 = b2 + (0 - g2) | 0;
            i3 = g2 + a2 | 0;
            if (h2 >>> 0 < c2 >>> 0) return;
            if ((h2 | 0) == (f[1759] | 0)) {
              j2 = e2 + 4 | 0;
              k2 = f[j2 >> 2] | 0;
              if ((k2 & 3 | 0) != 3) {
                l2 = h2;
                m2 = i3;
                n2 = h2;
                break;
              }
              f[1756] = i3;
              f[j2 >> 2] = k2 & -2;
              f[h2 + 4 >> 2] = i3 | 1;
              f[h2 + i3 >> 2] = i3;
              return;
            }
            k2 = g2 >>> 3;
            if (g2 >>> 0 < 256) {
              g2 = f[h2 + 8 >> 2] | 0;
              j2 = f[h2 + 12 >> 2] | 0;
              if ((j2 | 0) == (g2 | 0)) {
                f[1754] = f[1754] & ~(1 << k2);
                l2 = h2;
                m2 = i3;
                n2 = h2;
                break;
              } else {
                f[g2 + 12 >> 2] = j2;
                f[j2 + 8 >> 2] = g2;
                l2 = h2;
                m2 = i3;
                n2 = h2;
                break;
              }
            }
            g2 = f[h2 + 24 >> 2] | 0;
            j2 = f[h2 + 12 >> 2] | 0;
            do
              if ((j2 | 0) == (h2 | 0)) {
                k2 = h2 + 16 | 0;
                o2 = k2 + 4 | 0;
                p2 = f[o2 >> 2] | 0;
                if (!p2) {
                  q2 = f[k2 >> 2] | 0;
                  if (!q2) {
                    r2 = 0;
                    break;
                  } else {
                    s2 = q2;
                    t2 = k2;
                  }
                } else {
                  s2 = p2;
                  t2 = o2;
                }
                while (1) {
                  o2 = s2 + 20 | 0;
                  p2 = f[o2 >> 2] | 0;
                  if (p2 | 0) {
                    s2 = p2;
                    t2 = o2;
                    continue;
                  }
                  o2 = s2 + 16 | 0;
                  p2 = f[o2 >> 2] | 0;
                  if (!p2) break;
                  else {
                    s2 = p2;
                    t2 = o2;
                  }
                }
                f[t2 >> 2] = 0;
                r2 = s2;
              } else {
                o2 = f[h2 + 8 >> 2] | 0;
                f[o2 + 12 >> 2] = j2;
                f[j2 + 8 >> 2] = o2;
                r2 = j2;
              }
            while (0);
            if (g2) {
              j2 = f[h2 + 28 >> 2] | 0;
              o2 = 7320 + (j2 << 2) | 0;
              if ((h2 | 0) == (f[o2 >> 2] | 0)) {
                f[o2 >> 2] = r2;
                if (!r2) {
                  f[1755] = f[1755] & ~(1 << j2);
                  l2 = h2;
                  m2 = i3;
                  n2 = h2;
                  break;
                }
              } else {
                f[g2 + 16 + (((f[g2 + 16 >> 2] | 0) != (h2 | 0) & 1) << 2) >> 2] = r2;
                if (!r2) {
                  l2 = h2;
                  m2 = i3;
                  n2 = h2;
                  break;
                }
              }
              f[r2 + 24 >> 2] = g2;
              j2 = h2 + 16 | 0;
              o2 = f[j2 >> 2] | 0;
              if (o2 | 0) {
                f[r2 + 16 >> 2] = o2;
                f[o2 + 24 >> 2] = r2;
              }
              o2 = f[j2 + 4 >> 2] | 0;
              if (o2) {
                f[r2 + 20 >> 2] = o2;
                f[o2 + 24 >> 2] = r2;
                l2 = h2;
                m2 = i3;
                n2 = h2;
              } else {
                l2 = h2;
                m2 = i3;
                n2 = h2;
              }
            } else {
              l2 = h2;
              m2 = i3;
              n2 = h2;
            }
          } else {
            l2 = b2;
            m2 = a2;
            n2 = b2;
          }
        while (0);
        if (n2 >>> 0 >= e2 >>> 0) return;
        b2 = e2 + 4 | 0;
        a2 = f[b2 >> 2] | 0;
        if (!(a2 & 1)) return;
        if (!(a2 & 2)) {
          r2 = f[1759] | 0;
          if ((e2 | 0) == (f[1760] | 0)) {
            s2 = (f[1757] | 0) + m2 | 0;
            f[1757] = s2;
            f[1760] = l2;
            f[l2 + 4 >> 2] = s2 | 1;
            if ((l2 | 0) != (r2 | 0)) return;
            f[1759] = 0;
            f[1756] = 0;
            return;
          }
          if ((e2 | 0) == (r2 | 0)) {
            r2 = (f[1756] | 0) + m2 | 0;
            f[1756] = r2;
            f[1759] = n2;
            f[l2 + 4 >> 2] = r2 | 1;
            f[n2 + r2 >> 2] = r2;
            return;
          }
          r2 = (a2 & -8) + m2 | 0;
          s2 = a2 >>> 3;
          do
            if (a2 >>> 0 < 256) {
              t2 = f[e2 + 8 >> 2] | 0;
              c2 = f[e2 + 12 >> 2] | 0;
              if ((c2 | 0) == (t2 | 0)) {
                f[1754] = f[1754] & ~(1 << s2);
                break;
              } else {
                f[t2 + 12 >> 2] = c2;
                f[c2 + 8 >> 2] = t2;
                break;
              }
            } else {
              t2 = f[e2 + 24 >> 2] | 0;
              c2 = f[e2 + 12 >> 2] | 0;
              do
                if ((c2 | 0) == (e2 | 0)) {
                  d2 = e2 + 16 | 0;
                  o2 = d2 + 4 | 0;
                  j2 = f[o2 >> 2] | 0;
                  if (!j2) {
                    p2 = f[d2 >> 2] | 0;
                    if (!p2) {
                      u2 = 0;
                      break;
                    } else {
                      v2 = p2;
                      w2 = d2;
                    }
                  } else {
                    v2 = j2;
                    w2 = o2;
                  }
                  while (1) {
                    o2 = v2 + 20 | 0;
                    j2 = f[o2 >> 2] | 0;
                    if (j2 | 0) {
                      v2 = j2;
                      w2 = o2;
                      continue;
                    }
                    o2 = v2 + 16 | 0;
                    j2 = f[o2 >> 2] | 0;
                    if (!j2) break;
                    else {
                      v2 = j2;
                      w2 = o2;
                    }
                  }
                  f[w2 >> 2] = 0;
                  u2 = v2;
                } else {
                  o2 = f[e2 + 8 >> 2] | 0;
                  f[o2 + 12 >> 2] = c2;
                  f[c2 + 8 >> 2] = o2;
                  u2 = c2;
                }
              while (0);
              if (t2 | 0) {
                c2 = f[e2 + 28 >> 2] | 0;
                h2 = 7320 + (c2 << 2) | 0;
                if ((e2 | 0) == (f[h2 >> 2] | 0)) {
                  f[h2 >> 2] = u2;
                  if (!u2) {
                    f[1755] = f[1755] & ~(1 << c2);
                    break;
                  }
                } else {
                  f[t2 + 16 + (((f[t2 + 16 >> 2] | 0) != (e2 | 0) & 1) << 2) >> 2] = u2;
                  if (!u2) break;
                }
                f[u2 + 24 >> 2] = t2;
                c2 = e2 + 16 | 0;
                h2 = f[c2 >> 2] | 0;
                if (h2 | 0) {
                  f[u2 + 16 >> 2] = h2;
                  f[h2 + 24 >> 2] = u2;
                }
                h2 = f[c2 + 4 >> 2] | 0;
                if (h2 | 0) {
                  f[u2 + 20 >> 2] = h2;
                  f[h2 + 24 >> 2] = u2;
                }
              }
            }
          while (0);
          f[l2 + 4 >> 2] = r2 | 1;
          f[n2 + r2 >> 2] = r2;
          if ((l2 | 0) == (f[1759] | 0)) {
            f[1756] = r2;
            return;
          } else x2 = r2;
        } else {
          f[b2 >> 2] = a2 & -2;
          f[l2 + 4 >> 2] = m2 | 1;
          f[n2 + m2 >> 2] = m2;
          x2 = m2;
        }
        m2 = x2 >>> 3;
        if (x2 >>> 0 < 256) {
          n2 = 7056 + (m2 << 1 << 2) | 0;
          a2 = f[1754] | 0;
          b2 = 1 << m2;
          if (!(a2 & b2)) {
            f[1754] = a2 | b2;
            y2 = n2;
            z2 = n2 + 8 | 0;
          } else {
            b2 = n2 + 8 | 0;
            y2 = f[b2 >> 2] | 0;
            z2 = b2;
          }
          f[z2 >> 2] = l2;
          f[y2 + 12 >> 2] = l2;
          f[l2 + 8 >> 2] = y2;
          f[l2 + 12 >> 2] = n2;
          return;
        }
        n2 = x2 >>> 8;
        if (n2) if (x2 >>> 0 > 16777215) A2 = 31;
        else {
          y2 = (n2 + 1048320 | 0) >>> 16 & 8;
          z2 = n2 << y2;
          n2 = (z2 + 520192 | 0) >>> 16 & 4;
          b2 = z2 << n2;
          z2 = (b2 + 245760 | 0) >>> 16 & 2;
          a2 = 14 - (n2 | y2 | z2) + (b2 << z2 >>> 15) | 0;
          A2 = x2 >>> (a2 + 7 | 0) & 1 | a2 << 1;
        }
        else A2 = 0;
        a2 = 7320 + (A2 << 2) | 0;
        f[l2 + 28 >> 2] = A2;
        f[l2 + 20 >> 2] = 0;
        f[l2 + 16 >> 2] = 0;
        z2 = f[1755] | 0;
        b2 = 1 << A2;
        do
          if (z2 & b2) {
            y2 = x2 << ((A2 | 0) == 31 ? 0 : 25 - (A2 >>> 1) | 0);
            n2 = f[a2 >> 2] | 0;
            while (1) {
              if ((f[n2 + 4 >> 2] & -8 | 0) == (x2 | 0)) {
                B2 = 73;
                break;
              }
              C2 = n2 + 16 + (y2 >>> 31 << 2) | 0;
              m2 = f[C2 >> 2] | 0;
              if (!m2) {
                B2 = 72;
                break;
              } else {
                y2 = y2 << 1;
                n2 = m2;
              }
            }
            if ((B2 | 0) == 72) {
              f[C2 >> 2] = l2;
              f[l2 + 24 >> 2] = n2;
              f[l2 + 12 >> 2] = l2;
              f[l2 + 8 >> 2] = l2;
              break;
            } else if ((B2 | 0) == 73) {
              y2 = n2 + 8 | 0;
              t2 = f[y2 >> 2] | 0;
              f[t2 + 12 >> 2] = l2;
              f[y2 >> 2] = l2;
              f[l2 + 8 >> 2] = t2;
              f[l2 + 12 >> 2] = n2;
              f[l2 + 24 >> 2] = 0;
              break;
            }
          } else {
            f[1755] = z2 | b2;
            f[a2 >> 2] = l2;
            f[l2 + 24 >> 2] = a2;
            f[l2 + 12 >> 2] = l2;
            f[l2 + 8 >> 2] = l2;
          }
        while (0);
        l2 = (f[1762] | 0) + -1 | 0;
        f[1762] = l2;
        if (!l2) D2 = 7472;
        else return;
        while (1) {
          l2 = f[D2 >> 2] | 0;
          if (!l2) break;
          else D2 = l2 + 8 | 0;
        }
        f[1762] = -1;
        return;
      }
      function wb() {
        return 7512;
      }
      function xb(a2) {
        a2 = a2 | 0;
        var b2 = 0, c2 = 0, d2 = 0;
        b2 = u;
        u = u + 16 | 0;
        c2 = b2;
        d2 = Db(f[a2 + 60 >> 2] | 0) | 0;
        f[c2 >> 2] = d2;
        d2 = zb(ma(6, c2 | 0) | 0) | 0;
        u = b2;
        return d2 | 0;
      }
      function yb(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, h2 = 0;
        d2 = u;
        u = u + 32 | 0;
        e2 = d2;
        g2 = d2 + 20 | 0;
        f[e2 >> 2] = f[a2 + 60 >> 2];
        f[e2 + 4 >> 2] = 0;
        f[e2 + 8 >> 2] = b2;
        f[e2 + 12 >> 2] = g2;
        f[e2 + 16 >> 2] = c2;
        if ((zb(oa(140, e2 | 0) | 0) | 0) < 0) {
          f[g2 >> 2] = -1;
          h2 = -1;
        } else h2 = f[g2 >> 2] | 0;
        u = d2;
        return h2 | 0;
      }
      function zb(a2) {
        a2 = a2 | 0;
        var b2 = 0, c2 = 0;
        if (a2 >>> 0 > 4294963200) {
          b2 = Ab() | 0;
          f[b2 >> 2] = 0 - a2;
          c2 = -1;
        } else c2 = a2;
        return c2 | 0;
      }
      function Ab() {
        return (Bb() | 0) + 64 | 0;
      }
      function Bb() {
        return Cb() | 0;
      }
      function Cb() {
        return 208;
      }
      function Db(a2) {
        a2 = a2 | 0;
        return a2 | 0;
      }
      function Eb(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0, r2 = 0, s2 = 0, t2 = 0, v2 = 0, w2 = 0;
        d2 = u;
        u = u + 48 | 0;
        e2 = d2 + 16 | 0;
        g2 = d2;
        h2 = d2 + 32 | 0;
        i3 = a2 + 28 | 0;
        j2 = f[i3 >> 2] | 0;
        f[h2 >> 2] = j2;
        k2 = a2 + 20 | 0;
        l2 = (f[k2 >> 2] | 0) - j2 | 0;
        f[h2 + 4 >> 2] = l2;
        f[h2 + 8 >> 2] = b2;
        f[h2 + 12 >> 2] = c2;
        b2 = l2 + c2 | 0;
        l2 = a2 + 60 | 0;
        f[g2 >> 2] = f[l2 >> 2];
        f[g2 + 4 >> 2] = h2;
        f[g2 + 8 >> 2] = 2;
        j2 = zb(xa(146, g2 | 0) | 0) | 0;
        a: do
          if ((b2 | 0) != (j2 | 0)) {
            g2 = 2;
            m2 = b2;
            n2 = h2;
            o2 = j2;
            while (1) {
              if ((o2 | 0) < 0) break;
              m2 = m2 - o2 | 0;
              p2 = f[n2 + 4 >> 2] | 0;
              q2 = o2 >>> 0 > p2 >>> 0;
              r2 = q2 ? n2 + 8 | 0 : n2;
              s2 = (q2 << 31 >> 31) + g2 | 0;
              t2 = o2 - (q2 ? p2 : 0) | 0;
              f[r2 >> 2] = (f[r2 >> 2] | 0) + t2;
              p2 = r2 + 4 | 0;
              f[p2 >> 2] = (f[p2 >> 2] | 0) - t2;
              f[e2 >> 2] = f[l2 >> 2];
              f[e2 + 4 >> 2] = r2;
              f[e2 + 8 >> 2] = s2;
              o2 = zb(xa(146, e2 | 0) | 0) | 0;
              if ((m2 | 0) == (o2 | 0)) {
                v2 = 3;
                break a;
              } else {
                g2 = s2;
                n2 = r2;
              }
            }
            f[a2 + 16 >> 2] = 0;
            f[i3 >> 2] = 0;
            f[k2 >> 2] = 0;
            f[a2 >> 2] = f[a2 >> 2] | 32;
            if ((g2 | 0) == 2) w2 = 0;
            else w2 = c2 - (f[n2 + 4 >> 2] | 0) | 0;
          } else v2 = 3;
        while (0);
        if ((v2 | 0) == 3) {
          v2 = f[a2 + 44 >> 2] | 0;
          f[a2 + 16 >> 2] = v2 + (f[a2 + 48 >> 2] | 0);
          f[i3 >> 2] = v2;
          f[k2 >> 2] = v2;
          w2 = c2;
        }
        u = d2;
        return w2 | 0;
      }
      function Fb(a2, c2, d2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, g2 = 0;
        e2 = u;
        u = u + 32 | 0;
        g2 = e2;
        f[a2 + 36 >> 2] = 4;
        if ((f[a2 >> 2] & 64 | 0) == 0 ? (f[g2 >> 2] = f[a2 + 60 >> 2], f[g2 + 4 >> 2] = 21523, f[g2 + 8 >> 2] = e2 + 16, sa(54, g2 | 0) | 0) : 0) b[a2 + 75 >> 0] = -1;
        g2 = Eb(a2, c2, d2) | 0;
        u = e2;
        return g2 | 0;
      }
      function Gb(a2) {
        a2 = a2 | 0;
        return 0;
      }
      function Hb(a2) {
        a2 = a2 | 0;
        return;
      }
      function Ib() {
        la(7576);
        return 7584;
      }
      function Jb() {
        ta(7576);
        return;
      }
      function Kb(a2) {
        a2 = a2 | 0;
        var b2 = 0, c2 = 0, d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0;
        do
          if (a2) {
            if ((f[a2 + 76 >> 2] | 0) <= -1) {
              b2 = Lb(a2) | 0;
              break;
            }
            c2 = (Gb(a2) | 0) == 0;
            d2 = Lb(a2) | 0;
            if (c2) b2 = d2;
            else {
              Hb(a2);
              b2 = d2;
            }
          } else {
            if (!(f[144] | 0)) e2 = 0;
            else e2 = Kb(f[144] | 0) | 0;
            d2 = Ib() | 0;
            c2 = f[d2 >> 2] | 0;
            if (!c2) g2 = e2;
            else {
              d2 = c2;
              c2 = e2;
              while (1) {
                if ((f[d2 + 76 >> 2] | 0) > -1) h2 = Gb(d2) | 0;
                else h2 = 0;
                if ((f[d2 + 20 >> 2] | 0) >>> 0 > (f[d2 + 28 >> 2] | 0) >>> 0) i3 = Lb(d2) | 0 | c2;
                else i3 = c2;
                if (h2 | 0) Hb(d2);
                d2 = f[d2 + 56 >> 2] | 0;
                if (!d2) {
                  g2 = i3;
                  break;
                } else c2 = i3;
              }
            }
            Jb();
            b2 = g2;
          }
        while (0);
        return b2 | 0;
      }
      function Lb(a2) {
        a2 = a2 | 0;
        var b2 = 0, c2 = 0, d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0;
        b2 = a2 + 20 | 0;
        c2 = a2 + 28 | 0;
        if ((f[b2 >> 2] | 0) >>> 0 > (f[c2 >> 2] | 0) >>> 0 ? (Ba[f[a2 + 36 >> 2] & 7](a2, 0, 0) | 0, (f[b2 >> 2] | 0) == 0) : 0) d2 = -1;
        else {
          e2 = a2 + 4 | 0;
          g2 = f[e2 >> 2] | 0;
          h2 = a2 + 8 | 0;
          i3 = f[h2 >> 2] | 0;
          if (g2 >>> 0 < i3 >>> 0) Ba[f[a2 + 40 >> 2] & 7](a2, g2 - i3 | 0, 1) | 0;
          f[a2 + 16 >> 2] = 0;
          f[c2 >> 2] = 0;
          f[b2 >> 2] = 0;
          f[h2 >> 2] = 0;
          f[e2 >> 2] = 0;
          d2 = 0;
        }
        return d2 | 0;
      }
      function Mb(a2) {
        a2 = a2 | 0;
        return;
      }
      function Nb(a2) {
        a2 = a2 | 0;
        Mb(a2);
        bc(a2);
        return;
      }
      function Ob(a2) {
        a2 = a2 | 0;
        return;
      }
      function Pb(a2) {
        a2 = a2 | 0;
        return;
      }
      function Qb(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        var d2 = 0, e2 = 0, g2 = 0, h2 = 0, i3 = 0, j2 = 0;
        d2 = u;
        u = u + 64 | 0;
        e2 = d2;
        if (!(Ub(a2, b2, 0) | 0)) if ((b2 | 0) != 0 ? (g2 = Yb(b2, 80, 64, 0) | 0, (g2 | 0) != 0) : 0) {
          b2 = e2 + 4 | 0;
          h2 = b2 + 52 | 0;
          do {
            f[b2 >> 2] = 0;
            b2 = b2 + 4 | 0;
          } while ((b2 | 0) < (h2 | 0));
          f[e2 >> 2] = g2;
          f[e2 + 8 >> 2] = a2;
          f[e2 + 12 >> 2] = -1;
          f[e2 + 48 >> 2] = 1;
          Ia[f[(f[g2 >> 2] | 0) + 28 >> 2] & 3](g2, e2, f[c2 >> 2] | 0, 1);
          if ((f[e2 + 24 >> 2] | 0) == 1) {
            f[c2 >> 2] = f[e2 + 16 >> 2];
            i3 = 1;
          } else i3 = 0;
          j2 = i3;
        } else j2 = 0;
        else j2 = 1;
        u = d2;
        return j2 | 0;
      }
      function Rb(a2, b2, c2, d2, e2, g2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        g2 = g2 | 0;
        if (Ub(a2, f[b2 + 8 >> 2] | 0, g2) | 0) Xb(0, b2, c2, d2, e2);
        return;
      }
      function Sb(a2, c2, d2, e2, g2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        g2 = g2 | 0;
        var h2 = 0, i3 = 0;
        do
          if (!(Ub(a2, f[c2 + 8 >> 2] | 0, g2) | 0)) {
            if (Ub(a2, f[c2 >> 2] | 0, g2) | 0) {
              h2 = c2 + 32 | 0;
              if ((f[c2 + 16 >> 2] | 0) != (d2 | 0) ? (i3 = c2 + 20 | 0, (f[i3 >> 2] | 0) != (d2 | 0)) : 0) {
                f[h2 >> 2] = e2;
                f[i3 >> 2] = d2;
                i3 = c2 + 40 | 0;
                f[i3 >> 2] = (f[i3 >> 2] | 0) + 1;
                if ((f[c2 + 36 >> 2] | 0) == 1 ? (f[c2 + 24 >> 2] | 0) == 2 : 0) b[c2 + 54 >> 0] = 1;
                f[c2 + 44 >> 2] = 4;
                break;
              }
              if ((e2 | 0) == 1) f[h2 >> 2] = 1;
            }
          } else Wb(0, c2, d2, e2);
        while (0);
        return;
      }
      function Tb(a2, b2, c2, d2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        if (Ub(a2, f[b2 + 8 >> 2] | 0, 0) | 0) Vb(0, b2, c2, d2);
        return;
      }
      function Ub(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        return (a2 | 0) == (b2 | 0) | 0;
      }
      function Vb(a2, c2, d2, e2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        var g2 = 0, h2 = 0, i3 = 0;
        a2 = c2 + 16 | 0;
        g2 = f[a2 >> 2] | 0;
        h2 = c2 + 36 | 0;
        i3 = c2 + 24 | 0;
        do
          if (g2) {
            if ((g2 | 0) != (d2 | 0)) {
              f[h2 >> 2] = (f[h2 >> 2] | 0) + 1;
              f[i3 >> 2] = 2;
              b[c2 + 54 >> 0] = 1;
              break;
            }
            if ((f[i3 >> 2] | 0) == 2) f[i3 >> 2] = e2;
          } else {
            f[a2 >> 2] = d2;
            f[i3 >> 2] = e2;
            f[h2 >> 2] = 1;
          }
        while (0);
        return;
      }
      function Wb(a2, b2, c2, d2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        if ((f[b2 + 4 >> 2] | 0) == (c2 | 0) ? (c2 = b2 + 28 | 0, (f[c2 >> 2] | 0) != 1) : 0) f[c2 >> 2] = d2;
        return;
      }
      function Xb(a2, c2, d2, e2, g2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        g2 = g2 | 0;
        var h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0;
        b[c2 + 53 >> 0] = 1;
        do
          if ((f[c2 + 4 >> 2] | 0) == (e2 | 0)) {
            b[c2 + 52 >> 0] = 1;
            a2 = c2 + 16 | 0;
            h2 = f[a2 >> 2] | 0;
            i3 = c2 + 54 | 0;
            j2 = c2 + 48 | 0;
            k2 = c2 + 24 | 0;
            l2 = c2 + 36 | 0;
            if (!h2) {
              f[a2 >> 2] = d2;
              f[k2 >> 2] = g2;
              f[l2 >> 2] = 1;
              if (!((f[j2 >> 2] | 0) == 1 & (g2 | 0) == 1)) break;
              b[i3 >> 0] = 1;
              break;
            }
            if ((h2 | 0) != (d2 | 0)) {
              f[l2 >> 2] = (f[l2 >> 2] | 0) + 1;
              b[i3 >> 0] = 1;
              break;
            }
            l2 = f[k2 >> 2] | 0;
            if ((l2 | 0) == 2) {
              f[k2 >> 2] = g2;
              m2 = g2;
            } else m2 = l2;
            if ((f[j2 >> 2] | 0) == 1 & (m2 | 0) == 1) b[i3 >> 0] = 1;
          }
        while (0);
        return;
      }
      function Yb(a2, c2, e2, g2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        e2 = e2 | 0;
        g2 = g2 | 0;
        var h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0;
        h2 = u;
        u = u + 64 | 0;
        i3 = h2;
        j2 = f[a2 >> 2] | 0;
        k2 = a2 + (f[j2 + -8 >> 2] | 0) | 0;
        l2 = f[j2 + -4 >> 2] | 0;
        f[i3 >> 2] = e2;
        f[i3 + 4 >> 2] = a2;
        f[i3 + 8 >> 2] = c2;
        f[i3 + 12 >> 2] = g2;
        g2 = i3 + 16 | 0;
        c2 = i3 + 20 | 0;
        a2 = i3 + 24 | 0;
        j2 = i3 + 28 | 0;
        m2 = i3 + 32 | 0;
        n2 = i3 + 40 | 0;
        o2 = g2;
        p2 = o2 + 36 | 0;
        do {
          f[o2 >> 2] = 0;
          o2 = o2 + 4 | 0;
        } while ((o2 | 0) < (p2 | 0));
        d[g2 + 36 >> 1] = 0;
        b[g2 + 38 >> 0] = 0;
        a: do
          if (Ub(l2, e2, 0) | 0) {
            f[i3 + 48 >> 2] = 1;
            Ha[f[(f[l2 >> 2] | 0) + 20 >> 2] & 3](l2, i3, k2, k2, 1, 0);
            q2 = (f[a2 >> 2] | 0) == 1 ? k2 : 0;
          } else {
            Ca[f[(f[l2 >> 2] | 0) + 24 >> 2] & 3](l2, i3, k2, 1, 0);
            switch (f[i3 + 36 >> 2] | 0) {
              case 0: {
                q2 = (f[n2 >> 2] | 0) == 1 & (f[j2 >> 2] | 0) == 1 & (f[m2 >> 2] | 0) == 1 ? f[c2 >> 2] | 0 : 0;
                break a;
                break;
              }
              case 1:
                break;
              default: {
                q2 = 0;
                break a;
              }
            }
            if ((f[a2 >> 2] | 0) != 1 ? !((f[n2 >> 2] | 0) == 0 & (f[j2 >> 2] | 0) == 1 & (f[m2 >> 2] | 0) == 1) : 0) {
              q2 = 0;
              break;
            }
            q2 = f[g2 >> 2] | 0;
          }
        while (0);
        u = h2;
        return q2 | 0;
      }
      function Zb(a2) {
        a2 = a2 | 0;
        Mb(a2);
        bc(a2);
        return;
      }
      function _b(a2, b2, c2, d2, e2, g2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        g2 = g2 | 0;
        var h2 = 0;
        if (Ub(a2, f[b2 + 8 >> 2] | 0, g2) | 0) Xb(0, b2, c2, d2, e2);
        else {
          h2 = f[a2 + 8 >> 2] | 0;
          Ha[f[(f[h2 >> 2] | 0) + 20 >> 2] & 3](h2, b2, c2, d2, e2, g2);
        }
        return;
      }
      function $b(a2, c2, d2, e2, g2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        g2 = g2 | 0;
        var h2 = 0, i3 = 0, j2 = 0, k2 = 0, l2 = 0, m2 = 0, n2 = 0, o2 = 0, p2 = 0, q2 = 0;
        do
          if (!(Ub(a2, f[c2 + 8 >> 2] | 0, g2) | 0)) {
            h2 = a2 + 8 | 0;
            if (!(Ub(a2, f[c2 >> 2] | 0, g2) | 0)) {
              i3 = f[h2 >> 2] | 0;
              Ca[f[(f[i3 >> 2] | 0) + 24 >> 2] & 3](i3, c2, d2, e2, g2);
              break;
            }
            i3 = c2 + 32 | 0;
            if ((f[c2 + 16 >> 2] | 0) != (d2 | 0) ? (j2 = c2 + 20 | 0, (f[j2 >> 2] | 0) != (d2 | 0)) : 0) {
              f[i3 >> 2] = e2;
              k2 = c2 + 44 | 0;
              if ((f[k2 >> 2] | 0) == 4) break;
              l2 = c2 + 52 | 0;
              b[l2 >> 0] = 0;
              m2 = c2 + 53 | 0;
              b[m2 >> 0] = 0;
              n2 = f[h2 >> 2] | 0;
              Ha[f[(f[n2 >> 2] | 0) + 20 >> 2] & 3](n2, c2, d2, d2, 1, g2);
              if (b[m2 >> 0] | 0) if (!(b[l2 >> 0] | 0)) {
                o2 = 3;
                p2 = 11;
              } else q2 = 3;
              else {
                o2 = 4;
                p2 = 11;
              }
              if ((p2 | 0) == 11) {
                f[j2 >> 2] = d2;
                j2 = c2 + 40 | 0;
                f[j2 >> 2] = (f[j2 >> 2] | 0) + 1;
                if ((f[c2 + 36 >> 2] | 0) == 1 ? (f[c2 + 24 >> 2] | 0) == 2 : 0) {
                  b[c2 + 54 >> 0] = 1;
                  q2 = o2;
                } else q2 = o2;
              }
              f[k2 >> 2] = q2;
              break;
            }
            if ((e2 | 0) == 1) f[i3 >> 2] = 1;
          } else Wb(0, c2, d2, e2);
        while (0);
        return;
      }
      function ac(a2, b2, c2, d2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0;
        if (Ub(a2, f[b2 + 8 >> 2] | 0, 0) | 0) Vb(0, b2, c2, d2);
        else {
          e2 = f[a2 + 8 >> 2] | 0;
          Ia[f[(f[e2 >> 2] | 0) + 28 >> 2] & 3](e2, b2, c2, d2);
        }
        return;
      }
      function bc(a2) {
        a2 = a2 | 0;
        vb(a2);
        return;
      }
      function cc(a2) {
        a2 = a2 | 0;
        return;
      }
      function dc() {
      }
      function ec(a2) {
        a2 = a2 | 0;
        var b2 = 0, c2 = 0;
        a2 = a2 + 15 & -16 | 0;
        b2 = f[r >> 2] | 0;
        c2 = b2 + a2 | 0;
        if ((a2 | 0) > 0 & (c2 | 0) < (b2 | 0) | (c2 | 0) < 0) {
          ca() | 0;
          na(12);
          return -1;
        }
        f[r >> 2] = c2;
        if ((c2 | 0) > (ba() | 0) ? (aa() | 0) == 0 : 0) {
          f[r >> 2] = b2;
          na(12);
          return -1;
        }
        return b2 | 0;
      }
      function fc(a2, c2, d2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, g2 = 0, h2 = 0, i3 = 0;
        e2 = a2 + d2 | 0;
        c2 = c2 & 255;
        if ((d2 | 0) >= 67) {
          while (a2 & 3) {
            b[a2 >> 0] = c2;
            a2 = a2 + 1 | 0;
          }
          g2 = e2 & -4 | 0;
          h2 = g2 - 64 | 0;
          i3 = c2 | c2 << 8 | c2 << 16 | c2 << 24;
          while ((a2 | 0) <= (h2 | 0)) {
            f[a2 >> 2] = i3;
            f[a2 + 4 >> 2] = i3;
            f[a2 + 8 >> 2] = i3;
            f[a2 + 12 >> 2] = i3;
            f[a2 + 16 >> 2] = i3;
            f[a2 + 20 >> 2] = i3;
            f[a2 + 24 >> 2] = i3;
            f[a2 + 28 >> 2] = i3;
            f[a2 + 32 >> 2] = i3;
            f[a2 + 36 >> 2] = i3;
            f[a2 + 40 >> 2] = i3;
            f[a2 + 44 >> 2] = i3;
            f[a2 + 48 >> 2] = i3;
            f[a2 + 52 >> 2] = i3;
            f[a2 + 56 >> 2] = i3;
            f[a2 + 60 >> 2] = i3;
            a2 = a2 + 64 | 0;
          }
          while ((a2 | 0) < (g2 | 0)) {
            f[a2 >> 2] = i3;
            a2 = a2 + 4 | 0;
          }
        }
        while ((a2 | 0) < (e2 | 0)) {
          b[a2 >> 0] = c2;
          a2 = a2 + 1 | 0;
        }
        return e2 - d2 | 0;
      }
      function gc(a2, c2, d2) {
        a2 = a2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        var e2 = 0, g2 = 0, h2 = 0;
        if ((d2 | 0) >= 8192) return ra(a2 | 0, c2 | 0, d2 | 0) | 0;
        e2 = a2 | 0;
        g2 = a2 + d2 | 0;
        if ((a2 & 3) == (c2 & 3)) {
          while (a2 & 3) {
            if (!d2) return e2 | 0;
            b[a2 >> 0] = b[c2 >> 0] | 0;
            a2 = a2 + 1 | 0;
            c2 = c2 + 1 | 0;
            d2 = d2 - 1 | 0;
          }
          h2 = g2 & -4 | 0;
          d2 = h2 - 64 | 0;
          while ((a2 | 0) <= (d2 | 0)) {
            f[a2 >> 2] = f[c2 >> 2];
            f[a2 + 4 >> 2] = f[c2 + 4 >> 2];
            f[a2 + 8 >> 2] = f[c2 + 8 >> 2];
            f[a2 + 12 >> 2] = f[c2 + 12 >> 2];
            f[a2 + 16 >> 2] = f[c2 + 16 >> 2];
            f[a2 + 20 >> 2] = f[c2 + 20 >> 2];
            f[a2 + 24 >> 2] = f[c2 + 24 >> 2];
            f[a2 + 28 >> 2] = f[c2 + 28 >> 2];
            f[a2 + 32 >> 2] = f[c2 + 32 >> 2];
            f[a2 + 36 >> 2] = f[c2 + 36 >> 2];
            f[a2 + 40 >> 2] = f[c2 + 40 >> 2];
            f[a2 + 44 >> 2] = f[c2 + 44 >> 2];
            f[a2 + 48 >> 2] = f[c2 + 48 >> 2];
            f[a2 + 52 >> 2] = f[c2 + 52 >> 2];
            f[a2 + 56 >> 2] = f[c2 + 56 >> 2];
            f[a2 + 60 >> 2] = f[c2 + 60 >> 2];
            a2 = a2 + 64 | 0;
            c2 = c2 + 64 | 0;
          }
          while ((a2 | 0) < (h2 | 0)) {
            f[a2 >> 2] = f[c2 >> 2];
            a2 = a2 + 4 | 0;
            c2 = c2 + 4 | 0;
          }
        } else {
          h2 = g2 - 4 | 0;
          while ((a2 | 0) < (h2 | 0)) {
            b[a2 >> 0] = b[c2 >> 0] | 0;
            b[a2 + 1 >> 0] = b[c2 + 1 >> 0] | 0;
            b[a2 + 2 >> 0] = b[c2 + 2 >> 0] | 0;
            b[a2 + 3 >> 0] = b[c2 + 3 >> 0] | 0;
            a2 = a2 + 4 | 0;
            c2 = c2 + 4 | 0;
          }
        }
        while ((a2 | 0) < (g2 | 0)) {
          b[a2 >> 0] = b[c2 >> 0] | 0;
          a2 = a2 + 1 | 0;
          c2 = c2 + 1 | 0;
        }
        return e2 | 0;
      }
      function hc(a2, b2, c2, d2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        return Ba[a2 & 7](b2 | 0, c2 | 0, d2 | 0) | 0;
      }
      function ic(a2, b2, c2, d2, e2, f2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        f2 = f2 | 0;
        Ca[a2 & 3](b2 | 0, c2 | 0, d2 | 0, e2 | 0, f2 | 0);
      }
      function jc(a2, b2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        Da[a2 & 7](b2 | 0);
      }
      function kc(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        Ea[a2 & 7](b2 | 0, c2 | 0);
      }
      function lc(a2, b2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        return Fa[a2 & 1](b2 | 0) | 0;
      }
      function mc(a2) {
        a2 = a2 | 0;
        Ga[a2 & 1]();
      }
      function nc(a2, b2, c2, d2, e2, f2, g2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        f2 = f2 | 0;
        g2 = g2 | 0;
        Ha[a2 & 3](b2 | 0, c2 | 0, d2 | 0, e2 | 0, f2 | 0, g2 | 0);
      }
      function oc(a2, b2, c2, d2, e2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        Ia[a2 & 3](b2 | 0, c2 | 0, d2 | 0, e2 | 0);
      }
      function pc(a2, b2, c2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        _(0);
        return 0;
      }
      function qc(a2, b2, c2, d2, e2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        _(1);
      }
      function rc(a2) {
        a2 = a2 | 0;
        _(2);
      }
      function sc(a2, b2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        _(3);
      }
      function tc(a2) {
        a2 = a2 | 0;
        _(4);
        return 0;
      }
      function uc() {
        _(5);
      }
      function vc() {
        wa();
      }
      function wc(a2, b2, c2, d2, e2, f2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        e2 = e2 | 0;
        f2 = f2 | 0;
        _(6);
      }
      function xc(a2, b2, c2, d2) {
        a2 = a2 | 0;
        b2 = b2 | 0;
        c2 = c2 | 0;
        d2 = d2 | 0;
        _(7);
      }
      var Ba = [pc, Fb, yb, Qb, Eb, pc, pc, pc];
      var Ca = [qc, Sb, $b, qc];
      var Da = [rc, Mb, Nb, Ob, Pb, Zb, rc, rc];
      var Ea = [sc, Va, Wa, hb, ib, kb, lb, sc];
      var Fa = [tc, xb];
      var Ga = [uc, vc];
      var Ha = [wc, Rb, _b, wc];
      var Ia = [xc, Tb, ac, xc];
      return { stackSave: Ka, setThrew: Na, dynCall_vii: kc, _fflush: Kb, _DecompressImage: tb, _memset: fc, _sbrk: ec, _memcpy: gc, stackAlloc: Ja, dynCall_vi: jc, getTempRet0: Pa, setTempRet0: Oa, dynCall_iiii: hc, stackRestore: La, dynCall_ii: lc, dynCall_viiii: oc, ___errno_location: Ab, runPostSets: dc, _CompressImage: sb, dynCall_v: mc, _free: vb, dynCall_viiiii: ic, dynCall_viiiiii: nc, establishStackSpace: Ma, _emscripten_get_global_libc: wb, _malloc: ub, _emscripten_replace_memory: Aa, _GetStorageRequirements: rb };
    })(Module.asmGlobalArg, Module.asmLibraryArg, buffer);
    var _CompressImage = Module["_CompressImage"] = asm["_CompressImage"];
    var _malloc = Module["_malloc"] = asm["_malloc"];
    var getTempRet0 = Module["getTempRet0"] = asm["getTempRet0"];
    var _free = Module["_free"] = asm["_free"];
    var _DecompressImage = Module["_DecompressImage"] = asm["_DecompressImage"];
    var setTempRet0 = Module["setTempRet0"] = asm["setTempRet0"];
    var establishStackSpace = Module["establishStackSpace"] = asm["establishStackSpace"];
    var stackRestore = Module["stackRestore"] = asm["stackRestore"];
    var stackSave = Module["stackSave"] = asm["stackSave"];
    var _memset = Module["_memset"] = asm["_memset"];
    var _sbrk = Module["_sbrk"] = asm["_sbrk"];
    var _emscripten_get_global_libc = Module["_emscripten_get_global_libc"] = asm["_emscripten_get_global_libc"];
    var _memcpy = Module["_memcpy"] = asm["_memcpy"];
    var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = asm["_emscripten_replace_memory"];
    var stackAlloc = Module["stackAlloc"] = asm["stackAlloc"];
    var setThrew = Module["setThrew"] = asm["setThrew"];
    var _fflush = Module["_fflush"] = asm["_fflush"];
    var _GetStorageRequirements = Module["_GetStorageRequirements"] = asm["_GetStorageRequirements"];
    var ___errno_location = Module["___errno_location"] = asm["___errno_location"];
    var runPostSets = Module["runPostSets"] = asm["runPostSets"];
    var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
    var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
    var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
    var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
    var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
    var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
    var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
    var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
    Runtime.stackAlloc = Module["stackAlloc"];
    Runtime.stackSave = Module["stackSave"];
    Runtime.stackRestore = Module["stackRestore"];
    Runtime.establishStackSpace = Module["establishStackSpace"];
    Runtime.setTempRet0 = Module["setTempRet0"];
    Runtime.getTempRet0 = Module["getTempRet0"];
    Module["asm"] = asm;
    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }
    ExitStatus.prototype = new Error();
    ExitStatus.prototype.constructor = ExitStatus;
    var initialStackTop;
    var preloadStartTime = null;
    var calledMain = false;
    dependenciesFulfilled = function runCaller() {
      if (!Module["calledRun"]) run();
      if (!Module["calledRun"]) dependenciesFulfilled = runCaller;
    };
    Module["callMain"] = Module.callMain = function callMain(args) {
      args = args || [];
      ensureInitRuntime();
      var argc = args.length + 1;
      function pad() {
        for (var i3 = 0; i3 < 4 - 1; i3++) {
          argv.push(0);
        }
      }
      var argv = [allocate(intArrayFromString(Module["thisProgram"]), "i8", ALLOC_NORMAL)];
      pad();
      for (var i2 = 0; i2 < argc - 1; i2 = i2 + 1) {
        argv.push(allocate(intArrayFromString(args[i2]), "i8", ALLOC_NORMAL));
        pad();
      }
      argv.push(0);
      argv = allocate(argv, "i32", ALLOC_NORMAL);
      try {
        var ret = Module["_main"](argc, argv, 0);
        exit(ret, true);
      } catch (e) {
        if (e instanceof ExitStatus) {
          return;
        } else if (e == "SimulateInfiniteLoop") {
          Module["noExitRuntime"] = true;
          return;
        } else {
          var toLog = e;
          if (e && typeof e === "object" && e.stack) {
            toLog = [e, e.stack];
          }
          Module.printErr("exception thrown: " + toLog);
          Module["quit"](1, e);
        }
      } finally {
        calledMain = true;
      }
    };
    function run(args) {
      args = args || Module["arguments"];
      if (preloadStartTime === null) preloadStartTime = Date.now();
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) return;
      if (Module["calledRun"]) return;
      function doRun() {
        if (Module["calledRun"]) return;
        Module["calledRun"] = true;
        if (ABORT) return;
        ensureInitRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        if (Module["_main"] && shouldRunNow) Module["callMain"](args);
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout((function() {
          setTimeout((function() {
            Module["setStatus"]("");
          }), 1);
          doRun();
        }), 1);
      } else {
        doRun();
      }
    }
    Module["run"] = Module.run = run;
    function exit(status, implicit) {
      if (implicit && Module["noExitRuntime"]) {
        return;
      }
      if (Module["noExitRuntime"]) {
      } else {
        ABORT = true;
        EXITSTATUS = status;
        STACKTOP = initialStackTop;
        exitRuntime();
        if (Module["onExit"]) Module["onExit"](status);
      }
      if (ENVIRONMENT_IS_NODE) {
        process["exit"](status);
      }
      Module["quit"](status, new ExitStatus(status));
    }
    Module["exit"] = Module.exit = exit;
    var abortDecorators = [];
    function abort(what) {
      if (Module["onAbort"]) {
        Module["onAbort"](what);
      }
      if (what !== void 0) {
        Module.print(what);
        Module.printErr(what);
        what = JSON.stringify(what);
      } else {
        what = "";
      }
      ABORT = true;
      EXITSTATUS = 1;
      var extra = "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
      var output = "abort(" + what + ") at " + stackTrace() + extra;
      if (abortDecorators) {
        abortDecorators.forEach((function(decorator) {
          output = decorator(output, what);
        }));
      }
      throw output;
    }
    Module["abort"] = Module.abort = abort;
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    var shouldRunNow = true;
    if (Module["noInitialRun"]) {
      shouldRunNow = false;
    }
    run();
    if (typeof module !== "undefined") {
      module["exports"] = Module;
    }
  }
});

// node_modules/dxt-js/src/dxt.js
var require_dxt = __commonJS({
  "node_modules/dxt-js/src/dxt.js"(exports2) {
    var libSquish = require_squish();
    var GetStorageRequirements = libSquish.cwrap("GetStorageRequirements", "number", ["number", "number", "number"]);
    var CompressImage = libSquish.cwrap("CompressImage", "void", ["number", "number", "number", "number", "number"]);
    var DecompressImage = libSquish.cwrap("DecompressImage", "void", ["number", "number", "number", "number", "number"]);
    function pointerFromData(sourceData) {
      var buf = libSquish._malloc(sourceData.length * 4);
      libSquish.HEAPU8.set(sourceData, buf);
      return buf;
    }
    function getDataFromPointer(pointer, size) {
      return new Uint8Array(libSquish.HEAPU8.buffer, pointer, size);
    }
    exports2.GetStorageRequirements = GetStorageRequirements;
    exports2.CompressImage = CompressImage;
    exports2.DecompressImage = DecompressImage;
    exports2.compress = function(inputData, width, height, flags2) {
      var source = pointerFromData(inputData);
      var targetSize = GetStorageRequirements(width, height, flags2);
      var pointer = libSquish._malloc(targetSize);
      CompressImage(source, width, height, pointer, flags2);
      var out = getDataFromPointer(pointer, targetSize);
      libSquish._free(source);
      libSquish._free(pointer);
      return out;
    };
    exports2.decompress = function(inputData, width, height, flags2) {
      var source = pointerFromData(inputData);
      var targetSize = width * height * 4;
      var pointer = libSquish._malloc(targetSize);
      DecompressImage(pointer, width, height, source, flags2);
      var out = getDataFromPointer(pointer, width * height * 4);
      libSquish._free(source);
      libSquish._free(pointer);
      return out;
    };
    exports2.flags = {
      // Use DXT1 compression.
      DXT1: 1 << 0,
      // Use DXT3 compression.
      DXT3: 1 << 1,
      // Use DXT5 compression.
      DXT5: 1 << 2,
      // Use a very slow but very high quality colour compressor.
      ColourIterativeClusterFit: 1 << 8,
      //! Use a slow but high quality colour compressor (the default).
      ColourClusterFit: 1 << 3,
      //! Use a fast but low quality colour compressor.
      ColourRangeFit: 1 << 4,
      //! Use a perceptual metric for colour error (the default).
      ColourMetricPerceptual: 1 << 5,
      //! Use a uniform metric for colour error.
      ColourMetricUniform: 1 << 6,
      //! Weight the colour by alpha during cluster fit (disabled by default).
      WeightColourByAlpha: 1 << 7
    };
  }
});

// scripts/stubs/sharp.js
var sharp_exports = {};
__export(sharp_exports, {
  default: () => sharp_default
});
var sharp_default;
var init_sharp = __esm({
  "scripts/stubs/sharp.js"() {
    sharp_default = null;
  }
});

// index.js
var dxt = __toESM(require_dxt(), 1);
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
var isNode = typeof process !== "undefined" && process.versions != null && false;
var fs;
var sharp;
async function loadNodeDeps() {
  if (isNode && !fs) {
    try {
      fs = await Promise.resolve().then(() => (init_fs(), fs_exports));
      sharp = (await Promise.resolve().then(() => (init_sharp(), sharp_exports))).default;
    } catch (e) {
    }
  }
}
var VTF_FORMATS = {
  RGBA8888: 0,
  // 32-bit RGBA (8 bits per channel)
  ABGR8888: 1,
  // 32-bit ABGR (8 bits per channel)
  RGB888: 2,
  // 24-bit RGB (8 bits per channel, no alpha)
  BGR888: 3,
  // 24-bit BGR (8 bits per channel, no alpha) - preferred for opaque
  RGB565: 4,
  // 16-bit RGB (5-6-5 bits per channel)
  I8: 5,
  // 8-bit luminance (grayscale)
  IA88: 6,
  // 16-bit luminance + alpha (8 bits each)
  P8: 7,
  // 8-bit paletted (not supported by engine)
  A8: 8,
  // 8-bit alpha only
  RGB888_BLUESCREEN: 9,
  // RGB with blue = transparent
  BGR888_BLUESCREEN: 10,
  // BGR with blue = transparent
  ARGB8888: 11,
  // 32-bit ARGB
  BGRA8888: 12,
  // 32-bit BGRA (8 bits per channel) - common format
  DXT1: 13,
  // DXT1/BC1 block compression (4 bpp)
  DXT3: 14,
  // DXT3/BC2 block compression (8 bpp, sharp alpha)
  DXT5: 15,
  // DXT5/BC3 block compression (8 bpp, smooth alpha)
  BGRX8888: 16,
  // 32-bit BGR with unused alpha (always 255)
  BGR565: 17,
  // 16-bit BGR (5-6-5 bits) - preferred over RGB565
  BGRX5551: 18,
  // 16-bit BGR with unused alpha bit
  BGRA4444: 19,
  // 16-bit BGRA (4 bits per channel)
  DXT1_ONEBITALPHA: 20,
  // DXT1 with 1-bit alpha
  BGRA5551: 21,
  // 16-bit BGRA (5-5-5-1 bits per channel)
  UV88: 22,
  // 16-bit du/dv format for bump maps
  UVWQ8888: 23,
  // 32-bit du/dv format
  RGBA16161616F: 24,
  // 64-bit floating point RGBA (HDR)
  RGBA16161616: 25,
  // 64-bit integer RGBA (HDR)
  UVLX8888: 26
  // 32-bit du/dv/luminance format
};
var VTF_FLAGS = {
  POINTSAMPLE: 1,
  // Point sampling (no filtering)
  TRILINEAR: 2,
  // Trilinear filtering
  CLAMPS: 4,
  // Clamp S coordinate
  CLAMPT: 8,
  // Clamp T coordinate
  ANISOTROPIC: 16,
  // Anisotropic filtering
  HINT_DXT5: 32,
  // Hint to use DXT5 compression
  PWL_CORRECTED: 64,
  // Purpose unknown (v7.4+)
  NORMAL: 128,
  // Normal map
  NOMIP: 256,
  // No mipmaps
  NOLOD: 512,
  // No level of detail
  ALL_MIPS: 1024,
  // Load all mipmap levels (no LOD)
  PROCEDURAL: 2048,
  // Procedural texture
  ONEBITALPHA: 4096,
  // 1-bit alpha (on/off transparency)
  EIGHTBITALPHA: 8192,
  // 8-bit alpha channel
  ENVMAP: 16384,
  // Environment map
  RENDERTARGET: 32768,
  // Render target
  DEPTHRENDERTARGET: 65536,
  // Depth render target
  NODEBUGOVERRIDE: 131072,
  // No debug override
  SINGLECOPY: 262144,
  // Single copy
  PRE_SRGB: 524288,
  // Pre-SRGB (v7.4+, deprecated in v7.5)
  UNUSED_00100000: 1048576,
  // Unused
  UNUSED_00200000: 2097152,
  // Unused
  UNUSED_00400000: 4194304,
  // Unused
  NODEPTHBUFFER: 8388608,
  // No depth buffer
  UNUSED_01000000: 16777216,
  // Unused
  CLAMPU: 33554432,
  // Clamp U coordinate
  VERTEXTEXTURE: 67108864,
  // Vertex texture
  SSBUMP: 134217728,
  // Self-shadowed bump map
  UNUSED_10000000: 268435456,
  // Unused
  BORDER: 536870912,
  // Border clamp (v7.4+)
  UNUSED_40000000: 1073741824,
  // Unused
  UNUSED_80000000: 2147483648
  // Unused
};
function writeUint16(buffer2, offset, value) {
  buffer2[offset] = value & 255;
  buffer2[offset + 1] = value >>> 8 & 255;
}
function writeUint32(buffer2, offset, value) {
  buffer2[offset] = value & 255;
  buffer2[offset + 1] = value >>> 8 & 255;
  buffer2[offset + 2] = value >>> 16 & 255;
  buffer2[offset + 3] = value >>> 24 & 255;
}
function writeFloat32(buffer2, offset, value) {
  const floatArray = new Float32Array([value]);
  const byteArray = new Uint8Array(floatArray.buffer);
  buffer2[offset] = byteArray[0];
  buffer2[offset + 1] = byteArray[1];
  buffer2[offset + 2] = byteArray[2];
  buffer2[offset + 3] = byteArray[3];
}
function createBuffer(size) {
  if (isNode && typeof Buffer !== "undefined") {
    return Buffer.alloc(size);
  }
  return new Uint8Array(size);
}
function concatBuffers(buffers) {
  if (isNode && typeof Buffer !== "undefined") {
    return Buffer.concat(buffers.map((b) => Buffer.from(b)));
  }
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer2 of buffers) {
    result.set(buffer2, offset);
    offset += buffer2.length;
  }
  return result;
}
function isPowerOf2(n) {
  return n > 0 && (n & n - 1) === 0;
}
function nextPowerOf2(n) {
  if (n <= 1) return 1;
  n--;
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  return n + 1;
}
function getBytesPerPixel(format) {
  switch (format) {
    case VTF_FORMATS.RGBA8888:
    case VTF_FORMATS.ABGR8888:
    case VTF_FORMATS.ARGB8888:
    case VTF_FORMATS.BGRA8888:
    case VTF_FORMATS.BGRX8888:
    case VTF_FORMATS.UVWQ8888:
    case VTF_FORMATS.UVLX8888:
      return 4;
    case VTF_FORMATS.RGB888:
    case VTF_FORMATS.BGR888:
    case VTF_FORMATS.RGB888_BLUESCREEN:
    case VTF_FORMATS.BGR888_BLUESCREEN:
      return 3;
    case VTF_FORMATS.RGB565:
    case VTF_FORMATS.BGR565:
    case VTF_FORMATS.BGRA4444:
    case VTF_FORMATS.BGRA5551:
    case VTF_FORMATS.BGRX5551:
    case VTF_FORMATS.IA88:
    case VTF_FORMATS.UV88:
      return 2;
    case VTF_FORMATS.I8:
    case VTF_FORMATS.A8:
    case VTF_FORMATS.P8:
      return 1;
    case VTF_FORMATS.RGBA16161616F:
    case VTF_FORMATS.RGBA16161616:
      return 8;
    // DXT formats use block compression (calculated differently)
    case VTF_FORMATS.DXT1:
    case VTF_FORMATS.DXT1_ONEBITALPHA:
      return 0.5;
    // 4 bits per pixel
    case VTF_FORMATS.DXT3:
    case VTF_FORMATS.DXT5:
      return 1;
    // 8 bits per pixel
    default:
      return 4;
  }
}
function convertRGBA8888ToBGRA8888(data) {
  const output = createBuffer(data.length);
  for (let i2 = 0; i2 < data.length; i2 += 4) {
    output[i2] = data[i2 + 2];
    output[i2 + 1] = data[i2 + 1];
    output[i2 + 2] = data[i2];
    output[i2 + 3] = data[i2 + 3];
  }
  return output;
}
function convertRGBA8888ToABGR8888(data) {
  const output = createBuffer(data.length);
  for (let i2 = 0; i2 < data.length; i2 += 4) {
    output[i2] = data[i2 + 3];
    output[i2 + 1] = data[i2 + 2];
    output[i2 + 2] = data[i2 + 1];
    output[i2 + 3] = data[i2];
  }
  return output;
}
function convertRGBA8888ToARGB8888(data) {
  const output = createBuffer(data.length);
  for (let i2 = 0; i2 < data.length; i2 += 4) {
    output[i2] = data[i2 + 3];
    output[i2 + 1] = data[i2];
    output[i2 + 2] = data[i2 + 1];
    output[i2 + 3] = data[i2 + 2];
  }
  return output;
}
function convertRGBA8888ToRGB888(data) {
  const output = createBuffer(data.length / 4 * 3);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j += 3) {
    output[j] = data[i2];
    output[j + 1] = data[i2 + 1];
    output[j + 2] = data[i2 + 2];
  }
  return output;
}
function convertRGBA8888ToBGR888(data) {
  const output = createBuffer(data.length / 4 * 3);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j += 3) {
    output[j] = data[i2 + 2];
    output[j + 1] = data[i2 + 1];
    output[j + 2] = data[i2];
  }
  return output;
}
function convertRGBA8888ToI8(data) {
  const output = createBuffer(data.length / 4);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j++) {
    const luminance = Math.round(
      0.299 * data[i2] + 0.587 * data[i2 + 1] + 0.114 * data[i2 + 2]
    );
    output[j] = luminance;
  }
  return output;
}
function convertRGBA8888ToIA88(data) {
  const output = createBuffer(data.length / 4 * 2);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j += 2) {
    const luminance = Math.round(
      0.299 * data[i2] + 0.587 * data[i2 + 1] + 0.114 * data[i2 + 2]
    );
    output[j] = luminance;
    output[j + 1] = data[i2 + 3];
  }
  return output;
}
function convertRGBA8888ToA8(data) {
  const output = createBuffer(data.length / 4);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j++) {
    output[j] = data[i2 + 3];
  }
  return output;
}
function convertRGBA8888ToRGB565(data) {
  const output = createBuffer(data.length / 4 * 2);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j += 2) {
    const r = data[i2] >> 3;
    const g = data[i2 + 1] >> 2;
    const b = data[i2 + 2] >> 3;
    const rgb565 = r | g << 5 | b << 11;
    writeUint16(output, j, rgb565);
  }
  return output;
}
function convertRGBA8888ToBGR565(data) {
  const output = createBuffer(data.length / 4 * 2);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j += 2) {
    const r = data[i2] >> 3;
    const g = data[i2 + 1] >> 2;
    const b = data[i2 + 2] >> 3;
    const bgr565 = b | g << 5 | r << 11;
    writeUint16(output, j, bgr565);
  }
  return output;
}
function convertRGBA8888ToBGRA5551(data) {
  const output = createBuffer(data.length / 4 * 2);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j += 2) {
    const r = data[i2] >> 3;
    const g = data[i2 + 1] >> 3;
    const b = data[i2 + 2] >> 3;
    const a = data[i2 + 3] >> 7;
    const bgra5551 = b | g << 5 | r << 10 | a << 15;
    writeUint16(output, j, bgra5551);
  }
  return output;
}
function convertRGBA8888ToBGRA4444(data) {
  const output = createBuffer(data.length / 4 * 2);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j += 2) {
    const r = data[i2] >> 4;
    const g = data[i2 + 1] >> 4;
    const b = data[i2 + 2] >> 4;
    const a = data[i2 + 3] >> 4;
    const bgra4444 = b | g << 4 | r << 8 | a << 12;
    writeUint16(output, j, bgra4444);
  }
  return output;
}
function convertRGBA8888ToUV88(data) {
  const output = createBuffer(data.length / 4 * 2);
  for (let i2 = 0, j = 0; i2 < data.length; i2 += 4, j += 2) {
    output[j] = data[i2];
    output[j + 1] = data[i2 + 1];
  }
  return output;
}
function calculateDXTSize(width, height, format) {
  const blocksX = Math.max(1, Math.ceil(width / 4));
  const blocksY = Math.max(1, Math.ceil(height / 4));
  const numBlocks = blocksX * blocksY;
  if (format === VTF_FORMATS.DXT1 || format === VTF_FORMATS.DXT1_ONEBITALPHA) {
    return numBlocks * 8;
  } else {
    return numBlocks * 16;
  }
}
function compressToDXT(rgbaData, width, height, format) {
  let dxtFlags;
  switch (format) {
    case VTF_FORMATS.DXT1:
    case VTF_FORMATS.DXT1_ONEBITALPHA:
      dxtFlags = dxt.flags.DXT1;
      break;
    case VTF_FORMATS.DXT3:
      dxtFlags = dxt.flags.DXT3;
      break;
    case VTF_FORMATS.DXT5:
      dxtFlags = dxt.flags.DXT5;
      break;
    default:
      throw new Error(`Unsupported DXT format: ${format}`);
  }
  const inputArray = new Uint8Array(rgbaData);
  const compressed = dxt.compress(inputArray, width, height, dxtFlags);
  return new Uint8Array(compressed);
}
function createVTFHeader(width, height, format, options = {}) {
  const {
    mipmaps = false,
    flags: flags2 = null,
    frames = 1,
    firstFrame = 0,
    reflectivity = [0, 0, 0],
    bumpmapScale = 1,
    depth = 1
  } = options;
  const header = createBuffer(80);
  header[0] = 86;
  header[1] = 84;
  header[2] = 70;
  header[3] = 0;
  writeUint32(header, 4, 7);
  writeUint32(header, 8, 2);
  writeUint32(header, 12, 80);
  writeUint16(header, 16, width);
  writeUint16(header, 18, height);
  let textureFlags = flags2;
  if (textureFlags === null) {
    textureFlags = 0;
    const hasAlpha = [
      VTF_FORMATS.RGBA8888,
      VTF_FORMATS.ABGR8888,
      VTF_FORMATS.ARGB8888,
      VTF_FORMATS.BGRA8888,
      VTF_FORMATS.BGRA4444,
      VTF_FORMATS.BGRA5551,
      VTF_FORMATS.IA88,
      VTF_FORMATS.A8,
      VTF_FORMATS.DXT3,
      VTF_FORMATS.DXT5
    ].includes(format);
    if (hasAlpha) {
      if ([VTF_FORMATS.BGRA5551, VTF_FORMATS.DXT1_ONEBITALPHA].includes(format)) {
        textureFlags |= VTF_FLAGS.ONEBITALPHA;
      } else {
        textureFlags |= VTF_FLAGS.EIGHTBITALPHA;
      }
    }
  }
  writeUint32(header, 20, textureFlags);
  writeUint16(header, 24, frames);
  writeUint16(header, 26, firstFrame);
  writeUint32(header, 28, 0);
  writeFloat32(header, 32, reflectivity[0]);
  writeFloat32(header, 36, reflectivity[1]);
  writeFloat32(header, 40, reflectivity[2]);
  writeUint32(header, 44, 0);
  writeFloat32(header, 48, bumpmapScale);
  writeUint32(header, 52, format);
  header[56] = mipmaps ? calculateMipmapCount(width, height) : 1;
  writeUint32(header, 57, VTF_FORMATS.DXT1);
  header[61] = 0;
  header[62] = 0;
  writeUint16(header, 63, depth);
  header[65] = 0;
  header[66] = 0;
  header[67] = 0;
  writeUint32(header, 68, 0);
  for (let i2 = 72; i2 < 80; i2++) {
    header[i2] = 0;
  }
  return header;
}
function calculateMipmapCount(width, height) {
  let count = 1;
  let w = width;
  let h = height;
  while (w > 1 || h > 1) {
    w = Math.max(1, Math.floor(w / 2));
    h = Math.max(1, Math.floor(h / 2));
    count++;
  }
  return count;
}
function generateMipmaps(rgbaData, width, height) {
  const mipmaps = [];
  let currentData = rgbaData;
  let currentW = width;
  let currentH = height;
  mipmaps.push(currentData);
  while (currentW > 1 || currentH > 1) {
    const newW = Math.max(1, Math.floor(currentW / 2));
    const newH = Math.max(1, Math.floor(currentH / 2));
    const newData = createBuffer(newW * newH * 4);
    for (let y = 0; y < newH; y++) {
      for (let x = 0; x < newW; x++) {
        const srcX = Math.min(x * 2, currentW - 1);
        const srcY = Math.min(y * 2, currentH - 1);
        const srcX1 = Math.min(srcX + 1, currentW - 1);
        const srcY1 = Math.min(srcY + 1, currentH - 1);
        const idx00 = (srcY * currentW + srcX) * 4;
        const idx10 = (srcY * currentW + srcX1) * 4;
        const idx01 = (srcY1 * currentW + srcX) * 4;
        const idx11 = (srcY1 * currentW + srcX1) * 4;
        const dstIdx = (y * newW + x) * 4;
        for (let c = 0; c < 4; c++) {
          const avg = Math.round(
            (currentData[idx00 + c] + currentData[idx10 + c] + currentData[idx01 + c] + currentData[idx11 + c]) / 4
          );
          newData[dstIdx + c] = avg;
        }
      }
    }
    mipmaps.push(newData);
    currentData = newData;
    currentW = newW;
    currentH = newH;
  }
  return mipmaps.reverse();
}
function convertMipmapsToFormat(mipmaps, format) {
  return mipmaps.map((mipmap) => convertToFormat(mipmap, format));
}
function convertToFormat(rgbaData, format) {
  switch (format) {
    case VTF_FORMATS.RGBA8888:
      return rgbaData;
    case VTF_FORMATS.BGRA8888:
      return convertRGBA8888ToBGRA8888(rgbaData);
    case VTF_FORMATS.ABGR8888:
      return convertRGBA8888ToABGR8888(rgbaData);
    case VTF_FORMATS.ARGB8888:
      return convertRGBA8888ToARGB8888(rgbaData);
    case VTF_FORMATS.RGB888:
      return convertRGBA8888ToRGB888(rgbaData);
    case VTF_FORMATS.BGR888:
      return convertRGBA8888ToBGR888(rgbaData);
    case VTF_FORMATS.RGB565:
      return convertRGBA8888ToRGB565(rgbaData);
    case VTF_FORMATS.BGR565:
      return convertRGBA8888ToBGR565(rgbaData);
    case VTF_FORMATS.BGRA5551:
      return convertRGBA8888ToBGRA5551(rgbaData);
    case VTF_FORMATS.BGRA4444:
      return convertRGBA8888ToBGRA4444(rgbaData);
    case VTF_FORMATS.I8:
      return convertRGBA8888ToI8(rgbaData);
    case VTF_FORMATS.IA88:
      return convertRGBA8888ToIA88(rgbaData);
    case VTF_FORMATS.A8:
      return convertRGBA8888ToA8(rgbaData);
    case VTF_FORMATS.UV88:
      return convertRGBA8888ToUV88(rgbaData);
    // DXT formats are handled separately in convertToDXTFormat
    case VTF_FORMATS.DXT1:
    case VTF_FORMATS.DXT1_ONEBITALPHA:
    case VTF_FORMATS.DXT3:
    case VTF_FORMATS.DXT5:
      throw new Error(`DXT format conversion requires width/height. Use convertToDXTFormat() instead.`);
    default:
      console.warn(`Unknown format ${format}, using RGBA8888`);
      return rgbaData;
  }
}
function calculateReflectivity(rgbaData) {
  let r = 0, g = 0, b = 0;
  const pixelCount = rgbaData.length / 4;
  for (let i2 = 0; i2 < rgbaData.length; i2 += 4) {
    r += rgbaData[i2];
    g += rgbaData[i2 + 1];
    b += rgbaData[i2 + 2];
  }
  return [
    r / pixelCount / 255,
    g / pixelCount / 255,
    b / pixelCount / 255
  ];
}
function convertRGBAToVTF(rgbaData, width, height, format = VTF_FORMATS.RGBA8888, generateMipsOrOptions = true) {
  let options = {};
  if (typeof generateMipsOrOptions === "boolean") {
    options.generateMips = generateMipsOrOptions;
  } else if (typeof generateMipsOrOptions === "object") {
    options = generateMipsOrOptions;
  }
  const {
    generateMips = true,
    flags: flags2 = null,
    calculateReflectivityValue = true,
    frames = 1,
    bumpmapScale = 1
  } = options;
  if (!isPowerOf2(width) || !isPowerOf2(height)) {
    console.warn(`Warning: Dimensions ${width}x${height} are not powers of 2. Some Source engine versions may not load this correctly.`);
  }
  const isDXTFormat = [VTF_FORMATS.DXT1, VTF_FORMATS.DXT1_ONEBITALPHA, VTF_FORMATS.DXT3, VTF_FORMATS.DXT5].includes(format);
  let pixelDataBuffers;
  if (generateMips) {
    const mipmaps = generateMipmaps(rgbaData, width, height);
    if (isDXTFormat) {
      pixelDataBuffers = [];
      let mipW = 1, mipH = 1;
      const mipDimensions = [];
      let w = width, h = height;
      while (w >= 1 || h >= 1) {
        mipDimensions.unshift({ w: Math.max(1, w), h: Math.max(1, h) });
        if (w === 1 && h === 1) break;
        w = Math.max(1, Math.floor(w / 2));
        h = Math.max(1, Math.floor(h / 2));
      }
      for (let i2 = 0; i2 < mipmaps.length; i2++) {
        const { w: mipWidth, h: mipHeight } = mipDimensions[i2];
        const compressed = compressToDXT(mipmaps[i2], mipWidth, mipHeight, format);
        pixelDataBuffers.push(compressed);
      }
    } else {
      pixelDataBuffers = convertMipmapsToFormat(mipmaps, format);
    }
  } else {
    if (isDXTFormat) {
      const compressed = compressToDXT(rgbaData, width, height, format);
      pixelDataBuffers = [compressed];
    } else {
      const pixelData = convertToFormat(rgbaData, format);
      pixelDataBuffers = [pixelData];
    }
  }
  const reflectivity = calculateReflectivityValue ? calculateReflectivity(rgbaData) : [0, 0, 0];
  const header = createVTFHeader(width, height, format, {
    mipmaps: generateMips,
    flags: flags2,
    frames,
    reflectivity,
    bumpmapScale
  });
  return concatBuffers([header, ...pixelDataBuffers]);
}
async function convertPNGToVTF(inputPath, outputPath, options = {}) {
  await loadNodeDeps();
  if (!sharp) {
    throw new Error("convertPNGToVTF requires sharp, which is only available in Node.js. Use convertImageDataToVTF or CanvasToVTF in the browser.");
  }
  if (!fs) {
    throw new Error("convertPNGToVTF requires fs, which is only available in Node.js.");
  }
  const format = options.format !== void 0 ? options.format : VTF_FORMATS.RGBA8888;
  const generateMips = options.generateMips !== void 0 ? options.generateMips : true;
  const clampToPowerOf2 = options.clampToPowerOf2 || false;
  let image = sharp(inputPath);
  const metadata = await image.metadata();
  let width = options.width || metadata.width;
  let height = options.height || metadata.height;
  if (clampToPowerOf2 && (!isPowerOf2(width) || !isPowerOf2(height))) {
    width = nextPowerOf2(width);
    height = nextPowerOf2(height);
  }
  if (width !== metadata.width || height !== metadata.height) {
    image = image.resize(width, height, { fit: "fill" });
  }
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  width = info.width;
  height = info.height;
  const vtfData = convertRGBAToVTF(data, width, height, format, {
    generateMips,
    flags: options.flags,
    calculateReflectivityValue: true
  });
  fs.writeFileSync(outputPath, vtfData);
  return { width, height, format };
}
async function convertPNGBufferToVTF(pngBuffer, options = {}) {
  await loadNodeDeps();
  if (!sharp) {
    throw new Error("convertPNGBufferToVTF requires sharp, which is only available in Node.js. Use convertImageDataToVTF or CanvasToVTF in the browser.");
  }
  const format = options.format !== void 0 ? options.format : VTF_FORMATS.RGBA8888;
  const generateMips = options.generateMips !== void 0 ? options.generateMips : true;
  const clampToPowerOf2 = options.clampToPowerOf2 || false;
  let image = sharp(pngBuffer);
  const metadata = await image.metadata();
  let width = options.width || metadata.width;
  let height = options.height || metadata.height;
  if (clampToPowerOf2 && (!isPowerOf2(width) || !isPowerOf2(height))) {
    width = nextPowerOf2(width);
    height = nextPowerOf2(height);
  }
  if (width !== metadata.width || height !== metadata.height) {
    image = image.resize(width, height, { fit: "fill" });
  }
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  width = info.width;
  height = info.height;
  return convertRGBAToVTF(data, width, height, format, {
    generateMips,
    flags: options.flags,
    calculateReflectivityValue: true
  });
}
function convertImageDataToVTF(imageData, options = {}) {
  const format = options.format !== void 0 ? options.format : VTF_FORMATS.RGBA8888;
  const generateMips = options.generateMips !== void 0 ? options.generateMips : true;
  const rgbaData = new Uint8Array(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  return convertRGBAToVTF(rgbaData, width, height, format, {
    generateMips,
    flags: options.flags,
    calculateReflectivityValue: true
  });
}
var CanvasToVTF = class {
  /**
   * Create a VTF converter
   * @param {Object} [options] - Conversion options
   * @param {number} [options.format=VTF_FORMATS.RGBA8888] - VTF format (use VTF_FORMATS constants)
   * @param {boolean} [options.mipmaps=true] - Generate mipmaps (default: true for better scaling)
   * @param {number} [options.flags] - VTF flags (auto-detected if not specified)
   */
  constructor(options = {}) {
    this.format = options.format || VTF_FORMATS.RGBA8888;
    this.mipmaps = options.mipmaps !== void 0 ? options.mipmaps : true;
    this.flags = options.flags;
  }
  /**
   * Convert canvas to VTF format
   * @param {HTMLCanvasElement} canvas - Source canvas
   * @returns {Uint8Array} VTF file data
   */
  convertCanvas(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, width, height);
    return this.convertImageData(imageData);
  }
  /**
   * Convert ImageData to VTF format
   * @param {ImageData} imageData - Source image data
   * @returns {Uint8Array} VTF file data
   */
  convertImageData(imageData) {
    return convertImageDataToVTF(imageData, {
      format: this.format,
      generateMips: this.mipmaps,
      flags: this.flags
    });
  }
  /**
   * Convert canvas to VTF and trigger download (browser only)
   * @param {HTMLCanvasElement} canvas - Source canvas element
   * @param {string} [filename='texture'] - Output filename without extension
   */
  downloadFromCanvas(canvas, filename = "texture") {
    const vtfData = this.convertCanvas(canvas);
    downloadVTF(vtfData, filename);
  }
};
function downloadVTF(vtfData, filename = "texture") {
  if (!isBrowser) {
    throw new Error("downloadVTF is only available in browser environments");
  }
  const blob = new Blob([vtfData], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.vtf`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}
function canvasToVTF(canvas, filename = "texture", format = VTF_FORMATS.RGBA8888, options = {}) {
  const converter = new CanvasToVTF({
    format,
    mipmaps: options.mipmaps !== void 0 ? options.mipmaps : true
  });
  converter.downloadFromCanvas(canvas, filename);
}
function resizeImageBrowser(source, width, height) {
  if (!isBrowser) {
    throw new Error("resizeImageBrowser is only available in browser environments");
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}
var PNGToVTF = {
  // Constants
  VTF_FORMATS,
  VTF_FLAGS,
  // Core conversion functions (work everywhere)
  convertRGBAToVTF,
  convertImageDataToVTF,
  createVTFHeader,
  // Node.js-specific functions (require sharp)
  convertPNGToVTF,
  convertPNGBufferToVTF,
  // Browser-friendly class and functions
  CanvasToVTF,
  canvasToVTF,
  downloadVTF,
  resizeImageBrowser,
  // Utility functions
  isPowerOf2,
  nextPowerOf2,
  getBytesPerPixel,
  calculateMipmapCount,
  createBuffer,
  concatBuffers,
  // Format conversion utilities (for advanced users)
  convertToFormat,
  generateMipmaps,
  // DXT compression utilities
  compressToDXT,
  calculateDXTSize,
  // Environment detection
  isBrowser,
  isNode
};
var index_default = PNGToVTF;
if (isBrowser) {
  window.PNGToVTF = PNGToVTF;
}
export {
  CanvasToVTF,
  VTF_FLAGS,
  VTF_FORMATS,
  calculateDXTSize,
  calculateMipmapCount,
  canvasToVTF,
  compressToDXT,
  concatBuffers,
  convertImageDataToVTF,
  convertPNGBufferToVTF,
  convertPNGToVTF,
  convertRGBAToVTF,
  convertToFormat,
  createBuffer,
  createVTFHeader,
  index_default as default,
  downloadVTF,
  generateMipmaps,
  getBytesPerPixel,
  isBrowser,
  isNode,
  isPowerOf2,
  nextPowerOf2,
  resizeImageBrowser
};
