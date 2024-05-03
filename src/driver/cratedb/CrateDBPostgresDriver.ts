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
        if (column.type === "uuid") {
            return "text"
        } else {
            return (column.type as string) || ""
        }
    }
	
}
