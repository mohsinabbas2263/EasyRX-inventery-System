import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Permission } from './permission.entity';

@Entity('user_permissions')
@Index(['userId', 'permissionId'], { unique: true })
export class UserPermission {
    @PrimaryGeneratedColumn('uuid', { name: 'user_permission_id' })
    userPermissionId!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @Column({ name: 'permission_id', type: 'uuid' })
    permissionId!: string;

    @Column({ name: 'branch_id', type: 'uuid', nullable: true })
    branchId?: string; // Optional: restrict permission to a specific branch

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Permission)
    @JoinColumn({ name: 'permission_id' })
    permission!: Permission;
}
