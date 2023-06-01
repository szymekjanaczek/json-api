import { Query } from '../src'

describe('Query builder', () => {
    test('it can override query names depending on config', () => {
        const query = new Query({
            queryParameters: {
                includes: 'includes',
                fields: 'select'
            }
        })

        query
            .for('pizza')
            .includes('toppings')
            .select('name')

        const expected = '/pizza?includes=toppings&select[pizza]=name'

        expect(query.url()).toEqual(expected)
    })

    test('it can prepend an api url', () => {
        const query = new Query({
            base_url: 'https://api.example.com'
        })

        query.for('pizza').includes('toppings')

        const expected = 'https://api.example.com/pizza?include=toppings'

        expect(query.url()).toEqual(expected)
    })

    test('it throws an error if for() is not included', () => {
        expect.assertions(1)

        try {
            const query = new Query()

            query.includes('toppings').url()
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).toBe('Please call the for() method before adding filters or calling url() / get().')
            }
        }
    })

    test('it builds a simple query with appends()', () => {
        const query = new Query()

        query.for('pizza').appends('full_name', 'rating')

        const expected = '/pizza?append=full_name,rating'

        expect(query.url()).toEqual(expected)
    })

    test('it builds a simple query with includes()', () => {
        const query = new Query()

        query.for('pizza').includes('toppings')

        const expected = '/pizza?include=toppings'

        expect(query.url()).toEqual(expected)
    })

    test('it builds a simple query with where()', () => {
        const query = new Query()

        query.for('pizza').where('topping', 'cheese')

        const expected = '/pizza?filter[topping]=cheese'

        expect(query.url()).toEqual(expected)
    })

    test('it builds a simple query with whereIn()', () => {
        const query = new Query()

        query.for('pizza').whereIn('topping', ['beef', 'cheese'])

        const expected = '/pizza?filter[topping]=beef,cheese'

        expect(query.url()).toEqual(expected)
    })

    test('it builds a simple query with select()', () => {
        const query = new Query()

        query.for('pizza').select('name', 'date_added')

        const expected = '/pizza?fields[pizza]=name,date_added'

        expect(query.url()).toEqual(expected)
    })

    test('it can limit the query', () => {
        const query = new Query()

        query
            .for('pizza')
            .where('name', 'meatlovers')
            .limit(5)

        const expected = '/pizza?filter[name]=meatlovers&limit=5'

        expect(query.url()).toEqual(expected)
    })

    test('it can paginate the query', () => {
        const query = new Query()

        query
            .for('pizza')
            .limit(5)
            .page(2)

        const expected = '/pizza?page=2&limit=5'

        expect(query.url()).toEqual(expected)
    })

    test('it can sort the query', () => {
        const query = new Query()

        query.for('pizza').sort({field: 'name', direction: 'desc'}, {field: 'flavour'})

        const expected = '/pizza?sort=-name,flavour'

        expect(query.url()).toEqual(expected)
    })

    test('it can append params', () => {
        const query = new Query()

        query
            .for('pizza')
            .where('name', 'meatlovers')
            .params({format: 'admin'})

        const expected = '/pizza?filter[name]=meatlovers&format=admin'

        expect(query.url()).toEqual(expected)
    })

    test('the query object can be reused', () => {
        const query = new Query()

        const actualOne = query
            .for('pizza')
            .where('name', 'macaroni_and_cheese')
            .get()

        const expectedOne =
            '/pizza?filter[name]=macaroni_and_cheese'

        const actualTwo = query
            .for('pizza')
            .where('name', 'meatlovers')
            .get()

        const expectedTwo =
            '/pizza?filter[name]=meatlovers'

        expect(actualOne).toEqual(expectedOne)
        expect(actualTwo).toEqual(expectedTwo)
    })

    test('it builds a complex query', () => {
        const query = new Query()

        query
            .for('pizza')
            .where('name', 'macaroni_and_cheese')
            .where('restaurant.rating_min', 4)
            .whereIn('topping', ['cheese', 'beef'])
            .includes('toppings')
            .appends('full_name')
            .select('name', 'ratings')
            .params({format: 'basic'})

        const expected =
            '/pizza?include=toppings&append=full_name&fields[pizza]=name,ratings&filter[name]=macaroni_and_cheese&filter[restaurant.rating_min]=4&filter[topping]=cheese,beef&format=basic'

        expect(query.url()).toEqual(expected)
    })
})
