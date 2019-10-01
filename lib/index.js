const exec = (folder) => {
    const shell = require('shelljs');
    const fs = require('fs');

    if (!shell.which('cordova')) {
        shell.echo('Cordova not installed.');
        shell.exit(1);
    }

    if (fs.existsSync(folder)) {
        shell.echo('Folder already exists');
        shell.exit(1);
    }


    shell.mkdir(folder);
    shell.cd(folder);
    
    shell.rm('-rf', 'sample-cordova');
    shell.rm('-rf', 'sample-react-app');
    shell.exec('cordova create sample-cordova');
    shell.exec(`npx create-react-app sample-react-app`);

    shell.cd('sample-react-app');


    shell.echo('Done.');
    shell.echo('Adding scripts to package.');

    let pack = fs.readFileSync('./package.json');
    if (!pack) {
        shell.echo('File not found');
        shell.exit(1);
    }

    pack = JSON.parse(pack);

    pack.scripts = {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "build:cordova": "npm run remove:www && react-scripts build && node __script.js && mv ./build ./www",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "remove:www": "rimraf ./www",
        "patch": "npm version patch && node __versioning.js && git add . && git commit -m 'versioning'",
        "simulate:browser": "npm run build:cordova && cordova run browser",
        "simulate:ios": "npm run build:cordova && cordova run ios",
        "build:ios": "npm run build:cordova && cordova build ios",
        "simulate:android": "npm run build:cordova && cordova run android"
    }

    let name = folder.split('/');

    name = name[name.length - 1];

    pack.name = name;

    pack = JSON.stringify(pack, null, '\t');

    fs.writeFileSync('./package.json', pack);
    


    shell.echo('Project created, copying support files');
    shell.cp('../../support/__script.js', './__script.js');
    shell.cp('../../support/__versioning.js', './__versioning.js');

    shell.echo('Done.');
    shell.echo('Copying cordova files to react folder');

    shell.cp('-R', '../sample-cordova/hooks', '.');
    shell.cp('-R', '../sample-cordova/platforms', '.');
    shell.cp('-R', '../sample-cordova/plugins', '.');
    shell.cp('-R', '../sample-cordova/www', '.');
    shell.cp( '../sample-cordova/config.xml', '.');


    
    shell.echo('Done.');
    shell.echo('Moving everything to outside folder.');
    shell.mv('./*', '../');
    shell.echo('Done.');
    shell.echo('Deleting support files.');
    shell.cd('../');
    shell.rm('-rf', 'sample-cordova');
    shell.rm('-rf', 'sample-react-app');
    shell.echo('Finished!. Do not forget to install rimraff');

    

}

exports.exec = exec;