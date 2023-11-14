# Overwriting rules

This document describes the rules for overwriting data on the server.


The schedules of completed experiments should remain unaltered to maintain their consistency. 
Schedule processing rules are as follows:

* on the server, there is a consistent schedule version for each user,
* if a \texttt{schedule.json} file is sent to the server with a user who does not exist there yet,
it will be automatically created,
* an attempt to alter an experiment that has already occurred (in the past) will be ignored,
and no experiment descriptions with a date earlier than the current server date will be modified,
* modifying an experiment scheduled to take place within the next 72 hours will be dismissed,
* if the \texttt{schedule.json} data includes new experiments, with start dates exceeding the 
server's current date +72 hours, they will be added (if no existing entries are present) 
or overwritten (if existing entries already exist),
* it is assumed that the first json will not have past dates.

## Example of overwriting case

The file `schedule_xxx.json` will be merged on the server side. It will be available in a unified form. 
Let's assume we have documents with "schedule" sections as below:

* [schedule_XXX_v0.json](json-overwriting-examples/schedule_XXX_00.json):
  * "start": 2021-12-**01**T00:00:00, "end" 2021-12-01T23:59:59, "video": v0
  * "start": 2021-12-**02**T00:00:00, "end" 2021-12-02T23:59:59, "video": v1
  * "start": 2021-12-**03**T00:00:00, "end" 2021-12-03T23:59:59, "video": v2
  * "start": 2021-12-**04**T00:00:00, "end" 2021-12-04T23:59:59, "video": v3
  * "start": 2021-12-**05**T00:00:00, "end" 2021-12-05T23:59:59, "video": v4
  * "start": 2021-12-**06**T00:00:00, "end" 2021-12-06T23:59:59, "video": v5
* [schedule_XXX_v1.json](json-overwriting-examples/schedule_XXX_01.json):
  * "start": 2021-12-**03**T00:00:00, "end" 2021-12-03T23:59:59, "video": v6
  * "start": 2021-12-**04**T00:00:00, "end" 2021-12-04T23:59:59, "video": v7
  * "start": 2021-12-**05**T00:00:00, "end" 2021-12-05T23:59:59, "video": v8
  * "start": 2021-12-**07**T00:00:00, "end" 2021-12-07T23:59:59, "video": v10

At **2021.11.30** 11:11:11, the document `schedule_XXX_v00.json` was uploaded (via API), 
and on the server, it is merged into the document `schedule.json` with the following content:

* schedule.json:
  * "start": 2021-12-**01**T00:00:00, "end" 2021-12-01T23:59:59, "video": v0
  * "start": 2021-12-**02**T00:00:00, "end" 2021-12-02T23:59:59, "video": v1
  * "start": 2021-12-**03**T00:00:00, "end" 2021-12-03T23:59:59, "video": v2
  * "start": 2021-12-**04**T00:00:00, "end" 2021-12-04T23:59:59, "video": v3
  * "start": 2021-12-**05**T00:00:00, "end" 2021-12-05T23:59:59, "video": v4
  * "start": 2021-12-**06**T00:00:00, "end" 2021-12-06T23:59:59, "video": v5

At **2021-12-03** 11:11:11, the document `schedule_XXX_v01.json` was uploaded (via API), 
and on the server, it is merged into the document `schedule.json` with content:

* [schedule.json](json-overwriting-examples/schedule.json):
  * "start": 2021-12-**01**T00:00:00, "end" 2021-12-01T23:59:59, "video": v0
  * "start": 2021-12-**02**T00:00:00, "end" 2021-12-02T23:59:59, "video": v1
  * "start": 2021-12-**03**T00:00:00, "end" 2021-12-03T23:59:59, "video": v2
  * "start": 2021-12-**04**T00:00:00, "end" 2021-12-04T23:59:59, "video": v3
  * "start": 2021-12-**05**T00:00:00, "end" 2021-12-05T23:59:59, "video": v8
  * "start": 2021-12-**06**T00:00:00, "end" 2021-12-06T23:59:59, "video": v5
  * "start": 2021-12-**07**T00:00:00, "end" 2021-12-07T23:59:59, "video": v10

Content of schedule.json document:

* "start": 2021-12-**01**T00:00:00, "end" 2021-12-01T23:59:59, "video": v0 **ignored** the experiment has already taken place, it cannot be changed
* "start": 2021-12-**02**T00:00:00, "end" 2021-12-02T23:59:59, "video": v1 **ignored** the experiment has already taken place, it cannot be changed
* "start": 2021-12-**03**T00:00:00, "end" 2021-12-03T23:59:59, "video": v2 **ignored** the experiment is in progress, maybe it has taken place
* "start": 2021-12-**04**T00:00:00, "end" 2021-12-04T23:59:59, "video": v3 **ignored** it may have taken place due to the time difference between the server and the client
* "start": 2021-12-**05**T00:00:00, "end" 2021-12-05T23:59:59, "video": v8 **overwrite** the experiment has not taken place yet, it can be safely overwritten
* "start": 2021-12-**06**T00:00:00, "end" 2021-12-06T23:59:59, "video": v5 **remains** the original from v0 file, there is no corresponding date in v1
* "start": 2021-12-**07**T00:00:00, "end" 2021-12-07T23:59:59, "video": v10 **append**
