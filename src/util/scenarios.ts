import { teacherObject, classObject, uniqueId, scenario } from "../types";
import { evalEntitySatisfaction, evalSatisfaction } from "./satisfaction";
import {
	getFirstEvent,
	getLastEvent,
	canBeSwapped,
	swapEventsDeeply,
} from "./timetable";

export function findScenarios(
	teachers: teacherObject[],
	classes: classObject[],
	missingTeachers: uniqueId[],
	maxDepth = 10,
	depth = 1
): scenario[] {
	if (depth > maxDepth) return [];
	let scenarios: scenario[] = [];
	classes = classes.map((c) => {
		const emptySpots = c.timetable.filter(
			(v) => v.teacherId && missingTeachers.includes(v.teacherId)
		);
		if (emptySpots === []) return c;
		emptySpots.forEach((spot) => {
			const firstCourseOfTheDay = getFirstEvent(c.timetable);
			const lastCourseOfTheDay = getLastEvent(c.timetable);
			const fTeacher = teachers.find((t) => t.id === firstCourseOfTheDay.id);
			const lTeacher = teachers.find((t) => t.id === lastCourseOfTheDay.id);

			if (
				c.timetable.indexOf(spot) <= c.timetable.indexOf(firstCourseOfTheDay) ||
				c.timetable.indexOf(spot) >= c.timetable.indexOf(lastCourseOfTheDay)
			) {
				return;
			} else if (
				c.timetable.slice(c.timetable.indexOf(spot) + 1).filter((e) => !e.empty)
					.length === 1 &&
				lTeacher
			) {
				[c.timetable, lTeacher.timetable] = swapEventsDeeply(
					spot,
					lastCourseOfTheDay,
					c.timetable,
					lTeacher
				);
			} else if (
				fTeacher &&
				canBeSwapped(spot, firstCourseOfTheDay, c.timetable, fTeacher)
			) {
				[c.timetable, fTeacher.timetable] = swapEventsDeeply(
					spot,
					firstCourseOfTheDay,
					c.timetable,
					fTeacher
				);
			} else if (
				lTeacher &&
				canBeSwapped(spot, lastCourseOfTheDay, c.timetable, lTeacher)
			) {
				[c.timetable, lTeacher.timetable] = swapEventsDeeply(
					spot,
					lastCourseOfTheDay,
					c.timetable,
					lTeacher
				);
			}
		});
		return c;
	});
	const [globalSum, globalAvg] = evalEntitySatisfaction([
		...teachers,
		...classes,
	]);
	const [teachersSum, teachersAvg] = evalEntitySatisfaction(teachers);
	const [classesSum, classesAvg] = evalEntitySatisfaction(teachers);

	// Convert data to scenario
	const scenario: scenario = {
		globalSatisfaction: {
			sum: globalSum,
			avg: globalAvg,
		},
		classesSatisfaction: {
			sum: classesSum,
			avg: classesAvg,
		},
		teachersSatisfaction: {
			sum: teachersSum,
			avg: teachersAvg,
		},
		classes: classes.map(({ id, name, timetable }) => ({
			classSatisfaction: evalSatisfaction(timetable),
			id,
			name,
			timetable,
		})),
		teachers: teachers.map(({ id, name, timetable }) => ({
			teacherSatisfaction: evalSatisfaction(timetable),
			id,
			name,
			timetable,
		})),
	};
	scenarios = [
		scenario,
		...findScenarios(teachers, classes, missingTeachers, maxDepth, depth + 1),
	].sort((a, b) => a.globalSatisfaction.sum - b.globalSatisfaction.sum);
	return scenarios;
}
