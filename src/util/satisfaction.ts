import { classObject, event, teacherObject } from "../types";

export function evalSatisfaction(timetable: event[]): number {
	let satis = 100;
	if (timetable === []) return satis;
	satis += getTrimSatis(timetable);
	return satis;
}

export function getTrimSatis(timetable: event[]): number {
	let satis = 0;
	const NotEmpty = {};
	// First hours of the day
	try {
		timetable.forEach((e) => {
			if (!e.empty) throw NotEmpty;
			satis += 20;
		});
	} catch (err) {
		if (err !== NotEmpty) throw Error;
	}
	// Last hours of the day
	try {
		timetable.forEach((e, i, a) => {
			const l = a[a.length - 1 - i];
			if (!l.empty) throw NotEmpty;
			satis += 10;
		});
	} catch (err) {
		if (err !== NotEmpty) throw Error;
	}
	return satis;
}

export function evalGlobalSatisfaction(
	teachers: teacherObject[],
	classes: classObject[],
	options: {
		teacherWeight: number;
		classesWeight: number;
	} = { teacherWeight: 1, classesWeight: 1 }
): number {
	let { teacherWeight, classesWeight } = options;
	let globalSatis = 0;
	teachers.forEach(
		(t) => (globalSatis += evalSatisfaction(t.timetable) * teacherWeight)
	);
	classes.forEach(
		(c) => (globalSatis += evalSatisfaction(c.timetable) * classesWeight)
	);
	return globalSatis;
}
