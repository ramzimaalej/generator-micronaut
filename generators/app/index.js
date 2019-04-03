var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    _writeCommonFiles() {
        this.fs.copy(
            this.templatePath('.gitignore.ejs'),
            this.destinationPath('.gitignore'),
        );
        this.fs.copy(
            this.templatePath('Dockerfile.ejs'),
            this.destinationPath('Dockerfile'),
            { service_name: this.answers.service_name }
        );
        this.fs.copyTpl(
            this.templatePath('micronaut-cli.yml.ejs'),
            this.destinationPath('micronaut-cli.yml'),
            { service_name: this.answers.service_name, package_name: this.answers.package_name }
        );
    }

    _writeMavenFiles() {
        this.fs.copy(
            this.templatePath('mvnw'),
            this.destinationPath('mvnw'),
        );
        this.fs.copy(
            this.templatePath('mvnw.cmd'),
            this.destinationPath('mvnw.cmd'),
        );
        this.fs.copyTpl(
            this.templatePath('pom.xml.ejs'),
            this.destinationPath('pom.xml'),
            { service_name: this.answers.service_name, package_name: this.answers.package_name }
        );
        this.fs.copy(
            this.templatePath('.mvn'),
            this.destinationPath('.mvn')
        );
    }

    _writeGradleFiles() {
        this.fs.copyTpl(
            this.templatePath('build.gradle.ejs'),
            this.destinationPath('build.gradle'),
            { service_name: this.answers.service_name, package_name: this.answers.package_name }
        );
        this.fs.copyTpl(
            this.templatePath('settings.gradle.ejs'),
            this.destinationPath('settings.gradle'),
            { service_name: this.answers.service_name, package_name: this.answers.package_name }
        );
        this.fs.copy(
            this.templatePath('gradlew'),
            this.destinationPath('gradlew'),
        );
        this.fs.copy(
            this.templatePath('gradlew.bat'),
            this.destinationPath('gradlew.bat'),
        );
        this.fs.copy(
            this.templatePath('gradle'),
            this.destinationPath('gradle')
        );
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: "input",
                name: "service_name",
                message: "What's your service name",
            },
            {
                type: "input",
                name: "package_name",
                message: "What's your package name",
                default: "com.veamly"
            },
            {
                type: 'list',
                name: 'build_tool',
                message: 'Which build tool do you want to use?',
                choices: [
                    {
                        value: 'maven',
                        name: 'Maven'
                    },
                    {
                        value: 'gradle',
                        name: 'Gradle'
                    }
                ],
                default: 'maven'
            }
        ]);
    }

    writing() {
        this._writeCommonFiles();
        if(this.answers.build_tool === "maven") {
            this._writeMavenFiles();
        } else {
            this._writeGradleFiles();
        }
    }

};
