import {
  Column,
  MigrationInterface,
  QueryRunner,
  QueryRunnerAlreadyReleasedError,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export default class AlterProviderFieldToProviderId1623199918409
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("appointments", "provider"); // 1° param tabela para ser deletada; 2° coluna que vai ser deletada

    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "provider_id",
        type: "uuid",
        isNullable: true, // pra caso o prestador nao use mais o app e nao apague todos os logs de quem foi atendido por ele
      })
    );

    await queryRunner.createForeignKey(
      "appointments",
      new TableForeignKey({
        name: "AppointmentProvider",
        columnNames: ["provider_id"], // Coluna que irá receber a chave estrangeira
        referencedColumnNames: ["id"], // Nome da coluna da tabela de usuarios que vai representar 'provider_id'
        referencedTableName: "users", // Tabela que vai fazer referencia
        onDelete: "SET NULL", // O que acontece caso usuario seja deletado
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Desfazer item por item na ordem reversa
    await queryRunner.dropForeignKey("appointments", "AppointmentProvider");

    await queryRunner.dropColumn("appointments", "provider_id");

    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "provider",
        type: "varchar",
      })
    );
  }
}
