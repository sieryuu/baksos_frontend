interface UserPermissionType {
    user: UserType;
    permissions: string[];
}

interface GroupType {
    id: number;
    name: string;
}

interface UserType {
    id: number;
    is_superuser: true;
    username: "admin";
    first_name: "";
    last_name: "";
    email: "admin@admin.com";
    is_staff: true;
    is_active: true;
    groups: GroupType[];
}