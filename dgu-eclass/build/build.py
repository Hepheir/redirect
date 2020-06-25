#-*-encoding:utf-8-*-
import re
import os

def main():
    repository_path = os.path.sep.join(__file__.split(os.path.sep)[:-2])
    print(f"Selected Repository: '{repository_path}'")

    # --------------------------------

    iter_list = [
        work({ # DEV
            'name' : 'app-dev',
            'save_to' : 'app-dev.js',
            'scripts' : [
                'build/src/class/*',
                'build/src/class/form/*',
                'build/src/app.js'
            ],
            'process' : [collectScripts]
        }),

        work({ # RELEASE
            'name' : 'app-release',
            'save_to' : 'app-release.js',
            'scripts' : [
                'build/src/class/*',
                'build/src/class/form/*',
                'build/src/app.js'
            ],
            'process' : [collectScripts, removeComments, removeWhiteSpaces]
        }),
        
        work({
            'name' : 'linker',
            'save_to' : 'linker-compressed.js',
            'scripts' : ['build/src/linker.js'],
            'process' : [collectScripts, removeComments, removeWhiteSpaces]
        }),

        # work({
        #     'name' : 'readme',
        #     'save_to' : 'readme.md',
        #     'scripts' : ['build/src/caller.js'],
        #     'process' : [collectScripts, removeComments, removeWhiteSpaces, wrapJS, wrapReadme]
        # })
    ]

    for name, save_to, script_path_list, process in iter_list:
        print(f' * Building: {name}')
        print(f' * Collecting: {str(script_path_list)}')

        script_abspath_list = [os.path.sep.join([repository_path, f]) for f in script_path_list]
        saveto_abspath = os.path.sep.join([repository_path, save_to])
        
        result = script_abspath_list

        print(' * Process:')
        for func in process:
            print(f'   * {str(func)}')
            result = func(result)

        saveScript(saveto_abspath, result)
        print(f" * Saved at '{saveto_abspath}'", end='\n\n')

    print('Build complete.')
    print(f' * Total {error_cnt} errors.')

error_cnt = 0

# ================================================

def readScript(file_path):
    global error_cnt
    if not isJavascript(file_path):
        error_cnt += 1
        print(f" * Error : '{file_path}'' is not a javascript file.")
        return ''
    
    with open(file_path, 'r') as f:
        return f.read()

    error_cnt += 1
    print(f' * Error : Unknown error.')
    return ''

def readScriptAll(dir_path):
    global error_cnt
    if not os.path.isdir(dir_path):
        error_cnt += 1
        print(f" * Error : '{dir_path}'' is not a directory.")
        return ''
    
    print(f"     * From '{dir_path}'")
    for file_basename in os.listdir(dir_path):
        file_path = os.path.join(dir_path, file_basename)
        if isJavascript(file_path):
            print(f"       * Collecting '{file_basename}'")
            yield readScript(file_path)

def saveScript(path, txt):
    f = open(path, 'w')
    f.write(txt)
    f.close()

def work(_dict): # 그저 가독성 용.
    return [_dict[key] for key in _dict]

def collectScripts(path_list):
    retval = "'use-strict';"
    for path in path_list:
        retval += '\n'
        if path.endswith('/*'):
            dir_path = path[:-1] # remove asterisk
            retval += '\n'.join(list(readScriptAll(dir_path)))
        else:
            retval += readScript(path)
    return retval

# ================================================

def isJavascript(path):
    name, ext = os.path.splitext(path)
    return os.path.isfile(path) and (ext in ['.js'])

def removeWhiteSpaces(code_raw):
    # 좌우에 공백을 끼는, 제거 가능한 패턴
    REGEXP_META_CHAR = ".+*{}[]()?|"
    OTHERS           = ",-=:;<>"

    for token in REGEXP_META_CHAR:
        code_raw = re.sub(f'[\s]*\\{token}[\s]*', token, code_raw)
        
    for token in OTHERS:
        code_raw = re.sub(f'[\s]*{token}[\s]*', token, code_raw)
        
    code_raw = re.sub(r'[\s]+', ' ', code_raw) # 공백
    return code_raw

def removeComments(code_raw):
    old_code_raw = ''
    while old_code_raw != code_raw:
        old_code_raw = code_raw
        code_raw = re.sub(r'[^((http:)|(https:))]//[^\n]*($|\n)', '\n', code_raw) # 한 줄 주석(// ~). 앞의 [^:]은 url의 유실을 방지.
    code_raw = re.sub(r'/\*(.*)\*/', '\n', code_raw) # 여러 줄 주석 (/* ~ */)
    return code_raw

def wrapJS(source):
    return f'javascript: (function(){{{source}}})();'

def wrapReadme(source):
    return f"""
# 악용하지 마시오

## 개요
소스코드는 구글 크롬을 기준으로 작성됨.

## 설치

![페이지 추가](img/1s.png)

구글 크롬에서 [북마크바 위에 마우스 커서를 올리고 **우클릭**]-[페이지 추가] 클릭
* 북마크바는 (Ctrl+Shift+B)를 누르면 나타남.

![북마크 수정](img/2s.png)

* 이름: *적당히 아무 이름으로 설정*
* URL: **(중요)** *본래 내용을 지우고, 아래의 '코드 전체'를 복사 붙여넣기*

```javascript
{source}
```

그리고 저장.

## 실행
이클래스 홈페이지에서 '설치'과정에서 생성한 북마크를 실행.

> 이클래스 유틸리티 기능이 활성화 되었습니다.

라는 문구가 뜨면 성공.

## 종료
위에서 생성한 북마크를 한번 더 실행.

종료를 묻는 문구가 뜨면 [확인] 선택.
"""

# ================================================

main()