#!/usr/bin/env python3
"""Read-only comparison of Spring MVC mappings and the MindU docs catalog.

Run from anywhere: python tools/audit_routes.py [path-to-javaMindU]
The default assumes docsMindU and javaMindU are sibling directories.
"""
from __future__ import annotations

import re
import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT.parent / "javaMindU"
JAVA_ROOT = BACKEND / "src" / "main" / "java"
DOC_ROOT = ROOT / "data" / "routes"
POSTMAN = ROOT / "docs" / "mindu-postman-collection.json"
ANDROID_ROOT = Path(r"C:\Users\livia\AndroidStudioProjects\MindUApp")
METHODS = {"Get": "get", "Post": "post", "Put": "put", "Patch": "patch", "Delete": "delete"}


def literals(annotation_args: str) -> list[str]:
    return [s.replace('\\"', '"').replace('\\\\', '\\') for s in re.findall(r'"((?:\\.|[^"\\])*)"', annotation_args)]


def args_after(source: str, start: int) -> tuple[str, int]:
    i = start
    while i < len(source) and source[i].isspace():
        i += 1
    if i >= len(source) or source[i] != "(":
        return "", i
    depth, quoted, escaped = 0, False, False
    for j in range(i, len(source)):
        ch = source[j]
        if quoted:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == '"':
                quoted = False
            continue
        if ch == '"':
            quoted = True
        elif ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                return source[i + 1:j], j + 1
    return "", i


def java_routes() -> set[tuple[str, str]]:
    found: set[tuple[str, str]] = set()
    for file in JAVA_ROOT.rglob("*Controller.java"):
        source = file.read_text(encoding="utf-8-sig")
        source = re.sub(r"/\*.*?\*/", "", source, flags=re.S)
        source = re.sub(r"//[^\n]*", "", source)
        class_match = re.search(r"@RequestMapping\b", source)
        base_paths = [""]
        if class_match:
            args, _ = args_after(source, class_match.end())
            parsed = literals(args)
            if parsed:
                base_paths = parsed
        for match in re.finditer(r"@(Get|Post|Put|Patch|Delete)Mapping\b", source):
            args, _ = args_after(source, match.end())
            suffixes = literals(args) or [""]
            for base in base_paths:
                for suffix in suffixes:
                    path = base if not suffix else (base.rstrip("/") + "/" + suffix.lstrip("/"))
                    path = path or "/"
                    path = re.sub(r"/{2,}", "/", path)
                    found.add((METHODS[match.group(1)], path))
    return found


def catalog_routes() -> set[tuple[str, str]]:
    found: set[tuple[str, str]] = set()
    for file in DOC_ROOT.glob("*.js"):
        source = file.read_text(encoding="utf-8-sig")
        for method, path in re.findall(r'\{\s*m:\s*"(get|post|put|patch|delete)"\s*,\s*path:\s*"([^"]+)"', source):
            found.add((method, path))
    return found


def postman_routes() -> set[tuple[str, str]]:
    collection = json.loads(POSTMAN.read_text(encoding="utf-8"))
    found: set[tuple[str, str]] = set()
    def walk(items: list[dict]) -> None:
        for item in items:
            request = item.get("request")
            if request:
                raw = request.get("url", {}).get("raw", "")
                path = re.sub(r"^\{\{baseUrl\}\}", "", raw).split("?", 1)[0]
                path = re.sub(r"\{\{([^}]+)\}\}", r"{\1}", path)
                method = request.get("method", "").lower()
                if method and path.startswith("/v1/"):
                    found.add((method, path))
            walk(item.get("item", []))
    walk(collection.get("item", []))
    return found


def android_routes() -> set[tuple[str, str]]:
    api_file = ANDROID_ROOT / "app" / "src" / "main" / "java" / "com" / "example" / "mindu" / "api" / "ApiService.java"
    if not api_file.exists():
        return set()
    source = api_file.read_text(encoding="utf-8-sig")
    found = set()
    pattern = re.compile(r'@(GET|POST|PUT|PATCH|DELETE)\s*\(\s*"([^"]+)"\s*\)')
    for method, path in pattern.findall(source):
        found.add((method.lower(), "/" + path.lstrip("/")))
    return found


api, catalog, postman = java_routes(), catalog_routes(), postman_routes()
missing, extra = sorted(api - catalog), sorted(catalog - api)
postman_missing = sorted(api - postman)
print(f"Mappings no backend: {len(api)}")
print(f"Entradas no catálogo: {len(catalog)}")
print("Faltam no catálogo:")
for method, path in missing:
    print(f"  {method.upper():6} {path}")
print("Não existem mais no backend:")
for method, path in extra:
    print(f"  {method.upper():6} {path}")
print(f"Diferenças: {len(missing) + len(extra)}")
print(f"Cobertura Postman: {len(api & postman)}/{len(api)}; faltam: {len(postman_missing)}")
for method, path in postman_missing:
    print(f"  {method.upper():6} {path}")
android = android_routes()
print(f"Rotas declaradas em ApiService Android: {len(android & api)}/{len(api)}")
sys.exit(1 if missing or extra or postman_missing else 0)
