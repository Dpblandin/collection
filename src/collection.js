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

    except(...keys) {
        if (!Array.isArray(this.all())) {
            keys = new Collection(keys);
            let obj = {};

            for (let [key, value] of Object.entries(this.all())) {

                if (!keys.contains(key)) {
                    obj[key] = value;
                }
            }

            return new Collection(obj);
        }

        return null;
    }

    every(callback) {
        return this.all().every(callback)
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

    flatten(depth = Infinity) {
        return this.reduce((result, item) => {
            item = item instanceof Collection ? item.all() : item;

        }, [])
    }
    
    get(key) {
        return this.all()[key] || null;
    }

    getArraybleItems(items) {
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
        return this.all().hasOwnProperty(key);
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

    last(callback = null) {
        if (typeof callback === 'function') {
            return this.reverse().first(callback);
        }

        return this.items[this.count() - 1];
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
        let obj = {};
        for (let [objKey, value] of Object.entries(this.all())){
            if (objKey !== key) {
                obj[objKey] = value;
            }
        }

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

    unshift(...items) {
        return this.all().unshift(...items);
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
}

export const collect = (items) => {
    return new Collection(items);
};
