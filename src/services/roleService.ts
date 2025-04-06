import Role from "../schemas/Role";
import { IRole, IRoleDocument } from "../types/role";

export class RoleService {
  async getAllRoles() {
    return Role.find({ isdeleted: false });
  }
  async createRole(roleData: IRole): Promise<IRoleDocument> {
    try {
      const newRole = new Role(roleData);
      return newRole.save();
    } catch (error) {
      throw new Error(`Error creating user: ${(error as Error).message}`);
    }
  }
}

export const CreateARole = async (name: string) => {
  let newRole = new Role({
    name: name,
  });
  return await newRole.save();
};

export default new RoleService();
