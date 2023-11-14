# Longterm Backend 

Testing data for various scenarios.

* `excel_templates` working nad corrupted excel documents for flag `--excel_time=..'    
* `long_multiuser_stresstest` 50+ users, each 30+ days - test server performance
  * UserName: Long_0XX,Stress_test,1234567,current_date+5*idx,+35days 
* `schedule_overwriting` test schedule overwriting
  * UserName: Jan,Schedule_overwriting_test1,1234567,current_date-2days,current_date+4days
* `fake_schedule_vXX` various uploading scenarios: jsons + videos (all fakes)
* `video_schedule_v01` real schedule generated from "now" with videos (uploaded from gdrive)
  * schedule_simple UserName: simple,surname,123456 
  * schedule_service UserName: service,surname,+48 123456 
* `test_external_id` calculate or use external_id test, external_id hes highest priority

# Development [REMOVE it later]
Upload "scripts" from branch "client": `git restore --source client scripts/` without staging. Directory 'scripts/' will be untracked.
Branch `client` have to be locally available.
If not working, execute `git checkout client` before `git restore...`.

# Testing cases:
Manual procedures for testing server/frontend
* [x] server side:
  * [x] **schedule_overwriting**: [schedule_overwriting](../doc/README_overwriting_rules.md) test if overwriting works correctly
* [ ] mobile app side: 
  * [ ] **no existing user**: eg. upload [video_schedule_v01](../client_tests/video_schedule_v01) install mobile app and test what happened if you login to wrong user (frontend should forbid it)
  * [ ] **no existing video file** [TBD](https://) upload schedule with wrong video file name, mobile app should log/show (?) error


# TODO:
* only `test_external_id` and `fake_schedule_v01` have correct jsons (with new responses), update others (!!!)