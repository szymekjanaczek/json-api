import qs from 'qs'
import { Query } from '@/Query'
import type { ISort } from '@/Query'

export default class Parser {
    uri = ''
    query: Query

    constructor(query: Query) {
        this.query = query
    }

    // parse the final query string
    parse(): string {
        this.includes()
        this.appends()
        this.fields()
        this.filters()
        this.sorts()
        this.page()
        this.limit()
        this.params()

        return this.uri
    }

    prepend (): '?' | '&' {
        return this.uri === '' ? '?' : '&'
    }

    addToUri (field: string, value: string): void {
        this.uri += this.prepend()
        this.uri += `${field}=${value}`
    }

    /**
     * Parsers
     */
    includes (): void {
        if (!this.query.include?.length) {
            return
        }

        this.addToUri(this.query.queryParameters.includes, this.query.include.join(','))
    }

    appends (): void {
        if (!this.query.append?.length) {
            return
        }

        this.addToUri(this.query.queryParameters.appends, this.query.append.join(','))
    }

    fields (): void {
        if (!this.query.fields?.length) {
            return
        }

        const fields = {
            [`${this.query.queryParameters.fields}[${this.query.model}]`]: this.query.fields.join(',')
        }

        this.uri += this.prepend()
        this.uri += qs.stringify(fields, {encode: false})
    }

    filters (): void {
        if (!Object.keys(this.query.filters).length) {
            return
        }

        const filters = {
            [this.query.queryParameters.filters]: this.query.filters
        }
        this.uri += this.prepend()
        this.uri += qs.stringify(filters, {encode: false})
    }

    sorts (): void {
        if (!this.query.sorts?.length) {
            return
        }

        const sortParams: string[] = []
        this.query.sorts.forEach((sort: ISort) => {
            const prefix = sort.direction === 'desc' ? '-' : ''

            sortParams.push(`${prefix}${sort.field}`)
        })

        this.addToUri(this.query.queryParameters.sort, sortParams.join(','))
    }

    page (): void {
        if (this.query.pageValue === undefined) {
            return
        }

        this.addToUri(this.query.queryParameters.page, this.query.pageValue.toString())
    }

    limit (): void {
        if (this.query.limitValue === undefined) {
            return
        }

        this.addToUri(this.query.queryParameters.limit, this.query.limitValue.toString())
    }

    params (): void {
        if (!this.query.paramsObj) {
            return
        }

        this.uri += this.prepend()
        this.uri += qs.stringify(this.query.paramsObj, {encode: false})
    }
}
