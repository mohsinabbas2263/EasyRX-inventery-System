import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user_permissions')
export class UserPermission {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'user_id', type: 'bigint' })
    userId: number;

    @Column({ name: 'permission_code' })
    permissionCode: string;

    @Column({ name: 'granted_by', type: 'bigint', nullable: true })
    grantedBy: number | null;

    @CreateDateColumn({ name: 'granted_at' })
    grantedAt: Date;
}
