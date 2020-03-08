let editor = document.getElementById("code");
let codeRepr = document.getElementById("code-render");


function get_lexem(str, startpos){

    let lexems = [
        "->","$eol", "..", ".", "(", ")",
        "{", "}", "[", "]", ",", ":",
        "==", "!=", "<", ">", "<=", ">=",
        "+=", "-=", "*=", "/=", "=", "+", "-", "**", "*", "/"
    ];
    let keywords = [
        "or", "and", "not", "if",
        "for", "true", "false", "else", "fun", "$class",
        "async", "write", "import", "null", "in", "return", "this" ,
        "while", "$indent", "$dedent"
    ];
    let newpos = startpos;
    if(str.charAt(startpos) === '\n'){
        return {
            type: "linebreak",
            start: startpos,
            end: startpos
        };
    }

    while( str.charAt(startpos) === " " ){
        startpos++
    }
    if(newpos !== startpos)
        return {
            type: "ws",
            start: newpos,
            end: startpos - 1
        };
    if(str.charAt(startpos) === '#'){
        let endpos = startpos + 1;
        while( str.charAt(endpos) !== '\n' && endpos < str.length ){
            endpos++;
        }
        return {
            type: "comment",
            value: str.substr(startpos, endpos - startpos),
            start: startpos,
            end: endpos - 1
        }
    }
    if(str.charAt(startpos) === '"'){
        let endpos = startpos + 1;
        while(str.charAt(endpos) !== '"' && endpos < str.length){
            if(str.charAt(endpos) === '\\'){
                endpos++;
            }
            endpos++;
        }
        if( endpos !== str.length ) return {
            type: "string",
            start: startpos,
            end: endpos,
            value: str.substr(startpos + 1, endpos - 1 - startpos)
        }; else return {
            type: "unterminated",
            start: startpos,
            end: endpos - 1,
            value: str.substr(startpos + 1, endpos - 1 - startpos)
        }
    }
    for(let i = 0; i < lexems.length; ++i){
        let lex_len = lexems[i].length;
        if( str.substr(startpos, lex_len) === lexems[i] ){
            return {
                type: "kw",
                start: startpos,
                end: startpos + lexems[i].length - 1,
                value: lexems[i]
            }
        }
    }
    let end_reader = startpos;
    while(      str.charAt(end_reader) >= 'a' && str.charAt(end_reader) <= 'z'
            ||  str.charAt(end_reader) >= 'A' && str.charAt(end_reader) <= 'Z'
            ||  str.charAt(end_reader) === '_'
        ){
        end_reader++;
    }
    if(end_reader !== startpos){
        for(let i = 0; i < keywords.length; ++i){
            let lex_len = keywords[i].length;
            if( str.substr(startpos, lex_len) === keywords[i] && lex_len === end_reader - startpos ){
                return {
                    type: "kw",
                    start: startpos,
                    end: startpos + keywords[i].length - 1,
                    value: keywords[i]
                }
            }
        }
        return {
            type: "name",
            start: startpos,
            end: end_reader - 1,
            value: str.substr(startpos, end_reader - startpos)
        }
    }
    let is_range = null;
    while( str.charAt(end_reader) >= '0' && str.charAt(end_reader) <= '9' || str.charAt(end_reader) === '.' ){
        if(str.charAt(end_reader + 1) === '.' && str.charAt(end_reader) === '.'){
            is_range = true;
        }
        end_reader++;
    }
    if(end_reader !== startpos){
        return {
            type: !is_range ? "number" : "range",
            start: startpos,
            end: end_reader- 1,
            value: str.substr(startpos, end_reader - startpos)
        }
    }
    return {
        type: "none",
        start: startpos,
        end: startpos
    }

}

function lexical_analyze(text){
    let lexarray = [];
    for(let i = 0; i < text.length; ++i){
        let next_lex = get_lexem(text, i);
        i = next_lex.end;
        lexarray.push(next_lex);
    }
    return lexarray;
}

function lex_to_text(lexem){
    switch(lexem.type){
        case "ws":
            return " ".repeat(lexem.end - lexem.start + 1);
        case "string":
            return `<span class="literal">"${lexem.value}"</span>`;
        case "number":
            return `<span class="literal">${lexem.value}</span>`;
        case "name":
            return `<span class="name">${lexem.value}</span>`;
        case "linebreak":
            return "<br>";
        case "unterminated":
            return `<span class="literal">"${lexem.value}</span>`;
        case "range":
            return `<span class="range">${lexem.value}</span>`;
        case "kw":
            return `<span class="kw">${lexem.value}</span>`;
        case "comment":
            return  `<span class="comment">${lexem.value}</span>`;
    }
    return ""
}

function count_indentation(text, pos){
    let lines = text.split("\n");
    let symcounter = 0;
    let lineno = 0;
    for(; lineno < lines.length && symcounter < pos; lineno++){
        symcounter += lines[lineno].length + 1;
    }
    let currline = lines[lineno - 1];
    let i = 0;
    while( currline.charAt(i) === ' ' ){
        i++;
    }
    return " ".repeat(i);
}

editor.oninput = (e)=>{

    if(e.data === "{" || e.data === '(' || e.data === '['){
        let ins_string = "";
        let str_offset = 0;
        let former_selection = editor.selectionStart;
        switch (e.data) {
            case "{":
                let indent = count_indentation(editor.value, editor.selectionStart);
                ins_string =  `\n${indent}    \n${indent}}`;
                str_offset = 5 + indent.length;
                break;
            case "(":
                ins_string = "  )";
                str_offset = 1;
                break;
            case "[":
                ins_string = "  ]";
                str_offset = 1;
                break;
        }
        editor.value = editor.value.substr(0, editor.selectionStart) + ins_string + editor.value.substr(editor.selectionStart);
        editor.selectionEnd = editor.selectionStart = former_selection + str_offset;
    }
    if(e.inputType === "insertLineBreak"){
        let indent = count_indentation(editor.value, editor.selectionStart);
        let ins_string =  `${indent}`;
        let str_offset =  indent.length;
        let former_selection = editor.selectionStart;
        editor.value = editor.value.substr(0, editor.selectionStart) + ins_string + editor.value.substr(editor.selectionStart);
        editor.selectionEnd = editor.selectionStart = former_selection + str_offset;
    }



    let lexems = lexical_analyze(editor.value);
    codeRepr.innerHTML = lexems.reduce((acc, lex) => {
        return acc + lex_to_text(lex);
    }, "");
    editor.style.height = editor.scrollHeight + "px";

};
