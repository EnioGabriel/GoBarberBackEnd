import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export default class AddUserIdToAppointments1625963304728
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "user_id",
        type: "uuid",
        isNullable: true, // pra caso o prestador nao use mais o app e nao apague todos os logs de quem foi atendido por ele
      })
    );

    await queryRunner.createForeignKey(
      "appointments",
      new TableForeignKey({
        name: "AppointmentUser",
        columnNames: ["user_id"], // Coluna que irá receber a chave estrangeira
        referencedColumnNames: ["id"], // Nome da coluna da tabela de usuarios que vai representar 'user_id'
        referencedTableName: "users", // Tabela que vai fazer referencia
        onDelete: "SET NULL", // O que acontece caso usuario seja deletado
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Desfazer item por item na ordem reversa
    await queryRunner.dropForeignKey("appointments", "AppointmentProvider");
    await queryRunner.dropColumn("appointments", "user_id");
  }
}
