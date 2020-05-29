#-*-encoding:utf-8-*-
import re

def parent_dir_of(path):
    return re.sub(r'[^/]+/?$', '', path)

def removeWhiteSpaces(code_raw):
    # 좌우에 공백을 끼는, 제거 가능한 패턴
    REGEXP_META_CHAR = ".+*{}[]()?|"
    OTHERS           = ",-=:;<>"

    for token in REGEXP_META_CHAR:
        code_raw = re.sub('[\s]*\\%s[\s]*'%(token), token, code_raw)
        
    for token in OTHERS:
        code_raw = re.sub('[\s]*%s[\s]*'%(token), token, code_raw)
        
    code_raw = re.sub(r'[\s]+', ' ', code_raw) # 공백
    return code_raw

def removeComments(code_raw):
    code_raw = re.sub(r'\/\*.+\*\/', '', code_raw) # 여러 줄 주석 (/* ~ */)
    code_raw = re.sub(r'[^:]\/\/.*($|\n)', '', code_raw) # 한 줄 주석(// ~). 앞의 [^:]은 url의 유실을 방지.
    return code_raw

# ================================================

def wrapNothing(x):
    return x

def wrapJS(source):
    return 'javascript: (function(){' + source + '})();'

def wrapReadme(source):
    return """
# 악용하지 마시오

## 개요
소스코드는 구글 크롬을 기준으로 작성됨.

## 설치
[북마크바(Ctrl+Shift+B)에서 **마우스 우클릭**]-[페이지 추가] 클릭

* 이름: *적당히 아무 이름으로 설정*
* URL: **(중요)** *본래 내용을 지우고, 아래의 '코드 전체'를 복사 붙여넣기*

```javascript
%s
```

그리고 저장.

## 실행
이클래스 홈페이지에서 '설치'과정에서 생성한 북마크를 실행.

> 이클래스 유틸리티 기능이 활성화 되었습니다.

라는 문구가 뜨면 성공.
""" % source

# ================================================

def collectScripts(path_list):
    code_raw = ''
    for path in path_list:
        f = open(path, 'r')
        code_raw += f.read()
        f.close()
    return code_raw

def compressScript(script):
    for func in [removeComments, removeWhiteSpaces]:
        script = func(script)
    return script

def saveScript(path, txt):
    f = open(path, 'w')
    f.write(txt)
    f.close()

def path_correct(dir_path, file_path_list):
    return [dir_path + file_path for file_path in file_path_list]

def work(_dict): # 그저 가독성 용.
    return [_dict[key] for key in _dict]

# ================================================

if __name__ == '__main__':
    repository_path = parent_dir_of(parent_dir_of(__file__))
    print("Selected Repository: '%s'" % (repository_path))
 
    iter_list = [
        work({
            'name' : 'app',
            'save_to' : 'app-compressed.js',
            'scripts' : [
                'build/src/app.js',
                'build/src/class/ListWrapper.js',
                'build/src/class/Form.js',
                'build/src/class/ReportForm.js',
                'build/src/class/LessonForm.js'
            ],
            'format' : wrapJS
        }),

        work({
            'name' : 'linker',
            'save_to' : 'linker-compressed.js',
            'scripts' : ['build/src/linker.js'],
            'format' : wrapJS
        }),

        work({
            'name' : 'caller',
            'save_to' : 'caller-compressed.js',
            'scripts' : ['build/src/caller.js'],
            'format' : wrapJS
        }),

        work({
            'name' : 'readme',
            'save_to' : 'readme.md',
            'scripts' : ['caller-compressed.js'],
            'format' : wrapReadme
        })
    ]

    for name, save_to, script_path_list, formatter in iter_list:
        print(' * Building: %s' % name)
        print(' * Collecting: %s' % str(script_path_list))

        script_abspath_list = path_correct(repository_path, script_path_list)
        save_to_abspath = repository_path + save_to

        script_raw = collectScripts(script_abspath_list)
        script_compressed = compressScript(script_raw)
        script_wrapped = formatter(script_compressed)

        saveScript(save_to_abspath, script_wrapped)

        print(' * Saved.', end='\n\n')

    print('Build complete.')