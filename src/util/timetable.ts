import { event, teacherObject } from "../types";

export function getFirstEvent(timetable: event[]): event {
	const newT = timetable.filter((v) => !v.empty);
	return newT[0];
}

export function getLastEvent(timetable: event[]): event {
	const newT = timetable.filter((v) => !v.empty);
	return newT[newT.length - 1];
}

export function canBeSwapped(
	blankSpot: event,
	actualCourse: event,
	timetable: event[],
	teacher: teacherObject
): boolean {
	const whatTheTeachersDoing = teacher.timetable[timetable.indexOf(blankSpot)];
	const teacherAvailable = whatTheTeachersDoing.empty || false;
	return teacherAvailable && !actualCourse.fixed;
}

export function swapEvents(a: event, b: event, array: event[]): event[] {
	const newArray = [...array];
	const aIndex = array.indexOf(a);
	const bIndex = array.indexOf(b);
	newArray[aIndex] = b;
	newArray[bIndex] = a;
	return newArray;
}

export function swapEventsDeeply(
	blankSpot: event,
	actualCourse: event,
	timetable: event[],
	teacher: teacherObject
): [classTimetable: event[], teacherTimetable: event[]] {
	timetable = swapEvents(blankSpot, actualCourse, timetable);
	teacher.timetable = swapEvents(
		teacher.timetable[timetable.indexOf(actualCourse)],
		teacher.timetable[timetable.indexOf(blankSpot)],
		teacher.timetable
	);
	return [timetable, teacher.timetable];
}

export function trimEmpty(timetable: event[]): event[] {
	const trimed = timetable.filter((e, i, a) => {
		const previous = a[i - 1];
		const next = a[i + 1];
		// If it isn't empty, don't touch it.
		if (!e.empty) return true;
		// It's definitely empty.
		// If there's no previous/following event
		if (!previous || !next) return false;
		// Check if every previous/following event is empty
		const elemsBefore = a.splice(0, i);
		const elemsAfter = a.splice(i + 1, a.length);
		const elemsBeforeAreEmpty = elemsBefore.every((e) => !!e.empty);
		const elemsAfterAreEmpty = elemsAfter.every((e) => !!e.empty);
		if (elemsBeforeAreEmpty || elemsAfterAreEmpty) return false;
		// Otherwise, that's fine
		return true;
	});
	return trimed;
}
