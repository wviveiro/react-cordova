let FS= require('fs');

// read the index.html from build folder
let data = FS.readFileSync('./build/index.html', 'utf8');

function insertContent(fullContent, beforeWhat, newContent) {
    // get the position before which newContent has to be added
    const position = fullContent.indexOf(beforeWhat);

    // since splice can be used on arrays only
    let fullContentCopy = fullContent.split('');
    fullContentCopy.splice(position, 0, newContent);

    return fullContentCopy.join('');
}

// will add the <meta> tags needed for cordova app
const afterAddingMeta = insertContent(data, "<link", 
`<meta 
    http-equiv="Content-Security-Policy" 
    content="
        default-src *;
        child-src 
            gap://ready;
        style-src 
            'self' 
            'unsafe-inline'; 
        script-src 
            'self' 
            'unsafe-inline' 
            'unsafe-eval';
"/>`+
`<meta name="format-detection" content="telephone=no">`+
`<meta name="msapplication-tap-highlight" content="no">`);

// will add <script> pointing to cordova.js
const afterAddingScript = insertContent(afterAddingMeta, "<script", `<script type="text/javascript" src="cordova.js"></script>`);

// updates the index.html file
FS.writeFile('./build/index.html', afterAddingScript, 'utf8', (err)=> {
    if(err) {
        throw err
    };
});