import { createRequire } from 'module'; const require = createRequire(import.meta.url);
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
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
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

// node_modules/markdown-it-front-matter/index.js
var require_markdown_it_front_matter = __commonJS({
  "node_modules/markdown-it-front-matter/index.js"(exports, module) {
    "use strict";
    module.exports = function front_matter_plugin(md, cb) {
      var min_markers = 3, marker_str = "-", marker_char = marker_str.charCodeAt(0), marker_len = marker_str.length;
      function frontMatter(state, startLine, endLine, silent) {
        var pos, nextLine, marker_count, token, old_parent, old_line_max, start_content, auto_closed = false, start = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (startLine !== 0 || marker_char !== state.src.charCodeAt(0)) {
          return false;
        }
        for (pos = start + 1; pos <= max; pos++) {
          if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
            start_content = pos + 1;
            break;
          }
        }
        marker_count = Math.floor((pos - start) / marker_len);
        if (marker_count < min_markers) {
          return false;
        }
        pos -= (pos - start) % marker_len;
        if (silent) {
          return true;
        }
        nextLine = startLine;
        for (; ; ) {
          nextLine++;
          if (nextLine >= endLine) {
            break;
          }
          if (state.src.slice(start, max) === "...") {
            break;
          }
          start = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          if (start < max && state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          if (marker_char !== state.src.charCodeAt(start)) {
            continue;
          }
          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            continue;
          }
          for (pos = start + 1; pos <= max; pos++) {
            if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
              break;
            }
          }
          if (Math.floor((pos - start) / marker_len) < marker_count) {
            continue;
          }
          pos -= (pos - start) % marker_len;
          pos = state.skipSpaces(pos);
          if (pos < max) {
            continue;
          }
          auto_closed = true;
          break;
        }
        old_parent = state.parentType;
        old_line_max = state.lineMax;
        state.parentType = "container";
        state.lineMax = nextLine;
        token = state.push("front_matter", null, 0);
        token.hidden = true;
        token.markup = state.src.slice(startLine, pos);
        token.block = true;
        token.map = [startLine, nextLine + (auto_closed ? 1 : 0)];
        token.meta = state.src.slice(start_content, start - 1);
        state.parentType = old_parent;
        state.lineMax = old_line_max;
        state.line = nextLine + (auto_closed ? 1 : 0);
        cb(token.meta);
        return true;
      }
      md.block.ruler.before(
        "table",
        "front_matter",
        frontMatter,
        {
          alt: [
            "paragraph",
            "reference",
            "blockquote",
            "list"
          ]
        }
      );
    };
  }
});

// node_modules/markdown-it-task-lists/index.js
var require_markdown_it_task_lists = __commonJS({
  "node_modules/markdown-it-task-lists/index.js"(exports, module) {
    var disableCheckboxes = true;
    var useLabelWrapper = false;
    var useLabelAfter = false;
    module.exports = function(md, options) {
      if (options) {
        disableCheckboxes = !options.enabled;
        useLabelWrapper = !!options.label;
        useLabelAfter = !!options.labelAfter;
      }
      md.core.ruler.after("inline", "github-task-lists", function(state) {
        var tokens = state.tokens;
        for (var i = 2; i < tokens.length; i++) {
          if (isTodoItem(tokens, i)) {
            todoify(tokens[i], state.Token);
            attrSet(tokens[i - 2], "class", "task-list-item" + (!disableCheckboxes ? " enabled" : ""));
            attrSet(tokens[parentToken(tokens, i - 2)], "class", "contains-task-list");
          }
        }
      });
    };
    function attrSet(token, name2, value) {
      var index2 = token.attrIndex(name2);
      var attr = [name2, value];
      if (index2 < 0) {
        token.attrPush(attr);
      } else {
        token.attrs[index2] = attr;
      }
    }
    function parentToken(tokens, index2) {
      var targetLevel = tokens[index2].level - 1;
      for (var i = index2 - 1; i >= 0; i--) {
        if (tokens[i].level === targetLevel) {
          return i;
        }
      }
      return -1;
    }
    function isTodoItem(tokens, index2) {
      return isInline(tokens[index2]) && isParagraph(tokens[index2 - 1]) && isListItem(tokens[index2 - 2]) && startsWithTodoMarkdown(tokens[index2]);
    }
    function todoify(token, TokenConstructor) {
      token.children.unshift(makeCheckbox(token, TokenConstructor));
      token.children[1].content = token.children[1].content.slice(3);
      token.content = token.content.slice(3);
      if (useLabelWrapper) {
        if (useLabelAfter) {
          token.children.pop();
          var id = "task-item-" + Math.ceil(Math.random() * (1e4 * 1e3) - 1e3);
          token.children[0].content = token.children[0].content.slice(0, -1) + ' id="' + id + '">';
          token.children.push(afterLabel(token.content, id, TokenConstructor));
        } else {
          token.children.unshift(beginLabel(TokenConstructor));
          token.children.push(endLabel(TokenConstructor));
        }
      }
    }
    function makeCheckbox(token, TokenConstructor) {
      var checkbox = new TokenConstructor("html_inline", "", 0);
      var disabledAttr = disableCheckboxes ? ' disabled="" ' : "";
      if (token.content.indexOf("[ ] ") === 0) {
        checkbox.content = '<input class="task-list-item-checkbox"' + disabledAttr + 'type="checkbox">';
      } else if (token.content.indexOf("[x] ") === 0 || token.content.indexOf("[X] ") === 0) {
        checkbox.content = '<input class="task-list-item-checkbox" checked=""' + disabledAttr + 'type="checkbox">';
      }
      return checkbox;
    }
    function beginLabel(TokenConstructor) {
      var token = new TokenConstructor("html_inline", "", 0);
      token.content = "<label>";
      return token;
    }
    function endLabel(TokenConstructor) {
      var token = new TokenConstructor("html_inline", "", 0);
      token.content = "</label>";
      return token;
    }
    function afterLabel(content, id, TokenConstructor) {
      var token = new TokenConstructor("html_inline", "", 0);
      token.content = '<label class="task-list-item-label" for="' + id + '">' + content + "</label>";
      token.attrs = [{ for: id }];
      return token;
    }
    function isInline(token) {
      return token.type === "inline";
    }
    function isParagraph(token) {
      return token.type === "paragraph_open";
    }
    function isListItem(token) {
      return token.type === "list_item_open";
    }
    function startsWithTodoMarkdown(token) {
      return token.content.indexOf("[ ] ") === 0 || token.content.indexOf("[x] ") === 0 || token.content.indexOf("[X] ") === 0;
    }
  }
});

// node_modules/markdown-it-deflist/index.js
var require_markdown_it_deflist = __commonJS({
  "node_modules/markdown-it-deflist/index.js"(exports, module) {
    "use strict";
    module.exports = function deflist_plugin(md) {
      var isSpace = md.utils.isSpace;
      function skipMarker(state, line) {
        var pos, marker, start = state.bMarks[line] + state.tShift[line], max = state.eMarks[line];
        if (start >= max) {
          return -1;
        }
        marker = state.src.charCodeAt(start++);
        if (marker !== 126 && marker !== 58) {
          return -1;
        }
        pos = state.skipSpaces(start);
        if (start === pos) {
          return -1;
        }
        if (pos >= max) {
          return -1;
        }
        return start;
      }
      function markTightParagraphs(state, idx) {
        var i, l, level = state.level + 2;
        for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
          if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
            state.tokens[i + 2].hidden = true;
            state.tokens[i].hidden = true;
            i += 2;
          }
        }
      }
      function deflist(state, startLine, endLine, silent) {
        var ch, contentStart, ddLine, dtLine, itemLines, listLines, listTokIdx, max, nextLine, offset, oldDDIndent, oldIndent, oldParentType, oldSCount, oldTShift, oldTight, pos, prevEmptyEnd, tight, token;
        if (silent) {
          if (state.ddIndent < 0) {
            return false;
          }
          return skipMarker(state, startLine) >= 0;
        }
        nextLine = startLine + 1;
        if (nextLine >= endLine) {
          return false;
        }
        if (state.isEmpty(nextLine)) {
          nextLine++;
          if (nextLine >= endLine) {
            return false;
          }
        }
        if (state.sCount[nextLine] < state.blkIndent) {
          return false;
        }
        contentStart = skipMarker(state, nextLine);
        if (contentStart < 0) {
          return false;
        }
        listTokIdx = state.tokens.length;
        tight = true;
        token = state.push("dl_open", "dl", 1);
        token.map = listLines = [startLine, 0];
        dtLine = startLine;
        ddLine = nextLine;
        OUTER:
          for (; ; ) {
            prevEmptyEnd = false;
            token = state.push("dt_open", "dt", 1);
            token.map = [dtLine, dtLine];
            token = state.push("inline", "", 0);
            token.map = [dtLine, dtLine];
            token.content = state.getLines(dtLine, dtLine + 1, state.blkIndent, false).trim();
            token.children = [];
            token = state.push("dt_close", "dt", -1);
            for (; ; ) {
              token = state.push("dd_open", "dd", 1);
              token.map = itemLines = [nextLine, 0];
              pos = contentStart;
              max = state.eMarks[ddLine];
              offset = state.sCount[ddLine] + contentStart - (state.bMarks[ddLine] + state.tShift[ddLine]);
              while (pos < max) {
                ch = state.src.charCodeAt(pos);
                if (isSpace(ch)) {
                  if (ch === 9) {
                    offset += 4 - offset % 4;
                  } else {
                    offset++;
                  }
                } else {
                  break;
                }
                pos++;
              }
              contentStart = pos;
              oldTight = state.tight;
              oldDDIndent = state.ddIndent;
              oldIndent = state.blkIndent;
              oldTShift = state.tShift[ddLine];
              oldSCount = state.sCount[ddLine];
              oldParentType = state.parentType;
              state.blkIndent = state.ddIndent = state.sCount[ddLine] + 2;
              state.tShift[ddLine] = contentStart - state.bMarks[ddLine];
              state.sCount[ddLine] = offset;
              state.tight = true;
              state.parentType = "deflist";
              state.md.block.tokenize(state, ddLine, endLine, true);
              if (!state.tight || prevEmptyEnd) {
                tight = false;
              }
              prevEmptyEnd = state.line - ddLine > 1 && state.isEmpty(state.line - 1);
              state.tShift[ddLine] = oldTShift;
              state.sCount[ddLine] = oldSCount;
              state.tight = oldTight;
              state.parentType = oldParentType;
              state.blkIndent = oldIndent;
              state.ddIndent = oldDDIndent;
              token = state.push("dd_close", "dd", -1);
              itemLines[1] = nextLine = state.line;
              if (nextLine >= endLine) {
                break OUTER;
              }
              if (state.sCount[nextLine] < state.blkIndent) {
                break OUTER;
              }
              contentStart = skipMarker(state, nextLine);
              if (contentStart < 0) {
                break;
              }
              ddLine = nextLine;
            }
            if (nextLine >= endLine) {
              break;
            }
            dtLine = nextLine;
            if (state.isEmpty(dtLine)) {
              break;
            }
            if (state.sCount[dtLine] < state.blkIndent) {
              break;
            }
            ddLine = dtLine + 1;
            if (ddLine >= endLine) {
              break;
            }
            if (state.isEmpty(ddLine)) {
              ddLine++;
            }
            if (ddLine >= endLine) {
              break;
            }
            if (state.sCount[ddLine] < state.blkIndent) {
              break;
            }
            contentStart = skipMarker(state, ddLine);
            if (contentStart < 0) {
              break;
            }
          }
        token = state.push("dl_close", "dl", -1);
        listLines[1] = nextLine;
        state.line = nextLine;
        if (tight) {
          markTightParagraphs(state, listTokIdx);
        }
        return true;
      }
      md.block.ruler.before("paragraph", "deflist", deflist, { alt: ["paragraph", "reference", "blockquote"] });
    };
  }
});

// node_modules/entities/lib/maps/entities.json
var require_entities = __commonJS({
  "node_modules/entities/lib/maps/entities.json"(exports, module) {
    module.exports = { Aacute: "\xC1", aacute: "\xE1", Abreve: "\u0102", abreve: "\u0103", ac: "\u223E", acd: "\u223F", acE: "\u223E\u0333", Acirc: "\xC2", acirc: "\xE2", acute: "\xB4", Acy: "\u0410", acy: "\u0430", AElig: "\xC6", aelig: "\xE6", af: "\u2061", Afr: "\u{1D504}", afr: "\u{1D51E}", Agrave: "\xC0", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", Alpha: "\u0391", alpha: "\u03B1", Amacr: "\u0100", amacr: "\u0101", amalg: "\u2A3F", amp: "&", AMP: "&", andand: "\u2A55", And: "\u2A53", and: "\u2227", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", ange: "\u29A4", angle: "\u2220", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angmsd: "\u2221", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angst: "\xC5", angzarr: "\u237C", Aogon: "\u0104", aogon: "\u0105", Aopf: "\u{1D538}", aopf: "\u{1D552}", apacir: "\u2A6F", ap: "\u2248", apE: "\u2A70", ape: "\u224A", apid: "\u224B", apos: "'", ApplyFunction: "\u2061", approx: "\u2248", approxeq: "\u224A", Aring: "\xC5", aring: "\xE5", Ascr: "\u{1D49C}", ascr: "\u{1D4B6}", Assign: "\u2254", ast: "*", asymp: "\u2248", asympeq: "\u224D", Atilde: "\xC3", atilde: "\xE3", Auml: "\xC4", auml: "\xE4", awconint: "\u2233", awint: "\u2A11", backcong: "\u224C", backepsilon: "\u03F6", backprime: "\u2035", backsim: "\u223D", backsimeq: "\u22CD", Backslash: "\u2216", Barv: "\u2AE7", barvee: "\u22BD", barwed: "\u2305", Barwed: "\u2306", barwedge: "\u2305", bbrk: "\u23B5", bbrktbrk: "\u23B6", bcong: "\u224C", Bcy: "\u0411", bcy: "\u0431", bdquo: "\u201E", becaus: "\u2235", because: "\u2235", Because: "\u2235", bemptyv: "\u29B0", bepsi: "\u03F6", bernou: "\u212C", Bernoullis: "\u212C", Beta: "\u0392", beta: "\u03B2", beth: "\u2136", between: "\u226C", Bfr: "\u{1D505}", bfr: "\u{1D51F}", bigcap: "\u22C2", bigcirc: "\u25EF", bigcup: "\u22C3", bigodot: "\u2A00", bigoplus: "\u2A01", bigotimes: "\u2A02", bigsqcup: "\u2A06", bigstar: "\u2605", bigtriangledown: "\u25BD", bigtriangleup: "\u25B3", biguplus: "\u2A04", bigvee: "\u22C1", bigwedge: "\u22C0", bkarow: "\u290D", blacklozenge: "\u29EB", blacksquare: "\u25AA", blacktriangle: "\u25B4", blacktriangledown: "\u25BE", blacktriangleleft: "\u25C2", blacktriangleright: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bNot: "\u2AED", bnot: "\u2310", Bopf: "\u{1D539}", bopf: "\u{1D553}", bot: "\u22A5", bottom: "\u22A5", bowtie: "\u22C8", boxbox: "\u29C9", boxdl: "\u2510", boxdL: "\u2555", boxDl: "\u2556", boxDL: "\u2557", boxdr: "\u250C", boxdR: "\u2552", boxDr: "\u2553", boxDR: "\u2554", boxh: "\u2500", boxH: "\u2550", boxhd: "\u252C", boxHd: "\u2564", boxhD: "\u2565", boxHD: "\u2566", boxhu: "\u2534", boxHu: "\u2567", boxhU: "\u2568", boxHU: "\u2569", boxminus: "\u229F", boxplus: "\u229E", boxtimes: "\u22A0", boxul: "\u2518", boxuL: "\u255B", boxUl: "\u255C", boxUL: "\u255D", boxur: "\u2514", boxuR: "\u2558", boxUr: "\u2559", boxUR: "\u255A", boxv: "\u2502", boxV: "\u2551", boxvh: "\u253C", boxvH: "\u256A", boxVh: "\u256B", boxVH: "\u256C", boxvl: "\u2524", boxvL: "\u2561", boxVl: "\u2562", boxVL: "\u2563", boxvr: "\u251C", boxvR: "\u255E", boxVr: "\u255F", boxVR: "\u2560", bprime: "\u2035", breve: "\u02D8", Breve: "\u02D8", brvbar: "\xA6", bscr: "\u{1D4B7}", Bscr: "\u212C", bsemi: "\u204F", bsim: "\u223D", bsime: "\u22CD", bsolb: "\u29C5", bsol: "\\", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bump: "\u224E", bumpE: "\u2AAE", bumpe: "\u224F", Bumpeq: "\u224E", bumpeq: "\u224F", Cacute: "\u0106", cacute: "\u0107", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", cap: "\u2229", Cap: "\u22D2", capcup: "\u2A47", capdot: "\u2A40", CapitalDifferentialD: "\u2145", caps: "\u2229\uFE00", caret: "\u2041", caron: "\u02C7", Cayleys: "\u212D", ccaps: "\u2A4D", Ccaron: "\u010C", ccaron: "\u010D", Ccedil: "\xC7", ccedil: "\xE7", Ccirc: "\u0108", ccirc: "\u0109", Cconint: "\u2230", ccups: "\u2A4C", ccupssm: "\u2A50", Cdot: "\u010A", cdot: "\u010B", cedil: "\xB8", Cedilla: "\xB8", cemptyv: "\u29B2", cent: "\xA2", centerdot: "\xB7", CenterDot: "\xB7", cfr: "\u{1D520}", Cfr: "\u212D", CHcy: "\u0427", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", Chi: "\u03A7", chi: "\u03C7", circ: "\u02C6", circeq: "\u2257", circlearrowleft: "\u21BA", circlearrowright: "\u21BB", circledast: "\u229B", circledcirc: "\u229A", circleddash: "\u229D", CircleDot: "\u2299", circledR: "\xAE", circledS: "\u24C8", CircleMinus: "\u2296", CirclePlus: "\u2295", CircleTimes: "\u2297", cir: "\u25CB", cirE: "\u29C3", cire: "\u2257", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", ClockwiseContourIntegral: "\u2232", CloseCurlyDoubleQuote: "\u201D", CloseCurlyQuote: "\u2019", clubs: "\u2663", clubsuit: "\u2663", colon: ":", Colon: "\u2237", Colone: "\u2A74", colone: "\u2254", coloneq: "\u2254", comma: ",", commat: "@", comp: "\u2201", compfn: "\u2218", complement: "\u2201", complexes: "\u2102", cong: "\u2245", congdot: "\u2A6D", Congruent: "\u2261", conint: "\u222E", Conint: "\u222F", ContourIntegral: "\u222E", copf: "\u{1D554}", Copf: "\u2102", coprod: "\u2210", Coproduct: "\u2210", copy: "\xA9", COPY: "\xA9", copysr: "\u2117", CounterClockwiseContourIntegral: "\u2233", crarr: "\u21B5", cross: "\u2717", Cross: "\u2A2F", Cscr: "\u{1D49E}", cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", cuesc: "\u22DF", cularr: "\u21B6", cularrp: "\u293D", cupbrcap: "\u2A48", cupcap: "\u2A46", CupCap: "\u224D", cup: "\u222A", Cup: "\u22D3", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curarrm: "\u293C", curlyeqprec: "\u22DE", curlyeqsucc: "\u22DF", curlyvee: "\u22CE", curlywedge: "\u22CF", curren: "\xA4", curvearrowleft: "\u21B6", curvearrowright: "\u21B7", cuvee: "\u22CE", cuwed: "\u22CF", cwconint: "\u2232", cwint: "\u2231", cylcty: "\u232D", dagger: "\u2020", Dagger: "\u2021", daleth: "\u2138", darr: "\u2193", Darr: "\u21A1", dArr: "\u21D3", dash: "\u2010", Dashv: "\u2AE4", dashv: "\u22A3", dbkarow: "\u290F", dblac: "\u02DD", Dcaron: "\u010E", dcaron: "\u010F", Dcy: "\u0414", dcy: "\u0434", ddagger: "\u2021", ddarr: "\u21CA", DD: "\u2145", dd: "\u2146", DDotrahd: "\u2911", ddotseq: "\u2A77", deg: "\xB0", Del: "\u2207", Delta: "\u0394", delta: "\u03B4", demptyv: "\u29B1", dfisht: "\u297F", Dfr: "\u{1D507}", dfr: "\u{1D521}", dHar: "\u2965", dharl: "\u21C3", dharr: "\u21C2", DiacriticalAcute: "\xB4", DiacriticalDot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", DiacriticalGrave: "`", DiacriticalTilde: "\u02DC", diam: "\u22C4", diamond: "\u22C4", Diamond: "\u22C4", diamondsuit: "\u2666", diams: "\u2666", die: "\xA8", DifferentialD: "\u2146", digamma: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", DJcy: "\u0402", djcy: "\u0452", dlcorn: "\u231E", dlcrop: "\u230D", dollar: "$", Dopf: "\u{1D53B}", dopf: "\u{1D555}", Dot: "\xA8", dot: "\u02D9", DotDot: "\u20DC", doteq: "\u2250", doteqdot: "\u2251", DotEqual: "\u2250", dotminus: "\u2238", dotplus: "\u2214", dotsquare: "\u22A1", doublebarwedge: "\u2306", DoubleContourIntegral: "\u222F", DoubleDot: "\xA8", DoubleDownArrow: "\u21D3", DoubleLeftArrow: "\u21D0", DoubleLeftRightArrow: "\u21D4", DoubleLeftTee: "\u2AE4", DoubleLongLeftArrow: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", DoubleLongRightArrow: "\u27F9", DoubleRightArrow: "\u21D2", DoubleRightTee: "\u22A8", DoubleUpArrow: "\u21D1", DoubleUpDownArrow: "\u21D5", DoubleVerticalBar: "\u2225", DownArrowBar: "\u2913", downarrow: "\u2193", DownArrow: "\u2193", Downarrow: "\u21D3", DownArrowUpArrow: "\u21F5", DownBreve: "\u0311", downdownarrows: "\u21CA", downharpoonleft: "\u21C3", downharpoonright: "\u21C2", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVectorBar: "\u2956", DownLeftVector: "\u21BD", DownRightTeeVector: "\u295F", DownRightVectorBar: "\u2957", DownRightVector: "\u21C1", DownTeeArrow: "\u21A7", DownTee: "\u22A4", drbkarow: "\u2910", drcorn: "\u231F", drcrop: "\u230C", Dscr: "\u{1D49F}", dscr: "\u{1D4B9}", DScy: "\u0405", dscy: "\u0455", dsol: "\u29F6", Dstrok: "\u0110", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", dtrif: "\u25BE", duarr: "\u21F5", duhar: "\u296F", dwangle: "\u29A6", DZcy: "\u040F", dzcy: "\u045F", dzigrarr: "\u27FF", Eacute: "\xC9", eacute: "\xE9", easter: "\u2A6E", Ecaron: "\u011A", ecaron: "\u011B", Ecirc: "\xCA", ecirc: "\xEA", ecir: "\u2256", ecolon: "\u2255", Ecy: "\u042D", ecy: "\u044D", eDDot: "\u2A77", Edot: "\u0116", edot: "\u0117", eDot: "\u2251", ee: "\u2147", efDot: "\u2252", Efr: "\u{1D508}", efr: "\u{1D522}", eg: "\u2A9A", Egrave: "\xC8", egrave: "\xE8", egs: "\u2A96", egsdot: "\u2A98", el: "\u2A99", Element: "\u2208", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", elsdot: "\u2A97", Emacr: "\u0112", emacr: "\u0113", empty: "\u2205", emptyset: "\u2205", EmptySmallSquare: "\u25FB", emptyv: "\u2205", EmptyVerySmallSquare: "\u25AB", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", ENG: "\u014A", eng: "\u014B", ensp: "\u2002", Eogon: "\u0118", eogon: "\u0119", Eopf: "\u{1D53C}", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", Epsilon: "\u0395", epsilon: "\u03B5", epsiv: "\u03F5", eqcirc: "\u2256", eqcolon: "\u2255", eqsim: "\u2242", eqslantgtr: "\u2A96", eqslantless: "\u2A95", Equal: "\u2A75", equals: "=", EqualTilde: "\u2242", equest: "\u225F", Equilibrium: "\u21CC", equiv: "\u2261", equivDD: "\u2A78", eqvparsl: "\u29E5", erarr: "\u2971", erDot: "\u2253", escr: "\u212F", Escr: "\u2130", esdot: "\u2250", Esim: "\u2A73", esim: "\u2242", Eta: "\u0397", eta: "\u03B7", ETH: "\xD0", eth: "\xF0", Euml: "\xCB", euml: "\xEB", euro: "\u20AC", excl: "!", exist: "\u2203", Exists: "\u2203", expectation: "\u2130", exponentiale: "\u2147", ExponentialE: "\u2147", fallingdotseq: "\u2252", Fcy: "\u0424", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", Ffr: "\u{1D509}", ffr: "\u{1D523}", filig: "\uFB01", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", Fopf: "\u{1D53D}", fopf: "\u{1D557}", forall: "\u2200", ForAll: "\u2200", fork: "\u22D4", forkv: "\u2AD9", Fouriertrf: "\u2131", fpartint: "\u2A0D", frac12: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", fscr: "\u{1D4BB}", Fscr: "\u2131", gacute: "\u01F5", Gamma: "\u0393", gamma: "\u03B3", Gammad: "\u03DC", gammad: "\u03DD", gap: "\u2A86", Gbreve: "\u011E", gbreve: "\u011F", Gcedil: "\u0122", Gcirc: "\u011C", gcirc: "\u011D", Gcy: "\u0413", gcy: "\u0433", Gdot: "\u0120", gdot: "\u0121", ge: "\u2265", gE: "\u2267", gEl: "\u2A8C", gel: "\u22DB", geq: "\u2265", geqq: "\u2267", geqslant: "\u2A7E", gescc: "\u2AA9", ges: "\u2A7E", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", Gfr: "\u{1D50A}", gfr: "\u{1D524}", gg: "\u226B", Gg: "\u22D9", ggg: "\u22D9", gimel: "\u2137", GJcy: "\u0403", gjcy: "\u0453", gla: "\u2AA5", gl: "\u2277", glE: "\u2A92", glj: "\u2AA4", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gnE: "\u2269", gneq: "\u2A88", gneqq: "\u2269", gnsim: "\u22E7", Gopf: "\u{1D53E}", gopf: "\u{1D558}", grave: "`", GreaterEqual: "\u2265", GreaterEqualLess: "\u22DB", GreaterFullEqual: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", GreaterSlantEqual: "\u2A7E", GreaterTilde: "\u2273", Gscr: "\u{1D4A2}", gscr: "\u210A", gsim: "\u2273", gsime: "\u2A8E", gsiml: "\u2A90", gtcc: "\u2AA7", gtcir: "\u2A7A", gt: ">", GT: ">", Gt: "\u226B", gtdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrapprox: "\u2A86", gtrarr: "\u2978", gtrdot: "\u22D7", gtreqless: "\u22DB", gtreqqless: "\u2A8C", gtrless: "\u2277", gtrsim: "\u2273", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", Hacek: "\u02C7", hairsp: "\u200A", half: "\xBD", hamilt: "\u210B", HARDcy: "\u042A", hardcy: "\u044A", harrcir: "\u2948", harr: "\u2194", hArr: "\u21D4", harrw: "\u21AD", Hat: "^", hbar: "\u210F", Hcirc: "\u0124", hcirc: "\u0125", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", Hfr: "\u210C", HilbertSpace: "\u210B", hksearow: "\u2925", hkswarow: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", hookrightarrow: "\u21AA", hopf: "\u{1D559}", Hopf: "\u210D", horbar: "\u2015", HorizontalLine: "\u2500", hscr: "\u{1D4BD}", Hscr: "\u210B", hslash: "\u210F", Hstrok: "\u0126", hstrok: "\u0127", HumpDownHump: "\u224E", HumpEqual: "\u224F", hybull: "\u2043", hyphen: "\u2010", Iacute: "\xCD", iacute: "\xED", ic: "\u2063", Icirc: "\xCE", icirc: "\xEE", Icy: "\u0418", icy: "\u0438", Idot: "\u0130", IEcy: "\u0415", iecy: "\u0435", iexcl: "\xA1", iff: "\u21D4", ifr: "\u{1D526}", Ifr: "\u2111", Igrave: "\xCC", igrave: "\xEC", ii: "\u2148", iiiint: "\u2A0C", iiint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", IJlig: "\u0132", ijlig: "\u0133", Imacr: "\u012A", imacr: "\u012B", image: "\u2111", ImaginaryI: "\u2148", imagline: "\u2110", imagpart: "\u2111", imath: "\u0131", Im: "\u2111", imof: "\u22B7", imped: "\u01B5", Implies: "\u21D2", incare: "\u2105", in: "\u2208", infin: "\u221E", infintie: "\u29DD", inodot: "\u0131", intcal: "\u22BA", int: "\u222B", Int: "\u222C", integers: "\u2124", Integral: "\u222B", intercal: "\u22BA", Intersection: "\u22C2", intlarhk: "\u2A17", intprod: "\u2A3C", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", IOcy: "\u0401", iocy: "\u0451", Iogon: "\u012E", iogon: "\u012F", Iopf: "\u{1D540}", iopf: "\u{1D55A}", Iota: "\u0399", iota: "\u03B9", iprod: "\u2A3C", iquest: "\xBF", iscr: "\u{1D4BE}", Iscr: "\u2110", isin: "\u2208", isindot: "\u22F5", isinE: "\u22F9", isins: "\u22F4", isinsv: "\u22F3", isinv: "\u2208", it: "\u2062", Itilde: "\u0128", itilde: "\u0129", Iukcy: "\u0406", iukcy: "\u0456", Iuml: "\xCF", iuml: "\xEF", Jcirc: "\u0134", jcirc: "\u0135", Jcy: "\u0419", jcy: "\u0439", Jfr: "\u{1D50D}", jfr: "\u{1D527}", jmath: "\u0237", Jopf: "\u{1D541}", jopf: "\u{1D55B}", Jscr: "\u{1D4A5}", jscr: "\u{1D4BF}", Jsercy: "\u0408", jsercy: "\u0458", Jukcy: "\u0404", jukcy: "\u0454", Kappa: "\u039A", kappa: "\u03BA", kappav: "\u03F0", Kcedil: "\u0136", kcedil: "\u0137", Kcy: "\u041A", kcy: "\u043A", Kfr: "\u{1D50E}", kfr: "\u{1D528}", kgreen: "\u0138", KHcy: "\u0425", khcy: "\u0445", KJcy: "\u040C", kjcy: "\u045C", Kopf: "\u{1D542}", kopf: "\u{1D55C}", Kscr: "\u{1D4A6}", kscr: "\u{1D4C0}", lAarr: "\u21DA", Lacute: "\u0139", lacute: "\u013A", laemptyv: "\u29B4", lagran: "\u2112", Lambda: "\u039B", lambda: "\u03BB", lang: "\u27E8", Lang: "\u27EA", langd: "\u2991", langle: "\u27E8", lap: "\u2A85", Laplacetrf: "\u2112", laquo: "\xAB", larrb: "\u21E4", larrbfs: "\u291F", larr: "\u2190", Larr: "\u219E", lArr: "\u21D0", larrfs: "\u291D", larrhk: "\u21A9", larrlp: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", latail: "\u2919", lAtail: "\u291B", lat: "\u2AAB", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lBarr: "\u290E", lbbrk: "\u2772", lbrace: "{", lbrack: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", Lcaron: "\u013D", lcaron: "\u013E", Lcedil: "\u013B", lcedil: "\u013C", lceil: "\u2308", lcub: "{", Lcy: "\u041B", lcy: "\u043B", ldca: "\u2936", ldquo: "\u201C", ldquor: "\u201E", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", lE: "\u2266", LeftAngleBracket: "\u27E8", LeftArrowBar: "\u21E4", leftarrow: "\u2190", LeftArrow: "\u2190", Leftarrow: "\u21D0", LeftArrowRightArrow: "\u21C6", leftarrowtail: "\u21A2", LeftCeiling: "\u2308", LeftDoubleBracket: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVectorBar: "\u2959", LeftDownVector: "\u21C3", LeftFloor: "\u230A", leftharpoondown: "\u21BD", leftharpoonup: "\u21BC", leftleftarrows: "\u21C7", leftrightarrow: "\u2194", LeftRightArrow: "\u2194", Leftrightarrow: "\u21D4", leftrightarrows: "\u21C6", leftrightharpoons: "\u21CB", leftrightsquigarrow: "\u21AD", LeftRightVector: "\u294E", LeftTeeArrow: "\u21A4", LeftTee: "\u22A3", LeftTeeVector: "\u295A", leftthreetimes: "\u22CB", LeftTriangleBar: "\u29CF", LeftTriangle: "\u22B2", LeftTriangleEqual: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVectorBar: "\u2958", LeftUpVector: "\u21BF", LeftVectorBar: "\u2952", LeftVector: "\u21BC", lEg: "\u2A8B", leg: "\u22DA", leq: "\u2264", leqq: "\u2266", leqslant: "\u2A7D", lescc: "\u2AA8", les: "\u2A7D", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessapprox: "\u2A85", lessdot: "\u22D6", lesseqgtr: "\u22DA", lesseqqgtr: "\u2A8B", LessEqualGreater: "\u22DA", LessFullEqual: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", LessLess: "\u2AA1", lesssim: "\u2272", LessSlantEqual: "\u2A7D", LessTilde: "\u2272", lfisht: "\u297C", lfloor: "\u230A", Lfr: "\u{1D50F}", lfr: "\u{1D529}", lg: "\u2276", lgE: "\u2A91", lHar: "\u2962", lhard: "\u21BD", lharu: "\u21BC", lharul: "\u296A", lhblk: "\u2584", LJcy: "\u0409", ljcy: "\u0459", llarr: "\u21C7", ll: "\u226A", Ll: "\u22D8", llcorner: "\u231E", Lleftarrow: "\u21DA", llhard: "\u296B", lltri: "\u25FA", Lmidot: "\u013F", lmidot: "\u0140", lmoustache: "\u23B0", lmoust: "\u23B0", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lnE: "\u2268", lneq: "\u2A87", lneqq: "\u2268", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", lobrk: "\u27E6", longleftarrow: "\u27F5", LongLeftArrow: "\u27F5", Longleftarrow: "\u27F8", longleftrightarrow: "\u27F7", LongLeftRightArrow: "\u27F7", Longleftrightarrow: "\u27FA", longmapsto: "\u27FC", longrightarrow: "\u27F6", LongRightArrow: "\u27F6", Longrightarrow: "\u27F9", looparrowleft: "\u21AB", looparrowright: "\u21AC", lopar: "\u2985", Lopf: "\u{1D543}", lopf: "\u{1D55D}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", lowbar: "_", LowerLeftArrow: "\u2199", LowerRightArrow: "\u2198", loz: "\u25CA", lozenge: "\u25CA", lozf: "\u29EB", lpar: "(", lparlt: "\u2993", lrarr: "\u21C6", lrcorner: "\u231F", lrhar: "\u21CB", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", Lscr: "\u2112", lsh: "\u21B0", Lsh: "\u21B0", lsim: "\u2272", lsime: "\u2A8D", lsimg: "\u2A8F", lsqb: "[", lsquo: "\u2018", lsquor: "\u201A", Lstrok: "\u0141", lstrok: "\u0142", ltcc: "\u2AA6", ltcir: "\u2A79", lt: "<", LT: "<", Lt: "\u226A", ltdot: "\u22D6", lthree: "\u22CB", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltri: "\u25C3", ltrie: "\u22B4", ltrif: "\u25C2", ltrPar: "\u2996", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", macr: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", Map: "\u2905", map: "\u21A6", mapsto: "\u21A6", mapstodown: "\u21A7", mapstoleft: "\u21A4", mapstoup: "\u21A5", marker: "\u25AE", mcomma: "\u2A29", Mcy: "\u041C", mcy: "\u043C", mdash: "\u2014", mDDot: "\u223A", measuredangle: "\u2221", MediumSpace: "\u205F", Mellintrf: "\u2133", Mfr: "\u{1D510}", mfr: "\u{1D52A}", mho: "\u2127", micro: "\xB5", midast: "*", midcir: "\u2AF0", mid: "\u2223", middot: "\xB7", minusb: "\u229F", minus: "\u2212", minusd: "\u2238", minusdu: "\u2A2A", MinusPlus: "\u2213", mlcp: "\u2ADB", mldr: "\u2026", mnplus: "\u2213", models: "\u22A7", Mopf: "\u{1D544}", mopf: "\u{1D55E}", mp: "\u2213", mscr: "\u{1D4C2}", Mscr: "\u2133", mstpos: "\u223E", Mu: "\u039C", mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nabla: "\u2207", Nacute: "\u0143", nacute: "\u0144", nang: "\u2220\u20D2", nap: "\u2249", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", napprox: "\u2249", natural: "\u266E", naturals: "\u2115", natur: "\u266E", nbsp: "\xA0", nbump: "\u224E\u0338", nbumpe: "\u224F\u0338", ncap: "\u2A43", Ncaron: "\u0147", ncaron: "\u0148", Ncedil: "\u0145", ncedil: "\u0146", ncong: "\u2247", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", Ncy: "\u041D", ncy: "\u043D", ndash: "\u2013", nearhk: "\u2924", nearr: "\u2197", neArr: "\u21D7", nearrow: "\u2197", ne: "\u2260", nedot: "\u2250\u0338", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", nequiv: "\u2262", nesear: "\u2928", nesim: "\u2242\u0338", NestedGreaterGreater: "\u226B", NestedLessLess: "\u226A", NewLine: "\n", nexist: "\u2204", nexists: "\u2204", Nfr: "\u{1D511}", nfr: "\u{1D52B}", ngE: "\u2267\u0338", nge: "\u2271", ngeq: "\u2271", ngeqq: "\u2267\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", nGg: "\u22D9\u0338", ngsim: "\u2275", nGt: "\u226B\u20D2", ngt: "\u226F", ngtr: "\u226F", nGtv: "\u226B\u0338", nharr: "\u21AE", nhArr: "\u21CE", nhpar: "\u2AF2", ni: "\u220B", nis: "\u22FC", nisd: "\u22FA", niv: "\u220B", NJcy: "\u040A", njcy: "\u045A", nlarr: "\u219A", nlArr: "\u21CD", nldr: "\u2025", nlE: "\u2266\u0338", nle: "\u2270", nleftarrow: "\u219A", nLeftarrow: "\u21CD", nleftrightarrow: "\u21AE", nLeftrightarrow: "\u21CE", nleq: "\u2270", nleqq: "\u2266\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", nless: "\u226E", nLl: "\u22D8\u0338", nlsim: "\u2274", nLt: "\u226A\u20D2", nlt: "\u226E", nltri: "\u22EA", nltrie: "\u22EC", nLtv: "\u226A\u0338", nmid: "\u2224", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nopf: "\u{1D55F}", Nopf: "\u2115", Not: "\u2AEC", not: "\xAC", NotCongruent: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", NotElement: "\u2209", NotEqual: "\u2260", NotEqualTilde: "\u2242\u0338", NotExists: "\u2204", NotGreater: "\u226F", NotGreaterEqual: "\u2271", NotGreaterFullEqual: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", NotGreaterLess: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", NotGreaterTilde: "\u2275", NotHumpDownHump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", notin: "\u2209", notindot: "\u22F5\u0338", notinE: "\u22F9\u0338", notinva: "\u2209", notinvb: "\u22F7", notinvc: "\u22F6", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangle: "\u22EA", NotLeftTriangleEqual: "\u22EC", NotLess: "\u226E", NotLessEqual: "\u2270", NotLessGreater: "\u2278", NotLessLess: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", NotLessTilde: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", notni: "\u220C", notniva: "\u220C", notnivb: "\u22FE", notnivc: "\u22FD", NotPrecedes: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", NotReverseElement: "\u220C", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangle: "\u22EB", NotRightTriangleEqual: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", NotSubset: "\u2282\u20D2", NotSubsetEqual: "\u2288", NotSucceeds: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", NotSupersetEqual: "\u2289", NotTilde: "\u2241", NotTildeEqual: "\u2244", NotTildeFullEqual: "\u2247", NotTildeTilde: "\u2249", NotVerticalBar: "\u2224", nparallel: "\u2226", npar: "\u2226", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", npr: "\u2280", nprcue: "\u22E0", nprec: "\u2280", npreceq: "\u2AAF\u0338", npre: "\u2AAF\u0338", nrarrc: "\u2933\u0338", nrarr: "\u219B", nrArr: "\u21CF", nrarrw: "\u219D\u0338", nrightarrow: "\u219B", nRightarrow: "\u21CF", nrtri: "\u22EB", nrtrie: "\u22ED", nsc: "\u2281", nsccue: "\u22E1", nsce: "\u2AB0\u0338", Nscr: "\u{1D4A9}", nscr: "\u{1D4C3}", nshortmid: "\u2224", nshortparallel: "\u2226", nsim: "\u2241", nsime: "\u2244", nsimeq: "\u2244", nsmid: "\u2224", nspar: "\u2226", nsqsube: "\u22E2", nsqsupe: "\u22E3", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsube: "\u2288", nsubset: "\u2282\u20D2", nsubseteq: "\u2288", nsubseteqq: "\u2AC5\u0338", nsucc: "\u2281", nsucceq: "\u2AB0\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338", nsupe: "\u2289", nsupset: "\u2283\u20D2", nsupseteq: "\u2289", nsupseteqq: "\u2AC6\u0338", ntgl: "\u2279", Ntilde: "\xD1", ntilde: "\xF1", ntlg: "\u2278", ntriangleleft: "\u22EA", ntrianglelefteq: "\u22EC", ntriangleright: "\u22EB", ntrianglerighteq: "\u22ED", Nu: "\u039D", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvDash: "\u22AD", nVdash: "\u22AE", nVDash: "\u22AF", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvHarr: "\u2904", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwarhk: "\u2923", nwarr: "\u2196", nwArr: "\u21D6", nwarrow: "\u2196", nwnear: "\u2927", Oacute: "\xD3", oacute: "\xF3", oast: "\u229B", Ocirc: "\xD4", ocirc: "\xF4", ocir: "\u229A", Ocy: "\u041E", ocy: "\u043E", odash: "\u229D", Odblac: "\u0150", odblac: "\u0151", odiv: "\u2A38", odot: "\u2299", odsold: "\u29BC", OElig: "\u0152", oelig: "\u0153", ofcir: "\u29BF", Ofr: "\u{1D512}", ofr: "\u{1D52C}", ogon: "\u02DB", Ograve: "\xD2", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", ohm: "\u03A9", oint: "\u222E", olarr: "\u21BA", olcir: "\u29BE", olcross: "\u29BB", oline: "\u203E", olt: "\u29C0", Omacr: "\u014C", omacr: "\u014D", Omega: "\u03A9", omega: "\u03C9", Omicron: "\u039F", omicron: "\u03BF", omid: "\u29B6", ominus: "\u2296", Oopf: "\u{1D546}", oopf: "\u{1D560}", opar: "\u29B7", OpenCurlyDoubleQuote: "\u201C", OpenCurlyQuote: "\u2018", operp: "\u29B9", oplus: "\u2295", orarr: "\u21BB", Or: "\u2A54", or: "\u2228", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oS: "\u24C8", Oscr: "\u{1D4AA}", oscr: "\u2134", Oslash: "\xD8", oslash: "\xF8", osol: "\u2298", Otilde: "\xD5", otilde: "\xF5", otimesas: "\u2A36", Otimes: "\u2A37", otimes: "\u2297", Ouml: "\xD6", ouml: "\xF6", ovbar: "\u233D", OverBar: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", OverParenthesis: "\u23DC", para: "\xB6", parallel: "\u2225", par: "\u2225", parsim: "\u2AF3", parsl: "\u2AFD", part: "\u2202", PartialD: "\u2202", Pcy: "\u041F", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", perp: "\u22A5", pertenk: "\u2031", Pfr: "\u{1D513}", pfr: "\u{1D52D}", Phi: "\u03A6", phi: "\u03C6", phiv: "\u03D5", phmmat: "\u2133", phone: "\u260E", Pi: "\u03A0", pi: "\u03C0", pitchfork: "\u22D4", piv: "\u03D6", planck: "\u210F", planckh: "\u210E", plankv: "\u210F", plusacir: "\u2A23", plusb: "\u229E", pluscir: "\u2A22", plus: "+", plusdo: "\u2214", plusdu: "\u2A25", pluse: "\u2A72", PlusMinus: "\xB1", plusmn: "\xB1", plussim: "\u2A26", plustwo: "\u2A27", pm: "\xB1", Poincareplane: "\u210C", pointint: "\u2A15", popf: "\u{1D561}", Popf: "\u2119", pound: "\xA3", prap: "\u2AB7", Pr: "\u2ABB", pr: "\u227A", prcue: "\u227C", precapprox: "\u2AB7", prec: "\u227A", preccurlyeq: "\u227C", Precedes: "\u227A", PrecedesEqual: "\u2AAF", PrecedesSlantEqual: "\u227C", PrecedesTilde: "\u227E", preceq: "\u2AAF", precnapprox: "\u2AB9", precneqq: "\u2AB5", precnsim: "\u22E8", pre: "\u2AAF", prE: "\u2AB3", precsim: "\u227E", prime: "\u2032", Prime: "\u2033", primes: "\u2119", prnap: "\u2AB9", prnE: "\u2AB5", prnsim: "\u22E8", prod: "\u220F", Product: "\u220F", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prop: "\u221D", Proportional: "\u221D", Proportion: "\u2237", propto: "\u221D", prsim: "\u227E", prurel: "\u22B0", Pscr: "\u{1D4AB}", pscr: "\u{1D4C5}", Psi: "\u03A8", psi: "\u03C8", puncsp: "\u2008", Qfr: "\u{1D514}", qfr: "\u{1D52E}", qint: "\u2A0C", qopf: "\u{1D562}", Qopf: "\u211A", qprime: "\u2057", Qscr: "\u{1D4AC}", qscr: "\u{1D4C6}", quaternions: "\u210D", quatint: "\u2A16", quest: "?", questeq: "\u225F", quot: '"', QUOT: '"', rAarr: "\u21DB", race: "\u223D\u0331", Racute: "\u0154", racute: "\u0155", radic: "\u221A", raemptyv: "\u29B3", rang: "\u27E9", Rang: "\u27EB", rangd: "\u2992", range: "\u29A5", rangle: "\u27E9", raquo: "\xBB", rarrap: "\u2975", rarrb: "\u21E5", rarrbfs: "\u2920", rarrc: "\u2933", rarr: "\u2192", Rarr: "\u21A0", rArr: "\u21D2", rarrfs: "\u291E", rarrhk: "\u21AA", rarrlp: "\u21AC", rarrpl: "\u2945", rarrsim: "\u2974", Rarrtl: "\u2916", rarrtl: "\u21A3", rarrw: "\u219D", ratail: "\u291A", rAtail: "\u291C", ratio: "\u2236", rationals: "\u211A", rbarr: "\u290D", rBarr: "\u290F", RBarr: "\u2910", rbbrk: "\u2773", rbrace: "}", rbrack: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", Rcaron: "\u0158", rcaron: "\u0159", Rcedil: "\u0156", rcedil: "\u0157", rceil: "\u2309", rcub: "}", Rcy: "\u0420", rcy: "\u0440", rdca: "\u2937", rdldhar: "\u2969", rdquo: "\u201D", rdquor: "\u201D", rdsh: "\u21B3", real: "\u211C", realine: "\u211B", realpart: "\u211C", reals: "\u211D", Re: "\u211C", rect: "\u25AD", reg: "\xAE", REG: "\xAE", ReverseElement: "\u220B", ReverseEquilibrium: "\u21CB", ReverseUpEquilibrium: "\u296F", rfisht: "\u297D", rfloor: "\u230B", rfr: "\u{1D52F}", Rfr: "\u211C", rHar: "\u2964", rhard: "\u21C1", rharu: "\u21C0", rharul: "\u296C", Rho: "\u03A1", rho: "\u03C1", rhov: "\u03F1", RightAngleBracket: "\u27E9", RightArrowBar: "\u21E5", rightarrow: "\u2192", RightArrow: "\u2192", Rightarrow: "\u21D2", RightArrowLeftArrow: "\u21C4", rightarrowtail: "\u21A3", RightCeiling: "\u2309", RightDoubleBracket: "\u27E7", RightDownTeeVector: "\u295D", RightDownVectorBar: "\u2955", RightDownVector: "\u21C2", RightFloor: "\u230B", rightharpoondown: "\u21C1", rightharpoonup: "\u21C0", rightleftarrows: "\u21C4", rightleftharpoons: "\u21CC", rightrightarrows: "\u21C9", rightsquigarrow: "\u219D", RightTeeArrow: "\u21A6", RightTee: "\u22A2", RightTeeVector: "\u295B", rightthreetimes: "\u22CC", RightTriangleBar: "\u29D0", RightTriangle: "\u22B3", RightTriangleEqual: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVectorBar: "\u2954", RightUpVector: "\u21BE", RightVectorBar: "\u2953", RightVector: "\u21C0", ring: "\u02DA", risingdotseq: "\u2253", rlarr: "\u21C4", rlhar: "\u21CC", rlm: "\u200F", rmoustache: "\u23B1", rmoust: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", robrk: "\u27E7", ropar: "\u2986", ropf: "\u{1D563}", Ropf: "\u211D", roplus: "\u2A2E", rotimes: "\u2A35", RoundImplies: "\u2970", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rrarr: "\u21C9", Rrightarrow: "\u21DB", rsaquo: "\u203A", rscr: "\u{1D4C7}", Rscr: "\u211B", rsh: "\u21B1", Rsh: "\u21B1", rsqb: "]", rsquo: "\u2019", rsquor: "\u2019", rthree: "\u22CC", rtimes: "\u22CA", rtri: "\u25B9", rtrie: "\u22B5", rtrif: "\u25B8", rtriltri: "\u29CE", RuleDelayed: "\u29F4", ruluhar: "\u2968", rx: "\u211E", Sacute: "\u015A", sacute: "\u015B", sbquo: "\u201A", scap: "\u2AB8", Scaron: "\u0160", scaron: "\u0161", Sc: "\u2ABC", sc: "\u227B", sccue: "\u227D", sce: "\u2AB0", scE: "\u2AB4", Scedil: "\u015E", scedil: "\u015F", Scirc: "\u015C", scirc: "\u015D", scnap: "\u2ABA", scnE: "\u2AB6", scnsim: "\u22E9", scpolint: "\u2A13", scsim: "\u227F", Scy: "\u0421", scy: "\u0441", sdotb: "\u22A1", sdot: "\u22C5", sdote: "\u2A66", searhk: "\u2925", searr: "\u2198", seArr: "\u21D8", searrow: "\u2198", sect: "\xA7", semi: ";", seswar: "\u2929", setminus: "\u2216", setmn: "\u2216", sext: "\u2736", Sfr: "\u{1D516}", sfr: "\u{1D530}", sfrown: "\u2322", sharp: "\u266F", SHCHcy: "\u0429", shchcy: "\u0449", SHcy: "\u0428", shcy: "\u0448", ShortDownArrow: "\u2193", ShortLeftArrow: "\u2190", shortmid: "\u2223", shortparallel: "\u2225", ShortRightArrow: "\u2192", ShortUpArrow: "\u2191", shy: "\xAD", Sigma: "\u03A3", sigma: "\u03C3", sigmaf: "\u03C2", sigmav: "\u03C2", sim: "\u223C", simdot: "\u2A6A", sime: "\u2243", simeq: "\u2243", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", slarr: "\u2190", SmallCircle: "\u2218", smallsetminus: "\u2216", smashp: "\u2A33", smeparsl: "\u29E4", smid: "\u2223", smile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", SOFTcy: "\u042C", softcy: "\u044C", solbar: "\u233F", solb: "\u29C4", sol: "/", Sopf: "\u{1D54A}", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660", spar: "\u2225", sqcap: "\u2293", sqcaps: "\u2293\uFE00", sqcup: "\u2294", sqcups: "\u2294\uFE00", Sqrt: "\u221A", sqsub: "\u228F", sqsube: "\u2291", sqsubset: "\u228F", sqsubseteq: "\u2291", sqsup: "\u2290", sqsupe: "\u2292", sqsupset: "\u2290", sqsupseteq: "\u2292", square: "\u25A1", Square: "\u25A1", SquareIntersection: "\u2293", SquareSubset: "\u228F", SquareSubsetEqual: "\u2291", SquareSuperset: "\u2290", SquareSupersetEqual: "\u2292", SquareUnion: "\u2294", squarf: "\u25AA", squ: "\u25A1", squf: "\u25AA", srarr: "\u2192", Sscr: "\u{1D4AE}", sscr: "\u{1D4C8}", ssetmn: "\u2216", ssmile: "\u2323", sstarf: "\u22C6", Star: "\u22C6", star: "\u2606", starf: "\u2605", straightepsilon: "\u03F5", straightphi: "\u03D5", strns: "\xAF", sub: "\u2282", Sub: "\u22D0", subdot: "\u2ABD", subE: "\u2AC5", sube: "\u2286", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subne: "\u228A", subplus: "\u2ABF", subrarr: "\u2979", subset: "\u2282", Subset: "\u22D0", subseteq: "\u2286", subseteqq: "\u2AC5", SubsetEqual: "\u2286", subsetneq: "\u228A", subsetneqq: "\u2ACB", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", succapprox: "\u2AB8", succ: "\u227B", succcurlyeq: "\u227D", Succeeds: "\u227B", SucceedsEqual: "\u2AB0", SucceedsSlantEqual: "\u227D", SucceedsTilde: "\u227F", succeq: "\u2AB0", succnapprox: "\u2ABA", succneqq: "\u2AB6", succnsim: "\u22E9", succsim: "\u227F", SuchThat: "\u220B", sum: "\u2211", Sum: "\u2211", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", sup: "\u2283", Sup: "\u22D1", supdot: "\u2ABE", supdsub: "\u2AD8", supE: "\u2AC6", supe: "\u2287", supedot: "\u2AC4", Superset: "\u2283", SupersetEqual: "\u2287", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supne: "\u228B", supplus: "\u2AC0", supset: "\u2283", Supset: "\u22D1", supseteq: "\u2287", supseteqq: "\u2AC6", supsetneq: "\u228B", supsetneqq: "\u2ACC", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swarhk: "\u2926", swarr: "\u2199", swArr: "\u21D9", swarrow: "\u2199", swnwar: "\u292A", szlig: "\xDF", Tab: "	", target: "\u2316", Tau: "\u03A4", tau: "\u03C4", tbrk: "\u23B4", Tcaron: "\u0164", tcaron: "\u0165", Tcedil: "\u0162", tcedil: "\u0163", Tcy: "\u0422", tcy: "\u0442", tdot: "\u20DB", telrec: "\u2315", Tfr: "\u{1D517}", tfr: "\u{1D531}", there4: "\u2234", therefore: "\u2234", Therefore: "\u2234", Theta: "\u0398", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", thickapprox: "\u2248", thicksim: "\u223C", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", thinsp: "\u2009", thkap: "\u2248", thksim: "\u223C", THORN: "\xDE", thorn: "\xFE", tilde: "\u02DC", Tilde: "\u223C", TildeEqual: "\u2243", TildeFullEqual: "\u2245", TildeTilde: "\u2248", timesbar: "\u2A31", timesb: "\u22A0", times: "\xD7", timesd: "\u2A30", tint: "\u222D", toea: "\u2928", topbot: "\u2336", topcir: "\u2AF1", top: "\u22A4", Topf: "\u{1D54B}", topf: "\u{1D565}", topfork: "\u2ADA", tosa: "\u2929", tprime: "\u2034", trade: "\u2122", TRADE: "\u2122", triangle: "\u25B5", triangledown: "\u25BF", triangleleft: "\u25C3", trianglelefteq: "\u22B4", triangleq: "\u225C", triangleright: "\u25B9", trianglerighteq: "\u22B5", tridot: "\u25EC", trie: "\u225C", triminus: "\u2A3A", TripleDot: "\u20DB", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", Tscr: "\u{1D4AF}", tscr: "\u{1D4C9}", TScy: "\u0426", tscy: "\u0446", TSHcy: "\u040B", tshcy: "\u045B", Tstrok: "\u0166", tstrok: "\u0167", twixt: "\u226C", twoheadleftarrow: "\u219E", twoheadrightarrow: "\u21A0", Uacute: "\xDA", uacute: "\xFA", uarr: "\u2191", Uarr: "\u219F", uArr: "\u21D1", Uarrocir: "\u2949", Ubrcy: "\u040E", ubrcy: "\u045E", Ubreve: "\u016C", ubreve: "\u016D", Ucirc: "\xDB", ucirc: "\xFB", Ucy: "\u0423", ucy: "\u0443", udarr: "\u21C5", Udblac: "\u0170", udblac: "\u0171", udhar: "\u296E", ufisht: "\u297E", Ufr: "\u{1D518}", ufr: "\u{1D532}", Ugrave: "\xD9", ugrave: "\xF9", uHar: "\u2963", uharl: "\u21BF", uharr: "\u21BE", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", Umacr: "\u016A", umacr: "\u016B", uml: "\xA8", UnderBar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", UnionPlus: "\u228E", Uogon: "\u0172", uogon: "\u0173", Uopf: "\u{1D54C}", uopf: "\u{1D566}", UpArrowBar: "\u2912", uparrow: "\u2191", UpArrow: "\u2191", Uparrow: "\u21D1", UpArrowDownArrow: "\u21C5", updownarrow: "\u2195", UpDownArrow: "\u2195", Updownarrow: "\u21D5", UpEquilibrium: "\u296E", upharpoonleft: "\u21BF", upharpoonright: "\u21BE", uplus: "\u228E", UpperLeftArrow: "\u2196", UpperRightArrow: "\u2197", upsi: "\u03C5", Upsi: "\u03D2", upsih: "\u03D2", Upsilon: "\u03A5", upsilon: "\u03C5", UpTeeArrow: "\u21A5", UpTee: "\u22A5", upuparrows: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", Uring: "\u016E", uring: "\u016F", urtri: "\u25F9", Uscr: "\u{1D4B0}", uscr: "\u{1D4CA}", utdot: "\u22F0", Utilde: "\u0168", utilde: "\u0169", utri: "\u25B5", utrif: "\u25B4", uuarr: "\u21C8", Uuml: "\xDC", uuml: "\xFC", uwangle: "\u29A7", vangrt: "\u299C", varepsilon: "\u03F5", varkappa: "\u03F0", varnothing: "\u2205", varphi: "\u03D5", varpi: "\u03D6", varpropto: "\u221D", varr: "\u2195", vArr: "\u21D5", varrho: "\u03F1", varsigma: "\u03C2", varsubsetneq: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vartheta: "\u03D1", vartriangleleft: "\u22B2", vartriangleright: "\u22B3", vBar: "\u2AE8", Vbar: "\u2AEB", vBarv: "\u2AE9", Vcy: "\u0412", vcy: "\u0432", vdash: "\u22A2", vDash: "\u22A8", Vdash: "\u22A9", VDash: "\u22AB", Vdashl: "\u2AE6", veebar: "\u22BB", vee: "\u2228", Vee: "\u22C1", veeeq: "\u225A", vellip: "\u22EE", verbar: "|", Verbar: "\u2016", vert: "|", Vert: "\u2016", VerticalBar: "\u2223", VerticalLine: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", VeryThinSpace: "\u200A", Vfr: "\u{1D519}", vfr: "\u{1D533}", vltri: "\u22B2", vnsub: "\u2282\u20D2", vnsup: "\u2283\u20D2", Vopf: "\u{1D54D}", vopf: "\u{1D567}", vprop: "\u221D", vrtri: "\u22B3", Vscr: "\u{1D4B1}", vscr: "\u{1D4CB}", vsubnE: "\u2ACB\uFE00", vsubne: "\u228A\uFE00", vsupnE: "\u2ACC\uFE00", vsupne: "\u228B\uFE00", Vvdash: "\u22AA", vzigzag: "\u299A", Wcirc: "\u0174", wcirc: "\u0175", wedbar: "\u2A5F", wedge: "\u2227", Wedge: "\u22C0", wedgeq: "\u2259", weierp: "\u2118", Wfr: "\u{1D51A}", wfr: "\u{1D534}", Wopf: "\u{1D54E}", wopf: "\u{1D568}", wp: "\u2118", wr: "\u2240", wreath: "\u2240", Wscr: "\u{1D4B2}", wscr: "\u{1D4CC}", xcap: "\u22C2", xcirc: "\u25EF", xcup: "\u22C3", xdtri: "\u25BD", Xfr: "\u{1D51B}", xfr: "\u{1D535}", xharr: "\u27F7", xhArr: "\u27FA", Xi: "\u039E", xi: "\u03BE", xlarr: "\u27F5", xlArr: "\u27F8", xmap: "\u27FC", xnis: "\u22FB", xodot: "\u2A00", Xopf: "\u{1D54F}", xopf: "\u{1D569}", xoplus: "\u2A01", xotime: "\u2A02", xrarr: "\u27F6", xrArr: "\u27F9", Xscr: "\u{1D4B3}", xscr: "\u{1D4CD}", xsqcup: "\u2A06", xuplus: "\u2A04", xutri: "\u25B3", xvee: "\u22C1", xwedge: "\u22C0", Yacute: "\xDD", yacute: "\xFD", YAcy: "\u042F", yacy: "\u044F", Ycirc: "\u0176", ycirc: "\u0177", Ycy: "\u042B", ycy: "\u044B", yen: "\xA5", Yfr: "\u{1D51C}", yfr: "\u{1D536}", YIcy: "\u0407", yicy: "\u0457", Yopf: "\u{1D550}", yopf: "\u{1D56A}", Yscr: "\u{1D4B4}", yscr: "\u{1D4CE}", YUcy: "\u042E", yucy: "\u044E", yuml: "\xFF", Yuml: "\u0178", Zacute: "\u0179", zacute: "\u017A", Zcaron: "\u017D", zcaron: "\u017E", Zcy: "\u0417", zcy: "\u0437", Zdot: "\u017B", zdot: "\u017C", zeetrf: "\u2128", ZeroWidthSpace: "\u200B", Zeta: "\u0396", zeta: "\u03B6", zfr: "\u{1D537}", Zfr: "\u2128", ZHcy: "\u0416", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", Zopf: "\u2124", Zscr: "\u{1D4B5}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" };
  }
});

// node_modules/markdown-it/lib/common/entities.js
var require_entities2 = __commonJS({
  "node_modules/markdown-it/lib/common/entities.js"(exports, module) {
    "use strict";
    module.exports = require_entities();
  }
});

// node_modules/uc.micro/categories/P/regex.js
var require_regex = __commonJS({
  "node_modules/uc.micro/categories/P/regex.js"(exports, module) {
    module.exports = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
  }
});

// node_modules/mdurl/encode.js
var require_encode = __commonJS({
  "node_modules/mdurl/encode.js"(exports, module) {
    "use strict";
    var encodeCache = {};
    function getEncodeCache(exclude) {
      var i, ch, cache = encodeCache[exclude];
      if (cache) {
        return cache;
      }
      cache = encodeCache[exclude] = [];
      for (i = 0; i < 128; i++) {
        ch = String.fromCharCode(i);
        if (/^[0-9a-z]$/i.test(ch)) {
          cache.push(ch);
        } else {
          cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
        }
      }
      for (i = 0; i < exclude.length; i++) {
        cache[exclude.charCodeAt(i)] = exclude[i];
      }
      return cache;
    }
    function encode(string, exclude, keepEscaped) {
      var i, l, code, nextCode, cache, result = "";
      if (typeof exclude !== "string") {
        keepEscaped = exclude;
        exclude = encode.defaultChars;
      }
      if (typeof keepEscaped === "undefined") {
        keepEscaped = true;
      }
      cache = getEncodeCache(exclude);
      for (i = 0, l = string.length; i < l; i++) {
        code = string.charCodeAt(i);
        if (keepEscaped && code === 37 && i + 2 < l) {
          if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
            result += string.slice(i, i + 3);
            i += 2;
            continue;
          }
        }
        if (code < 128) {
          result += cache[code];
          continue;
        }
        if (code >= 55296 && code <= 57343) {
          if (code >= 55296 && code <= 56319 && i + 1 < l) {
            nextCode = string.charCodeAt(i + 1);
            if (nextCode >= 56320 && nextCode <= 57343) {
              result += encodeURIComponent(string[i] + string[i + 1]);
              i++;
              continue;
            }
          }
          result += "%EF%BF%BD";
          continue;
        }
        result += encodeURIComponent(string[i]);
      }
      return result;
    }
    encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
    encode.componentChars = "-_.!~*'()";
    module.exports = encode;
  }
});

// node_modules/mdurl/decode.js
var require_decode = __commonJS({
  "node_modules/mdurl/decode.js"(exports, module) {
    "use strict";
    var decodeCache = {};
    function getDecodeCache(exclude) {
      var i, ch, cache = decodeCache[exclude];
      if (cache) {
        return cache;
      }
      cache = decodeCache[exclude] = [];
      for (i = 0; i < 128; i++) {
        ch = String.fromCharCode(i);
        cache.push(ch);
      }
      for (i = 0; i < exclude.length; i++) {
        ch = exclude.charCodeAt(i);
        cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
      }
      return cache;
    }
    function decode(string, exclude) {
      var cache;
      if (typeof exclude !== "string") {
        exclude = decode.defaultChars;
      }
      cache = getDecodeCache(exclude);
      return string.replace(/(%[a-f0-9]{2})+/gi, function(seq2) {
        var i, l, b1, b2, b3, b4, chr, result = "";
        for (i = 0, l = seq2.length; i < l; i += 3) {
          b1 = parseInt(seq2.slice(i + 1, i + 3), 16);
          if (b1 < 128) {
            result += cache[b1];
            continue;
          }
          if ((b1 & 224) === 192 && i + 3 < l) {
            b2 = parseInt(seq2.slice(i + 4, i + 6), 16);
            if ((b2 & 192) === 128) {
              chr = b1 << 6 & 1984 | b2 & 63;
              if (chr < 128) {
                result += "\uFFFD\uFFFD";
              } else {
                result += String.fromCharCode(chr);
              }
              i += 3;
              continue;
            }
          }
          if ((b1 & 240) === 224 && i + 6 < l) {
            b2 = parseInt(seq2.slice(i + 4, i + 6), 16);
            b3 = parseInt(seq2.slice(i + 7, i + 9), 16);
            if ((b2 & 192) === 128 && (b3 & 192) === 128) {
              chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
              if (chr < 2048 || chr >= 55296 && chr <= 57343) {
                result += "\uFFFD\uFFFD\uFFFD";
              } else {
                result += String.fromCharCode(chr);
              }
              i += 6;
              continue;
            }
          }
          if ((b1 & 248) === 240 && i + 9 < l) {
            b2 = parseInt(seq2.slice(i + 4, i + 6), 16);
            b3 = parseInt(seq2.slice(i + 7, i + 9), 16);
            b4 = parseInt(seq2.slice(i + 10, i + 12), 16);
            if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
              chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
              if (chr < 65536 || chr > 1114111) {
                result += "\uFFFD\uFFFD\uFFFD\uFFFD";
              } else {
                chr -= 65536;
                result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
              }
              i += 9;
              continue;
            }
          }
          result += "\uFFFD";
        }
        return result;
      });
    }
    decode.defaultChars = ";/?:@&=+$,#";
    decode.componentChars = "";
    module.exports = decode;
  }
});

// node_modules/mdurl/format.js
var require_format = __commonJS({
  "node_modules/mdurl/format.js"(exports, module) {
    "use strict";
    module.exports = function format(url) {
      var result = "";
      result += url.protocol || "";
      result += url.slashes ? "//" : "";
      result += url.auth ? url.auth + "@" : "";
      if (url.hostname && url.hostname.indexOf(":") !== -1) {
        result += "[" + url.hostname + "]";
      } else {
        result += url.hostname || "";
      }
      result += url.port ? ":" + url.port : "";
      result += url.pathname || "";
      result += url.search || "";
      result += url.hash || "";
      return result;
    };
  }
});

// node_modules/mdurl/parse.js
var require_parse = __commonJS({
  "node_modules/mdurl/parse.js"(exports, module) {
    "use strict";
    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.pathname = null;
    }
    var protocolPattern = /^([a-z0-9.+-]+:)/i;
    var portPattern = /:[0-9]*$/;
    var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
    var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
    var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
    var autoEscape = ["'"].concat(unwise);
    var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
    var hostEndingChars = ["/", "?", "#"];
    var hostnameMaxLen = 255;
    var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
    var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
    var hostlessProtocol = {
      "javascript": true,
      "javascript:": true
    };
    var slashedProtocol = {
      "http": true,
      "https": true,
      "ftp": true,
      "gopher": true,
      "file": true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    function urlParse(url, slashesDenoteHost) {
      if (url && url instanceof Url) {
        return url;
      }
      var u2 = new Url();
      u2.parse(url, slashesDenoteHost);
      return u2;
    }
    Url.prototype.parse = function(url, slashesDenoteHost) {
      var i, l, lowerProto, hec, slashes, rest = url;
      rest = rest.trim();
      if (!slashesDenoteHost && url.split("#").length === 1) {
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
          }
          return this;
        }
      }
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        lowerProto = proto.toLowerCase();
        this.protocol = proto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        var hostEnd = -1;
        for (i = 0; i < hostEndingChars.length; i++) {
          hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        var auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = auth;
        }
        hostEnd = -1;
        for (i = 0; i < nonHostChars.length; i++) {
          hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        if (hostEnd === -1) {
          hostEnd = rest.length;
        }
        if (rest[hostEnd - 1] === ":") {
          hostEnd--;
        }
        var host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost(host);
        this.hostname = this.hostname || "";
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part) {
              continue;
            }
            if (!part.match(hostnamePartPattern)) {
              var newpart = "";
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  newpart += "x";
                } else {
                  newpart += part[j];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        }
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
        }
      }
      var hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        rest = rest.slice(0, qm);
      }
      if (rest) {
        this.pathname = rest;
      }
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "";
      }
      return this;
    };
    Url.prototype.parseHost = function(host) {
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) {
        this.hostname = host;
      }
    };
    module.exports = urlParse;
  }
});

// node_modules/mdurl/index.js
var require_mdurl = __commonJS({
  "node_modules/mdurl/index.js"(exports, module) {
    "use strict";
    module.exports.encode = require_encode();
    module.exports.decode = require_decode();
    module.exports.format = require_format();
    module.exports.parse = require_parse();
  }
});

// node_modules/uc.micro/properties/Any/regex.js
var require_regex2 = __commonJS({
  "node_modules/uc.micro/properties/Any/regex.js"(exports, module) {
    module.exports = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  }
});

// node_modules/uc.micro/categories/Cc/regex.js
var require_regex3 = __commonJS({
  "node_modules/uc.micro/categories/Cc/regex.js"(exports, module) {
    module.exports = /[\0-\x1F\x7F-\x9F]/;
  }
});

// node_modules/uc.micro/categories/Cf/regex.js
var require_regex4 = __commonJS({
  "node_modules/uc.micro/categories/Cf/regex.js"(exports, module) {
    module.exports = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
  }
});

// node_modules/uc.micro/categories/Z/regex.js
var require_regex5 = __commonJS({
  "node_modules/uc.micro/categories/Z/regex.js"(exports, module) {
    module.exports = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
  }
});

// node_modules/uc.micro/index.js
var require_uc = __commonJS({
  "node_modules/uc.micro/index.js"(exports) {
    "use strict";
    exports.Any = require_regex2();
    exports.Cc = require_regex3();
    exports.Cf = require_regex4();
    exports.P = require_regex();
    exports.Z = require_regex5();
  }
});

// node_modules/markdown-it/lib/common/utils.js
var require_utils = __commonJS({
  "node_modules/markdown-it/lib/common/utils.js"(exports) {
    "use strict";
    function _class2(obj) {
      return Object.prototype.toString.call(obj);
    }
    function isString(obj) {
      return _class2(obj) === "[object String]";
    }
    var _hasOwnProperty2 = Object.prototype.hasOwnProperty;
    function has2(object, key) {
      return _hasOwnProperty2.call(object, key);
    }
    function assign(obj) {
      var sources = Array.prototype.slice.call(arguments, 1);
      sources.forEach(function(source) {
        if (!source) {
          return;
        }
        if (typeof source !== "object") {
          throw new TypeError(source + "must be object");
        }
        Object.keys(source).forEach(function(key) {
          obj[key] = source[key];
        });
      });
      return obj;
    }
    function arrayReplaceAt(src, pos, newElements) {
      return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
    }
    function isValidEntityCode(c) {
      if (c >= 55296 && c <= 57343) {
        return false;
      }
      if (c >= 64976 && c <= 65007) {
        return false;
      }
      if ((c & 65535) === 65535 || (c & 65535) === 65534) {
        return false;
      }
      if (c >= 0 && c <= 8) {
        return false;
      }
      if (c === 11) {
        return false;
      }
      if (c >= 14 && c <= 31) {
        return false;
      }
      if (c >= 127 && c <= 159) {
        return false;
      }
      if (c > 1114111) {
        return false;
      }
      return true;
    }
    function fromCodePoint(c) {
      if (c > 65535) {
        c -= 65536;
        var surrogate1 = 55296 + (c >> 10), surrogate2 = 56320 + (c & 1023);
        return String.fromCharCode(surrogate1, surrogate2);
      }
      return String.fromCharCode(c);
    }
    var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
    var ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
    var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + "|" + ENTITY_RE.source, "gi");
    var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
    var entities = require_entities2();
    function replaceEntityPattern(match, name2) {
      var code;
      if (has2(entities, name2)) {
        return entities[name2];
      }
      if (name2.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name2)) {
        code = name2[1].toLowerCase() === "x" ? parseInt(name2.slice(2), 16) : parseInt(name2.slice(1), 10);
        if (isValidEntityCode(code)) {
          return fromCodePoint(code);
        }
      }
      return match;
    }
    function unescapeMd(str2) {
      if (str2.indexOf("\\") < 0) {
        return str2;
      }
      return str2.replace(UNESCAPE_MD_RE, "$1");
    }
    function unescapeAll(str2) {
      if (str2.indexOf("\\") < 0 && str2.indexOf("&") < 0) {
        return str2;
      }
      return str2.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
        if (escaped) {
          return escaped;
        }
        return replaceEntityPattern(match, entity);
      });
    }
    var HTML_ESCAPE_TEST_RE = /[&<>"]/;
    var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
    var HTML_REPLACEMENTS = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    };
    function replaceUnsafeChar(ch) {
      return HTML_REPLACEMENTS[ch];
    }
    function escapeHtml3(str2) {
      if (HTML_ESCAPE_TEST_RE.test(str2)) {
        return str2.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
      }
      return str2;
    }
    var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
    function escapeRE(str2) {
      return str2.replace(REGEXP_ESCAPE_RE, "\\$&");
    }
    function isSpace(code) {
      switch (code) {
        case 9:
        case 32:
          return true;
      }
      return false;
    }
    function isWhiteSpace(code) {
      if (code >= 8192 && code <= 8202) {
        return true;
      }
      switch (code) {
        case 9:
        // \t
        case 10:
        // \n
        case 11:
        // \v
        case 12:
        // \f
        case 13:
        // \r
        case 32:
        case 160:
        case 5760:
        case 8239:
        case 8287:
        case 12288:
          return true;
      }
      return false;
    }
    var UNICODE_PUNCT_RE = require_regex();
    function isPunctChar(ch) {
      return UNICODE_PUNCT_RE.test(ch);
    }
    function isMdAsciiPunct(ch) {
      switch (ch) {
        case 33:
        case 34:
        case 35:
        case 36:
        case 37:
        case 38:
        case 39:
        case 40:
        case 41:
        case 42:
        case 43:
        case 44:
        case 45:
        case 46:
        case 47:
        case 58:
        case 59:
        case 60:
        case 61:
        case 62:
        case 63:
        case 64:
        case 91:
        case 92:
        case 93:
        case 94:
        case 95:
        case 96:
        case 123:
        case 124:
        case 125:
        case 126:
          return true;
        default:
          return false;
      }
    }
    function normalizeReference(str2) {
      str2 = str2.trim().replace(/\s+/g, " ");
      if ("\u1E9E".toLowerCase() === "\u1E7E") {
        str2 = str2.replace(/ẞ/g, "\xDF");
      }
      return str2.toLowerCase().toUpperCase();
    }
    exports.lib = {};
    exports.lib.mdurl = require_mdurl();
    exports.lib.ucmicro = require_uc();
    exports.assign = assign;
    exports.isString = isString;
    exports.has = has2;
    exports.unescapeMd = unescapeMd;
    exports.unescapeAll = unescapeAll;
    exports.isValidEntityCode = isValidEntityCode;
    exports.fromCodePoint = fromCodePoint;
    exports.escapeHtml = escapeHtml3;
    exports.arrayReplaceAt = arrayReplaceAt;
    exports.isSpace = isSpace;
    exports.isWhiteSpace = isWhiteSpace;
    exports.isMdAsciiPunct = isMdAsciiPunct;
    exports.isPunctChar = isPunctChar;
    exports.escapeRE = escapeRE;
    exports.normalizeReference = normalizeReference;
  }
});

// node_modules/markdown-it/lib/helpers/parse_link_label.js
var require_parse_link_label = __commonJS({
  "node_modules/markdown-it/lib/helpers/parse_link_label.js"(exports, module) {
    "use strict";
    module.exports = function parseLinkLabel(state, start, disableNested) {
      var level, found, marker, prevPos, labelEnd = -1, max = state.posMax, oldPos = state.pos;
      state.pos = start + 1;
      level = 1;
      while (state.pos < max) {
        marker = state.src.charCodeAt(state.pos);
        if (marker === 93) {
          level--;
          if (level === 0) {
            found = true;
            break;
          }
        }
        prevPos = state.pos;
        state.md.inline.skipToken(state);
        if (marker === 91) {
          if (prevPos === state.pos - 1) {
            level++;
          } else if (disableNested) {
            state.pos = oldPos;
            return -1;
          }
        }
      }
      if (found) {
        labelEnd = state.pos;
      }
      state.pos = oldPos;
      return labelEnd;
    };
  }
});

// node_modules/markdown-it/lib/helpers/parse_link_destination.js
var require_parse_link_destination = __commonJS({
  "node_modules/markdown-it/lib/helpers/parse_link_destination.js"(exports, module) {
    "use strict";
    var unescapeAll = require_utils().unescapeAll;
    module.exports = function parseLinkDestination(str2, start, max) {
      var code, level, pos = start, result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ""
      };
      if (str2.charCodeAt(pos) === 60) {
        pos++;
        while (pos < max) {
          code = str2.charCodeAt(pos);
          if (code === 10) {
            return result;
          }
          if (code === 60) {
            return result;
          }
          if (code === 62) {
            result.pos = pos + 1;
            result.str = unescapeAll(str2.slice(start + 1, pos));
            result.ok = true;
            return result;
          }
          if (code === 92 && pos + 1 < max) {
            pos += 2;
            continue;
          }
          pos++;
        }
        return result;
      }
      level = 0;
      while (pos < max) {
        code = str2.charCodeAt(pos);
        if (code === 32) {
          break;
        }
        if (code < 32 || code === 127) {
          break;
        }
        if (code === 92 && pos + 1 < max) {
          if (str2.charCodeAt(pos + 1) === 32) {
            break;
          }
          pos += 2;
          continue;
        }
        if (code === 40) {
          level++;
          if (level > 32) {
            return result;
          }
        }
        if (code === 41) {
          if (level === 0) {
            break;
          }
          level--;
        }
        pos++;
      }
      if (start === pos) {
        return result;
      }
      if (level !== 0) {
        return result;
      }
      result.str = unescapeAll(str2.slice(start, pos));
      result.pos = pos;
      result.ok = true;
      return result;
    };
  }
});

// node_modules/markdown-it/lib/helpers/parse_link_title.js
var require_parse_link_title = __commonJS({
  "node_modules/markdown-it/lib/helpers/parse_link_title.js"(exports, module) {
    "use strict";
    var unescapeAll = require_utils().unescapeAll;
    module.exports = function parseLinkTitle(str2, start, max) {
      var code, marker, lines = 0, pos = start, result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ""
      };
      if (pos >= max) {
        return result;
      }
      marker = str2.charCodeAt(pos);
      if (marker !== 34 && marker !== 39 && marker !== 40) {
        return result;
      }
      pos++;
      if (marker === 40) {
        marker = 41;
      }
      while (pos < max) {
        code = str2.charCodeAt(pos);
        if (code === marker) {
          result.pos = pos + 1;
          result.lines = lines;
          result.str = unescapeAll(str2.slice(start + 1, pos));
          result.ok = true;
          return result;
        } else if (code === 40 && marker === 41) {
          return result;
        } else if (code === 10) {
          lines++;
        } else if (code === 92 && pos + 1 < max) {
          pos++;
          if (str2.charCodeAt(pos) === 10) {
            lines++;
          }
        }
        pos++;
      }
      return result;
    };
  }
});

// node_modules/markdown-it/lib/helpers/index.js
var require_helpers = __commonJS({
  "node_modules/markdown-it/lib/helpers/index.js"(exports) {
    "use strict";
    exports.parseLinkLabel = require_parse_link_label();
    exports.parseLinkDestination = require_parse_link_destination();
    exports.parseLinkTitle = require_parse_link_title();
  }
});

// node_modules/markdown-it/lib/renderer.js
var require_renderer = __commonJS({
  "node_modules/markdown-it/lib/renderer.js"(exports, module) {
    "use strict";
    var assign = require_utils().assign;
    var unescapeAll = require_utils().unescapeAll;
    var escapeHtml3 = require_utils().escapeHtml;
    var default_rules = {};
    default_rules.code_inline = function(tokens, idx, options, env, slf) {
      var token = tokens[idx];
      return "<code" + slf.renderAttrs(token) + ">" + escapeHtml3(token.content) + "</code>";
    };
    default_rules.code_block = function(tokens, idx, options, env, slf) {
      var token = tokens[idx];
      return "<pre" + slf.renderAttrs(token) + "><code>" + escapeHtml3(tokens[idx].content) + "</code></pre>\n";
    };
    default_rules.fence = function(tokens, idx, options, env, slf) {
      var token = tokens[idx], info = token.info ? unescapeAll(token.info).trim() : "", langName = "", langAttrs = "", highlighted, i, arr, tmpAttrs, tmpToken;
      if (info) {
        arr = info.split(/(\s+)/g);
        langName = arr[0];
        langAttrs = arr.slice(2).join("");
      }
      if (options.highlight) {
        highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml3(token.content);
      } else {
        highlighted = escapeHtml3(token.content);
      }
      if (highlighted.indexOf("<pre") === 0) {
        return highlighted + "\n";
      }
      if (info) {
        i = token.attrIndex("class");
        tmpAttrs = token.attrs ? token.attrs.slice() : [];
        if (i < 0) {
          tmpAttrs.push(["class", options.langPrefix + langName]);
        } else {
          tmpAttrs[i] = tmpAttrs[i].slice();
          tmpAttrs[i][1] += " " + options.langPrefix + langName;
        }
        tmpToken = {
          attrs: tmpAttrs
        };
        return "<pre><code" + slf.renderAttrs(tmpToken) + ">" + highlighted + "</code></pre>\n";
      }
      return "<pre><code" + slf.renderAttrs(token) + ">" + highlighted + "</code></pre>\n";
    };
    default_rules.image = function(tokens, idx, options, env, slf) {
      var token = tokens[idx];
      token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
      return slf.renderToken(tokens, idx, options);
    };
    default_rules.hardbreak = function(tokens, idx, options) {
      return options.xhtmlOut ? "<br />\n" : "<br>\n";
    };
    default_rules.softbreak = function(tokens, idx, options) {
      return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
    };
    default_rules.text = function(tokens, idx) {
      return escapeHtml3(tokens[idx].content);
    };
    default_rules.html_block = function(tokens, idx) {
      return tokens[idx].content;
    };
    default_rules.html_inline = function(tokens, idx) {
      return tokens[idx].content;
    };
    function Renderer() {
      this.rules = assign({}, default_rules);
    }
    Renderer.prototype.renderAttrs = function renderAttrs(token) {
      var i, l, result;
      if (!token.attrs) {
        return "";
      }
      result = "";
      for (i = 0, l = token.attrs.length; i < l; i++) {
        result += " " + escapeHtml3(token.attrs[i][0]) + '="' + escapeHtml3(token.attrs[i][1]) + '"';
      }
      return result;
    };
    Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
      var nextToken, result = "", needLf = false, token = tokens[idx];
      if (token.hidden) {
        return "";
      }
      if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
        result += "\n";
      }
      result += (token.nesting === -1 ? "</" : "<") + token.tag;
      result += this.renderAttrs(token);
      if (token.nesting === 0 && options.xhtmlOut) {
        result += " /";
      }
      if (token.block) {
        needLf = true;
        if (token.nesting === 1) {
          if (idx + 1 < tokens.length) {
            nextToken = tokens[idx + 1];
            if (nextToken.type === "inline" || nextToken.hidden) {
              needLf = false;
            } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
              needLf = false;
            }
          }
        }
      }
      result += needLf ? ">\n" : ">";
      return result;
    };
    Renderer.prototype.renderInline = function(tokens, options, env) {
      var type2, result = "", rules = this.rules;
      for (var i = 0, len = tokens.length; i < len; i++) {
        type2 = tokens[i].type;
        if (typeof rules[type2] !== "undefined") {
          result += rules[type2](tokens, i, options, env, this);
        } else {
          result += this.renderToken(tokens, i, options);
        }
      }
      return result;
    };
    Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
      var result = "";
      for (var i = 0, len = tokens.length; i < len; i++) {
        if (tokens[i].type === "text") {
          result += tokens[i].content;
        } else if (tokens[i].type === "image") {
          result += this.renderInlineAsText(tokens[i].children, options, env);
        } else if (tokens[i].type === "softbreak") {
          result += "\n";
        }
      }
      return result;
    };
    Renderer.prototype.render = function(tokens, options, env) {
      var i, len, type2, result = "", rules = this.rules;
      for (i = 0, len = tokens.length; i < len; i++) {
        type2 = tokens[i].type;
        if (type2 === "inline") {
          result += this.renderInline(tokens[i].children, options, env);
        } else if (typeof rules[type2] !== "undefined") {
          result += rules[type2](tokens, i, options, env, this);
        } else {
          result += this.renderToken(tokens, i, options, env);
        }
      }
      return result;
    };
    module.exports = Renderer;
  }
});

// node_modules/markdown-it/lib/ruler.js
var require_ruler = __commonJS({
  "node_modules/markdown-it/lib/ruler.js"(exports, module) {
    "use strict";
    function Ruler() {
      this.__rules__ = [];
      this.__cache__ = null;
    }
    Ruler.prototype.__find__ = function(name2) {
      for (var i = 0; i < this.__rules__.length; i++) {
        if (this.__rules__[i].name === name2) {
          return i;
        }
      }
      return -1;
    };
    Ruler.prototype.__compile__ = function() {
      var self2 = this;
      var chains = [""];
      self2.__rules__.forEach(function(rule) {
        if (!rule.enabled) {
          return;
        }
        rule.alt.forEach(function(altName) {
          if (chains.indexOf(altName) < 0) {
            chains.push(altName);
          }
        });
      });
      self2.__cache__ = {};
      chains.forEach(function(chain) {
        self2.__cache__[chain] = [];
        self2.__rules__.forEach(function(rule) {
          if (!rule.enabled) {
            return;
          }
          if (chain && rule.alt.indexOf(chain) < 0) {
            return;
          }
          self2.__cache__[chain].push(rule.fn);
        });
      });
    };
    Ruler.prototype.at = function(name2, fn, options) {
      var index2 = this.__find__(name2);
      var opt = options || {};
      if (index2 === -1) {
        throw new Error("Parser rule not found: " + name2);
      }
      this.__rules__[index2].fn = fn;
      this.__rules__[index2].alt = opt.alt || [];
      this.__cache__ = null;
    };
    Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
      var index2 = this.__find__(beforeName);
      var opt = options || {};
      if (index2 === -1) {
        throw new Error("Parser rule not found: " + beforeName);
      }
      this.__rules__.splice(index2, 0, {
        name: ruleName,
        enabled: true,
        fn,
        alt: opt.alt || []
      });
      this.__cache__ = null;
    };
    Ruler.prototype.after = function(afterName, ruleName, fn, options) {
      var index2 = this.__find__(afterName);
      var opt = options || {};
      if (index2 === -1) {
        throw new Error("Parser rule not found: " + afterName);
      }
      this.__rules__.splice(index2 + 1, 0, {
        name: ruleName,
        enabled: true,
        fn,
        alt: opt.alt || []
      });
      this.__cache__ = null;
    };
    Ruler.prototype.push = function(ruleName, fn, options) {
      var opt = options || {};
      this.__rules__.push({
        name: ruleName,
        enabled: true,
        fn,
        alt: opt.alt || []
      });
      this.__cache__ = null;
    };
    Ruler.prototype.enable = function(list, ignoreInvalid) {
      if (!Array.isArray(list)) {
        list = [list];
      }
      var result = [];
      list.forEach(function(name2) {
        var idx = this.__find__(name2);
        if (idx < 0) {
          if (ignoreInvalid) {
            return;
          }
          throw new Error("Rules manager: invalid rule name " + name2);
        }
        this.__rules__[idx].enabled = true;
        result.push(name2);
      }, this);
      this.__cache__ = null;
      return result;
    };
    Ruler.prototype.enableOnly = function(list, ignoreInvalid) {
      if (!Array.isArray(list)) {
        list = [list];
      }
      this.__rules__.forEach(function(rule) {
        rule.enabled = false;
      });
      this.enable(list, ignoreInvalid);
    };
    Ruler.prototype.disable = function(list, ignoreInvalid) {
      if (!Array.isArray(list)) {
        list = [list];
      }
      var result = [];
      list.forEach(function(name2) {
        var idx = this.__find__(name2);
        if (idx < 0) {
          if (ignoreInvalid) {
            return;
          }
          throw new Error("Rules manager: invalid rule name " + name2);
        }
        this.__rules__[idx].enabled = false;
        result.push(name2);
      }, this);
      this.__cache__ = null;
      return result;
    };
    Ruler.prototype.getRules = function(chainName) {
      if (this.__cache__ === null) {
        this.__compile__();
      }
      return this.__cache__[chainName] || [];
    };
    module.exports = Ruler;
  }
});

// node_modules/markdown-it/lib/rules_core/normalize.js
var require_normalize = __commonJS({
  "node_modules/markdown-it/lib/rules_core/normalize.js"(exports, module) {
    "use strict";
    var NEWLINES_RE = /\r\n?|\n/g;
    var NULL_RE = /\0/g;
    module.exports = function normalize(state) {
      var str2;
      str2 = state.src.replace(NEWLINES_RE, "\n");
      str2 = str2.replace(NULL_RE, "\uFFFD");
      state.src = str2;
    };
  }
});

// node_modules/markdown-it/lib/rules_core/block.js
var require_block = __commonJS({
  "node_modules/markdown-it/lib/rules_core/block.js"(exports, module) {
    "use strict";
    module.exports = function block(state) {
      var token;
      if (state.inlineMode) {
        token = new state.Token("inline", "", 0);
        token.content = state.src;
        token.map = [0, 1];
        token.children = [];
        state.tokens.push(token);
      } else {
        state.md.block.parse(state.src, state.md, state.env, state.tokens);
      }
    };
  }
});

// node_modules/markdown-it/lib/rules_core/inline.js
var require_inline = __commonJS({
  "node_modules/markdown-it/lib/rules_core/inline.js"(exports, module) {
    "use strict";
    module.exports = function inline(state) {
      var tokens = state.tokens, tok, i, l;
      for (i = 0, l = tokens.length; i < l; i++) {
        tok = tokens[i];
        if (tok.type === "inline") {
          state.md.inline.parse(tok.content, state.md, state.env, tok.children);
        }
      }
    };
  }
});

// node_modules/markdown-it/lib/rules_core/linkify.js
var require_linkify = __commonJS({
  "node_modules/markdown-it/lib/rules_core/linkify.js"(exports, module) {
    "use strict";
    var arrayReplaceAt = require_utils().arrayReplaceAt;
    function isLinkOpen(str2) {
      return /^<a[>\s]/i.test(str2);
    }
    function isLinkClose(str2) {
      return /^<\/a\s*>/i.test(str2);
    }
    module.exports = function linkify(state) {
      var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos, level, htmlLinkLevel, url, fullUrl, urlText, blockTokens = state.tokens, links;
      if (!state.md.options.linkify) {
        return;
      }
      for (j = 0, l = blockTokens.length; j < l; j++) {
        if (blockTokens[j].type !== "inline" || !state.md.linkify.pretest(blockTokens[j].content)) {
          continue;
        }
        tokens = blockTokens[j].children;
        htmlLinkLevel = 0;
        for (i = tokens.length - 1; i >= 0; i--) {
          currentToken = tokens[i];
          if (currentToken.type === "link_close") {
            i--;
            while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") {
              i--;
            }
            continue;
          }
          if (currentToken.type === "html_inline") {
            if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
              htmlLinkLevel--;
            }
            if (isLinkClose(currentToken.content)) {
              htmlLinkLevel++;
            }
          }
          if (htmlLinkLevel > 0) {
            continue;
          }
          if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
            text = currentToken.content;
            links = state.md.linkify.match(text);
            nodes = [];
            level = currentToken.level;
            lastPos = 0;
            if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") {
              links = links.slice(1);
            }
            for (ln = 0; ln < links.length; ln++) {
              url = links[ln].url;
              fullUrl = state.md.normalizeLink(url);
              if (!state.md.validateLink(fullUrl)) {
                continue;
              }
              urlText = links[ln].text;
              if (!links[ln].schema) {
                urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
              } else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) {
                urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
              } else {
                urlText = state.md.normalizeLinkText(urlText);
              }
              pos = links[ln].index;
              if (pos > lastPos) {
                token = new state.Token("text", "", 0);
                token.content = text.slice(lastPos, pos);
                token.level = level;
                nodes.push(token);
              }
              token = new state.Token("link_open", "a", 1);
              token.attrs = [["href", fullUrl]];
              token.level = level++;
              token.markup = "linkify";
              token.info = "auto";
              nodes.push(token);
              token = new state.Token("text", "", 0);
              token.content = urlText;
              token.level = level;
              nodes.push(token);
              token = new state.Token("link_close", "a", -1);
              token.level = --level;
              token.markup = "linkify";
              token.info = "auto";
              nodes.push(token);
              lastPos = links[ln].lastIndex;
            }
            if (lastPos < text.length) {
              token = new state.Token("text", "", 0);
              token.content = text.slice(lastPos);
              token.level = level;
              nodes.push(token);
            }
            blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
          }
        }
      }
    };
  }
});

// node_modules/markdown-it/lib/rules_core/replacements.js
var require_replacements = __commonJS({
  "node_modules/markdown-it/lib/rules_core/replacements.js"(exports, module) {
    "use strict";
    var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
    var SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
    var SCOPED_ABBR_RE = /\((c|tm|r)\)/ig;
    var SCOPED_ABBR = {
      c: "\xA9",
      r: "\xAE",
      tm: "\u2122"
    };
    function replaceFn(match, name2) {
      return SCOPED_ABBR[name2.toLowerCase()];
    }
    function replace_scoped(inlineTokens) {
      var i, token, inside_autolink = 0;
      for (i = inlineTokens.length - 1; i >= 0; i--) {
        token = inlineTokens[i];
        if (token.type === "text" && !inside_autolink) {
          token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
        }
        if (token.type === "link_open" && token.info === "auto") {
          inside_autolink--;
        }
        if (token.type === "link_close" && token.info === "auto") {
          inside_autolink++;
        }
      }
    }
    function replace_rare(inlineTokens) {
      var i, token, inside_autolink = 0;
      for (i = inlineTokens.length - 1; i >= 0; i--) {
        token = inlineTokens[i];
        if (token.type === "text" && !inside_autolink) {
          if (RARE_RE.test(token.content)) {
            token.content = token.content.replace(/\+-/g, "\xB1").replace(/\.{2,}/g, "\u2026").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1\u2014").replace(/(^|\s)--(?=\s|$)/mg, "$1\u2013").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1\u2013");
          }
        }
        if (token.type === "link_open" && token.info === "auto") {
          inside_autolink--;
        }
        if (token.type === "link_close" && token.info === "auto") {
          inside_autolink++;
        }
      }
    }
    module.exports = function replace(state) {
      var blkIdx;
      if (!state.md.options.typographer) {
        return;
      }
      for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
        if (state.tokens[blkIdx].type !== "inline") {
          continue;
        }
        if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
          replace_scoped(state.tokens[blkIdx].children);
        }
        if (RARE_RE.test(state.tokens[blkIdx].content)) {
          replace_rare(state.tokens[blkIdx].children);
        }
      }
    };
  }
});

// node_modules/markdown-it/lib/rules_core/smartquotes.js
var require_smartquotes = __commonJS({
  "node_modules/markdown-it/lib/rules_core/smartquotes.js"(exports, module) {
    "use strict";
    var isWhiteSpace = require_utils().isWhiteSpace;
    var isPunctChar = require_utils().isPunctChar;
    var isMdAsciiPunct = require_utils().isMdAsciiPunct;
    var QUOTE_TEST_RE = /['"]/;
    var QUOTE_RE = /['"]/g;
    var APOSTROPHE = "\u2019";
    function replaceAt(str2, index2, ch) {
      return str2.slice(0, index2) + ch + str2.slice(index2 + 1);
    }
    function process_inlines(tokens, state) {
      var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar, isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace, canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;
      stack = [];
      for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        thisLevel = tokens[i].level;
        for (j = stack.length - 1; j >= 0; j--) {
          if (stack[j].level <= thisLevel) {
            break;
          }
        }
        stack.length = j + 1;
        if (token.type !== "text") {
          continue;
        }
        text = token.content;
        pos = 0;
        max = text.length;
        OUTER:
          while (pos < max) {
            QUOTE_RE.lastIndex = pos;
            t = QUOTE_RE.exec(text);
            if (!t) {
              break;
            }
            canOpen = canClose = true;
            pos = t.index + 1;
            isSingle = t[0] === "'";
            lastChar = 32;
            if (t.index - 1 >= 0) {
              lastChar = text.charCodeAt(t.index - 1);
            } else {
              for (j = i - 1; j >= 0; j--) {
                if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
                if (!tokens[j].content) continue;
                lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
                break;
              }
            }
            nextChar = 32;
            if (pos < max) {
              nextChar = text.charCodeAt(pos);
            } else {
              for (j = i + 1; j < tokens.length; j++) {
                if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
                if (!tokens[j].content) continue;
                nextChar = tokens[j].content.charCodeAt(0);
                break;
              }
            }
            isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
            isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
            isLastWhiteSpace = isWhiteSpace(lastChar);
            isNextWhiteSpace = isWhiteSpace(nextChar);
            if (isNextWhiteSpace) {
              canOpen = false;
            } else if (isNextPunctChar) {
              if (!(isLastWhiteSpace || isLastPunctChar)) {
                canOpen = false;
              }
            }
            if (isLastWhiteSpace) {
              canClose = false;
            } else if (isLastPunctChar) {
              if (!(isNextWhiteSpace || isNextPunctChar)) {
                canClose = false;
              }
            }
            if (nextChar === 34 && t[0] === '"') {
              if (lastChar >= 48 && lastChar <= 57) {
                canClose = canOpen = false;
              }
            }
            if (canOpen && canClose) {
              canOpen = isLastPunctChar;
              canClose = isNextPunctChar;
            }
            if (!canOpen && !canClose) {
              if (isSingle) {
                token.content = replaceAt(token.content, t.index, APOSTROPHE);
              }
              continue;
            }
            if (canClose) {
              for (j = stack.length - 1; j >= 0; j--) {
                item = stack[j];
                if (stack[j].level < thisLevel) {
                  break;
                }
                if (item.single === isSingle && stack[j].level === thisLevel) {
                  item = stack[j];
                  if (isSingle) {
                    openQuote = state.md.options.quotes[2];
                    closeQuote = state.md.options.quotes[3];
                  } else {
                    openQuote = state.md.options.quotes[0];
                    closeQuote = state.md.options.quotes[1];
                  }
                  token.content = replaceAt(token.content, t.index, closeQuote);
                  tokens[item.token].content = replaceAt(
                    tokens[item.token].content,
                    item.pos,
                    openQuote
                  );
                  pos += closeQuote.length - 1;
                  if (item.token === i) {
                    pos += openQuote.length - 1;
                  }
                  text = token.content;
                  max = text.length;
                  stack.length = j;
                  continue OUTER;
                }
              }
            }
            if (canOpen) {
              stack.push({
                token: i,
                pos: t.index,
                single: isSingle,
                level: thisLevel
              });
            } else if (canClose && isSingle) {
              token.content = replaceAt(token.content, t.index, APOSTROPHE);
            }
          }
      }
    }
    module.exports = function smartquotes(state) {
      var blkIdx;
      if (!state.md.options.typographer) {
        return;
      }
      for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
        if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
          continue;
        }
        process_inlines(state.tokens[blkIdx].children, state);
      }
    };
  }
});

// node_modules/markdown-it/lib/rules_core/text_join.js
var require_text_join = __commonJS({
  "node_modules/markdown-it/lib/rules_core/text_join.js"(exports, module) {
    "use strict";
    module.exports = function text_join(state) {
      var j, l, tokens, curr, max, last, blockTokens = state.tokens;
      for (j = 0, l = blockTokens.length; j < l; j++) {
        if (blockTokens[j].type !== "inline") continue;
        tokens = blockTokens[j].children;
        max = tokens.length;
        for (curr = 0; curr < max; curr++) {
          if (tokens[curr].type === "text_special") {
            tokens[curr].type = "text";
          }
        }
        for (curr = last = 0; curr < max; curr++) {
          if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
            tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
          } else {
            if (curr !== last) {
              tokens[last] = tokens[curr];
            }
            last++;
          }
        }
        if (curr !== last) {
          tokens.length = last;
        }
      }
    };
  }
});

// node_modules/markdown-it/lib/token.js
var require_token = __commonJS({
  "node_modules/markdown-it/lib/token.js"(exports, module) {
    "use strict";
    function Token(type2, tag, nesting) {
      this.type = type2;
      this.tag = tag;
      this.attrs = null;
      this.map = null;
      this.nesting = nesting;
      this.level = 0;
      this.children = null;
      this.content = "";
      this.markup = "";
      this.info = "";
      this.meta = null;
      this.block = false;
      this.hidden = false;
    }
    Token.prototype.attrIndex = function attrIndex(name2) {
      var attrs, i, len;
      if (!this.attrs) {
        return -1;
      }
      attrs = this.attrs;
      for (i = 0, len = attrs.length; i < len; i++) {
        if (attrs[i][0] === name2) {
          return i;
        }
      }
      return -1;
    };
    Token.prototype.attrPush = function attrPush(attrData) {
      if (this.attrs) {
        this.attrs.push(attrData);
      } else {
        this.attrs = [attrData];
      }
    };
    Token.prototype.attrSet = function attrSet(name2, value) {
      var idx = this.attrIndex(name2), attrData = [name2, value];
      if (idx < 0) {
        this.attrPush(attrData);
      } else {
        this.attrs[idx] = attrData;
      }
    };
    Token.prototype.attrGet = function attrGet(name2) {
      var idx = this.attrIndex(name2), value = null;
      if (idx >= 0) {
        value = this.attrs[idx][1];
      }
      return value;
    };
    Token.prototype.attrJoin = function attrJoin(name2, value) {
      var idx = this.attrIndex(name2);
      if (idx < 0) {
        this.attrPush([name2, value]);
      } else {
        this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
      }
    };
    module.exports = Token;
  }
});

// node_modules/markdown-it/lib/rules_core/state_core.js
var require_state_core = __commonJS({
  "node_modules/markdown-it/lib/rules_core/state_core.js"(exports, module) {
    "use strict";
    var Token = require_token();
    function StateCore(src, md, env) {
      this.src = src;
      this.env = env;
      this.tokens = [];
      this.inlineMode = false;
      this.md = md;
    }
    StateCore.prototype.Token = Token;
    module.exports = StateCore;
  }
});

// node_modules/markdown-it/lib/parser_core.js
var require_parser_core = __commonJS({
  "node_modules/markdown-it/lib/parser_core.js"(exports, module) {
    "use strict";
    var Ruler = require_ruler();
    var _rules = [
      ["normalize", require_normalize()],
      ["block", require_block()],
      ["inline", require_inline()],
      ["linkify", require_linkify()],
      ["replacements", require_replacements()],
      ["smartquotes", require_smartquotes()],
      // `text_join` finds `text_special` tokens (for escape sequences)
      // and joins them with the rest of the text
      ["text_join", require_text_join()]
    ];
    function Core() {
      this.ruler = new Ruler();
      for (var i = 0; i < _rules.length; i++) {
        this.ruler.push(_rules[i][0], _rules[i][1]);
      }
    }
    Core.prototype.process = function(state) {
      var i, l, rules;
      rules = this.ruler.getRules("");
      for (i = 0, l = rules.length; i < l; i++) {
        rules[i](state);
      }
    };
    Core.prototype.State = require_state_core();
    module.exports = Core;
  }
});

// node_modules/markdown-it/lib/rules_block/table.js
var require_table = __commonJS({
  "node_modules/markdown-it/lib/rules_block/table.js"(exports, module) {
    "use strict";
    var isSpace = require_utils().isSpace;
    function getLine2(state, line) {
      var pos = state.bMarks[line] + state.tShift[line], max = state.eMarks[line];
      return state.src.slice(pos, max);
    }
    function escapedSplit(str2) {
      var result = [], pos = 0, max = str2.length, ch, isEscaped2 = false, lastPos = 0, current = "";
      ch = str2.charCodeAt(pos);
      while (pos < max) {
        if (ch === 124) {
          if (!isEscaped2) {
            result.push(current + str2.substring(lastPos, pos));
            current = "";
            lastPos = pos + 1;
          } else {
            current += str2.substring(lastPos, pos - 1);
            lastPos = pos;
          }
        }
        isEscaped2 = ch === 92;
        pos++;
        ch = str2.charCodeAt(pos);
      }
      result.push(current + str2.substring(lastPos));
      return result;
    }
    module.exports = function table(state, startLine, endLine, silent) {
      var ch, lineText, pos, i, l, nextLine, columns, columnCount, token, aligns, t, tableLines, tbodyLines, oldParentType, terminate, terminatorRules, firstCh, secondCh;
      if (startLine + 2 > endLine) {
        return false;
      }
      nextLine = startLine + 1;
      if (state.sCount[nextLine] < state.blkIndent) {
        return false;
      }
      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        return false;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      if (pos >= state.eMarks[nextLine]) {
        return false;
      }
      firstCh = state.src.charCodeAt(pos++);
      if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) {
        return false;
      }
      if (pos >= state.eMarks[nextLine]) {
        return false;
      }
      secondCh = state.src.charCodeAt(pos++);
      if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) {
        return false;
      }
      if (firstCh === 45 && isSpace(secondCh)) {
        return false;
      }
      while (pos < state.eMarks[nextLine]) {
        ch = state.src.charCodeAt(pos);
        if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) {
          return false;
        }
        pos++;
      }
      lineText = getLine2(state, startLine + 1);
      columns = lineText.split("|");
      aligns = [];
      for (i = 0; i < columns.length; i++) {
        t = columns[i].trim();
        if (!t) {
          if (i === 0 || i === columns.length - 1) {
            continue;
          } else {
            return false;
          }
        }
        if (!/^:?-+:?$/.test(t)) {
          return false;
        }
        if (t.charCodeAt(t.length - 1) === 58) {
          aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
        } else if (t.charCodeAt(0) === 58) {
          aligns.push("left");
        } else {
          aligns.push("");
        }
      }
      lineText = getLine2(state, startLine).trim();
      if (lineText.indexOf("|") === -1) {
        return false;
      }
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      columns = escapedSplit(lineText);
      if (columns.length && columns[0] === "") columns.shift();
      if (columns.length && columns[columns.length - 1] === "") columns.pop();
      columnCount = columns.length;
      if (columnCount === 0 || columnCount !== aligns.length) {
        return false;
      }
      if (silent) {
        return true;
      }
      oldParentType = state.parentType;
      state.parentType = "table";
      terminatorRules = state.md.block.ruler.getRules("blockquote");
      token = state.push("table_open", "table", 1);
      token.map = tableLines = [startLine, 0];
      token = state.push("thead_open", "thead", 1);
      token.map = [startLine, startLine + 1];
      token = state.push("tr_open", "tr", 1);
      token.map = [startLine, startLine + 1];
      for (i = 0; i < columns.length; i++) {
        token = state.push("th_open", "th", 1);
        if (aligns[i]) {
          token.attrs = [["style", "text-align:" + aligns[i]]];
        }
        token = state.push("inline", "", 0);
        token.content = columns[i].trim();
        token.children = [];
        token = state.push("th_close", "th", -1);
      }
      token = state.push("tr_close", "tr", -1);
      token = state.push("thead_close", "thead", -1);
      for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
        if (state.sCount[nextLine] < state.blkIndent) {
          break;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
        lineText = getLine2(state, nextLine).trim();
        if (!lineText) {
          break;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          break;
        }
        columns = escapedSplit(lineText);
        if (columns.length && columns[0] === "") columns.shift();
        if (columns.length && columns[columns.length - 1] === "") columns.pop();
        if (nextLine === startLine + 2) {
          token = state.push("tbody_open", "tbody", 1);
          token.map = tbodyLines = [startLine + 2, 0];
        }
        token = state.push("tr_open", "tr", 1);
        token.map = [nextLine, nextLine + 1];
        for (i = 0; i < columnCount; i++) {
          token = state.push("td_open", "td", 1);
          if (aligns[i]) {
            token.attrs = [["style", "text-align:" + aligns[i]]];
          }
          token = state.push("inline", "", 0);
          token.content = columns[i] ? columns[i].trim() : "";
          token.children = [];
          token = state.push("td_close", "td", -1);
        }
        token = state.push("tr_close", "tr", -1);
      }
      if (tbodyLines) {
        token = state.push("tbody_close", "tbody", -1);
        tbodyLines[1] = nextLine;
      }
      token = state.push("table_close", "table", -1);
      tableLines[1] = nextLine;
      state.parentType = oldParentType;
      state.line = nextLine;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/code.js
var require_code = __commonJS({
  "node_modules/markdown-it/lib/rules_block/code.js"(exports, module) {
    "use strict";
    module.exports = function code(state, startLine, endLine) {
      var nextLine, last, token;
      if (state.sCount[startLine] - state.blkIndent < 4) {
        return false;
      }
      last = nextLine = startLine + 1;
      while (nextLine < endLine) {
        if (state.isEmpty(nextLine)) {
          nextLine++;
          continue;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          nextLine++;
          last = nextLine;
          continue;
        }
        break;
      }
      state.line = last;
      token = state.push("code_block", "code", 0);
      token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
      token.map = [startLine, state.line];
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/fence.js
var require_fence = __commonJS({
  "node_modules/markdown-it/lib/rules_block/fence.js"(exports, module) {
    "use strict";
    module.exports = function fence(state, startLine, endLine, silent) {
      var marker, len, params, nextLine, mem, token, markup, haveEndMarker = false, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      if (pos + 3 > max) {
        return false;
      }
      marker = state.src.charCodeAt(pos);
      if (marker !== 126 && marker !== 96) {
        return false;
      }
      mem = pos;
      pos = state.skipChars(pos, marker);
      len = pos - mem;
      if (len < 3) {
        return false;
      }
      markup = state.src.slice(mem, pos);
      params = state.src.slice(pos, max);
      if (marker === 96) {
        if (params.indexOf(String.fromCharCode(marker)) >= 0) {
          return false;
        }
      }
      if (silent) {
        return true;
      }
      nextLine = startLine;
      for (; ; ) {
        nextLine++;
        if (nextLine >= endLine) {
          break;
        }
        pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        if (pos < max && state.sCount[nextLine] < state.blkIndent) {
          break;
        }
        if (state.src.charCodeAt(pos) !== marker) {
          continue;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          continue;
        }
        pos = state.skipChars(pos, marker);
        if (pos - mem < len) {
          continue;
        }
        pos = state.skipSpaces(pos);
        if (pos < max) {
          continue;
        }
        haveEndMarker = true;
        break;
      }
      len = state.sCount[startLine];
      state.line = nextLine + (haveEndMarker ? 1 : 0);
      token = state.push("fence", "code", 0);
      token.info = params;
      token.content = state.getLines(startLine + 1, nextLine, len, true);
      token.markup = markup;
      token.map = [startLine, state.line];
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/blockquote.js
var require_blockquote = __commonJS({
  "node_modules/markdown-it/lib/rules_block/blockquote.js"(exports, module) {
    "use strict";
    var isSpace = require_utils().isSpace;
    module.exports = function blockquote(state, startLine, endLine, silent) {
      var adjustTab, ch, i, initial, l, lastLineEmpty, lines, nextLine, offset, oldBMarks, oldBSCount, oldIndent, oldParentType, oldSCount, oldTShift, spaceAfterMarker, terminate, terminatorRules, token, isOutdented, oldLineMax = state.lineMax, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      if (state.src.charCodeAt(pos) !== 62) {
        return false;
      }
      if (silent) {
        return true;
      }
      oldBMarks = [];
      oldBSCount = [];
      oldSCount = [];
      oldTShift = [];
      terminatorRules = state.md.block.ruler.getRules("blockquote");
      oldParentType = state.parentType;
      state.parentType = "blockquote";
      for (nextLine = startLine; nextLine < endLine; nextLine++) {
        isOutdented = state.sCount[nextLine] < state.blkIndent;
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        if (pos >= max) {
          break;
        }
        if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
          initial = state.sCount[nextLine] + 1;
          if (state.src.charCodeAt(pos) === 32) {
            pos++;
            initial++;
            adjustTab = false;
            spaceAfterMarker = true;
          } else if (state.src.charCodeAt(pos) === 9) {
            spaceAfterMarker = true;
            if ((state.bsCount[nextLine] + initial) % 4 === 3) {
              pos++;
              initial++;
              adjustTab = false;
            } else {
              adjustTab = true;
            }
          } else {
            spaceAfterMarker = false;
          }
          offset = initial;
          oldBMarks.push(state.bMarks[nextLine]);
          state.bMarks[nextLine] = pos;
          while (pos < max) {
            ch = state.src.charCodeAt(pos);
            if (isSpace(ch)) {
              if (ch === 9) {
                offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
              } else {
                offset++;
              }
            } else {
              break;
            }
            pos++;
          }
          lastLineEmpty = pos >= max;
          oldBSCount.push(state.bsCount[nextLine]);
          state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
          oldSCount.push(state.sCount[nextLine]);
          state.sCount[nextLine] = offset - initial;
          oldTShift.push(state.tShift[nextLine]);
          state.tShift[nextLine] = pos - state.bMarks[nextLine];
          continue;
        }
        if (lastLineEmpty) {
          break;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          state.lineMax = nextLine;
          if (state.blkIndent !== 0) {
            oldBMarks.push(state.bMarks[nextLine]);
            oldBSCount.push(state.bsCount[nextLine]);
            oldTShift.push(state.tShift[nextLine]);
            oldSCount.push(state.sCount[nextLine]);
            state.sCount[nextLine] -= state.blkIndent;
          }
          break;
        }
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] = -1;
      }
      oldIndent = state.blkIndent;
      state.blkIndent = 0;
      token = state.push("blockquote_open", "blockquote", 1);
      token.markup = ">";
      token.map = lines = [startLine, 0];
      state.md.block.tokenize(state, startLine, nextLine);
      token = state.push("blockquote_close", "blockquote", -1);
      token.markup = ">";
      state.lineMax = oldLineMax;
      state.parentType = oldParentType;
      lines[1] = state.line;
      for (i = 0; i < oldTShift.length; i++) {
        state.bMarks[i + startLine] = oldBMarks[i];
        state.tShift[i + startLine] = oldTShift[i];
        state.sCount[i + startLine] = oldSCount[i];
        state.bsCount[i + startLine] = oldBSCount[i];
      }
      state.blkIndent = oldIndent;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/hr.js
var require_hr = __commonJS({
  "node_modules/markdown-it/lib/rules_block/hr.js"(exports, module) {
    "use strict";
    var isSpace = require_utils().isSpace;
    module.exports = function hr(state, startLine, endLine, silent) {
      var marker, cnt, ch, token, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      marker = state.src.charCodeAt(pos++);
      if (marker !== 42 && marker !== 45 && marker !== 95) {
        return false;
      }
      cnt = 1;
      while (pos < max) {
        ch = state.src.charCodeAt(pos++);
        if (ch !== marker && !isSpace(ch)) {
          return false;
        }
        if (ch === marker) {
          cnt++;
        }
      }
      if (cnt < 3) {
        return false;
      }
      if (silent) {
        return true;
      }
      state.line = startLine + 1;
      token = state.push("hr", "hr", 0);
      token.map = [startLine, state.line];
      token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/list.js
var require_list = __commonJS({
  "node_modules/markdown-it/lib/rules_block/list.js"(exports, module) {
    "use strict";
    var isSpace = require_utils().isSpace;
    function skipBulletListMarker(state, startLine) {
      var marker, pos, max, ch;
      pos = state.bMarks[startLine] + state.tShift[startLine];
      max = state.eMarks[startLine];
      marker = state.src.charCodeAt(pos++);
      if (marker !== 42 && marker !== 45 && marker !== 43) {
        return -1;
      }
      if (pos < max) {
        ch = state.src.charCodeAt(pos);
        if (!isSpace(ch)) {
          return -1;
        }
      }
      return pos;
    }
    function skipOrderedListMarker(state, startLine) {
      var ch, start = state.bMarks[startLine] + state.tShift[startLine], pos = start, max = state.eMarks[startLine];
      if (pos + 1 >= max) {
        return -1;
      }
      ch = state.src.charCodeAt(pos++);
      if (ch < 48 || ch > 57) {
        return -1;
      }
      for (; ; ) {
        if (pos >= max) {
          return -1;
        }
        ch = state.src.charCodeAt(pos++);
        if (ch >= 48 && ch <= 57) {
          if (pos - start >= 10) {
            return -1;
          }
          continue;
        }
        if (ch === 41 || ch === 46) {
          break;
        }
        return -1;
      }
      if (pos < max) {
        ch = state.src.charCodeAt(pos);
        if (!isSpace(ch)) {
          return -1;
        }
      }
      return pos;
    }
    function markTightParagraphs(state, idx) {
      var i, l, level = state.level + 2;
      for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
        if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
          state.tokens[i + 2].hidden = true;
          state.tokens[i].hidden = true;
          i += 2;
        }
      }
    }
    module.exports = function list(state, startLine, endLine, silent) {
      var ch, contentStart, i, indent, indentAfterMarker, initial, isOrdered, itemLines, l, listLines, listTokIdx, markerCharCode, markerValue, max, offset, oldListIndent, oldParentType, oldSCount, oldTShift, oldTight, pos, posAfterMarker, prevEmptyEnd, start, terminate, terminatorRules, token, nextLine = startLine, isTerminatingParagraph = false, tight = true;
      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        return false;
      }
      if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) {
        return false;
      }
      if (silent && state.parentType === "paragraph") {
        if (state.sCount[nextLine] >= state.blkIndent) {
          isTerminatingParagraph = true;
        }
      }
      if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
        isOrdered = true;
        start = state.bMarks[nextLine] + state.tShift[nextLine];
        markerValue = Number(state.src.slice(start, posAfterMarker - 1));
        if (isTerminatingParagraph && markerValue !== 1) return false;
      } else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) {
        isOrdered = false;
      } else {
        return false;
      }
      if (isTerminatingParagraph) {
        if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
      }
      if (silent) {
        return true;
      }
      markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
      listTokIdx = state.tokens.length;
      if (isOrdered) {
        token = state.push("ordered_list_open", "ol", 1);
        if (markerValue !== 1) {
          token.attrs = [["start", markerValue]];
        }
      } else {
        token = state.push("bullet_list_open", "ul", 1);
      }
      token.map = listLines = [nextLine, 0];
      token.markup = String.fromCharCode(markerCharCode);
      prevEmptyEnd = false;
      terminatorRules = state.md.block.ruler.getRules("list");
      oldParentType = state.parentType;
      state.parentType = "list";
      while (nextLine < endLine) {
        pos = posAfterMarker;
        max = state.eMarks[nextLine];
        initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
        while (pos < max) {
          ch = state.src.charCodeAt(pos);
          if (ch === 9) {
            offset += 4 - (offset + state.bsCount[nextLine]) % 4;
          } else if (ch === 32) {
            offset++;
          } else {
            break;
          }
          pos++;
        }
        contentStart = pos;
        if (contentStart >= max) {
          indentAfterMarker = 1;
        } else {
          indentAfterMarker = offset - initial;
        }
        if (indentAfterMarker > 4) {
          indentAfterMarker = 1;
        }
        indent = initial + indentAfterMarker;
        token = state.push("list_item_open", "li", 1);
        token.markup = String.fromCharCode(markerCharCode);
        token.map = itemLines = [nextLine, 0];
        if (isOrdered) {
          token.info = state.src.slice(start, posAfterMarker - 1);
        }
        oldTight = state.tight;
        oldTShift = state.tShift[nextLine];
        oldSCount = state.sCount[nextLine];
        oldListIndent = state.listIndent;
        state.listIndent = state.blkIndent;
        state.blkIndent = indent;
        state.tight = true;
        state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
        state.sCount[nextLine] = offset;
        if (contentStart >= max && state.isEmpty(nextLine + 1)) {
          state.line = Math.min(state.line + 2, endLine);
        } else {
          state.md.block.tokenize(state, nextLine, endLine, true);
        }
        if (!state.tight || prevEmptyEnd) {
          tight = false;
        }
        prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
        state.blkIndent = state.listIndent;
        state.listIndent = oldListIndent;
        state.tShift[nextLine] = oldTShift;
        state.sCount[nextLine] = oldSCount;
        state.tight = oldTight;
        token = state.push("list_item_close", "li", -1);
        token.markup = String.fromCharCode(markerCharCode);
        nextLine = state.line;
        itemLines[1] = nextLine;
        if (nextLine >= endLine) {
          break;
        }
        if (state.sCount[nextLine] < state.blkIndent) {
          break;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          break;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
        if (isOrdered) {
          posAfterMarker = skipOrderedListMarker(state, nextLine);
          if (posAfterMarker < 0) {
            break;
          }
          start = state.bMarks[nextLine] + state.tShift[nextLine];
        } else {
          posAfterMarker = skipBulletListMarker(state, nextLine);
          if (posAfterMarker < 0) {
            break;
          }
        }
        if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
          break;
        }
      }
      if (isOrdered) {
        token = state.push("ordered_list_close", "ol", -1);
      } else {
        token = state.push("bullet_list_close", "ul", -1);
      }
      token.markup = String.fromCharCode(markerCharCode);
      listLines[1] = nextLine;
      state.line = nextLine;
      state.parentType = oldParentType;
      if (tight) {
        markTightParagraphs(state, listTokIdx);
      }
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/reference.js
var require_reference = __commonJS({
  "node_modules/markdown-it/lib/rules_block/reference.js"(exports, module) {
    "use strict";
    var normalizeReference = require_utils().normalizeReference;
    var isSpace = require_utils().isSpace;
    module.exports = function reference(state, startLine, _endLine, silent) {
      var ch, destEndPos, destEndLineNo, endLine, href, i, l, label, labelEnd, oldParentType, res, start, str2, terminate, terminatorRules, title, lines = 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine], nextLine = startLine + 1;
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      if (state.src.charCodeAt(pos) !== 91) {
        return false;
      }
      while (++pos < max) {
        if (state.src.charCodeAt(pos) === 93 && state.src.charCodeAt(pos - 1) !== 92) {
          if (pos + 1 === max) {
            return false;
          }
          if (state.src.charCodeAt(pos + 1) !== 58) {
            return false;
          }
          break;
        }
      }
      endLine = state.lineMax;
      terminatorRules = state.md.block.ruler.getRules("reference");
      oldParentType = state.parentType;
      state.parentType = "reference";
      for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
        if (state.sCount[nextLine] - state.blkIndent > 3) {
          continue;
        }
        if (state.sCount[nextLine] < 0) {
          continue;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
      }
      str2 = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
      max = str2.length;
      for (pos = 1; pos < max; pos++) {
        ch = str2.charCodeAt(pos);
        if (ch === 91) {
          return false;
        } else if (ch === 93) {
          labelEnd = pos;
          break;
        } else if (ch === 10) {
          lines++;
        } else if (ch === 92) {
          pos++;
          if (pos < max && str2.charCodeAt(pos) === 10) {
            lines++;
          }
        }
      }
      if (labelEnd < 0 || str2.charCodeAt(labelEnd + 1) !== 58) {
        return false;
      }
      for (pos = labelEnd + 2; pos < max; pos++) {
        ch = str2.charCodeAt(pos);
        if (ch === 10) {
          lines++;
        } else if (isSpace(ch)) {
        } else {
          break;
        }
      }
      res = state.md.helpers.parseLinkDestination(str2, pos, max);
      if (!res.ok) {
        return false;
      }
      href = state.md.normalizeLink(res.str);
      if (!state.md.validateLink(href)) {
        return false;
      }
      pos = res.pos;
      lines += res.lines;
      destEndPos = pos;
      destEndLineNo = lines;
      start = pos;
      for (; pos < max; pos++) {
        ch = str2.charCodeAt(pos);
        if (ch === 10) {
          lines++;
        } else if (isSpace(ch)) {
        } else {
          break;
        }
      }
      res = state.md.helpers.parseLinkTitle(str2, pos, max);
      if (pos < max && start !== pos && res.ok) {
        title = res.str;
        pos = res.pos;
        lines += res.lines;
      } else {
        title = "";
        pos = destEndPos;
        lines = destEndLineNo;
      }
      while (pos < max) {
        ch = str2.charCodeAt(pos);
        if (!isSpace(ch)) {
          break;
        }
        pos++;
      }
      if (pos < max && str2.charCodeAt(pos) !== 10) {
        if (title) {
          title = "";
          pos = destEndPos;
          lines = destEndLineNo;
          while (pos < max) {
            ch = str2.charCodeAt(pos);
            if (!isSpace(ch)) {
              break;
            }
            pos++;
          }
        }
      }
      if (pos < max && str2.charCodeAt(pos) !== 10) {
        return false;
      }
      label = normalizeReference(str2.slice(1, labelEnd));
      if (!label) {
        return false;
      }
      if (silent) {
        return true;
      }
      if (typeof state.env.references === "undefined") {
        state.env.references = {};
      }
      if (typeof state.env.references[label] === "undefined") {
        state.env.references[label] = { title, href };
      }
      state.parentType = oldParentType;
      state.line = startLine + lines + 1;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/common/html_blocks.js
var require_html_blocks = __commonJS({
  "node_modules/markdown-it/lib/common/html_blocks.js"(exports, module) {
    "use strict";
    module.exports = [
      "address",
      "article",
      "aside",
      "base",
      "basefont",
      "blockquote",
      "body",
      "caption",
      "center",
      "col",
      "colgroup",
      "dd",
      "details",
      "dialog",
      "dir",
      "div",
      "dl",
      "dt",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "frame",
      "frameset",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hr",
      "html",
      "iframe",
      "legend",
      "li",
      "link",
      "main",
      "menu",
      "menuitem",
      "nav",
      "noframes",
      "ol",
      "optgroup",
      "option",
      "p",
      "param",
      "section",
      "source",
      "summary",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "title",
      "tr",
      "track",
      "ul"
    ];
  }
});

// node_modules/markdown-it/lib/common/html_re.js
var require_html_re = __commonJS({
  "node_modules/markdown-it/lib/common/html_re.js"(exports, module) {
    "use strict";
    var attr_name = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
    var unquoted = "[^\"'=<>`\\x00-\\x20]+";
    var single_quoted = "'[^']*'";
    var double_quoted = '"[^"]*"';
    var attr_value = "(?:" + unquoted + "|" + single_quoted + "|" + double_quoted + ")";
    var attribute2 = "(?:\\s+" + attr_name + "(?:\\s*=\\s*" + attr_value + ")?)";
    var open_tag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute2 + "*\\s*\\/?>";
    var close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
    var comment = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
    var processing = "<[?][\\s\\S]*?[?]>";
    var declaration = "<![A-Z]+\\s+[^>]*>";
    var cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
    var HTML_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + "|" + comment + "|" + processing + "|" + declaration + "|" + cdata + ")");
    var HTML_OPEN_CLOSE_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + ")");
    module.exports.HTML_TAG_RE = HTML_TAG_RE;
    module.exports.HTML_OPEN_CLOSE_TAG_RE = HTML_OPEN_CLOSE_TAG_RE;
  }
});

// node_modules/markdown-it/lib/rules_block/html_block.js
var require_html_block = __commonJS({
  "node_modules/markdown-it/lib/rules_block/html_block.js"(exports, module) {
    "use strict";
    var block_names = require_html_blocks();
    var HTML_OPEN_CLOSE_TAG_RE = require_html_re().HTML_OPEN_CLOSE_TAG_RE;
    var HTML_SEQUENCES = [
      [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, true],
      [/^<!--/, /-->/, true],
      [/^<\?/, /\?>/, true],
      [/^<![A-Z]/, />/, true],
      [/^<!\[CDATA\[/, /\]\]>/, true],
      [new RegExp("^</?(" + block_names.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, true],
      [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
    ];
    module.exports = function html_block(state, startLine, endLine, silent) {
      var i, nextLine, token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      if (!state.md.options.html) {
        return false;
      }
      if (state.src.charCodeAt(pos) !== 60) {
        return false;
      }
      lineText = state.src.slice(pos, max);
      for (i = 0; i < HTML_SEQUENCES.length; i++) {
        if (HTML_SEQUENCES[i][0].test(lineText)) {
          break;
        }
      }
      if (i === HTML_SEQUENCES.length) {
        return false;
      }
      if (silent) {
        return HTML_SEQUENCES[i][2];
      }
      nextLine = startLine + 1;
      if (!HTML_SEQUENCES[i][1].test(lineText)) {
        for (; nextLine < endLine; nextLine++) {
          if (state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          pos = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          lineText = state.src.slice(pos, max);
          if (HTML_SEQUENCES[i][1].test(lineText)) {
            if (lineText.length !== 0) {
              nextLine++;
            }
            break;
          }
        }
      }
      state.line = nextLine;
      token = state.push("html_block", "", 0);
      token.map = [startLine, nextLine];
      token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/heading.js
var require_heading = __commonJS({
  "node_modules/markdown-it/lib/rules_block/heading.js"(exports, module) {
    "use strict";
    var isSpace = require_utils().isSpace;
    module.exports = function heading(state, startLine, endLine, silent) {
      var ch, level, tmp, token, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      ch = state.src.charCodeAt(pos);
      if (ch !== 35 || pos >= max) {
        return false;
      }
      level = 1;
      ch = state.src.charCodeAt(++pos);
      while (ch === 35 && pos < max && level <= 6) {
        level++;
        ch = state.src.charCodeAt(++pos);
      }
      if (level > 6 || pos < max && !isSpace(ch)) {
        return false;
      }
      if (silent) {
        return true;
      }
      max = state.skipSpacesBack(max, pos);
      tmp = state.skipCharsBack(max, 35, pos);
      if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
        max = tmp;
      }
      state.line = startLine + 1;
      token = state.push("heading_open", "h" + String(level), 1);
      token.markup = "########".slice(0, level);
      token.map = [startLine, state.line];
      token = state.push("inline", "", 0);
      token.content = state.src.slice(pos, max).trim();
      token.map = [startLine, state.line];
      token.children = [];
      token = state.push("heading_close", "h" + String(level), -1);
      token.markup = "########".slice(0, level);
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/lheading.js
var require_lheading = __commonJS({
  "node_modules/markdown-it/lib/rules_block/lheading.js"(exports, module) {
    "use strict";
    module.exports = function lheading(state, startLine, endLine) {
      var content, terminate, i, l, token, pos, max, level, marker, nextLine = startLine + 1, oldParentType, terminatorRules = state.md.block.ruler.getRules("paragraph");
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      oldParentType = state.parentType;
      state.parentType = "paragraph";
      for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
        if (state.sCount[nextLine] - state.blkIndent > 3) {
          continue;
        }
        if (state.sCount[nextLine] >= state.blkIndent) {
          pos = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          if (pos < max) {
            marker = state.src.charCodeAt(pos);
            if (marker === 45 || marker === 61) {
              pos = state.skipChars(pos, marker);
              pos = state.skipSpaces(pos);
              if (pos >= max) {
                level = marker === 61 ? 1 : 2;
                break;
              }
            }
          }
        }
        if (state.sCount[nextLine] < 0) {
          continue;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
      }
      if (!level) {
        return false;
      }
      content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
      state.line = nextLine + 1;
      token = state.push("heading_open", "h" + String(level), 1);
      token.markup = String.fromCharCode(marker);
      token.map = [startLine, state.line];
      token = state.push("inline", "", 0);
      token.content = content;
      token.map = [startLine, state.line - 1];
      token.children = [];
      token = state.push("heading_close", "h" + String(level), -1);
      token.markup = String.fromCharCode(marker);
      state.parentType = oldParentType;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/paragraph.js
var require_paragraph = __commonJS({
  "node_modules/markdown-it/lib/rules_block/paragraph.js"(exports, module) {
    "use strict";
    module.exports = function paragraph(state, startLine, endLine) {
      var content, terminate, i, l, token, oldParentType, nextLine = startLine + 1, terminatorRules = state.md.block.ruler.getRules("paragraph");
      oldParentType = state.parentType;
      state.parentType = "paragraph";
      for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
        if (state.sCount[nextLine] - state.blkIndent > 3) {
          continue;
        }
        if (state.sCount[nextLine] < 0) {
          continue;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
      }
      content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
      state.line = nextLine;
      token = state.push("paragraph_open", "p", 1);
      token.map = [startLine, state.line];
      token = state.push("inline", "", 0);
      token.content = content;
      token.map = [startLine, state.line];
      token.children = [];
      token = state.push("paragraph_close", "p", -1);
      state.parentType = oldParentType;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_block/state_block.js
var require_state_block = __commonJS({
  "node_modules/markdown-it/lib/rules_block/state_block.js"(exports, module) {
    "use strict";
    var Token = require_token();
    var isSpace = require_utils().isSpace;
    function StateBlock(src, md, env, tokens) {
      var ch, s, start, pos, len, indent, offset, indent_found;
      this.src = src;
      this.md = md;
      this.env = env;
      this.tokens = tokens;
      this.bMarks = [];
      this.eMarks = [];
      this.tShift = [];
      this.sCount = [];
      this.bsCount = [];
      this.blkIndent = 0;
      this.line = 0;
      this.lineMax = 0;
      this.tight = false;
      this.ddIndent = -1;
      this.listIndent = -1;
      this.parentType = "root";
      this.level = 0;
      this.result = "";
      s = this.src;
      indent_found = false;
      for (start = pos = indent = offset = 0, len = s.length; pos < len; pos++) {
        ch = s.charCodeAt(pos);
        if (!indent_found) {
          if (isSpace(ch)) {
            indent++;
            if (ch === 9) {
              offset += 4 - offset % 4;
            } else {
              offset++;
            }
            continue;
          } else {
            indent_found = true;
          }
        }
        if (ch === 10 || pos === len - 1) {
          if (ch !== 10) {
            pos++;
          }
          this.bMarks.push(start);
          this.eMarks.push(pos);
          this.tShift.push(indent);
          this.sCount.push(offset);
          this.bsCount.push(0);
          indent_found = false;
          indent = 0;
          offset = 0;
          start = pos + 1;
        }
      }
      this.bMarks.push(s.length);
      this.eMarks.push(s.length);
      this.tShift.push(0);
      this.sCount.push(0);
      this.bsCount.push(0);
      this.lineMax = this.bMarks.length - 1;
    }
    StateBlock.prototype.push = function(type2, tag, nesting) {
      var token = new Token(type2, tag, nesting);
      token.block = true;
      if (nesting < 0) this.level--;
      token.level = this.level;
      if (nesting > 0) this.level++;
      this.tokens.push(token);
      return token;
    };
    StateBlock.prototype.isEmpty = function isEmpty(line) {
      return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
    };
    StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from2) {
      for (var max = this.lineMax; from2 < max; from2++) {
        if (this.bMarks[from2] + this.tShift[from2] < this.eMarks[from2]) {
          break;
        }
      }
      return from2;
    };
    StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
      var ch;
      for (var max = this.src.length; pos < max; pos++) {
        ch = this.src.charCodeAt(pos);
        if (!isSpace(ch)) {
          break;
        }
      }
      return pos;
    };
    StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
      if (pos <= min) {
        return pos;
      }
      while (pos > min) {
        if (!isSpace(this.src.charCodeAt(--pos))) {
          return pos + 1;
        }
      }
      return pos;
    };
    StateBlock.prototype.skipChars = function skipChars(pos, code) {
      for (var max = this.src.length; pos < max; pos++) {
        if (this.src.charCodeAt(pos) !== code) {
          break;
        }
      }
      return pos;
    };
    StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
      if (pos <= min) {
        return pos;
      }
      while (pos > min) {
        if (code !== this.src.charCodeAt(--pos)) {
          return pos + 1;
        }
      }
      return pos;
    };
    StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
      var i, lineIndent, ch, first, last, queue, lineStart, line = begin;
      if (begin >= end) {
        return "";
      }
      queue = new Array(end - begin);
      for (i = 0; line < end; line++, i++) {
        lineIndent = 0;
        lineStart = first = this.bMarks[line];
        if (line + 1 < end || keepLastLF) {
          last = this.eMarks[line] + 1;
        } else {
          last = this.eMarks[line];
        }
        while (first < last && lineIndent < indent) {
          ch = this.src.charCodeAt(first);
          if (isSpace(ch)) {
            if (ch === 9) {
              lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
            } else {
              lineIndent++;
            }
          } else if (first - lineStart < this.tShift[line]) {
            lineIndent++;
          } else {
            break;
          }
          first++;
        }
        if (lineIndent > indent) {
          queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
        } else {
          queue[i] = this.src.slice(first, last);
        }
      }
      return queue.join("");
    };
    StateBlock.prototype.Token = Token;
    module.exports = StateBlock;
  }
});

// node_modules/markdown-it/lib/parser_block.js
var require_parser_block = __commonJS({
  "node_modules/markdown-it/lib/parser_block.js"(exports, module) {
    "use strict";
    var Ruler = require_ruler();
    var _rules = [
      // First 2 params - rule name & source. Secondary array - list of rules,
      // which can be terminated by this one.
      ["table", require_table(), ["paragraph", "reference"]],
      ["code", require_code()],
      ["fence", require_fence(), ["paragraph", "reference", "blockquote", "list"]],
      ["blockquote", require_blockquote(), ["paragraph", "reference", "blockquote", "list"]],
      ["hr", require_hr(), ["paragraph", "reference", "blockquote", "list"]],
      ["list", require_list(), ["paragraph", "reference", "blockquote"]],
      ["reference", require_reference()],
      ["html_block", require_html_block(), ["paragraph", "reference", "blockquote"]],
      ["heading", require_heading(), ["paragraph", "reference", "blockquote"]],
      ["lheading", require_lheading()],
      ["paragraph", require_paragraph()]
    ];
    function ParserBlock() {
      this.ruler = new Ruler();
      for (var i = 0; i < _rules.length; i++) {
        this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
      }
    }
    ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
      var ok2, i, prevLine, rules = this.ruler.getRules(""), len = rules.length, line = startLine, hasEmptyLines = false, maxNesting = state.md.options.maxNesting;
      while (line < endLine) {
        state.line = line = state.skipEmptyLines(line);
        if (line >= endLine) {
          break;
        }
        if (state.sCount[line] < state.blkIndent) {
          break;
        }
        if (state.level >= maxNesting) {
          state.line = endLine;
          break;
        }
        prevLine = state.line;
        for (i = 0; i < len; i++) {
          ok2 = rules[i](state, line, endLine, false);
          if (ok2) {
            if (prevLine >= state.line) {
              throw new Error("block rule didn't increment state.line");
            }
            break;
          }
        }
        if (!ok2) throw new Error("none of the block rules matched");
        state.tight = !hasEmptyLines;
        if (state.isEmpty(state.line - 1)) {
          hasEmptyLines = true;
        }
        line = state.line;
        if (line < endLine && state.isEmpty(line)) {
          hasEmptyLines = true;
          line++;
          state.line = line;
        }
      }
    };
    ParserBlock.prototype.parse = function(src, md, env, outTokens) {
      var state;
      if (!src) {
        return;
      }
      state = new this.State(src, md, env, outTokens);
      this.tokenize(state, state.line, state.lineMax);
    };
    ParserBlock.prototype.State = require_state_block();
    module.exports = ParserBlock;
  }
});

// node_modules/markdown-it/lib/rules_inline/text.js
var require_text = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/text.js"(exports, module) {
    "use strict";
    function isTerminatorChar(ch) {
      switch (ch) {
        case 10:
        case 33:
        case 35:
        case 36:
        case 37:
        case 38:
        case 42:
        case 43:
        case 45:
        case 58:
        case 60:
        case 61:
        case 62:
        case 64:
        case 91:
        case 92:
        case 93:
        case 94:
        case 95:
        case 96:
        case 123:
        case 125:
        case 126:
          return true;
        default:
          return false;
      }
    }
    module.exports = function text(state, silent) {
      var pos = state.pos;
      while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
        pos++;
      }
      if (pos === state.pos) {
        return false;
      }
      if (!silent) {
        state.pending += state.src.slice(state.pos, pos);
      }
      state.pos = pos;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/linkify.js
var require_linkify2 = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/linkify.js"(exports, module) {
    "use strict";
    var SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
    module.exports = function linkify(state, silent) {
      var pos, max, match, proto, link, url, fullUrl, token;
      if (!state.md.options.linkify) return false;
      if (state.linkLevel > 0) return false;
      pos = state.pos;
      max = state.posMax;
      if (pos + 3 > max) return false;
      if (state.src.charCodeAt(pos) !== 58) return false;
      if (state.src.charCodeAt(pos + 1) !== 47) return false;
      if (state.src.charCodeAt(pos + 2) !== 47) return false;
      match = state.pending.match(SCHEME_RE);
      if (!match) return false;
      proto = match[1];
      link = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
      if (!link) return false;
      url = link.url;
      if (url.length <= proto.length) return false;
      url = url.replace(/\*+$/, "");
      fullUrl = state.md.normalizeLink(url);
      if (!state.md.validateLink(fullUrl)) return false;
      if (!silent) {
        state.pending = state.pending.slice(0, -proto.length);
        token = state.push("link_open", "a", 1);
        token.attrs = [["href", fullUrl]];
        token.markup = "linkify";
        token.info = "auto";
        token = state.push("text", "", 0);
        token.content = state.md.normalizeLinkText(url);
        token = state.push("link_close", "a", -1);
        token.markup = "linkify";
        token.info = "auto";
      }
      state.pos += url.length - proto.length;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/newline.js
var require_newline = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/newline.js"(exports, module) {
    "use strict";
    var isSpace = require_utils().isSpace;
    module.exports = function newline(state, silent) {
      var pmax, max, ws, pos = state.pos;
      if (state.src.charCodeAt(pos) !== 10) {
        return false;
      }
      pmax = state.pending.length - 1;
      max = state.posMax;
      if (!silent) {
        if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) {
          if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
            ws = pmax - 1;
            while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32) ws--;
            state.pending = state.pending.slice(0, ws);
            state.push("hardbreak", "br", 0);
          } else {
            state.pending = state.pending.slice(0, -1);
            state.push("softbreak", "br", 0);
          }
        } else {
          state.push("softbreak", "br", 0);
        }
      }
      pos++;
      while (pos < max && isSpace(state.src.charCodeAt(pos))) {
        pos++;
      }
      state.pos = pos;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/escape.js
var require_escape = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/escape.js"(exports, module) {
    "use strict";
    var isSpace = require_utils().isSpace;
    var ESCAPED = [];
    for (i = 0; i < 256; i++) {
      ESCAPED.push(0);
    }
    var i;
    "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
      ESCAPED[ch.charCodeAt(0)] = 1;
    });
    module.exports = function escape(state, silent) {
      var ch1, ch2, origStr, escapedStr, token, pos = state.pos, max = state.posMax;
      if (state.src.charCodeAt(pos) !== 92) return false;
      pos++;
      if (pos >= max) return false;
      ch1 = state.src.charCodeAt(pos);
      if (ch1 === 10) {
        if (!silent) {
          state.push("hardbreak", "br", 0);
        }
        pos++;
        while (pos < max) {
          ch1 = state.src.charCodeAt(pos);
          if (!isSpace(ch1)) break;
          pos++;
        }
        state.pos = pos;
        return true;
      }
      escapedStr = state.src[pos];
      if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
        ch2 = state.src.charCodeAt(pos + 1);
        if (ch2 >= 56320 && ch2 <= 57343) {
          escapedStr += state.src[pos + 1];
          pos++;
        }
      }
      origStr = "\\" + escapedStr;
      if (!silent) {
        token = state.push("text_special", "", 0);
        if (ch1 < 256 && ESCAPED[ch1] !== 0) {
          token.content = escapedStr;
        } else {
          token.content = origStr;
        }
        token.markup = origStr;
        token.info = "escape";
      }
      state.pos = pos + 1;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/backticks.js
var require_backticks = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/backticks.js"(exports, module) {
    "use strict";
    module.exports = function backtick(state, silent) {
      var start, max, marker, token, matchStart, matchEnd, openerLength, closerLength, pos = state.pos, ch = state.src.charCodeAt(pos);
      if (ch !== 96) {
        return false;
      }
      start = pos;
      pos++;
      max = state.posMax;
      while (pos < max && state.src.charCodeAt(pos) === 96) {
        pos++;
      }
      marker = state.src.slice(start, pos);
      openerLength = marker.length;
      if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
        if (!silent) state.pending += marker;
        state.pos += openerLength;
        return true;
      }
      matchEnd = pos;
      while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
        matchEnd = matchStart + 1;
        while (matchEnd < max && state.src.charCodeAt(matchEnd) === 96) {
          matchEnd++;
        }
        closerLength = matchEnd - matchStart;
        if (closerLength === openerLength) {
          if (!silent) {
            token = state.push("code_inline", "code", 0);
            token.markup = marker;
            token.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
          }
          state.pos = matchEnd;
          return true;
        }
        state.backticks[closerLength] = matchStart;
      }
      state.backticksScanned = true;
      if (!silent) state.pending += marker;
      state.pos += openerLength;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/strikethrough.js
var require_strikethrough = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/strikethrough.js"(exports, module) {
    "use strict";
    module.exports.tokenize = function strikethrough(state, silent) {
      var i, scanned, token, len, ch, start = state.pos, marker = state.src.charCodeAt(start);
      if (silent) {
        return false;
      }
      if (marker !== 126) {
        return false;
      }
      scanned = state.scanDelims(state.pos, true);
      len = scanned.length;
      ch = String.fromCharCode(marker);
      if (len < 2) {
        return false;
      }
      if (len % 2) {
        token = state.push("text", "", 0);
        token.content = ch;
        len--;
      }
      for (i = 0; i < len; i += 2) {
        token = state.push("text", "", 0);
        token.content = ch + ch;
        state.delimiters.push({
          marker,
          length: 0,
          // disable "rule of 3" length checks meant for emphasis
          token: state.tokens.length - 1,
          end: -1,
          open: scanned.can_open,
          close: scanned.can_close
        });
      }
      state.pos += scanned.length;
      return true;
    };
    function postProcess(state, delimiters) {
      var i, j, startDelim, endDelim, token, loneMarkers = [], max = delimiters.length;
      for (i = 0; i < max; i++) {
        startDelim = delimiters[i];
        if (startDelim.marker !== 126) {
          continue;
        }
        if (startDelim.end === -1) {
          continue;
        }
        endDelim = delimiters[startDelim.end];
        token = state.tokens[startDelim.token];
        token.type = "s_open";
        token.tag = "s";
        token.nesting = 1;
        token.markup = "~~";
        token.content = "";
        token = state.tokens[endDelim.token];
        token.type = "s_close";
        token.tag = "s";
        token.nesting = -1;
        token.markup = "~~";
        token.content = "";
        if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") {
          loneMarkers.push(endDelim.token - 1);
        }
      }
      while (loneMarkers.length) {
        i = loneMarkers.pop();
        j = i + 1;
        while (j < state.tokens.length && state.tokens[j].type === "s_close") {
          j++;
        }
        j--;
        if (i !== j) {
          token = state.tokens[j];
          state.tokens[j] = state.tokens[i];
          state.tokens[i] = token;
        }
      }
    }
    module.exports.postProcess = function strikethrough(state) {
      var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
      postProcess(state, state.delimiters);
      for (curr = 0; curr < max; curr++) {
        if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
          postProcess(state, tokens_meta[curr].delimiters);
        }
      }
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/emphasis.js
var require_emphasis = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/emphasis.js"(exports, module) {
    "use strict";
    module.exports.tokenize = function emphasis(state, silent) {
      var i, scanned, token, start = state.pos, marker = state.src.charCodeAt(start);
      if (silent) {
        return false;
      }
      if (marker !== 95 && marker !== 42) {
        return false;
      }
      scanned = state.scanDelims(state.pos, marker === 42);
      for (i = 0; i < scanned.length; i++) {
        token = state.push("text", "", 0);
        token.content = String.fromCharCode(marker);
        state.delimiters.push({
          // Char code of the starting marker (number).
          //
          marker,
          // Total length of these series of delimiters.
          //
          length: scanned.length,
          // A position of the token this delimiter corresponds to.
          //
          token: state.tokens.length - 1,
          // If this delimiter is matched as a valid opener, `end` will be
          // equal to its position, otherwise it's `-1`.
          //
          end: -1,
          // Boolean flags that determine if this delimiter could open or close
          // an emphasis.
          //
          open: scanned.can_open,
          close: scanned.can_close
        });
      }
      state.pos += scanned.length;
      return true;
    };
    function postProcess(state, delimiters) {
      var i, startDelim, endDelim, token, ch, isStrong, max = delimiters.length;
      for (i = max - 1; i >= 0; i--) {
        startDelim = delimiters[i];
        if (startDelim.marker !== 95 && startDelim.marker !== 42) {
          continue;
        }
        if (startDelim.end === -1) {
          continue;
        }
        endDelim = delimiters[startDelim.end];
        isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && // check that first two markers match and adjacent
        delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
        delimiters[startDelim.end + 1].token === endDelim.token + 1;
        ch = String.fromCharCode(startDelim.marker);
        token = state.tokens[startDelim.token];
        token.type = isStrong ? "strong_open" : "em_open";
        token.tag = isStrong ? "strong" : "em";
        token.nesting = 1;
        token.markup = isStrong ? ch + ch : ch;
        token.content = "";
        token = state.tokens[endDelim.token];
        token.type = isStrong ? "strong_close" : "em_close";
        token.tag = isStrong ? "strong" : "em";
        token.nesting = -1;
        token.markup = isStrong ? ch + ch : ch;
        token.content = "";
        if (isStrong) {
          state.tokens[delimiters[i - 1].token].content = "";
          state.tokens[delimiters[startDelim.end + 1].token].content = "";
          i--;
        }
      }
    }
    module.exports.postProcess = function emphasis(state) {
      var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
      postProcess(state, state.delimiters);
      for (curr = 0; curr < max; curr++) {
        if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
          postProcess(state, tokens_meta[curr].delimiters);
        }
      }
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/link.js
var require_link = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/link.js"(exports, module) {
    "use strict";
    var normalizeReference = require_utils().normalizeReference;
    var isSpace = require_utils().isSpace;
    module.exports = function link(state, silent) {
      var attrs, code, label, labelEnd, labelStart, pos, res, ref, token, href = "", title = "", oldPos = state.pos, max = state.posMax, start = state.pos, parseReference = true;
      if (state.src.charCodeAt(state.pos) !== 91) {
        return false;
      }
      labelStart = state.pos + 1;
      labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
      if (labelEnd < 0) {
        return false;
      }
      pos = labelEnd + 1;
      if (pos < max && state.src.charCodeAt(pos) === 40) {
        parseReference = false;
        pos++;
        for (; pos < max; pos++) {
          code = state.src.charCodeAt(pos);
          if (!isSpace(code) && code !== 10) {
            break;
          }
        }
        if (pos >= max) {
          return false;
        }
        start = pos;
        res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
        if (res.ok) {
          href = state.md.normalizeLink(res.str);
          if (state.md.validateLink(href)) {
            pos = res.pos;
          } else {
            href = "";
          }
          start = pos;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 10) {
              break;
            }
          }
          res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
          if (pos < max && start !== pos && res.ok) {
            title = res.str;
            pos = res.pos;
            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);
              if (!isSpace(code) && code !== 10) {
                break;
              }
            }
          }
        }
        if (pos >= max || state.src.charCodeAt(pos) !== 41) {
          parseReference = true;
        }
        pos++;
      }
      if (parseReference) {
        if (typeof state.env.references === "undefined") {
          return false;
        }
        if (pos < max && state.src.charCodeAt(pos) === 91) {
          start = pos + 1;
          pos = state.md.helpers.parseLinkLabel(state, pos);
          if (pos >= 0) {
            label = state.src.slice(start, pos++);
          } else {
            pos = labelEnd + 1;
          }
        } else {
          pos = labelEnd + 1;
        }
        if (!label) {
          label = state.src.slice(labelStart, labelEnd);
        }
        ref = state.env.references[normalizeReference(label)];
        if (!ref) {
          state.pos = oldPos;
          return false;
        }
        href = ref.href;
        title = ref.title;
      }
      if (!silent) {
        state.pos = labelStart;
        state.posMax = labelEnd;
        token = state.push("link_open", "a", 1);
        token.attrs = attrs = [["href", href]];
        if (title) {
          attrs.push(["title", title]);
        }
        state.linkLevel++;
        state.md.inline.tokenize(state);
        state.linkLevel--;
        token = state.push("link_close", "a", -1);
      }
      state.pos = pos;
      state.posMax = max;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/image.js
var require_image = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/image.js"(exports, module) {
    "use strict";
    var normalizeReference = require_utils().normalizeReference;
    var isSpace = require_utils().isSpace;
    module.exports = function image(state, silent) {
      var attrs, code, content, label, labelEnd, labelStart, pos, ref, res, title, token, tokens, start, href = "", oldPos = state.pos, max = state.posMax;
      if (state.src.charCodeAt(state.pos) !== 33) {
        return false;
      }
      if (state.src.charCodeAt(state.pos + 1) !== 91) {
        return false;
      }
      labelStart = state.pos + 2;
      labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
      if (labelEnd < 0) {
        return false;
      }
      pos = labelEnd + 1;
      if (pos < max && state.src.charCodeAt(pos) === 40) {
        pos++;
        for (; pos < max; pos++) {
          code = state.src.charCodeAt(pos);
          if (!isSpace(code) && code !== 10) {
            break;
          }
        }
        if (pos >= max) {
          return false;
        }
        start = pos;
        res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
        if (res.ok) {
          href = state.md.normalizeLink(res.str);
          if (state.md.validateLink(href)) {
            pos = res.pos;
          } else {
            href = "";
          }
        }
        start = pos;
        for (; pos < max; pos++) {
          code = state.src.charCodeAt(pos);
          if (!isSpace(code) && code !== 10) {
            break;
          }
        }
        res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
        if (pos < max && start !== pos && res.ok) {
          title = res.str;
          pos = res.pos;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 10) {
              break;
            }
          }
        } else {
          title = "";
        }
        if (pos >= max || state.src.charCodeAt(pos) !== 41) {
          state.pos = oldPos;
          return false;
        }
        pos++;
      } else {
        if (typeof state.env.references === "undefined") {
          return false;
        }
        if (pos < max && state.src.charCodeAt(pos) === 91) {
          start = pos + 1;
          pos = state.md.helpers.parseLinkLabel(state, pos);
          if (pos >= 0) {
            label = state.src.slice(start, pos++);
          } else {
            pos = labelEnd + 1;
          }
        } else {
          pos = labelEnd + 1;
        }
        if (!label) {
          label = state.src.slice(labelStart, labelEnd);
        }
        ref = state.env.references[normalizeReference(label)];
        if (!ref) {
          state.pos = oldPos;
          return false;
        }
        href = ref.href;
        title = ref.title;
      }
      if (!silent) {
        content = state.src.slice(labelStart, labelEnd);
        state.md.inline.parse(
          content,
          state.md,
          state.env,
          tokens = []
        );
        token = state.push("image", "img", 0);
        token.attrs = attrs = [["src", href], ["alt", ""]];
        token.children = tokens;
        token.content = content;
        if (title) {
          attrs.push(["title", title]);
        }
      }
      state.pos = pos;
      state.posMax = max;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/autolink.js
var require_autolink = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/autolink.js"(exports, module) {
    "use strict";
    var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
    var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/;
    module.exports = function autolink(state, silent) {
      var url, fullUrl, token, ch, start, max, pos = state.pos;
      if (state.src.charCodeAt(pos) !== 60) {
        return false;
      }
      start = state.pos;
      max = state.posMax;
      for (; ; ) {
        if (++pos >= max) return false;
        ch = state.src.charCodeAt(pos);
        if (ch === 60) return false;
        if (ch === 62) break;
      }
      url = state.src.slice(start + 1, pos);
      if (AUTOLINK_RE.test(url)) {
        fullUrl = state.md.normalizeLink(url);
        if (!state.md.validateLink(fullUrl)) {
          return false;
        }
        if (!silent) {
          token = state.push("link_open", "a", 1);
          token.attrs = [["href", fullUrl]];
          token.markup = "autolink";
          token.info = "auto";
          token = state.push("text", "", 0);
          token.content = state.md.normalizeLinkText(url);
          token = state.push("link_close", "a", -1);
          token.markup = "autolink";
          token.info = "auto";
        }
        state.pos += url.length + 2;
        return true;
      }
      if (EMAIL_RE.test(url)) {
        fullUrl = state.md.normalizeLink("mailto:" + url);
        if (!state.md.validateLink(fullUrl)) {
          return false;
        }
        if (!silent) {
          token = state.push("link_open", "a", 1);
          token.attrs = [["href", fullUrl]];
          token.markup = "autolink";
          token.info = "auto";
          token = state.push("text", "", 0);
          token.content = state.md.normalizeLinkText(url);
          token = state.push("link_close", "a", -1);
          token.markup = "autolink";
          token.info = "auto";
        }
        state.pos += url.length + 2;
        return true;
      }
      return false;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/html_inline.js
var require_html_inline = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/html_inline.js"(exports, module) {
    "use strict";
    var HTML_TAG_RE = require_html_re().HTML_TAG_RE;
    function isLinkOpen(str2) {
      return /^<a[>\s]/i.test(str2);
    }
    function isLinkClose(str2) {
      return /^<\/a\s*>/i.test(str2);
    }
    function isLetter(ch) {
      var lc = ch | 32;
      return lc >= 97 && lc <= 122;
    }
    module.exports = function html_inline(state, silent) {
      var ch, match, max, token, pos = state.pos;
      if (!state.md.options.html) {
        return false;
      }
      max = state.posMax;
      if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) {
        return false;
      }
      ch = state.src.charCodeAt(pos + 1);
      if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) {
        return false;
      }
      match = state.src.slice(pos).match(HTML_TAG_RE);
      if (!match) {
        return false;
      }
      if (!silent) {
        token = state.push("html_inline", "", 0);
        token.content = match[0];
        if (isLinkOpen(token.content)) state.linkLevel++;
        if (isLinkClose(token.content)) state.linkLevel--;
      }
      state.pos += match[0].length;
      return true;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/entity.js
var require_entity = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/entity.js"(exports, module) {
    "use strict";
    var entities = require_entities2();
    var has2 = require_utils().has;
    var isValidEntityCode = require_utils().isValidEntityCode;
    var fromCodePoint = require_utils().fromCodePoint;
    var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
    var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
    module.exports = function entity(state, silent) {
      var ch, code, match, token, pos = state.pos, max = state.posMax;
      if (state.src.charCodeAt(pos) !== 38) return false;
      if (pos + 1 >= max) return false;
      ch = state.src.charCodeAt(pos + 1);
      if (ch === 35) {
        match = state.src.slice(pos).match(DIGITAL_RE);
        if (match) {
          if (!silent) {
            code = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
            token = state.push("text_special", "", 0);
            token.content = isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(65533);
            token.markup = match[0];
            token.info = "entity";
          }
          state.pos += match[0].length;
          return true;
        }
      } else {
        match = state.src.slice(pos).match(NAMED_RE);
        if (match) {
          if (has2(entities, match[1])) {
            if (!silent) {
              token = state.push("text_special", "", 0);
              token.content = entities[match[1]];
              token.markup = match[0];
              token.info = "entity";
            }
            state.pos += match[0].length;
            return true;
          }
        }
      }
      return false;
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/balance_pairs.js
var require_balance_pairs = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/balance_pairs.js"(exports, module) {
    "use strict";
    function processDelimiters(delimiters) {
      var closerIdx, openerIdx, closer, opener, minOpenerIdx, newMinOpenerIdx, isOddMatch, lastJump, openersBottom = {}, max = delimiters.length;
      if (!max) return;
      var headerIdx = 0;
      var lastTokenIdx = -2;
      var jumps = [];
      for (closerIdx = 0; closerIdx < max; closerIdx++) {
        closer = delimiters[closerIdx];
        jumps.push(0);
        if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) {
          headerIdx = closerIdx;
        }
        lastTokenIdx = closer.token;
        closer.length = closer.length || 0;
        if (!closer.close) continue;
        if (!openersBottom.hasOwnProperty(closer.marker)) {
          openersBottom[closer.marker] = [-1, -1, -1, -1, -1, -1];
        }
        minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
        openerIdx = headerIdx - jumps[headerIdx] - 1;
        newMinOpenerIdx = openerIdx;
        for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
          opener = delimiters[openerIdx];
          if (opener.marker !== closer.marker) continue;
          if (opener.open && opener.end < 0) {
            isOddMatch = false;
            if (opener.close || closer.open) {
              if ((opener.length + closer.length) % 3 === 0) {
                if (opener.length % 3 !== 0 || closer.length % 3 !== 0) {
                  isOddMatch = true;
                }
              }
            }
            if (!isOddMatch) {
              lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
              jumps[closerIdx] = closerIdx - openerIdx + lastJump;
              jumps[openerIdx] = lastJump;
              closer.open = false;
              opener.end = closerIdx;
              opener.close = false;
              newMinOpenerIdx = -1;
              lastTokenIdx = -2;
              break;
            }
          }
        }
        if (newMinOpenerIdx !== -1) {
          openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
        }
      }
    }
    module.exports = function link_pairs(state) {
      var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
      processDelimiters(state.delimiters);
      for (curr = 0; curr < max; curr++) {
        if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
          processDelimiters(tokens_meta[curr].delimiters);
        }
      }
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/fragments_join.js
var require_fragments_join = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/fragments_join.js"(exports, module) {
    "use strict";
    module.exports = function fragments_join(state) {
      var curr, last, level = 0, tokens = state.tokens, max = state.tokens.length;
      for (curr = last = 0; curr < max; curr++) {
        if (tokens[curr].nesting < 0) level--;
        tokens[curr].level = level;
        if (tokens[curr].nesting > 0) level++;
        if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
          tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
        } else {
          if (curr !== last) {
            tokens[last] = tokens[curr];
          }
          last++;
        }
      }
      if (curr !== last) {
        tokens.length = last;
      }
    };
  }
});

// node_modules/markdown-it/lib/rules_inline/state_inline.js
var require_state_inline = __commonJS({
  "node_modules/markdown-it/lib/rules_inline/state_inline.js"(exports, module) {
    "use strict";
    var Token = require_token();
    var isWhiteSpace = require_utils().isWhiteSpace;
    var isPunctChar = require_utils().isPunctChar;
    var isMdAsciiPunct = require_utils().isMdAsciiPunct;
    function StateInline(src, md, env, outTokens) {
      this.src = src;
      this.env = env;
      this.md = md;
      this.tokens = outTokens;
      this.tokens_meta = Array(outTokens.length);
      this.pos = 0;
      this.posMax = this.src.length;
      this.level = 0;
      this.pending = "";
      this.pendingLevel = 0;
      this.cache = {};
      this.delimiters = [];
      this._prev_delimiters = [];
      this.backticks = {};
      this.backticksScanned = false;
      this.linkLevel = 0;
    }
    StateInline.prototype.pushPending = function() {
      var token = new Token("text", "", 0);
      token.content = this.pending;
      token.level = this.pendingLevel;
      this.tokens.push(token);
      this.pending = "";
      return token;
    };
    StateInline.prototype.push = function(type2, tag, nesting) {
      if (this.pending) {
        this.pushPending();
      }
      var token = new Token(type2, tag, nesting);
      var token_meta = null;
      if (nesting < 0) {
        this.level--;
        this.delimiters = this._prev_delimiters.pop();
      }
      token.level = this.level;
      if (nesting > 0) {
        this.level++;
        this._prev_delimiters.push(this.delimiters);
        this.delimiters = [];
        token_meta = { delimiters: this.delimiters };
      }
      this.pendingLevel = this.level;
      this.tokens.push(token);
      this.tokens_meta.push(token_meta);
      return token;
    };
    StateInline.prototype.scanDelims = function(start, canSplitWord) {
      var pos = start, lastChar, nextChar, count2, can_open, can_close, isLastWhiteSpace, isLastPunctChar, isNextWhiteSpace, isNextPunctChar, left_flanking = true, right_flanking = true, max = this.posMax, marker = this.src.charCodeAt(start);
      lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 32;
      while (pos < max && this.src.charCodeAt(pos) === marker) {
        pos++;
      }
      count2 = pos - start;
      nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
      isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
      isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
      isLastWhiteSpace = isWhiteSpace(lastChar);
      isNextWhiteSpace = isWhiteSpace(nextChar);
      if (isNextWhiteSpace) {
        left_flanking = false;
      } else if (isNextPunctChar) {
        if (!(isLastWhiteSpace || isLastPunctChar)) {
          left_flanking = false;
        }
      }
      if (isLastWhiteSpace) {
        right_flanking = false;
      } else if (isLastPunctChar) {
        if (!(isNextWhiteSpace || isNextPunctChar)) {
          right_flanking = false;
        }
      }
      if (!canSplitWord) {
        can_open = left_flanking && (!right_flanking || isLastPunctChar);
        can_close = right_flanking && (!left_flanking || isNextPunctChar);
      } else {
        can_open = left_flanking;
        can_close = right_flanking;
      }
      return {
        can_open,
        can_close,
        length: count2
      };
    };
    StateInline.prototype.Token = Token;
    module.exports = StateInline;
  }
});

// node_modules/markdown-it/lib/parser_inline.js
var require_parser_inline = __commonJS({
  "node_modules/markdown-it/lib/parser_inline.js"(exports, module) {
    "use strict";
    var Ruler = require_ruler();
    var _rules = [
      ["text", require_text()],
      ["linkify", require_linkify2()],
      ["newline", require_newline()],
      ["escape", require_escape()],
      ["backticks", require_backticks()],
      ["strikethrough", require_strikethrough().tokenize],
      ["emphasis", require_emphasis().tokenize],
      ["link", require_link()],
      ["image", require_image()],
      ["autolink", require_autolink()],
      ["html_inline", require_html_inline()],
      ["entity", require_entity()]
    ];
    var _rules2 = [
      ["balance_pairs", require_balance_pairs()],
      ["strikethrough", require_strikethrough().postProcess],
      ["emphasis", require_emphasis().postProcess],
      // rules for pairs separate '**' into its own text tokens, which may be left unused,
      // rule below merges unused segments back with the rest of the text
      ["fragments_join", require_fragments_join()]
    ];
    function ParserInline() {
      var i;
      this.ruler = new Ruler();
      for (i = 0; i < _rules.length; i++) {
        this.ruler.push(_rules[i][0], _rules[i][1]);
      }
      this.ruler2 = new Ruler();
      for (i = 0; i < _rules2.length; i++) {
        this.ruler2.push(_rules2[i][0], _rules2[i][1]);
      }
    }
    ParserInline.prototype.skipToken = function(state) {
      var ok2, i, pos = state.pos, rules = this.ruler.getRules(""), len = rules.length, maxNesting = state.md.options.maxNesting, cache = state.cache;
      if (typeof cache[pos] !== "undefined") {
        state.pos = cache[pos];
        return;
      }
      if (state.level < maxNesting) {
        for (i = 0; i < len; i++) {
          state.level++;
          ok2 = rules[i](state, true);
          state.level--;
          if (ok2) {
            if (pos >= state.pos) {
              throw new Error("inline rule didn't increment state.pos");
            }
            break;
          }
        }
      } else {
        state.pos = state.posMax;
      }
      if (!ok2) {
        state.pos++;
      }
      cache[pos] = state.pos;
    };
    ParserInline.prototype.tokenize = function(state) {
      var ok2, i, prevPos, rules = this.ruler.getRules(""), len = rules.length, end = state.posMax, maxNesting = state.md.options.maxNesting;
      while (state.pos < end) {
        prevPos = state.pos;
        if (state.level < maxNesting) {
          for (i = 0; i < len; i++) {
            ok2 = rules[i](state, false);
            if (ok2) {
              if (prevPos >= state.pos) {
                throw new Error("inline rule didn't increment state.pos");
              }
              break;
            }
          }
        }
        if (ok2) {
          if (state.pos >= end) {
            break;
          }
          continue;
        }
        state.pending += state.src[state.pos++];
      }
      if (state.pending) {
        state.pushPending();
      }
    };
    ParserInline.prototype.parse = function(str2, md, env, outTokens) {
      var i, rules, len;
      var state = new this.State(str2, md, env, outTokens);
      this.tokenize(state);
      rules = this.ruler2.getRules("");
      len = rules.length;
      for (i = 0; i < len; i++) {
        rules[i](state);
      }
    };
    ParserInline.prototype.State = require_state_inline();
    module.exports = ParserInline;
  }
});

// node_modules/linkify-it/lib/re.js
var require_re = __commonJS({
  "node_modules/linkify-it/lib/re.js"(exports, module) {
    "use strict";
    module.exports = function(opts) {
      var re = {};
      opts = opts || {};
      re.src_Any = require_regex2().source;
      re.src_Cc = require_regex3().source;
      re.src_Z = require_regex5().source;
      re.src_P = require_regex().source;
      re.src_ZPCc = [re.src_Z, re.src_P, re.src_Cc].join("|");
      re.src_ZCc = [re.src_Z, re.src_Cc].join("|");
      var text_separators = "[><\uFF5C]";
      re.src_pseudo_letter = "(?:(?!" + text_separators + "|" + re.src_ZPCc + ")" + re.src_Any + ")";
      re.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
      re.src_auth = "(?:(?:(?!" + re.src_ZCc + "|[@/\\[\\]()]).)+@)?";
      re.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
      re.src_host_terminator = "(?=$|" + text_separators + "|" + re.src_ZPCc + ")(?!" + (opts["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + re.src_ZPCc + "))";
      re.src_path = "(?:[/?#](?:(?!" + re.src_ZCc + "|" + text_separators + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + re.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + re.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + re.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + re.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + re.src_ZCc + "|[']).)+\\'|\\'(?=" + re.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + re.src_ZCc + "|[.]|$)|" + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + ",(?!" + re.src_ZCc + "|$)|;(?!" + re.src_ZCc + "|$)|\\!+(?!" + re.src_ZCc + "|[!]|$)|\\?(?!" + re.src_ZCc + "|[?]|$))+|\\/)?";
      re.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
      re.src_xn = "xn--[a-z0-9\\-]{1,59}";
      re.src_domain_root = // Allow letters & digits (http://test1)
      "(?:" + re.src_xn + "|" + re.src_pseudo_letter + "{1,63})";
      re.src_domain = "(?:" + re.src_xn + "|(?:" + re.src_pseudo_letter + ")|(?:" + re.src_pseudo_letter + "(?:-|" + re.src_pseudo_letter + "){0,61}" + re.src_pseudo_letter + "))";
      re.src_host = "(?:(?:(?:(?:" + re.src_domain + ")\\.)*" + re.src_domain + "))";
      re.tpl_host_fuzzy = "(?:" + re.src_ip4 + "|(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%)))";
      re.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%))";
      re.src_host_strict = re.src_host + re.src_host_terminator;
      re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
      re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
      re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
      re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
      re.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + re.src_ZPCc + "|>|$))";
      re.tpl_email_fuzzy = "(^|" + text_separators + '|"|\\(|' + re.src_ZCc + ")(" + re.src_email_name + "@" + re.tpl_host_fuzzy_strict + ")";
      re.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + "))((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_fuzzy_strict + re.src_path + ")";
      re.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + "))((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ")";
      return re;
    };
  }
});

// node_modules/linkify-it/index.js
var require_linkify_it = __commonJS({
  "node_modules/linkify-it/index.js"(exports, module) {
    "use strict";
    function assign(obj) {
      var sources = Array.prototype.slice.call(arguments, 1);
      sources.forEach(function(source) {
        if (!source) {
          return;
        }
        Object.keys(source).forEach(function(key) {
          obj[key] = source[key];
        });
      });
      return obj;
    }
    function _class2(obj) {
      return Object.prototype.toString.call(obj);
    }
    function isString(obj) {
      return _class2(obj) === "[object String]";
    }
    function isObject2(obj) {
      return _class2(obj) === "[object Object]";
    }
    function isRegExp(obj) {
      return _class2(obj) === "[object RegExp]";
    }
    function isFunction(obj) {
      return _class2(obj) === "[object Function]";
    }
    function escapeRE(str2) {
      return str2.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
    }
    var defaultOptions3 = {
      fuzzyLink: true,
      fuzzyEmail: true,
      fuzzyIP: false
    };
    function isOptionsObj(obj) {
      return Object.keys(obj || {}).reduce(function(acc, k) {
        return acc || defaultOptions3.hasOwnProperty(k);
      }, false);
    }
    var defaultSchemas = {
      "http:": {
        validate: function(text, pos, self2) {
          var tail = text.slice(pos);
          if (!self2.re.http) {
            self2.re.http = new RegExp(
              "^\\/\\/" + self2.re.src_auth + self2.re.src_host_port_strict + self2.re.src_path,
              "i"
            );
          }
          if (self2.re.http.test(tail)) {
            return tail.match(self2.re.http)[0].length;
          }
          return 0;
        }
      },
      "https:": "http:",
      "ftp:": "http:",
      "//": {
        validate: function(text, pos, self2) {
          var tail = text.slice(pos);
          if (!self2.re.no_http) {
            self2.re.no_http = new RegExp(
              "^" + self2.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
              // with code comments
              "(?:localhost|(?:(?:" + self2.re.src_domain + ")\\.)+" + self2.re.src_domain_root + ")" + self2.re.src_port + self2.re.src_host_terminator + self2.re.src_path,
              "i"
            );
          }
          if (self2.re.no_http.test(tail)) {
            if (pos >= 3 && text[pos - 3] === ":") {
              return 0;
            }
            if (pos >= 3 && text[pos - 3] === "/") {
              return 0;
            }
            return tail.match(self2.re.no_http)[0].length;
          }
          return 0;
        }
      },
      "mailto:": {
        validate: function(text, pos, self2) {
          var tail = text.slice(pos);
          if (!self2.re.mailto) {
            self2.re.mailto = new RegExp(
              "^" + self2.re.src_email_name + "@" + self2.re.src_host_strict,
              "i"
            );
          }
          if (self2.re.mailto.test(tail)) {
            return tail.match(self2.re.mailto)[0].length;
          }
          return 0;
        }
      }
    };
    var tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
    var tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|\u0440\u0444".split("|");
    function resetScanCache(self2) {
      self2.__index__ = -1;
      self2.__text_cache__ = "";
    }
    function createValidator(re) {
      return function(text, pos) {
        var tail = text.slice(pos);
        if (re.test(tail)) {
          return tail.match(re)[0].length;
        }
        return 0;
      };
    }
    function createNormalizer() {
      return function(match, self2) {
        self2.normalize(match);
      };
    }
    function compile2(self2) {
      var re = self2.re = require_re()(self2.__opts__);
      var tlds2 = self2.__tlds__.slice();
      self2.onCompile();
      if (!self2.__tlds_replaced__) {
        tlds2.push(tlds_2ch_src_re);
      }
      tlds2.push(re.src_xn);
      re.src_tlds = tlds2.join("|");
      function untpl(tpl) {
        return tpl.replace("%TLDS%", re.src_tlds);
      }
      re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), "i");
      re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), "i");
      re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "i");
      re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), "i");
      var aliases = [];
      self2.__compiled__ = {};
      function schemaError(name2, val) {
        throw new Error('(LinkifyIt) Invalid schema "' + name2 + '": ' + val);
      }
      Object.keys(self2.__schemas__).forEach(function(name2) {
        var val = self2.__schemas__[name2];
        if (val === null) {
          return;
        }
        var compiled = { validate: null, link: null };
        self2.__compiled__[name2] = compiled;
        if (isObject2(val)) {
          if (isRegExp(val.validate)) {
            compiled.validate = createValidator(val.validate);
          } else if (isFunction(val.validate)) {
            compiled.validate = val.validate;
          } else {
            schemaError(name2, val);
          }
          if (isFunction(val.normalize)) {
            compiled.normalize = val.normalize;
          } else if (!val.normalize) {
            compiled.normalize = createNormalizer();
          } else {
            schemaError(name2, val);
          }
          return;
        }
        if (isString(val)) {
          aliases.push(name2);
          return;
        }
        schemaError(name2, val);
      });
      aliases.forEach(function(alias) {
        if (!self2.__compiled__[self2.__schemas__[alias]]) {
          return;
        }
        self2.__compiled__[alias].validate = self2.__compiled__[self2.__schemas__[alias]].validate;
        self2.__compiled__[alias].normalize = self2.__compiled__[self2.__schemas__[alias]].normalize;
      });
      self2.__compiled__[""] = { validate: null, normalize: createNormalizer() };
      var slist = Object.keys(self2.__compiled__).filter(function(name2) {
        return name2.length > 0 && self2.__compiled__[name2];
      }).map(escapeRE).join("|");
      self2.re.schema_test = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + "))(" + slist + ")", "i");
      self2.re.schema_search = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + "))(" + slist + ")", "ig");
      self2.re.schema_at_start = RegExp("^" + self2.re.schema_search.source, "i");
      self2.re.pretest = RegExp(
        "(" + self2.re.schema_test.source + ")|(" + self2.re.host_fuzzy_test.source + ")|@",
        "i"
      );
      resetScanCache(self2);
    }
    function Match(self2, shift) {
      var start = self2.__index__, end = self2.__last_index__, text = self2.__text_cache__.slice(start, end);
      this.schema = self2.__schema__.toLowerCase();
      this.index = start + shift;
      this.lastIndex = end + shift;
      this.raw = text;
      this.text = text;
      this.url = text;
    }
    function createMatch(self2, shift) {
      var match = new Match(self2, shift);
      self2.__compiled__[match.schema].normalize(match, self2);
      return match;
    }
    function LinkifyIt(schemas, options) {
      if (!(this instanceof LinkifyIt)) {
        return new LinkifyIt(schemas, options);
      }
      if (!options) {
        if (isOptionsObj(schemas)) {
          options = schemas;
          schemas = {};
        }
      }
      this.__opts__ = assign({}, defaultOptions3, options);
      this.__index__ = -1;
      this.__last_index__ = -1;
      this.__schema__ = "";
      this.__text_cache__ = "";
      this.__schemas__ = assign({}, defaultSchemas, schemas);
      this.__compiled__ = {};
      this.__tlds__ = tlds_default;
      this.__tlds_replaced__ = false;
      this.re = {};
      compile2(this);
    }
    LinkifyIt.prototype.add = function add2(schema2, definition) {
      this.__schemas__[schema2] = definition;
      compile2(this);
      return this;
    };
    LinkifyIt.prototype.set = function set2(options) {
      this.__opts__ = assign(this.__opts__, options);
      return this;
    };
    LinkifyIt.prototype.test = function test2(text) {
      this.__text_cache__ = text;
      this.__index__ = -1;
      if (!text.length) {
        return false;
      }
      var m, ml, me, len, shift, next, re, tld_pos, at_pos;
      if (this.re.schema_test.test(text)) {
        re = this.re.schema_search;
        re.lastIndex = 0;
        while ((m = re.exec(text)) !== null) {
          len = this.testSchemaAt(text, m[2], re.lastIndex);
          if (len) {
            this.__schema__ = m[2];
            this.__index__ = m.index + m[1].length;
            this.__last_index__ = m.index + m[0].length + len;
            break;
          }
        }
      }
      if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
        tld_pos = text.search(this.re.host_fuzzy_test);
        if (tld_pos >= 0) {
          if (this.__index__ < 0 || tld_pos < this.__index__) {
            if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
              shift = ml.index + ml[1].length;
              if (this.__index__ < 0 || shift < this.__index__) {
                this.__schema__ = "";
                this.__index__ = shift;
                this.__last_index__ = ml.index + ml[0].length;
              }
            }
          }
        }
      }
      if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
        at_pos = text.indexOf("@");
        if (at_pos >= 0) {
          if ((me = text.match(this.re.email_fuzzy)) !== null) {
            shift = me.index + me[1].length;
            next = me.index + me[0].length;
            if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
              this.__schema__ = "mailto:";
              this.__index__ = shift;
              this.__last_index__ = next;
            }
          }
        }
      }
      return this.__index__ >= 0;
    };
    LinkifyIt.prototype.pretest = function pretest(text) {
      return this.re.pretest.test(text);
    };
    LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema2, pos) {
      if (!this.__compiled__[schema2.toLowerCase()]) {
        return 0;
      }
      return this.__compiled__[schema2.toLowerCase()].validate(text, pos, this);
    };
    LinkifyIt.prototype.match = function match(text) {
      var shift = 0, result = [];
      if (this.__index__ >= 0 && this.__text_cache__ === text) {
        result.push(createMatch(this, shift));
        shift = this.__last_index__;
      }
      var tail = shift ? text.slice(shift) : text;
      while (this.test(tail)) {
        result.push(createMatch(this, shift));
        tail = tail.slice(this.__last_index__);
        shift += this.__last_index__;
      }
      if (result.length) {
        return result;
      }
      return null;
    };
    LinkifyIt.prototype.matchAtStart = function matchAtStart(text) {
      this.__text_cache__ = text;
      this.__index__ = -1;
      if (!text.length) return null;
      var m = this.re.schema_at_start.exec(text);
      if (!m) return null;
      var len = this.testSchemaAt(text, m[2], m[0].length);
      if (!len) return null;
      this.__schema__ = m[2];
      this.__index__ = m.index + m[1].length;
      this.__last_index__ = m.index + m[0].length + len;
      return createMatch(this, 0);
    };
    LinkifyIt.prototype.tlds = function tlds2(list, keepOld) {
      list = Array.isArray(list) ? list : [list];
      if (!keepOld) {
        this.__tlds__ = list.slice();
        this.__tlds_replaced__ = true;
        compile2(this);
        return this;
      }
      this.__tlds__ = this.__tlds__.concat(list).sort().filter(function(el, idx, arr) {
        return el !== arr[idx - 1];
      }).reverse();
      compile2(this);
      return this;
    };
    LinkifyIt.prototype.normalize = function normalize(match) {
      if (!match.schema) {
        match.url = "http://" + match.url;
      }
      if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) {
        match.url = "mailto:" + match.url;
      }
    };
    LinkifyIt.prototype.onCompile = function onCompile() {
    };
    module.exports = LinkifyIt;
  }
});

// node_modules/markdown-it/lib/presets/default.js
var require_default = __commonJS({
  "node_modules/markdown-it/lib/presets/default.js"(exports, module) {
    "use strict";
    module.exports = {
      options: {
        html: false,
        // Enable HTML tags in source
        xhtmlOut: false,
        // Use '/' to close single tags (<br />)
        breaks: false,
        // Convert '\n' in paragraphs into <br>
        langPrefix: "language-",
        // CSS language prefix for fenced blocks
        linkify: false,
        // autoconvert URL-like texts to links
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "\u201C\u201D\u2018\u2019",
        /* “”‘’ */
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        maxNesting: 100
        // Internal protection, recursion limit
      },
      components: {
        core: {},
        block: {},
        inline: {}
      }
    };
  }
});

// node_modules/markdown-it/lib/presets/zero.js
var require_zero = __commonJS({
  "node_modules/markdown-it/lib/presets/zero.js"(exports, module) {
    "use strict";
    module.exports = {
      options: {
        html: false,
        // Enable HTML tags in source
        xhtmlOut: false,
        // Use '/' to close single tags (<br />)
        breaks: false,
        // Convert '\n' in paragraphs into <br>
        langPrefix: "language-",
        // CSS language prefix for fenced blocks
        linkify: false,
        // autoconvert URL-like texts to links
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "\u201C\u201D\u2018\u2019",
        /* “”‘’ */
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        maxNesting: 20
        // Internal protection, recursion limit
      },
      components: {
        core: {
          rules: [
            "normalize",
            "block",
            "inline",
            "text_join"
          ]
        },
        block: {
          rules: [
            "paragraph"
          ]
        },
        inline: {
          rules: [
            "text"
          ],
          rules2: [
            "balance_pairs",
            "fragments_join"
          ]
        }
      }
    };
  }
});

// node_modules/markdown-it/lib/presets/commonmark.js
var require_commonmark = __commonJS({
  "node_modules/markdown-it/lib/presets/commonmark.js"(exports, module) {
    "use strict";
    module.exports = {
      options: {
        html: true,
        // Enable HTML tags in source
        xhtmlOut: true,
        // Use '/' to close single tags (<br />)
        breaks: false,
        // Convert '\n' in paragraphs into <br>
        langPrefix: "language-",
        // CSS language prefix for fenced blocks
        linkify: false,
        // autoconvert URL-like texts to links
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "\u201C\u201D\u2018\u2019",
        /* “”‘’ */
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        maxNesting: 20
        // Internal protection, recursion limit
      },
      components: {
        core: {
          rules: [
            "normalize",
            "block",
            "inline",
            "text_join"
          ]
        },
        block: {
          rules: [
            "blockquote",
            "code",
            "fence",
            "heading",
            "hr",
            "html_block",
            "lheading",
            "list",
            "reference",
            "paragraph"
          ]
        },
        inline: {
          rules: [
            "autolink",
            "backticks",
            "emphasis",
            "entity",
            "escape",
            "html_inline",
            "image",
            "link",
            "newline",
            "text"
          ],
          rules2: [
            "balance_pairs",
            "emphasis",
            "fragments_join"
          ]
        }
      }
    };
  }
});

// node_modules/markdown-it/lib/index.js
var require_lib = __commonJS({
  "node_modules/markdown-it/lib/index.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var helpers = require_helpers();
    var Renderer = require_renderer();
    var ParserCore = require_parser_core();
    var ParserBlock = require_parser_block();
    var ParserInline = require_parser_inline();
    var LinkifyIt = require_linkify_it();
    var mdurl = require_mdurl();
    var punycode = __require("punycode");
    var config = {
      default: require_default(),
      zero: require_zero(),
      commonmark: require_commonmark()
    };
    var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
    var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
    function validateLink(url) {
      var str2 = url.trim().toLowerCase();
      return BAD_PROTO_RE.test(str2) ? GOOD_DATA_RE.test(str2) ? true : false : true;
    }
    var RECODE_HOSTNAME_FOR = ["http:", "https:", "mailto:"];
    function normalizeLink(url) {
      var parsed = mdurl.parse(url, true);
      if (parsed.hostname) {
        if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
          try {
            parsed.hostname = punycode.toASCII(parsed.hostname);
          } catch (er) {
          }
        }
      }
      return mdurl.encode(mdurl.format(parsed));
    }
    function normalizeLinkText(url) {
      var parsed = mdurl.parse(url, true);
      if (parsed.hostname) {
        if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
          try {
            parsed.hostname = punycode.toUnicode(parsed.hostname);
          } catch (er) {
          }
        }
      }
      return mdurl.decode(mdurl.format(parsed), mdurl.decode.defaultChars + "%");
    }
    function MarkdownIt2(presetName, options) {
      if (!(this instanceof MarkdownIt2)) {
        return new MarkdownIt2(presetName, options);
      }
      if (!options) {
        if (!utils.isString(presetName)) {
          options = presetName || {};
          presetName = "default";
        }
      }
      this.inline = new ParserInline();
      this.block = new ParserBlock();
      this.core = new ParserCore();
      this.renderer = new Renderer();
      this.linkify = new LinkifyIt();
      this.validateLink = validateLink;
      this.normalizeLink = normalizeLink;
      this.normalizeLinkText = normalizeLinkText;
      this.utils = utils;
      this.helpers = utils.assign({}, helpers);
      this.options = {};
      this.configure(presetName);
      if (options) {
        this.set(options);
      }
    }
    MarkdownIt2.prototype.set = function(options) {
      utils.assign(this.options, options);
      return this;
    };
    MarkdownIt2.prototype.configure = function(presets) {
      var self2 = this, presetName;
      if (utils.isString(presets)) {
        presetName = presets;
        presets = config[presetName];
        if (!presets) {
          throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
        }
      }
      if (!presets) {
        throw new Error("Wrong `markdown-it` preset, can't be empty");
      }
      if (presets.options) {
        self2.set(presets.options);
      }
      if (presets.components) {
        Object.keys(presets.components).forEach(function(name2) {
          if (presets.components[name2].rules) {
            self2[name2].ruler.enableOnly(presets.components[name2].rules);
          }
          if (presets.components[name2].rules2) {
            self2[name2].ruler2.enableOnly(presets.components[name2].rules2);
          }
        });
      }
      return this;
    };
    MarkdownIt2.prototype.enable = function(list, ignoreInvalid) {
      var result = [];
      if (!Array.isArray(list)) {
        list = [list];
      }
      ["core", "block", "inline"].forEach(function(chain) {
        result = result.concat(this[chain].ruler.enable(list, true));
      }, this);
      result = result.concat(this.inline.ruler2.enable(list, true));
      var missed = list.filter(function(name2) {
        return result.indexOf(name2) < 0;
      });
      if (missed.length && !ignoreInvalid) {
        throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
      }
      return this;
    };
    MarkdownIt2.prototype.disable = function(list, ignoreInvalid) {
      var result = [];
      if (!Array.isArray(list)) {
        list = [list];
      }
      ["core", "block", "inline"].forEach(function(chain) {
        result = result.concat(this[chain].ruler.disable(list, true));
      }, this);
      result = result.concat(this.inline.ruler2.disable(list, true));
      var missed = list.filter(function(name2) {
        return result.indexOf(name2) < 0;
      });
      if (missed.length && !ignoreInvalid) {
        throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
      }
      return this;
    };
    MarkdownIt2.prototype.use = function(plugin3) {
      var args = [this].concat(Array.prototype.slice.call(arguments, 1));
      plugin3.apply(plugin3, args);
      return this;
    };
    MarkdownIt2.prototype.parse = function(src, env) {
      if (typeof src !== "string") {
        throw new Error("Input data should be a String");
      }
      var state = new this.core.State(src, this, env);
      this.core.process(state);
      return state.tokens;
    };
    MarkdownIt2.prototype.render = function(src, env) {
      env = env || {};
      return this.renderer.render(this.parse(src, env), this.options, env);
    };
    MarkdownIt2.prototype.parseInline = function(src, env) {
      var state = new this.core.State(src, this, env);
      state.inlineMode = true;
      this.core.process(state);
      return state.tokens;
    };
    MarkdownIt2.prototype.renderInline = function(src, env) {
      env = env || {};
      return this.renderer.render(this.parseInline(src, env), this.options, env);
    };
    module.exports = MarkdownIt2;
  }
});

// node_modules/markdown-it/index.js
var require_markdown_it = __commonJS({
  "node_modules/markdown-it/index.js"(exports, module) {
    "use strict";
    module.exports = require_lib();
  }
});

// node_modules/boolbase/index.js
var require_boolbase = __commonJS({
  "node_modules/boolbase/index.js"(exports, module) {
    module.exports = {
      trueFunc: function trueFunc() {
        return true;
      },
      falseFunc: function falseFunc() {
        return false;
      }
    };
  }
});

// node_modules/css-selector-parser/lib/utils.js
var require_utils2 = __commonJS({
  "node_modules/css-selector-parser/lib/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isIdentStart(c) {
      return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "-" || c === "_";
    }
    exports.isIdentStart = isIdentStart;
    function isIdent(c) {
      return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "-" || c === "_";
    }
    exports.isIdent = isIdent;
    function isHex(c) {
      return c >= "a" && c <= "f" || c >= "A" && c <= "F" || c >= "0" && c <= "9";
    }
    exports.isHex = isHex;
    function escapeIdentifier(s) {
      var len = s.length;
      var result = "";
      var i = 0;
      while (i < len) {
        var chr = s.charAt(i);
        if (exports.identSpecialChars[chr]) {
          result += "\\" + chr;
        } else {
          if (!(chr === "_" || chr === "-" || chr >= "A" && chr <= "Z" || chr >= "a" && chr <= "z" || i !== 0 && chr >= "0" && chr <= "9")) {
            var charCode = chr.charCodeAt(0);
            if ((charCode & 63488) === 55296) {
              var extraCharCode = s.charCodeAt(i++);
              if ((charCode & 64512) !== 55296 || (extraCharCode & 64512) !== 56320) {
                throw Error("UCS-2(decode): illegal sequence");
              }
              charCode = ((charCode & 1023) << 10) + (extraCharCode & 1023) + 65536;
            }
            result += "\\" + charCode.toString(16) + " ";
          } else {
            result += chr;
          }
        }
        i++;
      }
      return result;
    }
    exports.escapeIdentifier = escapeIdentifier;
    function escapeStr(s) {
      var len = s.length;
      var result = "";
      var i = 0;
      var replacement;
      while (i < len) {
        var chr = s.charAt(i);
        if (chr === '"') {
          chr = '\\"';
        } else if (chr === "\\") {
          chr = "\\\\";
        } else if ((replacement = exports.strReplacementsRev[chr]) !== void 0) {
          chr = replacement;
        }
        result += chr;
        i++;
      }
      return '"' + result + '"';
    }
    exports.escapeStr = escapeStr;
    exports.identSpecialChars = {
      "!": true,
      '"': true,
      "#": true,
      "$": true,
      "%": true,
      "&": true,
      "'": true,
      "(": true,
      ")": true,
      "*": true,
      "+": true,
      ",": true,
      ".": true,
      "/": true,
      ";": true,
      "<": true,
      "=": true,
      ">": true,
      "?": true,
      "@": true,
      "[": true,
      "\\": true,
      "]": true,
      "^": true,
      "`": true,
      "{": true,
      "|": true,
      "}": true,
      "~": true
    };
    exports.strReplacementsRev = {
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
      "\f": "\\f",
      "\v": "\\v"
    };
    exports.singleQuoteEscapeChars = {
      n: "\n",
      r: "\r",
      t: "	",
      f: "\f",
      "\\": "\\",
      "'": "'"
    };
    exports.doubleQuotesEscapeChars = {
      n: "\n",
      r: "\r",
      t: "	",
      f: "\f",
      "\\": "\\",
      '"': '"'
    };
  }
});

// node_modules/css-selector-parser/lib/parser-context.js
var require_parser_context = __commonJS({
  "node_modules/css-selector-parser/lib/parser-context.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils2();
    function parseCssSelector(str2, pos, pseudos, attrEqualityMods, ruleNestingOperators, substitutesEnabled) {
      var l = str2.length;
      var chr = "";
      function getStr(quote, escapeTable) {
        var result = "";
        pos++;
        chr = str2.charAt(pos);
        while (pos < l) {
          if (chr === quote) {
            pos++;
            return result;
          } else if (chr === "\\") {
            pos++;
            chr = str2.charAt(pos);
            var esc = void 0;
            if (chr === quote) {
              result += quote;
            } else if ((esc = escapeTable[chr]) !== void 0) {
              result += esc;
            } else if (utils_1.isHex(chr)) {
              var hex = chr;
              pos++;
              chr = str2.charAt(pos);
              while (utils_1.isHex(chr)) {
                hex += chr;
                pos++;
                chr = str2.charAt(pos);
              }
              if (chr === " ") {
                pos++;
                chr = str2.charAt(pos);
              }
              result += String.fromCharCode(parseInt(hex, 16));
              continue;
            } else {
              result += chr;
            }
          } else {
            result += chr;
          }
          pos++;
          chr = str2.charAt(pos);
        }
        return result;
      }
      function getIdent() {
        var result = "";
        chr = str2.charAt(pos);
        while (pos < l) {
          if (utils_1.isIdent(chr)) {
            result += chr;
          } else if (chr === "\\") {
            pos++;
            if (pos >= l) {
              throw Error("Expected symbol but end of file reached.");
            }
            chr = str2.charAt(pos);
            if (utils_1.identSpecialChars[chr]) {
              result += chr;
            } else if (utils_1.isHex(chr)) {
              var hex = chr;
              pos++;
              chr = str2.charAt(pos);
              while (utils_1.isHex(chr)) {
                hex += chr;
                pos++;
                chr = str2.charAt(pos);
              }
              if (chr === " ") {
                pos++;
                chr = str2.charAt(pos);
              }
              result += String.fromCharCode(parseInt(hex, 16));
              continue;
            } else {
              result += chr;
            }
          } else {
            return result;
          }
          pos++;
          chr = str2.charAt(pos);
        }
        return result;
      }
      function skipWhitespace() {
        chr = str2.charAt(pos);
        var result = false;
        while (chr === " " || chr === "	" || chr === "\n" || chr === "\r" || chr === "\f") {
          result = true;
          pos++;
          chr = str2.charAt(pos);
        }
        return result;
      }
      function parse4() {
        var res = parseSelector();
        if (pos < l) {
          throw Error('Rule expected but "' + str2.charAt(pos) + '" found.');
        }
        return res;
      }
      function parseSelector() {
        var selector = parseSingleSelector();
        if (!selector) {
          return null;
        }
        var res = selector;
        chr = str2.charAt(pos);
        while (chr === ",") {
          pos++;
          skipWhitespace();
          if (res.type !== "selectors") {
            res = {
              type: "selectors",
              selectors: [selector]
            };
          }
          selector = parseSingleSelector();
          if (!selector) {
            throw Error('Rule expected after ",".');
          }
          res.selectors.push(selector);
        }
        return res;
      }
      function parseSingleSelector() {
        skipWhitespace();
        var selector = {
          type: "ruleSet"
        };
        var rule = parseRule();
        if (!rule) {
          return null;
        }
        var currentRule = selector;
        while (rule) {
          rule.type = "rule";
          currentRule.rule = rule;
          currentRule = rule;
          skipWhitespace();
          chr = str2.charAt(pos);
          if (pos >= l || chr === "," || chr === ")") {
            break;
          }
          if (ruleNestingOperators[chr]) {
            var op = chr;
            pos++;
            skipWhitespace();
            rule = parseRule();
            if (!rule) {
              throw Error('Rule expected after "' + op + '".');
            }
            rule.nestingOperator = op;
          } else {
            rule = parseRule();
            if (rule) {
              rule.nestingOperator = null;
            }
          }
        }
        return selector;
      }
      function parseRule() {
        var rule = null;
        while (pos < l) {
          chr = str2.charAt(pos);
          if (chr === "*") {
            pos++;
            (rule = rule || {}).tagName = "*";
          } else if (utils_1.isIdentStart(chr) || chr === "\\") {
            (rule = rule || {}).tagName = getIdent();
          } else if (chr === ".") {
            pos++;
            rule = rule || {};
            (rule.classNames = rule.classNames || []).push(getIdent());
          } else if (chr === "#") {
            pos++;
            (rule = rule || {}).id = getIdent();
          } else if (chr === "[") {
            pos++;
            skipWhitespace();
            var attr = {
              name: getIdent()
            };
            skipWhitespace();
            if (chr === "]") {
              pos++;
            } else {
              var operator = "";
              if (attrEqualityMods[chr]) {
                operator = chr;
                pos++;
                chr = str2.charAt(pos);
              }
              if (pos >= l) {
                throw Error('Expected "=" but end of file reached.');
              }
              if (chr !== "=") {
                throw Error('Expected "=" but "' + chr + '" found.');
              }
              attr.operator = operator + "=";
              pos++;
              skipWhitespace();
              var attrValue = "";
              attr.valueType = "string";
              if (chr === '"') {
                attrValue = getStr('"', utils_1.doubleQuotesEscapeChars);
              } else if (chr === "'") {
                attrValue = getStr("'", utils_1.singleQuoteEscapeChars);
              } else if (substitutesEnabled && chr === "$") {
                pos++;
                attrValue = getIdent();
                attr.valueType = "substitute";
              } else {
                while (pos < l) {
                  if (chr === "]") {
                    break;
                  }
                  attrValue += chr;
                  pos++;
                  chr = str2.charAt(pos);
                }
                attrValue = attrValue.trim();
              }
              skipWhitespace();
              if (pos >= l) {
                throw Error('Expected "]" but end of file reached.');
              }
              if (chr !== "]") {
                throw Error('Expected "]" but "' + chr + '" found.');
              }
              pos++;
              attr.value = attrValue;
            }
            rule = rule || {};
            (rule.attrs = rule.attrs || []).push(attr);
          } else if (chr === ":") {
            pos++;
            var pseudoName = getIdent();
            var pseudo2 = {
              name: pseudoName
            };
            if (chr === "(") {
              pos++;
              var value = "";
              skipWhitespace();
              if (pseudos[pseudoName] === "selector") {
                pseudo2.valueType = "selector";
                value = parseSelector();
              } else {
                pseudo2.valueType = pseudos[pseudoName] || "string";
                if (chr === '"') {
                  value = getStr('"', utils_1.doubleQuotesEscapeChars);
                } else if (chr === "'") {
                  value = getStr("'", utils_1.singleQuoteEscapeChars);
                } else if (substitutesEnabled && chr === "$") {
                  pos++;
                  value = getIdent();
                  pseudo2.valueType = "substitute";
                } else {
                  while (pos < l) {
                    if (chr === ")") {
                      break;
                    }
                    value += chr;
                    pos++;
                    chr = str2.charAt(pos);
                  }
                  value = value.trim();
                }
                skipWhitespace();
              }
              if (pos >= l) {
                throw Error('Expected ")" but end of file reached.');
              }
              if (chr !== ")") {
                throw Error('Expected ")" but "' + chr + '" found.');
              }
              pos++;
              pseudo2.value = value;
            }
            rule = rule || {};
            (rule.pseudos = rule.pseudos || []).push(pseudo2);
          } else {
            break;
          }
        }
        return rule;
      }
      return parse4();
    }
    exports.parseCssSelector = parseCssSelector;
  }
});

// node_modules/css-selector-parser/lib/render.js
var require_render = __commonJS({
  "node_modules/css-selector-parser/lib/render.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils2();
    function renderEntity(entity) {
      var res = "";
      switch (entity.type) {
        case "ruleSet":
          var currentEntity = entity.rule;
          var parts = [];
          while (currentEntity) {
            if (currentEntity.nestingOperator) {
              parts.push(currentEntity.nestingOperator);
            }
            parts.push(renderEntity(currentEntity));
            currentEntity = currentEntity.rule;
          }
          res = parts.join(" ");
          break;
        case "selectors":
          res = entity.selectors.map(renderEntity).join(", ");
          break;
        case "rule":
          if (entity.tagName) {
            if (entity.tagName === "*") {
              res = "*";
            } else {
              res = utils_1.escapeIdentifier(entity.tagName);
            }
          }
          if (entity.id) {
            res += "#" + utils_1.escapeIdentifier(entity.id);
          }
          if (entity.classNames) {
            res += entity.classNames.map(function(cn) {
              return "." + utils_1.escapeIdentifier(cn);
            }).join("");
          }
          if (entity.attrs) {
            res += entity.attrs.map(function(attr) {
              if ("operator" in attr) {
                if (attr.valueType === "substitute") {
                  return "[" + utils_1.escapeIdentifier(attr.name) + attr.operator + "$" + attr.value + "]";
                } else {
                  return "[" + utils_1.escapeIdentifier(attr.name) + attr.operator + utils_1.escapeStr(attr.value) + "]";
                }
              } else {
                return "[" + utils_1.escapeIdentifier(attr.name) + "]";
              }
            }).join("");
          }
          if (entity.pseudos) {
            res += entity.pseudos.map(function(pseudo2) {
              if (pseudo2.valueType) {
                if (pseudo2.valueType === "selector") {
                  return ":" + utils_1.escapeIdentifier(pseudo2.name) + "(" + renderEntity(pseudo2.value) + ")";
                } else if (pseudo2.valueType === "substitute") {
                  return ":" + utils_1.escapeIdentifier(pseudo2.name) + "($" + pseudo2.value + ")";
                } else if (pseudo2.valueType === "numeric") {
                  return ":" + utils_1.escapeIdentifier(pseudo2.name) + "(" + pseudo2.value + ")";
                } else {
                  return ":" + utils_1.escapeIdentifier(pseudo2.name) + "(" + utils_1.escapeIdentifier(pseudo2.value) + ")";
                }
              } else {
                return ":" + utils_1.escapeIdentifier(pseudo2.name);
              }
            }).join("");
          }
          break;
        default:
          throw Error('Unknown entity type: "' + entity.type + '".');
      }
      return res;
    }
    exports.renderEntity = renderEntity;
  }
});

// node_modules/css-selector-parser/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/css-selector-parser/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var parser_context_1 = require_parser_context();
    var render_1 = require_render();
    var CssSelectorParser2 = (
      /** @class */
      (function() {
        function CssSelectorParser3() {
          this.pseudos = {};
          this.attrEqualityMods = {};
          this.ruleNestingOperators = {};
          this.substitutesEnabled = false;
        }
        CssSelectorParser3.prototype.registerSelectorPseudos = function() {
          var pseudos = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            pseudos[_i] = arguments[_i];
          }
          for (var _a = 0, pseudos_1 = pseudos; _a < pseudos_1.length; _a++) {
            var pseudo2 = pseudos_1[_a];
            this.pseudos[pseudo2] = "selector";
          }
          return this;
        };
        CssSelectorParser3.prototype.unregisterSelectorPseudos = function() {
          var pseudos = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            pseudos[_i] = arguments[_i];
          }
          for (var _a = 0, pseudos_2 = pseudos; _a < pseudos_2.length; _a++) {
            var pseudo2 = pseudos_2[_a];
            delete this.pseudos[pseudo2];
          }
          return this;
        };
        CssSelectorParser3.prototype.registerNumericPseudos = function() {
          var pseudos = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            pseudos[_i] = arguments[_i];
          }
          for (var _a = 0, pseudos_3 = pseudos; _a < pseudos_3.length; _a++) {
            var pseudo2 = pseudos_3[_a];
            this.pseudos[pseudo2] = "numeric";
          }
          return this;
        };
        CssSelectorParser3.prototype.unregisterNumericPseudos = function() {
          var pseudos = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            pseudos[_i] = arguments[_i];
          }
          for (var _a = 0, pseudos_4 = pseudos; _a < pseudos_4.length; _a++) {
            var pseudo2 = pseudos_4[_a];
            delete this.pseudos[pseudo2];
          }
          return this;
        };
        CssSelectorParser3.prototype.registerNestingOperators = function() {
          var operators = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
          }
          for (var _a = 0, operators_1 = operators; _a < operators_1.length; _a++) {
            var operator = operators_1[_a];
            this.ruleNestingOperators[operator] = true;
          }
          return this;
        };
        CssSelectorParser3.prototype.unregisterNestingOperators = function() {
          var operators = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
          }
          for (var _a = 0, operators_2 = operators; _a < operators_2.length; _a++) {
            var operator = operators_2[_a];
            delete this.ruleNestingOperators[operator];
          }
          return this;
        };
        CssSelectorParser3.prototype.registerAttrEqualityMods = function() {
          var mods = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            mods[_i] = arguments[_i];
          }
          for (var _a = 0, mods_1 = mods; _a < mods_1.length; _a++) {
            var mod = mods_1[_a];
            this.attrEqualityMods[mod] = true;
          }
          return this;
        };
        CssSelectorParser3.prototype.unregisterAttrEqualityMods = function() {
          var mods = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            mods[_i] = arguments[_i];
          }
          for (var _a = 0, mods_2 = mods; _a < mods_2.length; _a++) {
            var mod = mods_2[_a];
            delete this.attrEqualityMods[mod];
          }
          return this;
        };
        CssSelectorParser3.prototype.enableSubstitutes = function() {
          this.substitutesEnabled = true;
          return this;
        };
        CssSelectorParser3.prototype.disableSubstitutes = function() {
          this.substitutesEnabled = false;
          return this;
        };
        CssSelectorParser3.prototype.parse = function(str2) {
          return parser_context_1.parseCssSelector(str2, 0, this.pseudos, this.attrEqualityMods, this.ruleNestingOperators, this.substitutesEnabled);
        };
        CssSelectorParser3.prototype.render = function(path2) {
          return render_1.renderEntity(path2).trim();
        };
        return CssSelectorParser3;
      })()
    );
    exports.CssSelectorParser = CssSelectorParser2;
  }
});

// node_modules/classnames/index.js
var require_classnames = __commonJS({
  "node_modules/classnames/index.js"(exports, module) {
    (function() {
      "use strict";
      var hasOwn = {}.hasOwnProperty;
      function classNames2() {
        var classes = "";
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (arg) {
            classes = appendClass(classes, parseValue(arg));
          }
        }
        return classes;
      }
      function parseValue(arg) {
        if (typeof arg === "string" || typeof arg === "number") {
          return arg;
        }
        if (typeof arg !== "object") {
          return "";
        }
        if (Array.isArray(arg)) {
          return classNames2.apply(null, arg);
        }
        if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
          return arg.toString();
        }
        var classes = "";
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
          }
        }
        return classes;
      }
      function appendClass(value, newClass) {
        if (!newClass) {
          return value;
        }
        if (value) {
          return value + " " + newClass;
        }
        return value + newClass;
      }
      if (typeof module !== "undefined" && module.exports) {
        classNames2.default = classNames2;
        module.exports = classNames2;
      } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
        define("classnames", [], function() {
          return classNames2;
        });
      } else {
        window.classNames = classNames2;
      }
    })();
  }
});

// node_modules/is-buffer/index.js
var require_is_buffer = __commonJS({
  "node_modules/is-buffer/index.js"(exports, module) {
    module.exports = function isBuffer2(obj) {
      return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    };
  }
});

// node_modules/he/he.js
var require_he = __commonJS({
  "node_modules/he/he.js"(exports, module) {
    (function(root2) {
      var freeExports = typeof exports == "object" && exports;
      var freeModule = typeof module == "object" && module && module.exports == freeExports && module;
      var freeGlobal = typeof global == "object" && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root2 = freeGlobal;
      }
      var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      var regexAsciiWhitelist = /[\x01-\x7F]/g;
      var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
      var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
      var encodeMap = { "\xAD": "shy", "\u200C": "zwnj", "\u200D": "zwj", "\u200E": "lrm", "\u2063": "ic", "\u2062": "it", "\u2061": "af", "\u200F": "rlm", "\u200B": "ZeroWidthSpace", "\u2060": "NoBreak", "\u0311": "DownBreve", "\u20DB": "tdot", "\u20DC": "DotDot", "	": "Tab", "\n": "NewLine", "\u2008": "puncsp", "\u205F": "MediumSpace", "\u2009": "thinsp", "\u200A": "hairsp", "\u2004": "emsp13", "\u2002": "ensp", "\u2005": "emsp14", "\u2003": "emsp", "\u2007": "numsp", "\xA0": "nbsp", "\u205F\u200A": "ThickSpace", "\u203E": "oline", "_": "lowbar", "\u2010": "dash", "\u2013": "ndash", "\u2014": "mdash", "\u2015": "horbar", ",": "comma", ";": "semi", "\u204F": "bsemi", ":": "colon", "\u2A74": "Colone", "!": "excl", "\xA1": "iexcl", "?": "quest", "\xBF": "iquest", ".": "period", "\u2025": "nldr", "\u2026": "mldr", "\xB7": "middot", "'": "apos", "\u2018": "lsquo", "\u2019": "rsquo", "\u201A": "sbquo", "\u2039": "lsaquo", "\u203A": "rsaquo", '"': "quot", "\u201C": "ldquo", "\u201D": "rdquo", "\u201E": "bdquo", "\xAB": "laquo", "\xBB": "raquo", "(": "lpar", ")": "rpar", "[": "lsqb", "]": "rsqb", "{": "lcub", "}": "rcub", "\u2308": "lceil", "\u2309": "rceil", "\u230A": "lfloor", "\u230B": "rfloor", "\u2985": "lopar", "\u2986": "ropar", "\u298B": "lbrke", "\u298C": "rbrke", "\u298D": "lbrkslu", "\u298E": "rbrksld", "\u298F": "lbrksld", "\u2990": "rbrkslu", "\u2991": "langd", "\u2992": "rangd", "\u2993": "lparlt", "\u2994": "rpargt", "\u2995": "gtlPar", "\u2996": "ltrPar", "\u27E6": "lobrk", "\u27E7": "robrk", "\u27E8": "lang", "\u27E9": "rang", "\u27EA": "Lang", "\u27EB": "Rang", "\u27EC": "loang", "\u27ED": "roang", "\u2772": "lbbrk", "\u2773": "rbbrk", "\u2016": "Vert", "\xA7": "sect", "\xB6": "para", "@": "commat", "*": "ast", "/": "sol", "undefined": null, "&": "amp", "#": "num", "%": "percnt", "\u2030": "permil", "\u2031": "pertenk", "\u2020": "dagger", "\u2021": "Dagger", "\u2022": "bull", "\u2043": "hybull", "\u2032": "prime", "\u2033": "Prime", "\u2034": "tprime", "\u2057": "qprime", "\u2035": "bprime", "\u2041": "caret", "`": "grave", "\xB4": "acute", "\u02DC": "tilde", "^": "Hat", "\xAF": "macr", "\u02D8": "breve", "\u02D9": "dot", "\xA8": "die", "\u02DA": "ring", "\u02DD": "dblac", "\xB8": "cedil", "\u02DB": "ogon", "\u02C6": "circ", "\u02C7": "caron", "\xB0": "deg", "\xA9": "copy", "\xAE": "reg", "\u2117": "copysr", "\u2118": "wp", "\u211E": "rx", "\u2127": "mho", "\u2129": "iiota", "\u2190": "larr", "\u219A": "nlarr", "\u2192": "rarr", "\u219B": "nrarr", "\u2191": "uarr", "\u2193": "darr", "\u2194": "harr", "\u21AE": "nharr", "\u2195": "varr", "\u2196": "nwarr", "\u2197": "nearr", "\u2198": "searr", "\u2199": "swarr", "\u219D": "rarrw", "\u219D\u0338": "nrarrw", "\u219E": "Larr", "\u219F": "Uarr", "\u21A0": "Rarr", "\u21A1": "Darr", "\u21A2": "larrtl", "\u21A3": "rarrtl", "\u21A4": "mapstoleft", "\u21A5": "mapstoup", "\u21A6": "map", "\u21A7": "mapstodown", "\u21A9": "larrhk", "\u21AA": "rarrhk", "\u21AB": "larrlp", "\u21AC": "rarrlp", "\u21AD": "harrw", "\u21B0": "lsh", "\u21B1": "rsh", "\u21B2": "ldsh", "\u21B3": "rdsh", "\u21B5": "crarr", "\u21B6": "cularr", "\u21B7": "curarr", "\u21BA": "olarr", "\u21BB": "orarr", "\u21BC": "lharu", "\u21BD": "lhard", "\u21BE": "uharr", "\u21BF": "uharl", "\u21C0": "rharu", "\u21C1": "rhard", "\u21C2": "dharr", "\u21C3": "dharl", "\u21C4": "rlarr", "\u21C5": "udarr", "\u21C6": "lrarr", "\u21C7": "llarr", "\u21C8": "uuarr", "\u21C9": "rrarr", "\u21CA": "ddarr", "\u21CB": "lrhar", "\u21CC": "rlhar", "\u21D0": "lArr", "\u21CD": "nlArr", "\u21D1": "uArr", "\u21D2": "rArr", "\u21CF": "nrArr", "\u21D3": "dArr", "\u21D4": "iff", "\u21CE": "nhArr", "\u21D5": "vArr", "\u21D6": "nwArr", "\u21D7": "neArr", "\u21D8": "seArr", "\u21D9": "swArr", "\u21DA": "lAarr", "\u21DB": "rAarr", "\u21DD": "zigrarr", "\u21E4": "larrb", "\u21E5": "rarrb", "\u21F5": "duarr", "\u21FD": "loarr", "\u21FE": "roarr", "\u21FF": "hoarr", "\u2200": "forall", "\u2201": "comp", "\u2202": "part", "\u2202\u0338": "npart", "\u2203": "exist", "\u2204": "nexist", "\u2205": "empty", "\u2207": "Del", "\u2208": "in", "\u2209": "notin", "\u220B": "ni", "\u220C": "notni", "\u03F6": "bepsi", "\u220F": "prod", "\u2210": "coprod", "\u2211": "sum", "+": "plus", "\xB1": "pm", "\xF7": "div", "\xD7": "times", "<": "lt", "\u226E": "nlt", "<\u20D2": "nvlt", "=": "equals", "\u2260": "ne", "=\u20E5": "bne", "\u2A75": "Equal", ">": "gt", "\u226F": "ngt", ">\u20D2": "nvgt", "\xAC": "not", "|": "vert", "\xA6": "brvbar", "\u2212": "minus", "\u2213": "mp", "\u2214": "plusdo", "\u2044": "frasl", "\u2216": "setmn", "\u2217": "lowast", "\u2218": "compfn", "\u221A": "Sqrt", "\u221D": "prop", "\u221E": "infin", "\u221F": "angrt", "\u2220": "ang", "\u2220\u20D2": "nang", "\u2221": "angmsd", "\u2222": "angsph", "\u2223": "mid", "\u2224": "nmid", "\u2225": "par", "\u2226": "npar", "\u2227": "and", "\u2228": "or", "\u2229": "cap", "\u2229\uFE00": "caps", "\u222A": "cup", "\u222A\uFE00": "cups", "\u222B": "int", "\u222C": "Int", "\u222D": "tint", "\u2A0C": "qint", "\u222E": "oint", "\u222F": "Conint", "\u2230": "Cconint", "\u2231": "cwint", "\u2232": "cwconint", "\u2233": "awconint", "\u2234": "there4", "\u2235": "becaus", "\u2236": "ratio", "\u2237": "Colon", "\u2238": "minusd", "\u223A": "mDDot", "\u223B": "homtht", "\u223C": "sim", "\u2241": "nsim", "\u223C\u20D2": "nvsim", "\u223D": "bsim", "\u223D\u0331": "race", "\u223E": "ac", "\u223E\u0333": "acE", "\u223F": "acd", "\u2240": "wr", "\u2242": "esim", "\u2242\u0338": "nesim", "\u2243": "sime", "\u2244": "nsime", "\u2245": "cong", "\u2247": "ncong", "\u2246": "simne", "\u2248": "ap", "\u2249": "nap", "\u224A": "ape", "\u224B": "apid", "\u224B\u0338": "napid", "\u224C": "bcong", "\u224D": "CupCap", "\u226D": "NotCupCap", "\u224D\u20D2": "nvap", "\u224E": "bump", "\u224E\u0338": "nbump", "\u224F": "bumpe", "\u224F\u0338": "nbumpe", "\u2250": "doteq", "\u2250\u0338": "nedot", "\u2251": "eDot", "\u2252": "efDot", "\u2253": "erDot", "\u2254": "colone", "\u2255": "ecolon", "\u2256": "ecir", "\u2257": "cire", "\u2259": "wedgeq", "\u225A": "veeeq", "\u225C": "trie", "\u225F": "equest", "\u2261": "equiv", "\u2262": "nequiv", "\u2261\u20E5": "bnequiv", "\u2264": "le", "\u2270": "nle", "\u2264\u20D2": "nvle", "\u2265": "ge", "\u2271": "nge", "\u2265\u20D2": "nvge", "\u2266": "lE", "\u2266\u0338": "nlE", "\u2267": "gE", "\u2267\u0338": "ngE", "\u2268\uFE00": "lvnE", "\u2268": "lnE", "\u2269": "gnE", "\u2269\uFE00": "gvnE", "\u226A": "ll", "\u226A\u0338": "nLtv", "\u226A\u20D2": "nLt", "\u226B": "gg", "\u226B\u0338": "nGtv", "\u226B\u20D2": "nGt", "\u226C": "twixt", "\u2272": "lsim", "\u2274": "nlsim", "\u2273": "gsim", "\u2275": "ngsim", "\u2276": "lg", "\u2278": "ntlg", "\u2277": "gl", "\u2279": "ntgl", "\u227A": "pr", "\u2280": "npr", "\u227B": "sc", "\u2281": "nsc", "\u227C": "prcue", "\u22E0": "nprcue", "\u227D": "sccue", "\u22E1": "nsccue", "\u227E": "prsim", "\u227F": "scsim", "\u227F\u0338": "NotSucceedsTilde", "\u2282": "sub", "\u2284": "nsub", "\u2282\u20D2": "vnsub", "\u2283": "sup", "\u2285": "nsup", "\u2283\u20D2": "vnsup", "\u2286": "sube", "\u2288": "nsube", "\u2287": "supe", "\u2289": "nsupe", "\u228A\uFE00": "vsubne", "\u228A": "subne", "\u228B\uFE00": "vsupne", "\u228B": "supne", "\u228D": "cupdot", "\u228E": "uplus", "\u228F": "sqsub", "\u228F\u0338": "NotSquareSubset", "\u2290": "sqsup", "\u2290\u0338": "NotSquareSuperset", "\u2291": "sqsube", "\u22E2": "nsqsube", "\u2292": "sqsupe", "\u22E3": "nsqsupe", "\u2293": "sqcap", "\u2293\uFE00": "sqcaps", "\u2294": "sqcup", "\u2294\uFE00": "sqcups", "\u2295": "oplus", "\u2296": "ominus", "\u2297": "otimes", "\u2298": "osol", "\u2299": "odot", "\u229A": "ocir", "\u229B": "oast", "\u229D": "odash", "\u229E": "plusb", "\u229F": "minusb", "\u22A0": "timesb", "\u22A1": "sdotb", "\u22A2": "vdash", "\u22AC": "nvdash", "\u22A3": "dashv", "\u22A4": "top", "\u22A5": "bot", "\u22A7": "models", "\u22A8": "vDash", "\u22AD": "nvDash", "\u22A9": "Vdash", "\u22AE": "nVdash", "\u22AA": "Vvdash", "\u22AB": "VDash", "\u22AF": "nVDash", "\u22B0": "prurel", "\u22B2": "vltri", "\u22EA": "nltri", "\u22B3": "vrtri", "\u22EB": "nrtri", "\u22B4": "ltrie", "\u22EC": "nltrie", "\u22B4\u20D2": "nvltrie", "\u22B5": "rtrie", "\u22ED": "nrtrie", "\u22B5\u20D2": "nvrtrie", "\u22B6": "origof", "\u22B7": "imof", "\u22B8": "mumap", "\u22B9": "hercon", "\u22BA": "intcal", "\u22BB": "veebar", "\u22BD": "barvee", "\u22BE": "angrtvb", "\u22BF": "lrtri", "\u22C0": "Wedge", "\u22C1": "Vee", "\u22C2": "xcap", "\u22C3": "xcup", "\u22C4": "diam", "\u22C5": "sdot", "\u22C6": "Star", "\u22C7": "divonx", "\u22C8": "bowtie", "\u22C9": "ltimes", "\u22CA": "rtimes", "\u22CB": "lthree", "\u22CC": "rthree", "\u22CD": "bsime", "\u22CE": "cuvee", "\u22CF": "cuwed", "\u22D0": "Sub", "\u22D1": "Sup", "\u22D2": "Cap", "\u22D3": "Cup", "\u22D4": "fork", "\u22D5": "epar", "\u22D6": "ltdot", "\u22D7": "gtdot", "\u22D8": "Ll", "\u22D8\u0338": "nLl", "\u22D9": "Gg", "\u22D9\u0338": "nGg", "\u22DA\uFE00": "lesg", "\u22DA": "leg", "\u22DB": "gel", "\u22DB\uFE00": "gesl", "\u22DE": "cuepr", "\u22DF": "cuesc", "\u22E6": "lnsim", "\u22E7": "gnsim", "\u22E8": "prnsim", "\u22E9": "scnsim", "\u22EE": "vellip", "\u22EF": "ctdot", "\u22F0": "utdot", "\u22F1": "dtdot", "\u22F2": "disin", "\u22F3": "isinsv", "\u22F4": "isins", "\u22F5": "isindot", "\u22F5\u0338": "notindot", "\u22F6": "notinvc", "\u22F7": "notinvb", "\u22F9": "isinE", "\u22F9\u0338": "notinE", "\u22FA": "nisd", "\u22FB": "xnis", "\u22FC": "nis", "\u22FD": "notnivc", "\u22FE": "notnivb", "\u2305": "barwed", "\u2306": "Barwed", "\u230C": "drcrop", "\u230D": "dlcrop", "\u230E": "urcrop", "\u230F": "ulcrop", "\u2310": "bnot", "\u2312": "profline", "\u2313": "profsurf", "\u2315": "telrec", "\u2316": "target", "\u231C": "ulcorn", "\u231D": "urcorn", "\u231E": "dlcorn", "\u231F": "drcorn", "\u2322": "frown", "\u2323": "smile", "\u232D": "cylcty", "\u232E": "profalar", "\u2336": "topbot", "\u233D": "ovbar", "\u233F": "solbar", "\u237C": "angzarr", "\u23B0": "lmoust", "\u23B1": "rmoust", "\u23B4": "tbrk", "\u23B5": "bbrk", "\u23B6": "bbrktbrk", "\u23DC": "OverParenthesis", "\u23DD": "UnderParenthesis", "\u23DE": "OverBrace", "\u23DF": "UnderBrace", "\u23E2": "trpezium", "\u23E7": "elinters", "\u2423": "blank", "\u2500": "boxh", "\u2502": "boxv", "\u250C": "boxdr", "\u2510": "boxdl", "\u2514": "boxur", "\u2518": "boxul", "\u251C": "boxvr", "\u2524": "boxvl", "\u252C": "boxhd", "\u2534": "boxhu", "\u253C": "boxvh", "\u2550": "boxH", "\u2551": "boxV", "\u2552": "boxdR", "\u2553": "boxDr", "\u2554": "boxDR", "\u2555": "boxdL", "\u2556": "boxDl", "\u2557": "boxDL", "\u2558": "boxuR", "\u2559": "boxUr", "\u255A": "boxUR", "\u255B": "boxuL", "\u255C": "boxUl", "\u255D": "boxUL", "\u255E": "boxvR", "\u255F": "boxVr", "\u2560": "boxVR", "\u2561": "boxvL", "\u2562": "boxVl", "\u2563": "boxVL", "\u2564": "boxHd", "\u2565": "boxhD", "\u2566": "boxHD", "\u2567": "boxHu", "\u2568": "boxhU", "\u2569": "boxHU", "\u256A": "boxvH", "\u256B": "boxVh", "\u256C": "boxVH", "\u2580": "uhblk", "\u2584": "lhblk", "\u2588": "block", "\u2591": "blk14", "\u2592": "blk12", "\u2593": "blk34", "\u25A1": "squ", "\u25AA": "squf", "\u25AB": "EmptyVerySmallSquare", "\u25AD": "rect", "\u25AE": "marker", "\u25B1": "fltns", "\u25B3": "xutri", "\u25B4": "utrif", "\u25B5": "utri", "\u25B8": "rtrif", "\u25B9": "rtri", "\u25BD": "xdtri", "\u25BE": "dtrif", "\u25BF": "dtri", "\u25C2": "ltrif", "\u25C3": "ltri", "\u25CA": "loz", "\u25CB": "cir", "\u25EC": "tridot", "\u25EF": "xcirc", "\u25F8": "ultri", "\u25F9": "urtri", "\u25FA": "lltri", "\u25FB": "EmptySmallSquare", "\u25FC": "FilledSmallSquare", "\u2605": "starf", "\u2606": "star", "\u260E": "phone", "\u2640": "female", "\u2642": "male", "\u2660": "spades", "\u2663": "clubs", "\u2665": "hearts", "\u2666": "diams", "\u266A": "sung", "\u2713": "check", "\u2717": "cross", "\u2720": "malt", "\u2736": "sext", "\u2758": "VerticalSeparator", "\u27C8": "bsolhsub", "\u27C9": "suphsol", "\u27F5": "xlarr", "\u27F6": "xrarr", "\u27F7": "xharr", "\u27F8": "xlArr", "\u27F9": "xrArr", "\u27FA": "xhArr", "\u27FC": "xmap", "\u27FF": "dzigrarr", "\u2902": "nvlArr", "\u2903": "nvrArr", "\u2904": "nvHarr", "\u2905": "Map", "\u290C": "lbarr", "\u290D": "rbarr", "\u290E": "lBarr", "\u290F": "rBarr", "\u2910": "RBarr", "\u2911": "DDotrahd", "\u2912": "UpArrowBar", "\u2913": "DownArrowBar", "\u2916": "Rarrtl", "\u2919": "latail", "\u291A": "ratail", "\u291B": "lAtail", "\u291C": "rAtail", "\u291D": "larrfs", "\u291E": "rarrfs", "\u291F": "larrbfs", "\u2920": "rarrbfs", "\u2923": "nwarhk", "\u2924": "nearhk", "\u2925": "searhk", "\u2926": "swarhk", "\u2927": "nwnear", "\u2928": "toea", "\u2929": "tosa", "\u292A": "swnwar", "\u2933": "rarrc", "\u2933\u0338": "nrarrc", "\u2935": "cudarrr", "\u2936": "ldca", "\u2937": "rdca", "\u2938": "cudarrl", "\u2939": "larrpl", "\u293C": "curarrm", "\u293D": "cularrp", "\u2945": "rarrpl", "\u2948": "harrcir", "\u2949": "Uarrocir", "\u294A": "lurdshar", "\u294B": "ldrushar", "\u294E": "LeftRightVector", "\u294F": "RightUpDownVector", "\u2950": "DownLeftRightVector", "\u2951": "LeftUpDownVector", "\u2952": "LeftVectorBar", "\u2953": "RightVectorBar", "\u2954": "RightUpVectorBar", "\u2955": "RightDownVectorBar", "\u2956": "DownLeftVectorBar", "\u2957": "DownRightVectorBar", "\u2958": "LeftUpVectorBar", "\u2959": "LeftDownVectorBar", "\u295A": "LeftTeeVector", "\u295B": "RightTeeVector", "\u295C": "RightUpTeeVector", "\u295D": "RightDownTeeVector", "\u295E": "DownLeftTeeVector", "\u295F": "DownRightTeeVector", "\u2960": "LeftUpTeeVector", "\u2961": "LeftDownTeeVector", "\u2962": "lHar", "\u2963": "uHar", "\u2964": "rHar", "\u2965": "dHar", "\u2966": "luruhar", "\u2967": "ldrdhar", "\u2968": "ruluhar", "\u2969": "rdldhar", "\u296A": "lharul", "\u296B": "llhard", "\u296C": "rharul", "\u296D": "lrhard", "\u296E": "udhar", "\u296F": "duhar", "\u2970": "RoundImplies", "\u2971": "erarr", "\u2972": "simrarr", "\u2973": "larrsim", "\u2974": "rarrsim", "\u2975": "rarrap", "\u2976": "ltlarr", "\u2978": "gtrarr", "\u2979": "subrarr", "\u297B": "suplarr", "\u297C": "lfisht", "\u297D": "rfisht", "\u297E": "ufisht", "\u297F": "dfisht", "\u299A": "vzigzag", "\u299C": "vangrt", "\u299D": "angrtvbd", "\u29A4": "ange", "\u29A5": "range", "\u29A6": "dwangle", "\u29A7": "uwangle", "\u29A8": "angmsdaa", "\u29A9": "angmsdab", "\u29AA": "angmsdac", "\u29AB": "angmsdad", "\u29AC": "angmsdae", "\u29AD": "angmsdaf", "\u29AE": "angmsdag", "\u29AF": "angmsdah", "\u29B0": "bemptyv", "\u29B1": "demptyv", "\u29B2": "cemptyv", "\u29B3": "raemptyv", "\u29B4": "laemptyv", "\u29B5": "ohbar", "\u29B6": "omid", "\u29B7": "opar", "\u29B9": "operp", "\u29BB": "olcross", "\u29BC": "odsold", "\u29BE": "olcir", "\u29BF": "ofcir", "\u29C0": "olt", "\u29C1": "ogt", "\u29C2": "cirscir", "\u29C3": "cirE", "\u29C4": "solb", "\u29C5": "bsolb", "\u29C9": "boxbox", "\u29CD": "trisb", "\u29CE": "rtriltri", "\u29CF": "LeftTriangleBar", "\u29CF\u0338": "NotLeftTriangleBar", "\u29D0": "RightTriangleBar", "\u29D0\u0338": "NotRightTriangleBar", "\u29DC": "iinfin", "\u29DD": "infintie", "\u29DE": "nvinfin", "\u29E3": "eparsl", "\u29E4": "smeparsl", "\u29E5": "eqvparsl", "\u29EB": "lozf", "\u29F4": "RuleDelayed", "\u29F6": "dsol", "\u2A00": "xodot", "\u2A01": "xoplus", "\u2A02": "xotime", "\u2A04": "xuplus", "\u2A06": "xsqcup", "\u2A0D": "fpartint", "\u2A10": "cirfnint", "\u2A11": "awint", "\u2A12": "rppolint", "\u2A13": "scpolint", "\u2A14": "npolint", "\u2A15": "pointint", "\u2A16": "quatint", "\u2A17": "intlarhk", "\u2A22": "pluscir", "\u2A23": "plusacir", "\u2A24": "simplus", "\u2A25": "plusdu", "\u2A26": "plussim", "\u2A27": "plustwo", "\u2A29": "mcomma", "\u2A2A": "minusdu", "\u2A2D": "loplus", "\u2A2E": "roplus", "\u2A2F": "Cross", "\u2A30": "timesd", "\u2A31": "timesbar", "\u2A33": "smashp", "\u2A34": "lotimes", "\u2A35": "rotimes", "\u2A36": "otimesas", "\u2A37": "Otimes", "\u2A38": "odiv", "\u2A39": "triplus", "\u2A3A": "triminus", "\u2A3B": "tritime", "\u2A3C": "iprod", "\u2A3F": "amalg", "\u2A40": "capdot", "\u2A42": "ncup", "\u2A43": "ncap", "\u2A44": "capand", "\u2A45": "cupor", "\u2A46": "cupcap", "\u2A47": "capcup", "\u2A48": "cupbrcap", "\u2A49": "capbrcup", "\u2A4A": "cupcup", "\u2A4B": "capcap", "\u2A4C": "ccups", "\u2A4D": "ccaps", "\u2A50": "ccupssm", "\u2A53": "And", "\u2A54": "Or", "\u2A55": "andand", "\u2A56": "oror", "\u2A57": "orslope", "\u2A58": "andslope", "\u2A5A": "andv", "\u2A5B": "orv", "\u2A5C": "andd", "\u2A5D": "ord", "\u2A5F": "wedbar", "\u2A66": "sdote", "\u2A6A": "simdot", "\u2A6D": "congdot", "\u2A6D\u0338": "ncongdot", "\u2A6E": "easter", "\u2A6F": "apacir", "\u2A70": "apE", "\u2A70\u0338": "napE", "\u2A71": "eplus", "\u2A72": "pluse", "\u2A73": "Esim", "\u2A77": "eDDot", "\u2A78": "equivDD", "\u2A79": "ltcir", "\u2A7A": "gtcir", "\u2A7B": "ltquest", "\u2A7C": "gtquest", "\u2A7D": "les", "\u2A7D\u0338": "nles", "\u2A7E": "ges", "\u2A7E\u0338": "nges", "\u2A7F": "lesdot", "\u2A80": "gesdot", "\u2A81": "lesdoto", "\u2A82": "gesdoto", "\u2A83": "lesdotor", "\u2A84": "gesdotol", "\u2A85": "lap", "\u2A86": "gap", "\u2A87": "lne", "\u2A88": "gne", "\u2A89": "lnap", "\u2A8A": "gnap", "\u2A8B": "lEg", "\u2A8C": "gEl", "\u2A8D": "lsime", "\u2A8E": "gsime", "\u2A8F": "lsimg", "\u2A90": "gsiml", "\u2A91": "lgE", "\u2A92": "glE", "\u2A93": "lesges", "\u2A94": "gesles", "\u2A95": "els", "\u2A96": "egs", "\u2A97": "elsdot", "\u2A98": "egsdot", "\u2A99": "el", "\u2A9A": "eg", "\u2A9D": "siml", "\u2A9E": "simg", "\u2A9F": "simlE", "\u2AA0": "simgE", "\u2AA1": "LessLess", "\u2AA1\u0338": "NotNestedLessLess", "\u2AA2": "GreaterGreater", "\u2AA2\u0338": "NotNestedGreaterGreater", "\u2AA4": "glj", "\u2AA5": "gla", "\u2AA6": "ltcc", "\u2AA7": "gtcc", "\u2AA8": "lescc", "\u2AA9": "gescc", "\u2AAA": "smt", "\u2AAB": "lat", "\u2AAC": "smte", "\u2AAC\uFE00": "smtes", "\u2AAD": "late", "\u2AAD\uFE00": "lates", "\u2AAE": "bumpE", "\u2AAF": "pre", "\u2AAF\u0338": "npre", "\u2AB0": "sce", "\u2AB0\u0338": "nsce", "\u2AB3": "prE", "\u2AB4": "scE", "\u2AB5": "prnE", "\u2AB6": "scnE", "\u2AB7": "prap", "\u2AB8": "scap", "\u2AB9": "prnap", "\u2ABA": "scnap", "\u2ABB": "Pr", "\u2ABC": "Sc", "\u2ABD": "subdot", "\u2ABE": "supdot", "\u2ABF": "subplus", "\u2AC0": "supplus", "\u2AC1": "submult", "\u2AC2": "supmult", "\u2AC3": "subedot", "\u2AC4": "supedot", "\u2AC5": "subE", "\u2AC5\u0338": "nsubE", "\u2AC6": "supE", "\u2AC6\u0338": "nsupE", "\u2AC7": "subsim", "\u2AC8": "supsim", "\u2ACB\uFE00": "vsubnE", "\u2ACB": "subnE", "\u2ACC\uFE00": "vsupnE", "\u2ACC": "supnE", "\u2ACF": "csub", "\u2AD0": "csup", "\u2AD1": "csube", "\u2AD2": "csupe", "\u2AD3": "subsup", "\u2AD4": "supsub", "\u2AD5": "subsub", "\u2AD6": "supsup", "\u2AD7": "suphsub", "\u2AD8": "supdsub", "\u2AD9": "forkv", "\u2ADA": "topfork", "\u2ADB": "mlcp", "\u2AE4": "Dashv", "\u2AE6": "Vdashl", "\u2AE7": "Barv", "\u2AE8": "vBar", "\u2AE9": "vBarv", "\u2AEB": "Vbar", "\u2AEC": "Not", "\u2AED": "bNot", "\u2AEE": "rnmid", "\u2AEF": "cirmid", "\u2AF0": "midcir", "\u2AF1": "topcir", "\u2AF2": "nhpar", "\u2AF3": "parsim", "\u2AFD": "parsl", "\u2AFD\u20E5": "nparsl", "\u266D": "flat", "\u266E": "natur", "\u266F": "sharp", "\xA4": "curren", "\xA2": "cent", "$": "dollar", "\xA3": "pound", "\xA5": "yen", "\u20AC": "euro", "\xB9": "sup1", "\xBD": "half", "\u2153": "frac13", "\xBC": "frac14", "\u2155": "frac15", "\u2159": "frac16", "\u215B": "frac18", "\xB2": "sup2", "\u2154": "frac23", "\u2156": "frac25", "\xB3": "sup3", "\xBE": "frac34", "\u2157": "frac35", "\u215C": "frac38", "\u2158": "frac45", "\u215A": "frac56", "\u215D": "frac58", "\u215E": "frac78", "\u{1D4B6}": "ascr", "\u{1D552}": "aopf", "\u{1D51E}": "afr", "\u{1D538}": "Aopf", "\u{1D504}": "Afr", "\u{1D49C}": "Ascr", "\xAA": "ordf", "\xE1": "aacute", "\xC1": "Aacute", "\xE0": "agrave", "\xC0": "Agrave", "\u0103": "abreve", "\u0102": "Abreve", "\xE2": "acirc", "\xC2": "Acirc", "\xE5": "aring", "\xC5": "angst", "\xE4": "auml", "\xC4": "Auml", "\xE3": "atilde", "\xC3": "Atilde", "\u0105": "aogon", "\u0104": "Aogon", "\u0101": "amacr", "\u0100": "Amacr", "\xE6": "aelig", "\xC6": "AElig", "\u{1D4B7}": "bscr", "\u{1D553}": "bopf", "\u{1D51F}": "bfr", "\u{1D539}": "Bopf", "\u212C": "Bscr", "\u{1D505}": "Bfr", "\u{1D520}": "cfr", "\u{1D4B8}": "cscr", "\u{1D554}": "copf", "\u212D": "Cfr", "\u{1D49E}": "Cscr", "\u2102": "Copf", "\u0107": "cacute", "\u0106": "Cacute", "\u0109": "ccirc", "\u0108": "Ccirc", "\u010D": "ccaron", "\u010C": "Ccaron", "\u010B": "cdot", "\u010A": "Cdot", "\xE7": "ccedil", "\xC7": "Ccedil", "\u2105": "incare", "\u{1D521}": "dfr", "\u2146": "dd", "\u{1D555}": "dopf", "\u{1D4B9}": "dscr", "\u{1D49F}": "Dscr", "\u{1D507}": "Dfr", "\u2145": "DD", "\u{1D53B}": "Dopf", "\u010F": "dcaron", "\u010E": "Dcaron", "\u0111": "dstrok", "\u0110": "Dstrok", "\xF0": "eth", "\xD0": "ETH", "\u2147": "ee", "\u212F": "escr", "\u{1D522}": "efr", "\u{1D556}": "eopf", "\u2130": "Escr", "\u{1D508}": "Efr", "\u{1D53C}": "Eopf", "\xE9": "eacute", "\xC9": "Eacute", "\xE8": "egrave", "\xC8": "Egrave", "\xEA": "ecirc", "\xCA": "Ecirc", "\u011B": "ecaron", "\u011A": "Ecaron", "\xEB": "euml", "\xCB": "Euml", "\u0117": "edot", "\u0116": "Edot", "\u0119": "eogon", "\u0118": "Eogon", "\u0113": "emacr", "\u0112": "Emacr", "\u{1D523}": "ffr", "\u{1D557}": "fopf", "\u{1D4BB}": "fscr", "\u{1D509}": "Ffr", "\u{1D53D}": "Fopf", "\u2131": "Fscr", "\uFB00": "fflig", "\uFB03": "ffilig", "\uFB04": "ffllig", "\uFB01": "filig", "fj": "fjlig", "\uFB02": "fllig", "\u0192": "fnof", "\u210A": "gscr", "\u{1D558}": "gopf", "\u{1D524}": "gfr", "\u{1D4A2}": "Gscr", "\u{1D53E}": "Gopf", "\u{1D50A}": "Gfr", "\u01F5": "gacute", "\u011F": "gbreve", "\u011E": "Gbreve", "\u011D": "gcirc", "\u011C": "Gcirc", "\u0121": "gdot", "\u0120": "Gdot", "\u0122": "Gcedil", "\u{1D525}": "hfr", "\u210E": "planckh", "\u{1D4BD}": "hscr", "\u{1D559}": "hopf", "\u210B": "Hscr", "\u210C": "Hfr", "\u210D": "Hopf", "\u0125": "hcirc", "\u0124": "Hcirc", "\u210F": "hbar", "\u0127": "hstrok", "\u0126": "Hstrok", "\u{1D55A}": "iopf", "\u{1D526}": "ifr", "\u{1D4BE}": "iscr", "\u2148": "ii", "\u{1D540}": "Iopf", "\u2110": "Iscr", "\u2111": "Im", "\xED": "iacute", "\xCD": "Iacute", "\xEC": "igrave", "\xCC": "Igrave", "\xEE": "icirc", "\xCE": "Icirc", "\xEF": "iuml", "\xCF": "Iuml", "\u0129": "itilde", "\u0128": "Itilde", "\u0130": "Idot", "\u012F": "iogon", "\u012E": "Iogon", "\u012B": "imacr", "\u012A": "Imacr", "\u0133": "ijlig", "\u0132": "IJlig", "\u0131": "imath", "\u{1D4BF}": "jscr", "\u{1D55B}": "jopf", "\u{1D527}": "jfr", "\u{1D4A5}": "Jscr", "\u{1D50D}": "Jfr", "\u{1D541}": "Jopf", "\u0135": "jcirc", "\u0134": "Jcirc", "\u0237": "jmath", "\u{1D55C}": "kopf", "\u{1D4C0}": "kscr", "\u{1D528}": "kfr", "\u{1D4A6}": "Kscr", "\u{1D542}": "Kopf", "\u{1D50E}": "Kfr", "\u0137": "kcedil", "\u0136": "Kcedil", "\u{1D529}": "lfr", "\u{1D4C1}": "lscr", "\u2113": "ell", "\u{1D55D}": "lopf", "\u2112": "Lscr", "\u{1D50F}": "Lfr", "\u{1D543}": "Lopf", "\u013A": "lacute", "\u0139": "Lacute", "\u013E": "lcaron", "\u013D": "Lcaron", "\u013C": "lcedil", "\u013B": "Lcedil", "\u0142": "lstrok", "\u0141": "Lstrok", "\u0140": "lmidot", "\u013F": "Lmidot", "\u{1D52A}": "mfr", "\u{1D55E}": "mopf", "\u{1D4C2}": "mscr", "\u{1D510}": "Mfr", "\u{1D544}": "Mopf", "\u2133": "Mscr", "\u{1D52B}": "nfr", "\u{1D55F}": "nopf", "\u{1D4C3}": "nscr", "\u2115": "Nopf", "\u{1D4A9}": "Nscr", "\u{1D511}": "Nfr", "\u0144": "nacute", "\u0143": "Nacute", "\u0148": "ncaron", "\u0147": "Ncaron", "\xF1": "ntilde", "\xD1": "Ntilde", "\u0146": "ncedil", "\u0145": "Ncedil", "\u2116": "numero", "\u014B": "eng", "\u014A": "ENG", "\u{1D560}": "oopf", "\u{1D52C}": "ofr", "\u2134": "oscr", "\u{1D4AA}": "Oscr", "\u{1D512}": "Ofr", "\u{1D546}": "Oopf", "\xBA": "ordm", "\xF3": "oacute", "\xD3": "Oacute", "\xF2": "ograve", "\xD2": "Ograve", "\xF4": "ocirc", "\xD4": "Ocirc", "\xF6": "ouml", "\xD6": "Ouml", "\u0151": "odblac", "\u0150": "Odblac", "\xF5": "otilde", "\xD5": "Otilde", "\xF8": "oslash", "\xD8": "Oslash", "\u014D": "omacr", "\u014C": "Omacr", "\u0153": "oelig", "\u0152": "OElig", "\u{1D52D}": "pfr", "\u{1D4C5}": "pscr", "\u{1D561}": "popf", "\u2119": "Popf", "\u{1D513}": "Pfr", "\u{1D4AB}": "Pscr", "\u{1D562}": "qopf", "\u{1D52E}": "qfr", "\u{1D4C6}": "qscr", "\u{1D4AC}": "Qscr", "\u{1D514}": "Qfr", "\u211A": "Qopf", "\u0138": "kgreen", "\u{1D52F}": "rfr", "\u{1D563}": "ropf", "\u{1D4C7}": "rscr", "\u211B": "Rscr", "\u211C": "Re", "\u211D": "Ropf", "\u0155": "racute", "\u0154": "Racute", "\u0159": "rcaron", "\u0158": "Rcaron", "\u0157": "rcedil", "\u0156": "Rcedil", "\u{1D564}": "sopf", "\u{1D4C8}": "sscr", "\u{1D530}": "sfr", "\u{1D54A}": "Sopf", "\u{1D516}": "Sfr", "\u{1D4AE}": "Sscr", "\u24C8": "oS", "\u015B": "sacute", "\u015A": "Sacute", "\u015D": "scirc", "\u015C": "Scirc", "\u0161": "scaron", "\u0160": "Scaron", "\u015F": "scedil", "\u015E": "Scedil", "\xDF": "szlig", "\u{1D531}": "tfr", "\u{1D4C9}": "tscr", "\u{1D565}": "topf", "\u{1D4AF}": "Tscr", "\u{1D517}": "Tfr", "\u{1D54B}": "Topf", "\u0165": "tcaron", "\u0164": "Tcaron", "\u0163": "tcedil", "\u0162": "Tcedil", "\u2122": "trade", "\u0167": "tstrok", "\u0166": "Tstrok", "\u{1D4CA}": "uscr", "\u{1D566}": "uopf", "\u{1D532}": "ufr", "\u{1D54C}": "Uopf", "\u{1D518}": "Ufr", "\u{1D4B0}": "Uscr", "\xFA": "uacute", "\xDA": "Uacute", "\xF9": "ugrave", "\xD9": "Ugrave", "\u016D": "ubreve", "\u016C": "Ubreve", "\xFB": "ucirc", "\xDB": "Ucirc", "\u016F": "uring", "\u016E": "Uring", "\xFC": "uuml", "\xDC": "Uuml", "\u0171": "udblac", "\u0170": "Udblac", "\u0169": "utilde", "\u0168": "Utilde", "\u0173": "uogon", "\u0172": "Uogon", "\u016B": "umacr", "\u016A": "Umacr", "\u{1D533}": "vfr", "\u{1D567}": "vopf", "\u{1D4CB}": "vscr", "\u{1D519}": "Vfr", "\u{1D54D}": "Vopf", "\u{1D4B1}": "Vscr", "\u{1D568}": "wopf", "\u{1D4CC}": "wscr", "\u{1D534}": "wfr", "\u{1D4B2}": "Wscr", "\u{1D54E}": "Wopf", "\u{1D51A}": "Wfr", "\u0175": "wcirc", "\u0174": "Wcirc", "\u{1D535}": "xfr", "\u{1D4CD}": "xscr", "\u{1D569}": "xopf", "\u{1D54F}": "Xopf", "\u{1D51B}": "Xfr", "\u{1D4B3}": "Xscr", "\u{1D536}": "yfr", "\u{1D4CE}": "yscr", "\u{1D56A}": "yopf", "\u{1D4B4}": "Yscr", "\u{1D51C}": "Yfr", "\u{1D550}": "Yopf", "\xFD": "yacute", "\xDD": "Yacute", "\u0177": "ycirc", "\u0176": "Ycirc", "\xFF": "yuml", "\u0178": "Yuml", "\u{1D4CF}": "zscr", "\u{1D537}": "zfr", "\u{1D56B}": "zopf", "\u2128": "Zfr", "\u2124": "Zopf", "\u{1D4B5}": "Zscr", "\u017A": "zacute", "\u0179": "Zacute", "\u017E": "zcaron", "\u017D": "Zcaron", "\u017C": "zdot", "\u017B": "Zdot", "\u01B5": "imped", "\xFE": "thorn", "\xDE": "THORN", "\u0149": "napos", "\u03B1": "alpha", "\u0391": "Alpha", "\u03B2": "beta", "\u0392": "Beta", "\u03B3": "gamma", "\u0393": "Gamma", "\u03B4": "delta", "\u0394": "Delta", "\u03B5": "epsi", "\u03F5": "epsiv", "\u0395": "Epsilon", "\u03DD": "gammad", "\u03DC": "Gammad", "\u03B6": "zeta", "\u0396": "Zeta", "\u03B7": "eta", "\u0397": "Eta", "\u03B8": "theta", "\u03D1": "thetav", "\u0398": "Theta", "\u03B9": "iota", "\u0399": "Iota", "\u03BA": "kappa", "\u03F0": "kappav", "\u039A": "Kappa", "\u03BB": "lambda", "\u039B": "Lambda", "\u03BC": "mu", "\xB5": "micro", "\u039C": "Mu", "\u03BD": "nu", "\u039D": "Nu", "\u03BE": "xi", "\u039E": "Xi", "\u03BF": "omicron", "\u039F": "Omicron", "\u03C0": "pi", "\u03D6": "piv", "\u03A0": "Pi", "\u03C1": "rho", "\u03F1": "rhov", "\u03A1": "Rho", "\u03C3": "sigma", "\u03A3": "Sigma", "\u03C2": "sigmaf", "\u03C4": "tau", "\u03A4": "Tau", "\u03C5": "upsi", "\u03A5": "Upsilon", "\u03D2": "Upsi", "\u03C6": "phi", "\u03D5": "phiv", "\u03A6": "Phi", "\u03C7": "chi", "\u03A7": "Chi", "\u03C8": "psi", "\u03A8": "Psi", "\u03C9": "omega", "\u03A9": "ohm", "\u0430": "acy", "\u0410": "Acy", "\u0431": "bcy", "\u0411": "Bcy", "\u0432": "vcy", "\u0412": "Vcy", "\u0433": "gcy", "\u0413": "Gcy", "\u0453": "gjcy", "\u0403": "GJcy", "\u0434": "dcy", "\u0414": "Dcy", "\u0452": "djcy", "\u0402": "DJcy", "\u0435": "iecy", "\u0415": "IEcy", "\u0451": "iocy", "\u0401": "IOcy", "\u0454": "jukcy", "\u0404": "Jukcy", "\u0436": "zhcy", "\u0416": "ZHcy", "\u0437": "zcy", "\u0417": "Zcy", "\u0455": "dscy", "\u0405": "DScy", "\u0438": "icy", "\u0418": "Icy", "\u0456": "iukcy", "\u0406": "Iukcy", "\u0457": "yicy", "\u0407": "YIcy", "\u0439": "jcy", "\u0419": "Jcy", "\u0458": "jsercy", "\u0408": "Jsercy", "\u043A": "kcy", "\u041A": "Kcy", "\u045C": "kjcy", "\u040C": "KJcy", "\u043B": "lcy", "\u041B": "Lcy", "\u0459": "ljcy", "\u0409": "LJcy", "\u043C": "mcy", "\u041C": "Mcy", "\u043D": "ncy", "\u041D": "Ncy", "\u045A": "njcy", "\u040A": "NJcy", "\u043E": "ocy", "\u041E": "Ocy", "\u043F": "pcy", "\u041F": "Pcy", "\u0440": "rcy", "\u0420": "Rcy", "\u0441": "scy", "\u0421": "Scy", "\u0442": "tcy", "\u0422": "Tcy", "\u045B": "tshcy", "\u040B": "TSHcy", "\u0443": "ucy", "\u0423": "Ucy", "\u045E": "ubrcy", "\u040E": "Ubrcy", "\u0444": "fcy", "\u0424": "Fcy", "\u0445": "khcy", "\u0425": "KHcy", "\u0446": "tscy", "\u0426": "TScy", "\u0447": "chcy", "\u0427": "CHcy", "\u045F": "dzcy", "\u040F": "DZcy", "\u0448": "shcy", "\u0428": "SHcy", "\u0449": "shchcy", "\u0429": "SHCHcy", "\u044A": "hardcy", "\u042A": "HARDcy", "\u044B": "ycy", "\u042B": "Ycy", "\u044C": "softcy", "\u042C": "SOFTcy", "\u044D": "ecy", "\u042D": "Ecy", "\u044E": "yucy", "\u042E": "YUcy", "\u044F": "yacy", "\u042F": "YAcy", "\u2135": "aleph", "\u2136": "beth", "\u2137": "gimel", "\u2138": "daleth" };
      var regexEscape = /["&'<>`]/g;
      var escapeMap = {
        '"': "&quot;",
        "&": "&amp;",
        "'": "&#x27;",
        "<": "&lt;",
        // See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
        // following is not strictly necessary unless it’s part of a tag or an
        // unquoted attribute value. We’re only escaping it to support those
        // situations, and for XML support.
        ">": "&gt;",
        // In Internet Explorer ≤ 8, the backtick character can be used
        // to break out of (un)quoted attribute values or HTML comments.
        // See http://html5sec.org/#102, http://html5sec.org/#108, and
        // http://html5sec.org/#133.
        "`": "&#x60;"
      };
      var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
      var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      var regexDecode = /&(CounterClockwiseContourIntegral|DoubleLongLeftRightArrow|ClockwiseContourIntegral|NotNestedGreaterGreater|NotSquareSupersetEqual|DiacriticalDoubleAcute|NotRightTriangleEqual|NotSucceedsSlantEqual|NotPrecedesSlantEqual|CloseCurlyDoubleQuote|NegativeVeryThinSpace|DoubleContourIntegral|FilledVerySmallSquare|CapitalDifferentialD|OpenCurlyDoubleQuote|EmptyVerySmallSquare|NestedGreaterGreater|DoubleLongRightArrow|NotLeftTriangleEqual|NotGreaterSlantEqual|ReverseUpEquilibrium|DoubleLeftRightArrow|NotSquareSubsetEqual|NotDoubleVerticalBar|RightArrowLeftArrow|NotGreaterFullEqual|NotRightTriangleBar|SquareSupersetEqual|DownLeftRightVector|DoubleLongLeftArrow|leftrightsquigarrow|LeftArrowRightArrow|NegativeMediumSpace|blacktriangleright|RightDownVectorBar|PrecedesSlantEqual|RightDoubleBracket|SucceedsSlantEqual|NotLeftTriangleBar|RightTriangleEqual|SquareIntersection|RightDownTeeVector|ReverseEquilibrium|NegativeThickSpace|longleftrightarrow|Longleftrightarrow|LongLeftRightArrow|DownRightTeeVector|DownRightVectorBar|GreaterSlantEqual|SquareSubsetEqual|LeftDownVectorBar|LeftDoubleBracket|VerticalSeparator|rightleftharpoons|NotGreaterGreater|NotSquareSuperset|blacktriangleleft|blacktriangledown|NegativeThinSpace|LeftDownTeeVector|NotLessSlantEqual|leftrightharpoons|DoubleUpDownArrow|DoubleVerticalBar|LeftTriangleEqual|FilledSmallSquare|twoheadrightarrow|NotNestedLessLess|DownLeftTeeVector|DownLeftVectorBar|RightAngleBracket|NotTildeFullEqual|NotReverseElement|RightUpDownVector|DiacriticalTilde|NotSucceedsTilde|circlearrowright|NotPrecedesEqual|rightharpoondown|DoubleRightArrow|NotSucceedsEqual|NonBreakingSpace|NotRightTriangle|LessEqualGreater|RightUpTeeVector|LeftAngleBracket|GreaterFullEqual|DownArrowUpArrow|RightUpVectorBar|twoheadleftarrow|GreaterEqualLess|downharpoonright|RightTriangleBar|ntrianglerighteq|NotSupersetEqual|LeftUpDownVector|DiacriticalAcute|rightrightarrows|vartriangleright|UpArrowDownArrow|DiacriticalGrave|UnderParenthesis|EmptySmallSquare|LeftUpVectorBar|leftrightarrows|DownRightVector|downharpoonleft|trianglerighteq|ShortRightArrow|OverParenthesis|DoubleLeftArrow|DoubleDownArrow|NotSquareSubset|bigtriangledown|ntrianglelefteq|UpperRightArrow|curvearrowright|vartriangleleft|NotLeftTriangle|nleftrightarrow|LowerRightArrow|NotHumpDownHump|NotGreaterTilde|rightthreetimes|LeftUpTeeVector|NotGreaterEqual|straightepsilon|LeftTriangleBar|rightsquigarrow|ContourIntegral|rightleftarrows|CloseCurlyQuote|RightDownVector|LeftRightVector|nLeftrightarrow|leftharpoondown|circlearrowleft|SquareSuperset|OpenCurlyQuote|hookrightarrow|HorizontalLine|DiacriticalDot|NotLessGreater|ntriangleright|DoubleRightTee|InvisibleComma|InvisibleTimes|LowerLeftArrow|DownLeftVector|NotSubsetEqual|curvearrowleft|trianglelefteq|NotVerticalBar|TildeFullEqual|downdownarrows|NotGreaterLess|RightTeeVector|ZeroWidthSpace|looparrowright|LongRightArrow|doublebarwedge|ShortLeftArrow|ShortDownArrow|RightVectorBar|GreaterGreater|ReverseElement|rightharpoonup|LessSlantEqual|leftthreetimes|upharpoonright|rightarrowtail|LeftDownVector|Longrightarrow|NestedLessLess|UpperLeftArrow|nshortparallel|leftleftarrows|leftrightarrow|Leftrightarrow|LeftRightArrow|longrightarrow|upharpoonleft|RightArrowBar|ApplyFunction|LeftTeeVector|leftarrowtail|NotEqualTilde|varsubsetneqq|varsupsetneqq|RightTeeArrow|SucceedsEqual|SucceedsTilde|LeftVectorBar|SupersetEqual|hookleftarrow|DifferentialD|VerticalTilde|VeryThinSpace|blacktriangle|bigtriangleup|LessFullEqual|divideontimes|leftharpoonup|UpEquilibrium|ntriangleleft|RightTriangle|measuredangle|shortparallel|longleftarrow|Longleftarrow|LongLeftArrow|DoubleLeftTee|Poincareplane|PrecedesEqual|triangleright|DoubleUpArrow|RightUpVector|fallingdotseq|looparrowleft|PrecedesTilde|NotTildeEqual|NotTildeTilde|smallsetminus|Proportional|triangleleft|triangledown|UnderBracket|NotHumpEqual|exponentiale|ExponentialE|NotLessTilde|HilbertSpace|RightCeiling|blacklozenge|varsupsetneq|HumpDownHump|GreaterEqual|VerticalLine|LeftTeeArrow|NotLessEqual|DownTeeArrow|LeftTriangle|varsubsetneq|Intersection|NotCongruent|DownArrowBar|LeftUpVector|LeftArrowBar|risingdotseq|GreaterTilde|RoundImplies|SquareSubset|ShortUpArrow|NotSuperset|quaternions|precnapprox|backepsilon|preccurlyeq|OverBracket|blacksquare|MediumSpace|VerticalBar|circledcirc|circleddash|CircleMinus|CircleTimes|LessGreater|curlyeqprec|curlyeqsucc|diamondsuit|UpDownArrow|Updownarrow|RuleDelayed|Rrightarrow|updownarrow|RightVector|nRightarrow|nrightarrow|eqslantless|LeftCeiling|Equilibrium|SmallCircle|expectation|NotSucceeds|thickapprox|GreaterLess|SquareUnion|NotPrecedes|NotLessLess|straightphi|succnapprox|succcurlyeq|SubsetEqual|sqsupseteq|Proportion|Laplacetrf|ImaginaryI|supsetneqq|NotGreater|gtreqqless|NotElement|ThickSpace|TildeEqual|TildeTilde|Fouriertrf|rmoustache|EqualTilde|eqslantgtr|UnderBrace|LeftVector|UpArrowBar|nLeftarrow|nsubseteqq|subsetneqq|nsupseteqq|nleftarrow|succapprox|lessapprox|UpTeeArrow|upuparrows|curlywedge|lesseqqgtr|varepsilon|varnothing|RightFloor|complement|CirclePlus|sqsubseteq|Lleftarrow|circledast|RightArrow|Rightarrow|rightarrow|lmoustache|Bernoullis|precapprox|mapstoleft|mapstodown|longmapsto|dotsquare|downarrow|DoubleDot|nsubseteq|supsetneq|leftarrow|nsupseteq|subsetneq|ThinSpace|ngeqslant|subseteqq|HumpEqual|NotSubset|triangleq|NotCupCap|lesseqgtr|heartsuit|TripleDot|Leftarrow|Coproduct|Congruent|varpropto|complexes|gvertneqq|LeftArrow|LessTilde|supseteqq|MinusPlus|CircleDot|nleqslant|NotExists|gtreqless|nparallel|UnionPlus|LeftFloor|checkmark|CenterDot|centerdot|Mellintrf|gtrapprox|bigotimes|OverBrace|spadesuit|therefore|pitchfork|rationals|PlusMinus|Backslash|Therefore|DownBreve|backsimeq|backprime|DownArrow|nshortmid|Downarrow|lvertneqq|eqvparsl|imagline|imagpart|infintie|integers|Integral|intercal|LessLess|Uarrocir|intlarhk|sqsupset|angmsdaf|sqsubset|llcorner|vartheta|cupbrcap|lnapprox|Superset|SuchThat|succnsim|succneqq|angmsdag|biguplus|curlyvee|trpezium|Succeeds|NotTilde|bigwedge|angmsdah|angrtvbd|triminus|cwconint|fpartint|lrcorner|smeparsl|subseteq|urcorner|lurdshar|laemptyv|DDotrahd|approxeq|ldrushar|awconint|mapstoup|backcong|shortmid|triangle|geqslant|gesdotol|timesbar|circledR|circledS|setminus|multimap|naturals|scpolint|ncongdot|RightTee|boxminus|gnapprox|boxtimes|andslope|thicksim|angmsdaa|varsigma|cirfnint|rtriltri|angmsdab|rppolint|angmsdac|barwedge|drbkarow|clubsuit|thetasym|bsolhsub|capbrcup|dzigrarr|doteqdot|DotEqual|dotminus|UnderBar|NotEqual|realpart|otimesas|ulcorner|hksearow|hkswarow|parallel|PartialD|elinters|emptyset|plusacir|bbrktbrk|angmsdad|pointint|bigoplus|angmsdae|Precedes|bigsqcup|varkappa|notindot|supseteq|precneqq|precnsim|profalar|profline|profsurf|leqslant|lesdotor|raemptyv|subplus|notnivb|notnivc|subrarr|zigrarr|vzigzag|submult|subedot|Element|between|cirscir|larrbfs|larrsim|lotimes|lbrksld|lbrkslu|lozenge|ldrdhar|dbkarow|bigcirc|epsilon|simrarr|simplus|ltquest|Epsilon|luruhar|gtquest|maltese|npolint|eqcolon|npreceq|bigodot|ddagger|gtrless|bnequiv|harrcir|ddotseq|equivDD|backsim|demptyv|nsqsube|nsqsupe|Upsilon|nsubset|upsilon|minusdu|nsucceq|swarrow|nsupset|coloneq|searrow|boxplus|napprox|natural|asympeq|alefsym|congdot|nearrow|bigstar|diamond|supplus|tritime|LeftTee|nvinfin|triplus|NewLine|nvltrie|nvrtrie|nwarrow|nexists|Diamond|ruluhar|Implies|supmult|angzarr|suplarr|suphsub|questeq|because|digamma|Because|olcross|bemptyv|omicron|Omicron|rotimes|NoBreak|intprod|angrtvb|orderof|uwangle|suphsol|lesdoto|orslope|DownTee|realine|cudarrl|rdldhar|OverBar|supedot|lessdot|supdsub|topfork|succsim|rbrkslu|rbrksld|pertenk|cudarrr|isindot|planckh|lessgtr|pluscir|gesdoto|plussim|plustwo|lesssim|cularrp|rarrsim|Cayleys|notinva|notinvb|notinvc|UpArrow|Uparrow|uparrow|NotLess|dwangle|precsim|Product|curarrm|Cconint|dotplus|rarrbfs|ccupssm|Cedilla|cemptyv|notniva|quatint|frac35|frac38|frac45|frac56|frac58|frac78|tridot|xoplus|gacute|gammad|Gammad|lfisht|lfloor|bigcup|sqsupe|gbreve|Gbreve|lharul|sqsube|sqcups|Gcedil|apacir|llhard|lmidot|Lmidot|lmoust|andand|sqcaps|approx|Abreve|spades|circeq|tprime|divide|topcir|Assign|topbot|gesdot|divonx|xuplus|timesd|gesles|atilde|solbar|SOFTcy|loplus|timesb|lowast|lowbar|dlcorn|dlcrop|softcy|dollar|lparlt|thksim|lrhard|Atilde|lsaquo|smashp|bigvee|thinsp|wreath|bkarow|lsquor|lstrok|Lstrok|lthree|ltimes|ltlarr|DotDot|simdot|ltrPar|weierp|xsqcup|angmsd|sigmav|sigmaf|zeetrf|Zcaron|zcaron|mapsto|vsupne|thetav|cirmid|marker|mcomma|Zacute|vsubnE|there4|gtlPar|vsubne|bottom|gtrarr|SHCHcy|shchcy|midast|midcir|middot|minusb|minusd|gtrdot|bowtie|sfrown|mnplus|models|colone|seswar|Colone|mstpos|searhk|gtrsim|nacute|Nacute|boxbox|telrec|hairsp|Tcedil|nbumpe|scnsim|ncaron|Ncaron|ncedil|Ncedil|hamilt|Scedil|nearhk|hardcy|HARDcy|tcedil|Tcaron|commat|nequiv|nesear|tcaron|target|hearts|nexist|varrho|scedil|Scaron|scaron|hellip|Sacute|sacute|hercon|swnwar|compfn|rtimes|rthree|rsquor|rsaquo|zacute|wedgeq|homtht|barvee|barwed|Barwed|rpargt|horbar|conint|swarhk|roplus|nltrie|hslash|hstrok|Hstrok|rmoust|Conint|bprime|hybull|hyphen|iacute|Iacute|supsup|supsub|supsim|varphi|coprod|brvbar|agrave|Supset|supset|igrave|Igrave|notinE|Agrave|iiiint|iinfin|copysr|wedbar|Verbar|vangrt|becaus|incare|verbar|inodot|bullet|drcorn|intcal|drcrop|cularr|vellip|Utilde|bumpeq|cupcap|dstrok|Dstrok|CupCap|cupcup|cupdot|eacute|Eacute|supdot|iquest|easter|ecaron|Ecaron|ecolon|isinsv|utilde|itilde|Itilde|curarr|succeq|Bumpeq|cacute|ulcrop|nparsl|Cacute|nprcue|egrave|Egrave|nrarrc|nrarrw|subsup|subsub|nrtrie|jsercy|nsccue|Jsercy|kappav|kcedil|Kcedil|subsim|ulcorn|nsimeq|egsdot|veebar|kgreen|capand|elsdot|Subset|subset|curren|aacute|lacute|Lacute|emptyv|ntilde|Ntilde|lagran|lambda|Lambda|capcap|Ugrave|langle|subdot|emsp13|numero|emsp14|nvdash|nvDash|nVdash|nVDash|ugrave|ufisht|nvHarr|larrfs|nvlArr|larrhk|larrlp|larrpl|nvrArr|Udblac|nwarhk|larrtl|nwnear|oacute|Oacute|latail|lAtail|sstarf|lbrace|odblac|Odblac|lbrack|udblac|odsold|eparsl|lcaron|Lcaron|ograve|Ograve|lcedil|Lcedil|Aacute|ssmile|ssetmn|squarf|ldquor|capcup|ominus|cylcty|rharul|eqcirc|dagger|rfloor|rfisht|Dagger|daleth|equals|origof|capdot|equest|dcaron|Dcaron|rdquor|oslash|Oslash|otilde|Otilde|otimes|Otimes|urcrop|Ubreve|ubreve|Yacute|Uacute|uacute|Rcedil|rcedil|urcorn|parsim|Rcaron|Vdashl|rcaron|Tstrok|percnt|period|permil|Exists|yacute|rbrack|rbrace|phmmat|ccaron|Ccaron|planck|ccedil|plankv|tstrok|female|plusdo|plusdu|ffilig|plusmn|ffllig|Ccedil|rAtail|dfisht|bernou|ratail|Rarrtl|rarrtl|angsph|rarrpl|rarrlp|rarrhk|xwedge|xotime|forall|ForAll|Vvdash|vsupnE|preceq|bigcap|frac12|frac13|frac14|primes|rarrfs|prnsim|frac15|Square|frac16|square|lesdot|frac18|frac23|propto|prurel|rarrap|rangle|puncsp|frac25|Racute|qprime|racute|lesges|frac34|abreve|AElig|eqsim|utdot|setmn|urtri|Equal|Uring|seArr|uring|searr|dashv|Dashv|mumap|nabla|iogon|Iogon|sdote|sdotb|scsim|napid|napos|equiv|natur|Acirc|dblac|erarr|nbump|iprod|erDot|ucirc|awint|esdot|angrt|ncong|isinE|scnap|Scirc|scirc|ndash|isins|Ubrcy|nearr|neArr|isinv|nedot|ubrcy|acute|Ycirc|iukcy|Iukcy|xutri|nesim|caret|jcirc|Jcirc|caron|twixt|ddarr|sccue|exist|jmath|sbquo|ngeqq|angst|ccaps|lceil|ngsim|UpTee|delta|Delta|rtrif|nharr|nhArr|nhpar|rtrie|jukcy|Jukcy|kappa|rsquo|Kappa|nlarr|nlArr|TSHcy|rrarr|aogon|Aogon|fflig|xrarr|tshcy|ccirc|nleqq|filig|upsih|nless|dharl|nlsim|fjlig|ropar|nltri|dharr|robrk|roarr|fllig|fltns|roang|rnmid|subnE|subne|lAarr|trisb|Ccirc|acirc|ccups|blank|VDash|forkv|Vdash|langd|cedil|blk12|blk14|laquo|strns|diams|notin|vDash|larrb|blk34|block|disin|uplus|vdash|vBarv|aelig|starf|Wedge|check|xrArr|lates|lbarr|lBarr|notni|lbbrk|bcong|frasl|lbrke|frown|vrtri|vprop|vnsup|gamma|Gamma|wedge|xodot|bdquo|srarr|doteq|ldquo|boxdl|boxdL|gcirc|Gcirc|boxDl|boxDL|boxdr|boxdR|boxDr|TRADE|trade|rlhar|boxDR|vnsub|npart|vltri|rlarr|boxhd|boxhD|nprec|gescc|nrarr|nrArr|boxHd|boxHD|boxhu|boxhU|nrtri|boxHu|clubs|boxHU|times|colon|Colon|gimel|xlArr|Tilde|nsime|tilde|nsmid|nspar|THORN|thorn|xlarr|nsube|nsubE|thkap|xhArr|comma|nsucc|boxul|boxuL|nsupe|nsupE|gneqq|gnsim|boxUl|boxUL|grave|boxur|boxuR|boxUr|boxUR|lescc|angle|bepsi|boxvh|varpi|boxvH|numsp|Theta|gsime|gsiml|theta|boxVh|boxVH|boxvl|gtcir|gtdot|boxvL|boxVl|boxVL|crarr|cross|Cross|nvsim|boxvr|nwarr|nwArr|sqsup|dtdot|Uogon|lhard|lharu|dtrif|ocirc|Ocirc|lhblk|duarr|odash|sqsub|Hacek|sqcup|llarr|duhar|oelig|OElig|ofcir|boxvR|uogon|lltri|boxVr|csube|uuarr|ohbar|csupe|ctdot|olarr|olcir|harrw|oline|sqcap|omacr|Omacr|omega|Omega|boxVR|aleph|lneqq|lnsim|loang|loarr|rharu|lobrk|hcirc|operp|oplus|rhard|Hcirc|orarr|Union|order|ecirc|Ecirc|cuepr|szlig|cuesc|breve|reals|eDDot|Breve|hoarr|lopar|utrif|rdquo|Umacr|umacr|efDot|swArr|ultri|alpha|rceil|ovbar|swarr|Wcirc|wcirc|smtes|smile|bsemi|lrarr|aring|parsl|lrhar|bsime|uhblk|lrtri|cupor|Aring|uharr|uharl|slarr|rbrke|bsolb|lsime|rbbrk|RBarr|lsimg|phone|rBarr|rbarr|icirc|lsquo|Icirc|emacr|Emacr|ratio|simne|plusb|simlE|simgE|simeq|pluse|ltcir|ltdot|empty|xharr|xdtri|iexcl|Alpha|ltrie|rarrw|pound|ltrif|xcirc|bumpe|prcue|bumpE|asymp|amacr|cuvee|Sigma|sigma|iiint|udhar|iiota|ijlig|IJlig|supnE|imacr|Imacr|prime|Prime|image|prnap|eogon|Eogon|rarrc|mdash|mDDot|cuwed|imath|supne|imped|Amacr|udarr|prsim|micro|rarrb|cwint|raquo|infin|eplus|range|rangd|Ucirc|radic|minus|amalg|veeeq|rAarr|epsiv|ycirc|quest|sharp|quot|zwnj|Qscr|race|qscr|Qopf|qopf|qint|rang|Rang|Zscr|zscr|Zopf|zopf|rarr|rArr|Rarr|Pscr|pscr|prop|prod|prnE|prec|ZHcy|zhcy|prap|Zeta|zeta|Popf|popf|Zdot|plus|zdot|Yuml|yuml|phiv|YUcy|yucy|Yscr|yscr|perp|Yopf|yopf|part|para|YIcy|Ouml|rcub|yicy|YAcy|rdca|ouml|osol|Oscr|rdsh|yacy|real|oscr|xvee|andd|rect|andv|Xscr|oror|ordm|ordf|xscr|ange|aopf|Aopf|rHar|Xopf|opar|Oopf|xopf|xnis|rhov|oopf|omid|xmap|oint|apid|apos|ogon|ascr|Ascr|odot|odiv|xcup|xcap|ocir|oast|nvlt|nvle|nvgt|nvge|nvap|Wscr|wscr|auml|ntlg|ntgl|nsup|nsub|nsim|Nscr|nscr|nsce|Wopf|ring|npre|wopf|npar|Auml|Barv|bbrk|Nopf|nopf|nmid|nLtv|beta|ropf|Ropf|Beta|beth|nles|rpar|nleq|bnot|bNot|nldr|NJcy|rscr|Rscr|Vscr|vscr|rsqb|njcy|bopf|nisd|Bopf|rtri|Vopf|nGtv|ngtr|vopf|boxh|boxH|boxv|nges|ngeq|boxV|bscr|scap|Bscr|bsim|Vert|vert|bsol|bull|bump|caps|cdot|ncup|scnE|ncap|nbsp|napE|Cdot|cent|sdot|Vbar|nang|vBar|chcy|Mscr|mscr|sect|semi|CHcy|Mopf|mopf|sext|circ|cire|mldr|mlcp|cirE|comp|shcy|SHcy|vArr|varr|cong|copf|Copf|copy|COPY|malt|male|macr|lvnE|cscr|ltri|sime|ltcc|simg|Cscr|siml|csub|Uuml|lsqb|lsim|uuml|csup|Lscr|lscr|utri|smid|lpar|cups|smte|lozf|darr|Lopf|Uscr|solb|lopf|sopf|Sopf|lneq|uscr|spar|dArr|lnap|Darr|dash|Sqrt|LJcy|ljcy|lHar|dHar|Upsi|upsi|diam|lesg|djcy|DJcy|leqq|dopf|Dopf|dscr|Dscr|dscy|ldsh|ldca|squf|DScy|sscr|Sscr|dsol|lcub|late|star|Star|Uopf|Larr|lArr|larr|uopf|dtri|dzcy|sube|subE|Lang|lang|Kscr|kscr|Kopf|kopf|KJcy|kjcy|KHcy|khcy|DZcy|ecir|edot|eDot|Jscr|jscr|succ|Jopf|jopf|Edot|uHar|emsp|ensp|Iuml|iuml|eopf|isin|Iscr|iscr|Eopf|epar|sung|epsi|escr|sup1|sup2|sup3|Iota|iota|supe|supE|Iopf|iopf|IOcy|iocy|Escr|esim|Esim|imof|Uarr|QUOT|uArr|uarr|euml|IEcy|iecy|Idot|Euml|euro|excl|Hscr|hscr|Hopf|hopf|TScy|tscy|Tscr|hbar|tscr|flat|tbrk|fnof|hArr|harr|half|fopf|Fopf|tdot|gvnE|fork|trie|gtcc|fscr|Fscr|gdot|gsim|Gscr|gscr|Gopf|gopf|gneq|Gdot|tosa|gnap|Topf|topf|geqq|toea|GJcy|gjcy|tint|gesl|mid|Sfr|ggg|top|ges|gla|glE|glj|geq|gne|gEl|gel|gnE|Gcy|gcy|gap|Tfr|tfr|Tcy|tcy|Hat|Tau|Ffr|tau|Tab|hfr|Hfr|ffr|Fcy|fcy|icy|Icy|iff|ETH|eth|ifr|Ifr|Eta|eta|int|Int|Sup|sup|ucy|Ucy|Sum|sum|jcy|ENG|ufr|Ufr|eng|Jcy|jfr|els|ell|egs|Efr|efr|Jfr|uml|kcy|Kcy|Ecy|ecy|kfr|Kfr|lap|Sub|sub|lat|lcy|Lcy|leg|Dot|dot|lEg|leq|les|squ|div|die|lfr|Lfr|lgE|Dfr|dfr|Del|deg|Dcy|dcy|lne|lnE|sol|loz|smt|Cup|lrm|cup|lsh|Lsh|sim|shy|map|Map|mcy|Mcy|mfr|Mfr|mho|gfr|Gfr|sfr|cir|Chi|chi|nap|Cfr|vcy|Vcy|cfr|Scy|scy|ncy|Ncy|vee|Vee|Cap|cap|nfr|scE|sce|Nfr|nge|ngE|nGg|vfr|Vfr|ngt|bot|nGt|nis|niv|Rsh|rsh|nle|nlE|bne|Bfr|bfr|nLl|nlt|nLt|Bcy|bcy|not|Not|rlm|wfr|Wfr|npr|nsc|num|ocy|ast|Ocy|ofr|xfr|Xfr|Ofr|ogt|ohm|apE|olt|Rho|ape|rho|Rfr|rfr|ord|REG|ang|reg|orv|And|and|AMP|Rcy|amp|Afr|ycy|Ycy|yen|yfr|Yfr|rcy|par|pcy|Pcy|pfr|Pfr|phi|Phi|afr|Acy|acy|zcy|Zcy|piv|acE|acd|zfr|Zfr|pre|prE|psi|Psi|qfr|Qfr|zwj|Or|ge|Gg|gt|gg|el|oS|lt|Lt|LT|Re|lg|gl|eg|ne|Im|it|le|DD|wp|wr|nu|Nu|dd|lE|Sc|sc|pi|Pi|ee|af|ll|Ll|rx|gE|xi|pm|Xi|ic|pr|Pr|in|ni|mp|mu|ac|Mu|or|ap|Gt|GT|ii);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
      var decodeMap = { "aacute": "\xE1", "Aacute": "\xC1", "abreve": "\u0103", "Abreve": "\u0102", "ac": "\u223E", "acd": "\u223F", "acE": "\u223E\u0333", "acirc": "\xE2", "Acirc": "\xC2", "acute": "\xB4", "acy": "\u0430", "Acy": "\u0410", "aelig": "\xE6", "AElig": "\xC6", "af": "\u2061", "afr": "\u{1D51E}", "Afr": "\u{1D504}", "agrave": "\xE0", "Agrave": "\xC0", "alefsym": "\u2135", "aleph": "\u2135", "alpha": "\u03B1", "Alpha": "\u0391", "amacr": "\u0101", "Amacr": "\u0100", "amalg": "\u2A3F", "amp": "&", "AMP": "&", "and": "\u2227", "And": "\u2A53", "andand": "\u2A55", "andd": "\u2A5C", "andslope": "\u2A58", "andv": "\u2A5A", "ang": "\u2220", "ange": "\u29A4", "angle": "\u2220", "angmsd": "\u2221", "angmsdaa": "\u29A8", "angmsdab": "\u29A9", "angmsdac": "\u29AA", "angmsdad": "\u29AB", "angmsdae": "\u29AC", "angmsdaf": "\u29AD", "angmsdag": "\u29AE", "angmsdah": "\u29AF", "angrt": "\u221F", "angrtvb": "\u22BE", "angrtvbd": "\u299D", "angsph": "\u2222", "angst": "\xC5", "angzarr": "\u237C", "aogon": "\u0105", "Aogon": "\u0104", "aopf": "\u{1D552}", "Aopf": "\u{1D538}", "ap": "\u2248", "apacir": "\u2A6F", "ape": "\u224A", "apE": "\u2A70", "apid": "\u224B", "apos": "'", "ApplyFunction": "\u2061", "approx": "\u2248", "approxeq": "\u224A", "aring": "\xE5", "Aring": "\xC5", "ascr": "\u{1D4B6}", "Ascr": "\u{1D49C}", "Assign": "\u2254", "ast": "*", "asymp": "\u2248", "asympeq": "\u224D", "atilde": "\xE3", "Atilde": "\xC3", "auml": "\xE4", "Auml": "\xC4", "awconint": "\u2233", "awint": "\u2A11", "backcong": "\u224C", "backepsilon": "\u03F6", "backprime": "\u2035", "backsim": "\u223D", "backsimeq": "\u22CD", "Backslash": "\u2216", "Barv": "\u2AE7", "barvee": "\u22BD", "barwed": "\u2305", "Barwed": "\u2306", "barwedge": "\u2305", "bbrk": "\u23B5", "bbrktbrk": "\u23B6", "bcong": "\u224C", "bcy": "\u0431", "Bcy": "\u0411", "bdquo": "\u201E", "becaus": "\u2235", "because": "\u2235", "Because": "\u2235", "bemptyv": "\u29B0", "bepsi": "\u03F6", "bernou": "\u212C", "Bernoullis": "\u212C", "beta": "\u03B2", "Beta": "\u0392", "beth": "\u2136", "between": "\u226C", "bfr": "\u{1D51F}", "Bfr": "\u{1D505}", "bigcap": "\u22C2", "bigcirc": "\u25EF", "bigcup": "\u22C3", "bigodot": "\u2A00", "bigoplus": "\u2A01", "bigotimes": "\u2A02", "bigsqcup": "\u2A06", "bigstar": "\u2605", "bigtriangledown": "\u25BD", "bigtriangleup": "\u25B3", "biguplus": "\u2A04", "bigvee": "\u22C1", "bigwedge": "\u22C0", "bkarow": "\u290D", "blacklozenge": "\u29EB", "blacksquare": "\u25AA", "blacktriangle": "\u25B4", "blacktriangledown": "\u25BE", "blacktriangleleft": "\u25C2", "blacktriangleright": "\u25B8", "blank": "\u2423", "blk12": "\u2592", "blk14": "\u2591", "blk34": "\u2593", "block": "\u2588", "bne": "=\u20E5", "bnequiv": "\u2261\u20E5", "bnot": "\u2310", "bNot": "\u2AED", "bopf": "\u{1D553}", "Bopf": "\u{1D539}", "bot": "\u22A5", "bottom": "\u22A5", "bowtie": "\u22C8", "boxbox": "\u29C9", "boxdl": "\u2510", "boxdL": "\u2555", "boxDl": "\u2556", "boxDL": "\u2557", "boxdr": "\u250C", "boxdR": "\u2552", "boxDr": "\u2553", "boxDR": "\u2554", "boxh": "\u2500", "boxH": "\u2550", "boxhd": "\u252C", "boxhD": "\u2565", "boxHd": "\u2564", "boxHD": "\u2566", "boxhu": "\u2534", "boxhU": "\u2568", "boxHu": "\u2567", "boxHU": "\u2569", "boxminus": "\u229F", "boxplus": "\u229E", "boxtimes": "\u22A0", "boxul": "\u2518", "boxuL": "\u255B", "boxUl": "\u255C", "boxUL": "\u255D", "boxur": "\u2514", "boxuR": "\u2558", "boxUr": "\u2559", "boxUR": "\u255A", "boxv": "\u2502", "boxV": "\u2551", "boxvh": "\u253C", "boxvH": "\u256A", "boxVh": "\u256B", "boxVH": "\u256C", "boxvl": "\u2524", "boxvL": "\u2561", "boxVl": "\u2562", "boxVL": "\u2563", "boxvr": "\u251C", "boxvR": "\u255E", "boxVr": "\u255F", "boxVR": "\u2560", "bprime": "\u2035", "breve": "\u02D8", "Breve": "\u02D8", "brvbar": "\xA6", "bscr": "\u{1D4B7}", "Bscr": "\u212C", "bsemi": "\u204F", "bsim": "\u223D", "bsime": "\u22CD", "bsol": "\\", "bsolb": "\u29C5", "bsolhsub": "\u27C8", "bull": "\u2022", "bullet": "\u2022", "bump": "\u224E", "bumpe": "\u224F", "bumpE": "\u2AAE", "bumpeq": "\u224F", "Bumpeq": "\u224E", "cacute": "\u0107", "Cacute": "\u0106", "cap": "\u2229", "Cap": "\u22D2", "capand": "\u2A44", "capbrcup": "\u2A49", "capcap": "\u2A4B", "capcup": "\u2A47", "capdot": "\u2A40", "CapitalDifferentialD": "\u2145", "caps": "\u2229\uFE00", "caret": "\u2041", "caron": "\u02C7", "Cayleys": "\u212D", "ccaps": "\u2A4D", "ccaron": "\u010D", "Ccaron": "\u010C", "ccedil": "\xE7", "Ccedil": "\xC7", "ccirc": "\u0109", "Ccirc": "\u0108", "Cconint": "\u2230", "ccups": "\u2A4C", "ccupssm": "\u2A50", "cdot": "\u010B", "Cdot": "\u010A", "cedil": "\xB8", "Cedilla": "\xB8", "cemptyv": "\u29B2", "cent": "\xA2", "centerdot": "\xB7", "CenterDot": "\xB7", "cfr": "\u{1D520}", "Cfr": "\u212D", "chcy": "\u0447", "CHcy": "\u0427", "check": "\u2713", "checkmark": "\u2713", "chi": "\u03C7", "Chi": "\u03A7", "cir": "\u25CB", "circ": "\u02C6", "circeq": "\u2257", "circlearrowleft": "\u21BA", "circlearrowright": "\u21BB", "circledast": "\u229B", "circledcirc": "\u229A", "circleddash": "\u229D", "CircleDot": "\u2299", "circledR": "\xAE", "circledS": "\u24C8", "CircleMinus": "\u2296", "CirclePlus": "\u2295", "CircleTimes": "\u2297", "cire": "\u2257", "cirE": "\u29C3", "cirfnint": "\u2A10", "cirmid": "\u2AEF", "cirscir": "\u29C2", "ClockwiseContourIntegral": "\u2232", "CloseCurlyDoubleQuote": "\u201D", "CloseCurlyQuote": "\u2019", "clubs": "\u2663", "clubsuit": "\u2663", "colon": ":", "Colon": "\u2237", "colone": "\u2254", "Colone": "\u2A74", "coloneq": "\u2254", "comma": ",", "commat": "@", "comp": "\u2201", "compfn": "\u2218", "complement": "\u2201", "complexes": "\u2102", "cong": "\u2245", "congdot": "\u2A6D", "Congruent": "\u2261", "conint": "\u222E", "Conint": "\u222F", "ContourIntegral": "\u222E", "copf": "\u{1D554}", "Copf": "\u2102", "coprod": "\u2210", "Coproduct": "\u2210", "copy": "\xA9", "COPY": "\xA9", "copysr": "\u2117", "CounterClockwiseContourIntegral": "\u2233", "crarr": "\u21B5", "cross": "\u2717", "Cross": "\u2A2F", "cscr": "\u{1D4B8}", "Cscr": "\u{1D49E}", "csub": "\u2ACF", "csube": "\u2AD1", "csup": "\u2AD0", "csupe": "\u2AD2", "ctdot": "\u22EF", "cudarrl": "\u2938", "cudarrr": "\u2935", "cuepr": "\u22DE", "cuesc": "\u22DF", "cularr": "\u21B6", "cularrp": "\u293D", "cup": "\u222A", "Cup": "\u22D3", "cupbrcap": "\u2A48", "cupcap": "\u2A46", "CupCap": "\u224D", "cupcup": "\u2A4A", "cupdot": "\u228D", "cupor": "\u2A45", "cups": "\u222A\uFE00", "curarr": "\u21B7", "curarrm": "\u293C", "curlyeqprec": "\u22DE", "curlyeqsucc": "\u22DF", "curlyvee": "\u22CE", "curlywedge": "\u22CF", "curren": "\xA4", "curvearrowleft": "\u21B6", "curvearrowright": "\u21B7", "cuvee": "\u22CE", "cuwed": "\u22CF", "cwconint": "\u2232", "cwint": "\u2231", "cylcty": "\u232D", "dagger": "\u2020", "Dagger": "\u2021", "daleth": "\u2138", "darr": "\u2193", "dArr": "\u21D3", "Darr": "\u21A1", "dash": "\u2010", "dashv": "\u22A3", "Dashv": "\u2AE4", "dbkarow": "\u290F", "dblac": "\u02DD", "dcaron": "\u010F", "Dcaron": "\u010E", "dcy": "\u0434", "Dcy": "\u0414", "dd": "\u2146", "DD": "\u2145", "ddagger": "\u2021", "ddarr": "\u21CA", "DDotrahd": "\u2911", "ddotseq": "\u2A77", "deg": "\xB0", "Del": "\u2207", "delta": "\u03B4", "Delta": "\u0394", "demptyv": "\u29B1", "dfisht": "\u297F", "dfr": "\u{1D521}", "Dfr": "\u{1D507}", "dHar": "\u2965", "dharl": "\u21C3", "dharr": "\u21C2", "DiacriticalAcute": "\xB4", "DiacriticalDot": "\u02D9", "DiacriticalDoubleAcute": "\u02DD", "DiacriticalGrave": "`", "DiacriticalTilde": "\u02DC", "diam": "\u22C4", "diamond": "\u22C4", "Diamond": "\u22C4", "diamondsuit": "\u2666", "diams": "\u2666", "die": "\xA8", "DifferentialD": "\u2146", "digamma": "\u03DD", "disin": "\u22F2", "div": "\xF7", "divide": "\xF7", "divideontimes": "\u22C7", "divonx": "\u22C7", "djcy": "\u0452", "DJcy": "\u0402", "dlcorn": "\u231E", "dlcrop": "\u230D", "dollar": "$", "dopf": "\u{1D555}", "Dopf": "\u{1D53B}", "dot": "\u02D9", "Dot": "\xA8", "DotDot": "\u20DC", "doteq": "\u2250", "doteqdot": "\u2251", "DotEqual": "\u2250", "dotminus": "\u2238", "dotplus": "\u2214", "dotsquare": "\u22A1", "doublebarwedge": "\u2306", "DoubleContourIntegral": "\u222F", "DoubleDot": "\xA8", "DoubleDownArrow": "\u21D3", "DoubleLeftArrow": "\u21D0", "DoubleLeftRightArrow": "\u21D4", "DoubleLeftTee": "\u2AE4", "DoubleLongLeftArrow": "\u27F8", "DoubleLongLeftRightArrow": "\u27FA", "DoubleLongRightArrow": "\u27F9", "DoubleRightArrow": "\u21D2", "DoubleRightTee": "\u22A8", "DoubleUpArrow": "\u21D1", "DoubleUpDownArrow": "\u21D5", "DoubleVerticalBar": "\u2225", "downarrow": "\u2193", "Downarrow": "\u21D3", "DownArrow": "\u2193", "DownArrowBar": "\u2913", "DownArrowUpArrow": "\u21F5", "DownBreve": "\u0311", "downdownarrows": "\u21CA", "downharpoonleft": "\u21C3", "downharpoonright": "\u21C2", "DownLeftRightVector": "\u2950", "DownLeftTeeVector": "\u295E", "DownLeftVector": "\u21BD", "DownLeftVectorBar": "\u2956", "DownRightTeeVector": "\u295F", "DownRightVector": "\u21C1", "DownRightVectorBar": "\u2957", "DownTee": "\u22A4", "DownTeeArrow": "\u21A7", "drbkarow": "\u2910", "drcorn": "\u231F", "drcrop": "\u230C", "dscr": "\u{1D4B9}", "Dscr": "\u{1D49F}", "dscy": "\u0455", "DScy": "\u0405", "dsol": "\u29F6", "dstrok": "\u0111", "Dstrok": "\u0110", "dtdot": "\u22F1", "dtri": "\u25BF", "dtrif": "\u25BE", "duarr": "\u21F5", "duhar": "\u296F", "dwangle": "\u29A6", "dzcy": "\u045F", "DZcy": "\u040F", "dzigrarr": "\u27FF", "eacute": "\xE9", "Eacute": "\xC9", "easter": "\u2A6E", "ecaron": "\u011B", "Ecaron": "\u011A", "ecir": "\u2256", "ecirc": "\xEA", "Ecirc": "\xCA", "ecolon": "\u2255", "ecy": "\u044D", "Ecy": "\u042D", "eDDot": "\u2A77", "edot": "\u0117", "eDot": "\u2251", "Edot": "\u0116", "ee": "\u2147", "efDot": "\u2252", "efr": "\u{1D522}", "Efr": "\u{1D508}", "eg": "\u2A9A", "egrave": "\xE8", "Egrave": "\xC8", "egs": "\u2A96", "egsdot": "\u2A98", "el": "\u2A99", "Element": "\u2208", "elinters": "\u23E7", "ell": "\u2113", "els": "\u2A95", "elsdot": "\u2A97", "emacr": "\u0113", "Emacr": "\u0112", "empty": "\u2205", "emptyset": "\u2205", "EmptySmallSquare": "\u25FB", "emptyv": "\u2205", "EmptyVerySmallSquare": "\u25AB", "emsp": "\u2003", "emsp13": "\u2004", "emsp14": "\u2005", "eng": "\u014B", "ENG": "\u014A", "ensp": "\u2002", "eogon": "\u0119", "Eogon": "\u0118", "eopf": "\u{1D556}", "Eopf": "\u{1D53C}", "epar": "\u22D5", "eparsl": "\u29E3", "eplus": "\u2A71", "epsi": "\u03B5", "epsilon": "\u03B5", "Epsilon": "\u0395", "epsiv": "\u03F5", "eqcirc": "\u2256", "eqcolon": "\u2255", "eqsim": "\u2242", "eqslantgtr": "\u2A96", "eqslantless": "\u2A95", "Equal": "\u2A75", "equals": "=", "EqualTilde": "\u2242", "equest": "\u225F", "Equilibrium": "\u21CC", "equiv": "\u2261", "equivDD": "\u2A78", "eqvparsl": "\u29E5", "erarr": "\u2971", "erDot": "\u2253", "escr": "\u212F", "Escr": "\u2130", "esdot": "\u2250", "esim": "\u2242", "Esim": "\u2A73", "eta": "\u03B7", "Eta": "\u0397", "eth": "\xF0", "ETH": "\xD0", "euml": "\xEB", "Euml": "\xCB", "euro": "\u20AC", "excl": "!", "exist": "\u2203", "Exists": "\u2203", "expectation": "\u2130", "exponentiale": "\u2147", "ExponentialE": "\u2147", "fallingdotseq": "\u2252", "fcy": "\u0444", "Fcy": "\u0424", "female": "\u2640", "ffilig": "\uFB03", "fflig": "\uFB00", "ffllig": "\uFB04", "ffr": "\u{1D523}", "Ffr": "\u{1D509}", "filig": "\uFB01", "FilledSmallSquare": "\u25FC", "FilledVerySmallSquare": "\u25AA", "fjlig": "fj", "flat": "\u266D", "fllig": "\uFB02", "fltns": "\u25B1", "fnof": "\u0192", "fopf": "\u{1D557}", "Fopf": "\u{1D53D}", "forall": "\u2200", "ForAll": "\u2200", "fork": "\u22D4", "forkv": "\u2AD9", "Fouriertrf": "\u2131", "fpartint": "\u2A0D", "frac12": "\xBD", "frac13": "\u2153", "frac14": "\xBC", "frac15": "\u2155", "frac16": "\u2159", "frac18": "\u215B", "frac23": "\u2154", "frac25": "\u2156", "frac34": "\xBE", "frac35": "\u2157", "frac38": "\u215C", "frac45": "\u2158", "frac56": "\u215A", "frac58": "\u215D", "frac78": "\u215E", "frasl": "\u2044", "frown": "\u2322", "fscr": "\u{1D4BB}", "Fscr": "\u2131", "gacute": "\u01F5", "gamma": "\u03B3", "Gamma": "\u0393", "gammad": "\u03DD", "Gammad": "\u03DC", "gap": "\u2A86", "gbreve": "\u011F", "Gbreve": "\u011E", "Gcedil": "\u0122", "gcirc": "\u011D", "Gcirc": "\u011C", "gcy": "\u0433", "Gcy": "\u0413", "gdot": "\u0121", "Gdot": "\u0120", "ge": "\u2265", "gE": "\u2267", "gel": "\u22DB", "gEl": "\u2A8C", "geq": "\u2265", "geqq": "\u2267", "geqslant": "\u2A7E", "ges": "\u2A7E", "gescc": "\u2AA9", "gesdot": "\u2A80", "gesdoto": "\u2A82", "gesdotol": "\u2A84", "gesl": "\u22DB\uFE00", "gesles": "\u2A94", "gfr": "\u{1D524}", "Gfr": "\u{1D50A}", "gg": "\u226B", "Gg": "\u22D9", "ggg": "\u22D9", "gimel": "\u2137", "gjcy": "\u0453", "GJcy": "\u0403", "gl": "\u2277", "gla": "\u2AA5", "glE": "\u2A92", "glj": "\u2AA4", "gnap": "\u2A8A", "gnapprox": "\u2A8A", "gne": "\u2A88", "gnE": "\u2269", "gneq": "\u2A88", "gneqq": "\u2269", "gnsim": "\u22E7", "gopf": "\u{1D558}", "Gopf": "\u{1D53E}", "grave": "`", "GreaterEqual": "\u2265", "GreaterEqualLess": "\u22DB", "GreaterFullEqual": "\u2267", "GreaterGreater": "\u2AA2", "GreaterLess": "\u2277", "GreaterSlantEqual": "\u2A7E", "GreaterTilde": "\u2273", "gscr": "\u210A", "Gscr": "\u{1D4A2}", "gsim": "\u2273", "gsime": "\u2A8E", "gsiml": "\u2A90", "gt": ">", "Gt": "\u226B", "GT": ">", "gtcc": "\u2AA7", "gtcir": "\u2A7A", "gtdot": "\u22D7", "gtlPar": "\u2995", "gtquest": "\u2A7C", "gtrapprox": "\u2A86", "gtrarr": "\u2978", "gtrdot": "\u22D7", "gtreqless": "\u22DB", "gtreqqless": "\u2A8C", "gtrless": "\u2277", "gtrsim": "\u2273", "gvertneqq": "\u2269\uFE00", "gvnE": "\u2269\uFE00", "Hacek": "\u02C7", "hairsp": "\u200A", "half": "\xBD", "hamilt": "\u210B", "hardcy": "\u044A", "HARDcy": "\u042A", "harr": "\u2194", "hArr": "\u21D4", "harrcir": "\u2948", "harrw": "\u21AD", "Hat": "^", "hbar": "\u210F", "hcirc": "\u0125", "Hcirc": "\u0124", "hearts": "\u2665", "heartsuit": "\u2665", "hellip": "\u2026", "hercon": "\u22B9", "hfr": "\u{1D525}", "Hfr": "\u210C", "HilbertSpace": "\u210B", "hksearow": "\u2925", "hkswarow": "\u2926", "hoarr": "\u21FF", "homtht": "\u223B", "hookleftarrow": "\u21A9", "hookrightarrow": "\u21AA", "hopf": "\u{1D559}", "Hopf": "\u210D", "horbar": "\u2015", "HorizontalLine": "\u2500", "hscr": "\u{1D4BD}", "Hscr": "\u210B", "hslash": "\u210F", "hstrok": "\u0127", "Hstrok": "\u0126", "HumpDownHump": "\u224E", "HumpEqual": "\u224F", "hybull": "\u2043", "hyphen": "\u2010", "iacute": "\xED", "Iacute": "\xCD", "ic": "\u2063", "icirc": "\xEE", "Icirc": "\xCE", "icy": "\u0438", "Icy": "\u0418", "Idot": "\u0130", "iecy": "\u0435", "IEcy": "\u0415", "iexcl": "\xA1", "iff": "\u21D4", "ifr": "\u{1D526}", "Ifr": "\u2111", "igrave": "\xEC", "Igrave": "\xCC", "ii": "\u2148", "iiiint": "\u2A0C", "iiint": "\u222D", "iinfin": "\u29DC", "iiota": "\u2129", "ijlig": "\u0133", "IJlig": "\u0132", "Im": "\u2111", "imacr": "\u012B", "Imacr": "\u012A", "image": "\u2111", "ImaginaryI": "\u2148", "imagline": "\u2110", "imagpart": "\u2111", "imath": "\u0131", "imof": "\u22B7", "imped": "\u01B5", "Implies": "\u21D2", "in": "\u2208", "incare": "\u2105", "infin": "\u221E", "infintie": "\u29DD", "inodot": "\u0131", "int": "\u222B", "Int": "\u222C", "intcal": "\u22BA", "integers": "\u2124", "Integral": "\u222B", "intercal": "\u22BA", "Intersection": "\u22C2", "intlarhk": "\u2A17", "intprod": "\u2A3C", "InvisibleComma": "\u2063", "InvisibleTimes": "\u2062", "iocy": "\u0451", "IOcy": "\u0401", "iogon": "\u012F", "Iogon": "\u012E", "iopf": "\u{1D55A}", "Iopf": "\u{1D540}", "iota": "\u03B9", "Iota": "\u0399", "iprod": "\u2A3C", "iquest": "\xBF", "iscr": "\u{1D4BE}", "Iscr": "\u2110", "isin": "\u2208", "isindot": "\u22F5", "isinE": "\u22F9", "isins": "\u22F4", "isinsv": "\u22F3", "isinv": "\u2208", "it": "\u2062", "itilde": "\u0129", "Itilde": "\u0128", "iukcy": "\u0456", "Iukcy": "\u0406", "iuml": "\xEF", "Iuml": "\xCF", "jcirc": "\u0135", "Jcirc": "\u0134", "jcy": "\u0439", "Jcy": "\u0419", "jfr": "\u{1D527}", "Jfr": "\u{1D50D}", "jmath": "\u0237", "jopf": "\u{1D55B}", "Jopf": "\u{1D541}", "jscr": "\u{1D4BF}", "Jscr": "\u{1D4A5}", "jsercy": "\u0458", "Jsercy": "\u0408", "jukcy": "\u0454", "Jukcy": "\u0404", "kappa": "\u03BA", "Kappa": "\u039A", "kappav": "\u03F0", "kcedil": "\u0137", "Kcedil": "\u0136", "kcy": "\u043A", "Kcy": "\u041A", "kfr": "\u{1D528}", "Kfr": "\u{1D50E}", "kgreen": "\u0138", "khcy": "\u0445", "KHcy": "\u0425", "kjcy": "\u045C", "KJcy": "\u040C", "kopf": "\u{1D55C}", "Kopf": "\u{1D542}", "kscr": "\u{1D4C0}", "Kscr": "\u{1D4A6}", "lAarr": "\u21DA", "lacute": "\u013A", "Lacute": "\u0139", "laemptyv": "\u29B4", "lagran": "\u2112", "lambda": "\u03BB", "Lambda": "\u039B", "lang": "\u27E8", "Lang": "\u27EA", "langd": "\u2991", "langle": "\u27E8", "lap": "\u2A85", "Laplacetrf": "\u2112", "laquo": "\xAB", "larr": "\u2190", "lArr": "\u21D0", "Larr": "\u219E", "larrb": "\u21E4", "larrbfs": "\u291F", "larrfs": "\u291D", "larrhk": "\u21A9", "larrlp": "\u21AB", "larrpl": "\u2939", "larrsim": "\u2973", "larrtl": "\u21A2", "lat": "\u2AAB", "latail": "\u2919", "lAtail": "\u291B", "late": "\u2AAD", "lates": "\u2AAD\uFE00", "lbarr": "\u290C", "lBarr": "\u290E", "lbbrk": "\u2772", "lbrace": "{", "lbrack": "[", "lbrke": "\u298B", "lbrksld": "\u298F", "lbrkslu": "\u298D", "lcaron": "\u013E", "Lcaron": "\u013D", "lcedil": "\u013C", "Lcedil": "\u013B", "lceil": "\u2308", "lcub": "{", "lcy": "\u043B", "Lcy": "\u041B", "ldca": "\u2936", "ldquo": "\u201C", "ldquor": "\u201E", "ldrdhar": "\u2967", "ldrushar": "\u294B", "ldsh": "\u21B2", "le": "\u2264", "lE": "\u2266", "LeftAngleBracket": "\u27E8", "leftarrow": "\u2190", "Leftarrow": "\u21D0", "LeftArrow": "\u2190", "LeftArrowBar": "\u21E4", "LeftArrowRightArrow": "\u21C6", "leftarrowtail": "\u21A2", "LeftCeiling": "\u2308", "LeftDoubleBracket": "\u27E6", "LeftDownTeeVector": "\u2961", "LeftDownVector": "\u21C3", "LeftDownVectorBar": "\u2959", "LeftFloor": "\u230A", "leftharpoondown": "\u21BD", "leftharpoonup": "\u21BC", "leftleftarrows": "\u21C7", "leftrightarrow": "\u2194", "Leftrightarrow": "\u21D4", "LeftRightArrow": "\u2194", "leftrightarrows": "\u21C6", "leftrightharpoons": "\u21CB", "leftrightsquigarrow": "\u21AD", "LeftRightVector": "\u294E", "LeftTee": "\u22A3", "LeftTeeArrow": "\u21A4", "LeftTeeVector": "\u295A", "leftthreetimes": "\u22CB", "LeftTriangle": "\u22B2", "LeftTriangleBar": "\u29CF", "LeftTriangleEqual": "\u22B4", "LeftUpDownVector": "\u2951", "LeftUpTeeVector": "\u2960", "LeftUpVector": "\u21BF", "LeftUpVectorBar": "\u2958", "LeftVector": "\u21BC", "LeftVectorBar": "\u2952", "leg": "\u22DA", "lEg": "\u2A8B", "leq": "\u2264", "leqq": "\u2266", "leqslant": "\u2A7D", "les": "\u2A7D", "lescc": "\u2AA8", "lesdot": "\u2A7F", "lesdoto": "\u2A81", "lesdotor": "\u2A83", "lesg": "\u22DA\uFE00", "lesges": "\u2A93", "lessapprox": "\u2A85", "lessdot": "\u22D6", "lesseqgtr": "\u22DA", "lesseqqgtr": "\u2A8B", "LessEqualGreater": "\u22DA", "LessFullEqual": "\u2266", "LessGreater": "\u2276", "lessgtr": "\u2276", "LessLess": "\u2AA1", "lesssim": "\u2272", "LessSlantEqual": "\u2A7D", "LessTilde": "\u2272", "lfisht": "\u297C", "lfloor": "\u230A", "lfr": "\u{1D529}", "Lfr": "\u{1D50F}", "lg": "\u2276", "lgE": "\u2A91", "lHar": "\u2962", "lhard": "\u21BD", "lharu": "\u21BC", "lharul": "\u296A", "lhblk": "\u2584", "ljcy": "\u0459", "LJcy": "\u0409", "ll": "\u226A", "Ll": "\u22D8", "llarr": "\u21C7", "llcorner": "\u231E", "Lleftarrow": "\u21DA", "llhard": "\u296B", "lltri": "\u25FA", "lmidot": "\u0140", "Lmidot": "\u013F", "lmoust": "\u23B0", "lmoustache": "\u23B0", "lnap": "\u2A89", "lnapprox": "\u2A89", "lne": "\u2A87", "lnE": "\u2268", "lneq": "\u2A87", "lneqq": "\u2268", "lnsim": "\u22E6", "loang": "\u27EC", "loarr": "\u21FD", "lobrk": "\u27E6", "longleftarrow": "\u27F5", "Longleftarrow": "\u27F8", "LongLeftArrow": "\u27F5", "longleftrightarrow": "\u27F7", "Longleftrightarrow": "\u27FA", "LongLeftRightArrow": "\u27F7", "longmapsto": "\u27FC", "longrightarrow": "\u27F6", "Longrightarrow": "\u27F9", "LongRightArrow": "\u27F6", "looparrowleft": "\u21AB", "looparrowright": "\u21AC", "lopar": "\u2985", "lopf": "\u{1D55D}", "Lopf": "\u{1D543}", "loplus": "\u2A2D", "lotimes": "\u2A34", "lowast": "\u2217", "lowbar": "_", "LowerLeftArrow": "\u2199", "LowerRightArrow": "\u2198", "loz": "\u25CA", "lozenge": "\u25CA", "lozf": "\u29EB", "lpar": "(", "lparlt": "\u2993", "lrarr": "\u21C6", "lrcorner": "\u231F", "lrhar": "\u21CB", "lrhard": "\u296D", "lrm": "\u200E", "lrtri": "\u22BF", "lsaquo": "\u2039", "lscr": "\u{1D4C1}", "Lscr": "\u2112", "lsh": "\u21B0", "Lsh": "\u21B0", "lsim": "\u2272", "lsime": "\u2A8D", "lsimg": "\u2A8F", "lsqb": "[", "lsquo": "\u2018", "lsquor": "\u201A", "lstrok": "\u0142", "Lstrok": "\u0141", "lt": "<", "Lt": "\u226A", "LT": "<", "ltcc": "\u2AA6", "ltcir": "\u2A79", "ltdot": "\u22D6", "lthree": "\u22CB", "ltimes": "\u22C9", "ltlarr": "\u2976", "ltquest": "\u2A7B", "ltri": "\u25C3", "ltrie": "\u22B4", "ltrif": "\u25C2", "ltrPar": "\u2996", "lurdshar": "\u294A", "luruhar": "\u2966", "lvertneqq": "\u2268\uFE00", "lvnE": "\u2268\uFE00", "macr": "\xAF", "male": "\u2642", "malt": "\u2720", "maltese": "\u2720", "map": "\u21A6", "Map": "\u2905", "mapsto": "\u21A6", "mapstodown": "\u21A7", "mapstoleft": "\u21A4", "mapstoup": "\u21A5", "marker": "\u25AE", "mcomma": "\u2A29", "mcy": "\u043C", "Mcy": "\u041C", "mdash": "\u2014", "mDDot": "\u223A", "measuredangle": "\u2221", "MediumSpace": "\u205F", "Mellintrf": "\u2133", "mfr": "\u{1D52A}", "Mfr": "\u{1D510}", "mho": "\u2127", "micro": "\xB5", "mid": "\u2223", "midast": "*", "midcir": "\u2AF0", "middot": "\xB7", "minus": "\u2212", "minusb": "\u229F", "minusd": "\u2238", "minusdu": "\u2A2A", "MinusPlus": "\u2213", "mlcp": "\u2ADB", "mldr": "\u2026", "mnplus": "\u2213", "models": "\u22A7", "mopf": "\u{1D55E}", "Mopf": "\u{1D544}", "mp": "\u2213", "mscr": "\u{1D4C2}", "Mscr": "\u2133", "mstpos": "\u223E", "mu": "\u03BC", "Mu": "\u039C", "multimap": "\u22B8", "mumap": "\u22B8", "nabla": "\u2207", "nacute": "\u0144", "Nacute": "\u0143", "nang": "\u2220\u20D2", "nap": "\u2249", "napE": "\u2A70\u0338", "napid": "\u224B\u0338", "napos": "\u0149", "napprox": "\u2249", "natur": "\u266E", "natural": "\u266E", "naturals": "\u2115", "nbsp": "\xA0", "nbump": "\u224E\u0338", "nbumpe": "\u224F\u0338", "ncap": "\u2A43", "ncaron": "\u0148", "Ncaron": "\u0147", "ncedil": "\u0146", "Ncedil": "\u0145", "ncong": "\u2247", "ncongdot": "\u2A6D\u0338", "ncup": "\u2A42", "ncy": "\u043D", "Ncy": "\u041D", "ndash": "\u2013", "ne": "\u2260", "nearhk": "\u2924", "nearr": "\u2197", "neArr": "\u21D7", "nearrow": "\u2197", "nedot": "\u2250\u0338", "NegativeMediumSpace": "\u200B", "NegativeThickSpace": "\u200B", "NegativeThinSpace": "\u200B", "NegativeVeryThinSpace": "\u200B", "nequiv": "\u2262", "nesear": "\u2928", "nesim": "\u2242\u0338", "NestedGreaterGreater": "\u226B", "NestedLessLess": "\u226A", "NewLine": "\n", "nexist": "\u2204", "nexists": "\u2204", "nfr": "\u{1D52B}", "Nfr": "\u{1D511}", "nge": "\u2271", "ngE": "\u2267\u0338", "ngeq": "\u2271", "ngeqq": "\u2267\u0338", "ngeqslant": "\u2A7E\u0338", "nges": "\u2A7E\u0338", "nGg": "\u22D9\u0338", "ngsim": "\u2275", "ngt": "\u226F", "nGt": "\u226B\u20D2", "ngtr": "\u226F", "nGtv": "\u226B\u0338", "nharr": "\u21AE", "nhArr": "\u21CE", "nhpar": "\u2AF2", "ni": "\u220B", "nis": "\u22FC", "nisd": "\u22FA", "niv": "\u220B", "njcy": "\u045A", "NJcy": "\u040A", "nlarr": "\u219A", "nlArr": "\u21CD", "nldr": "\u2025", "nle": "\u2270", "nlE": "\u2266\u0338", "nleftarrow": "\u219A", "nLeftarrow": "\u21CD", "nleftrightarrow": "\u21AE", "nLeftrightarrow": "\u21CE", "nleq": "\u2270", "nleqq": "\u2266\u0338", "nleqslant": "\u2A7D\u0338", "nles": "\u2A7D\u0338", "nless": "\u226E", "nLl": "\u22D8\u0338", "nlsim": "\u2274", "nlt": "\u226E", "nLt": "\u226A\u20D2", "nltri": "\u22EA", "nltrie": "\u22EC", "nLtv": "\u226A\u0338", "nmid": "\u2224", "NoBreak": "\u2060", "NonBreakingSpace": "\xA0", "nopf": "\u{1D55F}", "Nopf": "\u2115", "not": "\xAC", "Not": "\u2AEC", "NotCongruent": "\u2262", "NotCupCap": "\u226D", "NotDoubleVerticalBar": "\u2226", "NotElement": "\u2209", "NotEqual": "\u2260", "NotEqualTilde": "\u2242\u0338", "NotExists": "\u2204", "NotGreater": "\u226F", "NotGreaterEqual": "\u2271", "NotGreaterFullEqual": "\u2267\u0338", "NotGreaterGreater": "\u226B\u0338", "NotGreaterLess": "\u2279", "NotGreaterSlantEqual": "\u2A7E\u0338", "NotGreaterTilde": "\u2275", "NotHumpDownHump": "\u224E\u0338", "NotHumpEqual": "\u224F\u0338", "notin": "\u2209", "notindot": "\u22F5\u0338", "notinE": "\u22F9\u0338", "notinva": "\u2209", "notinvb": "\u22F7", "notinvc": "\u22F6", "NotLeftTriangle": "\u22EA", "NotLeftTriangleBar": "\u29CF\u0338", "NotLeftTriangleEqual": "\u22EC", "NotLess": "\u226E", "NotLessEqual": "\u2270", "NotLessGreater": "\u2278", "NotLessLess": "\u226A\u0338", "NotLessSlantEqual": "\u2A7D\u0338", "NotLessTilde": "\u2274", "NotNestedGreaterGreater": "\u2AA2\u0338", "NotNestedLessLess": "\u2AA1\u0338", "notni": "\u220C", "notniva": "\u220C", "notnivb": "\u22FE", "notnivc": "\u22FD", "NotPrecedes": "\u2280", "NotPrecedesEqual": "\u2AAF\u0338", "NotPrecedesSlantEqual": "\u22E0", "NotReverseElement": "\u220C", "NotRightTriangle": "\u22EB", "NotRightTriangleBar": "\u29D0\u0338", "NotRightTriangleEqual": "\u22ED", "NotSquareSubset": "\u228F\u0338", "NotSquareSubsetEqual": "\u22E2", "NotSquareSuperset": "\u2290\u0338", "NotSquareSupersetEqual": "\u22E3", "NotSubset": "\u2282\u20D2", "NotSubsetEqual": "\u2288", "NotSucceeds": "\u2281", "NotSucceedsEqual": "\u2AB0\u0338", "NotSucceedsSlantEqual": "\u22E1", "NotSucceedsTilde": "\u227F\u0338", "NotSuperset": "\u2283\u20D2", "NotSupersetEqual": "\u2289", "NotTilde": "\u2241", "NotTildeEqual": "\u2244", "NotTildeFullEqual": "\u2247", "NotTildeTilde": "\u2249", "NotVerticalBar": "\u2224", "npar": "\u2226", "nparallel": "\u2226", "nparsl": "\u2AFD\u20E5", "npart": "\u2202\u0338", "npolint": "\u2A14", "npr": "\u2280", "nprcue": "\u22E0", "npre": "\u2AAF\u0338", "nprec": "\u2280", "npreceq": "\u2AAF\u0338", "nrarr": "\u219B", "nrArr": "\u21CF", "nrarrc": "\u2933\u0338", "nrarrw": "\u219D\u0338", "nrightarrow": "\u219B", "nRightarrow": "\u21CF", "nrtri": "\u22EB", "nrtrie": "\u22ED", "nsc": "\u2281", "nsccue": "\u22E1", "nsce": "\u2AB0\u0338", "nscr": "\u{1D4C3}", "Nscr": "\u{1D4A9}", "nshortmid": "\u2224", "nshortparallel": "\u2226", "nsim": "\u2241", "nsime": "\u2244", "nsimeq": "\u2244", "nsmid": "\u2224", "nspar": "\u2226", "nsqsube": "\u22E2", "nsqsupe": "\u22E3", "nsub": "\u2284", "nsube": "\u2288", "nsubE": "\u2AC5\u0338", "nsubset": "\u2282\u20D2", "nsubseteq": "\u2288", "nsubseteqq": "\u2AC5\u0338", "nsucc": "\u2281", "nsucceq": "\u2AB0\u0338", "nsup": "\u2285", "nsupe": "\u2289", "nsupE": "\u2AC6\u0338", "nsupset": "\u2283\u20D2", "nsupseteq": "\u2289", "nsupseteqq": "\u2AC6\u0338", "ntgl": "\u2279", "ntilde": "\xF1", "Ntilde": "\xD1", "ntlg": "\u2278", "ntriangleleft": "\u22EA", "ntrianglelefteq": "\u22EC", "ntriangleright": "\u22EB", "ntrianglerighteq": "\u22ED", "nu": "\u03BD", "Nu": "\u039D", "num": "#", "numero": "\u2116", "numsp": "\u2007", "nvap": "\u224D\u20D2", "nvdash": "\u22AC", "nvDash": "\u22AD", "nVdash": "\u22AE", "nVDash": "\u22AF", "nvge": "\u2265\u20D2", "nvgt": ">\u20D2", "nvHarr": "\u2904", "nvinfin": "\u29DE", "nvlArr": "\u2902", "nvle": "\u2264\u20D2", "nvlt": "<\u20D2", "nvltrie": "\u22B4\u20D2", "nvrArr": "\u2903", "nvrtrie": "\u22B5\u20D2", "nvsim": "\u223C\u20D2", "nwarhk": "\u2923", "nwarr": "\u2196", "nwArr": "\u21D6", "nwarrow": "\u2196", "nwnear": "\u2927", "oacute": "\xF3", "Oacute": "\xD3", "oast": "\u229B", "ocir": "\u229A", "ocirc": "\xF4", "Ocirc": "\xD4", "ocy": "\u043E", "Ocy": "\u041E", "odash": "\u229D", "odblac": "\u0151", "Odblac": "\u0150", "odiv": "\u2A38", "odot": "\u2299", "odsold": "\u29BC", "oelig": "\u0153", "OElig": "\u0152", "ofcir": "\u29BF", "ofr": "\u{1D52C}", "Ofr": "\u{1D512}", "ogon": "\u02DB", "ograve": "\xF2", "Ograve": "\xD2", "ogt": "\u29C1", "ohbar": "\u29B5", "ohm": "\u03A9", "oint": "\u222E", "olarr": "\u21BA", "olcir": "\u29BE", "olcross": "\u29BB", "oline": "\u203E", "olt": "\u29C0", "omacr": "\u014D", "Omacr": "\u014C", "omega": "\u03C9", "Omega": "\u03A9", "omicron": "\u03BF", "Omicron": "\u039F", "omid": "\u29B6", "ominus": "\u2296", "oopf": "\u{1D560}", "Oopf": "\u{1D546}", "opar": "\u29B7", "OpenCurlyDoubleQuote": "\u201C", "OpenCurlyQuote": "\u2018", "operp": "\u29B9", "oplus": "\u2295", "or": "\u2228", "Or": "\u2A54", "orarr": "\u21BB", "ord": "\u2A5D", "order": "\u2134", "orderof": "\u2134", "ordf": "\xAA", "ordm": "\xBA", "origof": "\u22B6", "oror": "\u2A56", "orslope": "\u2A57", "orv": "\u2A5B", "oS": "\u24C8", "oscr": "\u2134", "Oscr": "\u{1D4AA}", "oslash": "\xF8", "Oslash": "\xD8", "osol": "\u2298", "otilde": "\xF5", "Otilde": "\xD5", "otimes": "\u2297", "Otimes": "\u2A37", "otimesas": "\u2A36", "ouml": "\xF6", "Ouml": "\xD6", "ovbar": "\u233D", "OverBar": "\u203E", "OverBrace": "\u23DE", "OverBracket": "\u23B4", "OverParenthesis": "\u23DC", "par": "\u2225", "para": "\xB6", "parallel": "\u2225", "parsim": "\u2AF3", "parsl": "\u2AFD", "part": "\u2202", "PartialD": "\u2202", "pcy": "\u043F", "Pcy": "\u041F", "percnt": "%", "period": ".", "permil": "\u2030", "perp": "\u22A5", "pertenk": "\u2031", "pfr": "\u{1D52D}", "Pfr": "\u{1D513}", "phi": "\u03C6", "Phi": "\u03A6", "phiv": "\u03D5", "phmmat": "\u2133", "phone": "\u260E", "pi": "\u03C0", "Pi": "\u03A0", "pitchfork": "\u22D4", "piv": "\u03D6", "planck": "\u210F", "planckh": "\u210E", "plankv": "\u210F", "plus": "+", "plusacir": "\u2A23", "plusb": "\u229E", "pluscir": "\u2A22", "plusdo": "\u2214", "plusdu": "\u2A25", "pluse": "\u2A72", "PlusMinus": "\xB1", "plusmn": "\xB1", "plussim": "\u2A26", "plustwo": "\u2A27", "pm": "\xB1", "Poincareplane": "\u210C", "pointint": "\u2A15", "popf": "\u{1D561}", "Popf": "\u2119", "pound": "\xA3", "pr": "\u227A", "Pr": "\u2ABB", "prap": "\u2AB7", "prcue": "\u227C", "pre": "\u2AAF", "prE": "\u2AB3", "prec": "\u227A", "precapprox": "\u2AB7", "preccurlyeq": "\u227C", "Precedes": "\u227A", "PrecedesEqual": "\u2AAF", "PrecedesSlantEqual": "\u227C", "PrecedesTilde": "\u227E", "preceq": "\u2AAF", "precnapprox": "\u2AB9", "precneqq": "\u2AB5", "precnsim": "\u22E8", "precsim": "\u227E", "prime": "\u2032", "Prime": "\u2033", "primes": "\u2119", "prnap": "\u2AB9", "prnE": "\u2AB5", "prnsim": "\u22E8", "prod": "\u220F", "Product": "\u220F", "profalar": "\u232E", "profline": "\u2312", "profsurf": "\u2313", "prop": "\u221D", "Proportion": "\u2237", "Proportional": "\u221D", "propto": "\u221D", "prsim": "\u227E", "prurel": "\u22B0", "pscr": "\u{1D4C5}", "Pscr": "\u{1D4AB}", "psi": "\u03C8", "Psi": "\u03A8", "puncsp": "\u2008", "qfr": "\u{1D52E}", "Qfr": "\u{1D514}", "qint": "\u2A0C", "qopf": "\u{1D562}", "Qopf": "\u211A", "qprime": "\u2057", "qscr": "\u{1D4C6}", "Qscr": "\u{1D4AC}", "quaternions": "\u210D", "quatint": "\u2A16", "quest": "?", "questeq": "\u225F", "quot": '"', "QUOT": '"', "rAarr": "\u21DB", "race": "\u223D\u0331", "racute": "\u0155", "Racute": "\u0154", "radic": "\u221A", "raemptyv": "\u29B3", "rang": "\u27E9", "Rang": "\u27EB", "rangd": "\u2992", "range": "\u29A5", "rangle": "\u27E9", "raquo": "\xBB", "rarr": "\u2192", "rArr": "\u21D2", "Rarr": "\u21A0", "rarrap": "\u2975", "rarrb": "\u21E5", "rarrbfs": "\u2920", "rarrc": "\u2933", "rarrfs": "\u291E", "rarrhk": "\u21AA", "rarrlp": "\u21AC", "rarrpl": "\u2945", "rarrsim": "\u2974", "rarrtl": "\u21A3", "Rarrtl": "\u2916", "rarrw": "\u219D", "ratail": "\u291A", "rAtail": "\u291C", "ratio": "\u2236", "rationals": "\u211A", "rbarr": "\u290D", "rBarr": "\u290F", "RBarr": "\u2910", "rbbrk": "\u2773", "rbrace": "}", "rbrack": "]", "rbrke": "\u298C", "rbrksld": "\u298E", "rbrkslu": "\u2990", "rcaron": "\u0159", "Rcaron": "\u0158", "rcedil": "\u0157", "Rcedil": "\u0156", "rceil": "\u2309", "rcub": "}", "rcy": "\u0440", "Rcy": "\u0420", "rdca": "\u2937", "rdldhar": "\u2969", "rdquo": "\u201D", "rdquor": "\u201D", "rdsh": "\u21B3", "Re": "\u211C", "real": "\u211C", "realine": "\u211B", "realpart": "\u211C", "reals": "\u211D", "rect": "\u25AD", "reg": "\xAE", "REG": "\xAE", "ReverseElement": "\u220B", "ReverseEquilibrium": "\u21CB", "ReverseUpEquilibrium": "\u296F", "rfisht": "\u297D", "rfloor": "\u230B", "rfr": "\u{1D52F}", "Rfr": "\u211C", "rHar": "\u2964", "rhard": "\u21C1", "rharu": "\u21C0", "rharul": "\u296C", "rho": "\u03C1", "Rho": "\u03A1", "rhov": "\u03F1", "RightAngleBracket": "\u27E9", "rightarrow": "\u2192", "Rightarrow": "\u21D2", "RightArrow": "\u2192", "RightArrowBar": "\u21E5", "RightArrowLeftArrow": "\u21C4", "rightarrowtail": "\u21A3", "RightCeiling": "\u2309", "RightDoubleBracket": "\u27E7", "RightDownTeeVector": "\u295D", "RightDownVector": "\u21C2", "RightDownVectorBar": "\u2955", "RightFloor": "\u230B", "rightharpoondown": "\u21C1", "rightharpoonup": "\u21C0", "rightleftarrows": "\u21C4", "rightleftharpoons": "\u21CC", "rightrightarrows": "\u21C9", "rightsquigarrow": "\u219D", "RightTee": "\u22A2", "RightTeeArrow": "\u21A6", "RightTeeVector": "\u295B", "rightthreetimes": "\u22CC", "RightTriangle": "\u22B3", "RightTriangleBar": "\u29D0", "RightTriangleEqual": "\u22B5", "RightUpDownVector": "\u294F", "RightUpTeeVector": "\u295C", "RightUpVector": "\u21BE", "RightUpVectorBar": "\u2954", "RightVector": "\u21C0", "RightVectorBar": "\u2953", "ring": "\u02DA", "risingdotseq": "\u2253", "rlarr": "\u21C4", "rlhar": "\u21CC", "rlm": "\u200F", "rmoust": "\u23B1", "rmoustache": "\u23B1", "rnmid": "\u2AEE", "roang": "\u27ED", "roarr": "\u21FE", "robrk": "\u27E7", "ropar": "\u2986", "ropf": "\u{1D563}", "Ropf": "\u211D", "roplus": "\u2A2E", "rotimes": "\u2A35", "RoundImplies": "\u2970", "rpar": ")", "rpargt": "\u2994", "rppolint": "\u2A12", "rrarr": "\u21C9", "Rrightarrow": "\u21DB", "rsaquo": "\u203A", "rscr": "\u{1D4C7}", "Rscr": "\u211B", "rsh": "\u21B1", "Rsh": "\u21B1", "rsqb": "]", "rsquo": "\u2019", "rsquor": "\u2019", "rthree": "\u22CC", "rtimes": "\u22CA", "rtri": "\u25B9", "rtrie": "\u22B5", "rtrif": "\u25B8", "rtriltri": "\u29CE", "RuleDelayed": "\u29F4", "ruluhar": "\u2968", "rx": "\u211E", "sacute": "\u015B", "Sacute": "\u015A", "sbquo": "\u201A", "sc": "\u227B", "Sc": "\u2ABC", "scap": "\u2AB8", "scaron": "\u0161", "Scaron": "\u0160", "sccue": "\u227D", "sce": "\u2AB0", "scE": "\u2AB4", "scedil": "\u015F", "Scedil": "\u015E", "scirc": "\u015D", "Scirc": "\u015C", "scnap": "\u2ABA", "scnE": "\u2AB6", "scnsim": "\u22E9", "scpolint": "\u2A13", "scsim": "\u227F", "scy": "\u0441", "Scy": "\u0421", "sdot": "\u22C5", "sdotb": "\u22A1", "sdote": "\u2A66", "searhk": "\u2925", "searr": "\u2198", "seArr": "\u21D8", "searrow": "\u2198", "sect": "\xA7", "semi": ";", "seswar": "\u2929", "setminus": "\u2216", "setmn": "\u2216", "sext": "\u2736", "sfr": "\u{1D530}", "Sfr": "\u{1D516}", "sfrown": "\u2322", "sharp": "\u266F", "shchcy": "\u0449", "SHCHcy": "\u0429", "shcy": "\u0448", "SHcy": "\u0428", "ShortDownArrow": "\u2193", "ShortLeftArrow": "\u2190", "shortmid": "\u2223", "shortparallel": "\u2225", "ShortRightArrow": "\u2192", "ShortUpArrow": "\u2191", "shy": "\xAD", "sigma": "\u03C3", "Sigma": "\u03A3", "sigmaf": "\u03C2", "sigmav": "\u03C2", "sim": "\u223C", "simdot": "\u2A6A", "sime": "\u2243", "simeq": "\u2243", "simg": "\u2A9E", "simgE": "\u2AA0", "siml": "\u2A9D", "simlE": "\u2A9F", "simne": "\u2246", "simplus": "\u2A24", "simrarr": "\u2972", "slarr": "\u2190", "SmallCircle": "\u2218", "smallsetminus": "\u2216", "smashp": "\u2A33", "smeparsl": "\u29E4", "smid": "\u2223", "smile": "\u2323", "smt": "\u2AAA", "smte": "\u2AAC", "smtes": "\u2AAC\uFE00", "softcy": "\u044C", "SOFTcy": "\u042C", "sol": "/", "solb": "\u29C4", "solbar": "\u233F", "sopf": "\u{1D564}", "Sopf": "\u{1D54A}", "spades": "\u2660", "spadesuit": "\u2660", "spar": "\u2225", "sqcap": "\u2293", "sqcaps": "\u2293\uFE00", "sqcup": "\u2294", "sqcups": "\u2294\uFE00", "Sqrt": "\u221A", "sqsub": "\u228F", "sqsube": "\u2291", "sqsubset": "\u228F", "sqsubseteq": "\u2291", "sqsup": "\u2290", "sqsupe": "\u2292", "sqsupset": "\u2290", "sqsupseteq": "\u2292", "squ": "\u25A1", "square": "\u25A1", "Square": "\u25A1", "SquareIntersection": "\u2293", "SquareSubset": "\u228F", "SquareSubsetEqual": "\u2291", "SquareSuperset": "\u2290", "SquareSupersetEqual": "\u2292", "SquareUnion": "\u2294", "squarf": "\u25AA", "squf": "\u25AA", "srarr": "\u2192", "sscr": "\u{1D4C8}", "Sscr": "\u{1D4AE}", "ssetmn": "\u2216", "ssmile": "\u2323", "sstarf": "\u22C6", "star": "\u2606", "Star": "\u22C6", "starf": "\u2605", "straightepsilon": "\u03F5", "straightphi": "\u03D5", "strns": "\xAF", "sub": "\u2282", "Sub": "\u22D0", "subdot": "\u2ABD", "sube": "\u2286", "subE": "\u2AC5", "subedot": "\u2AC3", "submult": "\u2AC1", "subne": "\u228A", "subnE": "\u2ACB", "subplus": "\u2ABF", "subrarr": "\u2979", "subset": "\u2282", "Subset": "\u22D0", "subseteq": "\u2286", "subseteqq": "\u2AC5", "SubsetEqual": "\u2286", "subsetneq": "\u228A", "subsetneqq": "\u2ACB", "subsim": "\u2AC7", "subsub": "\u2AD5", "subsup": "\u2AD3", "succ": "\u227B", "succapprox": "\u2AB8", "succcurlyeq": "\u227D", "Succeeds": "\u227B", "SucceedsEqual": "\u2AB0", "SucceedsSlantEqual": "\u227D", "SucceedsTilde": "\u227F", "succeq": "\u2AB0", "succnapprox": "\u2ABA", "succneqq": "\u2AB6", "succnsim": "\u22E9", "succsim": "\u227F", "SuchThat": "\u220B", "sum": "\u2211", "Sum": "\u2211", "sung": "\u266A", "sup": "\u2283", "Sup": "\u22D1", "sup1": "\xB9", "sup2": "\xB2", "sup3": "\xB3", "supdot": "\u2ABE", "supdsub": "\u2AD8", "supe": "\u2287", "supE": "\u2AC6", "supedot": "\u2AC4", "Superset": "\u2283", "SupersetEqual": "\u2287", "suphsol": "\u27C9", "suphsub": "\u2AD7", "suplarr": "\u297B", "supmult": "\u2AC2", "supne": "\u228B", "supnE": "\u2ACC", "supplus": "\u2AC0", "supset": "\u2283", "Supset": "\u22D1", "supseteq": "\u2287", "supseteqq": "\u2AC6", "supsetneq": "\u228B", "supsetneqq": "\u2ACC", "supsim": "\u2AC8", "supsub": "\u2AD4", "supsup": "\u2AD6", "swarhk": "\u2926", "swarr": "\u2199", "swArr": "\u21D9", "swarrow": "\u2199", "swnwar": "\u292A", "szlig": "\xDF", "Tab": "	", "target": "\u2316", "tau": "\u03C4", "Tau": "\u03A4", "tbrk": "\u23B4", "tcaron": "\u0165", "Tcaron": "\u0164", "tcedil": "\u0163", "Tcedil": "\u0162", "tcy": "\u0442", "Tcy": "\u0422", "tdot": "\u20DB", "telrec": "\u2315", "tfr": "\u{1D531}", "Tfr": "\u{1D517}", "there4": "\u2234", "therefore": "\u2234", "Therefore": "\u2234", "theta": "\u03B8", "Theta": "\u0398", "thetasym": "\u03D1", "thetav": "\u03D1", "thickapprox": "\u2248", "thicksim": "\u223C", "ThickSpace": "\u205F\u200A", "thinsp": "\u2009", "ThinSpace": "\u2009", "thkap": "\u2248", "thksim": "\u223C", "thorn": "\xFE", "THORN": "\xDE", "tilde": "\u02DC", "Tilde": "\u223C", "TildeEqual": "\u2243", "TildeFullEqual": "\u2245", "TildeTilde": "\u2248", "times": "\xD7", "timesb": "\u22A0", "timesbar": "\u2A31", "timesd": "\u2A30", "tint": "\u222D", "toea": "\u2928", "top": "\u22A4", "topbot": "\u2336", "topcir": "\u2AF1", "topf": "\u{1D565}", "Topf": "\u{1D54B}", "topfork": "\u2ADA", "tosa": "\u2929", "tprime": "\u2034", "trade": "\u2122", "TRADE": "\u2122", "triangle": "\u25B5", "triangledown": "\u25BF", "triangleleft": "\u25C3", "trianglelefteq": "\u22B4", "triangleq": "\u225C", "triangleright": "\u25B9", "trianglerighteq": "\u22B5", "tridot": "\u25EC", "trie": "\u225C", "triminus": "\u2A3A", "TripleDot": "\u20DB", "triplus": "\u2A39", "trisb": "\u29CD", "tritime": "\u2A3B", "trpezium": "\u23E2", "tscr": "\u{1D4C9}", "Tscr": "\u{1D4AF}", "tscy": "\u0446", "TScy": "\u0426", "tshcy": "\u045B", "TSHcy": "\u040B", "tstrok": "\u0167", "Tstrok": "\u0166", "twixt": "\u226C", "twoheadleftarrow": "\u219E", "twoheadrightarrow": "\u21A0", "uacute": "\xFA", "Uacute": "\xDA", "uarr": "\u2191", "uArr": "\u21D1", "Uarr": "\u219F", "Uarrocir": "\u2949", "ubrcy": "\u045E", "Ubrcy": "\u040E", "ubreve": "\u016D", "Ubreve": "\u016C", "ucirc": "\xFB", "Ucirc": "\xDB", "ucy": "\u0443", "Ucy": "\u0423", "udarr": "\u21C5", "udblac": "\u0171", "Udblac": "\u0170", "udhar": "\u296E", "ufisht": "\u297E", "ufr": "\u{1D532}", "Ufr": "\u{1D518}", "ugrave": "\xF9", "Ugrave": "\xD9", "uHar": "\u2963", "uharl": "\u21BF", "uharr": "\u21BE", "uhblk": "\u2580", "ulcorn": "\u231C", "ulcorner": "\u231C", "ulcrop": "\u230F", "ultri": "\u25F8", "umacr": "\u016B", "Umacr": "\u016A", "uml": "\xA8", "UnderBar": "_", "UnderBrace": "\u23DF", "UnderBracket": "\u23B5", "UnderParenthesis": "\u23DD", "Union": "\u22C3", "UnionPlus": "\u228E", "uogon": "\u0173", "Uogon": "\u0172", "uopf": "\u{1D566}", "Uopf": "\u{1D54C}", "uparrow": "\u2191", "Uparrow": "\u21D1", "UpArrow": "\u2191", "UpArrowBar": "\u2912", "UpArrowDownArrow": "\u21C5", "updownarrow": "\u2195", "Updownarrow": "\u21D5", "UpDownArrow": "\u2195", "UpEquilibrium": "\u296E", "upharpoonleft": "\u21BF", "upharpoonright": "\u21BE", "uplus": "\u228E", "UpperLeftArrow": "\u2196", "UpperRightArrow": "\u2197", "upsi": "\u03C5", "Upsi": "\u03D2", "upsih": "\u03D2", "upsilon": "\u03C5", "Upsilon": "\u03A5", "UpTee": "\u22A5", "UpTeeArrow": "\u21A5", "upuparrows": "\u21C8", "urcorn": "\u231D", "urcorner": "\u231D", "urcrop": "\u230E", "uring": "\u016F", "Uring": "\u016E", "urtri": "\u25F9", "uscr": "\u{1D4CA}", "Uscr": "\u{1D4B0}", "utdot": "\u22F0", "utilde": "\u0169", "Utilde": "\u0168", "utri": "\u25B5", "utrif": "\u25B4", "uuarr": "\u21C8", "uuml": "\xFC", "Uuml": "\xDC", "uwangle": "\u29A7", "vangrt": "\u299C", "varepsilon": "\u03F5", "varkappa": "\u03F0", "varnothing": "\u2205", "varphi": "\u03D5", "varpi": "\u03D6", "varpropto": "\u221D", "varr": "\u2195", "vArr": "\u21D5", "varrho": "\u03F1", "varsigma": "\u03C2", "varsubsetneq": "\u228A\uFE00", "varsubsetneqq": "\u2ACB\uFE00", "varsupsetneq": "\u228B\uFE00", "varsupsetneqq": "\u2ACC\uFE00", "vartheta": "\u03D1", "vartriangleleft": "\u22B2", "vartriangleright": "\u22B3", "vBar": "\u2AE8", "Vbar": "\u2AEB", "vBarv": "\u2AE9", "vcy": "\u0432", "Vcy": "\u0412", "vdash": "\u22A2", "vDash": "\u22A8", "Vdash": "\u22A9", "VDash": "\u22AB", "Vdashl": "\u2AE6", "vee": "\u2228", "Vee": "\u22C1", "veebar": "\u22BB", "veeeq": "\u225A", "vellip": "\u22EE", "verbar": "|", "Verbar": "\u2016", "vert": "|", "Vert": "\u2016", "VerticalBar": "\u2223", "VerticalLine": "|", "VerticalSeparator": "\u2758", "VerticalTilde": "\u2240", "VeryThinSpace": "\u200A", "vfr": "\u{1D533}", "Vfr": "\u{1D519}", "vltri": "\u22B2", "vnsub": "\u2282\u20D2", "vnsup": "\u2283\u20D2", "vopf": "\u{1D567}", "Vopf": "\u{1D54D}", "vprop": "\u221D", "vrtri": "\u22B3", "vscr": "\u{1D4CB}", "Vscr": "\u{1D4B1}", "vsubne": "\u228A\uFE00", "vsubnE": "\u2ACB\uFE00", "vsupne": "\u228B\uFE00", "vsupnE": "\u2ACC\uFE00", "Vvdash": "\u22AA", "vzigzag": "\u299A", "wcirc": "\u0175", "Wcirc": "\u0174", "wedbar": "\u2A5F", "wedge": "\u2227", "Wedge": "\u22C0", "wedgeq": "\u2259", "weierp": "\u2118", "wfr": "\u{1D534}", "Wfr": "\u{1D51A}", "wopf": "\u{1D568}", "Wopf": "\u{1D54E}", "wp": "\u2118", "wr": "\u2240", "wreath": "\u2240", "wscr": "\u{1D4CC}", "Wscr": "\u{1D4B2}", "xcap": "\u22C2", "xcirc": "\u25EF", "xcup": "\u22C3", "xdtri": "\u25BD", "xfr": "\u{1D535}", "Xfr": "\u{1D51B}", "xharr": "\u27F7", "xhArr": "\u27FA", "xi": "\u03BE", "Xi": "\u039E", "xlarr": "\u27F5", "xlArr": "\u27F8", "xmap": "\u27FC", "xnis": "\u22FB", "xodot": "\u2A00", "xopf": "\u{1D569}", "Xopf": "\u{1D54F}", "xoplus": "\u2A01", "xotime": "\u2A02", "xrarr": "\u27F6", "xrArr": "\u27F9", "xscr": "\u{1D4CD}", "Xscr": "\u{1D4B3}", "xsqcup": "\u2A06", "xuplus": "\u2A04", "xutri": "\u25B3", "xvee": "\u22C1", "xwedge": "\u22C0", "yacute": "\xFD", "Yacute": "\xDD", "yacy": "\u044F", "YAcy": "\u042F", "ycirc": "\u0177", "Ycirc": "\u0176", "ycy": "\u044B", "Ycy": "\u042B", "yen": "\xA5", "yfr": "\u{1D536}", "Yfr": "\u{1D51C}", "yicy": "\u0457", "YIcy": "\u0407", "yopf": "\u{1D56A}", "Yopf": "\u{1D550}", "yscr": "\u{1D4CE}", "Yscr": "\u{1D4B4}", "yucy": "\u044E", "YUcy": "\u042E", "yuml": "\xFF", "Yuml": "\u0178", "zacute": "\u017A", "Zacute": "\u0179", "zcaron": "\u017E", "Zcaron": "\u017D", "zcy": "\u0437", "Zcy": "\u0417", "zdot": "\u017C", "Zdot": "\u017B", "zeetrf": "\u2128", "ZeroWidthSpace": "\u200B", "zeta": "\u03B6", "Zeta": "\u0396", "zfr": "\u{1D537}", "Zfr": "\u2128", "zhcy": "\u0436", "ZHcy": "\u0416", "zigrarr": "\u21DD", "zopf": "\u{1D56B}", "Zopf": "\u2124", "zscr": "\u{1D4CF}", "Zscr": "\u{1D4B5}", "zwj": "\u200D", "zwnj": "\u200C" };
      var decodeMapLegacy = { "aacute": "\xE1", "Aacute": "\xC1", "acirc": "\xE2", "Acirc": "\xC2", "acute": "\xB4", "aelig": "\xE6", "AElig": "\xC6", "agrave": "\xE0", "Agrave": "\xC0", "amp": "&", "AMP": "&", "aring": "\xE5", "Aring": "\xC5", "atilde": "\xE3", "Atilde": "\xC3", "auml": "\xE4", "Auml": "\xC4", "brvbar": "\xA6", "ccedil": "\xE7", "Ccedil": "\xC7", "cedil": "\xB8", "cent": "\xA2", "copy": "\xA9", "COPY": "\xA9", "curren": "\xA4", "deg": "\xB0", "divide": "\xF7", "eacute": "\xE9", "Eacute": "\xC9", "ecirc": "\xEA", "Ecirc": "\xCA", "egrave": "\xE8", "Egrave": "\xC8", "eth": "\xF0", "ETH": "\xD0", "euml": "\xEB", "Euml": "\xCB", "frac12": "\xBD", "frac14": "\xBC", "frac34": "\xBE", "gt": ">", "GT": ">", "iacute": "\xED", "Iacute": "\xCD", "icirc": "\xEE", "Icirc": "\xCE", "iexcl": "\xA1", "igrave": "\xEC", "Igrave": "\xCC", "iquest": "\xBF", "iuml": "\xEF", "Iuml": "\xCF", "laquo": "\xAB", "lt": "<", "LT": "<", "macr": "\xAF", "micro": "\xB5", "middot": "\xB7", "nbsp": "\xA0", "not": "\xAC", "ntilde": "\xF1", "Ntilde": "\xD1", "oacute": "\xF3", "Oacute": "\xD3", "ocirc": "\xF4", "Ocirc": "\xD4", "ograve": "\xF2", "Ograve": "\xD2", "ordf": "\xAA", "ordm": "\xBA", "oslash": "\xF8", "Oslash": "\xD8", "otilde": "\xF5", "Otilde": "\xD5", "ouml": "\xF6", "Ouml": "\xD6", "para": "\xB6", "plusmn": "\xB1", "pound": "\xA3", "quot": '"', "QUOT": '"', "raquo": "\xBB", "reg": "\xAE", "REG": "\xAE", "sect": "\xA7", "shy": "\xAD", "sup1": "\xB9", "sup2": "\xB2", "sup3": "\xB3", "szlig": "\xDF", "thorn": "\xFE", "THORN": "\xDE", "times": "\xD7", "uacute": "\xFA", "Uacute": "\xDA", "ucirc": "\xFB", "Ucirc": "\xDB", "ugrave": "\xF9", "Ugrave": "\xD9", "uml": "\xA8", "uuml": "\xFC", "Uuml": "\xDC", "yacute": "\xFD", "Yacute": "\xDD", "yen": "\xA5", "yuml": "\xFF" };
      var decodeMapNumeric = { "0": "\uFFFD", "128": "\u20AC", "130": "\u201A", "131": "\u0192", "132": "\u201E", "133": "\u2026", "134": "\u2020", "135": "\u2021", "136": "\u02C6", "137": "\u2030", "138": "\u0160", "139": "\u2039", "140": "\u0152", "142": "\u017D", "145": "\u2018", "146": "\u2019", "147": "\u201C", "148": "\u201D", "149": "\u2022", "150": "\u2013", "151": "\u2014", "152": "\u02DC", "153": "\u2122", "154": "\u0161", "155": "\u203A", "156": "\u0153", "158": "\u017E", "159": "\u0178" };
      var invalidReferenceCodePoints = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977, 64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987, 64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997, 64998, 64999, 65e3, 65001, 65002, 65003, 65004, 65005, 65006, 65007, 65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
      var stringFromCharCode = String.fromCharCode;
      var object = {};
      var hasOwnProperty = object.hasOwnProperty;
      var has2 = function(object2, propertyName) {
        return hasOwnProperty.call(object2, propertyName);
      };
      var contains = function(array, value) {
        var index2 = -1;
        var length = array.length;
        while (++index2 < length) {
          if (array[index2] == value) {
            return true;
          }
        }
        return false;
      };
      var merge2 = function(options, defaults) {
        if (!options) {
          return defaults;
        }
        var result = {};
        var key2;
        for (key2 in defaults) {
          result[key2] = has2(options, key2) ? options[key2] : defaults[key2];
        }
        return result;
      };
      var codePointToSymbol = function(codePoint, strict) {
        var output = "";
        if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
          if (strict) {
            parseError("character reference outside the permissible Unicode range");
          }
          return "\uFFFD";
        }
        if (has2(decodeMapNumeric, codePoint)) {
          if (strict) {
            parseError("disallowed character reference");
          }
          return decodeMapNumeric[codePoint];
        }
        if (strict && contains(invalidReferenceCodePoints, codePoint)) {
          parseError("disallowed character reference");
        }
        if (codePoint > 65535) {
          codePoint -= 65536;
          output += stringFromCharCode(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        output += stringFromCharCode(codePoint);
        return output;
      };
      var hexEscape = function(codePoint) {
        return "&#x" + codePoint.toString(16).toUpperCase() + ";";
      };
      var decEscape = function(codePoint) {
        return "&#" + codePoint + ";";
      };
      var parseError = function(message) {
        throw Error("Parse error: " + message);
      };
      var encode = function(string, options) {
        options = merge2(options, encode.options);
        var strict = options.strict;
        if (strict && regexInvalidRawCodePoint.test(string)) {
          parseError("forbidden code point");
        }
        var encodeEverything = options.encodeEverything;
        var useNamedReferences = options.useNamedReferences;
        var allowUnsafeSymbols = options.allowUnsafeSymbols;
        var escapeCodePoint = options.decimal ? decEscape : hexEscape;
        var escapeBmpSymbol = function(symbol) {
          return escapeCodePoint(symbol.charCodeAt(0));
        };
        if (encodeEverything) {
          string = string.replace(regexAsciiWhitelist, function(symbol) {
            if (useNamedReferences && has2(encodeMap, symbol)) {
              return "&" + encodeMap[symbol] + ";";
            }
            return escapeBmpSymbol(symbol);
          });
          if (useNamedReferences) {
            string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;").replace(/&#x66;&#x6A;/g, "&fjlig;");
          }
          if (useNamedReferences) {
            string = string.replace(regexEncodeNonAscii, function(string2) {
              return "&" + encodeMap[string2] + ";";
            });
          }
        } else if (useNamedReferences) {
          if (!allowUnsafeSymbols) {
            string = string.replace(regexEscape, function(string2) {
              return "&" + encodeMap[string2] + ";";
            });
          }
          string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;");
          string = string.replace(regexEncodeNonAscii, function(string2) {
            return "&" + encodeMap[string2] + ";";
          });
        } else if (!allowUnsafeSymbols) {
          string = string.replace(regexEscape, escapeBmpSymbol);
        }
        return string.replace(regexAstralSymbols, function($0) {
          var high = $0.charCodeAt(0);
          var low = $0.charCodeAt(1);
          var codePoint = (high - 55296) * 1024 + low - 56320 + 65536;
          return escapeCodePoint(codePoint);
        }).replace(regexBmpWhitelist, escapeBmpSymbol);
      };
      encode.options = {
        "allowUnsafeSymbols": false,
        "encodeEverything": false,
        "strict": false,
        "useNamedReferences": false,
        "decimal": false
      };
      var decode = function(html, options) {
        options = merge2(options, decode.options);
        var strict = options.strict;
        if (strict && regexInvalidEntity.test(html)) {
          parseError("malformed character reference");
        }
        return html.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7, $8) {
          var codePoint;
          var semicolon;
          var decDigits;
          var hexDigits;
          var reference;
          var next;
          if ($1) {
            reference = $1;
            return decodeMap[reference];
          }
          if ($2) {
            reference = $2;
            next = $3;
            if (next && options.isAttributeValue) {
              if (strict && next == "=") {
                parseError("`&` did not start a character reference");
              }
              return $0;
            } else {
              if (strict) {
                parseError(
                  "named character reference was not terminated by a semicolon"
                );
              }
              return decodeMapLegacy[reference] + (next || "");
            }
          }
          if ($4) {
            decDigits = $4;
            semicolon = $5;
            if (strict && !semicolon) {
              parseError("character reference was not terminated by a semicolon");
            }
            codePoint = parseInt(decDigits, 10);
            return codePointToSymbol(codePoint, strict);
          }
          if ($6) {
            hexDigits = $6;
            semicolon = $7;
            if (strict && !semicolon) {
              parseError("character reference was not terminated by a semicolon");
            }
            codePoint = parseInt(hexDigits, 16);
            return codePointToSymbol(codePoint, strict);
          }
          if (strict) {
            parseError(
              "named character reference was not terminated by a semicolon"
            );
          }
          return $0;
        });
      };
      decode.options = {
        "isAttributeValue": false,
        "strict": false
      };
      var escape = function(string) {
        return string.replace(regexEscape, function($0) {
          return escapeMap[$0];
        });
      };
      var he2 = {
        "version": "1.2.0",
        "encode": encode,
        "decode": decode,
        "escape": escape,
        "unescape": decode
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define(function() {
          return he2;
        });
      } else if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          freeModule.exports = he2;
        } else {
          for (var key in he2) {
            has2(he2, key) && (freeExports[key] = he2[key]);
          }
        }
      } else {
        root2.he = he2;
      }
    })(exports);
  }
});

// node_modules/nunjucks/src/lib.js
var require_lib3 = __commonJS({
  "node_modules/nunjucks/src/lib.js"(exports, module) {
    "use strict";
    var ArrayProto = Array.prototype;
    var ObjProto = Object.prototype;
    var escapeMap = {
      "&": "&amp;",
      '"': "&quot;",
      "'": "&#39;",
      "<": "&lt;",
      ">": "&gt;",
      "\\": "&#92;"
    };
    var escapeRegex = /[&"'<>\\]/g;
    var _exports = module.exports = {};
    function hasOwnProp(obj, k) {
      return ObjProto.hasOwnProperty.call(obj, k);
    }
    _exports.hasOwnProp = hasOwnProp;
    function lookupEscape(ch) {
      return escapeMap[ch];
    }
    function _prettifyError(path2, withInternals, err) {
      if (!err.Update) {
        err = new _exports.TemplateError(err);
      }
      err.Update(path2);
      if (!withInternals) {
        var old = err;
        err = new Error(old.message);
        err.name = old.name;
      }
      return err;
    }
    _exports._prettifyError = _prettifyError;
    function TemplateError(message, lineno, colno) {
      var err;
      var cause;
      if (message instanceof Error) {
        cause = message;
        message = cause.name + ": " + cause.message;
      }
      if (Object.setPrototypeOf) {
        err = new Error(message);
        Object.setPrototypeOf(err, TemplateError.prototype);
      } else {
        err = this;
        Object.defineProperty(err, "message", {
          enumerable: false,
          writable: true,
          value: message
        });
      }
      Object.defineProperty(err, "name", {
        value: "Template render error"
      });
      if (Error.captureStackTrace) {
        Error.captureStackTrace(err, this.constructor);
      }
      var getStack;
      if (cause) {
        var stackDescriptor = Object.getOwnPropertyDescriptor(cause, "stack");
        getStack = stackDescriptor && (stackDescriptor.get || function() {
          return stackDescriptor.value;
        });
        if (!getStack) {
          getStack = function getStack2() {
            return cause.stack;
          };
        }
      } else {
        var stack = new Error(message).stack;
        getStack = function getStack2() {
          return stack;
        };
      }
      Object.defineProperty(err, "stack", {
        get: function get() {
          return getStack.call(err);
        }
      });
      Object.defineProperty(err, "cause", {
        value: cause
      });
      err.lineno = lineno;
      err.colno = colno;
      err.firstUpdate = true;
      err.Update = function Update(path2) {
        var msg = "(" + (path2 || "unknown path") + ")";
        if (this.firstUpdate) {
          if (this.lineno && this.colno) {
            msg += " [Line " + this.lineno + ", Column " + this.colno + "]";
          } else if (this.lineno) {
            msg += " [Line " + this.lineno + "]";
          }
        }
        msg += "\n ";
        if (this.firstUpdate) {
          msg += " ";
        }
        this.message = msg + (this.message || "");
        this.firstUpdate = false;
        return this;
      };
      return err;
    }
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(TemplateError.prototype, Error.prototype);
    } else {
      TemplateError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: TemplateError
        }
      });
    }
    _exports.TemplateError = TemplateError;
    function escape(val) {
      return val.replace(escapeRegex, lookupEscape);
    }
    _exports.escape = escape;
    function isFunction(obj) {
      return ObjProto.toString.call(obj) === "[object Function]";
    }
    _exports.isFunction = isFunction;
    function isArray2(obj) {
      return ObjProto.toString.call(obj) === "[object Array]";
    }
    _exports.isArray = isArray2;
    function isString(obj) {
      return ObjProto.toString.call(obj) === "[object String]";
    }
    _exports.isString = isString;
    function isObject2(obj) {
      return ObjProto.toString.call(obj) === "[object Object]";
    }
    _exports.isObject = isObject2;
    function _prepareAttributeParts(attr) {
      if (!attr) {
        return [];
      }
      if (typeof attr === "string") {
        return attr.split(".");
      }
      return [attr];
    }
    function getAttrGetter(attribute2) {
      var parts = _prepareAttributeParts(attribute2);
      return function attrGetter(item) {
        var _item = item;
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          if (hasOwnProp(_item, part)) {
            _item = _item[part];
          } else {
            return void 0;
          }
        }
        return _item;
      };
    }
    _exports.getAttrGetter = getAttrGetter;
    function groupBy(obj, val, throwOnUndefined) {
      var result = {};
      var iterator = isFunction(val) ? val : getAttrGetter(val);
      for (var i = 0; i < obj.length; i++) {
        var value = obj[i];
        var key = iterator(value, i);
        if (key === void 0 && throwOnUndefined === true) {
          throw new TypeError('groupby: attribute "' + val + '" resolved to undefined');
        }
        (result[key] || (result[key] = [])).push(value);
      }
      return result;
    }
    _exports.groupBy = groupBy;
    function toArray2(obj) {
      return Array.prototype.slice.call(obj);
    }
    _exports.toArray = toArray2;
    function without(array) {
      var result = [];
      if (!array) {
        return result;
      }
      var length = array.length;
      var contains = toArray2(arguments).slice(1);
      var index2 = -1;
      while (++index2 < length) {
        if (indexOf2(contains, array[index2]) === -1) {
          result.push(array[index2]);
        }
      }
      return result;
    }
    _exports.without = without;
    function repeat2(char_, n) {
      var str2 = "";
      for (var i = 0; i < n; i++) {
        str2 += char_;
      }
      return str2;
    }
    _exports.repeat = repeat2;
    function each(obj, func, context) {
      if (obj == null) {
        return;
      }
      if (ArrayProto.forEach && obj.forEach === ArrayProto.forEach) {
        obj.forEach(func, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          func.call(context, obj[i], i, obj);
        }
      }
    }
    _exports.each = each;
    function map2(obj, func) {
      var results = [];
      if (obj == null) {
        return results;
      }
      if (ArrayProto.map && obj.map === ArrayProto.map) {
        return obj.map(func);
      }
      for (var i = 0; i < obj.length; i++) {
        results[results.length] = func(obj[i], i);
      }
      if (obj.length === +obj.length) {
        results.length = obj.length;
      }
      return results;
    }
    _exports.map = map2;
    function asyncIter(arr, iter, cb) {
      var i = -1;
      function next() {
        i++;
        if (i < arr.length) {
          iter(arr[i], i, next, cb);
        } else {
          cb();
        }
      }
      next();
    }
    _exports.asyncIter = asyncIter;
    function asyncFor(obj, iter, cb) {
      var keys = keys_(obj || {});
      var len = keys.length;
      var i = -1;
      function next() {
        i++;
        var k = keys[i];
        if (i < len) {
          iter(k, obj[k], i, len, next);
        } else {
          cb();
        }
      }
      next();
    }
    _exports.asyncFor = asyncFor;
    function indexOf2(arr, searchElement, fromIndex) {
      return Array.prototype.indexOf.call(arr || [], searchElement, fromIndex);
    }
    _exports.indexOf = indexOf2;
    function keys_(obj) {
      var arr = [];
      for (var k in obj) {
        if (hasOwnProp(obj, k)) {
          arr.push(k);
        }
      }
      return arr;
    }
    _exports.keys = keys_;
    function _entries(obj) {
      return keys_(obj).map(function(k) {
        return [k, obj[k]];
      });
    }
    _exports._entries = _entries;
    function _values(obj) {
      return keys_(obj).map(function(k) {
        return obj[k];
      });
    }
    _exports._values = _values;
    function extend3(obj1, obj2) {
      obj1 = obj1 || {};
      keys_(obj2).forEach(function(k) {
        obj1[k] = obj2[k];
      });
      return obj1;
    }
    _exports._assign = _exports.extend = extend3;
    function inOperator(key, val) {
      if (isArray2(val) || isString(val)) {
        return val.indexOf(key) !== -1;
      } else if (isObject2(val)) {
        return key in val;
      }
      throw new Error('Cannot use "in" operator to search for "' + key + '" in unexpected types.');
    }
    _exports.inOperator = inOperator;
  }
});

// node_modules/asap/raw.js
var require_raw = __commonJS({
  "node_modules/asap/raw.js"(exports, module) {
    "use strict";
    var domain;
    var hasSetImmediate = typeof setImmediate === "function";
    module.exports = rawAsap;
    function rawAsap(task) {
      if (!queue.length) {
        requestFlush();
        flushing = true;
      }
      queue[queue.length] = task;
    }
    var queue = [];
    var flushing = false;
    var index2 = 0;
    var capacity = 1024;
    function flush() {
      while (index2 < queue.length) {
        var currentIndex = index2;
        index2 = index2 + 1;
        queue[currentIndex].call();
        if (index2 > capacity) {
          for (var scan = 0, newLength = queue.length - index2; scan < newLength; scan++) {
            queue[scan] = queue[scan + index2];
          }
          queue.length -= index2;
          index2 = 0;
        }
      }
      queue.length = 0;
      index2 = 0;
      flushing = false;
    }
    rawAsap.requestFlush = requestFlush;
    function requestFlush() {
      var parentDomain = process.domain;
      if (parentDomain) {
        if (!domain) {
          domain = __require("domain");
        }
        domain.active = process.domain = null;
      }
      if (flushing && hasSetImmediate) {
        setImmediate(flush);
      } else {
        process.nextTick(flush);
      }
      if (parentDomain) {
        domain.active = process.domain = parentDomain;
      }
    }
  }
});

// node_modules/asap/asap.js
var require_asap = __commonJS({
  "node_modules/asap/asap.js"(exports, module) {
    "use strict";
    var rawAsap = require_raw();
    var freeTasks = [];
    module.exports = asap;
    function asap(task) {
      var rawTask;
      if (freeTasks.length) {
        rawTask = freeTasks.pop();
      } else {
        rawTask = new RawTask();
      }
      rawTask.task = task;
      rawTask.domain = process.domain;
      rawAsap(rawTask);
    }
    function RawTask() {
      this.task = null;
      this.domain = null;
    }
    RawTask.prototype.call = function() {
      if (this.domain) {
        this.domain.enter();
      }
      var threw = true;
      try {
        this.task.call();
        threw = false;
        if (this.domain) {
          this.domain.exit();
        }
      } finally {
        if (threw) {
          rawAsap.requestFlush();
        }
        this.task = null;
        this.domain = null;
        freeTasks.push(this);
      }
    };
  }
});

// node_modules/a-sync-waterfall/index.js
var require_a_sync_waterfall = __commonJS({
  "node_modules/a-sync-waterfall/index.js"(exports, module) {
    (function(globals) {
      "use strict";
      var executeSync = function() {
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[0] === "function") {
          args[0].apply(null, args.splice(1));
        }
      };
      var executeAsync = function(fn) {
        if (typeof setImmediate === "function") {
          setImmediate(fn);
        } else if (typeof process !== "undefined" && process.nextTick) {
          process.nextTick(fn);
        } else {
          setTimeout(fn, 0);
        }
      };
      var makeIterator = function(tasks) {
        var makeCallback = function(index2) {
          var fn = function() {
            if (tasks.length) {
              tasks[index2].apply(null, arguments);
            }
            return fn.next();
          };
          fn.next = function() {
            return index2 < tasks.length - 1 ? makeCallback(index2 + 1) : null;
          };
          return fn;
        };
        return makeCallback(0);
      };
      var _isArray = Array.isArray || function(maybeArray) {
        return Object.prototype.toString.call(maybeArray) === "[object Array]";
      };
      var waterfall = function(tasks, callback, forceAsync) {
        var nextTick = forceAsync ? executeAsync : executeSync;
        callback = callback || function() {
        };
        if (!_isArray(tasks)) {
          var err = new Error("First argument to waterfall must be an array of functions");
          return callback(err);
        }
        if (!tasks.length) {
          return callback();
        }
        var wrapIterator = function(iterator) {
          return function(err2) {
            if (err2) {
              callback.apply(null, arguments);
              callback = function() {
              };
            } else {
              var args = Array.prototype.slice.call(arguments, 1);
              var next = iterator.next();
              if (next) {
                args.push(wrapIterator(next));
              } else {
                args.push(callback);
              }
              nextTick(function() {
                iterator.apply(null, args);
              });
            }
          };
        };
        wrapIterator(makeIterator(tasks))();
      };
      if (typeof define !== "undefined" && define.amd) {
        define([], function() {
          return waterfall;
        });
      } else if (typeof module !== "undefined" && module.exports) {
        module.exports = waterfall;
      } else {
        globals.waterfall = waterfall;
      }
    })(exports);
  }
});

// node_modules/nunjucks/src/lexer.js
var require_lexer = __commonJS({
  "node_modules/nunjucks/src/lexer.js"(exports, module) {
    "use strict";
    var lib = require_lib3();
    var whitespaceChars = " \n	\r\xA0";
    var delimChars = "()[]{}%*-+~/#,:|.<>=!";
    var intChars = "0123456789";
    var BLOCK_START = "{%";
    var BLOCK_END = "%}";
    var VARIABLE_START = "{{";
    var VARIABLE_END = "}}";
    var COMMENT_START = "{#";
    var COMMENT_END = "#}";
    var TOKEN_STRING = "string";
    var TOKEN_WHITESPACE = "whitespace";
    var TOKEN_DATA = "data";
    var TOKEN_BLOCK_START = "block-start";
    var TOKEN_BLOCK_END = "block-end";
    var TOKEN_VARIABLE_START = "variable-start";
    var TOKEN_VARIABLE_END = "variable-end";
    var TOKEN_COMMENT = "comment";
    var TOKEN_LEFT_PAREN = "left-paren";
    var TOKEN_RIGHT_PAREN = "right-paren";
    var TOKEN_LEFT_BRACKET = "left-bracket";
    var TOKEN_RIGHT_BRACKET = "right-bracket";
    var TOKEN_LEFT_CURLY = "left-curly";
    var TOKEN_RIGHT_CURLY = "right-curly";
    var TOKEN_OPERATOR = "operator";
    var TOKEN_COMMA = "comma";
    var TOKEN_COLON = "colon";
    var TOKEN_TILDE = "tilde";
    var TOKEN_PIPE = "pipe";
    var TOKEN_INT = "int";
    var TOKEN_FLOAT = "float";
    var TOKEN_BOOLEAN = "boolean";
    var TOKEN_NONE = "none";
    var TOKEN_SYMBOL = "symbol";
    var TOKEN_SPECIAL = "special";
    var TOKEN_REGEX = "regex";
    function token(type2, value, lineno, colno) {
      return {
        type: type2,
        value,
        lineno,
        colno
      };
    }
    var Tokenizer = /* @__PURE__ */ (function() {
      function Tokenizer2(str2, opts) {
        this.str = str2;
        this.index = 0;
        this.len = str2.length;
        this.lineno = 0;
        this.colno = 0;
        this.in_code = false;
        opts = opts || {};
        var tags = opts.tags || {};
        this.tags = {
          BLOCK_START: tags.blockStart || BLOCK_START,
          BLOCK_END: tags.blockEnd || BLOCK_END,
          VARIABLE_START: tags.variableStart || VARIABLE_START,
          VARIABLE_END: tags.variableEnd || VARIABLE_END,
          COMMENT_START: tags.commentStart || COMMENT_START,
          COMMENT_END: tags.commentEnd || COMMENT_END
        };
        this.trimBlocks = !!opts.trimBlocks;
        this.lstripBlocks = !!opts.lstripBlocks;
      }
      var _proto = Tokenizer2.prototype;
      _proto.nextToken = function nextToken() {
        var lineno = this.lineno;
        var colno = this.colno;
        var tok;
        if (this.in_code) {
          var cur = this.current();
          if (this.isFinished()) {
            return null;
          } else if (cur === '"' || cur === "'") {
            return token(TOKEN_STRING, this._parseString(cur), lineno, colno);
          } else if (tok = this._extract(whitespaceChars)) {
            return token(TOKEN_WHITESPACE, tok, lineno, colno);
          } else if ((tok = this._extractString(this.tags.BLOCK_END)) || (tok = this._extractString("-" + this.tags.BLOCK_END))) {
            this.in_code = false;
            if (this.trimBlocks) {
              cur = this.current();
              if (cur === "\n") {
                this.forward();
              } else if (cur === "\r") {
                this.forward();
                cur = this.current();
                if (cur === "\n") {
                  this.forward();
                } else {
                  this.back();
                }
              }
            }
            return token(TOKEN_BLOCK_END, tok, lineno, colno);
          } else if ((tok = this._extractString(this.tags.VARIABLE_END)) || (tok = this._extractString("-" + this.tags.VARIABLE_END))) {
            this.in_code = false;
            return token(TOKEN_VARIABLE_END, tok, lineno, colno);
          } else if (cur === "r" && this.str.charAt(this.index + 1) === "/") {
            this.forwardN(2);
            var regexBody = "";
            while (!this.isFinished()) {
              if (this.current() === "/" && this.previous() !== "\\") {
                this.forward();
                break;
              } else {
                regexBody += this.current();
                this.forward();
              }
            }
            var POSSIBLE_FLAGS = ["g", "i", "m", "y"];
            var regexFlags = "";
            while (!this.isFinished()) {
              var isCurrentAFlag = POSSIBLE_FLAGS.indexOf(this.current()) !== -1;
              if (isCurrentAFlag) {
                regexFlags += this.current();
                this.forward();
              } else {
                break;
              }
            }
            return token(TOKEN_REGEX, {
              body: regexBody,
              flags: regexFlags
            }, lineno, colno);
          } else if (delimChars.indexOf(cur) !== -1) {
            this.forward();
            var complexOps = ["==", "===", "!=", "!==", "<=", ">=", "//", "**"];
            var curComplex = cur + this.current();
            var type2;
            if (lib.indexOf(complexOps, curComplex) !== -1) {
              this.forward();
              cur = curComplex;
              if (lib.indexOf(complexOps, curComplex + this.current()) !== -1) {
                cur = curComplex + this.current();
                this.forward();
              }
            }
            switch (cur) {
              case "(":
                type2 = TOKEN_LEFT_PAREN;
                break;
              case ")":
                type2 = TOKEN_RIGHT_PAREN;
                break;
              case "[":
                type2 = TOKEN_LEFT_BRACKET;
                break;
              case "]":
                type2 = TOKEN_RIGHT_BRACKET;
                break;
              case "{":
                type2 = TOKEN_LEFT_CURLY;
                break;
              case "}":
                type2 = TOKEN_RIGHT_CURLY;
                break;
              case ",":
                type2 = TOKEN_COMMA;
                break;
              case ":":
                type2 = TOKEN_COLON;
                break;
              case "~":
                type2 = TOKEN_TILDE;
                break;
              case "|":
                type2 = TOKEN_PIPE;
                break;
              default:
                type2 = TOKEN_OPERATOR;
            }
            return token(type2, cur, lineno, colno);
          } else {
            tok = this._extractUntil(whitespaceChars + delimChars);
            if (tok.match(/^[-+]?[0-9]+$/)) {
              if (this.current() === ".") {
                this.forward();
                var dec = this._extract(intChars);
                return token(TOKEN_FLOAT, tok + "." + dec, lineno, colno);
              } else {
                return token(TOKEN_INT, tok, lineno, colno);
              }
            } else if (tok.match(/^(true|false)$/)) {
              return token(TOKEN_BOOLEAN, tok, lineno, colno);
            } else if (tok === "none") {
              return token(TOKEN_NONE, tok, lineno, colno);
            } else if (tok === "null") {
              return token(TOKEN_NONE, tok, lineno, colno);
            } else if (tok) {
              return token(TOKEN_SYMBOL, tok, lineno, colno);
            } else {
              throw new Error("Unexpected value while parsing: " + tok);
            }
          }
        } else {
          var beginChars = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
          if (this.isFinished()) {
            return null;
          } else if ((tok = this._extractString(this.tags.BLOCK_START + "-")) || (tok = this._extractString(this.tags.BLOCK_START))) {
            this.in_code = true;
            return token(TOKEN_BLOCK_START, tok, lineno, colno);
          } else if ((tok = this._extractString(this.tags.VARIABLE_START + "-")) || (tok = this._extractString(this.tags.VARIABLE_START))) {
            this.in_code = true;
            return token(TOKEN_VARIABLE_START, tok, lineno, colno);
          } else {
            tok = "";
            var data;
            var inComment = false;
            if (this._matches(this.tags.COMMENT_START)) {
              inComment = true;
              tok = this._extractString(this.tags.COMMENT_START);
            }
            while ((data = this._extractUntil(beginChars)) !== null) {
              tok += data;
              if ((this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !inComment) {
                if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= tok.length) {
                  var lastLine = tok.slice(-this.colno);
                  if (/^\s+$/.test(lastLine)) {
                    tok = tok.slice(0, -this.colno);
                    if (!tok.length) {
                      return this.nextToken();
                    }
                  }
                }
                break;
              } else if (this._matches(this.tags.COMMENT_END)) {
                if (!inComment) {
                  throw new Error("unexpected end of comment");
                }
                tok += this._extractString(this.tags.COMMENT_END);
                break;
              } else {
                tok += this.current();
                this.forward();
              }
            }
            if (data === null && inComment) {
              throw new Error("expected end of comment, got end of file");
            }
            return token(inComment ? TOKEN_COMMENT : TOKEN_DATA, tok, lineno, colno);
          }
        }
      };
      _proto._parseString = function _parseString(delimiter) {
        this.forward();
        var str2 = "";
        while (!this.isFinished() && this.current() !== delimiter) {
          var cur = this.current();
          if (cur === "\\") {
            this.forward();
            switch (this.current()) {
              case "n":
                str2 += "\n";
                break;
              case "t":
                str2 += "	";
                break;
              case "r":
                str2 += "\r";
                break;
              default:
                str2 += this.current();
            }
            this.forward();
          } else {
            str2 += cur;
            this.forward();
          }
        }
        this.forward();
        return str2;
      };
      _proto._matches = function _matches(str2) {
        if (this.index + str2.length > this.len) {
          return null;
        }
        var m = this.str.slice(this.index, this.index + str2.length);
        return m === str2;
      };
      _proto._extractString = function _extractString(str2) {
        if (this._matches(str2)) {
          this.forwardN(str2.length);
          return str2;
        }
        return null;
      };
      _proto._extractUntil = function _extractUntil(charString) {
        return this._extractMatching(true, charString || "");
      };
      _proto._extract = function _extract(charString) {
        return this._extractMatching(false, charString);
      };
      _proto._extractMatching = function _extractMatching(breakOnMatch, charString) {
        if (this.isFinished()) {
          return null;
        }
        var first = charString.indexOf(this.current());
        if (breakOnMatch && first === -1 || !breakOnMatch && first !== -1) {
          var t = this.current();
          this.forward();
          var idx = charString.indexOf(this.current());
          while ((breakOnMatch && idx === -1 || !breakOnMatch && idx !== -1) && !this.isFinished()) {
            t += this.current();
            this.forward();
            idx = charString.indexOf(this.current());
          }
          return t;
        }
        return "";
      };
      _proto._extractRegex = function _extractRegex(regex) {
        var matches2 = this.currentStr().match(regex);
        if (!matches2) {
          return null;
        }
        this.forwardN(matches2[0].length);
        return matches2;
      };
      _proto.isFinished = function isFinished() {
        return this.index >= this.len;
      };
      _proto.forwardN = function forwardN(n) {
        for (var i = 0; i < n; i++) {
          this.forward();
        }
      };
      _proto.forward = function forward() {
        this.index++;
        if (this.previous() === "\n") {
          this.lineno++;
          this.colno = 0;
        } else {
          this.colno++;
        }
      };
      _proto.backN = function backN(n) {
        for (var i = 0; i < n; i++) {
          this.back();
        }
      };
      _proto.back = function back() {
        this.index--;
        if (this.current() === "\n") {
          this.lineno--;
          var idx = this.src.lastIndexOf("\n", this.index - 1);
          if (idx === -1) {
            this.colno = this.index;
          } else {
            this.colno = this.index - idx;
          }
        } else {
          this.colno--;
        }
      };
      _proto.current = function current() {
        if (!this.isFinished()) {
          return this.str.charAt(this.index);
        }
        return "";
      };
      _proto.currentStr = function currentStr() {
        if (!this.isFinished()) {
          return this.str.substr(this.index);
        }
        return "";
      };
      _proto.previous = function previous() {
        return this.str.charAt(this.index - 1);
      };
      return Tokenizer2;
    })();
    module.exports = {
      lex: function lex(src, opts) {
        return new Tokenizer(src, opts);
      },
      TOKEN_STRING,
      TOKEN_WHITESPACE,
      TOKEN_DATA,
      TOKEN_BLOCK_START,
      TOKEN_BLOCK_END,
      TOKEN_VARIABLE_START,
      TOKEN_VARIABLE_END,
      TOKEN_COMMENT,
      TOKEN_LEFT_PAREN,
      TOKEN_RIGHT_PAREN,
      TOKEN_LEFT_BRACKET,
      TOKEN_RIGHT_BRACKET,
      TOKEN_LEFT_CURLY,
      TOKEN_RIGHT_CURLY,
      TOKEN_OPERATOR,
      TOKEN_COMMA,
      TOKEN_COLON,
      TOKEN_TILDE,
      TOKEN_PIPE,
      TOKEN_INT,
      TOKEN_FLOAT,
      TOKEN_BOOLEAN,
      TOKEN_NONE,
      TOKEN_SYMBOL,
      TOKEN_SPECIAL,
      TOKEN_REGEX
    };
  }
});

// node_modules/nunjucks/src/object.js
var require_object = __commonJS({
  "node_modules/nunjucks/src/object.js"(exports, module) {
    "use strict";
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var EventEmitter = __require("events");
    var lib = require_lib3();
    function parentWrap(parent2, prop) {
      if (typeof parent2 !== "function" || typeof prop !== "function") {
        return prop;
      }
      return function wrap() {
        var tmp = this.parent;
        this.parent = parent2;
        var res = prop.apply(this, arguments);
        this.parent = tmp;
        return res;
      };
    }
    function extendClass(cls, name2, props) {
      props = props || {};
      lib.keys(props).forEach(function(k) {
        props[k] = parentWrap(cls.prototype[k], props[k]);
      });
      var subclass = /* @__PURE__ */ (function(_cls) {
        _inheritsLoose(subclass2, _cls);
        function subclass2() {
          return _cls.apply(this, arguments) || this;
        }
        _createClass(subclass2, [{
          key: "typename",
          get: function get() {
            return name2;
          }
        }]);
        return subclass2;
      })(cls);
      lib._assign(subclass.prototype, props);
      return subclass;
    }
    var Obj = /* @__PURE__ */ (function() {
      function Obj2() {
        this.init.apply(this, arguments);
      }
      var _proto = Obj2.prototype;
      _proto.init = function init2() {
      };
      Obj2.extend = function extend3(name2, props) {
        if (typeof name2 === "object") {
          props = name2;
          name2 = "anonymous";
        }
        return extendClass(this, name2, props);
      };
      _createClass(Obj2, [{
        key: "typename",
        get: function get() {
          return this.constructor.name;
        }
      }]);
      return Obj2;
    })();
    var EmitterObj = /* @__PURE__ */ (function(_EventEmitter) {
      _inheritsLoose(EmitterObj2, _EventEmitter);
      function EmitterObj2() {
        var _this2;
        var _this;
        _this = _EventEmitter.call(this) || this;
        (_this2 = _this).init.apply(_this2, arguments);
        return _this;
      }
      var _proto2 = EmitterObj2.prototype;
      _proto2.init = function init2() {
      };
      EmitterObj2.extend = function extend3(name2, props) {
        if (typeof name2 === "object") {
          props = name2;
          name2 = "anonymous";
        }
        return extendClass(this, name2, props);
      };
      _createClass(EmitterObj2, [{
        key: "typename",
        get: function get() {
          return this.constructor.name;
        }
      }]);
      return EmitterObj2;
    })(EventEmitter);
    module.exports = {
      Obj,
      EmitterObj
    };
  }
});

// node_modules/nunjucks/src/nodes.js
var require_nodes = __commonJS({
  "node_modules/nunjucks/src/nodes.js"(exports, module) {
    "use strict";
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var _require = require_object();
    var Obj = _require.Obj;
    function traverseAndCheck(obj, type2, results) {
      if (obj instanceof type2) {
        results.push(obj);
      }
      if (obj instanceof Node) {
        obj.findAll(type2, results);
      }
    }
    var Node = /* @__PURE__ */ (function(_Obj) {
      _inheritsLoose(Node2, _Obj);
      function Node2() {
        return _Obj.apply(this, arguments) || this;
      }
      var _proto = Node2.prototype;
      _proto.init = function init2(lineno, colno) {
        var _arguments = arguments, _this = this;
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        this.lineno = lineno;
        this.colno = colno;
        this.fields.forEach(function(field, i) {
          var val = _arguments[i + 2];
          if (val === void 0) {
            val = null;
          }
          _this[field] = val;
        });
      };
      _proto.findAll = function findAll(type2, results) {
        var _this2 = this;
        results = results || [];
        if (this instanceof NodeList) {
          this.children.forEach(function(child) {
            return traverseAndCheck(child, type2, results);
          });
        } else {
          this.fields.forEach(function(field) {
            return traverseAndCheck(_this2[field], type2, results);
          });
        }
        return results;
      };
      _proto.iterFields = function iterFields(func) {
        var _this3 = this;
        this.fields.forEach(function(field) {
          func(_this3[field], field);
        });
      };
      return Node2;
    })(Obj);
    var Value = /* @__PURE__ */ (function(_Node) {
      _inheritsLoose(Value2, _Node);
      function Value2() {
        return _Node.apply(this, arguments) || this;
      }
      _createClass(Value2, [{
        key: "typename",
        get: function get() {
          return "Value";
        }
      }, {
        key: "fields",
        get: function get() {
          return ["value"];
        }
      }]);
      return Value2;
    })(Node);
    var NodeList = /* @__PURE__ */ (function(_Node2) {
      _inheritsLoose(NodeList2, _Node2);
      function NodeList2() {
        return _Node2.apply(this, arguments) || this;
      }
      var _proto2 = NodeList2.prototype;
      _proto2.init = function init2(lineno, colno, nodes) {
        _Node2.prototype.init.call(this, lineno, colno, nodes || []);
      };
      _proto2.addChild = function addChild(node) {
        this.children.push(node);
      };
      _createClass(NodeList2, [{
        key: "typename",
        get: function get() {
          return "NodeList";
        }
      }, {
        key: "fields",
        get: function get() {
          return ["children"];
        }
      }]);
      return NodeList2;
    })(Node);
    var Root = NodeList.extend("Root");
    var Literal = Value.extend("Literal");
    var _Symbol = Value.extend("Symbol");
    var Group = NodeList.extend("Group");
    var ArrayNode = NodeList.extend("Array");
    var Pair = Node.extend("Pair", {
      fields: ["key", "value"]
    });
    var Dict = NodeList.extend("Dict");
    var LookupVal = Node.extend("LookupVal", {
      fields: ["target", "val"]
    });
    var If = Node.extend("If", {
      fields: ["cond", "body", "else_"]
    });
    var IfAsync = If.extend("IfAsync");
    var InlineIf = Node.extend("InlineIf", {
      fields: ["cond", "body", "else_"]
    });
    var For = Node.extend("For", {
      fields: ["arr", "name", "body", "else_"]
    });
    var AsyncEach = For.extend("AsyncEach");
    var AsyncAll = For.extend("AsyncAll");
    var Macro = Node.extend("Macro", {
      fields: ["name", "args", "body"]
    });
    var Caller = Macro.extend("Caller");
    var Import = Node.extend("Import", {
      fields: ["template", "target", "withContext"]
    });
    var FromImport = /* @__PURE__ */ (function(_Node3) {
      _inheritsLoose(FromImport2, _Node3);
      function FromImport2() {
        return _Node3.apply(this, arguments) || this;
      }
      var _proto3 = FromImport2.prototype;
      _proto3.init = function init2(lineno, colno, template, names, withContext) {
        _Node3.prototype.init.call(this, lineno, colno, template, names || new NodeList(), withContext);
      };
      _createClass(FromImport2, [{
        key: "typename",
        get: function get() {
          return "FromImport";
        }
      }, {
        key: "fields",
        get: function get() {
          return ["template", "names", "withContext"];
        }
      }]);
      return FromImport2;
    })(Node);
    var FunCall = Node.extend("FunCall", {
      fields: ["name", "args"]
    });
    var Filter = FunCall.extend("Filter");
    var FilterAsync = Filter.extend("FilterAsync", {
      fields: ["name", "args", "symbol"]
    });
    var KeywordArgs = Dict.extend("KeywordArgs");
    var Block = Node.extend("Block", {
      fields: ["name", "body"]
    });
    var Super = Node.extend("Super", {
      fields: ["blockName", "symbol"]
    });
    var TemplateRef = Node.extend("TemplateRef", {
      fields: ["template"]
    });
    var Extends = TemplateRef.extend("Extends");
    var Include = Node.extend("Include", {
      fields: ["template", "ignoreMissing"]
    });
    var Set2 = Node.extend("Set", {
      fields: ["targets", "value"]
    });
    var Switch = Node.extend("Switch", {
      fields: ["expr", "cases", "default"]
    });
    var Case = Node.extend("Case", {
      fields: ["cond", "body"]
    });
    var Output = NodeList.extend("Output");
    var Capture = Node.extend("Capture", {
      fields: ["body"]
    });
    var TemplateData = Literal.extend("TemplateData");
    var UnaryOp = Node.extend("UnaryOp", {
      fields: ["target"]
    });
    var BinOp = Node.extend("BinOp", {
      fields: ["left", "right"]
    });
    var In = BinOp.extend("In");
    var Is = BinOp.extend("Is");
    var Or = BinOp.extend("Or");
    var And = BinOp.extend("And");
    var Not = UnaryOp.extend("Not");
    var Add = BinOp.extend("Add");
    var Concat = BinOp.extend("Concat");
    var Sub = BinOp.extend("Sub");
    var Mul = BinOp.extend("Mul");
    var Div = BinOp.extend("Div");
    var FloorDiv = BinOp.extend("FloorDiv");
    var Mod = BinOp.extend("Mod");
    var Pow = BinOp.extend("Pow");
    var Neg = UnaryOp.extend("Neg");
    var Pos = UnaryOp.extend("Pos");
    var Compare = Node.extend("Compare", {
      fields: ["expr", "ops"]
    });
    var CompareOperand = Node.extend("CompareOperand", {
      fields: ["expr", "type"]
    });
    var CallExtension = Node.extend("CallExtension", {
      init: function init2(ext, prop, args, contentArgs) {
        this.parent();
        this.extName = ext.__name || ext;
        this.prop = prop;
        this.args = args || new NodeList();
        this.contentArgs = contentArgs || [];
        this.autoescape = ext.autoescape;
      },
      fields: ["extName", "prop", "args", "contentArgs"]
    });
    var CallExtensionAsync = CallExtension.extend("CallExtensionAsync");
    function print(str2, indent, inline) {
      var lines = str2.split("\n");
      lines.forEach(function(line, i) {
        if (line && (inline && i > 0 || !inline)) {
          process.stdout.write(" ".repeat(indent));
        }
        var nl2 = i === lines.length - 1 ? "" : "\n";
        process.stdout.write("" + line + nl2);
      });
    }
    function printNodes(node, indent) {
      indent = indent || 0;
      print(node.typename + ": ", indent);
      if (node instanceof NodeList) {
        print("\n");
        node.children.forEach(function(n) {
          printNodes(n, indent + 2);
        });
      } else if (node instanceof CallExtension) {
        print(node.extName + "." + node.prop + "\n");
        if (node.args) {
          printNodes(node.args, indent + 2);
        }
        if (node.contentArgs) {
          node.contentArgs.forEach(function(n) {
            printNodes(n, indent + 2);
          });
        }
      } else {
        var nodes = [];
        var props = null;
        node.iterFields(function(val, fieldName) {
          if (val instanceof Node) {
            nodes.push([fieldName, val]);
          } else {
            props = props || {};
            props[fieldName] = val;
          }
        });
        if (props) {
          print(JSON.stringify(props, null, 2) + "\n", null, true);
        } else {
          print("\n");
        }
        nodes.forEach(function(_ref) {
          var fieldName = _ref[0], n = _ref[1];
          print("[" + fieldName + "] =>", indent + 2);
          printNodes(n, indent + 4);
        });
      }
    }
    module.exports = {
      Node,
      Root,
      NodeList,
      Value,
      Literal,
      Symbol: _Symbol,
      Group,
      Array: ArrayNode,
      Pair,
      Dict,
      Output,
      Capture,
      TemplateData,
      If,
      IfAsync,
      InlineIf,
      For,
      AsyncEach,
      AsyncAll,
      Macro,
      Caller,
      Import,
      FromImport,
      FunCall,
      Filter,
      FilterAsync,
      KeywordArgs,
      Block,
      Super,
      Extends,
      Include,
      Set: Set2,
      Switch,
      Case,
      LookupVal,
      BinOp,
      In,
      Is,
      Or,
      And,
      Not,
      Add,
      Concat,
      Sub,
      Mul,
      Div,
      FloorDiv,
      Mod,
      Pow,
      Neg,
      Pos,
      Compare,
      CompareOperand,
      CallExtension,
      CallExtensionAsync,
      printNodes
    };
  }
});

// node_modules/nunjucks/src/parser.js
var require_parser = __commonJS({
  "node_modules/nunjucks/src/parser.js"(exports, module) {
    "use strict";
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var lexer = require_lexer();
    var nodes = require_nodes();
    var Obj = require_object().Obj;
    var lib = require_lib3();
    var Parser = /* @__PURE__ */ (function(_Obj) {
      _inheritsLoose(Parser2, _Obj);
      function Parser2() {
        return _Obj.apply(this, arguments) || this;
      }
      var _proto = Parser2.prototype;
      _proto.init = function init2(tokens) {
        this.tokens = tokens;
        this.peeked = null;
        this.breakOnBlocks = null;
        this.dropLeadingWhitespace = false;
        this.extensions = [];
      };
      _proto.nextToken = function nextToken(withWhitespace) {
        var tok;
        if (this.peeked) {
          if (!withWhitespace && this.peeked.type === lexer.TOKEN_WHITESPACE) {
            this.peeked = null;
          } else {
            tok = this.peeked;
            this.peeked = null;
            return tok;
          }
        }
        tok = this.tokens.nextToken();
        if (!withWhitespace) {
          while (tok && tok.type === lexer.TOKEN_WHITESPACE) {
            tok = this.tokens.nextToken();
          }
        }
        return tok;
      };
      _proto.peekToken = function peekToken() {
        this.peeked = this.peeked || this.nextToken();
        return this.peeked;
      };
      _proto.pushToken = function pushToken(tok) {
        if (this.peeked) {
          throw new Error("pushToken: can only push one token on between reads");
        }
        this.peeked = tok;
      };
      _proto.error = function error(msg, lineno, colno) {
        if (lineno === void 0 || colno === void 0) {
          var tok = this.peekToken() || {};
          lineno = tok.lineno;
          colno = tok.colno;
        }
        if (lineno !== void 0) {
          lineno += 1;
        }
        if (colno !== void 0) {
          colno += 1;
        }
        return new lib.TemplateError(msg, lineno, colno);
      };
      _proto.fail = function fail(msg, lineno, colno) {
        throw this.error(msg, lineno, colno);
      };
      _proto.skip = function skip(type2) {
        var tok = this.nextToken();
        if (!tok || tok.type !== type2) {
          this.pushToken(tok);
          return false;
        }
        return true;
      };
      _proto.expect = function expect(type2) {
        var tok = this.nextToken();
        if (tok.type !== type2) {
          this.fail("expected " + type2 + ", got " + tok.type, tok.lineno, tok.colno);
        }
        return tok;
      };
      _proto.skipValue = function skipValue(type2, val) {
        var tok = this.nextToken();
        if (!tok || tok.type !== type2 || tok.value !== val) {
          this.pushToken(tok);
          return false;
        }
        return true;
      };
      _proto.skipSymbol = function skipSymbol(val) {
        return this.skipValue(lexer.TOKEN_SYMBOL, val);
      };
      _proto.advanceAfterBlockEnd = function advanceAfterBlockEnd(name2) {
        var tok;
        if (!name2) {
          tok = this.peekToken();
          if (!tok) {
            this.fail("unexpected end of file");
          }
          if (tok.type !== lexer.TOKEN_SYMBOL) {
            this.fail("advanceAfterBlockEnd: expected symbol token or explicit name to be passed");
          }
          name2 = this.nextToken().value;
        }
        tok = this.nextToken();
        if (tok && tok.type === lexer.TOKEN_BLOCK_END) {
          if (tok.value.charAt(0) === "-") {
            this.dropLeadingWhitespace = true;
          }
        } else {
          this.fail("expected block end in " + name2 + " statement");
        }
        return tok;
      };
      _proto.advanceAfterVariableEnd = function advanceAfterVariableEnd() {
        var tok = this.nextToken();
        if (tok && tok.type === lexer.TOKEN_VARIABLE_END) {
          this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.VARIABLE_END.length - 1) === "-";
        } else {
          this.pushToken(tok);
          this.fail("expected variable end");
        }
      };
      _proto.parseFor = function parseFor() {
        var forTok = this.peekToken();
        var node;
        var endBlock;
        if (this.skipSymbol("for")) {
          node = new nodes.For(forTok.lineno, forTok.colno);
          endBlock = "endfor";
        } else if (this.skipSymbol("asyncEach")) {
          node = new nodes.AsyncEach(forTok.lineno, forTok.colno);
          endBlock = "endeach";
        } else if (this.skipSymbol("asyncAll")) {
          node = new nodes.AsyncAll(forTok.lineno, forTok.colno);
          endBlock = "endall";
        } else {
          this.fail("parseFor: expected for{Async}", forTok.lineno, forTok.colno);
        }
        node.name = this.parsePrimary();
        if (!(node.name instanceof nodes.Symbol)) {
          this.fail("parseFor: variable name expected for loop");
        }
        var type2 = this.peekToken().type;
        if (type2 === lexer.TOKEN_COMMA) {
          var key = node.name;
          node.name = new nodes.Array(key.lineno, key.colno);
          node.name.addChild(key);
          while (this.skip(lexer.TOKEN_COMMA)) {
            var prim = this.parsePrimary();
            node.name.addChild(prim);
          }
        }
        if (!this.skipSymbol("in")) {
          this.fail('parseFor: expected "in" keyword for loop', forTok.lineno, forTok.colno);
        }
        node.arr = this.parseExpression();
        this.advanceAfterBlockEnd(forTok.value);
        node.body = this.parseUntilBlocks(endBlock, "else");
        if (this.skipSymbol("else")) {
          this.advanceAfterBlockEnd("else");
          node.else_ = this.parseUntilBlocks(endBlock);
        }
        this.advanceAfterBlockEnd();
        return node;
      };
      _proto.parseMacro = function parseMacro() {
        var macroTok = this.peekToken();
        if (!this.skipSymbol("macro")) {
          this.fail("expected macro");
        }
        var name2 = this.parsePrimary(true);
        var args = this.parseSignature();
        var node = new nodes.Macro(macroTok.lineno, macroTok.colno, name2, args);
        this.advanceAfterBlockEnd(macroTok.value);
        node.body = this.parseUntilBlocks("endmacro");
        this.advanceAfterBlockEnd();
        return node;
      };
      _proto.parseCall = function parseCall() {
        var callTok = this.peekToken();
        if (!this.skipSymbol("call")) {
          this.fail("expected call");
        }
        var callerArgs = this.parseSignature(true) || new nodes.NodeList();
        var macroCall = this.parsePrimary();
        this.advanceAfterBlockEnd(callTok.value);
        var body = this.parseUntilBlocks("endcall");
        this.advanceAfterBlockEnd();
        var callerName = new nodes.Symbol(callTok.lineno, callTok.colno, "caller");
        var callerNode = new nodes.Caller(callTok.lineno, callTok.colno, callerName, callerArgs, body);
        var args = macroCall.args.children;
        if (!(args[args.length - 1] instanceof nodes.KeywordArgs)) {
          args.push(new nodes.KeywordArgs());
        }
        var kwargs = args[args.length - 1];
        kwargs.addChild(new nodes.Pair(callTok.lineno, callTok.colno, callerName, callerNode));
        return new nodes.Output(callTok.lineno, callTok.colno, [macroCall]);
      };
      _proto.parseWithContext = function parseWithContext() {
        var tok = this.peekToken();
        var withContext = null;
        if (this.skipSymbol("with")) {
          withContext = true;
        } else if (this.skipSymbol("without")) {
          withContext = false;
        }
        if (withContext !== null) {
          if (!this.skipSymbol("context")) {
            this.fail("parseFrom: expected context after with/without", tok.lineno, tok.colno);
          }
        }
        return withContext;
      };
      _proto.parseImport = function parseImport() {
        var importTok = this.peekToken();
        if (!this.skipSymbol("import")) {
          this.fail("parseImport: expected import", importTok.lineno, importTok.colno);
        }
        var template = this.parseExpression();
        if (!this.skipSymbol("as")) {
          this.fail('parseImport: expected "as" keyword', importTok.lineno, importTok.colno);
        }
        var target = this.parseExpression();
        var withContext = this.parseWithContext();
        var node = new nodes.Import(importTok.lineno, importTok.colno, template, target, withContext);
        this.advanceAfterBlockEnd(importTok.value);
        return node;
      };
      _proto.parseFrom = function parseFrom() {
        var fromTok = this.peekToken();
        if (!this.skipSymbol("from")) {
          this.fail("parseFrom: expected from");
        }
        var template = this.parseExpression();
        if (!this.skipSymbol("import")) {
          this.fail("parseFrom: expected import", fromTok.lineno, fromTok.colno);
        }
        var names = new nodes.NodeList();
        var withContext;
        while (1) {
          var nextTok = this.peekToken();
          if (nextTok.type === lexer.TOKEN_BLOCK_END) {
            if (!names.children.length) {
              this.fail("parseFrom: Expected at least one import name", fromTok.lineno, fromTok.colno);
            }
            if (nextTok.value.charAt(0) === "-") {
              this.dropLeadingWhitespace = true;
            }
            this.nextToken();
            break;
          }
          if (names.children.length > 0 && !this.skip(lexer.TOKEN_COMMA)) {
            this.fail("parseFrom: expected comma", fromTok.lineno, fromTok.colno);
          }
          var name2 = this.parsePrimary();
          if (name2.value.charAt(0) === "_") {
            this.fail("parseFrom: names starting with an underscore cannot be imported", name2.lineno, name2.colno);
          }
          if (this.skipSymbol("as")) {
            var alias = this.parsePrimary();
            names.addChild(new nodes.Pair(name2.lineno, name2.colno, name2, alias));
          } else {
            names.addChild(name2);
          }
          withContext = this.parseWithContext();
        }
        return new nodes.FromImport(fromTok.lineno, fromTok.colno, template, names, withContext);
      };
      _proto.parseBlock = function parseBlock() {
        var tag = this.peekToken();
        if (!this.skipSymbol("block")) {
          this.fail("parseBlock: expected block", tag.lineno, tag.colno);
        }
        var node = new nodes.Block(tag.lineno, tag.colno);
        node.name = this.parsePrimary();
        if (!(node.name instanceof nodes.Symbol)) {
          this.fail("parseBlock: variable name expected", tag.lineno, tag.colno);
        }
        this.advanceAfterBlockEnd(tag.value);
        node.body = this.parseUntilBlocks("endblock");
        this.skipSymbol("endblock");
        this.skipSymbol(node.name.value);
        var tok = this.peekToken();
        if (!tok) {
          this.fail("parseBlock: expected endblock, got end of file");
        }
        this.advanceAfterBlockEnd(tok.value);
        return node;
      };
      _proto.parseExtends = function parseExtends() {
        var tagName = "extends";
        var tag = this.peekToken();
        if (!this.skipSymbol(tagName)) {
          this.fail("parseTemplateRef: expected " + tagName);
        }
        var node = new nodes.Extends(tag.lineno, tag.colno);
        node.template = this.parseExpression();
        this.advanceAfterBlockEnd(tag.value);
        return node;
      };
      _proto.parseInclude = function parseInclude() {
        var tagName = "include";
        var tag = this.peekToken();
        if (!this.skipSymbol(tagName)) {
          this.fail("parseInclude: expected " + tagName);
        }
        var node = new nodes.Include(tag.lineno, tag.colno);
        node.template = this.parseExpression();
        if (this.skipSymbol("ignore") && this.skipSymbol("missing")) {
          node.ignoreMissing = true;
        }
        this.advanceAfterBlockEnd(tag.value);
        return node;
      };
      _proto.parseIf = function parseIf() {
        var tag = this.peekToken();
        var node;
        if (this.skipSymbol("if") || this.skipSymbol("elif") || this.skipSymbol("elseif")) {
          node = new nodes.If(tag.lineno, tag.colno);
        } else if (this.skipSymbol("ifAsync")) {
          node = new nodes.IfAsync(tag.lineno, tag.colno);
        } else {
          this.fail("parseIf: expected if, elif, or elseif", tag.lineno, tag.colno);
        }
        node.cond = this.parseExpression();
        this.advanceAfterBlockEnd(tag.value);
        node.body = this.parseUntilBlocks("elif", "elseif", "else", "endif");
        var tok = this.peekToken();
        switch (tok && tok.value) {
          case "elseif":
          case "elif":
            node.else_ = this.parseIf();
            break;
          case "else":
            this.advanceAfterBlockEnd();
            node.else_ = this.parseUntilBlocks("endif");
            this.advanceAfterBlockEnd();
            break;
          case "endif":
            node.else_ = null;
            this.advanceAfterBlockEnd();
            break;
          default:
            this.fail("parseIf: expected elif, else, or endif, got end of file");
        }
        return node;
      };
      _proto.parseSet = function parseSet() {
        var tag = this.peekToken();
        if (!this.skipSymbol("set")) {
          this.fail("parseSet: expected set", tag.lineno, tag.colno);
        }
        var node = new nodes.Set(tag.lineno, tag.colno, []);
        var target;
        while (target = this.parsePrimary()) {
          node.targets.push(target);
          if (!this.skip(lexer.TOKEN_COMMA)) {
            break;
          }
        }
        if (!this.skipValue(lexer.TOKEN_OPERATOR, "=")) {
          if (!this.skip(lexer.TOKEN_BLOCK_END)) {
            this.fail("parseSet: expected = or block end in set tag", tag.lineno, tag.colno);
          } else {
            node.body = new nodes.Capture(tag.lineno, tag.colno, this.parseUntilBlocks("endset"));
            node.value = null;
            this.advanceAfterBlockEnd();
          }
        } else {
          node.value = this.parseExpression();
          this.advanceAfterBlockEnd(tag.value);
        }
        return node;
      };
      _proto.parseSwitch = function parseSwitch() {
        var switchStart = "switch";
        var switchEnd = "endswitch";
        var caseStart = "case";
        var caseDefault = "default";
        var tag = this.peekToken();
        if (!this.skipSymbol(switchStart) && !this.skipSymbol(caseStart) && !this.skipSymbol(caseDefault)) {
          this.fail('parseSwitch: expected "switch," "case" or "default"', tag.lineno, tag.colno);
        }
        var expr = this.parseExpression();
        this.advanceAfterBlockEnd(switchStart);
        this.parseUntilBlocks(caseStart, caseDefault, switchEnd);
        var tok = this.peekToken();
        var cases = [];
        var defaultCase;
        do {
          this.skipSymbol(caseStart);
          var cond = this.parseExpression();
          this.advanceAfterBlockEnd(switchStart);
          var body = this.parseUntilBlocks(caseStart, caseDefault, switchEnd);
          cases.push(new nodes.Case(tok.line, tok.col, cond, body));
          tok = this.peekToken();
        } while (tok && tok.value === caseStart);
        switch (tok.value) {
          case caseDefault:
            this.advanceAfterBlockEnd();
            defaultCase = this.parseUntilBlocks(switchEnd);
            this.advanceAfterBlockEnd();
            break;
          case switchEnd:
            this.advanceAfterBlockEnd();
            break;
          default:
            this.fail('parseSwitch: expected "case," "default" or "endswitch," got EOF.');
        }
        return new nodes.Switch(tag.lineno, tag.colno, expr, cases, defaultCase);
      };
      _proto.parseStatement = function parseStatement() {
        var tok = this.peekToken();
        var node;
        if (tok.type !== lexer.TOKEN_SYMBOL) {
          this.fail("tag name expected", tok.lineno, tok.colno);
        }
        if (this.breakOnBlocks && lib.indexOf(this.breakOnBlocks, tok.value) !== -1) {
          return null;
        }
        switch (tok.value) {
          case "raw":
            return this.parseRaw();
          case "verbatim":
            return this.parseRaw("verbatim");
          case "if":
          case "ifAsync":
            return this.parseIf();
          case "for":
          case "asyncEach":
          case "asyncAll":
            return this.parseFor();
          case "block":
            return this.parseBlock();
          case "extends":
            return this.parseExtends();
          case "include":
            return this.parseInclude();
          case "set":
            return this.parseSet();
          case "macro":
            return this.parseMacro();
          case "call":
            return this.parseCall();
          case "import":
            return this.parseImport();
          case "from":
            return this.parseFrom();
          case "filter":
            return this.parseFilterStatement();
          case "switch":
            return this.parseSwitch();
          default:
            if (this.extensions.length) {
              for (var i = 0; i < this.extensions.length; i++) {
                var ext = this.extensions[i];
                if (lib.indexOf(ext.tags || [], tok.value) !== -1) {
                  return ext.parse(this, nodes, lexer);
                }
              }
            }
            this.fail("unknown block tag: " + tok.value, tok.lineno, tok.colno);
        }
        return node;
      };
      _proto.parseRaw = function parseRaw(tagName) {
        tagName = tagName || "raw";
        var endTagName = "end" + tagName;
        var rawBlockRegex = new RegExp("([\\s\\S]*?){%\\s*(" + tagName + "|" + endTagName + ")\\s*(?=%})%}");
        var rawLevel = 1;
        var str2 = "";
        var matches2 = null;
        var begun = this.advanceAfterBlockEnd();
        while ((matches2 = this.tokens._extractRegex(rawBlockRegex)) && rawLevel > 0) {
          var all2 = matches2[0];
          var pre = matches2[1];
          var blockName = matches2[2];
          if (blockName === tagName) {
            rawLevel += 1;
          } else if (blockName === endTagName) {
            rawLevel -= 1;
          }
          if (rawLevel === 0) {
            str2 += pre;
            this.tokens.backN(all2.length - pre.length);
          } else {
            str2 += all2;
          }
        }
        return new nodes.Output(begun.lineno, begun.colno, [new nodes.TemplateData(begun.lineno, begun.colno, str2)]);
      };
      _proto.parsePostfix = function parsePostfix(node) {
        var lookup2;
        var tok = this.peekToken();
        while (tok) {
          if (tok.type === lexer.TOKEN_LEFT_PAREN) {
            node = new nodes.FunCall(tok.lineno, tok.colno, node, this.parseSignature());
          } else if (tok.type === lexer.TOKEN_LEFT_BRACKET) {
            lookup2 = this.parseAggregate();
            if (lookup2.children.length > 1) {
              this.fail("invalid index");
            }
            node = new nodes.LookupVal(tok.lineno, tok.colno, node, lookup2.children[0]);
          } else if (tok.type === lexer.TOKEN_OPERATOR && tok.value === ".") {
            this.nextToken();
            var val = this.nextToken();
            if (val.type !== lexer.TOKEN_SYMBOL) {
              this.fail("expected name as lookup value, got " + val.value, val.lineno, val.colno);
            }
            lookup2 = new nodes.Literal(val.lineno, val.colno, val.value);
            node = new nodes.LookupVal(tok.lineno, tok.colno, node, lookup2);
          } else {
            break;
          }
          tok = this.peekToken();
        }
        return node;
      };
      _proto.parseExpression = function parseExpression() {
        var node = this.parseInlineIf();
        return node;
      };
      _proto.parseInlineIf = function parseInlineIf() {
        var node = this.parseOr();
        if (this.skipSymbol("if")) {
          var condNode = this.parseOr();
          var bodyNode = node;
          node = new nodes.InlineIf(node.lineno, node.colno);
          node.body = bodyNode;
          node.cond = condNode;
          if (this.skipSymbol("else")) {
            node.else_ = this.parseOr();
          } else {
            node.else_ = null;
          }
        }
        return node;
      };
      _proto.parseOr = function parseOr() {
        var node = this.parseAnd();
        while (this.skipSymbol("or")) {
          var node2 = this.parseAnd();
          node = new nodes.Or(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parseAnd = function parseAnd() {
        var node = this.parseNot();
        while (this.skipSymbol("and")) {
          var node2 = this.parseNot();
          node = new nodes.And(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parseNot = function parseNot() {
        var tok = this.peekToken();
        if (this.skipSymbol("not")) {
          return new nodes.Not(tok.lineno, tok.colno, this.parseNot());
        }
        return this.parseIn();
      };
      _proto.parseIn = function parseIn() {
        var node = this.parseIs();
        while (1) {
          var tok = this.nextToken();
          if (!tok) {
            break;
          }
          var invert = tok.type === lexer.TOKEN_SYMBOL && tok.value === "not";
          if (!invert) {
            this.pushToken(tok);
          }
          if (this.skipSymbol("in")) {
            var node2 = this.parseIs();
            node = new nodes.In(node.lineno, node.colno, node, node2);
            if (invert) {
              node = new nodes.Not(node.lineno, node.colno, node);
            }
          } else {
            if (invert) {
              this.pushToken(tok);
            }
            break;
          }
        }
        return node;
      };
      _proto.parseIs = function parseIs() {
        var node = this.parseCompare();
        if (this.skipSymbol("is")) {
          var not2 = this.skipSymbol("not");
          var node2 = this.parseCompare();
          node = new nodes.Is(node.lineno, node.colno, node, node2);
          if (not2) {
            node = new nodes.Not(node.lineno, node.colno, node);
          }
        }
        return node;
      };
      _proto.parseCompare = function parseCompare() {
        var compareOps = ["==", "===", "!=", "!==", "<", ">", "<=", ">="];
        var expr = this.parseConcat();
        var ops = [];
        while (1) {
          var tok = this.nextToken();
          if (!tok) {
            break;
          } else if (compareOps.indexOf(tok.value) !== -1) {
            ops.push(new nodes.CompareOperand(tok.lineno, tok.colno, this.parseConcat(), tok.value));
          } else {
            this.pushToken(tok);
            break;
          }
        }
        if (ops.length) {
          return new nodes.Compare(ops[0].lineno, ops[0].colno, expr, ops);
        } else {
          return expr;
        }
      };
      _proto.parseConcat = function parseConcat() {
        var node = this.parseAdd();
        while (this.skipValue(lexer.TOKEN_TILDE, "~")) {
          var node2 = this.parseAdd();
          node = new nodes.Concat(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parseAdd = function parseAdd() {
        var node = this.parseSub();
        while (this.skipValue(lexer.TOKEN_OPERATOR, "+")) {
          var node2 = this.parseSub();
          node = new nodes.Add(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parseSub = function parseSub() {
        var node = this.parseMul();
        while (this.skipValue(lexer.TOKEN_OPERATOR, "-")) {
          var node2 = this.parseMul();
          node = new nodes.Sub(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parseMul = function parseMul() {
        var node = this.parseDiv();
        while (this.skipValue(lexer.TOKEN_OPERATOR, "*")) {
          var node2 = this.parseDiv();
          node = new nodes.Mul(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parseDiv = function parseDiv() {
        var node = this.parseFloorDiv();
        while (this.skipValue(lexer.TOKEN_OPERATOR, "/")) {
          var node2 = this.parseFloorDiv();
          node = new nodes.Div(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parseFloorDiv = function parseFloorDiv() {
        var node = this.parseMod();
        while (this.skipValue(lexer.TOKEN_OPERATOR, "//")) {
          var node2 = this.parseMod();
          node = new nodes.FloorDiv(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parseMod = function parseMod() {
        var node = this.parsePow();
        while (this.skipValue(lexer.TOKEN_OPERATOR, "%")) {
          var node2 = this.parsePow();
          node = new nodes.Mod(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parsePow = function parsePow() {
        var node = this.parseUnary();
        while (this.skipValue(lexer.TOKEN_OPERATOR, "**")) {
          var node2 = this.parseUnary();
          node = new nodes.Pow(node.lineno, node.colno, node, node2);
        }
        return node;
      };
      _proto.parseUnary = function parseUnary(noFilters) {
        var tok = this.peekToken();
        var node;
        if (this.skipValue(lexer.TOKEN_OPERATOR, "-")) {
          node = new nodes.Neg(tok.lineno, tok.colno, this.parseUnary(true));
        } else if (this.skipValue(lexer.TOKEN_OPERATOR, "+")) {
          node = new nodes.Pos(tok.lineno, tok.colno, this.parseUnary(true));
        } else {
          node = this.parsePrimary();
        }
        if (!noFilters) {
          node = this.parseFilter(node);
        }
        return node;
      };
      _proto.parsePrimary = function parsePrimary(noPostfix) {
        var tok = this.nextToken();
        var val;
        var node = null;
        if (!tok) {
          this.fail("expected expression, got end of file");
        } else if (tok.type === lexer.TOKEN_STRING) {
          val = tok.value;
        } else if (tok.type === lexer.TOKEN_INT) {
          val = parseInt(tok.value, 10);
        } else if (tok.type === lexer.TOKEN_FLOAT) {
          val = parseFloat(tok.value);
        } else if (tok.type === lexer.TOKEN_BOOLEAN) {
          if (tok.value === "true") {
            val = true;
          } else if (tok.value === "false") {
            val = false;
          } else {
            this.fail("invalid boolean: " + tok.value, tok.lineno, tok.colno);
          }
        } else if (tok.type === lexer.TOKEN_NONE) {
          val = null;
        } else if (tok.type === lexer.TOKEN_REGEX) {
          val = new RegExp(tok.value.body, tok.value.flags);
        }
        if (val !== void 0) {
          node = new nodes.Literal(tok.lineno, tok.colno, val);
        } else if (tok.type === lexer.TOKEN_SYMBOL) {
          node = new nodes.Symbol(tok.lineno, tok.colno, tok.value);
        } else {
          this.pushToken(tok);
          node = this.parseAggregate();
        }
        if (!noPostfix) {
          node = this.parsePostfix(node);
        }
        if (node) {
          return node;
        } else {
          throw this.error("unexpected token: " + tok.value, tok.lineno, tok.colno);
        }
      };
      _proto.parseFilterName = function parseFilterName() {
        var tok = this.expect(lexer.TOKEN_SYMBOL);
        var name2 = tok.value;
        while (this.skipValue(lexer.TOKEN_OPERATOR, ".")) {
          name2 += "." + this.expect(lexer.TOKEN_SYMBOL).value;
        }
        return new nodes.Symbol(tok.lineno, tok.colno, name2);
      };
      _proto.parseFilterArgs = function parseFilterArgs(node) {
        if (this.peekToken().type === lexer.TOKEN_LEFT_PAREN) {
          var call = this.parsePostfix(node);
          return call.args.children;
        }
        return [];
      };
      _proto.parseFilter = function parseFilter(node) {
        while (this.skip(lexer.TOKEN_PIPE)) {
          var name2 = this.parseFilterName();
          node = new nodes.Filter(name2.lineno, name2.colno, name2, new nodes.NodeList(name2.lineno, name2.colno, [node].concat(this.parseFilterArgs(node))));
        }
        return node;
      };
      _proto.parseFilterStatement = function parseFilterStatement() {
        var filterTok = this.peekToken();
        if (!this.skipSymbol("filter")) {
          this.fail("parseFilterStatement: expected filter");
        }
        var name2 = this.parseFilterName();
        var args = this.parseFilterArgs(name2);
        this.advanceAfterBlockEnd(filterTok.value);
        var body = new nodes.Capture(name2.lineno, name2.colno, this.parseUntilBlocks("endfilter"));
        this.advanceAfterBlockEnd();
        var node = new nodes.Filter(name2.lineno, name2.colno, name2, new nodes.NodeList(name2.lineno, name2.colno, [body].concat(args)));
        return new nodes.Output(name2.lineno, name2.colno, [node]);
      };
      _proto.parseAggregate = function parseAggregate() {
        var tok = this.nextToken();
        var node;
        switch (tok.type) {
          case lexer.TOKEN_LEFT_PAREN:
            node = new nodes.Group(tok.lineno, tok.colno);
            break;
          case lexer.TOKEN_LEFT_BRACKET:
            node = new nodes.Array(tok.lineno, tok.colno);
            break;
          case lexer.TOKEN_LEFT_CURLY:
            node = new nodes.Dict(tok.lineno, tok.colno);
            break;
          default:
            return null;
        }
        while (1) {
          var type2 = this.peekToken().type;
          if (type2 === lexer.TOKEN_RIGHT_PAREN || type2 === lexer.TOKEN_RIGHT_BRACKET || type2 === lexer.TOKEN_RIGHT_CURLY) {
            this.nextToken();
            break;
          }
          if (node.children.length > 0) {
            if (!this.skip(lexer.TOKEN_COMMA)) {
              this.fail("parseAggregate: expected comma after expression", tok.lineno, tok.colno);
            }
          }
          if (node instanceof nodes.Dict) {
            var key = this.parsePrimary();
            if (!this.skip(lexer.TOKEN_COLON)) {
              this.fail("parseAggregate: expected colon after dict key", tok.lineno, tok.colno);
            }
            var value = this.parseExpression();
            node.addChild(new nodes.Pair(key.lineno, key.colno, key, value));
          } else {
            var expr = this.parseExpression();
            node.addChild(expr);
          }
        }
        return node;
      };
      _proto.parseSignature = function parseSignature(tolerant, noParens) {
        var tok = this.peekToken();
        if (!noParens && tok.type !== lexer.TOKEN_LEFT_PAREN) {
          if (tolerant) {
            return null;
          } else {
            this.fail("expected arguments", tok.lineno, tok.colno);
          }
        }
        if (tok.type === lexer.TOKEN_LEFT_PAREN) {
          tok = this.nextToken();
        }
        var args = new nodes.NodeList(tok.lineno, tok.colno);
        var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);
        var checkComma = false;
        while (1) {
          tok = this.peekToken();
          if (!noParens && tok.type === lexer.TOKEN_RIGHT_PAREN) {
            this.nextToken();
            break;
          } else if (noParens && tok.type === lexer.TOKEN_BLOCK_END) {
            break;
          }
          if (checkComma && !this.skip(lexer.TOKEN_COMMA)) {
            this.fail("parseSignature: expected comma after expression", tok.lineno, tok.colno);
          } else {
            var arg = this.parseExpression();
            if (this.skipValue(lexer.TOKEN_OPERATOR, "=")) {
              kwargs.addChild(new nodes.Pair(arg.lineno, arg.colno, arg, this.parseExpression()));
            } else {
              args.addChild(arg);
            }
          }
          checkComma = true;
        }
        if (kwargs.children.length) {
          args.addChild(kwargs);
        }
        return args;
      };
      _proto.parseUntilBlocks = function parseUntilBlocks() {
        var prev = this.breakOnBlocks;
        for (var _len = arguments.length, blockNames = new Array(_len), _key = 0; _key < _len; _key++) {
          blockNames[_key] = arguments[_key];
        }
        this.breakOnBlocks = blockNames;
        var ret = this.parse();
        this.breakOnBlocks = prev;
        return ret;
      };
      _proto.parseNodes = function parseNodes() {
        var tok;
        var buf = [];
        while (tok = this.nextToken()) {
          if (tok.type === lexer.TOKEN_DATA) {
            var data = tok.value;
            var nextToken = this.peekToken();
            var nextVal = nextToken && nextToken.value;
            if (this.dropLeadingWhitespace) {
              data = data.replace(/^\s*/, "");
              this.dropLeadingWhitespace = false;
            }
            if (nextToken && (nextToken.type === lexer.TOKEN_BLOCK_START && nextVal.charAt(nextVal.length - 1) === "-" || nextToken.type === lexer.TOKEN_VARIABLE_START && nextVal.charAt(this.tokens.tags.VARIABLE_START.length) === "-" || nextToken.type === lexer.TOKEN_COMMENT && nextVal.charAt(this.tokens.tags.COMMENT_START.length) === "-")) {
              data = data.replace(/\s*$/, "");
            }
            buf.push(new nodes.Output(tok.lineno, tok.colno, [new nodes.TemplateData(tok.lineno, tok.colno, data)]));
          } else if (tok.type === lexer.TOKEN_BLOCK_START) {
            this.dropLeadingWhitespace = false;
            var n = this.parseStatement();
            if (!n) {
              break;
            }
            buf.push(n);
          } else if (tok.type === lexer.TOKEN_VARIABLE_START) {
            var e = this.parseExpression();
            this.dropLeadingWhitespace = false;
            this.advanceAfterVariableEnd();
            buf.push(new nodes.Output(tok.lineno, tok.colno, [e]));
          } else if (tok.type === lexer.TOKEN_COMMENT) {
            this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.COMMENT_END.length - 1) === "-";
          } else {
            this.fail("Unexpected token at top-level: " + tok.type, tok.lineno, tok.colno);
          }
        }
        return buf;
      };
      _proto.parse = function parse4() {
        return new nodes.NodeList(0, 0, this.parseNodes());
      };
      _proto.parseAsRoot = function parseAsRoot() {
        return new nodes.Root(0, 0, this.parseNodes());
      };
      return Parser2;
    })(Obj);
    module.exports = {
      parse: function parse4(src, extensions, opts) {
        var p = new Parser(lexer.lex(src, opts));
        if (extensions !== void 0) {
          p.extensions = extensions;
        }
        return p.parseAsRoot();
      },
      Parser
    };
  }
});

// node_modules/nunjucks/src/transformer.js
var require_transformer = __commonJS({
  "node_modules/nunjucks/src/transformer.js"(exports, module) {
    "use strict";
    var nodes = require_nodes();
    var lib = require_lib3();
    var sym = 0;
    function gensym() {
      return "hole_" + sym++;
    }
    function mapCOW(arr, func) {
      var res = null;
      for (var i = 0; i < arr.length; i++) {
        var item = func(arr[i]);
        if (item !== arr[i]) {
          if (!res) {
            res = arr.slice();
          }
          res[i] = item;
        }
      }
      return res || arr;
    }
    function walk2(ast, func, depthFirst) {
      if (!(ast instanceof nodes.Node)) {
        return ast;
      }
      if (!depthFirst) {
        var astT = func(ast);
        if (astT && astT !== ast) {
          return astT;
        }
      }
      if (ast instanceof nodes.NodeList) {
        var children = mapCOW(ast.children, function(node) {
          return walk2(node, func, depthFirst);
        });
        if (children !== ast.children) {
          ast = new nodes[ast.typename](ast.lineno, ast.colno, children);
        }
      } else if (ast instanceof nodes.CallExtension) {
        var args = walk2(ast.args, func, depthFirst);
        var contentArgs = mapCOW(ast.contentArgs, function(node) {
          return walk2(node, func, depthFirst);
        });
        if (args !== ast.args || contentArgs !== ast.contentArgs) {
          ast = new nodes[ast.typename](ast.extName, ast.prop, args, contentArgs);
        }
      } else {
        var props = ast.fields.map(function(field) {
          return ast[field];
        });
        var propsT = mapCOW(props, function(prop) {
          return walk2(prop, func, depthFirst);
        });
        if (propsT !== props) {
          ast = new nodes[ast.typename](ast.lineno, ast.colno);
          propsT.forEach(function(prop, i) {
            ast[ast.fields[i]] = prop;
          });
        }
      }
      return depthFirst ? func(ast) || ast : ast;
    }
    function depthWalk(ast, func) {
      return walk2(ast, func, true);
    }
    function _liftFilters(node, asyncFilters, prop) {
      var children = [];
      var walked = depthWalk(prop ? node[prop] : node, function(descNode) {
        var symbol;
        if (descNode instanceof nodes.Block) {
          return descNode;
        } else if (descNode instanceof nodes.Filter && lib.indexOf(asyncFilters, descNode.name.value) !== -1 || descNode instanceof nodes.CallExtensionAsync) {
          symbol = new nodes.Symbol(descNode.lineno, descNode.colno, gensym());
          children.push(new nodes.FilterAsync(descNode.lineno, descNode.colno, descNode.name, descNode.args, symbol));
        }
        return symbol;
      });
      if (prop) {
        node[prop] = walked;
      } else {
        node = walked;
      }
      if (children.length) {
        children.push(node);
        return new nodes.NodeList(node.lineno, node.colno, children);
      } else {
        return node;
      }
    }
    function liftFilters(ast, asyncFilters) {
      return depthWalk(ast, function(node) {
        if (node instanceof nodes.Output) {
          return _liftFilters(node, asyncFilters);
        } else if (node instanceof nodes.Set) {
          return _liftFilters(node, asyncFilters, "value");
        } else if (node instanceof nodes.For) {
          return _liftFilters(node, asyncFilters, "arr");
        } else if (node instanceof nodes.If) {
          return _liftFilters(node, asyncFilters, "cond");
        } else if (node instanceof nodes.CallExtension) {
          return _liftFilters(node, asyncFilters, "args");
        } else {
          return void 0;
        }
      });
    }
    function liftSuper(ast) {
      return walk2(ast, function(blockNode) {
        if (!(blockNode instanceof nodes.Block)) {
          return;
        }
        var hasSuper = false;
        var symbol = gensym();
        blockNode.body = walk2(blockNode.body, function(node) {
          if (node instanceof nodes.FunCall && node.name.value === "super") {
            hasSuper = true;
            return new nodes.Symbol(node.lineno, node.colno, symbol);
          }
        });
        if (hasSuper) {
          blockNode.body.children.unshift(new nodes.Super(0, 0, blockNode.name, new nodes.Symbol(0, 0, symbol)));
        }
      });
    }
    function convertStatements(ast) {
      return depthWalk(ast, function(node) {
        if (!(node instanceof nodes.If) && !(node instanceof nodes.For)) {
          return void 0;
        }
        var async = false;
        walk2(node, function(child) {
          if (child instanceof nodes.FilterAsync || child instanceof nodes.IfAsync || child instanceof nodes.AsyncEach || child instanceof nodes.AsyncAll || child instanceof nodes.CallExtensionAsync) {
            async = true;
            return child;
          }
          return void 0;
        });
        if (async) {
          if (node instanceof nodes.If) {
            return new nodes.IfAsync(node.lineno, node.colno, node.cond, node.body, node.else_);
          } else if (node instanceof nodes.For && !(node instanceof nodes.AsyncAll)) {
            return new nodes.AsyncEach(node.lineno, node.colno, node.arr, node.name, node.body, node.else_);
          }
        }
        return void 0;
      });
    }
    function cps(ast, asyncFilters) {
      return convertStatements(liftSuper(liftFilters(ast, asyncFilters)));
    }
    function transform2(ast, asyncFilters) {
      return cps(ast, asyncFilters || []);
    }
    module.exports = {
      transform: transform2
    };
  }
});

// node_modules/nunjucks/src/runtime.js
var require_runtime = __commonJS({
  "node_modules/nunjucks/src/runtime.js"(exports, module) {
    "use strict";
    var lib = require_lib3();
    var arrayFrom = Array.from;
    var supportsIterators = typeof Symbol === "function" && Symbol.iterator && typeof arrayFrom === "function";
    var Frame = /* @__PURE__ */ (function() {
      function Frame2(parent2, isolateWrites) {
        this.variables = /* @__PURE__ */ Object.create(null);
        this.parent = parent2;
        this.topLevel = false;
        this.isolateWrites = isolateWrites;
      }
      var _proto = Frame2.prototype;
      _proto.set = function set2(name2, val, resolveUp) {
        var parts = name2.split(".");
        var obj = this.variables;
        var frame = this;
        if (resolveUp) {
          if (frame = this.resolve(parts[0], true)) {
            frame.set(name2, val);
            return;
          }
        }
        for (var i = 0; i < parts.length - 1; i++) {
          var id = parts[i];
          if (!obj[id]) {
            obj[id] = {};
          }
          obj = obj[id];
        }
        obj[parts[parts.length - 1]] = val;
      };
      _proto.get = function get(name2) {
        var val = this.variables[name2];
        if (val !== void 0) {
          return val;
        }
        return null;
      };
      _proto.lookup = function lookup2(name2) {
        var p = this.parent;
        var val = this.variables[name2];
        if (val !== void 0) {
          return val;
        }
        return p && p.lookup(name2);
      };
      _proto.resolve = function resolve(name2, forWrite) {
        var p = forWrite && this.isolateWrites ? void 0 : this.parent;
        var val = this.variables[name2];
        if (val !== void 0) {
          return this;
        }
        return p && p.resolve(name2);
      };
      _proto.push = function push(isolateWrites) {
        return new Frame2(this, isolateWrites);
      };
      _proto.pop = function pop() {
        return this.parent;
      };
      return Frame2;
    })();
    function makeMacro(argNames, kwargNames, func) {
      return function macro() {
        for (var _len = arguments.length, macroArgs = new Array(_len), _key = 0; _key < _len; _key++) {
          macroArgs[_key] = arguments[_key];
        }
        var argCount = numArgs(macroArgs);
        var args;
        var kwargs = getKeywordArgs(macroArgs);
        if (argCount > argNames.length) {
          args = macroArgs.slice(0, argNames.length);
          macroArgs.slice(args.length, argCount).forEach(function(val, i2) {
            if (i2 < kwargNames.length) {
              kwargs[kwargNames[i2]] = val;
            }
          });
          args.push(kwargs);
        } else if (argCount < argNames.length) {
          args = macroArgs.slice(0, argCount);
          for (var i = argCount; i < argNames.length; i++) {
            var arg = argNames[i];
            args.push(kwargs[arg]);
            delete kwargs[arg];
          }
          args.push(kwargs);
        } else {
          args = macroArgs;
        }
        return func.apply(this, args);
      };
    }
    function makeKeywordArgs(obj) {
      obj.__keywords = true;
      return obj;
    }
    function isKeywordArgs(obj) {
      return obj && Object.prototype.hasOwnProperty.call(obj, "__keywords");
    }
    function getKeywordArgs(args) {
      var len = args.length;
      if (len) {
        var lastArg = args[len - 1];
        if (isKeywordArgs(lastArg)) {
          return lastArg;
        }
      }
      return {};
    }
    function numArgs(args) {
      var len = args.length;
      if (len === 0) {
        return 0;
      }
      var lastArg = args[len - 1];
      if (isKeywordArgs(lastArg)) {
        return len - 1;
      } else {
        return len;
      }
    }
    function SafeString(val) {
      if (typeof val !== "string") {
        return val;
      }
      this.val = val;
      this.length = val.length;
    }
    SafeString.prototype = Object.create(String.prototype, {
      length: {
        writable: true,
        configurable: true,
        value: 0
      }
    });
    SafeString.prototype.valueOf = function valueOf() {
      return this.val;
    };
    SafeString.prototype.toString = function toString4() {
      return this.val;
    };
    function copySafeness(dest, target) {
      if (dest instanceof SafeString) {
        return new SafeString(target);
      }
      return target.toString();
    }
    function markSafe(val) {
      var type2 = typeof val;
      if (type2 === "string") {
        return new SafeString(val);
      } else if (type2 !== "function") {
        return val;
      } else {
        return function wrapSafe(args) {
          var ret = val.apply(this, arguments);
          if (typeof ret === "string") {
            return new SafeString(ret);
          }
          return ret;
        };
      }
    }
    function suppressValue(val, autoescape) {
      val = val !== void 0 && val !== null ? val : "";
      if (autoescape && !(val instanceof SafeString)) {
        val = lib.escape(val.toString());
      }
      return val;
    }
    function ensureDefined(val, lineno, colno) {
      if (val === null || val === void 0) {
        throw new lib.TemplateError("attempted to output null or undefined value", lineno + 1, colno + 1);
      }
      return val;
    }
    function memberLookup(obj, val) {
      if (obj === void 0 || obj === null) {
        return void 0;
      }
      if (typeof obj[val] === "function") {
        return function() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return obj[val].apply(obj, args);
        };
      }
      return obj[val];
    }
    function callWrap(obj, name2, context, args) {
      if (!obj) {
        throw new Error("Unable to call `" + name2 + "`, which is undefined or falsey");
      } else if (typeof obj !== "function") {
        throw new Error("Unable to call `" + name2 + "`, which is not a function");
      }
      return obj.apply(context, args);
    }
    function contextOrFrameLookup(context, frame, name2) {
      var val = frame.lookup(name2);
      return val !== void 0 ? val : context.lookup(name2);
    }
    function handleError(error, lineno, colno) {
      if (error.lineno) {
        return error;
      } else {
        return new lib.TemplateError(error, lineno, colno);
      }
    }
    function asyncEach(arr, dimen, iter, cb) {
      if (lib.isArray(arr)) {
        var len = arr.length;
        lib.asyncIter(arr, function iterCallback(item, i, next) {
          switch (dimen) {
            case 1:
              iter(item, i, len, next);
              break;
            case 2:
              iter(item[0], item[1], i, len, next);
              break;
            case 3:
              iter(item[0], item[1], item[2], i, len, next);
              break;
            default:
              item.push(i, len, next);
              iter.apply(this, item);
          }
        }, cb);
      } else {
        lib.asyncFor(arr, function iterCallback(key, val, i, len2, next) {
          iter(key, val, i, len2, next);
        }, cb);
      }
    }
    function asyncAll(arr, dimen, func, cb) {
      var finished = 0;
      var len;
      var outputArr;
      function done(i2, output) {
        finished++;
        outputArr[i2] = output;
        if (finished === len) {
          cb(null, outputArr.join(""));
        }
      }
      if (lib.isArray(arr)) {
        len = arr.length;
        outputArr = new Array(len);
        if (len === 0) {
          cb(null, "");
        } else {
          for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            switch (dimen) {
              case 1:
                func(item, i, len, done);
                break;
              case 2:
                func(item[0], item[1], i, len, done);
                break;
              case 3:
                func(item[0], item[1], item[2], i, len, done);
                break;
              default:
                item.push(i, len, done);
                func.apply(this, item);
            }
          }
        }
      } else {
        var keys = lib.keys(arr || {});
        len = keys.length;
        outputArr = new Array(len);
        if (len === 0) {
          cb(null, "");
        } else {
          for (var _i = 0; _i < keys.length; _i++) {
            var k = keys[_i];
            func(k, arr[k], _i, len, done);
          }
        }
      }
    }
    function fromIterator(arr) {
      if (typeof arr !== "object" || arr === null || lib.isArray(arr)) {
        return arr;
      } else if (supportsIterators && Symbol.iterator in arr) {
        return arrayFrom(arr);
      } else {
        return arr;
      }
    }
    module.exports = {
      Frame,
      makeMacro,
      makeKeywordArgs,
      numArgs,
      suppressValue,
      ensureDefined,
      memberLookup,
      contextOrFrameLookup,
      callWrap,
      handleError,
      isArray: lib.isArray,
      keys: lib.keys,
      SafeString,
      copySafeness,
      markSafe,
      asyncEach,
      asyncAll,
      inOperator: lib.inOperator,
      fromIterator
    };
  }
});

// node_modules/nunjucks/src/compiler.js
var require_compiler = __commonJS({
  "node_modules/nunjucks/src/compiler.js"(exports, module) {
    "use strict";
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var parser2 = require_parser();
    var transformer = require_transformer();
    var nodes = require_nodes();
    var _require = require_lib3();
    var TemplateError = _require.TemplateError;
    var _require2 = require_runtime();
    var Frame = _require2.Frame;
    var _require3 = require_object();
    var Obj = _require3.Obj;
    var compareOps = {
      "==": "==",
      "===": "===",
      "!=": "!=",
      "!==": "!==",
      "<": "<",
      ">": ">",
      "<=": "<=",
      ">=": ">="
    };
    var Compiler = /* @__PURE__ */ (function(_Obj) {
      _inheritsLoose(Compiler2, _Obj);
      function Compiler2() {
        return _Obj.apply(this, arguments) || this;
      }
      var _proto = Compiler2.prototype;
      _proto.init = function init2(templateName, throwOnUndefined) {
        this.templateName = templateName;
        this.codebuf = [];
        this.lastId = 0;
        this.buffer = null;
        this.bufferStack = [];
        this._scopeClosers = "";
        this.inBlock = false;
        this.throwOnUndefined = throwOnUndefined;
      };
      _proto.fail = function fail(msg, lineno, colno) {
        if (lineno !== void 0) {
          lineno += 1;
        }
        if (colno !== void 0) {
          colno += 1;
        }
        throw new TemplateError(msg, lineno, colno);
      };
      _proto._pushBuffer = function _pushBuffer() {
        var id = this._tmpid();
        this.bufferStack.push(this.buffer);
        this.buffer = id;
        this._emit("var " + this.buffer + ' = "";');
        return id;
      };
      _proto._popBuffer = function _popBuffer() {
        this.buffer = this.bufferStack.pop();
      };
      _proto._emit = function _emit(code) {
        this.codebuf.push(code);
      };
      _proto._emitLine = function _emitLine(code) {
        this._emit(code + "\n");
      };
      _proto._emitLines = function _emitLines() {
        var _this = this;
        for (var _len = arguments.length, lines = new Array(_len), _key = 0; _key < _len; _key++) {
          lines[_key] = arguments[_key];
        }
        lines.forEach(function(line) {
          return _this._emitLine(line);
        });
      };
      _proto._emitFuncBegin = function _emitFuncBegin(node, name2) {
        this.buffer = "output";
        this._scopeClosers = "";
        this._emitLine("function " + name2 + "(env, context, frame, runtime, cb) {");
        this._emitLine("var lineno = " + node.lineno + ";");
        this._emitLine("var colno = " + node.colno + ";");
        this._emitLine("var " + this.buffer + ' = "";');
        this._emitLine("try {");
      };
      _proto._emitFuncEnd = function _emitFuncEnd(noReturn) {
        if (!noReturn) {
          this._emitLine("cb(null, " + this.buffer + ");");
        }
        this._closeScopeLevels();
        this._emitLine("} catch (e) {");
        this._emitLine("  cb(runtime.handleError(e, lineno, colno));");
        this._emitLine("}");
        this._emitLine("}");
        this.buffer = null;
      };
      _proto._addScopeLevel = function _addScopeLevel() {
        this._scopeClosers += "})";
      };
      _proto._closeScopeLevels = function _closeScopeLevels() {
        this._emitLine(this._scopeClosers + ";");
        this._scopeClosers = "";
      };
      _proto._withScopedSyntax = function _withScopedSyntax(func) {
        var _scopeClosers = this._scopeClosers;
        this._scopeClosers = "";
        func.call(this);
        this._closeScopeLevels();
        this._scopeClosers = _scopeClosers;
      };
      _proto._makeCallback = function _makeCallback(res) {
        var err = this._tmpid();
        return "function(" + err + (res ? "," + res : "") + ") {\nif(" + err + ") { cb(" + err + "); return; }";
      };
      _proto._tmpid = function _tmpid() {
        this.lastId++;
        return "t_" + this.lastId;
      };
      _proto._templateName = function _templateName() {
        return this.templateName == null ? "undefined" : JSON.stringify(this.templateName);
      };
      _proto._compileChildren = function _compileChildren(node, frame) {
        var _this2 = this;
        node.children.forEach(function(child) {
          _this2.compile(child, frame);
        });
      };
      _proto._compileAggregate = function _compileAggregate(node, frame, startChar, endChar) {
        var _this3 = this;
        if (startChar) {
          this._emit(startChar);
        }
        node.children.forEach(function(child, i) {
          if (i > 0) {
            _this3._emit(",");
          }
          _this3.compile(child, frame);
        });
        if (endChar) {
          this._emit(endChar);
        }
      };
      _proto._compileExpression = function _compileExpression(node, frame) {
        this.assertType(node, nodes.Literal, nodes.Symbol, nodes.Group, nodes.Array, nodes.Dict, nodes.FunCall, nodes.Caller, nodes.Filter, nodes.LookupVal, nodes.Compare, nodes.InlineIf, nodes.In, nodes.Is, nodes.And, nodes.Or, nodes.Not, nodes.Add, nodes.Concat, nodes.Sub, nodes.Mul, nodes.Div, nodes.FloorDiv, nodes.Mod, nodes.Pow, nodes.Neg, nodes.Pos, nodes.Compare, nodes.NodeList);
        this.compile(node, frame);
      };
      _proto.assertType = function assertType(node) {
        for (var _len2 = arguments.length, types2 = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          types2[_key2 - 1] = arguments[_key2];
        }
        if (!types2.some(function(t) {
          return node instanceof t;
        })) {
          this.fail("assertType: invalid type: " + node.typename, node.lineno, node.colno);
        }
      };
      _proto.compileCallExtension = function compileCallExtension(node, frame, async) {
        var _this4 = this;
        var args = node.args;
        var contentArgs = node.contentArgs;
        var autoescape = typeof node.autoescape === "boolean" ? node.autoescape : true;
        if (!async) {
          this._emit(this.buffer + " += runtime.suppressValue(");
        }
        this._emit('env.getExtension("' + node.extName + '")["' + node.prop + '"](');
        this._emit("context");
        if (args || contentArgs) {
          this._emit(",");
        }
        if (args) {
          if (!(args instanceof nodes.NodeList)) {
            this.fail("compileCallExtension: arguments must be a NodeList, use `parser.parseSignature`");
          }
          args.children.forEach(function(arg, i) {
            _this4._compileExpression(arg, frame);
            if (i !== args.children.length - 1 || contentArgs.length) {
              _this4._emit(",");
            }
          });
        }
        if (contentArgs.length) {
          contentArgs.forEach(function(arg, i) {
            if (i > 0) {
              _this4._emit(",");
            }
            if (arg) {
              _this4._emitLine("function(cb) {");
              _this4._emitLine("if(!cb) { cb = function(err) { if(err) { throw err; }}}");
              var id = _this4._pushBuffer();
              _this4._withScopedSyntax(function() {
                _this4.compile(arg, frame);
                _this4._emitLine("cb(null, " + id + ");");
              });
              _this4._popBuffer();
              _this4._emitLine("return " + id + ";");
              _this4._emitLine("}");
            } else {
              _this4._emit("null");
            }
          });
        }
        if (async) {
          var res = this._tmpid();
          this._emitLine(", " + this._makeCallback(res));
          this._emitLine(this.buffer + " += runtime.suppressValue(" + res + ", " + autoescape + " && env.opts.autoescape);");
          this._addScopeLevel();
        } else {
          this._emit(")");
          this._emit(", " + autoescape + " && env.opts.autoescape);\n");
        }
      };
      _proto.compileCallExtensionAsync = function compileCallExtensionAsync(node, frame) {
        this.compileCallExtension(node, frame, true);
      };
      _proto.compileNodeList = function compileNodeList(node, frame) {
        this._compileChildren(node, frame);
      };
      _proto.compileLiteral = function compileLiteral(node) {
        if (typeof node.value === "string") {
          var val = node.value.replace(/\\/g, "\\\\");
          val = val.replace(/"/g, '\\"');
          val = val.replace(/\n/g, "\\n");
          val = val.replace(/\r/g, "\\r");
          val = val.replace(/\t/g, "\\t");
          val = val.replace(/\u2028/g, "\\u2028");
          this._emit('"' + val + '"');
        } else if (node.value === null) {
          this._emit("null");
        } else {
          this._emit(node.value.toString());
        }
      };
      _proto.compileSymbol = function compileSymbol(node, frame) {
        var name2 = node.value;
        var v = frame.lookup(name2);
        if (v) {
          this._emit(v);
        } else {
          this._emit('runtime.contextOrFrameLookup(context, frame, "' + name2 + '")');
        }
      };
      _proto.compileGroup = function compileGroup(node, frame) {
        this._compileAggregate(node, frame, "(", ")");
      };
      _proto.compileArray = function compileArray(node, frame) {
        this._compileAggregate(node, frame, "[", "]");
      };
      _proto.compileDict = function compileDict(node, frame) {
        this._compileAggregate(node, frame, "{", "}");
      };
      _proto.compilePair = function compilePair(node, frame) {
        var key = node.key;
        var val = node.value;
        if (key instanceof nodes.Symbol) {
          key = new nodes.Literal(key.lineno, key.colno, key.value);
        } else if (!(key instanceof nodes.Literal && typeof key.value === "string")) {
          this.fail("compilePair: Dict keys must be strings or names", key.lineno, key.colno);
        }
        this.compile(key, frame);
        this._emit(": ");
        this._compileExpression(val, frame);
      };
      _proto.compileInlineIf = function compileInlineIf(node, frame) {
        this._emit("(");
        this.compile(node.cond, frame);
        this._emit("?");
        this.compile(node.body, frame);
        this._emit(":");
        if (node.else_ !== null) {
          this.compile(node.else_, frame);
        } else {
          this._emit('""');
        }
        this._emit(")");
      };
      _proto.compileIn = function compileIn(node, frame) {
        this._emit("runtime.inOperator(");
        this.compile(node.left, frame);
        this._emit(",");
        this.compile(node.right, frame);
        this._emit(")");
      };
      _proto.compileIs = function compileIs(node, frame) {
        var right = node.right.name ? node.right.name.value : node.right.value;
        this._emit('env.getTest("' + right + '").call(context, ');
        this.compile(node.left, frame);
        if (node.right.args) {
          this._emit(",");
          this.compile(node.right.args, frame);
        }
        this._emit(") === true");
      };
      _proto._binOpEmitter = function _binOpEmitter(node, frame, str2) {
        this.compile(node.left, frame);
        this._emit(str2);
        this.compile(node.right, frame);
      };
      _proto.compileOr = function compileOr(node, frame) {
        return this._binOpEmitter(node, frame, " || ");
      };
      _proto.compileAnd = function compileAnd(node, frame) {
        return this._binOpEmitter(node, frame, " && ");
      };
      _proto.compileAdd = function compileAdd(node, frame) {
        return this._binOpEmitter(node, frame, " + ");
      };
      _proto.compileConcat = function compileConcat(node, frame) {
        return this._binOpEmitter(node, frame, ' + "" + ');
      };
      _proto.compileSub = function compileSub(node, frame) {
        return this._binOpEmitter(node, frame, " - ");
      };
      _proto.compileMul = function compileMul(node, frame) {
        return this._binOpEmitter(node, frame, " * ");
      };
      _proto.compileDiv = function compileDiv(node, frame) {
        return this._binOpEmitter(node, frame, " / ");
      };
      _proto.compileMod = function compileMod(node, frame) {
        return this._binOpEmitter(node, frame, " % ");
      };
      _proto.compileNot = function compileNot(node, frame) {
        this._emit("!");
        this.compile(node.target, frame);
      };
      _proto.compileFloorDiv = function compileFloorDiv(node, frame) {
        this._emit("Math.floor(");
        this.compile(node.left, frame);
        this._emit(" / ");
        this.compile(node.right, frame);
        this._emit(")");
      };
      _proto.compilePow = function compilePow(node, frame) {
        this._emit("Math.pow(");
        this.compile(node.left, frame);
        this._emit(", ");
        this.compile(node.right, frame);
        this._emit(")");
      };
      _proto.compileNeg = function compileNeg(node, frame) {
        this._emit("-");
        this.compile(node.target, frame);
      };
      _proto.compilePos = function compilePos(node, frame) {
        this._emit("+");
        this.compile(node.target, frame);
      };
      _proto.compileCompare = function compileCompare(node, frame) {
        var _this5 = this;
        this.compile(node.expr, frame);
        node.ops.forEach(function(op) {
          _this5._emit(" " + compareOps[op.type] + " ");
          _this5.compile(op.expr, frame);
        });
      };
      _proto.compileLookupVal = function compileLookupVal(node, frame) {
        this._emit("runtime.memberLookup((");
        this._compileExpression(node.target, frame);
        this._emit("),");
        this._compileExpression(node.val, frame);
        this._emit(")");
      };
      _proto._getNodeName = function _getNodeName(node) {
        switch (node.typename) {
          case "Symbol":
            return node.value;
          case "FunCall":
            return "the return value of (" + this._getNodeName(node.name) + ")";
          case "LookupVal":
            return this._getNodeName(node.target) + '["' + this._getNodeName(node.val) + '"]';
          case "Literal":
            return node.value.toString();
          default:
            return "--expression--";
        }
      };
      _proto.compileFunCall = function compileFunCall(node, frame) {
        this._emit("(lineno = " + node.lineno + ", colno = " + node.colno + ", ");
        this._emit("runtime.callWrap(");
        this._compileExpression(node.name, frame);
        this._emit(', "' + this._getNodeName(node.name).replace(/"/g, '\\"') + '", context, ');
        this._compileAggregate(node.args, frame, "[", "])");
        this._emit(")");
      };
      _proto.compileFilter = function compileFilter(node, frame) {
        var name2 = node.name;
        this.assertType(name2, nodes.Symbol);
        this._emit('env.getFilter("' + name2.value + '").call(context, ');
        this._compileAggregate(node.args, frame);
        this._emit(")");
      };
      _proto.compileFilterAsync = function compileFilterAsync(node, frame) {
        var name2 = node.name;
        var symbol = node.symbol.value;
        this.assertType(name2, nodes.Symbol);
        frame.set(symbol, symbol);
        this._emit('env.getFilter("' + name2.value + '").call(context, ');
        this._compileAggregate(node.args, frame);
        this._emitLine(", " + this._makeCallback(symbol));
        this._addScopeLevel();
      };
      _proto.compileKeywordArgs = function compileKeywordArgs(node, frame) {
        this._emit("runtime.makeKeywordArgs(");
        this.compileDict(node, frame);
        this._emit(")");
      };
      _proto.compileSet = function compileSet(node, frame) {
        var _this6 = this;
        var ids = [];
        node.targets.forEach(function(target) {
          var name2 = target.value;
          var id = frame.lookup(name2);
          if (id === null || id === void 0) {
            id = _this6._tmpid();
            _this6._emitLine("var " + id + ";");
          }
          ids.push(id);
        });
        if (node.value) {
          this._emit(ids.join(" = ") + " = ");
          this._compileExpression(node.value, frame);
          this._emitLine(";");
        } else {
          this._emit(ids.join(" = ") + " = ");
          this.compile(node.body, frame);
          this._emitLine(";");
        }
        node.targets.forEach(function(target, i) {
          var id = ids[i];
          var name2 = target.value;
          _this6._emitLine('frame.set("' + name2 + '", ' + id + ", true);");
          _this6._emitLine("if(frame.topLevel) {");
          _this6._emitLine('context.setVariable("' + name2 + '", ' + id + ");");
          _this6._emitLine("}");
          if (name2.charAt(0) !== "_") {
            _this6._emitLine("if(frame.topLevel) {");
            _this6._emitLine('context.addExport("' + name2 + '", ' + id + ");");
            _this6._emitLine("}");
          }
        });
      };
      _proto.compileSwitch = function compileSwitch(node, frame) {
        var _this7 = this;
        this._emit("switch (");
        this.compile(node.expr, frame);
        this._emit(") {");
        node.cases.forEach(function(c, i) {
          _this7._emit("case ");
          _this7.compile(c.cond, frame);
          _this7._emit(": ");
          _this7.compile(c.body, frame);
          if (c.body.children.length) {
            _this7._emitLine("break;");
          }
        });
        if (node.default) {
          this._emit("default:");
          this.compile(node.default, frame);
        }
        this._emit("}");
      };
      _proto.compileIf = function compileIf(node, frame, async) {
        var _this8 = this;
        this._emit("if(");
        this._compileExpression(node.cond, frame);
        this._emitLine(") {");
        this._withScopedSyntax(function() {
          _this8.compile(node.body, frame);
          if (async) {
            _this8._emit("cb()");
          }
        });
        if (node.else_) {
          this._emitLine("}\nelse {");
          this._withScopedSyntax(function() {
            _this8.compile(node.else_, frame);
            if (async) {
              _this8._emit("cb()");
            }
          });
        } else if (async) {
          this._emitLine("}\nelse {");
          this._emit("cb()");
        }
        this._emitLine("}");
      };
      _proto.compileIfAsync = function compileIfAsync(node, frame) {
        this._emit("(function(cb) {");
        this.compileIf(node, frame, true);
        this._emit("})(" + this._makeCallback());
        this._addScopeLevel();
      };
      _proto._emitLoopBindings = function _emitLoopBindings(node, arr, i, len) {
        var _this9 = this;
        var bindings = [{
          name: "index",
          val: i + " + 1"
        }, {
          name: "index0",
          val: i
        }, {
          name: "revindex",
          val: len + " - " + i
        }, {
          name: "revindex0",
          val: len + " - " + i + " - 1"
        }, {
          name: "first",
          val: i + " === 0"
        }, {
          name: "last",
          val: i + " === " + len + " - 1"
        }, {
          name: "length",
          val: len
        }];
        bindings.forEach(function(b) {
          _this9._emitLine('frame.set("loop.' + b.name + '", ' + b.val + ");");
        });
      };
      _proto.compileFor = function compileFor(node, frame) {
        var _this10 = this;
        var i = this._tmpid();
        var len = this._tmpid();
        var arr = this._tmpid();
        frame = frame.push();
        this._emitLine("frame = frame.push();");
        this._emit("var " + arr + " = ");
        this._compileExpression(node.arr, frame);
        this._emitLine(";");
        this._emit("if(" + arr + ") {");
        this._emitLine(arr + " = runtime.fromIterator(" + arr + ");");
        if (node.name instanceof nodes.Array) {
          this._emitLine("var " + i + ";");
          this._emitLine("if(runtime.isArray(" + arr + ")) {");
          this._emitLine("var " + len + " = " + arr + ".length;");
          this._emitLine("for(" + i + "=0; " + i + " < " + arr + ".length; " + i + "++) {");
          node.name.children.forEach(function(child, u2) {
            var tid = _this10._tmpid();
            _this10._emitLine("var " + tid + " = " + arr + "[" + i + "][" + u2 + "];");
            _this10._emitLine('frame.set("' + child + '", ' + arr + "[" + i + "][" + u2 + "]);");
            frame.set(node.name.children[u2].value, tid);
          });
          this._emitLoopBindings(node, arr, i, len);
          this._withScopedSyntax(function() {
            _this10.compile(node.body, frame);
          });
          this._emitLine("}");
          this._emitLine("} else {");
          var _node$name$children = node.name.children, key = _node$name$children[0], val = _node$name$children[1];
          var k = this._tmpid();
          var v = this._tmpid();
          frame.set(key.value, k);
          frame.set(val.value, v);
          this._emitLine(i + " = -1;");
          this._emitLine("var " + len + " = runtime.keys(" + arr + ").length;");
          this._emitLine("for(var " + k + " in " + arr + ") {");
          this._emitLine(i + "++;");
          this._emitLine("var " + v + " = " + arr + "[" + k + "];");
          this._emitLine('frame.set("' + key.value + '", ' + k + ");");
          this._emitLine('frame.set("' + val.value + '", ' + v + ");");
          this._emitLoopBindings(node, arr, i, len);
          this._withScopedSyntax(function() {
            _this10.compile(node.body, frame);
          });
          this._emitLine("}");
          this._emitLine("}");
        } else {
          var _v = this._tmpid();
          frame.set(node.name.value, _v);
          this._emitLine("var " + len + " = " + arr + ".length;");
          this._emitLine("for(var " + i + "=0; " + i + " < " + arr + ".length; " + i + "++) {");
          this._emitLine("var " + _v + " = " + arr + "[" + i + "];");
          this._emitLine('frame.set("' + node.name.value + '", ' + _v + ");");
          this._emitLoopBindings(node, arr, i, len);
          this._withScopedSyntax(function() {
            _this10.compile(node.body, frame);
          });
          this._emitLine("}");
        }
        this._emitLine("}");
        if (node.else_) {
          this._emitLine("if (!" + len + ") {");
          this.compile(node.else_, frame);
          this._emitLine("}");
        }
        this._emitLine("frame = frame.pop();");
      };
      _proto._compileAsyncLoop = function _compileAsyncLoop(node, frame, parallel) {
        var _this11 = this;
        var i = this._tmpid();
        var len = this._tmpid();
        var arr = this._tmpid();
        var asyncMethod = parallel ? "asyncAll" : "asyncEach";
        frame = frame.push();
        this._emitLine("frame = frame.push();");
        this._emit("var " + arr + " = runtime.fromIterator(");
        this._compileExpression(node.arr, frame);
        this._emitLine(");");
        if (node.name instanceof nodes.Array) {
          var arrayLen = node.name.children.length;
          this._emit("runtime." + asyncMethod + "(" + arr + ", " + arrayLen + ", function(");
          node.name.children.forEach(function(name2) {
            _this11._emit(name2.value + ",");
          });
          this._emit(i + "," + len + ",next) {");
          node.name.children.forEach(function(name2) {
            var id2 = name2.value;
            frame.set(id2, id2);
            _this11._emitLine('frame.set("' + id2 + '", ' + id2 + ");");
          });
        } else {
          var id = node.name.value;
          this._emitLine("runtime." + asyncMethod + "(" + arr + ", 1, function(" + id + ", " + i + ", " + len + ",next) {");
          this._emitLine('frame.set("' + id + '", ' + id + ");");
          frame.set(id, id);
        }
        this._emitLoopBindings(node, arr, i, len);
        this._withScopedSyntax(function() {
          var buf;
          if (parallel) {
            buf = _this11._pushBuffer();
          }
          _this11.compile(node.body, frame);
          _this11._emitLine("next(" + i + (buf ? "," + buf : "") + ");");
          if (parallel) {
            _this11._popBuffer();
          }
        });
        var output = this._tmpid();
        this._emitLine("}, " + this._makeCallback(output));
        this._addScopeLevel();
        if (parallel) {
          this._emitLine(this.buffer + " += " + output + ";");
        }
        if (node.else_) {
          this._emitLine("if (!" + arr + ".length) {");
          this.compile(node.else_, frame);
          this._emitLine("}");
        }
        this._emitLine("frame = frame.pop();");
      };
      _proto.compileAsyncEach = function compileAsyncEach(node, frame) {
        this._compileAsyncLoop(node, frame);
      };
      _proto.compileAsyncAll = function compileAsyncAll(node, frame) {
        this._compileAsyncLoop(node, frame, true);
      };
      _proto._compileMacro = function _compileMacro(node, frame) {
        var _this12 = this;
        var args = [];
        var kwargs = null;
        var funcId = "macro_" + this._tmpid();
        var keepFrame = frame !== void 0;
        node.args.children.forEach(function(arg, i) {
          if (i === node.args.children.length - 1 && arg instanceof nodes.Dict) {
            kwargs = arg;
          } else {
            _this12.assertType(arg, nodes.Symbol);
            args.push(arg);
          }
        });
        var realNames = [].concat(args.map(function(n) {
          return "l_" + n.value;
        }), ["kwargs"]);
        var argNames = args.map(function(n) {
          return '"' + n.value + '"';
        });
        var kwargNames = (kwargs && kwargs.children || []).map(function(n) {
          return '"' + n.key.value + '"';
        });
        var currFrame;
        if (keepFrame) {
          currFrame = frame.push(true);
        } else {
          currFrame = new Frame();
        }
        this._emitLines("var " + funcId + " = runtime.makeMacro(", "[" + argNames.join(", ") + "], ", "[" + kwargNames.join(", ") + "], ", "function (" + realNames.join(", ") + ") {", "var callerFrame = frame;", "frame = " + (keepFrame ? "frame.push(true);" : "new runtime.Frame();"), "kwargs = kwargs || {};", 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }');
        args.forEach(function(arg) {
          _this12._emitLine('frame.set("' + arg.value + '", l_' + arg.value + ");");
          currFrame.set(arg.value, "l_" + arg.value);
        });
        if (kwargs) {
          kwargs.children.forEach(function(pair) {
            var name2 = pair.key.value;
            _this12._emit('frame.set("' + name2 + '", ');
            _this12._emit('Object.prototype.hasOwnProperty.call(kwargs, "' + name2 + '")');
            _this12._emit(' ? kwargs["' + name2 + '"] : ');
            _this12._compileExpression(pair.value, currFrame);
            _this12._emit(");");
          });
        }
        var bufferId = this._pushBuffer();
        this._withScopedSyntax(function() {
          _this12.compile(node.body, currFrame);
        });
        this._emitLine("frame = " + (keepFrame ? "frame.pop();" : "callerFrame;"));
        this._emitLine("return new runtime.SafeString(" + bufferId + ");");
        this._emitLine("});");
        this._popBuffer();
        return funcId;
      };
      _proto.compileMacro = function compileMacro(node, frame) {
        var funcId = this._compileMacro(node);
        var name2 = node.name.value;
        frame.set(name2, funcId);
        if (frame.parent) {
          this._emitLine('frame.set("' + name2 + '", ' + funcId + ");");
        } else {
          if (node.name.value.charAt(0) !== "_") {
            this._emitLine('context.addExport("' + name2 + '");');
          }
          this._emitLine('context.setVariable("' + name2 + '", ' + funcId + ");");
        }
      };
      _proto.compileCaller = function compileCaller(node, frame) {
        this._emit("(function (){");
        var funcId = this._compileMacro(node, frame);
        this._emit("return " + funcId + ";})()");
      };
      _proto._compileGetTemplate = function _compileGetTemplate(node, frame, eagerCompile, ignoreMissing) {
        var parentTemplateId = this._tmpid();
        var parentName = this._templateName();
        var cb = this._makeCallback(parentTemplateId);
        var eagerCompileArg = eagerCompile ? "true" : "false";
        var ignoreMissingArg = ignoreMissing ? "true" : "false";
        this._emit("env.getTemplate(");
        this._compileExpression(node.template, frame);
        this._emitLine(", " + eagerCompileArg + ", " + parentName + ", " + ignoreMissingArg + ", " + cb);
        return parentTemplateId;
      };
      _proto.compileImport = function compileImport(node, frame) {
        var target = node.target.value;
        var id = this._compileGetTemplate(node, frame, false, false);
        this._addScopeLevel();
        this._emitLine(id + ".getExported(" + (node.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(id));
        this._addScopeLevel();
        frame.set(target, id);
        if (frame.parent) {
          this._emitLine('frame.set("' + target + '", ' + id + ");");
        } else {
          this._emitLine('context.setVariable("' + target + '", ' + id + ");");
        }
      };
      _proto.compileFromImport = function compileFromImport(node, frame) {
        var _this13 = this;
        var importedId = this._compileGetTemplate(node, frame, false, false);
        this._addScopeLevel();
        this._emitLine(importedId + ".getExported(" + (node.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(importedId));
        this._addScopeLevel();
        node.names.children.forEach(function(nameNode) {
          var name2;
          var alias;
          var id = _this13._tmpid();
          if (nameNode instanceof nodes.Pair) {
            name2 = nameNode.key.value;
            alias = nameNode.value.value;
          } else {
            name2 = nameNode.value;
            alias = name2;
          }
          _this13._emitLine("if(Object.prototype.hasOwnProperty.call(" + importedId + ', "' + name2 + '")) {');
          _this13._emitLine("var " + id + " = " + importedId + "." + name2 + ";");
          _this13._emitLine("} else {");
          _this13._emitLine(`cb(new Error("cannot import '` + name2 + `'")); return;`);
          _this13._emitLine("}");
          frame.set(alias, id);
          if (frame.parent) {
            _this13._emitLine('frame.set("' + alias + '", ' + id + ");");
          } else {
            _this13._emitLine('context.setVariable("' + alias + '", ' + id + ");");
          }
        });
      };
      _proto.compileBlock = function compileBlock(node) {
        var id = this._tmpid();
        if (!this.inBlock) {
          this._emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : ');
        }
        this._emit('context.getBlock("' + node.name.value + '")');
        if (!this.inBlock) {
          this._emit(")");
        }
        this._emitLine("(env, context, frame, runtime, " + this._makeCallback(id));
        this._emitLine(this.buffer + " += " + id + ";");
        this._addScopeLevel();
      };
      _proto.compileSuper = function compileSuper(node, frame) {
        var name2 = node.blockName.value;
        var id = node.symbol.value;
        var cb = this._makeCallback(id);
        this._emitLine('context.getSuper(env, "' + name2 + '", b_' + name2 + ", frame, runtime, " + cb);
        this._emitLine(id + " = runtime.markSafe(" + id + ");");
        this._addScopeLevel();
        frame.set(id, id);
      };
      _proto.compileExtends = function compileExtends(node, frame) {
        var k = this._tmpid();
        var parentTemplateId = this._compileGetTemplate(node, frame, true, false);
        this._emitLine("parentTemplate = " + parentTemplateId);
        this._emitLine("for(var " + k + " in parentTemplate.blocks) {");
        this._emitLine("context.addBlock(" + k + ", parentTemplate.blocks[" + k + "]);");
        this._emitLine("}");
        this._addScopeLevel();
      };
      _proto.compileInclude = function compileInclude(node, frame) {
        this._emitLine("var tasks = [];");
        this._emitLine("tasks.push(");
        this._emitLine("function(callback) {");
        var id = this._compileGetTemplate(node, frame, false, node.ignoreMissing);
        this._emitLine("callback(null," + id + ");});");
        this._emitLine("});");
        var id2 = this._tmpid();
        this._emitLine("tasks.push(");
        this._emitLine("function(template, callback){");
        this._emitLine("template.render(context.getVariables(), frame, " + this._makeCallback(id2));
        this._emitLine("callback(null," + id2 + ");});");
        this._emitLine("});");
        this._emitLine("tasks.push(");
        this._emitLine("function(result, callback){");
        this._emitLine(this.buffer + " += result;");
        this._emitLine("callback(null);");
        this._emitLine("});");
        this._emitLine("env.waterfall(tasks, function(){");
        this._addScopeLevel();
      };
      _proto.compileTemplateData = function compileTemplateData(node, frame) {
        this.compileLiteral(node, frame);
      };
      _proto.compileCapture = function compileCapture(node, frame) {
        var _this14 = this;
        var buffer2 = this.buffer;
        this.buffer = "output";
        this._emitLine("(function() {");
        this._emitLine('var output = "";');
        this._withScopedSyntax(function() {
          _this14.compile(node.body, frame);
        });
        this._emitLine("return output;");
        this._emitLine("})()");
        this.buffer = buffer2;
      };
      _proto.compileOutput = function compileOutput(node, frame) {
        var _this15 = this;
        var children = node.children;
        children.forEach(function(child) {
          if (child instanceof nodes.TemplateData) {
            if (child.value) {
              _this15._emit(_this15.buffer + " += ");
              _this15.compileLiteral(child, frame);
              _this15._emitLine(";");
            }
          } else {
            _this15._emit(_this15.buffer + " += runtime.suppressValue(");
            if (_this15.throwOnUndefined) {
              _this15._emit("runtime.ensureDefined(");
            }
            _this15.compile(child, frame);
            if (_this15.throwOnUndefined) {
              _this15._emit("," + node.lineno + "," + node.colno + ")");
            }
            _this15._emit(", env.opts.autoescape);\n");
          }
        });
      };
      _proto.compileRoot = function compileRoot(node, frame) {
        var _this16 = this;
        if (frame) {
          this.fail("compileRoot: root node can't have frame");
        }
        frame = new Frame();
        this._emitFuncBegin(node, "root");
        this._emitLine("var parentTemplate = null;");
        this._compileChildren(node, frame);
        this._emitLine("if(parentTemplate) {");
        this._emitLine("parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);");
        this._emitLine("} else {");
        this._emitLine("cb(null, " + this.buffer + ");");
        this._emitLine("}");
        this._emitFuncEnd(true);
        this.inBlock = true;
        var blockNames = [];
        var blocks = node.findAll(nodes.Block);
        blocks.forEach(function(block, i) {
          var name2 = block.name.value;
          if (blockNames.indexOf(name2) !== -1) {
            throw new Error('Block "' + name2 + '" defined more than once.');
          }
          blockNames.push(name2);
          _this16._emitFuncBegin(block, "b_" + name2);
          var tmpFrame = new Frame();
          _this16._emitLine("var frame = frame.push(true);");
          _this16.compile(block.body, tmpFrame);
          _this16._emitFuncEnd();
        });
        this._emitLine("return {");
        blocks.forEach(function(block, i) {
          var blockName = "b_" + block.name.value;
          _this16._emitLine(blockName + ": " + blockName + ",");
        });
        this._emitLine("root: root\n};");
      };
      _proto.compile = function compile2(node, frame) {
        var _compile = this["compile" + node.typename];
        if (_compile) {
          _compile.call(this, node, frame);
        } else {
          this.fail("compile: Cannot compile node: " + node.typename, node.lineno, node.colno);
        }
      };
      _proto.getCode = function getCode() {
        return this.codebuf.join("");
      };
      return Compiler2;
    })(Obj);
    module.exports = {
      compile: function compile2(src, asyncFilters, extensions, name2, opts) {
        if (opts === void 0) {
          opts = {};
        }
        var c = new Compiler(name2, opts.throwOnUndefined);
        var preprocessors = (extensions || []).map(function(ext) {
          return ext.preprocess;
        }).filter(function(f) {
          return !!f;
        });
        var processedSrc = preprocessors.reduce(function(s, processor) {
          return processor(s);
        }, src);
        c.compile(transformer.transform(parser2.parse(processedSrc, extensions, opts), asyncFilters, name2));
        return c.getCode();
      },
      Compiler
    };
  }
});

// node_modules/nunjucks/src/filters.js
var require_filters = __commonJS({
  "node_modules/nunjucks/src/filters.js"(exports, module) {
    "use strict";
    var lib = require_lib3();
    var r = require_runtime();
    var _exports = module.exports = {};
    function normalize(value, defaultValue) {
      if (value === null || value === void 0 || value === false) {
        return defaultValue;
      }
      return value;
    }
    _exports.abs = Math.abs;
    function isNaN2(num) {
      return num !== num;
    }
    function batch(arr, linecount, fillWith) {
      var i;
      var res = [];
      var tmp = [];
      for (i = 0; i < arr.length; i++) {
        if (i % linecount === 0 && tmp.length) {
          res.push(tmp);
          tmp = [];
        }
        tmp.push(arr[i]);
      }
      if (tmp.length) {
        if (fillWith) {
          for (i = tmp.length; i < linecount; i++) {
            tmp.push(fillWith);
          }
        }
        res.push(tmp);
      }
      return res;
    }
    _exports.batch = batch;
    function capitalize(str2) {
      str2 = normalize(str2, "");
      var ret = str2.toLowerCase();
      return r.copySafeness(str2, ret.charAt(0).toUpperCase() + ret.slice(1));
    }
    _exports.capitalize = capitalize;
    function center(str2, width) {
      str2 = normalize(str2, "");
      width = width || 80;
      if (str2.length >= width) {
        return str2;
      }
      var spaces = width - str2.length;
      var pre = lib.repeat(" ", spaces / 2 - spaces % 2);
      var post = lib.repeat(" ", spaces / 2);
      return r.copySafeness(str2, pre + str2 + post);
    }
    _exports.center = center;
    function default_(val, def, bool2) {
      if (bool2) {
        return val || def;
      } else {
        return val !== void 0 ? val : def;
      }
    }
    _exports["default"] = default_;
    function dictsort(val, caseSensitive, by) {
      if (!lib.isObject(val)) {
        throw new lib.TemplateError("dictsort filter: val must be an object");
      }
      var array = [];
      for (var k in val) {
        array.push([k, val[k]]);
      }
      var si;
      if (by === void 0 || by === "key") {
        si = 0;
      } else if (by === "value") {
        si = 1;
      } else {
        throw new lib.TemplateError("dictsort filter: You can only sort by either key or value");
      }
      array.sort(function(t1, t2) {
        var a = t1[si];
        var b = t2[si];
        if (!caseSensitive) {
          if (lib.isString(a)) {
            a = a.toUpperCase();
          }
          if (lib.isString(b)) {
            b = b.toUpperCase();
          }
        }
        return a > b ? 1 : a === b ? 0 : -1;
      });
      return array;
    }
    _exports.dictsort = dictsort;
    function dump2(obj, spaces) {
      return JSON.stringify(obj, null, spaces);
    }
    _exports.dump = dump2;
    function escape(str2) {
      if (str2 instanceof r.SafeString) {
        return str2;
      }
      str2 = str2 === null || str2 === void 0 ? "" : str2;
      return r.markSafe(lib.escape(str2.toString()));
    }
    _exports.escape = escape;
    function safe(str2) {
      if (str2 instanceof r.SafeString) {
        return str2;
      }
      str2 = str2 === null || str2 === void 0 ? "" : str2;
      return r.markSafe(str2.toString());
    }
    _exports.safe = safe;
    function first(arr) {
      return arr[0];
    }
    _exports.first = first;
    function forceescape(str2) {
      str2 = str2 === null || str2 === void 0 ? "" : str2;
      return r.markSafe(lib.escape(str2.toString()));
    }
    _exports.forceescape = forceescape;
    function groupby(arr, attr) {
      return lib.groupBy(arr, attr, this.env.opts.throwOnUndefined);
    }
    _exports.groupby = groupby;
    function indent(str2, width, indentfirst) {
      str2 = normalize(str2, "");
      if (str2 === "") {
        return "";
      }
      width = width || 4;
      var lines = str2.split("\n");
      var sp = lib.repeat(" ", width);
      var res = lines.map(function(l, i) {
        return i === 0 && !indentfirst ? l : "" + sp + l;
      }).join("\n");
      return r.copySafeness(str2, res);
    }
    _exports.indent = indent;
    function join(arr, del, attr) {
      del = del || "";
      if (attr) {
        arr = lib.map(arr, function(v) {
          return v[attr];
        });
      }
      return arr.join(del);
    }
    _exports.join = join;
    function last(arr) {
      return arr[arr.length - 1];
    }
    _exports.last = last;
    function lengthFilter(val) {
      var value = normalize(val, "");
      if (value !== void 0) {
        if (typeof Map === "function" && value instanceof Map || typeof Set === "function" && value instanceof Set) {
          return value.size;
        }
        if (lib.isObject(value) && !(value instanceof r.SafeString)) {
          return lib.keys(value).length;
        }
        return value.length;
      }
      return 0;
    }
    _exports.length = lengthFilter;
    function list(val) {
      if (lib.isString(val)) {
        return val.split("");
      } else if (lib.isObject(val)) {
        return lib._entries(val || {}).map(function(_ref) {
          var key = _ref[0], value = _ref[1];
          return {
            key,
            value
          };
        });
      } else if (lib.isArray(val)) {
        return val;
      } else {
        throw new lib.TemplateError("list filter: type not iterable");
      }
    }
    _exports.list = list;
    function lower(str2) {
      str2 = normalize(str2, "");
      return str2.toLowerCase();
    }
    _exports.lower = lower;
    function nl2br(str2) {
      if (str2 === null || str2 === void 0) {
        return "";
      }
      return r.copySafeness(str2, str2.replace(/\r\n|\n/g, "<br />\n"));
    }
    _exports.nl2br = nl2br;
    function random2(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    _exports.random = random2;
    function getSelectOrReject(expectedTestResult) {
      function filter(arr, testName, secondArg) {
        if (testName === void 0) {
          testName = "truthy";
        }
        var context = this;
        var test2 = context.env.getTest(testName);
        return lib.toArray(arr).filter(function examineTestResult(item) {
          return test2.call(context, item, secondArg) === expectedTestResult;
        });
      }
      return filter;
    }
    _exports.reject = getSelectOrReject(false);
    function rejectattr(arr, attr) {
      return arr.filter(function(item) {
        return !item[attr];
      });
    }
    _exports.rejectattr = rejectattr;
    _exports.select = getSelectOrReject(true);
    function selectattr(arr, attr) {
      return arr.filter(function(item) {
        return !!item[attr];
      });
    }
    _exports.selectattr = selectattr;
    function replace(str2, old, new_, maxCount) {
      var originalStr = str2;
      if (old instanceof RegExp) {
        return str2.replace(old, new_);
      }
      if (typeof maxCount === "undefined") {
        maxCount = -1;
      }
      var res = "";
      if (typeof old === "number") {
        old = "" + old;
      } else if (typeof old !== "string") {
        return str2;
      }
      if (typeof str2 === "number") {
        str2 = "" + str2;
      }
      if (typeof str2 !== "string" && !(str2 instanceof r.SafeString)) {
        return str2;
      }
      if (old === "") {
        res = new_ + str2.split("").join(new_) + new_;
        return r.copySafeness(str2, res);
      }
      var nextIndex = str2.indexOf(old);
      if (maxCount === 0 || nextIndex === -1) {
        return str2;
      }
      var pos = 0;
      var count2 = 0;
      while (nextIndex > -1 && (maxCount === -1 || count2 < maxCount)) {
        res += str2.substring(pos, nextIndex) + new_;
        pos = nextIndex + old.length;
        count2++;
        nextIndex = str2.indexOf(old, pos);
      }
      if (pos < str2.length) {
        res += str2.substring(pos);
      }
      return r.copySafeness(originalStr, res);
    }
    _exports.replace = replace;
    function reverse(val) {
      var arr;
      if (lib.isString(val)) {
        arr = list(val);
      } else {
        arr = lib.map(val, function(v) {
          return v;
        });
      }
      arr.reverse();
      if (lib.isString(val)) {
        return r.copySafeness(val, arr.join(""));
      }
      return arr;
    }
    _exports.reverse = reverse;
    function round(val, precision, method) {
      precision = precision || 0;
      var factor = Math.pow(10, precision);
      var rounder;
      if (method === "ceil") {
        rounder = Math.ceil;
      } else if (method === "floor") {
        rounder = Math.floor;
      } else {
        rounder = Math.round;
      }
      return rounder(val * factor) / factor;
    }
    _exports.round = round;
    function slice2(arr, slices, fillWith) {
      var sliceLength = Math.floor(arr.length / slices);
      var extra = arr.length % slices;
      var res = [];
      var offset = 0;
      for (var i = 0; i < slices; i++) {
        var start = offset + i * sliceLength;
        if (i < extra) {
          offset++;
        }
        var end = offset + (i + 1) * sliceLength;
        var currSlice = arr.slice(start, end);
        if (fillWith && i >= extra) {
          currSlice.push(fillWith);
        }
        res.push(currSlice);
      }
      return res;
    }
    _exports.slice = slice2;
    function sum(arr, attr, start) {
      if (start === void 0) {
        start = 0;
      }
      if (attr) {
        arr = lib.map(arr, function(v) {
          return v[attr];
        });
      }
      return start + arr.reduce(function(a, b) {
        return a + b;
      }, 0);
    }
    _exports.sum = sum;
    _exports.sort = r.makeMacro(["value", "reverse", "case_sensitive", "attribute"], [], function sortFilter(arr, reversed, caseSens, attr) {
      var _this = this;
      var array = lib.map(arr, function(v) {
        return v;
      });
      var getAttribute = lib.getAttrGetter(attr);
      array.sort(function(a, b) {
        var x = attr ? getAttribute(a) : a;
        var y = attr ? getAttribute(b) : b;
        if (_this.env.opts.throwOnUndefined && attr && (x === void 0 || y === void 0)) {
          throw new TypeError('sort: attribute "' + attr + '" resolved to undefined');
        }
        if (!caseSens && lib.isString(x) && lib.isString(y)) {
          x = x.toLowerCase();
          y = y.toLowerCase();
        }
        if (x < y) {
          return reversed ? 1 : -1;
        } else if (x > y) {
          return reversed ? -1 : 1;
        } else {
          return 0;
        }
      });
      return array;
    });
    function string(obj) {
      return r.copySafeness(obj, obj);
    }
    _exports.string = string;
    function striptags(input, preserveLinebreaks) {
      input = normalize(input, "");
      var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
      var trimmedInput = trim(input.replace(tags, ""));
      var res = "";
      if (preserveLinebreaks) {
        res = trimmedInput.replace(/^ +| +$/gm, "").replace(/ +/g, " ").replace(/(\r\n)/g, "\n").replace(/\n\n\n+/g, "\n\n");
      } else {
        res = trimmedInput.replace(/\s+/gi, " ");
      }
      return r.copySafeness(input, res);
    }
    _exports.striptags = striptags;
    function title(str2) {
      str2 = normalize(str2, "");
      var words = str2.split(" ").map(function(word) {
        return capitalize(word);
      });
      return r.copySafeness(str2, words.join(" "));
    }
    _exports.title = title;
    function trim(str2) {
      return r.copySafeness(str2, str2.replace(/^\s*|\s*$/g, ""));
    }
    _exports.trim = trim;
    function truncate(input, length, killwords, end) {
      var orig = input;
      input = normalize(input, "");
      length = length || 255;
      if (input.length <= length) {
        return input;
      }
      if (killwords) {
        input = input.substring(0, length);
      } else {
        var idx = input.lastIndexOf(" ", length);
        if (idx === -1) {
          idx = length;
        }
        input = input.substring(0, idx);
      }
      input += end !== void 0 && end !== null ? end : "...";
      return r.copySafeness(orig, input);
    }
    _exports.truncate = truncate;
    function upper(str2) {
      str2 = normalize(str2, "");
      return str2.toUpperCase();
    }
    _exports.upper = upper;
    function urlencode(obj) {
      var enc = encodeURIComponent;
      if (lib.isString(obj)) {
        return enc(obj);
      } else {
        var keyvals = lib.isArray(obj) ? obj : lib._entries(obj);
        return keyvals.map(function(_ref2) {
          var k = _ref2[0], v = _ref2[1];
          return enc(k) + "=" + enc(v);
        }).join("&");
      }
    }
    _exports.urlencode = urlencode;
    var puncRe = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/;
    var emailRe = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i;
    var httpHttpsRe = /^https?:\/\/.*$/;
    var wwwRe = /^www\./;
    var tldRe = /\.(?:org|net|com)(?:\:|\/|$)/;
    function urlize(str2, length, nofollow) {
      if (isNaN2(length)) {
        length = Infinity;
      }
      var noFollowAttr = nofollow === true ? ' rel="nofollow"' : "";
      var words = str2.split(/(\s+)/).filter(function(word) {
        return word && word.length;
      }).map(function(word) {
        var matches2 = word.match(puncRe);
        var possibleUrl = matches2 ? matches2[1] : word;
        var shortUrl = possibleUrl.substr(0, length);
        if (httpHttpsRe.test(possibleUrl)) {
          return '<a href="' + possibleUrl + '"' + noFollowAttr + ">" + shortUrl + "</a>";
        }
        if (wwwRe.test(possibleUrl)) {
          return '<a href="http://' + possibleUrl + '"' + noFollowAttr + ">" + shortUrl + "</a>";
        }
        if (emailRe.test(possibleUrl)) {
          return '<a href="mailto:' + possibleUrl + '">' + possibleUrl + "</a>";
        }
        if (tldRe.test(possibleUrl)) {
          return '<a href="http://' + possibleUrl + '"' + noFollowAttr + ">" + shortUrl + "</a>";
        }
        return word;
      });
      return words.join("");
    }
    _exports.urlize = urlize;
    function wordcount(str2) {
      str2 = normalize(str2, "");
      var words = str2 ? str2.match(/\w+/g) : null;
      return words ? words.length : null;
    }
    _exports.wordcount = wordcount;
    function float2(val, def) {
      var res = parseFloat(val);
      return isNaN2(res) ? def : res;
    }
    _exports.float = float2;
    var intFilter = r.makeMacro(["value", "default", "base"], [], function doInt(value, defaultValue, base) {
      if (base === void 0) {
        base = 10;
      }
      var res = parseInt(value, base);
      return isNaN2(res) ? defaultValue : res;
    });
    _exports.int = intFilter;
    _exports.d = _exports.default;
    _exports.e = _exports.escape;
  }
});

// node_modules/nunjucks/src/loader.js
var require_loader = __commonJS({
  "node_modules/nunjucks/src/loader.js"(exports, module) {
    "use strict";
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var path2 = __require("path");
    var _require = require_object();
    var EmitterObj = _require.EmitterObj;
    module.exports = /* @__PURE__ */ (function(_EmitterObj) {
      _inheritsLoose(Loader, _EmitterObj);
      function Loader() {
        return _EmitterObj.apply(this, arguments) || this;
      }
      var _proto = Loader.prototype;
      _proto.resolve = function resolve(from2, to) {
        return path2.resolve(path2.dirname(from2), to);
      };
      _proto.isRelative = function isRelative(filename) {
        return filename.indexOf("./") === 0 || filename.indexOf("../") === 0;
      };
      return Loader;
    })(EmitterObj);
  }
});

// node_modules/nunjucks/src/precompiled-loader.js
var require_precompiled_loader = __commonJS({
  "node_modules/nunjucks/src/precompiled-loader.js"(exports, module) {
    "use strict";
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var Loader = require_loader();
    var PrecompiledLoader = /* @__PURE__ */ (function(_Loader) {
      _inheritsLoose(PrecompiledLoader2, _Loader);
      function PrecompiledLoader2(compiledTemplates) {
        var _this;
        _this = _Loader.call(this) || this;
        _this.precompiled = compiledTemplates || {};
        return _this;
      }
      var _proto = PrecompiledLoader2.prototype;
      _proto.getSource = function getSource(name2) {
        if (this.precompiled[name2]) {
          return {
            src: {
              type: "code",
              obj: this.precompiled[name2]
            },
            path: name2
          };
        }
        return null;
      };
      return PrecompiledLoader2;
    })(Loader);
    module.exports = {
      PrecompiledLoader
    };
  }
});

// node_modules/nunjucks/src/node-loaders.js
var require_node_loaders = __commonJS({
  "node_modules/nunjucks/src/node-loaders.js"(exports, module) {
    "use strict";
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var fs = __require("fs");
    var path2 = __require("path");
    var Loader = require_loader();
    var _require = require_precompiled_loader();
    var PrecompiledLoader = _require.PrecompiledLoader;
    var chokidar;
    var FileSystemLoader = /* @__PURE__ */ (function(_Loader) {
      _inheritsLoose(FileSystemLoader2, _Loader);
      function FileSystemLoader2(searchPaths, opts) {
        var _this;
        _this = _Loader.call(this) || this;
        if (typeof opts === "boolean") {
          console.log("[nunjucks] Warning: you passed a boolean as the second argument to FileSystemLoader, but it now takes an options object. See http://mozilla.github.io/nunjucks/api.html#filesystemloader");
        }
        opts = opts || {};
        _this.pathsToNames = {};
        _this.noCache = !!opts.noCache;
        if (searchPaths) {
          searchPaths = Array.isArray(searchPaths) ? searchPaths : [searchPaths];
          _this.searchPaths = searchPaths.map(path2.normalize);
        } else {
          _this.searchPaths = ["."];
        }
        if (opts.watch) {
          try {
            chokidar = __require("chokidar");
          } catch (e) {
            throw new Error("watch requires chokidar to be installed");
          }
          var paths = _this.searchPaths.filter(fs.existsSync);
          var watcher = chokidar.watch(paths);
          watcher.on("all", function(event, fullname) {
            fullname = path2.resolve(fullname);
            if (event === "change" && fullname in _this.pathsToNames) {
              _this.emit("update", _this.pathsToNames[fullname], fullname);
            }
          });
          watcher.on("error", function(error) {
            console.log("Watcher error: " + error);
          });
        }
        return _this;
      }
      var _proto = FileSystemLoader2.prototype;
      _proto.getSource = function getSource(name2) {
        var fullpath = null;
        var paths = this.searchPaths;
        for (var i = 0; i < paths.length; i++) {
          var basePath = path2.resolve(paths[i]);
          var p = path2.resolve(paths[i], name2);
          if (p.indexOf(basePath) === 0 && fs.existsSync(p)) {
            fullpath = p;
            break;
          }
        }
        if (!fullpath) {
          return null;
        }
        this.pathsToNames[fullpath] = name2;
        var source = {
          src: fs.readFileSync(fullpath, "utf-8"),
          path: fullpath,
          noCache: this.noCache
        };
        this.emit("load", name2, source);
        return source;
      };
      return FileSystemLoader2;
    })(Loader);
    var NodeResolveLoader = /* @__PURE__ */ (function(_Loader2) {
      _inheritsLoose(NodeResolveLoader2, _Loader2);
      function NodeResolveLoader2(opts) {
        var _this2;
        _this2 = _Loader2.call(this) || this;
        opts = opts || {};
        _this2.pathsToNames = {};
        _this2.noCache = !!opts.noCache;
        if (opts.watch) {
          try {
            chokidar = __require("chokidar");
          } catch (e) {
            throw new Error("watch requires chokidar to be installed");
          }
          _this2.watcher = chokidar.watch();
          _this2.watcher.on("change", function(fullname) {
            _this2.emit("update", _this2.pathsToNames[fullname], fullname);
          });
          _this2.watcher.on("error", function(error) {
            console.log("Watcher error: " + error);
          });
          _this2.on("load", function(name2, source) {
            _this2.watcher.add(source.path);
          });
        }
        return _this2;
      }
      var _proto2 = NodeResolveLoader2.prototype;
      _proto2.getSource = function getSource(name2) {
        if (/^\.?\.?(\/|\\)/.test(name2)) {
          return null;
        }
        if (/^[A-Z]:/.test(name2)) {
          return null;
        }
        var fullpath;
        try {
          fullpath = __require.resolve(name2);
        } catch (e) {
          return null;
        }
        this.pathsToNames[fullpath] = name2;
        var source = {
          src: fs.readFileSync(fullpath, "utf-8"),
          path: fullpath,
          noCache: this.noCache
        };
        this.emit("load", name2, source);
        return source;
      };
      return NodeResolveLoader2;
    })(Loader);
    module.exports = {
      FileSystemLoader,
      PrecompiledLoader,
      NodeResolveLoader
    };
  }
});

// node_modules/nunjucks/src/loaders.js
var require_loaders = __commonJS({
  "node_modules/nunjucks/src/loaders.js"(exports, module) {
    "use strict";
    module.exports = require_node_loaders();
  }
});

// node_modules/nunjucks/src/tests.js
var require_tests = __commonJS({
  "node_modules/nunjucks/src/tests.js"(exports) {
    "use strict";
    var SafeString = require_runtime().SafeString;
    function callable(value) {
      return typeof value === "function";
    }
    exports.callable = callable;
    function defined2(value) {
      return value !== void 0;
    }
    exports.defined = defined2;
    function divisibleby(one2, two) {
      return one2 % two === 0;
    }
    exports.divisibleby = divisibleby;
    function escaped(value) {
      return value instanceof SafeString;
    }
    exports.escaped = escaped;
    function equalto(one2, two) {
      return one2 === two;
    }
    exports.equalto = equalto;
    exports.eq = exports.equalto;
    exports.sameas = exports.equalto;
    function even(value) {
      return value % 2 === 0;
    }
    exports.even = even;
    function falsy(value) {
      return !value;
    }
    exports.falsy = falsy;
    function ge(one2, two) {
      return one2 >= two;
    }
    exports.ge = ge;
    function greaterthan(one2, two) {
      return one2 > two;
    }
    exports.greaterthan = greaterthan;
    exports.gt = exports.greaterthan;
    function le(one2, two) {
      return one2 <= two;
    }
    exports.le = le;
    function lessthan(one2, two) {
      return one2 < two;
    }
    exports.lessthan = lessthan;
    exports.lt = exports.lessthan;
    function lower(value) {
      return value.toLowerCase() === value;
    }
    exports.lower = lower;
    function ne(one2, two) {
      return one2 !== two;
    }
    exports.ne = ne;
    function nullTest(value) {
      return value === null;
    }
    exports.null = nullTest;
    function number(value) {
      return typeof value === "number";
    }
    exports.number = number;
    function odd(value) {
      return value % 2 === 1;
    }
    exports.odd = odd;
    function string(value) {
      return typeof value === "string";
    }
    exports.string = string;
    function truthy(value) {
      return !!value;
    }
    exports.truthy = truthy;
    function undefinedTest(value) {
      return value === void 0;
    }
    exports.undefined = undefinedTest;
    function upper(value) {
      return value.toUpperCase() === value;
    }
    exports.upper = upper;
    function iterable(value) {
      if (typeof Symbol !== "undefined") {
        return !!value[Symbol.iterator];
      } else {
        return Array.isArray(value) || typeof value === "string";
      }
    }
    exports.iterable = iterable;
    function mapping(value) {
      var bool2 = value !== null && value !== void 0 && typeof value === "object" && !Array.isArray(value);
      if (Set) {
        return bool2 && !(value instanceof Set);
      } else {
        return bool2;
      }
    }
    exports.mapping = mapping;
  }
});

// node_modules/nunjucks/src/globals.js
var require_globals = __commonJS({
  "node_modules/nunjucks/src/globals.js"(exports, module) {
    "use strict";
    function _cycler(items) {
      var index2 = -1;
      return {
        current: null,
        reset: function reset() {
          index2 = -1;
          this.current = null;
        },
        next: function next() {
          index2++;
          if (index2 >= items.length) {
            index2 = 0;
          }
          this.current = items[index2];
          return this.current;
        }
      };
    }
    function _joiner(sep) {
      sep = sep || ",";
      var first = true;
      return function() {
        var val = first ? "" : sep;
        first = false;
        return val;
      };
    }
    function globals() {
      return {
        range: function range(start, stop, step) {
          if (typeof stop === "undefined") {
            stop = start;
            start = 0;
            step = 1;
          } else if (!step) {
            step = 1;
          }
          var arr = [];
          if (step > 0) {
            for (var i = start; i < stop; i += step) {
              arr.push(i);
            }
          } else {
            for (var _i = start; _i > stop; _i += step) {
              arr.push(_i);
            }
          }
          return arr;
        },
        cycler: function cycler() {
          return _cycler(Array.prototype.slice.call(arguments));
        },
        joiner: function joiner(sep) {
          return _joiner(sep);
        }
      };
    }
    module.exports = globals;
  }
});

// node_modules/nunjucks/src/express-app.js
var require_express_app = __commonJS({
  "node_modules/nunjucks/src/express-app.js"(exports, module) {
    "use strict";
    var path2 = __require("path");
    module.exports = function express(env, app) {
      function NunjucksView(name2, opts) {
        this.name = name2;
        this.path = name2;
        this.defaultEngine = opts.defaultEngine;
        this.ext = path2.extname(name2);
        if (!this.ext && !this.defaultEngine) {
          throw new Error("No default engine was specified and no extension was provided.");
        }
        if (!this.ext) {
          this.name += this.ext = (this.defaultEngine[0] !== "." ? "." : "") + this.defaultEngine;
        }
      }
      NunjucksView.prototype.render = function render(opts, cb) {
        env.render(this.name, opts, cb);
      };
      app.set("view", NunjucksView);
      app.set("nunjucksEnv", env);
      return env;
    };
  }
});

// node_modules/nunjucks/src/environment.js
var require_environment = __commonJS({
  "node_modules/nunjucks/src/environment.js"(exports, module) {
    "use strict";
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var asap = require_asap();
    var _waterfall = require_a_sync_waterfall();
    var lib = require_lib3();
    var compiler = require_compiler();
    var filters = require_filters();
    var _require = require_loaders();
    var FileSystemLoader = _require.FileSystemLoader;
    var WebLoader = _require.WebLoader;
    var PrecompiledLoader = _require.PrecompiledLoader;
    var tests = require_tests();
    var globals = require_globals();
    var _require2 = require_object();
    var Obj = _require2.Obj;
    var EmitterObj = _require2.EmitterObj;
    var globalRuntime = require_runtime();
    var handleError = globalRuntime.handleError;
    var Frame = globalRuntime.Frame;
    var expressApp = require_express_app();
    function callbackAsap(cb, err, res) {
      asap(function() {
        cb(err, res);
      });
    }
    var noopTmplSrc = {
      type: "code",
      obj: {
        root: function root2(env, context, frame, runtime, cb) {
          try {
            cb(null, "");
          } catch (e) {
            cb(handleError(e, null, null));
          }
        }
      }
    };
    var Environment = /* @__PURE__ */ (function(_EmitterObj) {
      _inheritsLoose(Environment2, _EmitterObj);
      function Environment2() {
        return _EmitterObj.apply(this, arguments) || this;
      }
      var _proto = Environment2.prototype;
      _proto.init = function init2(loaders, opts) {
        var _this = this;
        opts = this.opts = opts || {};
        this.opts.dev = !!opts.dev;
        this.opts.autoescape = opts.autoescape != null ? opts.autoescape : true;
        this.opts.throwOnUndefined = !!opts.throwOnUndefined;
        this.opts.trimBlocks = !!opts.trimBlocks;
        this.opts.lstripBlocks = !!opts.lstripBlocks;
        this.loaders = [];
        if (!loaders) {
          if (FileSystemLoader) {
            this.loaders = [new FileSystemLoader("views")];
          } else if (WebLoader) {
            this.loaders = [new WebLoader("/views")];
          }
        } else {
          this.loaders = lib.isArray(loaders) ? loaders : [loaders];
        }
        if (typeof window !== "undefined" && window.nunjucksPrecompiled) {
          this.loaders.unshift(new PrecompiledLoader(window.nunjucksPrecompiled));
        }
        this._initLoaders();
        this.globals = globals();
        this.filters = {};
        this.tests = {};
        this.asyncFilters = [];
        this.extensions = {};
        this.extensionsList = [];
        lib._entries(filters).forEach(function(_ref) {
          var name2 = _ref[0], filter = _ref[1];
          return _this.addFilter(name2, filter);
        });
        lib._entries(tests).forEach(function(_ref2) {
          var name2 = _ref2[0], test2 = _ref2[1];
          return _this.addTest(name2, test2);
        });
      };
      _proto._initLoaders = function _initLoaders() {
        var _this2 = this;
        this.loaders.forEach(function(loader2) {
          loader2.cache = {};
          if (typeof loader2.on === "function") {
            loader2.on("update", function(name2, fullname) {
              loader2.cache[name2] = null;
              _this2.emit("update", name2, fullname, loader2);
            });
            loader2.on("load", function(name2, source) {
              _this2.emit("load", name2, source, loader2);
            });
          }
        });
      };
      _proto.invalidateCache = function invalidateCache() {
        this.loaders.forEach(function(loader2) {
          loader2.cache = {};
        });
      };
      _proto.addExtension = function addExtension(name2, extension) {
        extension.__name = name2;
        this.extensions[name2] = extension;
        this.extensionsList.push(extension);
        return this;
      };
      _proto.removeExtension = function removeExtension(name2) {
        var extension = this.getExtension(name2);
        if (!extension) {
          return;
        }
        this.extensionsList = lib.without(this.extensionsList, extension);
        delete this.extensions[name2];
      };
      _proto.getExtension = function getExtension(name2) {
        return this.extensions[name2];
      };
      _proto.hasExtension = function hasExtension(name2) {
        return !!this.extensions[name2];
      };
      _proto.addGlobal = function addGlobal(name2, value) {
        this.globals[name2] = value;
        return this;
      };
      _proto.getGlobal = function getGlobal(name2) {
        if (typeof this.globals[name2] === "undefined") {
          throw new Error("global not found: " + name2);
        }
        return this.globals[name2];
      };
      _proto.addFilter = function addFilter(name2, func, async) {
        var wrapped = func;
        if (async) {
          this.asyncFilters.push(name2);
        }
        this.filters[name2] = wrapped;
        return this;
      };
      _proto.getFilter = function getFilter(name2) {
        if (!this.filters[name2]) {
          throw new Error("filter not found: " + name2);
        }
        return this.filters[name2];
      };
      _proto.addTest = function addTest(name2, func) {
        this.tests[name2] = func;
        return this;
      };
      _proto.getTest = function getTest(name2) {
        if (!this.tests[name2]) {
          throw new Error("test not found: " + name2);
        }
        return this.tests[name2];
      };
      _proto.resolveTemplate = function resolveTemplate(loader2, parentName, filename) {
        var isRelative = loader2.isRelative && parentName ? loader2.isRelative(filename) : false;
        return isRelative && loader2.resolve ? loader2.resolve(parentName, filename) : filename;
      };
      _proto.getTemplate = function getTemplate(name2, eagerCompile, parentName, ignoreMissing, cb) {
        var _this3 = this;
        var that = this;
        var tmpl = null;
        if (name2 && name2.raw) {
          name2 = name2.raw;
        }
        if (lib.isFunction(parentName)) {
          cb = parentName;
          parentName = null;
          eagerCompile = eagerCompile || false;
        }
        if (lib.isFunction(eagerCompile)) {
          cb = eagerCompile;
          eagerCompile = false;
        }
        if (name2 instanceof Template) {
          tmpl = name2;
        } else if (typeof name2 !== "string") {
          throw new Error("template names must be a string: " + name2);
        } else {
          for (var i = 0; i < this.loaders.length; i++) {
            var loader2 = this.loaders[i];
            tmpl = loader2.cache[this.resolveTemplate(loader2, parentName, name2)];
            if (tmpl) {
              break;
            }
          }
        }
        if (tmpl) {
          if (eagerCompile) {
            tmpl.compile();
          }
          if (cb) {
            cb(null, tmpl);
            return void 0;
          } else {
            return tmpl;
          }
        }
        var syncResult;
        var createTemplate = function createTemplate2(err, info) {
          if (!info && !err && !ignoreMissing) {
            err = new Error("template not found: " + name2);
          }
          if (err) {
            if (cb) {
              cb(err);
              return;
            } else {
              throw err;
            }
          }
          var newTmpl;
          if (!info) {
            newTmpl = new Template(noopTmplSrc, _this3, "", eagerCompile);
          } else {
            newTmpl = new Template(info.src, _this3, info.path, eagerCompile);
            if (!info.noCache) {
              info.loader.cache[name2] = newTmpl;
            }
          }
          if (cb) {
            cb(null, newTmpl);
          } else {
            syncResult = newTmpl;
          }
        };
        lib.asyncIter(this.loaders, function(loader3, i2, next, done) {
          function handle3(err, src) {
            if (err) {
              done(err);
            } else if (src) {
              src.loader = loader3;
              done(null, src);
            } else {
              next();
            }
          }
          name2 = that.resolveTemplate(loader3, parentName, name2);
          if (loader3.async) {
            loader3.getSource(name2, handle3);
          } else {
            handle3(null, loader3.getSource(name2));
          }
        }, createTemplate);
        return syncResult;
      };
      _proto.express = function express(app) {
        return expressApp(this, app);
      };
      _proto.render = function render(name2, ctx, cb) {
        if (lib.isFunction(ctx)) {
          cb = ctx;
          ctx = null;
        }
        var syncResult = null;
        this.getTemplate(name2, function(err, tmpl) {
          if (err && cb) {
            callbackAsap(cb, err);
          } else if (err) {
            throw err;
          } else {
            syncResult = tmpl.render(ctx, cb);
          }
        });
        return syncResult;
      };
      _proto.renderString = function renderString(src, ctx, opts, cb) {
        if (lib.isFunction(opts)) {
          cb = opts;
          opts = {};
        }
        opts = opts || {};
        var tmpl = new Template(src, this, opts.path);
        return tmpl.render(ctx, cb);
      };
      _proto.waterfall = function waterfall(tasks, callback, forceAsync) {
        return _waterfall(tasks, callback, forceAsync);
      };
      return Environment2;
    })(EmitterObj);
    var Context = /* @__PURE__ */ (function(_Obj) {
      _inheritsLoose(Context2, _Obj);
      function Context2() {
        return _Obj.apply(this, arguments) || this;
      }
      var _proto2 = Context2.prototype;
      _proto2.init = function init2(ctx, blocks, env) {
        var _this4 = this;
        this.env = env || new Environment();
        this.ctx = lib.extend({}, ctx);
        this.blocks = {};
        this.exported = [];
        lib.keys(blocks).forEach(function(name2) {
          _this4.addBlock(name2, blocks[name2]);
        });
      };
      _proto2.lookup = function lookup2(name2) {
        if (name2 in this.env.globals && !(name2 in this.ctx)) {
          return this.env.globals[name2];
        } else {
          return this.ctx[name2];
        }
      };
      _proto2.setVariable = function setVariable(name2, val) {
        this.ctx[name2] = val;
      };
      _proto2.getVariables = function getVariables() {
        return this.ctx;
      };
      _proto2.addBlock = function addBlock(name2, block) {
        this.blocks[name2] = this.blocks[name2] || [];
        this.blocks[name2].push(block);
        return this;
      };
      _proto2.getBlock = function getBlock(name2) {
        if (!this.blocks[name2]) {
          throw new Error('unknown block "' + name2 + '"');
        }
        return this.blocks[name2][0];
      };
      _proto2.getSuper = function getSuper(env, name2, block, frame, runtime, cb) {
        var idx = lib.indexOf(this.blocks[name2] || [], block);
        var blk = this.blocks[name2][idx + 1];
        var context = this;
        if (idx === -1 || !blk) {
          throw new Error('no super block available for "' + name2 + '"');
        }
        blk(env, context, frame, runtime, cb);
      };
      _proto2.addExport = function addExport(name2) {
        this.exported.push(name2);
      };
      _proto2.getExported = function getExported() {
        var _this5 = this;
        var exported = {};
        this.exported.forEach(function(name2) {
          exported[name2] = _this5.ctx[name2];
        });
        return exported;
      };
      return Context2;
    })(Obj);
    var Template = /* @__PURE__ */ (function(_Obj2) {
      _inheritsLoose(Template2, _Obj2);
      function Template2() {
        return _Obj2.apply(this, arguments) || this;
      }
      var _proto3 = Template2.prototype;
      _proto3.init = function init2(src, env, path2, eagerCompile) {
        this.env = env || new Environment();
        if (lib.isObject(src)) {
          switch (src.type) {
            case "code":
              this.tmplProps = src.obj;
              break;
            case "string":
              this.tmplStr = src.obj;
              break;
            default:
              throw new Error("Unexpected template object type " + src.type + "; expected 'code', or 'string'");
          }
        } else if (lib.isString(src)) {
          this.tmplStr = src;
        } else {
          throw new Error("src must be a string or an object describing the source");
        }
        this.path = path2;
        if (eagerCompile) {
          try {
            this._compile();
          } catch (err) {
            throw lib._prettifyError(this.path, this.env.opts.dev, err);
          }
        } else {
          this.compiled = false;
        }
      };
      _proto3.render = function render(ctx, parentFrame, cb) {
        var _this6 = this;
        if (typeof ctx === "function") {
          cb = ctx;
          ctx = {};
        } else if (typeof parentFrame === "function") {
          cb = parentFrame;
          parentFrame = null;
        }
        var forceAsync = !parentFrame;
        try {
          this.compile();
        } catch (e) {
          var err = lib._prettifyError(this.path, this.env.opts.dev, e);
          if (cb) {
            return callbackAsap(cb, err);
          } else {
            throw err;
          }
        }
        var context = new Context(ctx || {}, this.blocks, this.env);
        var frame = parentFrame ? parentFrame.push(true) : new Frame();
        frame.topLevel = true;
        var syncResult = null;
        var didError = false;
        this.rootRenderFunc(this.env, context, frame, globalRuntime, function(err2, res) {
          if (didError && cb && typeof res !== "undefined") {
            return;
          }
          if (err2) {
            err2 = lib._prettifyError(_this6.path, _this6.env.opts.dev, err2);
            didError = true;
          }
          if (cb) {
            if (forceAsync) {
              callbackAsap(cb, err2, res);
            } else {
              cb(err2, res);
            }
          } else {
            if (err2) {
              throw err2;
            }
            syncResult = res;
          }
        });
        return syncResult;
      };
      _proto3.getExported = function getExported(ctx, parentFrame, cb) {
        if (typeof ctx === "function") {
          cb = ctx;
          ctx = {};
        }
        if (typeof parentFrame === "function") {
          cb = parentFrame;
          parentFrame = null;
        }
        try {
          this.compile();
        } catch (e) {
          if (cb) {
            return cb(e);
          } else {
            throw e;
          }
        }
        var frame = parentFrame ? parentFrame.push() : new Frame();
        frame.topLevel = true;
        var context = new Context(ctx || {}, this.blocks, this.env);
        this.rootRenderFunc(this.env, context, frame, globalRuntime, function(err) {
          if (err) {
            cb(err, null);
          } else {
            cb(null, context.getExported());
          }
        });
      };
      _proto3.compile = function compile2() {
        if (!this.compiled) {
          this._compile();
        }
      };
      _proto3._compile = function _compile() {
        var props;
        if (this.tmplProps) {
          props = this.tmplProps;
        } else {
          var source = compiler.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts);
          var func = new Function(source);
          props = func();
        }
        this.blocks = this._getBlocks(props);
        this.rootRenderFunc = props.root;
        this.compiled = true;
      };
      _proto3._getBlocks = function _getBlocks(props) {
        var blocks = {};
        lib.keys(props).forEach(function(k) {
          if (k.slice(0, 2) === "b_") {
            blocks[k.slice(2)] = props[k];
          }
        });
        return blocks;
      };
      return Template2;
    })(Obj);
    module.exports = {
      Environment,
      Template
    };
  }
});

// node_modules/nunjucks/src/precompile-global.js
var require_precompile_global = __commonJS({
  "node_modules/nunjucks/src/precompile-global.js"(exports, module) {
    "use strict";
    function precompileGlobal(templates, opts) {
      var out = "";
      opts = opts || {};
      for (var i = 0; i < templates.length; i++) {
        var name2 = JSON.stringify(templates[i].name);
        var template = templates[i].template;
        out += "(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})[" + name2 + "] = (function() {\n" + template + "\n})();\n";
        if (opts.asFunction) {
          out += "return function(ctx, cb) { return nunjucks.render(" + name2 + ", ctx, cb); }\n";
        }
        out += "})();\n";
      }
      return out;
    }
    module.exports = precompileGlobal;
  }
});

// node_modules/nunjucks/src/precompile.js
var require_precompile = __commonJS({
  "node_modules/nunjucks/src/precompile.js"(exports, module) {
    "use strict";
    var fs = __require("fs");
    var path2 = __require("path");
    var _require = require_lib3();
    var _prettifyError = _require._prettifyError;
    var compiler = require_compiler();
    var _require2 = require_environment();
    var Environment = _require2.Environment;
    var precompileGlobal = require_precompile_global();
    function match(filename, patterns) {
      if (!Array.isArray(patterns)) {
        return false;
      }
      return patterns.some(function(pattern) {
        return filename.match(pattern);
      });
    }
    function precompileString(str2, opts) {
      opts = opts || {};
      opts.isString = true;
      var env = opts.env || new Environment([]);
      var wrapper = opts.wrapper || precompileGlobal;
      if (!opts.name) {
        throw new Error('the "name" option is required when compiling a string');
      }
      return wrapper([_precompile(str2, opts.name, env)], opts);
    }
    function precompile(input, opts) {
      opts = opts || {};
      var env = opts.env || new Environment([]);
      var wrapper = opts.wrapper || precompileGlobal;
      if (opts.isString) {
        return precompileString(input, opts);
      }
      var pathStats = fs.existsSync(input) && fs.statSync(input);
      var precompiled = [];
      var templates = [];
      function addTemplates(dir) {
        fs.readdirSync(dir).forEach(function(file) {
          var filepath = path2.join(dir, file);
          var subpath = filepath.substr(path2.join(input, "/").length);
          var stat = fs.statSync(filepath);
          if (stat && stat.isDirectory()) {
            subpath += "/";
            if (!match(subpath, opts.exclude)) {
              addTemplates(filepath);
            }
          } else if (match(subpath, opts.include)) {
            templates.push(filepath);
          }
        });
      }
      if (pathStats.isFile()) {
        precompiled.push(_precompile(fs.readFileSync(input, "utf-8"), opts.name || input, env));
      } else if (pathStats.isDirectory()) {
        addTemplates(input);
        for (var i = 0; i < templates.length; i++) {
          var name2 = templates[i].replace(path2.join(input, "/"), "");
          try {
            precompiled.push(_precompile(fs.readFileSync(templates[i], "utf-8"), name2, env));
          } catch (e) {
            if (opts.force) {
              console.error(e);
            } else {
              throw e;
            }
          }
        }
      }
      return wrapper(precompiled, opts);
    }
    function _precompile(str2, name2, env) {
      env = env || new Environment([]);
      var asyncFilters = env.asyncFilters;
      var extensions = env.extensionsList;
      var template;
      name2 = name2.replace(/\\/g, "/");
      try {
        template = compiler.compile(str2, asyncFilters, extensions, name2, env.opts);
      } catch (err) {
        throw _prettifyError(name2, false, err);
      }
      return {
        name: name2,
        template
      };
    }
    module.exports = {
      precompile,
      precompileString
    };
  }
});

// node_modules/nunjucks/src/jinja-compat.js
var require_jinja_compat = __commonJS({
  "node_modules/nunjucks/src/jinja-compat.js"(exports, module) {
    "use strict";
    function installCompat() {
      "use strict";
      var runtime = this.runtime;
      var lib = this.lib;
      var Compiler = this.compiler.Compiler;
      var Parser = this.parser.Parser;
      var nodes = this.nodes;
      var lexer = this.lexer;
      var orig_contextOrFrameLookup = runtime.contextOrFrameLookup;
      var orig_memberLookup = runtime.memberLookup;
      var orig_Compiler_assertType;
      var orig_Parser_parseAggregate;
      if (Compiler) {
        orig_Compiler_assertType = Compiler.prototype.assertType;
      }
      if (Parser) {
        orig_Parser_parseAggregate = Parser.prototype.parseAggregate;
      }
      function uninstall() {
        runtime.contextOrFrameLookup = orig_contextOrFrameLookup;
        runtime.memberLookup = orig_memberLookup;
        if (Compiler) {
          Compiler.prototype.assertType = orig_Compiler_assertType;
        }
        if (Parser) {
          Parser.prototype.parseAggregate = orig_Parser_parseAggregate;
        }
      }
      runtime.contextOrFrameLookup = function contextOrFrameLookup(context, frame, key) {
        var val = orig_contextOrFrameLookup.apply(this, arguments);
        if (val !== void 0) {
          return val;
        }
        switch (key) {
          case "True":
            return true;
          case "False":
            return false;
          case "None":
            return null;
          default:
            return void 0;
        }
      };
      function getTokensState(tokens) {
        return {
          index: tokens.index,
          lineno: tokens.lineno,
          colno: tokens.colno
        };
      }
      if (process.env.BUILD_TYPE !== "SLIM" && nodes && Compiler && Parser) {
        var Slice = nodes.Node.extend("Slice", {
          fields: ["start", "stop", "step"],
          init: function init2(lineno, colno, start, stop, step) {
            start = start || new nodes.Literal(lineno, colno, null);
            stop = stop || new nodes.Literal(lineno, colno, null);
            step = step || new nodes.Literal(lineno, colno, 1);
            this.parent(lineno, colno, start, stop, step);
          }
        });
        Compiler.prototype.assertType = function assertType(node) {
          if (node instanceof Slice) {
            return;
          }
          orig_Compiler_assertType.apply(this, arguments);
        };
        Compiler.prototype.compileSlice = function compileSlice(node, frame) {
          this._emit("(");
          this._compileExpression(node.start, frame);
          this._emit("),(");
          this._compileExpression(node.stop, frame);
          this._emit("),(");
          this._compileExpression(node.step, frame);
          this._emit(")");
        };
        Parser.prototype.parseAggregate = function parseAggregate() {
          var _this = this;
          var origState = getTokensState(this.tokens);
          origState.colno--;
          origState.index--;
          try {
            return orig_Parser_parseAggregate.apply(this);
          } catch (e) {
            var errState = getTokensState(this.tokens);
            var rethrow = function rethrow2() {
              lib._assign(_this.tokens, errState);
              return e;
            };
            lib._assign(this.tokens, origState);
            this.peeked = false;
            var tok = this.peekToken();
            if (tok.type !== lexer.TOKEN_LEFT_BRACKET) {
              throw rethrow();
            } else {
              this.nextToken();
            }
            var node = new Slice(tok.lineno, tok.colno);
            var isSlice = false;
            for (var i = 0; i <= node.fields.length; i++) {
              if (this.skip(lexer.TOKEN_RIGHT_BRACKET)) {
                break;
              }
              if (i === node.fields.length) {
                if (isSlice) {
                  this.fail("parseSlice: too many slice components", tok.lineno, tok.colno);
                } else {
                  break;
                }
              }
              if (this.skip(lexer.TOKEN_COLON)) {
                isSlice = true;
              } else {
                var field = node.fields[i];
                node[field] = this.parseExpression();
                isSlice = this.skip(lexer.TOKEN_COLON) || isSlice;
              }
            }
            if (!isSlice) {
              throw rethrow();
            }
            return new nodes.Array(tok.lineno, tok.colno, [node]);
          }
        };
      }
      function sliceLookup(obj, start, stop, step) {
        obj = obj || [];
        if (start === null) {
          start = step < 0 ? obj.length - 1 : 0;
        }
        if (stop === null) {
          stop = step < 0 ? -1 : obj.length;
        } else if (stop < 0) {
          stop += obj.length;
        }
        if (start < 0) {
          start += obj.length;
        }
        var results = [];
        for (var i = start; ; i += step) {
          if (i < 0 || i > obj.length) {
            break;
          }
          if (step > 0 && i >= stop) {
            break;
          }
          if (step < 0 && i <= stop) {
            break;
          }
          results.push(runtime.memberLookup(obj, i));
        }
        return results;
      }
      function hasOwnProp(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      }
      var ARRAY_MEMBERS = {
        pop: function pop(index2) {
          if (index2 === void 0) {
            return this.pop();
          }
          if (index2 >= this.length || index2 < 0) {
            throw new Error("KeyError");
          }
          return this.splice(index2, 1);
        },
        append: function append(element) {
          return this.push(element);
        },
        remove: function remove2(element) {
          for (var i = 0; i < this.length; i++) {
            if (this[i] === element) {
              return this.splice(i, 1);
            }
          }
          throw new Error("ValueError");
        },
        count: function count2(element) {
          var count3 = 0;
          for (var i = 0; i < this.length; i++) {
            if (this[i] === element) {
              count3++;
            }
          }
          return count3;
        },
        index: function index2(element) {
          var i;
          if ((i = this.indexOf(element)) === -1) {
            throw new Error("ValueError");
          }
          return i;
        },
        find: function find(element) {
          return this.indexOf(element);
        },
        insert: function insert(index2, elem) {
          return this.splice(index2, 0, elem);
        }
      };
      var OBJECT_MEMBERS = {
        items: function items() {
          return lib._entries(this);
        },
        values: function values() {
          return lib._values(this);
        },
        keys: function keys() {
          return lib.keys(this);
        },
        get: function get(key, def) {
          var output = this[key];
          if (output === void 0) {
            output = def;
          }
          return output;
        },
        has_key: function has_key(key) {
          return hasOwnProp(this, key);
        },
        pop: function pop(key, def) {
          var output = this[key];
          if (output === void 0 && def !== void 0) {
            output = def;
          } else if (output === void 0) {
            throw new Error("KeyError");
          } else {
            delete this[key];
          }
          return output;
        },
        popitem: function popitem() {
          var keys = lib.keys(this);
          if (!keys.length) {
            throw new Error("KeyError");
          }
          var k = keys[0];
          var val = this[k];
          delete this[k];
          return [k, val];
        },
        setdefault: function setdefault(key, def) {
          if (def === void 0) {
            def = null;
          }
          if (!(key in this)) {
            this[key] = def;
          }
          return this[key];
        },
        update: function update(kwargs) {
          lib._assign(this, kwargs);
          return null;
        }
      };
      OBJECT_MEMBERS.iteritems = OBJECT_MEMBERS.items;
      OBJECT_MEMBERS.itervalues = OBJECT_MEMBERS.values;
      OBJECT_MEMBERS.iterkeys = OBJECT_MEMBERS.keys;
      runtime.memberLookup = function memberLookup(obj, val, autoescape) {
        if (arguments.length === 4) {
          return sliceLookup.apply(this, arguments);
        }
        obj = obj || {};
        if (lib.isArray(obj) && hasOwnProp(ARRAY_MEMBERS, val)) {
          return ARRAY_MEMBERS[val].bind(obj);
        }
        if (lib.isObject(obj) && hasOwnProp(OBJECT_MEMBERS, val)) {
          return OBJECT_MEMBERS[val].bind(obj);
        }
        return orig_memberLookup.apply(this, arguments);
      };
      return uninstall;
    }
    module.exports = installCompat;
  }
});

// node_modules/nunjucks/index.js
var require_nunjucks = __commonJS({
  "node_modules/nunjucks/index.js"(exports, module) {
    "use strict";
    var lib = require_lib3();
    var _require = require_environment();
    var Environment = _require.Environment;
    var Template = _require.Template;
    var Loader = require_loader();
    var loaders = require_loaders();
    var precompile = require_precompile();
    var compiler = require_compiler();
    var parser2 = require_parser();
    var lexer = require_lexer();
    var runtime = require_runtime();
    var nodes = require_nodes();
    var installJinjaCompat = require_jinja_compat();
    var e;
    function configure(templatesPath, opts) {
      opts = opts || {};
      if (lib.isObject(templatesPath)) {
        opts = templatesPath;
        templatesPath = null;
      }
      var TemplateLoader;
      if (loaders.FileSystemLoader) {
        TemplateLoader = new loaders.FileSystemLoader(templatesPath, {
          watch: opts.watch,
          noCache: opts.noCache
        });
      } else if (loaders.WebLoader) {
        TemplateLoader = new loaders.WebLoader(templatesPath, {
          useCache: opts.web && opts.web.useCache,
          async: opts.web && opts.web.async
        });
      }
      e = new Environment(TemplateLoader, opts);
      if (opts && opts.express) {
        e.express(opts.express);
      }
      return e;
    }
    module.exports = {
      Environment,
      Template,
      Loader,
      FileSystemLoader: loaders.FileSystemLoader,
      NodeResolveLoader: loaders.NodeResolveLoader,
      PrecompiledLoader: loaders.PrecompiledLoader,
      WebLoader: loaders.WebLoader,
      compiler,
      parser: parser2,
      lexer,
      runtime,
      lib,
      nodes,
      installJinjaCompat,
      configure,
      reset: function reset() {
        e = void 0;
      },
      compile: function compile2(src, env, path2, eagerCompile) {
        if (!e) {
          configure();
        }
        return new Template(src, env, path2, eagerCompile);
      },
      render: function render(name2, ctx, cb) {
        if (!e) {
          configure();
        }
        return e.render(name2, ctx, cb);
      },
      renderString: function renderString(src, ctx, cb) {
        if (!e) {
          configure();
        }
        return e.renderString(src, ctx, cb);
      },
      precompile: precompile ? precompile.precompile : void 0,
      precompileString: precompile ? precompile.precompileString : void 0
    };
  }
});

// src/index.mjs
import { existsSync, readFileSync } from "fs";
import path from "path";

// node_modules/myst-parser/dist/plugins.js
var import_markdown_it_front_matter = __toESM(require_markdown_it_front_matter(), 1);

// node_modules/markdown-it-footnote/index.mjs
function render_footnote_anchor_name(tokens, idx, options, env) {
  const n = Number(tokens[idx].meta.id + 1).toString();
  let prefix = "";
  if (typeof env.docId === "string") prefix = `-${env.docId}-`;
  return prefix + n;
}
function render_footnote_caption(tokens, idx) {
  let n = Number(tokens[idx].meta.id + 1).toString();
  if (tokens[idx].meta.subId > 0) n += `:${tokens[idx].meta.subId}`;
  return `[${n}]`;
}
function render_footnote_ref(tokens, idx, options, env, slf) {
  const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
  const caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
  let refid = id;
  if (tokens[idx].meta.subId > 0) refid += `:${tokens[idx].meta.subId}`;
  return `<sup class="footnote-ref"><a href="#fn${id}" id="fnref${refid}">${caption}</a></sup>`;
}
function render_footnote_block_open(tokens, idx, options) {
  return (options.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n') + '<section class="footnotes">\n<ol class="footnotes-list">\n';
}
function render_footnote_block_close() {
  return "</ol>\n</section>\n";
}
function render_footnote_open(tokens, idx, options, env, slf) {
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
  if (tokens[idx].meta.subId > 0) id += `:${tokens[idx].meta.subId}`;
  return `<li id="fn${id}" class="footnote-item">`;
}
function render_footnote_close() {
  return "</li>\n";
}
function render_footnote_anchor(tokens, idx, options, env, slf) {
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
  if (tokens[idx].meta.subId > 0) id += `:${tokens[idx].meta.subId}`;
  return ` <a href="#fnref${id}" class="footnote-backref">\u21A9\uFE0E</a>`;
}
function footnote_plugin(md) {
  const parseLinkLabel = md.helpers.parseLinkLabel;
  const isSpace = md.utils.isSpace;
  md.renderer.rules.footnote_ref = render_footnote_ref;
  md.renderer.rules.footnote_block_open = render_footnote_block_open;
  md.renderer.rules.footnote_block_close = render_footnote_block_close;
  md.renderer.rules.footnote_open = render_footnote_open;
  md.renderer.rules.footnote_close = render_footnote_close;
  md.renderer.rules.footnote_anchor = render_footnote_anchor;
  md.renderer.rules.footnote_caption = render_footnote_caption;
  md.renderer.rules.footnote_anchor_name = render_footnote_anchor_name;
  function footnote_def(state, startLine, endLine, silent) {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    if (start + 4 > max) return false;
    if (state.src.charCodeAt(start) !== 91) return false;
    if (state.src.charCodeAt(start + 1) !== 94) return false;
    let pos;
    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 32) return false;
      if (state.src.charCodeAt(pos) === 93) {
        break;
      }
    }
    if (pos === start + 2) return false;
    if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 58) return false;
    if (silent) return true;
    pos++;
    if (!state.env.footnotes) state.env.footnotes = {};
    if (!state.env.footnotes.refs) state.env.footnotes.refs = {};
    const label = state.src.slice(start + 2, pos - 2);
    state.env.footnotes.refs[`:${label}`] = -1;
    const token_fref_o = new state.Token("footnote_reference_open", "", 1);
    token_fref_o.meta = { label };
    token_fref_o.level = state.level++;
    state.tokens.push(token_fref_o);
    const oldBMark = state.bMarks[startLine];
    const oldTShift = state.tShift[startLine];
    const oldSCount = state.sCount[startLine];
    const oldParentType = state.parentType;
    const posAfterColon = pos;
    const initial = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);
    let offset = initial;
    while (pos < max) {
      const ch = state.src.charCodeAt(pos);
      if (isSpace(ch)) {
        if (ch === 9) {
          offset += 4 - offset % 4;
        } else {
          offset++;
        }
      } else {
        break;
      }
      pos++;
    }
    state.tShift[startLine] = pos - posAfterColon;
    state.sCount[startLine] = offset - initial;
    state.bMarks[startLine] = posAfterColon;
    state.blkIndent += 4;
    state.parentType = "footnote";
    if (state.sCount[startLine] < state.blkIndent) {
      state.sCount[startLine] += state.blkIndent;
    }
    state.md.block.tokenize(state, startLine, endLine, true);
    state.parentType = oldParentType;
    state.blkIndent -= 4;
    state.tShift[startLine] = oldTShift;
    state.sCount[startLine] = oldSCount;
    state.bMarks[startLine] = oldBMark;
    const token_fref_c = new state.Token("footnote_reference_close", "", -1);
    token_fref_c.level = --state.level;
    state.tokens.push(token_fref_c);
    return true;
  }
  function footnote_inline(state, silent) {
    const max = state.posMax;
    const start = state.pos;
    if (start + 2 >= max) return false;
    if (state.src.charCodeAt(start) !== 94) return false;
    if (state.src.charCodeAt(start + 1) !== 91) return false;
    const labelStart = start + 2;
    const labelEnd = parseLinkLabel(state, start + 1);
    if (labelEnd < 0) return false;
    if (!silent) {
      if (!state.env.footnotes) state.env.footnotes = {};
      if (!state.env.footnotes.list) state.env.footnotes.list = [];
      const footnoteId = state.env.footnotes.list.length;
      const tokens = [];
      state.md.inline.parse(
        state.src.slice(labelStart, labelEnd),
        state.md,
        state.env,
        tokens
      );
      const token = state.push("footnote_ref", "", 0);
      token.meta = { id: footnoteId };
      state.env.footnotes.list[footnoteId] = {
        content: state.src.slice(labelStart, labelEnd),
        tokens
      };
    }
    state.pos = labelEnd + 1;
    state.posMax = max;
    return true;
  }
  function footnote_ref(state, silent) {
    const max = state.posMax;
    const start = state.pos;
    if (start + 3 > max) return false;
    if (!state.env.footnotes || !state.env.footnotes.refs) return false;
    if (state.src.charCodeAt(start) !== 91) return false;
    if (state.src.charCodeAt(start + 1) !== 94) return false;
    let pos;
    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 32) return false;
      if (state.src.charCodeAt(pos) === 10) return false;
      if (state.src.charCodeAt(pos) === 93) {
        break;
      }
    }
    if (pos === start + 2) return false;
    if (pos >= max) return false;
    pos++;
    const label = state.src.slice(start + 2, pos - 1);
    if (typeof state.env.footnotes.refs[`:${label}`] === "undefined") return false;
    if (!silent) {
      if (!state.env.footnotes.list) state.env.footnotes.list = [];
      let footnoteId;
      if (state.env.footnotes.refs[`:${label}`] < 0) {
        footnoteId = state.env.footnotes.list.length;
        state.env.footnotes.list[footnoteId] = { label, count: 0 };
        state.env.footnotes.refs[`:${label}`] = footnoteId;
      } else {
        footnoteId = state.env.footnotes.refs[`:${label}`];
      }
      const footnoteSubId = state.env.footnotes.list[footnoteId].count;
      state.env.footnotes.list[footnoteId].count++;
      const token = state.push("footnote_ref", "", 0);
      token.meta = { id: footnoteId, subId: footnoteSubId, label };
    }
    state.pos = pos;
    state.posMax = max;
    return true;
  }
  function footnote_tail(state) {
    let tokens;
    let current;
    let currentLabel;
    let insideRef = false;
    const refTokens = {};
    if (!state.env.footnotes) {
      return;
    }
    state.tokens = state.tokens.filter(function(tok) {
      if (tok.type === "footnote_reference_open") {
        insideRef = true;
        current = [];
        currentLabel = tok.meta.label;
        return false;
      }
      if (tok.type === "footnote_reference_close") {
        insideRef = false;
        refTokens[":" + currentLabel] = current;
        return false;
      }
      if (insideRef) {
        current.push(tok);
      }
      return !insideRef;
    });
    if (!state.env.footnotes.list) {
      return;
    }
    const list = state.env.footnotes.list;
    state.tokens.push(new state.Token("footnote_block_open", "", 1));
    for (let i = 0, l = list.length; i < l; i++) {
      const token_fo = new state.Token("footnote_open", "", 1);
      token_fo.meta = { id: i, label: list[i].label };
      state.tokens.push(token_fo);
      if (list[i].tokens) {
        tokens = [];
        const token_po = new state.Token("paragraph_open", "p", 1);
        token_po.block = true;
        tokens.push(token_po);
        const token_i = new state.Token("inline", "", 0);
        token_i.children = list[i].tokens;
        token_i.content = list[i].content;
        tokens.push(token_i);
        const token_pc = new state.Token("paragraph_close", "p", -1);
        token_pc.block = true;
        tokens.push(token_pc);
      } else if (list[i].label) {
        tokens = refTokens[`:${list[i].label}`];
      }
      if (tokens) state.tokens = state.tokens.concat(tokens);
      let lastParagraph;
      if (state.tokens[state.tokens.length - 1].type === "paragraph_close") {
        lastParagraph = state.tokens.pop();
      } else {
        lastParagraph = null;
      }
      const t = list[i].count > 0 ? list[i].count : 1;
      for (let j = 0; j < t; j++) {
        const token_a = new state.Token("footnote_anchor", "", 0);
        token_a.meta = { id: i, subId: j, label: list[i].label };
        state.tokens.push(token_a);
      }
      if (lastParagraph) {
        state.tokens.push(lastParagraph);
      }
      state.tokens.push(new state.Token("footnote_close", "", -1));
    }
    state.tokens.push(new state.Token("footnote_block_close", "", -1));
  }
  md.block.ruler.before("reference", "footnote_def", footnote_def, { alt: ["paragraph", "reference"] });
  md.inline.ruler.after("image", "footnote_inline", footnote_inline);
  md.inline.ruler.after("footnote_inline", "footnote_ref", footnote_ref);
  md.core.ruler.after("inline", "footnote_tail", footnote_tail);
}

// node_modules/myst-parser/dist/plugins.js
var import_markdown_it_task_lists = __toESM(require_markdown_it_task_lists(), 1);
var import_markdown_it_deflist = __toESM(require_markdown_it_deflist(), 1);

// node_modules/markdown-it-myst/dist/nestedParse.js
function nestedCoreParse(md, pluginRuleName, src, env, initLine, includeRule = true, inline) {
  const tempDisabledCore = [];
  for (const rule of [...md.core.ruler.__rules__].reverse()) {
    if (rule.name === pluginRuleName) {
      if (!includeRule) {
        tempDisabledCore.push(rule.name);
      }
      break;
    }
    if (rule.name) {
      tempDisabledCore.push(rule.name);
    }
  }
  md.core.ruler.disable(tempDisabledCore);
  const blockRules = md.block.ruler.__rules__.map(({ name: name2 }) => name2).filter((n) => n !== "paragraph");
  if (inline)
    md.block.ruler.disable(blockRules);
  let tokens = [];
  try {
    tokens = md.parse(src, env);
  } finally {
    md.core.ruler.enable(tempDisabledCore);
    if (inline)
      md.block.ruler.enable(blockRules);
  }
  for (const token of tokens) {
    token.map = token.map !== null ? [token.map[0] + initLine, token.map[1] + initLine] : token.map;
  }
  if (!inline)
    return tokens;
  if (tokens.length === 3 && tokens[0].type === "paragraph_open" && tokens[1].type === "inline" && tokens[2].type === "paragraph_close") {
    return [tokens[1]];
  }
  if (tokens[0].type === "paragraph_open" && tokens[1].type === "inline" && tokens[2].type === "paragraph_close" && tokens[3].type === "footnote_block_open" && tokens[tokens.length - 1].type === "footnote_block_close") {
    return [tokens[1]];
  }
  return tokens;
}
function nestedPartToTokens(partName, part, lineNumber, state, pluginRuleName, inline) {
  if (!part)
    return [];
  const openToken = new state.Token(`${partName}_open`, "", 1);
  openToken.content = part;
  openToken.hidden = true;
  openToken.map = [lineNumber, lineNumber];
  const nestedTokens = nestedCoreParse(state.md, pluginRuleName, part, state.env, lineNumber, true, inline);
  const closeToken = new state.Token(`${partName}_close`, "", -1);
  closeToken.hidden = true;
  return [openToken, ...nestedTokens, closeToken];
}

// node_modules/markdown-it-myst/dist/inlineAttributes.js
function tokenizeInlineAttributes(header) {
  const pattern = /(\.[A-Za-z0-9_-]+(?:\s|$))|(#[A-Za-z0-9_-]+(?:\s|$))|([a-zA-Z0-9_-]+)="((?:\\.|[^\\"])*)"(?:\s|$)|([a-zA-Z0-9_-]+)=([^\s"']+)(?:\s|$)|([A-Za-z0-9_:-]+)(?:\s|$)|([^\s]+)/g;
  const results = [];
  let match;
  while ((match = pattern.exec(header)) !== null) {
    const [, classGroup, idGroup, attrKeyQuoted, attrValQuoted, attrKeyUnquoted, attrValUnquoted, bareGroup, unknownGroup] = match;
    if (classGroup) {
      results.push({ kind: "class", value: classGroup.slice(1).trim() });
    } else if (idGroup) {
      results.push({ kind: "id", value: idGroup.slice(1).trim() });
    } else if (attrKeyQuoted && attrValQuoted !== void 0) {
      const unescaped = attrValQuoted.replace(/\\"/g, '"').trim();
      results.push({ kind: "attr", key: attrKeyQuoted, value: unescaped });
    } else if (attrKeyUnquoted && attrValUnquoted !== void 0) {
      results.push({ kind: "attr", key: attrKeyUnquoted, value: attrValUnquoted.trim() });
    } else if (bareGroup) {
      results.push({ kind: "bare", value: bareGroup.trim() });
    } else if (unknownGroup) {
      results.push({ kind: "unknown", value: unknownGroup.trim() });
    }
  }
  return results;
}
function inlineOptionsToTokens(header, lineNumber, state) {
  const tokens = tokenizeInlineAttributes(header);
  if (tokens.length === 0) {
    throw new Error("No inline tokens found");
  }
  let name2 = void 0;
  if (tokens[0].kind === "bare") {
    name2 = tokens[0].value;
    tokens.shift();
  }
  if (tokens.filter(({ kind }) => kind === "id").length > 1) {
    throw new Error("Cannot have more than one ID defined");
  }
  if (tokens.some(({ kind }) => kind === "bare")) {
    throw new Error("No additional bare tokens allowed after the first token");
  }
  const markdownItTokens = tokens.map((opt) => {
    if (opt.kind === "id" && /^[0-9]/.test(opt.value)) {
      throw new Error(`ID cannot start with a number: "${opt.value}"`);
    }
    if (opt.kind === "unknown") {
      if (opt.value.match(/\.[A-Za-z0-9_\-.]+/)) {
        throw new Error(`Unknown token "${opt.value}". Classes must be separated by spaces, try "${opt.value.replace(/\./g, " .").trim()}"`);
      }
      throw new Error(`Unknown token "${opt.value}"`);
    }
    if (opt.kind === "class" || opt.kind === "id" || opt.kind === "bare") {
      const classTokens = [
        new state.Token("myst_option_open", "", 1),
        new state.Token("myst_option_close", "", -1)
      ];
      classTokens[0].info = opt.kind;
      classTokens[0].content = opt.kind === "class" ? `.${opt.value}` : opt.kind === "id" ? `#${opt.value}` : opt.value;
      classTokens[0].meta = { location: "inline", ...opt };
      return classTokens;
    }
    const optTokens = nestedPartToTokens("myst_option", opt.value, lineNumber, state, "run_roles", true);
    if (optTokens.length) {
      optTokens[0].info = opt.key;
      optTokens[0].content = opt.value;
      optTokens[0].meta = { location: "inline", ...opt };
    }
    return optTokens;
  });
  const options = tokens.map((t) => [
    t.kind === "attr" ? t.key : t.kind === "id" ? "label" : t.kind,
    t.value
  ]);
  return { name: name2, tokens: markdownItTokens.flat(), options };
}

// node_modules/markdown-it-myst/dist/roles.js
function rolePlugin(md) {
  md.inline.ruler.before("backticks", "parse_roles", roleRule);
  md.core.ruler.after("text_join", "run_roles", runRoles);
  md.renderer.rules["role"] = (tokens, idx) => {
    const token = tokens[idx];
    return `<span class="role-unhandled"><mark>${token.meta.name}</mark><code>${token.content}</code></span>`;
  };
  md.renderer.rules["role_error"] = (tokens, idx) => {
    const token = tokens[idx];
    let content = "";
    if (token.content) {
      content = `
---
${token.content}`;
    }
    return `<aside class="role-error">
<header><mark>${token.info}</mark><code> ${token.meta.arg}</code></header>
<pre>${token.meta.error_name}:
${token.meta.error_message}
${content}</pre></aside>
`;
  };
}
var _x;
try {
  _x = new RegExp("^\\{\\s*([^}]+?)\\s*\\}(`+)(?!`)(.+?)(?<!`)\\2(?!`)");
} catch (err) {
  _x = /^\{\s*([^}]+?)\s*\}(`+)(?!`)(.+?)\2(?!`)/;
}
var ROLE_PATTERN = _x;
function roleRule(state, silent) {
  if (state.src.charCodeAt(state.pos - 1) === 92) {
    return false;
  }
  const match = ROLE_PATTERN.exec(state.src.slice(state.pos));
  if (match == null)
    return false;
  const [str2, header, , content] = match;
  if (!silent) {
    const token = state.push("role", "", 0);
    token.info = header;
    token.content = content;
    token.col = [state.pos, state.pos + str2.length];
  }
  state.pos += str2.length;
  return true;
}
function runRoles(state) {
  var _a, _b, _c;
  for (const token of state.tokens) {
    if (token.type === "inline" && token.children) {
      const childTokens = [];
      for (const child of token.children) {
        if (child.type === "role") {
          try {
            const { map: map2 } = token;
            const { content, col } = child;
            const { name: name2, tokens: optTokens } = inlineOptionsToTokens(child.info, (_a = map2 === null || map2 === void 0 ? void 0 : map2[0]) !== null && _a !== void 0 ? _a : 0, state);
            if (!name2) {
              throw new Error('A role name is required, for example, "{sub}`2`"');
            }
            const roleOpen = new state.Token("parsed_role_open", "", 1);
            roleOpen.content = content;
            roleOpen.hidden = true;
            roleOpen.info = name2;
            roleOpen.meta = { header: child.info };
            roleOpen.block = false;
            roleOpen.map = map2;
            roleOpen.col = col;
            const contentTokens = roleContentToTokens(content, (_b = map2 === null || map2 === void 0 ? void 0 : map2[0]) !== null && _b !== void 0 ? _b : 0, state);
            const roleClose = new state.Token("parsed_role_close", "", -1);
            roleClose.block = false;
            roleClose.hidden = true;
            roleOpen.info = name2;
            const newTokens = [roleOpen, ...optTokens, ...contentTokens, roleClose];
            childTokens.push(...newTokens);
          } catch (err) {
            const errorToken = new state.Token("role_error", "", 0);
            errorToken.content = child.content;
            errorToken.info = child.info;
            errorToken.meta = (_c = child.meta) !== null && _c !== void 0 ? _c : {};
            errorToken.map = child.map;
            errorToken.meta.error_message = err.message;
            errorToken.meta.error_name = err.name;
            childTokens.push(errorToken);
          }
        } else {
          childTokens.push(child);
        }
      }
      token.children = childTokens;
    }
  }
  return true;
}
function roleContentToTokens(content, lineNumber, state) {
  return nestedPartToTokens("role_body", content, lineNumber, state, "run_roles", true);
}

// node_modules/js-yaml/dist/js-yaml.mjs
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index2, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index2 = 0, length = sourceKeys.length; index2 < length; index2 += 1) {
      key = sourceKeys[index2];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count2) {
  var result = "", cycle;
  for (cycle = 0; cycle < count2; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark) return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ": " + formatError(this, compact);
};
var exception = YAMLException$1;
function getLine(buffer2, lineStart, lineEnd, position2, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position2 - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position2 - maxHalfLength + head.length;
  }
  if (lineEnd - position2 > maxHalfLength) {
    tail = " ...";
    lineEnd = position2 + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer2.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
    pos: position2 - lineStart + head.length
    // relative position
  };
}
function padStart(string, max) {
  return common.repeat(" ", max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== "number") options.indent = 1;
  if (typeof options.linesBefore !== "number") options.linesBefore = 3;
  if (typeof options.linesAfter !== "number") options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var YAML_NODE_KINDS = [
  "scalar",
  "sequence",
  "mapping"
];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name2) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name2) === -1) {
      throw new exception('Unknown option "' + name2 + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;
function compileList(schema2, name2) {
  var result = [];
  schema2[name2].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index2, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index2 = 0, length = arguments.length; index2 < length; index2 += 1) {
    arguments[index2].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type$1.loadKind && type$1.loadKind !== "scalar") {
      throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type$1.multi) {
      throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var seq = new type("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var map = new type("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [
    str,
    seq,
    map
  ]
});
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
var bool = new type("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object) {
      return object ? "true" : "false";
    },
    uppercase: function(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase: function(object) {
      return object ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length, index2 = 0, hasDigits = false, ch;
  if (!max) return false;
  ch = data[index2];
  if (ch === "-" || ch === "+") {
    ch = data[++index2];
  }
  if (ch === "0") {
    if (index2 + 1 === max) return true;
    ch = data[++index2];
    if (ch === "b") {
      index2++;
      for (; index2 < max; index2++) {
        ch = data[index2];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index2++;
      for (; index2 < max; index2++) {
        ch = data[index2];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index2))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index2++;
      for (; index2 < max; index2++) {
        ch = data[index2];
        if (ch === "_") continue;
        if (!isOctCode(data.charCodeAt(index2))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_") return false;
  for (; index2 < max; index2++) {
    ch = data[index2];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index2))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
}
var int = new type("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
var float = new type("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});
var core = json;
var YAML_DATE_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
);
var YAML_TIMESTAMP_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-") delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
var timestamp = new type("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64) continue;
    if (code < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new type("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [], index2, length, pair, pairKey, pairHasKey, object = data;
  for (index2 = 0, length = object.length; index2 < length; index2 += 1) {
    pair = object[index2];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]") return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index2, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index2 = 0, length = object.length; index2 < length; index2 += 1) {
    pair = object[index2];
    if (_toString$1.call(pair) !== "[object Object]") return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index2] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index2, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index2 = 0, length = object.length; index2 < length; index2 += 1) {
    pair = object[index2];
    keys = Object.keys(pair);
    result[index2] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode(
    (c - 65536 >> 10) + 55296,
    (c - 65536 & 1023) + 56320
  );
}
function setProperty(object, key, value) {
  if (key === "__proto__") {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
  } else {
    object[key] = value;
  }
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
var i;
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name2, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state, "YAML directive accepts exactly one argument");
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, "ill-formed argument of the YAML directive");
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state, name2, args) {
    var handle3, prefix;
    if (args.length !== 2) {
      throwError(state, "TAG directive accepts exactly two arguments");
    }
    handle3 = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle3)) {
      throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle3)) {
      throwError(state, 'there is a previously declared suffix for "' + handle3 + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, "tag prefix is malformed: " + prefix);
    }
    state.tagMap[handle3] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index2, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index2 = 0, quantity = sourceKeys.length; index2 < quantity; index2 += 1) {
    key = sourceKeys[index2];
    if (!_hasOwnProperty$1.call(destination, key)) {
      setProperty(destination, key, source[key]);
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index2, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index2 = 0, quantity = keyNode.length; index2 < quantity; index2 += 1) {
      if (Array.isArray(keyNode[index2])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index2]) === "[object Object]") {
        keyNode[index2] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index2 = 0, quantity = valueNode.length; index2 < quantity; index2 += 1) {
        mergeMappings(state, _result, valueNode[index2], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    setProperty(_result, keyNode, valueNode);
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count2) {
  if (count2 === 1) {
    state.result += " ";
  } else if (count2 > 1) {
    state.result += common.repeat("\n", count2 - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat("\n", emptyLines);
      }
    } else {
      state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33) return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38) return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = /* @__PURE__ */ Object.create(null);
  state.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index2 = 0, length = documents.length; index2 < length; index2 += 1) {
    iterator(documents[index2]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index2, length, tag, style, type2;
  if (map2 === null) return {};
  result = {};
  keys = Object.keys(map2);
  for (index2 = 0, length = keys.length; index2 < length; index2 += 1) {
    tag = keys[index2];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle3, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle3 = "x";
    length = 2;
  } else if (character <= 65535) {
    handle3 = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle3 = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle3 + common.repeat("0", length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1;
var QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position2 = 0, next = -1, result = "", line, length = string.length;
  while (position2 < length) {
    next = string.indexOf("\n", position2);
    if (next === -1) {
      line = string.slice(position2);
      position2 = length;
    } else {
      line = string.slice(position2, next + 1);
      position2 = next + 1;
    }
    if (line.length && line !== "\n") result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index2, length, type2;
  for (index2 = 0, length = state.implicitTypes.length; index2 < length; index2 += 1) {
    type2 = state.implicitTypes[index2];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    (inblock ? (
      // c = flow-in
      cIsNsCharOrWhitespace
    ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
  );
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1;
var STYLE_SINGLE = 2;
var STYLE_LITERAL = 3;
var STYLE_FOLDED = 4;
var STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(
      string,
      singleLineOnly,
      state.indent,
      lineWidth,
      testAmbiguity,
      state.quotingType,
      state.forceQuotes && !iskey,
      inblock
    )) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  })();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = (function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  })();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ") return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index2, length, value;
  for (index2 = 0, length = object.length; index2 < length; index2 += 1) {
    value = object[index2];
    if (state.replacer) {
      value = state.replacer.call(object, String(index2), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index2, length, value;
  for (index2 = 0, length = object.length; index2 < length; index2 += 1) {
    value = object[index2];
    if (state.replacer) {
      value = state.replacer.call(object, String(index2), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index2, length, objectKey, objectValue, pairBuffer;
  for (index2 = 0, length = objectKeyList.length; index2 < length; index2 += 1) {
    pairBuffer = "";
    if (_result !== "") pairBuffer += ", ";
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index2];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024) pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index2, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index2 = 0, length = objectKeyList.length; index2 < length; index2 += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index2];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index2, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index2 = 0, length = typeList.length; index2 < length; index2 += 1) {
    type2 = typeList[index2];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(
        state.tag[0] === "!" ? state.tag.slice(1) : state.tag
      ).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index2, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index2 = 0, length = duplicatesIndexes.length; index2 < length; index2 += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index2]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index2, length;
  if (object !== null && typeof object === "object") {
    index2 = objects.indexOf(object);
    if (index2 !== -1) {
      if (duplicatesIndexes.indexOf(index2) === -1) {
        duplicatesIndexes.push(index2);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index2 = 0, length = object.length; index2 < length; index2 += 1) {
          inspectNode(object[index2], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index2 = 0, length = objectKeyList.length; index2 < length; index2 += 1) {
          inspectNode(object[objectKeyList[index2]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
  return "";
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from2, to) {
  return function() {
    throw new Error("Function yaml." + from2 + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
var Type = type;
var Schema = schema;
var FAILSAFE_SCHEMA = failsafe;
var JSON_SCHEMA = json;
var CORE_SCHEMA = core;
var DEFAULT_SCHEMA = _default;
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var YAMLException = exception;
var types = {
  binary,
  float,
  map,
  null: _null,
  pairs,
  set,
  timestamp,
  bool,
  int,
  merge,
  omap,
  seq,
  str
};
var safeLoad = renamed("safeLoad", "load");
var safeLoadAll = renamed("safeLoadAll", "loadAll");
var safeDump = renamed("safeDump", "dump");
var jsYaml = {
  Type,
  Schema,
  FAILSAFE_SCHEMA,
  JSON_SCHEMA,
  CORE_SCHEMA,
  DEFAULT_SCHEMA,
  load,
  loadAll,
  dump,
  YAMLException,
  types,
  safeLoad,
  safeLoadAll,
  safeDump
};

// node_modules/markdown-it-myst/dist/utils.js
function stateWarn(state, message) {
  const vfile = state.env.vfile;
  if (!vfile)
    return;
  return vfile.message(message);
}
function stateError(state, message) {
  const out = stateWarn(state, message);
  if (out)
    out.fatal = true;
  return out;
}

// node_modules/markdown-it-myst/dist/directives.js
var COLON_OPTION_REGEX = /^:(?<option>[^:\s]+?):(\s*(?<value>.*)){0,1}\s*$/;
function computeBlockTightness(src, map2) {
  const lines = src.split("\n");
  const tightBefore = typeof (map2 === null || map2 === void 0 ? void 0 : map2[0]) === "number" && map2[0] > 0 ? lines[map2[0] - 1].trim() !== "" : false;
  const tightAfter = typeof (map2 === null || map2 === void 0 ? void 0 : map2[1]) === "number" && map2[1] < lines.length ? lines[map2[1]].trim() !== "" : false;
  const tight = tightBefore && tightAfter ? true : tightBefore ? "before" : tightAfter ? "after" : false;
  return tight;
}
function replaceFences(state) {
  for (const token of state.tokens) {
    if (token.type === "fence" || token.type === "colon_fence") {
      const match = token.info.match(/^\s*\{\s*([^}]+)\s*\}\s*(.*)$/);
      if (match) {
        token.type = "directive";
        token.info = match[1].trim();
        token.meta = { arg: match[2] };
      }
    }
  }
  return true;
}
function runDirectives(state) {
  var _a, _b;
  const finalTokens = [];
  for (const token of state.tokens) {
    if (token.type === "directive") {
      try {
        const { info, map: map2 } = token;
        const arg = ((_a = token.meta.arg) === null || _a === void 0 ? void 0 : _a.trim()) || void 0;
        const { name: name2 = "div", tokens: inlineOptTokens, options: inlineOptions } = inlineOptionsToTokens(info, (_b = map2 === null || map2 === void 0 ? void 0 : map2[0]) !== null && _b !== void 0 ? _b : 0, state);
        const content = parseDirectiveContent(token.content.trim() ? token.content.split(/\r?\n/) : [], name2, state);
        const { body, options, optionsLocation } = content;
        let { bodyOffset } = content;
        while (body.length && !body[0].trim()) {
          body.shift();
          bodyOffset++;
        }
        const bodyString = body.join("\n").trimEnd();
        const directiveOpen = new state.Token("parsed_directive_open", "", 1);
        directiveOpen.info = name2;
        directiveOpen.hidden = true;
        directiveOpen.content = bodyString;
        directiveOpen.map = map2;
        directiveOpen.meta = {
          arg,
          options: getDirectiveOptions([...inlineOptions, ...options !== null && options !== void 0 ? options : []]),
          // Tightness is computed for all directives (are they separated by a newline before/after)
          tight: computeBlockTightness(state.src, token.map)
        };
        const startLineNumber = map2 ? map2[0] : 0;
        const argTokens = directiveArgToTokens(arg, startLineNumber, state);
        const optsTokens = directiveOptionsToTokens(options || [], startLineNumber + 1, state, optionsLocation);
        const bodyTokens = directiveBodyToTokens(bodyString, startLineNumber + bodyOffset, state);
        const directiveClose = new state.Token("parsed_directive_close", "", -1);
        directiveClose.info = info;
        directiveClose.hidden = true;
        const newTokens = [
          directiveOpen,
          ...inlineOptTokens,
          ...argTokens,
          ...optsTokens,
          ...bodyTokens,
          directiveClose
        ];
        finalTokens.push(...newTokens);
      } catch (err) {
        stateError(state, `Error parsing "${token.info}" directive: ${err.message}`);
        const errorToken = new state.Token("directive_error", "", 0);
        errorToken.content = token.content;
        errorToken.info = token.info;
        errorToken.meta = token.meta;
        errorToken.map = token.map;
        errorToken.meta.error_message = err.message;
        errorToken.meta.error_name = err.name;
        finalTokens.push(errorToken);
      }
    } else {
      finalTokens.push(token);
    }
  }
  state.tokens = finalTokens;
  return true;
}
function parseDirectiveContent(content, info, state) {
  var _a;
  let bodyOffset = 1;
  let yamlBlock = null;
  const newContent = [];
  if (content.length && content[0].trimEnd() === "---") {
    bodyOffset++;
    yamlBlock = [];
    let foundDivider = false;
    for (const line of content.slice(1)) {
      if (line.trimEnd() === "---") {
        bodyOffset++;
        foundDivider = true;
        continue;
      }
      if (foundDivider) {
        newContent.push(line);
      } else {
        bodyOffset++;
        yamlBlock.push(line);
      }
    }
    try {
      const options = jsYaml.load(yamlBlock.join("\n"));
      if (options && typeof options === "object") {
        return {
          body: newContent,
          options: Object.entries(options),
          bodyOffset,
          optionsLocation: "yaml"
        };
      }
    } catch (err) {
      stateWarn(state, `Invalid YAML options in "${info}" directive: ${err.reason}`);
    }
  } else if (content.length && COLON_OPTION_REGEX.exec(content[0])) {
    const options = [];
    let foundDivider = false;
    for (const line of content) {
      if (!foundDivider && !COLON_OPTION_REGEX.exec(line)) {
        foundDivider = true;
        newContent.push(line);
        continue;
      }
      if (foundDivider) {
        newContent.push(line);
      } else {
        const match = COLON_OPTION_REGEX.exec(line);
        const { option, value } = (_a = match === null || match === void 0 ? void 0 : match.groups) !== null && _a !== void 0 ? _a : {};
        if (option)
          options.push([option, value || true]);
        bodyOffset++;
      }
    }
    return { body: newContent, options, bodyOffset, optionsLocation: "colon" };
  }
  return { body: content, bodyOffset: 1 };
}
function directiveArgToTokens(arg, lineNumber, state) {
  return nestedPartToTokens("directive_arg", arg, lineNumber, state, "run_directives", true);
}
function getDirectiveOptions(options) {
  if (!options || options.length === 0)
    return void 0;
  const simplified = {};
  options.forEach(([key, val]) => {
    if (key === "class" && simplified.class) {
      simplified.class += ` ${val}`;
      return;
    }
    if (simplified[key] !== void 0) {
      return;
    }
    simplified[key] = val;
  });
  return simplified;
}
function directiveOptionsToTokens(options, lineNumber, state, optionsLocation) {
  const tokens = options.map(([key, value], index2) => {
    const optTokens = typeof value === "string" ? nestedPartToTokens("myst_option", value, lineNumber + index2, state, "run_directives", true) : [
      new state.Token("myst_option_open", "", 1),
      new state.Token("myst_option_close", "", -1)
    ];
    if (optTokens.length) {
      optTokens[0].info = key;
      optTokens[0].content = typeof value === "string" ? value : "";
      optTokens[0].meta = { location: optionsLocation, value };
    }
    return optTokens;
  });
  return tokens.flat();
}
function directiveBodyToTokens(body, lineNumber, state) {
  return nestedPartToTokens("directive_body", body, lineNumber, state, "run_directives", false);
}
function directivePlugin(md) {
  md.core.ruler.after("block", "fence_to_directive", replaceFences);
  md.core.ruler.after("fence_to_directive", "run_directives", runDirectives);
  md.renderer.rules["directive"] = (tokens, idx) => {
    const token = tokens[idx];
    return `<aside class="directive-unhandled">
<header><mark>${token.info}</mark><code> ${token.meta.arg}</code></header>
<pre>${token.content}</pre></aside>
`;
  };
  md.renderer.rules["directive_error"] = (tokens, idx) => {
    const token = tokens[idx];
    let content = "";
    if (token.content) {
      content = `
---
${token.content}`;
    }
    return `<aside class="directive-error">
<header><mark>${token.info}</mark><code> ${token.meta.arg}</code></header>
<pre>${token.meta.error_name}:
${token.meta.error_message}
${content}</pre></aside>
`;
  };
}

// node_modules/markdown-it-myst/dist/citations.js
var citationsPlugin = (md) => {
  const regexes = {
    citation: /^([^^-]|[^^].+?)?(-)?@([\w][\w:.#$%&\-+?<>~/]*)(.+)?$/,
    // Only allow a short [suffix] for in text citations (e.g. 50 characters)
    inText: /^@((?:[\w|{][\w:.#$%&\-+?<>~/]*[\w|}])|\w)(\s*)(\[([^\]]{1,50})\])?/,
    allowedBefore: /^[^a-zA-Z.0-9]$/
  };
  md.inline.ruler.after("emphasis", "citation", (state, silent) => {
    const char = state.src.charCodeAt(state.pos);
    if (char == 64 && (state.pos == 0 || regexes.allowedBefore.test(state.src.slice(state.pos - 1, state.pos)))) {
      const match = state.src.slice(state.pos).match(regexes.inText);
      if (match) {
        const citation = {
          label: trimBraces(match[1]),
          kind: "narrative"
        };
        let token;
        if (!silent) {
          token = state.push("cite", "cite", 0);
          token.meta = citation;
          token.col = [state.pos];
        }
        if (match[3]) {
          const suffix = match[4];
          citation.suffix = state.md.parseInline(suffix, state.env);
          state.pos += match[0].length;
          if (token) {
            token.content = match[0];
            token.col.push(state.pos);
          }
        } else {
          state.pos += match[0].length - match[2].length;
          if (token) {
            token.content = match[0];
            token.col.push(state.pos);
          }
        }
        return true;
      }
    } else if (char == 91) {
      const end = state.md.helpers.parseLinkLabel(state, state.pos);
      const charAfter = state.src.codePointAt(end + 1);
      if (end > 0 && charAfter != 40 && charAfter != 91) {
        const str2 = state.src.slice(state.pos + 1, end);
        const parts = str2.split(";").map((x) => x.match(regexes.citation));
        if (parts.indexOf(null) >= 0)
          return false;
        let curCol = state.pos + 1;
        const cites = parts.map((x) => {
          var _a, _b;
          const suffix = x[4] ? x[4].trim().replace(/^,[\s]*/, "") : void 0;
          const colEnd = curCol + x[0].length;
          const meta = {
            label: trimBraces(x[3]),
            kind: "parenthetical",
            prefix: ((_a = x[1]) === null || _a === void 0 ? void 0 : _a.trim()) ? state.md.parseInline((_b = x[1]) === null || _b === void 0 ? void 0 : _b.trim(), state.env) : void 0,
            suffix: suffix ? state.md.parseInline(suffix, state.env) : void 0,
            partial: x[2] ? "year" : void 0,
            content: x[0].trim(),
            col: [curCol, colEnd]
          };
          curCol = colEnd + 1;
          return meta;
        });
        if (!silent) {
          const token = state.push("cite_group_open", "span", 1);
          token.content = "[";
          token.meta = { kind: "parenthetical" };
          cites.forEach((citation) => {
            const { content, col, ...meta } = citation;
            const cite = state.push("cite", "cite", 0);
            cite.content = content;
            cite.col = col;
            cite.meta = meta;
          });
          const close = state.push("cite_group_close", "span", -1);
          close.content = "]";
        }
        state.pos = end + 1;
        return true;
      }
      return false;
    }
    return false;
  });
};
function trimBraces(label) {
  return label.replace(/^\{(.*)\}$/, "$1");
}

// node_modules/markdown-it-myst/dist/index.js
function mystPlugin(md) {
  md.use(rolePlugin);
  md.use(directivePlugin);
}

// node_modules/markdown-it-myst-extras/dist/index.js
function mystBlockPlugin(md) {
  md.block.ruler.before("blockquote", "myst_line_comment", parse_line_comment, {
    alt: ["paragraph", "reference", "blockquote", "list", "footnote_def"]
  });
  md.block.ruler.before("hr", "myst_block_break", parse_block_break, {
    alt: ["paragraph", "reference", "blockquote", "list", "footnote_def"]
  });
  md.block.ruler.before("hr", "myst_target", parse_target, {
    alt: ["paragraph", "reference", "blockquote", "list", "footnote_def"]
  });
  md.renderer.rules.myst_line_comment = render_myst_line_comment;
  md.renderer.rules.myst_target = render_myst_target;
}
function parse_line_comment(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let maximum = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.src[pos] !== "%") {
    return false;
  }
  if (silent) {
    return true;
  }
  const token = state.push("myst_line_comment", "", 0);
  token.attrSet("class", "myst-line-comment");
  token.content = state.src.slice(pos + 1, maximum).replace(/\s+$/gm, "");
  token.markup = "%";
  let nextLine;
  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    maximum = state.eMarks[nextLine];
    if (state.src[pos] !== "%") {
      break;
    }
    token.content += "\n" + state.src.slice(pos + 1, maximum).replace(/\s+$/gm, "");
  }
  state.line = nextLine;
  token.map = [startLine, nextLine];
  return true;
}
function parse_block_break(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const maximum = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  const marker = state.src.charCodeAt(pos);
  pos += 1;
  if (marker !== 43) {
    return false;
  }
  let cnt = 1;
  while (pos < maximum) {
    const ch = state.src.charCodeAt(pos);
    if (ch !== marker && !state.md.utils.isSpace(ch)) {
      break;
    }
    if (ch === marker) {
      cnt += 1;
    }
    pos += 1;
  }
  if (cnt < 3) {
    return false;
  }
  if (silent) {
    return true;
  }
  state.line = startLine + 1;
  const token = state.push("myst_block_break", "hr", 0);
  token.attrSet("class", "myst-block");
  token.content = state.src.slice(pos, maximum).trim();
  token.map = [startLine, state.line];
  token.markup = state.md.utils.fromCodePoint(marker).repeat(cnt);
  return true;
}
var TARGET_PATTERN = /^\((?<label>[a-zA-Z0-9|@<>*./_\-+:]{1,100})\)=\s*$/;
function parse_target(state, startLine, endLine, silent) {
  const pos = state.bMarks[startLine] + state.tShift[startLine];
  const maximum = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  const match = TARGET_PATTERN.exec(state.src.slice(pos, maximum));
  if (!match) {
    return false;
  }
  if (silent) {
    return true;
  }
  state.line = startLine + 1;
  const token = state.push("myst_target", "", 0);
  token.attrSet("class", "myst-target");
  token.content = match && match.groups ? match.groups["label"] : "";
  token.map = [startLine, state.line];
  return true;
}
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function render_myst_line_comment(tokens, idx) {
  const token = tokens[idx];
  const content = token.content;
  return `<!-- ${escapeHtml(content).trim()} -->`;
}
function render_myst_target(tokens, idx) {
  const token = tokens[idx];
  const className = "myst-target";
  const label = token.content;
  const target = `<a href="#${label}">(${label})=</a>`;
  return `<div class="${className}">${target}</div>`;
}
function colonFencePlugin(md) {
  md.block.ruler.before("fence", "colon_fence", colon_fence_rule, {
    alt: ["paragraph", "reference", "blockquote", "list", "footnote_def"]
  });
}
function colon_fence_rule(state, startLine, endLine, silent) {
  let haveEndMarker = false;
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (pos + 3 > max) {
    return false;
  }
  const marker = state.src.charCodeAt(pos);
  if (marker !== 58) {
    return false;
  }
  let mem = pos;
  pos = state.skipChars(pos, marker);
  let len = pos - mem;
  if (len < 3) {
    return false;
  }
  const markup = state.src.slice(mem, pos);
  const params = state.src.slice(pos, max);
  if (silent) {
    return true;
  }
  let nextLine = startLine;
  for (; ; ) {
    nextLine++;
    if (nextLine >= endLine) {
      break;
    }
    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    if (state.src.charCodeAt(pos) !== marker) {
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      continue;
    }
    pos = state.skipChars(pos, marker);
    if (pos - mem < len) {
      continue;
    }
    pos = state.skipSpaces(pos);
    if (pos < max) {
      continue;
    }
    haveEndMarker = true;
    break;
  }
  len = state.sCount[startLine];
  state.line = nextLine + (haveEndMarker ? 1 : 0);
  const token = state.push("fence", "code", 0);
  token.info = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup = markup;
  token.map = [startLine, state.line];
  return true;
}

// node_modules/markdown-it-dollarmath/dist/index.js
var import_utils2 = __toESM(require_utils(), 1);
var OptionDefaults = {
  allow_space: true,
  allow_digits: true,
  double_inline: true,
  allow_labels: true,
  labelNormalizer(label) {
    return label.replace(/[\s]+/g, "-");
  },
  renderer(content) {
    return (0, import_utils2.escapeHtml)(content);
  },
  labelRenderer(label) {
    return `<a href="#${label}" class="mathlabel" title="Permalink to this equation">\xB6</a>`;
  }
};
function dollarmathPlugin(md, options) {
  const fullOptions = Object.assign(Object.assign({}, OptionDefaults), options);
  md.inline.ruler.before("escape", "math_inline", math_inline_dollar(fullOptions));
  md.block.ruler.before("fence", "math_block", math_block_dollar(fullOptions));
  const createRule = (opts) => (tokens, idx) => {
    const content = tokens[idx].content.trim();
    let res;
    try {
      res = fullOptions.renderer(content, { displayMode: opts.displayMode });
    } catch (err) {
      res = md.utils.escapeHtml(`${content}:${err.message}`);
    }
    const className = opts.inline ? "inline" : "block";
    const tag = opts.displayMode ? "div" : "span";
    const newline = opts.inline ? "" : "\n";
    const id = tokens[idx].info;
    const label = opts.hasLabel ? `${fullOptions.labelRenderer(id)}` : "";
    return [
      `<${tag} ${id ? `id="${id}" ` : ""}class="math ${className}">`,
      label,
      res,
      `</${tag}>`
    ].filter((v) => !!v).join(newline) + newline;
  };
  md.renderer.rules["math_inline"] = createRule({
    displayMode: false,
    inline: true
  });
  md.renderer.rules["math_inline_double"] = createRule({
    displayMode: true,
    inline: true
  });
  md.renderer.rules["math_block"] = createRule({
    displayMode: true
  });
  md.renderer.rules["math_block_label"] = createRule({
    displayMode: true,
    hasLabel: true
  });
}
function isEscaped(state, back_pos, mod = 0) {
  let backslashes = 0;
  while (back_pos >= 0) {
    back_pos = back_pos - 1;
    if (state.src.charCodeAt(back_pos) === 92) {
      backslashes += 1;
    } else {
      break;
    }
  }
  if (backslashes === 0) {
    return false;
  }
  if (backslashes % 2 !== mod) {
    return true;
  }
  return false;
}
function math_inline_dollar(options) {
  function math_inline_dollar_rule(state, silent) {
    if (state.src.charCodeAt(state.pos) !== 36) {
      return false;
    }
    if (!options.allow_space) {
      if (state.md.utils.isWhiteSpace(state.src.charCodeAt(state.pos + 1))) {
        return false;
      }
    }
    if (!options.allow_digits) {
      const char = state.src.charAt(state.pos - 1);
      if (!!char && char.trim() !== "" && !isNaN(Number(char))) {
        return false;
      }
    }
    if (isEscaped(state, state.pos)) {
      return false;
    }
    let is_double = false;
    if (options.double_inline && state.src.charCodeAt(state.pos + 1) === 36) {
      is_double = true;
    }
    let pos = state.pos + 1 + (is_double ? 1 : 0);
    let found_closing = false;
    let end = -1;
    while (!found_closing) {
      end = state.src.indexOf("$", pos);
      if (end === -1) {
        return false;
      }
      if (isEscaped(state, end)) {
        pos = end + 1;
        continue;
      }
      if (is_double && state.src.charCodeAt(end + 1) !== 36) {
        pos = end + 1;
        continue;
      }
      if (is_double) {
        end += 1;
      }
      found_closing = true;
    }
    if (!found_closing) {
      return false;
    }
    if (!options.allow_space) {
      const charCode = state.src.charCodeAt(end - 1);
      if (state.md.utils.isWhiteSpace(charCode)) {
        return false;
      }
    }
    if (!options.allow_digits) {
      const char = state.src.charAt(end + 1);
      if (!!char && char.trim() !== "" && !isNaN(Number(char))) {
        return false;
      }
    }
    let text = state.src.slice(state.pos + 1, end);
    if (is_double) {
      text = state.src.slice(state.pos + 2, end - 1);
    }
    if (!text) {
      return false;
    }
    if (!silent) {
      const token = state.push(is_double ? "math_inline_double" : "math_inline", "math", 0);
      token.content = text;
      token.markup = is_double ? "$$" : "$";
    }
    state.pos = end + 1;
    return true;
  }
  return math_inline_dollar_rule;
}
function matchLabel(lineText, end) {
  const eqnoMatch = lineText.split("").reverse().join("").match(/^\s*\)(?<label>[^)$\r\n]+?)\(\s*\${2}/);
  if (eqnoMatch && eqnoMatch.groups) {
    const label = eqnoMatch.groups["label"].split("").reverse().join("");
    end = end - ((eqnoMatch.index || 0) + eqnoMatch[0].length);
    return { label, end };
  }
  return { end };
}
function math_block_dollar(options) {
  function math_block_dollar_rule(state, startLine, endLine, silent) {
    let haveEndMarker = false;
    const startPos = state.bMarks[startLine] + state.tShift[startLine];
    let end = state.eMarks[startLine];
    if (state.sCount[startLine] - state.blkIndent >= 4) {
      return false;
    }
    if (startPos + 2 > end) {
      return false;
    }
    if (state.src.charCodeAt(startPos) != 36 || state.src.charCodeAt(startPos + 1) != 36) {
      return false;
    }
    let nextLine = startLine;
    let label = void 0;
    let lineText = state.src.slice(startPos, end);
    if (lineText.trim().length > 3) {
      if (lineText.trim().endsWith("$$")) {
        haveEndMarker = true;
        end = end - 2 - (lineText.length - lineText.trim().length);
      } else if (options.allow_labels) {
        const output = matchLabel(lineText, end);
        if (output.label !== void 0) {
          haveEndMarker = true;
          label = output.label;
          end = output.end;
        }
      }
    }
    let start;
    if (!haveEndMarker) {
      while (nextLine + 1 < endLine) {
        nextLine += 1;
        start = state.bMarks[nextLine] + state.tShift[nextLine];
        end = state.eMarks[nextLine];
        lineText = state.src.slice(start, end);
        if (lineText.trim().endsWith("$$")) {
          haveEndMarker = true;
          end = end - 2 - (lineText.length - lineText.trim().length);
          break;
        }
        if (lineText.trim() == "") {
          break;
        }
        if (options.allow_labels) {
          const output = matchLabel(lineText, end);
          if (output.label !== void 0) {
            haveEndMarker = true;
            label = output.label;
            end = output.end;
            break;
          }
        }
      }
    }
    if (!haveEndMarker) {
      return false;
    }
    state.line = nextLine + (haveEndMarker ? 1 : 0);
    const token = state.push(label ? "math_block_label" : "math_block", "math", 0);
    token.block = true;
    token.content = state.src.slice(startPos + 2, end).trim();
    token.markup = "$$";
    token.map = [startLine, state.line];
    if (label) {
      token.info = options.labelNormalizer ? options.labelNormalizer(label) : label;
    }
    return true;
  }
  return math_block_dollar_rule;
}

// node_modules/markdown-it-amsmath/dist/index.js
function amsmathPlugin(md, options) {
  md.block.ruler.before("blockquote", "amsmath", amsmathBlock, {
    alt: ["paragraph", "reference", "blockquote", "list", "footnote_def"]
  });
  const renderer = options === null || options === void 0 ? void 0 : options.renderer;
  if (renderer) {
    md.renderer.rules["amsmath"] = (tokens, idx) => {
      const content = tokens[idx].content;
      let res;
      try {
        res = renderer(content);
      } catch (err) {
        res = md.utils.escapeHtml(`${content}:${err.message}`);
      }
      return res;
    };
  } else {
    md.renderer.rules["amsmath"] = (tokens, idx) => {
      const content = md.utils.escapeHtml(tokens[idx].content);
      return `<div class="math amsmath">
${content}
</div>
`;
    };
  }
}
var ENVIRONMENTS = [
  // 3.2 single equation with an automatically generated number
  "equation",
  // 3.3 variation equation, used for equations that don’t fit on a single line
  "multline",
  // 3.5 a group of consecutive equations when there is no alignment desired among them
  "gather",
  // 3.6 Used for two or more equations when vertical alignment is desired
  "align",
  // allows the horizontal space between equations to be explicitly specified.
  "alignat",
  // stretches the space between the equation columns to the maximum possible width
  "flalign",
  // 4.1 The pmatrix, bmatrix, Bmatrix, vmatrix and Vmatrix have (respectively)
  // (),[],{},||,and ‖‖ delimiters built in.
  "matrix",
  "pmatrix",
  "bmatrix",
  "Bmatrix",
  "vmatrix",
  "Vmatrix",
  // eqnarray is another math environment, it is not part of amsmath,
  // and note that it is better to use align or equation+split instead
  "eqnarray"
];
var RE_OPEN = new RegExp(`^\\\\begin{(${ENVIRONMENTS.join("|")})([*]?)}`);
function matchEnvironment(string) {
  const matchOpen = string.match(RE_OPEN);
  if (!matchOpen)
    return null;
  const [, environment, numbered] = matchOpen;
  const end = `\\end{${environment}${numbered}}`;
  const matchClose = string.indexOf(end);
  if (matchClose === -1)
    return null;
  return { environment, numbered, endpos: matchClose + end.length };
}
function amsmathBlock(state, startLine, endLine, silent) {
  if (state.sCount[startLine] - state.blkIndent >= 4)
    return false;
  const begin = state.bMarks[startLine] + state.tShift[startLine];
  const outcome = matchEnvironment(state.src.slice(begin));
  if (!outcome)
    return false;
  const { environment, numbered } = outcome;
  let { endpos } = outcome;
  endpos += begin;
  let line = startLine;
  while (line < endLine) {
    if (endpos >= state.bMarks[line] && endpos <= state.eMarks[line]) {
      state.line = line + 1;
      break;
    }
    line += 1;
  }
  if (!silent) {
    const token = state.push("amsmath", "math", 0);
    token.block = true;
    token.content = state.src.slice(begin, endpos);
    token.meta = { environment, numbered };
    token.map = [startLine, line];
  }
  return true;
}

// node_modules/myst-parser/dist/math.js
function plugin(md, options) {
  const opts = options === true ? { amsmath: true, dollarmath: true } : options;
  if (opts?.dollarmath)
    dollarmathPlugin(md);
  if (opts?.amsmath)
    amsmathPlugin(md);
}

// node_modules/myst-parser/dist/plugins.js
function convertFrontMatter(md) {
  md.core.ruler.after("block", "convert_front_matter", (state) => {
    if (state.tokens.length && state.tokens[0].type === "front_matter") {
      const replace = new state.Token("fence", "code", 0);
      replace.map = state.tokens[0].map;
      replace.info = "yaml";
      replace.content = state.tokens[0].meta;
      state.tokens[0] = replace;
    }
    return true;
  });
}

// node_modules/myst-parser/dist/myst.js
var import_markdown_it = __toESM(require_markdown_it(), 1);

// node_modules/myst-common/node_modules/nanoid/index.js
import { webcrypto as crypto } from "node:crypto";
var POOL_SIZE_MULTIPLIER = 128;
var pool;
var poolOffset;
function fillPool(bytes) {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    crypto.getRandomValues(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    crypto.getRandomValues(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
}
function random(bytes) {
  fillPool(bytes |= 0);
  return pool.subarray(poolOffset - bytes, poolOffset);
}
function customRandom(alphabet, defaultSize, getRandom) {
  let mask = (2 << 31 - Math.clz32(alphabet.length - 1 | 1)) - 1;
  let step = Math.ceil(1.6 * mask * defaultSize / alphabet.length);
  return (size = defaultSize) => {
    if (!size) return "";
    let id = "";
    while (true) {
      let bytes = getRandom(step);
      let i = step;
      while (i--) {
        id += alphabet[bytes[i] & mask] || "";
        if (id.length >= size) return id;
      }
    }
  };
}
function customAlphabet(alphabet, size = 21) {
  return customRandom(alphabet, size, random);
}

// node_modules/myst-common/dist/utils.js
function addMessageInfo(message, info) {
  if (info?.note)
    message.note = info.note;
  if (info?.url)
    message.url = info.url;
  if (info?.ruleId)
    message.ruleId = info.ruleId;
  if (info?.key)
    message.key = info.key;
  if (info?.fatal)
    message.fatal = true;
  return message;
}
function fileError(file, message, opts) {
  return addMessageInfo(file.message(message, opts?.node, opts?.source), { ...opts, fatal: true });
}
function fileWarn(file, message, opts) {
  return addMessageInfo(file.message(message, opts?.node, opts?.source), opts);
}
var az = "abcdefghijklmnopqrstuvwxyz";
var alpha = az + az.toUpperCase();
var numbers = "0123456789";
var nanoidAZ = customAlphabet(alpha, 1);
var nanoidAZ9 = customAlphabet(alpha + numbers, 9);
function normalizeLabel(label) {
  if (!label)
    return void 0;
  const identifier = label.replace(/[\t\n\r ]+/g, " ").replace(/['‘’"“”]+/g, "").trim().toLowerCase();
  const html_id = createHtmlId(identifier);
  return { identifier, label, html_id };
}
function createHtmlId(identifier) {
  if (!identifier)
    return void 0;
  return identifier.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^([0-9-])/, "id-$1").replace(/-[-]+/g, "-").replace(/(?:^[-]+)|(?:[-]+$)/g, "");
}
function transferTargetAttrs(sourceNode, destNode, vfile) {
  if (sourceNode.label) {
    if (destNode.label && vfile && destNode.label !== sourceNode.label) {
      fileWarn(vfile, `label "${destNode.label}" replaced with "${sourceNode.label}"`, {
        node: destNode
      });
    }
    if (destNode.label && vfile && destNode.label === sourceNode.label) {
      fileWarn(vfile, `duplicate label "${destNode.label}" replacement`, {
        node: destNode
      });
    }
    destNode.label = sourceNode.label;
    delete sourceNode.label;
  }
  if (sourceNode.identifier) {
    destNode.identifier = sourceNode.identifier;
    delete sourceNode.identifier;
  }
  if (sourceNode.html_id) {
    destNode.html_id = sourceNode.html_id;
    delete sourceNode.html_id;
  }
  if (sourceNode.indexEntries) {
    if (!destNode.indexEntries)
      destNode.indexEntries = [];
    destNode.indexEntries.push(...sourceNode.indexEntries);
    delete sourceNode.indexEntries;
  }
}
function getNodeOrLiftedChildren(node, removeType) {
  if (!node.children)
    return [node];
  const children = node.children.map((child) => getNodeOrLiftedChildren(child, removeType)).flat();
  if (node.type === removeType) {
    if (node && node.children == null)
      delete node.children;
    return children;
  }
  node.children = children;
  return [node];
}
function liftChildren(tree, removeType) {
  if (!tree.children)
    return;
  tree.children = tree.children.map((child) => getNodeOrLiftedChildren(child, removeType)).flat();
}
function setTextAsChild(node, text) {
  node.children = [{ type: "text", value: text }];
}
function toText(content) {
  if (!content)
    return "";
  if (!Array.isArray(content))
    return toText([content]);
  return content.map((n) => {
    if (!n || typeof n === "string")
      return n || "";
    if ("value" in n)
      return n.value;
    if ("children" in n && n.children)
      return toText(n.children);
    return "";
  }).join("");
}

// node_modules/unist-util-is/lib/index.js
var convert = (
  /**
   * @type {(
   *   (<Kind extends Node>(test: PredicateTest<Kind>) => AssertPredicate<Kind>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {AssertAnything}
   */
  (function(test2) {
    if (test2 === void 0 || test2 === null) {
      return ok;
    }
    if (typeof test2 === "string") {
      return typeFactory(test2);
    }
    if (typeof test2 === "object") {
      return Array.isArray(test2) ? anyFactory(test2) : propsFactory(test2);
    }
    if (typeof test2 === "function") {
      return castFactory(test2);
    }
    throw new Error("Expected function, string, or object as test");
  })
);
function anyFactory(tests) {
  const checks = [];
  let index2 = -1;
  while (++index2 < tests.length) {
    checks[index2] = convert(tests[index2]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index3 = -1;
    while (++index3 < checks.length) {
      if (checks[index3].call(this, ...parameters)) return true;
    }
    return false;
  }
}
function propsFactory(check) {
  return castFactory(all2);
  function all2(node) {
    let key;
    for (key in check) {
      if (node[key] !== check[key]) return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type2);
  function type2(node) {
    return node && node.type === check;
  }
}
function castFactory(check) {
  return assertion;
  function assertion(node, ...parameters) {
    return Boolean(
      node && typeof node === "object" && "type" in node && // @ts-expect-error: fine.
      Boolean(check.call(this, node, ...parameters))
    );
  }
}
function ok() {
  return true;
}

// node_modules/unist-util-remove/lib/index.js
var empty = [];
var remove = (
  /**
   * @type {(
   *  (<Tree extends Node>(node: Tree, options: Options, test: Test) => Tree | null) &
   *  (<Tree extends Node>(node: Tree, test: Test) => Tree | null)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Options | null | undefined} [options]
   * @param {Test | null | undefined} [test]
   * @returns {Node | null}
   */
  (function(tree, options, test2) {
    const is2 = convert(test2 || options);
    const cascade = !options || options.cascade === void 0 || options.cascade === null ? true : options.cascade;
    return preorder(tree);
    function preorder(node, index2, parent2) {
      const children = node.children || empty;
      let childIndex = -1;
      let position2 = 0;
      if (is2(node, index2, parent2)) {
        return null;
      }
      if (children.length > 0) {
        while (++childIndex < children.length) {
          if (preorder(children[childIndex], childIndex, node)) {
            children[position2++] = children[childIndex];
          }
        }
        if (cascade && !position2) {
          return null;
        }
        children.length = position2;
      }
      return node;
    }
  })
);

// node_modules/zwitch/index.js
var own = {}.hasOwnProperty;
function zwitch(key, options) {
  const settings = options || {};
  function one2(value, ...parameters) {
    let fn = one2.invalid;
    const handlers = one2.handlers;
    if (value && own.call(value, key)) {
      const id = String(value[key]);
      fn = own.call(handlers, id) ? handlers[id] : one2.unknown;
    }
    if (fn) {
      return fn.call(this, value, ...parameters);
    }
  }
  one2.handlers = settings.handlers || {};
  one2.invalid = settings.invalid;
  one2.unknown = settings.unknown;
  return one2;
}

// node_modules/unist-util-select/lib/attribute.js
var handle = zwitch("operator", {
  unknown: unknownOperator,
  // @ts-expect-error: hush.
  invalid: exists,
  handlers: {
    "=": exact,
    "^=": begins,
    "$=": ends,
    "*=": containsString,
    "~=": containsArray
  }
});
function attribute(query, node) {
  let index2 = -1;
  while (++index2 < query.attrs.length) {
    if (!handle(query.attrs[index2], node)) return false;
  }
  return true;
}
function exists(query, node) {
  return node[query.name] !== null && node[query.name] !== void 0;
}
function exact(query, node) {
  return exists(query, node) && String(node[query.name]) === query.value;
}
function containsArray(query, node) {
  const value = node[query.name];
  if (value === null || value === void 0) return false;
  if (Array.isArray(value) && value.includes(query.value)) {
    return true;
  }
  return String(value) === query.value;
}
function begins(query, node) {
  const value = node[query.name];
  return Boolean(
    query.value && typeof value === "string" && value.slice(0, query.value.length) === query.value
  );
}
function ends(query, node) {
  const value = node[query.name];
  return Boolean(
    query.value && typeof value === "string" && value.slice(-query.value.length) === query.value
  );
}
function containsString(query, node) {
  const value = node[query.name];
  return Boolean(
    query.value && typeof value === "string" && value.includes(query.value)
  );
}
function unknownOperator(query) {
  throw new Error("Unknown operator `" + query.operator + "`");
}

// node_modules/unist-util-select/lib/name.js
function name(query, node) {
  return query.tagName === "*" || query.tagName === node.type;
}

// node_modules/nth-check/lib/esm/parse.js
var whitespace = /* @__PURE__ */ new Set([9, 10, 12, 13, 32]);
var ZERO = "0".charCodeAt(0);
var NINE = "9".charCodeAt(0);
function parse(formula) {
  formula = formula.trim().toLowerCase();
  if (formula === "even") {
    return [2, 0];
  } else if (formula === "odd") {
    return [2, 1];
  }
  let idx = 0;
  let a = 0;
  let sign = readSign();
  let number = readNumber();
  if (idx < formula.length && formula.charAt(idx) === "n") {
    idx++;
    a = sign * (number !== null && number !== void 0 ? number : 1);
    skipWhitespace();
    if (idx < formula.length) {
      sign = readSign();
      skipWhitespace();
      number = readNumber();
    } else {
      sign = number = 0;
    }
  }
  if (number === null || idx < formula.length) {
    throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
  }
  return [a, sign * number];
  function readSign() {
    if (formula.charAt(idx) === "-") {
      idx++;
      return -1;
    }
    if (formula.charAt(idx) === "+") {
      idx++;
    }
    return 1;
  }
  function readNumber() {
    const start = idx;
    let value = 0;
    while (idx < formula.length && formula.charCodeAt(idx) >= ZERO && formula.charCodeAt(idx) <= NINE) {
      value = value * 10 + (formula.charCodeAt(idx) - ZERO);
      idx++;
    }
    return idx === start ? null : value;
  }
  function skipWhitespace() {
    while (idx < formula.length && whitespace.has(formula.charCodeAt(idx))) {
      idx++;
    }
  }
}

// node_modules/nth-check/lib/esm/compile.js
var import_boolbase = __toESM(require_boolbase(), 1);
function compile(parsed) {
  const a = parsed[0];
  const b = parsed[1] - 1;
  if (b < 0 && a <= 0)
    return import_boolbase.default.falseFunc;
  if (a === -1)
    return (index2) => index2 <= b;
  if (a === 0)
    return (index2) => index2 === b;
  if (a === 1)
    return b < 0 ? import_boolbase.default.trueFunc : (index2) => index2 >= b;
  const absA = Math.abs(a);
  const bMod = (b % absA + absA) % absA;
  return a > 1 ? (index2) => index2 >= b && index2 % absA === bMod : (index2) => index2 <= b && index2 % absA === bMod;
}

// node_modules/nth-check/lib/esm/index.js
function nthCheck(formula) {
  return compile(parse(formula));
}

// node_modules/unist-util-select/lib/util.js
function parent(node) {
  return Array.isArray(node.children);
}

// node_modules/unist-util-select/lib/pseudo.js
var nthCheck2 = nthCheck.default || nthCheck;
var handle2 = zwitch("name", {
  unknown: unknownPseudo,
  invalid: invalidPseudo,
  handlers: {
    any: matches,
    blank: empty2,
    empty: empty2,
    "first-child": firstChild,
    "first-of-type": firstOfType,
    has,
    "last-child": lastChild,
    "last-of-type": lastOfType,
    matches,
    not,
    "nth-child": nthChild,
    "nth-last-child": nthLastChild,
    "nth-of-type": nthOfType,
    "nth-last-of-type": nthLastOfType,
    "only-child": onlyChild,
    "only-of-type": onlyOfType,
    root,
    scope
  }
});
pseudo.needsIndex = [
  "any",
  "first-child",
  "first-of-type",
  "last-child",
  "last-of-type",
  "matches",
  "not",
  "nth-child",
  "nth-last-child",
  "nth-of-type",
  "nth-last-of-type",
  "only-child",
  "only-of-type"
];
function pseudo(query, node, index2, parent2, state) {
  const pseudos = query.pseudos;
  let offset = -1;
  while (++offset < pseudos.length) {
    if (!handle2(pseudos[offset], node, index2, parent2, state)) return false;
  }
  return true;
}
function empty2(_1, node) {
  return parent(node) ? node.children.length === 0 : !("value" in node);
}
function firstChild(query, _1, _2, _3, state) {
  assertDeep(state, query);
  return state.nodeIndex === 0;
}
function firstOfType(query, _1, _2, _3, state) {
  assertDeep(state, query);
  return state.typeIndex === 0;
}
function has(query, node, _1, _2, state) {
  const fragment = { type: "root", children: parent(node) ? node.children : [] };
  const childState = {
    ...state,
    // Not found yet.
    found: false,
    // Do walk deep.
    shallow: false,
    // One result is enough.
    one: true,
    scopeNodes: [node],
    results: [],
    rootQuery: queryToSelectors(query.value)
  };
  walk(childState, fragment);
  return childState.results.length > 0;
}
function lastChild(query, _1, _2, _3, state) {
  assertDeep(state, query);
  return typeof state.nodeCount === "number" && state.nodeIndex === state.nodeCount - 1;
}
function lastOfType(query, _1, _2, _3, state) {
  assertDeep(state, query);
  return typeof state.typeCount === "number" && state.typeIndex === state.typeCount - 1;
}
function matches(query, node, _1, _2, state) {
  const childState = {
    ...state,
    // Not found yet.
    found: false,
    // Do walk deep.
    shallow: false,
    // One result is enough.
    one: true,
    scopeNodes: [node],
    results: [],
    rootQuery: queryToSelectors(query.value)
  };
  walk(childState, node);
  return childState.results[0] === node;
}
function not(query, node, index2, parent2, state) {
  return !matches(query, node, index2, parent2, state);
}
function nthChild(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query);
  assertDeep(state, query);
  return typeof state.nodeIndex === "number" && fn(state.nodeIndex);
}
function nthLastChild(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query);
  assertDeep(state, query);
  return typeof state.nodeCount === "number" && typeof state.nodeIndex === "number" && fn(state.nodeCount - state.nodeIndex - 1);
}
function nthLastOfType(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query);
  assertDeep(state, query);
  return typeof state.typeIndex === "number" && typeof state.typeCount === "number" && fn(state.typeCount - 1 - state.typeIndex);
}
function nthOfType(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query);
  assertDeep(state, query);
  return typeof state.typeIndex === "number" && fn(state.typeIndex);
}
function onlyChild(query, _1, _2, _3, state) {
  assertDeep(state, query);
  return state.nodeCount === 1;
}
function onlyOfType(query, _1, _2, _3, state) {
  assertDeep(state, query);
  return state.typeCount === 1;
}
function root(_1, node, _2, parent2) {
  return node && !parent2;
}
function scope(_1, node, _2, _3, state) {
  return node && state.scopeNodes.includes(node);
}
function invalidPseudo() {
  throw new Error("Invalid pseudo-selector");
}
function unknownPseudo(query) {
  if (query.name) {
    throw new Error("Unknown pseudo-selector `" + query.name + "`");
  }
  throw new Error("Unexpected pseudo-element or empty pseudo-class");
}
function assertDeep(state, query) {
  if (state.shallow) {
    throw new Error("Cannot use `:" + query.name + "` without parent");
  }
}
function getCachedNthCheck(query) {
  let fn = query._cachedFn;
  if (!fn) {
    fn = nthCheck2(query.value);
    query._cachedFn = fn;
  }
  return fn;
}

// node_modules/unist-util-select/lib/test.js
function test(query, node, index2, parent2, state) {
  if (query.id) throw new Error("Invalid selector: id");
  if (query.classNames) throw new Error("Invalid selector: class");
  return Boolean(
    node && (!query.tagName || name(query, node)) && (!query.attrs || attribute(query, node)) && (!query.pseudos || pseudo(query, node, index2, parent2, state))
  );
}

// node_modules/unist-util-select/lib/walk.js
var empty3 = [];
function queryToSelectors(query) {
  if (query === null) {
    return { type: "selectors", selectors: [] };
  }
  if (query.type === "ruleSet") {
    return { type: "selectors", selectors: [query] };
  }
  return query;
}
function walk(state, tree) {
  if (tree) {
    one(state, [], tree, void 0, void 0);
  }
}
function one(state, currentRules, node, index2, parentNode) {
  let nestResult = {
    directChild: void 0,
    descendant: void 0,
    adjacentSibling: void 0,
    generalSibling: void 0
  };
  nestResult = applySelectors(
    state,
    // Try the root rules for this node too.
    combine(currentRules, state.rootQuery.selectors),
    node,
    index2,
    parentNode
  );
  if (parent(node) && !state.shallow && !(state.one && state.found)) {
    all(state, nestResult, node);
  }
  return nestResult;
}
function all(state, nest, node) {
  const fromParent = combine(nest.descendant, nest.directChild);
  let fromSibling;
  let index2 = -1;
  const total = { count: 0, types: /* @__PURE__ */ new Map() };
  const before = { count: 0, types: /* @__PURE__ */ new Map() };
  while (++index2 < node.children.length) {
    count(total, node.children[index2]);
  }
  index2 = -1;
  while (++index2 < node.children.length) {
    const child = node.children[index2];
    const name2 = child.type.toUpperCase();
    state.nodeIndex = before.count;
    state.typeIndex = before.types.get(name2) || 0;
    state.nodeCount = total.count;
    state.typeCount = total.types.get(name2);
    const forSibling = combine(fromParent, fromSibling);
    const nest2 = one(state, forSibling, node.children[index2], index2, node);
    fromSibling = combine(nest2.generalSibling, nest2.adjacentSibling);
    if (state.one && state.found) {
      break;
    }
    count(before, node.children[index2]);
  }
}
function applySelectors(state, rules, node, index2, parent2) {
  const nestResult = {
    directChild: void 0,
    descendant: void 0,
    adjacentSibling: void 0,
    generalSibling: void 0
  };
  let selectorIndex = -1;
  while (++selectorIndex < rules.length) {
    const ruleSet = rules[selectorIndex];
    if (state.one && state.found) {
      break;
    }
    if (state.shallow && ruleSet.rule.rule) {
      throw new Error("Expected selector without nesting");
    }
    if (test(ruleSet.rule, node, index2, parent2, state)) {
      const nest = ruleSet.rule.rule;
      if (nest) {
        const rule = { type: "ruleSet", rule: nest };
        const label = nest.nestingOperator === "+" ? "adjacentSibling" : nest.nestingOperator === "~" ? "generalSibling" : nest.nestingOperator === ">" ? "directChild" : "descendant";
        add(nestResult, label, rule);
      } else {
        state.found = true;
        if (!state.results.includes(node)) {
          state.results.push(node);
        }
      }
    }
    if (ruleSet.rule.nestingOperator === null) {
      add(nestResult, "descendant", ruleSet);
    } else if (ruleSet.rule.nestingOperator === "~") {
      add(nestResult, "generalSibling", ruleSet);
    }
  }
  return nestResult;
}
function combine(left, right) {
  return left && right && left.length > 0 && right.length > 0 ? [...left, ...right] : left && left.length > 0 ? left : right && right.length > 0 ? right : empty3;
}
function add(nest, field, rule) {
  const list = nest[field];
  if (list) {
    list.push(rule);
  } else {
    nest[field] = [rule];
  }
}
function count(counts, node) {
  const name2 = node.type.toUpperCase();
  const count2 = (counts.types.get(name2) || 0) + 1;
  counts.count++;
  counts.types.set(name2, count2);
}

// node_modules/unist-util-select/lib/parse.js
var import_css_selector_parser = __toESM(require_lib2(), 1);
var parser = new import_css_selector_parser.CssSelectorParser();
parser.registerAttrEqualityMods("~", "^", "$", "*");
parser.registerSelectorPseudos("any", "matches", "not", "has");
parser.registerNestingOperators(">", "+", "~");
function parse2(selector) {
  if (typeof selector !== "string") {
    throw new TypeError("Expected `string` as selector, not `" + selector + "`");
  }
  return parser.parse(selector);
}

// node_modules/unist-util-select/index.js
function select(selector, tree) {
  const state = createState(selector, tree);
  state.one = true;
  walk(state, tree || void 0);
  return state.results[0] || null;
}
function selectAll(selector, tree) {
  const state = createState(selector, tree);
  walk(state, tree || void 0);
  return state.results;
}
function createState(selector, tree) {
  return {
    // State of the query.
    rootQuery: queryToSelectors(parse2(selector)),
    results: [],
    scopeNodes: tree ? parent(tree) && // Root in nlcst.
    (tree.type === "RootNode" || tree.type === "root") ? tree.children : [tree] : [],
    one: false,
    shallow: false,
    found: false,
    // State in the tree.
    typeIndex: void 0,
    nodeIndex: void 0,
    typeCount: void 0,
    nodeCount: void 0
  };
}

// node_modules/simple-validators/dist/validators.js
function defined(val) {
  return val != null;
}
function locationSuffix(opts) {
  if (opts.file && opts.location)
    return ` (at ${opts.file}#${opts.location})`;
  if (opts.file || opts.location)
    return ` (at ${opts.file || opts.location})`;
  return "";
}
function incrementOptions(property, opts) {
  let location = opts.property;
  if (opts.location)
    location = `${opts.location}.${opts.property}`;
  return { ...opts, property, location };
}
function validationWarning(message, opts) {
  if (opts.suppressWarnings)
    return void 0;
  const { messages } = opts;
  if (!messages.warnings)
    messages.warnings = [];
  const fullMessage = `'${opts.property}' ${message}${locationSuffix(opts)}`;
  messages.warnings.push({
    property: opts.property,
    message: fullMessage
  });
  if (opts.warningLogFn)
    opts.warningLogFn(fullMessage);
  return void 0;
}
var MONTH_TO_NUMBER = new Map(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((elem, index2) => [elem, index2 + 1]));
function fillMissingKeys(base, filler, keys) {
  const output = { ...base };
  keys.forEach((key) => {
    if (!defined(output[key]) && defined(filler[key])) {
      const k = key;
      output[k] = filler[k];
    }
  });
  return output;
}

// node_modules/myst-frontmatter/dist/utils/normalizeString.js
function normalizeJsonToString(value) {
  return JSON.stringify(Object.entries(value).filter(([, val]) => val !== void 0).sort());
}

// node_modules/myst-frontmatter/dist/utils/referenceStash.js
function stashPlaceholder(value) {
  return { id: value, name: value };
}
function isStashPlaceholder(object) {
  if (!object.name || !object.id || object.name !== object.id)
    return false;
  const nKeys = Object.keys(object).length;
  if (nKeys === 2)
    return true;
  return nKeys === 3 && object.nameParsed?.literal === object.id;
}

// node_modules/myst-frontmatter/dist/numbering/validators.js
var NUMBERING_OPTIONS = ["enumerator", "all", "headings", "title"];
var HEADING_KEYS = ["heading_1", "heading_2", "heading_3", "heading_4", "heading_5", "heading_6"];
var NUMBERING_KEYS = [
  "figure",
  "subfigure",
  "equation",
  "subequation",
  "table",
  "code",
  ...HEADING_KEYS
];
var NUMBERING_ITEM_KEYS = ["enabled", "start", "enumerator", "template", "continue"];
function fillNumbering(base, filler) {
  const output = { ...filler, ...base };
  Object.entries(filler ?? {}).filter(([key]) => !NUMBERING_OPTIONS.includes(key)).forEach(([key, val]) => {
    output[key] = fillMissingKeys(
      base?.[key] ?? {},
      // Enabling/disabling all in base overrides filler
      {
        ...val,
        enabled: base?.all?.enabled ?? val.enabled,
        continue: base?.all?.continue ?? val.continue
      },
      NUMBERING_ITEM_KEYS
    );
  });
  return output;
}

// node_modules/myst-frontmatter/dist/utils/fillPageFrontmatter.js
function fillSiteFrontmatter(base, filler, opts, keys, trimUnused) {
  const frontmatter = fillMissingKeys(base, filler, keys ?? Object.keys(filler));
  if (filler.options || base.options) {
    frontmatter.options = {
      ...filler.options ?? {},
      ...base.options ?? {}
    };
  }
  const contributorIds = /* @__PURE__ */ new Set();
  const affiliationIds = /* @__PURE__ */ new Set();
  frontmatter.funding?.forEach((fund) => {
    fund.awards?.forEach((award) => {
      award.investigators?.forEach((inv) => {
        contributorIds.add(inv);
      });
      award.recipients?.forEach((rec) => {
        contributorIds.add(rec);
      });
      award.sources?.forEach((aff) => {
        affiliationIds.add(aff);
      });
    });
  });
  frontmatter.reviewers?.forEach((reviewer) => {
    contributorIds.add(reviewer);
  });
  frontmatter.editors?.forEach((editor) => {
    contributorIds.add(editor);
  });
  if (!trimUnused) {
    [
      ...base.authors ?? [],
      ...filler.authors ?? [],
      ...base.contributors ?? [],
      ...filler.contributors ?? []
    ].forEach((auth) => {
      if (auth.id)
        contributorIds.add(auth.id);
    });
    [...base.affiliations ?? [], ...filler.affiliations ?? []].forEach((aff) => {
      if (aff.id)
        affiliationIds.add(aff.id);
    });
    if (filler.tags || base.tags) {
      frontmatter.tags = [.../* @__PURE__ */ new Set([...filler.tags ?? [], ...base.tags ?? []])];
    }
    if (filler.reviewers || base.reviewers) {
      frontmatter.reviewers = [
        .../* @__PURE__ */ new Set([...filler.reviewers ?? [], ...base.reviewers ?? []])
      ];
    }
    if (filler.editors || base.editors) {
      frontmatter.editors = [.../* @__PURE__ */ new Set([...filler.editors ?? [], ...base.editors ?? []])];
    }
    if (filler.keywords || base.keywords) {
      frontmatter.keywords = [.../* @__PURE__ */ new Set([...filler.keywords ?? [], ...base.keywords ?? []])];
    }
    if (filler.funding || base.funding) {
      frontmatter.funding = [...filler.funding ?? [], ...base.funding ?? []];
    }
  }
  if (frontmatter.authors?.length || contributorIds.size) {
    const people = [
      ...base.authors ?? [],
      ...filler.authors ?? [],
      ...base.contributors ?? [],
      ...filler.contributors ?? []
    ];
    const peopleLookup = {};
    people.forEach((auth) => {
      if (!auth.id || isStashPlaceholder(auth))
        return;
      if (!peopleLookup[auth.id]) {
        peopleLookup[auth.id] = auth;
      } else if (normalizeJsonToString(auth) !== normalizeJsonToString(peopleLookup[auth.id])) {
        validationWarning(`Duplicate contributor id within project: ${auth.id}`, incrementOptions("authors", opts));
      }
    });
    if (frontmatter.authors?.length) {
      frontmatter.authors = frontmatter.authors.map((auth) => {
        if (!auth.id)
          return auth;
        contributorIds.delete(auth.id);
        return peopleLookup[auth.id] ?? stashPlaceholder(auth.id);
      });
    }
    if (contributorIds.size) {
      frontmatter.contributors = [...contributorIds].map((id) => {
        return peopleLookup[id] ?? stashPlaceholder(id);
      });
    }
  }
  [...frontmatter.authors ?? [], ...frontmatter.contributors ?? []].forEach((auth) => {
    auth.affiliations?.forEach((aff) => {
      affiliationIds.add(aff);
    });
  });
  frontmatter.affiliations?.forEach((aff) => {
    if (aff.id)
      affiliationIds.add(aff.id);
  });
  if (affiliationIds.size) {
    const affiliations = [...base.affiliations ?? [], ...filler.affiliations ?? []];
    const affiliationLookup = {};
    affiliations.forEach((aff) => {
      if (!aff.id || isStashPlaceholder(aff))
        return;
      if (!affiliationLookup[aff.id]) {
        affiliationLookup[aff.id] = aff;
      } else if (normalizeJsonToString(aff) !== normalizeJsonToString(affiliationLookup[aff.id])) {
        validationWarning(`Duplicate affiliation id within project: ${aff.id}`, incrementOptions("affiliations", opts));
      }
    });
    frontmatter.affiliations = [...affiliationIds].map((id) => {
      return affiliationLookup[id] ?? stashPlaceholder(id);
    });
  }
  return frontmatter;
}
function fillProjectFrontmatter(base, filler, opts, keys, trimUnused) {
  const frontmatter = fillSiteFrontmatter(base, filler, opts, keys ?? Object.keys(filler), trimUnused);
  if (filler.numbering || base.numbering) {
    frontmatter.numbering = fillNumbering(base.numbering, filler.numbering);
  }
  if (filler.math || base.math) {
    frontmatter.math = { ...filler.math ?? {}, ...base.math ?? {} };
  }
  if (filler.abbreviations || base.abbreviations) {
    frontmatter.abbreviations = {
      ...filler.abbreviations ?? {},
      ...base.abbreviations ?? {}
    };
  }
  if (filler.settings || base.settings) {
    frontmatter.settings = {
      ...filler.settings ?? {},
      ...base.settings ?? {}
    };
  }
  if (filler.identifiers || base.identifiers) {
    frontmatter.identifiers = {
      ...filler.identifiers ?? {},
      ...base.identifiers ?? {}
    };
  }
  if (!trimUnused) {
    if (filler.bibliography || base.bibliography) {
      frontmatter.bibliography = [
        .../* @__PURE__ */ new Set([...filler.bibliography ?? [], ...base.bibliography ?? []])
      ];
    }
    if (filler.requirements || base.requirements) {
      frontmatter.requirements = [
        .../* @__PURE__ */ new Set([...filler.requirements ?? [], ...base.requirements ?? []])
      ];
    }
    if (filler.resources || base.resources) {
      frontmatter.resources = [
        .../* @__PURE__ */ new Set([...filler.resources ?? [], ...base.resources ?? []])
      ];
    }
    if (filler.exports || base.exports) {
      frontmatter.exports = [];
      const ids = base.exports?.map(({ id }) => id) ?? [];
      filler.exports?.forEach((exp) => {
        if (!exp.id || !ids.includes(exp.id)) {
          frontmatter.exports?.push(exp);
        }
      });
      frontmatter.exports?.push(...base.exports ?? []);
    }
    if (filler.downloads || base.downloads) {
      frontmatter.downloads = [];
      const ids = base.downloads?.map(({ id }) => id).filter(Boolean) ?? [];
      const urls = base.downloads?.map(({ url }) => url).filter(Boolean) ?? [];
      filler.downloads?.forEach((download) => {
        if (download.id && !ids.includes(download.id)) {
          frontmatter.downloads?.push(download);
        }
        if (download.url && !urls.includes(download.url)) {
          frontmatter.downloads?.push(download);
        }
      });
      frontmatter.downloads?.push(...base.downloads ?? []);
    }
  }
  return frontmatter;
}

// node_modules/myst-common/dist/indices.js
function parseIndexLine(line, { single, pair, triple, see, seealso }, vfile, node) {
  if (line.trim().length === 0)
    return;
  const splitLine = line.split(/(?<!\\):/).map((val) => val.trim().replace("\\:", ":"));
  if (splitLine.length > 2) {
    fileError(vfile, `Too many colons encountered in index line "${line}"`, {
      node,
      note: 'Index entry must follow pattern "type: entry; sub entry"'
    });
  } else if (splitLine.length === 2) {
    const [entryType, entryValue] = splitLine;
    if (entryType === "single")
      single.push(entryValue);
    else if (entryType === "pair")
      pair.push(entryValue);
    else if (entryType === "triple")
      triple.push(entryValue);
    else if (entryType === "see")
      see.push(entryValue);
    else if (entryType === "seealso")
      seealso.push(entryValue);
    else {
      fileError(vfile, `Unknown index entry type "${entryType}"`, {
        node,
        note: "Allowed types include: single, pair, triple, see, and seealso"
      });
    }
  } else {
    single.push(...splitLine[0].split(/(?<!\\),/).map((val) => val.trim().replace("\\,", ",")));
  }
}
function splitEntryValue(entry) {
  const emphasis = entry.startsWith("!");
  const splitEntry = entry.replace(/^!/, "").replace(/^\\!/, "!").split(/(?<!\\);/).map((val) => val.trim().replace("\\;", ";")).filter((val) => val !== "");
  return { emphasis, splitEntry };
}
function createIndexEntry(entry, sub, emphasis, kind) {
  const subEntry = sub ? { value: sub, kind: kind ?? "entry" } : void 0;
  return { entry, subEntry, emphasis };
}
function createIndexEntries({ single, pair, triple, see, seealso }, vfile, node) {
  const entries = [];
  single.forEach((singleEntry) => {
    const { emphasis, splitEntry } = splitEntryValue(singleEntry);
    if (splitEntry.length !== 1 && splitEntry.length !== 2) {
      fileError(vfile, `Unable to parse index "single" entry "${singleEntry}"`, {
        node,
        note: 'Single index entry must follow pattern "entry" or "entry; sub entry"'
      });
    } else {
      const [entry, subEntry] = splitEntry;
      entries.push(createIndexEntry(entry, subEntry, emphasis));
    }
  });
  pair.forEach((pairEntry) => {
    const { emphasis, splitEntry } = splitEntryValue(pairEntry);
    if (splitEntry.length !== 2) {
      fileError(vfile, `Unable to parse index "pair" entry "${pairEntry}"`, {
        node,
        note: 'Pair index entry must follow pattern "entry; sub entry"'
      });
    } else {
      const [entry, subEntry] = splitEntry;
      entries.push(createIndexEntry(entry, subEntry, emphasis));
      entries.push(createIndexEntry(subEntry, entry, emphasis));
    }
  });
  triple.forEach((tripleEntry) => {
    const { emphasis, splitEntry } = splitEntryValue(tripleEntry);
    if (splitEntry.length !== 3) {
      fileError(vfile, `Unable to parse index "triple" entry "${tripleEntry}"`, {
        node,
        note: 'Triple index entry must follow pattern "entry one; entry two; entry three"'
      });
    } else {
      entries.push(createIndexEntry(splitEntry[0], splitEntry[1], emphasis));
      entries.push(createIndexEntry(splitEntry[1], splitEntry[0], emphasis));
      entries.push(createIndexEntry(splitEntry[1], splitEntry[2], emphasis));
      entries.push(createIndexEntry(splitEntry[2], splitEntry[1], emphasis));
      entries.push(createIndexEntry(splitEntry[0], splitEntry[2], emphasis));
      entries.push(createIndexEntry(splitEntry[2], splitEntry[0], emphasis));
    }
  });
  const addSeeEntry = (seeEntry, kind) => {
    const { emphasis, splitEntry } = splitEntryValue(seeEntry);
    if (splitEntry.length !== 2) {
      fileError(vfile, `Unable to parse index "${kind}" entry "${seeEntry}"`, {
        node,
        note: 'See index entry must follow pattern "entry; sub entry"'
      });
    } else {
      const [entry, subEntry] = splitEntry;
      entries.push(createIndexEntry(entry, subEntry, emphasis, kind));
    }
  };
  see.forEach((seeEntry) => {
    addSeeEntry(seeEntry, "see");
  });
  seealso.forEach((seealsoEntry) => {
    addSeeEntry(seealsoEntry, "seealso");
  });
  if (entries.length === 0) {
    fileError(vfile, "No entries parsed from index directive", { node });
  }
  return entries;
}

// node_modules/myst-common/dist/ruleids.js
var RuleId;
(function(RuleId2) {
  RuleId2["validConfigStructure"] = "valid-config-structure";
  RuleId2["siteConfigExists"] = "site-config-exists";
  RuleId2["projectConfigExists"] = "project-config-exists";
  RuleId2["validSiteConfig"] = "valid-site-config";
  RuleId2["validProjectConfig"] = "valid-project-config";
  RuleId2["configHasNoDeprecatedFields"] = "config-has-no-deprecated-fields";
  RuleId2["frontmatterIsYaml"] = "frontmatter-is-yaml";
  RuleId2["validPageFrontmatter"] = "valid-page-frontmatter";
  RuleId2["validFrontmatterExportList"] = "valid-frontmatter-export-list";
  RuleId2["docxRenders"] = "docx-renders";
  RuleId2["jatsRenders"] = "jats-renders";
  RuleId2["mdRenders"] = "md-renders";
  RuleId2["mecaIncludesJats"] = "meca-includes-jats";
  RuleId2["mecaExportsBuilt"] = "meca-exports-built";
  RuleId2["mecaFilesCopied"] = "meca-files-copied";
  RuleId2["pdfBuildCommandsAvailable"] = "pdf-build-commands-available";
  RuleId2["pdfBuildsWithoutErrors"] = "pdf-builds-without-errors";
  RuleId2["pdfBuilds"] = "pdf-builds";
  RuleId2["texRenders"] = "tex-renders";
  RuleId2["exportExtensionCorrect"] = "export-extension-correct";
  RuleId2["exportArticleExists"] = "export-article-exists";
  RuleId2["texParses"] = "tex-parses";
  RuleId2["jatsParses"] = "jats-parses";
  RuleId2["mystFileLoads"] = "myst-file-loads";
  RuleId2["selectedFileIsProcessed"] = "selected-file-is-processed";
  RuleId2["directiveRegistered"] = "directive-registered";
  RuleId2["directiveKnown"] = "directive-known";
  RuleId2["directiveArgumentCorrect"] = "directive-argument-correct";
  RuleId2["directiveOptionsCorrect"] = "directive-options-correct";
  RuleId2["directiveBodyCorrect"] = "directive-body-correct";
  RuleId2["roleRegistered"] = "role-registered";
  RuleId2["roleKnown"] = "role-known";
  RuleId2["roleBodyCorrect"] = "role-body-correct";
  RuleId2["tocContentsExist"] = "toc-contents-exist";
  RuleId2["encounteredLegacyTOC"] = "encountered-legacy-toc";
  RuleId2["validTOCStructure"] = "valid-toc-structure";
  RuleId2["validTOC"] = "valid-toc";
  RuleId2["imageDownloads"] = "image-downloads";
  RuleId2["imageExists"] = "image-exists";
  RuleId2["imageFormatConverts"] = "image-format-converts";
  RuleId2["imageCopied"] = "image-copied";
  RuleId2["imageFormatOptimizes"] = "image-format-optimizes";
  RuleId2["mathLabelLifted"] = "math-label-lifted";
  RuleId2["mathEquationEnvRemoved"] = "math-equation-env-removed";
  RuleId2["mathEqnarrayReplaced"] = "math-eqnarray-replaced";
  RuleId2["mathAlignmentAdjusted"] = "math-alignment-adjusted";
  RuleId2["mathRenders"] = "math-renders";
  RuleId2["referenceTemplateFills"] = "reference-template-fills";
  RuleId2["identifierIsUnique"] = "identifier-is-unique";
  RuleId2["referenceTargetResolves"] = "reference-target-resolves";
  RuleId2["referenceSyntaxValid"] = "reference-syntax-valid";
  RuleId2["referenceTargetExplicit"] = "reference-target-explicit";
  RuleId2["footnoteReferencesDefinition"] = "footnote-references-definition";
  RuleId2["intersphinxReferencesResolve"] = "intersphinx-references-resolve";
  RuleId2["mystLinkValid"] = "myst-link-valid";
  RuleId2["sphinxLinkValid"] = "sphinx-link-valid";
  RuleId2["rridLinkValid"] = "rrid-link-valid";
  RuleId2["rorLinkValid"] = "ror-link-valid";
  RuleId2["wikipediaLinkValid"] = "wikipedia-link-valid";
  RuleId2["doiLinkValid"] = "doi-link-valid";
  RuleId2["linkResolves"] = "link-resolves";
  RuleId2["linkTextExists"] = "link-text-exists";
  RuleId2["notebookAttachmentsResolve"] = "notebook-attachments-resolve";
  RuleId2["notebookOutputCopied"] = "notebook-output-copied";
  RuleId2["mdastSnippetImports"] = "mdast-snippet-imports";
  RuleId2["includeContentFilters"] = "include-content-filters";
  RuleId2["includeContentLoads"] = "include-content-loads";
  RuleId2["gatedNodesJoin"] = "gated-nodes-join";
  RuleId2["glossaryUsesDefinitionList"] = "glossary-uses-definition-list";
  RuleId2["blockMetadataLoads"] = "block-metadata-loads";
  RuleId2["indexEntriesResolve"] = "index-entries-resolve";
  RuleId2["citationIsUnique"] = "citation-is-unique";
  RuleId2["bibFileExists"] = "bib-file-exists";
  RuleId2["citationRenders"] = "citation-renders";
  RuleId2["codeMetadataLifted"] = "code-metadata-lifted";
  RuleId2["codeMetatagsValid"] = "code-metatags-valid";
  RuleId2["codeLangDefined"] = "code-lang-defined";
  RuleId2["codeMetadataLoads"] = "code-metadata-loads";
  RuleId2["inlineCodeMalformed"] = "inline-code-malformed";
  RuleId2["inlineExpressionRenders"] = "inline-expression-renders";
  RuleId2["staticFileCopied"] = "static-file-copied";
  RuleId2["exportFileCopied"] = "export-file-copied";
  RuleId2["sourceFileCopied"] = "source-file-copied";
  RuleId2["templateFileCopied"] = "template-file-copied";
  RuleId2["staticActionFileCopied"] = "static-action-file-copied";
  RuleId2["pluginLoads"] = "plugin-loads";
  RuleId2["containerChildrenValid"] = "container-children-valid";
  RuleId2["mystJsonValid"] = "myst-json-valid";
  RuleId2["codeCellExecutes"] = "code-cell-executes";
  RuleId2["inlineExpressionExecutes"] = "inline-expression-executes";
})(RuleId || (RuleId = {}));
var RULE_ID_DESCRIPTIONS = {
  // Frontmatter rules
  [RuleId.validConfigStructure]: "Configuration file structure is valid and can be parsed",
  [RuleId.siteConfigExists]: "Site configuration is found in project",
  [RuleId.projectConfigExists]: "Project configuration file exists in the directory",
  [RuleId.validSiteConfig]: "Site configuration passes validation",
  [RuleId.validProjectConfig]: "Project configuration passes validation",
  [RuleId.configHasNoDeprecatedFields]: "Configuration uses current field names without deprecated options",
  [RuleId.frontmatterIsYaml]: "Frontmatter can be parsed as valid YAML",
  [RuleId.validPageFrontmatter]: "Page frontmatter passes validation",
  [RuleId.validFrontmatterExportList]: "Export list in frontmatter is valid for the specified format",
  // Export rules
  [RuleId.docxRenders]: "DOCX document renders without errors",
  [RuleId.jatsRenders]: "JATS XML renders without errors",
  [RuleId.mdRenders]: "Markdown output renders without errors",
  [RuleId.mecaIncludesJats]: "MECA bundle contains required JATS file",
  [RuleId.mecaExportsBuilt]: "MECA archive builds without errors",
  [RuleId.mecaFilesCopied]: "MECA files copy to output successfully",
  [RuleId.pdfBuildCommandsAvailable]: "Required PDF build tools (LaTeX/Typst) are installed",
  [RuleId.pdfBuildsWithoutErrors]: "PDF compilation completes without LaTeX/Typst errors",
  [RuleId.pdfBuilds]: "PDF file generates successfully",
  [RuleId.texRenders]: "LaTeX/Typst document renders without errors",
  [RuleId.exportExtensionCorrect]: "Export file has the correct extension for its format",
  [RuleId.exportArticleExists]: "Article file specified in export configuration exists",
  // Parse rules
  [RuleId.texParses]: "LaTeX content parses without syntax errors",
  [RuleId.jatsParses]: "JATS XML parses without syntax errors",
  [RuleId.mystFileLoads]: "MyST markdown file loads and parses successfully",
  [RuleId.selectedFileIsProcessed]: "File specified for processing is found and processed",
  // Directive and role rules
  [RuleId.directiveRegistered]: "Directive is registered without name conflicts",
  [RuleId.directiveKnown]: "Directive name is recognized",
  [RuleId.directiveArgumentCorrect]: "Directive argument matches specification",
  [RuleId.directiveOptionsCorrect]: "Directive options are valid and properly formatted",
  [RuleId.directiveBodyCorrect]: "Directive body content meets requirements",
  [RuleId.roleRegistered]: "Role is registered without name conflicts",
  [RuleId.roleKnown]: "Role name is recognized",
  [RuleId.roleBodyCorrect]: "Role content meets requirements",
  // Project structure rules
  [RuleId.tocContentsExist]: "Files referenced in table of contents exist",
  [RuleId.encounteredLegacyTOC]: "Table of contents uses deprecated format",
  [RuleId.validTOCStructure]: "Table of contents structure passes schema validation",
  [RuleId.validTOC]: "Table of contents is valid",
  // Image rules
  [RuleId.imageDownloads]: "Remote image downloads successfully",
  [RuleId.imageExists]: "Image file exists at specified path",
  [RuleId.imageFormatConverts]: "Image format converts successfully using available tools",
  [RuleId.imageCopied]: "Image copies to output directory successfully",
  [RuleId.imageFormatOptimizes]: "Image format optimizes successfully",
  // Math rules
  [RuleId.mathLabelLifted]: "Math equation label extracts successfully",
  [RuleId.mathEquationEnvRemoved]: "Nested equation environment removes successfully",
  [RuleId.mathEqnarrayReplaced]: "Deprecated eqnarray environment replaces with align",
  [RuleId.mathAlignmentAdjusted]: "Math alignment adjusts successfully",
  [RuleId.mathRenders]: "Math expression renders with KaTeX without errors",
  // Reference rules
  [RuleId.referenceTemplateFills]: "Reference template populates with values successfully",
  [RuleId.identifierIsUnique]: "Identifier is unique across the project",
  [RuleId.referenceTargetResolves]: "Cross-reference target is found",
  [RuleId.referenceSyntaxValid]: "Reference syntax is valid",
  [RuleId.referenceTargetExplicit]: "Reference target is explicitly specified",
  [RuleId.footnoteReferencesDefinition]: "Footnote reference links to an existing definition",
  [RuleId.intersphinxReferencesResolve]: "Intersphinx cross-reference resolves to external documentation",
  // Link rules
  [RuleId.mystLinkValid]: "MyST-formatted link is valid",
  [RuleId.sphinxLinkValid]: "Sphinx-style link is valid",
  [RuleId.rridLinkValid]: "RRID (Research Resource Identifier) link is valid",
  [RuleId.rorLinkValid]: "ROR (Research Organization Registry) link is valid",
  [RuleId.wikipediaLinkValid]: "Wikipedia link is valid",
  [RuleId.doiLinkValid]: "DOI (Digital Object Identifier) link is valid",
  [RuleId.linkResolves]: "Link URL resolves successfully",
  [RuleId.linkTextExists]: "Link has non-empty text content",
  // Notebook rules
  [RuleId.notebookAttachmentsResolve]: "Jupyter notebook attachments resolve and decode successfully",
  [RuleId.notebookOutputCopied]: "Notebook cell output copies to disk successfully",
  // Content rules
  [RuleId.mdastSnippetImports]: "MDAST snippet imports successfully",
  [RuleId.includeContentFilters]: "Include directive filters apply correctly",
  [RuleId.includeContentLoads]: "Include directive loads target file successfully without circular dependencies",
  [RuleId.gatedNodesJoin]: "Conditional content nodes merge correctly",
  [RuleId.glossaryUsesDefinitionList]: "Glossary directive contains a definition list",
  [RuleId.blockMetadataLoads]: "Block-level metadata loads and parses successfully",
  [RuleId.indexEntriesResolve]: "Index entries resolve successfully",
  // Citation rules
  [RuleId.citationIsUnique]: "Citation identifier is unique across bibliography files",
  [RuleId.bibFileExists]: "Bibliography file specified in configuration exists",
  [RuleId.citationRenders]: "Citation processes with citation-js successfully",
  // Code rules
  [RuleId.codeMetadataLifted]: "Code cell metadata extracts without conflicts",
  [RuleId.codeMetatagsValid]: "Code cell tags are valid",
  [RuleId.codeLangDefined]: "Code block has a language specified",
  [RuleId.codeMetadataLoads]: "Code metadata loads successfully",
  [RuleId.inlineCodeMalformed]: "Inline code has either value or children but not both",
  [RuleId.inlineExpressionRenders]: "Inline expression evaluates successfully",
  // Static file rules
  [RuleId.staticFileCopied]: "Static file copies to output successfully",
  [RuleId.exportFileCopied]: "Export output file copies to public directory successfully",
  [RuleId.sourceFileCopied]: "Source file copies to output successfully",
  [RuleId.templateFileCopied]: "Template file copies successfully",
  [RuleId.staticActionFileCopied]: "Static action file copies successfully",
  // Plugins
  [RuleId.pluginLoads]: "Plugin loads and executes without errors",
  // Container rules
  [RuleId.containerChildrenValid]: "Container has valid child elements",
  // File rules
  [RuleId.mystJsonValid]: "MyST JSON file is valid",
  [RuleId.codeCellExecutes]: "Code cell executes without errors",
  [RuleId.inlineExpressionExecutes]: "Inline expression evaluates without errors"
};

// node_modules/unist-util-visit-parents/lib/color.js
function color(d) {
  return "\x1B[33m" + d + "\x1B[39m";
}

// node_modules/unist-util-visit-parents/lib/index.js
var CONTINUE = true;
var EXIT = false;
var SKIP = "skip";
var visitParents = (
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Test} test
   * @param {Visitor<Node>} visitor
   * @param {boolean | null | undefined} [reverse]
   * @returns {void}
   */
  (function(tree, test2, visitor, reverse) {
    if (typeof test2 === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test2;
      test2 = null;
    }
    const is2 = convert(test2);
    const step = reverse ? -1 : 1;
    factory(tree, void 0, [])();
    function factory(node, index2, parents) {
      const value = node && typeof node === "object" ? node : {};
      if (typeof value.type === "string") {
        const name2 = (
          // `hast`
          typeof value.tagName === "string" ? value.tagName : (
            // `xast`
            typeof value.name === "string" ? value.name : void 0
          )
        );
        Object.defineProperty(visit3, "name", {
          value: "node (" + color(node.type + (name2 ? "<" + name2 + ">" : "")) + ")"
        });
      }
      return visit3;
      function visit3() {
        let result = [];
        let subresult;
        let offset;
        let grandparents;
        if (!test2 || is2(node, index2, parents[parents.length - 1] || null)) {
          result = toResult(visitor(node, parents));
          if (result[0] === EXIT) {
            return result;
          }
        }
        if (node.children && result[0] !== SKIP) {
          offset = (reverse ? node.children.length : -1) + step;
          grandparents = parents.concat(node);
          while (offset > -1 && offset < node.children.length) {
            subresult = factory(node.children[offset], offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
        return result;
      }
    }
  })
);
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return [value];
}

// node_modules/unist-util-visit/lib/index.js
var visit = (
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Test} test
   * @param {Visitor} visitor
   * @param {boolean | null | undefined} [reverse]
   * @returns {void}
   */
  (function(tree, test2, visitor, reverse) {
    if (typeof test2 === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test2;
      test2 = null;
    }
    visitParents(tree, test2, overload, reverse);
    function overload(node, parents) {
      const parent2 = parents[parents.length - 1];
      return visitor(
        node,
        parent2 ? parent2.children.indexOf(node) : null,
        parent2
      );
    }
  })
);

// node_modules/myst-common/dist/types.js
var NotebookCell;
(function(NotebookCell2) {
  NotebookCell2["content"] = "notebook-content";
  NotebookCell2["code"] = "notebook-code";
})(NotebookCell || (NotebookCell = {}));
var NotebookCellTags;
(function(NotebookCellTags2) {
  NotebookCellTags2["removeStderr"] = "remove-stderr";
  NotebookCellTags2["removeStdout"] = "remove-stdout";
  NotebookCellTags2["hideCell"] = "hide-cell";
  NotebookCellTags2["hideInput"] = "hide-input";
  NotebookCellTags2["hideOutput"] = "hide-output";
  NotebookCellTags2["removeCell"] = "remove-cell";
  NotebookCellTags2["removeInput"] = "remove-input";
  NotebookCellTags2["removeOutput"] = "remove-output";
  NotebookCellTags2["scrollOutput"] = "scroll-output";
  NotebookCellTags2["skipExecution"] = "skip-execution";
  NotebookCellTags2["raisesException"] = "raises-exception";
})(NotebookCellTags || (NotebookCellTags = {}));
var ParseTypesEnum;
(function(ParseTypesEnum2) {
  ParseTypesEnum2["string"] = "string";
  ParseTypesEnum2["number"] = "number";
  ParseTypesEnum2["boolean"] = "boolean";
  ParseTypesEnum2["parsed"] = "parsed";
})(ParseTypesEnum || (ParseTypesEnum = {}));
var TargetKind;
(function(TargetKind2) {
  TargetKind2["heading"] = "heading";
  TargetKind2["equation"] = "equation";
  TargetKind2["subequation"] = "subequation";
  TargetKind2["figure"] = "figure";
  TargetKind2["table"] = "table";
  TargetKind2["code"] = "code";
})(TargetKind || (TargetKind = {}));
var AdmonitionKind;
(function(AdmonitionKind2) {
  AdmonitionKind2["admonition"] = "admonition";
  AdmonitionKind2["attention"] = "attention";
  AdmonitionKind2["caution"] = "caution";
  AdmonitionKind2["danger"] = "danger";
  AdmonitionKind2["error"] = "error";
  AdmonitionKind2["important"] = "important";
  AdmonitionKind2["hint"] = "hint";
  AdmonitionKind2["note"] = "note";
  AdmonitionKind2["seealso"] = "seealso";
  AdmonitionKind2["tip"] = "tip";
  AdmonitionKind2["warning"] = "warning";
})(AdmonitionKind || (AdmonitionKind = {}));

// node_modules/myst-directives/dist/utils.js
function classDirectiveOption(nodeType = "node") {
  return {
    class: {
      type: String,
      doc: `Annotate the ${nodeType} with a set of space-delimited class names.`
    }
  };
}
function labelDirectiveOption(nodeType = "node") {
  return {
    label: {
      type: String,
      alias: ["name"],
      doc: `Label the ${nodeType} to be cross-referenced or explicitly linked to.`
    }
  };
}
function enumerationDirectiveOptions(nodeType = "node") {
  return {
    enumerated: {
      type: Boolean,
      alias: ["numbered"],
      doc: `Turn on/off the numbering for the specific ${nodeType}`
    },
    enumerator: {
      type: String,
      alias: ["number"],
      doc: `Explicitly set the ${nodeType} number`
    }
  };
}
function commonDirectiveOptions(nodeType = "node") {
  return {
    ...classDirectiveOption(nodeType),
    ...labelDirectiveOption(nodeType),
    ...enumerationDirectiveOptions(nodeType)
  };
}
function addClassOptions(data, node) {
  if (typeof data.options?.class === "string") {
    node.class = data.options.class;
  }
  return node;
}
function addLabelOptions(data, node) {
  const { label, identifier } = normalizeLabel(data.options?.label) || {};
  if (label)
    node.label = label;
  if (identifier)
    node.identifier = identifier;
  return node;
}
function addEnumerationOptions(data, node) {
  if (typeof data.options?.enumerated === "boolean") {
    node.enumerated = data.options.enumerated;
  }
  if (data.options?.enumerator) {
    node.enumerator = data.options.enumerator;
  }
  return node;
}
function addCommonDirectiveOptions(data, node) {
  addClassOptions(data, node);
  addLabelOptions(data, node);
  addEnumerationOptions(data, node);
  return node;
}

// node_modules/myst-directives/dist/admonition.js
var admonitionDirective = {
  name: "admonition",
  doc: 'Callouts, or "admonitions", highlight a particular block of text that exists slightly apart from the narrative of your page, such as a note or a warning. \n\n The admonition kind can be determined by the directive name used (e.g. `:::{tip}` or `:::{note}`).',
  alias: [
    "attention",
    "caution",
    "danger",
    "error",
    "important",
    "hint",
    "note",
    "seealso",
    "tip",
    "warning"
  ],
  arg: {
    type: "myst",
    doc: "The optional title of the admonition, if not supplied the admonition kind will be used.\n\nNote that the argument parsing is different from Sphinx, which does not allow named admonitions to have custom titles."
  },
  options: {
    ...commonDirectiveOptions("admonition"),
    class: {
      type: String,
      doc: `CSS classes to add to your admonition. Special classes include:

- \`dropdown\`: turns the admonition into a \`<details>\` html element
- \`simple\`: an admonition with "simple" styles
- the name of an admonition, the first valid admonition name encountered will be used (e.g. \`tip\`). Note that if you provide conflicting class names, the first valid admonition name will be used.`
    },
    icon: {
      type: Boolean,
      doc: "Setting icon to false will hide the icon."
      // class_option: list of strings?
    },
    open: {
      type: Boolean,
      doc: "Turn the admonition into a dropdown, if it isn't already, and set the open state."
    }
  },
  body: {
    type: "myst",
    doc: "The body of the admonition. If there is no title and the body starts with bold text or a heading, that content will be used as the admonition title."
  },
  run(data) {
    const children = [];
    if (data.arg) {
      children.push({
        type: data.body ? "admonitionTitle" : "paragraph",
        children: data.arg
      });
    }
    if (data.body) {
      children.push(...data.body);
    }
    const admonition = {
      type: "admonition",
      kind: data.name !== "admonition" ? data.name : void 0,
      children
    };
    if (data.options?.icon === false) {
      admonition.icon = false;
    }
    addCommonDirectiveOptions(data, admonition);
    if (typeof data.options?.open === "boolean") {
      if (!admonition.class?.split(" ").includes("dropdown")) {
        admonition.class = `${admonition.class ?? ""} dropdown`.trim();
      }
      if (data.options?.open)
        admonition.open = true;
    }
    return [admonition];
  }
};

// node_modules/myst-directives/dist/bibliography.js
var bibliographyDirective = {
  name: "bibliography",
  options: {
    ...commonDirectiveOptions("bibliography"),
    filter: {
      type: String
    }
  },
  run(data) {
    const bibliography = {
      type: "bibliography",
      filter: data.options?.filter
    };
    addCommonDirectiveOptions(data, bibliography);
    return [bibliography];
  }
};

// node_modules/myst-directives/node_modules/nanoid/index.js
import { webcrypto as crypto2 } from "node:crypto";

// node_modules/myst-directives/node_modules/nanoid/url-alphabet/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// node_modules/myst-directives/node_modules/nanoid/index.js
var POOL_SIZE_MULTIPLIER2 = 128;
var pool2;
var poolOffset2;
function fillPool2(bytes) {
  if (!pool2 || pool2.length < bytes) {
    pool2 = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER2);
    crypto2.getRandomValues(pool2);
    poolOffset2 = 0;
  } else if (poolOffset2 + bytes > pool2.length) {
    crypto2.getRandomValues(pool2);
    poolOffset2 = 0;
  }
  poolOffset2 += bytes;
}
function nanoid(size = 21) {
  fillPool2(size |= 0);
  let id = "";
  for (let i = poolOffset2 - size; i < poolOffset2; i++) {
    id += urlAlphabet[pool2[i] & 63];
  }
  return id;
}

// node_modules/myst-directives/dist/code.js
function parseEmphasizeLines(data, vfile, emphasizeLinesString) {
  const { node } = data;
  if (!emphasizeLinesString)
    return void 0;
  const result = /* @__PURE__ */ new Set();
  for (const part of emphasizeLinesString.split(",")) {
    const trimmed = part.trim();
    const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start <= end) {
        for (let i = start; i <= end; i++) {
          result.add(i);
        }
        continue;
      } else {
        fileWarn(vfile, `Invalid emphasize-lines range "${trimmed}" (start > end)`, {
          node,
          source: "code-block:options",
          ruleId: RuleId.directiveOptionsCorrect
        });
        continue;
      }
    }
    if (/^\d+$/.test(trimmed)) {
      result.add(Number(trimmed));
    } else if (trimmed !== "") {
      fileWarn(vfile, `Invalid emphasize-lines value "${trimmed}"`, {
        node,
        source: "code-block:options",
        ruleId: RuleId.directiveOptionsCorrect
      });
    }
  }
  if (result.size === 0)
    return void 0;
  return Array.from(result).sort((a, b) => a - b);
}
function getCodeBlockOptions(data, vfile, defaultFilename) {
  const { options, node } = data;
  if (options?.["lineno-start"] != null && options?.["number-lines"] != null) {
    fileWarn(vfile, 'Cannot use both "lineno-start" and "number-lines"', {
      node: select('mystOption[name="number-lines"]', node) ?? node,
      source: "code-block:options",
      ruleId: RuleId.directiveOptionsCorrect
    });
  }
  const emphasizeLines = parseEmphasizeLines(data, vfile, options?.["emphasize-lines"]);
  const numberLines = options?.["number-lines"];
  const showLineNumbers = options?.linenos || options?.["lineno-start"] || options?.["lineno-match"] || numberLines ? true : void 0;
  let startingLineNumber = numberLines != null && numberLines > 1 ? numberLines : options?.["lineno-start"];
  if (options?.["lineno-match"]) {
    startingLineNumber = "match";
  } else if (startingLineNumber == null || startingLineNumber <= 1) {
    startingLineNumber = void 0;
  }
  let filename = options?.["filename"];
  if (filename?.toLowerCase() === "false") {
    filename = void 0;
  } else if (!filename && defaultFilename) {
    filename = defaultFilename;
  }
  return {
    emphasizeLines,
    showLineNumbers,
    startingLineNumber,
    filename
  };
}
var CODE_DIRECTIVE_OPTIONS = {
  caption: {
    type: "myst",
    doc: "A parsed caption for the code block."
  },
  linenos: {
    type: Boolean,
    doc: "Show line numbers"
  },
  "lineno-start": {
    type: Number,
    doc: "Start line numbering from a particular value, default is 1. If present, line numbering is activated."
  },
  "number-lines": {
    type: Number,
    doc: 'Alternative for "lineno-start", turns on line numbering and can be an integer that is the start of the line numbering.'
  },
  "emphasize-lines": {
    type: String,
    doc: 'Emphasize particular lines (comma-separated numbers which can include ranges), e.g. "3,5,7-9"'
  },
  filename: {
    type: String,
    doc: "Show the filename in addition to the rendered code. The `include` directive will use the filename by default, to turn off this default set the filename to `false`."
  }
  // dedent: {
  //   type: Number,
  //   doc: 'Strip indentation characters from the code block',
  // },
  // force: {
  //   type: Boolean,
  //   doc: 'Ignore minor errors on highlighting',
  // },
};
function parseTags(input, vfile, node) {
  if (!input)
    return void 0;
  if (typeof input === "string" && input.startsWith("[") && input.endsWith("]")) {
    try {
      return parseTags(jsYaml.load(input), vfile, node);
    } catch (error) {
      fileError(vfile, "Could not load tags for code-cell directive", {
        node: select('mystOption[name="tags"]', node) ?? node,
        source: "code-cell:tags",
        ruleId: RuleId.directiveOptionsCorrect
      });
      return void 0;
    }
  }
  if (typeof input === "string") {
    const tags2 = input.split(/[,\s]/).map((t) => t.trim()).filter((t) => !!t);
    return tags2.length > 0 ? tags2 : void 0;
  }
  if (!Array.isArray(input))
    return void 0;
  const tags = input;
  if (tags && Array.isArray(tags) && tags.every((t) => typeof t === "string")) {
    if (tags.length > 0) {
      return tags.map((t) => t.trim()).filter((t) => !!t);
    }
  } else if (tags) {
    fileWarn(vfile, "tags in code-cell directive must be a list of strings", {
      node: select('mystOption[name="tags"]', node) ?? node,
      source: "code-cell:tags",
      ruleId: RuleId.directiveOptionsCorrect
    });
    return void 0;
  }
}
var codeDirective = {
  name: "code",
  doc: "A code-block environment with a language as the argument, and options for highlighting, showing line numbers, and an optional filename.",
  alias: ["code-block", "sourcecode"],
  arg: {
    type: String,
    doc: "Code language, for example `python` or `typescript`"
  },
  options: {
    ...commonDirectiveOptions("code"),
    ...CODE_DIRECTIVE_OPTIONS
  },
  body: {
    type: String,
    doc: "The raw code to display for the code block."
  },
  run(data, vfile) {
    const opts = getCodeBlockOptions(data, vfile);
    const code = {
      type: "code",
      lang: data.arg,
      ...opts,
      value: data.body
    };
    if (!data.options?.caption) {
      addCommonDirectiveOptions(data, code);
      return [code];
    }
    const caption = {
      type: "caption",
      children: [
        {
          type: "paragraph",
          children: data.options.caption
        }
      ]
    };
    const container = {
      type: "container",
      kind: "code",
      children: [code, caption]
    };
    addCommonDirectiveOptions(data, container);
    return [container];
  }
};
var codeCellDirective = {
  name: "code-cell",
  doc: "An executable code cell",
  arg: {
    type: String,
    doc: "Language for execution and display, for example `python`. It will default to the language of the notebook or containing markdown file."
  },
  options: {
    ...commonDirectiveOptions("code-cell"),
    caption: {
      type: "myst",
      doc: "A parsed caption for the code output."
    },
    tags: {
      type: String,
      alias: ["tag"],
      doc: "A comma-separated list of tags to add to the cell, for example, `remove-input` or `hide-cell`."
    }
  },
  body: {
    type: String,
    doc: "The code to be executed and displayed."
  },
  run(data, vfile) {
    const code = {
      type: "code",
      lang: data.arg,
      executable: true,
      value: data.body ?? ""
    };
    const outputs = {
      type: "outputs",
      id: nanoid(),
      children: []
    };
    const block = {
      type: "block",
      kind: NotebookCell.code,
      children: [code, outputs],
      data: {}
    };
    addCommonDirectiveOptions(data, block);
    if (data.options?.caption) {
      block.data.caption = [{ type: "paragraph", children: data.options.caption }];
    }
    const tags = parseTags(data.options?.tags, vfile, data.node);
    if (tags)
      block.data.tags = tags;
    return [block];
  }
};

// node_modules/myst-directives/dist/dropdown.js
var dropdownDirective = {
  name: "dropdown",
  arg: {
    type: "myst"
  },
  options: {
    ...commonDirectiveOptions("dropdown"),
    // TODO: Add enumeration in future
    open: {
      type: Boolean,
      doc: "When true, the dropdown starts open."
    }
    // Legacy options we may want to implement:
    // color
    // icon
    // animate
    // margin
    // name
    // 'class-container'
    // 'class-title'
    // 'class-body'
  },
  body: {
    type: "myst",
    required: true
  },
  run(data) {
    const children = [];
    if (data.arg) {
      children.push({ type: "summary", children: data.arg });
    }
    children.push(...data.body);
    const details = {
      type: "details",
      open: data.options?.open,
      children
    };
    addCommonDirectiveOptions(data, details);
    return [details];
  }
};

// node_modules/myst-directives/dist/embed.js
var embedDirective = {
  name: "embed",
  doc: "The embed directive allows you to duplicate content from another part of your project. This can also be done through the figure directive.",
  arg: {
    type: String,
    doc: "The label of the node that you are embedding.",
    required: true
  },
  options: {
    ...commonDirectiveOptions("embed"),
    "remove-input": {
      type: Boolean,
      doc: "If embedding a Jupyter Notebook cell, remove the input of the cell."
    },
    "remove-output": {
      type: Boolean,
      doc: "If embedding a Jupyter Notebook cell, remove the output of the cell."
    }
  },
  run(data) {
    if (!data.arg)
      return [];
    const argString = data.arg;
    const arg = argString.startsWith("#") ? argString.substring(1) : argString;
    const { label } = normalizeLabel(arg) || {};
    if (!label)
      return [];
    const embed = {
      type: "embed",
      source: { label },
      "remove-input": data.options?.["remove-input"],
      "remove-output": data.options?.["remove-output"]
    };
    addCommonDirectiveOptions(data, embed);
    return [embed];
  }
};

// node_modules/myst-directives/dist/figure.js
var figureDirective = {
  name: "figure",
  arg: {
    type: String,
    doc: "The filename of an image (e.g. `my-fig.png`), or an ID of a Jupyter Notebook cell (e.g. `#my-cell`)."
  },
  options: {
    ...commonDirectiveOptions("figure"),
    class: {
      type: String,
      alias: ["figclass"],
      doc: `CSS classes to add to your figure. Special classes include:

- \`full-width\`: changes the figure environment to cover two columns in LaTeX`
    },
    height: {
      type: String,
      doc: "The figure height, in CSS units, for example `4em` or `300px`.",
      alias: ["h"]
    },
    width: {
      type: String,
      // TODO: validate that this is a CSS width
      alias: ["w", "figwidth"],
      doc: "The figure width, in CSS units, for example `50%` or `300px`."
    },
    alt: {
      type: String,
      doc: "Alternative text for the image"
    },
    // scale: {
    //   type: Number,
    // },
    // target: {
    //   type: String,
    // },
    align: {
      type: String,
      doc: "The alignment of the image in the figure. Choose one of `left`, `center` or `right`"
      // TODO: this is not implemented below
      // choice(["left", "center", "right"])
    },
    "remove-input": {
      type: Boolean,
      doc: "If the argument is a notebook cell, use this flag to remove the input code from the cell."
    },
    "remove-output": {
      type: Boolean,
      doc: "If the argument is a notebook cell, use this flag to remove the output from the cell."
    },
    placeholder: {
      type: String,
      doc: "A placeholder image when using a notebook cell as the figure contents. This will be shown in place of the Jupyter output until an execution environment is attached. It will also be used in static outputs, such as a PDF output."
    },
    "no-subfigures": {
      type: Boolean,
      doc: "Disallow implicit subfigure creation from child nodes",
      alias: ["no-subfig", "no-subfigure"]
    },
    kind: {
      type: String,
      doc: 'Override the figures "kind", which changes the enumeration to start counting independently for that kind. For example, `kind: "example"`. The default enumeration and referencing will be the capitalized `kind` followed by a number (e.g. "Example 1").'
    }
  },
  body: {
    type: "myst",
    doc: "If an argument is provided to the figure directive, the body will be the figure caption. You may also omit the figure directive argument and provide images in the body of the figure, these will be parsed into sub figures."
  },
  run(data) {
    const children = [];
    if (data.arg) {
      children.push({
        type: "image",
        url: data.arg,
        alt: data.options?.alt,
        width: data.options?.width,
        height: data.options?.height,
        align: data.options?.align,
        // These will pass through if the node is converted to an embed node in the image transform
        "remove-input": data.options?.["remove-input"],
        "remove-output": data.options?.["remove-output"]
      });
    }
    if (data.options?.placeholder) {
      children.push({
        type: "image",
        placeholder: true,
        url: data.options.placeholder,
        alt: data.options?.alt,
        width: data.options?.width,
        height: data.options?.height,
        align: data.options?.align
      });
    }
    if (data.body) {
      children.push(...data.body);
    }
    const container = {
      type: "container",
      kind: data.options?.kind || "figure",
      children
    };
    addCommonDirectiveOptions(data, container);
    if (data.options?.["no-subfigures"]) {
      container.noSubcontainers = true;
    }
    return [container];
  }
};

// node_modules/myst-directives/dist/iframe.js
var iframeDirective = {
  name: "iframe",
  arg: {
    type: String,
    doc: "The URL source (`src`) of the HTML iframe element.",
    required: true
  },
  options: {
    ...commonDirectiveOptions("iframe"),
    width: {
      type: String,
      doc: "The iframe width, in CSS units, for example `50%` or `300px`."
    },
    align: {
      type: String,
      doc: "The alignment of the iframe in the page. Choose one of `left`, `center` or `right`"
    },
    title: {
      type: String,
      doc: "The title attribute for the iframe element, describing its content for accessibility."
    },
    placeholder: {
      type: String,
      doc: "A placeholder image for the iframe in static exports."
    }
  },
  body: { type: "myst", doc: "If provided, this will be the iframe caption." },
  run(data) {
    const iframe = {
      type: "iframe",
      src: data.arg,
      width: data.options?.width,
      align: data.options?.align,
      title: data.options?.title
    };
    if (data.options?.placeholder) {
      iframe.children = [
        {
          type: "image",
          placeholder: true,
          url: data.options.placeholder,
          alt: data.options?.alt,
          width: data.options?.width,
          height: data.options?.height,
          align: data.options?.align
        }
      ];
    }
    if (!data.body) {
      addCommonDirectiveOptions(data, iframe);
      return [iframe];
    }
    const container = {
      type: "container",
      kind: "figure",
      children: [iframe, { type: "caption", children: data.body }]
    };
    addCommonDirectiveOptions(data, container);
    return [container];
  }
};

// node_modules/myst-directives/dist/image.js
var imageDirective = {
  name: "image",
  arg: {
    type: String,
    doc: "The filename of an image (e.g. `my-fig.png`).",
    required: true
  },
  options: {
    ...commonDirectiveOptions("image"),
    height: {
      type: String,
      doc: "The image height, in CSS units, for example `4em` or `300px`.",
      alias: ["h"]
    },
    width: {
      type: String,
      alias: ["w"],
      doc: "The image width, in CSS units, for example `50%` or `300px`."
    },
    alt: {
      type: String,
      doc: "Alternative text for the image"
    },
    // scale: {
    //   type: Number,
    // },
    // target: {
    //   type: String,
    // },
    align: {
      type: String,
      // choice(["left", "center", "right", "top", "middle", "bottom"])
      doc: "The alignment of the image. Choose one of `left`, `center` or `right`"
    },
    title: {
      type: String,
      doc: "Title text for the image"
    }
  },
  run(data) {
    const { alt, height, width, align, title } = data.options || {};
    const image = {
      type: "image",
      url: data.arg,
      alt: alt ?? (data.body ? toText(data.body) : void 0),
      title,
      height,
      width,
      align: align ?? "center"
    };
    addCommonDirectiveOptions(data, image);
    return [image];
  }
};

// node_modules/myst-directives/dist/include.js
var includeDirective = {
  name: "include",
  alias: ["literalinclude"],
  doc: "Allows you to include the source or parsed version of a separate file into your document tree.",
  arg: {
    type: String,
    doc: "The file path, which is relative to the file from which it was referenced.",
    required: true
  },
  options: {
    ...commonDirectiveOptions("include"),
    literal: {
      type: Boolean,
      doc: "Flag the include block as literal, and show the contents as a code block. This can also be set automatically by setting the `language` or using the `literalinclude` directive."
    },
    lang: {
      type: String,
      doc: "The language of the code to be highlighted as. If set, this automatically changes an `include` into a `literalinclude`.",
      alias: ["language", "code"]
    },
    ...CODE_DIRECTIVE_OPTIONS,
    "start-line": {
      type: Number,
      doc: "Only the content starting from this line will be included. The first line has index 0 and negative values count from the end."
    },
    "start-at": {
      type: String,
      doc: "Only the content after and including the first occurrence of the specified text in the external data file will be included."
    },
    "start-after": {
      type: String,
      doc: "Only the content after the first occurrence of the specified text in the external data file will be included."
    },
    "end-line": {
      type: Number,
      doc: "Only the content up to (but excluding) this line will be included."
    },
    "end-at": {
      type: String,
      doc: "Only the content up to and including the first occurrence of the specified text in the external data file (but after any start-after text) will be included."
    },
    "end-before": {
      type: String,
      doc: "Only the content before the first occurrence of the specified text in the external data file (but after any start-after text) will be included."
    },
    lines: {
      type: String,
      doc: "Specify exactly which lines to include from the original file, starting at 1. For example, `1,3,5-10,20-` includes the lines 1, 3, 5 to 10 and lines 20 to the last line of the original file."
    },
    "lineno-match": {
      type: Boolean,
      doc: "Display the original line numbers, correct only when the selection consists of contiguous lines."
    }
  },
  run(data, vfile) {
    const literal = data.name === "literalinclude" || !!data.options?.literal || !!data.options?.lang;
    const file = data.arg;
    const lang = data.options?.lang ?? extToLanguage(file.split(".").pop());
    const opts = literal ? getCodeBlockOptions(
      data,
      vfile,
      // Set the filename in the literal include by default
      file.split(/\/|\\/).pop()
    ) : {};
    const caption = literal ? data.options?.caption : void 0;
    const filter = {};
    ensureOnlyOneOf(data, vfile, ["start-at", "start-line", "start-after", "lines"]);
    ensureOnlyOneOf(data, vfile, ["end-at", "end-line", "end-before", "lines"]);
    filter.startAt = data.options?.["start-at"];
    filter.startAfter = data.options?.["start-after"];
    filter.endAt = data.options?.["end-at"];
    filter.endBefore = data.options?.["end-before"];
    if (data.options?.lines) {
      filter.lines = parseLinesString(vfile, select('mystOption[name="lines"]', data.node) ?? void 0, data.options?.lines);
    } else {
      const startLine = data.options?.["start-line"];
      const endLine = data.options?.["end-line"];
      const lines = [];
      if (startLine != null)
        lines.push(startLine);
      if (startLine == null && endLine != null)
        lines.push(0);
      if (endLine != null)
        lines.push(endLine);
      if (lines.length > 0) {
        filter.lines = [
          lines.map((n) => {
            if (n >= 0)
              return n + 1;
            return n;
          })
        ];
      }
    }
    const usesFilter = Object.values(filter).some((value) => value !== void 0);
    const include = {
      type: "include",
      file,
      literal,
      lang,
      caption,
      filter: usesFilter ? filter : void 0,
      ...opts
    };
    addCommonDirectiveOptions(data, include);
    return [include];
  }
};
function parseLinesString(vfile, node, linesString) {
  if (!linesString)
    return void 0;
  return linesString.split(",").map((l) => {
    const line = l.trim();
    const match = line.match(/^([0-9]+)(?:\s*(-)\s*([0-9]+)?)?$/);
    if (!match) {
      fileWarn(vfile, `Unknown lines match "${line}"`, {
        node,
        ruleId: RuleId.directiveOptionsCorrect
      });
      return void 0;
    }
    const [, first, dash, last] = match;
    if (!dash && !last) {
      return Number.parseInt(first);
    }
    if (dash && !last) {
      return [Number.parseInt(first)];
    }
    return [Number.parseInt(first), Number.parseInt(last)];
  }).filter((l) => !!l);
}
function ensureOnlyOneOf(data, vfile, exclusive) {
  const { options, node } = data;
  if (!options)
    return;
  const set1 = new Set(exclusive);
  const set2 = new Set(Object.keys(options));
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  if (intersection.size > 1) {
    fileWarn(vfile, `Conflicting options for directive: ["${[...intersection].join('", "')}"]`, {
      node,
      note: `Choose a single option out of ["${[...exclusive].join('", "')}"]`,
      ruleId: RuleId.directiveOptionsCorrect
    });
  }
}
function extToLanguage(ext) {
  return {
    ts: "typescript",
    js: "javascript",
    mjs: "javascript",
    tex: "latex",
    py: "python",
    md: "markdown",
    yml: "yaml"
  }[ext ?? ""] ?? ext;
}

// node_modules/myst-directives/dist/indices.js
function warnOnOptionSyntax(option, value, vfile, node) {
  fileError(vfile, `Index entry definitions should not use :option: syntax`, {
    node,
    note: `Replace ":${option}: ${value}" with "${option}: ${value}"`
  });
}
var indexDirective = {
  name: "index",
  arg: {
    type: String
  },
  options: {
    single: {
      type: String
    },
    pair: {
      type: String
    },
    triple: {
      type: String
    },
    see: {
      type: String
    },
    seealso: {
      type: String,
      alias: ["seeAlso", "see-also"]
    },
    label: {
      type: String,
      alias: ["name"]
    }
  },
  body: {
    type: String
  },
  run(data, vfile) {
    const values = { single: [], pair: [], triple: [], see: [], seealso: [] };
    if (data.arg)
      parseIndexLine(data.arg, values, vfile, data.node);
    if (data.options?.single) {
      warnOnOptionSyntax("single", data.options.single, vfile, data.node);
      values.single.push(data.options.single);
    }
    if (data.options?.pair) {
      warnOnOptionSyntax("pair", data.options.pair, vfile, data.node);
      values.pair.push(data.options.pair);
    }
    if (data.options?.triple) {
      warnOnOptionSyntax("triple", data.options.triple, vfile, data.node);
      values.triple.push(data.options.triple);
    }
    if (data.options?.see) {
      warnOnOptionSyntax("see", data.options.see, vfile, data.node);
      values.see.push(data.options.see);
    }
    if (data.options?.seealso) {
      warnOnOptionSyntax("seealso", data.options.seealso, vfile, data.node);
      values.seealso.push(data.options.seealso);
    }
    if (data.body) {
      data.body.split("\n").forEach((line) => {
        parseIndexLine(line, values, vfile, data.node);
      });
    }
    const entries = createIndexEntries(values, vfile, data.node);
    const output = [
      {
        type: "mystTarget",
        label: data.options?.label,
        indexEntries: entries
      }
    ];
    return output;
  }
};
var genIndexDirective = {
  name: "show-index",
  alias: ["genindex"],
  arg: {
    type: "myst",
    doc: "Heading to be included in index block"
  },
  run(data) {
    const children = [];
    if (data.arg) {
      const parsedArg = data.arg;
      if (parsedArg[0]?.type === "heading") {
        children.push(...parsedArg);
      } else {
        children.push({
          type: "heading",
          depth: 2,
          enumerated: false,
          children: parsedArg
        });
      }
    }
    return [{ type: "genindex", children }];
  }
};

// node_modules/csv-parse/dist/esm/sync.js
var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var inited = false;
function init() {
  inited = true;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
}
function toByteArray(b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0;
  arr = new Arr(len * 3 / 4 - placeHolders);
  l = placeHolders > 0 ? len - 4 : len;
  var L = 0;
  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 255;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 255;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var output = "";
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 63];
    output += "==";
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 63];
    output += lookup[tmp << 2 & 63];
    output += "=";
  }
  parts.push(output);
  return parts.join("");
}
function read(buffer2, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer2[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer2[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
function write(buffer2, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer2[offset + i - d] |= s * 128;
}
var toString2 = {}.toString;
var isArray = Array.isArray || function(arr) {
  return toString2.call(arr) == "[object Array]";
};
var INSPECT_MAX_BYTES = 50;
Buffer2.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== void 0 ? global$1.TYPED_ARRAY_SUPPORT : true;
kMaxLength();
function kMaxLength() {
  return Buffer2.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError("Invalid typed array length");
  }
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    that = new Uint8Array(length);
    that.__proto__ = Buffer2.prototype;
  } else {
    if (that === null) {
      that = new Buffer2(length);
    }
    that.length = length;
  }
  return that;
}
function Buffer2(arg, encodingOrOffset, length) {
  if (!Buffer2.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer2)) {
    return new Buffer2(arg, encodingOrOffset, length);
  }
  if (typeof arg === "number") {
    if (typeof encodingOrOffset === "string") {
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}
Buffer2.poolSize = 8192;
Buffer2._augment = function(arr) {
  arr.__proto__ = Buffer2.prototype;
  return arr;
};
function from(that, value, encodingOrOffset, length) {
  if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }
  if (typeof value === "string") {
    return fromString(that, value, encodingOrOffset);
  }
  return fromObject(that, value);
}
Buffer2.from = function(value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};
if (Buffer2.TYPED_ARRAY_SUPPORT) {
  Buffer2.prototype.__proto__ = Uint8Array.prototype;
  Buffer2.__proto__ = Uint8Array;
  if (typeof Symbol !== "undefined" && Symbol.species && Buffer2[Symbol.species] === Buffer2) ;
}
function assertSize(size) {
  if (typeof size !== "number") {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}
function alloc(that, size, fill2, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill2 !== void 0) {
    return typeof encoding === "string" ? createBuffer(that, size).fill(fill2, encoding) : createBuffer(that, size).fill(fill2);
  }
  return createBuffer(that, size);
}
Buffer2.alloc = function(size, fill2, encoding) {
  return alloc(null, size, fill2, encoding);
};
function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer2.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}
Buffer2.allocUnsafe = function(size) {
  return allocUnsafe(null, size);
};
Buffer2.allocUnsafeSlow = function(size) {
  return allocUnsafe(null, size);
};
function fromString(that, string, encoding) {
  if (typeof encoding !== "string" || encoding === "") {
    encoding = "utf8";
  }
  if (!Buffer2.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }
  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);
  if (actual !== length) {
    that = that.slice(0, actual);
  }
  return that;
}
function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}
function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength;
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError("'offset' is out of bounds");
  }
  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError("'length' is out of bounds");
  }
  if (byteOffset === void 0 && length === void 0) {
    array = new Uint8Array(array);
  } else if (length === void 0) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    that = array;
    that.__proto__ = Buffer2.prototype;
  } else {
    that = fromArrayLike(that, array);
  }
  return that;
}
function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);
    if (that.length === 0) {
      return that;
    }
    obj.copy(that, 0, 0, len);
    return that;
  }
  if (obj) {
    if (typeof ArrayBuffer !== "undefined" && obj.buffer instanceof ArrayBuffer || "length" in obj) {
      if (typeof obj.length !== "number" || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }
    if (obj.type === "Buffer" && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function checked(length) {
  if (length >= kMaxLength()) {
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
  }
  return length | 0;
}
Buffer2.isBuffer = isBuffer;
function internalIsBuffer(b) {
  return !!(b != null && b._isBuffer);
}
Buffer2.compare = function compare(a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError("Arguments must be Buffers");
  }
  if (a === b) return 0;
  var x = a.length;
  var y = b.length;
  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};
Buffer2.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return true;
    default:
      return false;
  }
};
Buffer2.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }
  if (list.length === 0) {
    return Buffer2.alloc(0);
  }
  var i;
  if (length === void 0) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }
  var buffer2 = Buffer2.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer2, pos);
    pos += buf.length;
  }
  return buffer2;
};
function byteLength(string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== "string") {
    string = "" + string;
  }
  var len = string.length;
  if (len === 0) return 0;
  var loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "ascii":
      case "latin1":
      case "binary":
        return len;
      case "utf8":
      case "utf-8":
      case void 0:
        return utf8ToBytes(string).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return len * 2;
      case "hex":
        return len >>> 1;
      case "base64":
        return base64ToBytes(string).length;
      default:
        if (loweredCase) return utf8ToBytes(string).length;
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer2.byteLength = byteLength;
function slowToString(encoding, start, end) {
  var loweredCase = false;
  if (start === void 0 || start < 0) {
    start = 0;
  }
  if (start > this.length) {
    return "";
  }
  if (end === void 0 || end > this.length) {
    end = this.length;
  }
  if (end <= 0) {
    return "";
  }
  end >>>= 0;
  start >>>= 0;
  if (end <= start) {
    return "";
  }
  if (!encoding) encoding = "utf8";
  while (true) {
    switch (encoding) {
      case "hex":
        return hexSlice(this, start, end);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, start, end);
      case "ascii":
        return asciiSlice(this, start, end);
      case "latin1":
      case "binary":
        return latin1Slice(this, start, end);
      case "base64":
        return base64Slice(this, start, end);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, start, end);
      default:
        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
        encoding = (encoding + "").toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer2.prototype._isBuffer = true;
function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}
Buffer2.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};
Buffer2.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};
Buffer2.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};
Buffer2.prototype.toString = function toString3() {
  var length = this.length | 0;
  if (length === 0) return "";
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};
Buffer2.prototype.equals = function equals(b) {
  if (!internalIsBuffer(b)) throw new TypeError("Argument must be a Buffer");
  if (this === b) return true;
  return Buffer2.compare(this, b) === 0;
};
Buffer2.prototype.inspect = function inspect() {
  var str2 = "";
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str2 = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
    if (this.length > max) str2 += " ... ";
  }
  return "<Buffer " + str2 + ">";
};
Buffer2.prototype.compare = function compare2(target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError("Argument must be a Buffer");
  }
  if (start === void 0) {
    start = 0;
  }
  if (end === void 0) {
    end = target ? target.length : 0;
  }
  if (thisStart === void 0) {
    thisStart = 0;
  }
  if (thisEnd === void 0) {
    thisEnd = this.length;
  }
  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError("out of range index");
  }
  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }
  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target) return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);
  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};
function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
  if (buffer2.length === 0) return -1;
  if (typeof byteOffset === "string") {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 2147483647) {
    byteOffset = 2147483647;
  } else if (byteOffset < -2147483648) {
    byteOffset = -2147483648;
  }
  byteOffset = +byteOffset;
  if (isNaN(byteOffset)) {
    byteOffset = dir ? 0 : buffer2.length - 1;
  }
  if (byteOffset < 0) byteOffset = buffer2.length + byteOffset;
  if (byteOffset >= buffer2.length) {
    if (dir) return -1;
    else byteOffset = buffer2.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1;
  }
  if (typeof val === "string") {
    val = Buffer2.from(val, encoding);
  }
  if (internalIsBuffer(val)) {
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
  } else if (typeof val === "number") {
    val = val & 255;
    if (Buffer2.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === "function") {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
  }
  throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;
  if (encoding !== void 0) {
    encoding = String(encoding).toLowerCase();
    if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }
  function read2(buf, i2) {
    if (indexSize === 1) {
      return buf[i2];
    } else {
      return buf.readUInt16BE(i2 * indexSize);
    }
  }
  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read2(arr, i) === read2(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read2(arr, i + j) !== read2(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }
  return -1;
}
Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}
function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}
function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer2.prototype.write = function write2(string, offset, length, encoding) {
  if (offset === void 0) {
    encoding = "utf8";
    length = this.length;
    offset = 0;
  } else if (length === void 0 && typeof offset === "string") {
    encoding = offset;
    length = this.length;
    offset = 0;
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === void 0) encoding = "utf8";
    } else {
      encoding = length;
      length = void 0;
    }
  } else {
    throw new Error(
      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
    );
  }
  var remaining = this.length - offset;
  if (length === void 0 || length > remaining) length = remaining;
  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError("Attempt to write outside buffer bounds");
  }
  if (!encoding) encoding = "utf8";
  var loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "hex":
        return hexWrite(this, string, offset, length);
      case "utf8":
      case "utf-8":
        return utf8Write(this, string, offset, length);
      case "ascii":
        return asciiWrite(this, string, offset, length);
      case "latin1":
      case "binary":
        return latin1Write(this, string, offset, length);
      case "base64":
        return base64Write(this, string, offset, length);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return ucs2Write(this, string, offset, length);
      default:
        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};
Buffer2.prototype.toJSON = function toJSON() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf);
  } else {
    return fromByteArray(buf.slice(start, end));
  }
}
function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    i += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  var res = "";
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res;
}
function asciiSlice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 127);
  }
  return ret;
}
function latin1Slice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}
function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;
  var out = "";
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}
function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = "";
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}
Buffer2.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === void 0 ? len : ~~end;
  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }
  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }
  if (end < start) end = start;
  var newBuf;
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer2.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer2(sliceLen, void 0);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }
  return newBuf;
};
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
  if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
}
Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) checkOffset(offset, byteLength2, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength2 && (mul *= 256)) {
    val += this[offset + i] * mul;
  }
  return val;
};
Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength2, this.length);
  }
  var val = this[offset + --byteLength2];
  var mul = 1;
  while (byteLength2 > 0 && (mul *= 256)) {
    val += this[offset + --byteLength2] * mul;
  }
  return val;
};
Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};
Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};
Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};
Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
};
Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) checkOffset(offset, byteLength2, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength2 && (mul *= 256)) {
    val += this[offset + i] * mul;
  }
  mul *= 128;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
  return val;
};
Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) checkOffset(offset, byteLength2, this.length);
  var i = byteLength2;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 256)) {
    val += this[offset + --i] * mul;
  }
  mul *= 128;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
  return val;
};
Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 128)) return this[offset];
  return (255 - this[offset] + 1) * -1;
};
Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 32768 ? val | 4294901760 : val;
};
Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 32768 ? val | 4294901760 : val;
};
Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4);
};
Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4);
};
Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8);
};
Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError("Index out of range");
}
Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
    checkInt(this, value, offset, byteLength2, maxBytes, 0);
  }
  var mul = 1;
  var i = 0;
  this[offset] = value & 255;
  while (++i < byteLength2 && (mul *= 256)) {
    this[offset + i] = value / mul & 255;
  }
  return offset + byteLength2;
};
Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
    checkInt(this, value, offset, byteLength2, maxBytes, 0);
  }
  var i = byteLength2 - 1;
  var mul = 1;
  this[offset + i] = value & 255;
  while (--i >= 0 && (mul *= 256)) {
    this[offset + i] = value / mul & 255;
  }
  return offset + byteLength2;
};
Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
  if (!Buffer2.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 255;
  return offset + 1;
};
function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 65535 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}
Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};
Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};
function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 4294967295 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255;
  }
}
Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};
Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};
Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength2 - 1);
    checkInt(this, value, offset, byteLength2, limit - 1, -limit);
  }
  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 255;
  while (++i < byteLength2 && (mul *= 256)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 255;
  }
  return offset + byteLength2;
};
Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength2 - 1);
    checkInt(this, value, offset, byteLength2, limit - 1, -limit);
  }
  var i = byteLength2 - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 255;
  while (--i >= 0 && (mul *= 256)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 255;
  }
  return offset + byteLength2;
};
Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
  if (!Buffer2.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 255 + value + 1;
  this[offset] = value & 255;
  return offset + 1;
};
Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};
Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};
Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};
Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
  if (value < 0) value = 4294967295 + value + 1;
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};
function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError("Index out of range");
  if (offset < 0) throw new RangeError("Index out of range");
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}
Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};
Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}
Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};
Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};
Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;
  if (targetStart < 0) {
    throw new RangeError("targetStart out of bounds");
  }
  if (start < 0 || start >= this.length) throw new RangeError("sourceStart out of bounds");
  if (end < 0) throw new RangeError("sourceEnd out of bounds");
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }
  var len = end - start;
  var i;
  if (this === target && start < targetStart && targetStart < end) {
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1e3 || !Buffer2.TYPED_ARRAY_SUPPORT) {
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }
  return len;
};
Buffer2.prototype.fill = function fill(val, start, end, encoding) {
  if (typeof val === "string") {
    if (typeof start === "string") {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === "string") {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== void 0 && typeof encoding !== "string") {
      throw new TypeError("encoding must be a string");
    }
    if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
  } else if (typeof val === "number") {
    val = val & 255;
  }
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError("Out of range index");
  }
  if (end <= start) {
    return this;
  }
  start = start >>> 0;
  end = end === void 0 ? this.length : end >>> 0;
  if (!val) val = 0;
  var i;
  if (typeof val === "number") {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer2(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }
  return this;
};
var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
function base64clean(str2) {
  str2 = stringtrim(str2).replace(INVALID_BASE64_RE, "");
  if (str2.length < 2) return "";
  while (str2.length % 4 !== 0) {
    str2 = str2 + "=";
  }
  return str2;
}
function stringtrim(str2) {
  if (str2.trim) return str2.trim();
  return str2.replace(/^\s+|\s+$/g, "");
}
function toHex(n) {
  if (n < 16) return "0" + n.toString(16);
  return n.toString(16);
}
function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];
  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);
    if (codePoint > 55295 && codePoint < 57344) {
      if (!leadSurrogate) {
        if (codePoint > 56319) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
          continue;
        } else if (i + 1 === length) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
          continue;
        }
        leadSurrogate = codePoint;
        continue;
      }
      if (codePoint < 56320) {
        if ((units -= 3) > -1) bytes.push(239, 191, 189);
        leadSurrogate = codePoint;
        continue;
      }
      codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
    } else if (leadSurrogate) {
      if ((units -= 3) > -1) bytes.push(239, 191, 189);
    }
    leadSurrogate = null;
    if (codePoint < 128) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 2048) {
      if ((units -= 2) < 0) break;
      bytes.push(
        codePoint >> 6 | 192,
        codePoint & 63 | 128
      );
    } else if (codePoint < 65536) {
      if ((units -= 3) < 0) break;
      bytes.push(
        codePoint >> 12 | 224,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else if (codePoint < 1114112) {
      if ((units -= 4) < 0) break;
      bytes.push(
        codePoint >> 18 | 240,
        codePoint >> 12 & 63 | 128,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else {
      throw new Error("Invalid code point");
    }
  }
  return bytes;
}
function asciiToBytes(str2) {
  var byteArray = [];
  for (var i = 0; i < str2.length; ++i) {
    byteArray.push(str2.charCodeAt(i) & 255);
  }
  return byteArray;
}
function utf16leToBytes(str2, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str2.length; ++i) {
    if ((units -= 2) < 0) break;
    c = str2.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }
  return byteArray;
}
function base64ToBytes(str2) {
  return toByteArray(base64clean(str2));
}
function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}
function isnan(val) {
  return val !== val;
}
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
}
function isFastBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isFastBuffer(obj.slice(0, 0));
}
var CsvError = class _CsvError extends Error {
  constructor(code, message, options, ...contexts) {
    if (Array.isArray(message)) message = message.join(" ").trim();
    super(message);
    if (Error.captureStackTrace !== void 0) {
      Error.captureStackTrace(this, _CsvError);
    }
    this.code = code;
    for (const context of contexts) {
      for (const key in context) {
        const value = context[key];
        this[key] = isBuffer(value) ? value.toString(options.encoding) : value == null ? value : JSON.parse(JSON.stringify(value));
      }
    }
  }
};
var is_object = function(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};
var normalize_columns_array = function(columns) {
  const normalizedColumns = [];
  for (let i = 0, l = columns.length; i < l; i++) {
    const column = columns[i];
    if (column === void 0 || column === null || column === false) {
      normalizedColumns[i] = { disabled: true };
    } else if (typeof column === "string") {
      normalizedColumns[i] = { name: column };
    } else if (is_object(column)) {
      if (typeof column.name !== "string") {
        throw new CsvError("CSV_OPTION_COLUMNS_MISSING_NAME", [
          "Option columns missing name:",
          `property "name" is required at position ${i}`,
          "when column is an object literal"
        ]);
      }
      normalizedColumns[i] = column;
    } else {
      throw new CsvError("CSV_INVALID_COLUMN_DEFINITION", [
        "Invalid column definition:",
        "expect a string or a literal object,",
        `got ${JSON.stringify(column)} at position ${i}`
      ]);
    }
  }
  return normalizedColumns;
};
var ResizeableBuffer = class {
  constructor(size = 100) {
    this.size = size;
    this.length = 0;
    this.buf = Buffer2.allocUnsafe(size);
  }
  prepend(val) {
    if (isBuffer(val)) {
      const length = this.length + val.length;
      if (length >= this.size) {
        this.resize();
        if (length >= this.size) {
          throw Error("INVALID_BUFFER_STATE");
        }
      }
      const buf = this.buf;
      this.buf = Buffer2.allocUnsafe(this.size);
      val.copy(this.buf, 0);
      buf.copy(this.buf, val.length);
      this.length += val.length;
    } else {
      const length = this.length++;
      if (length === this.size) {
        this.resize();
      }
      const buf = this.clone();
      this.buf[0] = val;
      buf.copy(this.buf, 1, 0, length);
    }
  }
  append(val) {
    const length = this.length++;
    if (length === this.size) {
      this.resize();
    }
    this.buf[length] = val;
  }
  clone() {
    return Buffer2.from(this.buf.slice(0, this.length));
  }
  resize() {
    const length = this.length;
    this.size = this.size * 2;
    const buf = Buffer2.allocUnsafe(this.size);
    this.buf.copy(buf, 0, 0, length);
    this.buf = buf;
  }
  toString(encoding) {
    if (encoding) {
      return this.buf.slice(0, this.length).toString(encoding);
    } else {
      return Uint8Array.prototype.slice.call(this.buf.slice(0, this.length));
    }
  }
  toJSON() {
    return this.toString("utf8");
  }
  reset() {
    this.length = 0;
  }
};
var np = 12;
var cr$1 = 13;
var nl$1 = 10;
var space = 32;
var tab = 9;
var init_state = function(options) {
  return {
    bomSkipped: false,
    bufBytesStart: 0,
    castField: options.cast_function,
    commenting: false,
    // Current error encountered by a record
    error: void 0,
    enabled: options.from_line === 1,
    escaping: false,
    escapeIsQuote: isBuffer(options.escape) && isBuffer(options.quote) && Buffer2.compare(options.escape, options.quote) === 0,
    // columns can be `false`, `true`, `Array`
    expectedRecordLength: Array.isArray(options.columns) ? options.columns.length : void 0,
    field: new ResizeableBuffer(20),
    firstLineToHeaders: options.cast_first_line_to_header,
    needMoreDataSize: Math.max(
      // Skip if the remaining buffer smaller than comment
      options.comment !== null ? options.comment.length : 0,
      ...options.delimiter.map((delimiter) => delimiter.length),
      // Skip if the remaining buffer can be escape sequence
      options.quote !== null ? options.quote.length : 0
    ),
    previousBuf: void 0,
    quoting: false,
    stop: false,
    rawBuffer: new ResizeableBuffer(100),
    record: [],
    recordHasError: false,
    record_length: 0,
    recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 0 : Math.max(...options.record_delimiter.map((v) => v.length)),
    trimChars: [
      Buffer2.from(" ", options.encoding)[0],
      Buffer2.from("	", options.encoding)[0]
    ],
    wasQuoting: false,
    wasRowDelimiter: false,
    timchars: [
      Buffer2.from(Buffer2.from([cr$1], "utf8").toString(), options.encoding),
      Buffer2.from(Buffer2.from([nl$1], "utf8").toString(), options.encoding),
      Buffer2.from(Buffer2.from([np], "utf8").toString(), options.encoding),
      Buffer2.from(Buffer2.from([space], "utf8").toString(), options.encoding),
      Buffer2.from(Buffer2.from([tab], "utf8").toString(), options.encoding)
    ]
  };
};
var underscore = function(str2) {
  return str2.replace(/([A-Z])/g, function(_, match) {
    return "_" + match.toLowerCase();
  });
};
var normalize_options = function(opts) {
  const options = {};
  for (const opt in opts) {
    options[underscore(opt)] = opts[opt];
  }
  if (options.encoding === void 0 || options.encoding === true) {
    options.encoding = "utf8";
  } else if (options.encoding === null || options.encoding === false) {
    options.encoding = null;
  } else if (typeof options.encoding !== "string" && options.encoding !== null) {
    throw new CsvError(
      "CSV_INVALID_OPTION_ENCODING",
      [
        "Invalid option encoding:",
        "encoding must be a string or null to return a buffer,",
        `got ${JSON.stringify(options.encoding)}`
      ],
      options
    );
  }
  if (options.bom === void 0 || options.bom === null || options.bom === false) {
    options.bom = false;
  } else if (options.bom !== true) {
    throw new CsvError(
      "CSV_INVALID_OPTION_BOM",
      [
        "Invalid option bom:",
        "bom must be true,",
        `got ${JSON.stringify(options.bom)}`
      ],
      options
    );
  }
  options.cast_function = null;
  if (options.cast === void 0 || options.cast === null || options.cast === false || options.cast === "") {
    options.cast = void 0;
  } else if (typeof options.cast === "function") {
    options.cast_function = options.cast;
    options.cast = true;
  } else if (options.cast !== true) {
    throw new CsvError(
      "CSV_INVALID_OPTION_CAST",
      [
        "Invalid option cast:",
        "cast must be true or a function,",
        `got ${JSON.stringify(options.cast)}`
      ],
      options
    );
  }
  if (options.cast_date === void 0 || options.cast_date === null || options.cast_date === false || options.cast_date === "") {
    options.cast_date = false;
  } else if (options.cast_date === true) {
    options.cast_date = function(value) {
      const date = Date.parse(value);
      return !isNaN(date) ? new Date(date) : value;
    };
  } else if (typeof options.cast_date !== "function") {
    throw new CsvError(
      "CSV_INVALID_OPTION_CAST_DATE",
      [
        "Invalid option cast_date:",
        "cast_date must be true or a function,",
        `got ${JSON.stringify(options.cast_date)}`
      ],
      options
    );
  }
  options.cast_first_line_to_header = null;
  if (options.columns === true) {
    options.cast_first_line_to_header = void 0;
  } else if (typeof options.columns === "function") {
    options.cast_first_line_to_header = options.columns;
    options.columns = true;
  } else if (Array.isArray(options.columns)) {
    options.columns = normalize_columns_array(options.columns);
  } else if (options.columns === void 0 || options.columns === null || options.columns === false) {
    options.columns = false;
  } else {
    throw new CsvError(
      "CSV_INVALID_OPTION_COLUMNS",
      [
        "Invalid option columns:",
        "expect an array, a function or true,",
        `got ${JSON.stringify(options.columns)}`
      ],
      options
    );
  }
  if (options.group_columns_by_name === void 0 || options.group_columns_by_name === null || options.group_columns_by_name === false) {
    options.group_columns_by_name = false;
  } else if (options.group_columns_by_name !== true) {
    throw new CsvError(
      "CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME",
      [
        "Invalid option group_columns_by_name:",
        "expect an boolean,",
        `got ${JSON.stringify(options.group_columns_by_name)}`
      ],
      options
    );
  } else if (options.columns === false) {
    throw new CsvError(
      "CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME",
      [
        "Invalid option group_columns_by_name:",
        "the `columns` mode must be activated."
      ],
      options
    );
  }
  if (options.comment === void 0 || options.comment === null || options.comment === false || options.comment === "") {
    options.comment = null;
  } else {
    if (typeof options.comment === "string") {
      options.comment = Buffer2.from(options.comment, options.encoding);
    }
    if (!isBuffer(options.comment)) {
      throw new CsvError(
        "CSV_INVALID_OPTION_COMMENT",
        [
          "Invalid option comment:",
          "comment must be a buffer or a string,",
          `got ${JSON.stringify(options.comment)}`
        ],
        options
      );
    }
  }
  if (options.comment_no_infix === void 0 || options.comment_no_infix === null || options.comment_no_infix === false) {
    options.comment_no_infix = false;
  } else if (options.comment_no_infix !== true) {
    throw new CsvError(
      "CSV_INVALID_OPTION_COMMENT",
      [
        "Invalid option comment_no_infix:",
        "value must be a boolean,",
        `got ${JSON.stringify(options.comment_no_infix)}`
      ],
      options
    );
  }
  const delimiter_json = JSON.stringify(options.delimiter);
  if (!Array.isArray(options.delimiter))
    options.delimiter = [options.delimiter];
  if (options.delimiter.length === 0) {
    throw new CsvError(
      "CSV_INVALID_OPTION_DELIMITER",
      [
        "Invalid option delimiter:",
        "delimiter must be a non empty string or buffer or array of string|buffer,",
        `got ${delimiter_json}`
      ],
      options
    );
  }
  options.delimiter = options.delimiter.map(function(delimiter) {
    if (delimiter === void 0 || delimiter === null || delimiter === false) {
      return Buffer2.from(",", options.encoding);
    }
    if (typeof delimiter === "string") {
      delimiter = Buffer2.from(delimiter, options.encoding);
    }
    if (!isBuffer(delimiter) || delimiter.length === 0) {
      throw new CsvError(
        "CSV_INVALID_OPTION_DELIMITER",
        [
          "Invalid option delimiter:",
          "delimiter must be a non empty string or buffer or array of string|buffer,",
          `got ${delimiter_json}`
        ],
        options
      );
    }
    return delimiter;
  });
  if (options.escape === void 0 || options.escape === true) {
    options.escape = Buffer2.from('"', options.encoding);
  } else if (typeof options.escape === "string") {
    options.escape = Buffer2.from(options.escape, options.encoding);
  } else if (options.escape === null || options.escape === false) {
    options.escape = null;
  }
  if (options.escape !== null) {
    if (!isBuffer(options.escape)) {
      throw new Error(
        `Invalid Option: escape must be a buffer, a string or a boolean, got ${JSON.stringify(options.escape)}`
      );
    }
  }
  if (options.from === void 0 || options.from === null) {
    options.from = 1;
  } else {
    if (typeof options.from === "string" && /\d+/.test(options.from)) {
      options.from = parseInt(options.from);
    }
    if (Number.isInteger(options.from)) {
      if (options.from < 0) {
        throw new Error(
          `Invalid Option: from must be a positive integer, got ${JSON.stringify(opts.from)}`
        );
      }
    } else {
      throw new Error(
        `Invalid Option: from must be an integer, got ${JSON.stringify(options.from)}`
      );
    }
  }
  if (options.from_line === void 0 || options.from_line === null) {
    options.from_line = 1;
  } else {
    if (typeof options.from_line === "string" && /\d+/.test(options.from_line)) {
      options.from_line = parseInt(options.from_line);
    }
    if (Number.isInteger(options.from_line)) {
      if (options.from_line <= 0) {
        throw new Error(
          `Invalid Option: from_line must be a positive integer greater than 0, got ${JSON.stringify(opts.from_line)}`
        );
      }
    } else {
      throw new Error(
        `Invalid Option: from_line must be an integer, got ${JSON.stringify(opts.from_line)}`
      );
    }
  }
  if (options.ignore_last_delimiters === void 0 || options.ignore_last_delimiters === null) {
    options.ignore_last_delimiters = false;
  } else if (typeof options.ignore_last_delimiters === "number") {
    options.ignore_last_delimiters = Math.floor(options.ignore_last_delimiters);
    if (options.ignore_last_delimiters === 0) {
      options.ignore_last_delimiters = false;
    }
  } else if (typeof options.ignore_last_delimiters !== "boolean") {
    throw new CsvError(
      "CSV_INVALID_OPTION_IGNORE_LAST_DELIMITERS",
      [
        "Invalid option `ignore_last_delimiters`:",
        "the value must be a boolean value or an integer,",
        `got ${JSON.stringify(options.ignore_last_delimiters)}`
      ],
      options
    );
  }
  if (options.ignore_last_delimiters === true && options.columns === false) {
    throw new CsvError(
      "CSV_IGNORE_LAST_DELIMITERS_REQUIRES_COLUMNS",
      [
        "The option `ignore_last_delimiters`",
        "requires the activation of the `columns` option"
      ],
      options
    );
  }
  if (options.info === void 0 || options.info === null || options.info === false) {
    options.info = false;
  } else if (options.info !== true) {
    throw new Error(
      `Invalid Option: info must be true, got ${JSON.stringify(options.info)}`
    );
  }
  if (options.max_record_size === void 0 || options.max_record_size === null || options.max_record_size === false) {
    options.max_record_size = 0;
  } else if (Number.isInteger(options.max_record_size) && options.max_record_size >= 0) ;
  else if (typeof options.max_record_size === "string" && /\d+/.test(options.max_record_size)) {
    options.max_record_size = parseInt(options.max_record_size);
  } else {
    throw new Error(
      `Invalid Option: max_record_size must be a positive integer, got ${JSON.stringify(options.max_record_size)}`
    );
  }
  if (options.objname === void 0 || options.objname === null || options.objname === false) {
    options.objname = void 0;
  } else if (isBuffer(options.objname)) {
    if (options.objname.length === 0) {
      throw new Error(`Invalid Option: objname must be a non empty buffer`);
    }
    if (options.encoding === null) ;
    else {
      options.objname = options.objname.toString(options.encoding);
    }
  } else if (typeof options.objname === "string") {
    if (options.objname.length === 0) {
      throw new Error(`Invalid Option: objname must be a non empty string`);
    }
  } else if (typeof options.objname === "number") ;
  else {
    throw new Error(
      `Invalid Option: objname must be a string or a buffer, got ${options.objname}`
    );
  }
  if (options.objname !== void 0) {
    if (typeof options.objname === "number") {
      if (options.columns !== false) {
        throw Error(
          "Invalid Option: objname index cannot be combined with columns or be defined as a field"
        );
      }
    } else {
      if (options.columns === false) {
        throw Error(
          "Invalid Option: objname field must be combined with columns or be defined as an index"
        );
      }
    }
  }
  if (options.on_record === void 0 || options.on_record === null) {
    options.on_record = void 0;
  } else if (typeof options.on_record !== "function") {
    throw new CsvError(
      "CSV_INVALID_OPTION_ON_RECORD",
      [
        "Invalid option `on_record`:",
        "expect a function,",
        `got ${JSON.stringify(options.on_record)}`
      ],
      options
    );
  }
  if (options.on_skip !== void 0 && options.on_skip !== null && typeof options.on_skip !== "function") {
    throw new Error(
      `Invalid Option: on_skip must be a function, got ${JSON.stringify(options.on_skip)}`
    );
  }
  if (options.quote === null || options.quote === false || options.quote === "") {
    options.quote = null;
  } else {
    if (options.quote === void 0 || options.quote === true) {
      options.quote = Buffer2.from('"', options.encoding);
    } else if (typeof options.quote === "string") {
      options.quote = Buffer2.from(options.quote, options.encoding);
    }
    if (!isBuffer(options.quote)) {
      throw new Error(
        `Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`
      );
    }
  }
  if (options.raw === void 0 || options.raw === null || options.raw === false) {
    options.raw = false;
  } else if (options.raw !== true) {
    throw new Error(
      `Invalid Option: raw must be true, got ${JSON.stringify(options.raw)}`
    );
  }
  if (options.record_delimiter === void 0) {
    options.record_delimiter = [];
  } else if (typeof options.record_delimiter === "string" || isBuffer(options.record_delimiter)) {
    if (options.record_delimiter.length === 0) {
      throw new CsvError(
        "CSV_INVALID_OPTION_RECORD_DELIMITER",
        [
          "Invalid option `record_delimiter`:",
          "value must be a non empty string or buffer,",
          `got ${JSON.stringify(options.record_delimiter)}`
        ],
        options
      );
    }
    options.record_delimiter = [options.record_delimiter];
  } else if (!Array.isArray(options.record_delimiter)) {
    throw new CsvError(
      "CSV_INVALID_OPTION_RECORD_DELIMITER",
      [
        "Invalid option `record_delimiter`:",
        "value must be a string, a buffer or array of string|buffer,",
        `got ${JSON.stringify(options.record_delimiter)}`
      ],
      options
    );
  }
  options.record_delimiter = options.record_delimiter.map(function(rd, i) {
    if (typeof rd !== "string" && !isBuffer(rd)) {
      throw new CsvError(
        "CSV_INVALID_OPTION_RECORD_DELIMITER",
        [
          "Invalid option `record_delimiter`:",
          "value must be a string, a buffer or array of string|buffer",
          `at index ${i},`,
          `got ${JSON.stringify(rd)}`
        ],
        options
      );
    } else if (rd.length === 0) {
      throw new CsvError(
        "CSV_INVALID_OPTION_RECORD_DELIMITER",
        [
          "Invalid option `record_delimiter`:",
          "value must be a non empty string or buffer",
          `at index ${i},`,
          `got ${JSON.stringify(rd)}`
        ],
        options
      );
    }
    if (typeof rd === "string") {
      rd = Buffer2.from(rd, options.encoding);
    }
    return rd;
  });
  if (typeof options.relax_column_count === "boolean") ;
  else if (options.relax_column_count === void 0 || options.relax_column_count === null) {
    options.relax_column_count = false;
  } else {
    throw new Error(
      `Invalid Option: relax_column_count must be a boolean, got ${JSON.stringify(options.relax_column_count)}`
    );
  }
  if (typeof options.relax_column_count_less === "boolean") ;
  else if (options.relax_column_count_less === void 0 || options.relax_column_count_less === null) {
    options.relax_column_count_less = false;
  } else {
    throw new Error(
      `Invalid Option: relax_column_count_less must be a boolean, got ${JSON.stringify(options.relax_column_count_less)}`
    );
  }
  if (typeof options.relax_column_count_more === "boolean") ;
  else if (options.relax_column_count_more === void 0 || options.relax_column_count_more === null) {
    options.relax_column_count_more = false;
  } else {
    throw new Error(
      `Invalid Option: relax_column_count_more must be a boolean, got ${JSON.stringify(options.relax_column_count_more)}`
    );
  }
  if (typeof options.relax_quotes === "boolean") ;
  else if (options.relax_quotes === void 0 || options.relax_quotes === null) {
    options.relax_quotes = false;
  } else {
    throw new Error(
      `Invalid Option: relax_quotes must be a boolean, got ${JSON.stringify(options.relax_quotes)}`
    );
  }
  if (typeof options.skip_empty_lines === "boolean") ;
  else if (options.skip_empty_lines === void 0 || options.skip_empty_lines === null) {
    options.skip_empty_lines = false;
  } else {
    throw new Error(
      `Invalid Option: skip_empty_lines must be a boolean, got ${JSON.stringify(options.skip_empty_lines)}`
    );
  }
  if (typeof options.skip_records_with_empty_values === "boolean") ;
  else if (options.skip_records_with_empty_values === void 0 || options.skip_records_with_empty_values === null) {
    options.skip_records_with_empty_values = false;
  } else {
    throw new Error(
      `Invalid Option: skip_records_with_empty_values must be a boolean, got ${JSON.stringify(options.skip_records_with_empty_values)}`
    );
  }
  if (typeof options.skip_records_with_error === "boolean") ;
  else if (options.skip_records_with_error === void 0 || options.skip_records_with_error === null) {
    options.skip_records_with_error = false;
  } else {
    throw new Error(
      `Invalid Option: skip_records_with_error must be a boolean, got ${JSON.stringify(options.skip_records_with_error)}`
    );
  }
  if (options.rtrim === void 0 || options.rtrim === null || options.rtrim === false) {
    options.rtrim = false;
  } else if (options.rtrim !== true) {
    throw new Error(
      `Invalid Option: rtrim must be a boolean, got ${JSON.stringify(options.rtrim)}`
    );
  }
  if (options.ltrim === void 0 || options.ltrim === null || options.ltrim === false) {
    options.ltrim = false;
  } else if (options.ltrim !== true) {
    throw new Error(
      `Invalid Option: ltrim must be a boolean, got ${JSON.stringify(options.ltrim)}`
    );
  }
  if (options.trim === void 0 || options.trim === null || options.trim === false) {
    options.trim = false;
  } else if (options.trim !== true) {
    throw new Error(
      `Invalid Option: trim must be a boolean, got ${JSON.stringify(options.trim)}`
    );
  }
  if (options.trim === true && opts.ltrim !== false) {
    options.ltrim = true;
  } else if (options.ltrim !== true) {
    options.ltrim = false;
  }
  if (options.trim === true && opts.rtrim !== false) {
    options.rtrim = true;
  } else if (options.rtrim !== true) {
    options.rtrim = false;
  }
  if (options.to === void 0 || options.to === null) {
    options.to = -1;
  } else {
    if (typeof options.to === "string" && /\d+/.test(options.to)) {
      options.to = parseInt(options.to);
    }
    if (Number.isInteger(options.to)) {
      if (options.to <= 0) {
        throw new Error(
          `Invalid Option: to must be a positive integer greater than 0, got ${JSON.stringify(opts.to)}`
        );
      }
    } else {
      throw new Error(
        `Invalid Option: to must be an integer, got ${JSON.stringify(opts.to)}`
      );
    }
  }
  if (options.to_line === void 0 || options.to_line === null) {
    options.to_line = -1;
  } else {
    if (typeof options.to_line === "string" && /\d+/.test(options.to_line)) {
      options.to_line = parseInt(options.to_line);
    }
    if (Number.isInteger(options.to_line)) {
      if (options.to_line <= 0) {
        throw new Error(
          `Invalid Option: to_line must be a positive integer greater than 0, got ${JSON.stringify(opts.to_line)}`
        );
      }
    } else {
      throw new Error(
        `Invalid Option: to_line must be an integer, got ${JSON.stringify(opts.to_line)}`
      );
    }
  }
  return options;
};
var isRecordEmpty = function(record) {
  return record.every(
    (field) => field == null || field.toString && field.toString().trim() === ""
  );
};
var cr = 13;
var nl = 10;
var boms = {
  // Note, the following are equals:
  // Buffer.from("\ufeff")
  // Buffer.from([239, 187, 191])
  // Buffer.from('EFBBBF', 'hex')
  utf8: Buffer2.from([239, 187, 191]),
  // Note, the following are equals:
  // Buffer.from "\ufeff", 'utf16le
  // Buffer.from([255, 254])
  utf16le: Buffer2.from([255, 254])
};
var transform = function(original_options = {}) {
  const info = {
    bytes: 0,
    comment_lines: 0,
    empty_lines: 0,
    invalid_field_length: 0,
    lines: 1,
    records: 0
  };
  const options = normalize_options(original_options);
  return {
    info,
    original_options,
    options,
    state: init_state(options),
    __needMoreData: function(i, bufLen, end) {
      if (end) return false;
      const { encoding, escape, quote } = this.options;
      const { quoting, needMoreDataSize, recordDelimiterMaxLength } = this.state;
      const numOfCharLeft = bufLen - i - 1;
      const requiredLength = Math.max(
        needMoreDataSize,
        // Skip if the remaining buffer smaller than record delimiter
        // If "record_delimiter" is yet to be discovered:
        // 1. It is equals to `[]` and "recordDelimiterMaxLength" equals `0`
        // 2. We set the length to windows line ending in the current encoding
        // Note, that encoding is known from user or bom discovery at that point
        // recordDelimiterMaxLength,
        recordDelimiterMaxLength === 0 ? Buffer2.from("\r\n", encoding).length : recordDelimiterMaxLength,
        // Skip if remaining buffer can be an escaped quote
        quoting ? (escape === null ? 0 : escape.length) + quote.length : 0,
        // Skip if remaining buffer can be record delimiter following the closing quote
        quoting ? quote.length + recordDelimiterMaxLength : 0
      );
      return numOfCharLeft < requiredLength;
    },
    // Central parser implementation
    parse: function(nextBuf, end, push, close) {
      const {
        bom,
        comment_no_infix,
        encoding,
        from_line,
        ltrim,
        max_record_size,
        raw,
        relax_quotes,
        rtrim,
        skip_empty_lines,
        to,
        to_line
      } = this.options;
      let { comment, escape, quote, record_delimiter } = this.options;
      const { bomSkipped, previousBuf, rawBuffer, escapeIsQuote } = this.state;
      let buf;
      if (previousBuf === void 0) {
        if (nextBuf === void 0) {
          close();
          return;
        } else {
          buf = nextBuf;
        }
      } else if (previousBuf !== void 0 && nextBuf === void 0) {
        buf = previousBuf;
      } else {
        buf = Buffer2.concat([previousBuf, nextBuf]);
      }
      if (bomSkipped === false) {
        if (bom === false) {
          this.state.bomSkipped = true;
        } else if (buf.length < 3) {
          if (end === false) {
            this.state.previousBuf = buf;
            return;
          }
        } else {
          for (const encoding2 in boms) {
            if (boms[encoding2].compare(buf, 0, boms[encoding2].length) === 0) {
              const bomLength = boms[encoding2].length;
              this.state.bufBytesStart += bomLength;
              buf = buf.slice(bomLength);
              this.options = normalize_options({
                ...this.original_options,
                encoding: encoding2
              });
              ({ comment, escape, quote } = this.options);
              break;
            }
          }
          this.state.bomSkipped = true;
        }
      }
      const bufLen = buf.length;
      let pos;
      for (pos = 0; pos < bufLen; pos++) {
        if (this.__needMoreData(pos, bufLen, end)) {
          break;
        }
        if (this.state.wasRowDelimiter === true) {
          this.info.lines++;
          this.state.wasRowDelimiter = false;
        }
        if (to_line !== -1 && this.info.lines > to_line) {
          this.state.stop = true;
          close();
          return;
        }
        if (this.state.quoting === false && record_delimiter.length === 0) {
          const record_delimiterCount = this.__autoDiscoverRecordDelimiter(
            buf,
            pos
          );
          if (record_delimiterCount) {
            record_delimiter = this.options.record_delimiter;
          }
        }
        const chr = buf[pos];
        if (raw === true) {
          rawBuffer.append(chr);
        }
        if ((chr === cr || chr === nl) && this.state.wasRowDelimiter === false) {
          this.state.wasRowDelimiter = true;
        }
        if (this.state.escaping === true) {
          this.state.escaping = false;
        } else {
          if (escape !== null && this.state.quoting === true && this.__isEscape(buf, pos, chr) && pos + escape.length < bufLen) {
            if (escapeIsQuote) {
              if (this.__isQuote(buf, pos + escape.length)) {
                this.state.escaping = true;
                pos += escape.length - 1;
                continue;
              }
            } else {
              this.state.escaping = true;
              pos += escape.length - 1;
              continue;
            }
          }
          if (this.state.commenting === false && this.__isQuote(buf, pos)) {
            if (this.state.quoting === true) {
              const nextChr = buf[pos + quote.length];
              const isNextChrTrimable = rtrim && this.__isCharTrimable(buf, pos + quote.length);
              const isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos + quote.length, nextChr);
              const isNextChrDelimiter = this.__isDelimiter(
                buf,
                pos + quote.length,
                nextChr
              );
              const isNextChrRecordDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRecordDelimiter(buf, pos + quote.length) : this.__isRecordDelimiter(nextChr, buf, pos + quote.length);
              if (escape !== null && this.__isEscape(buf, pos, chr) && this.__isQuote(buf, pos + escape.length)) {
                pos += escape.length - 1;
              } else if (!nextChr || isNextChrDelimiter || isNextChrRecordDelimiter || isNextChrComment || isNextChrTrimable) {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                pos += quote.length - 1;
                continue;
              } else if (relax_quotes === false) {
                const err = this.__error(
                  new CsvError(
                    "CSV_INVALID_CLOSING_QUOTE",
                    [
                      "Invalid Closing Quote:",
                      `got "${String.fromCharCode(nextChr)}"`,
                      `at line ${this.info.lines}`,
                      "instead of delimiter, record delimiter, trimable character",
                      "(if activated) or comment"
                    ],
                    this.options,
                    this.__infoField()
                  )
                );
                if (err !== void 0) return err;
              } else {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                this.state.field.prepend(quote);
                pos += quote.length - 1;
              }
            } else {
              if (this.state.field.length !== 0) {
                if (relax_quotes === false) {
                  const info2 = this.__infoField();
                  const bom2 = Object.keys(boms).map(
                    (b) => boms[b].equals(this.state.field.toString()) ? b : false
                  ).filter(Boolean)[0];
                  const err = this.__error(
                    new CsvError(
                      "INVALID_OPENING_QUOTE",
                      [
                        "Invalid Opening Quote:",
                        `a quote is found on field ${JSON.stringify(info2.column)} at line ${info2.lines}, value is ${JSON.stringify(this.state.field.toString(encoding))}`,
                        bom2 ? `(${bom2} bom)` : void 0
                      ],
                      this.options,
                      info2,
                      {
                        field: this.state.field
                      }
                    )
                  );
                  if (err !== void 0) return err;
                }
              } else {
                this.state.quoting = true;
                pos += quote.length - 1;
                continue;
              }
            }
          }
          if (this.state.quoting === false) {
            const recordDelimiterLength = this.__isRecordDelimiter(
              chr,
              buf,
              pos
            );
            if (recordDelimiterLength !== 0) {
              const skipCommentLine = this.state.commenting && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0;
              if (skipCommentLine) {
                this.info.comment_lines++;
              } else {
                if (this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1 : 0) >= from_line) {
                  this.state.enabled = true;
                  this.__resetField();
                  this.__resetRecord();
                  pos += recordDelimiterLength - 1;
                  continue;
                }
                if (skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0) {
                  this.info.empty_lines++;
                  pos += recordDelimiterLength - 1;
                  continue;
                }
                this.info.bytes = this.state.bufBytesStart + pos;
                const errField = this.__onField();
                if (errField !== void 0) return errField;
                this.info.bytes = this.state.bufBytesStart + pos + recordDelimiterLength;
                const errRecord = this.__onRecord(push);
                if (errRecord !== void 0) return errRecord;
                if (to !== -1 && this.info.records >= to) {
                  this.state.stop = true;
                  close();
                  return;
                }
              }
              this.state.commenting = false;
              pos += recordDelimiterLength - 1;
              continue;
            }
            if (this.state.commenting) {
              continue;
            }
            if (comment !== null && (comment_no_infix === false || this.state.record.length === 0 && this.state.field.length === 0)) {
              const commentCount = this.__compareBytes(comment, buf, pos, chr);
              if (commentCount !== 0) {
                this.state.commenting = true;
                continue;
              }
            }
            const delimiterLength = this.__isDelimiter(buf, pos, chr);
            if (delimiterLength !== 0) {
              this.info.bytes = this.state.bufBytesStart + pos;
              const errField = this.__onField();
              if (errField !== void 0) return errField;
              pos += delimiterLength - 1;
              continue;
            }
          }
        }
        if (this.state.commenting === false) {
          if (max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size) {
            return this.__error(
              new CsvError(
                "CSV_MAX_RECORD_SIZE",
                [
                  "Max Record Size:",
                  "record exceed the maximum number of tolerated bytes",
                  `of ${max_record_size}`,
                  `at line ${this.info.lines}`
                ],
                this.options,
                this.__infoField()
              )
            );
          }
        }
        const lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(buf, pos);
        const rappend = rtrim === false || this.state.wasQuoting === false;
        if (lappend === true && rappend === true) {
          this.state.field.append(chr);
        } else if (rtrim === true && !this.__isCharTrimable(buf, pos)) {
          return this.__error(
            new CsvError(
              "CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE",
              [
                "Invalid Closing Quote:",
                "found non trimable byte after quote",
                `at line ${this.info.lines}`
              ],
              this.options,
              this.__infoField()
            )
          );
        } else {
          if (lappend === false) {
            pos += this.__isCharTrimable(buf, pos) - 1;
          }
          continue;
        }
      }
      if (end === true) {
        if (this.state.quoting === true) {
          const err = this.__error(
            new CsvError(
              "CSV_QUOTE_NOT_CLOSED",
              [
                "Quote Not Closed:",
                `the parsing is finished with an opening quote at line ${this.info.lines}`
              ],
              this.options,
              this.__infoField()
            )
          );
          if (err !== void 0) return err;
        } else {
          if (this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0) {
            this.info.bytes = this.state.bufBytesStart + pos;
            const errField = this.__onField();
            if (errField !== void 0) return errField;
            const errRecord = this.__onRecord(push);
            if (errRecord !== void 0) return errRecord;
          } else if (this.state.wasRowDelimiter === true) {
            this.info.empty_lines++;
          } else if (this.state.commenting === true) {
            this.info.comment_lines++;
          }
        }
      } else {
        this.state.bufBytesStart += pos;
        this.state.previousBuf = buf.slice(pos);
      }
      if (this.state.wasRowDelimiter === true) {
        this.info.lines++;
        this.state.wasRowDelimiter = false;
      }
    },
    __onRecord: function(push) {
      const {
        columns,
        group_columns_by_name,
        encoding,
        info: info2,
        from: from2,
        relax_column_count,
        relax_column_count_less,
        relax_column_count_more,
        raw,
        skip_records_with_empty_values
      } = this.options;
      const { enabled, record } = this.state;
      if (enabled === false) {
        return this.__resetRecord();
      }
      const recordLength = record.length;
      if (columns === true) {
        if (skip_records_with_empty_values === true && isRecordEmpty(record)) {
          this.__resetRecord();
          return;
        }
        return this.__firstLineToColumns(record);
      }
      if (columns === false && this.info.records === 0) {
        this.state.expectedRecordLength = recordLength;
      }
      if (recordLength !== this.state.expectedRecordLength) {
        const err = columns === false ? new CsvError(
          "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
          [
            "Invalid Record Length:",
            `expect ${this.state.expectedRecordLength},`,
            `got ${recordLength} on line ${this.info.lines}`
          ],
          this.options,
          this.__infoField(),
          {
            record
          }
        ) : new CsvError(
          "CSV_RECORD_INCONSISTENT_COLUMNS",
          [
            "Invalid Record Length:",
            `columns length is ${columns.length},`,
            // rename columns
            `got ${recordLength} on line ${this.info.lines}`
          ],
          this.options,
          this.__infoField(),
          {
            record
          }
        );
        if (relax_column_count === true || relax_column_count_less === true && recordLength < this.state.expectedRecordLength || relax_column_count_more === true && recordLength > this.state.expectedRecordLength) {
          this.info.invalid_field_length++;
          this.state.error = err;
        } else {
          const finalErr = this.__error(err);
          if (finalErr) return finalErr;
        }
      }
      if (skip_records_with_empty_values === true && isRecordEmpty(record)) {
        this.__resetRecord();
        return;
      }
      if (this.state.recordHasError === true) {
        this.__resetRecord();
        this.state.recordHasError = false;
        return;
      }
      this.info.records++;
      if (from2 === 1 || this.info.records >= from2) {
        const { objname } = this.options;
        if (columns !== false) {
          const obj = {};
          for (let i = 0, l = record.length; i < l; i++) {
            if (columns[i] === void 0 || columns[i].disabled) continue;
            if (group_columns_by_name === true && obj[columns[i].name] !== void 0) {
              if (Array.isArray(obj[columns[i].name])) {
                obj[columns[i].name] = obj[columns[i].name].concat(record[i]);
              } else {
                obj[columns[i].name] = [obj[columns[i].name], record[i]];
              }
            } else {
              obj[columns[i].name] = record[i];
            }
          }
          if (raw === true || info2 === true) {
            const extRecord = Object.assign(
              { record: obj },
              raw === true ? { raw: this.state.rawBuffer.toString(encoding) } : {},
              info2 === true ? { info: this.__infoRecord() } : {}
            );
            const err = this.__push(
              objname === void 0 ? extRecord : [obj[objname], extRecord],
              push
            );
            if (err) {
              return err;
            }
          } else {
            const err = this.__push(
              objname === void 0 ? obj : [obj[objname], obj],
              push
            );
            if (err) {
              return err;
            }
          }
        } else {
          if (raw === true || info2 === true) {
            const extRecord = Object.assign(
              { record },
              raw === true ? { raw: this.state.rawBuffer.toString(encoding) } : {},
              info2 === true ? { info: this.__infoRecord() } : {}
            );
            const err = this.__push(
              objname === void 0 ? extRecord : [record[objname], extRecord],
              push
            );
            if (err) {
              return err;
            }
          } else {
            const err = this.__push(
              objname === void 0 ? record : [record[objname], record],
              push
            );
            if (err) {
              return err;
            }
          }
        }
      }
      this.__resetRecord();
    },
    __firstLineToColumns: function(record) {
      const { firstLineToHeaders } = this.state;
      try {
        const headers = firstLineToHeaders === void 0 ? record : firstLineToHeaders.call(null, record);
        if (!Array.isArray(headers)) {
          return this.__error(
            new CsvError(
              "CSV_INVALID_COLUMN_MAPPING",
              [
                "Invalid Column Mapping:",
                "expect an array from column function,",
                `got ${JSON.stringify(headers)}`
              ],
              this.options,
              this.__infoField(),
              {
                headers
              }
            )
          );
        }
        const normalizedHeaders = normalize_columns_array(headers);
        this.state.expectedRecordLength = normalizedHeaders.length;
        this.options.columns = normalizedHeaders;
        this.__resetRecord();
        return;
      } catch (err) {
        return err;
      }
    },
    __resetRecord: function() {
      if (this.options.raw === true) {
        this.state.rawBuffer.reset();
      }
      this.state.error = void 0;
      this.state.record = [];
      this.state.record_length = 0;
    },
    __onField: function() {
      const { cast, encoding, rtrim, max_record_size } = this.options;
      const { enabled, wasQuoting } = this.state;
      if (enabled === false) {
        return this.__resetField();
      }
      let field = this.state.field.toString(encoding);
      if (rtrim === true && wasQuoting === false) {
        field = field.trimRight();
      }
      if (cast === true) {
        const [err, f] = this.__cast(field);
        if (err !== void 0) return err;
        field = f;
      }
      this.state.record.push(field);
      if (max_record_size !== 0 && typeof field === "string") {
        this.state.record_length += field.length;
      }
      this.__resetField();
    },
    __resetField: function() {
      this.state.field.reset();
      this.state.wasQuoting = false;
    },
    __push: function(record, push) {
      const { on_record } = this.options;
      if (on_record !== void 0) {
        const info2 = this.__infoRecord();
        try {
          record = on_record.call(null, record, info2);
        } catch (err) {
          return err;
        }
        if (record === void 0 || record === null) {
          return;
        }
      }
      push(record);
    },
    // Return a tuple with the error and the casted value
    __cast: function(field) {
      const { columns, relax_column_count } = this.options;
      const isColumns = Array.isArray(columns);
      if (isColumns === true && relax_column_count && this.options.columns.length <= this.state.record.length) {
        return [void 0, void 0];
      }
      if (this.state.castField !== null) {
        try {
          const info2 = this.__infoField();
          return [void 0, this.state.castField.call(null, field, info2)];
        } catch (err) {
          return [err];
        }
      }
      if (this.__isFloat(field)) {
        return [void 0, parseFloat(field)];
      } else if (this.options.cast_date !== false) {
        const info2 = this.__infoField();
        return [void 0, this.options.cast_date.call(null, field, info2)];
      }
      return [void 0, field];
    },
    // Helper to test if a character is a space or a line delimiter
    __isCharTrimable: function(buf, pos) {
      const isTrim = (buf2, pos2) => {
        const { timchars } = this.state;
        loop1: for (let i = 0; i < timchars.length; i++) {
          const timchar = timchars[i];
          for (let j = 0; j < timchar.length; j++) {
            if (timchar[j] !== buf2[pos2 + j]) continue loop1;
          }
          return timchar.length;
        }
        return 0;
      };
      return isTrim(buf, pos);
    },
    // Keep it in case we implement the `cast_int` option
    // __isInt(value){
    //   // return Number.isInteger(parseInt(value))
    //   // return !isNaN( parseInt( obj ) );
    //   return /^(\-|\+)?[1-9][0-9]*$/.test(value)
    // }
    __isFloat: function(value) {
      return value - parseFloat(value) + 1 >= 0;
    },
    __compareBytes: function(sourceBuf, targetBuf, targetPos, firstByte) {
      if (sourceBuf[0] !== firstByte) return 0;
      const sourceLength = sourceBuf.length;
      for (let i = 1; i < sourceLength; i++) {
        if (sourceBuf[i] !== targetBuf[targetPos + i]) return 0;
      }
      return sourceLength;
    },
    __isDelimiter: function(buf, pos, chr) {
      const { delimiter, ignore_last_delimiters } = this.options;
      if (ignore_last_delimiters === true && this.state.record.length === this.options.columns.length - 1) {
        return 0;
      } else if (ignore_last_delimiters !== false && typeof ignore_last_delimiters === "number" && this.state.record.length === ignore_last_delimiters - 1) {
        return 0;
      }
      loop1: for (let i = 0; i < delimiter.length; i++) {
        const del = delimiter[i];
        if (del[0] === chr) {
          for (let j = 1; j < del.length; j++) {
            if (del[j] !== buf[pos + j]) continue loop1;
          }
          return del.length;
        }
      }
      return 0;
    },
    __isRecordDelimiter: function(chr, buf, pos) {
      const { record_delimiter } = this.options;
      const recordDelimiterLength = record_delimiter.length;
      loop1: for (let i = 0; i < recordDelimiterLength; i++) {
        const rd = record_delimiter[i];
        const rdLength = rd.length;
        if (rd[0] !== chr) {
          continue;
        }
        for (let j = 1; j < rdLength; j++) {
          if (rd[j] !== buf[pos + j]) {
            continue loop1;
          }
        }
        return rd.length;
      }
      return 0;
    },
    __isEscape: function(buf, pos, chr) {
      const { escape } = this.options;
      if (escape === null) return false;
      const l = escape.length;
      if (escape[0] === chr) {
        for (let i = 0; i < l; i++) {
          if (escape[i] !== buf[pos + i]) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    __isQuote: function(buf, pos) {
      const { quote } = this.options;
      if (quote === null) return false;
      const l = quote.length;
      for (let i = 0; i < l; i++) {
        if (quote[i] !== buf[pos + i]) {
          return false;
        }
      }
      return true;
    },
    __autoDiscoverRecordDelimiter: function(buf, pos) {
      const { encoding } = this.options;
      const rds = [
        // Important, the windows line ending must be before mac os 9
        Buffer2.from("\r\n", encoding),
        Buffer2.from("\n", encoding),
        Buffer2.from("\r", encoding)
      ];
      loop: for (let i = 0; i < rds.length; i++) {
        const l = rds[i].length;
        for (let j = 0; j < l; j++) {
          if (rds[i][j] !== buf[pos + j]) {
            continue loop;
          }
        }
        this.options.record_delimiter.push(rds[i]);
        this.state.recordDelimiterMaxLength = rds[i].length;
        return rds[i].length;
      }
      return 0;
    },
    __error: function(msg) {
      const { encoding, raw, skip_records_with_error } = this.options;
      const err = typeof msg === "string" ? new Error(msg) : msg;
      if (skip_records_with_error) {
        this.state.recordHasError = true;
        if (this.options.on_skip !== void 0) {
          this.options.on_skip(
            err,
            raw ? this.state.rawBuffer.toString(encoding) : void 0
          );
        }
        return void 0;
      } else {
        return err;
      }
    },
    __infoDataSet: function() {
      return {
        ...this.info,
        columns: this.options.columns
      };
    },
    __infoRecord: function() {
      const { columns, raw, encoding } = this.options;
      return {
        ...this.__infoDataSet(),
        error: this.state.error,
        header: columns === true,
        index: this.state.record.length,
        raw: raw ? this.state.rawBuffer.toString(encoding) : void 0
      };
    },
    __infoField: function() {
      const { columns } = this.options;
      const isColumns = Array.isArray(columns);
      return {
        ...this.__infoRecord(),
        column: isColumns === true ? columns.length > this.state.record.length ? columns[this.state.record.length].name : null : this.state.record.length,
        quoting: this.state.wasQuoting
      };
    }
  };
};
var parse3 = function(data, opts = {}) {
  if (typeof data === "string") {
    data = Buffer2.from(data);
  }
  const records = opts && opts.objname ? {} : [];
  const parser2 = transform(opts);
  const push = (record) => {
    if (parser2.options.objname === void 0) records.push(record);
    else {
      records[record[0]] = record[1];
    }
  };
  const close = () => {
  };
  const err1 = parser2.parse(data, false, push, close);
  if (err1 !== void 0) throw err1;
  const err2 = parser2.parse(void 0, true, push, close);
  if (err2 !== void 0) throw err2;
  return records;
};

// node_modules/myst-directives/dist/table.js
var tableDirective = {
  name: "table",
  arg: {
    type: "myst",
    doc: "An optional table caption"
  },
  options: {
    ...commonDirectiveOptions("table"),
    class: {
      type: String,
      // class_option: list of strings?
      doc: `CSS classes to add to your table. Special classes include:

- \`full-width\`: changes the table environment to cover two columns in LaTeX`
    },
    align: {
      type: String
      // choice(['left', 'center', 'right'])
    }
  },
  body: {
    type: "myst",
    required: true
  },
  run(data) {
    const children = [];
    if (data.arg) {
      children.push({
        type: "caption",
        children: [{ type: "paragraph", children: data.arg }]
      });
    }
    children.push(...data.body);
    const container = {
      type: "container",
      kind: "table",
      children
    };
    addCommonDirectiveOptions(data, container);
    return [container];
  }
};
var listTableDirective = {
  name: "list-table",
  arg: {
    type: "myst",
    doc: "An optional table caption"
  },
  options: {
    ...commonDirectiveOptions("list table"),
    "header-rows": {
      type: Number
      // nonnegative int
    },
    // 'stub-columns': {
    //   type: Number,
    //   // nonnegative int
    // },
    // width: {
    //   type: String,
    //   // length_or_percentage_or_unitless,
    // },
    // widths: {
    //   type: String,
    //   // TODO use correct widths option validator
    // },
    class: {
      type: String,
      // class_option: list of strings?
      doc: `CSS classes to add to your table. Special classes include:

- \`full-width\`: changes the table environment to cover two columns in LaTeX`
    },
    align: {
      type: String
      // choice(['left', 'center', 'right'])
    }
  },
  body: {
    type: "myst",
    required: true
  },
  validate(data, vfile) {
    const validatedData = { ...data };
    const parsedBody = data.body;
    if (parsedBody.length !== 1 || parsedBody[0].type !== "list") {
      fileError(vfile, "list-table directive must have one list as body", {
        node: data.node,
        ruleId: RuleId.directiveBodyCorrect
      });
      validatedData.body = [];
    } else {
      parsedBody[0].children?.forEach((listItem) => {
        if (!validatedData.body.length)
          return;
        if (listItem.type !== "listItem" || listItem.children?.length !== 1 || listItem.children[0]?.type !== "list") {
          fileError(vfile, "list-table directive must have a list of lists", {
            node: data.node,
            ruleId: RuleId.directiveBodyCorrect
          });
          validatedData.body = [];
        }
      });
    }
    return validatedData;
  },
  run(data) {
    const children = [];
    if (data.arg) {
      children.push({
        type: "caption",
        children: [{ type: "paragraph", children: data.arg }]
      });
    }
    const topListChildren = data.body[0]?.children || [];
    let headerCount = data.options?.["header-rows"] || 0;
    const table = {
      type: "table",
      align: data.options?.align,
      children: topListChildren.map((topListItem) => {
        const nestedListChildren = topListItem.children?.[0]?.children || [];
        const row = {
          type: "tableRow",
          children: nestedListChildren.map((nestedListItem) => {
            const cell = {
              type: "tableCell",
              header: headerCount > 0 ? true : void 0,
              children: nestedListItem.children
            };
            return cell;
          })
        };
        headerCount -= 1;
        return row;
      })
    };
    children.push(table);
    const container = {
      type: "container",
      kind: "table",
      children
    };
    addCommonDirectiveOptions(data, container);
    return [container];
  }
};
function parseCSV(data, ctx, opts) {
  const delimiter = opts?.delim ?? ",";
  const records = parse3(data, {
    delimiter: delimiter === "tab" ? "	" : delimiter === "space" ? " " : delimiter,
    ltrim: !opts?.keepspace,
    escape: opts?.escape ?? '"',
    quote: opts?.quote ?? '"'
  });
  return records.map((record, recordIndex) => {
    return record.map((cell) => {
      const mdast = ctx.parseMyst(cell, recordIndex);
      return select("*:root > paragraph:only-child", mdast);
    });
  });
}
var csvTableDirective = {
  name: "csv-table",
  doc: 'The "csv-table" directive is used to create a table from CSV (comma-separated values) data.',
  arg: {
    type: "myst",
    doc: "An optional table caption"
  },
  options: {
    ...commonDirectiveOptions("CSV table"),
    // file: {
    //   type: String,
    //   doc: 'The local filesystem path to a CSV data file.',
    //   alias: ['url'],
    //  Add this to the description for the directive:
    //  The data may be internal (an integral part of the document) or external (a separate file).
    // },
    header: {
      type: String,
      // nonnegative int
      doc: "Supplemental data for the table header, added independently of and before any header-rows from the main CSV data. Must use the same CSV format as the main CSV data."
    },
    "header-rows": {
      type: Number,
      // nonnegative int
      doc: "The number of rows of CSV data to use in the table header. Defaults to 0."
    },
    class: {
      type: String,
      // class_option: list of strings?
      doc: `CSS classes to add to your table. Special classes include:

- \`full-width\`: changes the table environment to cover two columns in LaTeX`
    },
    align: {
      type: String
      // choice(['left', 'center', 'right'])
    },
    delim: {
      type: String,
      doc: 'The character used to separate data fields. The special values "tab" and "space" are converted to the respective whitespace characters. Defaults to "," (comma)'
    },
    keepspace: {
      type: Boolean,
      doc: "Treat whitespace immediately following the delimiter as significant. The default is to ignore such whitespace."
    },
    quote: {
      type: String,
      doc: 'The character used to quote fields containing special characters, such as the delimiter, quotes, or new-line characters. Must be a single character, defaults to `"` (a double quote)\\\nFor example, `First cell, "These commas, for example, are escaped", Next cell`'
    },
    escape: {
      type: String,
      doc: 'A character used to escape the delimiter or quote characters from the CSV parser. Must be a single character, defaults to `"` (a double quote) default is a double quote\\\nFor example, `First cell, "These quotes"", for example, are escaped", Next cell`'
    }
  },
  body: {
    type: String,
    doc: "The CSV content",
    required: true
  },
  run(data, vfile, ctx) {
    const captions = [];
    if (data.arg) {
      captions.push({
        type: "caption",
        children: [{ type: "paragraph", children: data.arg }]
      });
    }
    const rows = [];
    if (data.options?.header !== void 0) {
      let headerCells = [];
      try {
        headerCells = parseCSV(data.options.header, ctx, data.options);
      } catch (error) {
        fileError(vfile, "csv-table directive header must be valid CSV-formatted MyST", {
          node: select('mystOption[name="header"]', data.node) ?? data.node,
          ruleId: RuleId.directiveOptionsCorrect
        });
      }
      rows.push(...headerCells.map((parsedRow) => ({
        type: "tableRow",
        children: parsedRow.map((parsedCell) => ({
          type: "tableCell",
          header: true,
          children: parsedCell?.children ?? []
        }))
      })));
    }
    let bodyCells = [];
    try {
      bodyCells = parseCSV(data.body, ctx, data.options);
    } catch (error) {
      fileError(vfile, "csv-table directive body must be valid CSV-formatted MyST", {
        node: select("mystDirectiveBody", data.node) ?? data.node,
        ruleId: RuleId.directiveBodyCorrect
      });
    }
    let headerCount = data.options?.["header-rows"] || 0;
    rows.push(...bodyCells.map((parsedRow) => {
      const row = {
        type: "tableRow",
        children: parsedRow.map((parsedCell) => ({
          type: "tableCell",
          header: headerCount > 0 ? true : void 0,
          children: parsedCell?.children ?? []
        }))
      };
      headerCount -= 1;
      return row;
    }));
    const table = {
      type: "table",
      align: data.options?.align,
      children: rows
    };
    const container = {
      type: "container",
      kind: "table",
      children: [...captions, table]
    };
    addCommonDirectiveOptions(data, container);
    return [container];
  }
};

// node_modules/myst-directives/dist/aside.js
var asideDirective = {
  name: "aside",
  alias: ["margin", "sidebar", "topic"],
  arg: {
    type: "myst",
    doc: "An optional title"
  },
  options: {
    ...commonDirectiveOptions("aside")
  },
  body: {
    type: "myst",
    required: true
  },
  run(data) {
    const children = [...data.body];
    if (data.arg) {
      children.unshift({
        type: "admonitionTitle",
        children: data.arg
      });
    }
    const aside = {
      type: "aside",
      kind: data.name == "aside" || data.name == "margin" ? void 0 : data.name,
      children
    };
    addCommonDirectiveOptions(data, aside);
    return [aside];
  }
};

// node_modules/myst-directives/dist/glossary.js
var glossaryDirective = {
  name: "glossary",
  body: {
    type: "myst",
    required: true
  },
  options: {
    ...commonDirectiveOptions("glossary")
  },
  run(data) {
    const glossary = {
      type: "glossary",
      children: data.body
    };
    addCommonDirectiveOptions(data, glossary);
    return [glossary];
  }
};

// node_modules/myst-directives/dist/math.js
var mathDirective = {
  name: "math",
  options: {
    ...commonDirectiveOptions("math"),
    typst: {
      type: String,
      doc: "Typst-specific math content. If not provided, LaTeX content will be converted to Typst."
    }
  },
  body: {
    type: String,
    required: true
  },
  run(data) {
    const math = addCommonDirectiveOptions(data, { type: "math", value: data.body });
    if (data.node.tight) {
      math.tight = data.node.tight;
    }
    if (data.options?.typst) {
      math.typst = data.options.typst;
    }
    return [math];
  }
};

// node_modules/myst-directives/dist/mdast.js
var mdastDirective = {
  name: "mdast",
  arg: {
    type: String,
    required: true
  },
  options: {
    ...commonDirectiveOptions("mdast")
  },
  run(data) {
    const mdast = {
      type: "mdast",
      id: data.arg
    };
    addCommonDirectiveOptions(data, mdast);
    return [mdast];
  }
};

// node_modules/myst-directives/dist/mermaid.js
var mermaidDirective = {
  name: "mermaid",
  options: {
    ...commonDirectiveOptions("mermaid")
  },
  body: {
    type: String,
    required: true
  },
  run(data) {
    return [
      addCommonDirectiveOptions(data, {
        type: "mermaid",
        value: data.body
      })
    ];
  }
};

// node_modules/myst-directives/dist/mystdemo.js
var mystdemoDirective = {
  name: "myst",
  doc: "Demonstrate some MyST code in an editable code block that displays its output/result interactively. Limited to built-in functionality, as parsing and rendering is done in the browser without access to plugin code or project configuration.",
  options: {
    ...commonDirectiveOptions("myst"),
    numbering: {
      type: String
    }
  },
  body: {
    type: String,
    required: true
  },
  run(data) {
    let numbering;
    if (data.options?.numbering) {
      try {
        numbering = jsYaml.load(data.options.numbering);
      } catch (err) {
      }
    }
    const myst = {
      type: "myst",
      numbering,
      value: data.body
    };
    addCommonDirectiveOptions(data, myst);
    return [myst];
  }
};

// node_modules/myst-directives/dist/blockquote.js
var import_classnames = __toESM(require_classnames(), 1);
var blockquoteDirective = {
  name: "blockquote",
  alias: ["epigraph", "pull-quote"],
  doc: "Block quotes are used to indicate that the enclosed content forms an extended quotation. They may be followed by an inscription or attribution formed of a paragraph beginning with `--`, `---`, or an em-dash.",
  options: {
    ...commonDirectiveOptions("blockquote"),
    // TODO: Add enumeration in future
    class: {
      type: String,
      doc: `CSS classes to add to your blockquote. Special classes include:

- \`pull-quote\`: used for a blockquote node which should attract attention
- \`epigraph\`: used for a blockquote node that are usually found at the beginning of a document`
    }
  },
  body: {
    type: "myst",
    doc: "The body of the quote, which may contain a special attribution paragraph that is turned into a caption"
  },
  run(data) {
    const children = [];
    if (data.body) {
      children.push(...data.body);
    }
    const container = {
      type: "container",
      kind: "quote",
      children: [
        {
          // @ts-expect-error: myst-spec needs updating to support blockquote
          type: "blockquote",
          children
        }
      ]
    };
    addCommonDirectiveOptions(data, container);
    const className = data.options?.class;
    container.class = (0, import_classnames.default)({
      [className]: className,
      [data.name]: data.name !== "blockquote"
    });
    return [container];
  }
};

// node_modules/myst-directives/dist/raw.js
var rawDirective = {
  name: "raw",
  doc: 'Allows you to include non-markdown text in your document. If the argument "latex" is provided, the text will be parsed as latex; otherwise, it will be included as raw text.',
  arg: {
    type: String,
    doc: 'Format of directive content - for now, only "latex" is valid'
  },
  body: {
    type: String,
    doc: "Raw content to be parsed"
  },
  run(data) {
    const lang = data.arg ?? "";
    const value = data.body ?? "";
    const tex = ["tex", "latex"].includes(lang) ? `
${value}
` : void 0;
    const typst = ["typst", "typ"].includes(lang) ? `
${value}
` : void 0;
    return [
      {
        type: "raw",
        lang,
        tex,
        typst,
        value
      }
    ];
  }
};
var rawLatexDirective = {
  name: "raw:latex",
  alias: ["raw:tex"],
  doc: "Allows you to include tex in your document that will only be included in tex exports",
  body: {
    type: String,
    doc: "Raw tex content"
  },
  run(data) {
    const lang = "tex";
    const body = data.body;
    const tex = body ? `
${body}
` : "";
    return [
      {
        type: "raw",
        lang,
        tex
      }
    ];
  }
};
var rawTypstDirective = {
  name: "raw:typst",
  alias: ["raw:typ"],
  doc: "Allows you to include typst in your document that will only be included in typst exports",
  body: {
    type: String,
    doc: "Raw typst content"
  },
  run(data) {
    const lang = "typst";
    const body = data.body;
    const typst = body ? `
${body}
` : "";
    return [
      {
        type: "raw",
        lang,
        typst
      }
    ];
  }
};

// node_modules/myst-directives/dist/div.js
var divDirective = {
  name: "div",
  options: {
    ...commonDirectiveOptions("div")
  },
  body: {
    type: "myst"
  },
  run(data) {
    const div = { type: "div" };
    if (data.body) {
      div.children = data.body;
    }
    addCommonDirectiveOptions(data, div);
    return [div];
  }
};

// node_modules/myst-directives/dist/toc.js
var CONTEXTS = ["project", "page", "section"];
var tocDirective = {
  name: "toc",
  doc: "Inserts table of contents in the page. This may be for the project (each page has an entry), the current page (each heading has an entry), or the current section (only headings in the section have an entry).",
  alias: ["tableofcontents", "table-of-contents", "toctree", "contents"],
  arg: {
    type: "myst",
    doc: "Heading to be included with table of contents"
  },
  options: {
    context: {
      type: String,
      doc: "Table of Contents context; one of project, page, or section",
      alias: ["kind"]
    },
    depth: {
      type: Number,
      doc: "Number of levels to include in Table of Contents; by default, all levels will be included",
      alias: ["maxdepth"]
    },
    ...commonDirectiveOptions("toc")
  },
  run(data, vfile) {
    let context = data.options?.context ? data.options.context : data.name === "contents" ? "section" : "project";
    if (!CONTEXTS.includes(context)) {
      fileError(vfile, `Unknown context for ${data.name} directive: ${context}`);
      context = "project";
    }
    let depth = data.options?.depth;
    if (depth != null && depth < 1) {
      fileError(vfile, `Table of Contents 'depth' must be a number greater than 0`);
      depth = void 0;
    }
    const children = [];
    if (data.arg) {
      const parsedArg = data.arg;
      if (parsedArg[0]?.type === "heading") {
        children.push(...parsedArg);
      } else {
        children.push({
          type: "heading",
          depth: 2,
          enumerated: false,
          children: parsedArg
        });
      }
    }
    const toc = { type: "toc", kind: context, depth, children };
    addCommonDirectiveOptions(data, toc);
    return [toc];
  }
};

// node_modules/myst-directives/dist/index.js
var defaultDirectives = [
  admonitionDirective,
  bibliographyDirective,
  csvTableDirective,
  codeDirective,
  codeCellDirective,
  dropdownDirective,
  embedDirective,
  blockquoteDirective,
  figureDirective,
  iframeDirective,
  imageDirective,
  includeDirective,
  indexDirective,
  genIndexDirective,
  tableDirective,
  listTableDirective,
  asideDirective,
  glossaryDirective,
  mathDirective,
  mdastDirective,
  mermaidDirective,
  mystdemoDirective,
  rawDirective,
  rawLatexDirective,
  rawTypstDirective,
  divDirective,
  tocDirective
];

// node_modules/myst-roles/dist/utils.js
function classRoleOption(nodeType = "node") {
  return {
    class: {
      type: String,
      doc: `Annotate the ${nodeType} with a set of space-delimited class names.`
    }
  };
}
function labelRoleOption(nodeType = "node") {
  return {
    label: {
      type: String,
      alias: ["name"],
      doc: `Label the ${nodeType} to be cross-referenced or explicitly linked to.`
    }
  };
}
function commonRoleOptions(nodeType = "node") {
  return {
    ...classRoleOption(nodeType),
    ...labelRoleOption(nodeType)
  };
}
function addClassOptions2(data, node) {
  if (typeof data.options?.class === "string") {
    node.class = data.options.class;
  }
  return node;
}
function addLabelOptions2(data, node) {
  const { label, identifier } = normalizeLabel(data.options?.label) || {};
  if (label)
    node.label = label;
  if (identifier)
    node.identifier = identifier;
  return node;
}
function addCommonRoleOptions(data, node) {
  addClassOptions2(data, node);
  addLabelOptions2(data, node);
  return node;
}

// node_modules/myst-roles/dist/span.js
var spanRole = {
  name: "span",
  options: { ...commonRoleOptions("span") },
  body: {
    type: "myst"
  },
  run(data) {
    const node = { type: "span" };
    if (data.body) {
      node.children = data.body;
    }
    addCommonRoleOptions(data, node);
    return [node];
  }
};

// node_modules/myst-roles/dist/abbreviation.js
var ABBR_PATTERN = /^(.+?)\(([^()]+)\)$/;
var abbreviationRole = {
  name: "abbreviation",
  alias: ["abbr"],
  options: { ...commonRoleOptions("abbreviation") },
  body: {
    type: String,
    required: true
  },
  run(data) {
    const body = data.body;
    const match = ABBR_PATTERN.exec(body);
    const value = match?.[1]?.trim() ?? body.trim();
    const title = match?.[2]?.trim();
    const abbr = { type: "abbreviation", title, children: [{ type: "text", value }] };
    addCommonRoleOptions(data, abbr);
    return [abbr];
  }
};

// node_modules/myst-roles/dist/chem.js
var chemRole = {
  name: "chemicalFormula",
  alias: ["chem"],
  options: { ...commonRoleOptions("chemicalFormula") },
  body: {
    type: String,
    required: true
  },
  run(data) {
    const chem = { type: "chemicalFormula", value: data.body };
    addCommonRoleOptions(data, chem);
    return [chem];
  }
};

// node_modules/myst-roles/dist/cite.js
var citeRole = {
  name: "cite",
  alias: [
    "cite:p",
    "cite:t",
    // https://sphinxcontrib-bibtex.readthedocs.io/en/latest/usage.html
    "cite:ps",
    "cite:ts",
    "cite:ct",
    "cite:cts",
    "cite:alp",
    "cite:alps",
    "cite:label",
    "cite:labelpar",
    "cite:year",
    "cite:yearpar",
    "cite:author",
    "cite:authors",
    "cite:authorpar",
    "cite:authorpars",
    "cite:cauthor",
    "cite:cauthors"
    // 'cite:empty',
  ],
  options: { ...commonRoleOptions("cite") },
  body: {
    type: String,
    required: true
  },
  run(data) {
    const content = data.body;
    const labels = content.split(/[,;]/).map((s) => s.trim());
    const kind = data.name.startsWith("cite:p") || data.name.includes("par") || data.name.includes("cite:alp") ? "parenthetical" : "narrative";
    const children = labels.map((c) => {
      const groups = /^(?:\{([^{]*)\})?([^{]*)(?:\{([^{]*)\})?$/;
      const [, prefix, l, suffix] = c.match(groups) ?? ["", "", c];
      const { label, identifier } = normalizeLabel(l) ?? {};
      const cite = {
        type: "cite",
        kind,
        label: label ?? l,
        identifier
      };
      if (data.name.startsWith("cite:year")) {
        cite.partial = "year";
      }
      if (data.name.startsWith("cite:author") || data.name.startsWith("cite:cauthor")) {
        cite.partial = "author";
      }
      if (prefix)
        cite.prefix = prefix.trim();
      if (suffix)
        cite.suffix = suffix.trim();
      return cite;
    });
    if (data.name === "cite" && children.length === 1) {
      addCommonRoleOptions(data, children[0]);
      return children;
    }
    if (data.name.includes("cite:alp")) {
      return children;
    }
    const citeGroup = { type: "citeGroup", kind, children };
    addCommonRoleOptions(data, citeGroup);
    return [citeGroup];
  }
};

// node_modules/myst-roles/dist/delete.js
var deleteRole = {
  name: "delete",
  alias: ["del", "strike"],
  options: { ...commonRoleOptions("delete") },
  body: {
    type: "myst",
    required: true
  },
  run(data) {
    const del = { type: "delete", children: data.body };
    addCommonRoleOptions(data, del);
    return [del];
  }
};

// node_modules/myst-roles/dist/math.js
var mathRole = {
  name: "math",
  options: {
    ...commonRoleOptions("math"),
    typst: {
      type: String,
      doc: "Typst-specific math content. If not provided, LaTeX content will be converted to Typst."
    }
  },
  body: {
    type: String,
    required: true
  },
  run(data) {
    const node = { type: "inlineMath", value: data.body };
    addCommonRoleOptions(data, node);
    if (data.options?.typst) {
      node.typst = data.options.typst;
    }
    return [node];
  }
};

// node_modules/myst-roles/dist/reference.js
var REF_PATTERN = /^(.+?)<([^<>]+)>$/;
var refRole = {
  name: "ref",
  alias: ["eq", "numref", "prf:ref"],
  body: {
    type: String,
    required: true
  },
  run(data) {
    const body = data.body;
    const match = REF_PATTERN.exec(body);
    const [, modified, rawLabel] = match ?? [];
    const { label, identifier } = normalizeLabel(rawLabel ?? body) || {};
    const crossRef = { type: "crossReference", kind: data.name, identifier, label };
    if (modified)
      crossRef.children = [{ type: "text", value: modified.trim() }];
    return [crossRef];
  }
};

// node_modules/myst-roles/dist/doc.js
var REF_PATTERN2 = /^(.+?)<([^<>]+)>$/;
var docRole = {
  name: "doc",
  body: {
    type: String,
    required: true
  },
  run(data, vfile) {
    const body = data.body;
    const match = REF_PATTERN2.exec(body);
    const [, modified, rawLabel] = match ?? [];
    const url = rawLabel ?? body;
    fileWarn(vfile, "Usage of the {doc} role is not recommended, use a markdown link to the file instead.", {
      source: "role:doc",
      node: data.node,
      note: `For {doc}\`${body}\` use [${modified || ""}](${url})`,
      ruleId: RuleId.roleBodyCorrect
    });
    const link = { type: "link", url };
    if (modified)
      link.children = [{ type: "text", value: modified.trim() }];
    return [link];
  }
};

// node_modules/myst-roles/dist/download.js
var REF_PATTERN3 = /^(.+?)<([^<>]+)>$/;
var downloadRole = {
  name: "download",
  body: {
    type: String,
    required: true
  },
  run(data) {
    const body = data.body;
    const match = REF_PATTERN3.exec(body);
    const [, modified, rawLabel] = match ?? [];
    const url = rawLabel ?? body;
    const link = {
      type: "link",
      url,
      static: true
      // Indicate that this should be treated as a static download
    };
    if (modified)
      link.children = [{ type: "text", value: modified.trim() }];
    return [link];
  }
};

// node_modules/myst-roles/dist/indices.js
var REF_PATTERN4 = /^(.+?)<([^<>]+)>$/;
var indexRole = {
  name: "index",
  body: {
    type: String,
    required: true
  },
  run(data, vfile) {
    const body = data.body;
    const match = REF_PATTERN4.exec(body);
    const [, modified, indexString] = match ?? [];
    const values = { single: [], pair: [], triple: [], see: [], seealso: [] };
    parseIndexLine(indexString ?? body, values, vfile, data.node);
    const entries = createIndexEntries(values, vfile, data.node);
    const output = [
      {
        type: "mystTarget",
        indexEntries: entries
      },
      {
        type: "span",
        children: [
          {
            type: "text",
            value: modified ?? body
          }
        ]
      }
    ];
    return output;
  }
};

// node_modules/myst-roles/dist/term.js
var REF_PATTERN5 = /^(.+?)<([^<>]+)>$/;
var termRole = {
  name: "term",
  body: {
    type: String,
    required: true
  },
  run(data, vfile) {
    const body = data.body;
    const match = REF_PATTERN5.exec(body);
    const [, modified, rawLabel] = match ?? [];
    const { label, identifier } = normalizeLabel(rawLabel ?? body) ?? {};
    if (!identifier) {
      fileWarn(vfile, `Unknown {term} role with body: "${body}"`, {
        source: "role:term",
        node: data.node,
        ruleId: RuleId.roleBodyCorrect
      });
    }
    const crossRef = {
      type: "crossReference",
      label,
      identifier: `term-${identifier}`,
      children: [{ type: "text", value: modified ? modified.trim() : rawLabel ?? body }]
    };
    return [crossRef];
  }
};

// node_modules/myst-roles/dist/si.js
var siRole = {
  name: "si",
  body: {
    type: String,
    required: true
  },
  run(data) {
    const value = data.body;
    const match = value.match(/([0-9]+)\s?<([\\a-zA-Z\s]+)>/);
    if (!match) {
      return [{ type: "si", error: true, value }];
    }
    const [, number, commands] = match;
    const parsed = [...commands.matchAll(/\\([a-zA-Z]+)/g)];
    const units = parsed.filter((c) => !!c).map(([, c]) => c);
    const translated = units.map((c) => UNITS[c] ?? c);
    const si = {
      type: "si",
      number,
      unit: translated.join(""),
      units,
      alt: units.join(" "),
      value: `${number} ${translated.join("")}`
    };
    return [si];
  }
};
var UNITS = {
  ampere: "A",
  candela: "cd",
  kelvin: "K",
  kilogram: "kg",
  metre: "m",
  meter: "m",
  mole: "mol",
  second: "s",
  becquerel: "Bq",
  degreeCelsius: "\xB0C",
  coulomb: "C",
  farad: "F",
  gray: "Gy",
  hertz: "Hz",
  henry: "H",
  joule: "J",
  lumen: "lm",
  katal: "kat",
  lux: "lx",
  newton: "N",
  ohm: "\u2126",
  pascal: "Pa",
  radian: "rad",
  siemens: "S",
  sievert: "Sv",
  steradian: "sr",
  tesla: "T",
  volt: "V",
  watt: "W",
  weber: "Wb",
  astronomicalunit: "au",
  bel: "B",
  dalton: "Da",
  day: "d",
  decibel: "dB",
  degree: "\xB0",
  electronvolt: "eV",
  hectare: "ha",
  hour: "h",
  litre: "L",
  liter: "L",
  arcminute: "\u2032",
  // minute (plane angle) U+2032
  minute: "min",
  // minute (time)
  arcsecond: "\u2033",
  // second (plane angle) U+2033
  neper: "Np",
  tonne: "t",
  // SI prefixes
  yocto: "y",
  // -24
  zepto: "z",
  // -21
  atto: "a",
  // -18
  femto: "f",
  // -15
  pico: "p",
  // -12
  nano: "n",
  // -9
  micro: "\xB5",
  // -6
  milli: "m",
  // -3
  centi: "c",
  // -2
  deci: "d",
  // -1
  deca: "da",
  // 1
  hecto: "h",
  // 2
  kilo: "k",
  // 3
  mega: "M",
  // 6
  giga: "G",
  // 9
  tera: "T",
  // 12
  peta: "P",
  // 15
  exa: "E",
  // 18
  zetta: "Z",
  // 21
  yotta: "Y",
  // 24
  // Special
  angstrom: "\xC5"
};

// node_modules/myst-roles/dist/inlineExpression.js
var evalRole = {
  name: "eval",
  options: { ...commonRoleOptions("eval") },
  body: {
    type: String,
    required: true
  },
  run(data) {
    const node = { type: "inlineExpression", value: data.body };
    addCommonRoleOptions(data, node);
    return [node];
  }
};

// node_modules/myst-roles/dist/smallcaps.js
var smallcapsRole = {
  name: "smallcaps",
  alias: ["sc"],
  options: { ...commonRoleOptions("smallcaps") },
  body: {
    type: "myst",
    required: true
  },
  run(data) {
    const node = { type: "smallcaps", children: data.body };
    addCommonRoleOptions(data, node);
    return [node];
  }
};

// node_modules/myst-roles/dist/subscript.js
var subscriptRole = {
  name: "subscript",
  alias: ["sub"],
  options: { ...commonRoleOptions("subscript") },
  body: {
    type: "myst",
    required: true
  },
  run(data) {
    const node = { type: "subscript", children: data.body };
    addCommonRoleOptions(data, node);
    return [node];
  }
};

// node_modules/myst-roles/dist/superscript.js
var superscriptRole = {
  name: "superscript",
  alias: ["sup"],
  options: { ...commonRoleOptions("superscript") },
  body: {
    type: "myst",
    required: true
  },
  run(data) {
    const node = { type: "superscript", children: data.body };
    addCommonRoleOptions(data, node);
    return [node];
  }
};

// node_modules/myst-roles/dist/underline.js
var underlineRole = {
  name: "underline",
  alias: ["u"],
  options: { ...commonRoleOptions("underline") },
  body: {
    type: "myst",
    required: true
  },
  run(data) {
    const node = { type: "underline", children: data.body };
    addCommonRoleOptions(data, node);
    return [node];
  }
};

// node_modules/myst-roles/dist/keyboard.js
var keyboardRole = {
  name: "keyboard",
  doc: 'The keyboard role denote textual user input from a keyboard, such as "Ctrl" + "Space".',
  alias: ["kbd"],
  options: { ...commonRoleOptions("keyboard") },
  body: {
    type: String,
    required: true
  },
  run(data) {
    const node = {
      type: "keyboard",
      children: [{ type: "text", value: data.body }]
    };
    addCommonRoleOptions(data, node);
    return [node];
  }
};

// node_modules/myst-roles/dist/raw.js
var rawLatexRole = {
  name: "raw:latex",
  alias: ["raw:tex"],
  doc: "Allows you to include tex in your document that will only be included in tex exports",
  body: {
    type: String,
    doc: "Raw tex content"
  },
  run(data) {
    const lang = "tex";
    const tex = data.body ?? "";
    return [
      {
        type: "raw",
        lang,
        tex
      }
    ];
  }
};
var rawTypstRole = {
  name: "raw:typst",
  alias: ["raw:typ"],
  doc: "Allows you to include typst in your document that will only be included in typst exports",
  body: {
    type: String,
    doc: "Raw typst content"
  },
  run(data) {
    const lang = "typst";
    const typst = data.body ?? "";
    return [
      {
        type: "raw",
        lang,
        typst
      }
    ];
  }
};

// node_modules/myst-roles/dist/index.js
var defaultRoles = [
  spanRole,
  abbreviationRole,
  chemRole,
  citeRole,
  deleteRole,
  mathRole,
  refRole,
  docRole,
  downloadRole,
  indexRole,
  termRole,
  siRole,
  evalRole,
  smallcapsRole,
  subscriptRole,
  superscriptRole,
  underlineRole,
  keyboardRole,
  rawLatexRole,
  rawTypstRole
];

// node_modules/vfile/lib/index.js
var import_is_buffer = __toESM(require_is_buffer(), 1);

// node_modules/unist-util-stringify-position/lib/index.js
function stringifyPosition(value) {
  if (!value || typeof value !== "object") {
    return "";
  }
  if ("position" in value || "type" in value) {
    return position(value.position);
  }
  if ("start" in value || "end" in value) {
    return position(value);
  }
  if ("line" in value || "column" in value) {
    return point(value);
  }
  return "";
}
function point(point2) {
  return index(point2 && point2.line) + ":" + index(point2 && point2.column);
}
function position(pos) {
  return point(pos && pos.start) + "-" + point(pos && pos.end);
}
function index(value) {
  return value && typeof value === "number" ? value : 1;
}

// node_modules/vfile-message/lib/index.js
var VFileMessage = class extends Error {
  /**
   * Create a message for `reason` at `place` from `origin`.
   *
   * When an error is passed in as `reason`, the `stack` is copied.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   *
   *   > 👉 **Note**: you should use markdown.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // To do: next major: expose `undefined` everywhere instead of `null`.
  constructor(reason, place, origin) {
    const parts = [null, null];
    let position2 = {
      // @ts-expect-error: we always follows the structure of `position`.
      start: { line: null, column: null },
      // @ts-expect-error: "
      end: { line: null, column: null }
    };
    super();
    if (typeof place === "string") {
      origin = place;
      place = void 0;
    }
    if (typeof origin === "string") {
      const index2 = origin.indexOf(":");
      if (index2 === -1) {
        parts[1] = origin;
      } else {
        parts[0] = origin.slice(0, index2);
        parts[1] = origin.slice(index2 + 1);
      }
    }
    if (place) {
      if ("type" in place || "position" in place) {
        if (place.position) {
          position2 = place.position;
        }
      } else if ("start" in place || "end" in place) {
        position2 = place;
      } else if ("line" in place || "column" in place) {
        position2.start = place;
      }
    }
    this.name = stringifyPosition(place) || "1:1";
    this.message = typeof reason === "object" ? reason.message : reason;
    this.stack = "";
    if (typeof reason === "object" && reason.stack) {
      this.stack = reason.stack;
    }
    this.reason = this.message;
    this.fatal;
    this.line = position2.start.line;
    this.column = position2.start.column;
    this.position = position2;
    this.source = parts[0];
    this.ruleId = parts[1];
    this.file;
    this.actual;
    this.expected;
    this.url;
    this.note;
  }
};
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.fatal = null;
VFileMessage.prototype.column = null;
VFileMessage.prototype.line = null;
VFileMessage.prototype.source = null;
VFileMessage.prototype.ruleId = null;
VFileMessage.prototype.position = null;

// node_modules/vfile/lib/minpath.js
import { default as default5 } from "path";

// node_modules/vfile/lib/minproc.js
import { default as default6 } from "process";

// node_modules/vfile/lib/minurl.js
import { fileURLToPath } from "url";

// node_modules/vfile/lib/minurl.shared.js
function isUrl(fileUrlOrPath) {
  return fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && // @ts-expect-error: indexable.
  fileUrlOrPath.href && // @ts-expect-error: indexable.
  fileUrlOrPath.origin;
}

// node_modules/vfile/lib/index.js
var order = ["history", "path", "basename", "stem", "extname", "dirname"];
var VFile = class {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Buffer` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(value) {
    let options;
    if (!value) {
      options = {};
    } else if (typeof value === "string" || buffer(value)) {
      options = { value };
    } else if (isUrl(value)) {
      options = { path: value };
    } else {
      options = value;
    }
    this.data = {};
    this.messages = [];
    this.history = [];
    this.cwd = default6.cwd();
    this.value;
    this.stored;
    this.result;
    this.map;
    let index2 = -1;
    while (++index2 < order.length) {
      const prop2 = order[index2];
      if (prop2 in options && options[prop2] !== void 0 && options[prop2] !== null) {
        this[prop2] = prop2 === "history" ? [...options[prop2]] : options[prop2];
      }
    }
    let prop;
    for (prop in options) {
      if (!order.includes(prop)) {
        this[prop] = options[prop];
      }
    }
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {string | URL} path
   */
  set path(path2) {
    if (isUrl(path2)) {
      path2 = fileURLToPath(path2);
    }
    assertNonEmpty(path2, "path");
    if (this.path !== path2) {
      this.history.push(path2);
    }
  }
  /**
   * Get the parent path (example: `'~'`).
   */
  get dirname() {
    return typeof this.path === "string" ? default5.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   */
  set dirname(dirname) {
    assertPath(this.basename, "dirname");
    this.path = default5.join(dirname || "", this.basename);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   */
  get basename() {
    return typeof this.path === "string" ? default5.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */
  set basename(basename) {
    assertNonEmpty(basename, "basename");
    assertPart(basename, "basename");
    this.path = default5.join(this.dirname || "", basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   */
  get extname() {
    return typeof this.path === "string" ? default5.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   */
  set extname(extname) {
    assertPart(extname, "extname");
    assertPath(this.dirname, "extname");
    if (extname) {
      if (extname.charCodeAt(0) !== 46) {
        throw new Error("`extname` must start with `.`");
      }
      if (extname.includes(".", 1)) {
        throw new Error("`extname` cannot contain multiple dots");
      }
    }
    this.path = default5.join(this.dirname, this.stem + (extname || ""));
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   */
  get stem() {
    return typeof this.path === "string" ? default5.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */
  set stem(stem) {
    assertNonEmpty(stem, "stem");
    assertPart(stem, "stem");
    this.path = default5.join(this.dirname || "", stem + (this.extname || ""));
  }
  /**
   * Serialize the file.
   *
   * @param {BufferEncoding | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Buffer`
   *   (default: `'utf8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(encoding) {
    return (this.value || "").toString(encoding || void 0);
  }
  /**
   * Create a warning message associated with the file.
   *
   * Its `fatal` is set to `false` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(reason, place, origin) {
    const message = new VFileMessage(reason, place, origin);
    if (this.path) {
      message.name = this.path + ":" + message.name;
      message.file = this.path;
    }
    message.fatal = false;
    this.messages.push(message);
    return message;
  }
  /**
   * Create an info message associated with the file.
   *
   * Its `fatal` is set to `null` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(reason, place, origin) {
    const message = this.message(reason, place, origin);
    message.fatal = null;
    return message;
  }
  /**
   * Create a fatal error associated with the file.
   *
   * Its `fatal` is set to `true` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * > 👉 **Note**: a fatal error means that a file is no longer processable.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Message.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(reason, place, origin) {
    const message = this.message(reason, place, origin);
    message.fatal = true;
    throw message;
  }
};
function assertPart(part, name2) {
  if (part && part.includes(default5.sep)) {
    throw new Error(
      "`" + name2 + "` cannot be a path: did not expect `" + default5.sep + "`"
    );
  }
}
function assertNonEmpty(part, name2) {
  if (!part) {
    throw new Error("`" + name2 + "` cannot be empty");
  }
}
function assertPath(path2, name2) {
  if (!path2) {
    throw new Error("Setting `" + name2 + "` requires `path` to be set too");
  }
}
function buffer(value) {
  return (0, import_is_buffer.default)(value);
}

// node_modules/myst-parser/dist/tlds.js
var tlds = [
  "aarp",
  "abb",
  "abbott",
  "abbvie",
  "abc",
  "able",
  "ac",
  "academy",
  "accountant",
  "accountants",
  "aco",
  "actor",
  "ad",
  "ads",
  "ae",
  "aeg",
  "aero",
  "aetna",
  "af",
  "afl",
  "africa",
  "ag",
  "agakhan",
  "agency",
  "ai",
  "aig",
  "airforce",
  "airtel",
  "akdn",
  "al",
  "allfinanz",
  "ally",
  "alsace",
  "alstom",
  "am",
  "amica",
  "amsterdam",
  "analytics",
  "android",
  "anquan",
  "anz",
  "ao",
  "aol",
  "apartments",
  "app",
  "apple",
  "aq",
  "aquarelle",
  "ar",
  "arab",
  "aramco",
  "archi",
  "army",
  "arpa",
  "art",
  "arte",
  "as",
  "asda",
  "asia",
  "associates",
  "at",
  "athleta",
  "attorney",
  "au",
  "auction",
  "audible",
  "audio",
  "auspost",
  "author",
  "auto",
  "autos",
  "avianca",
  "aw",
  "aws",
  "ax",
  "axa",
  "az",
  "ba",
  "baby",
  "band",
  "bank",
  "bar",
  "barcelona",
  "barefoot",
  "bargains",
  "baseball",
  "basketball",
  "bauhaus",
  "bayern",
  "bb",
  "bbc",
  "bbt",
  "bbva",
  "bcg",
  "bcn",
  "bd",
  "be",
  "beats",
  "beauty",
  "beer",
  "berlin",
  "best",
  "bet",
  "bf",
  "bg",
  "bh",
  "bharti",
  "bi",
  "bible",
  "bid",
  "bike",
  "bing",
  "bingo",
  "bio",
  "biz",
  "bj",
  "black",
  "blackfriday",
  "blog",
  "blue",
  "bm",
  "bms",
  "bmw",
  "bn",
  "bnpparibas",
  "bo",
  "boats",
  "boehringer",
  "bofa",
  "bom",
  "bond",
  "boo",
  "book",
  "booking",
  "bosch",
  "bostik",
  "boston",
  "bot",
  "boutique",
  "box",
  "br",
  "bradesco",
  "bridgestone",
  "broadway",
  "broker",
  "brother",
  "brussels",
  "bs",
  "bt",
  "build",
  "builders",
  "business",
  "buy",
  "buzz",
  "bv",
  "bw",
  "by",
  "bz",
  "bzh",
  "ca",
  "cab",
  "cafe",
  "cal",
  "call",
  "cam",
  "camera",
  "camp",
  "canon",
  "capetown",
  "capital",
  "car",
  "caravan",
  "cards",
  "care",
  "career",
  "careers",
  "cars",
  "casa",
  "case",
  "cash",
  "casino",
  "cat",
  "catering",
  "catholic",
  "cba",
  "cbn",
  "cbre",
  "cc",
  "cd",
  "center",
  "ceo",
  "cern",
  "cf",
  "cfa",
  "cfd",
  "cg",
  "ch",
  "chanel",
  "channel",
  "charity",
  "chase",
  "chat",
  "cheap",
  "chintai",
  "christmas",
  "chrome",
  "church",
  "ci",
  "cipriani",
  "circle",
  "city",
  "ck",
  "cl",
  "claims",
  "cleaning",
  "click",
  "clinic",
  "clinique",
  "clothing",
  "cloud",
  "club",
  "cm",
  "cn",
  "co",
  "coach",
  "codes",
  "coffee",
  "college",
  "cologne",
  "com",
  "commbank",
  "community",
  "company",
  "compare",
  "computer",
  "comsec",
  "condos",
  "construction",
  "consulting",
  "contact",
  "contractors",
  "cooking",
  "cool",
  "coop",
  "corsica",
  "country",
  "coupon",
  "coupons",
  "courses",
  "cpa",
  "cr",
  "credit",
  "creditcard",
  "creditunion",
  "cricket",
  "crown",
  "crs",
  "cruise",
  "cruises",
  "cu",
  "cuisinella",
  "cv",
  "cw",
  "cx",
  "cy",
  "cymru",
  "cyou",
  "cz",
  "dabur",
  "dad",
  "dance",
  "data",
  "date",
  "dating",
  "datsun",
  "day",
  "dclk",
  "dds",
  "de",
  "deal",
  "dealer",
  "deals",
  "degree",
  "delivery",
  "dell",
  "deloitte",
  "delta",
  "democrat",
  "dental",
  "dentist",
  "desi",
  "design",
  "dev",
  "dhl",
  "diamonds",
  "diet",
  "digital",
  "direct",
  "directory",
  "discount",
  "discover",
  "dish",
  "diy",
  "dj",
  "dk",
  "dm",
  "dnp",
  "do",
  "docs",
  "doctor",
  "dog",
  "domains",
  "dot",
  "download",
  "drive",
  "dtv",
  "dubai",
  "dunlop",
  "dupont",
  "durban",
  "dvag",
  "dvr",
  "dz",
  "earth",
  "eat",
  "ec",
  "eco",
  "edeka",
  "edu",
  "education",
  "ee",
  "eg",
  "email",
  "emerck",
  "energy",
  "engineer",
  "engineering",
  "enterprises",
  "epson",
  "equipment",
  "er",
  "ericsson",
  "erni",
  "es",
  "esq",
  "estate",
  "et",
  "eu",
  "eus",
  "events",
  "exchange",
  "expert",
  "exposed",
  "express",
  "extraspace",
  "fage",
  "fail",
  "fairwinds",
  "faith",
  "family",
  "fan",
  "fans",
  "farm",
  "farmers",
  "fashion",
  "fast",
  "fedex",
  "feedback",
  "fi",
  "film",
  "final",
  "finance",
  "financial",
  "fire",
  "firmdale",
  "fish",
  "fishing",
  "fit",
  "fitness",
  "fj",
  "fk",
  "flights",
  "flir",
  "florist",
  "flowers",
  "fly",
  "fm",
  "fo",
  "foo",
  "food",
  "football",
  "ford",
  "forex",
  "forsale",
  "forum",
  "foundation",
  "fox",
  "fr",
  "free",
  "fresenius",
  "frl",
  "frogans",
  "frontier",
  "ftr",
  "fun",
  "fund",
  "furniture",
  "futbol",
  "fyi",
  "ga",
  "gal",
  "gallery",
  "gallo",
  "gallup",
  "game",
  "games",
  "gap",
  "garden",
  "gay",
  "gb",
  "gbiz",
  "gd",
  "gdn",
  "ge",
  "gea",
  "gent",
  "genting",
  "george",
  "gf",
  "gg",
  "ggee",
  "gh",
  "gi",
  "gift",
  "gifts",
  "gives",
  "giving",
  "gl",
  "glass",
  "gle",
  "global",
  "globo",
  "gm",
  "gmail",
  "gmbh",
  "gmo",
  "gmx",
  "gn",
  "gold",
  "golf",
  "goo",
  "gop",
  "got",
  "gov",
  "gp",
  "gq",
  "gr",
  "grainger",
  "graphics",
  "gratis",
  "green",
  "gripe",
  "grocery",
  "group",
  "gs",
  "gt",
  "gu",
  "gucci",
  "guge",
  "guide",
  "guitars",
  "guru",
  "gw",
  "gy",
  "hair",
  "hamburg",
  "haus",
  "health",
  "healthcare",
  "help",
  "here",
  "hermes",
  "hiphop",
  "hiv",
  "hk",
  "hkt",
  "hm",
  "hn",
  "hockey",
  "holdings",
  "holiday",
  "homegoods",
  "homes",
  "honda",
  "horse",
  "hospital",
  "host",
  "hosting",
  "hot",
  "hotels",
  "house",
  "how",
  "hr",
  "hsbc",
  "ht",
  "hu",
  "icbc",
  "ice",
  "icu",
  "id",
  "ie",
  "ieee",
  "ifm",
  "ikano",
  "il",
  "im",
  "imamat",
  "immo",
  "immobilien",
  "in",
  "inc",
  "industries",
  "infiniti",
  "info",
  "ing",
  "ink",
  "institute",
  "insurance",
  "insure",
  "int",
  "international",
  "intuit",
  "investments",
  "io",
  "ipiranga",
  "iq",
  "ir",
  "irish",
  "is",
  "ismaili",
  "ist",
  "istanbul",
  "it",
  "itau",
  "itv",
  "jaguar",
  "java",
  "jcb",
  "je",
  "jeep",
  "jetzt",
  "jewelry",
  "jio",
  "jll",
  "jm",
  "jmp",
  "jnj",
  "jo",
  "jobs",
  "joburg",
  "jot",
  "joy",
  "jp",
  "jprs",
  "juegos",
  "juniper",
  "kaufen",
  "kddi",
  "ke",
  "kerryhotels",
  "kerrylogistics",
  "kerryproperties",
  "kfh",
  "kg",
  "kh",
  "ki",
  "kia",
  "kids",
  "kim",
  "kitchen",
  "kiwi",
  "km",
  "kn",
  "koeln",
  "komatsu",
  "kosher",
  "kp",
  "kpmg",
  "kpn",
  "kr",
  "krd",
  "kred",
  "kuokgroup",
  "kw",
  "ky",
  "kyoto",
  "kz",
  "la",
  "lacaixa",
  "lamborghini",
  "lamer",
  "lancaster",
  "land",
  "landrover",
  "lanxess",
  "lasalle",
  "lat",
  "latino",
  "latrobe",
  "law",
  "lawyer",
  "lb",
  "lc",
  "lds",
  "lease",
  "leclerc",
  "lefrak",
  "legal",
  "lgbt",
  "li",
  "lidl",
  "life",
  "lifeinsurance",
  "lifestyle",
  "lighting",
  "like",
  "lilly",
  "limited",
  "limo",
  "lincoln",
  "link",
  "lipsy",
  "live",
  "living",
  "lk",
  "llc",
  "llp",
  "loan",
  "loans",
  "locker",
  "locus",
  "lol",
  "london",
  "lotte",
  "lotto",
  "love",
  "lr",
  "ls",
  "lt",
  "ltd",
  "ltda",
  "lu",
  "lundbeck",
  "luxe",
  "luxury",
  "lv",
  "ly",
  "ma",
  "madrid",
  "maif",
  "maison",
  "makeup",
  "man",
  "management",
  "mango",
  "map",
  "market",
  "marketing",
  "markets",
  "mattel",
  "mba",
  "mc",
  "md",
  "me",
  "med",
  "media",
  "meet",
  "melbourne",
  "meme",
  "memorial",
  "men",
  "menu",
  "merckmsd",
  "mg",
  "mh",
  "miami",
  "mil",
  "mini",
  "mint",
  "mit",
  "mk",
  "ml",
  "mlb",
  "mls",
  "mm",
  "mma",
  "mn",
  "mo",
  "mobi",
  "mobile",
  "moda",
  "moe",
  "moi",
  "mom",
  "monash",
  "money",
  "monster",
  "mormon",
  "mortgage",
  "moscow",
  "moto",
  "motorcycles",
  "mov",
  "movie",
  "mp",
  "mq",
  "mr",
  "ms",
  "msd",
  "mt",
  "mtn",
  "mtr",
  "mu",
  "museum",
  "music",
  "mv",
  "mw",
  "mx",
  "my",
  "mz",
  "na",
  "nab",
  "nagoya",
  "name",
  "natura",
  "navy",
  "nba",
  "nc",
  "ne",
  "nec",
  "net",
  "network",
  "new",
  "news",
  "next",
  "nextdirect",
  "nexus",
  "nf",
  "nfl",
  "ng",
  "ngo",
  "nhk",
  "ni",
  "nico",
  "ninja",
  "nissay",
  "nl",
  "no",
  "now",
  "nowruz",
  "nowtv",
  "np",
  "nr",
  "nra",
  "nrw",
  "ntt",
  "nu",
  "nyc",
  "nz",
  "obi",
  "observer",
  "office",
  "okinawa",
  "olayan",
  "olayangroup",
  "ollo",
  "om",
  "omega",
  "one",
  "ong",
  "onl",
  "online",
  "ooo",
  "open",
  "orange",
  "org",
  "organic",
  "origins",
  "osaka",
  "otsuka",
  "ott",
  "ovh",
  "pa",
  "page",
  "paris",
  "pars",
  "partners",
  "parts",
  "party",
  "pay",
  "pccw",
  "pe",
  "pet",
  "pf",
  "pg",
  "ph",
  "pharmacy",
  "phd",
  "philips",
  "phone",
  "photo",
  "photography",
  "photos",
  "physio",
  "pics",
  "pictet",
  "pictures",
  "pid",
  "pin",
  "ping",
  "pink",
  "pioneer",
  "pizza",
  "pk",
  "pl",
  "place",
  "play",
  "plumbing",
  "plus",
  "pm",
  "pn",
  "pnc",
  "pohl",
  "poker",
  "politie",
  "post",
  "pr",
  "pramerica",
  "praxi",
  "press",
  "prime",
  "pro",
  "prod",
  "productions",
  "prof",
  "progressive",
  "promo",
  "properties",
  "property",
  "protection",
  "pru",
  "prudential",
  "ps",
  "pt",
  "pub",
  "pw",
  "pwc",
  "py",
  "qa",
  "qpon",
  "quebec",
  "quest",
  "racing",
  "radio",
  "re",
  "read",
  "realestate",
  "realtor",
  "realty",
  "recipes",
  "red",
  "rehab",
  "reise",
  "reisen",
  "reit",
  "reliance",
  "ren",
  "rent",
  "rentals",
  "repair",
  "report",
  "republican",
  "rest",
  "restaurant",
  "review",
  "reviews",
  "rexroth",
  "rich",
  "ricoh",
  "ril",
  "rio",
  "rip",
  "ro",
  "rocks",
  "rodeo",
  "rogers",
  "room",
  "rs",
  "rsvp",
  "ru",
  "rugby",
  "ruhr",
  "run",
  "rw",
  "rwe",
  "ryukyu",
  "sa",
  "saarland",
  "safe",
  "safety",
  "sakura",
  "sale",
  "salon",
  "sanofi",
  "sap",
  "sarl",
  "sas",
  "save",
  "saxo",
  "sb",
  "sbi",
  "sbs",
  "sc",
  "scb",
  "scholarships",
  "school",
  "science",
  "scot",
  "sd",
  "se",
  "search",
  "seat",
  "secure",
  "security",
  "seek",
  "select",
  "sener",
  "services",
  "seven",
  "sew",
  "sfr",
  "sg",
  "sh",
  "shangrila",
  "sharp",
  "shaw",
  "shell",
  "shia",
  "shiksha",
  "shoes",
  "shop",
  "shopping",
  "show",
  "si",
  "silk",
  "sina",
  "singles",
  "site",
  "sj",
  "sk",
  "ski",
  "skin",
  "sky",
  "sl",
  "sling",
  "sm",
  "smart",
  "smile",
  "sn",
  "sncf",
  "so",
  "soccer",
  "social",
  "software",
  "sohu",
  "solar",
  "solutions",
  "song",
  "sony",
  "soy",
  "spa",
  "space",
  "sport",
  "spot",
  "sr",
  "srl",
  "ss",
  "st",
  "stada",
  "star",
  "stockholm",
  "storage",
  "store",
  "stream",
  "studio",
  "study",
  "style",
  "su",
  "sucks",
  "supplies",
  "supply",
  "support",
  "surf",
  "surgery",
  "sv",
  "swatch",
  "swiss",
  "sx",
  "sy",
  "sydney",
  "systems",
  "sz",
  "tab",
  "taipei",
  "talk",
  "taobao",
  "tatar",
  "tattoo",
  "tax",
  "taxi",
  "tc",
  "tci",
  "td",
  "tdk",
  "team",
  "tech",
  "technology",
  "tel",
  "tennis",
  "tf",
  "tg",
  "th",
  "thd",
  "theater",
  "theatre",
  "tickets",
  "tienda",
  "tips",
  "tires",
  "tirol",
  "tjx",
  "tl",
  "tm",
  "tmall",
  "tn",
  "to",
  "today",
  "tokyo",
  "tools",
  "top",
  "total",
  "tours",
  "town",
  "toys",
  "tr",
  "trade",
  "trading",
  "training",
  "travel",
  "travelers",
  "travelersinsurance",
  "trust",
  "trv",
  "tt",
  "tube",
  "tui",
  "tunes",
  "tushu",
  "tv",
  "tvs",
  "tw",
  "tz",
  "ua",
  "ug",
  "uk",
  "university",
  "uno",
  "uol",
  "ups",
  "us",
  "uy",
  "uz",
  "va",
  "vacations",
  "vana",
  "vc",
  "ve",
  "vegas",
  "ventures",
  "vet",
  "vg",
  "vi",
  "viajes",
  "video",
  "vig",
  "viking",
  "villas",
  "vin",
  "vip",
  "vision",
  "viva",
  "vivo",
  "vlaanderen",
  "vn",
  "vodka",
  "volvo",
  "vote",
  "voting",
  "voto",
  "voyage",
  "vu",
  "wales",
  "walter",
  "wang",
  "wanggou",
  "watch",
  "watches",
  "weather",
  "webcam",
  "weber",
  "website",
  "wed",
  "wedding",
  "weibo",
  "weir",
  "wf",
  "whoswho",
  "wien",
  "wiki",
  "win",
  "wine",
  "woodside",
  "work",
  "works",
  "world",
  "wow",
  "ws",
  "wtc",
  "wtf",
  "xin",
  "xyz",
  "yachts",
  "yamaxun",
  "yandex",
  "ye",
  "yoga",
  "you",
  "youtube",
  "yt",
  "yun",
  "za",
  "zappos",
  "zara",
  "zero",
  "zip",
  "zm",
  "zone",
  "zuerich",
  "zw"
];

// node_modules/myst-parser/dist/config.js
var MARKDOWN_IT_CONFIG = {
  options: {
    html: true,
    // Enable HTML tags in source
    xhtmlOut: true,
    // Use '/' to close single tags (<br />)
    breaks: false,
    // Convert '\n' in paragraphs into <br>
    langPrefix: "language-",
    // CSS language prefix for fenced blocks
    linkify: false,
    // autoconvert URL-like texts to links
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "\u201C\u201D\u2018\u2019",
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 20
    // Internal protection, recursion limit
  },
  components: {
    core: {
      // Adding 'linkify' here is the only change to the MarkdownIt commonmark preset config
      rules: ["normalize", "block", "inline", "linkify", "text_join"]
    },
    block: {
      rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "autolink",
        "backticks",
        "emphasis",
        "entity",
        "escape",
        "html_inline",
        "image",
        "link",
        "newline",
        "text"
      ],
      rules2: ["balance_pairs", "emphasis", "fragments_join"]
    }
  }
};
var EXCLUDE_TLDS = ["py", "md", "dot", "next", "so", "es", "java", "zip"];

// node_modules/myst-parser/dist/tokensToMyst.js
var import_he = __toESM(require_he(), 1);

// node_modules/unist-builder/lib/index.js
var u = (
  /**
   * @type {(
   *   (<T extends string>(type: T) => {type: T}) &
   *   (<T extends string, P extends Props>(type: T, props: P) => {type: T} & P) &
   *   (<T extends string>(type: T, value: string) => {type: T, value: string}) &
   *   (<T extends string, P extends Props>(type: T, props: P, value: string) => {type: T, value: string} & P) &
   *   (<T extends string, C extends Array<Node>>(type: T, children: C) => {type: T, children: C}) &
   *   (<T extends string, P extends Props, C extends Array<Node>>(type: T, props: P, children: C) => {type: T, children: C} & P)
   * )}
   */
  /**
   * @param {string} type
   * @param {Props | ChildrenOrValue | null | undefined} [props]
   * @param {ChildrenOrValue | null | undefined} [value]
   * @returns {Node}
   */
  (function(type2, props, value) {
    const node = { type: String(type2) };
    if ((value === void 0 || value === null) && (typeof props === "string" || Array.isArray(props))) {
      value = props;
    } else {
      Object.assign(node, props);
    }
    if (Array.isArray(value)) {
      node.children = value;
    } else if (value !== void 0 && value !== null) {
      node.value = String(value);
    }
    return node;
  })
);

// node_modules/myst-parser/dist/fromMarkdown.js
var UNHIDDEN_TOKENS = /* @__PURE__ */ new Set([
  "parsed_directive_open",
  "parsed_directive_close",
  "directive_arg_open",
  "directive_arg_close",
  "directive_body_open",
  "directive_body_close",
  "myst_option_open",
  "myst_option_close",
  "parsed_role_open",
  "parsed_role_close",
  "role_body_open",
  "role_body_close"
]);
function withoutTrailingNewline(str2) {
  return str2[str2.length - 1] == "\n" ? str2.slice(0, str2.length - 1) : str2;
}
var MarkdownParseState = class {
  src;
  stack;
  handlers;
  constructor(src, handlers) {
    this.src = src;
    this.stack = [u("root", [])];
    this.handlers = getTokenHandlers(handlers);
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  addNode(node) {
    const top = this.top();
    if (this.stack.length && node && "children" in top)
      top.children?.push(node);
    return node;
  }
  addText(text, token, type2 = "text", attrs) {
    const top = this.top();
    const value = text;
    if (!value || !this.stack.length || !type2 || !("children" in top))
      return;
    const last = top.children?.[top.children.length - 1];
    if (type2 === "text" && last?.type === type2) {
      last.value += `${value}`;
      return last;
    }
    const node = { type: type2, ...attrs, value };
    top.children?.push(node);
    this.addPositionsToNode(node, token);
    return node;
  }
  openNode(type2, token, attrs, isLeaf = false) {
    const node = { type: type2, ...attrs };
    this.addPositionsToNode(node, token);
    if (!isLeaf)
      node.children = [];
    this.stack.push(node);
  }
  closeNode() {
    const node = this.stack.pop();
    return this.addNode(node);
  }
  parseTokens(tokens) {
    tokens?.forEach((token, index2) => {
      if (token.hidden && !UNHIDDEN_TOKENS.has(token.type))
        return;
      const handler = this.handlers[token.type];
      if (!handler) {
        throw new Error(`Token type ${token.type} not supported by tokensToMyst parser`);
      }
      handler(this, token, tokens, index2);
    });
  }
  _lastPosition;
  addPositionsToNode(node, token) {
    const col = token.col ?? [0, 0];
    if (token.map) {
      node.position = {
        start: { line: token.map[0] + 1, column: col[0] + 1 },
        end: { line: token.map[1], column: col[1] + 1 }
      };
    } else if (this._lastPosition) {
      node.position = {
        start: { line: this._lastPosition.start.line, column: col[0] + 1 },
        end: { line: this._lastPosition.start.line, column: col[1] + 1 }
      };
    }
    if (node.position) {
      this._lastPosition = node.position;
    }
  }
};
function getAttrs(state, spec, token, tokens, index2) {
  const attrs = spec.getAttrs?.(token, tokens, index2, state) || spec.attrs || {};
  if ("type" in attrs)
    throw new Error('You can not have "type" as attrs.');
  if ("children" in attrs)
    throw new Error('You can not have "children" as attrs.');
  return attrs;
}
function noCloseToken(spec, type2) {
  return spec.noCloseToken || type2 == "code_inline" || type2 == "code_block" || type2 == "fence";
}
function getTokenHandlers(specHandlers) {
  const handlers = {};
  Object.entries(specHandlers).forEach(([type2, spec]) => {
    const nodeType = spec.type;
    if (noCloseToken(spec, type2)) {
      handlers[type2] = (state, tok, tokens, i) => {
        if (spec.isText) {
          state.addText(withoutTrailingNewline(tok.content), tok, spec.type, getAttrs(state, spec, tok, tokens, i));
          return;
        }
        state.openNode(nodeType, tok, getAttrs(state, spec, tok, tokens, i), spec.isLeaf);
        state.addText(withoutTrailingNewline(tok.content), tok);
        state.closeNode();
      };
    } else {
      handlers[type2 + "_open"] = (state, tok, tokens, i) => state.openNode(nodeType, tok, getAttrs(state, spec, tok, tokens, i));
      handlers[type2 + "_close"] = (state) => state.closeNode();
    }
  });
  handlers.text = (state, tok) => state.addText(tok.content, tok);
  handlers.inline = (state, tok) => state.parseTokens(tok.children);
  handlers.softbreak = handlers.softbreak || ((state, tok) => state.addText("\n", tok));
  return handlers;
}

// node_modules/myst-parser/dist/transforms/listItemParagraphs.js
function listItemParagraphsTransform(tree) {
  selectAll("listItem", tree).forEach((node) => {
    if (!node.children || node.children.length === 0)
      return;
    const phrasingTypes = /* @__PURE__ */ new Set([
      "text",
      "emphasis",
      "strong",
      "delete",
      "link",
      "image",
      "break",
      "subscript",
      "superscript",
      "smallcaps",
      "inlineCode",
      "inlineMath",
      "mystRole",
      "footnoteReference",
      "crossReference",
      "cite",
      "citeGroup",
      "html"
    ]);
    const hasPhrasingContent = node.children.some((child) => phrasingTypes.has(child.type));
    if (hasPhrasingContent) {
      const newChildren = [];
      let currentPhrasingGroup = [];
      node.children.forEach((child) => {
        if (phrasingTypes.has(child.type)) {
          currentPhrasingGroup.push(child);
        } else {
          if (currentPhrasingGroup.length > 0) {
            newChildren.push({
              type: "paragraph",
              children: currentPhrasingGroup
            });
            currentPhrasingGroup = [];
          }
          newChildren.push(child);
        }
      });
      if (currentPhrasingGroup.length > 0) {
        newChildren.push({
          type: "paragraph",
          children: currentPhrasingGroup
        });
      }
      node.children = newChildren;
    }
  });
}

// node_modules/myst-parser/dist/tokensToMyst.js
function computeAmsmathTightness(src, map2) {
  const lines = src.split("\n");
  const tightBefore = typeof map2?.[0] === "number" && map2[0] > 0 ? lines[map2[0] - 1].trim() !== "" : false;
  const last = typeof map2?.[1] === "number" ? map2?.[1] + 1 : void 0;
  const tightAfter = typeof last === "number" && last < lines.length ? lines[last]?.trim() !== "" : false;
  const tight = tightBefore && tightAfter ? true : tightBefore ? "before" : tightAfter ? "after" : false;
  return tight;
}
var NUMBERED_CLASS = /^numbered$/;
var ALIGN_CLASS = /(?:(?:align-)|^)(left|right|center)/;
function getClassName(token, exclude) {
  const allClasses = /* @__PURE__ */ new Set([
    // Grab the trimmed classes from the token
    ...(token.attrGet("class") ?? "").split(" ").map((c) => c.trim()).filter((c) => c),
    // Add any from the meta information (these are often repeated)
    ...token.meta?.class ?? []
  ]);
  const className = [...allClasses].join(" ");
  if (!className)
    return void 0;
  return className.split(" ").map((c) => c.trim()).filter((c) => {
    if (!c)
      return false;
    if (!exclude)
      return true;
    return !exclude.reduce((doExclude, test2) => doExclude || !!c.match(test2), false);
  }).join(" ") || void 0;
}
function hasClassName(token, matcher) {
  const className = getClassName(token);
  if (!className)
    return false;
  const matches2 = className.split(" ").map((c) => c.match(matcher)).filter((c) => c);
  if (matches2.length === 0)
    return false;
  return matches2[0];
}
function getLang(t) {
  return import_he.default.decode(t.info).trim().split(" ")[0].replace("\\", "");
}
function getColAlign(t) {
  if (t.attrs?.length) {
    for (const attrPair of t.attrs) {
      if (attrPair[0] === "style") {
        const match = attrPair[1].match(/text-align:(left|right|center)/);
        if (match) {
          return match[1];
        }
      }
    }
  }
}
var defaultMdast = {
  heading: {
    type: "heading",
    getAttrs(token) {
      return {
        depth: Number(token.tag[1]),
        enumerated: token.meta?.enumerated
      };
    }
  },
  s: { type: "delete" },
  hr: {
    type: "thematicBreak",
    noCloseToken: true,
    isLeaf: true
  },
  paragraph: {
    type: "paragraph"
  },
  blockquote: {
    type: "blockquote"
  },
  ordered_list: {
    type: "list",
    getAttrs(token, tokens, index2) {
      const info = tokens[index2 + 1]?.info;
      const start = Number(tokens[index2 + 1]?.info);
      return {
        ordered: true,
        start: isNaN(start) || !info ? 1 : start,
        spread: false
      };
    }
  },
  bullet_list: {
    type: "list",
    attrs: {
      ordered: false,
      spread: false
    }
  },
  list_item: {
    type: "listItem",
    getAttrs(t) {
      const attrs = { spread: true };
      if (t.attrGet("class") === "task-list-item") {
        attrs.__taskList = true;
      }
      return attrs;
    }
  },
  em: {
    type: "emphasis"
  },
  strong: {
    type: "strong"
  },
  colon_fence: {
    type: "code",
    isLeaf: true,
    noCloseToken: true,
    getAttrs(t) {
      return { lang: getLang(t), value: withoutTrailingNewline(t.content) };
    }
  },
  fence: {
    type: "code",
    isLeaf: true,
    getAttrs(t) {
      const name2 = t.meta?.name || void 0;
      const showLineNumbers = !!(t.meta?.linenos || t.meta?.linenos === null || // Weird docutils implementation
      t.meta?.["number-lines"] || // If lineno-start is present, linenos option is also automatically activated
      // https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html#directive-option-code-block-lineno-start
      t.meta?.["lineno-start"]);
      const lineno = t.meta?.["lineno-start"] ?? t.meta?.["number-lines"];
      const startingLineNumber = lineno && lineno !== 1 && !isNaN(Number(lineno)) ? Number(lineno) : void 0;
      const emphasizeLines = t.meta?.["emphasize-lines"] ? t.meta?.["emphasize-lines"].split(",").map((n) => Number(n.trim())).filter((n) => !isNaN(n) && n > 0) : void 0;
      return {
        lang: getLang(t),
        ...normalizeLabel(name2),
        class: getClassName(t),
        showLineNumbers: showLineNumbers || void 0,
        // Only add to MDAST if true
        startingLineNumber: showLineNumbers ? startingLineNumber : void 0,
        // Only if showing line numbers!
        emphasizeLines,
        value: withoutTrailingNewline(t.content)
      };
    }
  },
  code_block: {
    type: "code",
    isLeaf: true,
    getAttrs(t) {
      return { lang: getLang(t), value: withoutTrailingNewline(t.content) };
    }
  },
  code_inline: {
    type: "inlineCode",
    noCloseToken: true,
    isText: true
  },
  hardbreak: {
    type: "break",
    noCloseToken: true,
    isLeaf: true
  },
  link: {
    type: "link",
    getAttrs(token) {
      return {
        url: token.attrGet("href"),
        title: token.attrGet("title") ?? void 0
      };
    }
  },
  image: {
    type: "image",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(token) {
      const alt = token.attrGet("alt") || token.children?.reduce((i, t) => i + t?.content, "");
      const alignMatch = hasClassName(token, ALIGN_CLASS);
      const align = alignMatch ? alignMatch[1] : void 0;
      return {
        url: token.attrGet("src"),
        alt: alt || void 0,
        title: token.attrGet("title") || void 0,
        class: getClassName(token, [ALIGN_CLASS]),
        width: token.attrGet("width") || void 0,
        height: token.attrGet("height") || void 0,
        align
      };
    }
  },
  dl: {
    type: "definitionList"
  },
  dt: {
    type: "definitionTerm"
  },
  dd: {
    type: "definitionDescription"
  },
  table: {
    type: "table",
    getAttrs(token) {
      const name2 = token.meta?.name || void 0;
      return {
        kind: void 0,
        ...normalizeLabel(name2),
        enumerated: token.meta?.enumerated,
        class: getClassName(token, [NUMBERED_CLASS, ALIGN_CLASS]),
        align: token.meta?.align || void 0
      };
    }
  },
  // table_caption: {
  //   type: 'caption',
  // },
  thead: {
    type: "_lift"
  },
  tbody: {
    type: "_lift"
  },
  tr: {
    type: "tableRow"
  },
  th: {
    type: "tableCell",
    getAttrs(t) {
      return { header: true, align: getColAlign(t) || void 0 };
    }
  },
  td: {
    type: "tableCell",
    getAttrs(t) {
      return { align: getColAlign(t) || void 0 };
    }
  },
  math_inline: {
    type: "inlineMath",
    noCloseToken: true,
    isText: true
  },
  math_inline_double: {
    type: "math",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t) {
      return {
        value: t.content.trim(),
        enumerated: t.meta?.enumerated
      };
    }
  },
  math_block: {
    type: "math",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t) {
      const name2 = t.info || void 0;
      return {
        value: t.content.trim(),
        ...normalizeLabel(name2),
        enumerated: t.meta?.enumerated
      };
    }
  },
  math_block_label: {
    type: "math",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t) {
      const name2 = t.info || void 0;
      return {
        value: t.content.trim(),
        ...normalizeLabel(name2),
        enumerated: t.meta?.enumerated
      };
    }
  },
  amsmath: {
    type: "math",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t, tokens, index2, state) {
      const tight = computeAmsmathTightness(state.src, t.map);
      const attrs = {
        value: t.content.trim(),
        enumerated: t.meta?.enumerated
      };
      if (tight)
        attrs.tight = tight;
      return attrs;
    }
  },
  footnote_ref: {
    type: "footnoteReference",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t) {
      const { identifier, label } = normalizeLabel(t?.meta?.label) || {};
      return { identifier, label };
    }
  },
  footnote_anchor: {
    type: "_remove",
    noCloseToken: true
  },
  footnote_block: {
    // The footnote block is a view concern, not AST
    // Lift footnotes out of the tree
    type: "_lift"
  },
  footnote: {
    type: "footnoteDefinition",
    getAttrs(t) {
      const { identifier, label } = normalizeLabel(t?.meta?.label) || {};
      return { identifier, label };
    }
  },
  cite: {
    type: "cite",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t) {
      const { identifier, label } = normalizeLabel(t?.meta?.label) || {};
      return {
        identifier,
        label,
        kind: t.meta.kind,
        partial: t.meta.partial,
        // author or year
        // TODO: can use the parsed version in the future
        prefix: t.meta.prefix?.[0].content,
        suffix: t.meta.suffix?.[0].content
      };
    }
  },
  cite_group: {
    type: "citeGroup",
    getAttrs(t) {
      return { kind: t.meta.kind };
    }
  },
  parsed_directive: {
    type: "mystDirective",
    getAttrs(t) {
      return {
        name: t.info,
        args: t.meta?.arg,
        options: t.meta?.options,
        value: t.content || void 0,
        tight: t.meta?.tight || void 0,
        processed: false
      };
    }
  },
  directive_arg: {
    type: "mystDirectiveArg",
    getAttrs(t) {
      return {
        value: t.content
      };
    }
  },
  directive_body: {
    type: "mystDirectiveBody",
    getAttrs(t) {
      return {
        value: t.content
      };
    }
  },
  directive_error: {
    type: "mystDirectiveError",
    noCloseToken: true,
    getAttrs(t) {
      return {
        message: t.meta?.error_message
      };
    }
  },
  myst_option: {
    type: "mystOption",
    getAttrs(t) {
      return {
        name: t.info,
        location: t.meta.location,
        value: t.meta.value
      };
    }
  },
  parsed_role: {
    type: "mystRole",
    getAttrs(t) {
      return {
        name: t.info,
        value: t.content,
        processed: false
      };
    }
  },
  role_body: {
    type: "mystRoleBody",
    getAttrs(t) {
      return {
        value: t.content
      };
    }
  },
  role_error: {
    type: "mystRoleError",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t) {
      return {
        value: t.content
      };
    }
  },
  myst_target: {
    type: "mystTarget",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t) {
      return {
        label: t.content
      };
    }
  },
  html_inline: {
    type: "html",
    noCloseToken: true,
    isText: true
  },
  html_block: {
    type: "html",
    noCloseToken: true,
    isText: true
  },
  myst_block_break: {
    type: "blockBreak",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t) {
      return {
        meta: t.content || void 0
      };
    }
  },
  myst_line_comment: {
    type: "comment",
    noCloseToken: true,
    isLeaf: true,
    getAttrs(t) {
      return {
        value: t.content.trim() || void 0
      };
    }
  }
};
function hoistSingleImagesOutofParagraphs(tree) {
  visit(tree, "paragraph", (node) => {
    if (!(node.children?.length === 1 && node.children?.[0].type === "image"))
      return;
    const child = node.children[0];
    Object.keys(node).forEach((k) => {
      delete node[k];
    });
    Object.assign(node, child);
  });
}
function nestSingleImagesIntoParagraphs(tree) {
  tree.children = tree.children.map((node) => {
    if (node.type === "image") {
      return { type: "paragraph", children: [node] };
    } else {
      return node;
    }
  });
}
var defaultOptions = {
  handlers: defaultMdast,
  hoistSingleImagesOutofParagraphs: true,
  listItemParagraphs: true,
  nestBlocks: true
};
function tokensToMyst(src, tokens, options = defaultOptions) {
  const opts = {
    ...defaultOptions,
    ...options,
    handlers: { ...defaultOptions.handlers, ...options?.handlers }
  };
  const state = new MarkdownParseState(src, opts.handlers);
  state.parseTokens(tokens);
  let tree;
  do {
    tree = state.closeNode();
  } while (state.stack.length);
  remove(tree, "_remove");
  liftChildren(tree, "_lift");
  selectAll("listItem[__taskList=true]", tree).forEach((node) => {
    delete node.__taskList;
    const html = node.children?.slice(0, 1);
    if (html && html[0].type === "html" && html[0].value?.includes("task-list-item-checkbox")) {
      node.checked = html[0].value.includes('checked=""');
      node.children?.splice(0, 1);
      if (node.children?.[0].type === "text") {
        node.children[0].value = node.children[0].value.replace(/^\s/, "");
      }
    }
  });
  if (opts.listItemParagraphs) {
    listItemParagraphsTransform(tree);
  }
  visit(tree, "crossReference", (node) => {
    delete node.children;
    if (node.value) {
      setTextAsChild(node, node.value);
      delete node.value;
    }
  });
  if (opts.nestBlocks) {
    const newTree = u("root", []);
    let lastBlock;
    const pushBlock = () => {
      if (!lastBlock)
        return;
      newTree.children.push(lastBlock);
    };
    tree.children?.forEach((node) => {
      if (node.type === "blockBreak") {
        pushBlock();
        lastBlock = node;
        node.type = "block";
        node.children = node.children ?? [];
        return;
      }
      const stack = lastBlock ? lastBlock : newTree;
      stack.children?.push(node);
    });
    pushBlock();
    tree = newTree;
  }
  if (opts.hoistSingleImagesOutofParagraphs) {
    hoistSingleImagesOutofParagraphs(tree);
  } else {
    nestSingleImagesIntoParagraphs(tree);
  }
  return tree;
}

// node_modules/myst-parser/dist/utils.js
function contentFromNode(node, spec, vfile, description, ruleId) {
  const { children, value } = node;
  if (spec.type === ParseTypesEnum.parsed || spec.type === "myst") {
    if (typeof value !== "string") {
      fileWarn(vfile, `content is parsed from non-string value for ${description}`, {
        node,
        ruleId
      });
    }
    if (!children?.length) {
      if (spec.required) {
        fileError(vfile, `no parsed content for required ${description}`, { node, ruleId });
      }
      return void 0;
    }
    return children;
  }
  if (value == null) {
    if (spec.required) {
      fileError(vfile, `no content for required ${description}`, { node, ruleId });
    }
    return void 0;
  }
  if (spec.type === ParseTypesEnum.string || spec.type === String) {
    if (value === true)
      return "";
    if (typeof value !== "string" && !(value && typeof value === "number" && !isNaN(value))) {
      fileWarn(vfile, `value is not a string for ${description}`, { node, ruleId });
    }
    return String(value);
  }
  if (spec.type === ParseTypesEnum.number || spec.type === Number) {
    const valueAsNumber = Number(value);
    if (value === true || isNaN(valueAsNumber)) {
      const fileFn = spec.required ? fileError : fileWarn;
      fileFn(vfile, `number not provided for ${description}`, { node, ruleId });
      return void 0;
    }
    return valueAsNumber;
  }
  if (spec.type === ParseTypesEnum.boolean || spec.type === Boolean) {
    if (typeof value === "string") {
      if (value.toLowerCase() === "false")
        return false;
      if (value.toLowerCase() === "true")
        return true;
    }
    if (typeof value !== "boolean") {
      fileWarn(vfile, `value is not a boolean for ${description}`, { node, ruleId });
    }
    return !!value;
  }
}
function markChildrenAsProcessed(node) {
  const children = selectAll("mystDirective,mystRole", {
    type: "root",
    children: node.children
  });
  children.forEach((child) => {
    delete child.processed;
  });
}

// node_modules/myst-parser/dist/inlineAttributes.js
function parseOptions(name2, node, vfile, optionsSpec) {
  let validationError2 = false;
  const options = {};
  const optionNodes = node.children?.filter((c) => c.type === "mystOption") ?? [];
  const optionNodeLookup = {};
  optionNodes.forEach((optionNode) => {
    if (optionNode.name === "id" && optionNode.location === "inline") {
      optionNodeLookup.label = optionNode;
      return;
    }
    if (optionNode.name === "class") {
      if (optionNodeLookup.class) {
        optionNodeLookup.class.value += ` ${optionNode.value}`;
      } else {
        optionNodeLookup.class = optionNode;
      }
      return;
    }
    if (optionNodeLookup[optionNode.name]) {
      fileWarn(vfile, `duplicate option "${optionNode.name}" declared (in ${name2})`, {
        node: optionNode,
        ruleId: RuleId.directiveOptionsCorrect
      });
    } else {
      optionNodeLookup[optionNode.name] = optionNode;
    }
  });
  Object.entries(optionsSpec || {}).forEach(([optionName, optionSpec]) => {
    let optionNameUsed = optionName;
    let optionNode = optionNodeLookup[optionName];
    optionSpec.alias?.forEach((alias) => {
      const aliasNode = optionNodeLookup[alias];
      if (!aliasNode)
        return;
      if (!optionNode && aliasNode) {
        optionNode = aliasNode;
        optionNameUsed = alias;
        optionNodeLookup[optionName] = optionNode;
      } else {
        fileWarn(vfile, `option "${optionNameUsed}" used instead of "${alias}" (in ${name2})`, {
          node,
          ruleId: RuleId.directiveOptionsCorrect
        });
      }
      delete optionNodeLookup[alias];
    });
    if (optionSpec.required && !optionNode) {
      fileError(vfile, `required option "${optionName}" not provided (in ${name2})`, {
        node,
        ruleId: RuleId.directiveOptionsCorrect
      });
      node.type = "mystDirectiveError";
      delete node.children;
      validationError2 = true;
    } else if (optionNode) {
      const content = contentFromNode(optionNode, optionSpec, vfile, `option "${optionName}" (in ${name2})`, RuleId.directiveOptionsCorrect);
      if (content != null) {
        options[optionName] = content;
      } else if (optionSpec.required) {
        validationError2 = true;
      }
      delete optionNodeLookup[optionName];
    }
  });
  Object.values(optionNodeLookup).forEach((optionNode) => {
    fileWarn(vfile, `unexpected option "${optionNode.name}" provided (in ${name2})`, {
      node: optionNode,
      ruleId: RuleId.directiveOptionsCorrect
    });
  });
  return { valid: validationError2, options: Object.keys(options).length ? options : void 0 };
}

// node_modules/myst-parser/dist/directives.js
function applyDirectives(tree, specs, vfile, ctx) {
  const specLookup = {};
  specs.forEach((spec) => {
    const names = [spec.name];
    if (spec.alias) {
      names.push(...typeof spec.alias === "string" ? [spec.alias] : spec.alias);
    }
    names.forEach((name2) => {
      if (specLookup[name2]) {
        fileWarn(vfile, `duplicate directives registered with name: ${name2}`, {
          ruleId: RuleId.directiveRegistered
        });
      } else {
        specLookup[name2] = spec;
      }
    });
  });
  const nodes = selectAll("mystDirective[processed=false]", tree);
  nodes.forEach((node) => {
    const { name: name2 } = node;
    const spec = specLookup[name2];
    if (spec && spec.body && spec.body.type !== "myst") {
      markChildrenAsProcessed(node);
    }
    if (node.processed !== false)
      return;
    delete node.processed;
    if (!spec) {
      fileError(vfile, `unknown directive: ${name2}`, { node, ruleId: RuleId.directiveKnown });
      delete node.children;
      if (node.options) {
        const optionsString = Object.entries(node.options).map(([key, val]) => {
          return `:${key}: ${val}`;
        }).join("\n");
        const value = node.value ? `

${node.value}` : "";
        node.value = `${optionsString}${value}`;
        delete node.options;
      }
      return;
    }
    const { arg: argSpec, options: optionsSpec, body: bodySpec, validate, run } = spec;
    let data = { name: name2, node, options: {} };
    let validationError2 = false;
    const argNode = node.children?.filter((c) => c.type === "mystDirectiveArg")[0];
    if (argSpec) {
      if (argSpec.required && !argNode) {
        const message = `required argument not provided for directive: ${name2}`;
        fileError(vfile, message, { node, ruleId: RuleId.directiveArgumentCorrect });
        node.type = "mystDirectiveError";
        node.message = message;
        delete node.children;
        validationError2 = true;
      } else if (argNode) {
        data.arg = contentFromNode(argNode, argSpec, vfile, `argument of directive: ${name2}`, RuleId.directiveArgumentCorrect);
        if (argSpec.required && data.arg == null) {
          validationError2 = true;
        }
      }
    } else if (argNode) {
      const message = `unexpected argument provided for directive: ${name2}`;
      fileWarn(vfile, message, { node: argNode, ruleId: RuleId.directiveArgumentCorrect });
    }
    const { valid: validOptions, options } = parseOptions(name2, node, vfile, optionsSpec);
    data.options = options;
    validationError2 = validationError2 || validOptions;
    const bodyNode = node.children?.filter((c) => c.type === "mystDirectiveBody")[0];
    if (bodySpec) {
      if (bodySpec.required && !bodyNode) {
        const message = `required body not provided for directive: ${name2}`;
        fileError(vfile, message, { node, ruleId: RuleId.directiveBodyCorrect });
        node.type = "mystDirectiveError";
        node.message = message;
        delete node.children;
        validationError2 = true;
      } else if (bodyNode) {
        data.body = contentFromNode(bodyNode, bodySpec, vfile, `body of directive: ${name2}`, RuleId.directiveBodyCorrect);
        if (bodySpec.required && data.body == null) {
          validationError2 = true;
        }
      }
    } else if (bodyNode) {
      fileWarn(vfile, `unexpected body provided for directive: ${name2}`, {
        node: bodyNode,
        ruleId: RuleId.directiveBodyCorrect
      });
    }
    if (validationError2)
      return;
    if (validate) {
      data = validate(data, vfile);
    }
    node.children = run(data, vfile, {
      // Implement a parseMyst function that accepts _relative_ line numbers
      parseMyst: (source, offset = 0) => ctx.parseMyst(source, offset + node.position.start.line)
    });
  });
}

// node_modules/myst-parser/dist/roles.js
function applyRoles(tree, specs, vfile) {
  const specLookup = {};
  specs.forEach((spec) => {
    const names = [spec.name];
    if (spec.alias) {
      names.push(...typeof spec.alias === "string" ? [spec.alias] : spec.alias);
    }
    names.forEach((name2) => {
      if (specLookup[name2]) {
        fileWarn(vfile, `duplicate roles registered with name: ${name2}`, {
          ruleId: RuleId.roleRegistered
        });
      } else {
        specLookup[name2] = spec;
      }
    });
  });
  const nodes = selectAll("mystRole[processed=false]", tree);
  nodes.forEach((node) => {
    const { name: name2 } = node;
    const spec = specLookup[name2];
    if (spec && spec.body && spec.body.type !== "myst") {
      markChildrenAsProcessed(node);
    }
    if (node.processed !== false)
      return;
    delete node.processed;
    if (!spec) {
      fileError(vfile, `unknown role: ${name2}`, { node, ruleId: RuleId.roleKnown });
      delete node.children;
      return;
    }
    const { body, options: optionsSpec, validate, run } = spec;
    let data = { name: name2, node, options: {} };
    const { valid: validOptions, options } = parseOptions(name2, node, vfile, optionsSpec);
    let validationError2 = validOptions;
    data.options = options;
    node.options = options;
    const bodyNode = node.children?.find((n) => n.type === "mystRoleBody");
    if (body) {
      if (body.required && !bodyNode) {
        fileError(vfile, `required body not provided for role: ${name2}`, {
          node,
          ruleId: RuleId.roleBodyCorrect
        });
        node.type = "mystRoleError";
        delete node.children;
        validationError2 = true;
      } else {
        data.body = contentFromNode(bodyNode, body, vfile, `body of role: ${name2}`, RuleId.roleBodyCorrect);
        if (body.required && data.body == null) {
          validationError2 = true;
        }
      }
    } else if (bodyNode) {
      fileWarn(vfile, `unexpected body provided for role: ${name2}`, {
        node: bodyNode,
        ruleId: RuleId.roleBodyCorrect
      });
    }
    if (validationError2)
      return;
    if (validate) {
      data = validate(data, vfile);
    }
    node.children = run(data, vfile);
  });
}

// node_modules/myst-parser/dist/myst.js
var defaultOptions2 = {
  markdownit: {
    html: true
  },
  extensions: {
    smartquotes: true,
    colonFences: true,
    frontmatter: true,
    math: true,
    footnotes: true,
    citations: true,
    deflist: true,
    tasklist: true,
    tables: true,
    blocks: true,
    strikethrough: false
  },
  mdast: {},
  directives: defaultDirectives,
  roles: defaultRoles
};
function parseOptions2(opts) {
  const parsedOpts = {
    vfile: opts?.vfile ?? new VFile(),
    mdast: { ...defaultOptions2.mdast, ...opts?.mdast },
    markdownit: { ...defaultOptions2.markdownit, ...opts?.markdownit },
    extensions: { ...defaultOptions2.extensions, ...opts?.extensions },
    directives: [...defaultOptions2.directives, ...opts?.directives ?? []],
    roles: [...defaultOptions2.roles, ...opts?.roles ?? []]
  };
  return parsedOpts;
}
function createTokenizer(opts) {
  const parsedOpts = parseOptions2(opts);
  const { extensions, markdownit } = parsedOpts;
  const tokenizer = (0, import_markdown_it.default)({
    ...MARKDOWN_IT_CONFIG,
    options: {
      ...MARKDOWN_IT_CONFIG.options,
      typographer: extensions.smartquotes ? true : false
    }
  }, markdownit);
  if (markdownit.linkify) {
    tokenizer.linkify.tlds(tlds.filter((tld) => !EXCLUDE_TLDS.includes(tld)));
  }
  if (extensions.strikethrough)
    tokenizer.enable("strikethrough");
  if (extensions.smartquotes)
    tokenizer.enable("smartquotes");
  if (extensions.tables)
    tokenizer.enable("table");
  if (extensions.colonFences)
    tokenizer.use(colonFencePlugin);
  if (extensions.frontmatter)
    tokenizer.use(import_markdown_it_front_matter.default, () => ({})).use(convertFrontMatter);
  if (extensions.blocks)
    tokenizer.use(mystBlockPlugin);
  if (extensions.footnotes)
    tokenizer.use(footnote_plugin).disable("footnote_inline");
  if (extensions.citations)
    tokenizer.use(citationsPlugin);
  tokenizer.use(mystPlugin);
  if (extensions.math)
    tokenizer.use(plugin, extensions.math);
  if (extensions.deflist)
    tokenizer.use(import_markdown_it_deflist.default);
  if (extensions.tasklist)
    tokenizer.use(import_markdown_it_task_lists.default);
  return tokenizer;
}
function mystParse(content, opts) {
  const { vfile } = opts || {};
  const parsedOpts = parseOptions2(opts);
  const tokenizer = createTokenizer(parsedOpts);
  const tree = tokensToMyst(content, tokenizer.parse(content, { vfile }), parsedOpts.mdast);
  applyDirectives(tree, parsedOpts.directives, parsedOpts.vfile, {
    parseMyst: (source, offset = 0) => {
      const mdast = mystParse(source, opts);
      visit(mdast, (node) => {
        if (node.position) {
          node.position.start.line += offset;
          node.position.end.line += offset;
        }
      });
      return mdast;
    }
  });
  applyRoles(tree, parsedOpts.roles, parsedOpts.vfile);
  return tree;
}

// node_modules/unist-util-find-after/lib/index.js
var findAfter = (
  /**
   * @type {(
   *  (<T extends Node>(node: Parent, index: Node | number, test: import('unist-util-is').PredicateTest<T>) => T | null) &
   *  ((node: Parent, index: Node | number, test?: Test) => Node | null)
   * )}
   */
  /**
   * @param {Parent} parent
   * @param {Node | number} index
   * @param {Test} [test]
   * @returns {Node | null}
   */
  (function(parent2, index2, test2) {
    const is2 = convert(test2);
    if (!parent2 || !parent2.type || !parent2.children) {
      throw new Error("Expected parent node");
    }
    if (typeof index2 === "number") {
      if (index2 < 0 || index2 === Number.POSITIVE_INFINITY) {
        throw new Error("Expected positive finite number as index");
      }
    } else {
      index2 = parent2.children.indexOf(index2);
      if (index2 < 0) {
        throw new Error("Expected child node or index");
      }
    }
    while (++index2 < parent2.children.length) {
      if (is2(parent2.children[index2], index2, parent2)) {
        return parent2.children[index2];
      }
    }
    return null;
  })
);

// node_modules/myst-transforms/dist/liftMystDirectivesAndRoles.js
function liftMystDirectivesAndRolesTransform(tree) {
  const directives = selectAll("mystDirective,mystRole", tree);
  directives.forEach((n) => {
    const child = n.children?.[0];
    if (!child)
      return;
    if (child.identifier) {
      delete n.identifier;
      delete n.label;
      delete n.html_id;
    }
    transferTargetAttrs(n, child);
  });
  liftChildren(tree, "mystDirective");
  liftChildren(tree, "mystRole");
}

// node_modules/myst-transforms/dist/targets.js
function mystTargetsTransform(tree, vfile) {
  visit(tree, "mystTarget", (node, index2, parent2) => {
    const nextNode = findAfter(parent2, index2);
    const normalized = { ...node, ...normalizeLabel(node.label) };
    if (nextNode && normalized) {
      transferTargetAttrs(normalized, nextNode, vfile);
    }
  });
  remove(tree, "mystTarget");
}

// node_modules/myst-transforms/dist/frontmatter.js
function getFrontmatter(file, tree, opts = { propagateTargets: true }) {
  if (opts.propagateTargets) {
    liftMystDirectivesAndRolesTransform(tree);
    mystTargetsTransform(tree, file);
  }
  const firstParent = tree.children[0]?.type === "block" ? tree.children[0] : tree;
  const firstNode = firstParent.children?.[0];
  const nextNonCommentNode = firstParent.children?.slice(1)?.find((child) => child.type !== "comment");
  let secondNode;
  if (nextNonCommentNode?.type === "block") {
    secondNode = nextNonCommentNode?.children?.find((child) => child.type !== "comment");
  } else {
    secondNode = nextNonCommentNode;
  }
  let frontmatter = {};
  const identifiers = [];
  const firstIsYaml = firstNode?.type === "code" && firstNode?.lang === "yaml";
  if (firstIsYaml) {
    try {
      frontmatter = jsYaml.load(firstNode.value) || {};
      firstNode.type = "__delete__";
    } catch (err) {
      fileError(file, "Invalid YAML frontmatter", {
        note: err.message,
        ruleId: RuleId.frontmatterIsYaml
      });
    }
  }
  if (opts.preFrontmatter) {
    frontmatter = fillProjectFrontmatter(opts.preFrontmatter, frontmatter, {
      property: "frontmatter",
      file: file.path,
      messages: {},
      errorLogFn: (message) => {
        fileError(file, message, { ruleId: RuleId.validPageFrontmatter });
      },
      warningLogFn: (message) => {
        fileWarn(file, message, { ruleId: RuleId.validPageFrontmatter });
      }
    });
  }
  if (frontmatter.content_includes_title != null) {
    fileWarn(file, `'frontmatter' cannot explicitly set: content_includes_title`, {
      ruleId: RuleId.validPageFrontmatter
    });
    delete frontmatter.content_includes_title;
  }
  const titleNull = frontmatter.title === null;
  if (titleNull)
    delete frontmatter.title;
  const firstHeadingNode = select("heading", tree);
  if (!frontmatter.title && firstHeadingNode) {
    const title = toText(firstHeadingNode.children);
    frontmatter.title = title;
    frontmatter.content_includes_title = true;
  }
  const firstIsComment = firstNode?.type === "comment";
  const nextNode = firstIsYaml || firstIsComment ? secondNode : firstNode;
  const nextNodeIsH1 = nextNode?.type === "heading" && nextNode.depth === 1;
  if (nextNodeIsH1 && !titleNull) {
    const title = toText(nextNode.children);
    if (frontmatter.title && frontmatter.title === title && !opts.keepTitleNode) {
      nextNode.type = "__delete__";
      frontmatter.content_includes_title = false;
      if (nextNode.label) {
        const { identifier } = normalizeLabel(nextNode.label) ?? {};
        if (identifier)
          identifiers.push(identifier);
      }
    }
  }
  const possibleNull = remove(tree, "__delete__");
  if (possibleNull === null) {
    remove(tree, { cascade: false }, "__delete__");
  }
  return { tree, frontmatter, identifiers };
}

// src/index.mjs
var import_nunjucks = __toESM(require_nunjucks(), 1);
var PROJECT_CONFIG_FILES = ["myst.yml", "myst.yaml"];
function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function hasTemplateSyntax(text) {
  return text.includes("{{") || text.includes("{%") || text.includes("{#");
}
function normalizeTemplateText(text) {
  return text.replaceAll("\u201C", '"').replaceAll("\u201D", '"').replaceAll("\u2018", "'").replaceAll("\u2019", "'");
}
function readYamlFile(filePath) {
  try {
    const text = readFileSync(filePath, "utf8");
    const data = jsYaml.load(text);
    return isPlainObject(data) ? data : {};
  } catch {
    return {};
  }
}
function findProjectConfig(rootDir) {
  for (const filename of PROJECT_CONFIG_FILES) {
    const fullPath = path.join(rootDir, filename);
    if (existsSync(fullPath)) return fullPath;
  }
  return null;
}
function getProjectSubstitutions(rootDir) {
  const configPath = findProjectConfig(rootDir);
  if (!configPath) {
    return {};
  }
  const config = readYamlFile(configPath);
  const substitutions = config?.project?.substitutions;
  const normalized = isPlainObject(substitutions) ? substitutions : {};
  return normalized;
}
function getPageSubstitutions(filePath) {
  if (!filePath) return {};
  try {
    const text = readFileSync(filePath, "utf8");
    const vfile = new VFile({ path: filePath });
    const tree = mystParse(text, { vfile });
    const { frontmatter } = getFrontmatter(vfile, tree);
    const substitutions = frontmatter?.substitutions;
    return isPlainObject(substitutions) ? substitutions : {};
  } catch {
    return {};
  }
}
function mergeSubstitutions(projectSubstitutions, pageSubstitutions) {
  return {
    ...projectSubstitutions ?? {},
    ...pageSubstitutions ?? {}
  };
}
function renderWithSubstitutions(text, substitutions, env) {
  if (!hasTemplateSyntax(text)) return text;
  const normalized = normalizeTemplateText(text);
  try {
    return env.renderString(normalized, substitutions);
  } catch {
    return text;
  }
}
function parseInlineMyst(content) {
  const tree = mystParse(content);
  if (!tree || !Array.isArray(tree.children)) return null;
  if (tree.children.length === 0) return [];
  if (tree.children.length === 1 && tree.children[0]?.type === "paragraph") {
    return tree.children[0].children ?? [];
  }
  return null;
}
function visit2(node, parent2, index2, callback) {
  if (!node) return;
  callback(node, parent2, index2);
  if (!Array.isArray(node.children)) return;
  node.children.forEach((child, childIndex) => visit2(child, node, childIndex, callback));
}
function collectTextNodes(root2) {
  const matches2 = [];
  visit2(root2, null, null, (node, parent2, index2) => {
    if (!parent2 || !Array.isArray(parent2.children)) return;
    if (node?.type !== "text" || typeof node.value !== "string") return;
    if (!hasTemplateSyntax(node.value)) return;
    matches2.push({ node, parent: parent2, index: index2 });
  });
  return matches2;
}
function applySubstitutionsToTree(tree, substitutions, env) {
  const matches2 = collectTextNodes(tree);
  for (let i = matches2.length - 1; i >= 0; i -= 1) {
    const { node, parent: parent2, index: index2 } = matches2[i];
    const rendered = renderWithSubstitutions(node.value, substitutions, env);
    if (rendered === node.value) continue;
    const inlineNodes = parseInlineMyst(rendered);
    if (inlineNodes === null) {
      node.value = rendered;
      continue;
    }
    if (inlineNodes.length === 0) {
      parent2.children.splice(index2, 1);
      continue;
    }
    parent2.children.splice(index2, 1, ...inlineNodes);
  }
}
var substitutionsTransform = {
  name: "myst-substitutions",
  doc: "Replace Nunjucks-style substitutions using project and page metadata.",
  stage: "document",
  plugin: () => {
    const env = new import_nunjucks.default.Environment(null, {
      autoescape: false,
      throwOnUndefined: false
    });
    return (tree, file) => {
      const rootDir = file?.cwd || process.cwd();
      const projectSubstitutions = getProjectSubstitutions(rootDir);
      const pageSubstitutions = getPageSubstitutions(file?.path);
      const substitutions = mergeSubstitutions(projectSubstitutions, pageSubstitutions);
      if (!Object.keys(substitutions).length) return tree;
      applySubstitutionsToTree(tree, substitutions, env);
      return tree;
    };
  }
};
var plugin2 = {
  name: "MyST Substitutions",
  transforms: [substitutionsTransform]
};
var index_default = plugin2;
export {
  index_default as default,
  getPageSubstitutions,
  getProjectSubstitutions,
  mergeSubstitutions,
  renderWithSubstitutions
};
/*! Bundled license information:

classnames/index.js:
  (*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  *)

is-buffer/index.js:
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

he/he.js:
  (*! https://mths.be/he v1.2.0 by @mathias | MIT license *)

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT *)

markdown-it-myst/dist/citations.js:
  (**
   * @license
   * citations.js file is adapted from `markdown-it-citations` (Sept 2023)
   * MIT License - Martin Ring <@martinring>
   * https://github.com/martinring/markdown-it-citations
   *)
*/
