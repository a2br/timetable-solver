import { uniqueId, event } from "./";

export interface teacherObject {
	id: uniqueId;
	name: string;
	timetable: event[];
}
