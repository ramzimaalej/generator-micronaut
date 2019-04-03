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
            {
                service_name: this.answers.service_name,
                package_name: this.answers.package_name,
                testing_framework: this.answers.testing_framework
            }
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
            {
                service_name: this.answers.service_name,
                package_name: this.answers.package_name
            }
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
            {
                service_name: this.answers.service_name,
                package_name: this.answers.package_name
            }
        );
        this.fs.copyTpl(
            this.templatePath('settings.gradle.ejs'),
            this.destinationPath('settings.gradle'),
            {
                service_name: this.answers.service_name,
                package_name: this.answers.package_name
            }
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

    _writeBuildFiles() {
        if(this.answers.build_tool === "maven") {
            this._writeMavenFiles();
        } else {
            this._writeGradleFiles();
        }
    }

    _writeTestFiles() {
        if(this.answers.testing_framework === "junit") {
            this._writeJunitTestFiles();
        } else {
            this._writeSpockTestFiles();
            this._writeJunitTestFiles();
        }
    }

    _writeSpockTestFiles() {
        this.fs.copyTpl(
            this.templatePath('src/test/groovy/package/ApplicationTest.groovy.ejs'),
            this.destinationPath('src/test/groovy/'+this.answers.package_name.replace(".", "/")+'/ApplicationTest.groovy'),
            {
                package_name: this.answers.package_name
            }
        );
    }

    _writeJunitTestFiles() {
        this.fs.copyTpl(
            this.templatePath('src/test/java/package/ApplicationTest.java.ejs'),
            this.destinationPath('src/test/java/'+this.answers.package_name.replace(".", "/")+'/ApplicationTest.java'),
            {
                package_name: this.answers.package_name
            }
        );
    }

    _writeCodeFiles() {
        this.fs.copyTpl(
            this.templatePath('src/main/java/package/Application.java.ejs'),
            this.destinationPath('src/main/java/'+this.answers.package_name.replace(".", "/")+'/Application.java'),
            {
                package_name: this.answers.package_name
            }
        );
    }

    _writeResourcesFiles() {
        this.fs.copyTpl(
            this.templatePath('src/main/resources/application.yml.ejs'),
            this.destinationPath('src/main/resources/application.yml'),
            {
                service_name: this.answers.service_name
            }
        );
        this.fs.copyTpl(
            this.templatePath('src/main/resources/logback.xml.ejs'),
            this.destinationPath('src/main/resources/logback.xml'),
            {
                service_name: this.answers.service_name
            }
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
            },
            {
                type: 'list',
                name: 'testing_framework',
                message: 'Which testing framework do you want to use?',
                choices: [
                    {
                        value: 'junit',
                        name: 'Junit'
                    },
                    {
                        value: 'spock',
                        name: 'Spock'
                    },
                ],
                default: 'junit'
            }
        ]);
    }

    writing() {
        this._writeCommonFiles();
        this._writeBuildFiles();
        this._writeCodeFiles();
        this._writeResourcesFiles();
        this._writeTestFiles();
    }
};
