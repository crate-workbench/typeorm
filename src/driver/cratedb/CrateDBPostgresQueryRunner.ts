import { ObjectLiteral } from "../../common/ObjectLiteral"
import { TypeORMError } from "../../error"
import { QueryFailedError } from "../../error/QueryFailedError"
import { QueryRunnerAlreadyReleasedError } from "../../error/QueryRunnerAlreadyReleasedError"
import { TransactionNotStartedError } from "../../error/TransactionNotStartedError"
import { ReadStream } from "../../platform/PlatformTools"
import { BaseQueryRunner } from "../../query-runner/BaseQueryRunner"
import { QueryResult } from "../../query-runner/QueryResult"
import { QueryRunner } from "../../query-runner/QueryRunner"
import { TableIndexOptions } from "../../schema-builder/options/TableIndexOptions"
import { Table } from "../../schema-builder/table/Table"
import { TableCheck } from "../../schema-builder/table/TableCheck"
import { TableColumn } from "../../schema-builder/table/TableColumn"
import { TableExclusion } from "../../schema-builder/table/TableExclusion"
import { TableForeignKey } from "../../schema-builder/table/TableForeignKey"
import { TableIndex } from "../../schema-builder/table/TableIndex"
import { TableUnique } from "../../schema-builder/table/TableUnique"
import { View } from "../../schema-builder/view/View"
import { Broadcaster } from "../../subscriber/Broadcaster"
import { InstanceChecker } from "../../util/InstanceChecker"
import { OrmUtils } from "../../util/OrmUtils"
import { VersionUtils } from "../../util/VersionUtils"
import { Query } from "../Query"
import { ColumnType } from "../types/ColumnTypes"
import { IsolationLevel } from "../types/IsolationLevel"
import { MetadataTableType } from "../types/MetadataTableType"
import { ReplicationMode } from "../types/ReplicationMode"
import { PostgresDriver } from "./PostgresDriver"

export class CrateDBPostgresQueryRunner extends PostgresQueryRunner implements QueryRunner {

}   /**
     * Builds a query for create column.
     */
    protected buildCreateColumnSql(table: Table, column: TableColumn) {
        let c = '"' + column.name + '"'
        if (
            column.isGenerated === true &&
            column.generationStrategy !== "uuid"
        ) {
            if (column.generationStrategy === "identity") {
                // Postgres 10+ Identity generated column
                const generatedIdentityOrDefault =
                    column.generatedIdentity || "BY DEFAULT"
                c += ` ${column.type} GENERATED ${generatedIdentityOrDefault} AS IDENTITY`
            } else {
                // classic SERIAL primary column
                if (
                    column.type === "integer" ||
                    column.type === "int" ||
                    column.type === "int4"
                )
                    c += " SERIAL"
                if (column.type === "smallint" || column.type === "int2")
                    c += " SMALLSERIAL"
                if (column.type === "bigint" || column.type === "int8")
                    c += " BIGSERIAL"
            }
        }
        if (column.type === "enum" || column.type === "simple-enum") {
            c += " " + this.buildEnumName(table, column)
            if (column.isArray) c += " array"
        } else if (!column.isGenerated || column.type === "uuid") {
            c += " " + this.connection.driver.createFullType(column)
        }

        // Postgres only supports the stored generated column type
        if (column.generatedType === "STORED" && column.asExpression) {
            c += ` GENERATED ALWAYS AS (${column.asExpression}) STORED`
        }

        if (column.charset) c += ' CHARACTER SET "' + column.charset + '"'
        if (column.collation) c += ' COLLATE "' + column.collation + '"'
        if (column.isNullable !== true) c += " NOT NULL"
        if (column.default !== undefined && column.default !== null)
            c += " DEFAULT " + column.default
        if (
            column.isGenerated &&
            column.generationStrategy === "uuid" &&
            !column.default
        )
            c += ` TEXT DEFAULT ${this.driver.uuidGenerator}`

        return c
    }
    
}
