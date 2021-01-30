import { uniqueId } from "./";

export interface superEvent {
	id: uniqueId;
	name: string;
	time: number;
	length: number;
	empty?: boolean;
	fixed?: boolean;
	classId?: uniqueId;
	teacherId?: uniqueId;
}

export type timetable = superEvent[];
