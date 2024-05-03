import { Driver } from "../Driver"
import { PostgresDriver } from "../postgres/PostgresDriver"
import { CrateDBPostgresConnectionOptions } from "./CrateDBPostgresConnectionOptions";
import { ColumnType } from "../types/ColumnTypes"

abstract class PostgresWrapper extends PostgresDriver {
    options: any
    transactionSupport: any
}


export class CrateDBPostgresDriver extends PostgresWrapper implements Driver {

    /**
     * Database type.
     */
    readonly type: "cratedb-postgres"

    /**
     * Connection options.
     */
    options: CrateDBPostgresConnectionOptions

    /**
     * Represent transaction support by this driver
     */
    // Signal transactions as unsupported.
    transactionSupport = "none" as const

    // Provide a custom UUID generator function.
    get uuidGenerator(): string {
        return "gen_random_text_uuid()"
    }

	normalizeType(column: {
        type: ColumnType
        length?: number | string
        precision?: number | null
        scale?: number
    }): string {
        if (column.type === Number || column.type === "integer") {
            return "int"
        } else if (column.type === String) {
            return "text"
        } else if (column.type === Date) {
            return "timestamp"
        } else if (column.type === Boolean) {
            return "boolean"
        } else if (column.type === "uuid") {
            return "text"
        } else if (column.type === "json") {            
            return "object"
        } else if (column.type === "simple-array") {
            return "array(text)"
        } else if (
            column.type === "double precision" ||
            column.type === "real"
        ) {
            return "double"
        } else if (
            column.type === "dec" ||
            column.type === "numeric" ||
            column.type === "fixed"
        ) {
            return "double"
        } else if (column.type === "bool" || column.type === "boolean") {
            return "boolean"
        } else if (
            column.type === "nvarchar" ||
            column.type === "national varchar"
        ) {
            return "text"
        } else if (column.type === "nchar" || column.type === "national char") {
            return "text"
        } else {
            return (column.type as string) || ""
        }
    }
	
}
