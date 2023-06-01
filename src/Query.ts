import Parser from './Parser'

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

interface IParams {
    [key: string | number]: string | number
}

interface ISort {
    field: string
    direction?: 'asc' | 'desc'
}

class Query {
    // set by calling .for(model)
    model?: string
    base_url?: string
    include?: string[]
    append?: string[]
    sorts?: ISort[]
    fields?: string[] = []
    filters: IParams = {}
    pageValue?: number
    limitValue?: number
    paramsObj?: IParams
    parser: Parser
    queryParameters: {
        filters: string
        fields: string
        includes: string
        appends: string
        page: string
        limit: string
        sort: string
    }

    constructor(options: IQueryParameters = {}) {
        if (options.base_url) {
            this.base_url = options.base_url
        }

        // default filter names
        this.queryParameters = {
            filters: options.queryParameters?.filters ?? 'filter',
            fields: options.queryParameters?.fields ?? 'fields',
            includes: options.queryParameters?.includes ?? 'include',
            appends: options.queryParameters?.appends ?? 'append',
            page: options.queryParameters?.page ?? 'page',
            limit: options.queryParameters?.limit ?? 'limit',
            sort: options.queryParameters?.sort ?? 'sort'
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

    params (params: IParams): Query {
        this.paramsObj = params

        return this
    }
}

export { Query }
export type { IParams, IQueryParameters, ISort }
