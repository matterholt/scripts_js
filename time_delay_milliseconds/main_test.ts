import { assertEquals } from "@std/assert";
import { calculateDelay,formatTimeDate, timeFromMilliseconds, isTimeInRange ,convertTimeToMinutes ,toMilliseconds } from "./main.ts";




Deno.test(function isTimeInRange_base () {
  const timeStart = convertTimeToMinutes ("12:00:00")
  const timeEnd = convertTimeToMinutes ("01:00:00")

  const result = isTimeInRange(convertTimeToMinutes ("01:00:00"),timeStart,timeEnd)
  assertEquals(result, false);

  assertEquals(isTimeInRange(convertTimeToMinutes ("10:00:00"),timeStart,timeEnd), false);
  assertEquals(isTimeInRange(convertTimeToMinutes ("12:30:00"),timeStart,timeEnd), true);
});

Deno.test(function MainTimeFormat_AM () {
  const testDate = new Date()
  testDate.setHours(1,30,35)
  assertEquals(formatTimeDate(testDate),"01:30:35");
});

Deno.test(function MainTimeFormat_PM () {
  const testDate = new Date()
testDate.setHours(17,56,53)
  assertEquals(formatTimeDate(testDate),"17:56:53");
});



Deno.test(function futureTime_AM(){
  const mills =  3600000
  const testDate = "10:10:10"
 assertEquals(
   timeFromMilliseconds (testDate,mills),"11:10:10"
 )

 assertEquals(
   timeFromMilliseconds (testDate,mills*4),"14:10:10"
 )
})


Deno.test(function baseCase_beforeStart() {
  assertEquals(
    calculateDelay("10:00", { start: "11:00", end: "13:00" }),
    3600000,
  );
  assertEquals(
    calculateDelay("10:55", { start: "11:00", end: "13:00" }),
    299988,
  );
});

Deno.test(function last_hour() {
  assertEquals(
    calculateDelay("0:00", { start: "11:00", end: "13:00" }),
    39600000,
  );
  assertEquals(
    calculateDelay("23:30", { start: "11:00", end: "13:00" }),
    41400000,
  );
});

Deno.test(function baseCase_inRange() {
  assertEquals(
    calculateDelay("12:00", { start: "11:00", end: "13:00" }),
    3600000,
  );
  assertEquals(
    calculateDelay("12:55", { start: "11:00", end: "13:00" }),
    299988,
  );
});

Deno.test(function baseCase_afterEnd() {
  assertEquals(
    calculateDelay("14:00", { start: "11:00", end: "13:00" }),
    75600000,
  );
  assertEquals(
    calculateDelay("14:55", { start: "11:00", end: "13:00" }),
    72288000,
  ); // min: 1204.8 , hrs:20.08
});

Deno.test(function baseCaseOverNight_afterEnd() {
  assertEquals(
    calculateDelay("20:00", { start: "15:00", end: "5:00" }),
    32400000,
  );
});

const PM_timeToActivate = { start: "17:00", end: "6:00" };

Deno.test(function jiraMatch_beforeStart() {
  assertEquals(calculateDelay("14:00", PM_timeToActivate), 10800000); //
});

Deno.test(function jiraMatch_inRange() {
  assertEquals(calculateDelay("19:30", PM_timeToActivate), 39600000 - 1800000); //
});

Deno.test(function jiraMatch_afterEnd() {
  assertEquals(calculateDelay("7:50", PM_timeToActivate), 330012001); //
});

Deno.test(function jiraMatch_afterEnd() {
  assertEquals(calculateDelay("6:00", PM_timeToActivate), 330012001); //
});
