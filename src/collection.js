export class Collection {
    constructor(items = []) {
        this.items = items;
    }

    all() {
        return this.items;
    }

    avg(callback = null) {
        const count = this.count();
        if (count) {
            return this.sum(callback) / count;
        }
    }
    
    average(callback = null) {
        return this.avg(callback);
    }

    chunk(size) {
        if (size <= 0) {
            return new Collection();
        }
        
        return new Collection(this.all().reduce((a,b,i,g) => !(i % size) ? a.concat([g.slice(i,i+size)]) : a, []));
    }

    collapse() {
        let results = [];

        this.all().forEach(values => {
            if (values instanceof Collection) {
                values = values.all();
            } else if (!Array.isArray(values)) {
                return;
            }
            
            results = [...results, ...values];
        });
        
        return new Collection(results);
    }


    combine(values) {
        let newArray = {};
        this.all().forEach((item, key) => {
            newArray[item] = values[key];
        });
        
        return new Collection(newArray);
    }

    contains(callback = null, strict = false) {
        if (typeof callback !== 'function' && callback !== null) {
            return this.items.some(item => {
                if (strict) {
                    return item === callback;
                }

                return item == callback;
            });
        }

        if (typeof callback === 'function') {
            return this.items.some((item, key) => callback(item, key));
        }
    }

    count() {
        if (this.isObject()) {
            return Object.keys(this.all()).length;
        }

        return this.all().length;
    }
    
    diff(values) {
        values = new Collection(values);

        return this.reject(item => {
            return values.contains(item);
        })
    }

    diffKeys(values) {
        values = new Collection(values);

        return this.reject(item => {
            const [itemKey, ] = Object.keys(item);

            return values.contains((value) => {
                const [key,] = Object.keys(value);

                return itemKey === key;
            })
        })
    }

    each(callback) {
        return this.all().forEach(callback);
    }

    every(callback) {
        return this.all().every(callback)
    }


    except(...keys) {
        if (!Array.isArray(this.all())) {
            keys = new Collection(keys);

            return new Collection(Object.entries(this.all())
              .filter(([key, value]) => !keys.contains(key))
              .reduce((result, [key, value]) => Object.assign({}, result, { [key]: value }), {}));
        }

        return null;
    }
    
    filter(callback) {
        return new Collection(this.all().filter(callback));
    }

    first(callback = null) {

        if (this.items.length === 0) {
            return null
        }

        if (typeof callback === 'function') {
            const possibleItems = this.all().filter((item, key) => callback(item, key));

            if (possibleItems.length > 0) {
                return possibleItems[0];
            }
        }

        return this.items[0];
    }

    flatten(depth = false) {
        const flattened = new Collection([].concat(...this.all()));

        if (! depth || ! flattened.contains(Array.isArray)) {
            return flattened;
        }

        return flattened.flatten(true);
    }

    flip() {
        if (!Array.isArray(this.all())) {
            const obj = Object.keys(this.all())
              .reduce((obj, key) => Object.assign({}, obj, { [this.all()[key]]: key }), {});

            return new Collection(obj);
        }
        
        return this.map((item) => {
            return Object.keys(item)
              .reduce((obj, key) => Object.assign({}, obj, { [item[key]]: key }), []);
        })
    }

    forget(key) {
        delete this.all()[key];
        
        return this;
    }
    
    get(key) {
        return this.all()[key] || null;
    }

    static getArraybleItems(items) {
        if (Array.isArray(items)) {
            return items;
        }

        if (items instanceof Collection) {
            return items.all();
        }

        if (typeof items.toArray === 'function') {
            return items.toArray();
        }
        
        return [items];
    }

    has(key) {
        if (!Array.isArray(this.all())) {
            return this.all().hasOwnProperty(key);
        }

        return !! ~this.all().indexOf(key);
    }
    
    static hasMacro(name) {
        return Collection.prototype[name] !== undefined;
    }

    implode(value, glue = null) {
        const first = this.first();

        if (typeof first === 'object') {
            return this.pluck(value).all().join(glue);
        }
        
        return this.all().join(value);
    }
    
    isEmpty() {
        return this.count() === 0;
    }
    
    isNotEmpty() {
        return !this.isEmpty();
    }

    isObject() {
        return typeof this.all() === 'object';
    }

    keys() {
        return new Collection(Object.keys(this.all()));
    }

    last(callback = null) {
        if (typeof callback === 'function') {
            return this.reverse().first(callback);
        }

        return this.items[this.count() - 1];
    }

    static macro(name, callback) {
        if (Collection.prototype[name] !== undefined) {
            throw new Error('Collection.macro(): This macro name is already defined.');
        }

        Collection.prototype[name] = function collectionMacroWrapper(...args) {
            const collection = this;

            return callback(collection, ...args);
        };
    }
    
    map(callback) {
        return new Collection(this.all().map(callback));
    }
    
    max(key = null) {
        let start = this.first();

        if (key) {
            start = start[key];
        }

        return this
          .filter(value => {
              if (key) {
                  return value[key] !== null
              }

              return value !== null
          })
          .reduce((result, item) => {
              if (key) {
                  item = item[key];
              }

              return result === null || item > result ? item : result;
          }, start) 
    }
    
    median(key = null) {
        const count = this.count();
        
        if (count === 0) {
            return;
        }
        
        const values = this
          .pipe(() => key ? this.pluck(key) : this)
          .sort()
          .values();
        
        const middle = parseInt(count / 2);

        if (count % 2) {
            return values.get(middle);
        }

        return (new Collection([values.get(middle - 1), values.get(middle)])).average();
    }

    min(key = null) {
        let start = this.first();

        if (key) {
            start = start[key];
        }

        return this
          .filter(value => {
              if (key) {
                  return value[key] !== null
              }

              return value !== null
          })
          .reduce((result, item) => {
              if (key) {
                  item = item[key];
              }

              return result === null || item < result ? item : result;
          }, start)
    }
    
    nth(step, offset = 0) {
        let newArr = [];
        let position = 0;
        
        this.all().forEach(item => {
            if (position %  step === offset) {
                newArr.push(item);
            }
            
            position += 1;
        });
        
        return new Collection(newArr);
    }
    
    only(...keys) {
        if (!Array.isArray(this.all())) {
            let obj = {};

            for (let [key, value] of Object.entries(this.all())) {

                [...keys]
                  .filter(objKey => objKey === key)
                  .forEach((objKey) => obj[objKey] = value);
            }

            return new Collection(obj);
        }

        return null;
    }
    
    pipe(callback) {
        return callback(this);
    }

    pluck(property, keyed = null) {
        if (keyed) {
            return this.map((item) => {
                const obj = {};
                obj[item[keyed]] = item[property];
                
                return obj;
            })
        }
        
        return this.map(item => item[property])
    }

    pop() {
        return this.all().pop();
    }

    prepend(value, key = null) {
        if (key) {
            return key.concat(this.all());
        }

        this.unshift(value);

        return this;
    }
    
    pull(key) {
        const pulled = this.get(key);
        const obj = Object.entries(this.all())
          .filter(([objKey, value]) => objKey !== key)
          .reduce((result, [objKey, value]) => Object.assign({}, result, { [objKey]: value }), {});

        if(Object.keys(obj).length > 0) {
            this.items = obj;
            return pulled;
        }

        return null;
    }

    put(key, value) {
        if (this.isObject()) {
            this.all()[key] = value;
            return new Collection(this.all());
        }

        return false;
    }

    push(item) {
        this.items.push(item);

        return this;
    }

    reduce(callback, initial = 0) {
        return this.all().reduce(callback, initial);
    }

    reject(callback) {
        return new Collection(this.all().filter((item, key) => !callback(item, key)))
    }

    reverse() {
        return new Collection(this.all().reverse());
    }

    shift() {
        return this.all().shift();
    }

    slice(offset, length = null) {
        if (length) {
            return new Collection(this.all().slice(offset, length + offset));
        }

        return new Collection(this.all().slice(offset));
    }

    sort(callback = null) {
        if (callback) {
            return new Collection(this.all().sort(callback))
        }

        return new Collection(this.all().sort());
    }
    
    sortDesc() {
        const sorted = this.sort();
        
        return new Collection(sorted.all().reverse());
    }

    splice(offset, length = null, replacement = []) {
        if([...arguments].length === 1) {
            return new Collection(this.all().splice(offset));
        }

        if (replacement.length === 0) {
            return new Collection(this.all().splice(offset, length))
        }

        return new Collection(this.all().splice(offset, length, ...replacement))
    }
    
    split(numberOfGroups) {
        if (this.isEmpty()) {
            return new Collection();
        }
        
        const groupSize = Math.ceil(this.count() / numberOfGroups);
        
        return this.chunk(groupSize)
    }

    sum(callback = null) {
        if (typeof callback === 'function') {
            return this.all().reduce((a, b) => a + callback(b), 0)
        }

        if (typeof callback === 'string') {
            return this.all().reduce((a, b) => {
                if (a.hasOwnProperty(callback) && b.hasOwnProperty(callback)) {
                    return a[callback] + b[callback]
                }

                return a + b[callback];
            })
        }

        return this.all().reduce((a, b) => a + b, 0);
    }
    
    tap(callback) {
        callback(new Collection(this.all()));
        
        return this;
    }

    take(amount) {
        if (!amount) {
            return new Collection();
        }

        if (amount < 0) {
            return new Collection(this.all().reverse()).take(-amount);
        }

        return new Collection(this.all().slice(0, amount));
    }

    static times(amount, callback) {
        if (amount < 1) {
            return new Collection();
        }

        const [, ...times] = [...Array(amount + 1).keys()];

        return (new Collection(times).map(callback));
    }

    unique(key = null) {
        if (typeof key === 'string') {
            return this.unique(item => item[key]);
        }

        if (key) {
            const mappedCollection = new Collection();

            return this.reduce((collection, item) => {

                const mappedItem = key(item);
                if (! mappedCollection.has(mappedItem)) {
                    collection.push(item);
                    mappedCollection.push(mappedItem);
                }

                return collection;
            }, new Collection);
        }

        return this.reduce((collection, item) => {
            if (! collection.has(item)) {
                collection.push(item);
            }

            return collection;
        }, new Collection);
    }

    unshift(...items) {
        return this.all().unshift(...items);
    }

    values() {
        return this.keys().map(key => this.all()[key]);
    }
    
    when(value, callback, defaultValue = null) {
        if (value) {
            return callback(this);
        } else if (defaultValue) {
            return defaultValue(this);
        }
        
        return this;
    }

    where(key, value) {
        return this.filter((item) => item[key] == value);
    }
    
    whereStrict(key, value) {
        return this.filter(item => item[key] === value);
    }
    
    whereIn(key, values) {
        return this.filter(item => {
            return new Collection(values).contains(item[key]);
        })
    }

    whereInStrict(key, values) {
        return this.filter(item => {
            return new Collection(values).contains(item[key], true);
        })
    }

    zip(array) {
        if (array instanceof Collection) {
            return this.map((item, index) => [item, array.get(index)]);
        }

        return this.map((item, index) => [item, array[index]]);
    }
}

export const collect = (items) => {
    return new Collection(items);
};
