import { uniqueId } from "./";

export interface event {
	/**
	 * @description Must be unique
	 */
	id: uniqueId;
	/**
	 * @description Used to be identified by hoomans
	 */
	name: string;
	// /**
	//  * @description Used to compare times
	//  * @example 8h
	//  */
	// time: unknown;
	/**
	 * @description Whether it can be moved
	 */
	fixed?: boolean;
	/**
	 * @description Is it an empty event ? (not a course, obviously)
	 */
	empty?: boolean;
	/**
	 * @description Unique ID of the teacher
	 */
	teacherId?: uniqueId;
	missingTeacher?: boolean;
	/**
	 * @description Unique ID of the class
	 */
	classId?: uniqueId;
}
