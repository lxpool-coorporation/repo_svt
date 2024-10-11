import { Sequelize, QueryTypes } from 'sequelize'; // Importa QueryTypes da Sequelize

import * as fs from 'fs';
import database from '../utils/database';

const sequelize: Sequelize = database.getInstance();

async function generatePlantUML() {
  try {
    // Ottieni tutte le tabelle dal database
    const tables: string[] = (await sequelize
      .getQueryInterface()
      .showAllTables()) as string[];

    let umlDiagram = '@startuml\n';

    // Aggiungi le classi (tabelle)
    for (const table of tables) {
      umlDiagram += `class ${table} {\n`;
      const fields = await sequelize.getQueryInterface().describeTable(table);
      for (const field of Object.keys(fields)) {
        umlDiagram += `  + ${field}: ${fields[field].type}\n`;
      }
      umlDiagram += '}\n';
    }

    // Ottieni le relazioni (foreign keys) dal database
    const relations = await sequelize.query(
      `
      SELECT
        table_name AS tableName,
        column_name AS columnName,
        referenced_table_name AS referencedTableName,
        referenced_column_name AS referencedColumnName
      FROM
        information_schema.key_column_usage
      WHERE
        referenced_table_name IS NOT NULL
        AND table_schema = 'svt-db';
    `,
      { type: QueryTypes.SELECT },
    );

    // Aggiungi le relazioni al diagramma UML
    relations.forEach((relation: any) => {
      umlDiagram += `${relation.tableName} --> ${relation.referencedTableName} : FK ${relation.columnName} to ${relation.referencedColumnName}\n`;
    });

    umlDiagram += '@enduml';

    // Scrivi il diagramma UML nel file
    fs.writeFileSync('diagram.puml', umlDiagram);
  } catch (_err) {
  } finally {
    await sequelize.close(); // Chiudi la connessione al database
  }
}

generatePlantUML();
