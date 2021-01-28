import { uniqueId, event } from "./";

export interface classObject {
	id: uniqueId;
	name: string;
	timetable: event[];
}
