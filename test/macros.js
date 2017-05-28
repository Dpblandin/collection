import test from 'ava';
import {Collection, collect} from './../src/collection';
import macros from './../src/macros';

test('log', t => {
    const c = collect([1, 2, 3])
      .log('initial')
      .map(item => item * 2)
      .log('modified');

    t.deepEqual(c.all(), [2, 4, 6]);
});

test('collect', t => {
    const c = collect({ screen: { id: 1, order: 2, name: 'screen_1'} })
      .collect('screen');

    t.deepEqual(c, new Collection({id: 1, order: 2, name: 'screen_1'}))
});

test('ifEmpty truethy', t => {
    const c = collect()
      .ifEmpty((collection) => collection.push(1));

    t.deepEqual(c.all(), [1]);
});


test('ifEmpty falsey', t => {
    const c = collect([1, 2])
      .ifEmpty(collection => collection.push(3));

    t.deepEqual(c.all(), [1, 2]);
});

test('ifAny truethy', t => {
    let timesTwo = collect();
    const c = collect([1, 2])
      .ifAny(collection => timesTwo = collection.map(item => item * 2));

    t.deepEqual(timesTwo.all(), [2, 4]);
});

test('ifAny falsey', t => {
    let timesTwo = collect();
    const c = collect()
      .ifAny(collection => timesTwo = collection.map(item => item * 2));

    t.true(timesTwo.isEmpty());
});