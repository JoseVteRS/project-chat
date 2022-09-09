import { instanceToPlain } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'create_at',
  })
  public createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  public updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
