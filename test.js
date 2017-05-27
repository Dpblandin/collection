import test from 'ava';
import {Collection, collect} from './src/collection';

test('it should be constructed with an array of items', t => {
    const c = new Collection([1,2,3,4]).all();

    t.truthy(c, Array.isArray);
});

test('it can be constructed with no items', t => {
    const c = new Collection().all();

    t.truthy(c, Array.isArray);
});

test('collect function creates a new Collection instance', t => {
    const c = collect();

    t.deepEqual(c, new Collection());
});

test('collect function with items creates a new Collection instance with items', t => {
    const c = collect([1, 2]);

    t.deepEqual(c, new Collection([1, 2]));
});

test('add', t => {
    const c = collect([1, 2]).push(3);

    t.deepEqual(c, new Collection([1, 2, 3]));
});

test('average', t => {
    const c = collect([1, 1, 2, 4]).average();

    t.is(c, 2);
});

test('average with key param', t => {
    const c = collect([{foo: 10}, {foo: 10}, {foo: 20}, {foo: 40}]).average('foo');

    t.is(c, 20);
});

test('avg', t => {
    const c = collect([1, 1, 2, 4]).avg();

    t.is(c, 2);
});

test('avg with key param', t => {
    const c = collect([{foo: 10}, {foo: 10}, {foo: 20}, {foo: 40}]).avg('foo');

    t.is(c, 20);
});

test('chunk', t => {
    const c = collect([1, 2, 3, 4, 5, 6, 7]).chunk(4);

    t.deepEqual(c, new Collection([[1, 2, 3, 4], [5, 6, 7]]));
});

test('combine', t => {
    const c = collect(['name', 'age']).combine(['George', 29]);

    t.deepEqual(c, new Collection({ name: 'George', age: 29 }));
});

