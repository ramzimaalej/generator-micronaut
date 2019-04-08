'use strict';

var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe('micronaut:app', function () {
    it('generates project common files', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .withPrompts({ build_tool: "maven", testing_framework: "junit" })
            .then(function () {
                assert.file('.gitignore');
                assert.file('Dockerfile');
                assert.file('micronaut-cli.yml');
            });
    });
    it('generates project with maven', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .withPrompts({ build_tool: "maven", testing_framework: "junit" })
            .then(function () {
                assert.file('mvnw');
                assert.file('mvnw.cmd');
                assert.file('pom.xml');
            });
    });
    it('generates project with gradle', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .withPrompts({ build_tool: "gradle", testing_framework: "junit" })
            .then(function () {
                assert.file('build.gradle');
                assert.file('gradlew');
                assert.file('gradlew.bat');
                assert.file('settings.gradle');
            });
    });
    it('generates project code files', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .withPrompts({ package_name: "com.veamly", testing_framework: "junit" })
            .then(function () {
                assert.file('src/main/java/com/veamly/Application.java');
            });
    });
    it('generates project resource files', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .withPrompts({ service_name: "account-service", testing_framework: "junit" })
            .then(function () {
                assert.file('src/main/resources/application.yml');
                assert.file('src/main/resources/application-prd.yml');
                assert.file('src/main/resources/logback.xml');
            });
    });
    it('generates project test code files for junit', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .withPrompts({ package_name: "com.veamly", testing_framework: "junit" })
            .then(function () {
                assert.file('src/test/java/com/veamly/ApplicationTest.java');
            });
    });
    it('generates project test code files for groovy', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .withPrompts({ package_name: "com.veamly", testing_framework: "spock" })
            .then(function () {
                assert.file('src/test/groovy/com/veamly/ApplicationTest.groovy');
            });
    });
});