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
            {service_name: this.answers.service_name}
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
                package_name: this.answers.package_name,
                testing_framework: this.answers.testing_framework,
                monitoring_enabled: this.answers.monitoring_enabled
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
                package_name: this.answers.package_name,
                testing_framework: this.answers.testing_framework,
                monitoring_enabled: this.answers.monitoring_enabled
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
        if (this.answers.build_tool === "maven") {
            this._writeMavenFiles();
        } else {
            this._writeGradleFiles();
        }
    }

    _writeTestFiles() {
        if (this.answers.testing_framework === "junit") {
            this._writeJunitTestFiles();
        } else {
            this._writeSpockTestFiles();
            this._writeJunitTestFiles();
        }
    }

    _writeSpockTestFiles() {
        this.fs.copyTpl(
            this.templatePath('src/test/groovy/package/ApplicationTest.groovy.ejs'),
            this.destinationPath('src/test/groovy/' + this.answers.package_name.replace(".", "/") + '/ApplicationTest.groovy'),
            {
                package_name: this.answers.package_name
            }
        );
    }

    _writeJunitTestFiles() {
        this.fs.copyTpl(
            this.templatePath('src/test/java/package/ApplicationTest.java.ejs'),
            this.destinationPath('src/test/java/' + this.answers.package_name.replace(".", "/") + '/ApplicationTest.java'),
            {
                package_name: this.answers.package_name
            }
        );
    }

    _writeCodeFiles() {
        this.fs.copyTpl(
            this.templatePath('src/main/java/package/Application.java.ejs'),
            this.destinationPath('src/main/java/' + this.answers.package_name.replace(".", "/") + '/Application.java'),
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
                service_name: this.answers.service_name,
                monitoring_enabled: this.answers.monitoring_enabled
            }
        );
        this.fs.copyTpl(
            this.templatePath('src/main/resources/application-prd.yml.ejs'),
            this.destinationPath('src/main/resources/application-prd.yml'),
            {
                service_name: this.answers.service_name,
                monitoring_enabled: this.answers.monitoring_enabled
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

    _writeK8sFiles() {
        if (this.answers.k8s_enabled === "yes") {
            this.fs.copyTpl(
                this.templatePath('k8s/deployments/canary.yaml.ejs'),
                this.destinationPath('k8s/deployments/canary.yaml'),
                {
                    service_name: this.answers.service_name
                }
            );
            this.fs.copyTpl(
                this.templatePath('k8s/deployments/production.yaml.ejs'),
                this.destinationPath('k8s/deployments/production.yaml'),
                {
                    service_name: this.answers.service_name
                }
            );
            this.fs.copyTpl(
                this.templatePath('k8s/services/canary.yaml.ejs'),
                this.destinationPath('k8s/services/canary.yaml'),
                {
                    service_name: this.answers.service_name
                }
            );
            this.fs.copyTpl(
                this.templatePath('k8s/services/production.yaml.ejs'),
                this.destinationPath('k8s/services/production.yaml'),
                {
                    service_name: this.answers.service_name
                }
            );
        }
    }

    _writeGCBFiles() {
        if (this.answers.cbuild_enabled === "yes") {
            this.fs.copyTpl(
                this.templatePath('cloudbuild.yaml.ejs'),
                this.destinationPath('cloudbuild.yaml'),
                {
                    k8s_enabled: this.answers.k8s_enabled,
                    build_tool: this.answers.build_tool
                }
            );
        }
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
            },
            {
                type: 'list',
                name: 'monitoring_enabled',
                message: 'Would like to enable management & monitoring?',
                choices: [
                    {
                        value: 'yes',
                        name: 'Yes'
                    },
                    {
                        value: 'no',
                        name: 'No'
                    },
                ],
                default: 'yes'
            },
            {
                type: 'list',
                name: 'k8s_enabled',
                message: 'Would like to generate Kubernetes files?',
                choices: [
                    {
                        value: 'yes',
                        name: 'Yes'
                    },
                    {
                        value: 'no',
                        name: 'No'
                    },
                ],
                default: 'yes'
            },
            {
                type: 'list',
                name: 'cbuild_enabled',
                message: 'Would like to generate Google Cloud Build file?',
                choices: [
                    {
                        value: 'yes',
                        name: 'Yes'
                    },
                    {
                        value: 'no',
                        name: 'No'
                    },
                ],
                default: 'yes'
            }
        ]);
    }

    writing() {
        this._writeCommonFiles();
        this._writeBuildFiles();
        this._writeCodeFiles();
        this._writeResourcesFiles();
        this._writeTestFiles();
        this._writeK8sFiles();
        this._writeGCBFiles();
    }

    configuring() {
        this.config.set("service_name", this.answers.service_name);
        this.config.set("package_name", this.answers.package_name);
        this.config.set("build_tool", this.answers.build_tool);
        this.config.set("testing_framework", this.answers.testing_framework);
        this.config.set("monitoring_enabled", this.answers.monitoring_enabled);
        this.config.set("k8s_enabled", this.answers.k8s_enabled);
        this.config.set("cbuild_enabled", this.answers.cbuild_enabled);
    }
};
