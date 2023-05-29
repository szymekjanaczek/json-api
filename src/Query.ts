import Parser from '@/Parser'

interface IQueryParameters {
    base_url?: string
    queryParameters?: {
        filters?: string
        fields?: string
        includes?: string
        appends?: string
        page?: string
        limit?: string
        sort?: string
    }
}

interface IObject {
    [key: string | number]: string | number
}

export interface ISort {
    field: string
    direction?: 'asc' | 'desc'
}

export default class Query {
    // set by calling .for(model)
    model?: string
    base_url?: string
    include?: string[]
    append?: string[]
    sorts?: ISort[]
    fields?: string[] = []
    filters: IObject = {}
    pageValue?: number
    limitValue?: number
    paramsObj?: IObject
    parser: Parser
    queryParameters

    constructor(options: IQueryParameters = {}) {
        if (options.base_url) {
            this.base_url = options.base_url
        }

        // default filter names
        this.queryParameters = options.queryParameters || {
            filters: 'filter',
            fields: 'fields',
            includes: 'include',
            appends: 'append',
            page: 'page',
            limit: 'limit',
            sort: 'sort'
        }

        this.parser = new Parser(this)
    }

    // set the model for the query
    for(model: string): Query {
        this.model = model

        return this
    }

    // return the parsed url
    get(): string {
        // generate the url
        const url = this.base_url ? this.base_url + this.parseQuery() : this.parseQuery()
        // reset the url so the query object can be re-used
        this.reset()

        return url
    }

    url(): string {
        return this.get()
    }

    reset(): void {
        // reset the uri
        this.parser.uri = ''
    }

    parseQuery(): string {
        if (this.model === undefined) {
            throw new Error('Please call the for() method before adding filters or calling url() / get().')
        }

        return `/${this.model}${this.parser.parse()}`
    }

    /**
     * Query builder
     */
    includes(...include: string[]): Query {
        this.include = include

        return this
    }

    appends(...append: string[]): Query {
        this.append = append

        return this
    }

    // relations by using dot as separator, e.g. 'posts.comments'
    select (...fields: string[]): Query {

        this.fields = fields

        return this
    }

    where (key: string | number, value: string | number | null): Query {
        if (value !== null) {
            this.filters[key] = value
        }

        return this
    }

    whereIn (key: string | number, array: string[] | number[] | null[]): Query {
        this.filters[key] = array.join(',')

        return this
    }

    sort (...args: ISort[]): Query {
        this.sorts = args

        return this
    }

    page (value: number): Query {
        this.pageValue = value

        return this
    }

    limit (value: number): Query {
        this.limitValue = value

        return this
    }

    params (params: IObject): Query {
        if (params === undefined || params.constructor !== Object) {
            throw new Error('The params() function takes a single argument of an object.')
        }

        this.paramsObj = params

        return this
    }

}
