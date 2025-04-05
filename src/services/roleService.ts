import roleSchema from "../schemas/Role";

export const GetAllRoles = async () => {
  return await roleSchema.find({});
};

export const CreateARole = async (name: string) => {
  let newRole = new roleSchema({
    name: name,
  });
  return await newRole.save();
};
