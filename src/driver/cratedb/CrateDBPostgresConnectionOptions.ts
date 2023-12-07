import { PostgresConnectionOptions } from "../postgres/PostgresConnectionOptions";


interface PostgresWrapper extends PostgresConnectionOptions {
    readonly type: any;
}

/**
 * CrateDB-specific connection options.
 */
export interface CrateDBPostgresConnectionOptions extends PostgresWrapper {
    /**
     * Database type.
     */
    readonly type: "cratedb-postgres"
}
