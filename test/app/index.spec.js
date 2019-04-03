'use strict';

var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe('micronaut:app', function () {
    it('generates project common files', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .then(function () {
                assert.file('.gitignore');
                assert.file('Dockerfile');
                assert.file('micronaut-cli.yml');
            });
    });
    it('generates project with maven', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .withPrompts({ build_tool: "maven" })
            .then(function () {
                assert.file('mvnw');
                assert.file('mvnw.cmd');
                assert.file('pom.xml');
            });
    });
    it('generates project with gradle', function () {
        return helpers.run(path.join(__dirname, '../../generators/app'))
            .withPrompts({ build_tool: "gradle" })
            .then(function () {
                assert.file('build.gradle');
                assert.file('gradlew');
                assert.file('gradlew.bat');
                assert.file('settings.gradle');
            });
    });
});