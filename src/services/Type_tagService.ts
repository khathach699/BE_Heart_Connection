import TypeTag from "../schemas/Type_tag";
import { ITypeTag, ITypeTagDocument } from "../types/Type_tag";

export class TypeTagService {
    async getAllTypeTag(page: number = 1, limit: number = 10, isAccepted?: boolean) {
        try {
            const options = {
                page,
                limit,
                sort: { createdAt: -1 },
            };
            const query: any = { isdeleted: false };
            const result = await TypeTag.paginate(query, options);
            return {
                typetags: result.docs,
                total: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
            };
        } catch (error) {
            throw new Error(`Error fetching type tag: ${(error as Error).message}`);
        }
    }
    async getTypeTagById(typetag_id: string): Promise<ITypeTagDocument> {
        try {
            const typetag = await TypeTag.findOne({ _id: typetag_id, isdeleted: false });
            if (!typetag) throw new Error("Type tag not found");
            return typetag;
        } catch (error) {
            throw new Error(`Error fetching type tag: ${(error as Error).message}`);
        }
    }
    async createTypeTag(typetagData: ITypeTag): Promise<ITypeTagDocument> {
        try {
            const newtypetag = new TypeTag(typetagData);
            const existingtypetag = await TypeTag.findOne({ name: typetagData.name });
            if (existingtypetag) throw new Error("Type tag already exists");
            return await newtypetag.save();
        } catch (error) {
            throw new Error(`Error creating type tag: ${(error as Error).message}`);
        }
    }
    async updateTypeTag(id: string, typeTagData: Partial<ITypeTag>): Promise<ITypeTagDocument> {
        try {
            const typeTag = await TypeTag.findOneAndUpdate(
                { _id: id, isdeleted: false },
                typeTagData,
                { new: true }
            );
            if (!typeTag) throw new Error("type tag not found");
            return typeTag;
        } catch (error) {
            throw new Error(`Error updating type tag: ${(error as Error).message}`);
        }
    }
     async deleteTypeTag(id: string): Promise<ITypeTagDocument> {
        try {
            const typeTag = await TypeTag.findOneAndUpdate(
                { _id: id, isdeleted: false },
                { isdeleted: true },
                { new: true }
            );
            if (!typeTag) throw new Error("type tag not found");
            return typeTag;
        } catch (error) {
            throw new Error(`Error deleting type tag: ${(error as Error).message}`);
        }
    }
}

export default new TypeTagService();