test('collapse', t => {
    const c = collect([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).collapse();

    t.deepEqual(c, new Collection([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]));
});

test('contains', t => {
    const contains = collect([1, 2, 3]).contains(2);
    const notcontains = collect([1, 2, 3]).contains(10);

    t.true(contains);
    t.false(notcontains);
});

test('contains with callback', t => {
    const contains = collect([1, 2, 3]).contains((item, key) => item > 2);
    const notcontains = collect([1, 2, 3]).contains((item, key) => item > 3);

    t.true(contains);
    t.false(notcontains);
});

test('count', t => {
    const c = collect([1, 2, 3]).count();

    t.is(c, 3);
});

test('count objet', t => {
    const c = collect({name: 'john', age: 50}).count();

    t.is(c, 2);
});

test('diff', t => {
    const c = collect([1, 2, 3, 4, 5]).diff([2, 4, 6, 8]);

    t.deepEqual(c, new Collection([ 1, 3, 5 ]));
});

test('diffKeys', t => {
    const c = collect([
        { one : 10 },
        { two : 20 },
        { three : 30 },
        { four : 40 },
        { five : 50 },
    ]).diffKeys([
        { two: 2 },
        { four: 4 },
        { six: 6 },
        { eight: 8 },
    ]);

    t.deepEqual(c, new Collection([
        { one: 10 },
        { three: 30 },
        { five: 50},
    ]));
});

test('every', t => {
    const c = collect([1, 2, 3, 4]).every(value => value > 2);

    t.false(c)
});

test('except', t => {
    const c = collect({product_id: 1, name: 'Desk', price: 100, discount: false}).except('product_id', 'name');

    t.deepEqual(c, new Collection({price: 100, discount: false}));
});

test('filter', t => {
    const c = collect([1, 2, 3, 4]).filter(item => item > 2);

    t.deepEqual(c, new Collection([3, 4]));
});

test('first without param', t => {
    const c = collect(["foo", 2, 3]).first();

    t.is(c, "foo");
});

test('first with callback', t => {
    const c = collect([1, 2, 3]).first(item => item > 1);

    t.is(c, 2);
});

test('first with callback on objects', t => {
    const c = collect([{foo: 1, bar: 'baz'}, {foo: 2, bar: 'buzz'}]).first(({foo}) => foo > 1);

    t.deepEqual(c, {foo:2, bar: 'buzz'});
});

test('flatten', t => {
    const c = collect([
        { name: 'taylor', languages: ['php', 'javascript'] }
    ]).flatten();

    t.fail();
});

test('flip array of objects', t => {
    const c = collect([{name: 'taylor', framework: 'laravel'}]).flip();

    t.deepEqual(c, new Collection([{taylor: 'name', laravel: 'framework'}]));
});

test('flip object', t => {
    const c = collect({name: 'taylor', framework: 'laravel'}).flip();

    t.deepEqual(c, new Collection({taylor: 'name', laravel: 'framework'}));
})

test('forget', t => {
    const c = collect({name: 'taylor', framework: 'laravel'}).forget('name');

    t.deepEqual(c, new Collection({framework: 'laravel'}));
})

test('get', t => {
    const desk = collect({account_id: 1, product: 'Desk'}).get('product');

    t.is(desk, 'Desk');
});

test('get null', t => {
    const nullVal = collect({account_id: 1, product: 'Desk'}).get('doesNotExist');

    t.is(nullVal, null);
});

test('getArrayableItems', t => {
    const items = collect().getArraybleItems([1, 2, 3]);
    const c = collect([1, 2, 3]);
    const collectionItems = collect().getArraybleItems(c);
    const objectItems = collect().getArraybleItems({
        toArray: () => [1, 2, 3]
    });

    t.deepEqual(items, [1, 2, 3]);
    t.deepEqual(collectionItems, [1, 2, 3]);
    t.deepEqual(objectItems, [1, 2, 3]);
});

test('has', t => {
    const hasProduct = collect({account_id: 1, product: 'Desk'}).has('product');

    t.true(hasProduct);
});

test('implode', t => {
   const imploded = collect([1, 2, 3, 4, 5]).implode('-');

    t.is(imploded, '1-2-3-4-5');
});

test('implode on array of objects', t => {
    const imploded = collect([{account_id: 1, product: 'Desk'}, {account_id: 1, product: 'Chair'}]).implode('product', ', ');

    t.is(imploded, 'Desk, Chair');
});

test('isEmpty', t => {
    const empty = collect([]).isEmpty();

    t.true(empty);
});

test('isNotEmpty', t => {
    const empty = collect([]).isNotEmpty();

    t.false(empty);
});

test('last without param', t => {
    const c = collect([1, 2, 3]).last();

    t.is(c, 3);
});

test('last with callback', t => {
    const c = collect([1, 2, 3]).last(item => item + 1 === 2);

    t.is(c, 1);
});

test('map', t => {
    const c = collect([1, 2, 3]).map(item => {
        return {value: item}
    });

    t.deepEqual(c, new Collection([{value: 1}, {value: 2}, {value: 3}]));
});

test('max', t => {
    const c = collect([1, 2, 3]).max();

    t.is(c, 3);
});

test('max with key', t => {
    const c = collect([{foo: 10}, {foo: 20}]).max('foo');

    t.is(c, 20);
});

test('min', t => {
    const c = collect([1, 2, 3]).min();

    t.is(c, 1);
});

test('min with key', t => {
    const c = collect([{foo: 10}, {foo: 20}]).min('foo');

    t.is(c, 10);
});

test('nth', t => {
    const c = collect(['a', 'b', 'c', 'd', 'e', 'f']).nth(4);

    t.deepEqual(c, new Collection(['a', 'e']));
});

test('nth array objects', t => {
    const c = collect([{ name: 'taylor' }, { name: 'jeffrey' }, { name: 'douglas' }]).nth(2);

    t.deepEqual(c, new Collection([{name: 'taylor'}, {name: 'douglas'}]));
});

test('only', t => {
    const c = collect({product_id: 1, name: 'Desk', price: 100, discount: false}).only('product_id', 'name');

    t.deepEqual(c, new Collection({product_id: 1, name: 'Desk'}));
});

test('pipe', t => {
    const sum = collect([1, 2, 3]).pipe(collection => collection.sum());

    t.is(sum, 6);
});

test('pluck with property', t => {
    const c = collect([{foo: 1, bar: 2}, {foo: 2, bar: 3}]).pluck('foo');

    t.deepEqual(c, new Collection([1, 2]));
});

test('pluck with property and keyed', t => {
    const c = collect([{product_id: 'prod-100', name: 'Desk'}, {product_id: 'prod-200', name: 'Chair'}])
      .pluck('name', 'product_id');

    t.deepEqual(c, new Collection([{"prod-100": 'Desk'}, {"prod-200": 'Chair'}]));
});

test('pop', t => {
    const c = collect([1, 2, 3]);
    const poped = c.pop();

    t.is(poped, 3);
    t.deepEqual(c, new Collection([1, 2]));
});

test('prepend with value', t => {
    const c = collect([1, 2, 3]).prepend(0);

    t.deepEqual(c, new Collection([0, 1, 2, 3]));
});

test('prepend with value and key', t => {
    const c = collect([{one: 1}, {two: 2}]).prepend({zero: 0});

    t.deepEqual(c, new Collection([{zero: 0}, {one: 1}, {two: 2}]));
});

test('pull', t => {
    const c = collect({product_id: 'prod-100', name: 'Desk'});
    const pulled = c.pull('name');

    t.is(pulled, 'Desk');
    t.deepEqual(c, new Collection({product_id: 'prod-100'}));
});

test('put', t => {
    const c = collect({product_id: 'prod-100', name: 'Desk'}).put('price', 100);

    t.deepEqual(c, new Collection({product_id: 'prod-100', name: 'Desk', price: 100}));
});

test('reduce', t => {
    const c = collect([1, 2, 3]).reduce((carry, item) => carry + item);

    t.is(c, 6);
});

test('reduce with initial value', t => {
    const c = collect([1, 2, 3]).reduce((carry, item) => carry + item, 4);

    t.is(c, 10);
});


test('reject', t => {
    const c = collect([1, 2, 3]).reject((item) => item > 2);

    t.deepEqual(c, new Collection([1, 2]));
});

test('reverse', t => {
    const c = collect([1, 2, 3]).reverse();

    t.deepEqual(c, new Collection([3, 2, 1]));
});


test('shift', t => {
    const c = collect([1, 2, 3]);
    const shifted = c.shift();

    t.is(shifted, 1);
    t.deepEqual(c, new Collection([2, 3]));
});

test('sum with no param', t => {
    const c = collect([1, 2, 3]).sum();

    t.is(c, 6);
});

test('sum with key as param', t => {
    const c = collect([
        {name: 'JavaScript: The Good Parts', pages: 176},
        {name: 'JavaScript: The Definitive Guide', pages: 1096},
    ]).sum('pages');

    t.is(c, 1272);
});

test('sum with callback', t => {
    const c = collect([1, 2, 3]).sum((item) => item * 2);

    t.is(c, 12);
});

test('tap', t => {
   const c = collect([1, 2, 3]).tap(collection => collection);

    t.deepEqual(c, new Collection([1, 2, 3]));
});

test('unshift', t => {
    const c = collect([1, 2, 3])
    const unshifted = c.unshift(4, 5);

    t.is(unshifted, 5);
    t.deepEqual(c, new Collection([4, 5, 1, 2, 3]));
});

test('when', t => {
    const c = collect([1, 2, 3]);
    c.when(true, (collection) => collection.push(4));

    t.deepEqual(c, new Collection([1, 2, 3, 4]));
});

test('where', t => {
    const c = collect([
        { product: 'Desk', price: 200 },
        { product: 'Chair', price: 100 },
        { product: 'Bookcase', price: 150 },
        { product: 'Door', price: 100 },
    ]).where('price', 100);

    t.deepEqual(c, new Collection([
        { product: 'Chair', price: 100 },
        { product: 'Door', price: 100 },
    ]));
});

test('whereStrict', t => {
    const c = collect([
        { product: 'Desk', price: 200 },
        { product: 'Chair', price: '100' },
        { product: 'Bookcase', price: 150 },
        { product: 'Door', price: 100 },
    ]).whereStrict('price', 100);

    t.deepEqual(c, new Collection([
        { product: 'Door', price: 100 },
    ]));
});

test('whereIn', t => {
    const c = collect([
        { product: 'Desk', price: 200 },
        { product: 'Chair', price: 100 },
        { product: 'Bookcase', price: 150 },
        { product: 'Door', price: 100 },
    ]).whereIn('price', [150, 200]);

    t.deepEqual(c, new Collection([
        { product: 'Desk', price: 200 },
        { product: 'Bookcase', price: 150 },
    ]));
});

test('whereInStrict', t => {
    const c = collect([
        { product: 'Desk', price: 200 },
        { product: 'Chair', price: 100 },
        { product: 'Bookcase', price: '150' },
        { product: 'Door', price: 100 },
    ]).whereInStrict('price', [150, 200]);

    t.deepEqual(c, new Collection([
        { product: 'Desk', price: 200 },
    ]));
});
