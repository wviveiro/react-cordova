let FS= require('fs');

let pack = FS.readFileSync('./package.json', 'utf8');
pack = JSON.parse(pack);


let config = FS.readFileSync('./config.xml', 'utf8');
config = config.replace(/ios-CFBundleVersion=".*?"/, `ios-CFBundleVersion="${pack.version}"`);

let androidv = +pack.version.replace(/\./gi, '');

config = config.replace(/android-versionCode=".*?"/, `android-versionCode="${androidv}"`);

FS.writeFile('./config.xml', config, 'utf8', (err)=> {
    if(err) {
        throw err
    };
});