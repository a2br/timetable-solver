import { uniqueId } from ".";

export interface entity {
	id: uniqueId;
	name: string;
	tags: string[];
}
