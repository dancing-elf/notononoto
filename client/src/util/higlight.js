/**
 * By default highlight.js register all available languages
 * in lib/index.js. That result in too big bundle. So here
 * we manually add selected languages.
 */

import hljs from "highlight.js/lib/highlight";

import apache from "highlight.js/lib/languages/apache";
hljs.registerLanguage("apache", apache);

import cpp from "highlight.js/lib/languages/cpp";
hljs.registerLanguage("cpp", cpp);

import xml from "highlight.js/lib/languages/xml";
hljs.registerLanguage("xml", xml);

import bash from "highlight.js/lib/languages/bash";
hljs.registerLanguage("bash", bash);

import ceylon from "highlight.js/lib/languages/ceylon";
hljs.registerLanguage("ceylon", ceylon);

import clojure from "highlight.js/lib/languages/clojure";
hljs.registerLanguage("clojure", clojure);

import clojure_repl from "highlight.js/lib/languages/clojure-repl";
hljs.registerLanguage("clojure-repl", clojure_repl);

import cmake from "highlight.js/lib/languages/cmake";
hljs.registerLanguage("cmake", cmake);

import cs from "highlight.js/lib/languages/cs";
hljs.registerLanguage("cs", cs);

import css from "highlight.js/lib/languages/css";
hljs.registerLanguage("css", css);

import markdown from "highlight.js/lib/languages/markdown";
hljs.registerLanguage("markdown", markdown);

import diff from "highlight.js/lib/languages/diff";
hljs.registerLanguage("diff", diff);

import dockerfile from "highlight.js/lib/languages/dockerfile";
hljs.registerLanguage("dockerfile", dockerfile);

import dos from "highlight.js/lib/languages/dos";
hljs.registerLanguage("dos", dos);

import ruby from "highlight.js/lib/languages/ruby";
hljs.registerLanguage("ruby", ruby);

import erlang_repl from "highlight.js/lib/languages/erlang-repl";
hljs.registerLanguage("erlang-repl", erlang_repl);

import erlang from "highlight.js/lib/languages/erlang";
hljs.registerLanguage("erlang", erlang);

import fortran from "highlight.js/lib/languages/fortran";
hljs.registerLanguage("fortran", fortran);

import go from "highlight.js/lib/languages/go";
hljs.registerLanguage("go", go);

import gradle from "highlight.js/lib/languages/gradle";
hljs.registerLanguage("gradle", gradle);

import groovy from "highlight.js/lib/languages/groovy";
hljs.registerLanguage("groovy", groovy);

import haskell from "highlight.js/lib/languages/haskell";
hljs.registerLanguage("haskell", haskell);

import java from "highlight.js/lib/languages/java";
hljs.registerLanguage("java", java);

import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);

import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("json", json);

import kotlin from "highlight.js/lib/languages/kotlin";
hljs.registerLanguage("kotlin", kotlin);

import lisp from "highlight.js/lib/languages/lisp";
hljs.registerLanguage("lisp", lisp);

import lua from "highlight.js/lib/languages/lua";
hljs.registerLanguage("lua", lua);

import makefile from "highlight.js/lib/languages/makefile";
hljs.registerLanguage("makefile", makefile);

import matlab from "highlight.js/lib/languages/matlab";
hljs.registerLanguage("matlab", matlab);

import perl from "highlight.js/lib/languages/perl";
hljs.registerLanguage("perl", perl);

import objectivec from "highlight.js/lib/languages/objectivec";
hljs.registerLanguage("objectivec", objectivec);

import ocalm from "highlight.js/lib/languages/ocaml";
hljs.registerLanguage("ocaml", ocalm);

import php from "highlight.js/lib/languages/php";
hljs.registerLanguage("php", php);

import powershell from "highlight.js/lib/languages/powershell";
hljs.registerLanguage("powershell", powershell);

import python from "highlight.js/lib/languages/python";
hljs.registerLanguage("python", python);

import qml from "highlight.js/lib/languages/qml";
hljs.registerLanguage("qml", qml);

import r from "highlight.js/lib/languages/r";
hljs.registerLanguage("r", r);

import rust from "highlight.js/lib/languages/rust";
hljs.registerLanguage("rust", rust);

import scala from "highlight.js/lib/languages/scala";
hljs.registerLanguage("scala", scala);

import sql from "highlight.js/lib/languages/sql";
hljs.registerLanguage("sql", sql);

import swift from "highlight.js/lib/languages/swift";
hljs.registerLanguage("swift", swift);

import tex from "highlight.js/lib/languages/tex";
hljs.registerLanguage("tex", tex);

import typescript from "highlight.js/lib/languages/typescript";
hljs.registerLanguage("typescript", typescript);

import x86asm from "highlight.js/lib/languages/x86asm";
hljs.registerLanguage("x86asm", x86asm);


export function getHljs() {
    return hljs;
}