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
    code_raw = re.sub(r'\/\/.*($|\n)', '', code_raw) # 한 줄 주석(// ~)
    return code_raw

def wrapJS(source):
    return 'javascript: (function(){' + source + '})();'

# ================================================

if __name__ == '__main__':
    current_path = parent_dir_of(__file__)

    app_init_file = current_path + 'src/app.js'
    # app_init_file = current_path + 'src/caller.js' # To compress caller

    save_build_to = parent_dir_of(current_path) + 'app.js'

    f_app   = open(app_init_file, 'r')
    f_build = open(save_build_to, 'w')

    code_raw = f_app.read()
    
    for func in [removeComments, removeWhiteSpaces, wrapJS]:
        code_raw = func(code_raw)

    f_build.write(code_raw)

    f_app.close()
    f_build.close()