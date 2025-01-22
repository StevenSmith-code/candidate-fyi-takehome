// pages/api/schedules.ts
import { faker } from "@faker-js/faker";
import { NextApiRequest, NextApiResponse } from "next";

const interviewNames = [
  "Technical Interview",
  "Behavioral Interview",
  "System Design Interview",
  "Coding Interview",
  "Managerial Round",
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  faker.seed(123);
  const generateInterviewer = (id: number) => ({
    name: faker.person.fullName(),
    id: id.toString(),
  });

  const roundToNearest15 = (date: Date) => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    date.setMinutes(roundedMinutes, 0, 0);
    return date;
  };

  const generateInterview = (
    id: number,
    baseStartTime: Date,
    previousEndTime: Date
  ) => {
    const duration = faker.helpers.arrayElement([15, 30, 45, 60]);
    const startTime = new Date(previousEndTime);
    startTime.setMinutes(
      startTime.getMinutes() + faker.helpers.arrayElement([15, 30])
    ); // Add a gap of 15-30 minutes
    const roundedStartTime = roundToNearest15(startTime);

    const endTime = new Date(roundedStartTime);
    endTime.setMinutes(roundedStartTime.getMinutes() + duration);

    const interviewerCount = faker.number.int({ min: 2, max: 5 });
    const interviewers = Array.from({ length: interviewerCount }, (_, idx) =>
      generateInterviewer(idx + 1)
    );

    return {
      id: id.toString(),
      interviewName: faker.helpers.arrayElement(interviewNames),
      interviewers,
      startTime: roundedStartTime.toISOString(),
      endTime: endTime.toISOString(),
    };
  };

  const generateSchedule = () => {
    const interviewCount = faker.number.int({ min: 2, max: 5 });
    const baseStartTime = roundToNearest15(faker.date.soon({ days: 14 })); // Generate dates within the next 2 weeks

    let previousEndTime = new Date(baseStartTime);
    const interviews = Array.from({ length: interviewCount }, (_, idx) => {
      const interview = generateInterview(
        idx + 1,
        baseStartTime,
        previousEndTime
      );
      previousEndTime = new Date(interview.endTime);
      return interview;
    });

    return {
      interviewCount,
      scheduleName: "Interview Superday",
      interviews,
    };
  };

  const schedules = Array.from(
    { length: faker.number.int({ min: 5, max: 10 }) },
    () => generateSchedule()
  );

  const response = {
    count: schedules.length,
    results: schedules,
  };

  res.status(200).json(response);
}