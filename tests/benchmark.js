'use strict';

const Benchmark = require('benchmark');

const fs = require('fs');
const postcss = require('postcss');
const cssDeclarationSorter = require('../src/index.js');
const postcssSorting = require('postcss-sorting');

const cssSoundcloud = fs.readFileSync('./tests/soundcloud.css');

var cssSoundcloudSuite = new Benchmark.Suite;

const testSorter = function (deferred, sorter, css) {
  postcss([sorter()])
    .process(css)
    .then(function () {
      deferred.resolve();
    });
};

cssSoundcloudSuite
  .add(
    'postcss-sorting',
    function (deferred) {
      testSorter(deferred, postcssSorting, cssSoundcloud);
    },
    { 'defer': true }
  )
  .add(
    'css-declaration-sorter',
    function (deferred) {
      testSorter(deferred, cssDeclarationSorter, cssSoundcloud);
    },
    { 'defer': true }
  )
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  });

// run async
cssSoundcloudSuite.run({ 'async': true });
