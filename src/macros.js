import {Collection} from './collection'

if (! Collection.hasMacro('log')) {

    Collection.macro('log', (collection, message) => {
        console.log(message, collection);

        return collection;
    })
    
}

if (! Collection.hasMacro('collect')) {

    /*
     * Get a new collection from the collection by key.
     *
     * @param  mixed  $key
     * @param  mixed  $default
     *
     * @return Collection
     */
    Collection.macro('collect', (collection, key, defaultValue = null) => {
        return new Collection(collection.get(key, defaultValue));
    })
}

if (! Collection.hasMacro('ifEmpty')) {

    /*
     * Execute a callable if the collection is empty, then return the collection.
     *
     * @param callable $callback
     *
     * @return Collection
     */
    Collection.macro('ifEmpty', (collection, callback) => {
        if (collection.isEmpty()) {
            callback(collection);
        }

        return collection;
    })
}

if (! Collection.hasMacro('ifAny')) {

    /*
     * Execute a callable if the collection isn't empty, then return the collection.
     *
     * @param callable callback
     * 
     * @return Collection
     */
    Collection.macro('ifAny', (collection, callback) => {
        if (!collection.isEmpty()) {
            callback(collection);
        }

        return collection;
    })
}
